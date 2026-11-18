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
    id: "cairo-ibn-al-haytham",
    tahun: "KISARAN 1028–1038",
    urutan: 1,
    kota: "Kairo",
    negara: "Mesir",
    lintang: 30.0444,
    bujur: 31.2357,
    tokoh: "Ibn al-Haytham",
    judul: "Kitab al-Manazir disusun di Kairo",
    cabang: "Fisika Modern",
    simbol: "☼",
    aksen: "amber",
    ringkasan:
      "Ibn al-Haytham menyusun karya penting tentang penglihatan, cahaya, refleksi, dan refraksi ketika berada di Kairo.",
    cerita:
      "Kitab al-Manazir atau Book of Optics disusun Ibn al-Haytham di Kairo pada paruh kedua awal abad ke-11. Karya tujuh buku ini membahas penglihatan langsung, pemantulan, dan pembiasan. Gagasan-gagasannya menjadi bagian penting dari sejarah optika dan kajian cahaya.",
    kontribusi:
      "Pembahasan cahaya dan penglihatan mendorong tradisi kajian optika yang menggabungkan geometri, pengamatan, dan penalaran.",
    catatan:
      "Pin menggunakan koordinat perkiraan pusat kota Kairo sebagai penanda wilayah, bukan koordinat bangunan tempat penulisan yang terverifikasi.",
    sumber: [
      {
        label: "Cambridge Libraries — Alhacen, De Aspectibus",
        url: "https://medieval.lib.cam.ac.uk/catalogue/Peterhouse/MS-PETERHOUSE-00209",
      },
      {
        label: "European Physical Journal Plus — Ibn al-Haytham’s Book of Optics",
        url: "https://scholarworks.aub.edu.lb/server/api/core/bitstreams/ab5c903d-7a20-4dd9-b22d-fbd34dd80dc4/content",
      },
    ],
  },
  {
    id: "maragheh-tusi",
    tahun: "1259–ABAD KE-13",
    urutan: 2,
    kota: "Maragheh",
    negara: "Iran",
    lintang: 37.3894,
    bujur: 46.2374,
    tokoh: "Nasir al-Din al-Tusi",
    judul: "Observatorium Maragheh dibangun",
    cabang: "Fisika Modern",
    simbol: "⌖",
    aksen: "violet",
    ringkasan:
      "Observatorium Maragheh menjadi pusat kegiatan astronomi penting pada abad ke-13.",
    cerita:
      "Pembangunan Observatorium Maragheh dimulai pada 1259 di bawah patronase Hülegü, dengan Nasir al-Din al-Tusi sebagai direktur. Lembaga ini mengembangkan pengamatan dan model matematis gerak benda langit, termasuk sistem non-Ptolemaik yang kemudian berpengaruh luas dalam sejarah astronomi.",
    kontribusi:
      "Maragheh menunjukkan bahwa perkembangan model gerak langit berlangsung melalui jaringan ilmuwan dan institusi lintas kawasan.",
    catatan:
      "Koordinat pin merupakan perkiraan pusat kota Maragheh, bukan titik presisi reruntuhan observatorium.",
    sumber: [
      {
        label: "UNESCO World Heritage Centre — Heritage Sites of Astronomy",
        url: "https://whc.unesco.org/document/104639",
      },
    ],
  },
  {
    id: "samarkand-ulugh-beg",
    tahun: "1420–1437",
    urutan: 3,
    kota: "Samarkand",
    negara: "Uzbekistan",
    lintang: 39.6542,
    bujur: 66.9597,
    tokoh: "Ulugh Beg",
    judul: "Observatorium Samarkand memetakan langit",
    cabang: "Fisika Modern",
    simbol: "✧",
    aksen: "blue",
    ringkasan:
      "Observatorium Ulugh Beg di Samarkand dibangun pada 1420-an dan menjadi pusat pengukuran astronomi presisi.",
    cerita:
      "Ulugh Beg memulai pembangunan observatorium di Kuhak, Samarkand, sekitar 1420; kompleks tersebut selesai pada 1429. Instrumen meridian berukuran besar digunakan untuk mengukur posisi benda langit dan memperbaiki data astronomi pada masanya.",
    kontribusi:
      "Pengukuran sistematis di Samarkand memperlihatkan pentingnya instrumen, kalibrasi, dan observasi berulang dalam menghasilkan tabel astronomi.",
    catatan:
      "Koordinat pin merupakan perkiraan pusat kota Samarkand; lokasi observatorium berada di kawasan Kuhak di utara kota.",
    sumber: [
      {
        label: "UNESCO Silk Roads — Astronomy, Observatories and Calendars",
        url: "https://en.unesco.org/silkroad/sites/default/files/knowledge-bank-article/vol_IVb%20silk%20road_astronomy%2C%20astrology%2C%20observatories%20and%20calendars.pdf",
      },
    ],
  },
  {
    id: "pisa-galileo",
    tahun: "1589–1592",
    urutan: 4,
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
    urutan: 5,
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
    urutan: 6,
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
    id: "cleveland-michelson-morley",
    tahun: "1887",
    urutan: 7,
    kota: "Cleveland",
    negara: "Amerika Serikat",
    lintang: 41.4993,
    bujur: -81.6944,
    tokoh: "Albert A. Michelson & Edward W. Morley",
    judul: "Eksperimen Michelson–Morley",
    cabang: "Fisika Modern",
    simbol: "∿",
    aksen: "blue",
    ringkasan:
      "Interferometer Michelson–Morley menghasilkan null result dalam pencarian gerak Bumi relatif terhadap eter luminiferus.",
    cerita:
      "Pada beberapa rangkaian pengamatan antara April dan Juli 1887, Michelson dan Morley menjalankan eksperimen interferometri di ruang bawah tanah Adelbert Dormitory, Western Reserve University, Cleveland. Hasilnya tidak menunjukkan pergeseran yang diharapkan dari hipotesis eter luminiferus.",
    kontribusi:
      "Hasil null tersebut menjadi bagian penting dari diskusi tentang eter dan konteks historis yang mendahului perkembangan relativitas khusus.",
    catatan:
      "Koordinat pin adalah pusat kota Cleveland; eksperimen berlangsung di lokasi kampus yang kini menjadi bagian Case Western Reserve University. Null result bukan bukti tunggal bagi relativitas.",
    sumber: [
      {
        label: "Case Western Reserve University — Michelson–Morley Experiment",
        url: "https://case.edu/ech/articles/m/michelson-morley-experiment",
      },
    ],
  },
  {
    id: "zurich-einstein",
    tahun: "1896–1900",
    urutan: 8,
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
    urutan: 9,
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
    urutan: 10,
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
  {
    id: "kolkata-raman",
    tahun: "1928",
    urutan: 11,
    kota: "Kolkata",
    negara: "India",
    lintang: 22.5726,
    bujur: 88.3639,
    tokoh: "C. V. Raman & K. S. Krishnan",
    judul: "Efek Raman ditemukan",
    cabang: "Fisika Modern",
    simbol: "光",
    aksen: "amber",
    ringkasan:
      "Raman dan Krishnan mengamati bahwa cahaya yang dihamburkan material dapat memiliki frekuensi berbeda dari cahaya datang.",
    cerita:
      "Efek Raman ditemukan pada 1928 melalui penelitian hamburan cahaya di Indian Association for the Cultivation of Science, Calcutta (kini Kolkata). Fenomena ini menunjukkan bahwa sebagian kecil cahaya yang dihamburkan dapat mengalami perubahan frekuensi yang bergantung pada sifat material.",
    kontribusi:
      "Efek Raman menjadi dasar spektroskopi Raman, teknik untuk mempelajari struktur dan karakteristik material melalui interaksi cahaya dengan materi.",
    catatan:
      "Koordinat pin menunjukkan pusat kota Kolkata. Penemuan dilakukan di IACS; sejarahnya melibatkan kontribusi K. S. Krishnan bersama Raman.",
    sumber: [
      {
        label: "American Chemical Society — The Raman Effect Landmark",
        url: "https://www.acs.org/education/whatischemistry/landmarks/ramaneffect.html",
      },
      {
        label: "Indian Association for the Cultivation of Science — Annual Report",
        url: "https://iacs.res.in/modules/texteditor/imagesfiles/IACS%20Annual%20Report%202022%20English%20Final.pdf",
      },
    ],
  },
  {
    id: "berkeley-cyclotron",
    tahun: "1930–1931",
    urutan: 12,
    kota: "Berkeley",
    negara: "Amerika Serikat",
    lintang: 37.8715,
    bujur: -122.2730,
    tokoh: "Ernest O. Lawrence & M. Stanley Livingston",
    judul: "Cyclotron membuka era akselerator partikel",
    cabang: "Fisika Modern",
    simbol: "⟲",
    aksen: "mint",
    ringkasan:
      "Cyclotron awal dikembangkan di Berkeley untuk mempercepat partikel bermuatan menggunakan medan listrik dan magnet.",
    cerita:
      "Ernest Lawrence merancang gagasan cyclotron setelah bergabung dengan University of California, Berkeley. Model awal dibuat pada 1930 bersama Nels Edlefsen; model kerja yang lebih baik berhasil mempercepat ion hidrogen pada 2 Januari 1931 dengan bantuan M. Stanley Livingston.",
    kontribusi:
      "Akselerator melingkar ini membuka cara baru untuk menyelidiki inti atom dan mendorong perkembangan fisika energi tinggi.",
    catatan:
      "Koordinat pin menunjuk kawasan kampus Berkeley secara umum, bukan lokasi laboratorium pertama yang presisi.",
    sumber: [
      {
        label: "Berkeley Lab History — The 1930s",
        url: "https://history.lbl.gov/1930s/",
      },
      {
        label: "Lawrence Berkeley National Laboratory — Ernest Orlando Lawrence",
        url: "https://www.lbl.gov/people/excellence/nobelists/e-o-lawrence/",
      },
    ],
  },
  {
    id: "osaka-yukawa",
    tahun: "1934",
    urutan: 13,
    kota: "Osaka",
    negara: "Jepang",
    lintang: 34.6937,
    bujur: 135.5023,
    tokoh: "Hideki Yukawa",
    judul: "Teori meson dikembangkan",
    cabang: "Fisika Modern",
    simbol: "π",
    aksen: "violet",
    ringkasan:
      "Di Osaka Imperial University, Yukawa mengembangkan teori yang memprediksi partikel pembawa gaya nuklir.",
    cerita:
      "Hideki Yukawa bekerja di Osaka Imperial University pada 1933–1939. Pada 1934 ia mengumumkan gagasan meson sebagai partikel yang berkaitan dengan interaksi nuklir; paper awalnya kemudian menjadi landasan bagi teori gaya nuklir yang membawanya pada Nobel Fisika 1949.",
    kontribusi:
      "Teori Yukawa memberi model untuk memahami bagaimana interaksi nuklir dapat mengikat proton dan neutron di dalam inti atom.",
    catatan:
      "Koordinat pin merupakan pusat kota Osaka; kegiatan riset Yukawa berlangsung di lingkungan Osaka Imperial University.",
    sumber: [
      {
        label: "The University of Osaka — About Hideki Yukawa",
        url: "https://www-yukawa.phys.sci.osaka-u.ac.jp/en/yukawahideki",
      },
      {
        label: "The University of Osaka — Yukawa Theory and Osaka University",
        url: "https://www-yukawa.phys.sci.osaka-u.ac.jp/en/university",
      },
    ],
  },
];
