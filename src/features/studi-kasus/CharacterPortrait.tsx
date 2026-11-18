import { useId, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useBahasa } from "../../i18n/BahasaContext";

export type CharacterId = "tono" | "arka" | "nara";
export type CharacterMood = "calm" | "curious" | "thinking" | "happy" | "concerned" | "surprised" | "normal" | "success" | "failure";
type Props = {
  character: CharacterId;
  mood?: CharacterMood;
  compact?: boolean;
};

type Profile = {
  name: string; role: string; age: string; skin: string; hair: string; hairLight: string;
  accent: string; outfit: string; detail: string;
};

const PROFILES: Record<CharacterId, Profile> = {
  tono: {
    name: "Pak Tono", role: "Petani · warga lokal", age: "38 tahun", skin: "#c98768", hair: "#302d35", hairLight: "#77747b",
    accent: "#e89973", outfit: "#a94f43", detail: "#e8d8c9",
  },
  arka: {
    name: "Arka", role: "Siswa SMA · analitis", age: "17 tahun", skin: "#e2ad91", hair: "#202938", hairLight: "#58677c",
    accent: "#8eacd9", outfit: "#263d60", detail: "#e7edf4",
  },
  nara: {
    name: "Nara", role: "Siswi SMA · observasional", age: "17 tahun", skin: "#efb99c", hair: "#11131b", hairLight: "#697384",
    accent: "#e8b99e", outfit: "#e9dfce", detail: "#a8b4c8",
  },
};

const moodKey = (mood: CharacterMood) => mood === "success" ? "happy" : mood === "failure" ? "concerned" : mood === "normal" ? "calm" : mood;

function Face({ profile, mood }: { profile: Profile; mood: CharacterMood }) {
  const m = moodKey(mood);
  const brow = m === "concerned" ? "M43 59 Q51 54 59 59 M76 59 Q84 54 92 59" : m === "surprised" ? "M43 54 Q51 51 59 54 M76 54 Q84 51 92 54" : m === "thinking" ? "M43 58 Q51 55 59 58 M76 57 Q84 53 92 57" : "M43 57 Q51 60 59 57 M76 57 Q84 60 92 57";
  const mouth = m === "happy" ? "M56 88 Q68 101 81 88" : m === "concerned" ? "M57 94 Q68 86 80 94" : m === "surprised" ? "M64 88 Q68 99 73 88" : "M58 91 Q68 95 79 91";
  return <AnimatePresence mode="wait" initial={false}>
    <motion.g key={m} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}>
    <path d="M38 68 Q34 42 52 31 Q69 20 87 34 Q101 46 94 75 L89 96 Q82 116 67 118 Q48 114 41 96Z" fill={profile.skin} stroke="#704b4a" strokeOpacity=".28" strokeWidth="1.5"/>
    <path d={brow} fill="none" stroke="#45323a" strokeWidth="2.7" strokeLinecap="round"/>
    <ellipse cx="51" cy="72" rx="4.3" ry={m === "surprised" ? 6 : 3.8} fill="#252433"/><ellipse cx="84" cy="72" rx="4.3" ry={m === "surprised" ? 6 : 3.8} fill="#252433"/>
    <circle cx="52" cy="70.5" r="1.3" fill="#fff"/><circle cx="85" cy="70.5" r="1.3" fill="#fff"/>
    <path d="M66 75 Q63 84 68 85" fill="none" stroke="#a96d64" strokeWidth="1.5" strokeLinecap="round"/>
    <path d={mouth} fill="none" stroke="#8f4e58" strokeWidth="2.8" strokeLinecap="round"/>
    <ellipse cx="43" cy="84" rx="7" ry="3.5" fill="#d77f7c" opacity={m === "happy" ? .42 : .2}/><ellipse cx="91" cy="84" rx="7" ry="3.5" fill="#d77f7c" opacity={m === "happy" ? .42 : .2}/>
    </motion.g>
  </AnimatePresence>;
}

function TonoArt({ profile, mood }: { profile: Profile; mood: CharacterMood }) {
  return <>
    {/* Field shirt, rolled sleeves, undershirt and work trousers */}
    <path d="M29 145 Q34 119 48 115 L58 111 L68 124 L79 111 L91 116 Q105 122 110 145 L114 194 H20Z" fill="#f1eee8"/>
    <path d="M29 145 Q33 122 49 116 L59 127 L68 139 L77 127 L90 116 Q106 121 110 145 L114 194 H20Z" fill={profile.outfit}/>
    <path d="M31 145 H108 M27 159 H111 M24 174 H113" stroke="#542f35" strokeWidth="3" opacity=".75"/>
    <path d="M43 122 L40 190 M58 120 L57 192 M82 120 L83 192 M98 124 L101 190" stroke="#342b32" strokeWidth="2.2" opacity=".72"/>
    <path d="M35 151 H109 M32 168 H110" stroke="#d78b79" strokeWidth="1.1" opacity=".72"/>
    <path d="M44 119 L52 132 L47 146 M94 119 L85 132 L90 146" stroke="#e5a18b" strokeWidth="8" strokeLinecap="round"/>
    <path d="M58 116 L68 139 L78 116" fill="none" stroke="#f2e9df" strokeWidth="5"/>
    <path d="M24 147 Q17 147 17 160 L18 171 Q26 178 34 168 L39 148 M104 147 Q114 145 117 157 L116 169 Q109 177 101 167 L98 148" fill="#d89b79" stroke="#855a51" strokeWidth="1.5"/>
    <path d="M45 151 L44 194 M91 151 L92 194" stroke="#57343a" strokeWidth="2" opacity=".65"/>
    <path d="M54 124 Q68 135 82 124" fill="none" stroke="#f7e8dc" strokeWidth="3"/>
    {/* Neck towel */}
    <path d="M52 108 Q58 119 68 118 Q77 117 82 108 L87 126 Q69 138 48 126Z" fill="#f5f0e8" stroke="#c7b9ae" strokeWidth="1.2"/>
    <path d="M52 121 Q66 128 82 120" fill="none" stroke="#d1c5ba" strokeWidth="2"/>
    {/* Khaki work pants and boots */}
    <path d="M30 185 L62 185 L58 224 L55 250 H34 L36 220Z M70 185 H104 L98 220 L101 250 H79 L76 222Z" fill="#8a765e"/>
    <path d="M31 240 H58 L59 260 H25 Q24 250 31 240 M78 240 H102 L112 260 H76Z" fill="#3c3b3e" stroke="#24252d" strokeWidth="2"/>
    <path d="M29 253 H56 M80 253 H108" stroke="#a58b6c" strokeWidth="2"/>
    {/* Mature short hair with grey temples */}
    <path d="M36 66 Q27 26 60 20 Q95 16 100 53 L94 69 Q87 48 74 43 Q60 54 39 49Z" fill={profile.hair}/>
    <path d="M35 59 Q31 70 39 84 M96 57 Q102 70 91 84" fill="none" stroke={profile.hair} strokeWidth="9" strokeLinecap="round"/>
    <path d="M37 52 Q33 61 38 68 M96 51 Q100 61 94 68" fill="none" stroke="#aaa5a1" strokeWidth="3.5" strokeLinecap="round"/>
    <Face profile={profile} mood={mood}/>
    {/* Classic black velvet peci: foreground layer, with curved crown and fine top stitching. */}
    <path d="M37 50 Q37 25 52 20 Q68 14 84 20 Q99 27 99 50 Q69 56 37 50Z" fill="#17171d" stroke="#08090e" strokeWidth="2"/>
    <path d="M39 47 Q67 52 97 47 L97 54 Q68 60 39 54Z" fill="#25242b" stroke="#090a10" strokeWidth="1.2"/>
    <path d="M47 28 Q67 18 88 28 M45 32 Q67 23 91 32" fill="none" stroke="#77727a" strokeOpacity=".48" strokeWidth="1" strokeDasharray="1.7 2.2"/>
    <path d="M42 47 Q68 52 94 47" fill="none" stroke="#aaa3a0" strokeOpacity=".5" strokeWidth="1.2"/>
    {/* Grey temple hair remains visible below the peci. */}
    <path d="M37 51 Q32 61 39 75 M98 51 Q104 62 96 76" fill="none" stroke={profile.hair} strokeWidth="8" strokeLinecap="round"/>
    <path d="M37 61 Q34 68 39 73 M98 61 Q101 68 96 73" fill="none" stroke="#aaa5a1" strokeWidth="2.8" strokeLinecap="round"/>
    {/* Smile lines */}
    <path d="M43 88 Q46 94 50 94 M86 94 Q91 91 93 86" fill="none" stroke="#9e665d" strokeWidth="1.2" opacity=".7"/>
  </>;
}

function ArkaArt({ profile, mood }: { profile: Profile; mood: CharacterMood }) {
  return <>
    <path d="M30 187 H64 L59 245 H36 L34 218Z M72 187 H105 L101 218 L104 245 H81 L76 218Z" fill="#78879b" stroke="#526176" strokeWidth="1.5"/>
    <path d="M34 239 H59 L61 260 H28 Q26 249 34 239 M80 239 H103 L112 260 H77Z" fill="#202b3e" stroke="#111a2b" strokeWidth="2"/>
    <path d="M31 253 H57 M80 253 H108" stroke="#a6b5c7" strokeWidth="1.5"/>
    <path d="M27 148 Q34 117 49 115 L58 111 L68 126 L79 111 L91 116 Q106 122 111 148 L114 194 H19Z" fill="#d9dfe8"/>
    <path d="M42 119 L58 113 L68 131 L78 113 L97 120 L104 194 H34Z" fill="#e7edf4"/>
    <path d="M58 114 L68 133 L78 114 L73 155 L64 155Z" fill="#9a5360"/>
    <path d="M30 132 Q42 119 56 121 L68 138 L80 121 Q96 119 108 134 L113 194 H22Z" fill={profile.outfit} stroke="#172943" strokeWidth="2"/>
    <path d="M31 145 L46 151 L42 194 H24Z M105 145 L91 151 L97 194 H114Z" fill="#e89973"/>
    <path d="M50 126 L68 148 L85 126" fill="none" stroke="#e89973" strokeWidth="2"/>
    <path d="M54 150 H82 M54 160 H82" stroke="#b8c9e2" strokeWidth="1.4" opacity=".7"/>
    {/* Empty, relaxed hands: no book, tablet, or handheld prop. */}
    <path d="M30 151 Q18 158 22 174 Q27 183 36 176 L43 158Z M96 151 Q108 151 113 163 L111 179 Q104 185 97 176Z" fill={profile.skin} stroke="#9c7169" strokeWidth="1.2"/>
    <path d="M24 169 Q29 173 35 168 M101 169 Q106 173 111 168" fill="none" stroke="#f1c7ae" strokeWidth="1.5" strokeLinecap="round"/>
    {/* slim titanium glasses */}
    {/* Short, airy layered anime cut: compact crown with separated tapered side locks. */}
    <path d="M31 66 Q24 31 48 17 Q62 7 76 15 Q95 12 103 39 L99 67 L91 58 L86 73 L77 57 L69 70 L60 55 L49 73 L42 57 L35 75Z" fill={profile.hair} stroke="#111925" strokeWidth="1.2"/>
    <path d="M37 49 Q43 27 57 20 Q53 36 58 53 M62 17 Q75 25 70 48 M78 19 Q93 27 96 48 M31 42 L23 55 L37 54 M98 40 L108 53 L97 56" fill="none" stroke={profile.hairLight} strokeWidth="2.2" opacity=".55" strokeLinecap="round"/>
    <Face profile={profile} mood={mood}/>
    {/* Foreground layered fringe sits above the forehead; glasses are redrawn last so the frames remain readable. */}
    <path d="M34 57 Q29 34 43 22 Q51 13 64 17 Q74 10 87 20 Q103 29 101 55 L96 70 Q91 54 85 47 L81 63 Q74 52 72 43 Q67 58 64 68 Q57 56 54 43 Q47 54 42 70 L37 75Z" fill={profile.hair} stroke="#111925" strokeWidth="1.2"/>
    <path d="M38 48 Q45 25 57 22 Q54 38 58 55 M62 20 Q73 29 69 53 M78 22 Q91 30 94 49" fill="none" stroke={profile.hairLight} strokeWidth="2.2" strokeOpacity=".58" strokeLinecap="round"/>
    <path d="M43 47 Q49 39 55 35 Q53 49 60 64 Q65 52 68 38 Q74 48 78 60 Q82 48 85 39 Q93 47 96 60" fill="none" stroke="#111925" strokeWidth="3.4" strokeLinecap="round"/>
    <path d="M39 69 Q49 65 59 69 L59 80 Q49 84 40 79Z M76 69 Q86 65 96 69 L95 79 Q85 84 76 80Z M59 73 H76 M37 72 L31 69 M97 72 L103 69" fill="none" stroke="#a9c2d4" strokeWidth="1.8"/>
    <path d="M43 71 L55 70 M80 71 L92 70" stroke="#fff" strokeWidth="1" opacity=".7"/>
  </>;
}

function NaraArt({ profile, mood }: { profile: Profile; mood: CharacterMood }) {
  return <>
    {/* Waist-length, glossy black hair: broad back silhouette with tapered ends. */}
    <path d="M32 62 Q24 23 51 13 Q78 4 98 25 Q113 43 103 82 L111 218 Q105 235 94 224 L88 89 Q69 100 48 87 L42 225 Q29 237 22 219 L29 83Z" fill={profile.hair} stroke="#080b12" strokeWidth="1.7"/>
    <path d="M34 76 Q29 126 32 207 M99 78 Q105 128 101 209 M44 86 Q41 136 43 218 M89 88 Q94 139 91 218 M53 87 Q51 143 53 224 M81 88 Q84 145 82 224" fill="none" stroke={profile.hairLight} strokeWidth="2.1" strokeOpacity=".48" strokeLinecap="round"/>
    <path d="M38 99 Q34 151 37 216 M95 98 Q99 152 96 216 M59 91 Q57 150 59 222 M76 91 Q78 151 77 222" fill="none" stroke="#d9dce7" strokeWidth=".9" strokeOpacity=".24" strokeLinecap="round"/>
    <path d="M27 177 Q29 204 24 218 M105 176 Q108 204 109 218" fill="none" stroke="#090c14" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Uniform, cardigan and shoes. */}
    <path d="M30 187 H64 L59 245 H36 L34 218Z M72 187 H105 L101 218 L104 245 H81 L76 218Z" fill="#78879b" stroke="#526176" strokeWidth="1.5"/>
    <path d="M34 239 H59 L61 260 H28 Q26 249 34 239 M80 239 H103 L112 260 H77Z" fill="#e8e4dd" stroke="#b8b7b3" strokeWidth="2"/>
    <path d="M31 253 H57 M80 253 H108" stroke="#9d9b99" strokeWidth="1.5"/>
    <path d="M27 147 Q34 118 49 115 L58 111 L68 126 L79 111 L91 116 Q106 122 111 148 L114 194 H19Z" fill="#e8e0d4"/>
    <path d="M27 137 Q44 119 56 121 L68 139 L80 121 Q98 119 109 139 L114 194 H20Z" fill={profile.outfit}/>
    {/* Oversized knitted cream cardigan with ribbed cuffs and stitch details. */}
    <path d="M29 132 Q38 118 54 119 L64 143 L55 194 H21Z M83 119 Q101 119 109 135 L115 194 H81 L72 143Z" fill="#e9dfce" stroke="#c8bba9" strokeWidth="1.5"/>
    <path d="M64 142 L68 153 L72 142 M31 153 H49 M88 153 H105 M28 184 H55 M82 184 H111" fill="none" stroke="#c2b39f" strokeWidth="1.5"/>
    <path d="M40 157 L39 194 M98 157 L99 194" stroke="#c2b39f" strokeWidth="1.2" strokeDasharray="3 4"/>
    {/* Face sits above the rear hair; front locks are drawn after the face. */}
    <Face profile={profile} mood={mood}/>
    {/* Straight, airy see-through bangs and long face-framing locks. */}
    <path d="M34 61 Q30 27 53 18 Q78 9 96 29 Q103 43 98 65 Q89 49 83 43 Q79 55 75 64 Q69 54 67 43 Q61 56 57 64 Q50 53 48 43 Q40 51 37 67Z" fill={profile.hair} stroke="#171520" strokeWidth="1.2"/>
    <path d="M38 57 Q43 42 51 36 Q49 52 55 62 M57 34 Q64 43 63 61 M72 34 Q78 44 76 61 M87 39 Q94 49 95 62" fill="none" stroke={profile.hairLight} strokeWidth="1.65" strokeOpacity=".56" strokeLinecap="round"/>
    <path d="M48 39 Q52 48 52 59 M63 34 Q67 45 66 60 M78 37 Q82 47 81 59" fill="none" stroke="#d8dce5" strokeWidth=".9" strokeOpacity=".34" strokeLinecap="round"/>
    <path d="M36 67 Q29 111 35 161 Q38 191 32 225 M96 66 Q105 111 99 162 Q96 192 103 225" fill="none" stroke={profile.hair} strokeWidth="9" strokeLinecap="round"/>
    <path d="M39 83 Q35 133 39 182 Q40 202 36 220 M94 82 Q99 133 95 183 Q94 204 99 221" fill="none" stroke={profile.hairLight} strokeWidth="1.9" strokeOpacity=".48" strokeLinecap="round"/>
    {/* Small satin side ribbon and a subtle metal hairpin. */}
    <path d="M92 43 Q104 34 109 42 Q105 50 96 49 Q106 53 109 61 Q98 64 92 52Z" fill="#d9b5a7" stroke="#f0d7c8" strokeWidth="1.1"/>
    <circle cx="96" cy="49" r="2.5" fill="#f3dfce" stroke="#9b7c79" strokeWidth=".8"/>
    <path d="M99 35 L111 30" stroke="#d8c4b7" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Empty hands held naturally at her sides; the pose remains still. */}
    <path d="M31 151 Q20 157 23 173 Q27 183 37 176 L44 158Z M94 151 Q107 154 111 167 L108 181 Q101 185 95 176Z" fill={profile.skin} stroke="#a8756d" strokeWidth="1.2"/>
    <path d="M24 168 Q29 174 36 169 M99 169 Q105 175 110 169" fill="none" stroke="#f7d0b8" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M27 158 Q32 153 38 157 M97 158 Q103 155 108 161" fill="none" stroke="#f4c5ad" strokeWidth="1.2" strokeLinecap="round"/>
  </>;
}

export default function CharacterPortrait({ character, mood = "calm", compact = false }: Props) {
  const language = useBahasa();
  const instanceId = useId().replace(/:/g, "");
  const profile = PROFILES[character];
  const name = character === "tono" && language === "en" ? "Mr. Tono" : profile.name;
  const expression = moodKey(mood);
  const style = { "--person-accent": profile.accent } as CSSProperties;
  return (
    <motion.div
      key={`${character}-${expression}`}
      className={`cv-person cv-person-${character} mood-${expression} ${compact ? "compact" : ""}`}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: .24, ease: "easeOut" }}
      aria-label={`${name}, ${profile.age}, ${profile.role}, expression ${expression}`}
    >
      <svg viewBox="0 0 136 270" role="img" aria-hidden="true" className="cv-person-art">
        <defs>
          <linearGradient id={`${instanceId}-skin-${character}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffe0c8"/><stop offset="1" stopColor={profile.skin}/></linearGradient>
          <linearGradient id={`${instanceId}-cloth-${character}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={profile.detail}/><stop offset=".5" stopColor={profile.outfit}/><stop offset="1" stopColor="#172033"/></linearGradient>
          <radialGradient id={`${instanceId}-halo-${character}`}><stop stopColor={profile.accent} stopOpacity=".22"/><stop offset="1" stopColor={profile.accent} stopOpacity="0"/></radialGradient>
        </defs>
        <ellipse cx="68" cy="135" rx="67" ry="127" fill={`url(#${instanceId}-halo-${character})`}/>
        <ellipse cx="68" cy="260" rx="43" ry="6" fill="#030712" opacity=".5"/>
        {character === "tono" ? <TonoArt profile={profile} mood={mood}/> : character === "arka" ? <ArkaArt profile={profile} mood={mood}/> : <NaraArt profile={profile} mood={mood}/>}
        <path d="M24 192 Q68 201 112 192" stroke="#fff" strokeOpacity=".12" strokeWidth="2" fill="none"/>
      </svg>
      <span className="cv-person-name">{name}</span>
      {!compact && <small>{profile.age} · {profile.role}</small>}
    </motion.div>
  );
}
