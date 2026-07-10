// src/data/presentations.js
// ═══════════════════════════════════════════════════════════════════════
//  鑑別の入口（Presentation）― 主訴 or スクリーニング異常
// ═══════════════════════════════════════════════════════════════════════
//  「地図を歩く」ときの出発点。ここから pathways.js の分岐ツリーが始まる。
//  kind: 'complaint'（患者が訴える）| 'abnormality'（検査で拾う異常）
//  firstTests: この入口で最初に行う検査(L1)の説明。
//  pathwayId: 対応する Pathway.id（あれば地図に接続）。
//
//  ★ Sonnetへ: 新しい主訴/異常を足すときは system と firstTests を必ず書く。
//    可能なら pathways.js に対応するツリーを作って pathwayId で結ぶ。
// ═══════════════════════════════════════════════════════════════════════

export const PRESENTATIONS = [
  // ── 検査異常を入口にするもの（スクリーニングで拾う） ──────────
  {
    id: 'pres_anemia', label: '貧血（Hb低下）', kind: 'abnormality', system: '血液',
    firstTests: 'まず血算でHb低下を確認し、MCV（赤血球の大きさ）と網赤血球で分類する。',
    pathwayId: 'pw_anemia',
  },
  {
    id: 'pres_liver_enzyme', label: '肝逸脱酵素上昇（AST/ALT↑）', kind: 'abnormality', system: '消化器',
    firstTests: 'AST・ALT・ALP・γGTP・ビリルビンのパターンで「肝細胞型」か「胆汁うっ滞型」かを分ける。',
    pathwayId: 'pw_liver_enzyme',
  },
  {
    id: 'pres_jaundice', label: '黄疸（ビリルビン上昇）', kind: 'abnormality', system: '消化器',
    firstTests: '総ビリルビンの上昇を直接/間接に分け、直接優位なら胆道系酵素と画像で閉塞を探す。',
    pathwayId: 'pw_jaundice',
  },
  {
    id: 'pres_thrombocytopenia', label: '血小板減少', kind: 'abnormality', system: '血液',
    firstTests: '血算で血小板減少を確認し、他系統の血球・凝固(PT/APTT/FDP)で消費性か産生低下かを分ける。',
    pathwayId: 'pw_thrombocytopenia',
  },

  // ── 主訴を入口にするもの ──────────────────────────────
  {
    id: 'pres_abdominal_pain', label: '腹痛（急性腹症）', kind: 'complaint', system: '消化器',
    firstTests: '圧痛の局在（心窩部/右季肋部/右下腹部）と腹膜刺激徴候・腸雑音を診て、炎症反応と画像へ。',
    pathwayId: 'pw_acute_abdomen',
  },
  {
    id: 'pres_gi_bleeding', label: '消化管出血（吐血・下血）', kind: 'complaint', system: '消化器',
    firstTests: 'タール便/鮮血便の別と直腸診・便潜血、貧血の有無を確認し、上部/下部内視鏡へ振り分ける。',
    pathwayId: null,
  },
];

export const PRESENTATION_BY_ID = Object.fromEntries(PRESENTATIONS.map(p => [p.id, p]));
