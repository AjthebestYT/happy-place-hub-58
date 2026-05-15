import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useGhostAI } from "@/hooks/useGhostAI";
import { Trash2, Send } from "lucide-react";

export function GhostAIApp() {
  const { messages, send, streaming, clear } = useGhostAI();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || streaming) return;
    send(input);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/30">
        <div className="font-mono text-xs">
          <span style={{ color: "rgb(var(--accent-rgb))" }}>●</span> ghostai.daemon
        </div>
        <button
          onClick={clear}
          title="clear conversation"
          className="p-1 rounded hover:bg-white/10 text-muted-foreground"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground font-mono pt-10">
            <div className="text-4xl mb-3 float-ghost text-glow" style={{ color: "rgb(var(--accent-rgb))" }}>
              👻
            </div>
            ask the ghost anything.
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
            {m.role === "user" ? (
              <div
                className="max-w-[80%] rounded-lg px-3 py-2 text-sm"
                style={{ background: "rgb(var(--accent-rgb))", color: "#0a0612" }}
              >
                {m.content}
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed">
                <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="p-3 border-t border-white/10 flex gap-2 bg-black/30">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={streaming ? "ghost is thinking…" : "message ghostai"}
          disabled={streaming}
          className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-[rgb(var(--accent-rgb))]"
        />
        <button
          disabled={streaming || !input.trim()}
          className="px-3 rounded text-black disabled:opacity-40"
          style={{ background: "rgb(var(--accent-rgb))" }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
