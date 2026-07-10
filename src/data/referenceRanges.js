// src/data/referenceRanges.js
// 正常範囲データ（臨床検査医学スライド PDF1〜12 より）

export const REF = {
  // ── 血球系（PDF2）─────────────────────────────────
  WBC:    { label: "白血球数",          abbr: "WBC",    unit: "×千/μL",   maleMin: 3.8,  maleMax: 9.8,  femaleMin: 2.8,  femaleMax: 8.8,  group: "血球系" },
  RBC:    { label: "赤血球数",          abbr: "RBC",    unit: "×百万/μL", maleMin: 4.16, maleMax: 5.58, femaleMin: 3.66, femaleMax: 4.78, group: "血球系" },
  Hb:     { label: "ヘモグロビン",      abbr: "Hb",     unit: "g/dL",     maleMin: 13.2, maleMax: 16.8, femaleMin: 11.6, femaleMax: 14.0, group: "血球系" },
  Hct:    { label: "ヘマトクリット",    abbr: "Hct",    unit: "%",        maleMin: 38.7, maleMax: 50.3, femaleMin: 34.1, femaleMax: 41.7, group: "血球系" },
  PLT:    { label: "血小板数",          abbr: "PLT",    unit: "×千/μL",   min: 147,      max: 341,                                        group: "血球系" },
  Ret:    { label: "網状赤血球",        abbr: "Ret",    unit: "‰",        min: 7.3,      max: 22.3,                                       group: "血球系" },
  MCV:    { label: "平均赤血球容積",    abbr: "MCV",    unit: "fL",       min: 80,       max: 100,                                        group: "血球系" },
  MCH:    { label: "平均赤血球Hb量",   abbr: "MCH",    unit: "pg",       min: 27,       max: 34,                                         group: "血球系" },
  MCHC:   { label: "平均赤血球Hb濃度", abbr: "MCHC",   unit: "g/dL",     min: 31,       max: 36,                                         group: "血球系" },
  Neut:   { label: "好中球比率",        abbr: "Neut",   unit: "%",        min: 40,       max: 70,                                         group: "血球系" },
  Lymph:  { label: "リンパ球比率",      abbr: "Lymph",  unit: "%",        min: 18,       max: 42,                                         group: "血球系" },
  Eos:    { label: "好酸球比率",        abbr: "Eos",    unit: "%",        min: 0,        max: 6,                                          group: "血球系" },
  Mono:   { label: "単球比率",          abbr: "Mono",   unit: "%",        min: 2,        max: 10,                                         group: "血球系" },
  Baso:   { label: "好塩基球比率",      abbr: "Baso",   unit: "%",        min: 0,        max: 1,                                          group: "血球系" },

  // ── 炎症マーカー（PDF2）──────────────────────────
  CRP:    { label: "CRP",               abbr: "CRP",    unit: "mg/dL",   min: 0,        max: 0.3,                                        group: "炎症マーカー" },
  ESR:    { label: "赤沈（1時間値）",   abbr: "ESR",    unit: "mm/h",    maleMin: 0,    maleMax: 10,   femaleMin: 0,    femaleMax: 15,   group: "炎症マーカー" },
  PCT:    { label: "プロカルシトニン",  abbr: "PCT",    unit: "ng/mL",   min: 0,        max: 0.05,                                       group: "炎症マーカー" },

  // ── 凝固系（PDF11, 12）──────────────────────────
  PT:     { label: "プロトロンビン時間", abbr: "PT",    unit: "秒",       min: 10,       max: 14,                                         group: "凝固系" },
  PTINR:  { label: "PT-INR",            abbr: "PT-INR", unit: "",        min: 0.9,      max: 1.1,                                        group: "凝固系" },
  APTT:   { label: "APTT",              abbr: "APTT",   unit: "秒",      min: 25,       max: 40,                                         group: "凝固系" },
  Fib:    { label: "フィブリノゲン",    abbr: "Fib",    unit: "mg/dL",   min: 150,      max: 400,                                        group: "凝固系" },
  FDP:    { label: "FDP",               abbr: "FDP",    unit: "μg/mL",  min: 0,        max: 5,                                          group: "凝固系" },
  DD:     { label: "D-ダイマー",        abbr: "D-dimer",unit: "μg/mL",  min: 0,        max: 1.0,                                        group: "凝固系" },
  TAT:    { label: "TAT",               abbr: "TAT",    unit: "ng/mL",   min: 0,        max: 3.0,                                        group: "凝固系" },

  // ── 肝機能・胆道系（PDF3）───────────────────────
  AST:    { label: "AST（GOT）",        abbr: "AST",    unit: "IU/L",    min: 10,       max: 40,                                         group: "肝機能・胆道系" },
  ALT:    { label: "ALT（GPT）",        abbr: "ALT",    unit: "IU/L",    min: 5,        max: 45,                                         group: "肝機能・胆道系" },
  LD:     { label: "LDH",               abbr: "LD",     unit: "U/L",     min: 120,      max: 245,                                        group: "肝機能・胆道系" },
  ALP:    { label: "ALP",               abbr: "ALP",    unit: "U/L",     min: 38,       max: 113,                                        group: "肝機能・胆道系" },
  GGT:    { label: "γ-GTP",            abbr: "γ-GT",  unit: "IU/L",    maleMin: 0,    maleMax: 50,   femaleMin: 0,    femaleMax: 30,   group: "肝機能・胆道系" },
  TBil:   { label: "総ビリルビン",      abbr: "T-Bil",  unit: "mg/dL",   min: 0.2,      max: 1.2,                                        group: "肝機能・胆道系" },
  DBil:   { label: "直接ビリルビン",    abbr: "D-Bil",  unit: "mg/dL",   min: 0,        max: 0.4,                                        group: "肝機能・胆道系" },
  TP:     { label: "総蛋白",            abbr: "TP",     unit: "g/dL",    min: 6.5,      max: 8.2,                                        group: "肝機能・胆道系" },
  Alb:    { label: "アルブミン",        abbr: "Alb",    unit: "g/dL",    min: 3.8,      max: 5.2,                                        group: "肝機能・胆道系" },
  ChE:    { label: "コリンエステラーゼ",abbr: "ChE",    unit: "U/L",     maleMin: 240,  maleMax: 480,  femaleMin: 200,  femaleMax: 400, group: "肝機能・胆道系" },
  AMY:    { label: "アミラーゼ",        abbr: "AMY",    unit: "U/L",     min: 37,       max: 125,                                        group: "肝機能・胆道系" },

  // ── 腎機能（PDF7）──────────────────────────────
  BUN:    { label: "尿素窒素",          abbr: "BUN",    unit: "mg/dL",   min: 8,        max: 20,                                         group: "腎機能" },
  Cre:    { label: "クレアチニン",      abbr: "Cre",    unit: "mg/dL",   maleMin: 0.65, maleMax: 1.07, femaleMin: 0.46, femaleMax: 0.79, group: "腎機能" },
  eGFR:   { label: "eGFR",             abbr: "eGFR",   unit: "mL/min/1.73m²", min: 60, max: 9999,                                      group: "腎機能" },
  UA:     { label: "尿酸",             abbr: "UA",     unit: "mg/dL",   maleMin: 3.0,  maleMax: 7.0,  femaleMin: 2.0,  femaleMax: 6.0,  group: "腎機能" },

  // ── 筋酵素（PDF3）──────────────────────────────
  CK:     { label: "クレアチンキナーゼ",abbr: "CK",     unit: "IU/L",   maleMin: 60,   maleMax: 270,  femaleMin: 40,   femaleMax: 150,  group: "筋酵素" },
  Trop:   { label: "トロポニンI/T",     abbr: "Trop",   unit: "ng/mL",  min: 0,        max: 0.04,                                       group: "筋酵素" },
  BNP:    { label: "BNP",              abbr: "BNP",    unit: "pg/mL",  min: 0,        max: 18.4,                                       group: "筋酵素" },

  // ── 糖代謝（PDF3）──────────────────────────────
  Glu:    { label: "血糖（空腹時）",   abbr: "FBS",    unit: "mg/dL",  min: 70,       max: 109,                                        group: "糖代謝" },
  HbA1c:  { label: "HbA1c",           abbr: "HbA1c",  unit: "%",      min: 4.3,      max: 5.8,                                        group: "糖代謝" },
  AG1_5:  { label: "1,5-AG",          abbr: "1,5-AG", unit: "μg/mL", min: 14,       max: 9999,                                       group: "糖代謝" },

  // ── 脂質（PDF3）────────────────────────────────
  TC:     { label: "総コレステロール", abbr: "TC",     unit: "mg/dL",  min: 130,      max: 219,                                        group: "脂質代謝" },
  TG:     { label: "中性脂肪",         abbr: "TG",     unit: "mg/dL",  min: 30,       max: 149,                                        group: "脂質代謝" },
  HDL:    { label: "HDLコレステロール",abbr: "HDL",    unit: "mg/dL",  maleMin: 40,   maleMax: 90,   femaleMin: 40,   femaleMax: 100,  group: "脂質代謝" },
  LDL:    { label: "LDLコレステロール",abbr: "LDL",    unit: "mg/dL",  min: 0,        max: 139,                                        group: "脂質代謝" },

  // ── 電解質（PDF5）──────────────────────────────
  Na:     { label: "ナトリウム",       abbr: "Na",     unit: "mEq/L",  min: 136,      max: 145,                                        group: "電解質" },
  K:      { label: "カリウム",         abbr: "K",      unit: "mEq/L",  min: 3.6,      max: 4.8,                                        group: "電解質" },
  Cl:     { label: "クロール",         abbr: "Cl",     unit: "mEq/L",  min: 98,       max: 108,                                        group: "電解質" },
  Ca:     { label: "カルシウム",       abbr: "Ca",     unit: "mg/dL",  min: 8.5,      max: 10.2,                                       group: "電解質" },
  P:      { label: "リン",             abbr: "P",      unit: "mg/dL",  min: 2.5,      max: 4.5,                                        group: "電解質" },
  Mg:     { label: "マグネシウム",     abbr: "Mg",     unit: "mg/dL",  min: 1.8,      max: 2.4,                                        group: "電解質" },
  HCO3:   { label: "重炭酸イオン",     abbr: "HCO3-",  unit: "mEq/L",  min: 22,       max: 26,                                         group: "電解質" },

  // ── 内分泌（PDF8）──────────────────────────────
  TSH:    { label: "TSH",              abbr: "TSH",    unit: "μIU/mL", min: 0.5,      max: 5.0,                                        group: "内分泌（甲状腺）" },
  FT3:    { label: "遊離T3（FT3）",   abbr: "FT3",    unit: "pg/mL",  min: 2.3,      max: 4.3,                                        group: "内分泌（甲状腺）" },
  FT4:    { label: "遊離T4（FT4）",   abbr: "FT4",    unit: "ng/dL",  min: 0.9,      max: 1.7,                                        group: "内分泌（甲状腺）" },
  TgAb:   { label: "抗サイログロブリン抗体", abbr: "TgAb", unit: "IU/mL", min: 0,  max: 28,                                           group: "内分泌（甲状腺）" },
  TPOAb:  { label: "抗TPO抗体",        abbr: "TPOAb",  unit: "IU/mL",  min: 0,        max: 16,                                         group: "内分泌（甲状腺）" },
  TRAb:   { label: "TSH受容体抗体（TRAb）", abbr: "TRAb", unit: "IU/L", min: 0,      max: 2.0,                                        group: "内分泌（甲状腺）" },
  Tg:     { label: "サイログロブリン", abbr: "Tg",     unit: "ng/mL",  min: 0,        max: 33,                                         group: "内分泌（甲状腺）" },
  Cort:   { label: "コルチゾール（朝）",abbr: "Cortisol",unit: "μg/dL",min: 6,        max: 27,                                         group: "内分泌（副腎）" },
  ACTH:   { label: "ACTH",             abbr: "ACTH",   unit: "pg/mL",  min: 7,        max: 60,                                         group: "内分泌（副腎）" },
  Aldo:   { label: "アルドステロン（PAC）",abbr: "PAC", unit: "pg/mL", min: 35.7,     max: 240,                                        group: "内分泌（副腎）" },
  PRA:    { label: "レニン活性（PRA）",abbr: "PRA",    unit: "ng/mL/h",min: 0.2,      max: 3.9,                                        group: "内分泌（副腎）" },
  GH:     { label: "成長ホルモン（GH）",abbr: "GH",    unit: "ng/mL",  min: 0,        max: 0.97,                                       group: "内分泌（下垂体）" },
  PRL:    { label: "プロラクチン（PRL）",abbr: "PRL",  unit: "ng/mL",  maleMin: 0,    maleMax: 15,   femaleMin: 0,    femaleMax: 30,   group: "内分泌（下垂体）" },
  IGF1:   { label: "IGF-1（ソマトメジンC）",abbr:"IGF-1",unit:"ng/mL", min: 100,      max: 400,                                        group: "内分泌（下垂体）" },
  PTH:    { label: "副甲状腺ホルモン（PTH）",abbr:"PTH",unit:"pg/mL",  min: 10,       max: 65,                                         group: "内分泌（副甲状腺）" },
  vitD:   { label: "25-OH ビタミンD",  abbr: "25-OHD", unit: "ng/mL",  min: 20,       max: 100,                                        group: "内分泌（副甲状腺）" },
  Ins:    { label: "インスリン（空腹時）",abbr:"IRI",   unit: "μU/mL", min: 3,        max: 15,                                         group: "糖代謝" },
  CPep:   { label: "Cペプチド",        abbr: "CPR",    unit: "ng/mL",  min: 0.5,      max: 2.0,                                        group: "糖代謝" },

  // ── 免疫グロブリン・補体（PDF9）──────────────
  IgG:    { label: "IgG",              abbr: "IgG",    unit: "mg/dL",  min: 800,      max: 1800,                                       group: "免疫・補体" },
  IgA:    { label: "IgA",              abbr: "IgA",    unit: "mg/dL",  min: 90,       max: 450,                                        group: "免疫・補体" },
  IgM:    { label: "IgM",              abbr: "IgM",    unit: "mg/dL",  min: 70,       max: 280,                                        group: "免疫・補体" },
  IgE:    { label: "IgE（総）",        abbr: "IgE",    unit: "IU/mL",  min: 0,        max: 170,                                        group: "免疫・補体" },
  CH50:   { label: "血清補体価（CH50）",abbr: "CH50",   unit: "U/mL",  min: 30,       max: 40,                                         group: "免疫・補体" },
  C3:     { label: "補体 C3",          abbr: "C3",     unit: "mg/dL",  min: 55,       max: 115,                                        group: "免疫・補体" },
  C4:     { label: "補体 C4",          abbr: "C4",     unit: "mg/dL",  min: 15,       max: 50,                                         group: "免疫・補体" },

  // ── 感染症マーカー（PDF10）──────────────────
  // 定量で判定できるもののみ数値として扱う
  // （定性はsymptomsとして別途扱う）
  BetaDGlu: { label: "β-Dグルカン",   abbr: "β-DG",  unit: "pg/mL",  min: 0,        max: 11,                                         group: "感染症マーカー" },
  CrAg:     { label: "クリプトコッカス抗原",abbr:"CrAg", unit:"(陰性)",min:0,         max: 0,                                          group: "感染症マーカー" },
  // ─  腫瘍マーカー  ────────────────────────────
  CEA:    { label: "CEA",              abbr: "CEA",    unit: "ng/mL",  min: 0,        max: 5.0,                                        group: "腫瘍マーカー" },
  AFP:    { label: "AFP",              abbr: "AFP",    unit: "ng/mL",  min: 0,        max: 10,                                         group: "腫瘍マーカー" },
  CA199:  { label: "CA19-9",           abbr: "CA19-9", unit: "U/mL",  min: 0,        max: 37,                                         group: "腫瘍マーカー" },
  PSA:    { label: "PSA",              abbr: "PSA",    unit: "ng/mL",  min: 0,        max: 4.0,                                        group: "腫瘍マーカー" },
  PIVKA2: { label: "PIVKA-II",         abbr: "PIVKA-II",unit:"mAU/mL",min: 0,        max: 40,                                         group: "腫瘍マーカー" },
};

// グループ順序
export const GROUP_ORDER = [
  "血球系",
  "炎症マーカー",
  "凝固系",
  "肝機能・胆道系",
  "腎機能",
  "筋酵素",
  "糖代謝",
  "脂質代謝",
  "電解質",
  "内分泌（甲状腺）",
  "内分泌（副腎）",
  "内分泌（下垂体）",
  "内分泌（副甲状腺）",
  "免疫・補体",
  "感染症マーカー",
  "腫瘍マーカー",
];

// 値を評価して low / normal / high を返す
export function evalVal(key, rawVal, sex = "male") {
  const ref = REF[key];
  if (!ref) return null;
  if (rawVal === "" || rawVal === null || rawVal === undefined) return null;
  const v = parseFloat(rawVal);
  if (isNaN(v)) return null;
  const lo = ref.min ?? (sex === "female" ? ref.femaleMin : ref.maleMin);
  const hi = ref.max ?? (sex === "female" ? ref.femaleMax : ref.maleMax);
  if (lo === undefined || hi === undefined) return null;
  if (v < lo) return "low";
  if (v > hi) return "high";
  return "normal";
}

// 入力済みキーのセットを返す
export function enteredKeys(values) {
  return new Set(Object.keys(values).filter(k => values[k] !== "" && values[k] !== null && values[k] !== undefined));
}

// ════════════ バイタルサイン ════════════
// （正常範囲は成人安静時の目安）
export const VITAL_REF = {
  SBP:   { label: "収縮期血圧",    abbr: "SBP",    unit: "mmHg",  min: 90,  max: 139, group: "バイタルサイン" },
  DBP:   { label: "拡張期血圧",    abbr: "DBP",    unit: "mmHg",  min: 60,  max: 89,  group: "バイタルサイン" },
  HR:    { label: "脈拍数",        abbr: "HR",     unit: "回/分", min: 60,  max: 100, group: "バイタルサイン" },
  BT:    { label: "体温",          abbr: "BT",     unit: "℃",    min: 36.0,max: 37.4, group: "バイタルサイン" },
  SpO2:  { label: "経皮的酸素飽和度", abbr: "SpO2", unit: "%",   min: 96,  max: 100, group: "バイタルサイン" },
  RR:    { label: "呼吸数",        abbr: "RR",     unit: "回/分", min: 12,  max: 20,  group: "バイタルサイン" },
  Height:{ label: "身長",          abbr: "身長",   unit: "cm",    min: 0,   max: 9999,group: "バイタルサイン" },
  Weight:{ label: "体重",          abbr: "体重",   unit: "kg",    min: 0,   max: 9999,group: "バイタルサイン" },
  BMI:   { label: "BMI",           abbr: "BMI",    unit: "kg/m²", min: 18.5,max: 24.9,group: "バイタルサイン" },
};

// ════════════ 尿所見 ════════════
// 定量値のみ（定性はsymptomsで扱う）
export const URINE_REF = {
  UPro:  { label: "尿蛋白（随時）",       abbr: "U-Pro",   unit: "mg/dL",        min: 0,   max: 14,   group: "尿所見" },
  UCre:  { label: "尿クレアチニン（随時）", abbr: "U-Cre",  unit: "mg/dL",        min: 40,  max: 200,  group: "尿所見" },
  UPCR:  { label: "尿蛋白/クレアチニン比", abbr: "UPCR",   unit: "g/gCr",        min: 0,   max: 0.15, group: "尿所見" },
  UAlb:  { label: "尿中アルブミン（随時）", abbr: "U-Alb", unit: "mg/gCr",       min: 0,   max: 30,   group: "尿所見" },
  UBUN:  { label: "尿中尿素窒素",         abbr: "U-BUN",   unit: "mg/dL",        min: 0,   max: 9999, group: "尿所見" },
  UNa:   { label: "尿中ナトリウム",       abbr: "U-Na",    unit: "mEq/L",        min: 0,   max: 9999, group: "尿所見" },
  URBCh: { label: "尿沈渣 赤血球",        abbr: "U-RBC",   unit: "/HPF",         min: 0,   max: 4,    group: "尿所見" },
  UWBCh: { label: "尿沈渣 白血球",        abbr: "U-WBC",   unit: "/HPF",         min: 0,   max: 4,    group: "尿所見" },
};

// REFに統合
Object.assign(REF, VITAL_REF, URINE_REF);

// グループ順序に追加
GROUP_ORDER.push("バイタルサイン", "尿所見");

// ════════════════════════════════════════════════════════════════════
//  拡張基準値（v2で追加）― 各科の展開に必要な数値検査
// ════════════════════════════════════════════════════════════════════
//  ★ 新しい数値検査を足すときは、まずここ（または上のREF）にキーを作る。
//    tests.js の refKey がこのキーを指し、evalVal() が low/normal/high を返す。
export const REF_EXTRA = {
  // ── 鉄代謝・溶血 ──────────────────────────────
  Fe:      { label:"血清鉄",            abbr:"Fe",      unit:"μg/dL",  maleMin:50, maleMax:200, femaleMin:40, femaleMax:180, group:"鉄代謝・溶血" },
  TIBC:    { label:"総鉄結合能",        abbr:"TIBC",    unit:"μg/dL",  min:250,  max:400,  group:"鉄代謝・溶血" },
  Ferritin:{ label:"フェリチン",        abbr:"Ferritin",unit:"ng/mL",  maleMin:20, maleMax:250, femaleMin:5, femaleMax:120, group:"鉄代謝・溶血" },
  Hapto:   { label:"ハプトグロビン",    abbr:"Hp",      unit:"mg/dL",  min:19,   max:170,  group:"鉄代謝・溶血" },
  IBil:    { label:"間接ビリルビン",    abbr:"I-Bil",   unit:"mg/dL",  min:0,    max:0.8,  group:"鉄代謝・溶血" },

  // ── 肝胆膵（追加）─────────────────────────────
  NH3:     { label:"アンモニア",        abbr:"NH3",     unit:"μg/dL",  min:12,   max:66,   group:"肝機能・胆道系" },
  Lip:     { label:"リパーゼ",          abbr:"Lipase",  unit:"U/L",    min:11,   max:53,   group:"肝機能・胆道系" },

  // ── 血液ガス・代謝 ────────────────────────────
  pH:      { label:"動脈血pH",          abbr:"pH",      unit:"",       min:7.35, max:7.45, group:"血液ガス・代謝" },
  PaCO2:   { label:"動脈血二酸化炭素分圧",abbr:"PaCO2", unit:"Torr",   min:35,   max:45,   group:"血液ガス・代謝" },
  PaO2:    { label:"動脈血酸素分圧",    abbr:"PaO2",    unit:"Torr",   min:80,   max:100,  group:"血液ガス・代謝" },
  BE:      { label:"base excess",       abbr:"BE",      unit:"mEq/L",  min:-2,   max:2,    group:"血液ガス・代謝" },
  Lac:     { label:"乳酸",              abbr:"Lac",     unit:"mg/dL",  min:4,    max:16,   group:"血液ガス・代謝" },
  Osm:     { label:"血漿浸透圧",        abbr:"P-Osm",   unit:"mOsm/kg",min:275,  max:295,  group:"血液ガス・代謝" },
  UOsm:    { label:"尿浸透圧（随時）",  abbr:"U-Osm",   unit:"mOsm/kg",min:50,   max:1300, group:"尿所見" },

  // ── 心筋・その他 ──────────────────────────────
  CKMB:    { label:"CK-MB",             abbr:"CK-MB",   unit:"U/L",    min:0,    max:25,   group:"筋酵素" },

  // ── 腫瘍マーカー・免疫（追加）─────────────────
  CA125:   { label:"CA125",             abbr:"CA125",   unit:"U/mL",   min:0,    max:35,   group:"腫瘍マーカー" },
  sIL2R:   { label:"可溶性IL-2受容体",  abbr:"sIL-2R",  unit:"U/mL",   min:145,  max:519,  group:"腫瘍マーカー" },
  ASO:     { label:"ASO（抗ストレプトリジンO）", abbr:"ASO", unit:"IU/mL", min:0, max:240, group:"感染症マーカー" },

  // ── 患者背景（算出値の入力に使う）─────────────
  Age:     { label:"年齢",              abbr:"Age",     unit:"歳",     min:0,    max:120,  group:"患者背景" },
};

Object.assign(REF, REF_EXTRA);
GROUP_ORDER.push("鉄代謝・溶血", "血液ガス・代謝", "患者背景");
