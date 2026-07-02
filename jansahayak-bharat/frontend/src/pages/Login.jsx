import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("लॉगिन विफल — ईमेल या पासवर्ड जांचें");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white p-6 rounded-2xl shadow border border-gray-100">
      <h2 className="font-display font-bold text-xl mb-4 text-center">लॉगिन करें</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input type="email" required placeholder="ईमेल" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm" />
        <input type="password" required placeholder="पासवर्ड" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm" />
        <button className="w-full bg-saffron text-white rounded-lg py-2 font-semibold">लॉगिन</button>
      </form>
      <button onClick={loginWithGoogle} className="w-full mt-3 border rounded-lg py-2 font-semibold text-sm">
        Google से लॉगिन करें
      </button>
      <p className="text-sm text-center mt-4">
        खाता नहीं है? <Link to="/register" className="text-saffron-deep font-semibold">रजिस्टर करें</Link>
      </p>
    </div>
  );
}
