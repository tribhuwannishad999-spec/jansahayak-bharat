import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Home,
  Briefcase,
  FileText,
  LogIn,
  LogOut,
  Bell,
  Bot
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const active = (path) =>
    location.pathname === path
      ? "text-orange-600 font-bold"
      : "text-gray-700";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-lg">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

        <Link to="/" className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 via-white to-green-600 shadow-lg">

            🇮🇳

          </div>

          <div>

            <h1 className="font-bold text-lg text-blue-900">
              जनसहायक भारत
            </h1>

            <p className="text-xs text-gray-500">
              AI Government Assistant
            </p>

          </div>

        </Link>

        <nav className="hidden md:flex items-center gap-6">

          <Link className={active("/")} to="/">
            <Home size={18}/> Home
          </Link>

          <Link className={active("/schemes")} to="/schemes">
            योजनाएँ
          </Link>

          <Link className={active("/jobs")} to="/jobs">
            <Briefcase size={18}/> Jobs
          </Link>

          {user && (
            <Link className={active("/complaints")} to="/complaints">
              <FileText size={18}/> शिकायत
            </Link>
          )}

        </nav>

        <div className="flex items-center gap-3">

          <button className="relative p-2 rounded-full hover:bg-gray-100">

            <Bell size={20}/>

            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"/>

          </button>

          <button className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white">

            <Bot size={20}/>

          </button>

          {user ? (

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <LogOut size={18}/>
              Logout
            </button>

          ) : (

            <Link
              to="/login"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <LogIn size={18}/>
              Login
            </Link>

          )}

        </div>

      </div>

    </header>
  );
}
