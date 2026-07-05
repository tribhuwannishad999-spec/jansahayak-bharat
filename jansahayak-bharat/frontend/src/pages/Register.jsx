import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      const userCredential = await register(email, password);

      console.log("User Registered:", userCredential.user);

      alert("रजिस्ट्रेशन सफल हुआ ✅");

      navigate("/");

    } catch (err) {

      console.error(err);
      console.log("Error Code:", err.code);
      console.log("Error Message:", err.message);

      alert(
        "Firebase Error:\n\n" +
        err.code +
        "\n\n" +
        err.message
      );

      switch (err.code) {

        case "auth/email-already-in-use":
          setError("यह ईमेल पहले से मौजूद है");
          break;

        case "auth/weak-password":
          setError("पासवर्ड कम से कम 6 अक्षर का होना चाहिए");
          break;

        case "auth/invalid-email":
          setError("ईमेल सही नहीं है");
          break;

        case "auth/network-request-failed":
          setError("इंटरनेट कनेक्शन जांचें");
          break;

        case "auth/operation-not-allowed":
          setError("Firebase में Email/Password Login Enable नहीं है");
          break;

        case "auth/invalid-api-key":
          setError("Firebase API Key गलत है");
          break;

        default:
          setError("रजिस्ट्रेशन विफल");
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white p-6 rounded-2xl shadow border border-gray-100">

      <h2 className="text-2xl font-bold text-center mb-6">
        नया खाता बनाएं
      </h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">

        <input
          type="email"
          required
          placeholder="ईमेल"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="password"
          required
          minLength={6}
          placeholder="पासवर्ड (कम से कम 6 अक्षर)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-bold"
        >
          रजिस्टर करें
        </button>

      </form>

      <p className="text-center mt-5">
        पहले से खाता है?
        <Link
          to="/login"
          className="text-orange-600 font-bold ml-1"
        >
          लॉगिन करें
        </Link>
      </p>

    </div>
  );
}
