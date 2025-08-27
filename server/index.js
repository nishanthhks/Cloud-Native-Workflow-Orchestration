import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import urlsRouter from "./routes/urls.js";
import redirectRouter from "./routes/redirect.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/urls", urlsRouter);
app.use("/api/redirect", redirectRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
