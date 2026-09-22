import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

interface Transaction {
  transactionId: string;
  amount: number;
  currency: string;
  userId: string;
  status: "Pending" | "Completed";
}

const DATA_FILE = path.join(__dirname, "../data/transactions.json");

// ========================================================================
// Already wired up for you — read/write the JSON file that backs this API.
function readTransactions(): Transaction[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeTransactions(transactions: Transaction[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(transactions, null, 2));
}
// ========================================================================

const app = express();

app.use(express.json());

app.post("/transactions", (req: Request, res: Response) => {
  // todo:
  throw new Error("not implemented")
});

app.get("/transactions/:transactionId", (req: Request, res: Response) => {
  // todo:
  throw new Error("not implemented")
});

app.put("/transactions/:transactionId", (req: Request, res: Response) => {
  // todo:
  throw new Error("not implemented")
});

app.get("/transactions", (req: Request, res: Response) => {
  // todo:
  throw new Error("not implemented")
});

app.delete("/transactions/:transactionId", (req: Request, res: Response) => {
  // todo:
  throw new Error("not implemented")
});

// Registered last — Express 4 catches a synchronous throw from a route
// handler above and forwards it here automatically.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message ?? "Internal server error" });
});

export default app;
