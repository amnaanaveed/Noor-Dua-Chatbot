// frontend/src/components/ChatBox.jsx
import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
import { sendMessage } from "../services/api";

const WELCOME = {
  role: "bot",
  content:
    "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\n\nAs-salāmu ʿalaykum. I am Noor, your compassionate companion in moments of difficulty. Whatever is weighing on your heart — share it with me, and I will offer the gentle light of Dua to guide you. You are never alone. 💚",
};

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4 px-1">
      <div
        className="px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1"
        style={{
          background: "rgba(6,78,59,0.25)",
          border: "1px solid rgba(52,211,153,0.15)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-400 inline-block"
            style={{
              animation: "bounce 1.2s infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatBox() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessage(text);
      setMessages((prev) => [...prev, { role: "bot", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Forgive me — I encountered an error reaching the server. Please try again in a moment. May Allah ease your wait. 🤲",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col w-full h-full max-w-2xl mx-auto"
      style={{ minHeight: 0 }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div
        className="px-4 pb-6 pt-3"
        style={{ borderTop: "1px solid rgba(52,211,153,0.12)" }}
      >
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-3"
          style={{
            background: "rgba(6,78,59,0.3)",
            border: "1px solid rgba(52,211,153,0.25)",
            backdropFilter: "blur(10px)",
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your heart…"
            className="flex-1 bg-transparent resize-none outline-none text-emerald-100 placeholder-emerald-600 text-sm leading-relaxed"
            style={{
              fontFamily: "'Lora', Georgia, serif",
              maxHeight: "120px",
              overflowY: "auto",
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #065f46, #10b981)",
              boxShadow: loading ? "none" : "0 4px 15px rgba(16,185,129,0.35)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-white"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
        <p
          className="text-center text-emerald-700/60 text-xs mt-2"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
}