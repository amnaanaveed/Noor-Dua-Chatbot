// frontend/src/app.jsx
import React from "react";
import ChatBox from "./components/ChatBox";

export default function App() {
  return (
    <div
      className="h-screen w-full flex flex-col overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(6,78,59,0.45) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(5,150,105,0.2) 0%, transparent 50%),
          radial-gradient(ellipse at 60% 90%, rgba(4,120,87,0.3) 0%, transparent 55%),
          #020d08
        `,
        fontFamily: "'Lora', Georgia, serif",
      }}
    >
      {/* Subtle geometric pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <header
        className="relative z-10 flex flex-col items-center pt-8 pb-4"
        style={{ borderBottom: "1px solid rgba(52,211,153,0.1)" }}
      >
        {/* Bismillah */}
        <p
          className="text-emerald-400/60 text-xl mb-3"
          style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", direction: "rtl" }}
        >
          بِسْمِ اللَّهِ
        </p>

        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
              boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
            }}
          >
            ن
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-emerald-100 tracking-tight"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              Noor
            </h1>
            <p
              className="text-emerald-500/80 text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Lora', serif", letterSpacing: "0.15em" }}
            >
              Islamic Dua Companion
            </p>
          </div>
        </div>

        <p
          className="mt-3 text-emerald-600/70 text-sm italic"
          style={{ fontFamily: "'Lora', serif" }}
        >
          "Verily, with hardship comes ease." — Quran 94:6
        </p>
      </header>

      {/* Chat Area */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <ChatBox />
      </main>

      {/* Google Fonts import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&family=Lora:ital,wght@0,400;0,600;1,400&family=Scheherazade+New:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}