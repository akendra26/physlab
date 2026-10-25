import { useEffect, useRef } from "react";
import {
  calculateState,
  type SimulationMode,
  type SimulationParams,
} from "../physics/projectile";

type Props = {
  mode: SimulationMode;
  params: SimulationParams;
  time: number;
  showVectors: boolean;
};

const COLORS = {
  grid: "rgba(148, 163, 184, 0.12)",
  axis: "#64748b",
  trail: "#55e0c1",
  object: "#ffca70",
  text: "#9aabc2",
  vector: "#f28e8e",
};

export default function ProjectileCanvas({ mode, params, time, showVectors }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const width = Math.max(320, canvas.clientWidth);
    const height = 360;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const marginLeft = 48;
    const marginRight = 22;
    const marginTop = 24;
    const marginBottom = 40;
    const plotWidth = width - marginLeft - marginRight;
    const plotHeight = height - marginTop - marginBottom;
    const metrics = mode === "dynamics"
      ? { duration: 5, range: Math.max(1, params.force / params.mass * 12.5), maxHeight: 0 }
      : mode === "freefall"
        ? { duration: Math.max(0.01, Math.sqrt(2 * params.initialHeight / params.gravity)), range: 0, maxHeight: params.initialHeight }
        : (() => {
            const theta = params.angleDeg * Math.PI / 180;
            const vy = params.speed * Math.sin(theta);
            const duration = (vy + Math.sqrt(vy * vy + 2 * params.gravity * params.initialHeight)) / params.gravity;
            return {
              duration: Math.max(0.01, duration),
              range: params.speed * Math.cos(theta) * duration,
              maxHeight: params.initialHeight + vy * vy / (2 * params.gravity),
            };
          })();

    const maxX = mode === "freefall" ? 1 : Math.max(metrics.range * 1.08, 1);
    const maxY = mode === "dynamics"
      ? 1
      : Math.max(metrics.maxHeight * 1.15, 1);

    const sx = (x: number) => marginLeft + (x / maxX) * plotWidth;
    const sy = (y: number) => height - marginBottom - (y / maxY) * plotHeight;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#0b1422";
    ctx.fillRect(0, 0, width, height);

    // Grid and labels
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    ctx.fillStyle = COLORS.text;
    ctx.font = "11px Inter, system-ui, sans-serif";
    for (let i = 0; i <= 5; i++) {
      const x = marginLeft + (plotWidth * i) / 5;
      ctx.beginPath();
      ctx.moveTo(x, marginTop);
      ctx.lineTo(x, height - marginBottom);
      ctx.stroke();
      const label = mode === "freefall"
        ? (metrics.duration * i / 5).toFixed(1)
        : (maxX * i / 5).toFixed(maxX < 10 ? 1 : 0);
      ctx.fillText(label, x - 8, height - 17);
    }
    for (let i = 0; i <= 4; i++) {
      const y = marginTop + (plotHeight * i) / 4;
      ctx.beginPath();
      ctx.moveTo(marginLeft, y);
      ctx.lineTo(width - marginRight, y);
      ctx.stroke();
      if (mode !== "dynamics") {
        const value = maxY * (1 - i / 4);
        ctx.fillText(value.toFixed(maxY < 10 ? 1 : 0), 6, y + 4);
      }
    }

    // Axes
    ctx.strokeStyle = COLORS.axis;
    ctx.beginPath();
    ctx.moveTo(marginLeft, marginTop);
    ctx.lineTo(marginLeft, height - marginBottom);
    ctx.lineTo(width - marginRight, height - marginBottom);
    ctx.stroke();

    if (mode === "freefall") {
      // Free fall is shown as height above ground against time.
      const duration = Math.max(metrics.duration, 0.01);
      const tNow = Math.min(time, duration);
      ctx.strokeStyle = COLORS.trail;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const t = duration * i / 100;
        const state = calculateState(mode, params, t);
        const px = marginLeft + (t / duration) * plotWidth;
        const py = sy(state.y);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      const state = calculateState(mode, params, tNow);
      const px = marginLeft + (tNow / duration) * plotWidth;
      const py = sy(state.y);
      drawBall(ctx, px, py);
      ctx.fillStyle = COLORS.text;
      ctx.fillText("Time (s)", width - 66, height - 5);
      ctx.save();
      ctx.translate(14, height / 2 + 25);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Height (m)", 0, 0);
      ctx.restore();
    } else if (mode === "dynamics") {
      const duration = 5;
      const xMax = Math.max(1, metrics.range);
      const trackY = height - marginBottom - 42;
      ctx.strokeStyle = COLORS.trail;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(marginLeft, trackY);
      ctx.lineTo(width - marginRight, trackY);
      ctx.stroke();
      const state = calculateState(mode, params, Math.min(time, duration));
      const px = marginLeft + (state.x / xMax) * plotWidth;
      ctx.fillStyle = COLORS.object;
      ctx.fillRect(Math.min(width - marginRight - 16, Math.max(marginLeft, px - 10)), trackY - 24, 20, 24);
      ctx.fillStyle = COLORS.text;
      ctx.fillText("Block displacement →", marginLeft, marginTop + 14);
      ctx.fillText("0", marginLeft - 4, height - 17);
      ctx.fillText(`${xMax.toFixed(1)} m`, width - marginRight - 38, height - 17);
    } else {
      const duration = Math.max(metrics.duration, 0.01);
      const tNow = Math.min(time, duration);

      ctx.strokeStyle = COLORS.trail;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const t = duration * i / 120;
        const state = calculateState(mode, params, t);
        const px = sx(state.x);
        const py = sy(Math.max(0, state.y));
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const state = calculateState(mode, params, tNow);
      const px = sx(state.x);
      const py = sy(Math.max(0, state.y));

      if (showVectors) {
        const vectorScale = 0.22;
        ctx.strokeStyle = COLORS.vector;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + state.vx * vectorScale, py - state.vy * vectorScale);
        ctx.stroke();
        ctx.fillStyle = COLORS.vector;
        ctx.fillText("v", px + state.vx * vectorScale + 4, py - state.vy * vectorScale);
      }

      drawBall(ctx, px, py);
      ctx.fillStyle = COLORS.text;
      ctx.fillText("x (m)", width - 58, height - 5);
      ctx.save();
      ctx.translate(14, height / 2 + 25);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("y (m)", 0, 0);
      ctx.restore();
    }

    ctx.fillStyle = COLORS.text;
    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.fillText(`t = ${time.toFixed(2)} s`, marginLeft + 8, 16);
  }, [mode, params, time, showVectors]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Physics simulation animation"
      role="img"
      style={{ display: "block", width: "100%", borderRadius: 12 }}
    />
  );
}

function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "rgba(255, 202, 112, 0.18)";
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.object;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();
}
