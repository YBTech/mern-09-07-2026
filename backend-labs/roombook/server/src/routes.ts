import { Router } from "express";
import { bookingsRouter } from "./modules/bookings/bookings.routes";
import { roomsRouter } from "./modules/rooms/rooms.routes";
import { usersRouter } from "./modules/users/users.routes";

export const apiRouter = Router();

apiRouter.use("/rooms", roomsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/bookings", bookingsRouter);
