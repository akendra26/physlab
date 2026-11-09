import type { CatatanLab } from "./dataStudiKasus";

type Props = {
  catatan: CatatanLab;
  onUbah: (perubahan: Partial<CatatanLab>) => void;
};

const BIDANG_CATATAN: {
  kunci: "hipotesis" | "dataPengamatan" | "kesimpulan";
  nomor: string;
  judul: string;
  petunjuk: string;
  placeholder: string;
}[] = [
  {
    kunci: "hipotesis",
    nomor: "01",
    judul: "Hipotesis",
    petunjuk: "Apa yang kamu perkirakan sebelum menjalankan simulasi?",
    placeholder: "Saya memperkirakan bahwa ... karena ...",
  },
  {
    kunci: "dataPengamatan",
    nomor: "02",
    judul: "Data & Pengamatan",
    petunjuk: "Catat parameter, hasil pengukuran, atau pola yang terlihat.",
    placeholder: "Parameter awal: ...\nHasil pengamatan: ...\nPola yang terlihat: ...",
  },
  {
    kunci: "kesimpulan",
    nomor: "03",
    judul: "Kesimpulan",
    petunjuk: "Hubungkan bukti yang kamu kumpulkan dengan hipotesis awal.",
    placeholder: "Berdasarkan hasil pengamatan, dapat disimpulkan bahwa ...",
  },
];

/** Buku catatan virtual dengan simpan otomatis melalui state halaman induk. */
export default function VirtualLabNotebook({ catatan, onUbah }: Props) {
  return (
    <aside className="lab-notebook-panel" aria-labelledby="lab-notebook-title">
      <div className="lab-panel-heading">
        <div>
          <p className="lab-eyebrow">DOKUMENTASI ILMIAH</p>
          <h2 id="lab-notebook-title">Buku Catatan Lab</h2>
        </div>
        <span className="lab-notebook-icon" aria-hidden="true">▤</span>
      </div>
      <div className="lab-notebook-status"><span className="notebook-save-dot" /> Tersimpan otomatis di perangkat ini</div>

      {BIDANG_CATATAN.map((bidang) => (
        <label className="lab-notebook-field" key={bidang.kunci}>
          <span className="lab-notebook-field-title">
            <span>{bidang.nomor}</span>
            <strong>{bidang.judul}</strong>
          </span>
          <small>{bidang.petunjuk}</small>
          <textarea
            value={catatan[bidang.kunci]}
            onChange={(event) => onUbah({ [bidang.kunci]: event.target.value })}
            placeholder={bidang.placeholder}
            rows={bidang.kunci === "dataPengamatan" ? 5 : 4}
          />
          <span className="lab-character-count">{catatan[bidang.kunci].length} karakter</span>
        </label>
      ))}

      <div className="lab-notebook-reminder">
        <span aria-hidden="true">✧</span>
        Catatan yang baik memuat bukti, satuan, dan alasan. Hindari hanya menyalin angka tanpa interpretasi.
      </div>
    </aside>
  );
}