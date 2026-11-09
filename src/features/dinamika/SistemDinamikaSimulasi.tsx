import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import KartuBesaran from "../../components/simulasi/KartuBesaran";
import ModelMatematika from "../../components/simulasi/ModelMatematika";
import ParameterSlider from "../../components/simulasi/ParameterSlider";
import GrafikWaktuNyata from "./GrafikWaktuNyata";
import KontrolSimulasiDinamika from "./KontrolSimulasiDinamika";
import { batasi, dapatkanTitikSvg } from "./InteraksiSvg";
import { hitungAtwood, hitungLift } from "./mesinDinamika";

type ModeSistem = "katrol" | "lift";
type JenisTarikan = "tegangan" | "normal" | "berat" | "massa-satu";
type TarikanAktif = { jenis: JenisTarikan; asalX: number; asalY: number; skala: number; offsetY?: number };
const DURASI = 12;
type RiwayatGerak = { waktu: number; posisi: number; kecepatan: number; percepatan: number };

function useJamSimulasi(durasi: number) {
  const [waktu, setWaktu] = useState(0);
  const [berjalan, setBerjalan] = useState(false);
  const [pengaliKecepatan, setPengaliKecepatan] = useState(1);
  const [tanpaBatas, setTanpaBatas] = useState(false);
  const waktuRef = useRef(0);

  useEffect(() => {
    waktuRef.current = waktu;
  }, [waktu]);

  useEffect(() => {
    if (!berjalan) return;
    let bingkai = 0;
    let waktuSebelumnya: number | null = null;
    const perbarui = (capWaktu: number) => {
      if (waktuSebelumnya !== null) {
        const berikutnya = waktuRef.current + ((capWaktu - waktuSebelumnya) / 1000) * pengaliKecepatan;
        if (!tanpaBatas && berikutnya >= durasi) {
          waktuRef.current = durasi;
          setWaktu(durasi);
          setBerjalan(false);
          return;
        }
        waktuRef.current = berikutnya;
        setWaktu(berikutnya);
      }
      waktuSebelumnya = capWaktu;
      bingkai = requestAnimationFrame(perbarui);
    };
    bingkai = requestAnimationFrame(perbarui);
    return () => cancelAnimationFrame(bingkai);
  }, [berjalan, durasi, pengaliKecepatan, tanpaBatas]);

  const aturWaktu = (nilai: number) => {
    const berikutnya = batasi(nilai, 0, durasi);
    waktuRef.current = berikutnya;
    setWaktu(berikutnya);
  };
  const aturUlang = () => {
    setBerjalan(false);
    waktuRef.current = 0;
    setWaktu(0);
  };
  const mulaiJeda = () => {
    if (!tanpaBatas && !berjalan && waktuRef.current >= durasi) aturWaktu(0);
    setBerjalan((aktif) => !aktif);
  };

  return { waktu, berjalan, pengaliKecepatan, tanpaBatas, setTanpaBatas, aturWaktu, mulaiJeda, aturUlang, setPengaliKecepatan };
}

function PanahTarik({
  asalX,
  asalY,
  ujungX,
  ujungY,
  warna,
  marker,
  label,
  onMulai,
}: {
  asalX: number;
  asalY: number;
  ujungX: number;
  ujungY: number;
  warna: string;
  marker: string;
  label: string;
  onMulai: (event: ReactPointerEvent<SVGCircleElement>) => void;
}) {
  return (
    <g className="vektor-dapat-ditarik">
      <line x1={asalX} y1={asalY} x2={ujungX} y2={ujungY} stroke={warna} strokeWidth="2.5" strokeLinecap="round" markerEnd={`url(#${marker})`} />
      <circle cx={ujungX} cy={ujungY} r="9" fill={warna} fillOpacity=".14" stroke={warna} strokeOpacity=".85" className="pegangan-vektor" onPointerDown={onMulai} aria-label={`Tarik panah ${label}`} />
      <text x={ujungX + 10} y={ujungY - 5} fill={warna} fontSize="12" fontWeight="700">{label}</text>
    </g>
  );
}

export default function SistemDinamikaSimulasi() {
  const [mode, setMode] = useState<ModeSistem>("katrol");
  const [massaSatu, setMassaSatu] = useState(4);
  const [massaDua, setMassaDua] = useState(6);
  const [massaLift, setMassaLift] = useState(60);
  const [gravitasi, setGravitasi] = useState(9.81);
  const [percepatanLift, setPercepatanLift] = useState(0.8);
  const tarikanAktif = useRef<TarikanAktif | null>(null);
  const playback = useJamSimulasi(DURASI);
  const gerakKatrolRef = useRef<RiwayatGerak>({ waktu: 0, posisi: 0, kecepatan: 0, percepatan: 0 });
  const gerakLiftRef = useRef<RiwayatGerak>({ waktu: 0, posisi: 0, kecepatan: 0, percepatan: 0 });
  const waktuIntegrasiRef = useRef(0);
  const akumulatorGrafikRef = useRef(0);
  const [gerakKatrol, setGerakKatrol] = useState(gerakKatrolRef.current);
  const [gerakLift, setGerakLift] = useState(gerakLiftRef.current);
  const [riwayatKatrol, setRiwayatKatrol] = useState<RiwayatGerak[]>([gerakKatrolRef.current]);
  const [riwayatLift, setRiwayatLift] = useState<RiwayatGerak[]>([gerakLiftRef.current]);

  const hasilKatrol = useMemo(() => hitungAtwood(massaSatu, massaDua, gravitasi), [gravitasi, massaDua, massaSatu]);
  const hasilLift = hitungLift(massaLift, gravitasi, gerakLift.percepatan);

  // Integrasi semi-analitik menjaga posisi dan kecepatan tetap kontinu saat massa/gaya diubah.
  useEffect(() => {
    const deltaTotal = playback.waktu - waktuIntegrasiRef.current;
    waktuIntegrasiRef.current = playback.waktu;
    if (deltaTotal <= 0) return;
    const jumlahLangkah = Math.max(1, Math.ceil(deltaTotal / (1 / 120)));
    const dt = deltaTotal / jumlahLangkah;
    let katrol = { ...gerakKatrolRef.current };
    let lift = { ...gerakLiftRef.current };
    let akumulator = akumulatorGrafikRef.current;
    const sampelKatrol: RiwayatGerak[] = [];
    const sampelLift: RiwayatGerak[] = [];

    for (let indeks = 0; indeks < jumlahLangkah; indeks += 1) {
      // Katrol Atwood: akselerasi berubah segera setelah parameter massa berubah.
      let aKatrol = hasilKatrol.percepatan;
      let vKatrol = katrol.kecepatan + aKatrol * dt;
      let sKatrol = katrol.posisi + katrol.kecepatan * dt + 0.5 * aKatrol * dt ** 2;
      if (Math.abs(sKatrol) >= 1.4) {
        sKatrol = Math.sign(sKatrol) * 1.4;
        vKatrol = 0;
        aKatrol = 0;
      }
      katrol = { waktu: playback.waktu - deltaTotal + (indeks + 1) * dt, posisi: sKatrol, kecepatan: vKatrol, percepatan: aKatrol };

      // Lift: akselerasi menuju lantai tujuan, lalu pengereman berdasarkan jarak henti v²/(2a).
      const aMaks = Math.abs(percepatanLift);
      const target = aMaks > 1e-6 ? Math.sign(percepatanLift) * 2 : lift.posisi;
      const sisaArah = target - lift.posisi;
      const arah = Math.sign(sisaArah);
      let aLift = 0;
      if (aMaks > 1e-6 && arah !== 0) {
        const vSepanjangArah = lift.kecepatan * arah;
        if (vSepanjangArah < 0) {
          aLift = arah * aMaks;
        } else {
          const jarakHenti = (vSepanjangArah ** 2) / (2 * aMaks);
          aLift = jarakHenti >= Math.abs(sisaArah) - 0.01 ? -arah * aMaks : arah * aMaks;
        }
      } else if (Math.abs(lift.kecepatan) > 1e-4) {
        aLift = -Math.sign(lift.kecepatan) * 0.35;
      }
      let vLift = lift.kecepatan + aLift * dt;
      let sLift = lift.posisi + 0.5 * (lift.kecepatan + vLift) * dt;
      if (aMaks <= 1e-6 && Math.sign(vLift) !== Math.sign(lift.kecepatan)) vLift = 0;
      if (aMaks > 1e-6 && arah !== 0 && (target - sLift) * arah <= 0) {
        sLift = target;
        vLift = 0;
        aLift = 0;
      }
      lift = { waktu: playback.waktu - deltaTotal + (indeks + 1) * dt, posisi: sLift, kecepatan: vLift, percepatan: aLift };

      akumulator += dt;
      if (akumulator >= 0.08) {
        sampelKatrol.push({ ...katrol });
        sampelLift.push({ ...lift });
        akumulator = 0;
      }
    }

    gerakKatrolRef.current = katrol;
    gerakLiftRef.current = lift;
    akumulatorGrafikRef.current = akumulator;
    setGerakKatrol(katrol);
    setGerakLift(lift);
    if (sampelKatrol.length) setRiwayatKatrol((lama) => [...lama, ...sampelKatrol].slice(-90));
    if (sampelLift.length) setRiwayatLift((lama) => [...lama, ...sampelLift].slice(-90));
  }, [hasilKatrol.percepatan, massaLift, percepatanLift, playback.waktu]);

  const arahKatrol = Math.abs(hasilKatrol.percepatan) < 1e-8
    ? "Sistem seimbang: percepatan kedua massa nol."
    : gerakKatrol.kecepatan === 0 && playback.waktu > 0
      ? "Massa mencapai batas lintasan dan berhenti setelah kontak mekanis."
      : hasilKatrol.percepatan > 0
        ? "Massa m₂ bergerak turun dan massa m₁ bergerak naik."
        : "Massa m₁ bergerak turun dan massa m₂ bergerak naik.";

  const resetGerak = () => {
    const awal: RiwayatGerak = { waktu: 0, posisi: 0, kecepatan: 0, percepatan: 0 };
    waktuIntegrasiRef.current = 0;
    akumulatorGrafikRef.current = 0;
    gerakKatrolRef.current = awal;
    gerakLiftRef.current = awal;
    setGerakKatrol(awal);
    setGerakLift(awal);
    setRiwayatKatrol([awal]);
    setRiwayatLift([awal]);
  };

  const ubahMode = (berikutnya: ModeSistem) => {
    setMode(berikutnya);
    playback.aturUlang();
    resetGerak();
    tarikanAktif.current = null;
  };

  const reset = () => {
    playback.aturUlang();
    resetGerak();
    setMode("katrol");
    setMassaSatu(4);
    setMassaDua(6);
    setMassaLift(60);
    setGravitasi(9.81);
    setPercepatanLift(0.8);
    tarikanAktif.current = null;
  };

  const mulaiTarik = (jenis: JenisTarikan, event: ReactPointerEvent<SVGElement>, data: Omit<TarikanAktif, "jenis">) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
    const titikAwal = dapatkanTitikSvg(event);
    tarikanAktif.current = {
      jenis,
      ...data,
      offsetY: jenis === "massa-satu" && titikAwal
        ? data.asalY - titikAwal.y
        : 0,
    };
  };

  const gerakTarik = (event: ReactPointerEvent<SVGSVGElement>) => {
    const tarikan = tarikanAktif.current;
    if (!tarikan) return;
    const titik = dapatkanTitikSvg(event);
    if (!titik) return;

    if (tarikan.jenis === "massa-satu") {
      const posisiBlok = batasi(titik.y + (tarikan.offsetY ?? 0), 100, 340);
      const massaBaru = 1 + ((340 - posisiBlok) / 240) * 19;
      const posisiSistem = batasi((200 - posisiBlok) / 60, -1.4, 1.4);
      setMassaSatu(batasi(massaBaru, 1, 20));
      // Posisi massa dan sudut putar katrol mengikuti drag secara langsung;
      // tegangan/percepatan dihitung ulang dari massa baru pada render ini.
      const keadaanBaru = {
        ...gerakKatrolRef.current,
        posisi: posisiSistem,
        waktu: playback.waktu,
      };
      gerakKatrolRef.current = keadaanBaru;
      setGerakKatrol(keadaanBaru);
      return;
    }

    if (tarikan.jenis === "tegangan") {
      const teganganDiinginkan = batasi((tarikan.asalY - titik.y) / tarikan.skala, 0, 2 * massaSatu * gravitasi * 0.995);
      let kiri = 1;
      let kanan = 20;
      for (let iterasi = 0; iterasi < 40; iterasi += 1) {
        const tengah = (kiri + kanan) / 2;
        if (hitungAtwood(massaSatu, tengah, gravitasi).tegangan < teganganDiinginkan) kiri = tengah;
        else kanan = tengah;
      }
      setMassaDua(batasi((kiri + kanan) / 2, 1, 20));
      return;
    }

    if (tarikan.jenis === "normal") {
      const normalDiinginkan = batasi((tarikan.asalY - titik.y) / tarikan.skala, 0, 2 * massaLift * gravitasi);
      setPercepatanLift(batasi(normalDiinginkan / massaLift - gravitasi, -gravitasi, gravitasi));
      return;
    }

    const beratDiinginkan = Math.max(0, (titik.y - tarikan.asalY) / tarikan.skala);
    setMassaLift(batasi(beratDiinginkan / gravitasi, 20, 150));
  };

  const akhiriTarik = (event: ReactPointerEvent<SVGSVGElement>) => {
    tarikanAktif.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const seriGrafik = mode === "katrol"
    ? [
      { label: "Perpindahan m₂", satuan: "m", warna: "#55e0c1", nilai: riwayatKatrol.map((item) => item.posisi) },
      { label: "Kecepatan m₂", satuan: "m/s", warna: "#8ea7ff", nilai: riwayatKatrol.map((item) => item.kecepatan) },
      { label: "Percepatan m₂", satuan: "m/s²", warna: "#f6bd60", nilai: riwayatKatrol.map((item) => item.percepatan) },
    ]
    : [
      { label: "Posisi lift", satuan: "m", warna: "#55e0c1", nilai: riwayatLift.map((item) => item.posisi) },
      { label: "Kecepatan lift", satuan: "m/s", warna: "#8ea7ff", nilai: riwayatLift.map((item) => item.kecepatan) },
      { label: "Percepatan aktual", satuan: "m/s²", warna: "#f6bd60", nilai: riwayatLift.map((item) => item.percepatan) },
    ];

  const persamaanKatrol = [
    { judul: "Percepatan sistem Atwood", latex: String.raw`a=\frac{(m_2-m_1)g}{m_1+m_2}` },
    { judul: "Tegangan tali", latex: String.raw`T=\frac{2m_1m_2}{m_1+m_2}\,g` },
    { judul: "Hukum II Newton pada masing-masing massa", latex: String.raw`T-m_1g=m_1a,\qquad m_2g-T=m_2a` },
  ];
  const persamaanLift = [
    { judul: "Hukum II Newton pada arah vertikal", latex: String.raw`N-mg=ma_{\text{aktual}}` },
    { judul: "Berat semu / pembacaan timbangan", latex: String.raw`W_{\text{semu}}=N=m(g+a_{\text{aktual}})` },
    { judul: "Berat gravitasi", latex: String.raw`W=mg` },
  ];
  const variabelKatrol = [
    { simbol: String.raw`m_1`, nama: "Massa pertama", satuan: "kg" },
    { simbol: String.raw`m_2`, nama: "Massa kedua", satuan: "kg" },
    { simbol: String.raw`a`, nama: "Percepatan; positif saat m₂ turun", satuan: "m/s²" },
    { simbol: String.raw`T`, nama: "Tegangan tali", satuan: "N" },
    { simbol: String.raw`g`, nama: "Percepatan gravitasi", satuan: "m/s²" },
  ];
  const variabelLift = [
    { simbol: String.raw`m`, nama: "Massa penumpang atau benda", satuan: "kg" },
    { simbol: String.raw`a`, nama: "Percepatan aktual kabin", satuan: "m/s²" },
    { simbol: String.raw`N`, nama: "Gaya normal lantai lift pada orang", satuan: "N" },
    { simbol: String.raw`W`, nama: "Berat gravitasi", satuan: "N" },
    { simbol: String.raw`g`, nama: "Percepatan gravitasi", satuan: "m/s²" },
  ];

  return (
    <section className="dinamika-simulasi">
      <div className="dinamika-section-heading">
        <div>
          <p className="eyebrow">KATROL &amp; LIFT</p>
          <h2>Sistem Dinamika &amp; Penerapan</h2>
          <p>Gerak dihitung dari persamaan kinematika bertahap. Grafik posisi, kecepatan, dan percepatan mengikuti waktu simulasi.</p>
        </div>
        <button type="button" className="dinamika-reset" onClick={reset}>Atur ulang</button>
      </div>

      <div className="dinamika-mode-switch" role="tablist" aria-label="Pilih sistem dinamika">
        <button type="button" role="tab" aria-selected={mode === "katrol"} className={mode === "katrol" ? "is-active" : ""} onClick={() => ubahMode("katrol")}>
          <span>01</span><strong>Sistem katrol Atwood</strong><small>Tegangan tali dan percepatan</small>
        </button>
        <button type="button" role="tab" aria-selected={mode === "lift"} className={mode === "lift" ? "is-active" : ""} onClick={() => ubahMode("lift")}>
          <span>02</span><strong>Benda di dalam lift</strong><small>Berat semu dan gaya normal</small>
        </button>
      </div>

      {mode === "katrol" ? (
        <div className="dinamika-workspace">
          <aside className="panel control-panel">
            <div className="panel-heading"><div><p className="eyebrow">PENGATURAN</p><h2>Parameter katrol</h2></div></div>
            <ParameterSlider label="Massa pertama (m₁)" value={massaSatu} min={1} max={20} step={0.5} unit="kg" onChange={setMassaSatu} />
            <ParameterSlider label="Massa kedua (m₂)" value={massaDua} min={1} max={20} step={0.5} unit="kg" onChange={setMassaDua} />
            <ParameterSlider label="Percepatan gravitasi" value={gravitasi} min={1} max={20} step={0.01} unit="m/s²" onChange={setGravitasi} />
            <p className="dinamika-control-note">Tarik ujung panah T untuk mengubah tegangan; massa m₂ diselesaikan dari persamaan Atwood. Tali dianggap ringan, tidak mulur, dan tanpa slip.</p>
          </aside>

          <div className="dinamika-main-column">
            <section className="panel dinamika-visual-panel">
              <div className="simulation-header"><div><p className="eyebrow">DIAGRAM SISTEM</p><h2>Mesin Atwood dan lantai dasar</h2></div><span className="model-badge">KATROL IDEAL</span></div>
              <svg viewBox="0 0 540 390" role="img" aria-label="Mesin Atwood dengan tali tipis, rentangan panjang, lantai dasar, dan panah tegangan yang dapat ditarik" onPointerMove={gerakTarik} onPointerUp={akhiriTarik} onPointerCancel={akhiriTarik}>
                <defs>
                  <marker id="panah-katrol-tegangan-rev" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#8ea7ff" /></marker>
                  <marker id="panah-katrol-berat-rev" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f6bd60" /></marker>
                  <pattern id="arsir-lantai-katrol" width="14" height="9" patternUnits="userSpaceOnUse"><path d="M0 9 L9 0" stroke="#50627a" strokeWidth="1" /></pattern>
                </defs>
                <line x1="270" y1="17" x2="270" y2="54" stroke="#60718a" strokeWidth="5" />
                <rect x="239" y="12" width="62" height="9" rx="3" fill="#34475f" />
                <circle cx="270" cy="80" r="25" fill="#15263b" stroke="#8ea7ff" strokeWidth="3" />
                <g transform={`rotate(${(gerakKatrol.posisi / 0.25) * 180 / Math.PI} 270 80)`}>
                  <line x1="270" y1="57" x2="270" y2="103" stroke="#8ea7ff" strokeWidth="2" />
                  <line x1="247" y1="80" x2="293" y2="80" stroke="#8ea7ff" strokeWidth="2" />
                </g>
                <circle cx="270" cy="80" r="5" fill="#8ea7ff" />
                {(() => {
                  const perpindahan = gerakKatrol.posisi * 60;
                  const topSatu = 200 - perpindahan;
                  const topDua = 200 + perpindahan;
                  const skala = 40 / Math.max(massaDua * gravitasi, hasilKatrol.tegangan, 1);
                  const asalYTegangan = topDua + 2;
                  const ujungYTegangan = asalYTegangan - hasilKatrol.tegangan * skala;
                  const asalYBerat = topDua + 28;
                  const ujungYBerat = asalYBerat + massaDua * gravitasi * skala;
                  return (
                    <>
                      <path d={`M 245 80 L 165 80 L 165 ${topSatu} M 295 80 L 375 80 L 375 ${topDua}`} fill="none" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
                      <rect x="132" y={topSatu} width="66" height="54" rx="7" fill="#183247" stroke="#55e0c1" strokeWidth="2" className="massa-dapat-ditarik" onPointerDown={(event) => mulaiTarik("massa-satu", event, { asalX: 165, asalY: topSatu, skala: 1 })} />
                      <rect x="342" y={topDua} width="66" height="54" rx="7" fill="#183247" stroke="#f6bd60" strokeWidth="2" />
                      <text x="165" y={topSatu + 33} textAnchor="middle" fill="#e9eef8" fontSize="16" fontWeight="700">m₁</text>
                      <text x="375" y={topDua + 33} textAnchor="middle" fill="#e9eef8" fontSize="16" fontWeight="700">m₂</text>
                      <line x1="165" y1={topSatu + 55} x2="165" y2={topSatu + 72} stroke="#8ea7ff" strokeWidth="1.4" opacity=".6" />
                      <line x1="375" y1={asalYBerat} x2="375" y2={ujungYBerat} stroke="#f6bd60" strokeWidth="2.2" markerEnd="url(#panah-katrol-berat-rev)" />
                      <text x="388" y={ujungYBerat + 11} fill="#f6bd60" fontSize="11">m₂g</text>
                      <PanahTarik
                        asalX={375} asalY={asalYTegangan} ujungX={375} ujungY={ujungYTegangan}
                        warna="#8ea7ff" marker="panah-katrol-tegangan-rev" label="T"
                        onMulai={(event) => mulaiTarik("tegangan", event, { asalX: 375, asalY: asalYTegangan, skala })}
                      />
                      <text x="270" y="310" textAnchor="middle" fill="#91a1b8" fontSize="11">Perpindahan: {gerakKatrol.posisi.toFixed(2)} m · Kecepatan: {gerakKatrol.kecepatan.toFixed(2)} m/s</text>
                    </>
                  );
                })()}
                <rect x="0" y="340" width="540" height="50" fill="url(#arsir-lantai-katrol)" opacity=".85" />
                <line x1="0" y1="340" x2="540" y2="340" stroke="#91a1b8" strokeWidth="4" />
                <text x="18" y="332" fill="#91a1b8" fontSize="10">LANTAI DASAR</text>
              </svg>
              <p className="dinamika-status-line">{arahKatrol}</p>
              <KontrolSimulasiDinamika waktu={playback.waktu} durasi={DURASI} berjalan={playback.berjalan} pengaliKecepatan={playback.pengaliKecepatan} tanpaBatas={playback.tanpaBatas} onUbahModeWaktu={playback.setTanpaBatas} onUbahWaktu={playback.aturWaktu} onMulaiJeda={playback.mulaiJeda} onAturUlang={playback.aturUlang} onUbahKecepatan={playback.setPengaliKecepatan} bisaGeser={false} />
            </section>
            <section className="metrics-grid dinamika-metrics-grid">
              <KartuBesaran label="Percepatan sistem" value={`${hasilKatrol.percepatan.toFixed(3)} m/s²`} ikon="a" aksen="mint" />
              <KartuBesaran label="Tegangan tali" value={`${hasilKatrol.tegangan.toFixed(2)} N`} ikon="T" aksen="blue" />
              <KartuBesaran label="Perpindahan m₂" value={`${gerakKatrol.posisi.toFixed(2)} m`} ikon="s" aksen="amber" />
            </section>
            <GrafikWaktuNyata judul="Grafik gerak sistem katrol" waktu={playback.waktu} seri={seriGrafik} waktuSampel={(mode === "katrol" ? riwayatKatrol : riwayatLift).map((item) => item.waktu)} keterangan="Saat massa mencapai batas lintasan, percepatan dan kecepatan menjadi nol karena kontak mekanis." />
          </div>
        </div>
      ) : (
        <div className="dinamika-workspace">
          <aside className="panel control-panel">
            <div className="panel-heading"><div><p className="eyebrow">PENGATURAN</p><h2>Parameter lift</h2></div></div>
            <ParameterSlider label="Massa orang atau benda" value={massaLift} min={20} max={150} step={1} unit="kg" onChange={setMassaLift} />
            <ParameterSlider label="Percepatan awal lift" value={percepatanLift} min={-2} max={2} step={0.1} unit="m/s²" onChange={setPercepatanLift} />
            <ParameterSlider label="Percepatan gravitasi" value={gravitasi} min={1} max={20} step={0.01} unit="m/s²" onChange={setGravitasi} />
            <p className="dinamika-control-note">Lift berangkat dari keadaan diam, dipercepat pada paruh perjalanan, lalu direm dengan percepatan konstan hingga berhenti. Drag panah N untuk mengubah percepatan perintah; drag W untuk mengubah massa.</p>
          </aside>

          <div className="dinamika-main-column">
            <section className="panel dinamika-visual-panel">
              <div className="simulation-header"><div><p className="eyebrow">ANIMASI RUANG LIFT</p><h2>Kabin, penumpang, dan vektor gaya</h2></div><span className="model-badge">GERAK BERAKSELERASI</span></div>
              <svg viewBox="0 0 540 390" role="img" aria-label="Animasi kabin lift bergerak mulus, dengan partikel udara dan panah gaya yang mengikuti kabin" onPointerMove={gerakTarik} onPointerUp={akhiriTarik} onPointerCancel={akhiriTarik}>
                <defs>
                  <marker id="panah-lift-normal-rev" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#8ea7ff" /></marker>
                  <marker id="panah-lift-berat-rev" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f6bd60" /></marker>
                  <pattern id="kisi-poros-lift" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12 L12 0" stroke="#34475f" strokeWidth="1" /></pattern>
                </defs>
                <rect x="155" y="22" width="230" height="340" rx="8" fill="#0d1929" stroke="#60718a" strokeWidth="3" />
                <rect x="165" y="30" width="13" height="324" fill="url(#kisi-poros-lift)" />
                <rect x="362" y="30" width="13" height="324" fill="url(#kisi-poros-lift)" />
                <line x1="185" y1="24" x2="185" y2="360" stroke="#263b55" strokeWidth="3" />
                <line x1="355" y1="24" x2="355" y2="360" stroke="#263b55" strokeWidth="3" />
                <g className={`partikel-udara-lift ${Math.abs(gerakLift.kecepatan) > 0.015 ? "aliran-udara" : ""} ${gerakLift.kecepatan > 0.015 ? "aliran-naik" : ""}`} opacity={Math.min(1, 0.2 + Math.abs(gerakLift.kecepatan) * 0.5)}>
                  {Array.from({ length: 12 }, (_, indeks) => {
                    const gerakUdara = -gerakLift.posisi * 18;
                    const posisiRelatif = ((indeks * 29 + gerakUdara) % 300 + 300) % 300;
                    const y = 38 + posisiRelatif;
                    const x = indeks % 2 === 0 ? 132 + (indeks % 3) * 4 : 405 + (indeks % 3) * 4;
                    const panjang = 5 + Math.min(12, Math.abs(gerakLift.kecepatan) * 3);
                    return <g key={indeks} opacity={0.35 + (indeks % 4) * 0.15}><circle cx={x} cy={y} r={2 + (indeks % 2)} fill="#8ea7ff" /><path d={`M ${x - 7} ${y + panjang / 2} q 7 -${panjang} 14 0`} fill="none" stroke="#55e0c1" strokeWidth="1.2" strokeDasharray="3 3" /></g>;
                  })}
                </g>
                {(() => {
                  const perpindahanPiksel = gerakLift.posisi * 40;
                  const pusatX = 270;
                  const asalY = 207;
                  const skala = 82 / Math.max(2 * massaLift * gravitasi, 1);
                  const ujungNormalY = asalY - hasilLift.gayaNormal * skala;
                  const ujungBeratY = asalY + hasilLift.berat * skala;
                  return (
                    <g transform={`translate(0 ${-perpindahanPiksel})`}>
                      <line x1="270" y1="24" x2="270" y2="112" stroke="#60718a" strokeWidth="2" />
                      <rect x="178" y="118" width="184" height="140" rx="8" fill="#15263b" stroke="#8ea7ff" strokeWidth="3" />
                      <rect x="188" y="128" width="164" height="119" rx="5" fill="#1a2c42" stroke="#314760" strokeWidth="1" />
                      <line x1="188" y1="242" x2="352" y2="242" stroke="#8ea7ff" strokeWidth="4" />
                      <circle cx="270" cy="163" r="13" fill="#55e0c1" />
                      <path d="M250 180 Q270 172 290 180 L296 233 L244 233 Z" fill="#1d3448" stroke="#55e0c1" strokeWidth="2" />
                      <path d="M251 191 L238 225 M289 191 L302 225" stroke="#55e0c1" strokeWidth="5" strokeLinecap="round" />
                      <PanahTarik
                        asalX={pusatX} asalY={asalY} ujungX={pusatX} ujungY={ujungNormalY}
                        warna="#8ea7ff" marker="panah-lift-normal-rev" label="N"
                        onMulai={(event) => mulaiTarik("normal", event, { asalX: pusatX, asalY: asalY - perpindahanPiksel, skala })}
                      />
                      <PanahTarik
                        asalX={pusatX} asalY={asalY} ujungX={pusatX} ujungY={ujungBeratY}
                        warna="#f6bd60" marker="panah-lift-berat-rev" label="W = mg"
                        onMulai={(event) => mulaiTarik("berat", event, { asalX: pusatX, asalY: asalY - perpindahanPiksel, skala })}
                      />
                    </g>
                  );
                })()}
                <text x="270" y="378" textAnchor="middle" fill="#91a1b8" fontSize="11">Posisi: {gerakLift.posisi.toFixed(2)} m · Kecepatan: {gerakLift.kecepatan.toFixed(2)} m/s</text>
              </svg>
              <p className="dinamika-status-line">
                {hasilLift.gayaNormal < 1e-8 ? "Kontak lantai hilang: model gaya normal dibatasi nol." : gerakLift.kecepatan === 0 ? "Kabin diam di lantai tujuan." : gerakLift.kecepatan > 0 ? "Kabin sedang bergerak naik; partikel udara mengikuti gerak kabin." : "Kabin sedang bergerak turun; partikel udara mengikuti gerak kabin."}
                {` Percepatan aktual ${gerakLift.percepatan.toFixed(2)} m/s².`}
              </p>
              <KontrolSimulasiDinamika waktu={playback.waktu} durasi={DURASI} berjalan={playback.berjalan} pengaliKecepatan={playback.pengaliKecepatan} tanpaBatas={playback.tanpaBatas} onUbahModeWaktu={playback.setTanpaBatas} onUbahWaktu={playback.aturWaktu} onMulaiJeda={playback.mulaiJeda} onAturUlang={playback.aturUlang} onUbahKecepatan={playback.setPengaliKecepatan} bisaGeser={false} />
            </section>
            <section className="metrics-grid dinamika-metrics-grid">
              <KartuBesaran label="Berat gravitasi" value={`${hasilLift.berat.toFixed(2)} N`} ikon="W" aksen="amber" />
              <KartuBesaran label="Berat semu / normal" value={`${hasilLift.gayaNormal.toFixed(2)} N`} ikon="N" aksen="blue" />
              <KartuBesaran label="Percepatan aktual lift" value={`${gerakLift.percepatan.toFixed(2)} m/s²`} ikon="a" aksen="mint" />
            </section>
            <GrafikWaktuNyata judul="Grafik gerak kabin lift" waktu={playback.waktu} seri={seriGrafik} waktuSampel={riwayatLift.map((item) => item.waktu)} keterangan="Percepatan aktual berubah tanda saat kabin beralih dari fase akselerasi ke fase pengereman." />
          </div>
        </div>
      )}

      <ModelMatematika
        deskripsi={mode === "katrol"
          ? "Dua massa dihubungkan oleh tali ringan melalui katrol ideal. Perpindahan, kecepatan, dan percepatan mengikuti gerak dipercepat konstan sampai massa mencapai batas lintasan."
          : "Lift bergerak dari keadaan diam dengan fase percepatan konstan, kemudian perlambatan konstan hingga berhenti. Gaya normal dihitung memakai percepatan aktual pada fase yang sedang berlangsung."}
        persamaan={mode === "katrol" ? persamaanKatrol : persamaanLift}
        variabel={mode === "katrol" ? variabelKatrol : variabelLift}
        catatan={mode === "katrol"
          ? "Tali digambar lebih tipis dan memiliki rentangan panjang. Lantai dasar menjadi batas lintasan massa. Saat batas tersebut tercapai, model menghentikan gerak karena tumbukan dengan lantai; model tidak melanjutkan gerak menembus lantai."
          : "Profil lift berbentuk segitiga kecepatan: percepatan konstan pada paruh pertama dan perlambatan konstan pada paruh kedua. Posisi dan kecepatannya kontinu, tanpa pemotongan eksponensial atau lonjakan di akhir. Panah gaya berada dalam transformasi kabin yang sama sehingga selalu menempel dan mengikuti kabin."}
      />
    </section>
  );
}