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
