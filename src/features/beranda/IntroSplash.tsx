import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { BahasaUI } from "../../components/navigasi/FloatingNavbar";
import "./IntroSplash.css";

type Props = { visible: boolean; bahasa?: BahasaUI };

const SPARKLES = [
  { x: 18, y: 28, delay: 0.12, size: 5 },
  { x: 76, y: 24, delay: 0.32, size: 4 },
  { x: 68, y: 72, delay: 0.48, size: 6 },
  { x: 24, y: 70, delay: 0.22, size: 4 },
  { x: 50, y: 18, delay: 0.4, size: 3 },
  { x: 87, y: 54, delay: 0.56, size: 4 },
  { x: 11, y: 52, delay: 0.36, size: 3 },
  { x: 42, y: 84, delay: 0.18, size: 4 },
];

export default function IntroSplash({ visible, bahasa = "id" }: Props) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.48;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-splash intro-fade-zoom"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.975 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.025 }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          aria-label={bahasa === "id" ? "Pembuka PhysLAB" : "PhysLAB introduction"}
          role="status"
          aria-live="polite"
        >
          <div className="intro-fade-glow" aria-hidden="true" />
          <div className="intro-sparkle-field" aria-hidden="true">
            {SPARKLES.map((item, index) => (
              <motion.i
                key={index}
                style={{ left: `${item.x}%`, top: `${item.y}%`, width: item.size, height: item.size }}
                initial={reduceMotion ? { opacity: 0.5 } : { opacity: 0, scale: 0.25, rotate: -35 }}
                animate={reduceMotion ? { opacity: 0.5 } : { opacity: [0, 0.85, 0.35], scale: [0.25, 1.15, 0.8], rotate: [0, 45, 90] }}
                transition={{ duration: reduceMotion ? 0 : 1.15, delay: reduceMotion ? 0 : item.delay, repeat: reduceMotion ? 0 : Infinity, repeatType: "reverse", ease: "easeInOut" }}
              />
            ))}
          </div>
          <motion.div
            className="intro-splash-lockup"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.68, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="intro-splash-orbit" aria-hidden="true"><i /><b /></span>
            <span>Phys<span>LAB</span></span>
          </motion.div>
          <motion.p
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.3 }}
          >
            {bahasa === "id" ? "Ruang untuk menjelajahi semesta fisika." : "A space to explore the universe of physics."}
          </motion.p>
          <motion.span
            className="intro-fade-progress"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : 0.12, ease: "easeInOut" }}
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
