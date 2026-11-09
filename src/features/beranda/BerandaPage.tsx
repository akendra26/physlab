
type BerandaPageProps = {
  onMulaiSimulasi: () => void;
  onEksplorasiStudiKasus: () => void;
  onPilihTrivia: () => void;
  onPilihProblemSet: () => void;
};

function BentangLangit() {
  return (
    <div className="hero-landscape" aria-hidden="true">
      <div className="hero-horizon-glow" />

      <svg
        className="hero-mountains hero-mountains-back"
        viewBox="0 0 1600 430"
        preserveAspectRatio="none"
      >
        <path d="
          M0 255 95 221 180 243 282 172
          365 214 466 147 556 224 645 184
          752 244 856 156 958 219 1058 145
          1168 233 1273 177 1378 222
          1484 156 1600 222V430H0Z
        " />
      </svg>

      <svg
        className="hero-mountains hero-mountains-front"
        viewBox="0 0 1600 430"
        preserveAspectRatio="none"
      >
        <path d="
          M0 278 120 248 218 286 337 225
          451 276 565 245 682 303 811 246
          925 293 1042 237 1160 279
          1282 229 1397 268 1504 221
          1600 251V430H0Z
        " />
      </svg>

      <div className="hero-observer">
        <span className="observer-head" />
        <span className="observer-body" />
        <span className="observer-leg observer-leg-left" />
        <span className="observer-leg observer-leg-right" />
      </div>

      <div className="hero-observer-rock" />
      <div className="hero-ground" />
    </div>
  );
}

export default function BerandaPage({
  onMulaiSimulasi,
  onEksplorasiStudiKasus,
  onPilihTrivia,
  onPilihProblemSet,
}: BerandaPageProps) {
  return (
    <div className="home-page">

      {/* HERO SECTION */}

      <section
        className="home-hero"
        aria-labelledby="home-title"
      >
        <div className="hero-sky-layer" aria-hidden="true">
          <div className="hero-nebula" />

          <div className="hero-stars hero-stars-one" />
          <div className="hero-stars hero-stars-two" />
          <div className="hero-stars hero-stars-three" />

          <div className="hero-galaxy-band" />
          <div className="hero-moon-glow" />
        </div>

        <div className="hero-content">

          <div className="hero-overline">
            <span className="hero-overline-line" />

            <span>
              LABORATORIUM FISIKA INTERAKTIF
            </span>

            <span className="hero-overline-line" />
          </div>

          <p className="hero-pretitle">
            BELAJAR · MENJELAJAH · MENEMUKAN
          </p>

          <h1 id="home-title">
            Semesta punya <em>hukum.</em>
            <br />
            Mari kita <span>jelajahi.</span>
          </h1>

          <p className="hero-description">
            Dari lintasan sebuah benda hingga rahasia
            gaya yang menggerakkannya. Temukan fisika
            melalui simulasi, eksperimen, dan tantangan
            interaktif.
          </p>

          <div className="hero-actions">

            <button
              className="hero-button hero-button-primary"
              type="button"
              onClick={onMulaiSimulasi}
            >
              Mulai Simulasi
              <span aria-hidden="true">↗</span>
            </button>

            <button
              className="hero-button hero-button-secondary"
              type="button"
              onClick={onEksplorasiStudiKasus}
            >
              Eksplorasi Studi Kasus
              <span aria-hidden="true">→</span>
            </button>

          </div>

          <div className="hero-bottom-meta">
            <span>
              <i className="meta-dot meta-dot-mint" />
              KINEMATIKA &amp; DINAMIKA
            </span>

            <span>
              <i className="meta-dot meta-dot-blue" />
              LABORATORIUM VIRTUAL
            </span>

            <span>
              <i className="meta-dot meta-dot-orange" />
              KELAS XI SMA
            </span>
          </div>

        </div>

        {/* DEKORASI PERSAMAAN */}

        <div
          className="hero-formula hero-formula-left"
          aria-hidden="true"
        >
          <span>Δx</span>
          <small>────</small>
          <span>Δt</span>
          <i>v =</i>
        </div>

        <div
          className="hero-formula hero-formula-right"
          aria-hidden="true"
        >
          <span>ΣF = ma</span>
          <small>NEWTON · 1687</small>
        </div>

        <BentangLangit />

        <button
          className="hero-scroll-cue"
          type="button"
          onClick={() =>
            document
              .getElementById("ruang-belajar")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <span className="scroll-cue-wheel" />
          <span>JELAJAHI PHYSLAB</span>
          <span className="scroll-cue-arrow">↓</span>
        </button>

      </section>

      {/* PILIH RUANG BELAJAR */}

      <section
        className="home-learning"
        id="ruang-belajar"
        aria-labelledby="learning-title"
      >
        <div className="learning-section-heading">

          <div>
            <p className="home-section-eyebrow">
              PETA EKSPEDISI
            </p>

            <h2 id="learning-title">
              Pilih cara belajarmu.
            </h2>
          </div>

          <p>
            Empat ruang untuk memahami alam
            melalui cara yang berbeda.
          </p>

        </div>

        <div className="learning-cards">

          <button
            className="learning-card learning-card-trivia"
            type="button"
            onClick={onPilihTrivia}
          >
            <span className="learning-card-index">
              01 / WAWASAN
            </span>

            <span className="learning-card-icon">✧</span>

            <strong>Trivia &amp; Kuis</strong>

            <span className="learning-card-copy">
              Kenali tokoh, sejarah, dan uji
              pemahaman konsep fisika.
            </span>

            <span className="learning-card-link">
              Jelajahi <b>↗</b>
            </span>
          </button>

          <button
            className="learning-card learning-card-simulation"
            type="button"
            onClick={onMulaiSimulasi}
          >
            <span className="learning-card-index">
              02 / EKSPERIMEN
            </span>

            <span className="learning-card-icon">⌁</span>

            <strong>Simulasi</strong>

            <span className="learning-card-copy">
              Ubah parameter dan amati hukum
              fisika bekerja.
            </span>

            <span className="learning-card-link">
              Mulai simulasi <b>↗</b>
            </span>
          </button>

          <button
            className="learning-card learning-card-case"
            type="button"
            onClick={onEksplorasiStudiKasus}
          >
            <span className="learning-card-index">
              03 / PENYELIDIKAN
            </span>

            <span className="learning-card-icon">⌘</span>

            <strong>Studi Kasus</strong>

            <span className="learning-card-copy">
              Selesaikan proyek dan lakukan riset
              di laboratorium virtual.
            </span>

            <span className="learning-card-link">
              Masuk laboratorium <b>↗</b>
            </span>
          </button>

          <button
            className="learning-card learning-card-problem"
            type="button"
            onClick={onPilihProblemSet}
          >
            <span className="learning-card-index">
              04 / LATIHAN
            </span>

            <span className="learning-card-icon">∑</span>

            <strong>Problem Set</strong>

            <span className="learning-card-copy">
              Asah kemampuan hitung dengan
              soal dan pembahasan.
            </span>

            <span className="learning-card-link">
              Kerjakan soal <b>↗</b>
            </span>
          </button>

        </div>
      </section>

      {/* FOOTER */}

      <footer className="home-footer">

        <a
          className="home-footer-brand"
          href="#beranda"
          onClick={(event) => {
            event.preventDefault();

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          Phys<span>LAB</span>
        </a>

        <span>
          Belajar fisika dengan rasa ingin tahu.
        </span>

        <span>
          LABORATORIUM FISIKA INTERAKTIF · BETA
        </span>

      </footer>

    </div>
  );
}
