import { useState } from "react";
import FunFactMekanika from "./FunFactMekanika";
import PetaSejarahFisika from "./PetaSejarahFisika";
import KuisFisika from "./KuisFisika";
import "./TriviaKuis.css";

type BagianAktif = "fun-fact" | "peta" | "kuis";

/** Pusat pengayaan mekanika: buku fun fact, atlas sejarah, dan kuis konsep. */
export default function TriviaKuisPage() {
  const [bagianAktif, setBagianAktif] = useState<BagianAktif>("fun-fact");

  return (
    <div className="trivia-page">
      <section className="trivia-hero">
        <div className="trivia-hero-sky" aria-hidden="true">
          <span className="sky-star star-a" />
          <span className="sky-star star-b" />
          <span className="sky-star star-c" />
          <span className="sky-orbit" />
          <span className="sky-horizon" />
        </div>
        <div className="trivia-hero-copy">
          <p className="trivia-eyebrow">RUANG WAWASAN · DUNIA MEKANIKA</p>
          <h1>Mekanika punya <em>cerita.</em><br />Temukan, pahami, buktikan.</h1>
          <p>
            Baca fakta menarik di balik gerak dan gaya, telusuri jejak ilmuwan
            melalui atlas sejarah, lalu uji intuisi fisikamu dengan 50 soal
            konsep dan trivia mekanika.
          </p>
          <div className="trivia-hero-meta">
            <span><i className="hero-meta-dot" /> FUN FACT MEKANIKA</span>
            <span><i className="hero-meta-dot hero-meta-dot-blue" /> ATLAS PENEMUAN</span>
            <span><i className="hero-meta-dot hero-meta-dot-amber" /> 50 SOAL KONSEP</span>
          </div>
        </div>
        <div className="trivia-hero-equation" aria-hidden="true">
          <span className="equation-main">ΣF = ma</span>
          <span className="equation-sub">GERAK · GAYA · WAKTU</span>
        </div>
      </section>

      <nav className="trivia-switcher trivia-switcher-three" aria-label="Pilihan materi">
        <button
          className={`trivia-switcher-button ${bagianAktif === "fun-fact" ? "trivia-switcher-active" : ""}`}
          type="button"
          onClick={() => setBagianAktif("fun-fact")}
          aria-current={bagianAktif === "fun-fact" ? "page" : undefined}
        >
          <span className="switcher-icon" aria-hidden="true">▤</span>
          <span className="switcher-copy"><strong>Fun Fact Mekanika</strong><small>Buku fakta interaktif</small></span>
          <span className="switcher-arrow" aria-hidden="true">→</span>
        </button>

        <button
          className={`trivia-switcher-button ${bagianAktif === "peta" ? "trivia-switcher-active" : ""}`}
          type="button"
          onClick={() => setBagianAktif("peta")}
          aria-current={bagianAktif === "peta" ? "page" : undefined}
        >
          <span className="switcher-icon switcher-icon-map" aria-hidden="true">⌖</span>
          <span className="switcher-copy"><strong>Peta Penemuan</strong><small>Atlas lokasi sejarah sains</small></span>
          <span className="switcher-arrow" aria-hidden="true">→</span>
        </button>

        <button
          className={`trivia-switcher-button ${bagianAktif === "kuis" ? "trivia-switcher-active" : ""}`}
          type="button"
          onClick={() => setBagianAktif("kuis")}
          aria-current={bagianAktif === "kuis" ? "page" : undefined}
        >
          <span className="switcher-icon switcher-icon-blue" aria-hidden="true">✧</span>
          <span className="switcher-copy"><strong>Kuis Konsep & Trivia</strong><small>50 soal · tanpa hitungan rumit</small></span>
          <span className="switcher-arrow" aria-hidden="true">→</span>
        </button>
      </nav>

      <div className="trivia-content" key={bagianAktif}>
        {bagianAktif === "fun-fact" && <FunFactMekanika />}
        {bagianAktif === "peta" && <PetaSejarahFisika />}
        {bagianAktif === "kuis" && <KuisFisika />}
      </div>
    </div>
  );
}
