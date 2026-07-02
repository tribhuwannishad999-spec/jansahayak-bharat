// Government Jobs — same rationale as schemeRoutes.js: no unified public "Jobs API"
// exists for India (SSC, UPSC, Railways, State PSCs each publish independently, mostly
// as PDFs with no API). This is admin-managed Firestore data with full CRUD, which is
// how real portals (Sarkari Result style sites) actually source their listings.
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { db } from "../config/firebaseAdmin.js";

const router = express.Router();
const COLLECTION = "jobs";

// GET /api/jobs?state=&qualification=&q=
router.get("/", async (req, res) => {
  try {
    let ref = db.collection(COLLECTION);
    if (req.query.state) ref = ref.where("state", "==", req.query.state);
    if (req.query.qualification) ref = ref.where("qualification", "==", req.query.qualification);
    const snap = await ref.orderBy("lastDate", "asc").limit(100).get();
    let items = snap.docs.map((d) => d.data());
    if (req.query.q) {
      const q = req.query.q.toLowerCase();
      items = items.filter((j) => j.title?.toLowerCase().includes(q));
    }
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "नौकरियाँ लोड करने में त्रुटि" });
  }
});

router.get("/:id", async (req, res) => {
  const doc = await db.collection(COLLECTION).doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: "नौकरी नहीं मिली" });
  res.json(doc.data());
});

router.post("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    const id = uuidv4();
    const job = {
      id,
      title: req.body.title,
      department: req.body.department, // रेलवे, SSC, UPSC, बैंक...
      posts: req.body.posts || null,
      qualification: req.body.qualification, // 10वीं/12वीं/ITI/Diploma/Graduate/PG
      state: req.body.state || "अखिल भारतीय",
      salary: req.body.salary || "",
      lastDate: req.body.lastDate,
      notificationUrl: req.body.notificationUrl || "",
      applyUrl: req.body.applyUrl || "",
      selectionProcess: req.body.selectionProcess || "",
      createdAt: new Date().toISOString(),
    };
    await db.collection(COLLECTION).doc(id).set(job);
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "नौकरी जोड़ने में त्रुटि" });
  }
});

router.put("/:id", verifyToken, requireAdmin, async (req, res) => {
  await db.collection(COLLECTION).doc(req.params.id).set(
    { ...req.body, updatedAt: new Date().toISOString() },
    { merge: true }
  );
  res.json({ success: true });
});

router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  await db.collection(COLLECTION).doc(req.params.id).delete();
  res.json({ success: true });
});

export default router;
