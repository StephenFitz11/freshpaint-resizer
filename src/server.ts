import dotenv from "dotenv";
import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";


// * Import routers
import eventsRouter from "./routes/endpointRouter";
import imageRouter from "./routes/imageRouter";

// * Load environment variables
dotenv.config();

// * Initialize & configure express app
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// * Routes
app.use("/events", eventsRouter);
app.use("/images", imageRouter);

// * Universal error handler
app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const defaultErr = {
      log: "Express error handler caught unknown middleware error",
      status: 400,
      message: { err: "An error occurred" },
    };
    const errorObj = Object.assign(defaultErr, err);
    // res.locals.message = err.message;
    console.log("Error: ", errorObj.log);
    const errorStatus = errorObj.status || 500;
    return res.status(errorStatus).json(errorObj.message);
  }
);
// * Run server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
