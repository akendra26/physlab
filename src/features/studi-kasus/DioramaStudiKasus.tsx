import type { StudiKasus } from "./dataStudiKasus";
import "./StudiKasus.css";

type Props = { kasus: StudiKasus };

/** Diorama ilustratif per studi kasus; simulasi matematis asli tetap tersedia di panel berikutnya. */
export default function DioramaStudiKasus({ kasus }: Props) {
  const jenis = kasus.id.includes("parabola")
    ? "parabola"
    : kasus.id.includes("glbb")
      ? "glbb"
      : kasus.id.includes("lengan")
        ? "angkat"
        : "gerobak";

  return (
    <section className={`lab-diorama lab-diorama-${jenis}`} aria-label={`Diorama interaktif: ${kasus.judul}`}>
      <div className="lab-diorama-topline">
        <span><i /> DIORAMA EKSPERIMEN</span>
        <span>{jenis === "parabola" ? "GERAK PARABOLA" : jenis === "glbb" ? "GERAK LURUS BERUBAH BERATURAN" : "REKAYASA DINAMIKA"}</span>
      </div>
      <svg viewBox="0 0 900 300" role="img" aria-label="Ilustrasi animasi laboratorium fisika">
        <defs>
          <linearGradient id="diorama-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#142847" />
            <stop offset="100%" stopColor="#263a55" />
          </linearGradient>
          <linearGradient id="diorama-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#33485a" />
            <stop offset="100%" stopColor="#182b3a" />
          </linearGradient>
        </defs>
        <rect width="900" height="300" rx="12" fill="url(#diorama-sky)" />
        <rect x="8" y="8" width="884" height="284" rx="10" fill="none" stroke="#91b6ff" strokeOpacity=".34" strokeWidth="1.5" strokeDasharray="7 6" />
        {Array.from({ length: 34 }, (_, i) => <circle key={i} cx={(i * 89 + 17) % 880 + 10} cy={(i * 37 + 13) % 190 + 8} r={i % 5 === 0 ? 1.8 : 1} fill="#e1ebff" opacity=".38" />)}
        <path d="M0 242 Q170 221 320 242 T620 238 T900 235 V300 H0Z" fill="url(#diorama-floor)" />
        <line x1="0" y1="242" x2="900" y2="242" stroke="#8ca8b3" strokeWidth="2" opacity=".55" />

        {jenis === "parabola" ? (
          <g>
            {/* Gawang dan pemain */}
            <path d="M65 242 V160 H160 V242 M65 160 H160" stroke="#d7e5f6" strokeWidth="5" fill="none" />
            <path d="M700 242 V176 H830 V242 M700 176 H830" stroke="#d7e5f6" strokeWidth="5" fill="none" />
            <g transform="translate(250 195)">
              <circle cx="0" cy="-26" r="11" fill="#ffd0a0" />
              <path d="M-9 -14 Q-18 4 -4 16 L14 13 L18 -5 L8 -16Z" fill="#61e4cb" />
              <path d="M-3 12 L-25 28 M8 12 L27 26 M14 -5 L34 -17" stroke="#e6eefb" strokeWidth="7" strokeLinecap="round" />
              <path d="M-10 -3 L-25 -13" stroke="#ffd0a0" strokeWidth="5" strokeLinecap="round" />
            </g>
            <path d="M276 182 Q440 -80 730 186" fill="none" stroke="#ffc477" strokeWidth="3" strokeDasharray="8 7" className="diorama-trajectory" />
            <circle cx="502" cy="103" r="5" fill="#f6bd60" />
            <text x="520" y="96" fill="#ffd59c" fontSize="12">Titik puncak</text>
            <g className="diorama-football">
              <animateMotion dur="4.6s" repeatCount="indefinite" path="M 0 0 Q 170 -185 454 4" />
              <circle cx="276" cy="182" r="9" fill="#f5f7fb" stroke="#24344a" strokeWidth="2" />
              <path d="M276 172 L280 179 L287 181 L282 188 L276 191 L270 186 L267 178Z" fill="#27364c" />
            </g>
            <g className="diorama-football-velocity">
              <animateMotion dur="4.6s" repeatCount="indefinite" path="M 0 0 Q 170 -185 454 4" rotate="auto" />
              <path d="M276 182 L316 182 M307 174 L316 182 L307 190" fill="none" stroke="#91b6ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        ) : jenis === "glbb" ? (
          <g>
            <path d="M70 237 H840" stroke="#9aafc7" strokeWidth="5" />
            {Array.from({ length: 16 }, (_, i) => <line key={i} x1={85 + i * 48} y1="239" x2={75 + i * 48} y2="264" stroke="#60778d" strokeWidth="4" />)}
            <g className="diorama-trolley">
              <rect x="110" y="170" width="100" height="55" rx="8" fill="#1b4652" stroke="#61e4cb" strokeWidth="2" />
              <circle cx="133" cy="230" r="12" fill="#182335" stroke="#b9c9df" strokeWidth="3" />
              <circle cx="188" cy="230" r="12" fill="#182335" stroke="#b9c9df" strokeWidth="3" />
              <rect x="135" y="145" width="45" height="25" rx="4" fill="#8ea7ff" />
            </g>
            <text x="105" y="120" fill="#b9cce3" fontSize="12">Troli eksperimen</text>
            <path d="M330 150 H770" stroke="#ffc477" strokeWidth="2" strokeDasharray="7 7" />
            <path d="M754 140 L775 150 L754 160" fill="none" stroke="#ffc477" strokeWidth="3" />
            <text x="500" y="137" fill="#ffd49c" fontSize="12">Arah gerak</text>
          </g>
        ) : jenis === "angkat" ? (
          <g>
            <rect x="645" y="78" width="185" height="164" rx="8" fill="#203a4d" stroke="#8ea7ff" strokeWidth="3" />
            <rect x="665" y="96" width="145" height="130" rx="5" fill="#182b40" stroke="#7189a8" />
            <circle cx="210" cy="180" r="15" fill="#15263b" stroke="#f6bd60" strokeWidth="4" />
            <g className="diorama-lift-arm">
              <path d="M210 242 L210 180 L430 180" stroke="#8ea7ff" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M430 180 L560 100" stroke="#8ea7ff" strokeWidth="9" strokeLinecap="round" />
              <rect x="535" y="72" width="58" height="43" rx="6" fill="#f6bd60" stroke="#ffdfad" strokeWidth="2" />
            </g>
            <g transform="translate(110 193)">
              <circle cx="0" cy="-27" r="10" fill="#ffd0a0" />
              <path d="M-8 -15 L-18 10 L-4 15 L11 5 L8 -13Z" fill="#61e4cb" />
              <path d="M-10 -5 L-28 1 M8 -6 L28 -11 M-4 14 L-15 38 M5 13 L17 36" stroke="#e6eefb" strokeWidth="6" strokeLinecap="round" />
            </g>
            <g transform="translate(690 180)">
              <circle cx="0" cy="-25" r="9" fill="#ffd0a0" />
              <path d="M-8 -14 H8 L12 16 H-12Z" fill="#f18a69" />
              <path d="M-7 16 L-12 39 M7 16 L12 39" stroke="#e6eefb" strokeWidth="5" />
            </g>
            <g className="diorama-observer" transform="translate(850 190)">
              <circle cx="0" cy="-27" r="9" fill="#ffd0a0" />
              <path d="M-8 -15 L-11 13 H11 L8 -15Z" fill="#8ea7ff" />
              <path d="M-7 12 L-13 39 M7 12 L13 39" stroke="#e7eef9" strokeWidth="5" strokeLinecap="round" />
              <path d="M-8 -5 L-23 7 M8 -5 L23 7" stroke="#ffd0a0" strokeWidth="4" strokeLinecap="round" />
            </g>
            <text x="80" y="60" fill="#cbdcf0" fontSize="12">Teknisi</text>
            <text x="675" y="60" fill="#cbdcf0" fontSize="12">Penumpang</text>
            <text x="820" y="140" fill="#cbdcf0" fontSize="12">Pengamat</text>
          </g>
        ) : (
          <g>
            <path d="M70 237 H840" stroke="#9aafc7" strokeWidth="5" />
            {Array.from({ length: 15 }, (_, i) => <line key={i} x1={82 + i * 52} y1="239" x2={72 + i * 52} y2="265" stroke="#60778d" strokeWidth="4" />)}
            <g className="diorama-cart">
              <circle cx="220" cy="205" r="10" fill="#ffd0a0" />
              <path d="M212 216 L198 242 M228 216 L238 242 M216 220 L252 230" stroke="#e4edf8" strokeWidth="8" strokeLinecap="round" />
              <path d="M240 228 L350 206" stroke="#61e4cb" strokeWidth="4" />
              <rect x="350" y="170" width="150" height="66" rx="9" fill="#263d50" stroke="#91b6ff" strokeWidth="3" />
              <circle cx="382" cy="238" r="14" fill="#111e31" stroke="#d7e3f3" strokeWidth="3" />
              <circle cx="468" cy="238" r="14" fill="#111e31" stroke="#d7e3f3" strokeWidth="3" />
              <rect x="390" y="140" width="52" height="30" rx="5" fill="#f6bd60" />
            </g>
            <g className="diorama-observer" transform="translate(680 200)">
              <circle cx="0" cy="-24" r="10" fill="#ffd0a0" />
              <path d="M-9 -13 L-14 12 H13 L8 -13Z" fill="#8ea7ff" />
              <path d="M-8 8 L-14 38 M8 8 L15 38" stroke="#e7eef9" strokeWidth="6" />
              <path d="M-10 -6 L-27 5 M10 -6 L27 5" stroke="#ffd0a0" strokeWidth="5" />
            </g>
            <text x="645" y="142" fill="#cbdcf0" fontSize="12">Pengamat</text>
          </g>
        )}
      </svg>
      <div className="lab-diorama-caption">
        <strong>{jenis === "parabola" ? "Lintasan bola dan titik puncak" : jenis === "glbb" ? "Troli bergerak pada rel laboratorium" : jenis === "angkat" ? "Lengan pengangkat dan teknisi" : "Gerobak bermuatan dan gaya dorong"}</strong>
        <span>Ilustrasi bergerak sebagai pendamping eksperimen; hasil kuantitatif tetap berasal dari mesin simulasi PhysLAB.</span>
      </div>
    </section>
  );
}
