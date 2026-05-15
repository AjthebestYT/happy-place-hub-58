import { useEffect, useState } from "react";

const LINES = [
  "spectral-core online",
  "quantum-bridge handshake complete",
  "neural-mesh 4096 nodes synced",
  "vault.fs decrypted",
  "ghostai.daemon awakening",
  "desktop.shell ready",
];

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState<string[]>([]);

  useEffect(() => {
    const t1 = setInterval(() => {
      setProgress((p) => {
        const n = p + Math.random() * 14 + 4;
        if (n >= 100) {
          clearInterval(t1);
          return 100;
        }
        return n;
      });
    }, 180);
    return () => clearInterval(t1);
  }, []);

  useEffect(() => {
    let i = 0;
    const t2 = setInterval(() => {
      setShown((s) => {
        if (i >= LINES.length) {
          clearInterval(t2);
          return s;
        }
        const next = [...s, LINES[i]];
        i++;
        return next;
      });
    }, 320);
    return () => clearInterval(t2);
  }, []);

  useEffect(() => {
    if (progress >= 100 && shown.length >= LINES.length) {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
  }, [progress, shown.length, onDone]);

  return (
    <div className="fixed inset-0 wp-spectral-grid scanlines flex items-center justify-center">
      <div className="w-full max-w-xl px-6 text-center">
        <div className="float-ghost mx-auto mb-6 text-7xl text-glow" style={{ color: "rgb(var(--accent-rgb))" }}>
          👻
        </div>
        <h1
          className="text-4xl font-mono tracking-[0.4em] text-glow"
          style={{ color: "rgb(var(--accent-rgb))" }}
        >
          SPECTREOS
        </h1>
        <div className="mt-2 text-xs font-mono tracking-[0.3em] text-muted-foreground">
          v1.0.0 · SPECTRAL CORE
        </div>

        <div className="mt-8 h-[2px] w-full bg-white/5 overflow-hidden rounded-full">
          <div
            className="h-full glow"
            style={{
              width: `${Math.min(100, progress)}%`,
              background: "linear-gradient(90deg, rgb(var(--accent-rgb)), #00d9ff)",
              transition: "width .15s linear",
            }}
          />
        </div>
        <div className="text-right text-xs font-mono mt-1 text-muted-foreground">
          {Math.floor(Math.min(100, progress))}%
        </div>

        <div className="mt-6 glass rounded-md p-4 text-left font-mono text-[12px] leading-6 min-h-[180px]">
          {shown.map((l, i) => (
            <div key={i}>
              <span className="text-muted-foreground">›</span>{" "}
              <span style={{ color: "rgb(var(--accent-rgb))" }}>[ ok ]</span>{" "}
              <span className="text-foreground/80">{l}</span>
            </div>
          ))}
          {shown.length < LINES.length && <div className="cursor-blink" />}
        </div>
      </div>
    </div>
  );
}
