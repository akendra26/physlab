# PhysLAB — Kode Lengkap Makoto Shinkai Theme Refresh
Dokumen ini memuat isi utuh setiap komponen dan stylesheet yang dibuat atau diubah untuk refresh tema. Tidak ada cuplikan yang dipotong. Source project lengkap tetap tersedia di ZIP full source.

---

## `src/App.tsx`

```tsx
import { useCallback, useEffect, useState } from "react";

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

type HalamanAktif = "beranda" | KategoriSimulasi;

const RUTE_VALID: HalamanAktif[] = [
  "beranda",
  "kinematika",
  "dinamika",
  "trivia-kuis",
  "studi-kasus",
  "problem-set",
];

const JUDUL_HALAMAN: Record<HalamanAktif, Record<BahasaUI, string>> = {
  beranda: { id: "Beranda", en: "Home" },
  "trivia-kuis": { id: "Trivia & Kuis", en: "Trivia & Quiz" },
  kinematika: { id: "Simulasi Kinematika", en: "Kinematics Simulation" },
  dinamika: { id: "Simulasi Dinamika", en: "Dynamics Simulation" },
  "studi-kasus": { id: "Studi Kasus", en: "Case Studies" },
  "problem-set": { id: "Problem Set", en: "Problem Set" },
};

const NAMA_MODUL_EN: Record<string, string> = {
  "gerak-lurus": "Linear Motion",
  "gerak-melingkar": "Circular Motion",
  gjb: "Free Fall",
  vertikal: "Vertical Motion",
  parabola: "Projectile Motion",
  newton: "Newton's Laws & Force Sandbox",
  sistem: "Dynamics Systems & Applications",
  rotasi: "Rotational Dynamics & Equilibrium",
};

function bacaRute(): HalamanAktif {
  if (typeof window === "undefined") return "beranda";
  const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  if (hash === "trivia") return "trivia-kuis";
  if (hash === "simulasi") return "kinematika";
  if (hash === "studi-kasus") return "studi-kasus";
  if (hash === "problem-set") return "problem-set";
  return RUTE_VALID.includes(hash as HalamanAktif) ? (hash as HalamanAktif) : "beranda";
}

export default function App() {
  const [halamanAktif, setHalamanAktif] = useState<HalamanAktif>(bacaRute);
  const [modulKinematikaAktif, setModulKinematikaAktif] = useState<ModulKinematikaId>("gerak-lurus");
  const [modulDinamikaAktif, setModulDinamikaAktif] = useState<ModulDinamikaId>("newton");
  const [bahasa, setBahasa] = useState<BahasaUI>("id");
  const [splashVisible, setSplashVisible] = useState(true);
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [kunjunganBeranda, setKunjunganBeranda] = useState(0);
  const [themeSelection, setThemeSelection] = useState<ThemeSelection>("auto");
  const [activeTheme, setActiveTheme] = useState<ShinkaiTheme>("twilight-comet");

  const tutupMenu = useCallback(() => setMenuTerbuka(false), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setSplashVisible(false), 1120);
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
    const hash = halaman === "beranda" ? "#beranda" : `#${halaman}`;
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
    if (destinasi === "kinematika") {
      pilihKinematika("gerak-lurus");
      return;
    }
    navigasi(destinasi);
  }

  useEffect(() => {
    const sinkronkanRute = () => {
      const halaman = bacaRute();
      setHalamanAktif(halaman);
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
      ? "PhysLAB — Interactive Physics Laboratory"
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
    <div className={`site-shell ${halamanAktif === "beranda" ? "site-shell-home" : "site-shell-app"}`}>
      <ThemeBackdrop theme={activeTheme} />
      <FloatingNavbar
        halamanAktif={halamanAktif}
        modulKinematikaAktif={modulKinematikaAktif}
        modulDinamikaAktif={modulDinamikaAktif}
        bahasa={bahasa}
        themeSelection={themeSelection}
        activeTheme={activeTheme}
        onSelectTheme={pilihTema}
        onUbahBahasa={setBahasa}
        onNavigasi={(halaman: HalamanPublik) => navigasi(halaman)}
        onPilihKinematika={pilihKinematika}
        onPilihDinamika={pilihDinamika}
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
              <div className="page-content site-feature-content">{renderHalaman()}</div>
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
      <IntroSplash visible={splashVisible} />
    </div>
  );
}
```

---

## `src/components/navigasi/FloatingNavbar.tsx`

```tsx
import { useEffect, useState } from "react";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import type { ShinkaiTheme, ThemeSelection } from "../../theme/shinkai";
import {
  DAFTAR_MODUL_DINAMIKA,
  DAFTAR_MODUL_KINEMATIKA,
  type ModulDinamikaId,
  type ModulKinematikaId,
} from "../../config/konfigurasiNavigasi";

export type BahasaUI = "id" | "en";
export type HalamanPublik = "beranda" | "trivia-kuis" | "studi-kasus" | "problem-set";

type Props = {
  halamanAktif: string;
  modulKinematikaAktif: ModulKinematikaId;
  modulDinamikaAktif: ModulDinamikaId;
  bahasa: BahasaUI;
  themeSelection: ThemeSelection;
  activeTheme: ShinkaiTheme;
  onSelectTheme: (theme: ThemeSelection) => void;
  onUbahBahasa: (bahasa: BahasaUI) => void;
  onNavigasi: (halaman: HalamanPublik) => void;
  onPilihKinematika: (modul: ModulKinematikaId) => void;
  onPilihDinamika: (modul: ModulDinamikaId) => void;
};

const LABEL = {
  id: { trivia: "Trivia", simulasi: "Simulasi", kasus: "Studi Kasus", problem: "Problem Set", home: "Kembali ke beranda", open: "Buka navigasi", close: "Tutup navigasi", language: "Bahasa", kinematics: "Kinematika", dynamics: "Dinamika", choose: "PILIH MODUL" },
  en: { trivia: "Trivia", simulasi: "Simulation", kasus: "Case Studies", problem: "Problem Set", home: "Back to home", open: "Open navigation", close: "Close navigation", language: "Language", kinematics: "Kinematics", dynamics: "Dynamics", choose: "CHOOSE A MODULE" },
} as const;

const MODUL_EN: Record<string, string> = {
  "gerak-lurus": "Linear Motion", "gerak-melingkar": "Circular Motion", gjb: "Free Fall", vertikal: "Vertical Motion", parabola: "Projectile Motion",
  newton: "Newton's Laws & Force Sandbox", sistem: "Dynamics Systems & Applications", rotasi: "Rotation & Equilibrium",
};

export default function FloatingNavbar({
  halamanAktif,
  modulKinematikaAktif,
  modulDinamikaAktif,
  bahasa,
  themeSelection,
  activeTheme,
  onSelectTheme,
  onUbahBahasa,
  onNavigasi,
  onPilihKinematika,
  onPilihDinamika,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [simulationOpen, setSimulationOpen] = useState(false);
  const label = LABEL[bahasa];

  useEffect(() => {
    setMobileOpen(false);
    setSimulationOpen(false);
  }, [halamanAktif]);

  function menuju(aksi: () => void) {
    aksi();
    setMobileOpen(false);
    setSimulationOpen(false);
  }

  const namaModul = (item: { id: string; nama: string }) => bahasa === "id" ? item.nama : MODUL_EN[item.id] ?? item.nama;

  return (
    <header className="floating-nav-wrap">
      <div className="floating-nav rounded-full border border-white/10 bg-zinc-900/60 backdrop-blur-md" data-mobile-open={mobileOpen}>
        <button
          type="button"
          className="floating-brand"
          aria-label={label.home}
          onClick={() => menuju(() => onNavigasi("beranda"))}
        >
          <span className="brand-pulse-dot" aria-hidden="true" />
          <span className="floating-brand-word">Phys<span>LAB</span></span>
        </button>

        <nav className="floating-nav-links" aria-label="Main navigation">
          <button type="button" className={halamanAktif === "trivia-kuis" ? "active" : ""} onClick={() => menuju(() => onNavigasi("trivia-kuis"))}>{label.trivia}</button>
          <div className="floating-simulation-wrap">
            <button
              type="button"
              className={`floating-simulation-trigger ${halamanAktif === "kinematika" || halamanAktif === "dinamika" ? "active" : ""}`}
              aria-expanded={simulationOpen}
              aria-haspopup="true"
              onClick={() => setSimulationOpen((value) => !value)}
            >
              {label.simulasi}<span className="nav-chevron" />
            </button>
            {simulationOpen && (
              <div className="floating-simulation-menu">
                <p>{label.choose}</p>
                <div className="floating-simulation-group">
                  <strong>{label.kinematics}</strong>
                  {DAFTAR_MODUL_KINEMATIKA.map((item, index) => (
                    <button key={item.id} type="button" className={halamanAktif === "kinematika" && modulKinematikaAktif === item.id ? "selected" : ""} onClick={() => menuju(() => onPilihKinematika(item.id))}>
                      <span>{String(index + 1).padStart(2, "0")}</span>{namaModul(item)}<b>↗</b>
                    </button>
                  ))}
                </div>
                <div className="floating-simulation-group">
                  <strong>{label.dynamics}</strong>
                  {DAFTAR_MODUL_DINAMIKA.map((item, index) => (
                    <button key={item.id} type="button" className={halamanAktif === "dinamika" && modulDinamikaAktif === item.id ? "selected" : ""} onClick={() => menuju(() => onPilihDinamika(item.id))}>
                      <span>{String(index + 1).padStart(2, "0")}</span>{namaModul(item)}<b>↗</b>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button type="button" className={halamanAktif === "studi-kasus" ? "active" : ""} onClick={() => menuju(() => onNavigasi("studi-kasus"))}>{label.kasus}</button>
          <button type="button" className={halamanAktif === "problem-set" ? "active" : ""} onClick={() => menuju(() => onNavigasi("problem-set"))}>{label.problem}</button>
        </nav>

        <div className="floating-nav-actions">
          <ThemeSwitcher bahasa={bahasa} selection={themeSelection} activeTheme={activeTheme} onSelect={onSelectTheme} />
          <div className="language-switch" role="group" aria-label={label.language}>
            <button type="button" aria-pressed={bahasa === "id"} className={bahasa === "id" ? "selected" : ""} onClick={() => onUbahBahasa("id")}>ID</button>
            <span aria-hidden="true" />
            <button type="button" aria-pressed={bahasa === "en"} className={bahasa === "en" ? "selected" : ""} onClick={() => onUbahBahasa("en")}>EN</button>
          </div>
          <button
            type="button"
            className="floating-mobile-toggle"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? label.close : label.open}
            onClick={() => setMobileOpen((current) => !current)}
          >
            <span /><span />
          </button>
        </div>

        {mobileOpen && (
          <nav className="floating-mobile-menu" aria-label="Mobile navigation">
            <button type="button" onClick={() => menuju(() => onNavigasi("trivia-kuis"))}>{label.trivia}</button>
            <div className="mobile-menu-group">
              <strong>{label.kinematics}</strong>
              {DAFTAR_MODUL_KINEMATIKA.map((item) => <button key={item.id} type="button" onClick={() => menuju(() => onPilihKinematika(item.id))}>{namaModul(item)}</button>)}
            </div>
            <div className="mobile-menu-group">
              <strong>{label.dynamics}</strong>
              {DAFTAR_MODUL_DINAMIKA.map((item) => <button key={item.id} type="button" onClick={() => menuju(() => onPilihDinamika(item.id))}>{namaModul(item)}</button>)}
            </div>
            <button type="button" onClick={() => menuju(() => onNavigasi("studi-kasus"))}>{label.kasus}</button>
            <button type="button" onClick={() => menuju(() => onNavigasi("problem-set"))}>{label.problem}</button>
          </nav>
        )}
      </div>
    </header>
  );
}
```

---

## `src/components/theme/ThemeBackdrop.tsx`

```tsx
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import type { ShinkaiTheme } from "../../theme/shinkai";

type Props = { theme: ShinkaiTheme };

const BINTANG = Array.from({ length: 34 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 53 + 7) % 100}%`,
  delay: `${-((index * 7) % 9)}s`,
  size: `${index % 7 === 0 ? 3 : 1 + (index % 2)}px`,
}));

const METEOR = Array.from({ length: 7 }, (_, index) => ({
  left: `${10 + ((index * 17) % 82)}%`,
  top: `${5 + ((index * 13) % 55)}%`,
  delay: `${-((index * 5) % 17)}s`,
  duration: `${7 + (index % 4) * 2}s`,
}));

const HUJAN = Array.from({ length: 46 }, (_, index) => ({
  left: `${(index * 23 + 3) % 100}%`,
  top: `${(index * 31 + 9) % 110 - 10}%`,
  delay: `${-((index * 11) % 5)}s`,
  duration: `${1.5 + (index % 5) * 0.37}s`,
  height: `${24 + (index % 5) * 12}px`,
}));

const SAKURA = Array.from({ length: 24 }, (_, index) => ({
  left: `${(index * 19 + 6) % 100}%`,
  delay: `${-((index * 3) % 14)}s`,
  duration: `${11 + (index % 5) * 2}s`,
  size: `${7 + (index % 4) * 2}px`,
  drift: `${-45 + ((index * 29) % 100)}px`,
}));

function TwilightScene() {
  return (
    <div className="shinkai-scene scene-twilight" aria-hidden="true">
      <div className="shinkai-nebula nebula-one" />
      <div className="shinkai-nebula nebula-two" />
      <div className="shinkai-starfield">
        {BINTANG.map((star, index) => <i key={index} style={{ left: star.left, top: star.top, animationDelay: star.delay, width: star.size, height: star.size }} />)}
      </div>
      <div className="shinkai-meteors">
        {METEOR.map((meteor, index) => <i key={index} style={{ left: meteor.left, top: meteor.top, animationDelay: meteor.delay, animationDuration: meteor.duration }} />)}
      </div>
    </div>
  );
}

function RainScene() {
  return (
    <div className="shinkai-scene scene-rain" aria-hidden="true">
      <div className="rain-glow rain-glow-one" /><div className="rain-glow rain-glow-two" />
      <div className="rain-lines">
        {HUJAN.map((drop, index) => <i key={index} style={{ left: drop.left, top: drop.top, animationDelay: drop.delay, animationDuration: drop.duration, height: drop.height }} />)}
      </div>
      <div className="rain-horizon" />
    </div>
  );
}

function CumulusScene() {
  return (
    <div className="shinkai-scene scene-cumulus" aria-hidden="true">
      <div className="cumulus-sun" />
      <div className="cumulus-beams"><i /><i /><i /><i /></div>
      <div className="cumulus-cloud cloud-back" /><div className="cumulus-cloud cloud-front" />
      <div className="cumulus-haze" />
    </div>
  );
}

function SakuraScene() {
  return (
    <div className="shinkai-scene scene-sakura" aria-hidden="true">
      <div className="sakura-moon-glow" />
      <div className="sakura-petals">
        {SAKURA.map((petal, index) => {
          const style = {
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            width: petal.size,
            height: `${Number.parseInt(petal.size, 10) * 0.68}px`,
            "--petal-drift": petal.drift,
          } as CSSProperties;
          return <i key={index} style={style} />;
        })}
      </div>
      <div className="sakura-horizon" />
    </div>
  );
}

export default function ThemeBackdrop({ theme }: Props) {
  const reduceMotion = useReducedMotion();
  const scene = {
    "twilight-comet": <TwilightScene />,
    "garden-rain": <RainScene />,
    "golden-cumulus": <CumulusScene />,
    "sakura-breeze": <SakuraScene />,
  }[theme];

  return (
    <div className="shinkai-backdrop" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          className="shinkai-scene-transition"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {scene}
        </motion.div>
      </AnimatePresence>
      <div className="shinkai-global-vignette" />
    </div>
  );
}
```

---

## `src/components/theme/ThemeSwitcher.tsx`

```tsx
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SHINKAI_THEMES, THEME_META, type ShinkaiTheme, type ThemeSelection } from "../../theme/shinkai";

type Props = {
  bahasa: "id" | "en";
  selection: ThemeSelection;
  activeTheme: ShinkaiTheme;
  onSelect: (theme: ThemeSelection) => void;
};

export default function ThemeSwitcher({ bahasa, selection, activeTheme, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isId = bahasa === "id";
  const activeMeta = THEME_META[activeTheme];

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    window.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("keydown", closeEscape);
    };
  }, [open]);

  function choose(theme: ThemeSelection) {
    onSelect(theme);
    setOpen(false);
  }

  return (
    <div className="theme-switcher" ref={rootRef}>
      <button
        type="button"
        className="theme-switcher-trigger"
        aria-label={isId ? "Pilih tema latar" : "Choose background theme"}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="theme-switcher-symbol" aria-hidden="true">{activeMeta.icon}</span>
        <span className="theme-switcher-label">{isId ? "Tema" : "Theme"}</span>
        <span className={`theme-switcher-chevron ${open ? "is-open" : ""}`} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="theme-switcher-menu"
            role="menu"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 330, damping: 27 }}
          >
            <p className="theme-switcher-heading">{isId ? "ATMOSFERA LATAR" : "AMBIENT SCENE"}</p>
            <button type="button" role="menuitemradio" aria-checked={selection === "auto"} className={`theme-choice theme-choice-auto ${selection === "auto" ? "is-selected" : ""}`} onClick={() => choose("auto")}>
              <span className="theme-choice-icon">⟳</span>
              <span className="theme-choice-copy"><strong>{isId ? "Berganti otomatis" : "Auto rotate"}</strong><small>{isId ? "Berubah setiap 16 detik" : "Changes every 16 seconds"}</small></span>
              {selection === "auto" && <b className="theme-choice-check">✓</b>}
            </button>
            <div className="theme-choice-divider" />
            {SHINKAI_THEMES.map((theme) => {
              const meta = THEME_META[theme];
              const selected = selection === theme;
              return (
                <button key={theme} type="button" role="menuitemradio" aria-checked={selected} className={`theme-choice ${selected ? "is-selected" : ""}`} onClick={() => choose(theme)}>
                  <span className={`theme-choice-icon theme-icon-${theme}`}>{meta.icon}</span>
                  <span className="theme-choice-copy"><strong>{isId ? meta.label : meta.labelEn}</strong><small>{meta.subtitle}</small></span>
                  {selected && <b className="theme-choice-check">✓</b>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## `src/features/beranda/IntroSplash.tsx`

```tsx
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
type Props = { visible: boolean };

export default function IntroSplash({ visible }: Props) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.32, ease: "easeOut" } }}
          aria-label="PhysLAB introduction"
          role="status"
        >
          <motion.div
            className="intro-splash-lockup"
            initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.82, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.82, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="intro-splash-orbit" aria-hidden="true"><i /><b /></span>
            <span>Phys<span>LAB</span></span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.3, duration: 0.35 }}
          >
            Physics at your services!
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## `src/features/beranda/BerandaPage.tsx`

```tsx
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BahasaUI } from "../../components/navigasi/FloatingNavbar";
import { pilihKutipanAcak, type KutipanIlmuwan } from "./quotes";

type Props = {
  bahasa: BahasaUI;
  kunjunganBeranda: number;
  onMulai: () => void;
  onJelajahi: () => void;
};

const LABEL = {
  id: {
    eyebrow: "A REALM OF MECHANICAL EXPLORATION",
    headline: "Fisika, tanpa batas.",
    description: "Jelajahi hukum gerak, gaya, dan keseimbangan melalui eksperimen virtual yang bisa kamu kendalikan sendiri.",
    start: "Mulai",
    explore: "Jelajahi",
    scroll: "GULIR UNTUK MENJELAJAH",
    footnote: "EKSPERIMEN INTERAKTIF · MODEL FISIKA · RASA INGIN TAHU",
  },
  en: {
    eyebrow: "A REALM OF MECHANICAL EXPLORATION",
    headline: "Physics, without limits.",
    description: "Explore motion, forces, and equilibrium through virtual experiments you can control yourself.",
    start: "Start",
    explore: "Explore",
    scroll: "SCROLL TO EXPLORE",
    footnote: "INTERACTIVE EXPERIMENTS · PHYSICS MODELS · CURIOSITY",
  },
} as const;

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M6 5h9v9" /></svg>
  );
}

function HeroBackdrop() {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="hero-grid-lines" />
      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />
      <div className="hero-cross hero-cross-one">+</div>
      <div className="hero-cross hero-cross-two">+</div>
      <div className="hero-cross hero-cross-three">+</div>
      <div className="hero-coordinate hero-coordinate-one">x(t) = x₀ + vt</div>
      <div className="hero-coordinate hero-coordinate-two">ΣF = ma</div>
      <div className="hero-spark hero-spark-one" />
      <div className="hero-spark hero-spark-two" />
      <div className="hero-spark hero-spark-three" />
    </div>
  );
}

export default function BerandaPage({ bahasa, kunjunganBeranda, onMulai, onJelajahi }: Props) {
  const text = LABEL[bahasa];
  const reduceMotion = useReducedMotion();
  const [kutipan, setKutipan] = useState<KutipanIlmuwan>(() => pilihKutipanAcak());

  useEffect(() => {
    setKutipan((saatIni) => pilihKutipanAcak(saatIni.id));
  }, [kunjunganBeranda]);

  const masuk = reduceMotion
    ? { initial: false as const, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="home-page home-page-minimal">
      <section className="home-hero home-hero-minimal" aria-labelledby="home-title">
        <HeroBackdrop />
        <div className="hero-content-minimal">
          <motion.div
            className="hero-eyebrow-minimal"
            {...masuk}
            transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow-line" />
            <span>{text.eyebrow}</span>
            <span className="eyebrow-line" />
          </motion.div>

          <motion.h1
            id="home-title"
            className="hero-wordmark"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.78, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            Phys<span>LAB</span><i className="hero-wordmark-dot" />
          </motion.h1>

          <motion.h2
            className="hero-tagline"
            {...masuk}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            {text.headline}
          </motion.h2>

          <motion.p
            className="hero-description-minimal"
            {...masuk}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.23, ease: [0.22, 1, 0.36, 1] }}
          >
            {text.description}
          </motion.p>

          <motion.div
            className="hero-quote-card"
            key={kutipan.id}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.28 }}
          >
            <blockquote>
              “{kutipan.quote}” <cite>— {kutipan.author}</cite>
            </blockquote>
          </motion.div>

          <motion.div
            className="hero-actions-minimal"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.62, delay: reduceMotion ? 0 : 0.37, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className="hero-cta hero-cta-primary" type="button" onClick={onMulai}>
              <span>{text.start}</span><ArrowUpRight />
            </button>
            <button className="hero-cta hero-cta-secondary" type="button" onClick={onJelajahi}>
              <span>{text.explore}</span><span className="hero-cta-arrow">→</span>
            </button>
          </motion.div>

          <motion.div
            className="hero-bottomline"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.6 }}
          >
            <span><i />{text.footnote}</span>
            <span className="hero-index">01 <b>/</b> 04</span>
          </motion.div>
        </div>

        <div className="hero-scroll-cue-minimal" aria-hidden="true">
          <span />{text.scroll}<span className="scroll-line" />
        </div>
      </section>

      <footer className="home-footer-minimal">
        <span>PHYSLAB <i /> {bahasa === "id" ? "LABORATORIUM FISIKA INTERAKTIF" : "INTERACTIVE PHYSICS LABORATORY"}</span>
        <span>© {new Date().getFullYear()} PHYSLAB · EXPLORE THE LAWS OF MOTION</span>
      </footer>
    </div>
  );
}
```

---

## `src/theme/shinkai.ts`

```tsx
export const SHINKAI_THEMES = [
  "twilight-comet",
  "garden-rain",
  "golden-cumulus",
  "sakura-breeze",
] as const;

export type ShinkaiTheme = (typeof SHINKAI_THEMES)[number];
export type ThemeSelection = "auto" | ShinkaiTheme;

export const THEME_META: Record<ShinkaiTheme, { label: string; labelEn: string; icon: string; subtitle: string }> = {
  "twilight-comet": {
    label: "Twilight Comet",
    labelEn: "Twilight Comet",
    icon: "☄",
    subtitle: "Meteor & stardust",
  },
  "garden-rain": {
    label: "Garden Rain",
    labelEn: "Garden Rain",
    icon: "雨",
    subtitle: "Soft rainfall",
  },
  "golden-cumulus": {
    label: "Golden Cumulus",
    labelEn: "Golden Cumulus",
    icon: "☼",
    subtitle: "Sunset cloudscape",
  },
  "sakura-breeze": {
    label: "Sakura Breeze",
    labelEn: "Sakura Breeze",
    icon: "✿",
    subtitle: "Falling petals",
  },
};
```

---

## `src/theme/shinkai-theme.css`

```css
/* ================================================================
   PHYSLAB · SHINKAI PALETTE SYSTEM
   Deep indigo / midnight blue / twilight violet / sunset orange.
   The ambient scene changes independently; functional UI colors stay
   consistent so every learning module keeps visual continuity.
================================================================ */
:root {
  color-scheme: dark;
  --bg: #080d25;
  --sidebar: #0b1230;
  --panel: #111a3b;
  --panel-soft: #182348;
  --border: rgba(166, 183, 245, .16);
  --muted: #a7b4d3;
  --faint: #7e8bae;
  --mint: #e89973;
  --blue: #aab9ef;
  --amber: #ffc18b;
  --text: #edf1ff;
  --pl-bg: #080d25;
  --pl-panel: #111a3b;
  --pl-panel-soft: #182348;
  --pl-border: rgba(166,183,245,.16);
  --pl-border-strong: rgba(188,198,255,.25);
  --pl-text: #edf1ff;
  --pl-muted: #a7b4d3;
  --pl-faint: #7e8bae;
  --pl-accent: #e89973;
  --pl-accent-soft: rgba(232,153,115,.15);
  --pl-green: #f2b28f;
  --shinkai-ambient-one: rgba(86, 99, 177, .22);
  --shinkai-ambient-two: rgba(135, 105, 171, .13);
  --shinkai-horizon: rgba(232, 153, 115, .11);
  --shinkai-cloud: rgba(145, 151, 218, .12);
  --shinkai-rain: rgba(178, 205, 245, .48);
  --shinkai-petal: rgba(255, 190, 199, .76);
}

:root[data-shinkai-theme="twilight-comet"] {
  --shinkai-ambient-one: rgba(91, 105, 198, .28);
  --shinkai-ambient-two: rgba(131, 91, 178, .18);
  --shinkai-horizon: rgba(232, 153, 115, .13);
  --shinkai-cloud: rgba(139, 145, 222, .13);
}
:root[data-shinkai-theme="garden-rain"] {
  --shinkai-ambient-one: rgba(58, 113, 115, .20);
  --shinkai-ambient-two: rgba(89, 116, 132, .15);
  --shinkai-horizon: rgba(133, 179, 158, .10);
  --shinkai-cloud: rgba(132, 179, 171, .12);
  --shinkai-rain: rgba(178, 220, 231, .5);
}
:root[data-shinkai-theme="golden-cumulus"] {
  --shinkai-ambient-one: rgba(122, 94, 156, .24);
  --shinkai-ambient-two: rgba(193, 119, 100, .17);
  --shinkai-horizon: rgba(255, 174, 112, .18);
  --shinkai-cloud: rgba(255, 190, 140, .2);
}
:root[data-shinkai-theme="sakura-breeze"] {
  --shinkai-ambient-one: rgba(112, 91, 164, .23);
  --shinkai-ambient-two: rgba(172, 113, 145, .16);
  --shinkai-horizon: rgba(255, 176, 186, .14);
  --shinkai-cloud: rgba(212, 175, 220, .16);
  --shinkai-petal: rgba(255, 193, 205, .78);
}

html, body, #root { min-height: 100%; background: transparent; }
html { background: #080d25; }
body {
  color: var(--text);
  background:
    radial-gradient(ellipse at 14% 4%, var(--shinkai-ambient-one), transparent 42rem),
    radial-gradient(ellipse at 88% 17%, var(--shinkai-ambient-two), transparent 40rem),
    linear-gradient(180deg, #080d25 0%, #090e28 58%, #0a102d 100%);
  background-attachment: fixed;
}
.site-shell, .site-shell-home, .site-shell-app {
  position: relative;
  isolation: isolate;
  background: transparent !important;
}
.site-home-main, .site-route-main, .site-route-container,
.site-route-transition, .site-feature-content, .page-content {
  position: relative;
  z-index: 1;
}
.site-route-heading {
  border-top-color: rgba(181,193,255,.09);
  border-bottom-color: rgba(181,193,255,.12);
  background: linear-gradient(100deg, rgba(12,20,53,.82), rgba(27,28,67,.58), rgba(12,20,53,.72));
  backdrop-filter: blur(18px) saturate(125%);
}
.site-route-kicker { color: #8998c0; }
.site-route-current { color: #eff2ff; }
.site-app-footer {
  border-top-color: rgba(181,193,255,.1);
  background: rgba(8,13,37,.36);
  color: #8894b5;
}

/* Ambient full-screen scenes */
.shinkai-backdrop {
  position: fixed;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  background: #080d25;
  isolation: isolate;
}
.shinkai-scene-transition, .shinkai-scene { position: absolute; inset: 0; overflow: hidden; }
.shinkai-scene { background: #080d25; }
.shinkai-global-vignette {
  position: absolute;
  z-index: 4;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(5,9,29,.15), transparent 24%, rgba(5,9,29,.18)),
    radial-gradient(ellipse at 50% 42%, transparent 28%, rgba(3,7,23,.46) 100%);
}
.scene-twilight {
  background:
    radial-gradient(ellipse at 52% 35%, rgba(83,94,177,.26), transparent 46%),
    radial-gradient(ellipse at 82% 9%, rgba(162,109,165,.18), transparent 36%),
    linear-gradient(160deg, #080d29 0%, #111739 49%, #171631 100%);
}
.shinkai-nebula { position: absolute; border-radius: 50%; filter: blur(54px); opacity: .74; }
.nebula-one { top: 12%; left: 9%; width: 46vw; height: 32vw; background: radial-gradient(ellipse, rgba(85,110,206,.22), transparent 68%); animation: shinkai-nebula-drift 26s ease-in-out infinite alternate; }
.nebula-two { right: 1%; bottom: 0; width: 54vw; height: 33vw; background: radial-gradient(ellipse, rgba(184,105,142,.15), transparent 66%); animation: shinkai-nebula-drift 32s ease-in-out infinite alternate-reverse; }
.shinkai-starfield { position: absolute; inset: 0; }
.shinkai-starfield i { position: absolute; display: block; border-radius: 50%; background: #e6edff; box-shadow: 0 0 7px 1px rgba(190,207,255,.44); opacity: .58; animation: shinkai-twinkle 3.8s ease-in-out infinite alternate; }
.shinkai-meteors { position: absolute; inset: 0; }
.shinkai-meteors i { position: absolute; display: block; width: clamp(54px, 8vw, 110px); height: 1px; opacity: 0; transform: rotate(132deg); transform-origin: right; background: linear-gradient(90deg, transparent, rgba(208,221,255,.78), rgba(255,190,147,.7)); filter: drop-shadow(0 0 5px rgba(196,205,255,.65)); animation: shinkai-meteor-fall 8s linear infinite; }
@keyframes shinkai-meteor-fall { 0% { opacity:0; translate:0 0; } 5% { opacity:.75; } 18% { opacity:0; translate:-160px 190px; } 100% { opacity:0; translate:-160px 190px; } }
@keyframes shinkai-twinkle { from { opacity:.24; transform:scale(.8); } to { opacity:.85; transform:scale(1.35); } }
@keyframes shinkai-nebula-drift { from { transform:translate3d(-2%,0,0) scale(.92); } to { transform:translate3d(4%,3%,0) scale(1.1); } }

.scene-rain {
  background:
    radial-gradient(ellipse at 78% 15%, rgba(111,159,158,.19), transparent 35%),
    radial-gradient(ellipse at 18% 65%, rgba(69,111,118,.17), transparent 43%),
    linear-gradient(165deg, #09182b 0%, #0d2334 49%, #0a1b31 100%);
}
.rain-glow { position:absolute; border-radius:50%; filter:blur(42px); }
.rain-glow-one { top:8%; right:7%; width:40vw; height:32vw; background:radial-gradient(ellipse,rgba(121,173,156,.2),transparent 68%); }
.rain-glow-two { left:-7%; bottom:0; width:46vw; height:32vw; background:radial-gradient(ellipse,rgba(72,124,142,.18),transparent 68%); }
.rain-lines { position:absolute; inset:-15% 0 0; overflow:hidden; }
.rain-lines i { position:absolute; width:1px; border-radius:4px; background:linear-gradient(180deg,transparent,var(--shinkai-rain),transparent); transform:rotate(14deg); animation:shinkai-rain-fall 2.2s linear infinite; opacity:.48; }
@keyframes shinkai-rain-fall { from { translate:0 -16vh; opacity:0; } 12% {opacity:.62;} to {translate:-5vw 120vh;opacity:0;} }
.rain-horizon { position:absolute; inset:auto 0 0; height:34%; background:linear-gradient(180deg,transparent,rgba(9,26,43,.52)); }

.scene-cumulus {
  background:
    radial-gradient(ellipse at 73% 22%, rgba(251,171,126,.28), transparent 28%),
    radial-gradient(ellipse at 17% 36%, rgba(119,105,177,.22), transparent 36%),
    linear-gradient(165deg, #15183b 0%, #352d59 49%, #68465e 100%);
}
.cumulus-sun { position:absolute; top:17%; right:17%; width:clamp(92px,13vw,180px); aspect-ratio:1; border-radius:50%; background:radial-gradient(circle at 36% 31%,#ffe3b6 0%,#ffc28e 28%,rgba(235,150,130,.65) 56%,transparent 71%); filter:blur(1px); box-shadow:0 0 75px 24px rgba(255,175,126,.17); }
.cumulus-beams { position:absolute; top:18%; right:13%; width:43vw; height:52vh; transform:rotate(12deg); transform-origin:top right; opacity:.32; }
.cumulus-beams i { position:absolute; top:0; width:13%; height:100%; background:linear-gradient(180deg,rgba(255,222,182,.17),transparent 88%); clip-path:polygon(35% 0,65% 0,100% 100%,0 100%); filter:blur(8px); }
.cumulus-beams i:nth-child(1){left:0}.cumulus-beams i:nth-child(2){left:22%;height:83%}.cumulus-beams i:nth-child(3){left:45%;height:96%}.cumulus-beams i:nth-child(4){left:69%;height:74%}
.cumulus-cloud { position:absolute; border-radius:50%; filter:blur(24px); }
.cloud-back { right:-7%; bottom:17%; width:75vw; height:24vh; background:radial-gradient(ellipse,rgba(134,119,177,.32),transparent 72%); }
.cloud-front { left:-9%; bottom:4%; width:82vw; height:27vh; background:radial-gradient(ellipse,rgba(216,139,130,.22),transparent 72%); }
.cumulus-haze { position:absolute; inset:auto 0 0; height:43%; background:linear-gradient(180deg,transparent,rgba(21,20,48,.52)); }

.scene-sakura {
  background:
    radial-gradient(ellipse at 51% 12%, rgba(153,126,184,.22), transparent 37%),
    radial-gradient(ellipse at 84% 48%, rgba(186,116,151,.19), transparent 35%),
    linear-gradient(155deg, #0b1030 0%, #222047 55%, #3b2a50 100%);
}
.sakura-moon-glow { position:absolute; top:9%; right:19%; width:clamp(100px,15vw,200px); aspect-ratio:1; border-radius:50%; background:radial-gradient(circle,rgba(255,221,211,.56),rgba(202,165,210,.15) 46%,transparent 72%); filter:blur(8px); }
.sakura-petals { position:absolute; inset:0; }
.sakura-petals i { position:absolute; top:-8%; display:block; border-radius:80% 10% 80% 10%; background:linear-gradient(135deg,rgba(255,230,229,.88),var(--shinkai-petal) 52%,rgba(224,139,174,.45)); box-shadow:0 0 13px rgba(255,177,200,.18); transform:rotate(35deg); animation:shinkai-petal-fall 15s linear infinite; }
@keyframes shinkai-petal-fall { 0% { translate:0 -10vh; rotate:0deg; opacity:0; } 9% {opacity:.72;} 52% {translate:var(--petal-drift,40px) 54vh; rotate:170deg;} 100% {translate:calc(var(--petal-drift,40px) * -.5) 112vh; rotate:360deg; opacity:0;} }
.sakura-horizon { position:absolute; inset:auto 0 0; height:30%; background:linear-gradient(180deg,transparent,rgba(11,13,39,.42)); }

/* Floating navigation and theme selector */
.floating-nav-wrap { width:min(100% - 28px, 1120px); }
.floating-nav {
  border-color:rgba(191,202,255,.16);
  background:rgba(8,13,37,.68);
  box-shadow:0 16px 54px rgba(1,4,18,.38), inset 0 1px rgba(255,255,255,.055);
}
.floating-nav-links button { color:#aab5d5; }
.floating-nav-links button:hover, .floating-nav-links button.active { color:#fff; }
.floating-nav-actions { gap:7px; }
.theme-switcher { position:relative; z-index:130; }
.theme-switcher-trigger {
  display:inline-flex; align-items:center; gap:7px; min-height:34px; padding:5px 9px;
  border:1px solid rgba(184,197,255,.14); border-radius:999px;
  background:rgba(24,31,68,.62); color:#c8d2ef; cursor:pointer;
  transition:border-color .2s,background .2s,color .2s;
}
.theme-switcher-trigger:hover, .theme-switcher-trigger[aria-expanded="true"] { border-color:rgba(232,153,115,.48); background:rgba(45,38,76,.8); color:#fff; }
.theme-switcher-symbol { display:grid; place-items:center; width:17px; color:#ffc18b; font-size:1rem; line-height:1; }
.theme-switcher-label { font-size:.65rem; font-weight:600; }
.theme-switcher-chevron { width:6px; height:6px; margin-left:2px; border-right:1px solid currentColor; border-bottom:1px solid currentColor; transform:rotate(45deg) translateY(-2px); transition:transform .18s; }
.theme-switcher-chevron.is-open { transform:rotate(225deg) translate(-1px,-1px); }
.theme-switcher-menu {
  position:absolute; top:calc(100% + 12px); right:-6px; display:grid; gap:3px;
  width:min(292px, calc(100vw - 32px)); padding:10px; border:1px solid rgba(181,195,255,.2);
  border-radius:16px; background:rgba(9,15,42,.96); color:#edf1ff;
  box-shadow:0 24px 65px rgba(0,0,0,.48), inset 0 1px rgba(255,255,255,.055);
  backdrop-filter:blur(24px) saturate(140%); -webkit-backdrop-filter:blur(24px) saturate(140%);
  transform-origin:top right;
}
.theme-switcher-heading { margin:2px 8px 6px; color:#8291b9; font:500 .54rem 'DM Mono',monospace; letter-spacing:.15em; }
.theme-choice { display:flex; align-items:center; gap:10px; width:100%; min-height:48px; padding:7px 8px; border:1px solid transparent; border-radius:10px; background:transparent; color:#c7d1ed; text-align:left; cursor:pointer; transition:background .18s,border-color .18s,color .18s; }
.theme-choice:hover { background:rgba(135,148,220,.1); color:#fff; }
.theme-choice.is-selected { border-color:rgba(232,153,115,.26); background:rgba(232,153,115,.085); color:#fff; }
.theme-choice-icon { display:grid; place-items:center; width:32px; height:32px; flex:0 0 32px; border:1px solid rgba(173,188,255,.17); border-radius:9px; background:rgba(117,130,198,.11); color:#e2e9ff; font-size:1.1rem; }
.theme-icon-twilight-comet { color:#c5caff; }.theme-icon-garden-rain {color:#9bd2c3}.theme-icon-golden-cumulus{color:#ffc18b}.theme-icon-sakura-breeze{color:#ffc2d1}
.theme-choice-copy { display:grid; gap:3px; min-width:0; }
.theme-choice-copy strong { color:inherit; font-size:.71rem; font-weight:650; }
.theme-choice-copy small { color:#8795ba; font-size:.58rem; }
.theme-choice-check { margin-left:auto; color:#f2ae89; font-size:.8rem; }
.theme-choice-divider { height:1px; margin:4px 4px; background:rgba(173,188,255,.12); }
.language-switch { border-color:rgba(184,197,255,.14); background:rgba(4,8,28,.42); }
.language-switch button { color:#8995b7; }
.language-switch button.selected { color:#21121a; background:var(--pl-accent); }
.brand-pulse-dot, .menu-live-dot { background:#f0ad87; box-shadow:0 0 11px rgba(232,153,115,.72); }
.brand-pulse-dot::after { border-color:rgba(232,153,115,.56); }
.floating-simulation-menu, .floating-mobile-menu { border-color:rgba(173,188,255,.18); background:rgba(9,15,42,.96); box-shadow:0 24px 60px rgba(0,0,0,.45); backdrop-filter:blur(22px); }
.floating-simulation-menu p, .floating-simulation-group strong { color:#8d9bc1; }
.floating-simulation-group button { color:#c1ccea; }
.floating-simulation-group button:hover, .floating-simulation-group button.selected { background:rgba(232,153,115,.09); color:#ffd4b8; }

/* Landing screen uses the same ambient sky as the other pages. */
.site-shell-home, .home-page-minimal, .home-hero-minimal, .home-footer-minimal { background:transparent !important; }
.home-hero-minimal {
  background:
    radial-gradient(ellipse at 50% 73%, rgba(232,153,115,.09), transparent 40%),
    linear-gradient(180deg,rgba(8,13,37,.16),rgba(12,15,43,.13)) !important;
}
.hero-glow-one { background:radial-gradient(ellipse,var(--shinkai-horizon),transparent 70%); }
.hero-glow-two { border-color:rgba(183,194,255,.1); }
.hero-grid-lines { background-image:linear-gradient(rgba(170,184,242,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(170,184,242,.12) 1px,transparent 1px); }
.hero-orbit { border-color:rgba(205,214,255,.08); }
.hero-orbit-two { border-color:rgba(232,153,115,.09); }
.hero-eyebrow-minimal { color:#bac4e1; }
.hero-tagline { color:#f5f1ff; }
.hero-description-minimal { color:#b3bad5; }
.hero-quote-card { border-color:rgba(183,196,255,.15); background:rgba(12,18,49,.58); box-shadow:0 16px 45px rgba(2,5,20,.16),inset 0 1px rgba(255,255,255,.035); }
.hero-quote-card blockquote { color:#d5d9ee; }
.hero-quote-card cite { color:#f1b28e; font-size:.86em; font-style:normal; white-space:nowrap; }
.quote-attribution { color:#a7b1d0; }
.hero-cta-primary { box-shadow:0 8px 28px rgba(232,153,115,.19); }
.hero-cta-secondary { border-color:rgba(187,200,255,.22); background:rgba(18,25,62,.34); color:#e5e9fb; }
.home-footer-minimal { border-top-color:rgba(184,196,255,.1); color:#8792b2; }
.intro-splash { background:radial-gradient(ellipse at 50% 44%,rgba(77,90,171,.26),transparent 45%),linear-gradient(155deg,#080d25,#111533 65%,#211d3d); }
.intro-splash > p { color:#c1c9e5; letter-spacing:.08em; text-transform:none; font:500 .75rem 'Space Grotesk',sans-serif; }

/* Shared cards, controls, and navigation states in every module. */
.panel, .control-panel, .metric-card, .graph-card, .model-matematika,
.dinamika-visual-panel, .lab-profile-level, .lab-profile-stat, .lab-path-card,
.lab-badge-card, .lab-mission-progress, .lab-brief-panel, .lab-simulation-panel,
.lab-notebook-panel, .lab-analysis-card, .ps-topic-card, .ps-question-sheet,
.ps-side-card, .ps-workspace-progress, .trivia-switcher-button, .quiz-question-block,
.quiz-side-card, .quiz-summary {
  border-color:var(--border);
  background-color:rgba(15,23,58,.88);
  box-shadow:0 13px 38px rgba(2,6,23,.16), inset 0 1px rgba(255,255,255,.025);
}
.panel, .control-panel, .metric-card, .graph-card, .model-matematika,
.dinamika-visual-panel, .lab-profile-level, .lab-profile-stat, .lab-path-card,
.lab-badge-card, .lab-mission-progress, .lab-brief-panel, .lab-simulation-panel,
.lab-notebook-panel, .lab-analysis-card, .ps-question-sheet, .ps-side-card,
.quiz-question-block, .quiz-side-card { color:#e8edff; }
.secondary-button, .icon-button, .speed-select select, .dinamika-select,
.funfact-book-controls > button, .ps-secondary-button, .ps-back-button {
  border-color:rgba(173,188,255,.2);
  background:rgba(24,34,77,.86);
  color:#dbe3fb;
}
.secondary-button:hover, .icon-button:hover, .dinamika-reset:hover,
.ps-secondary-button:hover:not(:disabled) { border-color:rgba(232,153,115,.6); }
.parameter-number-input, .ps-input-row input {
  border-color:rgba(173,188,255,.25);
  background:#0b1334;
  color:#f0f2ff;
}
.category-button, .module-button { color:#b0bddb; }
.category-button:hover, .module-button:hover { color:#f8f5ff; background:rgba(151,164,235,.08); }
.category-button.category-active, .module-button.module-active { color:#ffc29b; border-color:rgba(232,153,115,.22); background:rgba(232,153,115,.105); }
.module-status, .model-badge, .dinamika-submenu-number, .mode-indicator { color:#f0ad89; }
.dinamika-submenu { background:rgba(165,181,245,.13); }
.dinamika-submenu-button { background:rgba(13,21,54,.96); color:#dce3fa; }
.dinamika-submenu-button:hover { background:rgba(34,41,87,.96); }
.dinamika-submenu-button.is-active { background:rgba(232,153,115,.11); }
.dinamika-reset { border-color:rgba(173,188,255,.22); background:rgba(22,32,72,.9); color:#d8e0f8; }
.dinamika-select { background-color:rgba(15,24,61,.96); }
.dinamika-control-note, .dinamika-status-line, .lab-problem-block,
.ps-hint, .quiz-feedback { border-color:rgba(232,153,115,.2); background:rgba(232,153,115,.065); }
.dinamika-control-section-title, .dinamika-section-heading h2 { color:#eef0ff; }

/* Trivia, quiz and problem set */
.trivia-hero {
  border-color:rgba(173,188,255,.2);
  background:linear-gradient(112deg,#111a3b 0%,#22234e 48%,#3c315d 100%);
}
.trivia-hero::before { background:radial-gradient(ellipse at 82% 12%,rgba(255,193,139,.21),transparent 34%),radial-gradient(ellipse at 68% 105%,rgba(232,153,115,.14),transparent 38%); }
.trivia-hero h1 em { color:#ffc18b; }
.trivia-switcher-button.trivia-switcher-active { background:linear-gradient(115deg,rgba(232,153,115,.13),rgba(129,137,213,.08)),rgba(15,23,58,.88); }
.quiz-option, .ps-option, .lab-analysis-option {
  border-color:rgba(164,181,239,.2);
  background:#151f4a;
  color:#dbe4ff;
}
.quiz-option:not(:disabled):hover, .ps-option:hover { border-color:rgba(232,153,115,.55); background:#1b2858; }
.quiz-option-correct, .ps-option.is-correct, .lab-analysis-option.option-correct { color:#fff1e7; }
.quiz-option-wrong, .ps-option.is-wrong, .lab-analysis-option.option-incorrect { background:rgba(151,58,86,.13); }
.ps-primary-button, .trivia-primary-button { color:#ffe8d9; }
.ps-topic-card:hover { background-color:#1c2855; }
.ps-question-prompt, .ps-math-inline, .ps-math-display .katex { color:#e8edff; }
.ps-primary-button { border-color:rgba(232,153,115,.36); background:rgba(232,153,115,.15); }

/* The Fun Fact book becomes a nocturnal field journal rather than paper. */
.funfact-book-scene {
  border-color:rgba(173,188,255,.2);
  background:radial-gradient(ellipse at 50% 0%,rgba(135,142,220,.18),transparent 54%),linear-gradient(145deg,rgba(19,28,70,.96),rgba(8,14,41,.98));
}
.funfact-left-page, .funfact-right-page {
  color:#e9edff;
  border-color:rgba(178,190,247,.15);
  background:radial-gradient(circle at 8% 8%,rgba(177,190,255,.1),transparent 40%),linear-gradient(125deg,#18234c,#111a3d 62%,#151b40);
}
.funfact-right-page { background:radial-gradient(circle at 94% 7%,rgba(232,153,115,.12),transparent 36%),linear-gradient(125deg,#172048,#111a3c 65%,#1d1b43); }
.funfact-page-topline, .funfact-page-footer { color:#92a0c4; border-color:rgba(178,190,247,.18); }
.funfact-chapter-mark { border-color:rgba(171,187,255,.35); color:#c3caff; }
.funfact-chapter-mark::before, .funfact-chapter-mark::after { border-color:rgba(171,187,255,.22); }
.funfact-kicker, .funfact-stamp { color:#ffc18b; }
.funfact-stamp { border-color:rgba(255,193,139,.38); }
.funfact-left-page h3, .funfact-right-content h3 { color:#f0f1ff; }
.funfact-person, .funfact-story { color:#b4c0df; }
.funfact-left-quote { border-color:rgba(178,190,247,.2); }
.funfact-left-quote p { color:#c5cce4; }
.funfact-concept-box { border-left-color:#e89973; background:rgba(232,153,115,.1); }
.funfact-concept-box > span, .funfact-reflection > span { color:#f2b18c; }
.funfact-concept-box p, .funfact-reflection p { color:#bbc6e2; }
.funfact-source-toggle { color:#c5ccef; border-top-color:rgba(178,190,247,.17); }
.funfact-source-link { color:#ffc18b; }
.funfact-book-controls > button { border-color:rgba(173,188,255,.22); background:rgba(19,30,70,.9); }
.funfact-progress > div { background:rgba(173,188,255,.16); }
.funfact-progress > div > span { background:linear-gradient(90deg,#9daef5,#e89973); }

/* The map, timeline, animated case lab and dioramas share midnight surfaces. */
.peta-map-stage, .peta-selected-panel { border-color:rgba(173,188,255,.2); }
.peta-map-viewport { background:#0b1436; }
.labhub-hero, .lab-mission-header, .labhub-paths, .lab-profile-grid,
.lab-workspace-grid, .lab-badge-grid { color:#eaf0ff; }
.lab-analysis-option { color:#d4def7; }
.lab-analysis-option:hover:not(:disabled), .lab-analysis-option.option-selected { color:#fff1e6; }
.lab-primary-button, .lab-check-button { background:#e89973; color:#25121b; }
.lab-simulation-panel svg { color:#e2eaff; }

/* Menus and overlays */
.menu-overlay { background:rgba(3,6,22,.83) !important; }
.menu-intro-panel, .menu-card {
  border-color:rgba(173,188,255,.18);
  background:linear-gradient(150deg,rgba(24,32,78,.97),rgba(10,16,45,.97));
  box-shadow:0 22px 60px rgba(0,0,0,.3), inset 0 1px rgba(255,255,255,.035);
}
.menu-card:hover { border-color:rgba(232,153,115,.65); box-shadow:0 22px 58px rgba(4,7,25,.45),0 0 28px rgba(232,153,115,.08); }
.menu-card-copy strong, .menu-intro-copy h2 { color:#f0f2ff; }
.menu-card-copy > span, .menu-intro-copy p { color:#b2bddc; }
.menu-card-top, .menu-card-bottom { color:#98a5ca; }
.menu-card-art { background:radial-gradient(circle at 50% 45%,rgba(129,143,224,.17),transparent 68%); }

/* Inputs, links, and focus remain legible in every page state. */
input, select, textarea { accent-color:#e89973; }
button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, a:focus-visible { outline-color:#ffc18b; }
::selection { color:#140e29; background:#ffc18b; }

@media (max-width: 900px) {
  .floating-nav-wrap { width:min(100% - 20px, 720px); }
  .floating-nav { gap:10px; }
  .theme-switcher-label { display:none; }
  .theme-switcher-trigger { min-width:36px; justify-content:center; padding-inline:8px; }
}
@media (max-width: 650px) {
  .floating-nav-wrap { top:10px; }
  .floating-nav { gap:8px; min-height:54px; padding:7px 8px 7px 14px; }
  .floating-nav-actions { margin-left:auto; }
  .theme-switcher-menu { right:-46px; }
  .site-route-main { padding-top:75px; }
  .site-feature-content { width:calc(100% - 28px); }
}
@media (prefers-reduced-motion:reduce) {
  .shinkai-backdrop *, .shinkai-backdrop *::before, .shinkai-backdrop *::after { animation:none!important; transition:none!important; }
}
.site-app-footer, .home-page-minimal, .home-footer-minimal { position:relative; z-index:1; }
.site-shell button, .site-shell a, .site-shell input, .site-shell select, .site-shell textarea {
  transition-timing-function:cubic-bezier(.22,1,.36,1);
}
.cloud-back { animation:shinkai-cloud-drift 34s ease-in-out infinite alternate; }
.cloud-front { animation:shinkai-cloud-drift 27s ease-in-out infinite alternate-reverse; }
.cumulus-beams { animation:shinkai-beam-glow 9s ease-in-out infinite alternate; }
@keyframes shinkai-cloud-drift { from { translate:-2% 0; scale:1; } to { translate:3% -5%; scale:1.06; } }
@keyframes shinkai-beam-glow { from { opacity:.19; } to { opacity:.4; } }
```
