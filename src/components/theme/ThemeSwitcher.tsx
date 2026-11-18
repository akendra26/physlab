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
