import React, { useState } from "react";
import apiClient from "../api/apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AIChat() {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    if (!user) {
      setMessages((m) => [...m, { role: "system", text: "कृपया पहले लॉगिन करें।" }]);
      return;
    }
    const q = question;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const { data } = await apiClient.post("/ai/ask", { question: q });
      setMessages((m) => [...m, { role: "ai", text: data.answer }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "system", text: "AI सहायक अभी उपलब्ध नहीं है।" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-navy via-[#123f61] to-indiagreen-deep rounded-2xl p-5 text-white">
      <h3 className="font-display font-bold text-lg mb-2">🤖 AI सरकारी सहायक</h3>
      <div className="bg-white/10 rounded-xl p-3 h-48 overflow-y-auto mb-3 space-y-2 text-sm">
        {messages.length === 0 && <p className="opacity-70">कोई भी प्रश्न पूछें, जैसे: "राशन कार्ड कैसे बनवाएं?"</p>}
        {messages.map((m, i) => (
          <p key={i} className={m.role === "user" ? "text-right" : ""}>
            <span className="bg-white/15 inline-block px-3 py-1.5 rounded-lg">{m.text}</span>
          </p>
        ))}
        {loading && <p className="opacity-70">सोच रहा है...</p>}
      </div>
      <form onSubmit={ask} className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="अपना प्रश्न लिखें..."
          className="flex-1 rounded-full px-4 py-2 text-sm text-gray-900 outline-none"
        />
        <button className="bg-saffron px-4 py-2 rounded-full font-semibold text-sm">भेजें</button>
      </form>
    </div>
  );
}
