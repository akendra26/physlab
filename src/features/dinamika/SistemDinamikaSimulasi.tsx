import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { DockableControlPanel, useKinematicsScaleMode } from "../../components/simulasi/SimulationExperience";

import KartuBesaran from "../../components/simulasi/KartuBesaran";
import ModelMatematika from "../../components/simulasi/ModelMatematika";
import ParameterSlider from "../../components/simulasi/ParameterSlider";
import GrafikWaktuNyata from "./GrafikWaktuNyata";
import KontrolSimulasiDinamika from "./KontrolSimulasiDinamika";
import { batasi, dapatkanTitikSvg } from "./InteraksiSvg";
import { hitungAtwood, hitungLift } from "./mesinDinamika";
import { useBahasa } from "../../i18n/BahasaContext";

type ModeSistem = "katrol" | "lift";
type JenisTarikan = "tegangan" | "normal" | "berat" | "massa-satu";
type TarikanAktif = { jenis: JenisTarikan; asalX: number; asalY: number; skala: number; offsetY?: number };
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

  useEffect(() => {
    if (!tanpaBatas && waktuRef.current > durasi) {
      waktuRef.current = durasi;
      setWaktu(durasi);
      setBerjalan(false);
    }
  }, [durasi, tanpaBatas]);

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
  const isId = useBahasa() === "id";
  return (
    <g className="vektor-dapat-ditarik">
      <line x1={asalX} y1={asalY} x2={ujungX} y2={ujungY} stroke="#050b16" strokeWidth="7.5" strokeLinecap="round" />
      <line x1={asalX} y1={asalY} x2={ujungX} y2={ujungY} stroke={warna} strokeWidth="4.4" strokeLinecap="round" markerEnd={`url(#${marker})`} />
      <circle cx={ujungX} cy={ujungY} r="9" fill={warna} fillOpacity=".14" stroke={warna} strokeOpacity=".85" className="pegangan-vektor" onPointerDown={onMulai} aria-label={isId ? `Tarik panah ${label}` : `Drag ${label} vector` } />
      <text x={ujungX + 10} y={ujungY - 5} fill={warna} stroke="#050b16" strokeWidth="3" paintOrder="stroke" fontSize="12" fontWeight="800">{label}</text>
    </g>
  );
}

export default function SistemDinamikaSimulasi({ initialMode }: { initialMode: ModeSistem }) {
  const isId = useBahasa() === "id";
  const scaleMode = useKinematicsScaleMode();
  const [durasi, setDurasi] = useState(12);
  const mode = initialMode;
  const [massaSatu, setMassaSatu] = useState(4);
  const [massaDua, setMassaDua] = useState(6);
  const [massaLift, setMassaLift] = useState(60);
  const [gravitasi, setGravitasi] = useState(9.81);
  const [percepatanLift, setPercepatanLift] = useState(0.8);
  const tarikanAktif = useRef<TarikanAktif | null>(null);
  const playback = useJamSimulasi(durasi);
  const gerakKatrolRef = useRef<RiwayatGerak>({ waktu: 0, posisi: 0, kecepatan: 0, percepatan: 0 });
  const gerakLiftRef = useRef<RiwayatGerak>({ waktu: 0, posisi: 0, kecepatan: 0, percepatan: 0 });
  const waktuIntegrasiRef = useRef(0);
  const akumulatorGrafikRef = useRef(0);
  const [gerakKatrol, setGerakKatrol] = useState<RiwayatGerak>({ waktu: 0, posisi: 0, kecepatan: 0, percepatan: 0 });
  const [gerakLift, setGerakLift] = useState<RiwayatGerak>({ waktu: 0, posisi: 0, kecepatan: 0, percepatan: 0 });
  const [riwayatKatrol, setRiwayatKatrol] = useState<RiwayatGerak[]>([{ waktu: 0, posisi: 0, kecepatan: 0, percepatan: 0 }]);
  const [riwayatLift, setRiwayatLift] = useState<RiwayatGerak[]>([{ waktu: 0, posisi: 0, kecepatan: 0, percepatan: 0 }]);

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
        if (akumulator >= 0.08 || playback.waktu + 1e-6 >= durasi) {
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
  }, [durasi, hasilKatrol.percepatan, massaLift, percepatanLift, playback.waktu]);

  const arahKatrol = Math.abs(hasilKatrol.percepatan) < 1e-8
    ? (isId ? "Sistem seimbang: percepatan kedua massa nol." : "Balanced system: both masses have zero acceleration.")
    : gerakKatrol.kecepatan === 0 && playback.waktu > 0
      ? (isId ? "Massa mencapai batas lintasan dan berhenti setelah kontak mekanis." : "The mass reaches the track limit and stops after mechanical contact.")
      : hasilKatrol.percepatan > 0
        ? (isId ? "Massa m₂ bergerak turun dan massa m₁ bergerak naik." : "Mass m₂ moves down while mass m₁ moves up.")
        : (isId ? "Massa m₁ bergerak turun dan massa m₂ bergerak naik." : "Mass m₁ moves down while mass m₂ moves up.");

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

  const reset = () => {
    playback.aturUlang();
    resetGerak();
    setDurasi(12);
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
      { label: isId ? "Perpindahan m₂" : "m₂ displacement", satuan: "m", warna: "#55e0c1", nilai: riwayatKatrol.map((item) => item.posisi) },
      { label: isId ? "Kecepatan m₂" : "m₂ velocity", satuan: "m/s", warna: "#8ea7ff", nilai: riwayatKatrol.map((item) => item.kecepatan) },
      { label: isId ? "Percepatan m₂" : "m₂ acceleration", satuan: "m/s²", warna: "#f6bd60", nilai: riwayatKatrol.map((item) => item.percepatan) },
    ]
    : [
      { label: isId ? "Posisi lift" : "Elevator position", satuan: "m", warna: "#55e0c1", nilai: riwayatLift.map((item) => item.posisi) },
      { label: isId ? "Kecepatan lift" : "Elevator velocity", satuan: "m/s", warna: "#8ea7ff", nilai: riwayatLift.map((item) => item.kecepatan) },
      { label: isId ? "Percepatan aktual" : "Actual acceleration", satuan: "m/s²", warna: "#f6bd60", nilai: riwayatLift.map((item) => item.percepatan) },
    ];

  const persamaanKatrol = [
    { judul: (isId ? "Percepatan sistem Atwood" : "Atwood system acceleration"), latex: String.raw`a=\frac{(m_2-m_1)g}{m_1+m_2}` },
    { judul: (isId ? "Tegangan tali" : "Rope tension"), latex: String.raw`T=\frac{2m_1m_2}{m_1+m_2}\,g` },
    { judul: (isId ? "Hukum II Newton pada masing-masing massa" : "Newton’s second law for each mass"), latex: String.raw`T-m_1g=m_1a,\qquad m_2g-T=m_2a` },
  ];
  const persamaanLift = [
    { judul: (isId ? "Hukum II Newton pada arah vertikal" : "Newton’s second law in the vertical direction"), latex: String.raw`N-mg=ma_{\text{aktual}}` },
    { judul: (isId ? "Berat semu / pembacaan timbangan" : "Apparent weight / scale reading"), latex: String.raw`W_{\text{semu}}=N=m(g+a_{\text{aktual}})` },
    { judul: (isId ? "Berat gravitasi" : "Gravitational weight"), latex: String.raw`W=mg` },
  ];
  const variabelKatrol = [
    { simbol: String.raw`m_1`, nama: (isId ? "Massa pertama" : "First mass"), satuan: "kg" },
    { simbol: String.raw`m_2`, nama: (isId ? "Massa kedua" : "Second mass"), satuan: "kg" },
    { simbol: String.raw`a`, nama: (isId ? "Percepatan; positif saat m₂ turun" : "Acceleration; positive when m₂ moves down"), satuan: "m/s²" },
    { simbol: String.raw`T`, nama: (isId ? "Tegangan tali" : "Rope tension"), satuan: "N" },
    { simbol: String.raw`g`, nama: (isId ? "Percepatan gravitasi" : "Gravitational acceleration"), satuan: "m/s²" },
  ];
  const variabelLift = [
    { simbol: String.raw`m`, nama: (isId ? "Massa penumpang atau benda" : "Passenger or object mass"), satuan: "kg" },
    { simbol: String.raw`a`, nama: (isId ? "Percepatan aktual kabin" : "Actual cabin acceleration"), satuan: "m/s²" },
    { simbol: String.raw`N`, nama: (isId ? "Gaya normal lantai lift pada orang" : "Normal force from the elevator floor on the passenger"), satuan: "N" },
    { simbol: String.raw`W`, nama: (isId ? "Berat gravitasi" : "Gravitational weight"), satuan: "N" },
    { simbol: String.raw`g`, nama: (isId ? "Percepatan gravitasi" : "Gravitational acceleration"), satuan: "m/s²" },
  ];

  return (
    <section className="dinamika-simulasi">
      <div className="dinamika-section-heading">
        <div>
          <p className="eyebrow">{mode === "katrol" ? (isId ? "KATROL ATWOOD" : "ATWOOD MACHINE") : (isId ? "DINAMIKA LIFT" : "ELEVATOR DYNAMICS")}</p>
          <h2>{mode === "katrol" ? (isId ? "Sistem Katrol Atwood" : "Atwood Pulley System") : (isId ? "Benda di Dalam Lift" : "Object Inside an Elevator")}</h2>
          <p>{isId ? "Gerak dihitung dari persamaan dinamika bertahap. Grafik posisi, kecepatan, dan percepatan mengikuti waktu simulasi." : "Motion is calculated using stepwise dynamics equations. Position, velocity, and acceleration graphs follow the simulation clock."}</p>
        </div>
        <button type="button" className="dinamika-reset" onClick={reset}>{isId ? "Atur ulang" : "Reset"}</button>
      </div>

      {mode === "katrol" ? (
        <div className="dinamika-workspace">
          <DockableControlPanel><aside className="panel control-panel">
            <div className="panel-heading"><div><p className="eyebrow">{isId ? "PENGATURAN" : "SETTINGS"}</p><h2>{isId ? "Parameter katrol" : "Pulley parameters"}</h2></div></div>
            <div className="atwood-mass-control">
              <ParameterSlider label={isId ? "Massa pertama (m₁)" : "First mass (m₁)"} value={massaSatu} min={1} max={20} step={0.5} unit="kg" onChange={setMassaSatu} />
              <div className="atwood-stepper" aria-label={isId ? "Ubah massa pertama" : "Adjust first mass"}>
                <button type="button" onClick={() => setMassaSatu((v) => Math.max(1, Math.round((v - 0.5) * 10) / 10))} aria-label="Kurangi massa pertama">−</button>
                <output>{massaSatu.toFixed(1)} kg</output>
                <button type="button" onClick={() => setMassaSatu((v) => Math.min(20, Math.round((v + 0.5) * 10) / 10))} aria-label="Tambah massa pertama">+</button>
              </div>
            </div>
            <div className="atwood-mass-control">
              <ParameterSlider label={isId ? "Massa kedua (m₂)" : "Second mass (m₂)"} value={massaDua} min={1} max={20} step={0.5} unit="kg" onChange={setMassaDua} />
              <div className="atwood-stepper" aria-label={isId ? "Ubah massa kedua" : "Adjust second mass"}>
                <button type="button" onClick={() => setMassaDua((v) => Math.max(1, Math.round((v - 0.5) * 10) / 10))} aria-label="Kurangi massa kedua">−</button>
                <output>{massaDua.toFixed(1)} kg</output>
                <button type="button" onClick={() => setMassaDua((v) => Math.min(20, Math.round((v + 0.5) * 10) / 10))} aria-label="Tambah massa kedua">+</button>
              </div>
            </div>
            <ParameterSlider label={isId ? (isId ? "Percepatan gravitasi" : "Gravitational acceleration") : "Gravitational acceleration"} value={gravitasi} min={1} max={20} step={0.01} unit="m/s²" onChange={setGravitasi} />
            <p className="dinamika-control-note">{isId ? "Tarik ujung panah T untuk mengubah tegangan; massa m₂ dihitung dari persamaan Atwood. Tali dianggap ringan, tidak mulur, dan tanpa slip." : "Drag the tip of vector T to change tension; mass m₂ is solved from the Atwood equation. The string is assumed massless, inextensible, and slip-free."}</p>
          </aside></DockableControlPanel>

          <div className="dinamika-main-column">
            <section className="panel dinamika-visual-panel">
              <div className="simulation-header"><div><p className="eyebrow">{isId ? "DIAGRAM SISTEM" : "SYSTEM DIAGRAM"}</p><h2>{isId ? "Mesin Atwood dan lantai dasar" : "Atwood machine and base floor"}</h2></div><span className="model-badge">{isId ? "KATROL IDEAL" : "IDEAL PULLEY"} · {scaleMode === "actual-scale" ? (isId ? "SKALA NYATA" : "ACTUAL SCALE") : (isId ? "KOTAK BATAS" : "BOUNDARY BOX")}</span></div>
              <svg viewBox="0 0 540 390" role="img" aria-label={isId ? "Mesin Atwood dengan tali tipis, rentangan panjang, lantai dasar, dan panah tegangan yang dapat ditarik" : "Atwood machine with a thin string, long span, base floor, and draggable tension vector"} onPointerMove={gerakTarik} onPointerUp={akhiriTarik} onPointerCancel={akhiriTarik}>
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
                  const perpindahan = gerakKatrol.posisi * (scaleMode === "actual-scale" ? 60 : 48);
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
                      <line x1="375" y1={asalYBerat} x2="375" y2={ujungYBerat} stroke="#050b16" strokeWidth="7.5" strokeLinecap="round" />
                      <line x1="375" y1={asalYBerat} x2="375" y2={ujungYBerat} stroke="#f6bd60" strokeWidth="4.3" strokeLinecap="round" markerEnd="url(#panah-katrol-berat-rev)" />
                      <text x="388" y={ujungYBerat + 11} fill="#f6bd60" stroke="#050b16" strokeWidth="3" paintOrder="stroke" fontSize="12" fontWeight="800">m₂g</text>
                      <PanahTarik
                        asalX={375} asalY={asalYTegangan} ujungX={375} ujungY={ujungYTegangan}
                        warna="#8ea7ff" marker="panah-katrol-tegangan-rev" label="T"
                        onMulai={(event) => mulaiTarik("tegangan", event, { asalX: 375, asalY: asalYTegangan, skala })}
                      />
                      <text x="270" y="310" textAnchor="middle" fill="#91a1b8" fontSize="11">{isId ? "Perpindahan" : "Displacement"}: {gerakKatrol.posisi.toFixed(2)} m · {isId ? "Kecepatan" : "Velocity"}: {gerakKatrol.kecepatan.toFixed(2)} m/s</text>
                    </>
                  );
                })()}
                <rect x="0" y="340" width="540" height="50" fill="url(#arsir-lantai-katrol)" opacity=".85" />
                <line x1="0" y1="340" x2="540" y2="340" stroke="#91a1b8" strokeWidth="4" />
                <text x="18" y="332" fill="#91a1b8" fontSize="10">{isId ? "LANTAI DASAR" : "BASE FLOOR"}</text>
              </svg>
              <p className="dinamika-status-line">{arahKatrol}</p>
              <KontrolSimulasiDinamika waktu={playback.waktu} durasi={durasi} onUbahDurasi={(value) => { setDurasi(Math.max(1, Math.min(60, value))); playback.aturUlang(); resetGerak(); }} berjalan={playback.berjalan} pengaliKecepatan={playback.pengaliKecepatan} tanpaBatas={playback.tanpaBatas} onUbahModeWaktu={playback.setTanpaBatas} onUbahWaktu={playback.aturWaktu} onMulaiJeda={playback.mulaiJeda} onAturUlang={playback.aturUlang} onUbahKecepatan={playback.setPengaliKecepatan} bisaGeser={false} />
            </section>
            <section className="metrics-grid dinamika-metrics-grid">
              <KartuBesaran label={isId ? "Percepatan sistem" : "System acceleration"} value={`${hasilKatrol.percepatan.toFixed(3)} m/s²`} ikon="a" aksen="mint" />
              <KartuBesaran label={isId ? (isId ? "Tegangan tali" : "Rope tension") : "String tension"} value={`${hasilKatrol.tegangan.toFixed(2)} N`} ikon="T" aksen="blue" />
              <KartuBesaran label={isId ? "Perpindahan m₂" : "Displacement m₂"} value={`${gerakKatrol.posisi.toFixed(2)} m`} ikon="s" aksen="amber" />
            </section>
            <GrafikWaktuNyata judul={isId ? "Grafik gerak sistem katrol" : "Pulley system motion graph"} waktu={playback.waktu} seri={seriGrafik} waktuSampel={(mode === "katrol" ? riwayatKatrol : riwayatLift).map((item) => item.waktu)} keterangan={isId ? "Saat massa mencapai batas lintasan, percepatan dan kecepatan menjadi nol karena kontak mekanis." : "When a mass reaches the track limit, acceleration and velocity become zero due to mechanical contact."} />
          </div>
        </div>
      ) : (
        <div className="dinamika-workspace">
          <DockableControlPanel><aside className="panel control-panel">
            <div className="panel-heading"><div><p className="eyebrow">{isId ? "PENGATURAN" : "SETTINGS"}</p><h2>{isId ? "Parameter lift" : "Elevator parameters"}</h2></div></div>
            <ParameterSlider label={isId ? "Massa orang atau benda" : "Person or object mass"} value={massaLift} min={20} max={150} step={1} unit="kg" onChange={setMassaLift} />
            <ParameterSlider label={isId ? "Percepatan awal lift" : "Initial elevator acceleration"} value={percepatanLift} min={-2} max={2} step={0.1} unit="m/s²" onChange={setPercepatanLift} />
            <ParameterSlider label={isId ? (isId ? "Percepatan gravitasi" : "Gravitational acceleration") : "Gravitational acceleration"} value={gravitasi} min={1} max={20} step={0.01} unit="m/s²" onChange={setGravitasi} />
            <p className="dinamika-control-note">{isId ? "Lift berangkat dari keadaan diam, dipercepat pada paruh perjalanan, lalu direm hingga berhenti. Tarik panah N untuk mengubah percepatan; tarik W untuk mengubah massa." : "The elevator starts at rest, accelerates through the first half of its trip, then brakes to a stop. Drag vector N to change acceleration; drag W to change mass."}</p>
          </aside></DockableControlPanel>

          <div className="dinamika-main-column">
            <section className="panel dinamika-visual-panel">
              <div className="simulation-header"><div><p className="eyebrow">{isId ? "ANIMASI RUANG LIFT" : "ELEVATOR ANIMATION"}</p><h2>{isId ? "Kabin, penumpang, dan vektor gaya" : "Cabin, passenger, and force vectors"}</h2></div><span className="model-badge">{isId ? "GERAK BERAKSELERASI" : "ACCELERATED MOTION"} · {scaleMode === "actual-scale" ? (isId ? "SKALA NYATA" : "ACTUAL SCALE") : (isId ? "KOTAK BATAS" : "BOUNDARY BOX")}</span></div>
              <svg viewBox="0 0 540 390" role="img" aria-label={isId ? "Animasi kabin lift bergerak mulus, dengan partikel udara dan panah gaya yang mengikuti kabin" : "Smooth elevator cabin animation with air particles and force vectors that follow the cabin"} onPointerMove={gerakTarik} onPointerUp={akhiriTarik} onPointerCancel={akhiriTarik}>
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
                  const perpindahanPiksel = gerakLift.posisi * (scaleMode === "actual-scale" ? 40 : 32);
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
                <text x="270" y="378" textAnchor="middle" fill="#91a1b8" fontSize="11">{isId ? "Posisi" : "Position"}: {gerakLift.posisi.toFixed(2)} m · {isId ? "Kecepatan" : "Velocity"}: {gerakLift.kecepatan.toFixed(2)} m/s</text>
              </svg>
              <p className="dinamika-status-line">
                {hasilLift.gayaNormal < 1e-8 ? (isId ? "Kontak lantai hilang: model gaya normal dibatasi nol." : "Floor contact is lost: the normal force is limited to zero.") : gerakLift.kecepatan === 0 ? (isId ? "Kabin diam di lantai tujuan." : "The cabin is stationary at its destination floor.") : gerakLift.kecepatan > 0 ? (isId ? "Kabin sedang bergerak naik; partikel udara mengikuti gerak kabin." : "The cabin is moving up; air particles follow its motion.") : (isId ? "Kabin sedang bergerak turun; partikel udara mengikuti gerak kabin." : "The cabin is moving down; air particles follow its motion.")}
                {`${isId ? " Percepatan aktual " : " Actual acceleration "}${gerakLift.percepatan.toFixed(2)} m/s².`}
              </p>
              <KontrolSimulasiDinamika waktu={playback.waktu} durasi={durasi} onUbahDurasi={(value) => { setDurasi(Math.max(1, Math.min(60, value))); playback.aturUlang(); resetGerak(); }} berjalan={playback.berjalan} pengaliKecepatan={playback.pengaliKecepatan} tanpaBatas={playback.tanpaBatas} onUbahModeWaktu={playback.setTanpaBatas} onUbahWaktu={playback.aturWaktu} onMulaiJeda={playback.mulaiJeda} onAturUlang={playback.aturUlang} onUbahKecepatan={playback.setPengaliKecepatan} bisaGeser={false} />
            </section>
            <section className="metrics-grid dinamika-metrics-grid">
              <KartuBesaran label={isId ? (isId ? "Berat gravitasi" : "Gravitational weight") : "Gravitational weight"} value={`${hasilLift.berat.toFixed(2)} N`} ikon="W" aksen="amber" />
              <KartuBesaran label={isId ? "Berat semu / normal" : "Apparent weight / normal force"} value={`${hasilLift.gayaNormal.toFixed(2)} N`} ikon="N" aksen="blue" />
              <KartuBesaran label={isId ? "Percepatan aktual lift" : "Actual elevator acceleration"} value={`${gerakLift.percepatan.toFixed(2)} m/s²`} ikon="a" aksen="mint" />
            </section>
            <GrafikWaktuNyata judul={isId ? "Grafik gerak kabin lift" : "Elevator cabin motion graph"} waktu={playback.waktu} seri={seriGrafik} waktuSampel={riwayatLift.map((item) => item.waktu)} keterangan={isId ? "Percepatan aktual berubah tanda saat kabin beralih dari fase akselerasi ke fase pengereman." : "Actual acceleration changes sign as the cabin switches from acceleration to braking."} />
          </div>
        </div>
      )}

      <ModelMatematika
        deskripsi={mode === "katrol"
          ? (isId ? "Dua massa dihubungkan oleh tali ringan melalui katrol ideal. Perpindahan, kecepatan, dan percepatan mengikuti gerak dipercepat konstan sampai massa mencapai batas lintasan." : "Two masses are connected by a light rope over an ideal pulley. Displacement, velocity, and acceleration follow constant-acceleration motion until a mass reaches the track limit.")
          : (isId ? "Lift bergerak dari keadaan diam dengan fase percepatan konstan, kemudian perlambatan konstan hingga berhenti. Gaya normal dihitung memakai percepatan aktual pada fase yang sedang berlangsung." : "The elevator starts at rest, accelerates at a constant rate, then decelerates uniformly to a stop. The normal force uses the actual acceleration in each phase.")}
        persamaan={mode === "katrol" ? persamaanKatrol : persamaanLift}
        variabel={mode === "katrol" ? variabelKatrol : variabelLift}
        catatan={mode === "katrol"
          ? (isId ? "Tali digambar lebih tipis dan memiliki rentangan panjang. Lantai dasar menjadi batas lintasan massa. Saat batas tersebut tercapai, model menghentikan gerak karena tumbukan dengan lantai; model tidak melanjutkan gerak menembus lantai." : "The rope is drawn thin with a long span. The base floor defines the mass travel limit. When the mass reaches it, the model stops motion on contact rather than allowing it to pass through the floor.")
          : (isId ? "Profil lift berbentuk segitiga kecepatan: percepatan konstan pada paruh pertama dan perlambatan konstan pada paruh kedua. Posisi dan kecepatannya kontinu, tanpa pemotongan eksponensial atau lonjakan di akhir. Panah gaya berada dalam transformasi kabin yang sama sehingga selalu menempel dan mengikuti kabin." : "The elevator follows a triangular velocity profile: constant acceleration during the first half and constant deceleration during the second. Position and velocity remain continuous without exponential cutoffs or end-of-run jumps. Force arrows share the cabin transform and stay attached as it moves.")}
      />
    </section>
  );
}