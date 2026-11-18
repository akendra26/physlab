import { useState } from "react";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import type { ShinkaiTheme, ThemeSelection } from "../../theme/shinkai";

export type BahasaUI = "id" | "en";
export type HalamanPublik = "beranda" | "simulasi" | "trivia-kuis" | "studi-kasus" | "problem-set";

type Props = {
  halamanAktif: string;
  bahasa: BahasaUI;
  themeSelection: ThemeSelection;
  activeTheme: ShinkaiTheme;
  onSelectTheme: (theme: ThemeSelection) => void;
  onUbahBahasa: (bahasa: BahasaUI) => void;
  onNavigasi: (halaman: HalamanPublik) => void;
};

const LABEL = {
  id: { trivia: "Trivia", simulasi: "Simulasi", kasus: "Studi Kasus", problem: "Set Soal", home: "Kembali ke beranda", open: "Buka navigasi", close: "Tutup navigasi", language: "Bahasa" },
  en: { trivia: "Trivia", simulasi: "Simulation", kasus: "Case Studies", problem: "Problem Set", home: "Back to home", open: "Open navigation", close: "Close navigation", language: "Language" },
} as const;

export default function FloatingNavbar({
  halamanAktif,
  bahasa,
  themeSelection,
  activeTheme,
  onSelectTheme,
  onUbahBahasa,
  onNavigasi,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const label = LABEL[bahasa];


  function menuju(aksi: () => void) {
    aksi();
    setMobileOpen(false);
  }


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

        <nav className="floating-nav-links" aria-label={bahasa === "id" ? "Navigasi utama" : "Main navigation"}>
          <button type="button" className={halamanAktif === "trivia-kuis" ? "active" : ""} onClick={() => menuju(() => onNavigasi("trivia-kuis"))}>{label.trivia}</button>
          <button
            type="button"
            className={`floating-simulation-trigger ${halamanAktif === "simulasi" || halamanAktif === "kinematika" || halamanAktif === "dinamika" ? "active" : ""}`}
            onClick={() => menuju(() => onNavigasi("simulasi"))}
          >
            {label.simulasi}
          </button>
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
          <nav className="floating-mobile-menu" aria-label={bahasa === "id" ? "Navigasi seluler" : "Mobile navigation"}>
            <button type="button" onClick={() => menuju(() => onNavigasi("trivia-kuis"))}>{label.trivia}</button>
            <button type="button" onClick={() => menuju(() => onNavigasi("simulasi"))}>{label.simulasi}</button>
            <button type="button" onClick={() => menuju(() => onNavigasi("studi-kasus"))}>{label.kasus}</button>
            <button type="button" onClick={() => menuju(() => onNavigasi("problem-set"))}>{label.problem}</button>
          </nav>
        )}
      </div>
    </header>
  );
}
