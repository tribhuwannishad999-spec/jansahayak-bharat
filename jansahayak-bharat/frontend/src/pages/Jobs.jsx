import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient.js";
import SearchBar from "../components/SearchBar.jsx";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  const load = async (q) => {
    const { data } = await apiClient.get("/jobs", { params: q ? { q } : {} });
    setJobs(data);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="font-display font-bold text-xl mb-4">💼 सरकारी नौकरी</h2>
      <div className="mb-6"><SearchBar onSearch={load} /></div>
      <div className="space-y-3">
        {jobs.map((j) => (
          <div key={j.id} className="bg-white rounded-2xl p-4 shadow border border-gray-100">
            <h3 className="font-semibold">{j.title}</h3>
            <p className="text-sm text-gray-600">{j.department} • पद: {j.posts || "-"} • योग्यता: {j.qualification}</p>
            <div className="flex gap-2 mt-2 flex-wrap text-xs">
              <span className="bg-cream border px-2 py-1 rounded-full">अंतिम तिथि: {j.lastDate}</span>
              {j.salary && <span className="bg-cream border px-2 py-1 rounded-full">{j.salary}</span>}
            </div>
            <div className="flex gap-3 mt-3">
              {j.notificationUrl && <a href={j.notificationUrl} target="_blank" rel="noreferrer" className="text-xs text-navy font-semibold">Notification PDF</a>}
              {j.applyUrl && <a href={j.applyUrl} target="_blank" rel="noreferrer" className="text-xs text-saffron-deep font-semibold">Apply Link</a>}
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-sm text-gray-400">कोई नौकरी नहीं मिली — एडमिन पैनल से नौकरियाँ जोड़ें</p>}
      </div>
    </div>
  );
}
