import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Bot,
  Briefcase,
  Landmark,
  User
} from "lucide-react";

export default function BottomNav() {
  const menu = [
    { name: "होम", icon: Home, path: "/" },
    { name: "AI", icon: Bot, path: "/ai" },
    { name: "योजनाएँ", icon: Landmark, path: "/schemes" },
    { name: "नौकरी", icon: Briefcase, path: "/jobs" },
    { name: "प्रोफाइल", icon: User, path: "/login" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50">
      <div className="flex justify-around py-2">

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs ${
                  isActive
                    ? "text-orange-600"
                    : "text-gray-500"
                }`
              }
            >
              <Icon size={24} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </div>
    </div>
  );
}
