import React from "react";
import SearchBar from "../components/SearchBar.jsx";
import HelplineGrid from "../components/HelplineGrid.jsx";
import WeatherWidget from "../components/WeatherWidget.jsx";
import NewsWidget from "../components/NewsWidget.jsx";
import MandiWidget from "../components/MandiWidget.jsx";
import AIChat from "../components/AIChat.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <section className="text-center py-10 px-4">
        <h1 className="font-display font-bold text-2xl md:text-3xl">
          गांव से भारत तक — <br /> हर सरकारी जानकारी एक जगह
        </h1>
        <p className="text-saffron-deep font-semibold mt-2">आपकी शिकायत, योजना, नौकरी और मदद — एक ही मंच पर</p>
        <div className="mt-6"><SearchBar onSearch={(q) => (window.location.href = `/schemes?q=${encodeURIComponent(q)}`)} /></div>
      </section>

      <main className="max-w-5xl mx-auto px-4 pb-12 space-y-10">
        <section>
          <h2 className="font-display font-bold text-lg mb-3">📞 जरूरी हेल्पलाइन</h2>
          <HelplineGrid />
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          <WeatherWidget />
          <MandiWidget />
          <NewsWidget />
        </section>

        <section>
          <AIChat />
        </section>

        <section className="grid sm:grid-cols-2 gap-4">
          <Link to="/schemes" className="bg-white rounded-2xl p-5 shadow border border-gray-100 block">
            <h3 className="font-display font-bold">🏛 सरकारी योजनाएँ देखें</h3>
            <p className="text-sm text-gray-500 mt-1">किसान, महिला, छात्रवृत्ति और आवास योजनाएँ</p>
          </Link>
          <Link to="/jobs" className="bg-white rounded-2xl p-5 shadow border border-gray-100 block">
            <h3 className="font-display font-bold">💼 सरकारी नौकरियाँ देखें</h3>
            <p className="text-sm text-gray-500 mt-1">रेलवे, SSC, UPSC, पुलिस और अधिक</p>
          </Link>
        </section>
      </main>
    </div>
  );
}
