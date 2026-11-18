import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import type { ShinkaiTheme } from "../../theme/shinkai";

type Props = { theme: ShinkaiTheme };

const BINTANG = Array.from({ length: 34 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 53 + 7) % 100}%`,
  delay: `${-((index * 7) % 9)}s`,
  size: `${index % 7 === 0 ? 3 : 1 + (index % 2)}px`,
}));

const METEOR = Array.from({ length: 7 }, (_, index) => ({
  left: `${10 + ((index * 17) % 82)}%`,
  top: `${5 + ((index * 13) % 55)}%`,
  delay: `${-((index * 5) % 17)}s`,
  duration: `${7 + (index % 4) * 2}s`,
}));

const HUJAN = Array.from({ length: 46 }, (_, index) => ({
  left: `${(index * 23 + 3) % 100}%`,
  top: `${(index * 31 + 9) % 110 - 10}%`,
  delay: `${-((index * 11) % 5)}s`,
  duration: `${1.5 + (index % 5) * 0.37}s`,
  height: `${24 + (index % 5) * 12}px`,
}));

const SAKURA = Array.from({ length: 24 }, (_, index) => ({
  left: `${(index * 19 + 6) % 100}%`,
  delay: `${-((index * 3) % 14)}s`,
  duration: `${11 + (index % 5) * 2}s`,
  size: `${7 + (index % 4) * 2}px`,
  drift: `${-45 + ((index * 29) % 100)}px`,
}));

function TwilightScene() {
  return (
    <div className="shinkai-scene scene-twilight" aria-hidden="true">
      <div className="shinkai-nebula nebula-one" />
      <div className="shinkai-nebula nebula-two" />
      <div className="shinkai-starfield">
        {BINTANG.map((star, index) => <i key={index} style={{ left: star.left, top: star.top, animationDelay: star.delay, width: star.size, height: star.size }} />)}
      </div>
      <div className="shinkai-meteors">
        {METEOR.map((meteor, index) => <i key={index} style={{ left: meteor.left, top: meteor.top, animationDelay: meteor.delay, animationDuration: meteor.duration }} />)}
      </div>
    </div>
  );
}

function RainScene() {
  return (
    <div className="shinkai-scene scene-rain" aria-hidden="true">
      <div className="rain-glow rain-glow-one" /><div className="rain-glow rain-glow-two" />
      <div className="rain-lines">
        {HUJAN.map((drop, index) => <i key={index} style={{ left: drop.left, top: drop.top, animationDelay: drop.delay, animationDuration: drop.duration, height: drop.height }} />)}
      </div>
      <div className="rain-horizon" />
    </div>
  );
}

function CumulusScene() {
  return (
    <div className="shinkai-scene scene-cumulus" aria-hidden="true">
      <div className="cumulus-sun" />
      <div className="cumulus-beams"><i /><i /><i /><i /></div>
      <div className="cumulus-cloud cloud-back" /><div className="cumulus-cloud cloud-front" />
      <div className="cumulus-haze" />
    </div>
  );
}

function SakuraScene() {
  return (
    <div className="shinkai-scene scene-sakura" aria-hidden="true">
      <div className="sakura-moon-glow" />
      <div className="sakura-petals">
        {SAKURA.map((petal, index) => {
          const style = {
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            width: petal.size,
            height: `${Number.parseInt(petal.size, 10) * 0.68}px`,
            "--petal-drift": petal.drift,
          } as CSSProperties;
          return <i key={index} style={style} />;
        })}
      </div>
      <div className="sakura-horizon" />
    </div>
  );
}

export default function ThemeBackdrop({ theme }: Props) {
  const reduceMotion = useReducedMotion();
  const scene = {
    "twilight-comet": <TwilightScene />,
    "garden-rain": <RainScene />,
    "golden-cumulus": <CumulusScene />,
    "sakura-breeze": <SakuraScene />,
  }[theme];

  return (
    <div className="shinkai-backdrop" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          className="shinkai-scene-transition"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {scene}
        </motion.div>
      </AnimatePresence>
      <div className="shinkai-global-vignette" />
    </div>
  );
}
