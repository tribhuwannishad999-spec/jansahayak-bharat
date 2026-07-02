import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { db } from "../config/firebaseAdmin.js";
import { generateComplaintPDF } from "../utils/pdfGenerator.js";

const router = express.Router();

// GET /api/pdf/complaint/:id — download a PDF receipt for a complaint you own (or admin)
router.get("/complaint/:id", verifyToken, async (req, res) => {
  try {
    const doc = await db.collection("complaints").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "शिकायत नहीं मिली" });
    const complaint = doc.data();

    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
    const isOwner = complaint.userId === req.user.uid;
    const isAdmin = req.user.admin === true || adminEmails.includes(req.user.email);
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "अनुमति नहीं है" });

    generateComplaintPDF(complaint, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF बनाने में त्रुटि" });
  }
});

export default router;
