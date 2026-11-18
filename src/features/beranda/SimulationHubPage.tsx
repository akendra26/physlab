import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { BahasaUI } from "../../components/navigasi/FloatingNavbar";
import type { ModulDinamikaId, ModulKinematikaId } from "../../config/konfigurasiNavigasi";
import "./SimulationHubPage.css";

type Stage =
  | { id: ModulKinematikaId; category: "kinematika"; number: string; symbol: string; title: string; titleEn: string; description: string; descriptionEn: string; target: string; targetEn: string; tags: string }
  | { id: ModulDinamikaId; category: "dinamika"; number: string; symbol: string; title: string; titleEn: string; description: string; descriptionEn: string; target: string; targetEn: string; tags: string };

type Props = {
  bahasa: BahasaUI;
  onMulai: (category: "kinematika", id: ModulKinematikaId) => void;
  onMulaiDinamika: (category: "dinamika", id: ModulDinamikaId) => void;
};

const STAGES: Stage[] = [
  { id: "glb", category: "kinematika", number: "01", symbol: "→", title: "Gerak Lurus Beraturan", titleEn: "Uniform Linear Motion", description: "Amati gerak pada lintasan lurus dengan kecepatan konstan.", descriptionEn: "Observe motion along a straight path at constant velocity.", target: "Buktikan bahwa percepatan bernilai nol saat kecepatan tetap.", targetEn: "Verify that acceleration is zero when velocity is constant.", tags: "GLB" },
  { id: "glbb", category: "kinematika", number: "02", symbol: "⇢", title: "Gerak Lurus Berubah Beraturan", titleEn: "Uniformly Accelerated Motion", description: "Ubah kecepatan awal dan percepatan untuk mempelajari gerak lurus.", descriptionEn: "Adjust initial velocity and acceleration to study linear motion.", target: "Bandingkan grafik posisi, kecepatan, dan percepatan.", targetEn: "Compare position, velocity, and acceleration graphs.", tags: "GLBB" },
  { id: "parabola", category: "kinematika", number: "03", symbol: "⌁", title: "Gerak Parabola", titleEn: "Projectile Motion", description: "Ubah sudut dan kecepatan awal untuk mengamati lintasan proyektil.", descriptionEn: "Adjust launch angle and initial speed to observe a projectile trajectory.", target: "Temukan jangkauan, tinggi maksimum, dan waktu tempuh.", targetEn: "Determine range, maximum height, and flight time.", tags: "2D · VEKTOR" },
  { id: "vertikal", category: "kinematika", number: "04", symbol: "↧", title: "Gerak Jatuh Bebas", titleEn: "Free Fall", description: "Amati benda yang jatuh karena pengaruh gravitasi.", descriptionEn: "Observe an object falling under the influence of gravity.", target: "Analisis hubungan ketinggian, waktu, dan kecepatan jatuh.", targetEn: "Analyze the relationship between height, time, and falling speed.", tags: "GJB" },
  { id: "newton", category: "dinamika", number: "01", symbol: "ΣF", title: "Dinamika Newton", titleEn: "Newtonian Dynamics", description: "Analisis balok tunggal dengan gaya dorong dan sudut gaya.", descriptionEn: "Analyze a single block with an applied force and force angle.", target: "Uraikan gaya ke sumbu X–Y dan tentukan percepatan.", targetEn: "Resolve forces into X–Y components and determine acceleration.", tags: "HUKUM NEWTON · VEKTOR" },
  { id: "osilasi", category: "dinamika", number: "02", symbol: "∿", title: "Osilasi", titleEn: "Oscillations", description: "Jelajahi gerak harmonik pada sistem pegas teredam dan bandul matematis.", descriptionEn: "Explore harmonic motion in damped spring systems and a simple pendulum.", target: "Amati pengaruh massa, konstanta pegas, panjang tali, dan redaman terhadap periode.", targetEn: "Observe how mass, spring constant, string length, and damping affect the period.", tags: "PEGAS · BANDUL" },
  { id: "atwood", category: "dinamika", number: "03", symbol: "⚙", title: "Katrol Atwood", titleEn: "Atwood Machine", description: "Amati dua massa yang terhubung tali melalui katrol ideal.", descriptionEn: "Observe two masses connected by a string over an ideal pulley.", target: "Ukur percepatan sistem dan tegangan tali dari perbedaan massa.", targetEn: "Measure system acceleration and string tension from the mass difference.", tags: "KATROL · TEGANGAN" },
  { id: "lift", category: "dinamika", number: "04", symbol: "↕", title: "Lift", titleEn: "Elevator Dynamics", description: "Pelajari perubahan gaya normal saat lift bergerak naik, turun, dan berhenti.", descriptionEn: "Study changes in normal force as an elevator accelerates upward, downward, and stops.", target: "Bandingkan berat semu dengan percepatan lift.", targetEn: "Compare apparent weight with elevator acceleration.", tags: "GAYA NORMAL · PERCEPATAN" },
];

export default function SimulationHubPage({ bahasa, onMulai, onMulaiDinamika }: Props) {
  const [selected, setSelected] = useState<Stage | null>(null);
  const reduceMotion = useReducedMotion();
  const isId = bahasa === "id";
  const stageName = (stage: Stage) => isId ? stage.title : stage.titleEn;

  useEffect(() => {
    if (!selected) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  const mulai = () => {
    if (!selected) return;
    const stage = selected;
    setSelected(null);
    if (stage.category === "kinematika") onMulai("kinematika", stage.id);
    else onMulaiDinamika("dinamika", stage.id);
  };

  return (
    <div className="simulation-hub-page">
      <div className="simulation-hub-stars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <header className="simulation-hub-heading">
        <div>
          <span className="simulation-hub-kicker">PHYSLAB / {isId ? "PILIH MISI" : "STAGE SELECT"}</span>
          <h1>{isId ? "Pilih eksperimenmu." : "Choose your experiment."}</h1>
          <p>{isId ? "Pilih lencana untuk melihat tujuan eksperimen dan mulai menjelajah." : "Select a badge to preview its experiment goals and begin exploring."}</p>
        </div>
        <div className="simulation-hub-index"><span>08</span><i />{isId ? "RUANG SIMULASI" : "SIMULATION STAGES"}</div>
      </header>

      <section className="simulation-stage-section" aria-labelledby="stage-kinematics-title">
        <div className="simulation-stage-section-heading"><span>01</span><div><h2 id="stage-kinematics-title">{isId ? "Kinematika" : "Kinematics"}</h2><p>{isId ? "Gerak tanpa meninjau penyebabnya." : "Motion without examining its causes."}</p></div><b>04 {isId ? "MODUL" : "STAGES"}</b></div>
        <div className="simulation-stage-grid">
          {STAGES.filter((stage) => stage.category === "kinematika").map((stage) => (
            <motion.button key={stage.id} type="button" className="simulation-stage-badge" onClick={() => setSelected(stage)} whileHover={reduceMotion ? undefined : { y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <span className="stage-badge-top"><span>{stage.number}</span><i>↗</i></span>
              <span className="stage-badge-symbol">{stage.symbol}</span>
              <strong>{stageName(stage)}</strong>
              <span className="stage-badge-meta">{stage.tags}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="simulation-stage-section" aria-labelledby="stage-dynamics-title">
        <div className="simulation-stage-section-heading"><span>02</span><div><h2 id="stage-dynamics-title">{isId ? "Dinamika" : "Dynamics"}</h2><p>{isId ? "Gaya sebagai penyebab perubahan gerak." : "Forces as causes of changes in motion."}</p></div><b>04 {isId ? "MODUL" : "STAGES"}</b></div>
        <div className="simulation-stage-grid simulation-stage-grid-dynamics">
          {STAGES.filter((stage) => stage.category === "dinamika").map((stage) => (
            <motion.button key={stage.id} type="button" className="simulation-stage-badge" onClick={() => setSelected(stage)} whileHover={reduceMotion ? undefined : { y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <span className="stage-badge-top"><span>{stage.number}</span><i>↗</i></span>
              <span className="stage-badge-symbol">{stage.symbol}</span>
              <strong>{stageName(stage)}</strong>
              <span className="stage-badge-meta">{stage.tags}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div className="stage-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
            <motion.section className="stage-modal-card" role="dialog" aria-modal="true" aria-labelledby="stage-modal-title" initial={{ opacity: 0, scale: .82, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .92, y: 16 }} transition={{ type: "spring", stiffness: 210, damping: 23 }}>
              <button type="button" className="stage-modal-close" onClick={() => setSelected(null)} aria-label={isId ? "Tutup" : "Close"}>×</button>
              <div className="stage-modal-emblem"><span>{selected.symbol}</span><i /><b /></div>
              <span className="stage-modal-kicker">PHYSLAB / {selected.number} · {isId ? "RINGKASAN MISI" : "MISSION BRIEF"}</span>
              <h2 id="stage-modal-title">{stageName(selected)}</h2>
              <p className="stage-modal-description">{isId ? selected.description : selected.descriptionEn}</p>
              <div className="stage-modal-target"><span>{isId ? "TARGET EKSPERIMEN" : "EXPERIMENT GOAL"}</span><p>{isId ? selected.target : selected.targetEn}</p></div>
              <div className="stage-modal-time">
                <span>{isId ? "MODE WAKTU" : "TIME MODE"}</span>
                <div><span><i />{isId ? "Durasi terbatas · 1–60 detik" : "Timed · 1–60 seconds"}</span><span><i />{isId ? "Tanpa batas" : "Unlimited"}</span></div>
              </div>
              <button type="button" className="stage-modal-start" onClick={mulai}>{isId ? "Mulai Simulasi" : "Start Simulation"}<span>↗</span></button>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
