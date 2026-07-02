import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import mandiRoutes from "./routes/mandiRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("combined"));

// Basic abuse protection — tune as needed
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use("/api/", limiter);

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "JanSahayak Bharat API", time: new Date().toISOString() });
});
app.get("/health", (req, res) => res.json({ status: "healthy" }));

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/mandi", mandiRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/admin", adminRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "आंतरिक सर्वर त्रुटि (Internal server error)" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🇮🇳 JanSahayak Bharat API running on port ${PORT}`));
