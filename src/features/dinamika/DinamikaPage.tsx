import HukumNewtonSimulasi from "./HukumNewtonSimulasi";
import SistemDinamikaSimulasi from "./SistemDinamikaSimulasi";
import DinamikaRotasiSimulasi from "./DinamikaRotasiSimulasi";
import type { ModulDinamikaId } from "../../config/konfigurasiNavigasi";
import "./Dinamika.css";

type Props = { modulAktif: ModulDinamikaId };

/** Pengarah Dinamika; pemilihan sub-menu dikendalikan oleh dropdown di sidebar. */
export default function DinamikaPage({ modulAktif }: Props) {
  return (
    <div className="dinamika-page">
      <section className="page-heading">
        <p className="eyebrow">SIMULASI FISIKA / DINAMIKA</p>
        <div className="page-title-row">
          <div>
            <h1>Modul Dinamika</h1>
            <p className="page-description">
              Pelajari hubungan gaya dan gerak translasi, penerapan Hukum Newton pada sistem katrol dan lift,
              serta gerak rotasi dan kesetimbangan benda tegar.
            </p>
          </div>
          <span className="module-status"><span /> MODUL AKTIF</span>
        </div>
      </section>

      <div className="dinamika-tab-panel" key={modulAktif}>
        {modulAktif === "newton" && <HukumNewtonSimulasi />}
        {modulAktif === "sistem" && <SistemDinamikaSimulasi />}
        {modulAktif === "rotasi" && <DinamikaRotasiSimulasi />}
      </div>
    </div>
  );
}
