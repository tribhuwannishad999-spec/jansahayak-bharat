import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-full"
          style={{
            background: "conic-gradient(#F2762E 0 33%, #fff 33% 66%, #158443 66% 100%)",
            boxShadow: "0 0 0 2px #0B3C5D inset",
          }}
        />
        <span className="font-display font-bold text-navy text-lg">जनसहायक भारत</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link to="/schemes">योजनाएँ</Link>
        <Link to="/jobs">नौकरी</Link>
        {user ? (
          <>
            <Link to="/complaints">शिकायत</Link>
            <button onClick={logout} className="text-saffron-deep font-semibold">
              लॉगआउट
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-saffron text-white px-3 py-1.5 rounded-full font-semibold">
            लॉगिन
          </Link>
        )}
      </nav>
    </header>
  );
}
