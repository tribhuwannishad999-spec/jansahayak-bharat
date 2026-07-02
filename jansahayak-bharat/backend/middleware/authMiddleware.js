// Verifies the Firebase ID token sent by the frontend in the Authorization header
import { authAdmin } from "../config/firebaseAdmin.js";

export async function verifyToken(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ error: "प्रमाणीकरण आवश्यक है (No token provided)" });
    }

    const decoded = await authAdmin.verifyIdToken(token);
    req.user = decoded; // { uid, email, ... }
    next();
  } catch (err) {
    console.error("Auth verification failed:", err.message);
    return res.status(401).json({ error: "अमान्य या समाप्त सत्र (Invalid or expired token)" });
  }
}
