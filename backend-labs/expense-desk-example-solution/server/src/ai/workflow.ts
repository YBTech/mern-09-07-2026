import { tools } from "../tools";
import type { Claim, ClaimResult, Flag } from "../types";
import { investigateClaim } from "./agent";
import { checkBeforeActing, type Checked } from "./checks";
import { crossCheck, findPaidReceipt, loadEvidence } from "./crosscheck";
import { money } from "./dates";
import { readReceipt } from "./extract";
import { hardChecks, type Rejection } from "./intake";
import { decideByPolicy } from "./policy-engine";
import { raiseFlags, routeClaim } from "./signals";
import { Trace } from "./trace";
import type { ClaimContext, DecisionPathName, Receipt, Verdict } from "./types";
import { writeUp } from "./writeup";

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🛤️ PART 1: THE WORKFLOW. Code decides every step; the model is called only where judgment is needed.
// ════════════════════════════════════════════════════════════════════════════════════════════════
// processClaim only decides. Paying, queueing for review and closing happen afterwards, in the claims module.

export async function processClaim(claimId: string): Promise<ClaimResult> {
  const trace = new Trace();
  const claim = tools.getClaim({ claimId });

  // 1. Hard rules in code: a hit rejects the claim before any model call
  const rejection = await trace.code("1 Intake + hard checks", () => intake(claim), describeIntake);
  if (rejection) return rejectedByRule(rejection, trace);

  // 2. The model reads the receipt (photo or text) and the note into structured data
  const receipt = await trace.model(
    "2 Read the receipt",
    () => readReceipt(claim, trace),
    describeReceipt,
  );

  // 3. Load the employee's records and compare the form with the receipt
  const checks = await trace.code(
    "3 Cross-check",
    () => gatherAndCompare(claim, receipt),
    describeCrossCheck,
  );
  if (checks.duplicate) return rejectedByRule(checks.duplicate, trace);
  const { evidence, discrepancies } = checks;

  // 4. Raise flags; any real flag sends the claim to the agent
  const flags = await trace.code(
    "4 Flag + route",
    () => raiseFlags({ claim, receipt, evidence }, discrepancies),
    describeFlags,
  );
  const ctx: ClaimContext = { claim, receipt, evidence, flags };
  const path = routeClaim(flags);

  // 5. Decide: routine claims by the policy engine, flagged claims by the investigator agent
  const verdict = await decideStage(claimId, ctx, path, trace);

  // 6. Check the proposal before anything happens: safety rules, second opinion, approval gates
  const checked = await trace.code(
    "6 Check before acting",
    () => checkBeforeActing(ctx, verdict, path, trace),
    describeChecks,
  );

  // 7. Write the summary and the emails
  const words = await trace.model(
    "7 Write-up",
    () => writeUpFor(ctx, verdict, checked, trace),
    (w) => w.summary,
  );

  return assembleResult({ ctx, path, verdict, checked, words, trace });
}

// ── What the stages call ────────────────────────────────────────────────

const intake = (claim: Omit<Claim, "status">) =>
  hardChecks(claim, tools.getPastClaims({ employeeId: claim.employeeId }));

async function gatherAndCompare(claim: Omit<Claim, "status">, receipt: Receipt) {
  const evidence = await loadEvidence(claim.employeeId);
  const duplicate = findPaidReceipt(
    receipt,
    evidence.pastClaims,
    evidence.employee.name.split(" ")[0],
  );
  return { evidence, duplicate, discrepancies: crossCheck(claim, receipt) };
}

function decideStage(claimId: string, ctx: ClaimContext, path: DecisionPathName, trace: Trace) {
  const baseline = decideByPolicy(ctx);
  if (path === "workflow") return trace.code("5a Policy engine", () => baseline, describeVerdict);
  return trace.model(
    "5b Investigator agent",
    () => investigateClaim(claimId, ctx, baseline, trace),
    describeVerdict,
  );
}

const writeUpFor = (ctx: ClaimContext, verdict: Verdict, checked: Checked, trace: Trace) =>
  writeUp(
    ctx,
    { decision: checked.decision, verdict, gates: checked.hits, payable: checked.payable },
    trace,
  );

// ── Building the result ─────────────────────────────────────────────────

function rejectedByRule(rejection: Rejection, trace: Trace): ClaimResult {
  return {
    decision: "reject",
    approvedAmount: 0,
    ruleIds: rejection.ruleIds,
    summary: rejection.summary,
    emailToEmployee: rejection.email,
    path: "hard-rule",
    confidence: 1,
    flags: [],
    trace: trace.steps,
  };
}

type Parts = {
  ctx: ClaimContext;
  path: DecisionPathName;
  verdict: Verdict;
  checked: Checked;
  words: Awaited<ReturnType<typeof writeUp>>;
  trace: Trace;
};

function assembleResult({ ctx, path, verdict, checked, words, trace }: Parts): ClaimResult {
  const needsPerson = checked.reviewer !== null;
  return {
    decision: checked.decision,
    approvedAmount:
      checked.decision === "approve" ||
      checked.decision === "partial" ||
      checked.decision === "needs_approval"
        ? checked.payable
        : 0,
    ruleIds: verdict.ruleIds,
    summary: words.summary,
    emailToEmployee: words.email,
    path,
    confidence: verdict.confidence,
    flags: ctx.flags,
    trace: trace.steps,
    review: needsPerson
      ? {
          reviewer: checked.reviewer!,
          reviewerName: checked.reviewer === "manager" ? ctx.evidence.employee.managerName : null,
          gates: checked.hits,
          proposedAmount: checked.payable,
          drafts: { ifApproved: words.ifApproved, ifRejected: words.ifRejected },
        }
      : undefined,
  };
}

// ── One-line descriptions for the run timeline ──────────────────────────

const describeIntake = (r: Rejection | null) =>
  r ? `Rejected: ${r.summary}` : "Passed the hard rules";
const describeReceipt = (r: Receipt) =>
  r.readable
    ? `${r.merchant ?? "Unknown merchant"}, ${r.lineItems.length} lines, total ${r.total === null ? "?" : money(r.total)}`
    : "No readable receipt";
const describeCrossCheck = (r: { duplicate: Rejection | null; discrepancies: Flag[] }) =>
  r.duplicate
    ? `Rejected: ${r.duplicate.summary}`
    : `${r.discrepancies.length} difference(s) between form and receipt`;
const describeFlags = (flags: Flag[]) =>
  flags.length === 0 ? "No flags" : flags.map((f) => f.id).join(", ");
const describeVerdict = (v: Verdict) =>
  `${v.decision} ${money(v.payable)} (confidence ${v.confidence.toFixed(2)})`;
const describeChecks = (c: Checked) =>
  c.hits.length === 0
    ? "No gate fired"
    : `Gates: ${c.hits.map((g) => g.id).join(", ")}${c.opinion ? `; second opinion ${c.opinion.agrees ? "agrees" : "disagrees"}` : ""}`;
