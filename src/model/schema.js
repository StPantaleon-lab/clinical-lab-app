// src/model/schema.js
// ═══════════════════════════════════════════════════════════════════════
//  臨床検査アトラス ― データモデルの中核定義（枠組み）
// ═══════════════════════════════════════════════════════════════════════
//
//  【設計思想】
//  このアプリは「診断エンジン」ではなく「鑑別の地図」である。
//  ある検査をして／ある所見が出たときに、鑑別作業全体のどこに来たのか、
//  次に何をすると何が絞れるのか、を理解するためのツール。
//
//  そのため中核となる抽象は次の3つ:
//    1. Test（検査）    … 診断的な行為。血液・尿に限らず画像・生検・身体所見も含む。
//    2. Finding（所見）  … 検査が生む「観測結果の単位」。数値の異常も画像の所見も同じ器で扱う。
//    3. Pathway（鑑別路）… 「主訴／異常 → 検査 → 所見 → 疾患群 → 確定」の分岐グラフ。
//
//  検査には常に「レイヤー（段階）」がある:
//    L1 = 最初によくする検査（スクリーニング／広く浅く）
//    L2 = 鑑別のために追加する検査（絞り込み）
//    L3 = 確定診断のために必要な検査（決定的）
//  ※ L1〜L2で確定するものは、その所見のレイヤーがL1/L2のまま「確定」を担う。
//     レイヤーは常にL3まで進む必要はない。
//
//  数値から算出される値（eGFR等）や、組み合わせで意味を持つ値（ALP+γGTP等）は
//  Derived（算出値）／Pattern（組み合わせ解釈）として別建てで扱う。
//
//  ─── この設計により実現したいUX ────────────────────────────
//  ・検査から見る:  この検査は鑑別全体のどこで使うのか、何をrule in/outするのか
//  ・疾患から見る:  この疾患に到達するまでのスクリーニング→鑑別→確定の連鎖
//  ・地図を歩く:    主訴を起点にレイヤーを降りながら疾患群が絞れていく様子
//
// ═══════════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────
//  レイヤー（検査の段階）
// ─────────────────────────────────────────────────────────────
export const LAYER = {
  SCREEN:  1, // 最初によくする検査
  DIFF:    2, // 鑑別のために追加する検査
  CONFIRM: 3, // 確定診断のために必要な検査
};

export const LAYER_META = {
  1: { id: 1, key: "screen",  short: "最初",   label: "最初によくする検査",       en: "screening",
       desc: "広く行う一次スクリーニング。安価・低侵襲で、異常の有無と大まかな方向づけを行う。",
       color: "#0ea5a4", tint: "#ccfbf1" },   // teal
  2: { id: 2, key: "diff",    short: "鑑別",   label: "鑑別のために追加する検査",  en: "differential",
       desc: "絞り込まれた疾患群の中で、どれかを区別するために追加する検査。",
       color: "#d97706", tint: "#fef3c7" },   // amber
  3: { id: 3, key: "confirm", short: "確定",   label: "確定診断のために必要な検査", en: "confirmatory",
       desc: "決定的な検査。これで診断が確定する（生検・特異的抗体・特定の画像所見・遺伝子など）。",
       color: "#7c3aed", tint: "#ede9fe" },   // violet
};

export function layerMeta(n) { return LAYER_META[n] || LAYER_META[2]; }


// ─────────────────────────────────────────────────────────────
//  検査モダリティ（検査の種類）
//  数値検査に限らず「全ての医療で行われる検査」を分類するための軸。
//  画像・生検・身体所見などは値ではなく keyword finding で表現する。
// ─────────────────────────────────────────────────────────────
export const MODALITY = {
  BLOOD:      { id: "blood",     label: "血液検査",   icon: "🩸", valued: true  },
  URINE:      { id: "urine",     label: "尿・便検査", icon: "🧪", valued: true  },
  PHYSICAL:   { id: "physical",  label: "身体所見",   icon: "🩺", valued: false }, // 視診・触診・聴診・打診
  IMAGING:    { id: "imaging",   label: "画像検査",   icon: "🖼️", valued: false }, // X線/CT/MRI/US/シンチ/内視鏡
  PHYSIOLOGY: { id: "physiology",label: "生理検査",   icon: "📈", valued: false }, // 心電図・呼吸機能・脳波・負荷試験
  PATHOLOGY:  { id: "pathology", label: "病理・生検", icon: "🔬", valued: false }, // 生検・細胞診・骨髄・培養
  GENETIC:    { id: "genetic",   label: "遺伝子・染色体", icon: "🧬", valued: false },
  FUNCTION:   { id: "function",  label: "負荷・機能試験", icon: "⏱️", valued: true  }, // OGTT・デキサメサゾン抑制など
};

export const MODALITY_ORDER = ["blood","urine","physical","physiology","imaging","pathology","function","genetic"];


// ─────────────────────────────────────────────────────────────
//  所見の方向（数値検査の場合）
// ─────────────────────────────────────────────────────────────
export const DIRECTION = {
  HIGH:     "high",     // 高値
  LOW:      "low",      // 低値
  NORMAL:   "normal",   // 正常であること自体が意味を持つ場合
  POSITIVE: "positive", // 陽性（定性）
  NEGATIVE: "negative", // 陰性（定性）
  PRESENT:  "present",  // 所見あり（画像・身体所見のkeyword finding）
  ABSENT:   "absent",   // 所見なし
  ANY:      "any",      // 値があればよい
};

export const DIRECTION_LABEL = {
  high: "高値↑", low: "低値↓", normal: "正常", positive: "陽性",
  negative: "陰性", present: "所見あり", absent: "所見なし", any: "測定",
};


// ═══════════════════════════════════════════════════════════════════════
//  型定義（JSDoc）― Sonnetがデータを追加する際の契約
// ═══════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} Test  検査
 * @property {string} id                一意キー（例: "MCV", "abdo_ct", "auscultation"）
 * @property {string} name              表示名（例: "腹部造影CT"）
 * @property {string} [abbr]            略号
 * @property {string} modality          MODALITY.*.id のいずれか
 * @property {string} system            主に使う診療系統（消化器/血液/内分泌…）表示・絞り込み用
 * @property {number} [defaultLayer]    典型的なレイヤー（LAYER.*）。パスウェイ側で上書き可。
 * @property {boolean} [valued]         数値/定量として入力するか（既定はmodality由来）
 * @property {string} [unit]            valuedのときの単位
 * @property {string} [refKey]          referenceRanges.js の REF キー（数値検査を再利用する場合）
 * @property {string[]} [findings]      この検査が生みうる Finding.id の一覧
 * @property {string[]} [panel]        パネル検査のとき、構成する Test.id（例: 鉄動態 = Fe/TIBC/フェリチン）
 *                                     「単独では意味が定まらず、束で読む」検査をひとまとまりで扱うための枠。
 * @property {string} [overview]        概要（教育コンテンツ）
 * @property {string} [mechanism]       総論的な機序。labInfo.js があればそちらを優先表示。
 * @property {string} [cost]            侵襲・コストの目安（"低"/"中"/"高"）表示用
 * @property {string} [note]
 */

/**
 * @typedef {Object} Finding  所見（観測結果の最小単位）
 *   数値の異常も、画像/身体/病理の keyword 所見も、この1つの器で扱う。
 * @property {string} id                一意キー（例: "MCV_low", "ct_gallstone", "murphy_sign"）
 * @property {string} testId            どの検査で得られる所見か（Test.id）
 * @property {string} label             表示名（例: "小球性（MCV低値）", "胆嚢結石", "Murphy徴候陽性"）
 * @property {string} [direction]       DIRECTION.*（数値検査のとき low/high 等）
 * @property {string} [meaning]         この所見が意味すること（機序・解釈）― 学習の核
 * @property {string[]} [suggests]      この所見が示唆する疾患群/疾患 id（弱い関連）
 * @property {string} [layerHint]       典型レイヤー（表示用）
 */

/**
 * @typedef {Object} Disease  疾患
 * @property {string} id
 * @property {string} name
 * @property {string} system            診療系統（消化器/血液/内分泌/泌尿器/小児/…）
 * @property {string} group             疾患群（鑑別で絞り込まれる単位。例: "小球性貧血"）
 * @property {FindingRef[]} keyFindings 特徴的な所見（レイヤー付き）
 * @property {string} [confirm]         確定に必要な Test.id もしくは Finding.id
 * @property {string} [confirmNote]     確定診断の要点
 * @property {string} [mechanism]       病態機序（学習の核）
 * @property {string} [oneLiner]        一言サマリ
 * @property {string} [note]
 * @property {Object} [typical]         典型的な検査値セット（入力モードのデモ用）{ key: value }
 */

/**
 * @typedef {Object} FindingRef  疾患が参照する所見（レイヤー情報を付与）
 * @property {string} finding           Finding.id
 * @property {number} layer             LAYER.*（この疾患の鑑別過程でこの所見が使われる段階）
 * @property {boolean} [required]       診断に必須か
 * @property {string} [role]            "rule_in" | "rule_out" | "support"
 * @property {string} [note]
 */

/**
 * @typedef {Object} Pathway  鑑別路（主訴/異常を起点とする分岐グラフ）
 * @property {string} id
 * @property {string} title             起点の名前（例: "貧血（Hb低下）の鑑別"）
 * @property {string} system
 * @property {string} entryId           起点となる Presentation.id もしくは Finding.id
 * @property {string} [summary]         この鑑別の考え方の要点
 * @property {PathwayNode} root         分岐ツリーの根
 */

/**
 * @typedef {Object} PathwayNode  鑑別ツリーのノード（「ここで何を見て、どう分岐するか」）
 * @property {string} kind             "state" | "disease"
 * @property {string} label            この地点の状態名（例: "小球性貧血"）／疾患名
 * @property {number} [layer]          この分岐で行う検査のレイヤー
 * @property {string} [test]           この地点で行う Test.id（「次の一手」）
 * @property {string} [ask]            分岐の問い（例: "MCVは？"）
 * @property {string} [diseaseId]      kind==="disease" のとき対応する Disease.id
 * @property {string} [note]           この分岐の解説（機序・位置づけ）
 * @property {PathwayBranch[]} [branches]  test の所見ごとの分岐
 */

/**
 * @typedef {Object} PathwayBranch  ある検査の「所見 → 次の状態」への1本の枝
 * @property {string} finding          この枝を選ぶ所見 Finding.id（または自由記述キー）
 * @property {string} label            枝ラベル（例: "MCV低値 → 小球性"）
 * @property {PathwayNode} to          遷移先ノード
 */

/**
 * @typedef {Object} Derived  算出値（数値から計算される検査値）
 * @property {string} id
 * @property {string} label
 * @property {string[]} inputs         計算に使う Test.id / 値キー
 * @property {(v:Object,ctx:Object)=>(number|null)} compute  計算関数
 * @property {string} [unit]
 * @property {string} formula          式の文字列表現（表示・学習用）
 * @property {string} meaning          何を意味するか
 * @property {(x:number)=>string} [interpret]  値→解釈テキスト
 */

/**
 * @typedef {Object} Pattern  組み合わせ解釈（複数検査の関係が意味を持つ）
 *   例: ALP↑ + γGTP↑ → 胆汁うっ滞 / ALP↑ + γGTP正常 → 骨由来
 * @property {string} id
 * @property {string} label            パターン名（例: "胆道系優位の肝障害"）
 * @property {string[]} uses           関与する Test.id（表示・逆引き用）
 * @property {(ev:Object,v:Object)=>boolean} when  成立条件（ev=各検査のlow/normal/high, v=生値）
 * @property {string} meaning          成立時の解釈
 * @property {string[]} [suggests]     示唆する疾患群/疾患 id
 * @property {number} [layer]          典型的にどのレイヤーの読み方か
 */

/**
 * @typedef {Object} Presentation  鑑別の入口（主訴・スクリーニング異常）
 * @property {string} id
 * @property {string} label            例: "貧血", "肝逸脱酵素上昇", "腹痛"
 * @property {string} kind             "complaint"（主訴） | "abnormality"（検査異常）
 * @property {string} system
 * @property {string} [firstTests]     最初に行う検査の説明（L1の入口）
 */

// スキーマのバージョン（KV連携・移行時の目印）
export const SCHEMA_VERSION = 2;
