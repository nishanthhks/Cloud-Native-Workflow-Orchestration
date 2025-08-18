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

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  // if users don't fill in all fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    // Check if username OR email already exists in one query (better performance)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    // if username or email already exists
    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.username === username
            ? "Username already exists"
            : "Email already exists",
      });
    }
    console.log("no existing user");

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // create user
    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });
    console.log(user);

    // Create a new object without the password instead of destructuring
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return res.json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    console.log("login");
    // find user by username
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({
      message: "user login successful",
      token: token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-user-details", authMiddleware, async (req, res) => {
  try {
    // Use the user ID from the authenticated request
    const userId = req.user.id;

    // Fetch the user from the database, excluding the password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Protected route accessed successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error in protected route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
