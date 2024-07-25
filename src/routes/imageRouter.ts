import { Router, Request, Response } from "express";
import imageController from "../controllers/imageController";
import multer from "multer";
const imageRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

imageRouter.get(
  "/",
  imageController.getImages,
  (req: Request, res: Response) => {
    res.send({ images: res.locals.images });
  }
);

imageRouter.post(
  "/",
  upload.array("images"),
  imageController.uploadImages,
  imageController.saveImagesToDb,
  (req: Request, res: Response) => {
    res.send({ response: res.locals.uploadedImages });
  }
);

export default imageRouter;
