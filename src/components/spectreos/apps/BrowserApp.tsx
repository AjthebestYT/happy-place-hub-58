import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Home } from "lucide-react";

export function BrowserApp() {
  const [input, setInput] = useState("https://en.wikipedia.org/wiki/Ghost");
  const [history, setHistory] = useState<string[]>(["https://en.wikipedia.org/wiki/Ghost"]);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);

  const current = history[index];

  const navigate = (raw: string) => {
    let url = raw.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      if (url.includes(".") && !url.includes(" ")) url = "https://" + url;
      else url = "https://duckduckgo.com/?q=" + encodeURIComponent(url);
    }
    const next = [...history.slice(0, index + 1), url];
    setHistory(next);
    setIndex(next.length - 1);
    setInput(url);
  };

  return (
    <div className="h-full flex flex-col bg-black/30">
      <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-black/30">
        <button
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30"
          disabled={index === 0}
          onClick={() => {
            const i = index - 1;
            setIndex(i);
            setInput(history[i]);
          }}
        >
          <ArrowLeft size={14} />
        </button>
        <button
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30"
          disabled={index >= history.length - 1}
          onClick={() => {
            const i = index + 1;
            setIndex(i);
            setInput(history[i]);
          }}
        >
          <ArrowRight size={14} />
        </button>
        <button className="p-1.5 rounded hover:bg-white/10" onClick={() => setKey((k) => k + 1)}>
          <RotateCw size={14} />
        </button>
        <button
          className="p-1.5 rounded hover:bg-white/10"
          onClick={() => navigate("https://duckduckgo.com/")}
        >
          <Home size={14} />
        </button>
        <form
          className="flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-1 text-xs font-mono focus:outline-none focus:border-[rgb(var(--accent-rgb))]"
            placeholder="search or enter URL"
          />
        </form>
      </div>
      <div className="flex-1 relative bg-white">
        <iframe
          key={key + current}
          src={current}
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-black/50 bg-white/70 px-2 py-0.5 rounded pointer-events-none">
          some sites block embedding
        </div>
      </div>
    </div>
  );
}
