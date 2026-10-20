import { db } from "./store";

// The receipt photo is not part of any tool (it would flood an agent's context), so the extraction step reads it here.
export function getReceiptImage(claimId: string): string | undefined {
  return db.receiptImages.get(claimId);
}
