import { Router, Request, Response } from "express";
import eventController from "../controllers/eventController";

const eventsRouter = Router();

eventsRouter.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello events endpoint" });
});

eventsRouter.post(
  "/track",
  eventController.trackEvents,
  (req: Request, res: Response) => {
    res.send({ eventsTracked: true });
  }
);

export default eventsRouter;
