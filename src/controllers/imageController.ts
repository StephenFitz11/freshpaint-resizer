import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import crypto from "crypto";
import fs from "fs/promises";

const imageController = {
  getImages: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { mockS3Ids } = req.body;

      if (mockS3Ids.length === 0) {
        return next({
          message: {
            err: "imageController.getImage: ERROR: Missing image ids",
          },
          log: "Error occured in imageController.getImage",
        });
      }

      const filePath = __dirname + "/../data/mockDatabase/images.json";

      const data = await fs.readFile(filePath, "utf8");

      const imagesJson = JSON.parse(data);

      const images = imagesJson.filter((image: any) => {
        return mockS3Ids.includes(image.mockS3Id);
      });

      res.locals.images = images;
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
  uploadImages: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // * Default width and height
      const width = Number(req.body.width) || 200;
      const height = Number(req.body.height) || 200;

      const files = req.files as Express.Multer.File[];

      // * Validate that there are images
      if (files.length === 0) {
        return next({
          message: {
            err: "imageController.resizeImage: ERROR: Missing images",
          },
          log: "Error occured in imageController.resizeImage",
        });
      }

      // * iterate through the images, resize them, then save them to a "mock" s3 bucket
      const uploadedImages: any = [];
      for (let i = 0; i < files.length; i++) {
        const image = files[i];

        // * Mock Saving image to an S3 Bucket
        const mockS3Id = crypto.randomUUID();
        const mockS3Url = `https://mock-s3-bucket.com/${mockS3Id}.jpg`;

        const newFilePath = __dirname + `/../data/mockS3Bucket/${mockS3Id}.jpg`;
        const buffer = Buffer.from(image.buffer);

        // * Save and resize the image to the "mock" s3 bucket and resize it, locally
        await sharp(buffer).resize(width, height).toFile(newFilePath);

        // * create object with the s3Id
        uploadedImages.push({
          mockS3Id,
          mockS3Url,
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
  saveImagesToDb: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uploadedImages = res.locals.uploadedImages;

      const filePath = __dirname + "/../data/mockDatabase/images.json";

      const data = await fs.readFile(filePath, "utf8");

      const json = JSON.parse(data);

      uploadedImages.forEach((element: any) => {
        json.push(element);
      });

      const updatedData = JSON.stringify(json, null, 2);

      await fs.writeFile(filePath, updatedData, "utf8");
      next();
    } catch (error) {
      console.error("Error adding object to JSON:", error);
    }
  },
};

export default imageController;
