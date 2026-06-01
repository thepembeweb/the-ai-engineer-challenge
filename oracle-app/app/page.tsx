"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "oracle";
  content: string;
}

const QUICK_PROMPTS = [
  { emoji: "🏆", text: "Who wins the 2026 World Cup?" },
  { emoji: "🔥", text: "Biggest upset in World Cup history?" },
  { emoji: "⚽", text: "Best World Cup team of all time?" },
  { emoji: "🥅", text: "Predict France vs Brazil" },
  { emoji: "🌟", text: "Greatest World Cup player ever?" },
];

const WELCOME =
  "Welcome to The Oracle! Ask me to predict any World Cup match, settle a debate, or take a deep dive into tournament history. The beautiful game awaits — what do you want to know?";

function OracleAvatar() {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
      style={{
        background: "linear-gradient(135deg, #b8943a 0%, #e0c060 100%)",
        boxShadow: "0 0 14px rgba(201,168,76,0.45)",
      }}
    >
      🔮
    </div>
  );
}

function SendIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 8h12M14 8l-5-5M14 8l-5 5"
        stroke={active ? "#0c1f0c" : "#c9a84c"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function renderContent(text: string) {
  return text.split("\n").map((line, li, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} style={{ color: "#e8d898", fontWeight: 600 }}>
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
    return (
      <span key={li}>
        {parts}
        {li < arr.length - 1 && <br />}
      </span>
    );
  });
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasUserMessages = messages.some((m) => m.role === "user");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    inputRef.current?.focus();

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";
      const res = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "oracle",
          content: data.reply || "The Oracle is speechless… try again!",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "oracle",
          content:
            "⚠️ Couldn't reach the backend. Make sure the API is running on port 8001.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="h-dvh flex flex-col overflow-hidden"
      style={{ background: "#060f06" }}
    >
      {/* Ambient glow layer */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 50% -10%, rgba(201,168,76,0.08) 0%, transparent 65%), radial-gradient(ellipse 70% 40% at 50% 110%, rgba(10,50,10,0.6) 0%, transparent 65%)",
        }}
      />

      {/* ── Header ── */}
      <header
        className="relative flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(201,168,76,0.18)",
          background: "rgba(6,15,6,0.85)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "#3d7a3d", minWidth: 72 }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#4ade80" }}
          />
          Live
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">🏆</span>
          <div className="text-center">
            <h1
              className="text-xl font-black tracking-[0.2em] uppercase leading-none"
              style={{ color: "#c9a84c" }}
            >
              The Oracle
            </h1>
            <p
              className="text-[9px] tracking-[0.32em] uppercase mt-0.5"
              style={{ color: "#3d6b3d" }}
            >
              2026 World Cup Predictor
            </p>
          </div>
          <span className="text-2xl leading-none">⚽</span>
        </div>

        {/* right spacer keeps title centered */}
        <div style={{ minWidth: 72 }} />
      </header>

      {/* ── Chat / Welcome ── */}
      <main className="relative flex-1 overflow-y-auto chat-scroll flex flex-col items-center">
        <div className="w-full max-w-2xl px-4 py-6 flex flex-col gap-4">
          {/* Welcome state */}
          {!hasUserMessages && (
            <>
              <div
                className="rounded-2xl p-7 text-center"
                style={{
                  background: "rgba(201,168,76,0.05)",
                  border: "1px solid rgba(201,168,76,0.14)",
                }}
              >
                <div className="text-5xl mb-4">🔮</div>
                <h2
                  className="text-base font-semibold mb-2"
                  style={{ color: "#c9a84c" }}
                >
                  Your AI-Powered World Cup Expert
                </h2>
                <p className="text-sm leading-7" style={{ color: "#9aad9a" }}>
                  {WELCOME}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.text}
                    onClick={() => sendMessage(p.text)}
                    disabled={loading}
                    className="group text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-40 cursor-pointer"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(201,168,76,0.14)",
                      color: "#b0a888",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(201,168,76,0.4)";
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(201,168,76,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(201,168,76,0.14)";
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(255,255,255,0.03)";
                    }}
                  >
                    <span className="mr-2 text-base">{p.emoji}</span>
                    <span style={{ color: "#c8c0a0" }}>{p.text}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Messages */}
          {(hasUserMessages ? messages : []).map((msg, i) => (
            <div
              key={i}
              className={
                "msg-in flex items-end gap-2 " +
                (msg.role === "user" ? "justify-end" : "justify-start")
              }
            >
              {msg.role === "oracle" && <OracleAvatar />}
              <div
                className="max-w-[78%] rounded-2xl text-sm leading-7"
                style={
                  msg.role === "oracle"
                    ? {
                        background: "rgba(255,255,255,0.045)",
                        color: "#ddd8cc",
                        border: "1px solid rgba(201,168,76,0.16)",
                        borderLeft: "3px solid rgba(201,168,76,0.55)",
                        borderBottomLeftRadius: 4,
                        padding: "18px 24px",
                      }
                    : {
                        background:
                          "linear-gradient(135deg, #c9a84c 0%, #d6b85a 100%)",
                        color: "#0c1f0c",
                        fontWeight: 600,
                        borderBottomRightRadius: 4,
                        boxShadow: "0 2px 14px rgba(201,168,76,0.22)",
                        padding: "18px 24px",
                      }
                }
              >
                {renderContent(msg.content)}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="msg-in flex items-end gap-2 justify-start">
              <OracleAvatar />
              <div
                className="rounded-2xl px-5 py-4 flex items-center gap-2"
                style={{
                  background: "rgba(255,255,255,0.045)",
                  border: "1px solid rgba(201,168,76,0.16)",
                  borderLeft: "2px solid rgba(201,168,76,0.55)",
                  borderBottomLeftRadius: 4,
                }}
              >
                {[0, 0.18, 0.36].map((delay, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: "#c9a84c",
                      animationDelay: `${delay}s`,
                      opacity: 0.75,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* ── Bottom bar ── */}
      <div
        className="relative flex-shrink-0 flex flex-col items-center"
        style={{
          background: "rgba(6,15,6,0.9)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(201,168,76,0.14)",
        }}
      >
        {/* Chips — only after conversation starts */}
        {hasUserMessages && (
          <div className="relative w-full max-w-2xl">
            <div
              className="px-4 pt-2.5 pb-0.5 flex gap-2 overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p.text}
                  onClick={() => sendMessage(p.text)}
                  disabled={loading}
                  className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap disabled:opacity-40 cursor-pointer transition-all duration-150"
                  style={{
                    background: "rgba(201,168,76,0.07)",
                    color: "#c9a84c",
                    border: "1px solid rgba(201,168,76,0.22)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(201,168,76,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(201,168,76,0.07)";
                  }}
                >
                  {p.emoji} {p.text}
                </button>
              ))}
            </div>
            {/* right fade */}
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-10"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(6,15,6,0.92))",
              }}
            />
          </div>
        )}

        {/* Input */}
        <div className="w-full max-w-2xl px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-all duration-150"
            style={{
              background: "rgba(255,255,255,0.045)",
              border: "1px solid rgba(201,168,76,0.22)",
            }}
          >
            <span className="text-base leading-none opacity-50">⚽</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask The Oracle anything about the World Cup…"
              disabled={loading}
              className="flex-1 bg-transparent outline-none text-sm disabled:opacity-50"
              style={{ color: "#e0dbd0" }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150 disabled:opacity-30 cursor-pointer"
              style={{
                background: input.trim()
                  ? "linear-gradient(135deg, #c9a84c, #d6b85a)"
                  : "rgba(201,168,76,0.15)",
              }}
              aria-label="Send"
            >
              <SendIcon active={!!input.trim()} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
