import { useEffect, useRef, useState, useCallback } from "react";

type Dir = "up" | "down" | "left" | "right";
const SIZE = 20;

export function SnakeGame() {
  const [snake, setSnake] = useState<[number, number][]>([[10, 10]]);
  const [food, setFood] = useState<[number, number]>([5, 5]);
  const [dir, setDir] = useState<Dir>("right");
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  const reset = () => {
    setSnake([[10, 10]]);
    setFood([5, 5]);
    setDir("right");
    setScore(0);
    setDead(false);
    setRunning(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const nd = map[e.key];
      if (!nd) return;
      const opposite: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };
      if (opposite[nd] === dirRef.current) return;
      setDir(nd);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const delta: Record<Dir, [number, number]> = {
          up: [0, -1],
          down: [0, 1],
          left: [-1, 0],
          right: [1, 0],
        };
        const [dx, dy] = delta[dirRef.current];
        const nh: [number, number] = [head[0] + dx, head[1] + dy];
        if (nh[0] < 0 || nh[1] < 0 || nh[0] >= SIZE || nh[1] >= SIZE) {
          setDead(true);
          setRunning(false);
          return prev;
        }
        if (prev.some(([x, y]) => x === nh[0] && y === nh[1])) {
          setDead(true);
          setRunning(false);
          return prev;
        }
        const ate = nh[0] === food[0] && nh[1] === food[1];
        const newSnake = [nh, ...prev];
        if (!ate) newSnake.pop();
        else {
          setScore((s) => s + 10);
          let nf: [number, number];
          do {
            nf = [Math.floor(Math.random() * SIZE), Math.floor(Math.random() * SIZE)];
          } while (newSnake.some(([x, y]) => x === nf[0] && y === nf[1]));
          setFood(nf);
        }
        return newSnake;
      });
    }, 110);
    return () => clearInterval(t);
  }, [running, food]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 gap-3">
      <div className="flex items-center gap-6 font-mono text-xs">
        <span>SCORE: <span style={{ color: "rgb(var(--accent-rgb))" }}>{score}</span></span>
        {dead && <span className="text-destructive">DEAD</span>}
      </div>
      <div
        className="grid bg-black/50 border glow"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, 16px)`,
          gridTemplateRows: `repeat(${SIZE}, 16px)`,
          borderColor: "rgba(var(--accent-rgb)/0.4)",
        }}
      >
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const x = i % SIZE;
          const y = Math.floor(i / SIZE);
          const isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
          const isHead = snake[0][0] === x && snake[0][1] === y;
          const isFood = food[0] === x && food[1] === y;
          return (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                background: isHead
                  ? "rgb(var(--accent-rgb))"
                  : isSnake
                    ? "rgba(var(--accent-rgb)/0.6)"
                    : isFood
                      ? "#ff3a78"
                      : "transparent",
              }}
            />
          );
        })}
      </div>
      <button
        onClick={reset}
        className="px-4 py-1.5 rounded font-mono text-xs text-black"
        style={{ background: "rgb(var(--accent-rgb))" }}
      >
        {dead || !running ? "START" : "RESTART"}
      </button>
      <div className="text-[10px] font-mono text-muted-foreground">arrows / WASD</div>
    </div>
  );
}

// 2048 game
export function Game2048() {
  const [grid, setGrid] = useState<number[][]>(() => addRandom(addRandom(empty())));
  const [score, setScore] = useState(0);

  function empty(): number[][] {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }
  function addRandom(g: number[][]): number[][] {
    const empties: [number, number][] = [];
    g.forEach((r, i) => r.forEach((v, j) => v === 0 && empties.push([i, j])));
    if (!empties.length) return g;
    const [i, j] = empties[Math.floor(Math.random() * empties.length)];
    const ng = g.map((r) => [...r]);
    ng[i][j] = Math.random() < 0.9 ? 2 : 4;
    return ng;
  }

  const move = useCallback(
    (dir: "up" | "down" | "left" | "right") => {
      setGrid((g) => {
        let rotated = g.map((r) => [...r]);
        const rotate = (m: number[][]) => m[0].map((_, i) => m.map((r) => r[i]).reverse());
        const turns = { left: 0, up: 1, right: 2, down: 3 }[dir];
        for (let k = 0; k < turns; k++) rotated = rotate(rotated);
        let gained = 0;
        const collapsed = rotated.map((row) => {
          const filtered = row.filter((v) => v !== 0);
          for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
              filtered[i] *= 2;
              gained += filtered[i];
              filtered.splice(i + 1, 1);
            }
          }
          while (filtered.length < 4) filtered.push(0);
          return filtered;
        });
        let result = collapsed;
        for (let k = 0; k < (4 - turns) % 4; k++) result = rotate(result);
        const changed = JSON.stringify(result) !== JSON.stringify(g);
        if (gained) setScore((s) => s + gained);
        return changed ? addRandom(result) : g;
      });
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: any = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
      if (map[e.key]) {
        e.preventDefault();
        move(map[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  const colorFor = (v: number) => {
    if (!v) return "rgba(255,255,255,0.04)";
    const intensity = Math.min(1, Math.log2(v) / 11);
    return `rgba(var(--accent-rgb)/${0.2 + intensity * 0.7})`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 p-4">
      <div className="font-mono text-xs">
        SCORE: <span style={{ color: "rgb(var(--accent-rgb))" }}>{score}</span>
      </div>
      <div
        className="grid gap-2 p-2 rounded bg-black/40 border"
        style={{ gridTemplateColumns: "repeat(4, 64px)", borderColor: "rgba(var(--accent-rgb)/0.3)" }}
      >
        {grid.flat().map((v, i) => (
          <div
            key={i}
            className="w-16 h-16 rounded flex items-center justify-center font-mono font-bold text-lg"
            style={{ background: colorFor(v), color: v >= 8 ? "#0a0612" : "white" }}
          >
            {v || ""}
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          setGrid(addRandom(addRandom(empty())));
          setScore(0);
        }}
        className="px-4 py-1.5 rounded font-mono text-xs text-black"
        style={{ background: "rgb(var(--accent-rgb))" }}
      >
        NEW GAME
      </button>
      <div className="text-[10px] font-mono text-muted-foreground">arrow keys</div>
    </div>
  );
}

// Memory match
export function MemoryGame() {
  const symbols = ["👻", "🌙", "⚡", "✦", "◆", "♛", "☣", "✧"];
  const make = () => {
    const deck = [...symbols, ...symbols]
      .map((s, i) => ({ id: i, sym: s, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
    return deck;
  };
  const [cards, setCards] = useState(make);
  const [pick, setPick] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const flip = (i: number) => {
    if (cards[i].flipped || pick.length === 2) return;
    const nc = cards.map((c, idx) => (idx === i ? { ...c, flipped: true } : c));
    const np = [...pick, i];
    setCards(nc);
    setPick(np);
    if (np.length === 2) {
      setMoves((m) => m + 1);
      setTimeout(() => {
        setCards((cur) => {
          const [a, b] = np;
          if (cur[a].sym === cur[b].sym) {
            return cur.map((c, idx) => (idx === a || idx === b ? { ...c, matched: true } : c));
          }
          return cur.map((c, idx) => (idx === a || idx === b ? { ...c, flipped: false } : c));
        });
        setPick([]);
      }, 700);
    }
  };

  const won = cards.every((c) => c.matched);

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 p-4">
      <div className="font-mono text-xs">
        MOVES: <span style={{ color: "rgb(var(--accent-rgb))" }}>{moves}</span>
        {won && <span className="ml-3 text-glow">▸ COMPLETE</span>}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => flip(i)}
            className="w-14 h-14 rounded font-mono text-2xl flex items-center justify-center transition-all"
            style={{
              background: c.flipped || c.matched ? "rgba(var(--accent-rgb)/0.25)" : "rgba(0,0,0,0.4)",
              border: "1px solid rgba(var(--accent-rgb)/0.3)",
              opacity: c.matched ? 0.4 : 1,
            }}
          >
            {c.flipped || c.matched ? c.sym : ""}
          </button>
        ))}
      </div>
      <button
        onClick={() => {
          setCards(make());
          setPick([]);
          setMoves(0);
        }}
        className="px-4 py-1.5 rounded font-mono text-xs text-black"
        style={{ background: "rgb(var(--accent-rgb))" }}
      >
        NEW GAME
      </button>
    </div>
  );
}

export function GamesApp() {
  const [game, setGame] = useState<"menu" | "snake" | "2048" | "memory">("menu");
  if (game === "snake") return <GameWrap title="Snake" onBack={() => setGame("menu")}><SnakeGame /></GameWrap>;
  if (game === "2048") return <GameWrap title="2048" onBack={() => setGame("menu")}><Game2048 /></GameWrap>;
  if (game === "memory") return <GameWrap title="Memory" onBack={() => setGame("menu")}><MemoryGame /></GameWrap>;
  return (
    <div className="h-full p-6 grid grid-cols-3 gap-4 content-start">
      {[
        { id: "snake", name: "Snake", emoji: "🐍" },
        { id: "2048", name: "2048", emoji: "⚡" },
        { id: "memory", name: "Memory", emoji: "🃏" },
      ].map((g) => (
        <button
          key={g.id}
          onClick={() => setGame(g.id as any)}
          className="aspect-square rounded-lg flex flex-col items-center justify-center gap-2 border border-white/10 hover:border-[rgb(var(--accent-rgb))] hover:bg-white/5 transition"
        >
          <div className="text-5xl">{g.emoji}</div>
          <div className="font-mono text-xs tracking-widest">{g.name}</div>
        </button>
      ))}
    </div>
  );
}

function GameWrap({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10">
        <button onClick={onBack} className="text-xs font-mono hover:text-[rgb(var(--accent-rgb))]">
          ← back
        </button>
        <div className="font-mono text-xs uppercase tracking-widest">{title}</div>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
