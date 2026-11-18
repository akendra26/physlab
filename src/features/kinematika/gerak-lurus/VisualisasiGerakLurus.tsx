import { useEffect } from "react";
import useCanvasDimensions from "../../../components/simulasi/useCanvasDimensions";
import {
  calculateLinearMotionState,
  type LinearMotionMode,
  type LinearMotionParams,
} from "./mesinGerakLurus";

type Props = {
  mode: LinearMotionMode;
  params: LinearMotionParams;
  time: number;
  showVectors: boolean;
  showAxes?: boolean;
  scaleMode?: "boundary-box" | "actual-scale";
};

const COLORS = {
  background: "#0b1422",
  grid: "rgba(148, 163, 184, 0.14)",
  axis: "#64748b",
  trail: "#55e0c1",
  object: "#ffca70",
  text: "#9aabc2",
  vector: "#f28e8e",
};

/** Visualisasi posisi benda pada lintasan horizontal satu dimensi. */
export default function VisualisasiGerakLurus({
  mode,
  params,
  time,
  showVectors,
  showAxes = true,
  scaleMode = "boundary-box",
}: Props) {
  const { canvasRef, width, height, pixelRatio } = useCanvasDimensions(16 / 9, 220);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const left = 48;
    const right = 24;
    const top = 34;
    const bottom = 58;
    const plotWidth = width - left - right;
    const trackY = Math.round(height * 0.58);

    // Cari rentang posisi sepanjang eksperimen agar benda selalu terlihat.
    const trajectory = Array.from({ length: 101 }, (_, index) => {
      const t = (params.duration * index) / 100;
      return calculateLinearMotionState(mode, params, t).x;
    });
    const rawMin = Math.min(params.initialPosition, ...trajectory);
    const rawMax = Math.max(params.initialPosition, ...trajectory);
    const rawSpan = Math.max(rawMax - rawMin, 1);
    const padding = rawSpan * 0.12;
    const halfRange = scaleMode === "boundary-box" ? 25 : Math.max(
      Math.abs(params.initialPosition - rawMin),
      Math.abs(rawMax - params.initialPosition),
    ) + padding;
    // Posisi awal selalu berada di tengah area plot.
    const minX = params.initialPosition - halfRange;
    const maxX = params.initialPosition + halfRange;
    const spanX = maxX - minX;
    const toCanvasX = (position: number) =>
      left + ((position - minX) / spanX) * plotWidth;

    context.clearRect(0, 0, width, height);
    context.fillStyle = COLORS.background;
    context.fillRect(0, 0, width, height);

    // Kotak pembatas kanvas agar visualisasi memiliki batas yang jelas.
    context.strokeStyle = "rgba(145,182,255,.65)";
    context.lineWidth = 1.5;
    context.strokeRect(left, top, plotWidth, height - top - bottom);

    // Garis kisi dan label koordinat.
    context.strokeStyle = COLORS.grid;
    context.fillStyle = COLORS.text;
    context.lineWidth = 1;
    context.font = "11px Inter, system-ui, sans-serif";

    for (let index = 0; index <= 5; index += 1) {
      const x = left + (plotWidth * index) / 5;
      const coordinate = minX + (spanX * index) / 5;

      context.beginPath();
      context.moveTo(x, top);
      context.lineTo(x, height - bottom);
      context.stroke();
      context.fillText(coordinate.toFixed(spanX < 20 ? 1 : 0), x - 10, height - 30);
    }

    // Lintasan horizontal dan titik asal koordinat.
    context.strokeStyle = COLORS.axis;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(left, trackY);
    context.lineTo(width - right, trackY);
    context.stroke();
    if (showAxes) {
      context.strokeStyle = "rgba(145,182,255,.75)";
      context.lineWidth = 1.5;
      context.beginPath();
      context.moveTo(left, top + 4);
      context.lineTo(left, height - bottom);
      context.lineTo(width - right, height - bottom);
      context.stroke();
      context.fillStyle = COLORS.text;
      context.font = "10px Inter, system-ui, sans-serif";
      context.fillText("y", left - 17, top + 5);
      context.fillText("x", width - right - 7, height - bottom + 18);
    }

    const zeroX = toCanvasX(0);
    context.strokeStyle = "rgba(148, 163, 184, 0.55)";
    context.setLineDash([4, 5]);
    context.beginPath();
    context.moveTo(zeroX, top + 8);
    context.lineTo(zeroX, height - bottom + 5);
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = COLORS.text;
    context.fillText("x = 0", Math.min(width - 62, Math.max(left, zeroX + 5)), top);

    // Clip the moving object and trail to the selected physical viewport.
    context.save();
    context.beginPath();
    context.rect(left, top, plotWidth, height - top - bottom);
    context.clip();

    // Jejak gerak dari posisi awal sampai posisi saat ini.
    const state = calculateLinearMotionState(
      mode,
      params,
      Math.max(0, time),
    );
    const initialX = toCanvasX(params.initialPosition);
    const currentX = toCanvasX(scaleMode === "boundary-box" ? Math.min(maxX, Math.max(minX, state.x)) : state.x);

    context.strokeStyle = COLORS.trail;
    context.lineWidth = 4;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(initialX, trackY);
    context.lineTo(currentX, trackY);
    context.stroke();

    // Penanda posisi awal.
    context.fillStyle = "#8ea7ff";
    context.beginPath();
    context.arc(initialX, trackY, 5, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = COLORS.text;
    context.fillText("x₀", initialX - 8, trackY + 25);

    // Vektor kecepatan: arah panah mengikuti tanda kecepatan.
    if (showVectors && Math.abs(state.vx) > 0.001) {
      const vectorLength = Math.min(90, Math.max(24, Math.abs(state.vx) * 5));
      const direction = Math.sign(state.vx);
      const startX = currentX;
      const endX = currentX + direction * vectorLength;
      const arrowY = trackY - 48;

      context.strokeStyle = COLORS.vector;
      context.fillStyle = COLORS.vector;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(startX, arrowY);
      context.lineTo(endX, arrowY);
      context.stroke();
      context.beginPath();
      context.moveTo(endX, arrowY);
      context.lineTo(endX - direction * 8, arrowY - 5);
      context.lineTo(endX - direction * 8, arrowY + 5);
      context.closePath();
      context.fill();
      context.fillText("v", endX + direction * 5, arrowY - 9);
    }

    // Benda bergerak.
    context.shadowColor = "rgba(255, 202, 112, 0.35)";
    context.shadowBlur = 16;
    context.fillStyle = COLORS.object;
    context.beginPath();
    context.arc(currentX, trackY, 10, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;
    context.restore();

    // Informasi numerik pada area visualisasi.
    context.fillStyle = COLORS.text;
    context.font = "12px Inter, system-ui, sans-serif";
    context.fillText(`t = ${time.toFixed(2)} s`, left + 8, 18);
    context.fillText(`x = ${state.x.toFixed(2)} m`, left + 8, 40);
    context.fillText(`v = ${state.vx.toFixed(2)} m/s`, left + plotWidth * 0.36, 40);
    context.fillText(`a = ${state.ax.toFixed(2)} m/s²`, left + plotWidth * 0.70, 40);
    context.fillText("Posisi (m)", width - 92, height - 7);
    context.fillText(scaleMode === "boundary-box" ? "BOUNDARY BOX · ±25 m dari x₀" : "ACTUAL SCALE · auto range", left + 8, height - 8);
  }, [mode, params, time, showVectors, showAxes, scaleMode, width, height, pixelRatio]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Visualisasi ${mode.toUpperCase()} pada lintasan satu dimensi`}
      style={{ display: "block", width: "100%", height, aspectRatio: `${width}/${height}`, borderRadius: 12 }}
    />
  );
}
