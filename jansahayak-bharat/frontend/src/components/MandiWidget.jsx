import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient.js";

export default function MandiWidget({ state }) {
  const [rates, setRates] = useState([]);
  useEffect(() => {
    apiClient
      .get("/mandi", { params: state ? { state } : {} })
      .then((res) => setRates(res.data))
      .catch(() => setRates([]));
  }, [state]);

  return (
    <div className="bg-white rounded-2xl p-4 shadow border border-gray-100">
      <h4 className="font-display font-bold mb-2">📊 मंडी भाव</h4>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {rates.slice(0, 8).map((r, i) => (
          <div key={i} className="flex justify-between text-sm border-b border-gray-100 py-1">
            <span>{r.commodity} ({r.market})</span>
            <span className="font-semibold">₹{r.modal_price}</span>
          </div>
        ))}
        {rates.length === 0 && <p className="text-xs text-gray-400">डेटा उपलब्ध नहीं</p>}
      </div>
    </div>
  );
}
