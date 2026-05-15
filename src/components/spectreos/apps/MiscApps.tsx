import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

const ACCENTS = ["#a855f7", "#00d9ff", "#ff3a78", "#7dff70", "#ffb800", "#ff6b35"];
const WALLPAPERS = [
  { id: "spectral-grid", name: "Spectral Grid" },
  { id: "void", name: "Void" },
  { id: "aurora", name: "Aurora" },
  { id: "matrix", name: "Matrix" },
];

export function SettingsApp() {
  const { profile, update } = useProfile();
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  useEffect(() => {
    if (profile) setUsername(profile.username || "");
  }, [profile]);

  if (!profile) return <div className="p-6 font-mono text-xs">loading…</div>;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 font-mono text-xs">
      <div>
        <div className="text-muted-foreground mb-2 tracking-widest">USERNAME</div>
        <div className="flex gap-2">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-[rgb(var(--accent-rgb))]"
          />
          <button
            onClick={() => update({ username })}
            className="px-3 rounded text-black"
            style={{ background: "rgb(var(--accent-rgb))" }}
          >
            SAVE
          </button>
        </div>
        <div className="mt-1 text-muted-foreground">{user?.email}</div>
      </div>

      <div>
        <div className="text-muted-foreground mb-2 tracking-widest">ACCENT COLOR</div>
        <div className="flex gap-2">
          {ACCENTS.map((c) => (
            <button
              key={c}
              onClick={() => update({ accent_color: c })}
              className="w-8 h-8 rounded-full border-2"
              style={{
                background: c,
                borderColor: profile.accent_color === c ? "white" : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="text-muted-foreground mb-2 tracking-widest">WALLPAPER</div>
        <div className="grid grid-cols-2 gap-3">
          {WALLPAPERS.map((w) => (
            <button
              key={w.id}
              onClick={() => update({ wallpaper: w.id })}
              className={`h-20 rounded border-2 wp-${w.id} flex items-end p-2`}
              style={{ borderColor: profile.wallpaper === w.id ? "rgb(var(--accent-rgb))" : "transparent" }}
            >
              <span>{w.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <button
          onClick={() => supabase.auth.signOut()}
          className="px-4 py-2 rounded border border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          SIGN OUT
        </button>
      </div>
    </div>
  );
}

// Cloud Gaming - real free embeddable games via itch.io
const CG_GAMES = [
  { id: "narrow-one", name: "Narrow One", url: "https://pelicangames.itch.io/narrow-one", img: "🏹" },
  { id: "townscaper", name: "Drift", url: "https://www.crazygames.com/embed/drift-hunters", img: "🏎️" },
  { id: "2048", name: "2048", url: "https://play2048.co/", img: "⚡" },
  { id: "agar", name: "Agar.io clone", url: "https://www.crazygames.com/embed/blob-io", img: "🟣" },
  { id: "chess", name: "Chess", url: "https://lichess.org", img: "♛" },
  { id: "geo", name: "Geo Game", url: "https://www.geoguessr.com/", img: "🌍" },
];
export function CloudGamingApp() {
  const [active, setActive] = useState<typeof CG_GAMES[0] | null>(null);
  const [latency] = useState(() => 12 + Math.floor(Math.random() * 18));
  if (active) {
    return (
      <div className="h-full flex flex-col bg-black">
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/50 font-mono text-[10px]">
          <button onClick={() => setActive(null)} className="hover:text-[rgb(var(--accent-rgb))]">
            ← LIBRARY
          </button>
          <div className="flex gap-4 text-muted-foreground">
            <span>STREAM <span style={{ color: "rgb(var(--accent-rgb))" }}>● LIVE</span></span>
            <span>{latency}ms</span>
            <span>1080p · 60fps</span>
            <span>BITRATE 24Mbps</span>
          </div>
        </div>
        <iframe
          src={active.url}
          className="flex-1 w-full bg-black"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          allow="fullscreen; autoplay; gamepad"
        />
      </div>
    );
  }
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="font-mono text-xs text-muted-foreground tracking-widest mb-4">
        ▸ SPECTRAL CLOUD · INSTANT PLAY
      </div>
      <div className="grid grid-cols-3 gap-4">
        {CG_GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(g)}
            className="aspect-video rounded-lg border border-white/10 hover:border-[rgb(var(--accent-rgb))] bg-gradient-to-br from-purple-900/40 to-black/40 p-4 flex flex-col justify-between text-left transition"
          >
            <div className="text-5xl">{g.img}</div>
            <div>
              <div className="font-mono text-sm">{g.name}</div>
              <div className="text-[10px] text-muted-foreground font-mono">▸ STREAM</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function NetflixApp() {
  const rows = [
    { t: "Trending in the Spectrum", items: ["Spectre", "Phantom Code", "Voidwalker", "Neon Hollow", "Echoes"] },
    { t: "Watch Again", items: ["Ghost Protocol", "Dark Bridge", "Quantum", "Drifter"] },
    { t: "Spectral Originals", items: ["The Vault", "Daemon", "404 Souls", "Specter Run", "Mesh"] },
  ];
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-red-950/20 to-black p-6 space-y-6">
      <div className="text-3xl font-bold tracking-tight" style={{ color: "#e50914" }}>
        GHOSTFLIX
      </div>
      <div className="aspect-[21/9] rounded-lg bg-gradient-to-r from-purple-900 to-black flex items-end p-6">
        <div>
          <div className="text-2xl font-bold">Spectre: The Reckoning</div>
          <div className="text-xs text-muted-foreground max-w-md mt-1">
            A rogue daemon awakens in the mesh. Only one ghost can stop it.
          </div>
        </div>
      </div>
      {rows.map((r) => (
        <div key={r.t}>
          <div className="text-sm font-semibold mb-2">{r.t}</div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {r.items.map((i) => (
              <div
                key={i}
                className="min-w-[160px] aspect-[2/3] rounded bg-gradient-to-br from-purple-800/40 to-black border border-white/5 p-3 flex items-end font-semibold text-sm"
              >
                {i}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DiscoverApp() {
  const cards = [
    { t: "Quantum bridge handshake reaches new latency record", k: "TECH" },
    { t: "Neural mesh nodes hit 8192 in latest spectral release", k: "MESH" },
    { t: "GhostAI passes the Turing-Spectre eval", k: "AI" },
    { t: "Cloud gaming beats native FPS on Spectral GPU", k: "GAMES" },
    { t: "Vault.fs encryption hardened against ghost-in-the-machine", k: "SECURITY" },
  ];
  return (
    <div className="h-full overflow-y-auto p-6 space-y-3">
      <div className="font-mono text-xs text-muted-foreground tracking-widest">▸ FEED</div>
      {cards.map((c, i) => (
        <div key={i} className="glass rounded p-4">
          <div className="text-[10px] font-mono mb-1" style={{ color: "rgb(var(--accent-rgb))" }}>
            {c.k}
          </div>
          <div className="text-sm">{c.t}</div>
        </div>
      ))}
    </div>
  );
}

export function GhostCloudApp() {
  const folders = ["Documents", "Vaults", "Memories", "Daemons", "Archives"];
  const files = ["spectre.key", "manifest.spec", "ghostai.log", "boot.cfg", "wallpaper.bin"];
  return (
    <div className="h-full flex font-mono text-xs">
      <div className="w-44 border-r border-white/10 p-3 space-y-1">
        <div className="text-muted-foreground tracking-widest mb-2">▸ VAULT</div>
        {folders.map((f) => (
          <div key={f} className="px-2 py-1 rounded hover:bg-white/5 cursor-pointer">📁 {f}</div>
        ))}
      </div>
      <div className="flex-1 p-4 grid grid-cols-4 gap-3 content-start">
        {files.map((f) => (
          <div key={f} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/5">
            <div className="text-3xl">📄</div>
            <div className="text-[10px] truncate w-full text-center">{f}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
