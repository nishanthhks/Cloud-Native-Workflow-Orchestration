import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Check if authorization header is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    
    return res.status(401).json({
      message:
        error.name === "TokenExpiredError"
          ? "Token expired, please log in again"
          : "Invalid token",
    });
  }
};

export default authMiddleware;
