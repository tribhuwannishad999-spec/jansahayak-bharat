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
      const userCredential = await login(email, password);

      console.log(userCredential.user);

      navigate("/");
    } catch (err) {
      console.error(err);

      switch (err.code) {
        case "auth/user-not-found":
          setError("यूज़र नहीं मिला");
          break;

        case "auth/wrong-password":
          setError("गलत पासवर्ड");
          break;

        case "auth/invalid-credential":
          setError("ईमेल या पासवर्ड गलत है");
          break;

        default:
          setError("लॉगिन विफल। पुनः प्रयास करें।");
      }
    }
  };

  const googleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Google लॉगिन विफल");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white p-6 rounded-2xl shadow border border-gray-100">

      <h2 className="text-2xl font-bold text-center mb-6">
        लॉगिन करें
      </h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">

        <input
          type="email"
          placeholder="ईमेल"
          required
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="password"
          placeholder="पासवर्ड"
          required
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <button
          className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold"
        >
          लॉगिन
        </button>

      </form>

      <button
        onClick={googleLogin}
        className="w-full mt-4 border py-2 rounded-lg font-bold"
      >
        Google से लॉगिन करें
      </button>

      <p className="text-center mt-5">
        नया यूज़र?
        <Link
          to="/register"
          className="text-orange-600 font-bold ml-1"
        >
          रजिस्टर करें
        </Link>
      </p>

    </div>
  );
}
