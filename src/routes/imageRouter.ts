import { Router, Request, Response } from "express";
import imageController from "../controllers/imageController";
import multer from "multer";
const imageRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, dest: "data/uploads/" });

imageRouter.get(
  "/",
  imageController.getImage,
  (req: Request, res: Response) => {
    res.type("jpg").send(res.locals.image);
  }
);

imageRouter.post(
  "/",
  upload.array("images", 2),
  imageController.resizeImage,
  (req: Request, res: Response) => {
    res.send({ response: res.locals.uploadedImages });
  }
);

export default imageRouter;
