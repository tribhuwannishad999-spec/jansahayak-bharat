import React, { useState } from "react";
import apiClient from "../api/apiClient";

export default function AI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const { data } = await apiClient.post("/ai/chat", {
        message: question,
      });

      setAnswer(data.reply);
    } catch (err) {
      setAnswer("❌ AI से उत्तर प्राप्त नहीं हुआ।");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4">

      <div className="max-w-3xl mx-auto">

        <div className="bg-gradient-to-r from-orange-500 to-green-600 rounded-3xl text-white p-6 shadow-xl">

          <h1 className="text-3xl font-bold">
            🤖 जनसहायक AI
          </h1>

          <p className="mt-2 opacity-90">
            सरकारी योजनाएँ, नौकरी, खेती, कानून, स्वास्थ्य और अन्य जानकारी पूछें।
          </p>

        </div>

        <div className="bg-white mt-6 rounded-3xl shadow-xl p-5">

          <textarea
            rows="5"
            value={question}
            onChange={(e)=>setQuestion(e.target.value)}
            placeholder="अपना प्रश्न यहाँ लिखें..."
            className="w-full border rounded-2xl p-4 outline-none"
          />

          <button
            onClick={askAI}
            className="mt-4 w-full bg-gradient-to-r from-orange-500 to-green-600 text-white rounded-2xl py-3 font-bold"
          >
            {loading ? "उत्तर तैयार हो रहा है..." : "AI से पूछें"}
          </button>

        </div>

        {answer && (

          <div className="bg-white mt-6 rounded-3xl shadow-xl p-5">

            <h2 className="font-bold text-lg mb-3">
              🤖 उत्तर
            </h2>

            <p className="leading-8 whitespace-pre-wrap">
              {answer}
            </p>

          </div>

        )}

      </div>

    </div>
  );
}
