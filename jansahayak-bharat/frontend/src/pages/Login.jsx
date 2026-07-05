import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {

  const { login, loginWithGoogle } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      await login(email, password);

      setSuccess("✅ लॉगिन सफल");

      setTimeout(() => {

        navigate("/");

      },1500);

    } catch(err){

      setError("❌ गलत ईमेल या पासवर्ड");

    } finally{

      setLoading(false);

    }

  };

  return (

<div className="max-w-sm mx-auto mt-16 bg-white p-6 rounded-2xl shadow-xl">

<h2 className="text-2xl font-bold text-center mb-5">

लॉगिन करें

</h2>

{success && (

<div className="bg-green-100 border border-green-500 text-green-700 rounded-lg p-3 mb-4">

{success}

</div>

)}

{error && (

<div className="bg-red-100 border border-red-500 text-red-700 rounded-lg p-3 mb-4">

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

className="w-full border rounded-lg p-3"

/>

<input

type="password"

placeholder="पासवर्ड"

required

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="w-full border rounded-lg p-3"

/>

<button

disabled={loading}

className="w-full bg-orange-600 text-white rounded-lg p-3 font-bold"

>

{loading ? "लॉगिन हो रहा है..." : "लॉगिन"}

</button>

</form>

<button

onClick={loginWithGoogle}

className="w-full mt-4 border rounded-lg p-3"

>

Google से लॉगिन

</button>

<p className="text-center mt-5">

खाता नहीं है?

<Link to="/register" className="text-orange-600 font-bold ml-2">

रजिस्टर करें

</Link>

</p>

</div>

  );

}
