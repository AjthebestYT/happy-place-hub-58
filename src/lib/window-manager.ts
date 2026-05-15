import { create } from "zustand";

export type AppId =
  | "browser"
  | "ghostai"
  | "games"
  | "cloudgaming"
  | "settings"
  | "netflix"
  | "discover"
  | "ghostcloud"
  | "terminal";

export type WindowState = {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; width: number; height: number };
  payload?: any;
};

type Store = {
  windows: WindowState[];
  zCounter: number;
  open: (appId: AppId, opts?: { title?: string; payload?: any }) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, x: number, y: number, w: number, h: number) => void;
};

const TITLES: Record<AppId, string> = {
  browser: "Browser",
  ghostai: "GhostAI",
  games: "Games",
  cloudgaming: "Cloud Gaming",
  settings: "Settings",
  netflix: "Netflix",
  discover: "Discover",
  ghostcloud: "GhostCloud",
  terminal: "Terminal",
};

const SIZES: Partial<Record<AppId, { w: number; h: number }>> = {
  browser: { w: 1000, h: 680 },
  ghostai: { w: 720, h: 640 },
  games: { w: 720, h: 600 },
  cloudgaming: { w: 1100, h: 700 },
  settings: { w: 640, h: 560 },
  netflix: { w: 1000, h: 640 },
  discover: { w: 720, h: 640 },
  ghostcloud: { w: 800, h: 560 },
  terminal: { w: 700, h: 440 },
};

let openOffset = 0;

export const useWM = create<Store>((set, get) => ({
  windows: [],
  zCounter: 10,
  open: (appId, opts) => {
    const existing = get().windows.find((w) => w.appId === appId && !opts?.payload);
    if (existing) {
      get().focus(existing.id);
      if (existing.minimized) {
        set({ windows: get().windows.map((w) => (w.id === existing.id ? { ...w, minimized: false } : w)) });
      }
      return;
    }
    const id = `${appId}-${Date.now()}`;
    const size = SIZES[appId] ?? { w: 800, h: 560 };
    const z = get().zCounter + 1;
    openOffset = (openOffset + 30) % 180;
    const x = Math.max(20, Math.round(window.innerWidth / 2 - size.w / 2) + openOffset - 60);
    const y = Math.max(40, Math.round(window.innerHeight / 2 - size.h / 2) + openOffset - 60);
    set({
      zCounter: z,
      windows: [
        ...get().windows,
        {
          id,
          appId,
          title: opts?.title ?? TITLES[appId],
          x,
          y,
          width: size.w,
          height: size.h,
          zIndex: z,
          minimized: false,
          maximized: false,
          payload: opts?.payload,
        },
      ],
    });
  },
  close: (id) => set({ windows: get().windows.filter((w) => w.id !== id) }),
  focus: (id) => {
    const z = get().zCounter + 1;
    set({
      zCounter: z,
      windows: get().windows.map((w) => (w.id === id ? { ...w, zIndex: z, minimized: false } : w)),
    });
  },
  minimize: (id) =>
    set({ windows: get().windows.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)) }),
  toggleMaximize: (id) => {
    const w = get().windows.find((x) => x.id === id);
    if (!w) return;
    if (w.maximized && w.prev) {
      set({
        windows: get().windows.map((x) =>
          x.id === id ? { ...x, ...w.prev!, maximized: false, prev: undefined } : x,
        ),
      });
    } else {
      const prev = { x: w.x, y: w.y, width: w.width, height: w.height };
      set({
        windows: get().windows.map((x) =>
          x.id === id
            ? {
                ...x,
                maximized: true,
                prev,
                x: 0,
                y: 32,
                width: window.innerWidth,
                height: window.innerHeight - 32 - 72,
              }
            : x,
        ),
      });
    }
  },
  move: (id, x, y) =>
    set({ windows: get().windows.map((w) => (w.id === id ? { ...w, x, y } : w)) }),
  resize: (id, x, y, width, height) =>
    set({ windows: get().windows.map((w) => (w.id === id ? { ...w, x, y, width, height } : w)) }),
}));
