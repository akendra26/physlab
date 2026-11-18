// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Pakai dataset PhysLAB yang sudah ada. Simpan file ini di folder trivia-kuis
// agar tiga import berikut tidak perlu diubah.
import { DAFTAR_FUN_FACT_MEKANIKA } from "./dataFunFactMekanika";
import { TITIK_SEJARAH_FISIKA } from "./dataPetaSejarah";
import { BANK_SOAL_FISIKA } from "./dataKuis";

const ARC_DEFINITIONS = [
  {
    id: 1,
    name: "The Kinematics Vanguard",
    subtitle: "Gerak Lurus · The First Coordinates",
    title: "Gerbang para pengamat gerak",
    mission:
      "Sebuah sinyal dari observatorium pertama terpecah menjadi sepuluh fragmen. Bedakan posisi, lintasan, kecepatan, dan percepatan untuk menyalakan kembali kompas bintang.",
    commander: "Astra, Cartographer of Motion",
    color: "#e9ad87",
    symbol: "⌁",
  },
  {
    id: 2,
    name: "The Dynamics Fortress",
    subtitle: "Hukum Newton · The Forcebound Citadel",
    title: "Benteng hukum gerak",
    mission:
      "Benteng dinamika hanya terbuka bagi penjelajah yang memahami interaksi. Telusuri inersia, resultan gaya, gravitasi, dan hubungan sebab-akibat di balik perubahan gerak.",
    commander: "Newton, Warden of the Citadel",
    color: "#e89973",
    symbol: "ΣF",
  },
  {
    id: 3,
    name: "The Orbital Arena",
    subtitle: "Gerak Parabola & GMB · Arcs and Orbits",
    title: "Arena lintasan dan orbit",
    mission:
      "Dua gerbang ruang angkasa menjaga lintasan proyektil dan gerak melingkar. Baca komponen kecepatan, titik puncak, serta arah percepatan agar wahana dapat melintasi arena.",
    commander: "Orion, Keeper of Orbits",
    color: "#a8b5ee",
    symbol: "◌",
  },
  {
    id: 4,
    name: "The Equilibrium Spire",
    subtitle: "Benda Tegar & Katrol · The Balance Engine",
    title: "Menara kesetimbangan",
    mission:
      "Menara mesin kehilangan keseimbangannya. Pulihkan sistem melalui tegangan tali, berat semu, lengan momen, dan syarat kesetimbangan translasi maupun rotasi.",
    commander: "Kepler, Navigator of Machines",
    color: "#9bd0c8",
    symbol: "⚖",
  },
  {
    id: 5,
    name: "The Final Singularity",
    subtitle: "Boss Chamber · Momentum & Mechanical Insight",
    title: "Singularitas terakhir",
    mission:
      "Boss Chamber menyimpan fragmen terakhir arsip mekanika. Satukan pemahaman momentum, impuls, pusat massa, dan intuisi dari fenomena sehari-hari untuk memulihkan seluruh jaringan bintang.",
    commander: "Lyra, Sentinel of the Final Archive",
    color: "#c6a8e8",
    symbol: "✧",
  },
];

// Pembagian kurikulum: setiap arc memuat tepat 10 soal dan seluruh 50 ID
// digunakan satu kali. Soal GJB (mek-11) ditempatkan bersama dinamika/gravitasi.
const ARC_QUESTION_IDS = {
  1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  2: [11, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  3: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  4: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  5: [31, 32, 33, 34, 35, 46, 47, 48, 49, 50],
};

const GATEWAYS = [
  {
    id: "codex",
    view: "codex",
    title: "Codex of Mechanics",
    desc: "Fun Fact Mekanika · Cosmic Tarot Data Deck",
    count: "15 FIELD NOTES",
    symbol: "✧",
    path: "M20 94 L58 38 L102 68 L148 25 L207 75",
    stars: [[20, 94], [58, 38], [102, 68], [148, 25], [207, 75]],
  },
  {
    id: "odyssey",
    view: "odyssey",
    title: "Atlas of Epochs",
    desc: "Globe sejarah fisika · Rotasi 360° dan arsip dunia",
    count: "13 WORLD ARCHIVES",
    symbol: "⌖",
    path: "M20 72 L66 104 L104 42 L151 80 L207 28",
    stars: [[20, 72], [66, 104], [104, 42], [151, 80], [207, 28]],
  },
  {
    id: "trials",
    view: "trials",
    title: "Trial Chambers",
    desc: "Kuis RPG · Lima narrative arcs, 50 soal",
    count: "5 CHAPTERS · 50 TRIALS",
    symbol: "⟡",
    path: "M18 98 L56 66 L95 80 L132 31 L171 60 L211 42",
    stars: [[18, 98], [56, 66], [95, 80], [132, 31], [171, 60], [211, 42]],
  },
];

const STYLE = [
  `.astral-archives{--aa-ink:#f4f0f4;--aa-muted:#a7a5bb;--aa-dim:#73748f;--aa-night:#080b1d;--aa-indigo:#111630;--aa-violet:#292349;--aa-orange:#e89973;--aa-line:rgba(211,207,245,.15);--aa-glass:rgba(16,20,47,.78);position:relative;isolation:isolate;min-height:760px;overflow:hidden;color:var(--aa-ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;border:1px solid rgba(217,208,255,.12);border-radius:28px;background:radial-gradient(ellipse at 50% 0%,rgba(83,72,142,.31),transparent 42%),radial-gradient(ellipse at 87% 78%,rgba(190,105,97,.12),transparent 32%),linear-gradient(145deg,#090d22 0%,#11142f 52%,#090d20 100%);box-shadow:0 30px 100px rgba(2,4,18,.34)}
.astral-archives *{box-sizing:border-box}.astral-archives button{font:inherit}.astral-archives button:focus-visible{outline:2px solid #e9b08f;outline-offset:4px}.aa-sky{position:absolute;inset:0;z-index:-1;overflow:hidden;pointer-events:none;background-image:radial-gradient(1px 1px at 12% 22%,rgba(255,255,255,.9) 50%,transparent 100%),radial-gradient(1px 1px at 71% 12%,rgba(215,225,255,.8) 50%,transparent 100%),radial-gradient(1.5px 1.5px at 83% 66%,rgba(255,217,191,.7) 50%,transparent 100%),radial-gradient(1px 1px at 36% 82%,rgba(255,255,255,.7) 50%,transparent 100%);background-size:220px 180px,270px 220px,310px 240px,190px 210px;opacity:.58}.aa-sky:before,.aa-sky:after{content:"";position:absolute;border-radius:50%;filter:blur(50px);opacity:.26}.aa-sky:before{width:360px;heig`,
  `ht:220px;left:8%;top:24%;background:#5b5cbb}.aa-sky:after{width:420px;height:240px;right:2%;bottom:0;background:#a55d75}.aa-grain{position:absolute;inset:0;z-index:-1;opacity:.09;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.36'/%3E%3C/svg%3E")}
.aa-topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:25px 30px 0}.aa-brand{display:flex;align-items:center;gap:11px;color:#f8f4f8;font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase}.aa-brand-mark{display:grid;place-items:center;width:31px;height:31px;border:1px solid rgba(232,153,115,.5);border-radius:50%;color:#e89973;box-shadow:0 0 22px rgba(232,153,115,.15);font-size:16px}.aa-top-actions{display:flex;align-items:center;gap:9px}.aa-ghost-button,.aa-back-button,.aa-detail-toggle{border:1px solid var(--aa-line);border-radius:999px;background:rgba(255,255,255,.035);color:#d8d6e7;padding:9px 14px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:background .2s,border-color .2s,color .2s}.aa-ghost-button:hover,.aa-back-button:hover,.aa-detail-toggle:hover{border-color:rgba(232,153,115,.55);background:rgba(232,153,115,.1);color:#fff}.aa-page-wrap{position:relative;z-index:1;max-width:1180px;`,
  `margin:0 auto;padding:46px 30px 58px}.aa-eyebrow{margin:0 0 12px;color:#d39d8a;font-size:10px;font-weight:800;letter-spacing:.24em;text-transform:uppercase}.aa-title{margin:0;color:#fbf7fa;font-family:Georgia,"Times New Roman",serif;font-size:clamp(34px,5vw,62px);font-weight:500;letter-spacing:-.045em;line-height:1.03}.aa-title em{color:#e9a07d;font-weight:400}.aa-lede{max-width:660px;margin:17px 0 0;color:#aaa9c0;font-size:14px;line-height:1.8}.aa-hub-intro{max-width:780px;margin:5px auto 36px;text-align:center}.aa-hub-intro .aa-title{font-size:clamp(38px,5vw,66px)}.aa-hub-intro .aa-lede{margin-left:auto;margin-right:auto}.aa-hub-overline{display:inline-flex;align-items:center;gap:9px;margin-bottom:16px;color:#b9bad2;font-size:10px;letter-spacing:.26em;text-transform:uppercase}.aa-hub-overline:before,.aa-hub-overline:after{content:"";width:30px;height:1px;background:linear-gradient(90deg,transparent,#e89973)}.aa-hub-overline:after{transform:scaleX(-1)}
.aa-gateways{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.aa-gateway{position:relative;display:flex;min-height:290px;flex-direction:column;align-items:stretch;overflow:hidden;padding:20px 20px 18px;border:1px solid rgba(203,199,240,.15);border-radius:22px;background:linear-gradient(150deg,rgba(30,34,72,.72),rgba(10,14,36,.82));color:inherit;text-align:left;cursor:pointer;box-shadow:inset 0 1px rgba(255,255,255,.045),0 12px 35px rgba(0,0,0,.16);transition:border-color .25s,background .25s}.aa-gateway:bef`,
  `ore{content:"";position:absolute;inset:auto -35% -50% 20%;height:170px;border-radius:50%;background:var(--gate-glow);filter:blur(55px);opacity:.14;transition:opacity .3s}.aa-gateway:hover{border-color:rgba(232,153,115,.55);background:linear-gradient(150deg,rgba(41,43,88,.84),rgba(12,16,40,.9))}.aa-gateway:hover:before{opacity:.34}.aa-gateway-art{position:relative;display:grid;place-items:center;height:150px;margin:0 0 15px;border-radius:14px;background:radial-gradient(ellipse,rgba(104,107,176,.14),transparent 68%)}.aa-gateway-art svg{width:100%;max-width:260px;height:145px;overflow:visible}.aa-gateway-tag{position:absolute;top:14px;left:14px;color:#8b8cae;font-size:9px;letter-spacing:.18em}.aa-gateway-symbol{position:absolute;right:17px;bottom:10px;color:rgba(244,226,222,.45);font-family:Georgia,serif;font-size:28px}.aa-gateway h3{position:relative;margin:0 0 7px;color:#f2edf5;font-family:Georgia,serif;font-size:22px;font-weight:500}.aa-gateway p{position:relative;margin:0;color:#a4a4bd;font-size:12px;line-height:1.6}.aa-gateway-foot{position:relative;display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:18px;color:#d59d85;font-size:9px;letter-spacing:.17em}.aa-gateway-arrow{font-size:17px;transition:transform .2s}.aa-gateway:hover .aa-gateway-arrow{transform:translate(3px,-2px)}.aa-hub-footer{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:25px;color:#787b9c;font-size:9px;letter-spacing:.2em;text-transform:upperc`,
  `ase}.aa-hub-footer span{width:4px;height:4px;border-radius:50%;background:#e89973;box-shadow:0 0 10px #e89973}
.aa-subhead{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:27px}.aa-subhead-copy{max-width:780px}.aa-back-button{display:inline-flex;align-items:center;gap:8px;flex:0 0 auto}.aa-section-kicker{margin:0 0 9px;color:#d3a18e;font-size:10px;letter-spacing:.21em;text-transform:uppercase}.aa-section-title{margin:0;color:#f6f0f5;font-family:Georgia,serif;font-size:clamp(30px,4vw,46px);font-weight:500;letter-spacing:-.035em}.aa-section-desc{margin:10px 0 0;color:#aaa9c0;font-size:13px;line-height:1.7}
/* Codex book */
.aa-book-stage{position:relative;max-width:1000px;margin:0 auto;padding:22px 16px 16px;border:1px solid rgba(207,197,223,.14);border-radius:24px;background:radial-gradient(ellipse at 50% 10%,rgba(198,153,123,.12),transparent 65%),linear-gradient(145deg,rgba(22,25,55,.72),rgba(10,13,32,.86));box-shadow:0 22px 65px rgba(0,0,0,.23)}.aa-book{position:relative;display:grid;grid-template-columns:1fr 1fr;min-height:440px;perspective:1800px;border-radius:12px;background:#d8c8ae;box-shadow:0 20px 45px rgba(0,0,0,.38)}.aa-book:before{content:"";position:absolute;z-index:4;top:0;bottom:0;left:50%;width:30px;transform:translateX(-50%);background:linear-gradient(90deg,rgba(41,28,24,.18),rgba(60,43,34,.42) 48%,rgba(255,255,255,.15) 56%,rgba(47,32,26,.18));pointer-events:none}.aa-book-left,.aa-book-right{position:relative;min-width:0;pa`,
  `dding:30px 34px;color:#40352f;background:linear-gradient(105deg,#e9ddc9,#d9c8b2 95%);overflow:hidden}.aa-book-left{border-radius:12px 0 0 12px;background:linear-gradient(90deg,#d6c5ae,#e7d9c5 20%,#e9ddc9)}.aa-book-left:after{content:"";position:absolute;top:0;right:0;width:22px;height:100%;background:linear-gradient(90deg,transparent,rgba(73,51,39,.11))}.aa-book-right{border-radius:0 12px 12px 0;background:linear-gradient(270deg,#e7d7c2,#f0e5d2 18%,#e9ddc9);box-shadow:inset 12px 0 20px -20px rgba(38,24,18,.8)}.aa-book-topline{display:flex;justify-content:space-between;gap:10px;color:#887766;font-size:8px;letter-spacing:.16em;text-transform:uppercase}.aa-book-mark{display:grid;place-items:center;width:92px;height:92px;margin:40px auto 25px;border:1px solid rgba(111,83,66,.42);border-radius:50%;color:#9a6855;font-family:Georgia,serif;font-size:34px;box-shadow:0 0 0 8px rgba(143,103,76,.07),0 0 0 16px rgba(143,103,76,.04)}.aa-book-left h3{margin:0;color:#44352e;font-family:Georgia,serif;font-size:25px;font-weight:500;line-height:1.15;text-align:center}.aa-book-author{margin:11px 0 0;color:#9a735f;font-size:10px;letter-spacing:.16em;text-align:center;text-transform:uppercase}.aa-book-quote{max-width:250px;margin:35px auto 0;color:#766052;font-family:Georgia,serif;font-size:13px;font-style:italic;line-height:1.7;text-align:center}.aa-book-quote:before{content:"“";display:block;color:#b17d65;font-size:34px;line-height:.7}.aa-book-right{display:flex;flex-direction:column}.aa-book-fl`,
  `ip{position:absolute;z-index:3;top:0;right:0;bottom:0;left:50%;transform-style:preserve-3d;transform-origin:left center;backface-visibility:hidden}.aa-book-page-content{position:relative;display:flex;height:100%;min-height:440px;flex-direction:column;padding:30px 34px;color:#44362f;background:linear-gradient(270deg,#e7d7c2,#f0e5d2 18%,#e9ddc9);border-radius:0 12px 12px 0;backface-visibility:hidden;box-shadow:inset 12px 0 20px -20px rgba(38,24,18,.8)}.aa-book-page-content:after{content:"";position:absolute;top:0;bottom:0;left:0;width:20px;background:linear-gradient(90deg,rgba(70,49,37,.12),transparent)}.aa-book-tag{align-self:flex-start;padding:6px 9px;border:1px solid rgba(151,104,77,.34);border-radius:4px;color:#956b58;font-size:8px;letter-spacing:.16em;text-transform:uppercase}.aa-book-page-content h3{position:relative;margin:25px 0 14px;color:#43342d;font-family:Georgia,serif;font-size:clamp(19px,2.5vw,28px);font-weight:500;line-height:1.15}.aa-book-fact{margin:0;color:#65554a;font-family:Georgia,serif;font-size:13px;line-height:1.8}.aa-book-concept{margin-top:auto;padding:13px 14px;border-left:2px solid #bd896e;background:rgba(155,112,83,.09)}.aa-book-concept strong,.aa-book-reflection strong{display:block;margin-bottom:5px;color:#9a6d59;font-size:8px;letter-spacing:.15em;text-transform:uppercase}.aa-book-concept p,.aa-book-reflection p{margin:0;color:#645247;font-size:11px;line-height:1.65}.aa-book-reflection{margin-top:13px}.aa-book-footer{display:flex;justify-content:s`,
  `pace-between;margin-top:18px;padding-top:10px;border-top:1px solid rgba(92,67,50,.18);color:#8a7667;font-size:8px;letter-spacing:.12em;text-transform:uppercase}.aa-book-controls{display:flex;align-items:center;justify-content:space-between;gap:15px;margin:18px 4px 0}.aa-button{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:40px;padding:10px 16px;border:1px solid rgba(216,204,239,.17);border-radius:999px;background:rgba(255,255,255,.045);color:#e9e6f1;font-size:11px;cursor:pointer;transition:all .2s}.aa-button:hover:not(:disabled){border-color:rgba(232,153,115,.6);background:rgba(232,153,115,.12)}.aa-button:disabled{opacity:.35;cursor:not-allowed}.aa-button-primary{border-color:rgba(232,153,115,.58);background:linear-gradient(135deg,#c77e67,#e89973);color:#221a25;font-weight:800;box-shadow:0 7px 22px rgba(232,153,115,.14)}.aa-button-primary:hover:not(:disabled){background:linear-gradient(135deg,#e89973,#f0b18e);color:#1a1420}.aa-book-progress{flex:1;max-width:230px}.aa-progress-track{height:4px;overflow:hidden;border-radius:99px;background:rgba(255,255,255,.1)}.aa-progress-track span{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#9d8bd0,#e89973)}.aa-book-progress small{display:block;margin-top:7px;color:#9d9bb4;font-size:9px;text-align:center}
/* Odyssey astrolabe */
.aa-odyssey-panel{overflow:hidden;border:1px solid rgba(204,197,234,.15);border-radius:24px;background:linear-gradient(145deg,rgba(18,23,54,.83),rg`,
  `ba(9,14,35,.91));box-shadow:0 22px 65px rgba(0,0,0,.22)}.aa-odyssey-toolbar{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:17px 20px;border-bottom:1px solid var(--aa-line)}.aa-coordinate{color:#9092b0;font:9px ui-monospace,SFMono-Regular,monospace;letter-spacing:.1em}.aa-map-viewport{position:relative;height:500px;overflow:hidden;cursor:grab;touch-action:pan-y;background:radial-gradient(ellipse at 50% 45%,rgba(100,92,162,.19),transparent 55%),linear-gradient(180deg,rgba(5,10,29,.32),rgba(18,20,51,.25))}.aa-map-viewport:active{cursor:grabbing}.aa-map-world{position:absolute;top:0;left:0;width:1120px;height:560px;transform-origin:top left;will-change:transform}.aa-map-world svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}.aa-map-point{position:absolute;z-index:2;display:grid;place-items:center;width:40px;height:40px;padding:0;transform:translate(-50%,-50%);border:1px solid rgba(232,153,115,.52);border-radius:50%;background:rgba(15,19,47,.85);color:#f2c09f;cursor:pointer;box-shadow:0 0 0 7px rgba(232,153,115,.055),0 0 25px rgba(232,153,115,.18);transition:all .2s}.aa-map-point:hover,.aa-map-point.is-selected{border-color:#ffd0ad;background:#4a3048;box-shadow:0 0 0 9px rgba(232,153,115,.1),0 0 32px rgba(232,153,115,.4)}.aa-map-point span{font-size:12px}.aa-map-label{position:absolute;z-index:2;min-width:120px;transform:translate(18px,-50%);pointer-events:none}.aa-map-label strong{display:block;color:#f1eaf2;font-family:Georgia`,
  `,serif;font-size:13px;font-weight:500}.aa-map-label small{color:#a5a3bd;font-size:9px;letter-spacing:.09em}.aa-map-center-label{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:rgba(220,207,235,.18);font-family:Georgia,serif;font-size:25px;letter-spacing:.3em;pointer-events:none}.aa-archive-detail{display:grid;grid-template-columns:1.1fr 1.9fr;gap:20px;padding:20px;border-top:1px solid var(--aa-line);background:rgba(7,11,30,.55)}.aa-detail-year{color:#e6a17e;font:11px ui-monospace,monospace;letter-spacing:.14em}.aa-archive-detail h3{margin:8px 0;color:#f4eef5;font-family:Georgia,serif;font-size:22px;font-weight:500}.aa-archive-detail p{margin:0;color:#aaa9c0;font-size:12px;line-height:1.75}.aa-detail-meta{margin-top:9px;color:#8588a8;font-size:10px;letter-spacing:.08em}.aa-archive-detail-hidden{grid-template-columns:1fr}.aa-archive-detail-hidden p{max-width:650px}
/* Trial chambers */
.aa-trial-shell{border:1px solid rgba(204,197,234,.15);border-radius:24px;background:linear-gradient(145deg,rgba(18,23,54,.84),rgba(9,14,35,.92));box-shadow:0 22px 65px rgba(0,0,0,.22);overflow:hidden}.aa-trial-intro{padding:22px 24px;border-bottom:1px solid var(--aa-line)}.aa-trial-intro h3{margin:0;color:#f4eef5;font-family:Georgia,serif;font-size:22px;font-weight:500}.aa-trial-intro p{max-width:700px;margin:8px 0 0;color:#a6a5bd;font-size:12px;line-height:1.7}.aa-arc-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;padding:20px}.aa-arc-card{displ`,
  `ay:flex;min-height:180px;flex-direction:column;align-items:flex-start;padding:16px 14px;border:1px solid rgba(205,198,236,.14);border-radius:16px;background:linear-gradient(150deg,rgba(38,42,83,.7),rgba(12,17,41,.86));color:#f3eff8;text-align:left;cursor:pointer;transition:all .2s}.aa-arc-card:hover{transform:translateY(-4px);border-color:rgba(232,153,115,.55);background:rgba(46,43,81,.83)}.aa-arc-index{display:grid;place-items:center;width:33px;height:33px;margin-bottom:14px;border:1px solid color-mix(in srgb,var(--arc-color),transparent 45%);border-radius:50%;color:var(--arc-color);font-family:Georgia,serif}.aa-arc-card strong{font-family:Georgia,serif;font-size:14px;font-weight:500;line-height:1.25}.aa-arc-card small{margin-top:7px;color:#9d9bb4;font-size:9px;line-height:1.5}.aa-arc-state{margin-top:auto;padding-top:12px;color:#c89b87;font-size:8px;letter-spacing:.14em;text-transform:uppercase}.aa-prologue{display:grid;grid-template-columns:190px 1fr;gap:24px;padding:28px}.aa-prologue-emblem{display:grid;place-items:center;min-height:190px;border:1px solid rgba(232,153,115,.22);border-radius:18px;background:radial-gradient(circle,rgba(232,153,115,.17),transparent 65%),rgba(255,255,255,.025);color:var(--arc-color);font-family:Georgia,serif;font-size:55px}.aa-prologue h3{margin:4px 0 6px;color:#f7f0f4;font-family:Georgia,serif;font-size:29px;font-weight:500}.aa-prologue-sub{color:var(--arc-color);font-size:9px;letter-spacing:.2em;text-transform:uppercase}.aa-prologue p{max-w`,
  `idth:680px;color:#b0aec3;font-size:13px;line-height:1.8}.aa-commander{display:inline-flex;align-items:center;gap:8px;color:#d4b09b;font-size:10px}.aa-commander:before{content:"";width:5px;height:5px;border-radius:50%;background:var(--arc-color);box-shadow:0 0 10px var(--arc-color)}.aa-trial-controls{display:flex;align-items:center;gap:16px;margin-top:21px}.aa-trial-status{padding:20px 24px 14px;border-bottom:1px solid var(--aa-line)}.aa-status-row{display:flex;justify-content:space-between;align-items:center;gap:12px;color:#a8a7be;font-size:10px;letter-spacing:.1em;text-transform:uppercase}.aa-shields{display:flex;gap:6px}.aa-shield{width:22px;height:6px;border-radius:99px;background:rgba(255,255,255,.13);box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}.aa-shield.is-alive{background:linear-gradient(90deg,#d18d76,#f1bd94);box-shadow:0 0 12px rgba(232,153,115,.2)}.aa-trial-progress{height:4px;margin-top:14px;overflow:hidden;border-radius:99px;background:rgba(255,255,255,.09)}.aa-trial-progress span{display:block;height:100%;background:linear-gradient(90deg,#9186ce,#e89973);transition:width .3s}.aa-question-area{padding:25px 24px 26px}.aa-question-top{display:flex;justify-content:space-between;gap:12px;color:#9796b0;font-size:9px;letter-spacing:.16em;text-transform:uppercase}.aa-question-area h3{max-width:860px;margin:18px 0 22px;color:#f6f0f4;font-family:Georgia,serif;font-size:clamp(22px,3vw,31px);font-weight:500;line-height:1.28}.aa-options{display:grid;grid-template-columns`,
  `:1fr 1fr;gap:11px}.aa-option{display:flex;align-items:center;gap:12px;min-height:66px;padding:12px 14px;border:1px solid rgba(202,198,232,.14);border-radius:13px;background:rgba(255,255,255,.035);color:#d8d7e7;text-align:left;cursor:pointer;transition:all .18s}.aa-option:hover:not(:disabled){border-color:rgba(232,153,115,.55);background:rgba(232,153,115,.07)}.aa-option:disabled{cursor:default}.aa-option-letter{display:grid;place-items:center;flex:0 0 27px;width:27px;height:27px;border:1px solid rgba(211,206,239,.2);border-radius:8px;color:#c7b7c8;font-size:10px}.aa-option.is-correct{border-color:rgba(130,205,174,.56);background:rgba(77,152,125,.13);color:#e1f4e9}.aa-option.is-wrong{border-color:rgba(232,133,127,.55);background:rgba(179,85,92,.12);color:#f5dfdf}.aa-option.is-muted{opacity:.45}.aa-feedback{margin-top:17px;padding:15px 17px;border:1px solid rgba(232,153,115,.23);border-radius:13px;background:rgba(232,153,115,.065)}.aa-feedback strong{display:block;margin-bottom:6px;color:#e9ae90;font-size:11px;letter-spacing:.08em}.aa-feedback p{margin:0;color:#bfbdcf;font-size:12px;line-height:1.75}.aa-question-footer{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-top:20px}.aa-live-score{color:#a9a7bd;font-size:10px;letter-spacing:.08em}.aa-live-score strong{margin-left:7px;color:#f2c09f;font-size:17px}.aa-result{padding:35px 28px;text-align:center}.aa-result-emblem{display:grid;place-items:center;width:78px;height:78px;margin:0 auto 18px;border:1`,
  `px solid rgba(232,153,115,.38);border-radius:50%;background:radial-gradient(circle,rgba(232,153,115,.2),transparent 72%);color:#e9a27f;font-family:Georgia,serif;font-size:29px}.aa-result h3{margin:0;color:#f6eff5;font-family:Georgia,serif;font-size:32px;font-weight:500}.aa-result p{max-width:630px;margin:12px auto;color:#aaa9c0;font-size:13px;line-height:1.75}.aa-result-score{margin:20px 0;color:#f0ae8d;font-family:Georgia,serif;font-size:55px}.aa-result-score small{color:#9e9bb4;font-family:inherit;font-size:16px}.aa-result-actions{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-top:23px}
@media(max-width:900px){.aa-gateways{grid-template-columns:1fr 1fr}.aa-arc-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.aa-book{min-height:410px}.aa-book-left,.aa-book-page-content{padding:24px}.aa-book-page-content{min-height:410px}.aa-map-viewport{height:440px}}
@media(max-width:640px){.astral-archives{min-height:700px;border-radius:20px}.aa-topbar{padding:17px 16px 0}.aa-brand{font-size:10px}.aa-page-wrap{padding:34px 15px 35px}.aa-subhead{align-items:flex-start;flex-direction:column}.aa-back-button{order:-1}.aa-gateways{grid-template-columns:1fr;gap:12px}.aa-gateway{min-height:230px}.aa-gateway-art{height:125px}.aa-book{grid-template-columns:1fr;min-height:unset}.aa-book:before{display:none}.aa-book-left{display:none}.aa-book-flip{position:relative;left:0;min-height:420px}.aa-book-page-content{min-height:420px;border-radius:12px}.aa-book-controls{flex-wrap:wrap`,
  `}.aa-book-progress{order:3;flex-basis:100%;max-width:none}.aa-book-controls .aa-button{flex:1}.aa-odyssey-toolbar{align-items:flex-start;flex-direction:column}.aa-map-viewport{height:380px}.aa-map-world{transform-origin:top left;scale:.82}.aa-archive-detail{grid-template-columns:1fr}.aa-arc-grid{grid-template-columns:1fr 1fr;padding:14px}.aa-arc-card{min-height:155px}.aa-prologue{grid-template-columns:1fr;padding:18px}.aa-prologue-emblem{min-height:110px;font-size:43px}.aa-trial-status{padding:17px}.aa-question-area{padding:19px 16px}.aa-options{grid-template-columns:1fr}.aa-question-footer{align-items:flex-start;flex-direction:column}.aa-question-footer .aa-button{width:100%}.aa-top-actions .aa-ghost-button{padding:8px 10px;font-size:9px}}
@media(prefers-reduced-motion:reduce){.astral-archives *{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important}}`,

].join("") + `
/* ASTRAL ARCHIVES / SELECT HERO + COSMIC DECK + 360 GLOBE */
.aa-select-screen{position:relative;max-width:1080px;margin:0 auto;padding:0 58px 10px;perspective:1500px}
.aa-carousel-stage{position:relative;height:430px;overflow:visible;transform-style:preserve-3d}
.aa-carousel-card{position:absolute;top:7px;left:0;right:0;width:min(350px,72vw);height:372px;min-height:372px;margin:auto;padding:20px 22px 18px;transform-style:preserve-3d;backface-visibility:hidden;box-shadow:0 24px 70px rgba(0,0,0,.34),inset 0 1px rgba(255,255,255,.08)}
.aa-carousel-card.is-active{border-color:rgba(232,153,115,.55);box-shadow:0 0 0 1px rgba(232,153,115,.12),0 26px 90px rgba(3,5,20,.48),0 0 55px rgba(139,126,202,.13),inset 0 1px rgba(255,255,255,.1)}
.aa-carousel-card.is-side{cursor:pointer;filter:saturate(.78)}
.aa-carousel-card .aa-gateway-art{height:174px;margin-bottom:13px}
.aa-carousel-card .aa-gateway-art svg{height:165px}
.aa-carousel-card h3{font-size:25px}
.aa-carousel-card p{font-size:12px}
.aa-carousel-arrow{position:absolute;z-index:8;top:43%;display:grid;place-items:center;width:46px;height:46px;border:1px solid rgba(221,211,255,.18);border-radius:50%;background:rgba(13,18,45,.82);color:#f0c09e;font:32px Georgia,serif;line-height:1;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.22);backdrop-filter:blur(14px);transition:transform .2s,border-color .2s,background .2s}
.aa-carousel-arrow:hover{transform:scale(1.08);border-color:rgba(232,153,115,.65);background:rgba(47,37,72,.9)}
.aa-carousel-prev{left:0}.aa-carousel-next{right:0}
.aa-carousel-indicators{display:flex;justify-content:center;gap:9px;margin-top:-8px}
.aa-carousel-indicators button{width:7px;height:7px;padding:0;border:0;border-radius:50%;background:rgba(188,184,225,.32);cursor:pointer;transition:width .25s,background .25s,box-shadow .25s}
.aa-carousel-indicators button.is-active{width:28px;border-radius:99px;background:#e89973;box-shadow:0 0 14px rgba(232,153,115,.42)}
.aa-active-caption{display:flex;flex-direction:column;align-items:center;gap:5px;margin:7px 0 0;color:#8586a6;text-align:center}
.aa-active-caption span{font-size:8px;letter-spacing:.22em}.aa-active-caption strong{color:#f0c3a4;font:500 19px Georgia,serif}.aa-active-caption small{color:#8e90ad;font-size:10px}
/* Cosmic tarot deck */
.aa-tarot-stage{position:relative;display:flex;min-height:710px;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;padding:25px 14px 20px;border:1px solid rgba(197,190,238,.14);border-radius:26px;background:radial-gradient(ellipse at 50% 37%,rgba(105,86,166,.22),transparent 46%),radial-gradient(ellipse at 50% 100%,rgba(210,126,104,.09),transparent 42%),linear-gradient(145deg,rgba(17,21,52,.78),rgba(7,11,31,.88));box-shadow:0 24px 75px rgba(0,0,0,.24)}
.aa-tarot-stage:before{content:"";position:absolute;inset:0;opacity:.2;pointer-events:none;background-image:radial-gradient(1px 1px at 17% 20%,#fff 50%,transparent 100%),radial-gradient(1px 1px at 77% 29%,#f2c6a9 50%,transparent 100%),radial-gradient(1px 1px at 31% 78%,#b8b9ff 50%,transparent 100%);background-size:140px 130px,190px 170px,230px 200px}
.aa-gear{position:absolute;z-index:0;color:rgba(174,166,218,.12);font-size:190px;line-height:1;pointer-events:none;animation:aa-gear-turn 80s linear infinite}
.gear-one{top:8%;left:5%}.gear-two{right:4%;bottom:12%;font-size:145px;animation-direction:reverse}
@keyframes aa-gear-turn{to{transform:rotate(360deg)}}
.aa-deck-orbit{position:absolute;z-index:0;width:min(660px,85vw);height:210px;border:1px solid rgba(176,167,223,.11);border-radius:50%;transform:rotate(-18deg);pointer-events:none}
.aa-deck-orbit.orbit-two{width:min(750px,94vw);height:290px;transform:rotate(23deg);border-color:rgba(232,153,115,.08)}
.aa-tarot-stack{position:relative;z-index:1;width:min(470px,92vw);height:535px;perspective:1500px}
.aa-tarot-under{position:absolute;inset:0 22px;border:1px solid rgba(217,184,226,.26);border-radius:20px;background:linear-gradient(145deg,#26264d,#101831 58%,#261b3a);box-shadow:0 22px 55px rgba(0,0,0,.35)}
.aa-tarot-under:after{content:"✧";position:absolute;inset:0;display:grid;place-items:center;color:rgba(232,153,115,.27);font:90px Georgia,serif;border:1px solid rgba(232,153,115,.12);border-radius:16px;inset:9px}
.aa-tarot-under-two{inset:0 35px;background:linear-gradient(145deg,#34305e,#0d1934 62%,#35243c)}
.aa-tarot-card{position:absolute;inset:0;overflow:visible;border:1px solid rgba(233,180,150,.52);border-radius:21px;background:linear-gradient(145deg,rgba(37,41,83,.97),rgba(11,17,43,.985) 55%,rgba(41,29,59,.97));box-shadow:0 25px 80px rgba(0,0,0,.52),0 0 42px rgba(185,127,155,.1),inset 0 1px rgba(255,255,255,.12);cursor:grab;touch-action:pan-y}
.aa-tarot-card:active{cursor:grabbing}
.aa-tarot-frame{position:relative;display:flex;min-height:535px;height:100%;flex-direction:column;overflow:hidden;margin:8px;padding:18px 23px 15px;border:1px solid rgba(228,185,163,.28);border-radius:15px;background:radial-gradient(circle at 50% 24%,rgba(134,112,185,.18),transparent 34%),linear-gradient(155deg,rgba(255,255,255,.025),transparent 46%)}
.aa-tarot-frame:before,.aa-tarot-frame:after{content:"✧";position:absolute;color:rgba(231,179,153,.28);font:21px Georgia,serif}
.aa-tarot-frame:before{top:9px;left:12px}.aa-tarot-frame:after{right:12px;bottom:9px}
.aa-tarot-topline{display:flex;justify-content:space-between;gap:12px;color:#a6a4c1;font-size:8px;letter-spacing:.17em}
.aa-tarot-category{display:flex;align-items:center;justify-content:center;gap:9px;margin-top:16px;color:#e2ad91;font-size:9px;letter-spacing:.2em;text-transform:uppercase}
.aa-tarot-category i{width:3px;height:3px;border-radius:50%;background:#e89973;box-shadow:0 0 8px #e89973}
.aa-tarot-sigil-wrap{position:relative;display:grid;place-items:center;width:144px;height:144px;margin:18px auto 12px}
.aa-tarot-sigil{position:relative;z-index:2;display:grid;place-items:center;width:76px;height:76px;border:1px solid rgba(233,179,145,.62);border-radius:50%;background:radial-gradient(circle,rgba(227,158,130,.17),rgba(77,70,126,.08) 65%,transparent);color:#f2c3a1;font:34px Georgia,serif;text-shadow:0 0 22px rgba(232,153,115,.6);box-shadow:0 0 0 9px rgba(205,161,179,.045),0 0 32px rgba(232,153,115,.15)}
.aa-tarot-sigil-orbit{position:absolute;border:1px solid rgba(180,174,222,.26);border-radius:50%;inset:4px;transform:rotate(-28deg) scaleY(.55)}
.aa-tarot-sigil-orbit.orbit-b{inset:17px -5px;transform:rotate(48deg) scaleY(.5);border-color:rgba(232,153,115,.34)}
.aa-tarot-star{position:absolute;color:#f2c7a9;text-shadow:0 0 15px #e89973}.star-top{top:0;right:12px}.star-bottom{bottom:6px;left:12px}
.aa-tarot-arc-label{margin:0 0 7px;color:#aaa6c9;font-size:8px;letter-spacing:.25em;text-align:center}
.aa-tarot-card h3{max-width:370px;margin:0 auto;color:#faf1f0;font:500 clamp(19px,2.3vw,25px)/1.14 Georgia,serif;text-align:center;text-wrap:balance}
.aa-tarot-author{margin:8px 0 0;color:#dcaa90;font-size:8px;letter-spacing:.16em;text-align:center}
.aa-tarot-divider{display:flex;align-items:center;justify-content:center;gap:10px;margin:11px 0;color:#e8af91;font-size:11px}.aa-tarot-divider span{width:55px;height:1px;background:linear-gradient(90deg,transparent,rgba(232,153,115,.5))}.aa-tarot-divider span:last-child{transform:rotate(180deg)}
.aa-tarot-fact{margin:0;color:#d2d0df;font:12px/1.57 Georgia,serif;text-align:center}
.aa-tarot-concept{margin-top:12px;padding:10px 12px;border:1px solid rgba(160,157,211,.17);border-radius:10px;background:rgba(131,129,185,.075)}
.aa-tarot-concept strong{display:block;margin-bottom:4px;color:#e5ae90;font-size:8px;letter-spacing:.15em}.aa-tarot-concept p{margin:0;color:#c1bfd3;font-size:10px;line-height:1.5}
.aa-tarot-reflection{margin-top:9px}.aa-tarot-reflection span{color:#9f9ac4;font-size:8px;letter-spacing:.14em}.aa-tarot-reflection p{margin:3px 0 0;color:#aaa9c2;font-size:9px;line-height:1.45}
.aa-tarot-bottomline{display:flex;justify-content:space-between;gap:12px;margin-top:auto;padding-top:12px;border-top:1px solid rgba(214,187,207,.16);color:#918eaf;font-size:7px;letter-spacing:.14em}
.aa-tarot-hint{position:relative;z-index:1;margin:17px 0 10px;color:#7f82a4;font-size:8px;letter-spacing:.23em}
.aa-tarot-controls{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:17px;width:min(620px,100%);margin-top:3px}
.aa-tarot-progress{flex:1;max-width:220px}.aa-tarot-progress small{display:block;margin-top:7px;color:#9d9bb4;font-size:9px;text-align:center}
.aa-tarot-source-row{position:relative;z-index:1;display:flex;align-items:center;gap:15px;margin-top:12px}.aa-tarot-source-row a{color:#e5aa8d;font-size:10px}
/* Atlas of Epochs / 360° globe */
.aa-globe-panel{overflow:hidden}.aa-globe-controls{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}
.aa-globe-stage{position:relative;display:grid;place-items:center;min-height:590px;overflow:hidden;cursor:grab;touch-action:pan-y;background:radial-gradient(ellipse at 50% 46%,rgba(81,96,159,.18),transparent 51%),linear-gradient(180deg,rgba(8,13,34,.18),rgba(12,16,44,.42))}
.aa-globe-stage:active{cursor:grabbing}.aa-globe-aura{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(104,124,207,.13),rgba(152,109,178,.06) 52%,transparent 71%);filter:blur(12px)}
.aa-globe-orbit{position:absolute;width:650px;height:220px;border:1px solid rgba(197,179,232,.16);border-radius:50%;transform:rotate(-20deg);pointer-events:none}.aa-globe-orbit-two{width:710px;height:290px;transform:rotate(25deg);border-color:rgba(232,153,115,.12)}
.aa-globe-shell{position:relative;width:min(540px,83vw);aspect-ratio:1;border-radius:50%;touch-action:pan-y;filter:drop-shadow(0 18px 44px rgba(0,0,0,.36));}
.aa-globe-shell:after{content:"";position:absolute;inset:2%;border-radius:50%;pointer-events:none;box-shadow:inset -34px -12px 55px rgba(1,5,22,.72),inset 17px 13px 38px rgba(173,175,235,.11),0 0 45px rgba(124,145,220,.14);z-index:2}
.aa-globe-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}.aa-globe-land polygon{transition:fill-opacity .2s}.aa-globe-point{position:absolute;z-index:3;display:grid;place-items:center;width:28px;height:28px;padding:0;border:1px solid rgba(255,202,166,.67);border-radius:50%;background:rgba(16,24,59,.9);color:#ffd1ae;box-shadow:0 0 0 5px rgba(232,153,115,.08),0 0 19px rgba(232,153,115,.35);transform:translate(-50%,-50%);cursor:pointer;transition:opacity .18s,scale .18s}
.aa-globe-point i{position:absolute;inset:-7px;border:1px solid rgba(232,153,115,.32);border-radius:50%;animation:aa-pin-pulse 2.4s ease-out infinite}.aa-globe-point span{font:11px Georgia,serif}.aa-globe-point small{position:absolute;top:27px;left:50%;padding:3px 6px;border:1px solid rgba(180,181,220,.14);border-radius:5px;background:rgba(9,14,37,.78);color:#d6d4e3;font-size:8px;white-space:nowrap;transform:translateX(-50%)}
.aa-globe-point.is-selected{background:#e89973;color:#211b30;scale:1.16;box-shadow:0 0 0 7px rgba(232,153,115,.13),0 0 27px rgba(232,153,115,.72)}
@keyframes aa-pin-pulse{0%{transform:scale(.75);opacity:.85}100%{transform:scale(1.65);opacity:0}}
.aa-globe-caption{position:absolute;bottom:25px;display:flex;align-items:center;gap:9px;color:#9393b4;font-size:8px;letter-spacing:.21em;pointer-events:none}.aa-globe-caption span:first-child{color:#e89973}
.aa-globe-archive-strip{display:flex;gap:8px;overflow-x:auto;padding:13px 18px;border-top:1px solid var(--aa-line);scrollbar-width:thin;scrollbar-color:rgba(180,163,216,.3) transparent}
.aa-globe-archive-strip button{display:flex;min-width:130px;flex-direction:column;gap:3px;padding:10px 12px;border:1px solid rgba(192,185,228,.14);border-radius:11px;background:rgba(255,255,255,.025);text-align:left;cursor:pointer;transition:all .2s}
.aa-globe-archive-strip button.is-selected{border-color:rgba(232,153,115,.5);background:rgba(232,153,115,.09)}.aa-globe-archive-strip span{color:#dba184;font:9px ui-monospace,monospace}.aa-globe-archive-strip strong{color:#eae6f1;font:14px Georgia,serif}.aa-globe-archive-strip small{color:#9291af;font-size:9px}
/* Trial Chambers cinematic prologue */
.aa-prologue-cinematic{position:relative;isolation:isolate;overflow:hidden;min-height:360px;grid-template-columns:220px 1fr;background:radial-gradient(ellipse at 13% 50%,color-mix(in srgb,var(--arc-color),transparent 83%),transparent 43%),linear-gradient(115deg,rgba(7,11,32,.98),rgba(24,25,60,.95) 52%,rgba(11,15,38,.98));box-shadow:0 24px 70px rgba(0,0,0,.32),inset 0 0 65px rgba(115,107,184,.07)}
.aa-prologue-cinematic:before{content:"";position:absolute;inset:0;z-index:-1;background:repeating-linear-gradient(90deg,transparent 0 12%,rgba(186,178,229,.035) 12.1% 12.3%,transparent 12.4% 24%),linear-gradient(90deg,rgba(3,6,22,.68),transparent 52%);pointer-events:none}
.aa-prologue-corridor{position:absolute;z-index:-1;inset:0 0 0 0;overflow:hidden;pointer-events:none;perspective:500px}
.aa-prologue-corridor:before{content:"";position:absolute;left:50%;top:-10%;width:54%;height:130%;transform:translateX(-50%) rotateX(8deg);border-left:1px solid color-mix(in srgb,var(--arc-color),transparent 58%);border-right:1px solid color-mix(in srgb,var(--arc-color),transparent 58%);background:linear-gradient(90deg,transparent, color-mix(in srgb,var(--arc-color),transparent 93%) 48%,transparent);filter:drop-shadow(0 0 18px var(--arc-color))}
.aa-prologue-corridor i{position:absolute;left:50%;top:50%;width:90%;height:1px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--arc-color),transparent 35%),transparent);transform:translate(-50%,-50%) rotate(calc(var(--beam-index,1)*1deg));box-shadow:0 0 15px var(--arc-color)}
.aa-prologue-corridor i:nth-child(1){top:24%;opacity:.38}.aa-prologue-corridor i:nth-child(2){top:76%;opacity:.28}.aa-prologue-corridor i:nth-child(3){top:13%;opacity:.2}.aa-prologue-corridor i:nth-child(4){top:88%;opacity:.2}
.aa-prologue-corridor span{position:absolute;left:50%;top:50%;width:180px;height:180px;border:1px solid color-mix(in srgb,var(--arc-color),transparent 55%);border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 45px color-mix(in srgb,var(--arc-color),transparent 75%),inset 0 0 35px color-mix(in srgb,var(--arc-color),transparent 88%);animation:aa-portal-breathe 4s ease-in-out infinite}
@keyframes aa-portal-breathe{50%{transform:translate(-50%,-50%) scale(1.09);opacity:.54}}
.aa-prologue-cinematic .aa-prologue-emblem{position:relative;z-index:1;display:flex;flex-direction:column;gap:13px;align-items:center;justify-content:center;min-height:260px;border-color:color-mix(in srgb,var(--arc-color),transparent 62%);background:radial-gradient(circle,color-mix(in srgb,var(--arc-color),transparent 83%),transparent 68%);color:var(--arc-color);text-shadow:0 0 28px var(--arc-color);font:clamp(54px,8vw,88px) Georgia,serif}
.aa-prologue-emblem small{color:#a6a2bf;font:8px ui-monospace,monospace;letter-spacing:.2em;text-shadow:none}
.aa-prologue-copy{position:relative;z-index:1}.aa-prologue-chapter-title{margin:-3px 0 11px!important;color:var(--arc-color)!important;font:italic 16px Georgia,serif!important}.aa-prologue-objective{display:flex;flex-direction:column;gap:5px;margin-top:17px;padding:12px 14px;border-left:2px solid var(--arc-color);background:rgba(255,255,255,.04)}.aa-prologue-objective span{color:#a39fbd;font-size:8px;letter-spacing:.18em}.aa-prologue-objective strong{color:#e6e1ed;font-size:11px;font-weight:500}
@media(max-width:900px){.aa-carousel-card{width:min(320px,68vw)}.aa-prologue-cinematic{grid-template-columns:170px 1fr}.aa-globe-stage{min-height:510px}}
@media(max-width:640px){.aa-select-screen{padding:0 35px}.aa-carousel-stage{height:375px}.aa-carousel-card{top:12px;width:min(285px,73vw);height:325px;min-height:325px;padding:15px}.aa-carousel-card .aa-gateway-art{height:140px}.aa-carousel-card .aa-gateway-art svg{height:135px}.aa-carousel-card h3{font-size:21px}.aa-carousel-arrow{width:36px;height:36px;font-size:25px}.aa-carousel-prev{left:-7px}.aa-carousel-next{right:-7px}.aa-active-caption{margin-top:3px}.aa-tarot-stage{min-height:670px;padding:20px 7px 16px}.aa-tarot-stack{height:535px;width:min(430px,96vw)}.aa-tarot-frame{margin:6px;padding:15px 16px 13px}.aa-tarot-sigil-wrap{width:125px;height:125px;margin:13px auto 9px}.aa-tarot-sigil{width:66px;height:66px}.aa-tarot-fact{font-size:11px}.aa-tarot-concept{margin-top:9px;padding:8px 10px}.aa-tarot-concept p{font-size:9px}.aa-tarot-reflection{margin-top:7px}.aa-tarot-controls{gap:7px;flex-wrap:wrap}.aa-tarot-controls .aa-button{flex:1;padding:9px 10px;font-size:9px}.aa-tarot-progress{order:3;flex-basis:100%;max-width:none}.aa-gear{font-size:115px}.gear-two{font-size:95px}.aa-globe-stage{min-height:420px}.aa-globe-shell{width:min(440px,91vw)}.aa-globe-orbit{width:470px;height:170px}.aa-globe-orbit-two{width:490px;height:210px}.aa-globe-caption{bottom:13px;font-size:7px}.aa-globe-controls{justify-content:flex-start}.aa-globe-controls .aa-detail-toggle{padding:7px 9px;font-size:8px}.aa-globe-archive-strip{padding:11px}.aa-prologue-cinematic{grid-template-columns:1fr;padding:15px}.aa-prologue-cinematic .aa-prologue-emblem{min-height:125px;font-size:48px}.aa-prologue-corridor span{width:120px;height:120px}.aa-prologue-objective strong{font-size:10px}}
@media(prefers-reduced-motion:reduce){.aa-gear,.aa-prologue-corridor span,.aa-globe-point i{animation:none!important}}
`;

function formatArchiveYear(value) {
  return String(value ?? "—").replaceAll("–", "–");
}

function getQuestionNumber(question) {
  const match = String(question?.id ?? "").match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function StarGlyph({ gateway, active }) {
  return (
    <svg viewBox="0 0 230 135" role="img" aria-label={`Rasi bintang ${gateway.title}`}>
      <defs>
        <filter id={`aa-glow-${gateway.id}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <motion.path
        d={gateway.path}
        fill="none"
        stroke={active ? "#ffd0ad" : "#a9acd9"}
        strokeWidth="1.4"
        strokeDasharray="3 7"
        strokeLinecap="round"
        filter={active ? `url(#aa-glow-${gateway.id})` : undefined}
        initial={{ pathLength: 0.35, opacity: 0.3 }}
        animate={{ pathLength: active ? 1 : 0.82, opacity: active ? 1 : 0.58 }}
        transition={{ duration: active ? 0.52 : 1.8, ease: "easeInOut" }}
      />
      {gateway.stars.map(([cx, cy], index) => (
        <motion.circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={index === 0 ? 3.8 : 2.8}
          fill={active ? "#ffd9bd" : "#d5d9ff"}
          filter={`url(#aa-glow-${gateway.id})`}
          animate={{ opacity: [0.55, 1, 0.65], scale: [0.9, 1.16, 0.9] }}
          transition={{ duration: 2.8 + index * 0.24, repeat: Infinity, delay: index * 0.14 }}
        />
      ))}
      <circle cx="115" cy="67" r="48" fill="none" stroke="rgba(185,181,225,.10)" strokeDasharray="1 7" />
    </svg>
  );
}

function AstralHub({ selectedGateway, onOpen }) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = GATEWAYS[activeIndex];
  const move = (step) => setActiveIndex((current) => (current + step + GATEWAYS.length) % GATEWAYS.length);
  const relativePosition = (index) => {
    const raw = (index - activeIndex + GATEWAYS.length) % GATEWAYS.length;
    return raw === 2 ? -1 : raw;
  };

  return (
    <motion.div
      className="aa-page-wrap"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: 0.48, ease: "easeOut" }}
    >
      <div className="aa-hub-intro">
        <div className="aa-hub-overline">PHYS<span style={{ color: "#e89973" }}>LAB</span> · DEEP SPACE INDEX</div>
        <p className="aa-eyebrow">CONSTELLATION SELECT</p>
        <h1 className="aa-title">Astral <em>Archives</em></h1>
        <p className="aa-lede">
          Pilih gerbang pengetahuanmu. Geser arsip seperti memilih karakter dalam sebuah ekspedisi;
          setiap portal membawa perspektif berbeda tentang mekanika dan sejarah fisika.
        </p>
      </div>

      <section className="aa-select-screen" aria-label="Pilih gerbang Astral Archives">
        <button className="aa-carousel-arrow aa-carousel-prev" type="button" onClick={() => move(-1)} aria-label="Pilihan sebelumnya">‹</button>
        <div className="aa-carousel-stage">
          {GATEWAYS.map((gateway, index) => {
            const position = relativePosition(index);
            const isActive = position === 0;
            const glow = index === 0 ? "#d98f73" : index === 1 ? "#858acb" : "#9b80c9";
            return (
              <motion.button
                key={gateway.id}
                type="button"
                className={`aa-gateway aa-carousel-card ${isActive ? "is-active" : "is-side"}`}
                style={{ "--gate-glow": glow, zIndex: isActive ? 5 : 3 - Math.abs(position) }}
                aria-current={isActive ? "true" : undefined}
                onClick={() => isActive ? onOpen(gateway.view) : setActiveIndex(index)}
                initial={false}
                animate={{
                  x: position * 265,
                  scale: isActive ? 1 : 0.82,
                  rotateY: position * -27,
                  opacity: isActive ? 1 : 0.66,
                  filter: isActive ? "blur(0px)" : "blur(.4px)",
                }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 145, damping: 20, mass: 0.85 }}
                whileHover={isActive && !reduceMotion ? { y: -8, scale: 1.025 } : { opacity: 0.9 }}
                whileTap={{ scale: isActive ? 0.98 : 0.78 }}
              >
                <span className="aa-gateway-tag">ARCHIVE 0{index + 1} · {isActive ? "SELECTED" : "PREVIEW"}</span>
                <div className="aa-gateway-art">
                  <StarGlyph gateway={gateway} active={selectedGateway === gateway.view || isActive} />
                  <span className="aa-gateway-symbol">{gateway.symbol}</span>
                </div>
                <h3>{gateway.title}</h3>
                <p>{gateway.desc}</p>
                <div className="aa-gateway-foot"><span>{gateway.count}</span><span className="aa-gateway-arrow">{isActive ? "↗ ENTER" : "SELECT →"}</span></div>
              </motion.button>
            );
          })}
        </div>
        <button className="aa-carousel-arrow aa-carousel-next" type="button" onClick={() => move(1)} aria-label="Pilihan berikutnya">›</button>
        <div className="aa-carousel-indicators" role="tablist" aria-label="Pilihan gerbang">
          {GATEWAYS.map((gateway, index) => (
            <button key={gateway.id} type="button" role="tab" aria-selected={activeIndex === index} aria-label={`Pilih ${gateway.title}`} onClick={() => setActiveIndex(index)} className={activeIndex === index ? "is-active" : ""} />
          ))}
        </div>
      </section>
      <div className="aa-active-caption"><span>SELECTED GATEWAY</span><strong>{active.title}</strong><small>{active.desc}</small></div>
      <div className="aa-hub-footer"><span /> THREE GATEWAYS <span /> ONE UNIVERSE OF MECHANICS <span /></div>
    </motion.div>
  );
}

function SectionHeader({ eyebrow, title, description, onBack }) {
  return (
    <div className="aa-subhead">
      <div className="aa-subhead-copy">
        <p className="aa-section-kicker">{eyebrow}</p>
        <h2 className="aa-section-title">{title}</h2>
        <p className="aa-section-desc">{description}</p>
      </div>
      <button className="aa-back-button" type="button" onClick={onBack}>← <span>Back to Gateway</span></button>
    </div>
  );
}

function CodexOfMechanics({ facts, onBack }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showSource, setShowSource] = useState(false);
  const fact = facts[index];
  const total = facts.length;
  const reduceMotion = useReducedMotion();

  const changeCard = (step) => {
    setDirection(step);
    setShowSource(false);
    setIndex((current) => Math.max(0, Math.min(total - 1, current + step)));
  };
  const handleDragEnd = (_, info) => {
    if (info.offset.x < -72 && index < total - 1) changeCard(1);
    else if (info.offset.x > 72 && index > 0) changeCard(-1);
  };

  return (
    <motion.div className="aa-page-wrap" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.36, ease: "easeOut" }}>
      <SectionHeader
        eyebrow="CODEX OF MECHANICS · COSMIC DATA DECK"
        title="Draw a card. Discover a universe."
        description="Bukan buku—ini adalah album kartu tarot mekanika. Geser kartu ke kiri atau kanan, atau gunakan kontrol navigasi untuk membuka satu per satu rahasia gerak, gaya, dan rotasi."
        onBack={onBack}
      />
      {!fact ? (
        <div className="aa-trial-shell"><div className="aa-trial-intro">Dataset Fun Fact belum ditemukan.</div></div>
      ) : (
        <section className="aa-tarot-stage" aria-label="Cosmic data deck">
          <div className="aa-gear gear-one" aria-hidden="true">⚙</div>
          <div className="aa-gear gear-two" aria-hidden="true">⚙</div>
          <div className="aa-deck-orbit orbit-one" aria-hidden="true" />
          <div className="aa-deck-orbit orbit-two" aria-hidden="true" />
          <div className="aa-tarot-stack">
            <motion.div className="aa-tarot-under aa-tarot-under-two" animate={{ rotate: 7, y: 12, scale: 0.94 }} transition={{ type: "spring", stiffness: 90, damping: 18 }} />
            <motion.div className="aa-tarot-under aa-tarot-under-one" animate={{ rotate: -5, y: 6, scale: 0.97 }} transition={{ type: "spring", stiffness: 100, damping: 19 }} />
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.article
                key={fact.id}
                className="aa-tarot-card"
                custom={direction}
                drag={reduceMotion ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.22}
                onDragEnd={handleDragEnd}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 105, rotateY: direction > 0 ? 24 : -24, rotateZ: direction * 5, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, rotateY: 0, rotateZ: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -115, rotateY: direction > 0 ? -28 : 28, rotateZ: direction * -7, scale: 0.92 }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 115, damping: 18, mass: 0.9 }}
                style={{ transformStyle: "preserve-3d", touchAction: "pan-y" }}
              >
                <div className="aa-tarot-frame">
                  <div className="aa-tarot-topline"><span>PHYSLAB · COSMIC ARCHIVE</span><span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span></div>
                  <div className="aa-tarot-category">{fact.bagian || "MECHANICS"} <i /> {formatArchiveYear(fact.tahun)}</div>
                  <div className="aa-tarot-sigil-wrap">
                    <div className="aa-tarot-sigil-orbit orbit-a" />
                    <div className="aa-tarot-sigil-orbit orbit-b" />
                    <div className="aa-tarot-sigil">{fact.simbol || "✧"}</div>
                    <span className="aa-tarot-star star-top">✦</span><span className="aa-tarot-star star-bottom">✧</span>
                  </div>
                  <p className="aa-tarot-arc-label">THE MECHANICS ARCANA</p>
                  <h3>{fact.judul}</h3>
                  <p className="aa-tarot-author">ARCHIVED BY · {fact.tokoh || "PHYSLAB"}</p>
                  <div className="aa-tarot-divider"><span />✧<span /></div>
                  <p className="aa-tarot-fact">{fact.fakta}</p>
                  <div className="aa-tarot-concept"><strong>THE PHYSICAL PRINCIPLE</strong><p>{fact.konsep}</p></div>
                  <div className="aa-tarot-reflection"><span>✦ REFLECTION</span><p>{fact.refleksi}</p></div>
                  <div className="aa-tarot-bottomline"><span>JELAJAHI · PAHAMI · BUKTIKAN</span><span>✧ {String(index + 1).padStart(2, "0")} ✧</span></div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
          <div className="aa-tarot-hint">← DRAG TO DRAW THE NEXT ARCANA →</div>
          <div className="aa-tarot-controls">
            <button className="aa-button" type="button" onClick={() => changeCard(-1)} disabled={index === 0}>← Previous card</button>
            <div className="aa-tarot-progress"><div className="aa-progress-track"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div><small>{index + 1} of {total} arcana</small></div>
            <button className="aa-button aa-button-primary" type="button" onClick={() => changeCard(1)} disabled={index === total - 1}>Next card →</button>
          </div>
          {fact.sumber && <div className="aa-tarot-source-row"><button className="aa-detail-toggle" type="button" onClick={() => setShowSource((value) => !value)}>{showSource ? "Hide source" : "Reveal source"} ↗</button>{showSource && <a href={fact.sumber} target="_blank" rel="noreferrer">Open supporting reference ↗</a>}</div>}
        </section>
      )}
    </motion.div>
  );
}

function projectToGlobe(latitude, longitude, rotation, radius = 270, center = 300) {
  const phi = (latitude * Math.PI) / 180;
  const lambda = ((longitude - rotation) * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  return {
    x: center + radius * cosPhi * Math.sin(lambda),
    y: center - radius * Math.sin(phi),
    z: cosPhi * Math.cos(lambda),
  };
}

const GLOBE_LANDMASSES = [
  [[72,-166],[64,-150],[60,-138],[55,-130],[49,-124],[42,-123],[34,-117],[28,-108],[22,-103],[18,-95],[24,-85],[30,-82],[36,-76],[44,-66],[51,-58],[57,-63],[62,-78],[68,-92],[72,-112]],
  [[12,-81],[7,-78],[2,-75],[ -7,-78],[-16,-75],[-25,-70],[-35,-72],[-50,-68],[-55,-60],[-43,-50],[-28,-48],[-12,-58],[0,-68]],
  [[70,-10],[72,25],[68,55],[62,82],[58,110],[50,132],[43,145],[34,137],[27,121],[20,110],[10,105],[4,86],[8,70],[18,58],[28,45],[35,30],[44,20],[50,5],[58,-6]],
  [[36,-17],[28,5],[20,25],[12,42],[2,50],[-12,45],[-25,35],[-34,23],[-35,12],[-25,2],[-10,-8],[5,-15],[20,-17]],
  [[-10,112],[-17,119],[-25,130],[-36,145],[-40,153],[-30,155],[-18,148],[-11,132]],
  [[-70,-180],[-72,-120],[-70,-60],[-72,0],[-70,60],[-72,120],[-70,180]],
];

function OdysseyPath({ points, onBack }) {
  const sorted = useMemo(() => [...points].sort((a, b) => a.urutan - b.urutan), [points]);
  const [selectedId, setSelectedId] = useState(sorted[0]?.id ?? null);
  const [detailsVisible, setDetailsVisible] = useState(true);
  const [rotation, setRotation] = useState(8);
  const [autoSpin, setAutoSpin] = useState(true);
  const dragRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const selectedPoint = sorted.find((point) => point.id === selectedId);
  const projected = useMemo(() => sorted.map((point) => ({ ...point, projection: projectToGlobe(point.lintang, point.bujur, rotation) })), [sorted, rotation]);
  const landPolygons = useMemo(() => GLOBE_LANDMASSES.map((polygon) => {
    const centerLat = polygon.reduce((sum, point) => sum + point[0], 0) / polygon.length;
    const centerLon = polygon.reduce((sum, point) => sum + point[1], 0) / polygon.length;
    if (projectToGlobe(centerLat, centerLon, rotation).z < -0.08) return null;
    return polygon.map(([lat, lon]) => projectToGlobe(lat, lon, rotation)).map(({ x, y }) => `${x},${y}`).join(" ");
  }).filter(Boolean), [rotation]);

  useEffect(() => {
    if (!autoSpin || reduceMotion) return undefined;
    const timer = window.setInterval(() => setRotation((value) => (value + 0.28) % 360), 32);
    return () => window.clearInterval(timer);
  }, [autoSpin, reduceMotion]);

  const beginRotate = (event) => {
    if (event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("[data-globe-point='true']")) return;
    dragRef.current = { x: event.clientX, rotation, pointerId: event.pointerId };
    setAutoSpin(false);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const moveRotate = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    const next = dragRef.current.rotation + (event.clientX - dragRef.current.x) * 0.42;
    setRotation(((next % 360) + 360) % 360);
  };
  const endRotate = () => { dragRef.current = null; };
  const focusPoint = (point) => {
    setSelectedId(point.id);
    setRotation(((point.bujur % 360) + 360) % 360);
    setAutoSpin(false);
  };
  const rotationLabel = `${Math.round(rotation).toString().padStart(3, "0")}°`;

  return (
    <motion.div className="aa-page-wrap" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.36 }}>
      <SectionHeader
        eyebrow="ATLAS OF EPOCHS · INTERACTIVE WORLD GLOBE"
        title="A world turned by discovery."
        description="Putar globe dengan drag klik kiri untuk menjelajahi lokasi lahir dan berkembangnya gagasan fisika. Pin yang berada di belahan depan akan menyala; pilih arsip dari globe atau daftar lokasi untuk memusatkannya."
        onBack={onBack}
      />
      <section className="aa-odyssey-panel aa-globe-panel">
        <div className="aa-odyssey-toolbar">
          <div><p className="aa-section-kicker" style={{ marginBottom: 5 }}>ATLAS / ORBITAL SURVEY</p><div className="aa-coordinate">LONGITUDE ROTATION · {rotationLabel} · {String(sorted.length).padStart(2, "0")} ARCHIVES</div></div>
          <div className="aa-globe-controls">
            <button className="aa-detail-toggle" type="button" onClick={() => setAutoSpin((value) => !value)}>{autoSpin ? "Ⅱ Pause spin" : "↻ Auto spin"}</button>
            <button className="aa-detail-toggle" type="button" onClick={() => setRotation((value) => (value + 45) % 360)}>+45°</button>
            <button className="aa-detail-toggle" type="button" onClick={() => setRotation((value) => (value + 315) % 360)}>−45°</button>
            <button className="aa-detail-toggle" type="button" onClick={() => { setRotation(8); setAutoSpin(false); }}>Reset globe</button>
          </div>
        </div>
        <div className="aa-globe-stage" onPointerDown={beginRotate} onPointerMove={moveRotate} onPointerUp={endRotate} onPointerCancel={endRotate} onLostPointerCapture={endRotate}>
          <div className="aa-globe-aura" />
          <div className="aa-globe-orbit aa-globe-orbit-one" />
          <div className="aa-globe-orbit aa-globe-orbit-two" />
          <div className="aa-globe-shell">
            <svg className="aa-globe-svg" viewBox="0 0 600 600" role="img" aria-label="Globe dunia dengan garis lintang, bujur, dan siluet benua">
              <defs>
                <radialGradient id="aa-globe-fill" cx="38%" cy="30%" r="72%"><stop offset="0" stopColor="#48558d"/><stop offset=".55" stopColor="#202c5b"/><stop offset="1" stopColor="#090f2b"/></radialGradient>
                <linearGradient id="aa-globe-rim" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#e9b18e" stopOpacity=".78"/><stop offset=".5" stopColor="#8d91d5" stopOpacity=".35"/><stop offset="1" stopColor="#e89973" stopOpacity=".7"/></linearGradient>
                <clipPath id="aa-globe-clip"><circle cx="300" cy="300" r="270"/></clipPath>
                <filter id="aa-land-glow"><feGaussianBlur stdDeviation="2.4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <circle cx="300" cy="300" r="270" fill="url(#aa-globe-fill)" />
              <g clipPath="url(#aa-globe-clip)">
                {Array.from({ length: 7 }, (_, index) => {
                  const lat = -60 + index * 20;
                  const ry = 270 * Math.cos((lat * Math.PI) / 180) * 0.18;
                  const cy = 300 - 270 * Math.sin((lat * Math.PI) / 180);
                  return <ellipse key={`lat-${lat}`} cx="300" cy={cy} rx={Math.sqrt(Math.max(0, 270 ** 2 - (cy - 300) ** 2))} ry={Math.max(1, ry)} fill="none" stroke="rgba(169,190,233,.19)" strokeWidth="1" />;
                })}
                {Array.from({ length: 12 }, (_, index) => {
                  const rx = Math.abs(Math.sin((index * 15 * Math.PI) / 180)) * 270;
                  return <ellipse key={`lon-${index}`} cx="300" cy="300" rx={Math.max(1, rx)} ry="270" fill="none" stroke="rgba(169,190,233,.17)" strokeWidth="1" />;
                })}
                <g className="aa-globe-land" filter="url(#aa-land-glow)">
                  {landPolygons.map((polygon, index) => <polygon key={`land-${index}`} points={polygon} fill="#8093a8" fillOpacity=".34" stroke="#c1c9db" strokeOpacity=".42" strokeWidth="2" />)}
                </g>
                <path d="M30 300H570 M300 30V570" stroke="rgba(232,153,115,.15)" strokeDasharray="3 9" />
              </g>
              <circle cx="300" cy="300" r="270" fill="none" stroke="url(#aa-globe-rim)" strokeWidth="2.2" />
              <circle cx="300" cy="300" r="279" fill="none" stroke="rgba(190,183,233,.15)" strokeWidth="1" strokeDasharray="2 7" />
            </svg>
            {projected.map((point) => {
              const { x, y, z } = point.projection;
              if (z < 0.02) return null;
              return (
                <button
                  key={point.id}
                  type="button"
                  data-globe-point="true"
                  className={`aa-globe-point ${selectedId === point.id ? "is-selected" : ""}`}
                  style={{ left: `${(x / 600) * 100}%`, top: `${(y / 600) * 100}%`, zIndex: Math.round(z * 10) + 4 }}
                  aria-label={`Pilih arsip ${point.judul}, ${point.kota}`}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => { event.stopPropagation(); focusPoint(point); }}
                ><i /><span>{point.simbol || "✦"}</span><small>{point.kota}</small></button>
              );
            })}
          </div>
          <div className="aa-globe-caption"><span>✧</span> DRAG TO ROTATE <span>·</span> 360° CELESTIAL ATLAS</div>
        </div>
        <div className="aa-globe-archive-strip" aria-label="Pilih lokasi arsip">
          {sorted.map((point, index) => <button key={point.id} type="button" className={selectedId === point.id ? "is-selected" : ""} onClick={() => focusPoint(point)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{point.kota}</strong><small>{point.tahun}</small></button>)}
        </div>
        {selectedPoint ? (
          <div className={`aa-archive-detail ${detailsVisible ? "" : "aa-archive-detail-hidden"}`}>
            <div>
              <div className="aa-detail-year">{selectedPoint.tahun} · {selectedPoint.cabang}</div>
              <h3>{selectedPoint.judul}</h3>
              <div className="aa-detail-meta">{selectedPoint.kota}, {selectedPoint.negara} · {selectedPoint.tokoh}</div>
              <button className="aa-detail-toggle" type="button" style={{ marginTop: 13 }} onClick={() => setDetailsVisible((value) => !value)}>{detailsVisible ? "Hide detail" : "Show detail"}</button>
            </div>
            <div>
              <p>{detailsVisible ? selectedPoint.cerita : selectedPoint.ringkasan}</p>
              {detailsVisible && <><p style={{ marginTop: 10, color: "#d0b5a8" }}>{selectedPoint.kontribusi}</p>{selectedPoint.catatan && <p style={{ marginTop: 8, color: "#8889a7", fontSize: 10 }}>Archive note: {selectedPoint.catatan}</p>}</>}
              {detailsVisible && Array.isArray(selectedPoint.sumber) && selectedPoint.sumber.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>{selectedPoint.sumber.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" style={{ color: "#e3a486", fontSize: 10 }}>{source.label} ↗</a>)}</div>}
            </div>
          </div>
        ) : <div className="aa-archive-detail"><p>Pilih salah satu titik arsip pada globe.</p></div>}
      </section>
    </motion.div>
  );
}

function TrialChambers({ questions, onBack }) {
  const [phase, setPhase] = useState("arcs");
  const [arcId, setArcId] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shield, setShield] = useState(5);
  const [correctCount, setCorrectCount] = useState(0);
  const [arcResults, setArcResults] = useState({});
  const [lastResult, setLastResult] = useState(null);
  const sortedQuestions = useMemo(() => [...questions].sort((a, b) => getQuestionNumber(a) - getQuestionNumber(b)), [questions]);
  const arc = ARC_DEFINITIONS.find((item) => item.id === arcId) ?? ARC_DEFINITIONS[0];
  const arcQuestionIds = new Set(ARC_QUESTION_IDS[arcId] ?? []);
  const arcQuestions = sortedQuestions.filter((question) =>
    arcQuestionIds.has(getQuestionNumber(question)),
  );
  const question = arcQuestions[questionIndex];
  const answeredCorrectly = selectedAnswer !== null && selectedAnswer === question?.jawabanBenar;

  const startArc = (nextArcId) => {
    setArcId(nextArcId);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setShield(5);
    setCorrectCount(0);
    setLastResult(null);
    setPhase("prologue");
  };

  const chooseAnswer = (answerIndex) => {
    if (selectedAnswer !== null || !question) return;
    setSelectedAnswer(answerIndex);
    if (answerIndex === question.jawabanBenar) setCorrectCount((value) => value + 1);
    else setShield((value) => Math.max(0, value - 1));
  };

  const finishArc = () => {
    const result = { score: correctCount, shield, failed: shield <= 0 };
    setLastResult(result);
    setArcResults((previous) => ({ ...previous, [arcId]: result }));
    setPhase("result");
  };

  const nextQuestion = () => {
    if (shield <= 0 || questionIndex >= arcQuestions.length - 1) {
      finishArc();
      return;
    }
    setQuestionIndex((value) => value + 1);
    setSelectedAnswer(null);
  };

  const beginQuestionRun = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setShield(5);
    setCorrectCount(0);
    setPhase("play");
  };

  return (
    <motion.div className="aa-page-wrap" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.36 }}>
      <SectionHeader
        eyebrow="TRIAL CHAMBERS · NARRATIVE ARCS"
        title="Knowledge is your weapon."
        description="Lima narrative arcs, masing-masing berisi sepuluh soal konsep. Jawaban salah mengurangi shield; setiap pilihan langsung membuka penjelasan konsep. Selesaikan kelima chamber untuk menuntaskan lima puluh trial."
        onBack={onBack}
      />
      <section className="aa-trial-shell">
        <div className="aa-trial-intro"><h3>THE FIVE CHAMBERS</h3><p>Setiap arc memiliki story prologue, sepuluh pertanyaan, dan lima unit shield. Kamu dapat mengulang arc kapan pun untuk memperkuat pemahaman.</p></div>
        {phase === "arcs" && (
          <div className="aa-arc-grid">
            {ARC_DEFINITIONS.map((item) => {
              const result = arcResults[item.id];
              return (
                <motion.button key={item.id} className="aa-arc-card" type="button" style={{ "--arc-color": item.color }} onClick={() => startArc(item.id)} whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }}>
                  <span className="aa-arc-index">{item.symbol}</span>
                  <strong>{item.name}</strong>
                  <small>{item.subtitle}</small>
                  <span className="aa-arc-state">{result ? `${result.score}/10 · PLAY AGAIN` : `CHAPTER 0${item.id} · 10 TRIALS`}</span>
                </motion.button>
              );
            })}
          </div>
        )}
        {phase === "prologue" && (
          <motion.div className="aa-prologue aa-prologue-cinematic" style={{ "--arc-color": arc.color }} initial={{ opacity: 0, y: 28, scale: 0.96, clipPath: "inset(12% 0 12% 0 round 24px)" }} animate={{ opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0 0% 0 round 24px)" }} transition={{ type: "spring", stiffness: 82, damping: 18, mass: 1.05 }}>
            <div className="aa-prologue-corridor" aria-hidden="true"><i /><i /><i /><i /><span /></div>
            <div className="aa-prologue-emblem"><span>{arc.symbol}</span><small>CHAMBER 0{arc.id}</small></div>
            <div className="aa-prologue-copy">
              <div className="aa-prologue-sub">CINEMATIC BRIEFING · ARC 0{arc.id} / 05</div>
              <h3>{arc.name}</h3>
              <p className="aa-prologue-chapter-title">{arc.title}</p>
              <p>{arc.mission}</p>
              <span className="aa-commander">MISSION GUIDE · {arc.commander}</span>
              <div className="aa-prologue-objective"><span>MISSION DIRECTIVE</span><strong>Recover 10 knowledge fragments. Preserve your 5 shield units.</strong></div>
              <div className="aa-trial-controls"><button className="aa-button" type="button" onClick={() => setPhase("arcs")}>← Chapter select</button><button className="aa-button aa-button-primary" type="button" onClick={beginQuestionRun}>Enter chamber <span aria-hidden="true">↗</span></button></div>
            </div>
          </motion.div>
        )}
        {phase === "play" && question && (
          <>
            <div className="aa-trial-status">
              <div className="aa-status-row"><span>CHAPTER 0{arc.id} · TRIAL {String(questionIndex + 1).padStart(2, "0")} / 10</span><span className="aa-shields" aria-label={`${shield} dari 5 shield tersisa`}>{Array.from({ length: 5 }, (_, index) => <i key={index} className={`aa-shield ${index < shield ? "is-alive" : ""}`} />)}</span></div>
              <div className="aa-status-row" style={{ marginTop: 9 }}><span>{arc.name}</span><span>{correctCount} CORRECT · {5 - shield} SHIELD LOST</span></div>
              <div className="aa-trial-progress"><span style={{ width: `${((questionIndex + (selectedAnswer !== null ? 1 : 0)) / 10) * 100}%` }} /></div>
            </div>
            <div className="aa-question-area">
              <div className="aa-question-top"><span>{question.topik}</span><span>{question.jenis === "trivia" ? "ARCHIVE TRIVIA" : "CONCEPTUAL TRIAL"}</span></div>
              <h3>{question.pertanyaan}</h3>
              <div className="aa-options" role="group" aria-label="Pilihan jawaban">
                {question.pilihan.map((option, index) => {
                  const isAnswer = index === question.jawabanBenar;
                  const isSelected = index === selectedAnswer;
                  let className = "aa-option";
                  if (selectedAnswer !== null && isAnswer) className += " is-correct";
                  else if (isSelected) className += " is-wrong";
                  else if (selectedAnswer !== null) className += " is-muted";
                  return <button key={`${question.id}-${index}`} type="button" className={className} onClick={() => chooseAnswer(index)} disabled={selectedAnswer !== null} aria-pressed={isSelected}><span className="aa-option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{selectedAnswer !== null && isAnswer && <span style={{ marginLeft: "auto" }}>✓</span>}{isSelected && !isAnswer && <span style={{ marginLeft: "auto" }}>×</span>}</button>;
                })}
              </div>
              <AnimatePresence>
                {selectedAnswer !== null && (
                  <motion.div className="aa-feedback" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <strong>{answeredCorrectly ? "SHIELD STABLE · CORRECT" : shield === 0 ? "SHIELD DEPLETED · REVIEW THE CONCEPT" : "SIGNAL DEVIATION · LEARN FROM THE ARCHIVE"}</strong>
                    <p>{question.pembahasan}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="aa-question-footer"><div className="aa-live-score">ARC SCORE <strong>{correctCount}<span style={{ color: "#8888a9", fontSize: 11 }}> / 10</span></strong></div><button className="aa-button aa-button-primary" type="button" disabled={selectedAnswer === null} onClick={nextQuestion}>{shield === 0 || questionIndex === 9 ? "Complete chapter" : "Next trial"} →</button></div>
            </div>
          </>
        )}
        {phase === "play" && !question && <div className="aa-result"><h3>Question bank unavailable</h3><p>Periksa kembali file dataKuis.ts dan pastikan bank soal memuat 50 soal.</p><button className="aa-button" onClick={() => setPhase("arcs")}>Back to chapters</button></div>}
        {phase === "result" && lastResult && (
          <motion.div className="aa-result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="aa-result-emblem">{lastResult.failed ? "⌁" : "✧"}</div>
            <p className="aa-eyebrow">CHAPTER 0{arc.id} · {lastResult.failed ? "SHIELD LOST" : "ARCHIVE RESTORED"}</p>
            <h3>{lastResult.failed ? "The signal faded." : "A new archive awakens."}</h3>
            <p>{lastResult.failed ? "Shield habis sebelum sepuluh trial selesai. Ulangi chapter ini untuk menguatkan pemahaman konsep." : "Chapter selesai. Catatan penjelasan tetap dapat dipelajari; lanjutkan perjalanan menuju ruang arsip berikutnya."}</p>
            <div className="aa-result-score">{lastResult.score}<small> / 10 correct</small></div>
            <div className="aa-status-row" style={{ justifyContent: "center" }}><span>SHIELD REMAINING</span><span className="aa-shields">{Array.from({ length: 5 }, (_, index) => <i key={index} className={`aa-shield ${index < lastResult.shield ? "is-alive" : ""}`} />)}</span></div>
            <div className="aa-result-actions">
              <button className="aa-button" type="button" onClick={() => setPhase("arcs")}>All chapters</button>
              <button className="aa-button" type="button" onClick={() => startArc(arcId)}>Retry chapter ↻</button>
              {!lastResult.failed && arcId < 5 && <button className="aa-button aa-button-primary" type="button" onClick={() => startArc(arcId + 1)}>Next chapter →</button>}
              {!lastResult.failed && arcId === 5 && <button className="aa-button aa-button-primary" type="button" onClick={() => setPhase("arcs")}>All archives complete ✦</button>}
            </div>
          </motion.div>
        )}
      </section>
    </motion.div>
  );
}

/**
 * Astral Archives — modul Trivia mandiri untuk PhysLAB.
 * Tempatkan file ini dalam folder src/features/trivia-kuis/.
 * Import ke halaman utama dengan: import AstralArchives from "./features/trivia-kuis/AstralArchives";
 */
export default function AstralArchives() {
  const [view, setView] = useState("hub");
  const [selectedGateway, setSelectedGateway] = useState(null);
  const reduceMotion = useReducedMotion();
  const facts = useMemo(() => [...DAFTAR_FUN_FACT_MEKANIKA], []);
  const history = useMemo(() => [...TITIK_SEJARAH_FISIKA], []);
  const questions = useMemo(() => [...BANK_SOAL_FISIKA], []);

  useEffect(() => {
    if (!selectedGateway) return undefined;
    const timer = window.setTimeout(() => {
      setView(selectedGateway);
      setSelectedGateway(null);
    }, reduceMotion ? 0 : 520);
    return () => window.clearTimeout(timer);
  }, [selectedGateway, reduceMotion]);

  const backToHub = () => {
    setSelectedGateway(null);
    setView("hub");
  };

  return (
    <main className="astral-archives">
      <style>{STYLE}</style>
      <div className="aa-sky" aria-hidden="true" />
      <div className="aa-grain" aria-hidden="true" />
      <header className="aa-topbar">
        <div className="aa-brand"><span className="aa-brand-mark">✧</span><span>PHYSLAB <span style={{ color: "#e89973" }}>ARCHIVES</span></span></div>
        <div className="aa-top-actions"><button type="button" className="aa-ghost-button" onClick={backToHub}>⌂ <span>Gateway</span></button><span style={{ color: "#777994", fontSize: 9, letterSpacing: ".12em" }}>VOL. 01 / MECHANICS</span></div>
      </header>
      <AnimatePresence mode="wait" initial={false}>
        {view === "hub" && <AstralHub key="hub" selectedGateway={selectedGateway} onOpen={setSelectedGateway} />}
        {view === "codex" && <CodexOfMechanics key="codex" facts={facts} onBack={backToHub} />}
        {view === "odyssey" && <OdysseyPath key="odyssey" points={history} onBack={backToHub} />}
        {view === "trials" && <TrialChambers key="trials" questions={questions} onBack={backToHub} />}
      </AnimatePresence>
    </main>
  );
}
