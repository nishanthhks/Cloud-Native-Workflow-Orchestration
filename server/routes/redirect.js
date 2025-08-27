import { Router } from "express";
import prisma from "../lib/db.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

// get original url from slug(short url) of frontend url
router.get("/get-long-url/:shortUrl", async (req, res) => {
  // get slug frm frontend url
  const shortUrl = req.params.shortUrl;
  console.log(shortUrl);
  try {
    // get original url from short url
    const urlData = await prisma.urls.findFirst({
      where: {
        shortUrl: shortUrl,
      },
    });

    const OriginalUrl = urlData.OriginalUrl;
    return res.send({ originalUrl: OriginalUrl });

    // use below when both frontend and backend domain are same
    // or use serverless function to redirect to original url

    // return res.redirect(OriginalUrl);
  } catch (error) {
    console.error("Error fetching URL:", error);
    return res.status(500).json({ message: "Failed to fetch URL" });
  }

});

export default router;
