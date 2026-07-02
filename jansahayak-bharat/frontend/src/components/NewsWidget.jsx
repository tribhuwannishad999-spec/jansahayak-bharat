import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient.js";

export default function NewsWidget() {
  const [news, setNews] = useState([]);
  useEffect(() => {
    apiClient.get("/news").then((res) => setNews(res.data)).catch(() => setNews([]));
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 shadow border border-gray-100">
      <h4 className="font-display font-bold mb-2">📰 सरकारी समाचार</h4>
      <ul className="space-y-2">
        {news.slice(0, 5).map((n, i) => (
          <li key={i}>
            <a href={n.url} target="_blank" rel="noreferrer" className="text-sm text-navy hover:underline">
              {n.title}
            </a>
            <p className="text-xs text-gray-400">{n.source}</p>
          </li>
        ))}
        {news.length === 0 && <p className="text-xs text-gray-400">कोई समाचार उपलब्ध नहीं</p>}
      </ul>
    </div>
  );
}
