import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(email, password);
      navigate("/");
    } catch (err) {
      setError("रजिस्ट्रेशन विफल — " + (err.code === "auth/weak-password" ? "पासवर्ड कमज़ोर है" : "पुनः प्रयास करें"));
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white p-6 rounded-2xl shadow border border-gray-100">
      <h2 className="font-display font-bold text-xl mb-4 text-center">नया खाता बनाएं</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input type="email" required placeholder="ईमेल" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm" />
        <input type="password" required minLength={6} placeholder="पासवर्ड (कम से कम 6 अक्षर)" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm" />
        <button className="w-full bg-indiagreen text-white rounded-lg py-2 font-semibold">रजिस्टर करें</button>
      </form>
      <p className="text-sm text-center mt-4">
        पहले से खाता है? <Link to="/login" className="text-saffron-deep font-semibold">लॉगिन करें</Link>
      </p>
    </div>
  );
}
