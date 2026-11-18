import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { BahasaUI } from "../../components/navigasi/FloatingNavbar";

export type DestinasiMenu = "trivia-kuis" | "simulasi" | "studi-kasus" | "problem-set";

type Props = {
  terbuka: boolean;
  bahasa: BahasaUI;
  onTutup: () => void;
  onPilih: (destinasi: DestinasiMenu) => void;
};

type KartuMenu = {
  id: DestinasiMenu;
  angka: string;
  title: string;
  description: string;
  meta: string;
  art: "trivia" | "simulation" | "case" | "problem";
};

function IlustrasiKartu({ kind }: { kind: KartuMenu["art"] }) {
  if (kind === "trivia") {
    return (
      <svg viewBox="0 0 180 140" aria-hidden="true">
        <path className="art-orbit" d="M25 74C45 12 136 10 155 62c18 48-70 80-111 46C18 92 18 82 25 74Z" />
        <path className="art-dash" d="M36 74 75 44 123 72 148 39" />
        <circle className="art-star" cx="36" cy="74" r="4" /><circle className="art-star" cx="75" cy="44" r="5" /><circle className="art-star" cx="123" cy="72" r="4" /><circle className="art-star" cx="148" cy="39" r="3" />
        <path className="art-spark" d="M77 13v12m-6-6h12M145 100v10m-5-5h10" />
      </svg>
    );
  }
  if (kind === "simulation") {
    return (
      <svg viewBox="0 0 180 140" aria-hidden="true">
        <path className="art-grid" d="M22 28H158M22 58H158M22 88H158M22 118H158M32 18V124M72 18V124M112 18V124M152 18V124" />
        <path className="art-line" d="M23 112c20-2 28-70 50-70s25 45 47 45 22-55 38-64" />
        <circle className="art-dot" cx="73" cy="42" r="5" /><circle className="art-dot" cx="120" cy="87" r="5" />
        <path className="art-axis" d="M20 18v106h142" />
      </svg>
    );
  }
  if (kind === "case") {
    return (
      <svg viewBox="0 0 180 140" aria-hidden="true">
        <path className="art-grid" d="M22 111H160M22 79H160M22 47H160" />
        <path className="art-line" d="M34 105 70 75 104 53 145 30" />
        <path className="art-accent-line" d="M34 105 104 53" />
        <circle className="art-dot" cx="34" cy="105" r="5" /><circle className="art-dot" cx="104" cy="53" r="5" />
        <path className="art-arrow" d="m137 28 9 2-2 9" />
        <rect className="art-object" x="57" y="94" width="35" height="18" rx="4" />
        <circle className="art-wheel" cx="65" cy="115" r="4" /><circle className="art-wheel" cx="84" cy="115" r="4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 180 140" aria-hidden="true">
      <rect className="art-paper" x="48" y="13" width="85" height="111" rx="9" />
      <path className="art-grid" d="M65 42h50M65 60h50M65 78h29M65 96h50" />
      <path className="art-accent-line" d="m102 77 8 8 17-21" />
      <circle className="art-dot" cx="119" cy="28" r="4" />
      <path className="art-spark" d="M34 40v12m-6-6h12M143 96v12m-6-6h12" />
    </svg>
  );
}

function buatKartuMenu(bahasa: BahasaUI): KartuMenu[] {
  return bahasa === "id"
    ? [
        { id: "trivia-kuis", angka: "01", title: "Trivia", description: "Uji intuisi dan konsep dasar mekanika.", meta: "KONSTELASI · ATLAS · KUIS", art: "trivia" },
        { id: "simulasi", angka: "02", title: "Simulasi", description: "Eksperimen virtual dengan dinamika real-time.", meta: "EKSPERIMEN 60 FPS", art: "simulation" },
        { id: "studi-kasus", angka: "03", title: "Studi Kasus", description: "Analisis fenomena fisik dunia nyata.", meta: "DIORAMA LAB", art: "case" },
        { id: "problem-set", angka: "04", title: "Set Soal", description: "Tantangan untuk mengasah logika dan perhitungan.", meta: "50+ LATIHAN TERARAH", art: "problem" },
      ]
    : [
        { id: "trivia-kuis", angka: "01", title: "Trivia", description: "Test your intuition and core mechanics concepts.", meta: "CONSTELLATION · ATLAS · QUIZ", art: "trivia" },
        { id: "simulasi", angka: "02", title: "Simulation", description: "Run virtual experiments with real-time dynamics.", meta: "60 FPS EXPERIMENTS", art: "simulation" },
        { id: "studi-kasus", angka: "03", title: "Case Studies", description: "Explore physics in real-world phenomena.", meta: "ANIMATED LAB DIORAMAS", art: "case" },
        { id: "problem-set", angka: "04", title: "Problem Set", description: "Sharpen your logic through guided challenges.", meta: "50+ GUIDED EXERCISES", art: "problem" },
      ];
}

export default function MenuEksplorasiModal({ terbuka, bahasa, onTutup, onPilih }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [compact, setCompact] = useState(false);
  const reduceMotion = useReducedMotion();
  const kartuMenu = buatKartuMenu(bahasa);

  const tutup = useCallback(() => {
    setExpanded(false);
    onTutup();
  }, [onTutup]);

  const pilih = (destinasi: DestinasiMenu) => {
    setExpanded(false);
    onPilih(destinasi);
  };

  useEffect(() => {
    if (!terbuka) return undefined;
    const timer = window.setTimeout(() => setExpanded(true), reduceMotion ? 0 : 420);
    return () => window.clearTimeout(timer);
  }, [terbuka, reduceMotion]);

  useEffect(() => {
    const sinkronkanUkuran = () => setCompact(window.matchMedia("(max-width: 900px)").matches);
    sinkronkanUkuran();
    window.addEventListener("resize", sinkronkanUkuran);
    return () => window.removeEventListener("resize", sinkronkanUkuran);
  }, []);

  useEffect(() => {
    if (!terbuka) return;
    const sebelumnya = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const tekanEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") tutup();
    };
    window.addEventListener("keydown", tekanEscape);
    return () => {
      document.body.style.overflow = sebelumnya;
      window.removeEventListener("keydown", tekanEscape);
    };
  }, [terbuka, tutup]);

  const introPosisi = compact
    ? { left: "0%", top: "0%", x: "0%", y: "0%" }
    : { left: expanded ? "0%" : "50%", top: "50%", x: expanded ? "0%" : "-50%", y: "-50%" };

  return (
    <AnimatePresence>
      {terbuka && (
        <motion.div
          className="menu-overlay bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.22 } }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onMouseDown={(event: MouseEvent<HTMLDivElement>) => { if (event.target === event.currentTarget) tutup(); }}
        >
          <motion.div
            className={`menu-stage ${expanded ? "menu-stage-expanded" : ""} ${compact ? "menu-stage-compact" : ""}`}
            initial={{ opacity: 0, scale: 0.91, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 170, damping: 23, mass: 0.85 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-hub-title"
          >
            <motion.section
              className="menu-intro-panel"
              animate={introPosisi}
              transition={{ type: "spring", stiffness: 125, damping: 19, mass: 0.95 }}
            >
              <div className="menu-intro-topline">
                <span className="menu-live-dot" />
                PHYSLAB / EXPLORER
              </div>
              <button className="menu-close" type="button" onClick={tutup} aria-label={bahasa === "id" ? "Tutup menu" : "Close menu"}>
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" /></svg>
              </button>
              <div className="menu-intro-copy">
                <span className="menu-kicker">{bahasa === "id" ? "PILIH RUANG EKSPLORASI" : "CHOOSE YOUR SPACE"}</span>
                <h2 id="menu-hub-title">{bahasa === "id" ? <>Ke mana rasa ingin tahumu <em>membawamu?</em></> : <>Where will your curiosity <em>take you?</em></>}</h2>
                <p>{bahasa === "id" ? "Setiap eksperimen dimulai dari satu pertanyaan. Pilih ruang untuk mulai menjelajah." : "Every experiment begins with a question. Choose a space and start exploring."}</p>
              </div>
              <div className="menu-intro-bottom">
                <span>01 — 04</span>
                <span>{bahasa === "id" ? "EMPAT JALUR BELAJAR" : "FOUR LEARNING PATHS"}</span>
              </div>
            </motion.section>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  className="menu-card-grid"
                  initial={{ opacity: 0, x: compact ? 0 : -36, y: compact ? 16 : 0 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  {kartuMenu.map((item, index) => (
                    <motion.button
                      key={item.id}
                      type="button"
                      className={`menu-card menu-card-${item.art} rounded-2xl border border-zinc-800 bg-zinc-900/80`}
                      initial={{ opacity: 0, x: compact ? 0 : -28, y: compact ? 20 : 0, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 190, damping: 20, delay: reduceMotion ? 0 : index * 0.11 }}
                      whileHover={reduceMotion ? undefined : { y: -9, scale: 1.018, transition: { type: "spring", stiffness: 300, damping: 18 } }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => pilih(item.id)}
                    >
                      <span className="menu-card-top"><span>{item.angka} / 04</span><span>↗</span></span>
                      <span className="menu-card-art"><IlustrasiKartu kind={item.art} /></span>
                      <span className="menu-card-copy">
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                      </span>
                      <span className="menu-card-bottom"><span>{item.meta}</span><b>↗</b></span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
