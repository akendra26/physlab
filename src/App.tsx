import { useCallback, useEffect, useState, type MouseEvent, type PointerEvent } from "react";

import FloatingNavbar, { type BahasaUI, type HalamanPublik } from "./components/navigasi/FloatingNavbar";
import ThemeBackdrop from "./components/theme/ThemeBackdrop";
import { type ShinkaiTheme, type ThemeSelection, SHINKAI_THEMES } from "./theme/shinkai";
import BerandaPage from "./features/beranda/BerandaPage";
import IntroSplash from "./features/beranda/IntroSplash";
import MenuEksplorasiModal, { type DestinasiMenu } from "./features/beranda/MenuEksplorasiModal";
import KinematikaPage from "./features/kinematika/KinematikaPage";
import DinamikaPage from "./features/dinamika/DinamikaPage";
import TriviaKuisPage from "./features/trivia-kuis/TriviaKuisPage";
import StudiKasusPage from "./features/studi-kasus/StudiKasusPage";
import ProblemSetPage from "./features/problem-set/ProblemSetPage";
import SimulationExperience from "./components/simulasi/SimulationExperience";
import SimulationHubPage from "./features/beranda/SimulationHubPage";
import { useAudioSfx } from "./features/problem-set/useAudioSfx";
import { BahasaContext } from "./i18n/BahasaContext";

import {
  DAFTAR_MODUL_DINAMIKA,
  DAFTAR_MODUL_KINEMATIKA,
  type KategoriSimulasi,
  type ModulDinamikaId,
  type ModulKinematikaId,
} from "./config/konfigurasiNavigasi";

import "./App.css";
import "./features/beranda/Beranda.css";
import "./theme/shinkai-theme.css";

type HalamanAktif = "beranda" | "simulasi" | KategoriSimulasi;

const RUTE_VALID: HalamanAktif[] = [
  "beranda",
  "simulasi",
  "kinematika",
  "dinamika",
  "trivia-kuis",
  "studi-kasus",
  "problem-set",
];

const JUDUL_HALAMAN: Record<HalamanAktif, Record<BahasaUI, string>> = {
  beranda: { id: "Beranda", en: "Home" },
  simulasi: { id: "Simulasi", en: "Simulation" },
  "trivia-kuis": { id: "Trivia & Kuis", en: "Trivia & Quiz" },
  kinematika: { id: "Simulasi Kinematika", en: "Kinematics Simulation" },
  dinamika: { id: "Simulasi Dinamika", en: "Dynamics Simulation" },
  "studi-kasus": { id: "Studi Kasus", en: "Case Studies" },
  "problem-set": { id: "Set Soal", en: "Problem Set" },
};

const NAMA_MODUL_EN: Record<string, string> = {
  glb: "Uniform Linear Motion",
  glbb: "Uniformly Accelerated Motion",
  parabola: "Projectile Motion",
  vertikal: "Free Fall",
  newton: "Newtonian Dynamics",
  osilasi: "Oscillations",
  atwood: "Atwood Machine",
  lift: "Elevator Dynamics",
};

function bacaRute(): HalamanAktif {
  if (typeof window === "undefined") return "beranda";
  const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  const [route] = hash.split("/");
  if (route === "trivia") return "trivia-kuis";
  if (route === "simulasi") return "simulasi";
  if (route === "studi-kasus") return "studi-kasus";
  if (route === "problem-set") return "problem-set";
  return RUTE_VALID.includes(route as HalamanAktif) ? (route as HalamanAktif) : "beranda";
}

function bacaModulDinamika(): ModulDinamikaId {
  if (typeof window === "undefined") return "newton";
  const candidate = window.location.hash.replace(/^#\/?/, "").toLowerCase().split("/")[1];
  return DAFTAR_MODUL_DINAMIKA.some((item) => item.id === candidate) ? candidate as ModulDinamikaId : "newton";
}

function bacaModulKinematika(): ModulKinematikaId {
  if (typeof window === "undefined") return "glb";
  const candidate = window.location.hash.replace(/^#\/?/, "").toLowerCase().split("/")[1];
  return DAFTAR_MODUL_KINEMATIKA.some((item) => item.id === candidate) ? candidate as ModulKinematikaId : "glb";
}

export default function App() {
  const [halamanAktif, setHalamanAktif] = useState<HalamanAktif>(bacaRute);
  const [modulKinematikaAktif, setModulKinematikaAktif] = useState<ModulKinematikaId>(bacaModulKinematika);
  const [modulDinamikaAktif, setModulDinamikaAktif] = useState<ModulDinamikaId>(bacaModulDinamika);
  const [bahasa, setBahasa] = useState<BahasaUI>("id");
  const [splashVisible, setSplashVisible] = useState(true);
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [kunjunganBeranda, setKunjunganBeranda] = useState(0);
  const [themeSelection, setThemeSelection] = useState<ThemeSelection>("auto");
  const [activeTheme, setActiveTheme] = useState<ShinkaiTheme>("twilight-comet");
  const { play: playGlobalSfx } = useAudioSfx();
  const handleGlobalClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const control = target.closest("button, a, [role=button], input[type=range], [data-sfx]");
    if (!control || control.closest("[data-sfx-local]")) return;
    playGlobalSfx(control.hasAttribute("data-sfx") ? (control.getAttribute("data-sfx") as "click" | "whoosh" | "chime") : "click");
  }, [playGlobalSfx]);
  const handleGlobalHover = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const control = target.closest("button, a, [role=button], [data-sfx]");
    if (!control || control.closest("[data-sfx-local]") || control.contains(event.relatedTarget as Node | null)) return;
    playGlobalSfx("hover");
  }, [playGlobalSfx]);

  const tutupMenu = useCallback(() => setMenuTerbuka(false), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setSplashVisible(false), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = bahasa === "id" ? "id" : "en";
  }, [bahasa]);

  useEffect(() => {
    document.documentElement.dataset.shinkaiTheme = activeTheme;
    document.body.dataset.shinkaiTheme = activeTheme;
  }, [activeTheme]);

  useEffect(() => {
    if (themeSelection !== "auto") return;
    const timer = window.setInterval(() => {
      setActiveTheme((current) => {
        const index = SHINKAI_THEMES.indexOf(current);
        return SHINKAI_THEMES[(index + 1) % SHINKAI_THEMES.length];
      });
    }, 16000);
    return () => window.clearInterval(timer);
  }, [themeSelection]);

  function pilihTema(selection: ThemeSelection) {
    setThemeSelection(selection);
    if (selection !== "auto") setActiveTheme(selection);
  }

  function simpanRute(halaman: HalamanAktif, extra?: Record<string, string>) {
    const module = extra?.modul;
    const hash = halaman === "beranda" ? "#beranda" : `#${halaman}${module ? `/${module}` : ""}`;
    if (window.location.hash !== hash) {
      window.history.pushState({ halaman, ...extra }, "", hash);
    }
  }

  function navigasi(halaman: HalamanAktif) {
    setHalamanAktif(halaman);
    setMenuTerbuka(false);
    if (halaman === "beranda") setKunjunganBeranda((nilai) => nilai + 1);
    simpanRute(halaman);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pilihKinematika(modul: ModulKinematikaId) {
    setModulKinematikaAktif(modul);
    setHalamanAktif("kinematika");
    setMenuTerbuka(false);
    simpanRute("kinematika", { modul });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pilihDinamika(modul: ModulDinamikaId) {
    setModulDinamikaAktif(modul);
    setHalamanAktif("dinamika");
    setMenuTerbuka(false);
    simpanRute("dinamika", { modul });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pilihDestinasi(destinasi: DestinasiMenu) {
    setMenuTerbuka(false);
    if (destinasi === "simulasi") {
      navigasi("simulasi");
      return;
    }
    navigasi(destinasi);
  }

  useEffect(() => {
    const sinkronkanRute = () => {
      const halaman = bacaRute();
      setHalamanAktif(halaman);
      const bagianRute = window.location.hash.replace(/^#\/?/, "").toLowerCase().split("/")[1];
      if (halaman === "dinamika" && DAFTAR_MODUL_DINAMIKA.some((item) => item.id === bagianRute)) setModulDinamikaAktif(bagianRute as ModulDinamikaId);
      if (halaman === "kinematika" && DAFTAR_MODUL_KINEMATIKA.some((item) => item.id === bagianRute)) setModulKinematikaAktif(bagianRute as ModulKinematikaId);
      setMenuTerbuka(false);
      if (halaman === "beranda") setKunjunganBeranda((nilai) => nilai + 1);
    };
    window.addEventListener("popstate", sinkronkanRute);
    window.addEventListener("hashchange", sinkronkanRute);
    return () => {
      window.removeEventListener("popstate", sinkronkanRute);
      window.removeEventListener("hashchange", sinkronkanRute);
    };
  }, []);

  useEffect(() => {
    document.title = halamanAktif === "beranda"
      ? (bahasa === "id" ? "PhysLAB — Laboratorium Fisika Interaktif" : "PhysLAB — Interactive Physics Laboratory")
      : `${JUDUL_HALAMAN[halamanAktif][bahasa]} — PhysLAB`;
  }, [halamanAktif, bahasa]);

  function renderHalaman() {
    switch (halamanAktif) {
      case "beranda":
        return (
          <BerandaPage
            bahasa={bahasa}
            kunjunganBeranda={kunjunganBeranda}
            onMulai={() => setMenuTerbuka(true)}
            onJelajahi={() => navigasi("studi-kasus")}
          />
        );
      case "simulasi":
        return (
          <SimulationHubPage
            bahasa={bahasa}
            onMulai={(_, modul) => pilihKinematika(modul)}
            onMulaiDinamika={(_, modul) => pilihDinamika(modul)}
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
    <BahasaContext.Provider value={bahasa}>
    <div className={`site-shell ${halamanAktif === "beranda" ? "site-shell-home" : "site-shell-app"}`} onClickCapture={handleGlobalClick} onPointerOverCapture={handleGlobalHover}>
      <ThemeBackdrop theme={activeTheme} />
      <FloatingNavbar
        halamanAktif={halamanAktif}
        bahasa={bahasa}
        themeSelection={themeSelection}
        activeTheme={activeTheme}
        onSelectTheme={pilihTema}
        onUbahBahasa={setBahasa}
        onNavigasi={(halaman: HalamanPublik) => navigasi(halaman)}
      />

      <main
        className={halamanAktif === "beranda" ? "site-home-main" : "site-route-main"}
        data-active-category={halamanAktif}
        data-active-module={halamanAktif === "kinematika" ? modulKinematikaAktif : halamanAktif === "dinamika" ? modulDinamikaAktif : undefined}
      >
        <div key={`${halamanAktif}-${modulKinematikaAktif}-${modulDinamikaAktif}`} className="site-route-transition">
          {halamanAktif === "beranda" ? (
            renderHalaman()
          ) : (
            <div className="site-route-container">
              <div className="site-route-heading">
                <div className="site-route-heading-copy">
                  <span className="site-route-kicker">{bahasa === "id" ? "PHYSLAB / RUANG BELAJAR" : "PHYSLAB / LEARNING SPACE"}</span>
                  <span className="site-route-current">{JUDUL_HALAMAN[halamanAktif][bahasa]}</span>
                </div>
                {halamanAktif === "kinematika" && (
                  <span className="site-route-module-label">
                    {bahasa === "id" ? DAFTAR_MODUL_KINEMATIKA.find((item) => item.id === modulKinematikaAktif)?.nama : NAMA_MODUL_EN[modulKinematikaAktif]}
                  </span>
                )}
                {halamanAktif === "dinamika" && (
                  <span className="site-route-module-label">
                    {bahasa === "id" ? DAFTAR_MODUL_DINAMIKA.find((item) => item.id === modulDinamikaAktif)?.nama : NAMA_MODUL_EN[modulDinamikaAktif]}
                  </span>
                )}
              </div>
              <div className="page-content site-feature-content">
                {halamanAktif === "kinematika" || halamanAktif === "dinamika" ? (
                  <SimulationExperience
                    category={halamanAktif}
                    moduleKey={halamanAktif === "kinematika" ? modulKinematikaAktif : modulDinamikaAktif}
                  >
                    <div className="simulation-page-root">{renderHalaman()}</div>
                  </SimulationExperience>
                ) : renderHalaman()}
              </div>
            </div>
          )}
        </div>
      </main>

      {halamanAktif !== "beranda" && (
        <footer className="site-app-footer">
          <span>{bahasa === "id" ? "PhysLAB · Belajar fisika melalui eksplorasi." : "PhysLAB · Learn physics through exploration."}</span>
          <span>{bahasa === "id" ? "Fisika Kelas XI SMA · Satuan SI" : "High School Physics · SI Units"}</span>
        </footer>
      )}

      <MenuEksplorasiModal
        terbuka={menuTerbuka}
        bahasa={bahasa}
        onTutup={tutupMenu}
        onPilih={pilihDestinasi}
      />
      <IntroSplash visible={splashVisible} bahasa={bahasa} />
    </div>
    </BahasaContext.Provider>
  );
}
