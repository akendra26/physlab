import type { ReactNode } from "react";
import Sidebar from "../components/navigasi/Sidebar";
import {
  DAFTAR_MODUL_DINAMIKA,
  DAFTAR_MODUL_KINEMATIKA,
  type KategoriSimulasi,
  type ModulDinamikaId,
  type ModulKinematikaId,
} from "../config/konfigurasiNavigasi";

type Props = {
  kategoriAktif: KategoriSimulasi;
  modulAktif: ModulKinematikaId;
  modulDinamikaAktif: ModulDinamikaId;
  onPilihKategori: (kategori: KategoriSimulasi) => void;
  onPilihModul: (modul: ModulKinematikaId) => void;
  onPilihModulDinamika: (modul: ModulDinamikaId) => void;
  children: ReactNode;
};

const LABEL_KATEGORI: Record<KategoriSimulasi, string> = {
  kinematika: "Kinematika",
  dinamika: "Dinamika",
  "trivia-kuis": "Trivia & Kuis",
  "studi-kasus": "Studi Kasus",
  "problem-set": "Problem Set",
};

export default function TataLetakUtama({
  kategoriAktif,
  modulAktif,
  modulDinamikaAktif,
  onPilihKategori,
  onPilihModul,
  onPilihModulDinamika,
  children,
}: Props) {
  const namaModul = kategoriAktif === "kinematika"
    ? DAFTAR_MODUL_KINEMATIKA.find((modul) => modul.id === modulAktif)?.nama
    : kategoriAktif === "dinamika"
      ? DAFTAR_MODUL_DINAMIKA.find((modul) => modul.id === modulDinamikaAktif)?.nama
      : undefined;

  return (
    <div className="app-layout" id="beranda">
      <Sidebar
        kategoriAktif={kategoriAktif}
        modulAktif={modulAktif}
        modulDinamikaAktif={modulDinamikaAktif}
        onPilihKategori={onPilihKategori}
        onPilihModul={onPilihModul}
        onPilihModulDinamika={onPilihModulDinamika}
      />

      <div className="content-area">
        <header className="topbar">
          <div className="breadcrumb" aria-label="Lokasi halaman">
            <span>PhysLab</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{LABEL_KATEGORI[kategoriAktif]}</strong>
            {namaModul && (
              <>
                <span className="breadcrumb-separator">/</span>
                <span>{namaModul}</span>
                
              </>
            )}
          </div>
          <div className="topbar-status">
            <span className="status-indicator" />
            <span>LABORATORIUM INTERAKTIF</span>
            <span className="version-tag">BETA 1.1</span>
          </div>
        </header>

        <main className="page-content" data-active-category={kategoriAktif}>
          <div key={kategoriAktif}>{children}</div>
        </main>

        <footer className="page-footer">
          <span>PhysLab · Belajar fisika melalui eksperimen</span>
          <span>Satuan SI · Model ideal</span>
        </footer>
      </div>
    </div>
  );
}