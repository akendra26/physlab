import { useState, type FormEvent } from "react";
import MathContent from "./MathContent";
import { useBahasa } from "../../i18n/BahasaContext";
import type {
  PercobaanJawaban,
  SoalProblemSet,
  TopikProblemSet,
} from "./dataProblemSet";

type ProblemSetWorkspaceProps = {
  topik: TopikProblemSet;
  indeksSoal: number;
  percobaan: Record<string, PercobaanJawaban>;
  onKembali: () => void;
  onPilihSoal: (indeks: number) => void;
  onPeriksa: (soal: SoalProblemSet, jawaban: string) => void;
};

export default function ProblemSetWorkspace({
  topik,
  indeksSoal,
  percobaan,
  onKembali,
  onPilihSoal,
  onPeriksa,
}: ProblemSetWorkspaceProps) {
  const en = useBahasa() === "en";
  const soal = topik.soal[indeksSoal];
  const percobaanAktif = percobaan[soal.id];
  const [jawabanIsian, setJawabanIsian] = useState(percobaanAktif?.jawaban ?? "");
  const [pembahasanTerbuka, setPembahasanTerbuka] = useState(false);

  const jumlahBenar = topik.soal.filter((item) => percobaan[item.id]?.benar).length;
  const hintsEn: Record<string,string[]> = {
    "gerobak-gerak-lurus":["In uniform motion, speed stays constant over the interval.","Relate initial velocity, acceleration, and elapsed time."],
    "gerak-parabola":["Combine horizontal velocity with the total flight time.","Use the vertical component of the initial velocity."],
    "dinamika-newton":["Use the relationship between net force, mass, and acceleration.","For upward acceleration, the normal force is greater than the weight."],
    "katrol-atwood":["The driving force is the difference between the two weights.","For a downward-accelerating elevator, the normal force is smaller than the weight."],
    "pegas-osilasi":["Angular frequency depends on spring stiffness and mass."],
    "lift-elevator":["For upward acceleration, the normal force exceeds the person's weight."],
    "usaha-energi":["Work is the component of force along the displacement multiplied by distance."],
    "momentum-impuls":["Momentum is the product of mass and velocity."]
  };
  const explanationsEn: Record<string,string[]> = {
    "gerobak-gerak-lurus":["Use Δx = vt = 12 × 5 = 60 m.","Use v = v₀ + at = 0 + 2.5 × 4 = 10 m/s."],
    "gerak-parabola":["Use R = v₀² sin(2θ)/g = 400 × 0.866 / 10 ≈ 34.6 m.","Use T = 2v₀ sin(θ)/g = 2 × 20 × 0.5 / 10 = 2 s."],
    "dinamika-newton":["Newton's second law gives a = F/m = 20/5 = 4 m/s².","For upward acceleration, N = m(g+a) = 60(10+2) = 720 N."],
    "katrol-atwood":["For an ideal Atwood machine, a = (m₁−m₂)g/(m₁+m₂) = 2 m/s².","For downward acceleration, N = m(g−a) = 50(10−2) = 400 N."],
    "pegas-osilasi":["The angular frequency is ω = √(k/m) = √(100/1) = 10 rad/s."],
    "lift-elevator":["The normal force is N = m(g+a) = 50(10+2) = 600 N."],
    "usaha-energi":["W = Fs cos(0°) = 20 × 3 = 60 J."],
    "momentum-impuls":["Momentum is p = mv = 2 × 5 = 10 kg·m/s."]
  };
  const tingkatEn = soal.tingkat === "Dasar" ? "Basic" : soal.tingkat === "Menengah" ? "Intermediate" : "Advanced";
  const referenceEn: Record<string,string> = {"gerobak-gerak-lurus":"Linear Motion","gerak-parabola":"Projectile Motion","dinamika-newton":"Newton's Laws","katrol-atwood":"Atwood Machine","pegas-osilasi":"Oscillations","lift-elevator":"Elevator Dynamics","usaha-energi":"Work & Energy","momentum-impuls":"Momentum & Impulse"};
  const titleEn: Record<string,string> = {"gerobak-gerak-lurus":"Cart & Linear Motion","gerak-parabola":"Projectile Motion","dinamika-newton":"Newtonian Dynamics","katrol-atwood":"Atwood Pulley","pegas-osilasi":"Springs & Oscillations","lift-elevator":"Lift / Elevator","usaha-energi":"Work & Energy","momentum-impuls":"Momentum & Impulse"};
  const promptEn: Record<string,string[]> = {
    "gerobak-gerak-lurus":["A vehicle moves in a straight line at a constant speed of 12 m/s. What is its displacement after 5 s?","An object starts from rest and accelerates uniformly at 2.5 m/s² for 4 s. Find its final velocity."],
    "gerak-parabola":["A projectile is launched at 20 m/s at 30° and lands at its launch height. With g = 10 m/s², find its horizontal range.","A projectile is launched at 20 m/s at 30°. With g = 10 m/s², find its total flight time when it returns to its initial height."],
    "dinamika-newton":["A 5 kg object experiences a horizontal net force of 20 N. Find its acceleration.","A 60 kg person stands in an elevator accelerating upward at 2 m/s². With g = 10 m/s², find the normal force."],
    "katrol-atwood":["Two masses of 3 kg and 2 kg are connected by a light rope over an ideal pulley. With g = 10 m/s², find the system acceleration.","A 50 kg person is in an elevator accelerating downward at 2 m/s². With g = 10 m/s², find the normal force."],
    "pegas-osilasi":["A spring with k = 100 N/m supports a 1 kg mass. Find its angular frequency."],
    "lift-elevator":["A 50 kg person is in an elevator accelerating upward at 2 m/s². With g = 10 m/s², find the normal force."],
    "usaha-energi":["A constant 20 N force moves an object 3 m in the force direction. Find the work done."],
    "momentum-impuls":["A 2 kg object moves at 5 m/s. Find its momentum."]
  };
  const progresTopik = Math.round((jumlahBenar / topik.soal.length) * 100);
  const umpanBalikSesuaiJawaban = soal.jenis === "pilihan-ganda"
    || percobaanAktif?.jawaban === jawabanIsian;

  function kirimIsian(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onPeriksa(soal, jawabanIsian);
  }

  return (
    <section className="ps-page ps-workspace-page" aria-labelledby="ps-workspace-title">
      <div className="ps-workspace-toolbar">
        <button className="ps-back-button" type="button" onClick={onKembali}>
          <span aria-hidden="true">←</span> {en ? "All chambers" : "Semua topik"}
        </button>
        <span className="ps-workspace-breadcrumb">PROBLEM SET <span>/</span> {topik.singkatan}</span>
      </div>

      <header className="ps-workspace-heading">
        <div>
          <p className="ps-eyebrow">{en ? "CHAMBER" : "TOPIK"} {String(topik.nomor).padStart(2, "0")} · {en ? (topik.bidang==="Kinematika"?"KINEMATICS":"DYNAMICS") : topik.bidang.toUpperCase()}</p>
          <h1 id="ps-workspace-title">{en ? titleEn[topik.id] : topik.judul}</h1>
          <p className="ps-description">{en ? "Solve structured physics problems and inspect the reasoning behind each result." : topik.deskripsi}</p>
        </div>
        <span className="ps-reference-badge">{en ? "Reference:" : "Rujukan:"} {en ? referenceEn[topik.id] : topik.referensiSimulasi}</span>
      </header>

      <div className="ps-workspace-progress">
        <div><span>{en ? "CHAMBER PROGRESS" : "PROGRES TOPIK"}</span><strong>{en ? `${jumlahBenar} of ${topik.soal.length} correct` : `${jumlahBenar} dari ${topik.soal.length} soal benar`}</strong></div>
        <div className="ps-overview-track"><span style={{ width: `${progresTopik}%` }} /></div>
      </div>

      <div className="ps-workspace-grid">
        <article className="ps-question-sheet">
          <div className="ps-question-header">
            <div>
              <span className="ps-question-kicker">{en ? "QUESTION SHEET" : "LEMBAR SOAL"} · {(en ? tingkatEn : soal.tingkat).toUpperCase()}</span>
              <h2>{en ? "Question" : "Soal"} {String(indeksSoal + 1).padStart(2, "0")}</h2>
            </div>
            <span className={`ps-question-type ${soal.jenis === "pilihan-ganda" ? "is-choice" : "is-short"}`}>
              {soal.jenis === "pilihan-ganda" ? en ? "Multiple choice" : "Pilihan ganda" : en ? "Short answer" : "Isian singkat"}
            </span>
          </div>

          <div className="ps-question-prompt">
            <MathContent>{en ? (promptEn[topik.id]?.[indeksSoal] ?? soal.pertanyaan) : soal.pertanyaan}</MathContent>
          </div>

          {soal.petunjuk && (
            <details className="ps-hint">
              <summary>{en ? "Show hint" : "Lihat petunjuk"}</summary>
              <p>{en ? (hintsEn[topik.id]?.[indeksSoal] ?? "Review the relevant physics principle.") : soal.petunjuk}</p>
            </details>
          )}

          {soal.jenis === "pilihan-ganda" ? (
            <div className="ps-options" role="group" aria-label={en ? "Answer options" : "Pilihan jawaban"}>
              {soal.opsi.map((opsi) => {
                const dipilih = percobaanAktif?.jawaban === opsi.id;
                const benar = percobaanAktif?.diperiksa && opsi.id === soal.jawabanBenar;
                const salah = percobaanAktif?.diperiksa && dipilih && !percobaanAktif.benar;
                return (
                  <button
                    key={opsi.id}
                    className={`ps-option ${dipilih ? "is-selected" : ""} ${benar ? "is-correct" : ""} ${salah ? "is-wrong" : ""}`}
                    type="button"
                    onClick={() => onPeriksa(soal, opsi.id)}
                    aria-pressed={dipilih}
                  >
                    <span className="ps-option-letter">{opsi.id}</span>
                    <span className="ps-option-text"><MathContent>{opsi.teks}</MathContent></span>
                    <span className="ps-option-indicator" aria-hidden="true">{benar ? "✓" : salah ? "×" : ""}</span>
                  </button>
                );
              })}
              <p className="ps-answer-note">{en ? "Choose one option. Your answer is checked automatically." : "Pilih salah satu opsi. Jawaban akan diperiksa secara otomatis."}</p>
            </div>
          ) : (
            <form className="ps-short-answer" onSubmit={kirimIsian}>
              <label htmlFor="ps-answer-input">{en ? "Your answer" : "Jawaban kamu"}</label>
              <div className="ps-input-row">
                <input
                  id="ps-answer-input"
                  type="text"
                  inputMode="decimal"
                  value={jawabanIsian}
                  onChange={(event) => setJawabanIsian(event.target.value)}
                  placeholder={en ? "Example: 12 or 12 m/s" : "Contoh: 12 atau 12 m/s"}
                  autoComplete="off"
                />
                <button className="ps-primary-button" data-sfx-local="true" type="submit" disabled={!jawabanIsian.trim()}>
                  {en ? "Check answer" : "Periksa jawaban"}
                </button>
              </div>
              <p className="ps-answer-note">{en ? "Use SI units when requested. Numerical tolerance is included in the answer data." : "Gunakan satuan SI jika diminta. Toleransi numerik dicantumkan pada kunci data soal."}</p>
            </form>
          )}

          {percobaanAktif?.diperiksa && umpanBalikSesuaiJawaban && (
            <div className={`ps-feedback ${percobaanAktif.benar ? "is-correct" : "is-wrong"}`} role="status" aria-live="polite">
              <span className="ps-feedback-icon" aria-hidden="true">{percobaanAktif.benar ? "✓" : "!"}</span>
              <div>
                <strong>{percobaanAktif.benar ? en ? "Correct answer!" : "Jawaban benar!" : en ? "Not quite, try again." : "Belum tepat, coba lagi."}</strong>
                <p>{percobaanAktif.benar ? en ? "Your result matches the answer key." : "Pemahamanmu sudah sesuai dengan kunci jawaban." : en ? "Review the concept, substitutions, and units." : "Periksa kembali konsep, substitusi angka, dan satuan yang digunakan."}</p>
              </div>
            </div>
          )}

          <div className="ps-explanation-actions">
            <button
              className="ps-secondary-button"
              type="button"
              onClick={() => setPembahasanTerbuka((terbuka) => !terbuka)}
            >
              {pembahasanTerbuka ? (en ? "Close explanation" : "Tutup pembahasan") : (en ? "Show explanation" : "Buka pembahasan")}
            </button>
            <span className="ps-answer-key-label">{en ? "ANSWER KEY AVAILABLE" : "KUNCI TERSEDIA"}</span>
          </div>

          {pembahasanTerbuka && (
            <section className="ps-explanation" aria-label={en ? "Solution explanation" : "Pembahasan soal"}>
              <p className="ps-eyebrow">{en ? "SOLUTION" : "PEMBAHASAN"}</p>
              <MathContent>{en ? (explanationsEn[topik.id]?.[indeksSoal] ?? soal.pembahasan) : soal.pembahasan}</MathContent>
              <div className="ps-final-answer">
                <span>{en ? "FINAL ANSWER" : "JAWABAN AKHIR"}</span>
                <MathContent>{soal.jawabanAkhir}</MathContent>
              </div>
            </section>
          )}

          <div className="ps-question-navigation">
            <button
              className="ps-secondary-button"
              type="button"
              onClick={() => onPilihSoal(Math.max(0, indeksSoal - 1))}
              disabled={indeksSoal === 0}
            >
              ← {en ? "Previous" : "Sebelumnya"}
            </button>
            <span>{indeksSoal + 1} / {topik.soal.length}</span>
            <button
              className="ps-primary-button"
              type="button"
              onClick={() => onPilihSoal(Math.min(topik.soal.length - 1, indeksSoal + 1))}
              disabled={indeksSoal === topik.soal.length - 1}
            >
              {en ? "Next" : "Selanjutnya"} →
            </button>
          </div>
        </article>

        <aside className="ps-question-sidebar">
          <section className="ps-side-card">
            <p className="ps-eyebrow">{en ? "QUESTION LIST" : "DAFTAR SOAL"}</p>
            <h3>{en ? "Question navigation" : "Navigasi latihan"}</h3>
            <div className="ps-question-list">
              {topik.soal.map((item, indeks) => {
                const status = percobaan[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`ps-question-nav-item ${indeks === indeksSoal ? "is-active" : ""} ${status?.benar ? "is-done" : ""}`}
                    onClick={() => onPilihSoal(indeks)}
                  >
                    <span>{String(indeks + 1).padStart(2, "0")}</span>
                    <span>{item.jenis === "pilihan-ganda" ? en ? "Multiple choice" : "Pilihan ganda" : en ? "Short answer" : "Isian singkat"}</span>
                    <span className="ps-question-nav-status">{status?.benar ? "✓" : status?.diperiksa ? "·" : "—"}</span>
                  </button>
                );
              })}
            </div>
          </section>
          <section className="ps-side-card ps-topic-facts">
            <p className="ps-eyebrow">{en ? "SUMMARY" : "RINGKASAN"}</p>
            <div><span>{en ? "Field" : "Bidang"}</span><strong>{en ? (topik.bidang==="Kinematika"?"Kinematics":"Dynamics") : topik.bidang}</strong></div>
            <div><span>{en ? "Questions" : "Jumlah soal"}</span><strong>{topik.soal.length}</strong></div>
            <div><span>{en ? "Estimated time" : "Estimasi"}</span><strong>{topik.estimasiMenit} {en ? "min" : "menit"}</strong></div>
            <div><span>{en ? "Correct answers" : "Terjawab benar"}</span><strong>{jumlahBenar}/{topik.soal.length}</strong></div>
          </section>
        </aside>
      </div>
    </section>
  );
}