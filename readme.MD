# Overview

This simple NodeJS/Express HTTP services allows callers to upload batch images through a multipart/form-data API call. The service will resize the images to the callers dimensions then store them in a mock S3 bucket along with a mock database.

The services uses [Sharp](https://sharp.pixelplumbing.com/) to handle resizing and saving locally.
As well as [Multer](https://www.npmjs.com/package/multer) to handle multipart uploading of files via multipart/form-data

The service also contains an endpoint for uploading events to the Freshpaint data tracking platform. However, this endpoint is not covered in this documentation.

## POST /images

This endpoint allows you to upload images, resize them, and save them to a mock S3 bucket. It works with a multipart form data request to allow batch uploads.

### Headers

- `Content-Type`: `multipart/form-data`

#### Example Request

- Form Fields:

  - `width` (optional): The width to resize the images to. Default is 200.
  - `height` (optional): The height to resize the images to. Default is 200.

- Form files
  - Note: All files should be labeled "images" in the form file field name
  - `images`: The image files to upload.

#### Example Response Body

```json
[
  {
    "mockS3Id": "3d7c2e2b-1e32-4e27-a1c5-e4e7f6afa9f9",
    "mockS3Url": "https://mock-s3-bucket.com/3d7c2e2b-1e32-4e27-a1c5-e4e7f6afa9f9.jpg"
  },
  {
    "mockS3Id": "ae2beb24-38bc-4240-aa4c-1e077e70ef01",
    "mockS3Url": "https://mock-s3-bucket.com/ae2beb24-38bc-4240-aa4c-1e077e70ef01.jpg"
  }
]
```

## GET /Images

The GET /images endpoint retrieves images from a mock database based on provided S3 IDs. This endpoint reads the image data from a JSON file and filters the images based on the provided `mockS3Ids` from the request body. The resulting images are then stored in `res.locals.images` for further processing.

## Endpoint

`GET /getImages`

## Request

### Headers

- `Content-Type: application/json`

### Body

The body of the request should be a JSON object with the following property:

- `mockS3Ids` (Array): An array of S3 IDs representing the images to retrieve.

#### Example Request Body

```json
{
  "mockS3Ids": ["id1", "id2", "id3"]
}
```

#### Example Response Body

```json
[
  {
    "mockS3Id": "3d7c2e2b-1e32-4e27-a1c5-e4e7f6afa9f9",
    "mockS3Url": "https://mock-s3-bucket.com/3d7c2e2b-1e32-4e27-a1c5-e4e7f6afa9f9.jpg"
  },
  {
    "mockS3Id": "ae2beb24-38bc-4240-aa4c-1e077e70ef01",
    "mockS3Url": "https://mock-s3-bucket.com/ae2beb24-38bc-4240-aa4c-1e077e70ef01.jpg"
  }
]
```
