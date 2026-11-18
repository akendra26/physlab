import { useEffect, useMemo } from "react";
import useCanvasDimensions from "../../../components/simulasi/useCanvasDimensions";
import { hitungGerakParabola, hitungMetrikParabola, type ParameterGerakDuaDimensi } from "./mesinGerakDuaDimensi";

type Props = {
  params: ParameterGerakDuaDimensi;
  time: number;
  showVectors: boolean;
  scaleMode?: "boundary-box" | "actual-scale";
};
const WARNA = { grid: "rgba(148,163,184,.12)", axis: "#64748b", trail: "#55e0c1", object: "#ffca70", text: "#9aabc2", vector: "#f28e8e" };

/** Kanvas parabola responsif. Boundary Box memakai amplop sudut 0–360°, Actual Scale mengikuti jangkauan aktif. */
export default function VisualisasiGerakDuaDimensi({ params, time, showVectors, scaleMode = "boundary-box" }: Props) {
  const { canvasRef, width, height, pixelRatio } = useCanvasDimensions(16 / 9, 220);
  const envelope = useMemo(() => {
    let maxX = 1;
    let maxY = Math.max(1, params.initialHeight);
    for (let deg = 0; deg <= 360; deg += 1) {
      const angle = deg * Math.PI / 180;
      const vx = params.speed * Math.cos(angle);
      const vy = params.speed * Math.sin(angle);
      const duration = (vy + Math.sqrt(vy * vy + 2 * params.gravity * params.initialHeight)) / params.gravity;
      maxX = Math.max(maxX, Math.abs(vx * duration));
      maxY = Math.max(maxY, params.initialHeight + (Math.max(0, vy) ** 2) / (2 * params.gravity));
    }
    return { x: maxX * 1.12, y: maxY * 1.12 };
  }, [params.gravity, params.initialHeight, params.speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const margin = { left: 52, right: 24, top: 28, bottom: 46 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const metrics = hitungMetrikParabola(params);
    const duration = Math.max(metrics.duration, 0.01);
    const currentTime = Math.min(Math.max(0, time), duration);
    const actualX = Math.max(1, Math.abs(metrics.range) * 1.12, 1.1);
    const actualY = Math.max(1, metrics.maxHeight * 1.12);
    const rangeX = scaleMode === "boundary-box" ? envelope.x : actualX;
    const rangeY = scaleMode === "boundary-box" ? envelope.y : actualY;
    const minX = -rangeX;
    const maxX = rangeX;
    const toX = (x: number) => margin.left + ((x - minX) / (maxX - minX)) * plotWidth;
    const toY = (y: number) => height - margin.bottom - (y / rangeY) * plotHeight;

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#0b1422";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "rgba(145,182,255,.68)";
    context.lineWidth = 1.5;
    context.strokeRect(margin.left, margin.top, plotWidth, plotHeight);
    context.strokeStyle = WARNA.grid;
    context.lineWidth = 1;
    context.fillStyle = WARNA.text;
    context.font = "11px Inter, system-ui, sans-serif";
    for (let i = 0; i <= 6; i += 1) {
      const x = margin.left + (plotWidth * i) / 6;
      const val = minX + ((maxX - minX) * i) / 6;
      context.beginPath(); context.moveTo(x, margin.top); context.lineTo(x, height - margin.bottom); context.stroke();
      context.fillText(val.toFixed(rangeX < 10 ? 1 : 0), x - 10, height - 24);
    }
    for (let i = 0; i <= 4; i += 1) {
      const y = margin.top + (plotHeight * i) / 4;
      const val = rangeY * (1 - i / 4);
      context.beginPath(); context.moveTo(margin.left, y); context.lineTo(width - margin.right, y); context.stroke();
      context.fillText(val.toFixed(rangeY < 10 ? 1 : 0), 7, y + 4);
    }
    const zeroX = toX(0);
    const groundY = toY(0);
    context.strokeStyle = WARNA.axis;
    context.lineWidth = 2;
    context.beginPath(); context.moveTo(margin.left, groundY); context.lineTo(width - margin.right, groundY); context.moveTo(zeroX, margin.top); context.lineTo(zeroX, groundY); context.stroke();
    context.fillStyle = WARNA.text;
    context.fillText("y = 0", zeroX + 6, groundY - 8);

    context.save();
    context.beginPath(); context.rect(margin.left + 1, margin.top + 1, plotWidth - 2, plotHeight - 2); context.clip();
    context.strokeStyle = WARNA.trail;
    context.lineWidth = 2.7;
    context.lineCap = "round";
    context.beginPath();
    for (let index = 0; index <= 160; index += 1) {
      const state = hitungGerakParabola(params, duration * index / 160);
      const x = toX(state.x); const y = toY(Math.max(0, state.y));
      if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.stroke();

    const state = hitungGerakParabola(params, currentTime);
    const objectX = toX(state.x);
    const objectY = toY(Math.max(0, state.y));
    if (showVectors) {
      const scale = Math.min(4.5, Math.max(1.5, plotWidth / (rangeX * 18)));
      const vxEnd = objectX + state.vx * scale;
      const vyEnd = objectY - state.vy * scale;
      context.strokeStyle = WARNA.vector; context.fillStyle = WARNA.vector; context.lineWidth = 2.2;
      context.beginPath(); context.moveTo(objectX, objectY); context.lineTo(vxEnd, vyEnd); context.stroke();
      drawArrowHead(context, objectX, objectY, vxEnd, vyEnd, WARNA.vector);
      context.fillText("v", vxEnd + 6, vyEnd - 4);
      const gEndY = Math.min(height - margin.bottom - 8, objectY + 45);
      context.strokeStyle = "#f6bd60"; context.fillStyle = "#f6bd60";
      context.beginPath(); context.moveTo(objectX - 18, objectY); context.lineTo(objectX - 18, gEndY); context.stroke();
      drawArrowHead(context, objectX - 18, objectY, objectX - 18, gEndY, "#f6bd60");
      context.fillText("g", objectX - 32, gEndY + 13);
    }
    context.shadowColor = "rgba(255,202,112,.42)"; context.shadowBlur = 18;
    context.fillStyle = WARNA.object; context.beginPath(); context.arc(objectX, objectY, 8, 0, Math.PI * 2); context.fill();
    context.shadowBlur = 0;
    context.restore();

    context.fillStyle = WARNA.text; context.font = "12px Inter, system-ui, sans-serif";
    context.fillText(`t = ${time.toFixed(2)} s`, margin.left + 8, 17);
    context.fillText(`θ = ${params.angleDeg.toFixed(0)}°`, margin.left + 112, 17);
    context.fillText(`x = ${hitungGerakParabola(params, currentTime).x.toFixed(2)} m`, margin.left + 205, 17);
    context.fillText("x (m)", width - 62, height - 5);
    context.save(); context.translate(14, height / 2 + 25); context.rotate(-Math.PI / 2); context.fillText("y (m)", 0, 0); context.restore();
    context.fillText(scaleMode === "boundary-box" ? "BOUNDARY BOX · envelope tetap 0°–360°" : "ACTUAL SCALE · auto range lintasan aktif", margin.left + 6, height - 5);
  }, [canvasRef, envelope, height, params, pixelRatio, scaleMode, showVectors, time, width]);

  return <canvas ref={canvasRef} role="img" aria-label="Visualisasi lintasan gerak parabola 0 sampai 360 derajat" style={{ display: "block", width: "100%", height, borderRadius: 12 }} />;
}

function drawArrowHead(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 8;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(x2, y2);
  context.lineTo(x2 - size * Math.cos(angle - Math.PI / 6), y2 - size * Math.sin(angle - Math.PI / 6));
  context.lineTo(x2 - size * Math.cos(angle + Math.PI / 6), y2 - size * Math.sin(angle + Math.PI / 6));
  context.closePath(); context.fill();
}
