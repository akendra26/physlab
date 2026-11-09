import { useState } from "react";
import { PERISTIWA_SEJARAH } from "./dataTrivia";

/** Timeline kartu yang dapat dibuka untuk membaca konteks sejarah lebih lengkap. */
export default function TriviaTimeline() {
  const [kartuTerbuka, setKartuTerbuka] = useState<number | null>(0);

  return (
    <section className="trivia-section" aria-labelledby="judul-timeline">
      <div className="trivia-section-heading">
        <div>
          <p className="trivia-eyebrow">JEJAK PERKEMBANGAN ILMU</p>
          <h2 id="judul-timeline">Dari lintasan hingga hukum gerak</h2>
          <p className="trivia-muted">
            Buka setiap peristiwa untuk melihat bagaimana eksperimen dan gagasan membentuk fisika klasik.
          </p>
        </div>
        <span className="trivia-count">{PERISTIWA_SEJARAH.length} CATATAN</span>
      </div>

      <div className="history-timeline">
        {PERISTIWA_SEJARAH.map((peristiwa, indeks) => {
          const terbuka = kartuTerbuka === indeks;
          return (
            <article className={`history-item history-${peristiwa.warna}`} key={`${peristiwa.tahun}-${peristiwa.judul}`}>
              <div className="history-marker" aria-hidden="true">
                <span>{String(indeks + 1).padStart(2, "0")}</span>
              </div>
              <div className={`history-card ${terbuka ? "history-card-open" : ""}`}>
                <button
                  className="history-card-trigger"
                  type="button"
                  onClick={() => setKartuTerbuka(terbuka ? null : indeks)}
                  aria-expanded={terbuka}
                >
                  <span className="history-card-topline">
                    <span className="history-year">{peristiwa.tahun}</span>
                    <span className="history-category">{peristiwa.kategori}</span>
                  </span>
                  <span className="history-card-title-row">
                    <span className="history-glyph" aria-hidden="true">{peristiwa.simbol}</span>
                    <span className="history-card-title-wrap">
                      <strong>{peristiwa.judul}</strong>
                      <small>{peristiwa.tokoh}</small>
                    </span>
                    <span className={`history-chevron ${terbuka ? "is-open" : ""}`} aria-hidden="true">⌄</span>
                  </span>
                  <span className="history-summary">{peristiwa.ringkasan}</span>
                </button>

                {terbuka && (
                  <div className="history-detail">
                    <p>{peristiwa.detail}</p>
                    {peristiwa.rumus && <div className="history-formula">{peristiwa.rumus}</div>}
                    <div className="history-sources">
                      <span className="history-source-label">BACA SUMBER</span>
                      {peristiwa.sumber.map((sumber) => (
                        <a href={sumber.url} key={sumber.url} target="_blank" rel="noreferrer">
                          {sumber.label}<span aria-hidden="true"> ↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <p className="history-note">
        Catatan: perkembangan fisika merupakan hasil kerja banyak ilmuwan. Tanggal tertentu pada sejarah sains
        kadang merujuk pada eksperimen, catatan, atau tahun penerbitan yang berbeda.
      </p>
    </section>
  );
}