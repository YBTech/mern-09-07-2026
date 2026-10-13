import { AppError } from "../errors";
import type { Book } from "../models/types";

// TICKET-103: implement per tickets/TICKET-103-low-stock-report.md
export function getLowStockBooks(_threshold: number): Book[] {
  throw new AppError(501, "getLowStockBooks is not implemented yet (TICKET-103)");
}
