// Full CRUD + status tracking for citizen complaints, stored in Firestore.
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { db } from "../config/firebaseAdmin.js";

const router = express.Router();
const COLLECTION = "complaints";

// POST /api/complaints — citizen files a new complaint
router.post("/", verifyToken, async (req, res) => {
  try {
    const { category, subject, description, district, village, location } = req.body;
    if (!category || !subject || !description) {
      return res.status(400).json({ error: "श्रेणी, विषय और विवरण आवश्यक हैं" });
    }

    const complaintId = uuidv4();
    const trackingId = "JSB-" + Date.now().toString(36).toUpperCase();

    const complaint = {
      id: complaintId,
      trackingId,
      userId: req.user.uid,
      userEmail: req.user.email || null,
      category,        // बिजली, सड़क, पानी, पंचायत, राशन, पुलिस, स्वास्थ्य, स्कूल...
      subject,
      description,
      district: district || null,
      village: village || null,
      location: location || null, // { lat, lng } optional, from Google Maps picker
      status: "प्राप्त हुई",      // प्राप्त हुई -> समीक्षाधीन -> प्रक्रिया में -> समाधान हुआ -> बंद
      statusHistory: [{ status: "प्राप्त हुई", at: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };

    await db.collection(COLLECTION).doc(complaintId).set(complaint);
    res.status(201).json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "शिकायत दर्ज करने में त्रुटि" });
  }
});

// GET /api/complaints/mine — logged-in user's own complaints
router.get("/mine", verifyToken, async (req, res) => {
  try {
    const snap = await db
      .collection(COLLECTION)
      .where("userId", "==", req.user.uid)
      .orderBy("createdAt", "desc")
      .get();
    res.json(snap.docs.map((d) => d.data()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "शिकायतें लोड करने में त्रुटि" });
  }
});

// GET /api/complaints/track/:trackingId — public status lookup (no login required)
router.get("/track/:trackingId", async (req, res) => {
  try {
    const snap = await db
      .collection(COLLECTION)
      .where("trackingId", "==", req.params.trackingId)
      .limit(1)
      .get();
    if (snap.empty) return res.status(404).json({ error: "शिकायत नहीं मिली" });
    const data = snap.docs[0].data();
    // Only return non-sensitive fields publicly
    res.json({
      trackingId: data.trackingId,
      category: data.category,
      subject: data.subject,
      status: data.status,
      statusHistory: data.statusHistory,
      createdAt: data.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "स्थिति जांचने में त्रुटि" });
  }
});

// ---- Admin routes ----

// GET /api/complaints — admin: list all, optional ?status=&category=&district=
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    let ref = db.collection(COLLECTION);
    if (req.query.status) ref = ref.where("status", "==", req.query.status);
    if (req.query.category) ref = ref.where("category", "==", req.query.category);
    if (req.query.district) ref = ref.where("district", "==", req.query.district);
    const snap = await ref.orderBy("createdAt", "desc").limit(200).get();
    res.json(snap.docs.map((d) => d.data()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "शिकायतें लोड करने में त्रुटि" });
  }
});

// PATCH /api/complaints/:id/status — admin updates status
router.patch("/:id/status", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status, note } = req.body;
    const ref = db.collection(COLLECTION).doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: "शिकायत नहीं मिली" });

    const history = snap.data().statusHistory || [];
    history.push({ status, note: note || null, at: new Date().toISOString() });

    await ref.update({ status, statusHistory: history });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "स्थिति अपडेट करने में त्रुटि" });
  }
});

export default router;
