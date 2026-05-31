// frontend/src/components/DuaCard.jsx
import React from "react";

export default function DuaCard({ dua }) {
  if (!dua) return null;

  return (
    <div className="dua-card my-4 rounded-2xl overflow-hidden shadow-lg border border-emerald-200/40"
      style={{
        background: "linear-gradient(135deg, rgba(6,78,59,0.18) 0%, rgba(16,185,129,0.08) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Arabic Header Band */}
      <div
        className="px-6 py-5 text-center"
        style={{
          background: "linear-gradient(90deg, rgba(6,78,59,0.5) 0%, rgba(5,150,105,0.35) 100%)",
          borderBottom: "1px solid rgba(52,211,153,0.25)",
        }}
      >
        <p
          className="leading-loose tracking-wide text-emerald-50"
          style={{
            fontFamily: "'Amiri', 'Scheherazade New', serif",
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            direction: "rtl",
            textShadow: "0 2px 12px rgba(52,211,153,0.3)",
          }}
        >
          {dua.arabic}
        </p>
      </div>

      {/* Transliteration */}
      <div className="px-6 py-3 border-b border-emerald-700/20">
        <p
          className="text-center text-emerald-300 text-sm italic tracking-wide"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          {dua.transliteration}
        </p>
      </div>

      {/* Translation */}
      <div className="px-6 py-4">
        <p
          className="text-center text-emerald-100/90 leading-relaxed"
          style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "0.97rem" }}
        >
          "{dua.translation}"
        </p>
      </div>

      {/* Footer Meta */}
      <div
        className="px-6 py-3 flex flex-wrap gap-3 justify-between items-center text-xs"
        style={{
          borderTop: "1px solid rgba(52,211,153,0.15)",
          background: "rgba(0,0,0,0.12)",
        }}
      >
        {dua.source && (
          <span className="text-emerald-400/80 font-medium">
            📖 {dua.source}
          </span>
        )}
        {dua.occasion && (
          <span
            className="text-emerald-300/70 italic"
            style={{ fontFamily: "'Lora', serif" }}
          >
            {dua.occasion}
          </span>
        )}
      </div>
    </div>
  );
}