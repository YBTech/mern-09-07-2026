// given — you don't need to touch this. Mounts each resource's router
// under its own base path, same pattern as lecture.

import express from "express";

import { workshopsRouter } from "./workshops/router";
import { attendeesRouter } from "./attendees/router";
import { registrationsRouter } from "./registrations/router";

const app = express();

app.use(express.json());

app.use("/workshops", workshopsRouter);
app.use("/attendees", attendeesRouter);
app.use("/registrations", registrationsRouter);

export default app;
