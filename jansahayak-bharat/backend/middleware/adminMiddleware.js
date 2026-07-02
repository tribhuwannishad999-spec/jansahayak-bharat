// Restricts a route to emails listed in ADMIN_EMAILS (comma separated in .env)
// For production, prefer setting a Firebase custom claim { admin: true } via a one-time
// admin script instead of an email allowlist — see README "Making a user an Admin".
export function requireAdmin(req, res, next) {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isClaimAdmin = req.user?.admin === true;
  const isEmailAdmin = req.user?.email && adminEmails.includes(req.user.email.toLowerCase());

  if (!isClaimAdmin && !isEmailAdmin) {
    return res.status(403).json({ error: "प्रवेश निषेध — केवल एडमिन के लिए (Admins only)" });
  }
  next();
}
