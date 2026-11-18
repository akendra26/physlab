import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { DockableControlPanel } from "../../components/simulasi/SimulationExperience";
import ParameterSlider from "../../components/simulasi/ParameterSlider";
import KontrolWaktuSimulasi from "../../components/simulasi/KontrolWaktuSimulasi";
import GrafikMini from "../../components/simulasi/GrafikMini";
import KartuBesaran from "../../components/simulasi/KartuBesaran";
import ModelMatematika from "../../components/simulasi/ModelMatematika";
import SistemDinamikaSimulasi from "./SistemDinamikaSimulasi";
import VisualisasiDinamikaKurikulum from "./VisualisasiDinamikaKurikulum";
import {
  buatSampelGrafikDinamika,
  hitungKeadaanDinamika,
  PARAMETER_AWAL_KURIKULUM,
  type ParameterKurikulumDinamika,
  type SkenarioDinamika,
} from "./mesinKurikulum";
import type { ModulDinamikaId } from "../../config/konfigurasiNavigasi";
import { useBahasa } from "../../i18n/BahasaContext";

type GrafikDinamika = { title: string; yLabel: string; values: number[]; color: string };

function buatModelMatematikaID(skenario: SkenarioDinamika, p: ParameterKurikulumDinamika) {
  if (skenario === "balok") return {
    deskripsi: "Balok berada pada bidang horizontal dan menerima gaya luar yang membentuk sudut θ terhadap sumbu horizontal. Gaya diuraikan menjadi komponen X dan Y; komponen vertikal mengubah gaya normal dan dapat mengangkat balok, sedangkan komponen horizontal menentukan gerak dan gesekan.",
    persamaan: [
      { judul: "Komponen gaya horizontal", latex: String.raw`F_x=F\cos\theta` },
      { judul: "Komponen gaya vertikal", latex: String.raw`F_y=F\sin\theta` },
      { judul: "Gaya vertikal dan normal", latex: String.raw`N=\max(0,mg-F\sin\theta)` },
      { judul: "Percepatan vertikal saat terangkat", latex: String.raw`a_y=\max(0,\frac{F\sin\theta-mg}{m})` },
      { judul: "Hukum II Newton sumbu horizontal", latex: String.raw`F\cos\theta-f=ma` },
      { judul: "Batas gesekan statis", latex: String.raw`f_s\leq \mu_s N` },
      { judul: "Gesekan kinetis", latex: String.raw`f_k=\mu_k N` },
      { judul: "Gerak dipercepat", latex: String.raw`x=x_0+v_0t+\frac12 at^2` },
    ],
    variabel: [
      { simbol: String.raw`m`, nama: "Massa balok", satuan: "kg" },
      { simbol: String.raw`F,\theta`, nama: "Besar dan arah gaya luar", satuan: "N, °" },
      { simbol: String.raw`N`, nama: "Gaya normal", satuan: "N" },
      { simbol: String.raw`\mu_s,\mu_k`, nama: "Koefisien gesekan statis dan kinetis", satuan: "tanpa satuan" },
      { simbol: String.raw`a`, nama: "Percepatan horizontal", satuan: "m/s²" },
    ],
    catatan: "Gaya gesek statis bukan selalu μsN; nilainya menyesuaikan resultan gaya hingga maksimum μsN. Model transisi ke gesekan kinetis terjadi saat gaya luar melampaui ambang statis.",
  };
  const spring = p.modeOsilasi === "pegas";
  return spring ? {
    deskripsi: "Osilator pegas mengikuti gaya pemulih Hukum Hooke dan redaman viskos. Bentuk respons ditentukan oleh rasio redaman ζ.",
    persamaan: [
      { judul: "Hukum Hooke dan redaman", latex: String.raw`m\ddot x+c\dot x+kx=0` },
      { judul: "Frekuensi alami", latex: String.raw`\omega_0=\sqrt{\frac{k}{m}}` },
      { judul: "Rasio redaman", latex: String.raw`\zeta=\frac{c}{2\sqrt{km}}` },
      { judul: "Frekuensi teredam (ζ < 1)", latex: String.raw`\omega_d=\omega_0\sqrt{1-\zeta^2}` },
    ],
    variabel: [
      { simbol: String.raw`m`, nama: "Massa beban", satuan: "kg" },
      { simbol: String.raw`k`, nama: "Konstanta pegas", satuan: "N/m" },
      { simbol: String.raw`c`, nama: "Koefisien redaman viskos", satuan: "N·s/m" },
      { simbol: String.raw`x`, nama: "Simpangan dari posisi setimbang", satuan: "m" },
      { simbol: String.raw`\zeta`, nama: "Rasio redaman", satuan: "tanpa satuan" },
    ],
    catatan: "Kontrol redaman pada antarmuka adalah rasio ζ. Untuk ζ < 1 respons berosilasi; ζ = 1 kritis; ζ > 1 overdamped. Mesin menghitung ketiga rezim secara analitik.",
  } : {
    deskripsi: "Bandul matematis dimodelkan sebagai massa titik pada tali ringan tak mulur. Untuk sudut kecil, sin θ ≈ θ sehingga persamaan gerak menjadi osilator harmonik.",
    persamaan: [
      { judul: "Persamaan bandul sudut kecil", latex: String.raw`\ddot\theta+2\zeta\omega_0\dot\theta+\omega_0^2\theta=0` },
      { judul: "Frekuensi alami bandul", latex: String.raw`\omega_0=\sqrt{\frac{g}{L}}` },
      { judul: "Periode untuk sudut kecil", latex: String.raw`T=2\pi\sqrt{\frac{L}{g}}` },
      { judul: "Pendekatan sudut kecil", latex: String.raw`\sin\theta\approx\theta` },
    ],
    variabel: [
      { simbol: String.raw`L`, nama: "Panjang tali", satuan: "m" },
      { simbol: String.raw`\theta`, nama: "Simpangan sudut", satuan: "rad" },
      { simbol: String.raw`g`, nama: "Percepatan gravitasi", satuan: "m/s²" },
      { simbol: String.raw`T`, nama: "Periode ayunan", satuan: "s" },
      { simbol: String.raw`\zeta`, nama: "Rasio redaman ekuivalen", satuan: "tanpa satuan" },
    ],
    catatan: "Model bandul menggunakan pendekatan sudut kecil (amplitudo awal maksimum sekitar 0,8 rad) dan redaman linear ekuivalen. Pada sudut besar, periode bandul nyata bergantung pada amplitudo.",
  };
}

const MODEL_TERJEMAHAN_EN: Record<string, string> = {
  "Balok berada pada bidang horizontal dan menerima gaya luar yang membentuk sudut θ terhadap sumbu horizontal. Gaya diuraikan menjadi komponen X dan Y; komponen vertikal mengubah gaya normal dan dapat mengangkat balok, sedangkan komponen horizontal menentukan gerak dan gesekan.": "A block rests on a horizontal surface and receives an applied force at angle θ to the horizontal axis. The force is resolved into X and Y components; the vertical component changes the normal force and can lift the block off the surface, while the horizontal component determines motion and friction.",
  "Komponen gaya horizontal": "Horizontal force component",
  "Komponen gaya vertikal": "Vertical force component",
  "Hukum II Newton sumbu horizontal": "Newton’s second law along the horizontal axis",
  "Gaya vertikal dan normal": "Vertical force and normal reaction",
  "Percepatan vertikal saat terangkat": "Vertical acceleration during lift-off",
  "Batas gesekan statis": "Static friction limit",
  "Gesekan kinetis": "Kinetic friction",
  "Gerak dipercepat": "Accelerated motion",
  "Massa balok": "Block mass",
  "Besar dan arah gaya luar": "Applied force magnitude and direction",
  "Gaya normal": "Normal force",
  "Koefisien gesekan statis dan kinetis": "Static and kinetic friction coefficients",
  "tanpa satuan": "dimensionless",
  "Percepatan horizontal": "Horizontal acceleration",
  "Gaya gesek statis bukan selalu μsN; nilainya menyesuaikan resultan gaya hingga maksimum μsN. Model transisi ke gesekan kinetis terjadi saat gaya luar melampaui ambang statis.": "Static friction is not always μsN; it adjusts to the net applied force up to the maximum μsN. The model switches to kinetic friction when the applied force exceeds the static-friction threshold.",
  "Dua benda bergerak pada lintasan satu dimensi. Saat bersentuhan, momentum total dipertahankan; koefisien restitusi menentukan perubahan energi kinetik.": "Two objects move along a one-dimensional track. During contact, total momentum is conserved; the coefficient of restitution determines the change in kinetic energy.",
  "Kekekalan momentum": "Conservation of momentum",
  "Koefisien restitusi": "Coefficient of restitution",
  "Massa benda pertama dan kedua": "Masses of the first and second objects",
  "Komponen berat sejajar bidang": "Weight component parallel to the plane",
  "Komponen berat tegak lurus bidang": "Weight component perpendicular to the plane",
  "Percepatan saat meluncur": "Acceleration while sliding",
  "Komponen berat sepanjang bidang": "Weight component along the plane",
  "Gaya normal bidang": "Plane normal force",
  "Persamaan percepatan berlaku setelah balok mulai meluncur menuruni bidang. Sebelum bergerak, gesekan statis dapat menyeimbangkan komponen berat sejajar bidang.": "The acceleration equation applies after the block begins sliding down the plane. Before motion begins, static friction can balance the component of weight parallel to the plane.",
  "Osilator pegas mengikuti gaya pemulih Hukum Hooke dan redaman viskos. Bentuk respons ditentukan oleh rasio redaman ζ.": "The spring oscillator follows Hooke’s restoring force and viscous damping. Its response is determined by the damping ratio ζ.",
  "Hukum Hooke dan redaman": "Hooke’s law and damping",
  "Frekuensi alami": "Natural frequency",
  "Rasio redaman": "Damping ratio",
  "Frekuensi teredam (ζ < 1)": "Damped frequency (ζ < 1)",
  "Massa beban": "Attached mass",
  "Konstanta pegas": "Spring constant",
  "Koefisien redaman viskos": "Viscous damping coefficient",
  "Simpangan dari posisi setimbang": "Displacement from equilibrium",
  "Kontrol redaman pada antarmuka adalah rasio ζ. Untuk ζ < 1 respons berosilasi; ζ = 1 kritis; ζ > 1 overdamped. Mesin menghitung ketiga rezim secara analitik.": "The damping control is the ratio ζ. For ζ < 1 the response oscillates; ζ = 1 is critical; ζ > 1 is overdamped. The engine calculates all three regimes analytically.",
  "Bandul matematis dimodelkan sebagai massa titik pada tali ringan tak mulur. Untuk sudut kecil, sin θ ≈ θ sehingga persamaan gerak menjadi osilator harmonik.": "A simple pendulum is modeled as a point mass on a light, inextensible string. At small angles, sin θ ≈ θ, so its equation of motion becomes that of a harmonic oscillator.",
  "Persamaan bandul sudut kecil": "Small-angle pendulum equation",
  "Frekuensi alami bandul": "Pendulum natural frequency",
  "Periode untuk sudut kecil": "Small-angle period",
  "Pendekatan sudut kecil": "Small-angle approximation",
  "Panjang tali": "String length",
  "Simpangan sudut": "Angular displacement",
  "Periode ayunan": "Oscillation period",
  "Rasio redaman ekuivalen": "Equivalent damping ratio",
  "Model bandul menggunakan pendekatan sudut kecil (amplitudo awal maksimum sekitar 0,8 rad) dan redaman linear ekuivalen. Pada sudut besar, periode bandul nyata bergantung pada amplitudo.": "The pendulum model uses the small-angle approximation (maximum initial amplitude about 0.8 rad) and equivalent linear damping. At large angles, a real pendulum’s period depends on amplitude.",
};

function buatModelMatematika(skenario: SkenarioDinamika, p: ParameterKurikulumDinamika, isId: boolean) {
  const model = buatModelMatematikaID(skenario, p);
  if (isId) return model;
  const t = (value: string) => MODEL_TERJEMAHAN_EN[value] ?? value;
  return {
    deskripsi: t(model.deskripsi),
    persamaan: model.persamaan.map((item) => ({ ...item, judul: t(item.judul) })),
    variabel: model.variabel.map((item) => ({ ...item, nama: t(item.nama), satuan: t(item.satuan) })),
    catatan: t(model.catatan),
  };
}

function DinamikaSkenario({ skenario }: { skenario: SkenarioDinamika }) {
  const isId = useBahasa() === "id";
  const [parameter, setParameter] = useState<ParameterKurikulumDinamika>(PARAMETER_AWAL_KURIKULUM);
  const [waktu, setWaktu] = useState(0);
  const waktuRef = useRef(0);
  const [berjalan, setBerjalan] = useState(false);
  const [pengaliKecepatan, setPengaliKecepatan] = useState(1);
  const [tanpaBatas, setTanpaBatas] = useState(false);
  const [durasi, setDurasi] = useState(12);

  useEffect(() => { waktuRef.current = waktu; }, [waktu]);
  useEffect(() => {
    if (!berjalan) return undefined;
    let frame = 0;
    let previous: number | null = null;
    let accumulator = 0;
    const fixedStep = 1 / 60;
    const tick = (timestamp: number) => {
      if (previous === null) previous = timestamp;
      const elapsed = Math.min((timestamp - previous) / 1000, 0.1);
      previous = timestamp;
      accumulator += elapsed * pengaliKecepatan;
      let nextTime = waktuRef.current;
      while (accumulator >= fixedStep) {
        nextTime += fixedStep;
        accumulator -= fixedStep;
      }
      if (!tanpaBatas && nextTime >= durasi) {
        nextTime = durasi;
        waktuRef.current = nextTime;
        startTransition(() => setWaktu(nextTime));
        setBerjalan(false);
        return;
      }
      if (nextTime !== waktuRef.current) {
        waktuRef.current = nextTime;
        // Jam/keadaan fisika dihitung di RAF 60 Hz; React memprioritaskan input di atas pembaruan visual.
        startTransition(() => setWaktu(nextTime));
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [berjalan, durasi, pengaliKecepatan, tanpaBatas]);


  const keadaan = useMemo(() => hitungKeadaanDinamika(skenario, parameter, waktu), [skenario, parameter, waktu]);
  const sampel = useMemo(() => buatSampelGrafikDinamika(skenario, parameter, durasi), [skenario, parameter, durasi]);
  const grafik: GrafikDinamika[] = [
    { title: isId ? "Perpindahan terhadap waktu" : "Displacement over time", yLabel: skenario === "osilasi" && parameter.modeOsilasi === "bandul" ? "θ (rad)" : "x (m)", values: sampel.map((item) => item.displacement), color: "#55e0c1" },
    { title: isId ? "Kecepatan terhadap waktu" : "Velocity over time", yLabel: skenario === "osilasi" && parameter.modeOsilasi === "bandul" ? "ω (rad/s)" : "v (m/s)", values: sampel.map((item) => item.velocity), color: "#8ea7ff" },
    { title: isId ? "Percepatan terhadap waktu" : "Acceleration over time", yLabel: skenario === "osilasi" && parameter.modeOsilasi === "bandul" ? "α (rad/s²)" : "a (m/s²)", values: sampel.map((item) => item.acceleration), color: "#f6bd60" },
  ];
  const model = buatModelMatematika(skenario, parameter, isId);
  const statusEn: Record<string, string> = {
    "Diam: gesekan statis menyeimbangkan komponen horizontal gaya luar.": "At rest: static friction balances the horizontal component of the applied force.",
    "Bergerak: gesekan kinetis melawan arah gerak horizontal.": "In motion: kinetic friction opposes the horizontal direction of motion.",
    "Balok terangkat: komponen vertikal gaya melebihi berat sehingga gaya normal nol.": "The block lifts off: the vertical force component exceeds its weight, so the normal force is zero.",
    "Diam: gesekan statis menyeimbangkan gaya luar.": "At rest: static friction balances the applied force.",
    "Bergerak: gesekan kinetis melawan arah gerak.": "In motion: kinetic friction opposes the direction of motion.",
    "Gerak harmonik teredam: gaya pemulih mengikuti Hukum Hooke dan redaman sebanding kecepatan.": "Damped harmonic motion: the restoring force follows Hooke’s law and damping is proportional to velocity.",
    "Bandul matematis memakai pendekatan sudut kecil (sin θ ≈ θ) dengan redaman viskos ekuivalen.": "The simple pendulum uses the small-angle approximation (sin θ ≈ θ) with equivalent viscous damping.",
  };
  const ubah = <K extends keyof ParameterKurikulumDinamika>(key: K, value: ParameterKurikulumDinamika[K]) => {
    setParameter((previous) => {
      const next = { ...previous, [key]: value };
      if (key === "muStatis" && next.muKinetis > Number(value)) next.muKinetis = Number(value);
      if (key === "muKinetis" && Number(value) > previous.muStatis) next.muKinetis = previous.muStatis;
      return next;
    });
    // Waktu sengaja tidak diubah: keadaan baru dihitung pada t berjalan yang sama.
  };
  const reset = () => {
    setBerjalan(false);
    waktuRef.current = 0;
    setWaktu(0);
    setParameter(PARAMETER_AWAL_KURIKULUM);
    setPengaliKecepatan(1);
    setTanpaBatas(false);
  };

  return (
    <div className="dinamika-skenario-root">
      <section className="workspace dinamika-workspace">
        <DockableControlPanel>
          <aside className="panel control-panel">
            <div className="panel-heading"><div><p className="eyebrow">{isId ? "PENGATURAN EKSPERIMEN" : "EXPERIMENT SETTINGS"}</p><h2>{isId ? "Parameter sistem" : "System parameters"}</h2></div><span className="settings-icon">☷</span></div>
            {skenario === "balok" && <ParameterSlider label={isId ? "Massa balok" : "Block mass"} value={parameter.massa} min={0.5} max={30} step={0.5} unit="kg" onChange={(value) => ubah("massa", value)} />}
            {skenario === "balok" && <>
              <ParameterSlider label={isId ? "Besar gaya luar" : "Applied force magnitude"} value={parameter.gaya} min={0} max={120} step={1} unit="N" onChange={(value) => ubah("gaya", value)} />
              <ParameterSlider label={isId ? "Sudut / arah gaya (θ)" : "Force direction angle (θ)"} value={parameter.sudutGaya} min={0} max={360} step={1} unit="°" onChange={(value) => ubah("sudutGaya", value)} />
              <ParameterSlider label={isId ? "Koefisien gesekan statis (μs)" : "Static friction coefficient (μs)"} value={parameter.muStatis} min={0} max={1.2} step={0.01} unit="—" onChange={(value) => ubah("muStatis", value)} />
              <ParameterSlider label={isId ? "Koefisien gesekan kinetis (μk)" : "Kinetic friction coefficient (μk)"} value={parameter.muKinetis} min={0} max={parameter.muStatis} step={0.01} unit="—" onChange={(value) => ubah("muKinetis", value)} />
            </>}
            {skenario === "osilasi" && <>
              <div className="dinamika-osilasi-switch" role="tablist" aria-label={isId ? "Mode osilasi" : "Oscillation mode"}>
                <button type="button" role="tab" aria-selected={parameter.modeOsilasi === "pegas"} className={parameter.modeOsilasi === "pegas" ? "is-active" : ""} onClick={() => { ubah("modeOsilasi", "pegas"); ubah("amplitudo", 0.45); }}>{isId ? "Pegas redam" : "Damped spring"}</button>
                <button type="button" role="tab" aria-selected={parameter.modeOsilasi === "bandul"} className={parameter.modeOsilasi === "bandul" ? "is-active" : ""} onClick={() => { ubah("modeOsilasi", "bandul"); ubah("amplitudo", 12); }}>{isId ? "Bandul tali" : "Pendulum"}</button>
              </div>
              <ParameterSlider label={isId ? "Massa beban" : "Attached mass"} value={parameter.massa} min={0.2} max={8} step={0.1} unit="kg" onChange={(value) => ubah("massa", value)} />
              {parameter.modeOsilasi === "pegas" && <div className="dinamika-field-group">
                <label className="dinamika-field-label" htmlFor="orientasi-pegas">{isId ? "Orientasi pegas" : "Spring orientation"}</label>
                <select id="orientasi-pegas" className="dinamika-select" value={parameter.orientasiPegas} onChange={(event) => ubah("orientasiPegas", event.target.value as ParameterKurikulumDinamika["orientasiPegas"])}>
                  <option value="horizontal">{isId ? "Horizontal di lantai" : "Horizontal on a surface"}</option>
                  <option value="vertikal">{isId ? "Vertikal menggantung" : "Vertical hanging"}</option>
                </select>
              </div>}
              {parameter.modeOsilasi === "pegas" ? <ParameterSlider label={isId ? "Konstanta pegas (k)" : "Spring constant (k)"} value={parameter.konstantaPegas} min={2} max={60} step={0.5} unit="N/m" onChange={(value) => ubah("konstantaPegas", value)} /> : <>
                <ParameterSlider label={isId ? "Panjang tali (L)" : "String length (L)"} value={parameter.panjangBandul} min={0.3} max={4} step={0.05} unit="m" onChange={(value) => ubah("panjangBandul", value)} />
                <ParameterSlider label={isId ? "Amplitudo sudut awal" : "Initial angular amplitude"} value={parameter.amplitudo} min={1} max={45} step={1} unit="°" onChange={(value) => ubah("amplitudo", value)} />
              </>}
              <ParameterSlider label={isId ? "Rasio redaman (ζ)" : "Damping ratio (ζ)"} value={parameter.redaman} min={0} max={1.5} step={0.01} unit="—" onChange={(value) => ubah("redaman", value)} />
            </>}
            <ParameterSlider label={isId ? "Percepatan gravitasi" : "Gravitational acceleration"} value={parameter.gravitasi} min={1} max={20} step={0.01} unit="m/s²" onChange={(value) => ubah("gravitasi", value)} />
            <div className="control-divider" />
            <p className="dinamika-control-note">{isId ? "Pengubahan parameter menghitung ulang keadaan pada waktu t saat ini. Jam simulasi tidak kembali ke nol; gunakan tombol atur ulang hanya untuk mengawali eksperimen baru." : "Changing a parameter recalculates the state at the current time t. The simulation clock does not reset; use Reset only to begin a new experiment."}</p>
            <button type="button" className="secondary-button full-width" onClick={reset}>{isId ? "↺ Atur ulang eksperimen" : "↺ Reset experiment"}</button>
          </aside>
        </DockableControlPanel>

        <div className="main-column dinamika-skenario-main">
          <section className="panel dinamika-visual-panel">
            <div className="simulation-header">
              <div><p className="eyebrow">{isId ? "VISUALISASI LANGSUNG / HUKUM NEWTON" : "LIVE VISUALIZATION / NEWTON'S LAWS"}</p><h2>{skenario === "balok" ? (isId ? "Balok pada permukaan datar" : "Block on a horizontal surface") : parameter.modeOsilasi === "pegas" ? (isId ? "Osilasi pegas teredam" : "Damped spring oscillation") : (isId ? "Bandul matematis" : "Simple pendulum")}</h2></div>
              <span className="model-badge"><span /> {isId ? "MODEL IDEAL" : "IDEAL MODEL"}</span>
            </div>
            <VisualisasiDinamikaKurikulum skenario={skenario} parameter={parameter} keadaan={keadaan} waktu={waktu} />
            <p className="dinamika-status-line">{isId ? keadaan.status : (statusEn[keadaan.status] ?? "The system state is calculated from the selected physical model.")}</p>
            <KontrolWaktuSimulasi waktu={waktu} durasi={durasi} berjalan={berjalan} pengaliKecepatan={pengaliKecepatan} tanpaBatas={tanpaBatas} onUbahModeWaktu={setTanpaBatas} onUbahDurasi={(nilai) => {
              const berikutnya = Math.max(1, Math.min(60, Math.round(nilai)));
              const waktuBerikutnya = tanpaBatas ? waktuRef.current : Math.min(waktuRef.current, berikutnya);
              setDurasi(berikutnya);
              waktuRef.current = waktuBerikutnya;
              setWaktu(waktuBerikutnya);
              setBerjalan(false);
            }} onUbahWaktu={(value) => { waktuRef.current = value; setWaktu(value); setBerjalan(false); }} onMulaiJeda={() => setBerjalan((value) => !value)} onAturUlang={reset} onUbahKecepatan={setPengaliKecepatan} />
          </section>
          <section className="metrics-grid dinamika-metrics-grid">
            <KartuBesaran label={isId ? "Percepatan resultan" : "Net acceleration"} value={`${keadaan.acceleration.toFixed(3)} m/s²`} ikon="a" aksen="mint" />
            <KartuBesaran label={isId ? "Kecepatan saat ini" : "Current velocity"} value={`${keadaan.velocity.toFixed(3)} ${skenario === "osilasi" && parameter.modeOsilasi === "bandul" ? "rad/s" : "m/s"}`} ikon="v" aksen="blue" />
            <KartuBesaran label={skenario === "osilasi" ? (isId ? "Simpangan saat ini" : "Current displacement") : (isId ? "Gaya normal" : "Normal force")} value={skenario === "osilasi" ? `${keadaan.displacement.toFixed(3)} ${parameter.modeOsilasi === "bandul" ? "rad" : "m"}` : `${keadaan.normalForce.toFixed(2)} N`} ikon="Σ" aksen="amber" />
          </section>
          <section className="analysis-section dinamika-skenario-analysis">
            <div className="analysis-heading"><div><p className="eyebrow">{isId ? "ANALISIS WAKTU NYATA" : "REAL-TIME ANALYSIS"}</p><h2>{isId ? "Grafik besaran fisika" : "Physics graphs"}</h2><p className="section-description">{isId ? "Kurva dihitung dari model skenario dengan parameter terkini." : "Curves are calculated from the scenario model using the current parameters."}</p></div></div>
            <div className="graphs-grid">{grafik.map((item) => <GrafikMini key={item.title} title={item.title} yLabel={item.yLabel} values={item.values} color={item.color} />)}</div>
          </section>
          <ModelMatematika deskripsi={model.deskripsi} persamaan={model.persamaan} variabel={model.variabel} catatan={model.catatan} />
        </div>
      </section>
    </div>
  );
}

export default function DinamikaKurikulumSimulasi({ modulAktif }: { modulAktif: ModulDinamikaId }) {
  const isId = useBahasa() === "id";
  const reduceMotion = useReducedMotion();
  const judul = modulAktif === "newton"
    ? (isId ? "Dinamika Newton" : "Newtonian Dynamics")
    : modulAktif === "osilasi"
      ? (isId ? "Osilasi" : "Oscillations")
      : modulAktif === "atwood"
        ? (isId ? "Katrol Atwood" : "Atwood Machine")
        : (isId ? "Dinamika dalam Lift" : "Elevator Dynamics");

  return (
    <div className="dinamika-page dinamika-kurikulum-page">
      <section className="page-heading">
        <p className="eyebrow">{isId ? "SIMULASI FISIKA / DINAMIKA" : "PHYSICS SIMULATION / DYNAMICS"}</p>
        <div className="page-title-row">
          <div>
            <h1>{judul}</h1>
            <p className="page-description">
              {modulAktif === "newton"
                ? (isId ? "Analisis gaya pada balok tunggal di bidang datar dengan arah gaya yang dapat diatur." : "Analyze forces on a single block on a horizontal surface with an adjustable force direction.")
                : modulAktif === "osilasi"
                      ? (isId ? "Jelajahi pegas teredam dan bandul matematis." : "Explore damped springs and a simple pendulum.")
                  : modulAktif === "atwood"
                    ? (isId ? "Analisis percepatan dan tegangan pada sistem dua massa." : "Analyze acceleration and tension in a two-mass system.")
                    : (isId ? "Amati gaya normal dan berat semu ketika lift bergerak." : "Observe normal force and apparent weight as an elevator moves.")}
            </p>
          </div>
          <span className="module-status"><span /> {isId ? "MODUL AKTIF" : "ACTIVE MODULE"}</span>
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div key={modulAktif} className="dinamika-tab-panel dinamika-kurikulum-content" initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.985, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99, y: -4 }} transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}>
          {modulAktif === "newton" && <DinamikaSkenario skenario="balok" />}
          {modulAktif === "osilasi" && <DinamikaSkenario skenario="osilasi" />}
          {modulAktif === "atwood" && <SistemDinamikaSimulasi initialMode="katrol" />}
          {modulAktif === "lift" && <SistemDinamikaSimulasi initialMode="lift" />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
