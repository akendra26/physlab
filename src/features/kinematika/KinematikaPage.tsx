import GerakDuaDimensiSimulasi from "./gerak-dua-dimensi/GerakDuaDimensiSimulasi";
import GerakLurusSimulasi from "./gerak-lurus/GerakLurusSimulasi";
import GerakVertikalSimulasi from "./gerak-vertikal/GerakVertikalSimulasi";
import GerakMelingkarSimulasi from "./gerak-melingkar/GerakMelingkarSimulasi";
import type { ModulKinematikaId } from "../../config/konfigurasiNavigasi";

/** Pengarah menu Kinematika; logika simulasi berada di komponen masing-masing. */
export default function KinematikaPage({ modulAktif }: { modulAktif: ModulKinematikaId }) {
  switch (modulAktif) {
    case "gerak-lurus":
      return <GerakLurusSimulasi key="gerak-lurus" />;
    case "gjb":
      return <GerakDuaDimensiSimulasi key="gjb" mode="freefall" />;
    case "vertikal":
      return <GerakVertikalSimulasi key="gerak-vertikal" />;
    case "parabola":
      return <GerakDuaDimensiSimulasi key="parabola" mode="projectile" />;
    case "gerak-melingkar":
      return <GerakMelingkarSimulasi key="gerak-melingkar" />;
    default: {
      const modulTidakDikenal: never = modulAktif;
      return modulTidakDikenal;
    }
  }
}
