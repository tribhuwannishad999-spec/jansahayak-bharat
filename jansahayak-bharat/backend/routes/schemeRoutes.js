// Government Schemes — Firestore-backed (admin managed).
// IMPORTANT: India has no single official public "Schemes API". myscheme.gov.in has
// no open public API. Real production apps in this space maintain scheme data
// themselves (via Admin Panel below) or via licensed data partnerships. This router
// gives you full CRUD so admins can publish/update schemes, and the public gets
// fast search/filter over that Firestore data.
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { db } from "../config/firebaseAdmin.js";

const router = express.Router();
const COLLECTION = "schemes";

// GET /api/schemes?category=&state=&q=
router.get("/", async (req, res) => {
  try {
    let ref = db.collection(COLLECTION);
    if (req.query.category) ref = ref.where("category", "==", req.query.category);
    if (req.query.state) ref = ref.where("state", "==", req.query.state);
    const snap = await ref.orderBy("createdAt", "desc").limit(100).get();
    let items = snap.docs.map((d) => d.data());

    if (req.query.q) {
      const q = req.query.q.toLowerCase();
      items = items.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
      );
    }
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "योजनाएँ लोड करने में त्रुटि" });
  }
});

router.get("/:id", async (req, res) => {
  const doc = await db.collection(COLLECTION).doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: "योजना नहीं मिली" });
  res.json(doc.data());
});

// ---- Admin CRUD ----
router.post("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    const id = uuidv4();
    const scheme = {
      id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category, // केंद्र/राज्य/महिला/किसान/छात्रवृत्ति/पेंशन/आवास
      state: req.body.state || "सभी",
      eligibility: req.body.eligibility || "",
      documents: req.body.documents || [],
      applyLink: req.body.applyLink || "",
      applyOffline: req.body.applyOffline || "",
      videoUrl: req.body.videoUrl || "",
      faq: req.body.faq || [],
      createdAt: new Date().toISOString(),
    };
    await db.collection(COLLECTION).doc(id).set(scheme);
    res.status(201).json(scheme);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "योजना जोड़ने में त्रुटि" });
  }
});

router.put("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    await db.collection(COLLECTION).doc(req.params.id).set(
      { ...req.body, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "योजना अपडेट करने में त्रुटि" });
  }
});

router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  await db.collection(COLLECTION).doc(req.params.id).delete();
  res.json({ success: true });
});

export default router;
