import { useEffect, useState } from "react";
import { useWM, type AppId } from "@/lib/window-manager";
import { useProfile } from "@/hooks/useProfile";
import { WindowFrame } from "./WindowFrame";

const APPS: { id: AppId; name: string; icon: string }[] = [
  { id: "browser", name: "Browser", icon: "◐" },
  { id: "ghostai", name: "GhostAI", icon: "✦" },
  { id: "games", name: "Games", icon: "▣" },
  { id: "cloudgaming", name: "Cloud Gaming", icon: "☁" },
  { id: "netflix", name: "Netflix", icon: "▶" },
  { id: "discover", name: "Discover", icon: "◉" },
  { id: "ghostcloud", name: "GhostCloud", icon: "⛁" },
  { id: "settings", name: "Settings", icon: "⚙" },
];

export function Desktop() {
  const { profile } = useProfile();
  const { windows, open, focus, minimize } = useWM();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const wp = `wp-${profile?.wallpaper || "spectral-grid"}`;

  return (
    <div className={`fixed inset-0 ${wp} scanlines select-none`}>
      {/* Top menubar */}
      <div className="absolute top-0 left-0 right-0 h-8 glass border-b border-white/10 flex items-center px-3 gap-4 text-[11px] font-mono z-[1000]">
        <div className="flex items-center gap-1.5 text-glow" style={{ color: "rgb(var(--accent-rgb))" }}>
          <span>👻</span><span className="tracking-[0.3em] font-bold">SPECTREOS</span>
        </div>
        <div className="flex gap-3 text-muted-foreground">
          {["File", "Edit", "View", "Window", "Help"].map((m) => (
            <span key={m} className="hover:text-foreground cursor-default">{m}</span>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3 text-muted-foreground">
          <span><span style={{ color: "rgb(var(--accent-rgb))" }}>●</span> SPECTRAL</span>
          <span>144FPS</span>
          <span>{profile?.username ?? "ghost"}</span>
          <span className="text-foreground">
            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Desktop icons */}
      <div className="absolute top-12 left-6 grid grid-cols-1 gap-4 z-[1]">
        {APPS.slice(0, 6).map((a) => (
          <button
            key={a.id}
            onDoubleClick={() => open(a.id)}
            onClick={() => open(a.id)}
            className="flex flex-col items-center gap-1 w-20 p-2 rounded hover:bg-white/5"
          >
            <div
              className="w-12 h-12 rounded-lg glass flex items-center justify-center text-xl text-glow"
              style={{ color: "rgb(var(--accent-rgb))" }}
            >
              {a.icon}
            </div>
            <div className="text-[10px] font-mono">{a.name}</div>
          </button>
        ))}
      </div>

      {/* Windows */}
      <div className="absolute inset-0 top-8 bottom-16">
        {windows.map((w) => <WindowFrame key={w.id} w={w} />)}
      </div>

      {/* Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="glass rounded-2xl px-3 py-2 flex items-end gap-2 glow">
          {APPS.map((a) => {
            const win = windows.find((w) => w.appId === a.id);
            return (
              <button
                key={a.id}
                onClick={() => {
                  if (win) {
                    if (win.minimized) minimize(win.id);
                    focus(win.id);
                  } else open(a.id);
                }}
                title={a.name}
                className="relative w-12 h-12 rounded-xl flex items-center justify-center text-xl glass hover:scale-110 transition"
                style={{ color: "rgb(var(--accent-rgb))" }}
              >
                {a.icon}
                {win && (
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: "rgb(var(--accent-rgb))" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
