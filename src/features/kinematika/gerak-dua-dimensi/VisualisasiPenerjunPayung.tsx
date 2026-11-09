import { useMemo } from "react";
import { hitungKeadaanPenerjun } from "./mesinPenerjunPayung";

type Props = {
  ketinggianAwal: number;
  gravitasi: number;
  waktu: number;
};


export default function VisualisasiPenerjunPayung({
  ketinggianAwal,
  gravitasi,
  waktu,
}: Props) {
  const keadaan = useMemo(
    () => hitungKeadaanPenerjun(ketinggianAwal, gravitasi, waktu),
    [gravitasi, ketinggianAwal, waktu],
  );
  const rasio = ketinggianAwal > 0
    ? keadaan.jarak / ketinggianAwal
    : 1;
  const y = 54 + rasio * 235;
  const menyentuh = keadaan.menyentuhTanah;

  return (
    <div className="skydiver-lab-visual">
      <svg viewBox="0 0 760 360" role="img" aria-label="Animasi penerjun payung dengan gravitasi dan hambatan udara">
        <defs>
          <linearGradient id="skydiver-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#142c50" />
            <stop offset="100%" stopColor="#233c60" />
          </linearGradient>
          <linearGradient id="skydiver-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334c5a" />
            <stop offset="100%" stopColor="#182d3b" />
          </linearGradient>
        </defs>
        <rect width="760" height="360" rx="14" fill="url(#skydiver-sky)" />
        {Array.from({ length: 28 }, (_, i) => (
          <circle key={i} cx={(i * 83 + 21) % 740 + 10} cy={(i * 47 + 18) % 250 + 12} r={i % 4 === 0 ? 1.8 : 1} fill="#d7e7ff" opacity={0.28 + (i % 4) * 0.12} />
        ))}
        <path d="M0 315 Q130 288 260 313 T520 310 T760 304 V360 H0Z" fill="url(#skydiver-ground)" />
        <path d="M0 315 Q130 288 260 313 T520 310 T760 304" fill="none" stroke="#7f9b9d" strokeWidth="2" />
        <line x1="96" y1="42" x2="96" y2="304" stroke="#a9c8e6" strokeDasharray="4 6" opacity=".35" />
        <text x="112" y="48" fill="#cbdcf0" fontSize="12">Ketinggian awal {ketinggianAwal.toFixed(0)} m</text>
        <text x="112" y="304" fill="#cbdcf0" fontSize="12">Permukaan tanah</text>

        {/* Garis gerak / jejak ketinggian */}
        <line x1="380" y1="52" x2="380" y2={y + 28} stroke="#f6bd60" strokeWidth="2" strokeDasharray="5 7" opacity=".8" />
        <circle cx="380" cy={y} r="28" fill="#f6bd60" opacity=".10" />

        {/* Tali parasut dan kanopi */}
        {keadaan.parasutTerbuka && (
          <g className="skydiver-parachute">
            <path d={`M${380 - 57} ${y - 50} Q380 ${y - 124} ${380 + 57} ${y - 50} Q380 ${y - 24} ${380 - 57} ${y - 50}`} fill="#f18a69" stroke="#ffd0a1" strokeWidth="2" />
            <path d={`M380 ${y - 50} L${380 - 8} ${y - 8} M380 ${y - 50} L${380 + 8} ${y - 8}`} stroke="#e6ebf5" strokeWidth="1.5" />
          </g>
        )}
        <g transform={`translate(380 ${y})`}>
          <circle cx="0" cy="-9" r="8" fill="#ffd1a0" />
          <path d="M-7 0 Q-18 6 -15 18 L-9 25 L9 25 L15 18 Q18 6 7 0Z" fill="#55e0c1" stroke="#dcfff7" strokeWidth="1.3" />
          <path d="M-13 8 L-26 16 M13 8 L26 16" stroke="#ffd1a0" strokeWidth="5" strokeLinecap="round" />
          <path d="M-7 23 L-14 39 M7 23 L14 39" stroke="#d9e5f3" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g transform="translate(530 72)">
          <text x="0" y="0" fill="#f6bd60" fontSize="11" fontWeight="700">G</text>
          <line x1="5" y1="8" x2="5" y2="49" stroke="#f6bd60" strokeWidth="2.5" />
          <path d="M0 43 L5 53 L10 43" fill="none" stroke="#f6bd60" strokeWidth="2.5" />
          <text x="24" y="22" fill="#f6bd60" fontSize="10">Gravitasi ↓</text>
          <text x="24" y="37" fill="#91b6ff" fontSize="10">Hambatan udara ↑</text>
          <line x1="5" y1="58" x2="5" y2="89" stroke="#91b6ff" strokeWidth="2.5" />
          <path d="M0 66 L5 56 L10 66" fill="none" stroke="#91b6ff" strokeWidth="2.5" />
          <text x="24" y="73" fill="#91b6ff" fontSize="9">Fᵈ = ½ρCᵈAv²</text>
        </g>
        <text x="380" y="344" textAnchor="middle" fill="#cbd8e8" fontSize="11">{menyentuh ? "Penerjun mencapai permukaan tanah" : "Gerak jatuh dengan hambatan udara"}</text>
      </svg>
      <div className="skydiver-readouts">
        <div><span>Kelajuan saat ini</span><strong>{keadaan.kecepatan.toFixed(2)} m/s</strong></div>
        <div><span>Kecepatan terminal saat ini</span><strong>{keadaan.kecepatanTerminal.toFixed(2)} m/s</strong></div>
        <div><span>Kecepatan terminal tubuh</span><strong>{keadaan.kecepatanTerminalTubuh.toFixed(2)} m/s</strong></div>
        <div><span>Percepatan aktual</span><strong>{keadaan.percepatan.toFixed(2)} m/s²</strong></div>
        <div><span>Hambatan udara</span><strong>{keadaan.parasutTerbuka ? "Parasut terbuka" : "Tubuh bebas"}</strong></div>
        <div><span>Status gerak</span><strong>{menyentuh ? "Menyentuh tanah" : "Jatuh"}</strong></div>
      </div>
      <p className="skydiver-model-note">Model menggunakan hambatan kuadratik F<sub>d</sub> = ½ρC<sub>d</sub>Av² dan massa penerjun 78 kg. Parasut terbuka pada 72% lintasan; setelah itu luas efektif hambatan bertambah sehingga kecepatan terminal turun.</p>
    </div>
  );
}
