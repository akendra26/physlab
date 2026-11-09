import { useEffect, useState } from "react";

import BerandaPage from "./features/beranda/BerandaPage";
import KinematikaPage from "./features/kinematika/KinematikaPage";
import DinamikaPage from "./features/dinamika/DinamikaPage";
import TriviaKuisPage from "./features/trivia-kuis/TriviaKuisPage";
import StudiKasusPage from "./features/studi-kasus/StudiKasusPage";
import ProblemSetPage from "./features/problem-set/ProblemSetPage";

import {
  DAFTAR_MODUL_DINAMIKA,
  DAFTAR_MODUL_KINEMATIKA,
  type KategoriSimulasi,
  type ModulDinamikaId,
  type ModulKinematikaId,
} from "./config/konfigurasiNavigasi";

import "./App.css";
import "./features/beranda/Beranda.css";

type HalamanAktif = "beranda" | KategoriSimulasi;

const RUTE_VALID: HalamanAktif[] = [
  "beranda",
  "kinematika",
  "dinamika",
  "trivia-kuis",
  "studi-kasus",
  "problem-set",
];

function bacaRute(): HalamanAktif {
  if (typeof window === "undefined") return "beranda";

  const hash = window.location.hash
    .replace(/^#\/?/, "")
    .toLowerCase();

  if (hash === "trivia") return "trivia-kuis";
  if (hash === "simulasi") return "kinematika";
  if (hash === "studi-kasus") return "studi-kasus";
  if (hash === "problem-set") return "problem-set";

  return RUTE_VALID.includes(hash as HalamanAktif)
    ? (hash as HalamanAktif)
    : "beranda";
}

const JUDUL_HALAMAN: Record<HalamanAktif, string> = {
  beranda: "Beranda",
  "trivia-kuis": "Trivia & Kuis",
  kinematika: "Simulasi Kinematika",
  dinamika: "Simulasi Dinamika",
  "studi-kasus": "Studi Kasus",
  "problem-set": "Problem Set",
};

export default function App() {
  const [halamanAktif, setHalamanAktif] =
    useState<HalamanAktif>(bacaRute);

  const [modulKinematikaAktif, setModulKinematikaAktif] =
    useState<ModulKinematikaId>("gerak-lurus");

  const [modulDinamikaAktif, setModulDinamikaAktif] =
    useState<ModulDinamikaId>("newton");

  const [simulasiTerbuka, setSimulasiTerbuka] =
    useState(false);

  const [mobileNavTerbuka, setMobileNavTerbuka] =
    useState(false);

  function navigasi(halaman: HalamanAktif) {
    setHalamanAktif(halaman);
    setMobileNavTerbuka(false);
    setSimulasiTerbuka(false);

    if (typeof window !== "undefined") {
      const hash = halaman === "beranda" ? "#beranda" : `#${halaman}`;

      if (window.location.hash !== hash) {
        window.history.pushState({ halaman }, "", hash);
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pilihKinematika(modul: ModulKinematikaId) {
    setModulKinematikaAktif(modul);
    setHalamanAktif("kinematika");
    setSimulasiTerbuka(false);
    setMobileNavTerbuka(false);

    window.history.pushState(
      { halaman: "kinematika", modul },
      "",
      "#kinematika",
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pilihDinamika(modul: ModulDinamikaId) {
    setModulDinamikaAktif(modul);
    setHalamanAktif("dinamika");
    setSimulasiTerbuka(false);
    setMobileNavTerbuka(false);

    window.history.pushState(
      { halaman: "dinamika", modul },
      "",
      "#dinamika",
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    const sinkronkanRute = () => {
      setHalamanAktif(bacaRute());
    };

    window.addEventListener("popstate", sinkronkanRute);
    window.addEventListener("hashchange", sinkronkanRute);

    return () => {
      window.removeEventListener("popstate", sinkronkanRute);
      window.removeEventListener("hashchange", sinkronkanRute);
    };
  }, []);

  useEffect(() => {
    document.title =
      halamanAktif === "beranda"
        ? "PhysLAB — Laboratorium Fisika Interaktif"
        : `${JUDUL_HALAMAN[halamanAktif]} — PhysLAB`;
  }, [halamanAktif]);

  const sedangDiSimulasi =
    halamanAktif === "kinematika" || halamanAktif === "dinamika";

  function renderHalaman() {
    switch (halamanAktif) {
      case "beranda":
        return (
          <BerandaPage
            onMulaiSimulasi={() => pilihKinematika("gerak-lurus")}
            onEksplorasiStudiKasus={() => navigasi("studi-kasus")}
            onPilihTrivia={() => navigasi("trivia-kuis")}
            onPilihProblemSet={() => navigasi("problem-set")}
          />
        );

      case "kinematika":
        return <KinematikaPage modulAktif={modulKinematikaAktif} />;

      case "dinamika":
        return <DinamikaPage modulAktif={modulDinamikaAktif} />;

      case "trivia-kuis":
        return <TriviaKuisPage />;

      case "studi-kasus":
        return <StudiKasusPage />;

      case "problem-set":
        return <ProblemSetPage />;

      default:
        return null;
    }
  }

  return (
    <div
      className={`site-shell ${
        halamanAktif === "beranda" ? "site-shell-home" : "site-shell-app"
      }`}
    >
      <header
        className={`site-header ${
          halamanAktif !== "beranda" ? "site-header-solid" : ""
        }`}
      >
        <a
          className="site-brand"
          href="#beranda"
          aria-label="PhysLAB — kembali ke beranda"
          onClick={(event) => {
            event.preventDefault();
            navigasi("beranda");
          }}
        >
          <span className="site-brand-symbol" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="15.5" stroke="currentColor" strokeWidth="1.4" opacity=".72" />
              <ellipse cx="20" cy="20" rx="7" ry="16" stroke="currentColor" strokeWidth="1.4" transform="rotate(42 20 20)" />
              <circle cx="20" cy="20" r="3" fill="currentColor" />
            </svg>
          </span>
          <span className="site-brand-word">
            Phys<span>LAB</span>
          </span>
        </a>

        <button
          className="site-mobile-toggle"
          type="button"
          aria-label={mobileNavTerbuka ? "Tutup navigasi" : "Buka navigasi"}
          aria-expanded={mobileNavTerbuka}
          onClick={() => setMobileNavTerbuka((terbuka) => !terbuka)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`site-nav ${mobileNavTerbuka ? "site-nav-open" : ""}`}
          aria-label="Navigasi utama"
        >
          <button
            type="button"
            className={`site-nav-link ${halamanAktif === "trivia-kuis" ? "is-active" : ""}`}
            onClick={() => navigasi("trivia-kuis")}
          >
            Trivia
          </button>

          <div className="site-nav-dropdown-wrap">
            <button
              type="button"
              className={`site-nav-link site-nav-simulation ${sedangDiSimulasi ? "is-active" : ""}`}
              aria-expanded={simulasiTerbuka}
              aria-haspopup="true"
              onClick={() => setSimulasiTerbuka((terbuka) => !terbuka)}
            >
              Simulasi
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="m2 4.5 4 4 4-4" />
              </svg>
            </button>

            {simulasiTerbuka && (
              <div className="site-nav-dropdown site-nav-dropdown-simulation">
                <div className="site-dropdown-label">PILIH SUB-MENU SIMULASI</div>

                <section className="site-simulation-group" aria-label="Sub-menu Kinematika">
                  <div className="site-simulation-group-title">
                    <span className="site-simulation-group-icon">↗</span>
                    <span>Kinematika</span>
                    <small>5 sub-menu</small>
                  </div>

                  <div className="site-simulation-items">
                    {DAFTAR_MODUL_KINEMATIKA.map((modul, indeks) => {
                      const aktif =
                        halamanAktif === "kinematika" &&
                        modulKinematikaAktif === modul.id;

                      return (
                        <button
                          key={modul.id}
                          type="button"
                          className={aktif ? "is-selected" : ""}
                          onClick={() => pilihKinematika(modul.id)}
                        >
                          <span className="site-simulation-number">
                            {String(indeks + 1).padStart(2, "0")}
                          </span>
                          <span className="site-simulation-copy">
                            <strong>{modul.nama}</strong>
                            <small>{modul.singkatan}</small>
                          </span>
                          <span className="site-simulation-check">
                            {aktif ? "●" : "→"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="site-simulation-group" aria-label="Sub-menu Dinamika">
                  <div className="site-simulation-group-title">
                    <span className="site-simulation-group-icon">Σ</span>
                    <span>Dinamika</span>
                    <small>3 sub-menu</small>
                  </div>

                  <div className="site-simulation-items">
                    {DAFTAR_MODUL_DINAMIKA.map((modul, indeks) => {
                      const aktif =
                        halamanAktif === "dinamika" &&
                        modulDinamikaAktif === modul.id;

                      return (
                        <button
                          key={modul.id}
                          type="button"
                          className={aktif ? "is-selected" : ""}
                          onClick={() => pilihDinamika(modul.id)}
                        >
                          <span className="site-simulation-number">
                            {String(indeks + 1).padStart(2, "0")}
                          </span>
                          <span className="site-simulation-copy">
                            <strong>{modul.nama}</strong>
                            <small>{modul.singkatan}</small>
                          </span>
                          <span className="site-simulation-check">
                            {aktif ? "●" : "→"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <div className="site-simulation-footnote">
                  Pilih sub-menu untuk langsung membuka simulasi yang diinginkan.
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className={`site-nav-link ${halamanAktif === "studi-kasus" ? "is-active" : ""}`}
            onClick={() => navigasi("studi-kasus")}
          >
            Studi Kasus
          </button>

          <button
            type="button"
            className={`site-nav-link ${halamanAktif === "problem-set" ? "is-active" : ""}`}
            onClick={() => navigasi("problem-set")}
          >
            Problem Set
          </button>
        </nav>
      </header>

      <main
        className={halamanAktif === "beranda" ? "site-home-main" : "site-route-main"}
        data-active-category={halamanAktif}
        data-active-module={
          halamanAktif === "kinematika"
            ? modulKinematikaAktif
            : halamanAktif === "dinamika"
              ? modulDinamikaAktif
              : undefined
        }
      >
        <div key={`${halamanAktif}-${modulKinematikaAktif}-${modulDinamikaAktif}`} className="site-route-transition">
          {halamanAktif === "beranda" ? (
            renderHalaman()
          ) : (
            <div className="site-route-container">
              <div className="site-route-heading">
                <div>
                  <span className="site-route-kicker">PHYSLAB / RUANG BELAJAR</span>
                  <span className="site-route-current">{JUDUL_HALAMAN[halamanAktif]}</span>
                </div>

                {halamanAktif === "kinematika" && (
                  <span className="site-route-module-label">
                    {DAFTAR_MODUL_KINEMATIKA.find((item) => item.id === modulKinematikaAktif)?.nama}
                  </span>
                )}

                {halamanAktif === "dinamika" && (
                  <span className="site-route-module-label">
                    {DAFTAR_MODUL_DINAMIKA.find((item) => item.id === modulDinamikaAktif)?.nama}
                  </span>
                )}
              </div>

              <div className="page-content site-feature-content">
                {renderHalaman()}
              </div>
            </div>
          )}
        </div>
      </main>

      {halamanAktif !== "beranda" && (
        <footer className="site-app-footer">
          <span>PhysLAB · Belajar fisika melalui eksplorasi.</span>
          <span>Fisika Kelas XI SMA · Satuan SI</span>
        </footer>
      )}
    </div>
  );
}
