import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  accent_color: string;
  wallpaper: string;
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    setProfile(data as Profile | null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Apply accent color globally
  useEffect(() => {
    if (!profile) return;
    const hex = profile.accent_color || "#a855f7";
    document.documentElement.style.setProperty("--accent-hex", hex);
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    document.documentElement.style.setProperty("--accent-rgb", `${r} ${g} ${b}`);
  }, [profile]);

  const update = useCallback(
    async (patch: Partial<Profile>) => {
      if (!user) return;
      await supabase.from("profiles").update(patch).eq("id", user.id);
      await refresh();
    },
    [user, refresh],
  );

  return { profile, loading, update, refresh };
}
