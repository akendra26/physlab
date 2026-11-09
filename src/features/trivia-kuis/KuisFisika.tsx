import { useEffect, useMemo, useState } from "react";
import { BANK_SOAL_FISIKA, type SoalFisika } from "./dataKuis";

const KUNCI_NILAI_TERBAIK = "physlab-kuis-mekanika-konsep-terbaik-v2";

function acakArray<T>(daftar: readonly T[]): T[] {
  const hasil = [...daftar];
  for (let indeks = hasil.length - 1; indeks > 0; indeks -= 1) {
    const acak = Math.floor(Math.random() * (indeks + 1));
    [hasil[indeks], hasil[acak]] = [hasil[acak], hasil[indeks]];
  }
  return hasil;
}

function bacaNilaiTerbaik(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const tersimpan = window.localStorage.getItem(KUNCI_NILAI_TERBAIK);
    if (tersimpan === null) return null;
    const nilai = Number(tersimpan);
    return Number.isFinite(nilai) && nilai >= 0 && nilai <= 50 ? nilai : null;
  } catch {
    return null;
  }
}

function hitungSkor(jawaban: Record<string, number>, urutan: SoalFisika[]): number {
  return urutan.reduce((total, soal) =>
    total + (jawaban[soal.id] === soal.jawabanBenar ? 1 : 0), 0);
}

/** Kuis konsep mekanika: 50 soal diacak, feedback instan, dan nilai terbaik lokal. */
export default function KuisFisika() {
  const [urutanSoal, setUrutanSoal] = useState<SoalFisika[]>(() => acakArray(BANK_SOAL_FISIKA));
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [jawaban, setJawaban] = useState<Record<string, number>>({});
  const [selesai, setSelesai] = useState(false);
  const [nilaiTerbaik, setNilaiTerbaik] = useState<number | null>(bacaNilaiTerbaik);

  const jumlahSoal = urutanSoal.length;
  const soal = urutanSoal[indeksSoal];
  const jawabanDipilih = soal ? jawaban[soal.id] ?? null : null;
  const skor = useMemo(() => hitungSkor(jawaban, urutanSoal), [jawaban, urutanSoal]);
  const jumlahTerjawab = Object.keys(jawaban).length;
  const progres = (jumlahTerjawab / jumlahSoal) * 100;
  const jawabanBenar = jawabanDipilih !== null && jawabanDipilih === soal?.jawabanBenar;

  useEffect(() => {
    if (nilaiTerbaik === null) return;
    try {
      window.localStorage.setItem(KUNCI_NILAI_TERBAIK, String(nilaiTerbaik));
    } catch {
      // Kuis tetap berjalan jika penyimpanan browser dinonaktifkan.
    }
  }, [nilaiTerbaik]);

  function pilihJawaban(indeks: number) {
    if (!soal || jawabanDipilih !== null) return;
    setJawaban((sebelumnya) => ({ ...sebelumnya, [soal.id]: indeks }));
  }

  function lanjutkan() {
    if (jawabanDipilih === null) return;
    if (indeksSoal === jumlahSoal - 1) {
      setNilaiTerbaik((sebelumnya) => sebelumnya === null ? skor : Math.max(sebelumnya, skor));
      setSelesai(true);
      return;
    }
    setIndeksSoal((sebelumnya) => sebelumnya + 1);
  }

  function ulangiKuis(acakUlang = true) {
    setUrutanSoal(acakUlang ? acakArray(BANK_SOAL_FISIKA) : [...BANK_SOAL_FISIKA]);
    setIndeksSoal(0);
    setJawaban({});
    setSelesai(false);
  }

  if (selesai) {
    const nilaiAkhir = Math.round((skor / jumlahSoal) * 100);
    const pesan = nilaiAkhir >= 85
      ? "Luar biasa! Pemahaman konsep mekanikamu sangat kuat."
      : nilaiAkhir >= 65
        ? "Bagus! Tinjau kembali penjelasan pada konsep yang masih tertukar."
        : "Terus berlatih. Gunakan pembahasan untuk membangun intuisi fisikamu.";

    return (
      <section className="quiz-shell quiz-summary quiz-konsep-summary" aria-live="polite">
        <div className="summary-orbit" aria-hidden="true"><span>φ</span></div>
        <p className="trivia-eyebrow">SESI 50 SOAL SELESAI</p>
        <h2>Jejak pemahaman mekanikamu</h2>
        <p className="trivia-muted">Semua soal konsep dan trivia mekanika telah kamu selesaikan.</p>
        <div className="summary-score-ring" aria-label={`Nilai ${nilaiAkhir} dari 100`}>
          <strong>{nilaiAkhir}</strong><span>/ 100</span>
        </div>
        <div className="summary-score-line"><span>Jawaban benar</span><strong>{skor} dari {jumlahSoal}</strong></div>
        <div className="summary-score-line"><span>Jawaban perlu ditinjau</span><strong>{jumlahSoal - skor}</strong></div>
        <div className="summary-score-line"><span>Nilai terbaik tersimpan</span><strong>{nilaiTerbaik ?? skor} dari 50</strong></div>
        <p className="summary-message">{pesan}</p>
        <button className="trivia-primary-button" type="button" onClick={() => ulangiKuis(true)}>
          <span aria-hidden="true">↻</span> Acak dan ulangi 50 soal
        </button>
      </section>
    );
  }

  if (!soal) return null;

  return (
    <section className="quiz-layout quiz-konsep-layout" aria-labelledby="judul-kuis">
      <div className="quiz-main-column">
        <div className="quiz-topline">
          <span className="quiz-topic quiz-topic-konsep">{soal.topik}</span>
          <span className="quiz-number">SOAL {String(indeksSoal + 1).padStart(2, "0")} / {String(jumlahSoal).padStart(2, "0")}</span>
        </div>

        <div className="quiz-progress-track" aria-label={`Kemajuan ${Math.round(progres)} persen`}>
          <span style={{ width: `${progres}%` }} />
        </div>

        <div className="quiz-konsep-meta">
          <span>{soal.jenis === "trivia" ? "TRIVIA MEKANIKA" : "KONSEP FISIKA"}</span>
          <span>{jumlahTerjawab} TERJAWAB · {jumlahSoal - jumlahTerjawab} TERSISA</span>
        </div>

        <div className="quiz-question-block">
          <p className="trivia-eyebrow">PILIH PERNYATAAN PALING TEPAT</p>
          <h2 id="judul-kuis">{soal.pertanyaan}</h2>
          <p className="quiz-instruction">Pilih satu jawaban. Penjelasan konsep akan muncul segera setelah pilihanmu dibuat.</p>
        </div>

        <div className="quiz-options" role="group" aria-label="Pilihan jawaban">
          {soal.pilihan.map((pilihan, indeks) => {
            const dipilih = jawabanDipilih === indeks;
            const merupakanJawaban = indeks === soal.jawabanBenar;
            let kelas = "quiz-option";
            if (jawabanDipilih !== null && merupakanJawaban) kelas += " quiz-option-correct";
            else if (dipilih) kelas += " quiz-option-wrong";
            else if (jawabanDipilih !== null) kelas += " quiz-option-muted";

            return (
              <button
                className={kelas}
                type="button"
                key={`${soal.id}-${indeks}`}
                onClick={() => pilihJawaban(indeks)}
                disabled={jawabanDipilih !== null}
                aria-pressed={dipilih}
              >
                <span className="quiz-option-letter">{String.fromCharCode(65 + indeks)}</span>
                <span>{pilihan}</span>
                {jawabanDipilih !== null && merupakanJawaban && <span className="quiz-option-mark" aria-label="Jawaban benar">✓</span>}
                {dipilih && !merupakanJawaban && <span className="quiz-option-mark" aria-label="Jawaban dipilih">×</span>}
              </button>
            );
          })}
        </div>

        {jawabanDipilih !== null && (
          <div className={`quiz-feedback ${jawabanBenar ? "feedback-correct" : "feedback-incorrect"}`} aria-live="polite">
            <div className="feedback-heading">
              <span className="feedback-icon" aria-hidden="true">{jawabanBenar ? "✓" : "i"}</span>
              <strong>{jawabanBenar ? "Tepat sekali!" : "Belum tepat, mari pahami konsepnya."}</strong>
            </div>
            <p>{soal.pembahasan}</p>
          </div>
        )}

        <div className="quiz-footer-row">
          <span className="quiz-score-live"><span aria-hidden="true">✦</span> Skor sementara <strong>{skor}<small> / {jumlahSoal}</small></strong></span>
          <button className="trivia-primary-button" type="button" onClick={lanjutkan} disabled={jawabanDipilih === null}>
            {indeksSoal === jumlahSoal - 1 ? "Lihat Hasil" : "Soal Berikutnya"}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <aside className="quiz-side-card quiz-konsep-side-card">
        <div className="quiz-side-art" aria-hidden="true">
          <span className="quiz-art-orbit orbit-one" />
          <span className="quiz-art-orbit orbit-two" />
          <span className="quiz-art-core">ΣF</span>
          <span className="quiz-art-particle particle-one" />
          <span className="quiz-art-particle particle-two" />
        </div>
        <p className="trivia-eyebrow">PETA BELAJAR</p>
        <h3>50 soal konseptual</h3>
        <p>Latihan ini menilai intuisi fisika, bukan kecepatan menghitung. Urutan soal diacak setiap kali sesi dimulai.</p>
        <div className="quiz-topic-list">
          <span><i className="topic-dot topic-dot-mint" /> Kinematika <strong>12 soal</strong></span>
          <span><i className="topic-dot topic-dot-blue" /> Parabola & melingkar <strong>9 soal</strong></span>
          <span><i className="topic-dot topic-dot-mint" /> Newton & momentum <strong>14 soal</strong></span>
          <span><i className="topic-dot topic-dot-blue" /> Atwood, lift & benda tegar <strong>11 soal</strong></span>
          <span><i className="topic-dot topic-dot-mint" /> Trivia mekanika <strong>4 soal</strong></span>
        </div>
        <div className="quiz-side-score">
          <span>Skor saat ini</span>
          <strong>{skor}<small> / {jumlahSoal}</small></strong>
        </div>
        <div className="quiz-side-score quiz-side-answered">
          <span>Progres sesi</span>
          <strong>{jumlahTerjawab}<small> / {jumlahSoal}</small></strong>
        </div>
      </aside>
    </section>
  );
}
