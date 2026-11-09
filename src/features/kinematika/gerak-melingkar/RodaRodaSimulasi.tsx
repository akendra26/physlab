import { useMemo, useState } from "react";
import ParameterSlider from "../../../components/simulasi/ParameterSlider";
import usePlayback from "../usePlayback";

type RelasiRoda = "seporos" | "bersinggungan" | "sabuk";
const DURASI = 18;
const FAKTOR_SKALA = 110;

function kecepatanTurunan(
  omegaSumber: number,
  jariSumber: number,
  jariTujuan: number,
  relasi: RelasiRoda,
) {
  if (relasi === "seporos") return omegaSumber;
  const tanda = relasi === "bersinggungan" ? -1 : 1;
  return tanda * omegaSumber * jariSumber / jariTujuan;
}

function RodaGigi({
  x,
  y,
  radius,
  sudut,
  warna,
  label,
}: {
  x: number;
  y: number;
  radius: number;
  sudut: number;
  warna: string;
  label: string;
}) {
  const gigi = useMemo(() => Array.from({ length: 12 }, (_, index) => {
    const a = (index * 30 * Math.PI) / 180;
    const x1 = Math.cos(a) * radius * 0.86;
    const y1 = Math.sin(a) * radius * 0.86;
    const x2 = Math.cos(a) * radius * 1.08;
    const y2 = Math.sin(a) * radius * 1.08;
    return { x1, y1, x2, y2 };
  }), [radius]);

  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`rotate(${sudut})`}>
        <circle r={radius * 0.88} fill="#13283f" stroke={warna} strokeWidth="3" />
        {gigi.map((item, index) => (
          <line key={index} x1={item.x1} y1={item.y1} x2={item.x2} y2={item.y2} stroke={warna} strokeWidth="5" strokeLinecap="round" />
        ))}
        <circle r={radius * 0.48} fill="#0b1729" stroke={warna} strokeOpacity=".65" strokeWidth="2" />
        <path d={`M0 ${-radius * 0.34} L0 ${radius * 0.34} M${-radius * 0.34} 0 L${radius * 0.34} 0`} stroke={warna} strokeOpacity=".8" strokeWidth="2" />
        <circle r="5" fill="#f4f7fb" />
      </g>
      <text y={radius * 1.42} textAnchor="middle" fill="#dfe9f7" fontSize="13" fontWeight="700">{label}</text>
      <text y={radius * 1.42 + 16} textAnchor="middle" fill="#8fa4c0" fontSize="10">r = {(radius / FAKTOR_SKALA).toFixed(2)} m</text>
    </g>
  );
}

/** Demonstrasi tiga roda: seporos, bersinggungan, dan sabuk/rantai. */
export default function RodaRodaSimulasi() {
  const [jari, setJari] = useState([0.8, 0.55, 0.42]);
  const [omegaAwal, setOmegaAwal] = useState(2.2);
  const [relasi12, setRelasi12] = useState<RelasiRoda>("bersinggungan");
  const [relasi23, setRelasi23] = useState<RelasiRoda>("sabuk");
  const playback = usePlayback(DURASI);

  const omega = useMemo(() => {
    const w1 = omegaAwal;
    const w2 = kecepatanTurunan(w1, jari[0], jari[1], relasi12);
    const w3 = kecepatanTurunan(w2, jari[1], jari[2], relasi23);
    return [w1, w2, w3];
  }, [jari, omegaAwal, relasi12, relasi23]);

  const sudut = omega.map((nilai) => (nilai * playback.waktu * 180 / Math.PI) % 360);
  const vTangensial = omega.map((nilai, index) => Math.abs(nilai) * jari[index]);
  const radiusPiksel = jari.map((nilai) => nilai * FAKTOR_SKALA);
  const jarakPusat = (
    indeksSumber: number,
    indeksTujuan: number,
    relasi: RelasiRoda,
  ) => {
    const jumlahRadiusLuar =
      (radiusPiksel[indeksSumber] + radiusPiksel[indeksTujuan]) * 1.08;

    if (relasi === "bersinggungan") {
      // Gigi bertemu pada lingkaran luar masing-masing roda.
      return jumlahRadiusLuar;
    }

    if (relasi === "sabuk") {
      // Ruang lebih lebar agar lintasan sabuk/rantai dapat terlihat.
      return Math.max(170, jumlahRadiusLuar * 1.7);
    }

    // Seporos: roda diperlihatkan berdampingan pada satu poros ilustratif.
    return Math.max(155, jumlahRadiusLuar + 28);
  };

  const pusatRoda1 = Math.max(155, radiusPiksel[0] * 1.08 + 18);
  const pusatRoda2 = pusatRoda1 + jarakPusat(0, 1, relasi12);
  const pusatRoda3 = pusatRoda2 + jarakPusat(1, 2, relasi23);
  const pusatRoda = [pusatRoda1, pusatRoda2, pusatRoda3];
  const tinggiRoda = 145;
  const lebarKanvas = Math.max(
    800,
    Math.ceil(pusatRoda3 + radiusPiksel[2] * 1.18 + 55),
  );

  function ubahJari(indeks: number, nilai: number) {
    setJari((lama) => lama.map((item, i) => i === indeks ? nilai : item));
    playback.aturUlang();
  }

  function ubahRelasi12(nilai: RelasiRoda) {
    setRelasi12(nilai);
    playback.aturUlang();
  }

  function ubahRelasi23(nilai: RelasiRoda) {
    setRelasi23(nilai);
    playback.aturUlang();
  }

  const relasiLabel = (relasi: RelasiRoda) =>
    relasi === "seporos" ? "Roda seporos · ω sama" : relasi === "bersinggungan" ? "Bersinggungan · arah berlawanan" : "Sabuk/rantai · arah sama";

  return (
    <section className="panel roda-roda-lab">
      <div className="roda-roda-heading">
        <div>
          <p className="eyebrow">PENERAPAN GMB · TRANSMISI PUTAR</p>
          <h2>Hubungan tiga roda</h2>
          <p className="section-description">Ubah jari-jari dan jenis hubungan untuk melihat perubahan kecepatan sudut serta kelajuan tangensial setiap roda.</p>
        </div>
        <span className="model-badge">3 RODA AKTIF</span>
      </div>

      <div className="roda-roda-controls">
        <ParameterSlider label="Jari-jari roda 1" value={jari[0]} min={0.25} max={1.2} step={0.05} unit="m" onChange={(nilai) => ubahJari(0, nilai)} />
        <ParameterSlider label="Jari-jari roda 2" value={jari[1]} min={0.25} max={1.2} step={0.05} unit="m" onChange={(nilai) => ubahJari(1, nilai)} />
        <ParameterSlider label="Jari-jari roda 3" value={jari[2]} min={0.25} max={1.2} step={0.05} unit="m" onChange={(nilai) => ubahJari(2, nilai)} />
        <ParameterSlider label="Kecepatan sudut roda 1" value={omegaAwal} min={-8} max={8} step={0.1} unit="rad/s" onChange={(nilai) => { setOmegaAwal(nilai); playback.aturUlang(); }} />
        <label className="roda-relasi-control">
          <span>Hubungan roda 1 → 2</span>
          <select value={relasi12} onChange={(event) => ubahRelasi12(event.target.value as RelasiRoda)}>
            <option value="seporos">Seporos</option>
            <option value="bersinggungan">Bersinggungan</option>
            <option value="sabuk">Sabuk / rantai</option>
          </select>
        </label>
        <label className="roda-relasi-control">
          <span>Hubungan roda 2 → 3</span>
          <select value={relasi23} onChange={(event) => ubahRelasi23(event.target.value as RelasiRoda)}>
            <option value="seporos">Seporos</option>
            <option value="bersinggungan">Bersinggungan</option>
            <option value="sabuk">Sabuk / rantai</option>
          </select>
        </label>
      </div>

      <div className="roda-roda-visual-wrap">
        <svg viewBox={`0 0 ${lebarKanvas} 400`} role="img" aria-label="Tiga roda berputar dengan hubungan seporos, bersinggungan, atau sabuk">
          <defs>
            <marker id="roda-arah-panah" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#ffc477" /></marker>
          </defs>
          <line x1="30" y1="365" x2={lebarKanvas - 30} y2="365" stroke="#293e58" strokeWidth="1" strokeDasharray="4 6" />
          <path d={`M${pusatRoda1} ${tinggiRoda} L${pusatRoda2} ${tinggiRoda} L${pusatRoda3} ${tinggiRoda}`} stroke="#405773" strokeWidth="2" strokeDasharray="5 7" fill="none" />
          {relasi12 === "sabuk" ? (
            <path
              d={`M ${pusatRoda1} ${tinggiRoda - jari[0] * FAKTOR_SKALA * 1.08} C ${pusatRoda1} ${tinggiRoda - jari[0] * FAKTOR_SKALA * 1.08 - 36} ${pusatRoda2} ${tinggiRoda - jari[1] * FAKTOR_SKALA * 1.08 - 36} ${pusatRoda2} ${tinggiRoda - jari[1] * FAKTOR_SKALA * 1.08} C ${pusatRoda2} ${tinggiRoda + jari[1] * FAKTOR_SKALA * 1.08 + 36} ${pusatRoda1} ${tinggiRoda + jari[0] * FAKTOR_SKALA * 1.08 + 36} ${pusatRoda1} ${tinggiRoda + jari[0] * FAKTOR_SKALA * 1.08}`}
              fill="none" stroke="#f6bd60" strokeWidth="3" strokeDasharray="7 5" className="roda-sabuk-line"
            />
          ) : relasi12 === "seporos" ? (
            <line x1={pusatRoda1} y1={tinggiRoda} x2={pusatRoda2} y2={tinggiRoda} stroke="#f6bd60" strokeWidth="5" strokeLinecap="round" />
          ) : (
            <line x1={pusatRoda1 + jari[0] * FAKTOR_SKALA * 1.08} y1={tinggiRoda} x2={pusatRoda2 - jari[1] * FAKTOR_SKALA * 1.08} y2={tinggiRoda} stroke="#f6bd60" strokeWidth="4" />
          )}
          {relasi23 === "sabuk" ? (
            <path
              d={`M ${pusatRoda2} ${tinggiRoda - jari[1] * FAKTOR_SKALA * 1.08} C ${pusatRoda2} ${tinggiRoda - jari[1] * FAKTOR_SKALA * 1.08 - 36} ${pusatRoda3} ${tinggiRoda - jari[2] * FAKTOR_SKALA * 1.08 - 36} ${pusatRoda3} ${tinggiRoda - jari[2] * FAKTOR_SKALA * 1.08} C ${pusatRoda3} ${tinggiRoda + jari[2] * FAKTOR_SKALA * 1.08 + 36} ${pusatRoda2} ${tinggiRoda + jari[1] * FAKTOR_SKALA * 1.08 + 36} ${pusatRoda2} ${tinggiRoda + jari[1] * FAKTOR_SKALA * 1.08}`}
              fill="none" stroke="#91b6ff" strokeWidth="3" strokeDasharray="7 5" className="roda-sabuk-line"
            />
          ) : relasi23 === "seporos" ? (
            <line x1={pusatRoda2} y1={tinggiRoda} x2={pusatRoda3} y2={tinggiRoda} stroke="#91b6ff" strokeWidth="5" strokeLinecap="round" />
          ) : (
            <line x1={pusatRoda2 + jari[1] * FAKTOR_SKALA * 1.08} y1={tinggiRoda} x2={pusatRoda3 - jari[2] * FAKTOR_SKALA * 1.08} y2={tinggiRoda} stroke="#91b6ff" strokeWidth="4" />
          )}
          <RodaGigi x={pusatRoda[0]} y={tinggiRoda} radius={jari[0] * FAKTOR_SKALA} sudut={sudut[0]} warna="#61e4cb" label="RODA 1" />
          <RodaGigi x={pusatRoda[1]} y={tinggiRoda} radius={jari[1] * FAKTOR_SKALA} sudut={sudut[1]} warna="#f6bd60" label="RODA 2" />
          <RodaGigi x={pusatRoda[2]} y={tinggiRoda} radius={jari[2] * FAKTOR_SKALA} sudut={sudut[2]} warna="#91b6ff" label="RODA 3" />
          <text x={lebarKanvas / 2} y="390" textAnchor="middle" fill="#9eb0c8" fontSize="11">Seporos: ω sama · Bersinggungan: arah berlawanan · Sabuk terbuka: arah sama.</text>
        </svg>
      </div>

      <div className="roda-roda-readouts">
        {omega.map((nilai, index) => (
          <div key={index} className="roda-readout-card">
            <strong>Roda {index + 1}</strong>
            <span>ω = {nilai.toFixed(2)} rad/s</span>
            <span>v = {vTangensial[index].toFixed(2)} m/s</span>
          </div>
        ))}
      </div>
      <div className="roda-roda-relasi-summary">
        <span>{relasiLabel(relasi12)}</span>
        <span>{relasiLabel(relasi23)}</span>
      </div>
      <div className="roda-roda-playback">
        <button type="button" className="play-button" onClick={playback.mulaiJeda}>{playback.berjalan ? "Ⅱ Jeda" : "▶ Putar roda"}</button>
        <button type="button" className="icon-button" onClick={playback.aturUlang}>↺ Atur ulang</button>
        <label><span>Kecepatan</span><select value={playback.pengaliKecepatan} onChange={(event) => playback.setPengaliKecepatan(Number(event.target.value))}><option value={0.5}>0,5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label>
        <label className="toggle-control"><input type="checkbox" checked={playback.tanpaBatas} onChange={(event) => playback.setTanpaBatas(event.target.checked)} /><span className="toggle-track" /><span>Waktu tanpa batas</span></label>
      </div>
    </section>
  );
}
