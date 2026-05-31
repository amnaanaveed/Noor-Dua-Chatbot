// frontend/src/components/Message.jsx
import React from "react";
import DuaCard from "./DuaCard";

function parseReply(reply) {
  const marker = "__DUA_JSON__:";
  const idx = reply.indexOf(marker);
  if (idx === -1) return { narrative: reply, dua: null };

  const narrative = reply.slice(0, idx).trim();
  try {
    const dua = JSON.parse(reply.slice(idx + marker.length).trim());
    return { narrative, dua };
  } catch {
    return { narrative: reply, dua: null };
  }
}

export default function Message({ role, content }) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 px-1">
        <div
          className="max-w-[75%] px-5 py-3 rounded-2xl rounded-br-sm text-white text-sm leading-relaxed shadow-md"
          style={{
            background: "linear-gradient(135deg, #065f46 0%, #047857 100%)",
            fontFamily: "'Lora', Georgia, serif",
            boxShadow: "0 4px 20px rgba(5,150,105,0.3)",
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  const { narrative, dua } = parseReply(content);

  return (
    <div className="flex justify-start mb-4 px-1">
      <div className="max-w-[85%] w-full">
        {/* Bot avatar + name */}
        <div className="flex items-center gap-2 mb-2 ml-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #064e3b, #10b981)" }}
          >
            ن
          </div>
          <span
            className="text-emerald-400 text-xs font-semibold tracking-wide"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Noor
          </span>
        </div>

        {/* Narrative text */}
        {narrative && (
          <div
            className="px-5 py-4 rounded-2xl rounded-tl-sm text-emerald-50/90 text-sm leading-relaxed"
            style={{
              background: "rgba(6,78,59,0.25)",
              border: "1px solid rgba(52,211,153,0.15)",
              fontFamily: "'Lora', Georgia, serif",
              backdropFilter: "blur(8px)",
              whiteSpace: "pre-wrap",
            }}
          >
            {narrative}
          </div>
        )}

        {/* Dua Card */}
        {dua && <DuaCard dua={dua} />}
      </div>
    </div>
  );
}