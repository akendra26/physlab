import { memo } from "react";
import type { KeadaanDinamika, ParameterKurikulumDinamika, SkenarioDinamika } from "./mesinKurikulum";
import { useBahasa } from "../../i18n/BahasaContext";
import { useKinematicsScaleMode } from "../../components/simulasi/SimulationExperience";

type Props = {
  skenario: SkenarioDinamika;
  parameter: ParameterKurikulumDinamika;
  keadaan: KeadaanDinamika;
  waktu: number;
};

function Arrow({ x1, y1, x2, y2, color, label, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color: string; label: string; dashed?: boolean }) {
  if (Math.hypot(x2 - x1, y2 - y1) < 1) return null;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 9;
  const bx = x2 - size * Math.cos(angle);
  const by = y2 - size * Math.sin(angle);
  const px = (size * 0.55) * Math.sin(angle);
  const py = -(size * 0.55) * Math.cos(angle);
  return (
    <g className="force-vector-arrow">
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#070d18" strokeWidth="8" strokeLinecap="round" strokeDasharray={dashed ? "5 4" : undefined} />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="4.6" strokeLinecap="round" strokeDasharray={dashed ? "5 4" : undefined} />
      <polygon points={`${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`} fill={color} stroke="#070d18" strokeWidth="1.5" />
      <text x={x2 + Math.cos(angle) * 9} y={y2 + Math.sin(angle) * 9 - 5} fill={color} stroke="#070d18" strokeWidth="3.5" strokeLinejoin="round" paintOrder="stroke" fontSize="14" fontWeight="800">{label}</text>
    </g>
  );
}

function Block({ x, y, width = 86, height = 48, label, mass, fill = "#283a5e" }: { x: number; y: number; width?: number; height?: number; label: string; mass: number; fill?: string }) {
  return (
    <g>
      <rect x={x - width / 2} y={y - height / 2} width={width} height={height} rx="7" fill={fill} stroke="#e89973" strokeWidth="2" />
      <path d={`M${x - width / 2 + 9} ${y - height / 2 + 9}h${width - 18}`} stroke="rgba(255,255,255,.16)" strokeWidth="2" />
      <text x={x} y={y - 2} textAnchor="middle" fill="#f2efff" fontSize="13" fontWeight="700">{label}</text>
      <text x={x} y={y + 15} textAnchor="middle" fill="#b8c6e2" fontSize="10">{mass.toFixed(1)} kg</text>
    </g>
  );
}

function Spring({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  const nx = -dy / length;
  const ny = dx / length;
  const turns = Math.max(5, Math.min(14, Math.round(length / 22)));
  const points = Array.from({ length: 97 }, (_, index) => {
    const t = index / 96;
    const envelope = Math.sin(Math.PI * t);
    const offset = Math.sin(t * turns * Math.PI * 2) * 10 * envelope;
    return `${(x1 + dx * t + nx * offset).toFixed(2)},${(y1 + dy * t + ny * offset).toFixed(2)}`;
  });
  return <path d={`M${points.join(" L")}`} fill="none" stroke="#8ea7ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />;
}

function VisualisasiDinamikaKurikulum({ skenario, parameter, keadaan, waktu }: Props) {
  const isId = useBahasa() === "id";
  const scaleMode = useKinematicsScaleMode();
  const pixelsPerMeter = scaleMode === "actual-scale" ? 20 : 15;
  const dx = Math.max(-130, Math.min(180, keadaan.displacement * pixelsPerMeter));
  const panah = (nilai: number, faktor = 2.2) => {
    const besar = Math.abs(nilai);
    return besar < 1e-8 ? 0 : Math.max(20, Math.min(105, besar * faktor));
  };

  return (
    <div className="dinamika-scene-frame">
      <svg viewBox="0 0 860 430" role="img" aria-label={isId ? `Visualisasi ${skenario} pada waktu ${waktu.toFixed(2)} sekon` : `${skenario} visualization at ${waktu.toFixed(2)} seconds`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="dynamics-grid" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke="rgba(148,163,184,.10)" strokeWidth="1" /></pattern>
          <linearGradient id="dynamics-glow" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#1b2c4b" /><stop offset="1" stopColor="#0b1422" /></linearGradient>
        </defs>
        <rect x="0" y="0" width="860" height="430" rx="14" fill="url(#dynamics-glow)" />
        <rect x="0" y="0" width="860" height="430" rx="14" fill="url(#dynamics-grid)" />
        <rect x="10" y="10" width="840" height="410" rx="11" fill="none" stroke={scaleMode === "boundary-box" ? "#8ea7ff" : "#e89973"} strokeWidth="1.5" strokeDasharray={scaleMode === "boundary-box" ? "7 6" : "2 5"} opacity=".72" pointerEvents="none" />
        <text x="830" y="414" textAnchor="end" fill={scaleMode === "boundary-box" ? "#9aabc2" : "#e89973"} fontSize="10" letterSpacing="1">{scaleMode === "boundary-box" ? (isId ? "KOTAK BATAS · TAMPILAN TETAP" : "BOUNDARY BOX · FIXED VIEW") : (isId ? `SKALA NYATA · ${pixelsPerMeter} px/m` : `ACTUAL SCALE · ${pixelsPerMeter} px/m`)}</text>
        <text x="28" y="30" fill="#96a8c9" fontSize="11" letterSpacing="1.6">{isId ? "MODEL DINAMIKA · SI" : "DYNAMICS MODEL · SI"}</text>
        <text x="830" y="30" fill="#e89973" fontSize="11" textAnchor="end">t = {waktu.toFixed(2)} s</text>

        {skenario === "balok" && (() => {
          const x = Math.max(150, Math.min(700, 410 + dx));
          const dy = Math.min(150, Math.max(0, keadaan.verticalDisplacement * pixelsPerMeter));
          const y = 292 - dy;
          const forceScale = 1.7;
          const fxComponent = keadaan.appliedForceX * forceScale;
          const fyComponent = keadaan.appliedForceY * forceScale;
          const nLen = panah(keadaan.normalForce, 1.1);
          const wLen = panah(keadaan.weightForce, 1.1);
          const frLen = panah(keadaan.frictionForce, 1.7);
          const sudut = parameter.sudutGaya * Math.PI / 180;
          const asalFX = x + 45;
          const ujungFX = asalFX + fxComponent;
          const ujungFY = y - fyComponent;
          const sudutNormal = ((parameter.sudutGaya % 360) + 360) % 360;
          const sudutLabelY = Math.sin(sudut) >= 0 ? y - 16 : y + 18;
          return <>
            <line x1="90" y1="330" x2="770" y2="330" stroke="#6c7e9f" strokeWidth="4" />
            <line x1="90" y1="338" x2="770" y2="338" stroke="#344665" strokeWidth="2" />
            <Block x={x} y={y} label="m" mass={parameter.massa} />
            <Arrow x1={x} y1={y - 27} x2={x} y2={y - 27 - nLen} color="#8ea7ff" label="N" />
            <Arrow x1={x} y1={y + 27} x2={x} y2={y + 27 + wLen} color="#e58db2" label="w" />
            <Arrow x1={asalFX} y1={y} x2={ujungFX} y2={ujungFY} color="#e89973" label="F" />
            <Arrow x1={asalFX} y1={y} x2={ujungFX} y2={y} color="#f6bd60" label="Fₓ" dashed />
            <Arrow x1={ujungFX} y1={y} x2={ujungFX} y2={ujungFY} color="#8ea7ff" label="Fᵧ" dashed />
            <path d={`M ${asalFX + 27} ${y} A 27 27 0 ${sudutNormal > 180 ? 1 : 0} 0 ${asalFX + 27 * Math.cos(sudut)} ${y - 27 * Math.sin(sudut)}`} fill="none" stroke="#e89973" strokeWidth="1.8" />
            <text x={asalFX + 34} y={sudutLabelY} fill="#f4c0a7" fontSize="11" fontWeight="700">θ = {parameter.sudutGaya}°</text>
            <Arrow x1={x - 45} y1={y + 14} x2={x - 45 - frLen} y2={y + 14} color="#55e0c1" label="f" />
            <text x="110" y="390" fill="#9aabc2" fontSize="12">{isId ? `Fₓ = F cos θ · Fᵧ = F sin θ · perpindahan vertikal ${keadaan.verticalDisplacement.toFixed(2)} m` : `Fₓ = F cos θ · Fᵧ = F sin θ · vertical displacement ${keadaan.verticalDisplacement.toFixed(2)} m`}</text>
          </>;
        })()}

        {skenario === "osilasi" && parameter.modeOsilasi === "pegas" && (() => {
          const displacement = Math.max(-75, Math.min(75, keadaan.displacement * 150));
          if (parameter.orientasiPegas === "vertikal") {
            const blockY = 285 + displacement;
            return <>
              <rect x="300" y="100" width="260" height="16" rx="5" fill="#455a7d" />
              {Array.from({ length: 9 }, (_, index) => <line key={index} x1={310 + index * 28} y1="100" x2={322 + index * 28} y2="84" stroke="#7083a7" strokeWidth="2" />)}
              <Spring x1={430} y1={116} x2={430} y2={blockY - 34} />
              <Block x={430} y={blockY} width={88} height={68} label="m" mass={parameter.massa} />
              <Arrow x1={485} y1={blockY} x2={485} y2={blockY + 58} color="#55e0c1" label="mg" />
              <text x="110" y="385" fill="#9aabc2" fontSize="12">{isId ? "Pegas vertikal: beban berosilasi di bawah titik kait." : "Vertical spring: the mass oscillates below its anchor."}</text>
            </>;
          }
          const x = 470 + displacement;
          return <>
            <rect x="150" y="120" width="20" height="220" rx="4" fill="#455a7d" />
            {Array.from({ length: 8 }, (_, index) => <line key={index} x1="150" y1={132 + index * 28} x2="132" y2={143 + index * 28} stroke="#7083a7" strokeWidth="2" />)}
            <Spring x1={170} y1={255} x2={x - 44} y2={255} />
            <Block x={x} y={255} width={88} height={68} label="m" mass={parameter.massa} />
            <Arrow x1={x + 46} y1={255} x2={x + 46 - keadaan.displacement * 120} y2={255} color="#55e0c1" label="Fₛ = −kx" />
            <text x="110" y="385" fill="#9aabc2" fontSize="12">{isId ? "Pegas horizontal: simpangan dan gaya pemulih mengikuti Hukum Hooke." : "Horizontal spring: displacement and restoring force follow Hooke's law."}</text>
            <text x="110" y="405" fill="#e89973" fontSize="12">x = {keadaan.displacement.toFixed(3)} m · v = {keadaan.velocity.toFixed(3)} m/s</text>
          </>;
        })()}

        {skenario === "osilasi" && parameter.modeOsilasi === "bandul" && (() => {
          const pivotX = 430; const pivotY = 105; const radius = 205;
          const x = pivotX + radius * Math.sin(keadaan.angle);
          const y = pivotY + radius * Math.cos(keadaan.angle);
          return <>
            <line x1="300" y1="105" x2="560" y2="105" stroke="#7083a7" strokeWidth="6" strokeLinecap="round" />
            <circle cx={pivotX} cy={pivotY} r="7" fill="#e89973" />
            <line x1={pivotX} y1={pivotY} x2={x} y2={y} stroke="#8ea7ff" strokeWidth="4" />
            <circle cx={x} cy={y} r="18" fill="#e89973" stroke="#ffe2d3" strokeWidth="2" />
            <Arrow x1={x} y1={y + 19} x2={x} y2={y + 83} color="#e58db2" label="mg" />
            <path d={`M${pivotX} ${pivotY + 70} A70 70 0 0 ${keadaan.angle >= 0 ? 1 : 0} ${pivotX + 70 * Math.sin(keadaan.angle)} ${pivotY + 70 * Math.cos(keadaan.angle)}`} fill="none" stroke="#f6bd60" strokeWidth="2" />
            <text x="110" y="385" fill="#9aabc2" fontSize="12">{isId ? "Pendekatan sudut kecil: sin θ ≈ θ, sehingga gerak mendekati harmonik sederhana" : "Small-angle approximation: sin θ ≈ θ, so the motion approaches simple harmonic motion"}</text>
            <text x="110" y="405" fill="#e89973" fontSize="12">θ = {(keadaan.angle * 180 / Math.PI).toFixed(2)}° · ω = {keadaan.angularVelocity.toFixed(3)} rad/s</text>
          </>;
        })()}
      </svg>
    </div>
  );
}

export default memo(VisualisasiDinamikaKurikulum);
