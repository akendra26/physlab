/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useDragControls } from "motion/react";
import type { KategoriSimulasi } from "../../config/konfigurasiNavigasi";
import "./SimulationExperience.css";
import { useBahasa } from "../../i18n/BahasaContext";

export type DockPosition = "top" | "bottom" | "left" | "right" | "floating";
export type KinematicsScaleMode = "boundary-box" | "actual-scale";
type SimulationContextValue = {
  dock: DockPosition;
  setDock: (value: DockPosition) => void;
  scaleMode: KinematicsScaleMode;
  setScaleMode: (value: KinematicsScaleMode) => void;
};
const SimulationContext = createContext<SimulationContextValue | null>(null);
const STORAGE_KEY = "physlab.simulation.control-dock.v2";
const FLOATING_POSITION_KEY = "physlab.simulation.floating-position.v1";
const SCALE_STORAGE_KEY = "physlab.simulation.kinematics-scale.v1";

export function useSimulationExperience() {
  const value = useContext(SimulationContext);
  if (!value) return {
    dock: "top" as DockPosition,
    setDock: () => undefined,
    scaleMode: "boundary-box" as KinematicsScaleMode,
    setScaleMode: () => undefined,
  };
  return value;
}

export function useKinematicsScaleMode(): KinematicsScaleMode {
  return useSimulationExperience().scaleMode;
}

export function DockableControlPanel({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  const isId = useBahasa() === "id";
  const { dock } = useSimulationExperience();
  const controls = useDragControls();
  const panelRef = useRef<HTMLDivElement>(null);
  const floating = dock === "floating";
  const [floatingPosition, setFloatingPosition] = useState(() => {
    if (typeof window === "undefined") return { x: 0, y: 0 };
    try {
      const parsed = JSON.parse(window.localStorage.getItem(FLOATING_POSITION_KEY) ?? "null") as { x?: number; y?: number } | null;
      return { x: Number.isFinite(parsed?.x) ? Number(parsed?.x) : 0, y: Number.isFinite(parsed?.y) ? Number(parsed?.y) : 0 };
    } catch { return { x: 0, y: 0 }; }
  });
  useEffect(() => {
    if (!floating) return;
    const panel = panelRef.current;
    const parent = panel?.parentElement;
    if (!panel || !parent) return;
    const clampPosition = () => {
      const parentBox = parent.getBoundingClientRect();
      const panelBox = panel.getBoundingClientRect();
      const maxX = Math.max(0, parentBox.width - panelBox.width - 24);
      const maxY = Math.max(0, parentBox.height - panelBox.height - 24);
      setFloatingPosition((previous) => {
        const next = { x: Math.min(maxX, Math.max(0, previous.x)), y: Math.min(maxY, Math.max(0, previous.y)) };
        return next.x === previous.x && next.y === previous.y ? previous : next;
      });
    };
    clampPosition();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(clampPosition) : null;
    observer?.observe(parent);
    window.addEventListener("resize", clampPosition);
    return () => { observer?.disconnect(); window.removeEventListener("resize", clampPosition); };
  }, [floating]);
  useEffect(() => {
    if (!floating) return;
    try { window.localStorage.setItem(FLOATING_POSITION_KEY, JSON.stringify(floatingPosition)); } catch { /* Storage may be disabled. */ }
  }, [floating, floatingPosition]);
  return (
    <motion.div
      ref={panelRef}
      className={`simulation-control-dock ${compact ? "simulation-control-dock-compact" : ""}`}
      data-dock-position={dock}
      drag={floating}
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      dragElastic={0.06}
      onDragEnd={(_, info) => {
        const parentBox = panelRef.current?.parentElement?.getBoundingClientRect();
        const panelBox = panelRef.current?.getBoundingClientRect();
        const maxX = parentBox && panelBox ? Math.max(0, parentBox.width - panelBox.width - 24) : 320;
        const maxY = parentBox && panelBox ? Math.max(0, parentBox.height - panelBox.height - 24) : 220;
        setFloatingPosition({
          x: Math.min(maxX, Math.max(0, floatingPosition.x + info.offset.x)),
          y: Math.min(maxY, Math.max(0, floatingPosition.y + info.offset.y)),
        });
      }}
      dragConstraints={{ left: -24, right: 420, top: -24, bottom: 260 }}
      whileDrag={{ scale: 1.012, boxShadow: "0 28px 70px rgba(0,0,0,.45)" }}
      style={floating ? { position: "absolute", zIndex: 50, left: 12, top: 12, x: floatingPosition.x, y: floatingPosition.y, width: "min(390px, calc(100% - 24px))" } : undefined}
    >
      {floating && (
        <div className="simulation-dock-grip" onPointerDown={(event) => controls.start(event)}>
          <span className="dock-grip-dots" aria-hidden="true">⠿</span>
          <span>{isId ? "GESER PANEL KONTROL" : "MOVE CONTROL PANEL"}</span>
          <span className="dock-grip-hint">DRAG</span>
        </div>
      )}
      {children}
    </motion.div>
  );
}

const TAB_DEFINITIONS = [
  { id: "run", label: "Simulasi & Kontrol", icon: "◉" },
  { id: "analysis", label: "Grafik Analisis", icon: "⌁" },
  { id: "model", label: "Model Matematika", icon: "∑" },
] as const;
type TabId = (typeof TAB_DEFINITIONS)[number]["id"];

export default function SimulationExperience({ category, moduleKey, children, showTabs = true }: { category: KategoriSimulasi; moduleKey: string; children: ReactNode; showTabs?: boolean }) {
  const [tab, setTab] = useState<TabId>("run");
  const isId = useBahasa() === "id";
  const [dock, setDockState] = useState<DockPosition>(() => {
    if (typeof window === "undefined") return "top";
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored === "top" || stored === "bottom" || stored === "left" || stored === "right" || stored === "floating" ? stored : "top";
    } catch { return "top"; }
  });
  const [scaleMode, setScaleModeState] = useState<KinematicsScaleMode>(() => {
    if (typeof window === "undefined") return "boundary-box";
    try { return window.localStorage.getItem(SCALE_STORAGE_KEY) === "actual-scale" ? "actual-scale" : "boundary-box"; }
    catch { return "boundary-box"; }
  });
  const setDock = useCallback((value: DockPosition) => setDockState(value), []);
  const setScaleMode = useCallback((value: KinematicsScaleMode) => setScaleModeState(value), []);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, dock); } catch { /* Storage may be disabled. */ }
  }, [dock]);
  useEffect(() => {
    try { window.localStorage.setItem(SCALE_STORAGE_KEY, scaleMode); } catch { /* Storage may be disabled. */ }
  }, [scaleMode]);
  const contextValue = useMemo(() => ({ dock, setDock, scaleMode, setScaleMode }), [dock, scaleMode, setDock, setScaleMode]);
  return (
    <SimulationContext.Provider value={contextValue}>
      <section className="simulation-experience" data-category={category} data-module-key={moduleKey} data-tab={tab} data-dock={dock}>
        <div className="simulation-experience-toolbar panel">
          {showTabs && (
            <div className="simulation-tab-list" role="tablist" aria-label={isId ? "Panel simulasi" : "Simulation panel"}>
              {TAB_DEFINITIONS.map((item) => (
                <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={`simulation-tab-button ${tab === item.id ? "is-active" : ""}`} onClick={() => setTab(item.id)}>
                  <span aria-hidden="true">{item.icon}</span>{isId ? item.label : item.id === "run" ? "Simulation & Controls" : item.id === "analysis" ? "Analysis Graphs" : "Mathematical Model"}
                </button>
              ))}
            </div>
          )}
          <div className="simulation-toolbar-options">
            <div className="simulation-scale-switch" role="group" aria-label={isId ? "Mode skala visualisasi" : "Visualization scale mode"}>
              <span>{isId ? "SKALA" : "SCALE"}</span>
              <button type="button" aria-pressed={scaleMode === "boundary-box"} className={scaleMode === "boundary-box" ? "is-active" : ""} onClick={() => setScaleMode("boundary-box")}>{isId ? "Kotak Batas" : "Boundary Box"}</button>
              <button type="button" aria-pressed={scaleMode === "actual-scale"} className={scaleMode === "actual-scale" ? "is-active" : ""} onClick={() => setScaleMode("actual-scale")}>{isId ? "Skala Nyata" : "Actual Scale"}</button>
            </div>
            <label className="simulation-dock-select">
              <span>{isId ? "POSISI PANEL" : "PANEL POSITION"}</span>
              <select value={dock} onChange={(event) => setDock(event.target.value as DockPosition)} aria-label={isId ? "Posisi panel kontrol" : "Control panel position"}>
                <option value="top">{isId ? "Atas" : "Top"}</option>
                <option value="bottom">{isId ? "Bawah" : "Bottom"}</option>
                <option value="left">{isId ? "Kiri" : "Left"}</option>
                <option value="right">{isId ? "Kanan" : "Right"}</option>
                <option value="floating">{isId ? "Mengambang · geser" : "Floating · drag"}</option>
              </select>
            </label>
          </div>
        </div>
        <div className="simulation-content-layout">{children}</div>
      </section>
    </SimulationContext.Provider>
  );
}
