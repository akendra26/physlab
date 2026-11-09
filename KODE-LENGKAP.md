# PhysLAB — Kode Lengkap Revisi Trivia & Kuis

Dokumen ini menggabungkan semua file sumber yang diubah/ditambahkan. Salin sesuai path yang tertera.


## `src/features/trivia-kuis/TriviaKuisPage.tsx`

```tsx
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
```


## `src/features/trivia-kuis/FunFactMekanika.tsx`

```tsx
import { useState } from "react";
import { DAFTAR_FUN_FACT_MEKANIKA } from "./dataFunFactMekanika";
import "./FunFactMekanika.css";

/** Buku digital berisi fakta singkat, konteks konsep, dan refleksi mekanika. */
export default function FunFactMekanika() {
  const [indeks, setIndeks] = useState(0);
  const [arahHalaman, setArahHalaman] = useState<"maju" | "mundur">("maju");
  const [sumberTerbuka, setSumberTerbuka] = useState(false);
  const fakta = DAFTAR_FUN_FACT_MEKANIKA[indeks];
  const total = DAFTAR_FUN_FACT_MEKANIKA.length;

  function pindahHalaman(arah: "maju" | "mundur") {
    setArahHalaman(arah);
    setSumberTerbuka(false);
    setIndeks((sebelumnya) =>
      arah === "maju"
        ? Math.min(total - 1, sebelumnya + 1)
        : Math.max(0, sebelumnya - 1),
    );
  }

  if (!fakta) return null;

  return (
    <section className="funfact-book-section" aria-labelledby="funfact-title">
      <header className="funfact-heading">
        <div>
          <p className="trivia-eyebrow">BUKU SAKU · MEKANIKA DALAM KEHIDUPAN</p>
          <h2 id="funfact-title">Fun Fact Mekanika</h2>
          <p>Balik halaman untuk menemukan kisah di balik gerak, gaya, dan rotasi yang sering kita jumpai.</p>
        </div>
        <div className="funfact-book-count">
          <strong>{String(indeks + 1).padStart(2, "0")}</strong>
          <span> / {String(total).padStart(2, "0")} HALAMAN</span>
        </div>
      </header>

      <div className="funfact-book-scene">
        <div className="funfact-book-spine" aria-hidden="true" />
        <div className="funfact-book-spread" key={fakta.id} data-turn={arahHalaman}>
          <aside className="funfact-left-page">
            <div className="funfact-page-topline">
              <span>PHYSLAB · CATATAN MEKANIKA</span>
              <span>{String(indeks + 1).padStart(2, "0")}</span>
            </div>
            <div className="funfact-chapter-mark" aria-hidden="true">
              <span>{fakta.simbol}</span>
              <i />
              <i />
            </div>
            <p className="funfact-kicker">{fakta.bagian.toUpperCase()}</p>
            <h3>{fakta.judul}</h3>
            <p className="funfact-person">{fakta.tokoh}</p>
            <div className="funfact-left-quote">
              <span>“</span>
              <p>Fenomena sederhana dapat menyimpan prinsip fisika yang mendalam.</p>
            </div>
            <div className="funfact-page-footer">
              <span>PHYSLAB FIELD NOTES</span>
              <span>{fakta.tahun}</span>
            </div>
          </aside>

          <article className="funfact-right-page">
            <div className="funfact-page-topline">
              <span>FAKTA MEKANIKA</span>
              <span>{fakta.tahun}</span>
            </div>
            <div className="funfact-right-content">
              <span className="funfact-stamp">TAHUKAH KAMU?</span>
              <h3>{fakta.judul}</h3>
              <p className="funfact-story">{fakta.fakta}</p>
              <div className="funfact-concept-box">
                <span>HUBUNGAN KONSEP</span>
                <p>{fakta.konsep}</p>
              </div>
              <div className="funfact-reflection">
                <span>RENUNGKAN</span>
                <p>{fakta.refleksi}</p>
              </div>
              <button
                className="funfact-source-toggle"
                type="button"
                onClick={() => setSumberTerbuka((terbuka) => !terbuka)}
                aria-expanded={sumberTerbuka}
              >
                {sumberTerbuka ? "Tutup sumber" : "Buka sumber bacaan"}
                <span aria-hidden="true">{sumberTerbuka ? "−" : "+"}</span>
              </button>
              {sumberTerbuka && (
                <a className="funfact-source-link" href={fakta.sumber} target="_blank" rel="noreferrer">
                  Baca referensi pendukung ↗
                </a>
              )}
            </div>
            <div className="funfact-page-footer">
              <span>JELAJAHI · PAHAMI · BUKTIKAN</span>
              <span>{indeks + 1}</span>
            </div>
          </article>
        </div>
      </div>

      <div className="funfact-book-controls">
        <button type="button" onClick={() => pindahHalaman("mundur")} disabled={indeks === 0}>
          <span aria-hidden="true">←</span> Halaman sebelumnya
        </button>
        <div className="funfact-progress" aria-label={`Halaman ${indeks + 1} dari ${total}`}>
          <div><span style={{ width: `${((indeks + 1) / total) * 100}%` }} /></div>
          <small>{Math.round(((indeks + 1) / total) * 100)}% dibaca</small>
        </div>
        <button type="button" onClick={() => pindahHalaman("maju")} disabled={indeks === total - 1}>
          Halaman berikutnya <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
```


## `src/features/trivia-kuis/dataFunFactMekanika.ts`

```typescript
export type FunFactMekanika = {
  id: string;
  bagian: string;
  tahun: string;
  judul: string;
  tokoh: string;
  simbol: string;
  fakta: string;
  konsep: string;
  refleksi: string;
  sumber: string;
};

/** Kumpulan 15 halaman fun fact mekanika untuk format buku interaktif. */
export const DAFTAR_FUN_FACT_MEKANIKA: FunFactMekanika[] = [
  {
    "id": "galileo-bidang-miring",
    "bagian": "Kinematika",
    "tahun": "ABAD KE-17",
    "judul": "Galileo memperlambat gerak agar lebih mudah diamati",
    "tokoh": "Galileo Galilei",
    "simbol": "↘",
    "fakta": "Alih-alih hanya mengamati benda jatuh bebas yang sangat cepat, Galileo menggunakan bidang miring untuk memperlambat gerak dan mengamati perubahan posisi terhadap waktu.",
    "konsep": "Eksperimen bidang miring membantu mengembangkan gagasan percepatan dan hubungan kuantitatif antara waktu dengan gerak.",
    "refleksi": "Mengubah kondisi eksperimen dapat membuat fenomena yang terlalu cepat menjadi lebih mudah diukur.",
    "sumber": "https://plato.stanford.edu/entries/galileo/"
  },
  {
    "id": "galileo-proyektil",
    "bagian": "Gerak Parabola",
    "tahun": "1638",
    "judul": "Lintasan proyektil dipahami sebagai gabungan dua gerak",
    "tokoh": "Galileo Galilei",
    "simbol": "⌁",
    "fakta": "Dalam karya Two New Sciences, Galileo membahas lintasan proyektil dengan menggabungkan gerak horizontal beraturan dan gerak vertikal yang dipercepat oleh gravitasi.",
    "konsep": "Dalam model ideal tanpa hambatan udara, kedua komponen gerak dapat dianalisis secara terpisah lalu digabungkan.",
    "refleksi": "Satu lintasan dapat dipahami sebagai superposisi dua gerak pada arah yang saling tegak lurus.",
    "sumber": "https://catalogue.museogalileo.it/section/ScienceOfMotion.html"
  },
  {
    "id": "newton-principia",
    "bagian": "Dinamika",
    "tahun": "1687",
    "judul": "Principia menghubungkan gerak di Bumi dan langit",
    "tokoh": "Isaac Newton",
    "simbol": "ΣF",
    "fakta": "Newton menerbitkan Principia Mathematica pada 1687. Karya ini menyajikan hukum gerak dan gravitasi universal dalam satu kerangka matematis.",
    "konsep": "Mekanika Newton menunjukkan bahwa prinsip yang sama dapat digunakan untuk memahami gerak benda di permukaan Bumi maupun gerak benda langit.",
    "refleksi": "Kekuatan sebuah teori terlihat ketika satu kerangka penjelasan dapat menerangkan banyak fenomena.",
    "sumber": "https://www.loc.gov/item/2021667054/"
  },
  {
    "id": "halley-principia",
    "bagian": "Sejarah Sains",
    "tahun": "1687",
    "judul": "Edmond Halley membantu Principia sampai ke pembaca",
    "tokoh": "Edmond Halley",
    "simbol": "✦",
    "fakta": "Halley mendorong Newton menyusun gagasan tentang gerak planet dan membantu proses penerbitan Principia. Ia juga terlibat dalam pembiayaan dan pengurusan penerbitannya.",
    "konsep": "Kemajuan ilmu tidak hanya bergantung pada penemu gagasan, tetapi juga pada kolaborasi, komunikasi, dan penerbitan.",
    "refleksi": "Ilmu pengetahuan berkembang melalui komunitas yang saling menguji dan mendukung gagasan.",
    "sumber": "https://www.rmg.co.uk/stories/topics/edmond-halley"
  },
  {
    "id": "huygens-pendulum",
    "bagian": "Gerak Periodik",
    "tahun": "1656–1658",
    "judul": "Bandul membantu mengatur waktu dengan lebih teratur",
    "tokoh": "Christiaan Huygens",
    "simbol": "◒",
    "fakta": "Huygens mengembangkan jam bandul pada pertengahan abad ke-17. Ayunan bandul memberikan gerak periodik yang dapat dimanfaatkan untuk mengukur waktu lebih konsisten.",
    "konsep": "Untuk simpangan kecil, periode bandul sederhana terutama ditentukan oleh panjang tali dan percepatan gravitasi, bukan massa bandul.",
    "refleksi": "Gerak berulang dapat menjadi acuan waktu ketika periodenya cukup stabil.",
    "sumber": "https://www.britannica.com/biography/Christiaan-Huygens"
  },
  {
    "id": "atwood-machine",
    "bagian": "Dinamika",
    "tahun": "1784",
    "judul": "Mesin Atwood membuat hukum gerak lebih mudah diuji",
    "tokoh": "George Atwood",
    "simbol": "⚙",
    "fakta": "George Atwood memperkenalkan mesin Atwood untuk mempelajari hubungan gaya dan percepatan. Dua massa yang dihubungkan tali melalui katrol menghasilkan gerak yang lebih lambat daripada jatuh bebas.",
    "konsep": "Sistem ini menjadi model pembelajaran Hukum II Newton, tegangan tali, dan percepatan pada katrol ideal.",
    "refleksi": "Model sederhana dapat mengisolasi variabel sehingga hukum fisika lebih mudah diuji.",
    "sumber": "https://www.britannica.com/science/Atwoods-machine"
  },
  {
    "id": "cavendish-balance",
    "bagian": "Gravitasi",
    "tahun": "1798",
    "judul": "Timbangan puntir mengungkap tarikan gravitasi yang sangat kecil",
    "tokoh": "Henry Cavendish",
    "simbol": "G",
    "fakta": "Dengan neraca puntir, Cavendish mengukur gaya tarik gravitasi yang sangat kecil antara benda-benda di laboratorium. Hasilnya digunakan untuk menentukan kerapatan rata-rata Bumi; nilai konstanta gravitasi kemudian dapat diturunkan dari eksperimen tersebut.",
    "konsep": "Gaya gravitasi dapat diukur di laboratorium, meskipun jauh lebih lemah daripada gaya kontak sehari-hari.",
    "refleksi": "Instrumen yang sangat sensitif memungkinkan ilmuwan mengukur interaksi yang tidak terlihat langsung.",
    "sumber": "https://www.rigb.org/explore-science/explore/collection/henry-cavendishs-experiment"
  },
  {
    "id": "foucault-pendulum",
    "bagian": "Rotasi",
    "tahun": "1851",
    "judul": "Bandul Foucault memperlihatkan rotasi Bumi",
    "tokoh": "Léon Foucault",
    "simbol": "↻",
    "fakta": "Foucault mendemonstrasikan bandul panjang di Paris pada 1851. Bidang ayun bandul tampak berputar relatif terhadap lantai, memberikan bukti visual bahwa Bumi berotasi.",
    "konsep": "Gerak bandul dipengaruhi kerangka acuan yang ikut berotasi bersama Bumi.",
    "refleksi": "Eksperimen mekanika dapat mengungkap gerak planet yang tidak terasa langsung oleh manusia.",
    "sumber": "https://www.si.edu/spotlight/foucault-pendulum"
  },
  {
    "id": "joule-mechanical-equivalent",
    "bagian": "Energi",
    "tahun": "1840-an",
    "judul": "Eksperimen Joule menghubungkan kerja mekanik dan kalor",
    "tokoh": "James Prescott Joule",
    "simbol": "W ↔ Q",
    "fakta": "Joule menggunakan beberapa eksperimen, termasuk alat dengan beban jatuh yang memutar pengaduk di dalam air, untuk menunjukkan hubungan kuantitatif antara kerja mekanik dan pemanasan.",
    "konsep": "Energi dapat berpindah dan berubah bentuk; kerja mekanik dapat meningkatkan energi internal suatu sistem.",
    "refleksi": "Fenomena yang tampak berbeda dapat terhubung melalui prinsip kekekalan energi.",
    "sumber": "https://www.sciencehistory.org/stories/magazine/james-joule-and-the-mechanical-equivalent-of-heat/"
  },
  {
    "id": "inertia-seatbelt",
    "bagian": "Hukum Newton",
    "tahun": "APLIKASI SEHARI-HARI",
    "judul": "Sabuk pengaman bekerja dengan prinsip inersia",
    "tokoh": "Aplikasi Hukum I Newton",
    "simbol": "Ⅰ",
    "fakta": "Ketika mobil berhenti mendadak, tubuh penumpang cenderung mempertahankan geraknya. Sabuk pengaman memberikan gaya yang membantu mengubah momentum tubuh secara lebih terkendali.",
    "konsep": "Inersia bukan gaya yang mendorong tubuh ke depan; inersia adalah kecenderungan mempertahankan keadaan gerak.",
    "refleksi": "Konsep dasar Newton menjadi dasar penting dalam desain keselamatan kendaraan.",
    "sumber": "https://www.nhtsa.gov/vehicle-safety/seat-belts"
  },
  {
    "id": "friction-walking",
    "bagian": "Gaya Gesek",
    "tahun": "DALAM KEHIDUPAN",
    "judul": "Tanpa gesekan, berjalan justru menjadi sulit",
    "tokoh": "Gaya gesek statis",
    "simbol": "μ",
    "fakta": "Saat berjalan tanpa tergelincir, kaki mendorong tanah ke belakang. Tanah memberikan gaya gesek statis ke depan pada kaki sehingga tubuh dapat bergerak maju.",
    "konsep": "Gaya gesek tidak selalu berlawanan dengan arah gerak benda; arahnya melawan kecenderungan gerak relatif pada bidang kontak.",
    "refleksi": "Arah gaya gesek harus dianalisis dari interaksi permukaan, bukan hanya dari arah kecepatan benda.",
    "sumber": "https://openstax.org/details/books/college-physics-2e"
  },
  {
    "id": "terminal-velocity",
    "bagian": "Hambatan Udara",
    "tahun": "FENOMENA ALAM",
    "judul": "Benda jatuh dapat mencapai kecepatan terminal",
    "tokoh": "Gaya berat dan hambatan fluida",
    "simbol": "vₜ",
    "fakta": "Ketika benda jatuh di udara, gaya hambat biasanya meningkat seiring kelajuan. Pada kondisi tertentu, gaya hambat dapat menyeimbangkan berat sehingga resultan gaya nol.",
    "konsep": "Pada kecepatan terminal, percepatan nol tetapi benda tetap bergerak dengan kelajuan konstan yang tidak nol.",
    "refleksi": "Resultan gaya nol tidak selalu berarti benda sedang diam.",
    "sumber": "https://openstax.org/details/books/college-physics-2e"
  },
  {
    "id": "centripetal-tension",
    "bagian": "Gerak Melingkar",
    "tahun": "KONSEP MEKANIKA",
    "judul": "Gaya sentripetal bukan jenis gaya baru",
    "tokoh": "Resultan gaya radial",
    "simbol": "↗",
    "fakta": "Istilah gaya sentripetal menyebut resultan gaya yang mengarah ke pusat lintasan melingkar. Gaya itu dapat berasal dari tegangan tali, gesekan, gravitasi, atau gabungan beberapa gaya.",
    "konsep": "Diagram benda bebas tetap menggambarkan gaya fisik yang bekerja; komponen radial resultannya menyediakan percepatan sentripetal.",
    "refleksi": "Nama suatu peran dalam persamaan tidak selalu berarti ada jenis gaya tambahan.",
    "sumber": "https://openstax.org/details/books/university-physics-volume-1"
  },
  {
    "id": "torque-door",
    "bagian": "Kesetimbangan",
    "tahun": "APLIKASI SEHARI-HARI",
    "judul": "Gagang pintu ditempatkan jauh dari engsel",
    "tokoh": "Momen gaya",
    "simbol": "τ",
    "fakta": "Mendorong pintu di dekat gagang biasanya lebih mudah daripada mendorongnya dekat engsel. Gagang memperbesar lengan momen gaya terhadap poros engsel.",
    "konsep": "Torsi dipengaruhi besar gaya, jarak tegak lurus garis kerja gaya terhadap poros, dan arah gaya.",
    "refleksi": "Desain alat sehari-hari sering memanfaatkan prinsip lengan momen.",
    "sumber": "https://openstax.org/details/books/college-physics-2e"
  },
  {
    "id": "angular-inertia",
    "bagian": "Dinamika Rotasi",
    "tahun": "KONSEP MEKANIKA",
    "judul": "Pemain seluncur berputar lebih cepat saat merapatkan tangan",
    "tokoh": "Kekekalan momentum sudut",
    "simbol": "L",
    "fakta": "Pemain seluncur yang merapatkan lengan mengurangi momen inersia tubuhnya. Jika torsi eksternal kecil, momentum sudut dipertahankan sehingga laju putarnya meningkat.",
    "konsep": "Distribusi massa terhadap sumbu rotasi memengaruhi momen inersia dan kecepatan sudut.",
    "refleksi": "Mengubah bentuk tubuh dapat mengubah gerak rotasi tanpa harus menambah gaya putar dari luar.",
    "sumber": "https://openstax.org/details/books/university-physics-volume-1"
  }
];
```


## `src/features/trivia-kuis/FunFactMekanika.css`

```css
/* FUN FACT MEKANIKA — buku digital dua halaman */
.funfact-book-section { display: grid; gap: 19px; animation: trivia-enter .3s ease both; }
.funfact-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; }
.funfact-heading h2 { margin: 0; color: #eef4ff; font: 600 clamp(1.4rem, 3vw, 2rem)/1.12 'Space Grotesk', sans-serif; letter-spacing: -.04em; }
.funfact-heading > div > p:last-child { max-width: 670px; margin: 8px 0 0; color: var(--muted); font-size: .75rem; line-height: 1.65; }
.funfact-book-count { flex: 0 0 auto; color: var(--faint); font: .62rem 'DM Mono', monospace; letter-spacing: .1em; }
.funfact-book-count strong { color: #ffd092; font: 600 2rem 'Space Grotesk', sans-serif; }
.funfact-book-scene { position: relative; padding: 17px 18px 20px; perspective: 1800px; border: 1px solid rgba(145,167,211,.17); border-radius: 17px; background: radial-gradient(ellipse at 50% 0%, rgba(128,154,218,.12), transparent 54%), linear-gradient(145deg, rgba(15,29,51,.92), rgba(7,16,31,.96)); box-shadow: 0 20px 55px rgba(0,0,0,.22), inset 0 1px rgba(255,255,255,.04); }
.funfact-book-scene::before { position: absolute; inset: 0; content: ''; pointer-events: none; background-image: radial-gradient(rgba(255,255,255,.24) .6px, transparent .8px); background-size: 31px 31px; opacity: .12; }
.funfact-book-spine { position: absolute; z-index: 2; top: 19px; bottom: 22px; left: 50%; width: 13px; transform: translateX(-50%); background: linear-gradient(90deg, rgba(0,0,0,.24), rgba(255,255,255,.11), rgba(0,0,0,.22)); border-radius: 50%; pointer-events: none; }
.funfact-book-spread { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); min-height: 465px; border-radius: 9px; overflow: hidden; box-shadow: 0 18px 36px rgba(0,0,0,.28); animation: funfact-page-turn .48s cubic-bezier(.2,.72,.22,1) both; transform-origin: 50% 50%; }
.funfact-book-spread[data-turn="mundur"] { animation-name: funfact-page-back; }
@keyframes funfact-page-turn { from { opacity: .55; transform: rotateY(-5deg) translateX(12px); } to { opacity: 1; transform: rotateY(0) translateX(0); } }
@keyframes funfact-page-back { from { opacity: .55; transform: rotateY(5deg) translateX(-12px); } to { opacity: 1; transform: rotateY(0) translateX(0); } }
.funfact-left-page, .funfact-right-page { position: relative; display: flex; flex-direction: column; min-width: 0; padding: 23px clamp(17px,3vw,34px) 16px; color: #27344a; background: linear-gradient(135deg, #f0e6d3, #e8dfd0 48%, #ded4c3); }
.funfact-left-page { border-right: 1px solid rgba(80,67,50,.2); background: radial-gradient(circle at 8% 8%, rgba(255,255,255,.62), transparent 38%), linear-gradient(120deg,#e8dfd0,#f4ecdc); }
.funfact-right-page { background: radial-gradient(circle at 94% 7%, rgba(255,255,255,.5), transparent 34%), linear-gradient(120deg,#f0e7d7,#e9dfce); }
.funfact-page-topline { display: flex; justify-content: space-between; gap: 9px; padding-bottom: 11px; border-bottom: 1px solid rgba(62,76,92,.2); color: #778092; font: 500 .49rem 'DM Mono', monospace; letter-spacing: .1em; }
.funfact-chapter-mark { position: relative; display: grid; place-items: center; width: 128px; height: 128px; margin: 37px auto 28px; border: 1px solid rgba(75,113,141,.28); border-radius: 50%; color: #436b80; }
.funfact-chapter-mark::before, .funfact-chapter-mark::after { position: absolute; inset: 10px; border: 1px solid rgba(75,113,141,.2); border-radius: 50%; content: ''; }
.funfact-chapter-mark::after { inset: 23px; border-style: dashed; }
.funfact-chapter-mark span { z-index: 1; font: 500 2.3rem 'Space Grotesk', sans-serif; }
.funfact-chapter-mark i { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: #d58f55; box-shadow: 0 0 9px rgba(213,143,85,.6); }
.funfact-chapter-mark i:first-of-type { top: 13px; right: 31px; }.funfact-chapter-mark i:last-of-type { bottom: 19px; left: 26px; }
.funfact-kicker { margin: 0; color: #bb8559; font: 600 .53rem 'DM Mono', monospace; letter-spacing: .16em; text-align: center; }
.funfact-left-page h3 { max-width: 440px; margin: 9px auto 5px; color: #2f4055; font: 600 clamp(1.1rem,2vw,1.65rem)/1.2 'Space Grotesk', sans-serif; letter-spacing: -.035em; text-align: center; }
.funfact-person { margin: 0; color: #758091; font: italic .75rem Georgia,serif; text-align: center; }
.funfact-left-quote { position: relative; max-width: 330px; margin: auto auto 18px; padding: 13px 17px 12px; border-top: 1px solid rgba(65,87,105,.2); border-bottom: 1px solid rgba(65,87,105,.2); text-align: center; }
.funfact-left-quote > span { display: block; height: 18px; color: #c88d5a; font: 2.2rem Georgia,serif; line-height: 1; }
.funfact-left-quote p { margin: 0; color: #667386; font: italic .77rem/1.5 Georgia,serif; }
.funfact-page-footer { display: flex; justify-content: space-between; gap: 8px; padding-top: 10px; border-top: 1px solid rgba(62,76,92,.18); color: #89909a; font: .46rem 'DM Mono',monospace; letter-spacing: .1em; }
.funfact-right-content { display: flex; flex: 1; flex-direction: column; padding: 20px 0 12px; }
.funfact-stamp { align-self: flex-start; padding: 5px 8px; border: 1px solid rgba(202,137,83,.42); border-radius: 2px; color: #bb8150; font: 600 .5rem 'DM Mono',monospace; letter-spacing: .14em; transform: rotate(-2deg); }
.funfact-right-content h3 { margin: 15px 0 11px; color: #334257; font: 600 clamp(1.05rem,2vw,1.4rem)/1.2 'Space Grotesk',sans-serif; letter-spacing: -.03em; }
.funfact-story { margin: 0; color: #566579; font: .78rem/1.75 Georgia,serif; }
.funfact-concept-box { margin-top: 17px; padding: 12px 13px; border-left: 3px solid #79a8a7; background: rgba(106,158,160,.1); }
.funfact-concept-box > span, .funfact-reflection > span { color: #4f8587; font: 600 .49rem 'DM Mono',monospace; letter-spacing: .13em; }
.funfact-concept-box p, .funfact-reflection p { margin: 6px 0 0; color: #586777; font-size: .69rem; line-height: 1.6; }
.funfact-reflection { margin-top: 14px; padding-left: 2px; }
.funfact-reflection > span { color: #b17d50; }
.funfact-source-toggle { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; padding: 10px 0 0; border: 0; border-top: 1px solid rgba(62,76,92,.18); background: transparent; color: #58778a; font: 600 .62rem 'DM Sans',sans-serif; text-align: left; cursor: pointer; }
.funfact-source-link { margin-top: 8px; color: #a46c42; font-size: .61rem; text-decoration: none; }
.funfact-source-link:hover { text-decoration: underline; }
.funfact-book-controls { display: grid; grid-template-columns: 1fr minmax(120px,200px) 1fr; align-items: center; gap: 15px; }
.funfact-book-controls > button { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 40px; padding: 9px 13px; border: 1px solid rgba(145,167,211,.23); border-radius: 8px; background: rgba(17,34,58,.7); color: #d8e5f8; font-size: .68rem; cursor: pointer; transition: transform .18s,border-color .18s,opacity .18s; }
.funfact-book-controls > button:not(:disabled):hover { transform: translateY(-2px); border-color: rgba(255,196,119,.55); }
.funfact-book-controls > button:disabled { opacity: .35; cursor: not-allowed; }
.funfact-progress { display: grid; gap: 6px; }
.funfact-progress > div { height: 4px; overflow: hidden; border-radius: 10px; background: rgba(145,167,211,.16); }
.funfact-progress > div > span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg,#61e4cb,#ffc477); transition: width .35s ease; }
.funfact-progress small { color: #8195b2; font: .49rem 'DM Mono',monospace; text-align: center; }
@media (max-width:760px) { .funfact-book-spread { grid-template-columns:1fr; }.funfact-book-spine { display:none; }.funfact-left-page { min-height:340px; }.funfact-right-page { min-height:410px; }.funfact-chapter-mark { margin:23px auto 18px; }.funfact-book-controls { grid-template-columns:1fr 1fr; }.funfact-progress { grid-column:1/-1; grid-row:1; }.funfact-book-controls > button { grid-row:2; } }
@media (max-width:480px) { .funfact-heading { align-items:flex-start; flex-direction:column; }.funfact-book-scene { padding:8px; }.funfact-left-page,.funfact-right-page { padding-inline:17px; }.funfact-book-controls { gap:7px; }.funfact-book-controls > button { padding-inline:7px; font-size:.58rem; } }
@media (prefers-reduced-motion:reduce) { .funfact-book-spread,.funfact-progress > div > span,.funfact-book-controls > button { animation:none!important; transition:none!important; } }
```


## `src/features/trivia-kuis/PetaSejarahFisika.tsx`

```tsx
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
```


## `src/features/trivia-kuis/dataKuis.ts`

```typescript
export type TopikKuis =
  | "Kinematika"
  | "Gerak Parabola"
  | "Gerak Melingkar"
  | "Dinamika Newton"
  | "Momentum & Impuls"
  | "Katrol Atwood"
  | "Lift"
  | "Katrol & Lift"
  | "Kesetimbangan Benda Tegar"
  | "Trivia Mekanika";

export type SoalFisika = {
  id: string;
  topik: TopikKuis;
  pertanyaan: string;
  pilihan: string[];
  jawabanBenar: number;
  pembahasan: string;
  jenis: "konsep" | "trivia";
};

/**
 * Bank berisi tepat 50 soal konsep dan trivia mekanika.
 * Tidak ada soal hitungan numerik; setiap soal memiliki satu jawaban terbaik.
 */
export const BANK_SOAL_FISIKA: SoalFisika[] = [
  {
    id: "mek-01",
    topik: "Kinematika",
    pertanyaan: "Apa yang menjadi fokus utama kajian kinematika?",
    pilihan: [
      "Penyebab benda bergerak",
      "Deskripsi gerak tanpa membahas penyebabnya",
      "Komposisi kimia benda",
      "Perubahan suhu benda",
    ],
    jawabanBenar: 1,
    pembahasan: "Kinematika mendeskripsikan gerak melalui posisi, perpindahan, kecepatan, dan percepatan tanpa terlebih dahulu membahas gaya penyebab gerak.",
    jenis: "konsep",
  },
  {
    id: "mek-02",
    topik: "Kinematika",
    pertanyaan: "Mengapa kerangka acuan diperlukan ketika menyatakan sebuah benda bergerak?",
    pilihan: [
      "Gerak selalu bersifat mutlak",
      "Posisi dan gerak dinilai relatif terhadap acuan",
      "Massa benda berubah terhadap pengamat",
      "Waktu hanya ada saat benda bergerak",
    ],
    jawabanBenar: 1,
    pembahasan: "Gerak ditentukan dari perubahan posisi terhadap suatu kerangka acuan. Benda dapat diam terhadap satu acuan tetapi bergerak terhadap acuan lain.",
    jenis: "konsep",
  },
  {
    id: "mek-03",
    topik: "Kinematika",
    pertanyaan: "Manakah pernyataan yang paling tepat membedakan jarak dan perpindahan?",
    pilihan: [
      "Jarak adalah vektor, perpindahan skalar",
      "Jarak selalu sama dengan perpindahan",
      "Jarak adalah panjang lintasan, perpindahan perubahan posisi berarah",
      "Perpindahan selalu lebih besar daripada jarak",
    ],
    jawabanBenar: 2,
    pembahasan: "Jarak merupakan besaran skalar yang menyatakan panjang lintasan. Perpindahan merupakan vektor dari posisi awal ke posisi akhir.",
    jenis: "konsep",
  },
  {
    id: "mek-04",
    topik: "Kinematika",
    pertanyaan: "Apa perbedaan kelajuan dan kecepatan?",
    pilihan: [
      "Keduanya selalu memiliki arah",
      "Kelajuan skalar, kecepatan memiliki arah",
      "Kelajuan hanya untuk gerak melingkar",
      "Kecepatan tidak berkaitan dengan perpindahan",
    ],
    jawabanBenar: 1,
    pembahasan: "Kelajuan menyatakan laju perubahan jarak dan tidak memiliki arah. Kecepatan berkaitan dengan perpindahan sehingga memiliki arah.",
    jenis: "konsep",
  },
  {
    id: "mek-05",
    topik: "Kinematika",
    pertanyaan: "Pada grafik posisi terhadap waktu, apa makna gradien grafik?",
    pilihan: [
      "Percepatan",
      "Gaya",
      "Kecepatan",
      "Momentum",
    ],
    jawabanBenar: 2,
    pembahasan: "Gradien grafik posisi-waktu menyatakan perubahan posisi per perubahan waktu, yaitu kecepatan.",
    jenis: "konsep",
  },
  {
    id: "mek-06",
    topik: "Kinematika",
    pertanyaan: "Pada grafik kecepatan terhadap waktu, apa makna gradien grafik?",
    pilihan: [
      "Percepatan",
      "Perpindahan",
      "Massa",
      "Energi potensial",
    ],
    jawabanBenar: 0,
    pembahasan: "Gradien grafik kecepatan-waktu menyatakan perubahan kecepatan terhadap waktu, yaitu percepatan.",
    jenis: "konsep",
  },
  {
    id: "mek-07",
    topik: "Kinematika",
    pertanyaan: "Sebuah benda memiliki kecepatan sesaat nol. Kesimpulan apa yang paling tepat?",
    pilihan: [
      "Benda pasti tidak pernah bergerak",
      "Benda pasti mengalami percepatan nol",
      "Benda dapat sedang berbalik arah",
      "Benda pasti berada di titik asal",
    ],
    jawabanBenar: 2,
    pembahasan: "Pada titik balik gerak, kecepatan sesaat dapat nol sementara percepatannya tidak nol. Kecepatan sesaat nol tidak membuktikan benda selalu diam.",
    jenis: "konsep",
  },
  {
    id: "mek-08",
    topik: "Kinematika",
    pertanyaan: "Ciri utama gerak lurus beraturan (GLB) adalah ...",
    pilihan: [
      "Percepatan tetap dan tidak nol",
      "Kecepatan konstan pada lintasan lurus",
      "Kelajuan selalu bertambah",
      "Arah gerak selalu melingkar",
    ],
    jawabanBenar: 1,
    pembahasan: "Dalam GLB, benda bergerak pada lintasan lurus dengan kecepatan tetap, sehingga percepatannya nol.",
    jenis: "konsep",
  },
  {
    id: "mek-09",
    topik: "Kinematika",
    pertanyaan: "Apa ciri ideal gerak lurus berubah beraturan (GLBB)?",
    pilihan: [
      "Percepatan konstan",
      "Kecepatan selalu konstan",
      "Gaya selalu nol",
      "Lintasan harus melingkar",
    ],
    jawabanBenar: 0,
    pembahasan: "GLBB merupakan gerak lurus dengan percepatan konstan. Kecepatan berubah secara teratur terhadap waktu.",
    jenis: "konsep",
  },
  {
    id: "mek-10",
    topik: "Kinematika",
    pertanyaan: "Apakah percepatan negatif selalu berarti benda sedang melambat?",
    pilihan: [
      "Ya, selalu",
      "Tidak; artinya arah percepatan menuju sumbu negatif",
      "Ya, jika benda bergerak ke kanan",
      "Tidak; percepatan negatif berarti benda diam",
    ],
    jawabanBenar: 1,
    pembahasan: "Tanda percepatan menyatakan arah relatif terhadap sumbu yang dipilih. Benda yang bergerak ke arah negatif dapat bertambah cepat ketika percepatannya juga negatif.",
    jenis: "konsep",
  },
  {
    id: "mek-11",
    topik: "Kinematika",
    pertanyaan: "Dalam model jatuh bebas ideal, mengapa benda dengan massa berbeda memiliki percepatan jatuh yang sama?",
    pilihan: [
      "Karena semua benda memiliki massa sama",
      "Karena gravitasi tidak bekerja pada benda ringan",
      "Karena percepatan gravitasi tidak bergantung pada massa benda",
      "Karena benda berat selalu ditahan udara",
    ],
    jawabanBenar: 2,
    pembahasan: "Jika hambatan udara diabaikan, semua benda di lokasi yang sama mengalami percepatan gravitasi yang sama, terlepas dari massanya.",
    jenis: "konsep",
  },
  {
    id: "mek-12",
    topik: "Kinematika",
    pertanyaan: "Dalam gerak parabola ideal tanpa hambatan udara, komponen kecepatan manakah yang tetap?",
    pilihan: [
      "Komponen horizontal",
      "Komponen vertikal",
      "Besar kecepatan total",
      "Semua komponen kecepatan",
    ],
    jawabanBenar: 0,
    pembahasan: "Tidak ada percepatan horizontal pada model ideal, sehingga komponen kecepatan horizontal tetap. Komponen vertikal berubah akibat gravitasi.",
    jenis: "konsep",
  },
  {
    id: "mek-13",
    topik: "Gerak Parabola",
    pertanyaan: "Mengapa lintasan proyektil ideal berbentuk parabola?",
    pilihan: [
      "Kecepatannya selalu nol di puncak",
      "Gerak horizontal beraturan berpadu dengan gerak vertikal dipercepat",
      "Gravitasi bekerja mendatar",
      "Benda mengikuti kelengkungan Bumi secara langsung",
    ],
    jawabanBenar: 1,
    pembahasan: "Lintasan parabola terbentuk dari superposisi gerak horizontal berkecepatan konstan dan gerak vertikal dengan percepatan gravitasi.",
    jenis: "konsep",
  },
  {
    id: "mek-14",
    topik: "Gerak Parabola",
    pertanyaan: "Di titik tertinggi lintasan proyektil, apa yang terjadi pada komponen kecepatan vertikal?",
    pilihan: [
      "Maksimum ke atas",
      "Nol sesaat",
      "Sama dengan komponen horizontal",
      "Selalu bernilai gravitasi",
    ],
    jawabanBenar: 1,
    pembahasan: "Di puncak lintasan, komponen kecepatan vertikal sesaat nol. Namun percepatan gravitasi tetap mengarah ke bawah.",
    jenis: "konsep",
  },
  {
    id: "mek-15",
    topik: "Gerak Parabola",
    pertanyaan: "Pada titik tertinggi gerak parabola ideal, bagaimana arah percepatan benda?",
    pilihan: [
      "Ke atas",
      "Horizontal",
      "Tetap vertikal ke bawah",
      "Nol",
    ],
    jawabanBenar: 2,
    pembahasan: "Percepatan benda tetap disebabkan gravitasi dan arahnya ke bawah sepanjang lintasan, termasuk di titik tertinggi.",
    jenis: "konsep",
  },
  {
    id: "mek-16",
    topik: "Gerak Parabola",
    pertanyaan: "Untuk proyektil yang kembali ke ketinggian awal tanpa hambatan udara, apa hubungan waktu naik dan waktu turun?",
    pilihan: [
      "Waktu naik lebih lama",
      "Waktu turun lebih lama",
      "Keduanya sama",
      "Tidak dapat dibandingkan",
    ],
    jawabanBenar: 2,
    pembahasan: "Dengan percepatan gravitasi konstan dan ketinggian awal-akhir sama, gerak vertikal simetris sehingga waktu naik sama dengan waktu turun.",
    jenis: "konsep",
  },
  {
    id: "mek-17",
    topik: "Gerak Parabola",
    pertanyaan: "Untuk kelajuan awal tetap dan ketinggian awal sama dengan akhir, sudut peluncuran yang memberikan jangkauan maksimum pada model ideal adalah ...",
    pilihan: [
      "15°",
      "30°",
      "45°",
      "80°",
    ],
    jawabanBenar: 2,
    pembahasan: "Pada kondisi ideal dengan titik luncur dan titik jatuh setinggi, jangkauan maksimum terjadi pada sudut 45° terhadap horizontal.",
    jenis: "konsep",
  },
  {
    id: "mek-18",
    topik: "Gerak Melingkar",
    pertanyaan: "Dalam gerak melingkar beraturan, besaran apa yang tetap?",
    pilihan: [
      "Vektor kecepatan",
      "Kelajuan",
      "Arah percepatan",
      "Vektor posisi",
    ],
    jawabanBenar: 1,
    pembahasan: "Kelajuan tetap, tetapi arah kecepatan berubah terus karena arah garis singgung lintasan berubah.",
    jenis: "konsep",
  },
  {
    id: "mek-19",
    topik: "Gerak Melingkar",
    pertanyaan: "Ke mana arah percepatan sentripetal pada gerak melingkar?",
    pilihan: [
      "Menjauhi pusat lingkaran",
      "Menuju pusat lingkaran",
      "Selalu searah kecepatan",
      "Selalu vertikal ke bawah",
    ],
    jawabanBenar: 1,
    pembahasan: "Percepatan sentripetal selalu mengarah ke pusat lintasan dan bertugas mengubah arah vektor kecepatan.",
    jenis: "konsep",
  },
  {
    id: "mek-20",
    topik: "Gerak Melingkar",
    pertanyaan: "Apa makna gaya sentripetal?",
    pilihan: [
      "Gaya baru yang selalu ditambahkan pada diagram gaya",
      "Resultan gaya radial yang menjaga lintasan melingkar",
      "Gaya yang selalu berasal dari gravitasi",
      "Gaya yang arahnya menyinggung lintasan",
    ],
    jawabanBenar: 1,
    pembahasan: "Gaya sentripetal bukan jenis gaya tersendiri. Istilah ini menyebut resultan komponen gaya yang mengarah ke pusat lintasan.",
    jenis: "konsep",
  },
  {
    id: "mek-21",
    topik: "Gerak Melingkar",
    pertanyaan: "Arah kecepatan linear sesaat pada benda yang bergerak melingkar adalah ...",
    pilihan: [
      "Menuju pusat",
      "Menjauhi pusat",
      "Menyinggung lintasan",
      "Sejajar sumbu rotasi",
    ],
    jawabanBenar: 2,
    pembahasan: "Kecepatan linear sesaat selalu menyinggung lintasan lingkaran, sedangkan percepatan sentripetal mengarah ke pusat.",
    jenis: "konsep",
  },
  {
    id: "mek-22",
    topik: "Dinamika Newton",
    pertanyaan: "Apa makna kelembaman (inersia) suatu benda?",
    pilihan: [
      "Kecenderungan mempertahankan keadaan geraknya",
      "Kemampuan menghasilkan energi",
      "Kecenderungan selalu bergerak makin cepat",
      "Gaya yang menarik benda ke Bumi",
    ],
    jawabanBenar: 0,
    pembahasan: "Inersia adalah kecenderungan benda mempertahankan keadaan diam atau gerak lurus berkecepatan tetap. Massa menjadi ukuran kelembaman.",
    jenis: "konsep",
  },
  {
    id: "mek-23",
    topik: "Dinamika Newton",
    pertanyaan: "Hukum I Newton berlaku pada kerangka acuan ...",
    pilihan: [
      "Semua kerangka yang dipercepat",
      "Kerangka inersial",
      "Hanya kerangka yang berputar",
      "Hanya kerangka yang diam terhadap Bumi",
    ],
    jawabanBenar: 1,
    pembahasan: "Hukum I Newton mendefinisikan dan berlaku pada kerangka inersial, yaitu kerangka yang tidak mengalami percepatan translasi atau rotasi terhadap kerangka inersial lain.",
    jenis: "konsep",
  },
  {
    id: "mek-24",
    topik: "Dinamika Newton",
    pertanyaan: "Menurut Hukum II Newton, arah percepatan benda searah dengan ...",
    pilihan: [
      "Kecepatan awal selalu",
      "Resultan gaya",
      "Gaya normal selalu",
      "Gaya gesek selalu",
    ],
    jawabanBenar: 1,
    pembahasan: "Percepatan ditentukan oleh resultan gaya. Untuk massa konstan, arah percepatan searah dengan resultan gaya.",
    jenis: "konsep",
  },
  {
    id: "mek-25",
    topik: "Dinamika Newton",
    pertanyaan: "Mengapa gaya aksi dan reaksi tidak saling meniadakan pada satu diagram benda bebas?",
    pilihan: [
      "Besarnya tidak sama",
      "Keduanya bekerja pada benda yang berbeda",
      "Keduanya memiliki arah sama",
      "Salah satunya selalu gaya semu",
    ],
    jawabanBenar: 1,
    pembahasan: "Pasangan aksi-reaksi bekerja pada dua benda berbeda. Diagram benda bebas untuk satu benda hanya memuat gaya yang bekerja pada benda itu.",
    jenis: "konsep",
  },
  {
    id: "mek-26",
    topik: "Dinamika Newton",
    pertanyaan: "Apa arah gaya normal pada benda yang bersentuhan dengan permukaan?",
    pilihan: [
      "Selalu vertikal ke atas",
      "Sejajar permukaan",
      "Tegak lurus permukaan kontak",
      "Selalu menuju pusat Bumi",
    ],
    jawabanBenar: 2,
    pembahasan: "Gaya normal merupakan gaya kontak yang arahnya tegak lurus bidang sentuh. Arah vertikal hanya berlaku untuk permukaan horizontal.",
    jenis: "konsep",
  },
  {
    id: "mek-27",
    topik: "Dinamika Newton",
    pertanyaan: "Bagaimana arah gaya gesek kinetik pada dua permukaan yang saling bergeser?",
    pilihan: [
      "Searah gerak relatif",
      "Melawan gerak relatif pada bidang kontak",
      "Selalu menuju pusat lingkaran",
      "Selalu vertikal ke atas",
    ],
    jawabanBenar: 1,
    pembahasan: "Gaya gesek kinetik bekerja sejajar bidang kontak dan melawan gerak relatif permukaan yang bergeser.",
    jenis: "konsep",
  },
  {
    id: "mek-28",
    topik: "Dinamika Newton",
    pertanyaan: "Apa karakteristik gaya gesek statis?",
    pilihan: [
      "Selalu bernilai maksimum",
      "Menyesuaikan kebutuhan hingga nilai maksimum",
      "Selalu berlawanan dengan kecepatan benda",
      "Hanya muncul ketika benda sudah bergeser",
    ],
    jawabanBenar: 1,
    pembahasan: "Gaya gesek statis menyesuaikan besar gaya tangensial yang dibutuhkan untuk mencegah slip, hingga mencapai nilai maksimumnya.",
    jenis: "konsep",
  },
  {
    id: "mek-29",
    topik: "Dinamika Newton",
    pertanyaan: "Manakah pernyataan yang benar mengenai massa dan berat?",
    pilihan: [
      "Massa adalah gaya gravitasi",
      "Berat merupakan gaya gravitasi yang bekerja pada benda",
      "Massa selalu berubah ketika lokasi berubah",
      "Berat tidak memiliki arah",
    ],
    jawabanBenar: 1,
    pembahasan: "Massa adalah ukuran kelembaman, sedangkan berat adalah gaya gravitasi pada benda dan arahnya menuju pusat Bumi pada kondisi dekat permukaan.",
    jenis: "konsep",
  },
  {
    id: "mek-30",
    topik: "Dinamika Newton",
    pertanyaan: "Jika resultan gaya pada benda sama dengan nol, pernyataan yang tepat adalah ...",
    pilihan: [
      "Benda harus diam",
      "Benda harus bergerak melingkar",
      "Benda diam atau bergerak lurus dengan kecepatan konstan",
      "Benda pasti kehilangan momentum",
    ],
    jawabanBenar: 2,
    pembahasan: "Resultan gaya nol berarti percepatan nol. Benda mempertahankan keadaan diam atau kecepatan vektor konstan.",
    jenis: "konsep",
  },
  {
    id: "mek-31",
    topik: "Momentum & Impuls",
    pertanyaan: "Momentum linear merupakan besaran ...",
    pilihan: [
      "Skalar yang hanya bergantung pada massa",
      "Vektor yang searah dengan kecepatan",
      "Vektor yang selalu menuju pusat Bumi",
      "Skalar yang sama dengan energi kinetik",
    ],
    jawabanBenar: 1,
    pembahasan: "Momentum adalah hasil kali massa dan vektor kecepatan. Untuk massa positif, arah momentum sama dengan arah kecepatan.",
    jenis: "konsep",
  },
  {
    id: "mek-32",
    topik: "Momentum & Impuls",
    pertanyaan: "Apa hubungan impuls dengan momentum?",
    pilihan: [
      "Impuls sama dengan perubahan momentum",
      "Impuls sama dengan massa benda",
      "Impuls selalu sama dengan energi kinetik",
      "Impuls tidak bergantung pada gaya",
    ],
    jawabanBenar: 0,
    pembahasan: "Impuls merupakan perubahan momentum akibat gaya yang bekerja selama selang waktu tertentu.",
    jenis: "konsep",
  },
  {
    id: "mek-33",
    topik: "Momentum & Impuls",
    pertanyaan: "Kapan momentum total suatu sistem dapat dianggap kekal?",
    pilihan: [
      "Ketika gaya internal tidak ada",
      "Ketika resultan impuls gaya eksternal dapat diabaikan",
      "Ketika setiap benda diam",
      "Hanya ketika energi kinetik nol",
    ],
    jawabanBenar: 1,
    pembahasan: "Momentum total sistem kekal jika resultan gaya eksternal nol atau impuls eksternalnya dapat diabaikan selama interval yang ditinjau.",
    jenis: "konsep",
  },
  {
    id: "mek-34",
    topik: "Momentum & Impuls",
    pertanyaan: "Apa ciri tumbukan lenting sempurna?",
    pilihan: [
      "Momentum total dan energi kinetik total kekal",
      "Energi kinetik selalu berubah menjadi panas seluruhnya",
      "Semua benda harus menempel",
      "Momentum total tidak kekal",
    ],
    jawabanBenar: 0,
    pembahasan: "Dalam tumbukan lenting sempurna, momentum total dan energi kinetik total sistem kekal.",
    jenis: "konsep",
  },
  {
    id: "mek-35",
    topik: "Momentum & Impuls",
    pertanyaan: "Apa yang terjadi pada dua benda dalam tumbukan tidak lenting sama sekali?",
    pilihan: [
      "Keduanya selalu memantul dengan kelajuan sama",
      "Keduanya bergerak bersama setelah tumbukan",
      "Energi kinetik total tetap kekal",
      "Momentum total hilang",
    ],
    jawabanBenar: 1,
    pembahasan: "Dalam tumbukan tidak lenting sama sekali, kedua benda menyatu atau bergerak bersama setelah tumbukan. Momentum tetap kekal untuk sistem terisolasi, tetapi energi kinetik tidak.",
    jenis: "konsep",
  },
  {
    id: "mek-36",
    topik: "Katrol Atwood",
    pertanyaan: "Pada mesin Atwood ideal dengan dua massa berbeda, massa yang lebih besar cenderung ...",
    pilihan: [
      "Bergerak naik",
      "Bergerak turun",
      "Tetap diam tanpa syarat",
      "Bergerak mendatar",
    ],
    jawabanBenar: 1,
    pembahasan: "Jika tali dan katrol ideal serta hambatan diabaikan, sisi dengan massa lebih besar bergerak turun dan sisi lainnya naik.",
    jenis: "konsep",
  },
  {
    id: "mek-37",
    topik: "Katrol Atwood",
    pertanyaan: "Pada tali ideal yang massanya diabaikan dan tetap tegang, bagaimana tegangan di sepanjang tali?",
    pilihan: [
      "Berbeda pada setiap titik",
      "Sama besar di sepanjang tali",
      "Selalu nol",
      "Selalu sama dengan berat kedua massa dijumlahkan",
    ],
    jawabanBenar: 1,
    pembahasan: "Pada model tali ideal tanpa massa dan katrol ideal, tegangan sama di sepanjang segmen tali yang sama.",
    jenis: "konsep",
  },
  {
    id: "mek-38",
    topik: "Lift",
    pertanyaan: "Apa yang dibaca timbangan ketika seseorang berdiri di dalam lift?",
    pilihan: [
      "Massa gravitasi",
      "Gaya normal dari timbangan",
      "Gaya gravitasi Bumi secara langsung",
      "Momentum orang tersebut",
    ],
    jawabanBenar: 1,
    pembahasan: "Timbangan mengukur gaya normal yang diberikan permukaannya pada orang, yang sering disebut berat semu.",
    jenis: "konsep",
  },
  {
    id: "mek-39",
    topik: "Lift",
    pertanyaan: "Ketika lift mengalami percepatan ke atas, bagaimana berat semu orang dibandingkan berat sebenarnya?",
    pilihan: [
      "Lebih besar",
      "Lebih kecil",
      "Selalu nol",
      "Tidak terpengaruh percepatan",
    ],
    jawabanBenar: 0,
    pembahasan: "Percepatan lift ke atas memerlukan gaya normal lebih besar daripada berat untuk menghasilkan resultan gaya ke atas.",
    jenis: "konsep",
  },
  {
    id: "mek-40",
    topik: "Lift",
    pertanyaan: "Ketika lift mengalami percepatan ke bawah dengan besar lebih kecil dari gravitasi, bagaimana berat semu orang?",
    pilihan: [
      "Lebih besar daripada berat sebenarnya",
      "Lebih kecil daripada berat sebenarnya",
      "Selalu sama dengan nol",
      "Tidak dapat didefinisikan",
    ],
    jawabanBenar: 1,
    pembahasan: "Saat lift dipercepat ke bawah, gaya normal berkurang. Selama percepatan ke bawah lebih kecil dari g, orang tetap menekan timbangan tetapi bacaannya lebih kecil.",
    jenis: "konsep",
  },
  {
    id: "mek-41",
    topik: "Kesetimbangan Benda Tegar",
    pertanyaan: "Apa syarat kesetimbangan translasi benda?",
    pilihan: [
      "Resultan gaya nol",
      "Resultan torsi maksimum",
      "Kecepatan sudut harus berubah",
      "Energi kinetik harus maksimum",
    ],
    jawabanBenar: 0,
    pembahasan: "Kesetimbangan translasi terjadi ketika resultan gaya eksternal pada benda sama dengan nol.",
    jenis: "konsep",
  },
  {
    id: "mek-42",
    topik: "Kesetimbangan Benda Tegar",
    pertanyaan: "Apa syarat kesetimbangan rotasi benda tegar?",
    pilihan: [
      "Resultan gaya harus searah jarum jam",
      "Resultan torsi terhadap titik acuan nol",
      "Semua gaya harus sama besar",
      "Pusat massa harus berada di luar benda",
    ],
    jawabanBenar: 1,
    pembahasan: "Kesetimbangan rotasi mensyaratkan resultan momen gaya atau torsi eksternal sama dengan nol terhadap titik acuan.",
    jenis: "konsep",
  },
  {
    id: "mek-43",
    topik: "Kesetimbangan Benda Tegar",
    pertanyaan: "Apa yang dimaksud lengan momen suatu gaya?",
    pilihan: [
      "Panjang seluruh batang",
      "Jarak tegak lurus dari poros ke garis kerja gaya",
      "Jarak dari poros ke pusat massa saja",
      "Jarak yang ditempuh ujung batang",
    ],
    jawabanBenar: 1,
    pembahasan: "Lengan momen adalah jarak tegak lurus dari poros ke garis kerja gaya. Besaran ini menentukan kemampuan gaya menghasilkan torsi.",
    jenis: "konsep",
  },
  {
    id: "mek-44",
    topik: "Kesetimbangan Benda Tegar",
    pertanyaan: "Bagaimana cara memperbesar torsi oleh gaya yang sama besar?",
    pilihan: [
      "Memperkecil lengan momen",
      "Menerapkan gaya lebih dekat ke poros",
      "Memperbesar lengan momen tegak lurus",
      "Membuat gaya sejajar lengan",
    ],
    jawabanBenar: 2,
    pembahasan: "Torsi bergantung pada gaya dan lengan momen tegak lurus. Memperbesar jarak tegak lurus garis kerja gaya dari poros memperbesar torsi.",
    jenis: "konsep",
  },
  {
    id: "mek-45",
    topik: "Kesetimbangan Benda Tegar",
    pertanyaan: "Mengapa gagang pintu biasanya dipasang jauh dari engsel?",
    pilihan: [
      "Agar massa pintu bertambah",
      "Agar lengan momen gaya tangan lebih besar",
      "Agar gaya normal pintu hilang",
      "Agar pintu tidak memiliki inersia",
    ],
    jawabanBenar: 1,
    pembahasan: "Jarak gagang yang lebih besar dari engsel memperbesar lengan momen, sehingga torsi yang sama dapat diperoleh dengan gaya tangan lebih kecil.",
    jenis: "konsep",
  },
  {
    id: "mek-46",
    topik: "Kesetimbangan Benda Tegar",
    pertanyaan: "Apa yang dimaksud pusat massa suatu sistem?",
    pilihan: [
      "Titik tempat seluruh massa benda harus terkumpul",
      "Titik yang gerak translasi sistem dapat dianalisis seolah massa total terpusat di sana",
      "Selalu titik geometris di tengah bentuk",
      "Titik dengan gaya gravitasi nol",
    ],
    jawabanBenar: 1,
    pembahasan: "Pusat massa adalah titik representatif untuk gerak translasi sistem. Letaknya bergantung pada distribusi massa dan tidak selalu berada di pusat geometris.",
    jenis: "konsep",
  },
  {
    id: "mek-47",
    topik: "Trivia Mekanika",
    pertanyaan: "Mengapa penumpang terdorong ke depan ketika kendaraan yang melaju direm mendadak?",
    pilihan: [
      "Karena tubuh mempertahankan gerak akibat inersia",
      "Karena gravitasi berubah arah",
      "Karena massa penumpang hilang",
      "Karena gaya gesek selalu mendorong ke depan",
    ],
    jawabanBenar: 0,
    pembahasan: "Tubuh penumpang cenderung mempertahankan kecepatan awalnya. Kendaraan melambat, sedangkan tubuh masih cenderung bergerak maju sampai ada gaya yang memperlambatnya.",
    jenis: "trivia",
  },
  {
    id: "mek-48",
    topik: "Trivia Mekanika",
    pertanyaan: "Mengapa pesepeda dapat menjaga keseimbangan lebih mudah ketika bergerak dibanding ketika diam?",
    pilihan: [
      "Karena gravitasi menghilang saat bergerak",
      "Karena kemudi dan gerak tubuh memungkinkan koreksi keseimbangan secara dinamis",
      "Karena roda tidak memiliki massa",
      "Karena gaya normal berubah menjadi nol",
    ],
    jawabanBenar: 1,
    pembahasan: "Saat bergerak, pesepeda dapat melakukan koreksi kemudi dan posisi tubuh untuk mengatur titik tumpu dan arah gerak. Penjelasan lengkap stabilitas sepeda juga melibatkan geometri dan dinamika, bukan satu efek tunggal.",
    jenis: "trivia",
  },
  {
    id: "mek-49",
    topik: "Trivia Mekanika",
    pertanyaan: "Mengapa pelari sering menekuk lutut saat mendarat setelah melompat?",
    pilihan: [
      "Untuk memperpendek waktu tumbukan",
      "Untuk memperpanjang waktu berhenti sehingga gaya rata-rata berkurang",
      "Agar momentum bertambah",
      "Agar gravitasi berkurang",
    ],
    jawabanBenar: 1,
    pembahasan: "Perubahan momentum yang sebanding dapat terjadi dalam waktu lebih lama. Memperpanjang waktu berhenti mengurangi gaya rata-rata selama pendaratan.",
    jenis: "trivia",
  },
  {
    id: "mek-50",
    topik: "Trivia Mekanika",
    pertanyaan: "Mengapa benda yang berputar semakin sulit dihentikan ketika massanya tersebar jauh dari poros?",
    pilihan: [
      "Karena momen inersianya lebih besar",
      "Karena beratnya menjadi nol",
      "Karena gaya sentripetal menghilang",
      "Karena pusat massanya selalu berpindah",
    ],
    jawabanBenar: 0,
    pembahasan: "Momen inersia meningkat ketika massa berada lebih jauh dari sumbu rotasi. Karena itu diperlukan torsi lebih besar untuk mengubah gerak rotasinya dengan cara yang sama.",
    jenis: "trivia",
  },
];

if (BANK_SOAL_FISIKA.length !== 50) {
  throw new Error("Bank soal PhysLAB harus berisi tepat 50 soal.");
}
```


## `src/features/trivia-kuis/KuisFisika.tsx`

```tsx
import { useEffect, useMemo, useState } from "react";
import { BANK_SOAL_FISIKA, type SoalFisika } from "./dataKuis";

const KUNCI_NILAI_TERBAIK = "physlab-kuis-mekanika-konsep-terbaik-v2";

function acakArray<T>(daftar: readonly T[]): T[] {
  const hasil = [...daftar];
  for (let indeks = hasil.length - 1; indeks > 0; indeks -= 1) {
    const acak = Math.floor(Math.random() * (indeks + 1));
    [hasil[indeks], hasil[acak]] = [hasil[acak], hasil[indeks]];
  }
  return hasil;
}

function bacaNilaiTerbaik(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const tersimpan = window.localStorage.getItem(KUNCI_NILAI_TERBAIK);
    if (tersimpan === null) return null;
    const nilai = Number(tersimpan);
    return Number.isFinite(nilai) && nilai >= 0 && nilai <= 50 ? nilai : null;
  } catch {
    return null;
  }
}

function hitungSkor(jawaban: Record<string, number>, urutan: SoalFisika[]): number {
  return urutan.reduce((total, soal) =>
    total + (jawaban[soal.id] === soal.jawabanBenar ? 1 : 0), 0);
}

/** Kuis konsep mekanika: 50 soal diacak, feedback instan, dan nilai terbaik lokal. */
export default function KuisFisika() {
  const [urutanSoal, setUrutanSoal] = useState<SoalFisika[]>(() => acakArray(BANK_SOAL_FISIKA));
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [jawaban, setJawaban] = useState<Record<string, number>>({});
  const [selesai, setSelesai] = useState(false);
  const [nilaiTerbaik, setNilaiTerbaik] = useState<number | null>(bacaNilaiTerbaik);

  const jumlahSoal = urutanSoal.length;
  const soal = urutanSoal[indeksSoal];
  const jawabanDipilih = soal ? jawaban[soal.id] ?? null : null;
  const skor = useMemo(() => hitungSkor(jawaban, urutanSoal), [jawaban, urutanSoal]);
  const jumlahTerjawab = Object.keys(jawaban).length;
  const progres = (jumlahTerjawab / jumlahSoal) * 100;
  const jawabanBenar = jawabanDipilih !== null && jawabanDipilih === soal?.jawabanBenar;

  useEffect(() => {
    if (nilaiTerbaik === null) return;
    try {
      window.localStorage.setItem(KUNCI_NILAI_TERBAIK, String(nilaiTerbaik));
    } catch {
      // Kuis tetap berjalan jika penyimpanan browser dinonaktifkan.
    }
  }, [nilaiTerbaik]);

  function pilihJawaban(indeks: number) {
    if (!soal || jawabanDipilih !== null) return;
    setJawaban((sebelumnya) => ({ ...sebelumnya, [soal.id]: indeks }));
  }

  function lanjutkan() {
    if (jawabanDipilih === null) return;
    if (indeksSoal === jumlahSoal - 1) {
      setNilaiTerbaik((sebelumnya) => sebelumnya === null ? skor : Math.max(sebelumnya, skor));
      setSelesai(true);
      return;
    }
    setIndeksSoal((sebelumnya) => sebelumnya + 1);
  }

  function ulangiKuis(acakUlang = true) {
    setUrutanSoal(acakUlang ? acakArray(BANK_SOAL_FISIKA) : [...BANK_SOAL_FISIKA]);
    setIndeksSoal(0);
    setJawaban({});
    setSelesai(false);
  }

  if (selesai) {
    const nilaiAkhir = Math.round((skor / jumlahSoal) * 100);
    const pesan = nilaiAkhir >= 85
      ? "Luar biasa! Pemahaman konsep mekanikamu sangat kuat."
      : nilaiAkhir >= 65
        ? "Bagus! Tinjau kembali penjelasan pada konsep yang masih tertukar."
        : "Terus berlatih. Gunakan pembahasan untuk membangun intuisi fisikamu.";

    return (
      <section className="quiz-shell quiz-summary quiz-konsep-summary" aria-live="polite">
        <div className="summary-orbit" aria-hidden="true"><span>φ</span></div>
        <p className="trivia-eyebrow">SESI 50 SOAL SELESAI</p>
        <h2>Jejak pemahaman mekanikamu</h2>
        <p className="trivia-muted">Semua soal konsep dan trivia mekanika telah kamu selesaikan.</p>
        <div className="summary-score-ring" aria-label={`Nilai ${nilaiAkhir} dari 100`}>
          <strong>{nilaiAkhir}</strong><span>/ 100</span>
        </div>
        <div className="summary-score-line"><span>Jawaban benar</span><strong>{skor} dari {jumlahSoal}</strong></div>
        <div className="summary-score-line"><span>Jawaban perlu ditinjau</span><strong>{jumlahSoal - skor}</strong></div>
        <div className="summary-score-line"><span>Nilai terbaik tersimpan</span><strong>{nilaiTerbaik ?? skor} dari 50</strong></div>
        <p className="summary-message">{pesan}</p>
        <button className="trivia-primary-button" type="button" onClick={() => ulangiKuis(true)}>
          <span aria-hidden="true">↻</span> Acak dan ulangi 50 soal
        </button>
      </section>
    );
  }

  if (!soal) return null;

  return (
    <section className="quiz-layout quiz-konsep-layout" aria-labelledby="judul-kuis">
      <div className="quiz-main-column">
        <div className="quiz-topline">
          <span className="quiz-topic quiz-topic-konsep">{soal.topik}</span>
          <span className="quiz-number">SOAL {String(indeksSoal + 1).padStart(2, "0")} / {String(jumlahSoal).padStart(2, "0")}</span>
        </div>

        <div className="quiz-progress-track" aria-label={`Kemajuan ${Math.round(progres)} persen`}>
          <span style={{ width: `${progres}%` }} />
        </div>

        <div className="quiz-konsep-meta">
          <span>{soal.jenis === "trivia" ? "TRIVIA MEKANIKA" : "KONSEP FISIKA"}</span>
          <span>{jumlahTerjawab} TERJAWAB · {jumlahSoal - jumlahTerjawab} TERSISA</span>
        </div>

        <div className="quiz-question-block">
          <p className="trivia-eyebrow">PILIH PERNYATAAN PALING TEPAT</p>
          <h2 id="judul-kuis">{soal.pertanyaan}</h2>
          <p className="quiz-instruction">Pilih satu jawaban. Penjelasan konsep akan muncul segera setelah pilihanmu dibuat.</p>
        </div>

        <div className="quiz-options" role="group" aria-label="Pilihan jawaban">
          {soal.pilihan.map((pilihan, indeks) => {
            const dipilih = jawabanDipilih === indeks;
            const merupakanJawaban = indeks === soal.jawabanBenar;
            let kelas = "quiz-option";
            if (jawabanDipilih !== null && merupakanJawaban) kelas += " quiz-option-correct";
            else if (dipilih) kelas += " quiz-option-wrong";
            else if (jawabanDipilih !== null) kelas += " quiz-option-muted";

            return (
              <button
                className={kelas}
                type="button"
                key={`${soal.id}-${indeks}`}
                onClick={() => pilihJawaban(indeks)}
                disabled={jawabanDipilih !== null}
                aria-pressed={dipilih}
              >
                <span className="quiz-option-letter">{String.fromCharCode(65 + indeks)}</span>
                <span>{pilihan}</span>
                {jawabanDipilih !== null && merupakanJawaban && <span className="quiz-option-mark" aria-label="Jawaban benar">✓</span>}
                {dipilih && !merupakanJawaban && <span className="quiz-option-mark" aria-label="Jawaban dipilih">×</span>}
              </button>
            );
          })}
        </div>

        {jawabanDipilih !== null && (
          <div className={`quiz-feedback ${jawabanBenar ? "feedback-correct" : "feedback-incorrect"}`} aria-live="polite">
            <div className="feedback-heading">
              <span className="feedback-icon" aria-hidden="true">{jawabanBenar ? "✓" : "i"}</span>
              <strong>{jawabanBenar ? "Tepat sekali!" : "Belum tepat, mari pahami konsepnya."}</strong>
            </div>
            <p>{soal.pembahasan}</p>
          </div>
        )}

        <div className="quiz-footer-row">
          <span className="quiz-score-live"><span aria-hidden="true">✦</span> Skor sementara <strong>{skor}<small> / {jumlahSoal}</small></strong></span>
          <button className="trivia-primary-button" type="button" onClick={lanjutkan} disabled={jawabanDipilih === null}>
            {indeksSoal === jumlahSoal - 1 ? "Lihat Hasil" : "Soal Berikutnya"}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <aside className="quiz-side-card quiz-konsep-side-card">
        <div className="quiz-side-art" aria-hidden="true">
          <span className="quiz-art-orbit orbit-one" />
          <span className="quiz-art-orbit orbit-two" />
          <span className="quiz-art-core">ΣF</span>
          <span className="quiz-art-particle particle-one" />
          <span className="quiz-art-particle particle-two" />
        </div>
        <p className="trivia-eyebrow">PETA BELAJAR</p>
        <h3>50 soal konseptual</h3>
        <p>Latihan ini menilai intuisi fisika, bukan kecepatan menghitung. Urutan soal diacak setiap kali sesi dimulai.</p>
        <div className="quiz-topic-list">
          <span><i className="topic-dot topic-dot-mint" /> Kinematika <strong>12 soal</strong></span>
          <span><i className="topic-dot topic-dot-blue" /> Parabola & melingkar <strong>9 soal</strong></span>
          <span><i className="topic-dot topic-dot-mint" /> Newton & momentum <strong>14 soal</strong></span>
          <span><i className="topic-dot topic-dot-blue" /> Atwood, lift & benda tegar <strong>11 soal</strong></span>
          <span><i className="topic-dot topic-dot-mint" /> Trivia mekanika <strong>4 soal</strong></span>
        </div>
        <div className="quiz-side-score">
          <span>Skor saat ini</span>
          <strong>{skor}<small> / {jumlahSoal}</small></strong>
        </div>
        <div className="quiz-side-score quiz-side-answered">
          <span>Progres sesi</span>
          <strong>{jumlahTerjawab}<small> / {jumlahSoal}</small></strong>
        </div>
      </aside>
    </section>
  );
}
```


## `src/features/trivia-kuis/PetaSejarahFisika.css`

```css
/* Peta Sejarah Fisika — glassmorphism twilight atlas */
.peta-sejarah {
  display: grid;
  gap: 30px;
  width: 100%;
  color: #edf3ff;
  animation: peta-enter .45s ease both;
}

@keyframes peta-enter {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.peta-section-heading,
.peta-gallery-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.peta-section-heading h2,
.peta-gallery-heading h3 {
  margin: 0;
  color: #f2f5ff;
  font: 600 clamp(1.45rem, 3vw, 2.05rem)/1.12 "Space Grotesk", sans-serif;
  letter-spacing: -.045em;
}

.peta-section-heading > div > p:last-child,
.peta-gallery-heading > div > p:last-child {
  max-width: 710px;
  margin: 9px 0 0;
  color: #9eafc8;
  font-size: .78rem;
  line-height: 1.7;
}

.peta-heading-stats {
  display: grid;
  justify-items: end;
  gap: 3px;
  flex: 0 0 auto;
  padding: 10px 14px;
  border: 1px solid rgba(142, 167, 255, .2);
  border-radius: 11px;
  background: rgba(142, 167, 255, .055);
}

.peta-heading-stats strong {
  color: #f6c780;
  font: 600 1.5rem "Space Grotesk", sans-serif;
}

.peta-heading-stats span,
.peta-gallery-heading > span {
  color: #7f96b8;
  font: 500 .55rem "DM Mono", monospace;
  letter-spacing: .12em;
  white-space: nowrap;
}

.peta-map-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 285px;
  gap: 14px;
  align-items: stretch;
}

.peta-map-stage,
.peta-selected-panel {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(139, 169, 222, .2);
  border-radius: 17px;
  background:
    radial-gradient(ellipse at 78% 16%, rgba(119, 116, 185, .13), transparent 37%),
    linear-gradient(145deg, rgba(16, 32, 57, .98), rgba(8, 19, 37, .98));
  box-shadow: 0 18px 55px rgba(3, 8, 19, .22), inset 0 1px rgba(255,255,255,.035);
}

.peta-map-stage::after {
  position: absolute;
  z-index: 0;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(120deg, transparent 20%, rgba(160, 190, 255, .035) 50%, transparent 75%);
  pointer-events: none;
  content: "";
}

.peta-map-topbar {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 15px 17px 0;
  color: #8399b9;
  font: 500 .54rem "DM Mono", monospace;
  letter-spacing: .11em;
}

.peta-map-topbar > span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #b9d5d8;
}

.peta-live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #63e4c8;
  box-shadow: 0 0 12px rgba(99, 228, 200, .9);
  animation: peta-pulse 1.8s ease-in-out infinite;
}

@keyframes peta-pulse {
  50% { opacity: .45; box-shadow: 0 0 4px rgba(99,228,200,.35); }
}

.peta-world-svg {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: auto;
  min-height: 300px;
  overflow: visible;
}

.peta-graticule line,
.peta-inset-grid line {
  stroke: rgba(148, 174, 215, .12);
  stroke-width: 1;
  stroke-dasharray: 2 6;
}

.peta-continents path {
  fill: url(#peta-land);
  stroke: rgba(163, 195, 222, .38);
  stroke-width: 1.2;
  stroke-linejoin: round;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, .14));
}

.peta-tracker-line {
  stroke: #ffcb87;
  stroke-width: 2.2;
  stroke-dasharray: 5 8;
  stroke-linecap: round;
  opacity: .9;
  filter: drop-shadow(0 0 5px rgba(255, 184, 111, .8));
  animation: peta-tracker-flow 16s linear infinite;
}

.peta-tracker-world { stroke-width: 2.6; }
.peta-tracker-inset { stroke-width: 2.8; }

@keyframes peta-tracker-flow {
  to { stroke-dashoffset: -180; }
}

.peta-marker {
  cursor: pointer;
  outline: none;
  transition: opacity .2s ease;
}

.peta-marker-halo {
  fill: rgba(255, 193, 117, .12);
  stroke: rgba(255, 201, 136, .3);
  stroke-width: 1;
  transform-box: fill-box;
  transform-origin: center;
  animation: peta-marker-wave 2.3s ease-out infinite;
}

.peta-marker-core {
  fill: #ffc477;
  stroke: #fff2d9;
  stroke-width: 1.5;
  filter: drop-shadow(0 0 6px rgba(255, 191, 112, .95));
}

.peta-marker-center { fill: #fffaf0; }

.peta-marker-mint .peta-marker-core { fill: #61e4cb; stroke: #e0fff7; filter: drop-shadow(0 0 6px rgba(97, 228, 203, .95)); }
.peta-marker-blue .peta-marker-core { fill: #91b6ff; stroke: #e8efff; filter: drop-shadow(0 0 6px rgba(145, 182, 255, .95)); }
.peta-marker-violet .peta-marker-core { fill: #b6a0ff; stroke: #f0eaff; filter: drop-shadow(0 0 6px rgba(182, 160, 255, .95)); }

.peta-marker.is-active .peta-marker-halo {
  fill: rgba(255, 202, 134, .28);
  stroke: #ffe4ba;
  stroke-width: 2;
  animation-duration: 1.15s;
}

.peta-marker.is-active .peta-marker-core {
  stroke-width: 2.5;
  filter: drop-shadow(0 0 10px rgba(255, 207, 143, 1));
}

.peta-marker:focus-visible .peta-marker-core {
  stroke: white;
  stroke-width: 3;
}

@keyframes peta-marker-wave {
  0% { opacity: .9; transform: scale(.7); }
  75%, 100% { opacity: 0; transform: scale(1.9); }
}

.peta-marker-label {
  fill: #e8efff;
  font: 600 10px "DM Mono", monospace;
  paint-order: stroke;
  stroke: #0a1930;
  stroke-width: 3.5px;
  stroke-linejoin: round;
  pointer-events: none;
}

.peta-world-caption text {
  fill: #66809f;
  font: 9px "DM Mono", monospace;
  letter-spacing: 1.4px;
}

.peta-europe-inset {
  position: absolute;
  z-index: 3;
  right: 15px;
  bottom: 43px;
  width: min(39%, 350px);
  padding: 9px;
  border: 1px solid rgba(157, 184, 225, .32);
  border-radius: 12px;
  background: rgba(8, 21, 41, .91);
  box-shadow: 0 12px 34px rgba(1, 7, 17, .42), 0 0 25px rgba(132, 165, 226, .09);
  backdrop-filter: blur(14px);
}

.peta-inset-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 1px 2px 7px;
}

.peta-inset-heading span {
  color: #8299b7;
  font: 500 .48rem "DM Mono", monospace;
  letter-spacing: .13em;
}

.peta-inset-heading strong {
  color: #f1d2a6;
  font: 600 .65rem "Space Grotesk", sans-serif;
}

.peta-europe-inset svg {
  display: block;
  width: 100%;
  overflow: visible;
  border: 1px solid rgba(141, 172, 212, .13);
  border-radius: 7px;
}

.peta-inset-land {
  fill: rgba(95, 126, 157, .45);
  stroke: rgba(171, 198, 226, .42);
  stroke-width: 1;
  stroke-linejoin: round;
}

.peta-europe-inset > p {
  margin: 6px 2px 0;
  color: #788eaa;
  font-size: .53rem;
  line-height: 1.4;
}

.peta-map-legend {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 0 16px 14px;
}

.peta-map-legend span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #8ca2bf;
  font: .52rem "DM Mono", monospace;
}

.legend-pin {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #61e4cb;
  box-shadow: 0 0 8px #61e4cb;
}

.legend-route {
  width: 19px;
  border-top: 2px dashed #ffc477;
}

.peta-selected-panel {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 18px;
}

.peta-selected-kicker {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: #8299b7;
  font: 500 .52rem "DM Mono", monospace;
  letter-spacing: .1em;
}

.peta-selected-kicker span:last-child { color: #f0bf7d; }

.peta-selected-symbol {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  margin: 22px 0 16px;
  border: 1px solid rgba(255, 196, 119, .4);
  border-radius: 17px;
  background: radial-gradient(circle, rgba(255,196,119,.2), rgba(255,196,119,.035));
  color: #ffd59f;
  font: 600 1.25rem "Space Grotesk", sans-serif;
  box-shadow: 0 0 28px rgba(255, 180, 103, .1), inset 0 0 18px rgba(255, 196, 119, .06);
}

.peta-symbol-mint { color: #8af1dc; border-color: rgba(97,228,203,.4); background: rgba(97,228,203,.09); }
.peta-symbol-blue { color: #a9c6ff; border-color: rgba(145,182,255,.4); background: rgba(145,182,255,.09); }
.peta-symbol-violet { color: #c5b4ff; border-color: rgba(182,160,255,.4); background: rgba(182,160,255,.09); }

.peta-selected-date {
  color: #e5bd82;
  font: 500 .58rem "DM Mono", monospace;
  letter-spacing: .08em;
}

.peta-selected-panel h3 {
  margin: 5px 0 0;
  color: #f1f5ff;
  font: 600 1.25rem "Space Grotesk", sans-serif;
  letter-spacing: -.035em;
}

.peta-selected-person {
  margin: 5px 0 18px;
  color: #8ba3c2;
  font-size: .67rem;
}

.peta-selected-panel h4 {
  margin: 0 0 7px;
  color: #f4d7ac;
  font: 600 .88rem/1.35 "Space Grotesk", sans-serif;
}

.peta-selected-summary {
  margin: 0;
  color: #a8b8cf;
  font-size: .68rem;
  line-height: 1.7;
}

.peta-selected-field {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 17px;
  padding: 10px 0;
  border-top: 1px solid rgba(147, 175, 214, .13);
  border-bottom: 1px solid rgba(147, 175, 214, .13);
}

.peta-selected-field span,
.peta-selected-field strong,
.peta-selected-note strong {
  font: 500 .53rem "DM Mono", monospace;
  letter-spacing: .08em;
}

.peta-selected-field span { color: #7f96b5; }
.peta-selected-field strong { color: #7fe5d1; }

.peta-selected-note {
  margin-top: 14px;
  padding: 11px;
  border: 1px solid rgba(145, 182, 255, .15);
  border-radius: 9px;
  background: rgba(145, 182, 255, .045);
}

.peta-selected-note strong {
  color: #91b6ff;
}

.peta-selected-note p {
  margin: 6px 0 0;
  color: #a6b6ce;
  font-size: .62rem;
  line-height: 1.6;
}

.peta-selected-read {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 17px;
  color: #ffd092;
  font-size: .67rem;
  font-weight: 600;
  text-decoration: none;
}

.peta-selected-read:hover { color: #fff0d8; }
.peta-selected-read span { font-size: 1rem; }

.peta-gallery {
  display: grid;
  gap: 17px;
}

.peta-gallery-heading > span {
  align-self: flex-start;
  margin-top: 7px;
}

.peta-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
  perspective: 1200px;
}

.peta-history-card {
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  --shine-x: 50%;
  --shine-y: 50%;
  min-width: 0;
}

.peta-card-tilt {
  height: 305px;
  perspective: 1100px;
  transform: rotateY(var(--tilt-x)) rotateX(var(--tilt-y));
  transform-style: preserve-3d;
  transition: transform .18s ease-out;
}

.peta-history-card.is-selected .peta-card-tilt {
  filter: drop-shadow(0 0 14px color-mix(in srgb, var(--card-accent) 20%, transparent));
}

.peta-card-flipper {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform .72s cubic-bezier(.2,.72,.22,1);
}

.peta-card-flipper[data-flipped="true"] { transform: rotateY(180deg); }

.peta-card-face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--card-accent) 32%, rgba(147, 175, 214, .17));
  border-radius: 14px;
  background:
    radial-gradient(circle at var(--shine-x) var(--shine-y), color-mix(in srgb, var(--card-accent) 12%, transparent), transparent 40%),
    linear-gradient(145deg, rgba(23, 43, 70, .98), rgba(9, 21, 40, .99));
  box-shadow: inset 0 1px rgba(255,255,255,.06), 0 13px 30px rgba(1,7,18,.18);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.peta-card-front::before,
.peta-card-back::before {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(120deg, rgba(255,255,255,.04), transparent 34%, transparent 70%, rgba(255,255,255,.035));
  pointer-events: none;
  content: "";
}

.peta-card-back { transform: rotateY(180deg); }

.peta-card-topline {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 14px 14px 0;
  color: #8198b6;
  font: 500 .48rem "DM Mono", monospace;
  letter-spacing: .08em;
}

.peta-card-topline span:last-child { color: var(--card-accent); }

.peta-card-visual {
  position: relative;
  display: grid;
  flex: 1;
  place-items: center;
  min-height: 112px;
  overflow: hidden;
}

.peta-card-orbit {
  position: absolute;
  width: 128px;
  aspect-ratio: 1;
  border: 1px solid color-mix(in srgb, var(--card-accent) 25%, transparent);
  border-radius: 50%;
  box-shadow: 0 0 30px color-mix(in srgb, var(--card-accent) 11%, transparent);
}

.peta-card-orbit-one { transform: scale(.72) rotateX(67deg); }
.peta-card-orbit-two { transform: scale(1.1) rotateY(67deg) rotateX(18deg); opacity: .55; }

.peta-card-symbol {
  position: relative;
  z-index: 1;
  color: var(--card-accent);
  font: 600 2.2rem "Space Grotesk", sans-serif;
  text-shadow: 0 0 28px color-mix(in srgb, var(--card-accent) 46%, transparent);
}

.peta-card-spark {
  position: absolute;
  top: 22%;
  right: 25%;
  color: #ffe7bf;
  font-size: .8rem;
  text-shadow: 0 0 13px #ffc477;
}

.peta-card-front-copy {
  position: relative;
  padding: 0 15px 13px;
}

.peta-card-location {
  color: var(--card-accent);
  font: 500 .49rem "DM Mono", monospace;
  letter-spacing: .1em;
}

.peta-card-front-copy h3 {
  margin: 6px 0 4px;
  color: #f2f5fc;
  font: 600 .96rem/1.25 "Space Grotesk", sans-serif;
  letter-spacing: -.025em;
}

.peta-card-front-copy p {
  margin: 0;
  color: #90a5c1;
  font-size: .64rem;
}

.peta-card-foot {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid rgba(157, 184, 225, .12);
  color: #8499b5;
  font: .47rem "DM Mono", monospace;
  letter-spacing: .06em;
}

.peta-card-foot span:first-child { color: var(--card-accent); }

.peta-card-back-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px 15px 13px;
  overflow-y: auto;
}

.peta-card-back-copy h3 {
  margin: 5px 0 8px;
  color: #f5f2ec;
  font: 600 .95rem "Space Grotesk", sans-serif;
}

.peta-card-back-copy > p {
  margin: 0;
  color: #b3c1d5;
  font-size: .62rem;
  line-height: 1.55;
}

.peta-card-contribution {
  display: grid;
  gap: 5px;
  margin-top: 10px;
  padding: 9px;
  border-left: 2px solid var(--card-accent);
  background: rgba(255,255,255,.035);
}

.peta-card-contribution strong {
  color: var(--card-accent);
  font: 500 .48rem "DM Mono", monospace;
  letter-spacing: .1em;
}

.peta-card-contribution span {
  color: #d1dbea;
  font-size: .59rem;
  line-height: 1.5;
}

.peta-card-source {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  margin-top: auto;
  padding-top: 9px;
}

.peta-card-source a {
  color: #a9c5fb;
  font-size: .53rem;
  text-decoration: none;
}

.peta-card-source a:hover { color: #fff; text-decoration: underline; }

.peta-card-actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 1px 0;
}

.peta-card-actions button {
  min-height: 31px;
  padding: 6px 9px;
  border: 1px solid rgba(141, 170, 215, .2);
  border-radius: 7px;
  background: rgba(18, 37, 62, .72);
  color: #a9bad1;
  font-size: .56rem;
  cursor: pointer;
  transition: border-color .18s ease, color .18s ease, background .18s ease;
}

.peta-card-actions button:hover {
  border-color: color-mix(in srgb, var(--card-accent) 50%, transparent);
  color: #f4f7ff;
}

.peta-card-actions .peta-card-flip-button {
  border-color: color-mix(in srgb, var(--card-accent) 28%, transparent);
  color: var(--card-accent);
}

.peta-data-note {
  margin: -6px 0 0;
  padding: 12px 14px;
  border: 1px solid rgba(145, 182, 255, .13);
  border-radius: 9px;
  background: rgba(145, 182, 255, .035);
  color: #8195b2;
  font-size: .62rem;
  line-height: 1.65;
}

@media (max-width: 1060px) {
  .peta-map-layout { grid-template-columns: minmax(0, 1fr) 255px; }
  .peta-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 760px) {
  .peta-section-heading,
  .peta-gallery-heading { align-items: flex-start; flex-direction: column; gap: 12px; }
  .peta-map-layout { grid-template-columns: minmax(0, 1fr); }
  .peta-selected-panel { min-height: 0; }
  .peta-selected-read { margin-top: 16px; }
  .peta-europe-inset {
    position: relative;
    right: auto;
    bottom: auto;
    width: min(94%, 410px);
    margin: -5px 10px 12px auto;
  }
  .peta-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 520px) {
  .peta-card-grid { grid-template-columns: minmax(0, 1fr); }
  .peta-card-tilt { height: 320px; }
  .peta-map-topbar { align-items: flex-start; flex-direction: column; gap: 5px; }
  .peta-map-legend { flex-direction: column; gap: 7px; }
  .peta-heading-stats { align-self: stretch; justify-items: start; }
  .peta-world-svg { min-height: 210px; }
}

@media (prefers-reduced-motion: reduce) {
  .peta-sejarah,
  .peta-live-dot,
  .peta-marker-halo,
  .peta-tracker-line {
    animation: none !important;
  }
  .peta-card-tilt,
  .peta-card-flipper,
  .peta-card-actions button {
    transition: none !important;
  }
}


/* Tiga tab pada halaman Trivia: tetap mudah dipakai di layar kecil. */
.trivia-switcher.trivia-switcher-three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.switcher-icon-map {
  border-color: rgba(246, 189, 96, .22);
  background: rgba(246, 189, 96, .08);
  color: #f6bd60;
}

@media (max-width: 760px) {
  .trivia-switcher.trivia-switcher-three {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* =====================================================
   INTERAKSI LANJUTAN: ZOOM, POP-UP, PANEL DETAIL
   Tambahkan setelah seluruh CSS PetaSejarahFisika.css lama.
   ===================================================== */

.peta-map-layout {
  transition: grid-template-columns .28s ease;
}

.peta-map-layout.is-detail-hidden {
  grid-template-columns: minmax(0, 1fr);
}

.peta-map-stage {
  min-width: 0;
}

.peta-map-toolbar {
  position: relative;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 15px 10px;
}

.peta-map-toolbar .peta-map-topbar {
  padding: 0;
  flex: 1 1 170px;
}

.peta-map-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
}

.peta-zoom-controls {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px;
  border: 1px solid rgba(145, 182, 255, .22);
  border-radius: 9px;
  background: rgba(8, 20, 39, .78);
  box-shadow: inset 0 1px rgba(255,255,255,.04);
}

.peta-zoom-controls button,
.peta-detail-toggle {
  min-height: 30px;
  border: 1px solid rgba(145, 182, 255, .2);
  border-radius: 6px;
  background: rgba(145, 182, 255, .08);
  color: #dce8fc;
  cursor: pointer;
  transition:
    background .18s ease,
    border-color .18s ease,
    color .18s ease,
    transform .18s ease;
}

.peta-zoom-controls button {
  min-width: 30px;
  padding: 3px 8px;
  font-size: 1rem;
  line-height: 1;
}

.peta-zoom-controls button:hover:not(:disabled),
.peta-detail-toggle:hover {
  border-color: rgba(255, 196, 119, .55);
  background: rgba(255, 196, 119, .12);
  color: #ffe2b9;
}

.peta-zoom-controls button:active,
.peta-detail-toggle:active {
  transform: scale(.96);
}

.peta-zoom-controls button:disabled {
  opacity: .35;
  cursor: not-allowed;
}

.peta-zoom-controls > span {
  min-width: 42px;
  color: #9fb1cb;
  font: 500 .57rem "DM Mono", monospace;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.peta-zoom-controls .peta-zoom-reset {
  min-width: auto;
  margin-left: 2px;
  padding-inline: 9px;
  color: #a9c5eb;
  font-size: .56rem;
}

.peta-detail-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 5px 10px;
  color: #f1ce9c;
  font-size: .58rem;
  white-space: nowrap;
}

.peta-detail-toggle > span {
  font-size: .85rem;
}

/* Viewport clips the scaled SVG while keeping controls and inset fixed. */
.peta-map-viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 1;
  min-height: 250px;
  overflow: hidden;
  isolation: isolate;
  background: #0b1b34;
  overscroll-behavior: contain;
  touch-action: pan-y;
  cursor: grab;
}

.peta-map-viewport:active {
  cursor: grabbing;
}

.peta-map-zoom-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: scale(1);
  transform-origin: 50% 50%;
  transition: transform .25s cubic-bezier(.2,.72,.22,1);
  will-change: transform;
}

.peta-map-zoom-layer .peta-world-svg {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: visible;
}

.peta-map-popup {
  position: absolute;
  z-index: 8;
  width: min(270px, calc(100% - 24px));
  padding: 12px 13px;
  border: 1px solid rgba(255, 202, 139, .42);
  border-radius: 11px;
  background:
    radial-gradient(circle at 85% 0%, rgba(255, 190, 121, .14), transparent 48%),
    rgba(7, 20, 39, .94);
  box-shadow:
    0 12px 34px rgba(0, 0, 0, .34),
    0 0 24px rgba(255, 184, 111, .12),
    inset 0 1px rgba(255,255,255,.06);
  backdrop-filter: blur(15px);
  animation: peta-popup-in .18s ease-out both;
  transform: translate(10px, 8px);
  pointer-events: auto;
}

.peta-map-popup.is-right {
  transform: translate(calc(-100% - 10px), 8px);
}

@keyframes peta-popup-in {
  from { opacity: 0; filter: blur(3px); }
  to { opacity: 1; filter: blur(0); }
}

.peta-popup-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  color: #d8b98c;
  font: 500 .48rem "DM Mono", monospace;
  letter-spacing: .08em;
}

.peta-popup-topline button {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid rgba(255,255,255,.13);
  border-radius: 6px;
  background: rgba(255,255,255,.05);
  color: #b8c7dd;
  font-size: 1rem;
  cursor: pointer;
}

.peta-map-popup > strong {
  display: block;
  color: #f5f2ed;
  font: 600 .93rem "Space Grotesk", sans-serif;
}

.peta-popup-person {
  display: block;
  margin-top: 3px;
  color: #8faac9;
  font-size: .6rem;
}

.peta-map-popup > p {
  margin: 8px 0 10px;
  color: #b4c2d6;
  font-size: .62rem;
  line-height: 1.55;
}

.peta-popup-detail-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 7px 8px;
  border: 1px solid rgba(255, 196, 119, .23);
  border-radius: 6px;
  background: rgba(255, 196, 119, .08);
  color: #ffd49b;
  font-size: .58rem;
  cursor: pointer;
}

.peta-popup-detail-link:hover {
  background: rgba(255, 196, 119, .16);
}

.peta-zoom-hint {
  margin-left: auto;
  color: #7189aa !important;
}

.peta-selected-panel {
  animation: peta-panel-in .22s ease both;
}

@keyframes peta-panel-in {
  from { opacity: 0; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}

@media (max-width: 760px) {
  .peta-map-toolbar {
    align-items: flex-start;
  }

  .peta-map-toolbar .peta-map-topbar {
    flex-basis: 100%;
  }

  .peta-map-actions {
    width: 100%;
    justify-content: space-between;
  }

  .peta-map-viewport {
    min-height: 205px;
  }

  .peta-map-popup {
    width: min(245px, calc(100% - 20px));
    padding: 9px 10px;
  }

  .peta-map-popup > p {
    font-size: .56rem;
  }

  .peta-europe-inset {
    position: relative;
    right: auto;
    bottom: auto;
    width: min(94%, 410px);
    margin: 10px 10px 12px auto;
  }
}

@media (max-width: 480px) {
  .peta-map-viewport {
    min-height: 170px;
  }

  .peta-map-actions {
    align-items: stretch;
  }

  .peta-detail-toggle {
    flex: 1 1 auto;
  }

  .peta-zoom-hint {
    width: 100%;
    margin-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .peta-map-zoom-layer,
  .peta-map-popup,
  .peta-selected-panel {
    transition: none !important;
    animation: none !important;
  }
}



/* PEMBARUAN PETA: hapus inset Eropa, pan klik-kiri, zoom halus, offset penanda */
.peta-map-layout { display:grid; grid-template-columns:minmax(0,1fr) 285px; gap:14px; align-items:stretch; }
.peta-map-layout.is-detail-hidden { grid-template-columns:minmax(0,1fr); }
.peta-map-viewport { position:relative; width:100%; aspect-ratio:2/1; min-height:280px; overflow:hidden; isolation:isolate; background:#0b1b34; cursor:grab; touch-action:none; user-select:none; }
.peta-map-viewport.is-dragging { cursor:grabbing; }
.peta-map-zoom-layer { position:absolute; inset:0; width:100%; height:100%; transform-origin:0 0; transition:transform .12s ease-out; will-change:transform; }
.peta-map-viewport.is-dragging .peta-map-zoom-layer { transition:none; }
.peta-map-zoom-layer .peta-world-svg { display:block; width:100%; height:100%; min-height:0; }
.peta-marker { cursor:pointer; outline:none; }
.peta-marker-leader { stroke:rgba(255,206,145,.58); stroke-width:1.15; stroke-dasharray:2 3; pointer-events:none; }
.peta-marker-label { fill:#e8efff; font:600 9px 'DM Mono',monospace; paint-order:stroke; stroke:#0a1930; stroke-width:3px; stroke-linejoin:round; pointer-events:none; }
.peta-marker-halo { fill:color-mix(in srgb,var(--marker-color,#ffc477) 17%,transparent); stroke:color-mix(in srgb,var(--marker-color,#ffc477) 60%,transparent); }
.peta-marker-core { fill:var(--marker-color,#ffc477); stroke:#fff2d9; stroke-width:1.5; filter:drop-shadow(0 0 7px var(--marker-color,#ffc477)); }
.peta-marker.is-active .peta-marker-core { stroke:#fff; stroke-width:2.5; }
.peta-map-popup { position:absolute; z-index:12; width:250px; padding:12px 13px; border:1px solid rgba(255,202,139,.46); border-radius:11px; background:radial-gradient(circle at 85% 0%,rgba(255,190,121,.14),transparent 48%),rgba(7,20,39,.96); box-shadow:0 12px 34px rgba(0,0,0,.38),0 0 24px rgba(255,184,111,.12),inset 0 1px rgba(255,255,255,.06); backdrop-filter:blur(15px); animation:peta-popup-enter .18s ease-out both; }
@keyframes peta-popup-enter { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
.peta-popup-topline { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px; color:#d8b98c; font:500 .48rem 'DM Mono',monospace; letter-spacing:.08em; }
.peta-popup-topline button { width:21px; height:21px; border:1px solid rgba(255,255,255,.15); border-radius:50%; background:rgba(255,255,255,.06); color:#fff; font-size:1rem; line-height:1; cursor:pointer; }
.peta-map-popup > strong { display:block; color:#f5f2ed; font:600 .93rem 'Space Grotesk',sans-serif; }
.peta-popup-person { display:block; margin-top:3px; color:#8faac9; font-size:.6rem; }
.peta-map-popup > p { margin:8px 0 10px; color:#b4c2d6; font-size:.62rem; line-height:1.55; }
.peta-popup-detail-link { display:flex; align-items:center; justify-content:space-between; width:100%; padding:7px 8px; border:1px solid rgba(255,196,119,.23); border-radius:6px; background:rgba(255,196,119,.08); color:#ffd49b; font-size:.58rem; cursor:pointer; }
.peta-map-legend { display:flex; flex-wrap:wrap; align-items:center; gap:12px 17px; padding:0 16px 14px; }
.peta-zoom-hint { margin-left:auto; color:#8198b4; font: .5rem 'DM Mono',monospace; }
.peta-detail-toggle { white-space:nowrap; }
@media (max-width:760px) { .peta-map-layout,.peta-map-layout.is-detail-hidden { grid-template-columns:minmax(0,1fr); }.peta-map-viewport { min-height:220px; }.peta-map-toolbar { align-items:flex-start; }.peta-map-actions { width:100%; justify-content:space-between; }.peta-map-popup { width:min(230px,calc(100% - 16px)); }.peta-zoom-hint { width:100%; margin-left:0; } }
@media (max-width:480px) { .peta-map-viewport { min-height:175px; }.peta-map-popup { padding:9px; }.peta-map-popup > p { font-size:.56rem; }.peta-marker-label { font-size:8px; } }
@media (prefers-reduced-motion:reduce) { .peta-map-zoom-layer,.peta-map-popup { transition:none!important; animation:none!important; } }
```


## `src/features/trivia-kuis/TriviaKuis.css`

```css
.trivia-page { width: min(1120px, 100%); margin: 0 auto; padding-bottom: 24px; }
.trivia-hero { position: relative; display: flex; align-items: center; justify-content: space-between; min-height: 270px; isolation: isolate; overflow: hidden; padding: 34px 38px; border: 1px solid rgba(126,159,207,.2); border-radius: 18px; background: linear-gradient(112deg, #101d31 0%, #172c48 48%, #263c5a 100%); }
.trivia-hero::before { position: absolute; z-index: -1; inset: 0; background: radial-gradient(ellipse at 82% 12%, rgba(246,189,96,.20), transparent 34%), radial-gradient(ellipse at 68% 105%, rgba(85,224,193,.12), transparent 38%); content: ""; }
.trivia-hero-copy { position: relative; z-index: 2; max-width: 680px; }
.trivia-eyebrow { margin: 0 0 10px; color: var(--mint); font: 500 .62rem 'DM Mono', monospace; letter-spacing: .16em; }
.trivia-hero h1 { margin: 0; color: #f3f6fc; font: 600 clamp(1.9rem, 4.1vw, 3rem)/1.07 'Space Grotesk', sans-serif; letter-spacing: -.055em; }
.trivia-hero h1 em { color: #f6bd60; font-style: normal; }
.trivia-hero-copy > p:not(.trivia-eyebrow) { max-width: 590px; margin: 14px 0 0; color: #b4c3d7; font-size: .82rem; line-height: 1.7; }
.trivia-hero-meta { display: flex; flex-wrap: wrap; gap: 17px; margin-top: 23px; }
.trivia-hero-meta span { display: inline-flex; align-items: center; gap: 7px; color: #aabbd1; font: 500 .57rem 'DM Mono', monospace; letter-spacing: .07em; }
.hero-meta-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--mint); box-shadow: 0 0 9px rgba(85,224,193,.7); }
.hero-meta-dot-blue { background: #9bb5ff; box-shadow: 0 0 9px rgba(155,181,255,.7); }
.hero-meta-dot-amber { background: #f6bd60; box-shadow: 0 0 9px rgba(246,189,96,.7); }
.trivia-hero-equation { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: flex-end; flex: 0 0 auto; margin-left: 20px; padding: 18px 20px; border: 1px solid rgba(224,236,255,.16); border-radius: 12px; background: rgba(9,17,30,.24); box-shadow: 0 15px 45px rgba(2,8,18,.13); transform: rotate(-3deg); }
.equation-main { color: #f8f2e9; font: 500 clamp(1.3rem, 2.3vw, 2rem) 'Space Grotesk', sans-serif; letter-spacing: -.05em; }
.equation-sub { margin-top: 6px; color: #95a9c5; font: .49rem 'DM Mono', monospace; letter-spacing: .13em; }
.trivia-hero-sky { position: absolute; z-index: 0; inset: 0; pointer-events: none; overflow: hidden; }
.sky-orbit { position: absolute; right: 5%; top: -58%; width: 345px; aspect-ratio: 1; border: 1px solid rgba(230,236,255,.12); border-radius: 50%; box-shadow: 0 0 0 28px rgba(230,236,255,.018), 0 0 0 58px rgba(230,236,255,.016), 0 0 65px rgba(246,189,96,.09); }
.sky-orbit::before { position: absolute; top: 27%; left: 20%; width: 94px; aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle at 36% 30%, #ffe9b7, #d7a86d 67%, rgba(215,168,109,.18)); box-shadow: 0 0 42px rgba(246,189,96,.2); content: ""; }
.sky-horizon { position: absolute; right: -4%; bottom: -35px; width: 73%; height: 115px; border-radius: 50% 50% 0 0; background: linear-gradient(180deg, rgba(105,139,173,.18), rgba(12,27,46,.3)); filter: blur(2px); }
.sky-star { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: #e9f0ff; box-shadow: 0 0 9px 2px rgba(207,226,255,.46); }
.star-a { top: 25%; right: 39%; }.star-b { top: 48%; right: 18%; width: 2px; height: 2px; }.star-c { top: 14%; right: 10%; width: 2px; height: 2px; }
.trivia-switcher { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 17px 0 30px; }
.trivia-switcher-button { display: flex; align-items: center; gap: 13px; min-height: 73px; padding: 13px 16px; border: 1px solid var(--border); border-radius: 11px; background: var(--panel); color: var(--muted); text-align: left; cursor: pointer; transition: border-color .18s, background .18s, transform .18s; }
.trivia-switcher-button:hover { border-color: rgba(85,224,193,.35); transform: translateY(-1px); }
.trivia-switcher-button.trivia-switcher-active { border-color: rgba(85,224,193,.42); background: linear-gradient(115deg, rgba(85,224,193,.10), rgba(85,224,193,.025)), var(--panel); color: #effcf8; box-shadow: inset 3px 0 0 var(--mint); }
.switcher-icon { display: grid; place-items: center; width: 38px; height: 38px; flex: 0 0 38px; border: 1px solid rgba(85,224,193,.2); border-radius: 10px; background: rgba(85,224,193,.08); color: var(--mint); font-size: 1.25rem; }
.switcher-icon-blue { border-color: rgba(142,167,255,.2); background: rgba(142,167,255,.08); color: var(--blue); }
.switcher-copy { display: flex; flex: 1; flex-direction: column; gap: 4px; min-width: 0; }
.switcher-copy strong { color: #e8eef7; font-size: .82rem; }
.switcher-copy small { color: var(--muted); font-size: .67rem; }
.switcher-arrow { margin-left: auto; color: var(--mint); font-size: 1.1rem; opacity: .75; }
.trivia-content { animation: trivia-enter .24s ease both; }
@keyframes trivia-enter { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.trivia-section-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin-bottom: 22px; }
.trivia-section-heading h2, .quiz-question-block h2, .quiz-summary h2 { margin: 0; color: #eef3fb; font: 600 clamp(1.25rem, 2.1vw, 1.7rem)/1.2 'Space Grotesk', sans-serif; letter-spacing: -.04em; }
.trivia-muted { margin: 8px 0 0; color: var(--muted); font-size: .77rem; line-height: 1.65; }
.trivia-count { flex: 0 0 auto; padding: 7px 9px; border: 1px solid var(--border); border-radius: 6px; color: var(--muted); font: .56rem 'DM Mono', monospace; letter-spacing: .08em; }
.history-timeline { position: relative; display: flex; flex-direction: column; gap: 14px; }
.history-timeline::before { position: absolute; top: 19px; bottom: 32px; left: 20px; width: 1px; background: linear-gradient(180deg, rgba(85,224,193,.5), rgba(142,167,255,.34), rgba(246,189,96,.18)); content: ""; }
.history-item { position: relative; display: grid; grid-template-columns: 41px minmax(0, 1fr); gap: 12px; }
.history-marker { position: relative; z-index: 1; display: grid; place-items: center; width: 41px; height: 41px; border: 1px solid rgba(85,224,193,.26); border-radius: 50%; background: #0d1929; color: var(--mint); font: .62rem 'DM Mono', monospace; box-shadow: 0 0 0 5px rgba(8,15,27,.7); }
.history-biru .history-marker { border-color: rgba(142,167,255,.3); color: var(--blue); }
.history-emas .history-marker { border-color: rgba(246,189,96,.3); color: var(--amber); }
.history-card { overflow: hidden; border: 1px solid var(--border); border-radius: 12px; background: linear-gradient(120deg, rgba(255,255,255,.018), transparent 65%), var(--panel); transition: border-color .18s, box-shadow .18s; }
.history-card-open { border-color: rgba(85,224,193,.3); box-shadow: 0 12px 32px rgba(0,0,0,.12); }
.history-card-trigger { display: block; width: 100%; padding: 16px 18px 15px; border: 0; background: transparent; color: inherit; text-align: left; cursor: pointer; }
.history-card-topline { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.history-year { color: var(--mint); font: 500 .62rem 'DM Mono', monospace; letter-spacing: .05em; }
.history-biru .history-year { color: var(--blue); }.history-emas .history-year { color: var(--amber); }
.history-category { padding: 4px 7px; border: 1px solid rgba(85,224,193,.16); border-radius: 5px; color: #9edbcd; background: rgba(85,224,193,.045); font-size: .57rem; }
.history-card-title-row { display: flex; align-items: center; gap: 11px; margin-top: 11px; }
.history-glyph { display: grid; place-items: center; width: 35px; height: 35px; flex: 0 0 35px; border-radius: 9px; background: rgba(85,224,193,.09); color: var(--mint); font: 600 1rem 'Space Grotesk', sans-serif; }
.history-biru .history-glyph { background: rgba(142,167,255,.09); color: var(--blue); }.history-emas .history-glyph { background: rgba(246,189,96,.09); color: var(--amber); }
.history-card-title-wrap { display: flex; flex: 1; flex-direction: column; gap: 4px; min-width: 0; }
.history-card-title-wrap strong { color: #e9eff8; font: 600 .93rem 'Space Grotesk', sans-serif; }
.history-card-title-wrap small { color: var(--muted); font-size: .66rem; }
.history-chevron { color: var(--faint); font-size: 1rem; transform: rotate(-90deg); transition: transform .18s; }
.history-chevron.is-open { color: var(--mint); transform: rotate(0); }
.history-summary { display: block; margin: 12px 0 0 46px; color: #aab8cb; font-size: .75rem; line-height: 1.65; }
.history-detail { padding: 0 18px 17px 64px; animation: trivia-enter .18s ease both; }
.history-detail > p { margin: 0; color: #c1ccdb; font-size: .74rem; line-height: 1.75; }
.history-formula { display: inline-block; margin-top: 12px; padding: 8px 11px; border: 1px solid rgba(85,224,193,.17); border-radius: 7px; background: rgba(85,224,193,.055); color: #b9f1e2; font: .72rem 'DM Mono', monospace; }
.history-sources { display: flex; flex-wrap: wrap; align-items: center; gap: 7px 13px; margin-top: 13px; padding-top: 12px; border-top: 1px solid rgba(145,161,184,.1); }
.history-source-label { color: var(--faint); font: .53rem 'DM Mono', monospace; letter-spacing: .1em; }
.history-sources a { color: #9eafd0; font-size: .62rem; text-decoration: underline; text-decoration-color: rgba(158,175,208,.35); text-underline-offset: 3px; }
.history-sources a:hover { color: var(--mint); }
.history-note { margin: 15px 0 0 53px; color: var(--faint); font-size: .65rem; line-height: 1.6; }
.quiz-layout { display: grid; grid-template-columns: minmax(0, 1fr) 270px; align-items: start; gap: 17px; }
.quiz-main-column, .quiz-side-card, .quiz-summary { border: 1px solid var(--border); border-radius: 14px; background: var(--panel); }
.quiz-main-column { min-width: 0; padding: 23px; }
.quiz-topline { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.quiz-topic { padding: 5px 8px; border: 1px solid rgba(85,224,193,.2); border-radius: 5px; background: rgba(85,224,193,.06); color: var(--mint); font: .57rem 'DM Mono', monospace; letter-spacing: .05em; }
.quiz-topic-dinamika { border-color: rgba(142,167,255,.22); background: rgba(142,167,255,.06); color: var(--blue); }
.quiz-number { color: var(--muted); font: .58rem 'DM Mono', monospace; letter-spacing: .08em; }
.quiz-progress-track { height: 4px; overflow: hidden; margin-top: 13px; border-radius: 10px; background: #26354a; }
.quiz-progress-track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--mint), #94b8ff); transition: width .25s ease; }
.quiz-question-block { margin: 28px 0 22px; }
.quiz-question-block h2 { max-width: 760px; font-size: clamp(1.14rem, 2vw, 1.55rem); line-height: 1.38; }
.quiz-instruction { margin: 10px 0 0; color: var(--muted); font-size: .72rem; }
.quiz-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.quiz-option { display: flex; align-items: center; gap: 10px; min-height: 57px; padding: 10px 12px; border: 1px solid #2b3c54; border-radius: 9px; background: #142135; color: #c7d2e1; text-align: left; font-size: .74rem; line-height: 1.45; cursor: pointer; transition: border-color .15s, background .15s, opacity .15s; }
.quiz-option:not(:disabled):hover { border-color: rgba(85,224,193,.55); background: #17283c; }
.quiz-option:disabled { cursor: default; }
.quiz-option-letter { display: grid; place-items: center; width: 25px; height: 25px; flex: 0 0 25px; border: 1px solid #43536a; border-radius: 7px; color: #a9b9cf; font: .62rem 'DM Mono', monospace; }
.quiz-option-correct { border-color: rgba(85,224,193,.6); background: rgba(85,224,193,.09); color: #ddfff6; }
.quiz-option-correct .quiz-option-letter { border-color: var(--mint); background: rgba(85,224,193,.13); color: var(--mint); }
.quiz-option-wrong { border-color: rgba(255,126,126,.5); background: rgba(255,126,126,.07); color: #ffdede; }
.quiz-option-wrong .quiz-option-letter { border-color: #e98f8f; color: #ffb1b1; }
.quiz-option-muted { opacity: .55; }
.quiz-option-mark { margin-left: auto; color: var(--mint); font-size: 1rem; }.quiz-option-wrong .quiz-option-mark { color: #ff9b9b; }
.quiz-feedback { margin-top: 17px; padding: 14px 15px; border: 1px solid rgba(85,224,193,.2); border-radius: 9px; background: rgba(85,224,193,.055); animation: trivia-enter .2s ease both; }
.feedback-incorrect { border-color: rgba(246,189,96,.27); background: rgba(246,189,96,.055); }
.feedback-heading { display: flex; align-items: center; gap: 8px; color: #b9f1e2; font-size: .75rem; }.feedback-incorrect .feedback-heading { color: #f6d49d; }
.feedback-icon { display: grid; place-items: center; width: 21px; height: 21px; border-radius: 50%; background: rgba(85,224,193,.13); color: var(--mint); font-size: .72rem; }.feedback-incorrect .feedback-icon { background: rgba(246,189,96,.13); color: var(--amber); }
.quiz-feedback > p { margin: 9px 0 0; color: #b8c6d8; font-size: .72rem; line-height: 1.7; }
.feedback-formula { display: inline-block; margin-top: 10px; padding: 7px 9px; border-radius: 6px; background: rgba(5,13,24,.34); color: #d3f9ee; font: .68rem 'DM Mono', monospace; }
.feedback-incorrect .feedback-formula { color: #ffe0b0; }
.quiz-footer-row { display: flex; align-items: center; justify-content: space-between; gap: 13px; margin-top: 22px; padding-top: 15px; border-top: 1px solid rgba(145,161,184,.12); }
.quiz-score-live { color: var(--muted); font-size: .69rem; }.quiz-score-live > span { margin-right: 7px; color: var(--amber); }.quiz-score-live strong { margin-left: 6px; color: #edf3fb; font: 600 1.05rem 'Space Grotesk', sans-serif; }
.trivia-primary-button { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 39px; padding: 9px 14px; border: 1px solid rgba(85,224,193,.45); border-radius: 8px; background: linear-gradient(110deg, rgba(85,224,193,.17), rgba(85,224,193,.08)); color: #dffff7; font-size: .72rem; font-weight: 700; cursor: pointer; transition: background .15s, transform .15s, opacity .15s; }
.trivia-primary-button:not(:disabled):hover { background: rgba(85,224,193,.2); transform: translateY(-1px); }.trivia-primary-button:disabled { opacity: .4; cursor: not-allowed; }
.quiz-side-card { overflow: hidden; padding: 17px; }
.quiz-side-art { position: relative; display: grid; place-items: center; height: 145px; overflow: hidden; margin: -17px -17px 17px; background: radial-gradient(circle at 50% 48%, rgba(142,167,255,.2), transparent 42%), linear-gradient(145deg, #1b2b47, #101b2e); }
.quiz-art-orbit { position: absolute; width: 97px; aspect-ratio: 1; border: 1px solid rgba(155,181,255,.42); border-radius: 50%; transform: rotate(-27deg) scaleY(.42); }.orbit-two { width: 130px; border-color: rgba(85,224,193,.27); transform: rotate(38deg) scaleY(.5); }
.quiz-art-core { display: grid; place-items: center; width: 53px; height: 53px; border: 1px solid rgba(255,255,255,.25); border-radius: 50%; background: radial-gradient(circle at 34% 27%, #d8e4ff, #7792ca 44%, #34476d); color: #f6f7ff; font: 600 1.3rem 'Space Grotesk', sans-serif; box-shadow: 0 0 32px rgba(142,167,255,.32); }
.quiz-art-particle { position: absolute; width: 4px; height: 4px; border-radius: 50%; background: #e6edff; box-shadow: 0 0 9px 2px rgba(178,205,255,.7); }.particle-one { top: 35px; left: 27%; }.particle-two { right: 24%; bottom: 34px; width: 3px; height: 3px; }
.quiz-side-card h3 { margin: 0; color: #edf3fb; font: 600 1rem 'Space Grotesk', sans-serif; }.quiz-side-card > p:not(.trivia-eyebrow) { margin: 8px 0 16px; color: var(--muted); font-size: .69rem; line-height: 1.65; }
.quiz-topic-list { display: flex; flex-direction: column; gap: 9px; padding: 13px 0; border-top: 1px solid rgba(145,161,184,.12); border-bottom: 1px solid rgba(145,161,184,.12); }
.quiz-topic-list > span { display: flex; align-items: center; gap: 8px; color: #b8c5d6; font-size: .68rem; }.quiz-topic-list strong { margin-left: auto; color: var(--muted); font: .58rem 'DM Mono', monospace; }
.topic-dot { width: 7px; height: 7px; border-radius: 50%; }.topic-dot-mint { background: var(--mint); box-shadow: 0 0 8px rgba(85,224,193,.4); }.topic-dot-blue { background: var(--blue); box-shadow: 0 0 8px rgba(142,167,255,.4); }
.quiz-side-score { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; color: var(--muted); font-size: .67rem; }.quiz-side-score strong { color: var(--mint); font: 600 1.3rem 'Space Grotesk', sans-serif; }.quiz-side-score small { color: var(--faint); font: .65rem 'DM Sans', sans-serif; }
.quiz-summary { display: flex; flex-direction: column; align-items: center; min-height: 470px; padding: 36px 20px; text-align: center; background: radial-gradient(ellipse at 50% 0%, rgba(85,224,193,.09), transparent 43%), var(--panel); animation: trivia-enter .25s ease both; }
.quiz-summary .trivia-eyebrow { margin-top: 13px; }.quiz-summary h2 { font-size: 1.6rem; }.quiz-summary > .trivia-muted { max-width: 440px; }
.summary-orbit { display: grid; place-items: center; width: 65px; height: 65px; border: 1px solid rgba(85,224,193,.34); border-radius: 50%; background: rgba(85,224,193,.07); color: var(--mint); font: 2rem 'Space Grotesk', sans-serif; box-shadow: 0 0 0 9px rgba(85,224,193,.035), 0 0 34px rgba(85,224,193,.13); }
.summary-score-ring { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 145px; height: 145px; margin: 26px 0 21px; border: 5px solid rgba(85,224,193,.33); border-right-color: var(--mint); border-bottom-color: rgba(85,224,193,.6); border-radius: 50%; background: rgba(85,224,193,.045); box-shadow: 0 0 30px rgba(85,224,193,.08); }
.summary-score-ring strong { color: #eafff9; font: 600 2.55rem 'Space Grotesk', sans-serif; letter-spacing: -.06em; }.summary-score-ring span { color: var(--muted); font: .65rem 'DM Mono', monospace; }
.summary-score-line { display: flex; justify-content: space-between; gap: 45px; width: min(360px, 100%); padding: 9px 0; border-bottom: 1px solid rgba(145,161,184,.1); color: var(--muted); font-size: .7rem; }.summary-score-line strong { color: #eaf0f8; font-weight: 600; }
.summary-message { margin: 18px 0; color: #bac8d9; font-size: .77rem; }.quiz-summary .trivia-primary-button { min-width: 155px; }
@media (max-width: 980px) { .quiz-layout { grid-template-columns: minmax(0, 1fr) 235px; }.trivia-hero { padding: 30px; }.trivia-hero-equation { padding: 13px 15px; } }
@media (max-width: 760px) { .trivia-hero { min-height: 250px; padding: 25px 23px; }.trivia-hero-equation { display: none; }.trivia-hero h1 { font-size: clamp(1.8rem, 7vw, 2.5rem); }.trivia-hero-copy > p:not(.trivia-eyebrow) { max-width: 520px; }.quiz-layout { grid-template-columns: 1fr; }.quiz-side-card { display: grid; grid-template-columns: 100px minmax(0,1fr); column-gap: 14px; align-items: center; }.quiz-side-art { grid-row: span 4; height: 115px; margin: -17px 0 -17px -17px; }.quiz-side-card .trivia-eyebrow { margin-top: 10px; }.quiz-side-card > p:not(.trivia-eyebrow) { margin-bottom: 9px; }.quiz-topic-list { grid-column: 1 / -1; margin-top: 14px; }.quiz-side-score { grid-column: 1 / -1; } }
@media (max-width: 560px) { .trivia-hero { min-height: 0; padding: 23px 19px; }.trivia-hero-meta { gap: 9px 13px; margin-top: 18px; }.trivia-hero-meta span { font-size: .51rem; }.trivia-switcher { gap: 8px; margin-bottom: 24px; }.trivia-switcher-button { min-height: 66px; gap: 8px; padding: 9px; }.switcher-icon { width: 30px; height: 30px; flex-basis: 30px; font-size: 1rem; }.switcher-copy strong { font-size: .69rem; }.switcher-copy small { font-size: .57rem; line-height: 1.4; }.switcher-arrow { display: none; }.trivia-section-heading { align-items: flex-start; flex-direction: column; gap: 11px; }.trivia-section-heading h2 { font-size: 1.35rem; }.history-item { grid-template-columns: 30px minmax(0,1fr); gap: 8px; }.history-timeline::before { left: 14px; }.history-marker { width: 30px; height: 30px; font-size: .53rem; }.history-card-trigger { padding: 13px 12px; }.history-card-title-wrap strong { font-size: .8rem; }.history-summary { margin-left: 0; font-size: .7rem; }.history-detail { padding: 0 12px 14px; }.history-note { margin-left: 38px; }.quiz-main-column { padding: 16px 13px; }.quiz-options { grid-template-columns: 1fr; }.quiz-option { min-height: 50px; }.quiz-footer-row { align-items: flex-start; flex-direction: column; }.quiz-footer-row .trivia-primary-button { width: 100%; }.quiz-side-card { grid-template-columns: 78px minmax(0,1fr); }.quiz-side-art { height: 100px; }.quiz-summary { min-height: 430px; padding: 30px 15px; } }
@media (prefers-reduced-motion: reduce) { .trivia-content, .history-detail, .quiz-feedback, .quiz-summary { animation: none; }.trivia-switcher-button, .quiz-progress-track span, .history-chevron, .trivia-primary-button { transition: none; } }

/* Tautan Trivia & Kuis pada sidebar utama. */
.sidebar-learning { margin-top: 13px; padding-top: 11px; border-top: 1px solid rgba(145,161,184,.10); }
.sidebar-learning .sidebar-caption { margin-bottom: 8px; }
.learning-category { margin-top: 0; }
.learning-tag { margin-left: auto; color: var(--faint); font: 500 .52rem 'DM Mono', monospace; letter-spacing: .08em; }
.learning-category.category-active .learning-tag { color: var(--mint); }
@media (max-width: 650px) { .sidebar-learning { display: flex; align-items: center; gap: 5px; margin-top: 0; padding-top: 0; border-top: 0; } .sidebar-learning .sidebar-caption { display: none; } .sidebar-learning .learning-category { min-height: 38px; padding: 0 7px; font-size: .73rem; } .learning-tag { display: none; } }
/* Pembaruan Trivia: tiga ruang belajar dan label kuis konsep mekanika. */
.trivia-switcher.trivia-switcher-three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.quiz-topic-konsep {
  border-color: rgba(246, 189, 96, .24);
  background: rgba(246, 189, 96, .08);
  color: #f3d19b;
}
.quiz-konsep-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  color: #8196b4;
  font: 500 .52rem 'DM Mono', monospace;
  letter-spacing: .09em;
}
.quiz-konsep-summary .summary-message {
  max-width: 460px;
  line-height: 1.7;
}
.quiz-konsep-side-card .quiz-topic-list {
  gap: 10px;
}
.quiz-konsep-side-card .quiz-topic-list > span {
  font-size: .63rem;
}
.quiz-konsep-side-card .quiz-topic-list strong {
  white-space: nowrap;
}
.quiz-side-answered {
  margin-top: 9px;
  padding-top: 10px;
  border-top: 1px solid rgba(145, 161, 184, .1);
}
@media (max-width: 760px) {
  .trivia-switcher.trivia-switcher-three {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 560px) {
  .quiz-konsep-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }
}
```
