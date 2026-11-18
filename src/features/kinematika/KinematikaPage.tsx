import GerakDuaDimensiSimulasi from "./gerak-dua-dimensi/GerakDuaDimensiSimulasi";
import GerakLurusSimulasi from "./gerak-lurus/GerakLurusSimulasi";
import GerakVertikalSimulasi from "./gerak-vertikal/GerakVertikalSimulasi";
import type { ModulKinematikaId } from "../../config/konfigurasiNavigasi";

/** Pengarah menu Kinematika; logika simulasi berada di komponen masing-masing. */
export default function KinematikaPage({ modulAktif }: { modulAktif: ModulKinematikaId }) {
  switch (modulAktif) {
    case "glb":
      return <GerakLurusSimulasi key="glb" initialMode="glb" />;
    case "glbb":
      return <GerakLurusSimulasi key="glbb" initialMode="glbb" />;
    case "vertikal":
      return <GerakVertikalSimulasi key="gerak-vertikal" />;
    case "parabola":
      return <GerakDuaDimensiSimulasi key="parabola" />;

    default: {
      const modulTidakDikenal: never = modulAktif;
      return modulTidakDikenal;
    }
  }
}
