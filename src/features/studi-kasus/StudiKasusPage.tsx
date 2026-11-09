import { useEffect, useState } from "react";
import LabHub from "./LabHub";
import LabWorkspace from "./LabWorkspace";
import {
  DAFTAR_STUDI_KASUS,
  ambilCatatanKasus,
  bacaProgresLaboratorium,
  simpanProgresLaboratorium,
  type CatatanLab,
  type ProgresLaboratorium,
} from "./dataStudiKasus";
import "./StudiKasus.css";

function misiSudahLengkap(catatan: CatatanLab): boolean {
  return catatan.skenarioDibaca
    && catatan.hipotesis.trim().length >= 15
    && catatan.dataPengamatan.trim().length >= 15
    && catatan.analisisBenar
    && catatan.kesimpulan.trim().length >= 15;
}

/** Modul utama Laboratorium Virtual PBL/RBL dengan progres persisten di localStorage. */
export default function StudiKasusPage() {
  const [progres, setProgres] = useState<ProgresLaboratorium>(bacaProgresLaboratorium);
  const [kasusAktifId, setKasusAktifId] = useState<string | null>(null);

  useEffect(() => {
    simpanProgresLaboratorium(progres);
  }, [progres]);

  const kasusAktif = DAFTAR_STUDI_KASUS.find((kasus) => kasus.id === kasusAktifId) ?? null;

  function perbaruiCatatan(kasusId: string, perubahan: Partial<CatatanLab>) {
    setProgres((sebelumnya) => {
      const catatanLama = ambilCatatanKasus(sebelumnya, kasusId);
      return {
        ...sebelumnya,
        catatan: {
          ...sebelumnya.catatan,
          [kasusId]: { ...catatanLama, ...perubahan },
        },
      };
    });
  }

  function klaimReward(kasusId: string) {
    const kasus = DAFTAR_STUDI_KASUS.find((item) => item.id === kasusId);
    if (!kasus) return;

    setProgres((sebelumnya) => {
      if (sebelumnya.rewardDiklaim.includes(kasusId)) return sebelumnya;
      const catatan = ambilCatatanKasus(sebelumnya, kasusId);
      if (!misiSudahLengkap(catatan)) return sebelumnya;

      return {
        ...sebelumnya,
        researchPoints: sebelumnya.researchPoints + kasus.rewardRp,
        rewardDiklaim: [...sebelumnya.rewardDiklaim, kasusId],
        kasusSelesai: sebelumnya.kasusSelesai.includes(kasusId)
          ? sebelumnya.kasusSelesai
          : [...sebelumnya.kasusSelesai, kasusId],
      };
    });
  }

  if (!kasusAktif) {
    return <LabHub progres={progres} onPilihKasus={setKasusAktifId} />;
  }

  const catatanAktif = ambilCatatanKasus(progres, kasusAktif.id);

  return (
    <LabWorkspace
      key={kasusAktif.id}
      kasus={kasusAktif}
      catatan={catatanAktif}
      rewardSudahDiklaim={progres.rewardDiklaim.includes(kasusAktif.id)}
      onKembali={() => setKasusAktifId(null)}
      onUbahCatatan={(perubahan) => perbaruiCatatan(kasusAktif.id, perubahan)}
      onTandaiDibaca={() => perbaruiCatatan(kasusAktif.id, { skenarioDibaca: true })}
      onAnalisisBenar={() => perbaruiCatatan(kasusAktif.id, { analisisBenar: true })}
      onKlaimReward={() => klaimReward(kasusAktif.id)}
    />
  );
}