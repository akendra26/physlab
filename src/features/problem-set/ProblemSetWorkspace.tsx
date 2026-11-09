import { useState, type FormEvent } from "react";
import MathContent from "./MathContent";
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
  const soal = topik.soal[indeksSoal];
  const percobaanAktif = percobaan[soal.id];
  const [jawabanIsian, setJawabanIsian] = useState(percobaanAktif?.jawaban ?? "");
  const [pembahasanTerbuka, setPembahasanTerbuka] = useState(false);

  const jumlahBenar = topik.soal.filter((item) => percobaan[item.id]?.benar).length;
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
          <span aria-hidden="true">←</span> Semua topik
        </button>
        <span className="ps-workspace-breadcrumb">PROBLEM SET <span>/</span> {topik.singkatan}</span>
      </div>

      <header className="ps-workspace-heading">
        <div>
          <p className="ps-eyebrow">TOPIK {String(topik.nomor).padStart(2, "0")} · {topik.bidang.toUpperCase()}</p>
          <h1 id="ps-workspace-title">{topik.judul}</h1>
          <p className="ps-description">{topik.deskripsi}</p>
        </div>
        <span className="ps-reference-badge">Rujukan: {topik.referensiSimulasi}</span>
      </header>

      <div className="ps-workspace-progress">
        <div><span>PROGRES TOPIK</span><strong>{jumlahBenar} dari {topik.soal.length} soal benar</strong></div>
        <div className="ps-overview-track"><span style={{ width: `${progresTopik}%` }} /></div>
      </div>

      <div className="ps-workspace-grid">
        <article className="ps-question-sheet">
          <div className="ps-question-header">
            <div>
              <span className="ps-question-kicker">LEMBAR SOAL · {soal.tingkat.toUpperCase()}</span>
              <h2>Soal {String(indeksSoal + 1).padStart(2, "0")}</h2>
            </div>
            <span className={`ps-question-type ${soal.jenis === "pilihan-ganda" ? "is-choice" : "is-short"}`}>
              {soal.jenis === "pilihan-ganda" ? "Pilihan ganda" : "Isian singkat"}
            </span>
          </div>

          <div className="ps-question-prompt">
            <MathContent>{soal.pertanyaan}</MathContent>
          </div>

          {soal.petunjuk && (
            <details className="ps-hint">
              <summary>Lihat petunjuk</summary>
              <p>{soal.petunjuk}</p>
            </details>
          )}

          {soal.jenis === "pilihan-ganda" ? (
            <div className="ps-options" role="group" aria-label="Pilihan jawaban">
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
              <p className="ps-answer-note">Pilih salah satu opsi. Jawaban akan diperiksa secara otomatis.</p>
            </div>
          ) : (
            <form className="ps-short-answer" onSubmit={kirimIsian}>
              <label htmlFor="ps-answer-input">Jawaban kamu</label>
              <div className="ps-input-row">
                <input
                  id="ps-answer-input"
                  type="text"
                  inputMode="decimal"
                  value={jawabanIsian}
                  onChange={(event) => setJawabanIsian(event.target.value)}
                  placeholder="Contoh: 12 atau 12 m/s"
                  autoComplete="off"
                />
                <button className="ps-primary-button" type="submit" disabled={!jawabanIsian.trim()}>
                  Periksa jawaban
                </button>
              </div>
              <p className="ps-answer-note">Gunakan satuan SI jika diminta. Toleransi numerik dicantumkan pada kunci data soal.</p>
            </form>
          )}

          {percobaanAktif?.diperiksa && umpanBalikSesuaiJawaban && (
            <div className={`ps-feedback ${percobaanAktif.benar ? "is-correct" : "is-wrong"}`} role="status" aria-live="polite">
              <span className="ps-feedback-icon" aria-hidden="true">{percobaanAktif.benar ? "✓" : "!"}</span>
              <div>
                <strong>{percobaanAktif.benar ? "Jawaban benar!" : "Belum tepat, coba lagi."}</strong>
                <p>{percobaanAktif.benar ? "Pemahamanmu sudah sesuai dengan kunci jawaban." : "Periksa kembali konsep, substitusi angka, dan satuan yang digunakan."}</p>
              </div>
            </div>
          )}

          <div className="ps-explanation-actions">
            <button
              className="ps-secondary-button"
              type="button"
              onClick={() => setPembahasanTerbuka((terbuka) => !terbuka)}
            >
              {pembahasanTerbuka ? "Tutup pembahasan" : "Buka pembahasan"}
            </button>
            <span className="ps-answer-key-label">KUNCI TERSEDIA</span>
          </div>

          {pembahasanTerbuka && (
            <section className="ps-explanation" aria-label="Pembahasan soal">
              <p className="ps-eyebrow">PEMBAHASAN</p>
              <MathContent>{soal.pembahasan}</MathContent>
              <div className="ps-final-answer">
                <span>JAWABAN AKHIR</span>
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
              ← Sebelumnya
            </button>
            <span>{indeksSoal + 1} / {topik.soal.length}</span>
            <button
              className="ps-primary-button"
              type="button"
              onClick={() => onPilihSoal(Math.min(topik.soal.length - 1, indeksSoal + 1))}
              disabled={indeksSoal === topik.soal.length - 1}
            >
              Selanjutnya →
            </button>
          </div>
        </article>

        <aside className="ps-question-sidebar">
          <section className="ps-side-card">
            <p className="ps-eyebrow">DAFTAR SOAL</p>
            <h3>Navigasi latihan</h3>
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
                    <span>{item.jenis === "pilihan-ganda" ? "Pilihan ganda" : "Isian singkat"}</span>
                    <span className="ps-question-nav-status">{status?.benar ? "✓" : status?.diperiksa ? "·" : "—"}</span>
                  </button>
                );
              })}
            </div>
          </section>
          <section className="ps-side-card ps-topic-facts">
            <p className="ps-eyebrow">RINGKASAN</p>
            <div><span>Bidang</span><strong>{topik.bidang}</strong></div>
            <div><span>Jumlah soal</span><strong>{topik.soal.length}</strong></div>
            <div><span>Estimasi</span><strong>{topik.estimasiMenit} menit</strong></div>
            <div><span>Terjawab benar</span><strong>{jumlahBenar}/{topik.soal.length}</strong></div>
          </section>
        </aside>
      </div>
    </section>
  );
}