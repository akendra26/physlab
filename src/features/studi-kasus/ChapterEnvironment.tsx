import { motion } from "motion/react";

type Props = { chapter: number };

/** Four authored vector environments. SVG scales cleanly at every viewport size. */
export default function ChapterEnvironment({ chapter }: Props) {
  return (
    <svg className={`cv-environment-art cv-environment-${chapter}`} viewBox="0 0 800 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="cv-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#263653"/><stop offset=".48" stopColor="#b87975"/><stop offset=".76" stopColor="#e89973"/><stop offset="1" stopColor="#efb18e"/></linearGradient>
        <linearGradient id="cv-ground-grad" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#77704f"/><stop offset="1" stopColor="#252c35"/></linearGradient>
        <linearGradient id="cv-river" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#8bd0d0"/><stop offset=".45" stopColor="#4c9da9"/><stop offset="1" stopColor="#234c68"/></linearGradient>
        <linearGradient id="cv-pine-light" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d6bd91" stopOpacity=".7"/><stop offset="1" stopColor="#e89973" stopOpacity="0"/></linearGradient>
        <linearGradient id="cv-market-cloth" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e7b08c"/><stop offset="1" stopColor="#985b58"/></linearGradient>
        <filter id="cv-soft-glow"><feGaussianBlur stdDeviation="15"/></filter>
      </defs>
      <rect width="800" height="380" fill="url(#cv-sky)"/>
      <circle cx="625" cy="91" r="58" fill="#e89973" opacity=".24" filter="url(#cv-soft-glow)"/>
      <circle cx="625" cy="91" r="49" fill="#ffd6ad" opacity=".45" filter="url(#cv-soft-glow)"/>
      <circle cx="625" cy="91" r="27" fill="#ffe2bf" opacity=".72"/>
      <path d="M0 135 Q115 90 225 128 T445 124 T800 115 V240 H0Z" fill="#d99a89" opacity=".13"/>
      {chapter === 0 && <>
        {/* Citarik village: layered mountain silhouettes and rice terraces. */}
        <path d="M0 204 L105 117 185 169 292 93 405 171 520 111 650 166 735 105 800 152 V280 H0Z" fill="#536b69" opacity=".9"/>
        <path d="M0 225 Q130 168 250 215 T500 205 T800 196 V310 H0Z" fill="#71846a"/>
        <path d="M0 255 Q140 208 278 248 T560 235 T800 228 V380 H0Z" fill="#a1a36b"/>
        <path d="M0 282 Q150 244 300 276 T590 267 T800 258" fill="none" stroke="#d4c17d" strokeWidth="5" opacity=".8"/>
        <path d="M0 315 Q150 278 310 309 T610 301 T800 290" fill="none" stroke="#d5c47d" strokeWidth="4" opacity=".65"/>
        <g fill="#344c43"><path d="M80 205 l22 -43 22 43Z M95 207 l7 -63 7 63Z"/><path d="M710 211 l24 -49 24 49Z M728 213 l6 -69 7 69Z"/></g>
        <g fill="#554a4a"><path d="M170 218 l0 -28 30 -22 32 22 v28Z M225 218 l0 -22 24 -18 25 18 v22Z"/><path d="M168 190 l32 -24 34 24Z M223 196 l26 -20 27 20Z" fill="#8f5550"/></g>
        <path d="M0 336 Q175 302 360 336 T800 322 V380 H0Z" fill="#4e6948"/>
        <path d="M0 351 Q180 323 355 351 T800 339" fill="none" stroke="#c5bd77" strokeWidth="3" opacity=".7"/>
      </>}
      {chapter === 1 && <>
        {/* Pine forest climb: steep stone trail and warm god rays. */}
        <path d="M0 240 L150 177 275 203 420 115 560 165 800 80 V380 H0Z" fill="#354e4b"/>
        <path d="M0 260 L170 196 320 230 480 142 650 178 800 118 V380 H0Z" fill="#58705b"/>
        <path d="M0 380 L0 300 Q170 280 330 224 Q505 164 800 145 V380Z" fill="#4c4d46"/>
        <path d="M0 380 Q180 325 360 255 Q560 185 800 165" fill="none" stroke="#9b8a70" strokeWidth="35" opacity=".55"/>
        <path d="M0 380 Q180 325 360 255 Q560 185 800 165" fill="none" stroke="#c3a984" strokeWidth="2" strokeDasharray="9 15" opacity=".65"/>
        {Array.from({length:9},(_,i)=><g key={i} transform={`translate(${i*105-30} ${i%2?28:62})`}><path d="M28 150 L0 64 18 70 3 35 25 47 30 0 38 46 62 32 47 72 70 62 40 150Z" fill={i%2?"#203c37":"#29443b"}/><path d="M30 150 V190" stroke="#493d35" strokeWidth="10"/></g>)}
        <path d="M475 0 L535 0 345 285 300 285Z M600 0 L640 0 455 245 420 245Z M700 0 L735 0 595 215 565 215Z" fill="url(#cv-pine-light)" opacity=".65"/>
        <g fill="#a9a093" opacity=".9"><path d="M85 330 l22 -17 17 9 -13 20Z M255 288 l19 -14 18 8 -8 17Z M540 221 l18 -13 20 7 -11 17Z M675 204 l20 -12 15 10 -12 14Z"/></g>
      </>}
      {chapter === 2 && <>
        {/* Village market / distribution depot with timber pulley frame. */}
        <path d="M0 215 Q170 180 340 205 T800 188 V380 H0Z" fill="#596052"/>
        <path d="M0 280 H800 V380 H0Z" fill="#6e5948"/>
        <g>
          <path d="M45 205 V105 H265 V205" fill="#4a3c38" stroke="#d2a47e" strokeWidth="8"/>
          <path d="M25 110 L155 34 285 110Z" fill="url(#cv-market-cloth)" stroke="#6d4646" strokeWidth="5"/>
          <path d="M25 110 Q155 139 285 110 L268 128 Q155 155 42 128Z" fill="#e7b08c"/>
          <path d="M320 218 V120 H535 V218" fill="#56443c" stroke="#d2a47e" strokeWidth="8"/>
          <path d="M300 124 L425 53 555 124Z" fill="#6f8290" stroke="#394c5b" strokeWidth="5"/>
          <path d="M300 124 Q425 148 555 124 L540 143 Q425 164 315 143Z" fill="#9cb0b8"/>
        </g>
        {/* Pulley support and hanging rope. */}
        <path d="M620 82 V278 M744 82 V278 M605 82 H759 M622 82 L744 278 M744 82 L622 278" stroke="#6b4d3a" strokeWidth="12" strokeLinecap="round"/>
        <circle cx="682" cy="96" r="22" fill="#c89a69" stroke="#4a352e" strokeWidth="7"/><circle cx="682" cy="96" r="6" fill="#453b36"/>
        <path d="M682 73 V28 Q682 18 692 18 H704" fill="none" stroke="#d6b18b" strokeWidth="4"/>
        <path d="M682 118 V210" stroke="#d6b18b" strokeWidth="3"/>
        {/* Stacked wooden crates. */}
        {[[70,254],[130,254],[100,205],[570,264],[630,264],[600,214]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><rect width="52" height="42" rx="2" fill={i%2?"#9c704d":"#b18156"} stroke="#503c31" strokeWidth="4"/><path d="M4 5 L48 37 M48 5 L4 37 M4 14 H48" stroke="#d0a178" strokeWidth="2" opacity=".8"/></g>)}
        <path d="M0 342 H800" stroke="#b88a65" strokeWidth="4" opacity=".45"/>
      </>}
      {chapter === 3 && <>
        {/* Timber bridge and clear river in a dramatic sunset valley. */}
        <path d="M0 190 Q140 140 265 182 T520 174 T800 155 V300 H0Z" fill="#465c58"/>
        <path d="M0 242 Q155 218 290 245 T540 229 T800 211 V380 H0Z" fill="#6d7665"/>
        <path d="M0 282 Q180 260 330 288 T620 270 T800 260 V380 H0Z" fill="url(#cv-river)"/>
        <path d="M0 320 Q155 299 310 324 T620 307 T800 295" fill="none" stroke="#b4e3dc" strokeWidth="3" opacity=".8"/>
        <path d="M0 350 Q150 332 310 353 T630 336 T800 328" fill="none" stroke="#d0e7d9" strokeWidth="2" opacity=".55"/>
        {/* Bridge deck, railings, posts and planks. */}
        <path d="M60 224 Q380 192 740 216 L740 252 Q380 228 60 260Z" fill="#76533e" stroke="#3b302e" strokeWidth="6"/>
        <path d="M70 219 Q380 185 735 211 M70 196 Q380 162 735 188" fill="none" stroke="#c49468" strokeWidth="8"/>
        {Array.from({length:13},(_,i)=><path key={i} d={`M${85+i*52} ${215-i*1.2} V${255-i*1.2}`} stroke="#3d302c" strokeWidth="5"/>)}
        {Array.from({length:12},(_,i)=><path key={`plank-${i}`} d={`M${80+i*55} ${235-i*1.2} l0 18`} stroke="#d2a17a" strokeWidth="2" opacity=".65"/>)}
        <g fill="#3c5047"><path d="M80 210 l-22 -55 18 9 -8 -35 28 25 16 -23 4 44 19 35Z"/><path d="M710 196 l-20 -56 18 10 -5 -34 26 24 18 -20 2 42 18 34Z"/></g>
        <g fill="#9ca59b"><path d="M15 315 l25 -18 20 16 -11 18Z M760 290 l20 -16 20 14 -13 18Z M345 359 l22 -12 24 13 -17 14Z"/></g>
      </>}
      {/* Shared foreground atmosphere and soft animated cloud bands. */}
      <motion.path d="M-30 72 Q110 42 240 71 T500 63 T850 59" fill="none" stroke="#ffe1c6" strokeOpacity=".16" strokeWidth="24" initial={{x:-20}} animate={{x:20}} transition={{duration:18,repeat:Infinity,repeatType:"mirror",ease:"easeInOut"}}/>
      <rect width="800" height="380" fill="#e89973" opacity=".055"/>
      <rect width="800" height="380" fill="url(#cv-sky)" opacity=".08"/>
      <path d="M0 0 H800 V380 H0Z" fill="none" stroke="#f7c5a7" strokeOpacity=".16" strokeWidth="2"/>
    </svg>
  );
}
