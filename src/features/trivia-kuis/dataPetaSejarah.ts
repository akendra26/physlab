export type TitikSejarahFisika = {
  id: string;
  tahun: string;
  urutan: number;
  kota: string;
  negara: string;
  lintang: number;
  bujur: number;
  tokoh: string;
  judul: string;
  cabang: "Kinematika" | "Dinamika" | "Fisika Modern";
  simbol: string;
  aksen: "mint" | "amber" | "blue" | "violet";
  ringkasan: string;
  cerita: string;
  kontribusi: string;
  catatan: string;
  sumber: { label: string; url: string }[];
};

/**
 * Dataset peta sejarah.
 * Koordinat menggunakan lintang/bujur desimal WGS84.
 * Urutan dipakai untuk menghubungkan titik dengan garis tracker.
 */
export const TITIK_SEJARAH_FISIKA: TitikSejarahFisika[] = [
  {
    id: "pisa-galileo",
    tahun: "1589–1592",
    urutan: 1,
    kota: "Pisa",
    negara: "Italia",
    lintang: 43.7228,
    bujur: 10.4017,
    tokoh: "Galileo Galilei",
    judul: "Gerak mulai diuji melalui eksperimen",
    cabang: "Kinematika",
    simbol: "g",
    aksen: "amber",
    ringkasan:
      "Saat menjadi profesor matematika di Universitas Pisa, Galileo mulai menelaah fenomena gerak benda.",
    cerita:
      "Galileo diangkat sebagai pemegang kursi matematika di Universitas Pisa pada 1589. Pada periode ini ia mulai mengkaji gerak benda dan mengembangkan pendekatan yang menggabungkan pengamatan, pengukuran, serta penalaran matematika. Kisah terkenal tentang eksperimen menjatuhkan benda dari Menara Pisa tidak perlu dianggap sebagai kejadian yang telah terbukti; percobaan bidang miring dan kajian gerak merupakan landasan yang lebih kuat untuk menjelaskan kontribusinya.",
    kontribusi:
      "Gerak dipelajari sebagai fenomena yang dapat diukur dan dibandingkan, sehingga menjadi salah satu fondasi kinematika modern.",
    catatan:
      "Pisa menandai awal perjalanan akademik Galileo, bukan satu-satunya tempat ia meneliti gerak. Ia melanjutkan banyak pekerjaannya di Padua.",
    sumber: [
      {
        label: "Museo Galileo — Biographical itinerary",
        url: "https://brunelleschi.imss.fi.it/itineraries/itinerary/biographicalitineraryofgalileogalilei.html",
      },
      {
        label: "Stanford Encyclopedia of Philosophy — Galileo",
        url: "https://plato.stanford.edu/entries/galileo/",
      },
    ],
  },
  {
    id: "cambridge-newton",
    tahun: "1661–1667",
    urutan: 2,
    kota: "Cambridge",
    negara: "Inggris",
    lintang: 52.2053,
    bujur: 0.1218,
    tokoh: "Isaac Newton",
    judul: "Fondasi mekanika klasik dibangun",
    cabang: "Dinamika",
    simbol: "ΣF",
    aksen: "mint",
    ringkasan:
      "Newton belajar di Trinity College dan kemudian kembali ke Cambridge sebagai profesor matematika.",
    cerita:
      "Newton masuk Trinity College, Cambridge, pada 1661. Ketika wabah menutup universitas pada 1665–1667, ia mengembangkan sejumlah gagasan penting di Woolsthorpe. Ia kembali ke Cambridge pada 1667 dan menjadi Lucasian Professor of Mathematics pada 1669. Tempat ini menggambarkan lingkungan akademik yang membentuk karya Newton, meskipun sejumlah gagasan awalnya berkembang ketika ia berada di luar Cambridge.",
    kontribusi:
      "Karyanya membantu menyatukan deskripsi gerak di Bumi dan gerak benda langit dalam kerangka matematis.",
    catatan:
      "Periode wabah 1665–1667 berlangsung terutama di Woolsthorpe, bukan di kampus Cambridge.",
    sumber: [
      {
        label: "The Fitzwilliam Museum — Sir Isaac Newton",
        url: "https://fitzmuseum.cam.ac.uk/explore-our-collection/highlights/context/stories-and-histories/sir-isaac-newton",
      },
      {
        label: "Cambridge University Press — Newton chronology",
        url: "https://assets.cambridge.org/97805218/31222/frontmatter/9780521831222_frontmatter.pdf",
      },
    ],
  },
  {
    id: "london-principia",
    tahun: "1687",
    urutan: 3,
    kota: "London",
    negara: "Inggris",
    lintang: 51.5072,
    bujur: -0.1276,
    tokoh: "Isaac Newton & Edmond Halley",
    judul: "Principia diterbitkan",
    cabang: "Dinamika",
    simbol: "F = ma",
    aksen: "blue",
    ringkasan:
      "Philosophiæ Naturalis Principia Mathematica terbit di London dan menjadi tonggak mekanika klasik.",
    cerita:
      "Buku Principia karya Newton diterbitkan pada 1687. Edmond Halley membantu mendorong penerbitannya dan mengawasi proses cetak di London. Karya tersebut menyajikan hukum gerak dan gravitasi universal dalam satu kerangka matematis yang menjelaskan fenomena di Bumi maupun di langit.",
    kontribusi:
      "Prinsip-prinsip gerak Newton menjadi dasar penting bagi pembelajaran gaya, percepatan, momentum, dan gravitasi.",
    catatan:
      "Cambridge berkaitan dengan perjalanan akademik dan pengembangan ide Newton; London adalah lokasi penerbitan edisi pertama Principia.",
    sumber: [
      {
        label: "Cambridge University Library — Glory and Gravity",
        url: "https://wwwe.lib.cam.ac.uk/CUL/exhibitions/Footprints_of_the_Lion/gravity_glory.html",
      },
      {
        label: "Chetham's Library — Newton's Principia",
        url: "https://library.chethams.com/collections/101-treasures-of-chethams/newtons-principia/",
      },
    ],
  },
  {
    id: "zurich-einstein",
    tahun: "1896–1900",
    urutan: 4,
    kota: "Zürich",
    negara: "Swiss",
    lintang: 47.3769,
    bujur: 8.5417,
    tokoh: "Albert Einstein",
    judul: "Masa studi di Politeknik Zürich",
    cabang: "Fisika Modern",
    simbol: "c",
    aksen: "violet",
    ringkasan:
      "Einstein belajar matematika dan fisika di Federal Polytechnic, institusi yang kini dikenal sebagai ETH Zürich.",
    cerita:
      "Einstein belajar di Federal Polytechnic Zürich dari 1896 sampai 1900 dan memperoleh diploma sebagai pengajar matematika serta sains. Pengalaman akademik tersebut menjadi bagian penting dari pembentukan intelektualnya. Namun, makalah relativitas khusus yang terkenal tidak ditulis sebagai hasil eksperimen di kampus Zürich; pada 1905 Einstein bekerja di kantor paten di Bern.",
    kontribusi:
      "Peta ini membedakan tempat pendidikan Einstein di Zürich dari konteks pekerjaan dan publikasi ilmiahnya di Bern.",
    catatan:
      "Zürich adalah lokasi studi Einstein; jangan menyamakan periode ini dengan tahun terbit makalah relativitas khusus (1905).",
    sumber: [
      {
        label: "University of Zurich — Albert Einstein",
        url: "https://www.unizh.ch/en/researchinnovation/excellence/nobelprize/einstein.html",
      },
      {
        label: "ETH Library — Einstein Online",
        url: "https://library.ethz.ch/en/sammlungen-und-archive/platforms/einstein-online.html",
      },
    ],
  },
  {
    id: "paris-curie",
    tahun: "1898",
    urutan: 5,
    kota: "Paris",
    negara: "Prancis",
    lintang: 48.8566,
    bujur: 2.3522,
    tokoh: "Marie & Pierre Curie",
    judul: "Polonium dan radium diumumkan",
    cabang: "Fisika Modern",
    simbol: "Ra",
    aksen: "amber",
    ringkasan:
      "Riset radioaktivitas di Paris menghasilkan pengumuman polonium dan radium pada 1898.",
    cerita:
      "Marie Curie meneliti radiasi dari uranium dan menemukan bahwa mineral tertentu menunjukkan aktivitas yang tidak dapat dijelaskan hanya oleh kandungan uraniumnya. Bersama Pierre Curie, ia mengidentifikasi polonium pada Juli 1898 dan radium pada Desember 1898; Gustave Bémont turut menandatangani catatan penemuan radium. Penelitian dilakukan di laboratorium sederhana di École municipale de physique et de chimie industrielles de la ville de Paris.",
    kontribusi:
      "Penelitian ini memperkuat lahirnya studi radioaktivitas dan mengubah pemahaman tentang sifat materi.",
    catatan:
      "Penemuan berlangsung melalui kerja kolaboratif. Pencapaian ini tidak tepat jika dinarasikan sebagai hasil satu orang saja.",
    sumber: [
      {
        label: "Nobel Prize — Marie and Pierre Curie",
        url: "https://www.nobelprize.org/prizes/themes/marie-and-pierre-curie-and-the-discovery-of-polonium-and-radium/",
      },
      {
        label: "Paris Centre — Marie Curie in Paris",
        url: "https://mairiepariscentre.paris.fr/pages/balade-dans-le-paris-savant-de-marie-curie-15487",
      },
    ],
  },
  {
    id: "bern-einstein",
    tahun: "1902–1909 · 1905",
    urutan: 6,
    kota: "Bern",
    negara: "Swiss",
    lintang: 46.948,
    bujur: 7.4474,
    tokoh: "Albert Einstein",
    judul: "Annus Mirabilis di kantor paten",
    cabang: "Fisika Modern",
    simbol: "c²",
    aksen: "blue",
    ringkasan:
      "Saat bekerja di kantor paten Bern, Einstein menerbitkan beberapa makalah penting pada 1905, termasuk relativitas khusus.",
    cerita:
      "Einstein mulai bekerja di Swiss Patent Office pada 1902. Tahun 1905 kemudian dikenal sebagai annus mirabilis karena ia menerbitkan lima karya penting dalam beberapa bidang fisika. Menurut arsip ETH Library, gagasan kunci relativitas khusus muncul pada Mei 1905 dalam diskusinya dengan Michele Besso di Bern.",
    kontribusi:
      "Relativitas khusus mengubah cara fisika memahami ruang, waktu, dan pengukuran gerak untuk pengamat yang bergerak relatif.",
    catatan:
      "Istilah annus mirabilis merujuk pada rangkaian publikasi Einstein pada 1905, bukan satu eksperimen tunggal.",
    sumber: [
      {
        label: "ETH Library — Einstein at the Patent Office",
        url: "https://library.ethz.ch/en/collections-and-archives/platforms/einstein-online/beamter-im-patentamt-1900-1909.html",
      },
      {
        label: "Swiss Federal Institute of Intellectual Property — Einstein",
        url: "https://www.ige.ch/en/about-us/the-history-of-the-ipi/einstein",
      },
    ],
  },
];
