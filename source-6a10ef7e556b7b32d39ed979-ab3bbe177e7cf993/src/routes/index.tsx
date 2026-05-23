import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  fetchTasks,
  addTask,
  toggleTask,
  updateTask,
  deleteTask,
} from "../server/tasks.functions.js";

export const Route = createFileRoute("/")({
  loader: async () => {
    const today = new Date().toISOString().slice(0, 10);
    const tasks = await fetchTasks({ data: { date: today } });
    return { tasks, today };
  },
  component: PlanetPlanner,
});

type Priority = "low" | "medium" | "high";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  date: string;
  priority: string;
  createdAt: Date | null;
}

type TimePhase = "dawn" | "morning" | "afternoon" | "dusk" | "night";

interface PlanetTheme {
  planet: string;
  glow: string;
  atmosphere: string;
  shadow: string;
  accent: string;
  label: string;
  dotColor: string;
  emoji: string;
}

function getTimePhase(hour: number): TimePhase {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 13) return "morning";
  if (hour >= 13 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 21) return "dusk";
  return "night";
}

const themes: Record<TimePhase, PlanetTheme> = {
  dawn: {
    planet: "radial-gradient(circle at 38% 32%, #ffcb80, #e8735a 55%, #c0392b)",
    glow: "0 0 50px rgba(255,160,80,0.35), 0 0 100px rgba(230,100,60,0.15)",
    atmosphere: "radial-gradient(circle, rgba(255,200,100,0.2) 0%, transparent 70%)",
    shadow: "radial-gradient(circle at 72% 52%, transparent 28%, rgba(15,5,0,0.75) 68%)",
    accent: "#f5a85a",
    label: "Dawn",
    dotColor: "rgba(255,210,110,0.9)",
    emoji: "🌅",
  },
  morning: {
    planet: "radial-gradient(circle at 36% 34%, #b8f0e8, #2ec4b6 52%, #0d7a6e)",
    glow: "0 0 60px rgba(46,196,182,0.4), 0 0 120px rgba(46,196,182,0.12)",
    atmosphere: "radial-gradient(circle, rgba(100,240,220,0.2) 0%, transparent 70%)",
    shadow: "radial-gradient(circle at 70% 52%, transparent 30%, rgba(0,12,10,0.35) 70%)",
    accent: "#2ec4b6",
    label: "Morning",
    dotColor: "rgba(100,240,210,0.9)",
    emoji: "🌤",
  },
  afternoon: {
    planet: "radial-gradient(circle at 35% 33%, #b3d4ff, #4a90e2 50%, #1a3a7a)",
    glow: "0 0 60px rgba(74,144,226,0.4), 0 0 120px rgba(74,144,226,0.12)",
    atmosphere: "radial-gradient(circle, rgba(140,200,255,0.2) 0%, transparent 70%)",
    shadow: "radial-gradient(circle at 70% 52%, transparent 30%, rgba(0,5,20,0.3) 70%)",
    accent: "#4a90e2",
    label: "Afternoon",
    dotColor: "rgba(140,200,255,0.9)",
    emoji: "☀️",
  },
  dusk: {
    planet: "radial-gradient(circle at 37% 34%, #ffe4c0, #e07b4a 48%, #7b2d8b)",
    glow: "0 0 55px rgba(220,120,70,0.4), 0 0 100px rgba(120,40,130,0.2)",
    atmosphere: "radial-gradient(circle, rgba(240,150,80,0.22) 0%, transparent 70%)",
    shadow: "radial-gradient(circle at 72% 52%, transparent 26%, rgba(10,0,15,0.78) 66%)",
    accent: "#e07b4a",
    label: "Dusk",
    dotColor: "rgba(255,180,100,0.9)",
    emoji: "🌇",
  },
  night: {
    planet: "radial-gradient(circle at 36% 34%, #4a4a7a, #1e1e4e 52%, #0d0d26)",
    glow: "0 0 40px rgba(100,100,180,0.2), 0 0 80px rgba(60,60,130,0.08)",
    atmosphere: "radial-gradient(circle, rgba(80,80,160,0.12) 0%, transparent 70%)",
    shadow: "radial-gradient(circle at 72% 50%, transparent 22%, rgba(3,3,12,0.92) 62%)",
    accent: "#7c8cf8",
    label: "Night",
    dotColor: "rgba(160,160,255,0.85)",
    emoji: "🌙",
  },
};

function getOrbitalDots(
  completedCount: number,
  totalCount: number,
  orbitRadius: number
) {
  if (totalCount === 0) return [];
  return Array.from({ length: completedCount }, (_, i) => {
    const angle = (i / totalCount) * 2 * Math.PI - Math.PI / 2;
    return {
      cx: orbitRadius + Math.cos(angle) * orbitRadius,
      cy: orbitRadius + Math.sin(angle) * orbitRadius,
      key: i,
      delay: i * 0.12,
    };
  });
}

const priorityColor: Record<string, string> = {
  high: "#ff6b6b",
  medium: "#f5a85a",
  low: "#5af5a0",
};

function Planet({
  theme,
  completedCount,
  totalCount,
  size = 160,
}: {
  theme: PlanetTheme;
  completedCount: number;
  totalCount: number;
  size?: number;
}) {
  const orbitRadius = size * 0.82;
  const orbitDiameter = orbitRadius * 2;
  const offset = (orbitDiameter - size) / 2;
  const dots = getOrbitalDots(completedCount, totalCount, orbitRadius);

  return (
    <div
      className="planet-wrapper planet-float"
      style={{ width: orbitDiameter, height: orbitDiameter, flexShrink: 0 }}
    >
      <div
        className="orbit-ring"
        style={{ width: orbitDiameter, height: orbitDiameter, left: 0, top: 0 }}
      />
      {dots.map((d) => (
        <div
          key={d.key}
          className="orbit-dot orbit-dot-pop"
          style={{
            width: 9,
            height: 9,
            background: theme.dotColor,
            boxShadow: `0 0 8px ${theme.dotColor}, 0 0 16px ${theme.dotColor}`,
            left: d.cx,
            top: d.cy,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
      <div style={{ position: "absolute", left: offset, top: offset, width: size, height: size }}>
        <div
          className="planet-orb"
          style={{ width: size, height: size, background: theme.planet, boxShadow: theme.glow }}
        >
          <div className="planet-shadow-overlay" style={{ background: theme.shadow }} />
        </div>
        <div className="planet-atmosphere" style={{ background: theme.atmosphere }} />
      </div>
    </div>
  );
}

function calcXP(tasks: Task[]) {
  return tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (t.priority === "high" ? 30 : t.priority === "medium" ? 20 : 10), 0);
}

function PlanetPlanner() {
  const { tasks: initialTasks, today } = Route.useLoaderData();

  const [tasks, setTasks] = useState<Task[]>(initialTasks as Task[]);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [hour, setHour] = useState(new Date().getHours());
  const [isAdding, setIsAdding] = useState(false);

  const doAddTask = useServerFn(addTask);
  const doToggleTask = useServerFn(toggleTask);
  const doUpdateTask = useServerFn(updateTask);
  const doDeleteTask = useServerFn(deleteTask);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setInterval(() => setHour(new Date().getHours()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) { tg.expand(); tg.ready(); }
  }, []);

  const phase = getTimePhase(hour);
  const theme = themes[phase];
  const completedCount = tasks.filter((t) => t.completed).length;
  const xp = calcXP(tasks);
  const xpMax = Math.max(tasks.length * 20, 100);
  const xpPercent = Math.min(100, (xp / xpMax) * 100);

  const handleAddTask = useCallback(async () => {
    if (!newTitle.trim()) return;
    setIsAdding(true);
    try {
      const task = await doAddTask({ data: { title: newTitle.trim(), date: today, priority: newPriority } });
      setTasks((prev) => [...prev, task as Task]);
      setNewTitle("");
      inputRef.current?.focus();
    } finally {
      setIsAdding(false);
    }
  }, [newTitle, newPriority, today, doAddTask]);

  const handleToggle = useCallback(async (id: number) => {
    const task = await doToggleTask({ data: { id } });
    setTasks((prev) => prev.map((t) => (t.id === id ? (task as Task) : t)));
    (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred("light");
  }, [doToggleTask]);

  const handleDelete = useCallback(async (id: number) => {
    await doDeleteTask({ data: { id } });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, [doDeleteTask]);

  const handleEditSave = useCallback(async (id: number) => {
    if (!editingTitle.trim()) { setEditingId(null); return; }
    const task = await doUpdateTask({ data: { id, title: editingTitle.trim() } });
    setTasks((prev) => prev.map((t) => (t.id === id ? (task as Task) : t)));
    setEditingId(null);
  }, [editingTitle, doUpdateTask]);

  const dateLabel = new Date(today + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div
      style={{
        minHeight: "100dvh",
        position: "relative",
        paddingBottom: "max(env(safe-area-inset-bottom, 16px), 24px)",
        ["--accent" as any]: theme.accent,
      }}
    >
      <div className="stars" />
      <div
        style={{
          position: "relative", zIndex: 1,
          maxWidth: 480, margin: "0 auto", padding: "0 16px",
        }}
      >
        {/* Header */}
        <div style={{ paddingTop: 28, paddingBottom: 4, textAlign: "center" }}>
          <div
            style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", color: theme.accent, opacity: 0.9, marginBottom: 4,
            }}
          >
            {theme.emoji} {theme.label}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)" }}>
            {dateLabel}
          </div>
        </div>

        {/* Planet */}
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 10px" }}>
          <Planet theme={theme} completedCount={completedCount} totalCount={tasks.length} size={160} />
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <div
            style={{
              flex: 1, background: "rgba(255,255,255,0.04)",
              borderRadius: 12, padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
              Tasks
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <span className="mono" style={{ fontSize: 22, fontWeight: 500, color: theme.accent }}>{completedCount}</span>
              <span className="mono" style={{ fontSize: 13, color: "rgba(255,255,255,0.28)" }}>/ {tasks.length}</span>
            </div>
          </div>

          <div
            style={{
              flex: 2, background: "rgba(255,255,255,0.04)",
              borderRadius: 12, padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                XP Today
              </span>
              <span className="mono" style={{ fontSize: 11, color: theme.accent, fontWeight: 500 }}>{xp} pts</span>
            </div>
            <div className="xp-bar-track">
              <div
                className="xp-bar-fill"
                style={{ width: `${xpPercent}%`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.dotColor})` }}
              />
            </div>
          </div>
        </div>

        {/* Add task */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 5 }}>
            {(["low", "medium", "high"] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setNewPriority(p)}
                title={p}
                style={{
                  width: 26, height: 26, borderRadius: "50%", padding: 0, cursor: "pointer",
                  border: `2px solid ${newPriority === p ? priorityColor[p] : "rgba(255,255,255,0.14)"}`,
                  background: newPriority === p ? `${priorityColor[p]}22` : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}
              >
                <div className="priority-dot" style={{ background: priorityColor[p], opacity: newPriority === p ? 1 : 0.38 }} />
              </button>
            ))}
          </div>
          <input
            ref={inputRef}
            className="task-input"
            style={{ flex: 1, padding: "9px 14px", fontSize: 14 }}
            placeholder="Add a mission…"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          />
          <button
            className="add-btn"
            style={{ padding: "9px 16px", fontSize: 13 }}
            onClick={handleAddTask}
            disabled={isAdding || !newTitle.trim()}
          >
            {isAdding ? "…" : "+ Add"}
          </button>
        </div>

        {/* Task list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 40 }}>
          {tasks.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "rgba(255,255,255,0.22)", fontSize: 14 }}>
              <div style={{ fontSize: 40, marginBottom: 14, opacity: 0.45 }}>🪐</div>
              <div>No missions today.</div>
              <div style={{ fontSize: 12, marginTop: 6, color: "rgba(255,255,255,0.15)" }}>
                Add tasks to orbit the planet.
              </div>
            </div>
          )}

          {tasks.map((task, i) => (
            <div
              key={task.id}
              className={`task-card${task.completed ? " completed" : ""} slide-up`}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                animationDelay: `${i * 0.04}s`, animationFillMode: "both", opacity: 0,
              }}
            >
              <div
                className={`task-check${task.completed ? " checked" : ""}`}
                onClick={() => handleToggle(task.id)}
              >
                {task.completed && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              <div className="priority-dot" style={{ background: priorityColor[task.priority] || priorityColor.medium }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                {editingId === task.id ? (
                  <input
                    className="task-title-edit"
                    value={editingTitle}
                    autoFocus
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => handleEditSave(task.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditSave(task.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    style={{ fontSize: 14 }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: 14, color: task.completed ? "rgba(255,255,255,0.42)" : "#e8eaf6",
                      textDecoration: task.completed ? "line-through" : "none",
                      cursor: "text", display: "block",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}
                    onDoubleClick={() => { setEditingId(task.id); setEditingTitle(task.title); }}
                  >
                    {task.title}
                  </span>
                )}
              </div>

              <span
                className="mono"
                style={{
                  fontSize: 10, fontWeight: 500, whiteSpace: "nowrap",
                  color: task.completed ? theme.accent : "rgba(255,255,255,0.22)",
                }}
              >
                +{task.priority === "high" ? 30 : task.priority === "medium" ? 20 : 10}xp
              </span>

              <button className="delete-btn" onClick={() => handleDelete(task.id)} title="Delete">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
