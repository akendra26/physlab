import { useRef } from "react";
import { BANK_SOAL_PROBLEM_SET, type ProgresProblemSet } from "./dataProblemSet";
import { useAudioSfx } from "./useAudioSfx";
import { useBahasa } from "../../i18n/BahasaContext";

type Props = { progres: ProgresProblemSet; onPilihTopik: (topikId: string) => void };
const ICONS = ["↔","↕","⌁","ΣF","⚙","∿","↕","ϟ","⇄"];
const TITLES_EN = ["GLB & GLBB","Free Fall & Vertical Motion","Projectile Motion","Newtonian Dynamics","Atwood Pulley","Springs & Oscillations","Lift / Elevator","Work & Energy","Momentum & Impulse"];
export default function ProblemSetHub({ progres, onPilihTopik }: Props) {
 const language=useBahasa(); const en=language==="en";
 const track = useRef<HTMLDivElement>(null);
 const {play}=useAudioSfx();
 const jumlahSemuaSoal=BANK_SOAL_PROBLEM_SET.reduce((n,t)=>n+t.soal.length,0);
 const jumlahBenar=BANK_SOAL_PROBLEM_SET.reduce((n,t)=>n+t.soal.filter(s=>progres.percobaan[s.id]?.benar).length,0);
 const persen=jumlahSemuaSoal?Math.round(jumlahBenar/jumlahSemuaSoal*100):0;
 const scroll=(direction:number)=>{play("whoosh");track.current?.scrollBy({left:direction*310,behavior:"smooth"});};
 return <section className="ps-page ps-trial-page" data-sfx-local="true" aria-labelledby="problem-set-title">
  <header className="ps-page-heading"><div><p className="ps-eyebrow">{en?"TRIAL CHAMBERS · PHYSLAB":"TRIAL CHAMBERS · PHYSLAB"}</p><div className="ps-title-row"><div><h1 id="problem-set-title">Problem Set</h1><p className="ps-description">{en?"Nine challenge chambers to test intuition, concepts, and numerical precision.":"Sembilan ruang tantangan untuk menguji intuisi, konsep, dan ketelitian berhitung."}</p></div><span className="ps-status"><span/> {en?`${BANK_SOAL_PROBLEM_SET.length} CHAMBERS`:`${BANK_SOAL_PROBLEM_SET.length} CHAMBERS`}</span></div></div></header>
  <section className="ps-overview" aria-label="Ringkasan progres"><div className="ps-overview-copy"><span className="ps-overview-label">{en?"OVERALL PROGRESS":"PROGRES KESELURUHAN"}</span><strong>{jumlahBenar}<small> / {jumlahSemuaSoal} {en?"correct answers":"soal benar"}</small></strong><div className="ps-overview-track"><span style={{width:`${persen}%`}}/></div></div><div className="ps-overview-percent">{persen}<small>%</small></div><div className="ps-overview-note">{en?"Progress is saved automatically in this browser.":"Progres tersimpan otomatis di browser ini."}</div></section>
  <div className="ps-section-heading"><div><p className="ps-eyebrow">{en?"CHOOSE A CHAMBER":"PILIH CHAMBER"}</p><h2>{en?"Trial Chambers":"Trial Chambers"}</h2></div><div className="ps-carousel-controls"><button type="button" aria-label={en?"Previous":"Sebelumnya"} onClick={()=>scroll(-1)} onMouseEnter={()=>play("hover")}>←</button><button type="button" aria-label={en?"Next":"Berikutnya"} onClick={()=>scroll(1)} onMouseEnter={()=>play("hover")}>→</button></div></div>
  <div className="ps-carousel-track" ref={track}>{BANK_SOAL_PROBLEM_SET.map((topik,i)=>{const benar=topik.soal.filter(s=>progres.percobaan[s.id]?.benar).length;const total=topik.soal.length;const pct=total?Math.round(benar/total*100):0;return <button className={`ps-topic-card ps-trial-card ps-tone-${topik.warna}`} key={topik.id} type="button" onClick={()=>{play("click");onPilihTopik(topik.id);}} onMouseEnter={()=>play("hover")}><div className="ps-card-topline"><span className="ps-topic-number">{en?"CHAMBER":"CHAMBER"} {String(i+1).padStart(2,"0")}</span><span className="ps-topic-icon">{ICONS[i]}</span></div><span className="ps-topic-domain">{en?(i<2?"KINEMATICS": "DYNAMICS"):topik.bidang.toUpperCase()} · {topik.singkatan}</span><h3>{en?TITLES_EN[i]:topik.judul}</h3><p>{en?([
 "Analyze uniform and uniformly accelerated motion along a straight path.",
 "Analyze free fall and vertical throws under gravitational acceleration.",
 "Resolve two-dimensional motion into horizontal and vertical components.",
 "Analyze net force, normal force, friction, and forces at any angle.",
 "Calculate acceleration and rope tension in an ideal pulley system.",
 "Study period, frequency, and damping in spring systems.",
 "Calculate normal force and apparent weight in an accelerating elevator.",
 "Connect work done by a force with changes in kinetic and potential energy.",
 "Apply impulse, momentum change, and conservation of momentum."
][i]):topik.deskripsi}</p><div className="ps-card-meta"><span>{total} {en?"questions":"soal"}</span><span>{topik.estimasiMenit} {en?"min":"menit"}</span><span>{benar}/{total} {en?"correct":"benar"}</span></div><div className="ps-topic-progress"><span style={{width:`${pct}%`}}/></div><div className="ps-card-action"><span>{benar?(en?"Continue challenge":"Lanjutkan tantangan"):(en?"Enter chamber":"Masuki chamber")}</span><span>↗</span></div></button>})}</div>
  <p className="ps-mock-note"><strong>{en?"Note:":"Catatan:"}</strong> {en?"The question bank contains structured practice. Use the explanations to check your reasoning, not only the final result.":"Bank soal memuat materi latihan terstruktur. Gunakan pembahasan untuk memeriksa proses, bukan hanya hasil akhir."}</p>
 </section>;
}
