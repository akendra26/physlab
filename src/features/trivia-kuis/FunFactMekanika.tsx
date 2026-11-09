import { useState } from "react";
import { DAFTAR_FUN_FACT_MEKANIKA } from "./dataFunFactMekanika";
import "./FunFactMekanika.css";

/** Buku digital berisi fakta singkat, konteks konsep, dan refleksi mekanika. */
export default function FunFactMekanika() {
  const [indeks, setIndeks] = useState(0);
  const [arahHalaman, setArahHalaman] = useState<"maju" | "mundur">("maju");
  const [sumberTerbuka, setSumberTerbuka] = useState(false);
  const fakta = DAFTAR_FUN_FACT_MEKANIKA[indeks];
  const total = DAFTAR_FUN_FACT_MEKANIKA.length;

  function pindahHalaman(arah: "maju" | "mundur") {
    setArahHalaman(arah);
    setSumberTerbuka(false);
    setIndeks((sebelumnya) =>
      arah === "maju"
        ? Math.min(total - 1, sebelumnya + 1)
        : Math.max(0, sebelumnya - 1),
    );
  }

  if (!fakta) return null;

  return (
    <section className="funfact-book-section" aria-labelledby="funfact-title">
      <header className="funfact-heading">
        <div>
          <p className="trivia-eyebrow">BUKU SAKU · MEKANIKA DALAM KEHIDUPAN</p>
          <h2 id="funfact-title">Fun Fact Mekanika</h2>
          <p>Balik halaman untuk menemukan kisah di balik gerak, gaya, dan rotasi yang sering kita jumpai.</p>
        </div>
        <div className="funfact-book-count">
          <strong>{String(indeks + 1).padStart(2, "0")}</strong>
          <span> / {String(total).padStart(2, "0")} HALAMAN</span>
        </div>
      </header>

      <div className="funfact-book-scene">
        <div className="funfact-book-spine" aria-hidden="true" />
        <div className="funfact-book-spread" key={fakta.id} data-turn={arahHalaman}>
          <aside className="funfact-left-page">
            <div className="funfact-page-topline">
              <span>PHYSLAB · CATATAN MEKANIKA</span>
              <span>{String(indeks + 1).padStart(2, "0")}</span>
            </div>
            <div className="funfact-chapter-mark" aria-hidden="true">
              <span>{fakta.simbol}</span>
              <i />
              <i />
            </div>
            <p className="funfact-kicker">{fakta.bagian.toUpperCase()}</p>
            <h3>{fakta.judul}</h3>
            <p className="funfact-person">{fakta.tokoh}</p>
            <div className="funfact-left-quote">
              <span>“</span>
              <p>Fenomena sederhana dapat menyimpan prinsip fisika yang mendalam.</p>
            </div>
            <div className="funfact-page-footer">
              <span>PHYSLAB FIELD NOTES</span>
              <span>{fakta.tahun}</span>
            </div>
          </aside>

          <article className="funfact-right-page">
            <div className="funfact-page-topline">
              <span>FAKTA MEKANIKA</span>
              <span>{fakta.tahun}</span>
            </div>
            <div className="funfact-right-content">
              <span className="funfact-stamp">TAHUKAH KAMU?</span>
              <h3>{fakta.judul}</h3>
              <p className="funfact-story">{fakta.fakta}</p>
              <div className="funfact-concept-box">
                <span>HUBUNGAN KONSEP</span>
                <p>{fakta.konsep}</p>
              </div>
              <div className="funfact-reflection">
                <span>RENUNGKAN</span>
                <p>{fakta.refleksi}</p>
              </div>
              <button
                className="funfact-source-toggle"
                type="button"
                onClick={() => setSumberTerbuka((terbuka) => !terbuka)}
                aria-expanded={sumberTerbuka}
              >
                {sumberTerbuka ? "Tutup sumber" : "Buka sumber bacaan"}
                <span aria-hidden="true">{sumberTerbuka ? "−" : "+"}</span>
              </button>
              {sumberTerbuka && (
                <a className="funfact-source-link" href={fakta.sumber} target="_blank" rel="noreferrer">
                  Baca referensi pendukung ↗
                </a>
              )}
            </div>
            <div className="funfact-page-footer">
              <span>JELAJAHI · PAHAMI · BUKTIKAN</span>
              <span>{indeks + 1}</span>
            </div>
          </article>
        </div>
      </div>

      <div className="funfact-book-controls">
        <button type="button" onClick={() => pindahHalaman("mundur")} disabled={indeks === 0}>
          <span aria-hidden="true">←</span> Halaman sebelumnya
        </button>
        <div className="funfact-progress" aria-label={`Halaman ${indeks + 1} dari ${total}`}>
          <div><span style={{ width: `${((indeks + 1) / total) * 100}%` }} /></div>
          <small>{Math.round(((indeks + 1) / total) * 100)}% dibaca</small>
        </div>
        <button type="button" onClick={() => pindahHalaman("maju")} disabled={indeks === total - 1}>
          Halaman berikutnya <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
