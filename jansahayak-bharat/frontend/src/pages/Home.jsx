import React from "react";
import { Link } from "react-router-dom";

import SearchBar from "../components/SearchBar.jsx";
import HelplineGrid from "../components/HelplineGrid.jsx";
import WeatherWidget from "../components/WeatherWidget.jsx";
import NewsWidget from "../components/NewsWidget.jsx";
import MandiWidget from "../components/MandiWidget.jsx";
import AIChat from "../components/AIChat.jsx";

export default function Home() {

  const search = (q) => {
    window.location.href = `/schemes?q=${encodeURIComponent(q)}`;
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">

      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-white to-green-500 opacity-10"></div>

        <div className="relative max-w-6xl mx-auto px-5 py-16 text-center">

          <div className="inline-flex items-center gap-2 bg-white shadow rounded-full px-5 py-2 mb-6">

            🇮🇳

            <span className="text-sm font-semibold text-gray-700">

              Digital Government Platform

            </span>

          </div>

          <h1 className="text-4xl md:text-6xl font-black text-blue-900 leading-tight">

            जनसहायक भारत

          </h1>

          <p className="mt-4 text-lg text-gray-700">

            गांव से भारत तक हर सरकारी सेवा अब एक जगह।

          </p>

          <p className="text-orange-600 font-semibold mt-2">

            योजनाएँ • नौकरी • मौसम • मंडी भाव • AI सहायक

          </p>

          <div className="mt-8">

            <SearchBar onSearch={search} />

          </div>

        </div>

      </section>

      {/* QUICK SERVICES */}

      <section className="max-w-6xl mx-auto px-5 mt-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          <Link
            to="/schemes"
            className="bg-white rounded-3xl p-6 shadow-lg hover:scale-105 transition"
          >
            <div className="text-5xl">🏛</div>

            <h3 className="font-bold mt-3">

              योजनाएँ

            </h3>

            <p className="text-sm text-gray-500">

              सभी सरकारी योजनाएँ

            </p>

          </Link>

          <Link
            to="/jobs"
            className="bg-white rounded-3xl p-6 shadow-lg hover:scale-105 transition"
          >
            <div className="text-5xl">

              💼

            </div>

            <h3 className="font-bold mt-3">

              नौकरियाँ

            </h3>

            <p className="text-sm text-gray-500">

              Latest Jobs

            </p>

          </Link>

          <Link
            to="/complaints"
            className="bg-white rounded-3xl p-6 shadow-lg hover:scale-105 transition"
          >
            <div className="text-5xl">

              📢

            </div>

            <h3 className="font-bold mt-3">

              शिकायत

            </h3>

            <p className="text-sm text-gray-500">

              Online Complaint

            </p>

          </Link>

          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <div className="text-5xl">

              🤖

            </div>

            <h3 className="font-bold mt-3">

              AI सहायक

            </h3>

            <p className="text-sm text-gray-500">

              24×7 सहायता

            </p>

          </div>

        </div>

      </section>

      {/* LIVE WIDGETS */}

      <section className="max-w-6xl mx-auto px-5 mt-10">

        <div className="grid md:grid-cols-3 gap-5">

          <WeatherWidget />

          <MandiWidget />

          <NewsWidget />

        </div>

      </section>

      {/* HELPLINES */}

      <section className="max-w-6xl mx-auto px-5 mt-10">

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-5">

            📞 जरूरी हेल्पलाइन

          </h2>

          <HelplineGrid />

        </div>

      </section>

      {/* AI */}

      <section className="max-w-6xl mx-auto px-5 mt-10 mb-20">

        <AIChat />

      </section>

    </div>

  );

}
