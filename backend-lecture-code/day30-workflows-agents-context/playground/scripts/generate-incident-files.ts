// Writes the three long incident files used from step 07 on. Deterministic: the same files every run.
// Run once with `npm run generate`; the output in ../incident is committed, so students never need to.
import { mkdirSync, writeFileSync } from "node:fs";

let seed = 30;
function rand() {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const pick = <T>(items: T[]) => items[Math.floor(rand() * items.length)];
const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
const pad = (n: number) => String(n).padStart(2, "0");

// Split a total into n whole-number parts that add up exactly
function split(total: number, n: number) {
  const weights = Array.from({ length: n }, () => 0.5 + rand());
  const sum = weights.reduce((a, b) => a + b, 0);
  const parts = weights.map((w) => Math.floor((w / sum) * total));
  parts[0] += total - parts.reduce((a, b) => a + b, 0);
  return parts;
}

const paragraph = (sentences: string[], n: number) => Array.from({ length: n }, () => pick(sentences)).join(" ");

const ENGINEERING_FILLER = [
  "The release checklist covered unit tests for the audio pipeline, a battery drain test, and a manual pairing test on two reference phones.",
  "Build 2.4.0 passed every automated check, because the automated pairing test used a simulated phone that answers instantly.",
  "Firmware updates roll out in waves, starting with five percent of devices and widening each day if the crash rate stays flat.",
  "The on-call engineer for the connectivity team is paged when the daily disconnect rate rises above its seven-day average.",
  "Telemetry records the firmware version, the phone model family, and the time between the pairing request and the key exchange.",
  "Reports from the community forum were collected into a spreadsheet by the support team and shared with engineering each morning.",
  "The team compared 2.4.0 against 2.3.8 on identical phones and saw no difference on phones released in the last two years.",
  "A rollback was considered, but devices that already updated cannot be downgraded without a cable, so the team chose to ship a forward fix.",
  "The incident commander posted a status update every four hours in the internal channel and in the status page draft.",
  "Review of the pairing module history showed that the key exchange timeout had been shortened in a cleanup change three releases earlier.",
];

const SUPPORT_CUSTOMER = [
  "My Aria 500 keeps disconnecting from my phone every few minutes",
  "Bluetooth drops since the latest update, music cuts out",
  "Headphones connect, then disconnect after about two minutes",
  "Is there a fix for the pairing problem? I updated last week",
  "My earbuds will not stay connected to my laptop either",
  "I want a refund, these cut out constantly",
  "Do I need to send them back or can you fix it remotely?",
  "How long will the fix take? This is the third time today",
  "Where do I find the firmware version number?",
  "The app says update available, should I install it?",
  "What is your return policy for opened headphones?",
  "Can I get a replacement instead of a refund?",
];
const SUPPORT_AGENT = [
  "Thanks for reaching out. We know about the connection drop that came with firmware 2.4.0 and engineering is working on a fix.",
  "I am sorry about that. Please keep the headphones charged and avoid pairing to a second device until the fix is out.",
  "You can find the firmware version in the Lumen app, on the product page, under About.",
  "Opened headphones can be returned within 14 days of delivery, with a 12% restocking fee. I can start that for you if you prefer.",
  "A replacement is possible if the product cannot be fixed. Let us wait for the update first, then I will check again with you.",
  "I have added a note to your case so you do not have to explain it again. We will email you when the new firmware is available.",
];

function engineeringReport() {
  const out: string[] = [];
  out.push("# Post-mortem: Bluetooth pairing drops after firmware 2.4.0 (INC-2026-Q3-011)", "");
  out.push("## Summary", "");
  out.push(
    "Firmware 2.4.0 for the Aria 500 shipped on 28 July 2026. From 1 August, customers reported that Bluetooth connections dropped within minutes of pairing. The incident was declared on 3 August as INC-2026-Q3-011 and closed on 14 August when firmware 2.4.1 finished rolling out. About 41,000 devices ran 2.4.0 at the peak.",
    "",
  );
  out.push("## Detection", "");
  for (let i = 0; i < 6; i++) out.push(paragraph(ENGINEERING_FILLER, 5), "");
  out.push("## Timeline", "");
  for (let i = 0; i < 40; i++) {
    const day = Math.min(28, 1 + Math.floor(i / 3.2));
    out.push(`- 2026-08-${pad(day)} ${pad(int(7, 21))}:${pad(int(0, 59))} ${pick(ENGINEERING_FILLER)}`);
  }
  out.push("", "## Root cause analysis", "");
  out.push(
    "The pairing module waits 200 ms for the phone to finish the key exchange. Phones with slower Bluetooth stacks need between 250 and 400 ms. When the wait expires, the module drops the link and retries, and the retry hits the same limit, so the connection drops again within minutes. The timeout had been shortened from 500 ms to 200 ms in a cleanup change. The root cause was a timing error in the pairing module, not the radio hardware.",
    "",
  );
  for (let i = 0; i < 5; i++) out.push(paragraph(ENGINEERING_FILLER, 5), "");
  out.push("## Mitigation", "");
  for (let i = 0; i < 5; i++) out.push(paragraph(ENGINEERING_FILLER, 5), "");
  out.push("## Fix in firmware 2.4.1", "");
  out.push(
    "Firmware 2.4.1 restores the 500 ms key exchange timeout and retries with backoff. It was released on 14 August 2026. A pairing test against five slow reference phones is now part of every release checklist.",
    "",
  );
  for (let i = 0; i < 4; i++) out.push(paragraph(ENGINEERING_FILLER, 5), "");
  out.push("## Lessons learned", "");
  for (let i = 0; i < 6; i++) out.push(paragraph(ENGINEERING_FILLER, 5), "");
  out.push("## Action items", "", "| # | Action | Owner | Due |", "|---|---|---|---|");
  for (let i = 1; i <= 30; i++) {
    out.push(`| ${i} | ${pick(ENGINEERING_FILLER).slice(0, 70)} | ${pick(["Connectivity", "QA", "Release", "Firmware"])} | 2026-09-${pad(int(1, 28))} |`);
  }
  out.push("", "## Appendix A: pairing service logs", "");
  for (let i = 0; i < 160; i++) {
    const event = pick(["handshake_timeout", "link_dropped", "retry_scheduled", "handshake_ok", "key_exchange_slow"]);
    out.push(`2026-08-${pad(int(1, 14))}T${pad(int(0, 23))}:${pad(int(0, 59))}:${pad(int(0, 59))}Z pairing device=ARIA500-${int(1000, 9999)} fw=2.4.0 event=${event} rtt_ms=${int(80, 520)}`);
  }
  out.push("", "## Appendix B: device telemetry", "", "| device | fw | phone family | disconnects/hour |", "|---|---|---|---|");
  for (let i = 0; i < 80; i++) {
    out.push(`| ARIA500-${int(1000, 9999)} | 2.4.0 | ${pick(["Pixel", "Galaxy", "iPhone", "Xperia"])} ${int(8, 15)} | ${int(0, 14)} |`);
  }
  return out.join("\n");
}

function supportExport() {
  const out: string[] = [];
  out.push("# Support chat export: 1 to 14 August 2026 (INC-2026-Q3-011)", "");
  for (let day = 1; day <= 14; day++) {
    out.push(`## 2026-08-${pad(day)}`, "");
    for (let i = 0; i < 12; i++) {
      out.push(`[${pad(int(8, 20))}:${pad(int(0, 59))}] customer-${int(1000, 9999)}: ${pick(SUPPORT_CUSTOMER)}`);
      out.push(`[${pad(int(8, 20))}:${pad(int(0, 59))}] agent-${int(1, 38)}: ${pick(SUPPORT_AGENT)}`);
    }
    out.push("");
  }
  out.push("## Weekly summary", "");
  out.push(
    "Chat volume normally averages 280 conversations a day. From 4 to 13 August it averaged about 660 a day, so the team handled around 3,800 extra conversations related to INC-2026-Q3-011. Most contacts asked whether a fix was coming; about one in six asked for a return or refund.",
    "",
    "Satisfaction stayed at 4.6 out of 5 for the quarter, but it dipped to 4.1 on 9 and 10 August. Overtime hours were approved for the whole period.",
    "",
  );
  return out.join("\n");
}

function financeMemo() {
  const out: string[] = [];
  const row = (cells: (string | number)[]) => `| ${cells.join(" | ")} |`;
  out.push("# Finance memo: cost of incident INC-2026-Q3-011", "");
  out.push("## Revenue context", "");
  out.push("Quarterly revenue was $15.1 million, 9% above plan. The refund rate stayed below 4%.", "");
  out.push("## Support labor", "", "Overtime and temporary hours by week.", "", row(["Week", "Team", "Hours", "Cost ($)"]), row(["---", "---", "---", "---"]));
  const labor = split(83200, 40);
  labor.forEach((cost, i) => out.push(row([`W${31 + (i % 3)}`, pick(["Chat", "Email", "Phone", "Escalations"]), Math.round(cost / 38), cost.toLocaleString("en-US")])));
  out.push("", "Support labor subtotal: $83,200.", "");
  out.push("## Replacement units", "", row(["Shipment", "SKU", "Units", "Cost ($)"]), row(["---", "---", "---", "---"]));
  const unitsParts = split(700, 35);
  unitsParts.forEach((units, i) => out.push(row([`R-${100 + i}`, "ARIA500", units, (units * 129).toLocaleString("en-US")])));
  out.push("", "Replacement headphones subtotal: 700 units at $129, $90,300.", "");
  out.push("## Shipping and return labels", "", row(["Batch", "Carrier", "Parcels", "Cost ($)"]), row(["---", "---", "---", "---"]));
  const shipping = split(38500, 35);
  shipping.forEach((cost, i) => out.push(row([`S-${200 + i}`, pick(["Ground", "Express", "Postal"]), Math.round(cost / 27), cost.toLocaleString("en-US")])));
  out.push("", "Shipping and return label subtotal: $38,500.", "");
  out.push("## Total incident cost", "");
  out.push("Support labor $83,200 + replacement units $90,300 + shipping and labels $38,500 = $212,000, about 1.4% of quarterly revenue. This is an estimate: some replacement shipments are still in transit.", "");
  out.push("## Other items this quarter", "", row(["Item", "Amount ($)"]), row(["---", "---"]));
  for (let i = 0; i < 60; i++) out.push(row([pick(["Cloud services", "Card processing fees", "Warehouse rent", "Marketing", "Supplier tooling", "Travel"]), int(4000, 190000).toLocaleString("en-US")]));
  out.push("", "## Notes on estimates", "");
  for (let i = 0; i < 8; i++) out.push(paragraph(ENGINEERING_FILLER, 4).replace(/pairing|firmware/gi, "plan"), "");
  return out.join("\n");
}

mkdirSync(new URL("../incident/", import.meta.url), { recursive: true });
for (const [name, text] of [
  ["engineering-postmortem.md", engineeringReport()],
  ["support-chat-export.md", supportExport()],
  ["finance-memo.md", financeMemo()],
] as const) {
  writeFileSync(new URL(`../incident/${name}`, import.meta.url), text + "\n");
  console.log(`${name}: ${text.length.toLocaleString()} characters, about ${Math.round(text.length / 4).toLocaleString()} tokens`);
}
