// Note: Firebase Authentication (signup/login/logout) happens client-side via the
// Firebase JS SDK (see frontend/src/firebase.js + AuthContext.jsx). This route only
// exposes a small profile endpoint the frontend can call once the user is signed in.
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { db } from "../config/firebaseAdmin.js";

const router = express.Router();

// GET /api/auth/me — returns/creates the user's profile document in Firestore
router.get("/me", verifyToken, async (req, res) => {
  try {
    const ref = db.collection("users").doc(req.user.uid);
    const snap = await ref.get();

    if (!snap.exists) {
      const profile = {
        uid: req.user.uid,
        email: req.user.email || null,
        phone: req.user.phone_number || null,
        name: req.user.name || null,
        createdAt: new Date().toISOString(),
      };
      await ref.set(profile);
      return res.json(profile);
    }
    res.json(snap.data());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "प्रोफ़ाइल लोड करने में त्रुटि" });
  }
});

// PATCH /api/auth/me — update basic profile fields
router.patch("/me", verifyToken, async (req, res) => {
  try {
    const { name, village, district, state, language } = req.body;
    const ref = db.collection("users").doc(req.user.uid);
    await ref.set(
      { name, village, district, state, language, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "प्रोफ़ाइल अपडेट करने में त्रुटि" });
  }
});

export default router;
