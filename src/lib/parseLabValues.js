// src/lib/parseLabValues.js
// 検査値の自動抽出（テキスト or 画像 → Claude API → 検査値マップ）

import { REF } from '../data/referenceRanges.js';

// Claude APIを呼び出して検査値を抽出する
export async function extractLabValuesWithAI(input, inputType = "text") {
  // inputType: "text" | "image_base64"

  const systemPrompt = `あなたは臨床検査値抽出の専門家です。
与えられたテキストまたは画像から検査値を抽出し、以下の厳密なJSONフォーマットのみで返答してください。

出力形式（JSON only, コードブロック不要）:
{
  "sex": "male" | "female" | null,
  "values": {
    "キー": 数値
  },
  "confidence": "high" | "medium" | "low",
  "unparsed": ["解析できなかった項目の文字列"]
}

対応キーと表記揺れの一覧:
WBC: 白血球, WBC, 白血球数, leukocyte
RBC: 赤血球, RBC, 赤血球数, erythrocyte
Hb: ヘモグロビン, Hb, Hgb, hemoglobin, 血色素量
Hct: ヘマトクリット, Hct, Ht, hematocrit
PLT: 血小板, PLT, Plt, platelet, 血小板数
Ret: 網状赤血球, Ret, Retic, reticulocyte
MCV: MCV, 平均赤血球容積
MCH: MCH, 平均赤血球Hb量
MCHC: MCHC, 平均赤血球Hb濃度
Neut: 好中球, Neut, neutrophil, Seg, PMN
Lymph: リンパ球, Lymph, Ly, lymphocyte
Eos: 好酸球, Eos, eosinophil
CRP: CRP, C反応性蛋白, C-reactive protein
ESR: 赤沈, 血沈, ESR, 赤血球沈降速度
PCT: プロカルシトニン, PCT, procalcitonin
PT: PT, プロトロンビン時間, プロトロンビン時間（秒）
PTINR: PT-INR, INR
APTT: APTT, aPTT, 部分トロンボプラスチン時間
Fib: フィブリノゲン, Fib, fibrinogen
FDP: FDP, フィブリン分解産物
DD: Dダイマー, D-dimer, D-ダイマー
TAT: TAT, トロンビン・アンチトロンビン複合体
AST: AST, GOT, aspartate aminotransferase
ALT: ALT, GPT, alanine aminotransferase
LD: LDH, LD, 乳酸脱水素酵素, lactate dehydrogenase
ALP: ALP, アルカリフォスファターゼ, alkaline phosphatase
GGT: γ-GT, γ-GTP, GGT, r-GTP, ガンマGTP
TBil: T-Bil, 総ビリルビン, total bilirubin, T.bil
DBil: D-Bil, 直接ビリルビン, direct bilirubin
TP: TP, 総蛋白, total protein
Alb: Alb, アルブミン, albumin
ChE: ChE, コリンエステラーゼ, cholinesterase
AMY: AMY, アミラーゼ, amylase
BUN: BUN, 尿素窒素, blood urea nitrogen, UN
Cre: Cr, Cre, クレアチニン, creatinine, SCr
eGFR: eGFR, GFR, 推算GFR
UA: UA, 尿酸, uric acid
CK: CK, CPK, クレアチンキナーゼ, creatine kinase
Trop: Trop, トロポニン, troponin, TnI, TnT
BNP: BNP, 脳性ナトリウム利尿ペプチド, NT-proBNP（NT-proBNPはBNPのキーで格納、5.9倍して近似）
Glu: Glu, 血糖, FBS, BS, glucose, blood sugar
HbA1c: HbA1c, A1c, グリコヘモグロビン
Ins: IRI, インスリン, insulin
CPep: CPR, Cペプチド, C-peptide
TC: TC, 総コレステロール, total cholesterol, T.Chol
TG: TG, 中性脂肪, triglyceride, トリグリセリド
HDL: HDL, HDL-C, HDLコレステロール
LDL: LDL, LDL-C, LDLコレステロール
Na: Na, ナトリウム, sodium
K: K, カリウム, potassium
Cl: Cl, クロール, chloride
Ca: Ca, カルシウム, calcium
P: P, IP, リン, phosphorus, phosphate
Mg: Mg, マグネシウム, magnesium
HCO3: HCO3-, 重炭酸イオン, bicarbonate
TSH: TSH, 甲状腺刺激ホルモン, thyroid stimulating hormone
FT3: FT3, 遊離T3, free T3
FT4: FT4, 遊離T4, free T4
TRAb: TRAb, TSH受容体抗体
TPOAb: TPO抗体, 抗TPO抗体, anti-TPO
TgAb: TgAb, 抗Tg抗体, 抗サイログロブリン抗体
Tg: Tg, サイログロブリン, thyroglobulin
Cort: コルチゾール, cortisol
ACTH: ACTH, 副腎皮質刺激ホルモン
Aldo: PAC, アルドステロン, aldosterone
PRA: PRA, レニン活性, plasma renin activity
GH: GH, 成長ホルモン, growth hormone
PRL: PRL, プロラクチン, prolactin
IGF1: IGF-1, ソマトメジンC, somatomedin C
PTH: PTH, 副甲状腺ホルモン, parathyroid hormone
vitD: 25-OHD, ビタミンD, 25-hydroxyvitamin D
IgG: IgG, 免疫グロブリンG
IgA: IgA, 免疫グロブリンA
IgM: IgM, 免疫グロブリンM
IgE: IgE, 総IgE, total IgE
CH50: CH50, 血清補体価, 補体価
C3: C3, 第3補体
C4: C4, 第4補体
BetaDGlu: βDグルカン, β-Dグルカン, beta-glucan
CEA: CEA, 癌胎児性抗原
AFP: AFP, αフェトプロテイン, alpha-fetoprotein
CA199: CA19-9, CA19-9
PSA: PSA, 前立腺特異抗原, prostate specific antigen
PIVKA2: PIVKA-II, ピブカ2, PIVKA

重要な注意事項:
- 単位変換が必要な場合は変換して出力（例: ×10³/μLで与えられた血小板数はそのまま格納）
- "H", "↑", "高" などの異常フラグは無視して数値だけ抽出
- 性別は「男性」「女性」「M」「F」「male」「female」から判定
- 数値のない項目（陽性/陰性など定性的なもの）はunparsedに入れる
- 絶対にJSONのみ返す。説明文、コードブロック記号は一切不要`;

  const messages = [];

  if (inputType === "image_base64") {
    messages.push({
      role: "user",
      content: [
        {
          type: "image",
          source: { type: "base64", media_type: "image/jpeg", data: input },
        },
        { type: "text", text: "この検査結果の画像から検査値を抽出してください。" },
      ],
    });
  } else {
    messages.push({
      role: "user",
      content: `以下のテキストから検査値を抽出してください:\n\n${input}`,
    });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  // JSONパース（コードブロックが混入しても対応）
  const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const parsed = JSON.parse(clean);

  // バリデーション：REFに存在するキーのみ通す
  const validated = {};
  const unknown = [];
  for (const [k, v] of Object.entries(parsed.values || {})) {
    if (REF[k] !== undefined) {
      validated[k] = String(v);
    } else {
      unknown.push(`${k}: ${v}`);
    }
  }

  return {
    sex: parsed.sex || null,
    values: validated,
    confidence: parsed.confidence || "medium",
    unparsed: [...(parsed.unparsed || []), ...unknown],
  };
}

// ─────────────────────────────────────────────────────────
// ルールベースフォールバック（API呼び出し失敗時・オフライン時）
// ─────────────────────────────────────────────────────────
const RULE_MAP = [
  // 正規表現パターン → キー, 変換関数
  // 血球系
  { re: /(?:WBC|白血球(?:数)?)\s*[:\uff1a]?\s*([\d.]+)/i, key: "WBC" },
  { re: /(?:RBC|赤血球(?:数)?)\s*[:\uff1a]?\s*([\d.]+)/i, key: "RBC" },
  { re: /(?:Hb|Hgb|ヘモグロビン|血色素)\s*[:\uff1a]?\s*([\d.]+)/i, key: "Hb" },
  { re: /(?:Hct|Ht|ヘマトクリット)\s*[:\uff1a]?\s*([\d.]+)/i, key: "Hct" },
  { re: /(?:PLT|Plt|血小板(?:数)?)\s*[:\uff1a]?\s*([\d.]+)/i, key: "PLT" },
  { re: /(?:Ret|網状赤血球)\s*[:\uff1a]?\s*([\d.]+)/i, key: "Ret" },
  { re: /MCV\s*[:\uff1a]?\s*([\d.]+)/i, key: "MCV" },
  { re: /MCH\s*[:\uff1a]?\s*([\d.]+)/i, key: "MCH" },
  { re: /MCHC\s*[:\uff1a]?\s*([\d.]+)/i, key: "MCHC" },
  // 炎症
  { re: /CRP\s*[:\uff1a]?\s*([\d.]+)/i, key: "CRP" },
  { re: /(?:ESR|赤沈|血沈)\s*[:\uff1a]?\s*([\d.]+)/i, key: "ESR" },
  { re: /PCT\s*[:\uff1a]?\s*([\d.]+)/i, key: "PCT" },
  // 凝固
  { re: /(?:PT|プロトロンビン時間)\s*[:\uff1a]?\s*([\d.]+)\s*秒/i, key: "PT" },
  { re: /PT-?INR\s*[:\uff1a]?\s*([\d.]+)/i, key: "PTINR" },
  { re: /APTT\s*[:\uff1a]?\s*([\d.]+)/i, key: "APTT" },
  { re: /(?:Fib|フィブリノゲン)\s*[:\uff1a]?\s*([\d.]+)/i, key: "Fib" },
  { re: /FDP\s*[:\uff1a]?\s*([\d.]+)/i, key: "FDP" },
  { re: /D[-\u30fb]?(?:ダイマー|dimer)\s*[:\uff1a]?\s*([\d.]+)/i, key: "DD" },
  // 肝
  { re: /(?:AST|GOT)\s*[:\uff1a]?\s*([\d.]+)/i, key: "AST" },
  { re: /(?:ALT|GPT)\s*[:\uff1a]?\s*([\d.]+)/i, key: "ALT" },
  { re: /(?:LDH|LD)\s*[:\uff1a]?\s*([\d.]+)/i, key: "LD" },
  { re: /ALP\s*[:\uff1a]?\s*([\d.]+)/i, key: "ALP" },
  { re: /(?:\u03b3[-\u30fb]?GTP|\u03b3[-\u30fb]?GT|GGT)\s*[:\uff1a]?\s*([\d.]+)/i, key: "GGT" },
  { re: /(?:T[-\u30fb]?Bil|総ビリルビン)\s*[:\uff1a]?\s*([\d.]+)/i, key: "TBil" },
  { re: /(?:D[-\u30fb]?Bil|直接ビリルビン)\s*[:\uff1a]?\s*([\d.]+)/i, key: "DBil" },
  { re: /TP\s*[:\uff1a]?\s*([\d.]+)/i, key: "TP" },
  { re: /(?:Alb|アルブミン)\s*[:\uff1a]?\s*([\d.]+)/i, key: "Alb" },
  { re: /ChE\s*[:\uff1a]?\s*([\d.]+)/i, key: "ChE" },
  { re: /(?:AMY|アミラーゼ)\s*[:\uff1a]?\s*([\d.]+)/i, key: "AMY" },
  // 腎
  { re: /BUN\s*[:\uff1a]?\s*([\d.]+)/i, key: "BUN" },
  { re: /(?:Cre|Cr|クレアチニン)\s*[:\uff1a]?\s*([\d.]+)/i, key: "Cre" },
  { re: /eGFR\s*[:\uff1a]?\s*([\d.]+)/i, key: "eGFR" },
  { re: /(?:UA|尿酸)\s*[:\uff1a]?\s*([\d.]+)/i, key: "UA" },
  // 筋・心
  { re: /(?:CK|CPK)\s*[:\uff1a]?\s*([\d.]+)/i, key: "CK" },
  { re: /(?:トロポニン|Trop(?:onin)?|TnI|TnT)\s*[:\uff1a]?\s*([\d.]+)/i, key: "Trop" },
  { re: /BNP\s*[:\uff1a]?\s*([\d.]+)/i, key: "BNP" },
  // 糖
  { re: /(?:FBS|血糖|BS|Glu(?:cose)?)\s*[:\uff1a]?\s*([\d.]+)/i, key: "Glu" },
  { re: /HbA1c\s*[:\uff1a]?\s*([\d.]+)/i, key: "HbA1c" },
  // 脂質
  { re: /(?:TC|総コレステロール)\s*[:\uff1a]?\s*([\d.]+)/i, key: "TC" },
  { re: /(?:TG|中性脂肪|トリグリセリド)\s*[:\uff1a]?\s*([\d.]+)/i, key: "TG" },
  { re: /(?:HDL|HDL[-\u30fb]?C|HDLコレステロール)\s*[:\uff1a]?\s*([\d.]+)/i, key: "HDL" },
  { re: /(?:LDL|LDL[-\u30fb]?C|LDLコレステロール)\s*[:\uff1a]?\s*([\d.]+)/i, key: "LDL" },
  // 電解質
  { re: /Na\s*[:\uff1a]?\s*([\d.]+)/i, key: "Na" },
  { re: /K\s*[:\uff1a]?\s*([\d.]+)/i, key: "K" },
  { re: /Cl\s*[:\uff1a]?\s*([\d.]+)/i, key: "Cl" },
  { re: /Ca\s*[:\uff1a]?\s*([\d.]+)/i, key: "Ca" },
  { re: /(?:IP|リン|P)\s*[:\uff1a]?\s*([\d.]+)/i, key: "P" },
  { re: /(?:Mg|マグネシウム)\s*[:\uff1a]?\s*([\d.]+)/i, key: "Mg" },
  // 甲状腺
  { re: /TSH\s*[:\uff1a]?\s*([\d.]+)/i, key: "TSH" },
  { re: /FT3\s*[:\uff1a]?\s*([\d.]+)/i, key: "FT3" },
  { re: /FT4\s*[:\uff1a]?\s*([\d.]+)/i, key: "FT4" },
  { re: /TRAb\s*[:\uff1a]?\s*([\d.]+)/i, key: "TRAb" },
  // 副腎
  { re: /(?:コルチゾール|Cortisol)\s*[:\uff1a]?\s*([\d.]+)/i, key: "Cort" },
  { re: /ACTH\s*[:\uff1a]?\s*([\d.]+)/i, key: "ACTH" },
  { re: /(?:PAC|アルドステロン|Aldosterone)\s*[:\uff1a]?\s*([\d.]+)/i, key: "Aldo" },
  { re: /PRA\s*[:\uff1a]?\s*([\d.]+)/i, key: "PRA" },
  // 免疫
  { re: /IgG\s*[:\uff1a]?\s*([\d.]+)/i, key: "IgG" },
  { re: /IgA\s*[:\uff1a]?\s*([\d.]+)/i, key: "IgA" },
  { re: /IgM\s*[:\uff1a]?\s*([\d.]+)/i, key: "IgM" },
  { re: /CH50\s*[:\uff1a]?\s*([\d.]+)/i, key: "CH50" },
  { re: /C3\s*[:\uff1a]?\s*([\d.]+)/i, key: "C3" },
  { re: /C4\s*[:\uff1a]?\s*([\d.]+)/i, key: "C4" },
  // 腫瘍マーカー
  { re: /CEA\s*[:\uff1a]?\s*([\d.]+)/i, key: "CEA" },
  { re: /AFP\s*[:\uff1a]?\s*([\d.]+)/i, key: "AFP" },
  { re: /CA19[-\u30fb]?9\s*[:\uff1a]?\s*([\d.]+)/i, key: "CA199" },
  { re: /PSA\s*[:\uff1a]?\s*([\d.]+)/i, key: "PSA" },
  { re: /PIVKA[-\u30fb]?II\s*[:\uff1a]?\s*([\d.]+)/i, key: "PIVKA2" },
];

export function extractLabValuesRuleBased(text) {
  const values = {};
  let sex = null;

  // 性別検出
  if (/女性|female|\bF\b/i.test(text)) sex = "female";
  else if (/男性|male|\bM\b/i.test(text)) sex = "male";

  for (const { re, key } of RULE_MAP) {
    const m = text.match(re);
    if (m) values[key] = m[1];
  }

  return { sex, values, confidence: "low", unparsed: [] };
}
