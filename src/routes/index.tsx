import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BootScreen } from "@/components/spectreos/BootScreen";
import { AuthScreen } from "@/components/spectreos/AuthScreen";
import { Desktop } from "@/components/spectreos/Desktop";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const [booted, setBooted] = useState(false);
  const { user, loading } = useAuth();
  useProfile(); // load profile + apply accent

  // Mobile fallback
  const [tooSmall, setTooSmall] = useState(false);
  useEffect(() => {
    const check = () => setTooSmall(window.innerWidth < 760);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!booted) return <BootScreen onDone={() => setBooted(true)} />;
  if (tooSmall) {
    return (
      <div className="fixed inset-0 wp-spectral-grid scanlines flex items-center justify-center p-6 text-center">
        <div>
          <div className="text-5xl mb-3 text-glow" style={{ color: "rgb(var(--accent-rgb))" }}>👻</div>
          <div className="font-mono text-sm tracking-widest">SPECTREOS REQUIRES A LARGER DISPLAY</div>
          <div className="font-mono text-xs text-muted-foreground mt-2">open on desktop to access the spectral shell</div>
        </div>
      </div>
    );
  }
  if (loading) return <div className="fixed inset-0 wp-spectral-grid" />;
  if (!user) return <AuthScreen />;
  return <Desktop />;
}
