import React, { useState } from "react";
import VoiceSearch from "./VoiceSearch.jsx";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const submit = (e) => {
    e?.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto flex items-center gap-2 bg-white border-2 border-gray-200 rounded-full px-4 py-2 shadow">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="आप क्या ढूंढना चाहते हैं? जैसे: राशन कार्ड, किसान योजना..."
        className="flex-1 outline-none bg-transparent text-sm py-2"
      />
      <VoiceSearch onResult={(text) => { setQuery(text); onSearch(text); }} />
      <button type="submit" className="bg-gradient-to-br from-saffron to-saffron-deep text-white font-semibold text-sm px-5 py-2 rounded-full">
        खोजें
      </button>
    </form>
  );
}
