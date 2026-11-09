import { useState } from "react";

import {
  DAFTAR_MODUL_DINAMIKA,
  DAFTAR_MODUL_KINEMATIKA,
  type KategoriSimulasi,
  type ModulDinamikaId,
  type ModulKinematikaId,
} from "../../config/konfigurasiNavigasi";

type Props = {
  kategoriAktif: KategoriSimulasi;
  modulAktif: ModulKinematikaId;
  modulDinamikaAktif: ModulDinamikaId;
  onPilihKategori: (kategori: KategoriSimulasi) => void;
  onPilihModul: (modul: ModulKinematikaId) => void;
  onPilihModulDinamika: (modul: ModulDinamikaId) => void;
};

/** Sidebar utama PhysLab: kategori dan sub-menu memilih modul yang ditampilkan. */
export default function Sidebar({
  kategoriAktif,
  modulAktif,
  modulDinamikaAktif,
  onPilihKategori,
  onPilihModul,
  onPilihModulDinamika,
}: Props) {
  const [kinematikaTerbuka, setKinematikaTerbuka] = useState(true);
  const [dinamikaTerbuka, setDinamikaTerbuka] = useState(false);

  return (
    <aside className="sidebar">
      <a className="brand sidebar-brand" href="#beranda" aria-label="PhysLab — beranda">
        <span className="brand-mark">φ</span>
        <span>Phys<span className="brand-accent">Lab</span></span>
      </a>

      <div className="sidebar-divider" />
      <p className="sidebar-caption">MENU UTAMA</p>

      <div className="navigation-group">
        <div className="navigation-root">
          <span className="navigation-root-icon">▦</span>
          <span>Simulasi</span>
        </div>

        <button
          className={`category-button ${kategoriAktif === "kinematika" ? "category-active" : ""}`}
          type="button"
          aria-expanded={kinematikaTerbuka}
          onClick={() => {
            onPilihKategori("kinematika");
            setKinematikaTerbuka((terbuka) => !terbuka);
          }}
        >
          <span className="category-symbol">◌</span>
          <span>Kinematika</span>
          <span className={`category-chevron ${kinematikaTerbuka ? "is-open" : ""}`} aria-hidden="true">⌄</span>
        </button>

        {kinematikaTerbuka && (
          <nav className="module-navigation" aria-label="Sub-menu Kinematika">
            <div className="navigation-section-label">KELOMPOK GERAK</div>
            {DAFTAR_MODUL_KINEMATIKA.map((modul, indeks) => {
              const aktif = kategoriAktif === "kinematika" && modulAktif === modul.id;
              return (
                <button
                  key={modul.id}
                  type="button"
                  className={`module-button ${aktif ? "module-active" : ""}`}
                  onClick={() => {
                    onPilihKategori("kinematika");
                    onPilihModul(modul.id);
                  }}
                  aria-current={aktif ? "page" : undefined}
                >
                  <span className="module-index">{String(indeks + 1).padStart(2, "0")}</span>
                  <span className="module-symbol">{modul.simbol}</span>
                  <span className="module-copy">
                    <span className="module-name">{modul.nama}</span>
                    <span className="module-code">{modul.singkatan}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        <button
          className={`category-button dynamics-category ${kategoriAktif === "dinamika" ? "category-active" : ""}`}
          type="button"
          aria-expanded={dinamikaTerbuka}
          onClick={() => {
            onPilihKategori("dinamika");
            setDinamikaTerbuka((terbuka) => !terbuka);
          }}
        >
          <span className="category-symbol">▰</span>
          <span>Dinamika</span>
          <span className="category-description">3 sub-menu</span>
          <span className={`category-chevron ${dinamikaTerbuka ? "is-open" : ""}`} aria-hidden="true">⌄</span>
        </button>

        {dinamikaTerbuka && (
          <nav className="module-navigation" aria-label="Sub-menu Dinamika">
            <div className="navigation-section-label">KELOMPOK DINAMIKA</div>
            {DAFTAR_MODUL_DINAMIKA.map((modul, indeks) => {
              const aktif = kategoriAktif === "dinamika" && modulDinamikaAktif === modul.id;
              return (
                <button
                  key={modul.id}
                  type="button"
                  className={`module-button ${aktif ? "module-active" : ""}`}
                  onClick={() => {
                    onPilihKategori("dinamika");
                    onPilihModulDinamika(modul.id);
                  }}
                  aria-current={aktif ? "page" : undefined}
                >
                  <span className="module-index">{String(indeks + 1).padStart(2, "0")}</span>
                  <span className="module-symbol">{modul.simbol}</span>
                  <span className="module-copy">
                    <span className="module-name">{modul.nama}</span>
                    <span className="module-code">{modul.singkatan}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        )}
      </div>

      <div className="sidebar-learning">
        <p className="sidebar-caption">PENGAYAAN</p>
        <button
          className={`category-button learning-category ${kategoriAktif === "trivia-kuis" ? "category-active" : ""}`}
          type="button"
          onClick={() => onPilihKategori("trivia-kuis")}
          aria-current={kategoriAktif === "trivia-kuis" ? "page" : undefined}
        >
          <span className="category-symbol" aria-hidden="true">✦</span>
          <span>Trivia &amp; Kuis</span>
          <span className="learning-tag">BELAJAR</span>
        </button>
        <button
          className={`category-button learning-category case-study-category ${kategoriAktif === "studi-kasus" ? "category-active" : ""}`}
          type="button"
          data-menu-id="studi-kasus"
          aria-label="Buka menu Studi Kasus — Laboratorium Virtual PBL dan RBL"
          aria-current={kategoriAktif === "studi-kasus" ? "page" : undefined}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onPilihKategori("studi-kasus");
          }}
        >
          <span className="category-symbol" aria-hidden="true">⌘</span>
          <span>Studi Kasus</span>
          <span className="learning-tag">PBL · RBL</span>
        </button>
        <button
          className={`category-button learning-category problem-set-category ${kategoriAktif === "problem-set" ? "category-active" : ""}`}
          type="button"
          data-menu-id="problem-set"
          aria-label="Buka menu Problem Set — tujuh topik latihan fisika"
          aria-current={kategoriAktif === "problem-set" ? "page" : undefined}
          onClick={() => onPilihKategori("problem-set")}
        >
          <span className="category-symbol" aria-hidden="true">✎</span>
          <span>Problem Set</span>
          <span className="learning-tag">7 TOPIK</span>
        </button>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-status-dot" />
        <div>
          <strong>PhysLab</strong>
          <span>Laboratorium fisika interaktif</span>
        </div>
        <span className="sidebar-version">BETA</span>
      </div>
    </aside>
  );
}