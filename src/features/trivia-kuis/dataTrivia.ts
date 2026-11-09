export type PeristiwaSejarah = {
  tahun: string;
  kategori: "Kinematika" | "Dinamika";
  judul: string;
  tokoh: string;
  ringkasan: string;
  detail: string;
  rumus?: string;
  simbol: string;
  warna: "mint" | "biru" | "emas";
  sumber: { label: string; url: string }[];
};

/** Fakta sejarah dipilih untuk menunjukkan perkembangan ide, bukan sekadar daftar tanggal. */
export const PERISTIWA_SEJARAH: PeristiwaSejarah[] = [
  {
    tahun: "Sekitar 1604",
    kategori: "Kinematika",
    judul: "Gerak jatuh mulai dijelaskan dengan matematika",
    tokoh: "Galileo Galilei",
    ringkasan:
      "Galileo menelaah gerak jatuh dan menemukan pola bahwa jarak yang ditempuh benda dari keadaan diam bertambah sebanding dengan kuadrat waktu pada percepatan konstan.",
    detail:
      "Melalui penalaran dan percobaan bidang miring, Galileo mengembangkan cara mengukur gerak yang diperlambat agar mudah diamati. Gagasan pentingnya adalah bahwa gerak dapat diuji dan dinyatakan secara matematis, bukan hanya dijelaskan secara kualitatif. Kisah populer tentang menjatuhkan dua benda dari Menara Pisa tidak perlu dianggap sebagai bukti eksperimen yang pasti dilakukan persis seperti cerita tersebut.",
    rumus: "s = ½ at²  (v₀ = 0)",
    simbol: "g",
    warna: "emas",
    sumber: [
      { label: "Stanford Encyclopedia of Philosophy — Galileo", url: "https://plato.stanford.edu/entries/galileo/" },
      { label: "Australian Mathematical Sciences Institute — Kinematics before Newton", url: "https://amsi.org.au/ESA_Senior_Years/SeniorTopic3/3i/3i_4history_1.html" },
    ],
  },
  {
    tahun: "1638",
    kategori: "Kinematika",
    judul: "Dua ilmu baru tentang gerak diterbitkan",
    tokoh: "Galileo Galilei",
    ringkasan:
      "Dalam Discorsi e dimostrazioni matematiche intorno a due nuove scienze, Galileo memaparkan kajian matematis tentang gerak dipercepat dan lintasan proyektil.",
    detail:
      "Karya ini menghubungkan eksperimen, pengukuran waktu, dan penalaran geometri. Galileo membahas gerak jatuh, bidang miring, serta gabungan gerak horizontal dan vertikal yang menghasilkan lintasan parabola dalam model ideal tanpa hambatan udara.",
    rumus: "x = v₀ₓt   ·   y = v₀ᵧt − ½gt²",
    simbol: "↗",
    warna: "mint",
    sumber: [
      { label: "Museo Galileo — Science of Motion", url: "https://catalogue.museogalileo.it/section/ScienceOfMotion.html" },
      { label: "ETH Library — The Dialogue and kinematics", url: "https://library.ethz.ch/en/collections-and-archives/platforms/virtual-exhibitions/galileo-galilei/galileos-works/the-dialogue-and-kinematics.html" },
    ],
  },
  {
    tahun: "1668–1669",
    kategori: "Dinamika",
    judul: "Hukum tumbukan menjadi bahan kajian kuantitatif",
    tokoh: "John Wallis, Christopher Wren, dan Christiaan Huygens",
    ringkasan:
      "Sejumlah ilmuwan Eropa mengembangkan aturan matematis untuk memahami tumbukan benda, termasuk hubungan momentum sebelum dan sesudah tumbukan.",
    detail:
      "Kajian tumbukan membantu membedakan besaran yang hanya menggambarkan gerak dari besaran yang menghubungkan gerak dengan interaksi. Dalam sistem yang resultan impuls eksternalnya dapat diabaikan, momentum total sistem tetap. Hasil dan gagasan para peneliti ini menjadi bagian dari konteks ilmiah yang mendahului Principia Newton.",
    rumus: "Σp sebelum = Σp sesudah",
    simbol: "⇄",
    warna: "biru",
    sumber: [
      { label: "Stanford Encyclopedia of Philosophy — Newton's Principia", url: "https://plato.stanford.edu/entries/newton-principia/" },
      { label: "Oxford Academic — Experiments in the Principia", url: "https://academic.oup.com/edited-volume/34749/chapter-abstract/296602495" },
    ],
  },
  {
    tahun: "1687",
    kategori: "Dinamika",
    judul: "Principia menyatukan hukum gerak dan gravitasi",
    tokoh: "Isaac Newton",
    ringkasan:
      "Newton menerbitkan Philosophiae Naturalis Principia Mathematica, yang merumuskan tiga hukum gerak dan teori gravitasi universal dalam kerangka matematis.",
    detail:
      "Hukum kedua Newton secara umum menghubungkan resultan gaya dengan laju perubahan momentum. Untuk massa konstan, bentuk yang biasa dipakai di kelas adalah ΣF = ma. Kerangka ini menjelaskan gerak di permukaan Bumi sekaligus membantu menjelaskan gerak benda langit.",
    rumus: "ΣF = dp/dt   →   ΣF = ma (massa konstan)",
    simbol: "F",
    warna: "emas",
    sumber: [
      { label: "University of Oklahoma — Mathematical Principles of Natural Philosophy, 1687", url: "https://galileo.ou.edu/exhibits/mathematical-principles-natural-philosophy-1687.html" },
      { label: "Library of Congress — Principia", url: "https://www.loc.gov/item/2021667054/" },
    ],
  },
  {
    tahun: "Abad ke-17",
    kategori: "Kinematika",
    judul: "Waktu dan pengukuran menjadi kunci memahami gerak",
    tokoh: "Tradisi eksperimen Galileo dan para pendahulunya",
    ringkasan:
      "Pengamatan ayunan bandul dan percobaan gerak lambat membantu ilmuwan menghubungkan posisi, kecepatan, dan waktu secara lebih terukur.",
    detail:
      "Kinematika modern membutuhkan besaran yang dapat dibandingkan dari satu saat ke saat lain. Ketika waktu diukur lebih sistematis, perubahan posisi dapat digunakan untuk membangun konsep kecepatan dan percepatan. Sejarahnya berkembang bertahap melalui kontribusi banyak ilmuwan, bukan oleh satu penemu tunggal.",
    rumus: "v = Δx/Δt   ·   a = Δv/Δt",
    simbol: "t",
    warna: "mint",
    sumber: [
      { label: "Stanford Encyclopedia of Philosophy — Galileo", url: "https://plato.stanford.edu/entries/galileo/" },
      { label: "Museo Galileo — Science of Motion", url: "https://catalogue.museogalileo.it/section/ScienceOfMotion.html" },
    ],
  },
];