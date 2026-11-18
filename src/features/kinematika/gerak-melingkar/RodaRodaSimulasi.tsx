import { useMemo, useState } from "react";
import ParameterSlider from "../../../components/simulasi/ParameterSlider";
import { DockableControlPanel, useSimulationExperience } from "../../../components/simulasi/SimulationExperience";
import GrafikMini from "../../../components/simulasi/GrafikMini";
import ModelMatematika from "../../../components/simulasi/ModelMatematika";
import usePlayback from "../usePlayback";
import {
  hitungGeometriSabuk,
  hitungKecepatanSudutTurunan,
  hitungPusatRoda,
  type GeometriSabuk,
  type RelasiRoda,
} from "./mesinRodaRoda";

const DURASI = 18;
const FAKTOR_SKALA = 110;
const TINGGI_RODA = 190;
const TINGGI_SVG = 430;

interface RodaGigiProps {
  x: number;
  y: number;
  radius: number;
  sudut: number;
  warna: string;
  berbagiPoros: boolean;
  lapisanPoros: number;
}

function RodaGigi({
  x,
  y,
  radius,
  sudut,
  warna,
  berbagiPoros,
  lapisanPoros,
}: RodaGigiProps) {
  const gigi = useMemo(() => Array.from({ length: 16 }, (_, index) => {
    const sudutGigi = (index * 22.5 * Math.PI) / 180;
    return {
      x1: Math.cos(sudutGigi) * radius * 0.86,
      y1: Math.sin(sudutGigi) * radius * 0.86,
      x2: Math.cos(sudutGigi) * radius * 1.08,
      y2: Math.sin(sudutGigi) * radius * 1.08,
    };
  }), [radius]);

  const fillOpacity = berbagiPoros ? 0.12 + Math.min(lapisanPoros, 3) * 0.035 : 0.2;
  const strokeWidth = berbagiPoros ? 2.35 + lapisanPoros * 0.35 : 3;

  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`rotate(${sudut})`}>
        <circle
          r={radius * 0.9}
          fill="#13283f"
          fillOpacity={fillOpacity}
          stroke={warna}
          strokeWidth={strokeWidth}
          strokeOpacity=".96"
        />
        <circle
          r={radius * 0.76}
          fill="none"
          stroke={warna}
          strokeWidth="1.1"
          strokeOpacity={berbagiPoros ? 0.34 : 0.22}
          strokeDasharray={berbagiPoros ? "3 5" : "2 7"}
        />
        {gigi.map((item, index) => (
          <line
            key={index}
            x1={item.x1}
            y1={item.y1}
            x2={item.x2}
            y2={item.y2}
            stroke={warna}
            strokeWidth={berbagiPoros ? 4.1 + lapisanPoros * 0.25 : 4.6}
            strokeOpacity={berbagiPoros ? 0.82 + lapisanPoros * 0.04 : 0.94}
            strokeLinecap="round"
          />
        ))}
        <circle
          r={radius * 0.43}
          fill="#0b1729"
          fillOpacity=".9"
          stroke={warna}
          strokeOpacity=".82"
          strokeWidth={berbagiPoros ? 2.1 : 2.4}
        />
        <path
          d={`M0 ${-radius * 0.31} L0 ${radius * 0.31} M${-radius * 0.31} 0 L${radius * 0.31} 0`}
          stroke={warna}
          strokeOpacity=".9"
          strokeWidth="2.2"
        />
        <circle r={Math.max(4, radius * 0.055)} fill="#f4f7fb" />
      </g>
    </g>
  );
}

const WARNA_RODA = ["#61e4cb", "#f6bd60", "#91b6ff"] as const;

/** Demonstrasi tiga roda: seporos, bersinggungan, dan sabuk/rantai. */
export default function RodaRodaSimulasi() {
  const [jari, setJari] = useState<[number, number, number]>([0.8, 0.55, 0.42]);
  const [omegaAwal, setOmegaAwal] = useState(2.2);
  const [relasi12, setRelasi12] = useState<RelasiRoda>("bersinggungan");
  const [relasi23, setRelasi23] = useState<RelasiRoda>("sabuk");
  const playback = usePlayback(DURASI);
  const { dock, scaleMode } = useSimulationExperience();
  const faktorSkala = scaleMode === "actual-scale" ? 82 : FAKTOR_SKALA;

  const omega = useMemo(() => {
    const w1 = omegaAwal;
    const w2 = hitungKecepatanSudutTurunan(w1, jari[0], jari[1], relasi12);
    const w3 = hitungKecepatanSudutTurunan(w2, jari[1], jari[2], relasi23);
    return [w1, w2, w3] as const;
  }, [jari, omegaAwal, relasi12, relasi23]);

  const sudut = omega.map((nilai) => (nilai * playback.waktu * 180 / Math.PI) % 360);
  const vTangensial = omega.map((nilai, index) => Math.abs(nilai) * jari[index]);
  const sampelWaktu = Array.from({ length: 101 }, (_, index) => (DURASI * index) / 100);
  const dataGrafikSudut = omega.map((nilai) => sampelWaktu.map((waktu) => nilai * waktu * 180 / Math.PI));
  const dataGrafikOmega = omega.map((nilai) => sampelWaktu.map(() => nilai));
  const radiusPiksel = useMemo(
    () => jari.map((nilai) => nilai * faktorSkala) as [number, number, number],
    [jari, faktorSkala],
  );

  const pusatRoda = useMemo(
    () => hitungPusatRoda(radiusPiksel, relasi12, relasi23),
    [radiusPiksel, relasi12, relasi23],
  );

  const radiusLuar = useMemo(
    () => radiusPiksel.map((nilai) => nilai * 1.08),
    [radiusPiksel],
  );
  const pusatBerbagiPoros = pusatRoda.map(
    (pusat, indeks) => pusatRoda.some((lain, indeksLain) => indeksLain !== indeks && lain === pusat),
  );
  const urutanGambar = [0, 1, 2].sort((a, b) => radiusPiksel[b] - radiusPiksel[a]);
  const lapisanPoros: [number, number, number] = [0, 0, 0];
  urutanGambar.forEach((indeks) => {
    if (!pusatBerbagiPoros[indeks]) return;
    lapisanPoros[indeks] = urutanGambar
      .slice(0, urutanGambar.indexOf(indeks))
      .filter((sebelumnya) => pusatRoda[sebelumnya] === pusatRoda[indeks]).length;
  });

  const batasKiri = Math.min(...pusatRoda.map((x, index) => x - radiusLuar[index]));
  const batasKanan = Math.max(...pusatRoda.map((x, index) => x + radiusLuar[index]));
  const lebarRangkaian = batasKanan - batasKiri;
  const lebarKanvas = Math.max(800, Math.ceil(lebarRangkaian + 120));
  // Pusatkan rangkaian; ini juga membuat tiga roda seporos tampil di tengah,
  // bukan menumpuk kecil di tepi kiri viewBox yang lebar.
  const xOffset = (lebarKanvas - lebarRangkaian) / 2 - batasKiri;
  const pusatRodaTampil = useMemo(
    () => pusatRoda.map((x) => x + xOffset),
    [pusatRoda, xOffset],
  );
  const pusatUnik = [...new Set(pusatRoda)];

  const geometriSabuk12 = useMemo(
    () => relasi12 === "sabuk"
      ? hitungGeometriSabuk(
          pusatRodaTampil[0], pusatRodaTampil[1], TINGGI_RODA,
          radiusLuar[0] + 4, radiusLuar[1] + 4,
        )
      : null,
    [pusatRodaTampil, radiusLuar, relasi12],
  );
  const geometriSabuk23 = useMemo(
    () => relasi23 === "sabuk"
      ? hitungGeometriSabuk(
          pusatRodaTampil[1], pusatRodaTampil[2], TINGGI_RODA,
          radiusLuar[1] + 4, radiusLuar[2] + 4,
        )
      : null,
    [pusatRodaTampil, radiusLuar, relasi23],
  );

  function ubahJari(indeks: 0 | 1 | 2, nilai: number) {
    setJari((lama) => lama.map((item, i) => i === indeks ? nilai : item) as [number, number, number]);
  }

  const relasiLabel = (relasi: RelasiRoda) =>
    relasi === "seporos"
      ? "Seporos · pusat sama, ω sama"
      : relasi === "bersinggungan"
        ? "Bersinggungan · arah berlawanan"
        : "Sabuk terbuka · arah sama";

  const gambarSabuk = (geometri: GeometriSabuk | null, warna: string, id: string) => {
    if (!geometri) return null;

    return (
      <g key={id} className="roda-chain-assembly" aria-hidden="true">
        <path
          d={geometri.path}
          fill="none"
          stroke={warna}
          strokeWidth="1.6"
          strokeOpacity=".48"
          strokeLinejoin="round"
        />
        {geometri.mataRantai.map((mata, indeks) => (
          <g
            key={`${id}-link-${indeks}`}
            transform={`translate(${mata.x.toFixed(2)} ${mata.y.toFixed(2)}) rotate(${(mata.sudut + (indeks % 2 ? 90 : 0)).toFixed(2)})`}
            className="roda-chain-link"
          >
            <rect
              x="-6.1"
              y="-3.1"
              width="12.2"
              height="6.2"
              rx="3.1"
              fill="#09090b"
              stroke={warna}
              strokeWidth="1.45"
            />
            <path d="M-2.4 0 H2.4" stroke={warna} strokeOpacity=".7" strokeWidth=".9" strokeLinecap="round" />
          </g>
        ))}
      </g>
    );
  };

  return (
    <>
      <section className="panel roda-roda-lab" data-dock={dock}>
        <div className="roda-roda-heading">
          <div>
            <p className="eyebrow">PENERAPAN GMB · TRANSMISI PUTAR</p>
            <h2>Gear System · Hubungan tiga roda</h2>
            <p className="section-description">Atur jari-jari, kecepatan sudut masukan, dan jenis transmisi untuk membandingkan karakter putaran setiap roda.</p>
          </div>
          <span className="model-badge">3 RODA AKTIF</span>
        </div>

        <DockableControlPanel compact>
          <div className="roda-roda-controls">
            <ParameterSlider label="Jari-jari roda 1" value={jari[0]} min={0.25} max={1.2} step={0.05} unit="m" onChange={(nilai) => ubahJari(0, nilai)} />
            <ParameterSlider label="Jari-jari roda 2" value={jari[1]} min={0.25} max={1.2} step={0.05} unit="m" onChange={(nilai) => ubahJari(1, nilai)} />
            <ParameterSlider label="Jari-jari roda 3" value={jari[2]} min={0.25} max={1.2} step={0.05} unit="m" onChange={(nilai) => ubahJari(2, nilai)} />
            <ParameterSlider label="Kecepatan sudut roda 1" value={omegaAwal} min={-8} max={8} step={0.1} unit="rad/s" onChange={setOmegaAwal} />
            <label className="roda-relasi-control">
              <span>Hubungan roda 1 → 2</span>
              <select value={relasi12} onChange={(event) => setRelasi12(event.target.value as RelasiRoda)}>
                <option value="seporos">Seporos</option>
                <option value="bersinggungan">Bersinggungan</option>
                <option value="sabuk">Sabuk / rantai</option>
              </select>
            </label>
            <label className="roda-relasi-control">
              <span>Hubungan roda 2 → 3</span>
              <select value={relasi23} onChange={(event) => setRelasi23(event.target.value as RelasiRoda)}>
                <option value="seporos">Seporos</option>
                <option value="bersinggungan">Bersinggungan</option>
                <option value="sabuk">Sabuk / rantai</option>
              </select>
            </label>
          </div>
        </DockableControlPanel>

        <div className="roda-roda-visual-wrap">
          <svg
            viewBox={`0 0 ${lebarKanvas} ${TINGGI_SVG}`}
            role="img"
            aria-label="Tiga roda berputar dengan visualisasi roda seporos, bersinggungan, dan sabuk atau rantai bermata rantai."
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="roda-poros-glow" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#e89973" stopOpacity=".18" />
                <stop offset="100%" stopColor="#91b6ff" stopOpacity=".04" />
              </linearGradient>
            </defs>
            <line x1="28" y1="392" x2={lebarKanvas - 28} y2="392" stroke="#293e58" strokeWidth="1" strokeDasharray="4 6" />

            {gambarSabuk(geometriSabuk12, "#e89973", "sabuk-12")}
            {gambarSabuk(geometriSabuk23, "#91b6ff", "sabuk-23")}

            {pusatRoda.map((_pusat, indeks) => (
              pusatBerbagiPoros[indeks] ? (
                <circle
                  key={`poros-glow-${indeks}`}
                  cx={pusatRodaTampil[indeks]}
                  cy={TINGGI_RODA}
                  r="11"
                  fill="url(#roda-poros-glow)"
                />
              ) : null
            ))}

            {urutanGambar.map((indeks) => (
              <RodaGigi
                key={`gear-${indeks}`}
                x={pusatRodaTampil[indeks]}
                y={TINGGI_RODA}
                radius={radiusPiksel[indeks]}
                sudut={sudut[indeks]}
                warna={WARNA_RODA[indeks]}
                berbagiPoros={pusatBerbagiPoros[indeks]}
                lapisanPoros={lapisanPoros[indeks]}
              />
            ))}

            {pusatUnik.map((pusat, indeks) => {
              const x = pusat + xOffset;
              return (
                <g key={`axis-${indeks}`}>
                  <circle cx={x} cy={TINGGI_RODA} r="3.2" fill="#f4f7fb" />
                  <circle cx={x} cy={TINGGI_RODA} r="8" fill="none" stroke="#e5edf8" strokeOpacity=".58" strokeWidth="1" />
                </g>
              );
            })}
            <text x={lebarKanvas / 2} y="418" textAnchor="middle" fill="#9eb0c8" fontSize="11">
              Seporos = satu sumbu konsentris · Bersinggungan = kontak langsung · Sabuk terbuka = arah sama
            </text>
          </svg>
        </div>

        <div className="roda-roda-relasi-summary" aria-label="Ringkasan hubungan transmisi">
          <span><i className="roda-relasi-dot roda-relasi-dot-12" />1 → 2: {relasiLabel(relasi12)}</span>
          <span><i className="roda-relasi-dot roda-relasi-dot-23" />2 → 3: {relasiLabel(relasi23)}</span>
        </div>

        <div className="roda-roda-lowerbar">
          <div className="roda-roda-readouts" aria-label="Hasil perhitungan setiap roda">
            {omega.map((nilai, index) => (
              <article
                key={index}
                className="roda-readout-card rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 font-mono"
              >
                <div className="roda-readout-heading">
                  <span className="roda-readout-indicator" style={{ backgroundColor: WARNA_RODA[index] }} />
                  <strong>RODA 0{index + 1}</strong>
                  <small>r = {jari[index].toFixed(2)} m</small>
                </div>
                <div className="roda-readout-value">
                  <span>ω</span>
                  <output>{nilai.toFixed(3)} rad/s</output>
                </div>
                <div className="roda-readout-value">
                  <span>v</span>
                  <output>{vTangensial[index].toFixed(3)} m/s</output>
                </div>
              </article>
            ))}
          </div>

          <div className="roda-roda-playback" aria-label="Kontrol animasi roda">
            <button type="button" className="play-button" onClick={playback.mulaiJeda}>
              {playback.berjalan ? "Ⅱ Jeda" : "▶ Putar roda"}
            </button>
            <button type="button" className="icon-button" onClick={playback.aturUlang}>↺ Atur ulang</button>
            <label className="roda-speed-control">
              <span>Kecepatan</span>
              <select value={playback.pengaliKecepatan} onChange={(event) => playback.setPengaliKecepatan(Number(event.target.value))}>
                <option value={0.5}>0,5×</option>
                <option value={1}>1×</option>
                <option value={2}>2×</option>
              </select>
            </label>
            <label className="toggle-control">
              <input type="checkbox" checked={playback.tanpaBatas} onChange={(event) => playback.setTanpaBatas(event.target.checked)} />
              <span className="toggle-track" />
              <span>Waktu tanpa batas</span>
            </label>
          </div>
        </div>
      </section>

      <section className="analysis-section roda-roda-analysis">
        <div className="analysis-heading">
          <div>
            <p className="eyebrow">ANALISIS TRANSMISI</p>
            <h2>Grafik hubungan sudut dan kecepatan sudut</h2>
            <p className="section-description">Sudut berubah linear terhadap waktu pada kecepatan sudut tetap. Besar dan arah putaran setiap roda ditentukan oleh relasi transmisi.</p>
          </div>
        </div>
        <div className="graphs-grid">
          {omega.map((_, index) => <GrafikMini key={`theta-${index}`} title={`Sudut roda ${index + 1}`} yLabel="θ (°)" values={dataGrafikSudut[index]} color={WARNA_RODA[index]} />)}
          {omega.map((_, index) => <GrafikMini key={`omega-${index}`} title={`Kecepatan sudut roda ${index + 1}`} yLabel="ω (rad/s)" values={dataGrafikOmega[index]} color={WARNA_RODA[index]} />)}
        </div>
      </section>

      <ModelMatematika
        deskripsi="Tiga roda dihubungkan melalui relasi seporos, bersinggungan langsung, atau sabuk terbuka. Seporos berarti kedua roda berbagi sumbu yang sama dan memiliki kecepatan sudut sama; dua relasi lainnya mempertahankan kelajuan tangensial ideal pada titik kontak atau sepanjang sabuk."
        persamaan={[
          { judul: "Roda seporos", latex: String.raw`\omega_1=\omega_2` },
          { judul: "Roda bersinggungan", latex: String.raw`\omega_1r_1=-\omega_2r_2` },
          { judul: "Sabuk terbuka", latex: String.raw`\omega_1r_1=\omega_2r_2` },
          { judul: "Sudut putar", latex: String.raw`\theta(t)=\theta_0+\omega t` },
          { judul: "Kelajuan tangensial", latex: String.raw`v=|\omega|r` },
        ]}
        variabel={[
          { simbol: String.raw`\omega_i`, nama: "Kecepatan sudut roda ke-i", satuan: "rad/s" },
          { simbol: String.raw`r_i`, nama: "Jari-jari roda ke-i", satuan: "m" },
          { simbol: String.raw`\theta`, nama: "Sudut posisi roda", satuan: "rad" },
          { simbol: String.raw`v`, nama: "Kelajuan tangensial", satuan: "m/s" },
        ]}
        catatan="Tanda negatif pada hubungan bersinggungan menyatakan arah putaran berlawanan. Sabuk terbuka mempertahankan arah putaran yang sama. Untuk poros kaku, semua roda yang terpasang pada poros memiliki kecepatan sudut yang sama meskipun jari-jarinya berbeda."
      />
    </>
  );
}
