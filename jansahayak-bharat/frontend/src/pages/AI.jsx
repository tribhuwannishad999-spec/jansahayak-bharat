import React, { useState } from "react";
import apiClient from "../api/apiClient";

export default function AI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question) return;

    setLoading(true);

    try {
      const { data } = await apiClient.post("/ai/ask", {
        question,
      });

      setAnswer(data.answer);
    } catch (err) {
      setAnswer("AI उत्तर उपलब्ध नहीं है।");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6">
        🇮🇳 जनसहायक AI
      </h1>

      <textarea
        className="w-full border rounded-xl p-4"
        rows="5"
        value={question}
        onChange={(e)=>setQuestion(e.target.value)}
        placeholder="अपना प्रश्न लिखें..."
      />

      <button
        onClick={askAI}
        className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-xl"
      >
        {loading ? "सोच रहा है..." : "पूछें"}
      </button>

      {answer && (
        <div className="mt-6 bg-white rounded-xl shadow p-5">
          {answer}
        </div>
      )}
    </div>
  );
}
