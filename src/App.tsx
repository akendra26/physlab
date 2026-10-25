import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProjectileCanvas from "./components/ProjectileCanvas";
import MiniGraph from "./components/MiniGraph";
import {
  calculateState,
  DEFAULT_PARAMS,
  getSimulationMetrics,
  type SimulationMode,
  type SimulationParams,
} from "./physics/projectile";
import "./App.css";

const MODE_INFO: Record<SimulationMode, { title: string; description: string }> = {
  projectile: {
    title: "Projectile motion",
    description: "Explore two-dimensional motion under constant gravity, without air resistance.",
  },
  freefall: {
    title: "Free fall",
    description: "Release an object from a height and inspect its position and velocity over time.",
  },
  dynamics: {
    title: "Newton's second law",
    description: "Apply a horizontal force to a block and explore the effect of mass and friction.",
  },
};

function App() {
  const [mode, setMode] = useState<SimulationMode>("projectile");
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [playing, setPlaying] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [showVectors, setShowVectors] = useState(true);
  const timeRef = useRef(0);

  const metrics = useMemo(
    () => getSimulationMetrics(mode, params),
    [mode, params],
  );
  const duration = metrics.duration;

  const setClock = useCallback((time: number) => {
    timeRef.current = time;
    setSimulationTime(time);
  }, []);

  const resetSimulation = useCallback(() => {
    setPlaying(false);
    setClock(0);
  }, [setClock]);

  useEffect(() => {
    if (!playing || duration <= 0) return;

    let frameId = 0;
    let previousTimestamp: number | null = null;

    const animate = (timestamp: number) => {
      if (previousTimestamp === null) previousTimestamp = timestamp;
      const dt = Math.min((timestamp - previousTimestamp) / 1000, 0.05);
      previousTimestamp = timestamp;

      const nextTime = timeRef.current + dt * speedMultiplier;
      if (nextTime >= duration) {
        setClock(duration);
        setPlaying(false);
        return;
      }

      setClock(nextTime);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [playing, duration, speedMultiplier, setClock]);

  const updateParam = <K extends keyof SimulationParams>(
    key: K,
    value: SimulationParams[K],
  ) => {
    setParams((current) => ({ ...current, [key]: value }));
    resetSimulation();
  };

  const changeMode = (nextMode: SimulationMode) => {
    setMode(nextMode);
    setPlaying(false);
    setClock(0);
    if (nextMode === "freefall" && params.initialHeight === 0) {
      setParams((current) => ({ ...current, initialHeight: 10 }));
    }
  };

  const samples = useMemo(() => {
    const count = 101;
    return Array.from({ length: count }, (_, i) =>
      calculateState(mode, params, duration * i / (count - 1)),
    );
  }, [mode, params, duration]);

  const graphs = mode === "projectile"
    ? [
        { title: "Horizontal position", yLabel: "x (m)", values: samples.map((s) => s.x), color: "#55e0c1" },
        { title: "Vertical position", yLabel: "y (m)", values: samples.map((s) => s.y), color: "#8ea7ff" },
        { title: "Horizontal velocity", yLabel: "vx (m/s)", values: samples.map((s) => s.vx), color: "#f6bd60" },
        { title: "Vertical velocity", yLabel: "vy (m/s)", values: samples.map((s) => s.vy), color: "#f28e8e" },
      ]
    : mode === "freefall"
      ? [
          { title: "Height vs. time", yLabel: "y (m)", values: samples.map((s) => s.y), color: "#8ea7ff" },
          { title: "Vertical velocity", yLabel: "vy (m/s)", values: samples.map((s) => s.vy), color: "#f28e8e" },
        ]
      : [
          { title: "Displacement", yLabel: "x (m)", values: samples.map((s) => s.x), color: "#55e0c1" },
          { title: "Velocity", yLabel: "v (m/s)", values: samples.map((s) => s.vx), color: "#8ea7ff" },
          { title: "Acceleration", yLabel: "a (m/s²)", values: samples.map((s) => s.ax), color: "#f6bd60" },
        ];

  const exportCsv = () => {
    const rows = [
      ["time_s", "x_m", "y_m", "vx_m_s", "vy_m_s", "ax_m_s2", "ay_m_s2"],
      ...samples.map((s) => [
        s.t.toFixed(5), s.x.toFixed(6), s.y.toFixed(6),
        s.vx.toFixed(6), s.vy.toFixed(6), s.ax.toFixed(6), s.ay.toFixed(6),
      ]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `physlab-${mode}-data.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const atEnd = duration <= 0 || simulationTime >= duration - 1e-5;
  const playLabel = playing ? "Pause" : atEnd ? "Replay" : "Play";

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="PhysLab home">
          <span className="brand-mark">φ</span>
          <span>Phys<span className="brand-accent">Lab</span></span>
        </a>
        <div className="topbar-right">
          <span className="live-dot" />
          <span>INTERACTIVE PHYSICS</span>
          <span className="version-tag">BETA 1.0</span>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">LEARN BY EXPERIMENTING</p>
          <h1>Physics you can <span>feel.</span></h1>
          <p className="hero-description">
            Change the conditions. Watch what happens. Understand why.
            A hands-on laboratory for motion, forces, and the equations between them.
          </p>
        </div>
        <div className="hero-equation" aria-label="Newton's second law">
          <span className="equation-symbol">F</span>
          <span className="equation-equals">=</span>
          <span className="equation-symbol">ma</span>
          <span className="equation-caption">THE LANGUAGE OF MOTION</span>
        </div>
      </section>

      <nav className="mode-tabs" aria-label="Choose simulation">
        {([
          ["projectile", "↗", "Projectile"],
          ["freefall", "↓", "Free fall"],
          ["dynamics", "▰", "Dynamics"],
        ] as const).map(([key, icon, label]) => (
          <button
            key={key}
            className={`mode-tab ${mode === key ? "active" : ""}`}
            onClick={() => changeMode(key)}
            aria-pressed={mode === key}
          >
            <span className="mode-icon">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <section className="workspace">
        <aside className="control-panel panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">EXPERIMENT SETUP</p>
              <h2>Parameters</h2>
            </div>
            <span className="settings-icon">☷</span>
          </div>

          {mode === "projectile" && (
            <>
              <ParameterControl
                label="Initial speed"
                value={params.speed}
                min={0}
                max={50}
                step={0.5}
                unit="m/s"
                onChange={(value) => updateParam("speed", value)}
              />
              <ParameterControl
                label="Launch angle"
                value={params.angleDeg}
                min={0}
                max={90}
                step={1}
                unit="°"
                onChange={(value) => updateParam("angleDeg", value)}
              />
              <ParameterControl
                label="Initial height"
                value={params.initialHeight}
                min={0}
                max={50}
                step={0.5}
                unit="m"
                onChange={(value) => updateParam("initialHeight", value)}
              />
            </>
          )}

          {mode === "freefall" && (
            <ParameterControl
              label="Release height"
              value={params.initialHeight}
              min={0}
              max={100}
              step={1}
              unit="m"
              onChange={(value) => updateParam("initialHeight", value)}
            />
          )}

          {mode === "dynamics" && (
            <>
              <ParameterControl
                label="Applied force"
                value={params.force}
                min={0}
                max={100}
                step={1}
                unit="N"
                onChange={(value) => updateParam("force", value)}
              />
              <ParameterControl
                label="Mass"
                value={params.mass}
                min={1}
                max={20}
                step={0.5}
                unit="kg"
                onChange={(value) => updateParam("mass", value)}
              />
              <ParameterControl
                label="Friction coefficient"
                value={params.friction}
                min={0}
                max={1}
                step={0.01}
                unit=""
                onChange={(value) => updateParam("friction", value)}
              />
            </>
          )}

          <ParameterControl
            label="Gravity"
            value={params.gravity}
            min={1}
            max={20}
            step={0.01}
            unit="m/s²"
            onChange={(value) => updateParam("gravity", value)}
          />

          <div className="control-divider" />
          <div className="control-note">
            <span className="note-icon">ⓘ</span>
            <p>
              {mode === "dynamics"
                ? "Simplified horizontal block model. Static and kinetic friction use the same coefficient."
                : "Ideal model: air resistance is ignored and gravity is constant."}
            </p>
          </div>
          <button className="secondary-button full-width" onClick={() => {
            setParams(DEFAULT_PARAMS);
            setMode("projectile");
            setSpeedMultiplier(1);
            setShowVectors(true);
            resetSimulation();
          }}>
            <span>↺</span> Restore defaults
          </button>
        </aside>

        <div className="main-column">
          <section className="simulation-panel panel">
            <div className="simulation-header">
              <div>
                <p className="eyebrow">LIVE SIMULATION</p>
                <h2>{MODE_INFO[mode].title}</h2>
                <p className="section-description">{MODE_INFO[mode].description}</p>
              </div>
              <span className="model-badge"><span /> MODEL ACTIVE</span>
            </div>

            <ProjectileCanvas
              mode={mode}
              params={params}
              time={Math.min(simulationTime, duration)}
              showVectors={showVectors}
            />

            <div className="timeline-row">
              <span className="time-readout">{simulationTime.toFixed(2)} <small>s</small></span>
              <input
                className="timeline"
                aria-label="Simulation time"
                type="range"
                min={0}
                max={Math.max(duration, 0.01)}
                step={Math.max(duration / 500, 0.001)}
                value={Math.min(simulationTime, Math.max(duration, 0.01))}
                onChange={(event) => {
                  setPlaying(false);
                  setClock(Number(event.target.value));
                }}
              />
              <span className="time-total">{duration.toFixed(2)} s</span>
            </div>

            <div className="playback-row">
              <div className="playback-buttons">
                <button className="play-button" onClick={() => {
                  if (playing) {
                    setPlaying(false);
                  } else {
                    if (atEnd) setClock(0);
                    if (duration > 0) setPlaying(true);
                  }
                }} disabled={duration <= 0}>
                  <span>{playing ? "Ⅱ" : "▶"}</span> {playLabel}
                </button>
                <button className="icon-button" onClick={resetSimulation} aria-label="Reset simulation" title="Reset">↺</button>
              </div>
              <div className="playback-options">
                <label className="speed-select">
                  <span>Speed</span>
                  <select value={speedMultiplier} onChange={(event) => setSpeedMultiplier(Number(event.target.value))}>
                    <option value={0.25}>0.25×</option>
                    <option value={0.5}>0.5×</option>
                    <option value={1}>1×</option>
                    <option value={2}>2×</option>
                  </select>
                </label>
                {mode === "projectile" && (
                  <label className="toggle-control">
                    <input type="checkbox" checked={showVectors} onChange={(event) => setShowVectors(event.target.checked)} />
                    <span className="toggle-track" />
                    <span>Velocity vector</span>
                  </label>
                )}
              </div>
            </div>
          </section>

          <section className="metrics-grid">
            <MetricCard label={mode === "dynamics" ? "Displacement at 5 s" : mode === "freefall" ? "Fall time" : "Flight time"}
              value={mode === "dynamics" ? `${metrics.range.toFixed(2)} m` : `${metrics.duration.toFixed(2)} s`}
              icon="◷" accent="mint" />
            <MetricCard label={mode === "dynamics" ? "Final velocity" : mode === "freefall" ? "Impact speed" : "Horizontal range"}
              value={mode === "dynamics" ? `${metrics.finalSpeed.toFixed(2)} m/s` : mode === "freefall" ? `${metrics.finalSpeed.toFixed(2)} m/s` : `${metrics.range.toFixed(2)} m`}
              icon="↗" accent="blue" />
            <MetricCard label={mode === "dynamics" ? "Acceleration" : mode === "freefall" ? "Release height" : "Maximum height"}
              value={mode === "dynamics" ? `${metrics.acceleration.toFixed(2)} m/s²` : `${metrics.maxHeight.toFixed(2)} m`}
              icon="⌁" accent="amber" />
          </section>
        </div>
      </section>

      <section className="analysis-section">
        <div className="analysis-heading">
          <div>
            <p className="eyebrow">UNDER THE HOOD</p>
            <h2>Motion analysis</h2>
            <p className="section-description">Explore how the physical quantities change throughout the experiment.</p>
          </div>
          <button className="secondary-button" onClick={exportCsv}>↓ Export CSV</button>
        </div>
        <div className="graphs-grid">
          {graphs.map((graph) => (
            <MiniGraph
              key={graph.title}
              title={graph.title}
              yLabel={graph.yLabel}
              values={graph.values}
              color={graph.color}
            />
          ))}
        </div>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#top"><span className="brand-mark">φ</span><span>Phys<span className="brand-accent">Lab</span></span></a>
        <span>Built for curiosity. Powered by physics.</span>
        <span className="footer-units">SI units · Idealized models</span>
      </footer>
    </main>
  );
}

type ParameterControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
};

function ParameterControl({ label, value, min, max, step, unit, onChange }: ParameterControlProps) {
  return (
    <label className="parameter-control">
      <span className="parameter-label">{label}</span>
      <span className="parameter-value">{value.toFixed(step < 1 ? 2 : 0)} <small>{unit}</small></span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="range-labels"><span>{min} {unit}</span><span>{max} {unit}</span></span>
    </label>
  );
}

function MetricCard({ label, value, icon, accent }: { label: string; value: string; icon: string; accent: string }) {
  return (
    <article className={`metric-card accent-${accent}`}>
      <div className="metric-topline">
        <span>{label}</span>
        <span className="metric-icon">{icon}</span>
      </div>
      <strong>{value}</strong>
    </article>
  );
}

export default App;
