import type Anthropic from "@anthropic-ai/sdk";
import { getReceiptImage } from "../receipts";
import type { Claim } from "../types";
import { UNTRUSTED_NOTE, callForced, field } from "./model";
import type { Trace } from "./trace";
import type { ExpenseKind, LineItem, LineKind, Receipt } from "./types";

// Stage 2: the model reads the receipt (photo or text) and the employee's note into a fixed shape.
// Code does all the math afterwards, so the model only has to read and label.

const LINE_KINDS: readonly LineKind[] = [
  "meal",
  "alcohol",
  "lodging",
  "tax",
  "transport",
  "equipment",
  "conference",
  "gift",
  "fee",
  "other",
];
const EXPENSE_KINDS: readonly ExpenseKind[] = [
  "meal",
  "hotel",
  "transport",
  "conference",
  "equipment",
  "gift",
  "other",
];
const PURPOSES = ["travel", "client_hosting", "none"] as const;

const SYSTEM = `You read expense receipts for a finance team. Fill in recordReceipt exactly as the receipt shows; do not calculate or judge.
- Label every line item. Wine, beer, cocktails and spirits are "alcohol"; sparkling water and soft drinks are "meal". Gift cards are "gift".
- "tax" is any tax line. Tips are "fee" unless the receipt folds them into a meal.
- For a hotel, receiptDate is the departure day and nights is the number of nights.
- purpose comes from the employee's note: "client_hosting" only if the note says they hosted or dined with a client (put the client in hostedClient), "travel" if it says they were away on work, otherwise "none".
- If there is no receipt or you cannot read it, set readable to false, total to null and use the note for merchant and expenseKind.
${UNTRUSTED_NOTE}`;

const TOOL: Anthropic.Tool = {
  name: "recordReceipt",
  description: "Record what the receipt and the note say.",
  input_schema: {
    type: "object",
    properties: {
      readable: { type: "boolean" },
      merchant: { type: ["string", "null"] },
      receiptDate: { type: ["string", "null"], description: "YYYY-MM-DD" },
      receiptNumber: {
        type: ["string", "null"],
        description: "receipt, folio, order or confirmation number",
      },
      total: { type: ["number", "null"] },
      lineItems: {
        type: "array",
        items: {
          type: "object",
          properties: {
            description: { type: "string" },
            amount: { type: "number" },
            kind: { type: "string", enum: [...LINE_KINDS] },
          },
          required: ["description", "amount", "kind"],
        },
      },
      guests: { type: ["number", "null"] },
      nights: { type: ["number", "null"] },
      expenseKind: { type: "string", enum: [...EXPENSE_KINDS] },
      purpose: { type: "string", enum: [...PURPOSES] },
      hostedClient: { type: ["string", "null"] },
    },
    required: [
      "readable",
      "merchant",
      "receiptDate",
      "receiptNumber",
      "total",
      "lineItems",
      "expenseKind",
      "purpose",
    ],
  },
};

export function readReceipt(claim: Omit<Claim, "status">, trace: Trace): Promise<Receipt> {
  return callForced({
    system: SYSTEM,
    content: receiptContent(claim),
    tool: TOOL,
    validate: toReceipt,
    trace,
    maxTokens: 2000,
  });
}

// The photo when there is one, otherwise the OCR text, always with the note in its own tag
function receiptContent(claim: Omit<Claim, "status">): Anthropic.ContentBlockParam[] {
  const note = `<employee_note>${claim.note}</employee_note>\nForm: amount ${claim.amount}, date ${claim.expenseDate}, category ${claim.category ?? "not given"}.`;
  const image = parseDataUrl(getReceiptImage(claim.id));
  if (image) return [image, { type: "text", text: note }];
  const text = claim.receiptText.trim() || "(no receipt attached)";
  return [{ type: "text", text: `<receipt>\n${text}\n</receipt>\n${note}` }];
}

function parseDataUrl(dataUrl?: string): Anthropic.ImageBlockParam | null {
  const match = dataUrl?.match(/^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/);
  if (!match) return null;
  return {
    type: "image",
    source: { type: "base64", media_type: match[1] as "image/png", data: match[2] },
  };
}

function toReceipt(input: Record<string, unknown>): Receipt {
  return {
    readable: Boolean(input.readable),
    merchant: field.nullableString(input.merchant, "merchant"),
    receiptDate: field.nullableString(input.receiptDate, "receiptDate"),
    receiptNumber: field.nullableString(input.receiptNumber, "receiptNumber"),
    total: field.nullableNumber(input.total, "total"),
    lineItems: field.array(input.lineItems ?? [], "lineItems").map(toLineItem),
    guests: field.nullableNumber(input.guests, "guests"),
    nights: field.nullableNumber(input.nights, "nights"),
    expenseKind: field.oneOf(input.expenseKind, "expenseKind", EXPENSE_KINDS),
    purpose: field.oneOf(input.purpose, "purpose", PURPOSES),
    hostedClient: field.nullableString(input.hostedClient, "hostedClient"),
  };
}

function toLineItem(raw: unknown): LineItem {
  const item = raw as Record<string, unknown>;
  return {
    description: field.string(item.description, "lineItems.description"),
    amount: field.number(item.amount, "lineItems.amount"),
    kind: field.oneOf(item.kind, "lineItems.kind", LINE_KINDS),
  };
}
