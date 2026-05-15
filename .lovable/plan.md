
# SpectreOS – a GhostOS-style desktop in the browser

A web app that boots like an operating system: animated boot sequence, dark purple "spectral" desktop, taskbar/menubar, draggable resizable windows, and a dock of apps. Branded as your own (working name **SpectreOS** — easy to rename).

## Stack
- React + Vite + Tailwind (already the project default)
- Lovable Cloud for auth, profile, and per-user settings sync
- Lovable AI Gateway for the AI app
- `react-rnd` for draggable/resizable windows
- `react-markdown` for AI chat rendering

## Screens & flow
1. **Boot screen** — purple ghost-style logo, progress bar to 100%, terminal-style `[ ok ]` log lines, then fade into desktop.
2. **Auth gate** — if not signed in, show a spectral login card (email/password + Google). New users land back on desktop after signup.
3. **Desktop**
   - Top menubar: brand · File / Edit / View / Window / Help · status pills (ONLINE, FPS, GPU) · clock.
   - Desktop icons grid (double-click to open).
   - Bottom dock with quick-launch + "All Apps" launcher.
   - Window manager: focus, minimize, maximize, close, drag, resize, z-index stacking.

## Apps

Working:
- **Browser** — URL bar, back/forward/reload, loads sites in an `<iframe>` (with a friendly notice for sites that block embedding, e.g. Google).
- **GhostAI Chat** — streaming chat via Lovable AI edge function (`google/gemini-3-flash-preview`), markdown rendering, single conversation persisted to Cloud per user.
- **Games** — three built-in mini-games: Snake, 2048, Memory Match. Each runs inside a window.
- **Cloud Gaming** — catalog of game tiles; clicking opens a "streaming session" window that embeds known free browser-game URLs (e.g. itch.io embeds, GeoGuessr-style free demos) in an iframe with a fake telemetry HUD (latency/bitrate). Cosmetic streaming wrapper around real embeddable games.
- **Settings** — change accent color, wallpaper, username; saved to Cloud and applied across devices.

Cosmetic shells (open as styled windows with mock UI, no real backend):
- **Netflix** — grid of fake show posters, hover trailers (static).
- **Discover** — feed of fake news cards.
- **GhostCloud** — fake file explorer with mock folders/files.

## Data model (Lovable Cloud)
- `profiles` (id → auth.users, username, avatar_url, accent_color, wallpaper) + RLS own-row + auto-create trigger on signup.
- `ai_messages` (id, user_id, role, content, created_at) + RLS own-rows. Single conversation per user.
- `user_roles` + `app_role` enum + `has_role()` (standard pattern, ready for future admin features).

## Visual direction
Keep the spectral purple look: near-black background `#0a0612`, neon purple `#a855f7` glow, faint grid overlay, JetBrains Mono / Space Mono for terminal/HUD type, Inter for UI text. Subtle scanline + vignette. Window chrome: thin purple border, frosted dark glass, neon traffic-light controls.

## Build order
1. Enable Lovable Cloud, set up auth + profiles + RLS + trigger.
2. Design tokens, fonts, global styles, grid/scanline background.
3. Boot screen + route guard + auth page.
4. Desktop shell: menubar, dock, desktop icons, window manager.
5. Apps: Browser → AI Chat (edge function) → Games → Cloud Gaming → Settings.
6. Cosmetic shells: Netflix, Discover, GhostCloud.
7. Polish: animations, sounds (optional toggle in Settings), responsive fallback message on small screens.

## Notes / limits
- Many big sites (Google, YouTube, Netflix, etc.) block iframe embedding via `X-Frame-Options`. The Browser app will detect this and show a "site refused to connect" page — same as real browsers do in restricted contexts.
- "Cloud Gaming" cannot actually stream commercial games; it embeds real free browser games and wraps them in streaming UI.
- Mobile will show a "best on desktop" screen since the OS metaphor needs room.

## Open questions to confirm at build time
- Final app name + ghost mascot color (default: SpectreOS, purple `#a855f7`).
- Which 3–5 free embeddable games to feature in Cloud Gaming.
