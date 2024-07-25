import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import crypto from "crypto";

const imageController = {
  getImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { s3Id } = req.body;

      const image = await sharp(
        __dirname + `/../data/s3Mock/${s3Id}.jpg`
      ).toBuffer();

      res.locals.image = image;
      next();
    } catch (error: any) {
      return next({
        message: {
          err: `'imageController.getImage: ERROR: '${error.message}`,
        },
        log: "Error occured in imageController.getImage",
      });
    }
  },
  resizeImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];

      const uploadedImages: any = [];
      for (let i = 0; i < files.length; i++) {
        const image = files[i];

        // * Mock Saving image to an S3 Bucket
        const newFilePath =
          __dirname + `/../data/s3Mock/${image.originalname}.jpg`;
        const buffer = Buffer.from(image.buffer);
        sharp(buffer).resize(200, 200).toFile(newFilePath);
        // * mock creating a unique id for the image in the s3 bucket
        const s3Id = crypto.randomUUID();
        // * create object with the s3Id
        uploadedImages.push({
          s3Id,
        });
      }

      // * pass the uploadedImages to the next middleware
      res.locals.uploadedImages = uploadedImages;
      next();
    } catch (error: any) {
      return next({
        message: {
          err: `'imageController.resizeImage: ERROR: '${error.message}`,
        },
        log: "Error occured in imageController.resizeImage",
      });
    }
  },
};

export default imageController;
