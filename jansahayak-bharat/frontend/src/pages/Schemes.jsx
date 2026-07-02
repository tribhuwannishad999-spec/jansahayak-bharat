import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient.js";
import SearchBar from "../components/SearchBar.jsx";

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);

  const load = async (q) => {
    const { data } = await apiClient.get("/schemes", { params: q ? { q } : {} });
    setSchemes(data);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="font-display font-bold text-xl mb-4">🏛 सरकारी योजनाएँ</h2>
      <div className="mb-6"><SearchBar onSearch={load} /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        {schemes.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl p-4 shadow border border-gray-100">
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{s.description}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {s.eligibility && <span className="text-xs bg-cream border px-2 py-1 rounded-full">योग्यता</span>}
              {s.applyLink && (
                <a href={s.applyLink} target="_blank" rel="noreferrer" className="text-xs bg-saffron text-white px-2 py-1 rounded-full">
                  ऑनलाइन आवेदन
                </a>
              )}
            </div>
          </div>
        ))}
        {schemes.length === 0 && <p className="text-sm text-gray-400 col-span-2">कोई योजना नहीं मिली — एडमिन पैनल से योजनाएँ जोड़ें</p>}
      </div>
    </div>
  );
}
