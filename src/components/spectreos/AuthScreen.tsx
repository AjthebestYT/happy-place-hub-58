import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { username: username || email.split("@")[0] },
          },
        });
        if (error) throw error;
        setInfo("Check your email to verify, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e: any) {
      setErr(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    setErr(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setErr(result.error.message ?? "Google sign-in failed");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 wp-spectral-grid scanlines flex items-center justify-center px-4">
      <div className="w-full max-w-sm glass rounded-lg p-7 glow">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2 text-glow" style={{ color: "rgb(var(--accent-rgb))" }}>
            👻
          </div>
          <h1
            className="font-mono tracking-[0.35em] text-2xl text-glow"
            style={{ color: "rgb(var(--accent-rgb))" }}
          >
            SPECTREOS
          </h1>
          <div className="text-xs font-mono text-muted-foreground mt-1">
            {mode === "signin" ? "ACCESS REQUIRED" : "NEW IDENTITY"}
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input
              className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[rgb(var(--accent-rgb))]"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            type="email"
            required
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[rgb(var(--accent-rgb))]"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            minLength={6}
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[rgb(var(--accent-rgb))]"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <div className="text-xs text-destructive font-mono">{err}</div>}
          {info && <div className="text-xs font-mono text-muted-foreground">{info}</div>}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2 rounded font-mono text-sm tracking-widest text-black disabled:opacity-50"
            style={{ background: "rgb(var(--accent-rgb))" }}
          >
            {busy ? "..." : mode === "signin" ? "AUTHENTICATE" : "INITIALIZE"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
          <div className="flex-1 h-px bg-white/10" /> OR <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={google}
          disabled={busy}
          className="w-full py-2 rounded font-mono text-xs tracking-widest border border-white/15 hover:border-[rgb(var(--accent-rgb))] transition-colors"
        >
          CONTINUE WITH GOOGLE
        </button>

        <div className="mt-5 text-center text-xs font-mono text-muted-foreground">
          {mode === "signin" ? (
            <>
              No identity?{" "}
              <button onClick={() => setMode("signup")} className="text-[rgb(var(--accent-rgb))] underline">
                create one
              </button>
            </>
          ) : (
            <>
              Already a ghost?{" "}
              <button onClick={() => setMode("signin")} className="text-[rgb(var(--accent-rgb))] underline">
                sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
