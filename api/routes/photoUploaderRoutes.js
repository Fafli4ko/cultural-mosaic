// photoUploadRoutes.js

const express = require("express");
const imageDownloader = require("image-downloader");
const fs = require("fs");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mongoose = require("mongoose");
const mime = require("mime-types");

const bucket = "petko-media-app";

const router = express.Router();

// Define multer configuration for file upload
const photosMiddleware = multer({ dest: "/tmp" });

async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const parts = originalFilename.split(".");
  const extension = parts[parts.length - 1];
  const newFilename = `photo-${Date.now()}.${extension}`;
  const data = await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

// Endpoint for uploading photo by link
router.post("/upload-by-link", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { link } = req.body;
  console.log("Received link:", link); // Log the received link

  const newName = "photo" + Date.now() + ".jpg";

  try {
    await imageDownloader.image({
      url: link,
      dest: "/tmp/" + newName,
    });
    const url = await uploadToS3(
      "/tmp/" + newName,
      newName,
      mime.lookup("/tmp/" + newName)
    );
    console.log("Image downloaded successfully:", url); // Log successful download
    res.json(url);
  } catch (error) {
    console.error("Error downloading image:", error); // Log any errors
    res.status(500).json({ error: "Failed to upload photo" });
  }
});

// Endpoint for uploading photos
router.post(
  "/upload",
  photosMiddleware.array("photos", 100),
  async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname, mimetype } = req.files[i];
      uploadedFiles.push(await uploadToS3(path, originalname, mimetype));
    }
    res.json(uploadedFiles);
  }
);

module.exports = router;
