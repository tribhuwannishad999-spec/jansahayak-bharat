import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient.js";

const CATEGORIES = ["बिजली", "सड़क", "पानी", "पंचायत", "राशन", "पुलिस", "स्वास्थ्य", "स्कूल"];

export default function Complaints() {
  const [form, setForm] = useState({ category: CATEGORIES[0], subject: "", description: "", district: "", village: "" });
  const [myComplaints, setMyComplaints] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const loadMine = async () => {
    try {
      const { data } = await apiClient.get("/complaints/mine");
      setMyComplaints(data);
    } catch (err) { /* noop */ }
  };

  useEffect(() => { loadMine(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const { data } = await apiClient.post("/complaints", form);
      setStatus(`✅ शिकायत दर्ज हुई। ट्रैकिंग ID: ${data.trackingId}`);
      setForm({ category: CATEGORIES[0], subject: "", description: "", district: "", village: "" });
      loadMine();
    } catch (err) {
      setStatus("❌ शिकायत दर्ज करने में त्रुटि हुई");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async (id) => {
    const res = await apiClient.get(`/pdf/complaint/${id}`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `complaint-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="font-display font-bold text-xl mb-4">📢 शिकायत दर्ज करें</h2>
      <form onSubmit={submit} className="bg-white rounded-2xl p-5 shadow border border-gray-100 space-y-3">
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input required placeholder="विषय" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
        <textarea required placeholder="विवरण" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full border rounded-lg px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <input placeholder="जिला" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="w-1/2 border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="गाँव" value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} className="w-1/2 border rounded-lg px-3 py-2 text-sm" />
        </div>
        <button disabled={loading} className="w-full bg-saffron text-white rounded-lg py-2 font-semibold">
          {loading ? "भेजा जा रहा है..." : "शिकायत भेजें"}
        </button>
        {status && <p className="text-sm">{status}</p>}
      </form>

      <h3 className="font-display font-bold text-lg mt-8 mb-3">मेरी शिकायतें</h3>
      <div className="space-y-3">
        {myComplaints.map((c) => (
          <div key={c.id} className="bg-white rounded-xl p-4 shadow border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm">{c.subject}</p>
                <p className="text-xs text-gray-500">{c.category} • {c.trackingId}</p>
              </div>
              <span className="text-xs bg-cream border px-2 py-1 rounded-full">{c.status}</span>
            </div>
            <button onClick={() => downloadPdf(c.id)} className="text-xs text-saffron-deep font-semibold mt-2">
              📄 PDF डाउनलोड करें
            </button>
          </div>
        ))}
        {myComplaints.length === 0 && <p className="text-sm text-gray-400">अभी कोई शिकायत दर्ज नहीं है</p>}
      </div>
    </div>
  );
}
