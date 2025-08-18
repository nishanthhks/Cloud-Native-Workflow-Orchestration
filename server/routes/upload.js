import { Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import authMiddleware from "../middlewares/authMiddleware.js";
import multer from "multer";
import admin from "firebase-admin";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(
  __dirname,
  "../nishanth-url-shortner-firebase-adminsdk-fbsvc-20fc106460.json"
);
const serviceAccount = JSON.parse(await readFile(jsonPath, "utf-8"));

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.DATABASE_URL,
});

// bucket
const bucket = admin.storage().bucket();

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.post(
  "/upload-to-firestore",
  upload.single("image"),
  authMiddleware,
  async (req, res) => {
    try {
      const file = req.file;
      const fileName = `${Date.now()}-${file.originalname}`;
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      const download_url = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(blob.name)}?alt=media&`;

      // save the image to the database
      blobStream.on("error", (error) => {
        console.log(error);
        res.status(500).send(error);
      });

      blobStream.on("finish", async () => {
        // Update the URL in the database with the public URL
        try {
          await prisma.urls.update({
            where: {
              id: req.body.urlId,
            },
            data: {
              qr_link: download_url,
            },
          });

          res.status(200).json({ success: true, url: download_url });
        } catch (error) {
          console.error("Error updating URL in database:", error);
          res.status(500).json({
            success: false,
            message: "Failed to update URL in database",
          });
        }
      });

      // Pipe the file data to Firebase Storage
      blobStream.end(file.buffer);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

export default router;
