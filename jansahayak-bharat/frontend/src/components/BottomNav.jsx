import React from "react";
import { Link, useLocation } from "react-router-dom";
import { House, Briefcase, Bot, User, Landmark } from "lucide-react";

export default function BottomNav() {
  const { pathname } = useLocation();

  const item = (to, icon, label) => (
    <Link
      to={to}
      className={`flex flex-col items-center text-xs ${
        pathname === to ? "text-orange-600 font-bold" : "text-gray-500"
      }`}
    >
      {icon}
      <span className="mt-1">{label}</span>
    </Link>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow-2xl z-50">
      <div className="grid grid-cols-5 py-2">
        {item("/", <House size={22} />, "Home")}
        {item("/schemes", <Landmark size={22} />, "योजनाएँ")}
        {item("/jobs", <Briefcase size={22} />, "Jobs")}
        {item("/ai", <Bot size={22} />, "AI")}
        {item("/profile", <User size={22} />, "Profile")}
      </div>
    </div>
  );
}
