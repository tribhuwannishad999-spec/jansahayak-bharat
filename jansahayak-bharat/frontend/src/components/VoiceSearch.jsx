import React, { useState } from "react";

// Uses the browser's native Web Speech API (SpeechRecognition) — free, no API key
// needed, works in Chrome/Edge/most Android browsers. Falls back gracefully if
// unsupported (common on some iOS browsers).
export default function VoiceSearch({ onResult }) {
  const [listening, setListening] = useState(false);
  const supported = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  const startListening = () => {
    if (!supported) {
      alert("आपके ब्राउज़र में आवाज़ खोज उपलब्ध नहीं है। कृपया Chrome का उपयोग करें।");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={startListening}
      title="बोलकर खोजें"
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
        listening ? "bg-red-500 animate-pulse" : "bg-navy"
      }`}
    >
      🎤
    </button>
  );
}
