import { useState } from "react";
import MathContent from "./MathContent";
import type {
  PercobaanJawaban,
  TopikProblemSet,
} from "./dataProblemSet";

type ProblemSetWorkspaceProps = {
  topik: TopikProblemSet;
  indeksSoal: number;
  drafJawaban: Record<string, string>;
  percobaan: Record<string, PercobaanJawaban>;
  sudahDikumpulkan: boolean;
  onKembali: () => void;
  onPilihSoal: (indeks: number) => void;
  onUbahDraf: (soalId: string, jawaban: string) => void;
  onKumpulkan: () => void;
  onUlangi: () => void;
};

export default function ProblemSetWorkspace({
  topik,
  indeksSoal,
  drafJawaban,
  percobaan,
  sudahDikumpulkan,
  onKembali,
  onPilihSoal,
  onUbahDraf,
  onKumpulkan,
  onUlangi,
}: ProblemSetWorkspaceProps) {
  const soal = topik.soal[indeksSoal];
  const jawabanAktif = drafJawaban[soal.id] ?? "";
  const [konfirmasiUlangi, setKonfirmasiUlangi] = useState(false);

  const jumlahTerisi = topik.soal.filter((item) => (drafJawaban[item.id] ?? "").trim()).length;
  const jumlahBenar = sudahDikumpulkan
    ? topik.soal.filter((item) => percobaan[item.id]?.benar).length
    : 0;
  const progresTopik = Math.round((jumlahTerisi / topik.soal.length) * 100);

  function simpanPilihan(opsiId: string) {
    if (!sudahDikumpulkan) onUbahDraf(soal.id, opsiId);
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
        <div>
          <span>{sudahDikumpulkan ? "HASIL TOPIK" : "PROGRES PENGISIAN"}</span>
          <strong>
            {sudahDikumpulkan
              ? `${jumlahBenar} dari ${topik.soal.length} jawaban benar`
              : `${jumlahTerisi} dari ${topik.soal.length} soal terisi`}
          </strong>
        </div>
        <div className="ps-overview-track">
          <span style={{ width: `${sudahDikumpulkan ? (jumlahBenar / topik.soal.length) * 100 : progresTopik}%` }} />
        </div>
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

          <div className="ps-question-prompt"><MathContent>{soal.pertanyaan}</MathContent></div>

          {soal.petunjuk && !sudahDikumpulkan && (
            <details className="ps-hint">
              <summary>Lihat petunjuk</summary>
              <p>{soal.petunjuk}</p>
            </details>
          )}

          {soal.jenis === "pilihan-ganda" ? (
            <div className="ps-options" role="group" aria-label="Pilihan jawaban">
              {soal.opsi.map((opsi) => {
                const dipilih = jawabanAktif === opsi.id;
                const percobaanSoal = percobaan[soal.id];
                const benar = sudahDikumpulkan && opsi.id === soal.jawabanBenar;
                const salah = sudahDikumpulkan && dipilih && !percobaanSoal?.benar;
                return (
                  <button
                    key={opsi.id}
                    className={`ps-option ${dipilih ? "is-selected" : ""} ${benar ? "is-correct" : ""} ${salah ? "is-wrong" : ""}`}
                    type="button"
                    onClick={() => simpanPilihan(opsi.id)}
                    disabled={sudahDikumpulkan}
                    aria-pressed={dipilih}
                  >
                    <span className="ps-option-letter">{opsi.id}</span>
                    <span className="ps-option-text"><MathContent>{opsi.teks}</MathContent></span>
                    {sudahDikumpulkan && <span className="ps-option-indicator">{benar ? "✓" : salah ? "×" : ""}</span>}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="ps-short-answer">
              <label htmlFor="ps-answer-input">Jawaban kamu</label>
              <div className="ps-input-row">
                <input
                  id="ps-answer-input"
                  type="text"
                  inputMode="decimal"
                  value={jawabanAktif}
                  onChange={(event) => onUbahDraf(soal.id, event.target.value)}
                  placeholder="Contoh: 12 atau 12 m/s"
                  autoComplete="off"
                  disabled={sudahDikumpulkan}
                />
              </div>
            </div>
          )}

          {!sudahDikumpulkan && (
            <p className="ps-answer-note">
              Jawaban belum dinilai. Kerjakan semua soal dalam topik ini, lalu tekan <strong>Kumpulkan semua jawaban</strong>.
            </p>
          )}

          {sudahDikumpulkan && (
            <>
              <div className={`ps-feedback ${percobaan[soal.id]?.benar ? "is-correct" : "is-wrong"}`} role="status">
                <span className="ps-feedback-icon">{percobaan[soal.id]?.benar ? "✓" : "!"}</span>
                <div>
                  <strong>{percobaan[soal.id]?.benar ? "Jawaban benar!" : "Jawaban belum tepat."}</strong>
                  <p>{percobaan[soal.id]?.benar ? "Bagus! Jawabanmu sesuai dengan kunci." : `Jawaban yang kamu kumpulkan: ${percobaan[soal.id]?.jawaban || "—"}`}</p>
                </div>
              </div>
              <section className="ps-explanation" aria-label="Pembahasan soal">
                <p className="ps-eyebrow">PEMBAHASAN</p>
                <MathContent>{soal.pembahasan}</MathContent>
                <div className="ps-final-answer">
                  <span>JAWABAN AKHIR</span>
                  <MathContent>{soal.jawabanAkhir}</MathContent>
                </div>
              </section>
            </>
          )}

          <div className="ps-question-navigation">
            <button className="ps-secondary-button" type="button" onClick={() => onPilihSoal(Math.max(0, indeksSoal - 1))} disabled={indeksSoal === 0}>
              ← Sebelumnya
            </button>
            <span>{indeksSoal + 1} / {topik.soal.length}</span>
            <button className="ps-primary-button" type="button" onClick={() => onPilihSoal(Math.min(topik.soal.length - 1, indeksSoal + 1))} disabled={indeksSoal === topik.soal.length - 1}>
              Selanjutnya →
            </button>
          </div>

          {!sudahDikumpulkan ? (
            <div className="ps-submit-panel">
              <div>
                <strong>{jumlahTerisi === topik.soal.length ? "Semua soal sudah terisi." : `${topik.soal.length - jumlahTerisi} soal belum dijawab.`}</strong>
                <p>Nilai dan pembahasan seluruh soal akan muncul setelah dikumpulkan.</p>
              </div>
              <button className="ps-primary-button" type="button" onClick={onKumpulkan} disabled={jumlahTerisi !== topik.soal.length}>
                Kumpulkan semua jawaban
              </button>
            </div>
          ) : (
            <div className="ps-submit-panel is-submitted">
              <div>
                <strong>Topik telah dikumpulkan · Nilai {jumlahBenar}/{topik.soal.length}</strong>
                <p>Pembahasan sudah terbuka. Kamu bisa meninjau semua soal atau mengulang topik ini.</p>
              </div>
              <button className="ps-secondary-button" type="button" onClick={() => setKonfirmasiUlangi(true)}>
                Retake topik
              </button>
            </div>
          )}
          {konfirmasiUlangi && (
            <div className="ps-retake-confirm" role="alertdialog" aria-label="Konfirmasi retake">
              <span>Ulangi topik ini? Jawaban dan nilai percobaan sebelumnya untuk topik ini akan direset.</span>
              <div>
                <button className="ps-secondary-button" type="button" onClick={() => setKonfirmasiUlangi(false)}>Batal</button>
                <button className="ps-primary-button" type="button" onClick={() => { setKonfirmasiUlangi(false); onUlangi(); }}>Ya, retake</button>
              </div>
            </div>
          )}
        </article>

        <aside className="ps-question-sidebar">
          <section className="ps-side-card">
            <p className="ps-eyebrow">DAFTAR SOAL</p>
            <h3>{sudahDikumpulkan ? "Hasil pengerjaan" : "Navigasi latihan"}</h3>
            <div className="ps-question-list">
              {topik.soal.map((item, indeks) => {
                const terisi = Boolean((drafJawaban[item.id] ?? "").trim());
                const status = percobaan[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`ps-question-nav-item ${indeks === indeksSoal ? "is-active" : ""} ${sudahDikumpulkan && status?.benar ? "is-done" : ""}`}
                    onClick={() => onPilihSoal(indeks)}
                  >
                    <span>{String(indeks + 1).padStart(2, "0")}</span>
                    <span>{item.jenis === "pilihan-ganda" ? "Pilihan ganda" : "Isian singkat"}</span>
                    <span className="ps-question-nav-status">{sudahDikumpulkan ? (status?.benar ? "✓" : "×") : (terisi ? "●" : "—")}</span>
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
            <div><span>{sudahDikumpulkan ? "Nilai" : "Terisi"}</span><strong>{sudahDikumpulkan ? `${jumlahBenar}/${topik.soal.length}` : `${jumlahTerisi}/${topik.soal.length}`}</strong></div>
          </section>
        </aside>
      </div>
    </section>
  );
}
