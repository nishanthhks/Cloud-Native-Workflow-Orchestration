import { Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import authMiddleware from "../middlewares/authMiddleware.js";

dotenv.config();

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.post("/createUrl", authMiddleware, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.user;
  const { title, longUrl, customUrl } = req.body;

  if (!title || !longUrl) {
    return res.status(400).json({ message: "Please provide title and URL" });
  }

  try {
    // Generate a random short URL if not provided
    const generateShortUrl = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const shortUrl = generateShortUrl();
    console.log(shortUrl);

    // Generate QR code URL (in a real implementation, this would be a URL to the generated QR)
    const qr_link = `https://short.ly/qr/${shortUrl}`;

    // Create URL record in database
    const newUrl = await prisma.urls.create({
      data: {
        title,
        OriginalUrl: longUrl,
        shortUrl,
        customUrl: customUrl || null,
        qr_link,
        user_Id: userId.id,
      },
    });

    return res.status(201).json({
      message: "URL created successfully",
      url: newUrl,
    });
  } catch (error) {
    console.error("Error creating URL:", error);
    return res.status(500).json({ message: "Failed to create URL" });
  }
});

// get all data(links) for user to display in dashboard
router.get("/getUrls", authMiddleware, async (req, res) => {
  try {
    const user_Id = req.user.id;
    console.log(user_Id);
    const userData = await prisma.user.findUnique({
      where: {
        id: user_Id,
      },
      include: {
        urls: true,
      },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const { email, password, ...finaldata } = userData;
    return res.json(finaldata);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// get data for specific url (click info) -> anlytics
router.get("/getUrls/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user_Id = req.user;
    const urlData = await prisma.urls.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!urlData) {
      return res.status(404).json({ message: "Url not found" });
    }

    if (urlData.user_Id !== user_Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get clicks information
    const clicksData = await prisma.clicks.findMany({
      where: {
        urlId: parseInt(id),
      },
    });

    return res.json({ urlData, clicksData });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// delete specific url
router.delete("/deleteUrl/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the URL and verify ownership
    const urlData = await prisma.urls.findUnique({
      where: {
        id: id,
      },
    });

    if (!urlData) {
      return res.status(404).json({ message: "URL not found" });
    }

    if (urlData.user_Id !== userId) {
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this URL" });
    }

    // Delete the URL
    await prisma.urls.delete({
      where: {
        id: id,
      },
    });

    return res.json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return res.status(500).json({ message: "Failed to delete URL" });
  }
});

export default router;
