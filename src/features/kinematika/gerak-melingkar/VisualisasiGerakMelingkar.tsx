import { useEffect } from "react";
import useCanvasDimensions from "../../../components/simulasi/useCanvasDimensions";
import { hitungKeadaanGerakMelingkar, type ParameterGerakMelingkar } from "./mesinGerakMelingkar";

type Props = {
  parameter: ParameterGerakMelingkar;
  waktu: number;
  tampilkanVektor: boolean;
  scaleMode?: "boundary-box" | "actual-scale";
};
const COLORS = { background: "#0b1422", grid: "rgba(148,163,184,.13)", trail: "#55e0c1", object: "#ffca70", text: "#9aabc2", radius: "#8ea7ff", velocity: "#f28e8e", centripetal: "#f6bd60" };

/** Lintasan melingkar responsif dengan skala tetap atau auto-scale berbasis jari-jari fisik. */
export default function VisualisasiGerakMelingkar({ parameter, waktu, tampilkanVektor, scaleMode = "boundary-box" }: Props) {
  const { canvasRef, width, height, pixelRatio } = useCanvasDimensions(16 / 9, 300);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const targetWidth = Math.round(width * pixelRatio);
    const targetHeight = Math.round(height * pixelRatio);
    // Setting canvas dimensions clears its buffer; only resize when the size actually changes.
    if (canvas.width !== targetWidth) canvas.width = targetWidth;
    if (canvas.height !== targetHeight) canvas.height = targetHeight;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(142, width * 0.22, (height - 100) / 2);
    const radiusPx = scaleMode === "actual-scale"
      ? Math.max(6, maxRadius * (parameter.jariJari / 10))
      : maxRadius * 0.82;
    const state = hitungKeadaanGerakMelingkar(parameter, Math.min(waktu, parameter.durasi));
    const x = centerX + radiusPx * Math.cos(state.sudut);
    const y = centerY - radiusPx * Math.sin(state.sudut);

    context.clearRect(0, 0, width, height);
    context.fillStyle = COLORS.background; context.fillRect(0, 0, width, height);
    context.strokeStyle = COLORS.grid; context.lineWidth = 1;
    const spacing = 32;
    for (let gx = centerX % spacing; gx < width; gx += spacing) { context.beginPath(); context.moveTo(gx, 0); context.lineTo(gx, height); context.stroke(); }
    for (let gy = centerY % spacing; gy < height; gy += spacing) { context.beginPath(); context.moveTo(0, gy); context.lineTo(width, gy); context.stroke(); }

    // Sumbu koordinat dan skala meter.
    context.strokeStyle = "rgba(145,182,255,.55)"; context.lineWidth = 1.4;
    context.beginPath(); context.moveTo(24, centerY); context.lineTo(width - 24, centerY); context.moveTo(centerX, 28); context.lineTo(centerX, height - 42); context.stroke();
    context.fillStyle = COLORS.text; context.font = "10px Inter, system-ui, sans-serif";
    const pixelsPerMeter = scaleMode === "actual-scale" ? radiusPx / parameter.jariJari : radiusPx / parameter.jariJari;
    const maxTick = Math.max(1, Math.floor((Math.min(width * 0.44, height * 0.40) / Math.max(pixelsPerMeter, 1))));
    for (let tick = -maxTick; tick <= maxTick; tick += Math.max(1, Math.ceil(maxTick / 4))) {
      if (tick === 0) continue;
      const px = centerX + tick * pixelsPerMeter;
      const py = centerY - tick * pixelsPerMeter;
      if (px > 28 && px < width - 28) { context.beginPath(); context.moveTo(px, centerY - 4); context.lineTo(px, centerY + 4); context.stroke(); context.fillText(String(tick), px - 4, centerY + 16); }
      if (py > 28 && py < height - 42) { context.beginPath(); context.moveTo(centerX - 4, py); context.lineTo(centerX + 4, py); context.stroke(); context.fillText(String(tick), centerX + 8, py + 3); }
    }

    // Lingkaran, busur lintasan, jari-jari dan benda bergerak.
    context.strokeStyle = "rgba(85,224,193,.6)"; context.lineWidth = 2; context.setLineDash([6, 6]);
    context.beginPath(); context.arc(centerX, centerY, radiusPx, 0, Math.PI * 2); context.stroke(); context.setLineDash([]);
    const start = parameter.sudutAwalDerajat * Math.PI / 180;
    const difference = state.sudut - start;
    const samples = Math.max(2, Math.min(600, Math.ceil(Math.abs(difference) * 24)));
    context.strokeStyle = COLORS.trail; context.lineWidth = 3; context.beginPath();
    for (let i = 0; i <= samples; i += 1) {
      const angle = start + difference * i / samples;
      const px = centerX + radiusPx * Math.cos(angle); const py = centerY - radiusPx * Math.sin(angle);
      if (i === 0) context.moveTo(px, py); else context.lineTo(px, py);
    }
    context.stroke();
    context.strokeStyle = COLORS.radius; context.lineWidth = 2; context.beginPath(); context.moveTo(centerX, centerY); context.lineTo(x, y); context.stroke();
    context.fillStyle = "#f3f5fb"; context.beginPath(); context.arc(centerX, centerY, 4, 0, Math.PI * 2); context.fill();

    if (tampilkanVektor) {
      if (Math.abs(state.kecepatanSudut) > 1e-6) {
        const sign = Math.sign(state.kecepatanSudut);
        const length = Math.min(72, Math.max(20, state.kecepatanTangensial * 3.5));
        drawArrow(context, x, y, x - Math.sin(state.sudut) * sign * length, y - Math.cos(state.sudut) * sign * length, COLORS.velocity);
        context.fillStyle = COLORS.velocity; context.fillText("v", x - Math.sin(state.sudut) * sign * (length + 12), y - Math.cos(state.sudut) * sign * (length + 12));
      }
      if (state.percepatanSentripetal > 1e-6) {
        const length = Math.min(64, Math.max(18, state.percepatanSentripetal * 1.8));
        const dx = (centerX - x) / radiusPx; const dy = (centerY - y) / radiusPx;
        drawArrow(context, x, y, x + dx * length, y + dy * length, COLORS.centripetal);
        context.fillStyle = COLORS.centripetal; context.fillText("a꜀", x + dx * (length + 12), y + dy * (length + 12));
      }
    }
    context.shadowColor = "rgba(255,202,112,.42)"; context.shadowBlur = 16; context.fillStyle = COLORS.object;
    context.beginPath(); context.arc(x, y, 9, 0, Math.PI * 2); context.fill(); context.shadowBlur = 0;
    context.fillStyle = COLORS.text; context.font = "12px Inter, system-ui, sans-serif";
    context.fillText(`t = ${waktu.toFixed(2)} s`, 18, 20);
    context.fillText(`θ = ${state.sudutDerajat.toFixed(1)}°`, 18, 40);
    context.fillText(`ω = ${state.kecepatanSudut.toFixed(2)} rad/s`, width - 195, 20);
    context.fillText(`R = ${parameter.jariJari.toFixed(2)} m · ${scaleMode === "boundary-box" ? "Boundary Box" : "Actual Scale"}`, 18, height - 12);
  }, [canvasRef, height, parameter, pixelRatio, scaleMode, tampilkanVektor, waktu, width]);

  return <canvas ref={canvasRef} role="img" aria-label="Visualisasi lintasan GMB dan GMBB dengan koordinat dan vektor" style={{ display: "block", width: "100%", height, borderRadius: 12 }} />;
}

function drawArrow(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  const angle = Math.atan2(y2 - y1, x2 - x1); const size = 8;
  context.strokeStyle = color; context.fillStyle = color; context.lineWidth = 2.4;
  context.beginPath(); context.moveTo(x1, y1); context.lineTo(x2, y2); context.stroke();
  context.beginPath(); context.moveTo(x2, y2); context.lineTo(x2 - size * Math.cos(angle - Math.PI / 6), y2 - size * Math.sin(angle - Math.PI / 6)); context.lineTo(x2 - size * Math.cos(angle + Math.PI / 6), y2 - size * Math.sin(angle + Math.PI / 6)); context.closePath(); context.fill();
}
