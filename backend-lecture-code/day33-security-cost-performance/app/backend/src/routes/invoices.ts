import { Router } from "express";
import { invoices, type Invoice } from "../db.js";
import { invoice as invoiceDemo, sumLineItems } from "../demos/invoice.js";
import { isMode, sendFailure } from "./util.js";

// The accounts payable demo: CRUD on invoices, "Read with AI", and "Approve payment".
export const router = Router();

// Each invoice also carries what its line items really add up to, so the page can show an audit note
function withTrueTotal(invoice: Invoice) {
  return { ...invoice, true_total: sumLineItems(invoice.body) };
}

router.get("/", (_req, res) => {
  res.json(invoices.list().map(withTrueTotal));
});

router.post("/", (req, res) => {
  const supplier = String(req.body.supplier ?? "").trim();
  const number = String(req.body.number ?? "").trim();
  const body = String(req.body.body ?? "").trim();
  if (!supplier || !number || !body) {
    res.status(400).json({ error: "An invoice needs a supplier, a number and its text" });
    return;
  }
  res.status(201).json(withTrueTotal(invoices.create(supplier, number, body)));
});

router.post("/reset", (_req, res) => {
  invoices.reset();
  res.json(invoices.list().map(withTrueTotal));
});

router.put("/:id", (req, res) => {
  const supplier = String(req.body.supplier ?? "").trim();
  const number = String(req.body.number ?? "").trim();
  const body = String(req.body.body ?? "").trim();
  if (!supplier || !number || !body) {
    res.status(400).json({ error: "An invoice needs a supplier, a number and its text" });
    return;
  }
  const updated = invoices.update(Number(req.params.id), supplier, number, body);
  if (!updated) {
    res.status(404).json({ error: "No such invoice" });
    return;
  }
  res.json(withTrueTotal(updated));
});

router.delete("/:id", (req, res) => {
  const deleted = invoices.remove(Number(req.params.id));
  res.status(deleted ? 200 : 404).json({ deleted });
});

// "Read with AI": POST /api/invoices/2/read/vulnerable  or  /safe
router.post("/:id/read/:mode", async (req, res) => {
  const invoice = invoices.get(Number(req.params.id));
  if (!invoice || !isMode(req.params.mode)) {
    res.status(404).json({ error: "No such invoice or mode" });
    return;
  }

  try {
    const result = await invoiceDemo[req.params.mode]({ invoice: invoice.body });
    const amount = result.data?.amount as number | null;
    const held = result.data?.held === true || amount === null;
    const updated = invoices.setReading(invoice.id, held ? "held" : "ready", amount, result.output);
    res.json({ invoice: withTrueTotal(updated), result });
  } catch (error) {
    sendFailure(res, error);
  }
});

// "Approve payment": only an invoice that has been read (or held, then approved by a person) can be paid
router.post("/:id/pay", (req, res) => {
  const invoice = invoices.get(Number(req.params.id));
  if (!invoice || invoice.amount === null || invoice.status === "new" || invoice.status === "paid") {
    res.status(409).json({ error: "This invoice cannot be paid yet" });
    return;
  }
  res.json(withTrueTotal(invoices.markPaid(invoice.id)));
});
