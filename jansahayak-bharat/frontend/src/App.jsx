import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import BottomNav from "./components/BottomNav.jsx";

import Home from "./pages/Home.jsx";
import AI from "./pages/AI.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Complaints from "./pages/Complaints.jsx";
import Schemes from "./pages/Schemes.jsx";
import Jobs from "./pages/Jobs.jsx";
import Admin from "./pages/Admin.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-cream text-gray-900">
      <Navbar />

      <main className="pb-24">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* AI Assistant */}
          <Route path="/ai" element={<AI />} />

          {/* Public Pages */}
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Pages */}
          <Route
            path="/complaints"
            element={
              <ProtectedRoute>
                <Complaints />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}
