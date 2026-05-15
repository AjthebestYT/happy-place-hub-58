import { Rnd } from "react-rnd";
import { useWM, type WindowState } from "@/lib/window-manager";
import { X, Minus, Square } from "lucide-react";
import { BrowserApp } from "./apps/BrowserApp";
import { GhostAIApp } from "./apps/GhostAIApp";
import { GamesApp } from "./apps/GamesApp";
import {
  SettingsApp,
  CloudGamingApp,
  NetflixApp,
  DiscoverApp,
  GhostCloudApp,
} from "./apps/MiscApps";

function renderApp(w: WindowState) {
  switch (w.appId) {
    case "browser": return <BrowserApp />;
    case "ghostai": return <GhostAIApp />;
    case "games": return <GamesApp />;
    case "cloudgaming": return <CloudGamingApp />;
    case "settings": return <SettingsApp />;
    case "netflix": return <NetflixApp />;
    case "discover": return <DiscoverApp />;
    case "ghostcloud": return <GhostCloudApp />;
    default: return <div className="p-4 text-xs">Unknown app</div>;
  }
}

export function WindowFrame({ w }: { w: WindowState }) {
  const { focus, close, minimize, toggleMaximize, move, resize, windows } = useWM();
  const topZ = Math.max(...windows.map((x) => x.zIndex));
  const focused = w.zIndex === topZ;

  if (w.minimized) return null;

  return (
    <Rnd
      size={{ width: w.width, height: w.height }}
      position={{ x: w.x, y: w.y }}
      onDragStart={() => focus(w.id)}
      onDragStop={(_, d) => move(w.id, d.x, d.y)}
      onResizeStop={(_, __, ref, ___, pos) =>
        resize(w.id, pos.x, pos.y, parseInt(ref.style.width), parseInt(ref.style.height))
      }
      minWidth={360}
      minHeight={240}
      bounds="parent"
      dragHandleClassName="window-drag"
      style={{ zIndex: w.zIndex }}
      disableDragging={w.maximized}
      enableResizing={!w.maximized}
    >
      <div
        onMouseDown={() => focus(w.id)}
        className={`window-shell ${focused ? "focused" : ""} h-full w-full flex flex-col rounded-lg overflow-hidden glass`}
      >
        <div className="window-drag flex items-center justify-between px-3 h-8 bg-black/40 border-b border-white/10 select-none">
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); close(w.id); }}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400"
            />
            <button
              onClick={(e) => { e.stopPropagation(); minimize(w.id); }}
              className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400"
            />
            <button
              onClick={(e) => { e.stopPropagation(); toggleMaximize(w.id); }}
              className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400"
            />
          </div>
          <div className="font-mono text-[11px] tracking-widest text-muted-foreground">{w.title}</div>
          <div className="flex items-center gap-1 opacity-60">
            <Minus size={10} /><Square size={9} /><X size={10} />
          </div>
        </div>
        <div className="flex-1 min-h-0">{renderApp(w)}</div>
      </div>
    </Rnd>
  );
}
