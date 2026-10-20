import { Router } from "express";
import { claimsRouter } from "./modules/claims/claims.routes";
import { employeesRouter } from "./modules/employees/employees.routes";
import * as payoutsController from "./modules/payouts/payouts.controller";
import { payoutsRouter } from "./modules/payouts/payouts.routes";
import { resetStore } from "./store";

export const apiRouter = Router();

apiRouter.use("/claims", claimsRouter);
apiRouter.use("/employees", employeesRouter);
apiRouter.use("/payouts", payoutsRouter);

// Demo switch: while on, Finance's API answers with an error
apiRouter.get("/admin/finance-outage", payoutsController.getOutage);
apiRouter.put("/admin/finance-outage", payoutsController.putOutage);

// Put every claim back to "new", drop all results and payments
apiRouter.post("/admin/reset", (_req, res) => {
  resetStore();
  res.status(204).end();
});
