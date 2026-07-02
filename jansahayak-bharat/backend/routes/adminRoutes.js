// Admin dashboard aggregate stats (counts, recent activity) — powers Admin > Analytics
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { db } from "../config/firebaseAdmin.js";

const router = express.Router();
router.use(verifyToken, requireAdmin);

router.get("/stats", async (req, res) => {
  try {
    const [complaints, schemes, jobs, users] = await Promise.all([
      db.collection("complaints").count().get(),
      db.collection("schemes").count().get(),
      db.collection("jobs").count().get(),
      db.collection("users").count().get(),
    ]);

    const openComplaints = await db
      .collection("complaints")
      .where("status", "in", ["प्राप्त हुई", "समीक्षाधीन", "प्रक्रिया में"])
      .count()
      .get();

    res.json({
      totalComplaints: complaints.data().count,
      openComplaints: openComplaints.data().count,
      totalSchemes: schemes.data().count,
      totalJobs: jobs.data().count,
      totalUsers: users.data().count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "आँकड़े लोड करने में त्रुटि" });
  }
});

// GET /api/admin/complaints/recent
router.get("/complaints/recent", async (req, res) => {
  const snap = await db.collection("complaints").orderBy("createdAt", "desc").limit(20).get();
  res.json(snap.docs.map((d) => d.data()));
});

export default router;
