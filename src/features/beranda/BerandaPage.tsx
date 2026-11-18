import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BahasaUI } from "../../components/navigasi/FloatingNavbar";
import { KUTIPAN_ILMUWAN } from "./quotes";

type Props = {
  bahasa: BahasaUI;
  kunjunganBeranda: number;
  onMulai: () => void;
  onJelajahi: () => void;
};

const LABEL = {
  id: {
    eyebrow: "RUANG EKSPLORASI FISIKA",
    headline: "Fisika, tanpa batas.",
    description: "Jelajahi hukum gerak, gaya, dan keseimbangan melalui eksperimen virtual yang bisa kamu kendalikan sendiri.",
    start: "Mulai",
    explore: "Jelajahi",
    scroll: "GULIR UNTUK MENJELAJAH",
    footnote: "EKSPERIMEN INTERAKTIF · MODEL FISIKA · RASA INGIN TAHU",
  },
  en: {
    eyebrow: "A REALM OF PHYSICS EXPLORATION",
    headline: "Physics, without limits.",
    description: "Explore motion, forces, and equilibrium through virtual experiments you can control yourself.",
    start: "Start",
    explore: "Explore",
    scroll: "SCROLL TO EXPLORE",
    footnote: "INTERACTIVE EXPERIMENTS · PHYSICS MODELS · CURIOSITY",
  },
} as const;

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M6 5h9v9" /></svg>
  );
}

function HeroBackdrop() {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="hero-grid-lines" />
      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />
      <div className="hero-cross hero-cross-one">+</div>
      <div className="hero-cross hero-cross-two">+</div>
      <div className="hero-cross hero-cross-three">+</div>
      <div className="hero-coordinate hero-coordinate-one">x(t) = x₀ + vt</div>
      <div className="hero-coordinate hero-coordinate-two">ΣF = ma</div>
      <div className="hero-spark hero-spark-one" />
      <div className="hero-spark hero-spark-two" />
      <div className="hero-spark hero-spark-three" />
    </div>
  );
}

export default function BerandaPage({ bahasa, kunjunganBeranda, onMulai, onJelajahi }: Props) {
  const text = LABEL[bahasa];
  const reduceMotion = useReducedMotion();
  const kutipan = useMemo(
    () => KUTIPAN_ILMUWAN[kunjunganBeranda % KUTIPAN_ILMUWAN.length],
    [kunjunganBeranda],
  );

  const masuk = reduceMotion
    ? { initial: false as const, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="home-page home-page-minimal">
      <section className="home-hero home-hero-minimal" aria-labelledby="home-title">
        <HeroBackdrop />
        <div className="hero-content-minimal">
          <motion.div
            className="hero-eyebrow-minimal"
            {...masuk}
            transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow-line" />
            <span>{text.eyebrow}</span>
            <span className="eyebrow-line" />
          </motion.div>

          <motion.h1
            id="home-title"
            className="hero-wordmark"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.78, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            Phys<span>LAB</span><i className="hero-wordmark-dot" />
          </motion.h1>

          <motion.h2
            className="hero-tagline"
            {...masuk}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            {text.headline}
          </motion.h2>

          <motion.p
            className="hero-description-minimal"
            {...masuk}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.23, ease: [0.22, 1, 0.36, 1] }}
          >
            {text.description}
          </motion.p>

          <motion.div
            className="hero-quote-card"
            key={kutipan.id}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.28 }}
          >
            <blockquote>
              “{kutipan.quote}” <cite>— {kutipan.author}</cite>
            </blockquote>
          </motion.div>

          <motion.div
            className="hero-actions-minimal"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.62, delay: reduceMotion ? 0 : 0.37, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className="hero-cta hero-cta-primary" type="button" onClick={onMulai}>
              <span>{text.start}</span><ArrowUpRight />
            </button>
            <button className="hero-cta hero-cta-secondary" type="button" onClick={onJelajahi}>
              <span>{text.explore}</span><span className="hero-cta-arrow">→</span>
            </button>
          </motion.div>

          <motion.div
            className="hero-bottomline"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.6 }}
          >
            <span><i />{text.footnote}</span>
            <span className="hero-index">01 <b>/</b> 04</span>
          </motion.div>
        </div>

        <div className="hero-scroll-cue-minimal" aria-hidden="true">
          <span />{text.scroll}<span className="scroll-line" />
        </div>
      </section>

      <footer className="home-footer-minimal">
        <span>PHYSLAB <i /> {bahasa === "id" ? "LABORATORIUM FISIKA INTERAKTIF" : "INTERACTIVE PHYSICS LABORATORY"}</span>
        <span>© {new Date().getFullYear()} PHYSLAB · EXPLORE THE LAWS OF MOTION</span>
      </footer>
    </div>
  );
}
