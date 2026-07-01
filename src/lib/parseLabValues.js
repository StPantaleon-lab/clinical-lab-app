// src/lib/parseLabValues.js
// 検査値抽出の優先順位:
//   1. ローカル Ollama（PC起動中のみ）
//   2. Cloudflare Worker 経由 Groq API
//   3. ルールベースフォールバック（AI不使用）

import { REF } from '../data/referenceRanges.js';

const OLLAMA_URL = "http://localhost:11434/api/chat";
const WORKER_URL = import.meta.env.VITE_WORKER_URL || "";
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || "llama3.2";

// ─────────────────────────────────────────────────────────────────
// システムプロンプト（共通）
// ─────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `あなたは臨床検査値抽出の専門家です。
与えられたテキストまたは画像から検査値を抽出し、以下の厳密なJSONフォーマットのみで返答してください。

出力形式（JSONのみ。コードブロック・説明文は不要）:
{"sex":"male"|"female"|null,"values":{"キー":数値},"confidence":"high"|"medium"|"low","unparsed":["解析できなかった項目"]}

対応キーと表記ゆれ（主なもの）:
WBC:白血球,RBC:赤血球,Hb:ヘモグロビン/Hgb,Hct:ヘマトクリット/Ht,PLT:血小板,Ret:網状赤血球
MCV,MCH,MCHC,Neut:好中球,Lymph:リンパ球,Eos:好酸球
CRP,ESR:赤沈/血沈,PCT:プロカルシトニン
PT:プロトロンビン時間(秒),PTINR:PT-INR,APTT,Fib:フィブリノゲン,FDP,DD:Dダイマー/D-dimer,TAT
AST:GOT,ALT:GPT,LD:LDH/乳酸脱水素酵素,ALP,GGT:γ-GTP/γ-GT,TBil:T-Bil/総ビリルビン,DBil:D-Bil/直接ビリルビン
TP:総蛋白,Alb:アルブミン,ChE:コリンエステラーゼ,AMY:アミラーゼ
BUN:尿素窒素,Cre:クレアチニン/Cr/SCr,eGFR,UA:尿酸
CK:CPK,Trop:トロポニン/TnI/TnT,BNP
Glu:血糖/FBS/BS,HbA1c,Ins:IRI/インスリン,CPep:Cペプチド
TC:総コレステロール,TG:中性脂肪,HDL:HDL-C,LDL:LDL-C
Na:ナトリウム,K:カリウム,Cl:クロール,Ca:カルシウム,P:リン/IP,Mg:マグネシウム,HCO3:重炭酸イオン
TSH,FT3:遊離T3,FT4:遊離T4,TRAb,TPOAb,TgAb,Tg:サイログロブリン
Cort:コルチゾール,ACTH,Aldo:アルドステロン/PAC,PRA:レニン活性
GH:成長ホルモン,PRL:プロラクチン,IGF1:IGF-1/ソマトメジンC
PTH:副甲状腺ホルモン,vitD:25-OHD/ビタミンD
IgG,IgA,IgM,IgE,CH50,C3,C4
BetaDGlu:βDグルカン/β-Dグルカン
CEA,AFP,CA199:CA19-9,PSA,PIVKA2:PIVKA-II

注意:
- 単位変換が必要な場合は変換して数値のみ格納
- H/↑/高などの異常フラグは無視して数値だけ抽出
- 性別は「男性/female/M」「女性/female/F」から判定
- 数値のない項目（陽性/陰性）はunparsedに入れる
- 絶対にJSONのみ返す`;

// ─────────────────────────────────────────────────────────────────
// 1. Ollama（ローカル）
// ─────────────────────────────────────────────────────────────────
async function tryOllama(userMessage) {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(8000), // 8秒でタイムアウト
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: userMessage },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
  const data = await res.json();
  return data.message?.content || "";
}

// ─────────────────────────────────────────────────────────────────
// 2. Cloudflare Worker 経由 Groq API
// ─────────────────────────────────────────────────────────────────
async function tryWorkerGroq(userMessage, password) {
  if (!WORKER_URL) throw new Error("WORKER_URL not set");
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-App-Password": password,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: userMessage },
      ],
      temperature: 0,
      max_tokens: 1000,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Worker HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ─────────────────────────────────────────────────────────────────
// JSONパース（コードブロック混入にも対応）
// ─────────────────────────────────────────────────────────────────
function parseAIResponse(text) {
  const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const parsed = JSON.parse(clean);

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
    source: null, // 呼び出し元で上書き
  };
}

// ─────────────────────────────────────────────────────────────────
// メインエントリ（テキスト入力）
// ─────────────────────────────────────────────────────────────────
export async function extractLabValuesWithAI(text, password) {
  const userMessage = `以下のテキストから検査値を抽出してください:\n\n${text}`;
  const errors = [];

  // 1. Ollamaを試みる
  try {
    const raw = await tryOllama(userMessage);
    const result = parseAIResponse(raw);
    return { ...result, source: "ollama" };
  } catch (e) {
    errors.push(`Ollama: ${e.message}`);
  }

  // 2. Workerを試みる
  if (WORKER_URL && password) {
    try {
      const raw = await tryWorkerGroq(userMessage, password);
      const result = parseAIResponse(raw);
      return { ...result, source: "groq" };
    } catch (e) {
      errors.push(`Groq: ${e.message}`);
    }
  }

  // 3. ルールベースにフォールバック
  console.warn("AI抽出失敗、ルールベースにフォールバック:", errors);
  const result = extractLabValuesRuleBased(text);
  return { ...result, source: "rule", errors };
}

// ─────────────────────────────────────────────────────────────────
// 画像入力（Base64）→ Groq はビジョン未対応なのでOllama優先
// OllamaビジョンモデルがなければルールベースはできないのでGroqはスキップ
// ─────────────────────────────────────────────────────────────────
export async function extractLabValuesFromImage(base64, mimeType, password) {
  const errors = [];

  // Ollamaのビジョンモデルを試みる（llava等）
  try {
    const res = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        model: "llava", // ビジョン対応モデル
        stream: false,
        messages: [{
          role: "user",
          content: [
            { type: "text",     text: SYSTEM_PROMPT + "\n\nこの画像から検査値を抽出してください。" },
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
          ],
        }],
      }),
    });
    if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
    const data = await res.json();
    const raw = data.message?.content || "";
    const result = parseAIResponse(raw);
    return { ...result, source: "ollama-vision" };
  } catch (e) {
    errors.push(`Ollama vision: ${e.message}`);
  }

  // 画像はGroqでは処理できないため、エラーを返す
  return {
    sex: null,
    values: {},
    confidence: "low",
    unparsed: [],
    source: "error",
    errors,
    errorMessage: "画像解析にはローカルOllama（llava等のビジョンモデル）が必要です。テキスト貼り付けをお試しください。",
  };
}

// ─────────────────────────────────────────────────────────────────
// ルールベースパーサー（フォールバック）
// ─────────────────────────────────────────────────────────────────
const RULE_MAP = [
  { re: /(?:WBC|白血球(?:数)?)\s*[:\uff1a]?\s*([\d.]+)/i,             key: "WBC" },
  { re: /(?:RBC|赤血球(?:数)?)\s*[:\uff1a]?\s*([\d.]+)/i,             key: "RBC" },
  { re: /(?:Hb|Hgb|ヘモグロビン|血色素)\s*[:\uff1a]?\s*([\d.]+)/i,   key: "Hb" },
  { re: /(?:Hct|Ht|ヘマトクリット)\s*[:\uff1a]?\s*([\d.]+)/i,         key: "Hct" },
  { re: /(?:PLT|Plt|血小板(?:数)?)\s*[:\uff1a]?\s*([\d.]+)/i,         key: "PLT" },
  { re: /(?:Ret|網状赤血球)\s*[:\uff1a]?\s*([\d.]+)/i,                key: "Ret" },
  { re: /MCV\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "MCV" },
  { re: /MCH(?!C)\s*[:\uff1a]?\s*([\d.]+)/i,                          key: "MCH" },
  { re: /MCHC\s*[:\uff1a]?\s*([\d.]+)/i,                              key: "MCHC" },
  { re: /CRP\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "CRP" },
  { re: /(?:ESR|赤沈|血沈)\s*[:\uff1a]?\s*([\d.]+)/i,                 key: "ESR" },
  { re: /PCT\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "PCT" },
  { re: /PT\s*[:\uff1a]?\s*([\d.]+)\s*秒/i,                           key: "PT" },
  { re: /PT-?INR\s*[:\uff1a]?\s*([\d.]+)/i,                           key: "PTINR" },
  { re: /APTT\s*[:\uff1a]?\s*([\d.]+)/i,                              key: "APTT" },
  { re: /(?:Fib|フィブリノゲン)\s*[:\uff1a]?\s*([\d.]+)/i,            key: "Fib" },
  { re: /FDP\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "FDP" },
  { re: /D[-\u30fb]?(?:ダイマー|dimer)\s*[:\uff1a]?\s*([\d.]+)/i,     key: "DD" },
  { re: /(?:AST|GOT)\s*[:\uff1a]?\s*([\d.]+)/i,                       key: "AST" },
  { re: /(?:ALT|GPT)\s*[:\uff1a]?\s*([\d.]+)/i,                       key: "ALT" },
  { re: /(?:LDH|LD)\s*[:\uff1a]?\s*([\d.]+)/i,                        key: "LD" },
  { re: /ALP\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "ALP" },
  { re: /(?:\u03b3[-\u30fb]?GTP|\u03b3[-\u30fb]?GT|GGT)\s*[:\uff1a]?\s*([\d.]+)/i, key: "GGT" },
  { re: /(?:T[-\u30fb]?Bil|総ビリルビン)\s*[:\uff1a]?\s*([\d.]+)/i,   key: "TBil" },
  { re: /(?:D[-\u30fb]?Bil|直接ビリルビン)\s*[:\uff1a]?\s*([\d.]+)/i, key: "DBil" },
  { re: /\bTP\b\s*[:\uff1a]?\s*([\d.]+)/i,                            key: "TP" },
  { re: /(?:Alb|アルブミン)\s*[:\uff1a]?\s*([\d.]+)/i,                key: "Alb" },
  { re: /ChE\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "ChE" },
  { re: /(?:AMY|アミラーゼ)\s*[:\uff1a]?\s*([\d.]+)/i,                key: "AMY" },
  { re: /BUN\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "BUN" },
  { re: /(?:Cre|Cr|クレアチニン)\s*[:\uff1a]?\s*([\d.]+)/i,           key: "Cre" },
  { re: /eGFR\s*[:\uff1a]?\s*([\d.]+)/i,                              key: "eGFR" },
  { re: /(?:UA|尿酸)\s*[:\uff1a]?\s*([\d.]+)/i,                       key: "UA" },
  { re: /(?:CK|CPK)\s*[:\uff1a]?\s*([\d.]+)/i,                        key: "CK" },
  { re: /(?:トロポニン|Trop(?:onin)?|TnI|TnT)\s*[:\uff1a]?\s*([\d.]+)/i, key: "Trop" },
  { re: /BNP\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "BNP" },
  { re: /(?:FBS|血糖|BS|Glu(?:cose)?)\s*[:\uff1a]?\s*([\d.]+)/i,      key: "Glu" },
  { re: /HbA1c\s*[:\uff1a]?\s*([\d.]+)/i,                             key: "HbA1c" },
  { re: /(?:TC|総コレステロール)\s*[:\uff1a]?\s*([\d.]+)/i,            key: "TC" },
  { re: /(?:TG|中性脂肪|トリグリセリド)\s*[:\uff1a]?\s*([\d.]+)/i,    key: "TG" },
  { re: /(?:HDL|HDL[-\u30fb]?C)\s*[:\uff1a]?\s*([\d.]+)/i,            key: "HDL" },
  { re: /(?:LDL|LDL[-\u30fb]?C)\s*[:\uff1a]?\s*([\d.]+)/i,            key: "LDL" },
  { re: /\bNa\b\s*[:\uff1a]?\s*([\d.]+)/i,                            key: "Na" },
  { re: /\bK\b\s*[:\uff1a]?\s*([\d.]+)/i,                             key: "K" },
  { re: /\bCl\b\s*[:\uff1a]?\s*([\d.]+)/i,                            key: "Cl" },
  { re: /\bCa\b\s*[:\uff1a]?\s*([\d.]+)/i,                            key: "Ca" },
  { re: /(?:\bIP\b|\bP\b|リン)\s*[:\uff1a]?\s*([\d.]+)/i,             key: "P" },
  { re: /(?:Mg|マグネシウム)\s*[:\uff1a]?\s*([\d.]+)/i,               key: "Mg" },
  { re: /TSH\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "TSH" },
  { re: /FT3\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "FT3" },
  { re: /FT4\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "FT4" },
  { re: /(?:コルチゾール|Cortisol)\s*[:\uff1a]?\s*([\d.]+)/i,          key: "Cort" },
  { re: /ACTH\s*[:\uff1a]?\s*([\d.]+)/i,                              key: "ACTH" },
  { re: /(?:PAC|アルドステロン)\s*[:\uff1a]?\s*([\d.]+)/i,             key: "Aldo" },
  { re: /PRA\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "PRA" },
  { re: /IgG\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "IgG" },
  { re: /IgA\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "IgA" },
  { re: /IgM\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "IgM" },
  { re: /CH50\s*[:\uff1a]?\s*([\d.]+)/i,                              key: "CH50" },
  { re: /\bC3\b\s*[:\uff1a]?\s*([\d.]+)/i,                            key: "C3" },
  { re: /\bC4\b\s*[:\uff1a]?\s*([\d.]+)/i,                            key: "C4" },
  { re: /CEA\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "CEA" },
  { re: /AFP\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "AFP" },
  { re: /CA19[-\u30fb]?9\s*[:\uff1a]?\s*([\d.]+)/i,                   key: "CA199" },
  { re: /PSA\s*[:\uff1a]?\s*([\d.]+)/i,                               key: "PSA" },
  { re: /PIVKA[-\u30fb]?II\s*[:\uff1a]?\s*([\d.]+)/i,                 key: "PIVKA2" },
];

export function extractLabValuesRuleBased(text) {
  const values = {};
  let sex = null;

  if (/女性|female|\bF\b/i.test(text)) sex = "female";
  else if (/男性|male|\bM\b/i.test(text)) sex = "male";

  for (const { re, key } of RULE_MAP) {
    const m = text.match(re);
    if (m) values[key] = m[1];
  }

  return { sex, values, confidence: "low", unparsed: [], source: "rule" };
}
