import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient.js";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [schemeForm, setSchemeForm] = useState({ title: "", description: "", category: "केंद्र सरकार", applyLink: "" });
  const [jobForm, setJobForm] = useState({ title: "", department: "", qualification: "10वीं", lastDate: "" });
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [s, c] = await Promise.all([
      apiClient.get("/admin/stats"),
      apiClient.get("/admin/complaints/recent"),
    ]);
    setStats(s.data);
    setComplaints(c.data);
  };
  useEffect(() => { load(); }, []);

  const addScheme = async (e) => {
    e.preventDefault();
    await apiClient.post("/schemes", schemeForm);
    setMsg("✅ योजना जोड़ी गई");
    setSchemeForm({ title: "", description: "", category: "केंद्र सरकार", applyLink: "" });
  };

  const addJob = async (e) => {
    e.preventDefault();
    await apiClient.post("/jobs", jobForm);
    setMsg("✅ नौकरी जोड़ी गई");
    setJobForm({ title: "", department: "", qualification: "10वीं", lastDate: "" });
  };

  const updateStatus = async (id, status) => {
    await apiClient.patch(`/complaints/${id}/status`, { status });
    load();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h2 className="font-display font-bold text-xl">🛠️ एडमिन डैशबोर्ड</h2>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            ["कुल शिकायतें", stats.totalComplaints],
            ["खुली शिकायतें", stats.openComplaints],
            ["योजनाएँ", stats.totalSchemes],
            ["नौकरियाँ", stats.totalJobs],
            ["उपयोगकर्ता", stats.totalUsers],
          ].map(([label, val]) => (
            <div key={label} className="bg-white rounded-xl p-3 text-center shadow border border-gray-100">
              <p className="text-2xl font-bold text-navy">{val}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      {msg && <p className="text-sm text-green-700">{msg}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={addScheme} className="bg-white rounded-2xl p-4 shadow border border-gray-100 space-y-2">
          <h3 className="font-semibold">➕ नई योजना जोड़ें</h3>
          <input required placeholder="शीर्षक" value={schemeForm.title} onChange={(e) => setSchemeForm({ ...schemeForm, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <textarea required placeholder="विवरण" value={schemeForm.description} onChange={(e) => setSchemeForm({ ...schemeForm, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="आवेदन लिंक" value={schemeForm.applyLink} onChange={(e) => setSchemeForm({ ...schemeForm, applyLink: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <button className="bg-indiagreen text-white rounded-lg px-4 py-2 text-sm font-semibold">जोड़ें</button>
        </form>

        <form onSubmit={addJob} className="bg-white rounded-2xl p-4 shadow border border-gray-100 space-y-2">
          <h3 className="font-semibold">➕ नई नौकरी जोड़ें</h3>
          <input required placeholder="पद का नाम" value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input required placeholder="विभाग" value={jobForm.department} onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input required type="date" value={jobForm.lastDate} onChange={(e) => setJobForm({ ...jobForm, lastDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <button className="bg-saffron text-white rounded-lg px-4 py-2 text-sm font-semibold">जोड़ें</button>
        </form>
      </div>

      <div>
        <h3 className="font-semibold mb-3">हाल की शिकायतें</h3>
        <div className="space-y-2">
          {complaints.map((c) => (
            <div key={c.id} className="bg-white rounded-xl p-3 shadow border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">{c.subject}</p>
                <p className="text-xs text-gray-500">{c.category} • {c.trackingId}</p>
              </div>
              <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value)} className="text-xs border rounded-lg px-2 py-1">
                {["प्राप्त हुई", "समीक्षाधीन", "प्रक्रिया में", "समाधान हुआ", "बंद"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
