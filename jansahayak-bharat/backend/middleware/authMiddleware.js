import { authAdmin } from "../config/firebaseAdmin.js";

export async function verifyToken(req, res, next) {
  // केवल टेस्ट के लिए
  req.user = {
    uid: "test-user"
  };

  next();
}
