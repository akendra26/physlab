import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useBahasa } from "../../i18n/BahasaContext";
import "./StudiKasus.css";
import CharacterPortrait, { type CharacterId, type CharacterMood } from "./CharacterPortrait";
import ChapterEnvironment from "./ChapterEnvironment";
import CivilizationCart from "./CivilizationCart";
import { useAudioSfx } from "../problem-set/useAudioSfx";

type Lang = "id" | "en";
type Chapter = { title: string; terrain: string; problem: string; speaker: string; avatar: string; parameter: string; unit: string; optimal: string; choices: { id: string; title: string; detail: string; response: string; metric: string }[]; happy: string; bad: string; secret: string; };
const CHAPTERS: Record<Lang, Chapter[]> = {
 id: [
  { title:"Jalan Berpasir Datar", terrain:"CHAPTER 01 · FRIKSI & GAYA NORMAL", problem:"Pak Tono harus menggerakkan gerobak berisi hasil kebun melewati tanah berpasir. Roda terasa berat dan gaya pada pegangan terasa besar.", speaker:"Pak Tono",avatar:"T",parameter:"Massa total 85 kg · Gaya pada pegangan 260 N · μₖ 0,32 · lintasan datar",unit:"N",optimal:"angle",choices:[
   {id:"brute",title:"Tarik lurus sekuat tenaga",detail:"Arah gaya sejajar tanah; tenaga ditambah.",response:"Arka: Tenaga memang naik, tapi komponen normal belum berkurang. Gesekannya masih besar.",metric:"Gaya tarik 340 N"},
   {id:"angle",title:"Atur sudut gaya pada gagang kayu sekitar 30°",detail:"Arahkan gaya sedikit ke atas untuk mengurangi gaya normal.",response:"Nara: Nah, sudut gaya pada gagang kayu juga penting. Pak Tono bisa menjaga postur tetap nyaman.",metric:"Sudut gaya 30°"},
   {id:"load",title:"Tambah muatan agar roda lebih stabil",detail:"Distribusi beban diubah dengan menambah muatan.",response:"Arka: Massa bertambah berarti gaya normal dan gesekan juga berpotensi naik.",metric:"Massa 110 kg"},
   {id:"push",title:"Minta dua orang mendorong dari belakang",detail:"Tambahkan gaya horizontal tanpa mengubah pegangan.",response:"Pak Tono: Bisa sih, tapi saya pengin solusi yang tetap bisa dipakai sendirian.",metric:"Gaya tambahan 120 N"},
   {id:"wheel",title:"Ganti roda dengan tapak lebih lebar",detail:"Ubah kontak roda dengan pasir.",response:"Nara: Menarik, tapi kita perlu cek apakah hambatan gulirnya ikut berubah.",metric:"Lebar tapak +40%"}
  ],happy:"Gaya miring melalui gagang kayu mengurangi komponen gaya normal sehingga gaya gesek kinetik turun. Gerobak meluncur lebih ringan.",bad:"Gaya yang dipilih belum mengurangi hambatan secara efektif. Gerobak tersendat dan Pak Tono harus menghentikan uji.",secret:"Sudut dan besar gaya pada gagang kayu terkalibrasi: kebutuhan tenaga minimum tercapai tanpa mengorbankan postur."},
  { title:"Tanjakan Curam 35°",terrain:"CHAPTER 02 · KOMPONEN GAYA BERAT",problem:"Jalur berikutnya menanjak 35°. Permukaannya licin. Begitu Pak Tono berhenti sebentar, gerobak mulai bergerak mundur.",speaker:"Arka",avatar:"A",parameter:"Massa sistem 85 kg · θ = 35° · g = 9,81 m/s²",unit:"N",optimal:"parallel",choices:[
   {id:"run",title:"Ambil ancang-ancang lalu lari cepat",detail:"Mengandalkan momentum untuk melewati tanjakan.",response:"Arka: Ini bukan strategi aman. Kalau momentum habis sebelum puncak, gerobak bisa rollback.",metric:"Kecepatan awal tinggi"},
   {id:"parallel",title:"Arahkan gaya tarik sejajar bidang miring",detail:"Tarik sepanjang tanjakan untuk melawan mg sin θ.",response:"Arka: Komponen berat tangensialnya mg sin θ. Gaya kita harus bekerja pada sumbu yang sama.",metric:"Gaya sejajar bidang"},
   {id:"zigzag",title:"Buat lintasan zig-zag",detail:"Perpanjang lintasan untuk menurunkan sudut efektif.",response:"Nara: Jarak memang lebih panjang, tapi kemiringan dan beban tubuh bisa lebih bersahabat.",metric:"Sudut efektif 18°"},
   {id:"block",title:"Ganjal roda lalu dorong mendadak",detail:"Gunakan ganjal sementara dan dorongan besar.",response:"Pak Tono: Ganjalnya bisa lepas nggak? Aku nggak mau hasil bumi malah meluncur.",metric:"Dorongan impulsif"},
   {id:"counter",title:"Aktifkan pengunci roda cadangan",detail:"Satu orang menjaga gerobak dengan rem roda saat tim menggerakkannya.",response:"Nara: Sistem pengaman cadangan bagus, tetapi arah gaya utama tetap harus diperhitungkan.",metric:"Rem roda aktif"}
  ],happy:"Gaya tarik sejajar bidang mengimbangi komponen berat tangensial. Gerobak naik tanpa kecenderungan rollback.",bad:"Strategi momentum sesaat gagal menjaga gerobak ketika gaya penggerak turun. Gerobak meluncur mundur; uji dihentikan.",secret:"Gaya sejajar bidang dipadukan dengan jalur zig-zag dan pengunci roda cadangan. Beban kerja terbagi dengan margin keselamatan tinggi."},
  { title:"Sistem Katrol Logistik",terrain:"CHAPTER 03 · HUKUM NEWTON & KATROL",problem:"Hasil bumi harus diturunkan dari tebing menuju pos logistik. Menurunkan keranjang langsung dengan tangan terlalu berisiko dan kecepatannya sulit dikendalikan.",speaker:"Nara",avatar:"N",parameter:"m₁ = 18 kg · m₂ = 20 kg · tali ringan · katrol ideal",unit:"m/s²",optimal:"compound",choices:[
   {id:"free",title:"Turunkan keranjang dengan tali biasa",detail:"Satu orang mengulur tali dari bibir tebing.",response:"Pak Tono: Kalau talinya kecepetan, keranjang bisa menghantam tanah.",metric:"Kontrol manual"},
   {id:"compound",title:"Rakit katrol majemuk terkalibrasi",detail:"Atur rasio beban dan sistem Atwood untuk mengendalikan percepatan.",response:"Arka: Kita kalibrasi massa dan tegangan. Targetnya bukan sekadar bergerak, tapi turun dengan percepatan terkendali.",metric:"Rasio katrol terkalibrasi"},
   {id:"heavy",title:"Gunakan pemberat jauh lebih besar",detail:"Perbesar beda massa agar sistem bergerak cepat.",response:"Nara: Cepat bukan berarti aman. Energi kinetik keranjang akan meningkat.",metric:"Δm besar"},
   {id:"pull",title:"Tarik keranjang dari bawah",detail:"Tim di bawah mengendalikan tali secara langsung.",response:"Pak Tono: Komunikasi dari bawah ke atas bakal susah kalau tebingnya tertutup.",metric:"Tarikan manual"},
   {id:"brake",title:"Tambahkan rem gesek pada poros",detail:"Batasi laju putaran katrol dengan rem.",response:"Arka: Bisa, asal torsi remnya disetel dan panas gesek diperhitungkan.",metric:"Rem poros"}
  ],happy:"Sistem katrol menurunkan keranjang secara terkendali. Tegangan tali dan percepatan tetap dalam rentang operasional yang direncanakan.",bad:"Perbedaan massa terlalu besar dan laju turun tidak terkendali. Keranjang dihentikan sebelum mencapai pos.",secret:"Katrol majemuk, rasio massa, dan rem poros terkalibrasi menghasilkan penurunan nyaris konstan dengan kontrol cadangan."},
  { title:"Jalur Bergelombang & Osilasi",terrain:"CHAPTER 04 · OSILASI TEREDAM",problem:"Di jalur bergelombang, keranjang bibit bergetar keras. Bibit terlempar dan beberapa wadah hampir jatuh.",speaker:"Arka",avatar:"A",parameter:"Massa efektif 12 kg · konstanta pegas k · redaman c",unit:"N·s/m",optimal:"critical",choices:[
   {id:"soft",title:"Gunakan pegas sangat lunak",detail:"Perkecil konstanta pegas agar guncangan terasa lembut.",response:"Arka: Pegas terlalu lunak bisa membuat osilasi berlangsung lama.",metric:"k terlalu kecil"},
   {id:"critical",title:"Setel redaman kritis",detail:"Pilih c = 2√(km) agar kembali ke setimbang tanpa osilasi berlebih.",response:"Nara: Ini kompromi yang pas: energi getaran diserap cepat, bibit nggak terus memantul.",metric:"ζ = 1"},
   {id:"stiff",title:"Pakai pegas sekaku mungkin",detail:"Perbesar k agar keranjang tidak banyak bergeser.",response:"Pak Tono: Tapi kalau terlalu kaku, getarannya malah langsung diteruskan ke bibit, kan?",metric:"k sangat besar"},
   {id:"none",title:"Lepas sistem suspensi",detail:"Pasang keranjang langsung ke rangka gerobak.",response:"Arka: Itu menghilangkan isolasi getaran. Risiko kerusakan justru meningkat.",metric:"c = 0"},
   {id:"over",title:"Gunakan redaman berlebihan",detail:"Buat koefisien redaman jauh di atas kritis.",response:"Nara: Gerak memang tidak berosilasi, tetapi responsnya bisa terlalu lambat.",metric:"ζ > 1"}
  ],happy:"Suspensi teredam kritis kembali ke posisi setimbang dengan cepat tanpa pantulan berulang. Bibit tetap aman.",bad:"Redaman tidak sesuai membuat keranjang terus berosilasi atau terlalu lambat merespons. Uji dihentikan.",secret:"Nilai k dan c dioptimalkan terhadap massa keranjang dan profil lintasan. Getaran teredam cepat dengan kenyamanan terbaik."}
 ],
 en: [
  {title:"Flat Sandy Road",terrain:"CHAPTER 01 · FRICTION & NORMAL FORCE",problem:"Pak Tono must pull a produce cart across loose sand. The wheels resist motion and every pull strains his shoulders.",speaker:"Pak Tono",avatar:"T",parameter:"Total mass 85 kg · Handle force 260 N · μₖ 0.32 · flat road",unit:"N",optimal:"angle",choices:[
   {id:"brute",title:"Pull harder in a horizontal line",detail:"Increase force without changing its direction.",response:"Arka: More force helps, but the normal component and friction remain high.",metric:"Pull force 340 N"},
   {id:"angle",title:"Set the wooden-handle force angle to 30°",detail:"Apply a slight upward component to reduce the normal force.",response:"Nara: The wooden handle angle matters too. Pak Tono can keep a more comfortable posture.",metric:"Force angle 30°"},
   {id:"load",title:"Add weight for stability",detail:"Increase the load on the cart.",response:"Arka: More mass can increase both normal force and friction.",metric:"Mass 110 kg"},
   {id:"push",title:"Ask two people to push",detail:"Add horizontal force from behind.",response:"Pak Tono: That works, but I need a solution I can use alone.",metric:"Extra force 120 N"},
   {id:"wheel",title:"Install wider tires",detail:"Change wheel contact with the sand.",response:"Nara: Interesting, but rolling resistance may also change.",metric:"Tread width +40%"}
  ],happy:"The angled force through the wooden handle reduces the normal component, lowering kinetic friction. The cart moves more easily.",bad:"The selected strategy does not sufficiently reduce resistance. The cart stalls and the test is stopped.",secret:"Force and angle are calibrated: effort is minimized while the handle remains ergonomic."},
  {title:"Steep 35° Slope",terrain:"CHAPTER 02 · WEIGHT COMPONENTS",problem:"The next road climbs at 35° and is slippery. When Pak Tono pauses, the cart starts rolling backward.",speaker:"Arka",avatar:"A",parameter:"System mass 85 kg · θ = 35° · g = 9.81 m/s²",unit:"N",optimal:"parallel",choices:[
   {id:"run",title:"Run fast to gain momentum",detail:"Use a burst of speed to climb.",response:"Arka: Not safe. If momentum fades before the top, the cart rolls back.",metric:"High initial speed"},
   {id:"parallel",title:"Pull parallel to the slope",detail:"Act along the incline against mg sin θ.",response:"Arka: The tangential weight component is mg sin θ. Our force should align with it.",metric:"Parallel force"},
   {id:"zigzag",title:"Build a zig-zag path",detail:"Lengthen the route to reduce the effective angle.",response:"Nara: It is longer, but gentler on both the cart and the people.",metric:"Effective angle 18°"},
   {id:"block",title:"Block the wheels, then shove",detail:"Use a temporary wedge and a sudden push.",response:"Pak Tono: Could the wedge slip? I don't want the produce rolling away.",metric:"Sudden push"},
   {id:"counter",title:"Engage the backup wheel lock",detail:"A second person secures the cart with its wheel brake.",response:"Nara: A backup is smart, but the main force direction still matters.",metric:"Wheel lock active"}
  ],happy:"The pull acts along the incline and counters the tangential weight component. The cart climbs without rollback.",bad:"A burst of momentum cannot control the cart once driving force drops. The test is stopped.",secret:"A parallel handle force, gentler zig-zag route, and backup wheel lock create a strong safety margin."},
  {title:"Logistics Pulley System",terrain:"CHAPTER 03 · NEWTON'S LAWS & PULLEYS",problem:"Produce must be lowered from a cliff to the logistics post. A hand-controlled rope is risky and difficult to regulate.",speaker:"Nara",avatar:"N",parameter:"m₁ = 18 kg · m₂ = 20 kg · light rope · ideal pulley",unit:"m/s²",optimal:"compound",choices:[
   {id:"free",title:"Lower with a simple rope",detail:"One person pays out the rope by hand.",response:"Pak Tono: If it speeds up, the basket could hit the ground.",metric:"Manual control"},
   {id:"compound",title:"Build a calibrated compound pulley",detail:"Tune the Atwood mass ratio to control acceleration and tension.",response:"Arka: We calibrate mass and tension. The goal is controlled motion, not just motion.",metric:"Calibrated ratio"},
   {id:"heavy",title:"Use a much heavier counterweight",detail:"Increase mass difference for speed.",response:"Nara: Faster is not safer. The basket's kinetic energy will increase.",metric:"Large Δm"},
   {id:"pull",title:"Pull the basket from below",detail:"A team controls the rope at the bottom.",response:"Pak Tono: Communication will be difficult across the cliff.",metric:"Manual pull"},
   {id:"brake",title:"Add a friction brake",detail:"Limit pulley rotation with a shaft brake.",response:"Arka: Possible, if braking torque and heat are accounted for.",metric:"Shaft brake"}
  ],happy:"The pulley lowers the basket under control, with acceleration and rope tension in the planned range.",bad:"The mass difference is too large and the descent becomes uncontrolled. The basket is stopped.",secret:"A compound pulley, tuned mass ratio, and brake produce near-constant descent with backup control."},
  {title:"Wavy Road & Oscillation",terrain:"CHAPTER 04 · DAMPED OSCILLATION",problem:"A wavy road shakes the seed basket violently. Seedlings bounce and containers nearly fall.",speaker:"Arka",avatar:"A",parameter:"Effective mass 12 kg · spring constant k · damping c",unit:"N·s/m",optimal:"critical",choices:[
   {id:"soft",title:"Use a very soft spring",detail:"Reduce spring stiffness.",response:"Arka: A spring that is too soft may oscillate for a long time.",metric:"k too small"},
   {id:"critical",title:"Tune critical damping",detail:"Set c = 2√(km) for a fast return without oscillation.",response:"Nara: A good compromise: vibration energy is absorbed quickly without repeated bouncing.",metric:"ζ = 1"},
   {id:"stiff",title:"Use the stiffest spring",detail:"Increase k to limit displacement.",response:"Pak Tono: Wouldn't that transmit more vibration straight to the seedlings?",metric:"Very high k"},
   {id:"none",title:"Remove the suspension",detail:"Attach the basket directly to the frame.",response:"Arka: That removes vibration isolation. Damage risk increases.",metric:"c = 0"},
   {id:"over",title:"Use excessive damping",detail:"Set damping far above critical.",response:"Nara: It won't oscillate, but the response may become too slow.",metric:"ζ > 1"}
  ],happy:"Critical damping returns the suspension to equilibrium quickly without repeated bouncing.",bad:"The damping is poorly tuned, causing persistent oscillation or a sluggish response. The test stops.",secret:"Spring and damping values are optimized for the basket mass and road profile."}
 ]
};
const TXT = {
 id:{eyebrow:"PHYSLAB / CASE STUDIES",title:"Studi Kasus",sub:"Pilih jalur belajar: membangun solusi atau membongkar bukti.",skip:"Lewati intro",pbl:"PROJECT-BASED LEARNING",rbl:"RESEARCH-BASED LEARNING",project:"Project: Civilization",projectDesc:"Empat chapter. Satu komunitas. Solusi fisika yang diuji di lapangan.",archive:"The Aetherium Archive",archiveDesc:"Arsip riset, pencocokan kurva, dan deduksi forensik.",open:"Masuk",back:"Kembali ke portal",start:"Mulai chapter",next:"Chapter berikutnya",retry:"Ulangi chapter",finish:"Uji rancangan",choose:"Pilih tindakanmu",parameters:"KONDISI EKSPERIMEN",sim:"KANVAS SIMULASI",chapter:"CHAPTER",result:"HASIL UJI",happy:"HAPPY ENDING",bad:"BAD ENDING",secret:"SECRET ENDING",continue:"Lanjutkan perjalanan",intro:"Kenalan dulu",tone:"Santai, analitis, dan selalu mencari solusi yang bisa dipakai warga.",researcher:"Nama investigator",enter:"Buka laboratorium",literature:"RAK ARSIP",lab:"FORENSIC CURVE-FITTER",deduction:"PAPAN DEDUKSI · TTS",angle:"Sudut gaya",spring:"Konstanta pegas k",damping:"Koefisien redaman c",match:"Kecocokan model",export:"Ekspor laporan",locked:"Selesaikan seluruh teka-teki untuk membuka Master Archive.",master:"MASTER ARCHIVE TERBUKA",crossword:"Isi jawaban tiap petunjuk. Semua 8 istilah harus tepat.",across:"MENDATAR",down:"MENURUN",complete:"Arsip terverifikasi 100%",name:"Nama tersimpan",progress:"Progres chapter",chapterDone:"Chapter selesai",allDone:"Seluruh chapter dituntaskan.",physics:"Model konseptual untuk pembelajaran; bukan sertifikasi keselamatan alat."},
 en:{eyebrow:"PHYSLAB / CASE STUDIES",title:"Case Studies",sub:"Choose your path: build a solution or investigate the evidence.",skip:"Skip intro",pbl:"PROJECT-BASED LEARNING",rbl:"RESEARCH-BASED LEARNING",project:"Project: Civilization",projectDesc:"Four chapters. One community. Physics solutions tested in the field.",archive:"The Aetherium Archive",archiveDesc:"Research records, curve fitting, and forensic deduction.",open:"Enter",back:"Back to portal",start:"Start chapter",next:"Next chapter",retry:"Retry chapter",finish:"Run the test",choose:"Choose your action",parameters:"EXPERIMENT CONDITIONS",sim:"SIMULATION CANVAS",chapter:"CHAPTER",result:"TEST RESULT",happy:"HAPPY ENDING",bad:"BAD ENDING",secret:"SECRET ENDING",continue:"Continue journey",intro:"Meet the characters",tone:"Casual, analytical, and focused on solutions that work for people.",researcher:"Investigator name",enter:"Open laboratory",literature:"ARCHIVE SHELF",lab:"FORENSIC CURVE-FITTER",deduction:"DEDUCTION BOARD · CROSSWORD",angle:"Force angle",spring:"Spring constant k",damping:"Damping coefficient c",match:"Model fit",export:"Export report",locked:"Solve every clue to unlock the Master Archive.",master:"MASTER ARCHIVE UNLOCKED",crossword:"Enter each clue answer. All 8 terms must be correct.",across:"ACROSS",down:"DOWN",complete:"Archive verified 100%",name:"Investigator saved",progress:"Chapter progress",chapterDone:"Chapter complete",allDone:"All chapters completed.",physics:"Conceptual learning model; not an equipment safety certification."}
};
const CLUES = [
 {id:"KINEMATIKA",group:"a",row:1,col:0,clue:{id:"Cabang yang mendeskripsikan gerak melalui posisi, lintasan, dan waktu tanpa terlebih dahulu menanyakan penyebabnya.",en:"The branch describing motion through position, trajectory, and time without first asking what causes it."}},
 {id:"DINAMIKA",group:"d",row:0,col:7,clue:{id:"Kajian yang menghubungkan perubahan gerak dengan interaksi penyebabnya.",en:"The study connecting changes in motion with the interactions that cause them."}},
 {id:"PERCEPATAN",group:"a",row:7,col:1,clue:{id:"Besaran yang menyatakan seberapa cepat vektor kecepatan berubah terhadap waktu.",en:"The quantity expressing how rapidly the velocity vector changes with time."}},
 {id:"KECEPATAN",group:"d",row:6,col:5,clue:{id:"Laju perubahan posisi yang tetap menyimpan informasi arah.",en:"The rate of change of position that retains directional information."}},
 {id:"MOMENTUM",group:"a",row:14,col:1,clue:{id:"Kuantitas gerak yang nilainya menggabungkan sifat kelembaman dan keadaan gerak benda.",en:"A quantity of motion combining an object's inertia and its state of motion."}},
 {id:"IMPULS",group:"d",row:13,col:8,clue:{id:"Akumulasi interaksi gaya selama selang waktu yang mengubah keadaan gerak.",en:"The accumulated effect of force over a time interval that changes motion."}},
 {id:"INERSIA",group:"a",row:18,col:4,clue:{id:"Kecenderungan suatu benda mempertahankan keadaan geraknya ketika resultan gaya nol.",en:"The tendency of an object to preserve its state of motion when net force is zero."}},
 {id:"ENERGI",group:"d",row:18,col:6,clue:{id:"Besaran skalar yang dapat berpindah atau berubah bentuk dan berkaitan dengan kemampuan melakukan usaha.",en:"A scalar quantity that can be transferred or transformed and is associated with the capacity to do work."}}
];
const LITERATURE = [
 {id:"01",title:{id:"Gerak dan kerangka acuan",en:"Motion and reference frames"},body:{id:"Gerak selalu dideskripsikan relatif terhadap kerangka acuan. Posisi adalah vektor; perpindahan merupakan perubahan posisi, bukan total panjang lintasan. Kecepatan rata-rata didefinisikan sebagai Δr/Δt, sedangkan kecepatan sesaat adalah limitnya ketika Δt mendekati nol.",en:"Motion is always described relative to a reference frame. Position is a vector; displacement is the change in position, not the total path length. Average velocity is Δr/Δt, while instantaneous velocity is its limit as Δt approaches zero."}},
 {id:"02",title:{id:"Percepatan dan dinamika",en:"Acceleration and dynamics"},body:{id:"Percepatan merupakan laju perubahan kecepatan. Hukum II Newton menyatakan ΣF = ma untuk massa konstan. Gaya resultan, bukan satu gaya yang berdiri sendiri, menentukan percepatan. Pada gerak melingkar, percepatan sentripetal mengubah arah kecepatan meskipun kelajuan dapat tetap.",en:"Acceleration is the rate of change of velocity. Newton's second law gives ΣF = ma for constant mass. Net force—not an isolated force—determines acceleration. In circular motion, centripetal acceleration changes the direction of velocity even when speed is constant."}},
 {id:"03",title:{id:"Momentum dan impuls",en:"Momentum and impulse"},body:{id:"Momentum linear p = mv. Impuls J = ∫F dt sama dengan perubahan momentum Δp. Pada sistem terisolasi, momentum total kekal jika resultan impuls eksternal nol. Luas di bawah kurva gaya terhadap waktu merepresentasikan impuls.",en:"Linear momentum is p = mv. Impulse J = ∫F dt equals the change in momentum Δp. In an isolated system, total momentum is conserved when net external impulse is zero. The area under a force-time curve represents impulse."}},
 {id:"04",title:{id:"Energi dan inersia",en:"Energy and inertia"},body:{id:"Teorema usaha-energi menyatakan usaha total sama dengan perubahan energi kinetik, W_net = ΔK. Energi mekanik dapat kekal ketika hanya gaya konservatif melakukan usaha. Inersia berkaitan dengan massa, sedangkan energi adalah besaran skalar yang dapat berpindah atau berubah bentuk.",en:"The work-energy theorem states that net work equals the change in kinetic energy, W_net = ΔK. Mechanical energy is conserved when only conservative forces do work. Inertia is associated with mass, while energy is a scalar quantity that can be transferred or transformed."}}
];
export default function StudiKasusPage(){
 const language=useBahasa() as Lang; const t=TXT[language]; const reduced=useReducedMotion();
 const { play } = useAudioSfx();
 const [typedDialogue,setTypedDialogue]=useState("");
 const typingTimer=useRef<number|undefined>(undefined);
 const [view,setView]=useState<"intro"|"portal"|"project"|"archive">("intro");
 const [chapter,setChapter]=useState(0); const [introDone,setIntroDone]=useState(false); const [stage,setStage]=useState<"NARRATIVE"|"CHOICE"|"SIMULATION"|"ENDING">("NARRATIVE"); const [dialogueStep,setDialogueStep]=useState(0); const [choice,setChoice]=useState<string|null>(null); const [outcome,setOutcome]=useState<"happy"|"bad"|"secret"|null>(null); const [completed,setCompleted]=useState<number[]>([]);
 const [investigator,setInvestigator]=useState(""); const [savedName,setSavedName]=useState(""); const [article,setArticle]=useState(0); const [readPages,setReadPages]=useState<number[]>([]); const [angle,setAngle]=useState(0); const [spring,setSpring]=useState(0); const [damping,setDamping]=useState(0); const [modelAdjusted,setModelAdjusted]=useState(false); const [answers,setAnswers]=useState<Record<string,string>>({});
 const dialogueLines = useMemo(() => language === "id" ? [
  "Sore, teman-teman. Gerobak hasil kebun harus sampai ke balai warga sebelum matahari tenggelam. Tapi jalannya tidak sesederhana kelihatannya.",
  "Arka: Kita bedah masalahnya pakai mekanika. Massa, gaya, gesekan, dan kondisi lintasan bakal menentukan strategi.",
  "Nara: Setuju. Tapi solusi terbaik bukan cuma hitungan yang benar—harus aman, masuk akal, dan membantu warga. Kita diskusikan dulu, baru ambil keputusan."
 ] : [
  "Good afternoon. The harvest cart must reach the community hall before sunset. The road is not as simple as it looks.",
  "Arka: Let's approach this with mechanics. Mass, force, friction, and terrain will determine our strategy.",
  "Nara: Agreed. But the best solution is not only mathematically correct—it must be safe, practical, and useful to the community. Let's discuss before deciding."
 ], [language]);
 const dialogueSpeakers = language === "id" ? ["Pak Tono", "Arka", "Nara"] : ["Mr. Tono", "Arka", "Nara"];
 useEffect(()=>{if(view!=="intro")return;const timer=window.setTimeout(()=>setView("portal"),3600);return()=>window.clearTimeout(timer);},[view]);
 useEffect(()=>{
  if(view!=="project" || introDone) { if(typingTimer.current!==undefined) window.clearInterval(typingTimer.current); return; }
  const line=dialogueLines[dialogueStep] ?? "";
  play("whoosh");
  setTypedDialogue("");
  if(reduced){setTypedDialogue(line);return;}
  let cursor=0;
  typingTimer.current=window.setInterval(()=>{
   cursor+=1;
   setTypedDialogue(line.slice(0,cursor));
   play("click");
   if(cursor>=line.length && typingTimer.current!==undefined){window.clearInterval(typingTimer.current);typingTimer.current=undefined;}
  },36);
  return ()=>{if(typingTimer.current!==undefined){window.clearInterval(typingTimer.current);typingTimer.current=undefined;}};
 },[view,introDone,dialogueStep,language,reduced,play,dialogueLines]);
 useEffect(()=>{
  if(view==="project" && introDone && (choice!==null || outcome!==null)) play("whoosh");
 },[view,introDone,choice,outcome,play]);
 const skipTyping=()=>{if(typingTimer.current!==undefined){window.clearInterval(typingTimer.current);typingTimer.current=undefined;}setTypedDialogue(dialogueLines[dialogueStep] ?? "");};
 const isTyping=typedDialogue.length < (dialogueLines[dialogueStep] ?? "").length;
 const chapters=CHAPTERS[language]; const current=chapters[chapter]; const selected=current?.choices.find(x=>x.id===choice);
 const responseSpeaker=selected?.response.match(/^(Pak Tono|Mr\. Tono|Arka|Nara):/)?.[1];
 const dialogueCharacter:CharacterId=outcome?"nara":responseSpeaker==="Pak Tono"||responseSpeaker==="Mr. Tono"?"tono":responseSpeaker==="Arka"?"arka":responseSpeaker==="Nara"?"nara":current?.avatar==="T"?"tono":current?.avatar==="A"?"arka":"nara";
 const dialogueSpeakerName=outcome?"Nara":responseSpeaker||current.speaker;
 const localizedDialogueSpeaker=dialogueSpeakerName==="Pak Tono"&&language==="en"?"Mr. Tono":dialogueSpeakerName;
 const dialogueMood:CharacterMood=outcome?(outcome==="bad"?"concerned":"happy"):choice?"thinking":"curious";
 const solved=CLUES.filter(x=>(answers[x.id]||"").replace(/\s/g,"").toLowerCase()===x.id.toLowerCase()).length;
 const zeta=spring>0?damping/(2*Math.sqrt(spring*12)):0; const calculatedFit=Math.max(0,100-Math.abs(angle-30)*.55-Math.abs(spring-120)*.12-Math.abs(zeta-1)*28); const fit=modelAdjusted?calculatedFit:0;
 const physicsReadout = (() => {
  const mass = chapter === 0
   ? selected?.id === "load" ? "110 kg" : "85 kg"
   : chapter === 1 ? "85 kg"
   : chapter === 2 ? "m₁ 18 kg · m₂ 20 kg"
   : "12 kg";
  const theta = chapter === 0
   ? selected?.id === "angle" ? "30°" : "0°"
   : chapter === 1 ? "35°" : "—";
  const forceStatus = !selected
   ? (language === "id" ? "Belum dipilih" : "Not selected")
   : stage === "SIMULATION" && outcome === "bad"
    ? (language === "id" ? "Tidak stabil" : "Unstable")
    : selected.id === current.optimal
     ? (language === "id" ? "Terkalibrasi" : "Calibrated")
     : (language === "id" ? "Perlu evaluasi" : "Needs review");
  return { mass, theta, forceStatus };
 })();
 const simulationState = { stage };
 useEffect(()=>{if(stage!=="SIMULATION")return;const timer=window.setTimeout(()=>setStage("ENDING"),1650);return()=>window.clearTimeout(timer);},[stage,chapter]);
 function resetChapter(){setChoice(null);setOutcome(null);setIntroDone(false);setDialogueStep(0);setStage("NARRATIVE");}
 function runTest(){if(!selected)return;const isBest=selected.id===current.optimal;const isSecret=isBest&&((chapter===0&&angle===30)||(chapter===1&&angle===35)||(chapter===2&&selected.id==="compound")||(chapter===3&&Math.abs(zeta-1)<.04));setStage("SIMULATION");setOutcome(isSecret?"secret":isBest?"happy":"bad");}
 function proceed(){play("whoosh");if(outcome==="bad"){resetChapter();return;}setCompleted(v=>v.includes(chapter)?v:[...v,chapter]);if(chapter<3){setChapter(chapter+1);resetChapter();}else setView("portal");}
 function exportReport(){const body=[`PHYSLAB — THE AETHERIUM ARCHIVE`,`Investigator: ${savedName}`,`Crossword: ${solved}/8`,`Force angle: ${angle}°`,`Spring constant: ${spring} N/m`,`Damping coefficient: ${damping} N·s/m`,`Damping ratio: ${zeta.toFixed(3)}`,`Curve fit: ${fit.toFixed(1)}%`,`Verified: ${new Date().toLocaleString()}`].join("\\n");const blob=new Blob([body],{type:"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="physlab-aetherium-report.txt";a.click();URL.revokeObjectURL(url);}
 return <div className="constellation-page civilization-page">
  <div className="cs-grain" aria-hidden="true"/>
  <AnimatePresence mode="wait">
   {view==="intro"&&<motion.section key="intro" className="cv-intro" initial={{opacity:0,scale:1.12}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.06}} transition={{duration:reduced ? 0.01 : 1.35}}><Starfield/><div className="cv-orbit"/><div className="cv-intro-copy"><span className="cv-eyebrow">{t.eyebrow}</span><h1>{t.title}<i>.</i></h1><p>{t.sub}</p><button className="cv-button" onClick={()=>setView("portal")}>{t.skip} ↗</button></div></motion.section>}
   {view==="portal"&&<motion.section key="portal" className="cv-portal" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0}}><header><span className="cv-eyebrow">{t.eyebrow}</span><h1>{t.title}<i>.</i></h1><p>{t.sub}</p></header><div className="cv-portals">
    <button className="cv-portal-card cv-civilization" data-sfx-local="true" onClick={()=>{play("whoosh");setView("project");setChapter(0);resetChapter();setIntroDone(false);setDialogueStep(0);}}><span className="cv-icon">✳</span><small>{t.pbl}</small><h2>{t.project}</h2><p>{t.projectDesc}</p><b>{t.open} <i>↗</i></b><div className="cv-constellation">✦　·　✧</div></button>
    <button className="cv-portal-card cv-aether" data-sfx-local="true" onClick={()=>{play("whoosh");setView("archive");}}><span className="cv-icon">⌘</span><small>{t.rbl}</small><h2>{t.archive}</h2><p>{t.archiveDesc}</p><b>{t.open} <i>↗</i></b><div className="cv-constellation">⌬　✧</div></button>
   </div><footer>PHYSLAB <i>×</i> {language==="id"?"RUANG EKSPEDISI":"EXPEDITION SPACE"} <span>{completed.length}/4 {language==="id"?"CHAPTER":"CHAPTERS"}</span></footer></motion.section>}
   {view==="project"&&<motion.section key="project" className="cv-project" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
    <div className="cv-topbar"><button onClick={()=>setView("portal")}>← {t.back}</button><span>{t.chapter} {chapter+1} / 4</span><div className="cv-progress">{[0,1,2,3].map(i=><i key={i} className={completed.includes(i)||i===chapter?"done":""}/>)}</div></div>
    {!introDone?<div className="cv-character-intro">
      <Starfield/>
      <span className="cv-eyebrow">{dialogueStep===0?(language==="id"?"PROLOG · SITUASI":"PROLOG · THE SITUATION"):(language==="id"?"DIALOG LAPANGAN":"FIELD DIALOGUE")}</span>
      <div className="cv-character-row cv-cast-stage">
       <CharacterPortrait key={`tono-${dialogueStep===0?"concerned":dialogueStep===1?"thinking":"happy"}`} character="tono" mood={dialogueStep===0?"concerned":dialogueStep===1?"thinking":"happy"}/>
       <CharacterPortrait key={`arka-${dialogueStep===0?"curious":dialogueStep===1?"thinking":"happy"}`} character="arka" mood={dialogueStep===0?"curious":dialogueStep===1?"thinking":"happy"}/>
       <CharacterPortrait key={`nara-${dialogueStep===0?"curious":dialogueStep===1?"happy":"thinking"}`} character="nara" mood={dialogueStep===0?"curious":dialogueStep===1?"happy":"thinking"}/>
      </div>
      <div className="cv-prolog-dialogue" aria-live="polite">
       <span>{dialogueSpeakers[dialogueStep]}</span>
       <p>{typedDialogue}{isTyping && <i className="cv-type-caret" aria-hidden="true"/>}</p>
      </div>
      <div className="cv-dialogue-actions">
       {isTyping && <button className="cv-skip-typing" onClick={skipTyping}>{language==="id"?"Lewati ketikan":"Skip typing"} ↯</button>}
       <button className="cv-button" data-sfx-local="true" onClick={()=>{if(isTyping){skipTyping();return;}play(dialogueStep<2?"whoosh":"chime");if(dialogueStep<2)setDialogueStep(v=>v+1);else {setIntroDone(true);setStage("CHOICE");}}}>{isTyping?(language==="id"?"Tampilkan semua":"Show all"):(dialogueStep<2?(language==="id"?"Lanjutkan dialog":"Continue dialogue"):(language==="id"?"Pilih strategi":"Choose a strategy"))} ↗</button>
      </div>
    </div>:
    <><div className="cv-chapter-heading"><span className="cv-eyebrow">{current.terrain}</span><h2>{current.title}</h2><p>{current.problem}</p></div>
    <div className="cv-workspace"><div className="cv-simulation"><div className="cv-simulation-stack">
     <div className={`cv-landscape scene-${chapter} ${outcome==="bad"?"failed":""}`}>
      <ChapterEnvironment chapter={chapter}/>
      <div className="cv-scene-atmosphere" aria-hidden="true"/>
      <div className={`cv-cart-stage ${outcome ? "has-result" : "awaiting-result"}`}>
       <CivilizationCart moving={simulationState.stage === "SIMULATION"} travelled={Boolean(outcome)} failed={outcome === "bad"}/>
      </div>
      <span className="cv-scene-tag">{t.sim} · {chapter === 0 ? "CITARIK" : chapter === 1 ? "PINE RIDGE" : chapter === 2 ? "VILLAGE DEPOT" : "RIVER BRIDGE"}</span>
     </div>
     <section className="cv-parameter-panel" role="status" aria-live="polite" aria-label={language === "id" ? "Parameter fisika simulasi" : "Simulation physics parameters"}>
      <div className="cv-parameter-panel-title">
       <span className="cv-parameter-indicator" aria-hidden="true"/>
       <b>{language === "id" ? "PARAMETER FISIKA" : "PHYSICS PARAMETERS"}</b>
      </div>
      <div className="cv-parameter-values">
       <span><small>{language === "id" ? "MASSA SISTEM" : "SYSTEM MASS"}</small><b>{physicsReadout.mass}</b></span>
       <span><small>{chapter === 0 ? (language === "id" ? "SUDUT GAYA" : "FORCE ANGLE") : (language === "id" ? "SUDUT KEMIRINGAN" : "INCLINE ANGLE")}</small><b>θ = {physicsReadout.theta}</b></span>
       <span><small>{language === "id" ? "GRAVITASI" : "GRAVITY"}</small><b>g = {language === "id" ? "9,81" : "9.81"} m/s²</b></span>
      </div>
      <div className="cv-parameter-force">
       <small>{language === "id" ? "STATUS GAYA" : "FORCE STATUS"}</small>
       <b><i aria-hidden="true"/>{physicsReadout.forceStatus}</b>
       <span>{selected?.metric || (language === "id" ? "Menunggu strategi" : "Awaiting strategy")}</span>
      </div>
     </section>
    </div></div>
     <div className="cv-dialogue"><div className="cv-dialogue-head"><CharacterPortrait key={`${dialogueCharacter}-${dialogueMood}`} character={dialogueCharacter} mood={dialogueMood} compact/><div><b>{localizedDialogueSpeaker}</b><small>{language==="id"?"Percakapan lapangan":"Field conversation"}</small></div><span className="cv-live-dot"/></div><p>{selected?selected.response:current.problem}</p>{outcome?<div className={`cv-outcome ${outcome}`}><b>{outcome==="secret"?(language==="id"?"SECRET / HAPPY ENDING":"SECRET / HAPPY ENDING"):outcome==="happy"?(language==="id"?"HAPPY ENDING":"HAPPY ENDING"):(language==="id"?"BAD ENDING":"BAD ENDING")}</b><p>{outcome==="secret"?current.secret:outcome==="bad"?current.bad:current.happy}</p><button className="cv-button" data-sfx="chime" onClick={proceed}>{outcome==="bad"?t.retry:chapter===3?t.continue:t.next} →</button></div>:<><h3>{t.choose}</h3><div className="cv-choice-list">{current.choices.map((c,i)=><button key={c.id} className={choice===c.id?"selected":""} data-sfx-local="true" onClick={()=>{play("chime");setChoice(c.id);}}><span><i>{String(i+1).padStart(2,"0")}</i><b>{c.title}</b><small>{c.detail}</small></span><em>↗</em></button>)}</div><button className="cv-button" data-sfx-local="true" disabled={!choice} onClick={()=>{play("chime");runTest();}}>{t.finish} →</button></>}</div>
    </div><p className="cv-disclaimer">{t.physics}</p></>}
   </motion.section>}
   {view==="archive"&&<motion.section key="archive" className="cv-archive" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
    <div className="cv-topbar"><button onClick={()=>setView("portal")}>← {t.back}</button><span>RBL / FORENSIC RESEARCH</span><span>{solved}/8</span></div>
    {!savedName?<div className="cv-name-gate"><span className="cv-eyebrow">ACCESS AUTHORIZATION</span><h2>{t.archive}</h2><p>{language==="id"?"Sebelum masuk, siapa investigator yang akan memimpin penyelidikan ini?":"Before entering, who will lead this investigation?"}</p><input value={investigator} onChange={e=>setInvestigator(e.target.value)} placeholder={t.researcher}/><button className="cv-button" disabled={!investigator.trim()} onClick={()=>setSavedName(investigator.trim())}>{t.enter} ↗</button></div>:
    <><div className="cv-archive-title"><span className="cv-eyebrow">INVESTIGATOR / {savedName.toUpperCase()}</span><h2>{t.archive}</h2><p>{language==="id"?"Baca catatan, cocokkan model, lalu pecahkan istilah kunci untuk membuka arsip utama.":"Read the records, fit the model, then solve the key terms to unlock the master archive."}</p></div>
    <div className="cv-archive-grid">
     <aside className="cv-panel cv-literature"><h3>{language==="id"?"PERPUSTAKAAN / VOLUME I":"LIBRARY / VOLUME I"}</h3><div className="cv-book-cover"><span>PHYSLAB · ARCHIVE EDITION</span><b>{language==="id"?"DASAR-DASAR MEKANIKA":"FOUNDATIONS OF MECHANICS"}</b><small>01 — 04 / RESEARCH NOTES</small></div><div className="cv-book-tabs">{LITERATURE.map((item,i)=><button key={item.id} className={article===i?"active":""} onClick={()=>setArticle(i)}><small>PAGE {item.id}</small><b>{item.title[language]}</b></button>)}</div><article className="cv-book-page" key={article}><small>{language==="id"?"LEMBAR ARSIP":"ARCHIVE LEAF"} · {article+1}/4</small><h4>{LITERATURE[article].title[language]}</h4><p>{LITERATURE[article].body[language]}</p><div className="cv-book-turn"><button data-sfx="whoosh" disabled={article===0} onClick={()=>setArticle(v=>v-1)}>← {language==="id"?"Sebelumnya":"Previous"}</button><button data-sfx="whoosh" disabled={article===3} onClick={()=>setArticle(v=>v+1)}>{language==="id"?"Berikutnya":"Next"} →</button></div><button className="cv-button" data-sfx="chime" disabled={readPages.includes(article)} onClick={()=>setReadPages(v=>v.includes(article)?v:[...v,article])}>{readPages.includes(article)?(language==="id"?"✓ LEMBAR DITANDAI DIBACA":"✓ PAGE MARKED READ"):(language==="id"?"Tandai lembar ini telah dibaca":"Mark this page as read")}</button></article><small className="cv-reading-progress">{readPages.length}/4 {language==="id"?"lembar telah dibaca":"pages read"}</small></aside>
     <section className="cv-panel cv-lab"><h3>{t.lab}</h3><div className="cv-fit-chart"><svg viewBox="0 0 520 220" role="img" aria-label="Theoretical curve compared with experimental data"><path d="M35 15V190H505" stroke="#485064" fill="none"/>{Array.from({length:8},(_,i)=><path key={i} d={`M35 ${25+i*22}H505`} stroke="#283143" strokeDasharray="3 6"/>)}<path d={`M35 170 C ${100+angle*.4} 20, ${220+spring*.35} 25, 505 ${150+zeta*10}`} stroke="#e89973" strokeWidth="3" fill="none"/><path d="M35 166 C100 65 180 40 260 75 S420 140 505 150" stroke="#93a9d7" strokeWidth="2" strokeDasharray="6 5" fill="none"/>{[0,1,2,3,4,5,6].map(i=><circle key={i} cx={70+i*65} cy={55+(i*37)%100} r="3.5" fill="#e7c6b6"/>)}</svg><div><span><i className="theory"/> {language==="id"?"Kurva teori":"Theory curve"}</span><span><i className="data"/> {language==="id"?"Data model":"Model data"}</span></div></div>
      <label>{t.angle} <b>{angle}°</b><input type="range" min="0" max="360" value={angle} onChange={e=>{setAngle(+e.target.value);setModelAdjusted(true);}}/></label>
      <label>{t.spring} <b>{spring} N/m</b><input type="range" min="0" max="300" value={spring} onChange={e=>{setSpring(+e.target.value);setModelAdjusted(true);}}/></label>
      <label>{t.damping} <b>{damping} N·s/m</b><input type="range" min="0" max="180" value={damping} onChange={e=>{setDamping(+e.target.value);setModelAdjusted(true);}}/></label>
      <div className="cv-fit-score"><span>{t.match}</span><strong>{fit.toFixed(1)}%</strong><small>{modelAdjusted?`ζ = ${zeta.toFixed(2)}`:(language==="id"?"Belum dikalibrasi":"Not calibrated")}</small></div>
     </section>
     <aside className="cv-panel cv-crossword"><h3>{t.deduction}</h3><p>{language==="id"?"Petunjuk konseptual — setiap jawaban berbagi huruf pada matriks yang sama.":"Conceptual clues — every answer shares letters in one connected grid."}</p>{readPages.length<4||!modelAdjusted||fit<85?<div className="cv-archive-prerequisite"><b>{language==="id"?"Akses deduksi terkunci":"Deduction access locked"}</b><p>{readPages.length<4?(language==="id"?"Baca keempat lembar buku terlebih dahulu.":"Read all four book pages first."):(language==="id"?(!modelAdjusted?"Geser parameter secara manual untuk memulai kalibrasi.":"Kalibrasikan model hingga kecocokan minimal 85%."):(!modelAdjusted?"Adjust the parameters manually to begin calibration.":"Calibrate the model to at least 85% fit."))}</p></div>:<>
      <div className="cv-crossword-board" aria-label="Matriks teka-teki silang terhubung">{Array.from({length:24},(_,r)=><div className="cv-crossword-row" key={r}>{Array.from({length:11},(_,c)=>{const letters=CLUES.flatMap(word=>Array.from(word.id).map((ch,i)=>({r:word.row+(word.group==="d"?i:0),c:word.col+(word.group==="d"?0:i),ch,word:word.id}))).filter(cell=>cell.r===r&&cell.c===c);if(!letters.length)return <span className="cv-crossword-empty" key={c}/>;const cell=letters[0];const word=CLUES.find(x=>x.id===cell.word)!;const answer=(answers[word.id]||"").replace(/\\s/g,"").toUpperCase();const index=word.group==="d"?r-word.row:c-word.col;return <span className="cv-crossword-cell" key={c}>{letters.length>1&&<i>✳</i>}{answer[index]||""}</span>;})}</div>)}</div>
      {(["a","d"] as const).map(group=><div className="cv-clue-group" key={group}><h4>{group==="a"?t.across:t.down}</h4>{CLUES.filter(x=>x.group===group).map((clue,i)=><label key={clue.id}><span>{i+1}. {clue.clue[language]}</span><input value={answers[clue.id]||""} onChange={e=>setAnswers(v=>({...v,[clue.id]:e.target.value.toUpperCase()}))} className={answers[clue.id]?(answers[clue.id].replace(/\\s/g,"").toUpperCase()===clue.id?"correct":""):""} placeholder="••••"/></label>)}</div>)}
      </>}
      <div className="cv-archive-progress"><span>{solved}/8 {language==="id"?"TERPECAHKAN":"SOLVED"}</span><i><b style={{width:`${solved/8*100}%`}}/></i></div>
      {solved===8?<div className="cv-master-open"><b>✧ {t.master}</b><p>{t.complete}</p><button className="cv-button" onClick={exportReport}>{t.export} ↓</button></div>:<p className="cv-locked-note">⌑ {t.locked}</p>}
     </aside>
    </div></>}
   </motion.section>}
  </AnimatePresence>
 </div>;
}
function Starfield(){return <div className="cv-stars" aria-hidden="true"><svg viewBox="0 0 1000 600"><g stroke="rgba(170,190,230,.2)" strokeDasharray="3 8" fill="none"><path d="M70 390 190 270 315 320 420 160 560 220 690 100 830 205 940 125M190 270 240 440 420 160"/></g>{Array.from({length:90},(_,i)=><circle key={i} cx={(i*137.5+31)%1000} cy={(i*83.7+19)%600} r={i%9===0?2:1} fill={i%5===0?"#e89973":"#dce8ff"}/>)}</svg></div>}
