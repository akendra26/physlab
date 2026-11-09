import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { TITIK_SEJARAH_FISIKA, type TitikSejarahFisika } from "./dataPetaSejarah";
import "./PetaSejarahFisika.css";

type Titik = { x: number; y: number };
type Pan = { x: number; y: number };
type DragState = { pointerId: number; startX: number; startY: number; origin: Pan };

const OFFSET_PENANDA: Record<string, Titik> = {
  "pisa-galileo": { x: 38, y: 23 },
  "cambridge-newton": { x: -34, y: -24 },
  "london-principia": { x: -38, y: 24 },
  "zurich-einstein": { x: 35, y: -24 },
  "paris-curie": { x: 4, y: -39 },
  "bern-einstein": { x: 47, y: 25 },
};

function proyeksiDunia(bujur: number, lintang: number): Titik {
  return {
    x: 42 + ((bujur + 180) / 360) * 916,
    y: 36 + ((90 - lintang) / 180) * 428,
  };
}

function posisiPenanda(item: TitikSejarahFisika): Titik {
  const asli = proyeksiDunia(item.bujur, item.lintang);
  const offset = OFFSET_PENANDA[item.id] ?? { x: 0, y: 0 };
  return { x: asli.x + offset.x, y: asli.y + offset.y };
}

function buatJejak(daftar: TitikSejarahFisika[]): string {
  return [...daftar]
    .sort((a, b) => a.urutan - b.urutan)
    .map((item) => {
      const titik = posisiPenanda(item);
      return `${titik.x.toFixed(1)},${titik.y.toFixed(1)}`;
    })
    .join(" ");
}

function batasiPan(pan: Pan, zoom: number, width: number, height: number): Pan {
  if (zoom <= 1 || width <= 0 || height <= 0) return { x: 0, y: 0 };
  const setengahLebar = (zoom - 1) * width / 2;
  const setengahTinggi = (zoom - 1) * height / 2;
  return {
    x: Math.max(-setengahLebar, Math.min(setengahLebar, pan.x)),
    y: Math.max(-setengahTinggi, Math.min(setengahTinggi, pan.y)),
  };
}

type PenandaProps = {
  peristiwa: TitikSejarahFisika;
  aktif: boolean;
  onPilih: (id: string) => void;
  onHover: (id: string) => void;
  onLeave: () => void;
};

function PenandaLokasi({ peristiwa, aktif, onPilih, onHover, onLeave }: PenandaProps) {
  const titikAsli = proyeksiDunia(peristiwa.bujur, peristiwa.lintang);
  const titik = posisiPenanda(peristiwa);
  const warna = peristiwa.aksen === "mint" ? "#61e4cb"
    : peristiwa.aksen === "amber" ? "#ffc477"
      : peristiwa.aksen === "violet" ? "#b6a0ff" : "#91b6ff";

  function tekanTombol(event: ReactKeyboardEvent<SVGGElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onPilih(peristiwa.id);
    }
  }

  return (
    <g
      className={`peta-marker peta-marker-${peristiwa.aksen} ${aktif ? "is-active" : ""}`}
      role="button"
      tabIndex={0}
      data-map-pin="true"
      aria-label={`Tampilkan ${peristiwa.kota}: ${peristiwa.judul}`}
      aria-pressed={aktif}
      onClick={() => onPilih(peristiwa.id)}
      onPointerEnter={() => onHover(peristiwa.id)}
      onPointerLeave={onLeave}
      onKeyDown={tekanTombol}
      transform={`translate(${titik.x} ${titik.y})`}
      style={{ "--marker-color": warna } as CSSProperties}
    >
      <line
        className="peta-marker-leader"
        x1={titikAsli.x - titik.x}
        y1={titikAsli.y - titik.y}
        x2={0}
        y2={0}
      />
      <circle className="peta-marker-halo" r="12" />
      <circle className="peta-marker-core" r="5" />
      <circle className="peta-marker-center" r="1.8" />
      <text className="peta-marker-label" x="10" y="-9">{peristiwa.kota}</text>
      <title>{`${peristiwa.kota}, ${peristiwa.negara} — ${peristiwa.tokoh}`}</title>
    </g>
  );
}

type KartuProps = {
  peristiwa: TitikSejarahFisika;
  aktif: boolean;
  terbalik: boolean;
  onPilih: (id: string) => void;
  onBalik: (id: string) => void;
};

function KartuSejarah({ peristiwa, aktif, terbalik, onPilih, onBalik }: KartuProps) {
  function gerakPointer(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;
    const batas = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - batas.left) / batas.width;
    const y = (event.clientY - batas.top) / batas.height;
    event.currentTarget.style.setProperty("--tilt-x", `${((x - 0.5) * 8).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${((0.5 - y) * 8).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--shine-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--shine-y", `${y * 100}%`);
  }

  function resetPointer(event: ReactPointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
    event.currentTarget.style.setProperty("--shine-x", "50%");
    event.currentTarget.style.setProperty("--shine-y", "50%");
  }

  const gayaKartu = {
    "--card-accent": peristiwa.aksen === "mint" ? "#61e4cb"
      : peristiwa.aksen === "amber" ? "#ffc477"
        : peristiwa.aksen === "violet" ? "#b6a0ff" : "#91b6ff",
  } as CSSProperties;

  return (
    <article
      className={`peta-history-card peta-card-${peristiwa.aksen} ${aktif ? "is-selected" : ""}`}
      style={gayaKartu}
      onPointerMove={gerakPointer}
      onPointerLeave={resetPointer}
      data-peristiwa={peristiwa.id}
    >
      <div className="peta-card-tilt">
        <div className="peta-card-flipper" data-flipped={terbalik}>
          <section className="peta-card-face peta-card-front" aria-hidden={terbalik}>
            <div className="peta-card-topline">
              <span>ARSIP PENEMUAN · {peristiwa.urutan.toString().padStart(2, "0")}</span>
              <span>{peristiwa.tahun}</span>
            </div>
            <div className="peta-card-visual" aria-hidden="true">
              <span className="peta-card-orbit peta-card-orbit-one" />
              <span className="peta-card-orbit peta-card-orbit-two" />
              <span className="peta-card-symbol">{peristiwa.simbol}</span>
              <span className="peta-card-spark">✦</span>
            </div>
            <div className="peta-card-front-copy">
              <span className="peta-card-location">{peristiwa.kota.toUpperCase()} · {peristiwa.negara.toUpperCase()}</span>
              <h3>{peristiwa.judul}</h3>
              <p>{peristiwa.tokoh}</p>
            </div>
            <div className="peta-card-foot"><span>{peristiwa.cabang}</span><span>BUKA KISAH ↗</span></div>
          </section>
          <section className="peta-card-face peta-card-back" aria-hidden={!terbalik}>
            <div className="peta-card-topline"><span>KISAH DI BALIK GAGASAN</span><span>{peristiwa.tahun}</span></div>
            <div className="peta-card-back-copy">
              <span className="peta-card-location">{peristiwa.kota}, {peristiwa.negara}</span>
              <h3>{peristiwa.tokoh}</h3>
              <p>{peristiwa.cerita}</p>
              <div className="peta-card-contribution"><strong>JEJAK ILMIAH</strong><span>{peristiwa.kontribusi}</span></div>
              <div className="peta-card-source">
                {peristiwa.sumber.map((sumber) => (
                  <a key={sumber.url} href={sumber.url} target="_blank" rel="noreferrer" tabIndex={terbalik ? 0 : -1}>{sumber.label} ↗</a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="peta-card-actions">
        <button type="button" className="peta-card-locate" onClick={() => onPilih(peristiwa.id)}>{aktif ? "Lokasi dipilih" : "Tampilkan di peta"}</button>
        <button type="button" className="peta-card-flip-button" onClick={() => onBalik(peristiwa.id)} aria-pressed={terbalik}>{terbalik ? "Balik ke depan" : "Baca kisah ↻"}</button>
      </div>
    </article>
  );
}

/** Atlas dunia tanpa inset Eropa; lokasi Eropa dipisah dengan leader line dan offset visual. */
export default function PetaSejarahFisika() {
  const [lokasiAktifId, setLokasiAktifId] = useState(TITIK_SEJARAH_FISIKA[0]?.id ?? "");
  const [kartuTerbalikId, setKartuTerbalikId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.18);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [detailTerlihat, setDetailTerlihat] = useState(true);
  const [lokasiHoverId, setLokasiHoverId] = useState<string | null>(null);
  const [popupTerkunciId, setPopupTerkunciId] = useState<string | null>(null);
  const [sedangDrag, setSedangDrag] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const popupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (popupTimer.current) clearTimeout(popupTimer.current);
  }, []);

  const peristiwaAktif = TITIK_SEJARAH_FISIKA.find((item) => item.id === lokasiAktifId)
    ?? TITIK_SEJARAH_FISIKA[0];
  const peristiwaPopup = TITIK_SEJARAH_FISIKA.find((item) => item.id === (lokasiHoverId ?? popupTerkunciId));
  const jejakDunia = useMemo(() => buatJejak(TITIK_SEJARAH_FISIKA), []);

  function pilihLokasi(id: string) {
    setLokasiAktifId(id);
    setPopupTerkunciId((sebelumnya) => sebelumnya === id ? null : id);
  }

  function mulaiHoverLokasi(id: string) {
    if (popupTimer.current) clearTimeout(popupTimer.current);
    setLokasiHoverId(id);
  }

  function akhirHoverLokasi() {
    if (popupTimer.current) clearTimeout(popupTimer.current);
    popupTimer.current = setTimeout(() => setLokasiHoverId(null), 180);
  }

  function balikKartu(id: string) {
    setKartuTerbalikId((sebelumnya) => sebelumnya === id ? null : id);
  }

  function ubahZoom(nilaiBaru: number, anchorX?: number, anchorY?: number) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;
    const x = anchorX ?? width / 2;
    const y = anchorY ?? height / 2;
    const zoomBaru = Math.max(0.85, Math.min(3.2, nilaiBaru));
    const faktor = zoomBaru / zoom;
    const offsetLamaX = pan.x + (1 - zoom) * width / 2;
    const offsetLamaY = pan.y + (1 - zoom) * height / 2;
    const offsetBaruX = x - (x - offsetLamaX) * faktor;
    const offsetBaruY = y - (y - offsetLamaY) * faktor;
    const panBaru = {
      x: offsetBaruX - (1 - zoomBaru) * width / 2,
      y: offsetBaruY - (1 - zoomBaru) * height / 2,
    };
    setZoom(zoomBaru);
    setPan(batasiPan(panBaru, zoomBaru, width, height));
  }

  function tanganiRoda(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const batas = event.currentTarget.getBoundingClientRect();
    const faktor = Math.exp(-event.deltaY * 0.0015);
    ubahZoom(zoom * faktor, event.clientX - batas.left, event.clientY - batas.top);
  }

  function mulaiDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const target = event.target;
    if (target instanceof Element && target.closest("[data-map-pin], button, a")) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: pan,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setSedangDrag(true);
  }

  function gerakDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const next = {
      x: drag.origin.x + event.clientX - drag.startX,
      y: drag.origin.y + event.clientY - drag.startY,
    };
    setPan(batasiPan(next, zoom, viewport.clientWidth, viewport.clientHeight));
  }

  function akhiriDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setSedangDrag(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const titikPopup = peristiwaPopup ? posisiPenanda(peristiwaPopup) : null;
  const viewport = viewportRef.current;
  const lebarViewport = viewport?.clientWidth ?? 0;
  const tinggiViewport = viewport?.clientHeight ?? 0;
  const offsetX = pan.x + (1 - zoom) * lebarViewport / 2;
  const offsetY = pan.y + (1 - zoom) * tinggiViewport / 2;
  const popupX = titikPopup ? offsetX + (titikPopup.x / 1000) * zoom * lebarViewport : 0;
  const popupY = titikPopup ? offsetY + (titikPopup.y / 500) * zoom * tinggiViewport : 0;
  const popupStyle = titikPopup && lebarViewport > 0
    ? {
        left: `${Math.max(8, Math.min(lebarViewport - 270, popupX + (popupX > lebarViewport * 0.62 ? -282 : 14)))}px`,
        top: `${Math.max(8, Math.min(tinggiViewport - 155, popupY - 12))}px`,
      }
    : undefined;

  if (!peristiwaAktif) return null;

  return (
    <section className="peta-sejarah" aria-labelledby="peta-sejarah-title">
      <header className="peta-section-heading">
        <div>
          <p className="trivia-eyebrow">ATLAS PENGETAHUAN · JEJAK PARA ILMUWAN</p>
          <h2 id="peta-sejarah-title">Peta perjalanan gagasan fisika</h2>
          <p>Geser peta dengan klik kiri, gunakan roda tetikus atau tombol zoom untuk menjelajahi lokasi sejarah fisika.</p>
        </div>
        <div className="peta-heading-stats">
          <strong>{TITIK_SEJARAH_FISIKA.length.toString().padStart(2, "0")}</strong>
          <span>LOKASI SEJARAH</span>
        </div>
      </header>

      <div className={`peta-map-layout ${detailTerlihat ? "" : "is-detail-hidden"}`}>
        <div className="peta-map-stage">
          <div className="peta-map-toolbar">
            <div className="peta-map-topbar">
              <span><i className="peta-live-dot" /> ATLAS INTERAKTIF</span>
              <span>SKALA DUNIA · PROYEKSI ILUSTRATIF</span>
            </div>
            <div className="peta-map-actions">
              <div className="peta-zoom-controls" role="group" aria-label="Kontrol pembesaran peta">
                <button type="button" onClick={() => ubahZoom(zoom / 1.18)} disabled={zoom <= 0.851} aria-label="Perkecil peta">−</button>
                <span aria-live="polite">{Math.round(zoom * 100)}%</span>
                <button type="button" onClick={() => ubahZoom(zoom * 1.18)} disabled={zoom >= 3.199} aria-label="Perbesar peta">+</button>
                <button type="button" className="peta-zoom-reset" onClick={() => { setZoom(1.18); setPan({ x: 0, y: 0 }); }} aria-label="Atur ulang tampilan peta">Atur ulang</button>
              </div>
              <button type="button" className="peta-detail-toggle" onClick={() => setDetailTerlihat((terlihat) => !terlihat)} aria-expanded={detailTerlihat} aria-controls="peta-panel-detail">
                <span aria-hidden="true">{detailTerlihat ? "◧" : "▣"}</span>
                {detailTerlihat ? "Sembunyikan detail" : "Tampilkan detail"}
              </button>
            </div>
          </div>

          <div
            ref={viewportRef}
            className={`peta-map-viewport ${sedangDrag ? "is-dragging" : ""}`}
            onWheel={tanganiRoda}
            onPointerDown={mulaiDrag}
            onPointerMove={gerakDrag}
            onPointerUp={akhiriDrag}
            onPointerCancel={akhiriDrag}
            onLostPointerCapture={() => { dragRef.current = null; setSedangDrag(false); }}
            aria-label="Peta dapat digeser dengan klik kiri dan diperbesar dengan roda tetikus"
          >
            <div
              className="peta-map-zoom-layer"
              style={{
                transform: `translate3d(${pan.x + (1 - zoom) * lebarViewport / 2}px, ${pan.y + (1 - zoom) * tinggiViewport / 2}px, 0) scale(${zoom})`,
              }}
            >
              <svg className="peta-world-svg" viewBox="0 0 1000 500" role="group" aria-label="Peta dunia ilustratif dengan penanda sejarah fisika">
                <defs>
                  <linearGradient id="peta-ocean" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#142a4a" />
                    <stop offset="55%" stopColor="#0b1c35" />
                    <stop offset="100%" stopColor="#10162d" />
                  </linearGradient>
                  <linearGradient id="peta-land" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#5a7892" stopOpacity=".67" />
                    <stop offset="100%" stopColor="#304e70" stopOpacity=".42" />
                  </linearGradient>
                </defs>
                <rect width="1000" height="500" rx="16" fill="url(#peta-ocean)" />
                <g className="peta-graticule">
                  {Array.from({ length: 9 }, (_, index) => <line key={`lat-${index}`} x1="42" x2="958" y1={36 + index * 53.5} y2={36 + index * 53.5} />)}
                  {Array.from({ length: 13 }, (_, index) => <line key={`lon-${index}`} y1="36" y2="464" x1={42 + index * (916 / 12)} x2={42 + index * (916 / 12)} />)}
                </g>
                <g className="peta-continents">
                  <path d="M75 105 105 76 149 65 183 78 201 101 244 104 269 135 253 159 225 164 209 190 177 191 157 218 133 208 123 184 99 174 85 145Z" />
                  <path d="M244 226 274 239 292 265 305 292 300 321 318 348 306 379 292 411 275 439 262 408 257 377 241 352 238 321 222 293 227 263Z" />
                  <path d="M405 112 431 94 460 101 478 91 510 100 530 91 554 102 575 96 605 110 634 102 663 117 690 110 717 127 748 127 771 147 807 151 829 176 855 177 872 201 846 216 816 204 798 224 774 220 757 240 731 227 710 246 679 230 650 241 624 224 593 230 573 208 551 215 532 197 503 205 481 183 455 181 432 157Z" />
                  <path d="M468 207 493 201 519 219 537 251 548 283 538 316 526 348 510 379 491 354 485 322 466 296 455 264 448 236Z" />
                  <path d="M570 234 596 238 620 258 636 285 631 317 612 331 591 310 581 282 563 260Z" />
                  <path d="M735 321 766 308 799 315 825 335 819 360 790 373 762 362 741 342Z" />
                  <path d="M862 267 880 254 902 264 909 285 893 302 872 293Z" />
                  <path d="M350 154 365 143 382 150 388 165 373 177 356 171Z" />
                </g>
                <polyline className="peta-tracker-line peta-tracker-world" points={jejakDunia} fill="none" />
                {TITIK_SEJARAH_FISIKA.map((peristiwa) => (
                  <PenandaLokasi
                    key={peristiwa.id}
                    peristiwa={peristiwa}
                    aktif={lokasiAktifId === peristiwa.id}
                    onPilih={pilihLokasi}
                    onHover={mulaiHoverLokasi}
                    onLeave={akhirHoverLokasi}
                  />
                ))}
                <g className="peta-world-caption">
                  <text x="58" y="478">PHYSLAB · ATLAS SEJARAH</text>
                  <text x="942" y="478" textAnchor="end">0° LONGITUDE REFERENCE</text>
                </g>
              </svg>
            </div>

            {peristiwaPopup && popupStyle && (
              <div className="peta-map-popup" style={popupStyle} role="status" onPointerEnter={() => { if (popupTimer.current) clearTimeout(popupTimer.current); }} onPointerLeave={akhirHoverLokasi}>
                <div className="peta-popup-topline">
                  <span>ARSIP LOKASI · {peristiwaPopup.tahun}</span>
                  <button type="button" onClick={() => { setPopupTerkunciId(null); setLokasiHoverId(null); }} aria-label="Tutup pop-up">×</button>
                </div>
                <strong>{peristiwaPopup.kota}, {peristiwaPopup.negara}</strong>
                <span className="peta-popup-person">{peristiwaPopup.tokoh}</span>
                <p>{peristiwaPopup.ringkasan}</p>
                <button type="button" className="peta-popup-detail-link" onClick={() => { setLokasiAktifId(peristiwaPopup.id); setDetailTerlihat(true); setPopupTerkunciId(null); }}>
                  Buka panel detail <span>↗</span>
                </button>
              </div>
            )}
          </div>

          <div className="peta-map-legend">
            <span><i className="legend-pin legend-pin-mint" /> Penanda lokasi</span>
            <span><i className="legend-route" /> Jalur kronologi</span>
            <span className="peta-zoom-hint">Klik kiri + geser untuk menggeser peta</span>
          </div>
        </div>

        {detailTerlihat && (
          <aside className="peta-selected-panel" id="peta-panel-detail" aria-live="polite">
            <div className="peta-selected-kicker">
              <span>LOKASI TERPILIH</span>
              <span>{String(peristiwaAktif.urutan).padStart(2, "0")} / {String(TITIK_SEJARAH_FISIKA.length).padStart(2, "0")}</span>
            </div>
            <div className={`peta-selected-symbol peta-symbol-${peristiwaAktif.aksen}`}>{peristiwaAktif.simbol}</div>
            <span className="peta-selected-date">{peristiwaAktif.tahun}</span>
            <h3>{peristiwaAktif.kota}, {peristiwaAktif.negara}</h3>
            <p className="peta-selected-person">{peristiwaAktif.tokoh}</p>
            <h4>{peristiwaAktif.judul}</h4>
            <p className="peta-selected-summary">{peristiwaAktif.ringkasan}</p>
            <div className="peta-selected-field"><span>BIDANG</span><strong>{peristiwaAktif.cabang}</strong></div>
            <div className="peta-selected-note"><strong>KONTEKS SEJARAH</strong><p>{peristiwaAktif.catatan}</p></div>
            <a className="peta-selected-read" href={peristiwaAktif.sumber[0]?.url} target="_blank" rel="noreferrer">Baca sumber sejarah <span>↗</span></a>
          </aside>
        )}
      </div>

      <section className="peta-gallery" aria-labelledby="peta-gallery-title">
        <div className="peta-gallery-heading">
          <div>
            <p className="trivia-eyebrow">ARSIP TOKOH & PENEMUAN</p>
            <h3 id="peta-gallery-title">Balik halaman sejarah</h3>
            <p>Arahkan kursor untuk efek tilt 3D. Tekan tombol pada kartu untuk membuka kisah, kontribusi, dan sumber bacaan.</p>
          </div>
          <span>{TITIK_SEJARAH_FISIKA.length} KARTU ARSIP</span>
        </div>
        <div className="peta-card-grid">
          {TITIK_SEJARAH_FISIKA.map((peristiwa) => (
            <KartuSejarah
              key={peristiwa.id}
              peristiwa={peristiwa}
              aktif={lokasiAktifId === peristiwa.id}
              terbalik={kartuTerbalikId === peristiwa.id}
              onPilih={pilihLokasi}
              onBalik={balikKartu}
            />
          ))}
        </div>
      </section>
      <p className="peta-data-note">Peta merupakan proyeksi ilustratif, bukan peta navigasi presisi. Penanda di Eropa digeser secara visual dengan garis penghubung agar lokasi yang berdekatan tetap dapat dipilih. Garis tracker menunjukkan urutan kronologi pembelajaran, bukan rute perjalanan nyata.</p>
    </section>
  );
}
