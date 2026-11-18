import { motion, useReducedMotion } from "motion/react";

type Props = { moving: boolean; travelled?: boolean; failed: boolean };

/** Teak harvest cart. The cart translates along the track; its wheels stay rotationally static. */
export default function CivilizationCart({ moving, travelled = moving, failed }: Props) {
  const reduced = useReducedMotion();
  const cargoMotion = moving && !reduced
    ? { y: [0, -1.8, 0, 1, 0], rotate: [0, -0.55, 0, 0.35, 0] }
    : { y: 0, rotate: 0 };

  return (
    <motion.svg
      className={`cv-cart-art${failed ? " is-failed" : ""}`}
      viewBox="0 0 250 164"
      role="img"
      aria-label="Teak wooden harvest cart with iron corner braces, static spoked wheels and gently oscillating cargo"
      initial={false}
      animate={{ x: travelled ? (failed ? -14 : 84) : 0, rotate: failed ? -1.2 : 0 }}
      transition={{ x: { duration: 1.45, ease: [0.22, 1, 0.36, 1] }, rotate: { duration: .5 } }}
    >
      <defs>
        <linearGradient id="cv-cart-wood" x1="0" y1="0" x2="0.9" y2="1"><stop stopColor="#d6a477"/><stop offset=".34" stopColor="#a8734e"/><stop offset=".72" stopColor="#805239"/><stop offset="1" stopColor="#50372e"/></linearGradient>
        <linearGradient id="cv-cart-wood-edge" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d3a477"/><stop offset="1" stopColor="#68432f"/></linearGradient>
        <linearGradient id="cv-cart-iron" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e0e3e4"/><stop offset=".42" stopColor="#78818a"/><stop offset="1" stopColor="#303945"/></linearGradient>
        <linearGradient id="cv-sack" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e1c69e"/><stop offset=".55" stopColor="#b4936b"/><stop offset="1" stopColor="#816447"/></linearGradient>
        <linearGradient id="cv-crate" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d2a06e"/><stop offset="1" stopColor="#765039"/></linearGradient>
        <pattern id="cv-wood-grain" width="42" height="18" patternUnits="userSpaceOnUse"><path d="M0 5 Q12 1 22 5 T42 4 M-5 13 Q8 10 20 13 T45 12" fill="none" stroke="#f0c293" strokeOpacity=".3" strokeWidth=".8"/><path d="M3 9 Q14 7 24 9" fill="none" stroke="#51392d" strokeOpacity=".28" strokeWidth=".7"/></pattern>
      </defs>

      {/* Solid timber draw handle remains part of the cart model; no character or rope is attached. */}
      <path d="M36 91 L5 68 Q1 65 4 60 L10 56 L47 81" fill="none" stroke="#68452f" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 61 L17 68" stroke="#d7ad80" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M7 57 L13 52" stroke="url(#cv-cart-iron)" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M31 86 L43 94" stroke="#d3a477" strokeWidth="2" opacity=".8"/>

      {/* Chassis and axle. */}
      <path d="M31 91 L222 91 L231 106 L29 106Z" fill="#43332d" stroke="#241f20" strokeWidth="2"/>
      <path d="M43 101 H215" stroke="#d3a477" strokeWidth="4"/>
      <path d="M57 103 L50 119 M201 103 L210 119" stroke="url(#cv-cart-iron)" strokeWidth="8" strokeLinecap="round"/>
      <path d="M45 110 H215" stroke="#171e28" strokeWidth="2" opacity=".75"/>

      {/* Classic wooden spoke wheels. Spokes are fixed: no intrinsic wheel rotation. */}
      {[70, 190].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="130" r="27" fill="#322a27" stroke="#d0a06f" strokeWidth="5"/>
          <circle cx={cx} cy="130" r="23.5" fill="none" stroke="#6f4934" strokeWidth="2"/>
          <g>
            {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${cx} 130 L${cx + 22 * Math.cos(i * Math.PI / 5)} ${130 + 22 * Math.sin(i * Math.PI / 5)}`} stroke="#c28d5c" strokeWidth="3.5" strokeLinecap="round"/>)}
            <circle cx={cx} cy="130" r="6" fill="url(#cv-cart-iron)" stroke="#403b39" strokeWidth="2"/>
            <circle cx={cx} cy="130" r="2" fill="#e6c49b"/>
          </g>
          <circle cx={cx} cy="130" r="29.5" fill="none" stroke="#252b32" strokeWidth="2.2"/>
          <path d={`M${cx-17} 111 Q${cx} 104 ${cx+17} 111`} fill="none" stroke="#e0b98e" strokeWidth="1.2" opacity=".7"/>
        </g>
      ))}

      {/* Teak bed with layered boards and fine natural grain. */}
      <path d="M31 52 Q34 45 43 45 H213 Q223 45 225 54 L219 96 H39Z" fill="url(#cv-cart-wood)" stroke="#3b2d28" strokeWidth="4"/>
      <path d="M38 53 H220 V94 H38Z" fill="url(#cv-wood-grain)" opacity=".9"/>
      {[0, 1, 2, 3].map(i => <path key={i} d={`M${40+i} ${57+i*9} Q105 ${53+i*9} 217 ${58+i*9}`} fill="none" stroke={i % 2 ? "#e0b184" : "#51382c"} strokeWidth="1.8" opacity=".72"/>)}
      <path d="M42 48 L42 91 M214 49 L214 92" stroke="url(#cv-cart-wood-edge)" strokeWidth="5"/>
      <path d="M47 51 Q116 45 211 51 M47 91 Q126 96 211 91" fill="none" stroke="#e2b98d" strokeWidth="1.4" opacity=".7"/>

      {/* Iron corner guards, diagonal braces and visible rivets on every corner. */}
      <path d="M32 46 H50 V65 H32Z M207 46 H225 V65 H207Z M32 82 H50 V100 H32Z M207 82 H225 V100 H207Z" fill="url(#cv-cart-iron)" stroke="#242d38" strokeWidth="1.7"/>
      <path d="M35 49 L47 62 M210 49 L222 62 M35 85 L47 97 M210 85 L222 97" stroke="#e2e5e5" strokeWidth="2" opacity=".75"/>
      {[[37,51],[45,61],[212,51],[220,61],[37,87],[45,96],[212,87],[220,96]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="2.5" fill="#202833"/><circle cx={x-.5} cy={y-.5} r="1" fill="#f1e3d0"/></g>)}

      {/* Cargo follows the cart's small periodic vertical and angular vibration. */}
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "125px 45px" }}
        animate={cargoMotion}
        transition={moving && !reduced ? { duration: .72, repeat: Infinity, ease: "easeInOut" } : { duration: .25 }}
      >
        <path d="M57 44 Q49 31 58 18 Q70 8 84 17 L92 43 Q78 52 57 44Z" fill="url(#cv-sack)" stroke="#705941" strokeWidth="2"/>
        <path d="M59 20 Q72 26 86 18 M57 27 Q74 34 89 26 M61 36 Q76 42 90 35 M62 42 Q75 46 87 41" fill="none" stroke="#f0d7b2" strokeWidth="1.2" strokeDasharray="2 2"/>
        <path d="M63 16 Q72 10 82 15" fill="none" stroke="#6b5542" strokeWidth="3"/>
        <path d="M94 42 L100 17 Q104 10 116 13 L132 20 L135 45 L112 51Z" fill="url(#cv-crate)" stroke="#533d31" strokeWidth="2.5"/>
        <path d="M99 23 L131 28 M97 34 L134 39 M111 15 L112 48" stroke="#e6bd8c" strokeWidth="2" opacity=".8"/>
        <path d="M140 45 Q132 31 143 18 Q155 8 170 17 L181 44 Q160 52 140 45Z" fill="url(#cv-sack)" stroke="#6f5944" strokeWidth="2"/>
        <path d="M143 20 Q160 28 175 19 M142 31 Q161 38 178 30 M147 40 Q164 46 179 39" fill="none" stroke="#f0d7b2" strokeWidth="1.2" strokeDasharray="2 2"/>
        <path d="M147 15 Q160 10 171 16" fill="none" stroke="#6b5542" strokeWidth="3"/>
      </motion.g>
      <path d="M226 63 L235 67 L232 78 L222 75Z" fill="#d86f57" stroke="#563b35" strokeWidth="2"/>
      <path d="M30 110 H226" stroke="#d0a078" strokeWidth="2" opacity=".6"/>
    </motion.svg>
  );
}
