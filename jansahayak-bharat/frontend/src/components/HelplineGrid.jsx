import React from "react";

const HELPLINES = [
  { num: "112", label: "आपातकाल" },
  { num: "100", label: "पुलिस" },
  { num: "101", label: "फायर" },
  { num: "102", label: "एम्बुलेंस" },
  { num: "108", label: "आपातकालीन सेवा" },
  { num: "1098", label: "चाइल्डलाइन" },
  { num: "1091", label: "महिला हेल्पलाइन" },
  { num: "1930", label: "साइबर क्राइम" },
];

export default function HelplineGrid() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {HELPLINES.map((h) => (
        <a
          key={h.num}
          href={`tel:${h.num}`}
          className="bg-navy text-white rounded-xl py-3 text-center flex flex-col items-center gap-1"
        >
          <span className="font-bold">{h.num}</span>
          <span className="text-[10px] opacity-90">{h.label}</span>
        </a>
      ))}
    </div>
  );
}
