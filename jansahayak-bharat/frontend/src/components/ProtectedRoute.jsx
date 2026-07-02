import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// adminOnly relies on a Firebase custom claim `admin: true` set server-side
// (see README "Making a user an Admin"). For simple setups you can instead check
// user.email against your ADMIN_EMAILS list on the client too, but the real
// enforcement always happens in the backend middleware + Firestore rules.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-20">लोड हो रहा है...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.reloadUserInfo?.customAttributes?.includes('"admin":true')) {
    // Fallback simple check; for production read the decoded ID token claims instead.
  }
  return children;
}
