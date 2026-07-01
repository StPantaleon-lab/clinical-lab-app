// src/lib/parseLabValues.js
// 優先順位: ローカルOllama → Cloudflare Worker経由Groq → ルールベース

import { REF } from '../data/referenceRanges.js';

const OLLAMA_URL = "http://localhost:11434/api/chat";
const WORKER_URL = import.meta.env.VITE_WORKER_URL || "";
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || "llama3.2";

// ─────────────────────────────────────────────────────────────────
// KV から few-shot 例を取得
// ─────────────────────────────────────────────────────────────────
async function fetchExamples(password) {
  if (!WORKER_URL || !password) return [];
  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-App-Password": password },
      body: JSON.stringify({ action: "get_examples" }),
    });
    const data = await res.json();
    return data.examples || [];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────
// few-shot 例を KV に保存
// ─────────────────────────────────────────────────────────────────
export async function saveExample(inputSnippet, parsedValues, password) {
  if (!WORKER_URL || !password) return false;
  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-App-Password": password },
      body: JSON.stringify({ action: "save_example", inputSnippet, parsedValues }),
    });
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────
// システムプロンプト生成（few-shot例を含む）
// ─────────────────────────────────────────────────────────────────
function buildSystemPrompt(examples = []) {
  const base = `あなたは臨床検査値抽出の専門家です。
与えられたテキストから検査値を抽出し、以下の厳密なJSONフォーマットのみで返答してください。

出力形式（JSONのみ。コードブロック・説明文は不要）:
{"sex":"male"|"female"|null,"values":{"キー":数値},"confidence":"high"|"medium"|"low","unparsed":["解析できなかった項目"]}

対応キーと表記ゆれ（主なもの）:
WBC:白血球, RBC:赤血球, Hb:ヘモグロビン/Hgb, Hct:ヘマトクリット/Ht, PLT:血小板, Ret:網状赤血球
MCV, MCH, MCHC, Neut:好中球, Lymph:リンパ球, Eos:好酸球
CRP, ESR:赤沈/血沈, PCT:プロカルシトニン
PT:プロトロンビン時間(秒), PTINR:PT-INR, APTT, Fib:フィブリノゲン, FDP, DD:Dダイマー/D-dimer, TAT
AST:GOT, ALT:GPT, LD:LDH, ALP, GGT:γ-GTP, TBil:T-Bil/総ビリルビン, DBil:D-Bil/直接ビリルビン
TP:総蛋白, Alb:アルブミン, ChE:コリンエステラーゼ, AMY:アミラーゼ
BUN:尿素窒素, Cre:クレアチニン/Cr, eGFR, UA:尿酸
CK:CPK, Trop:トロポニン/TnI/TnT, BNP
Glu:血糖/FBS/BS, HbA1c, Ins:IRI/インスリン, CPep:Cペプチド
TC:総コレステロール, TG:中性脂肪, HDL:HDL-C, LDL:LDL-C
Na:ナトリウム, K:カリウム, Cl:クロール, Ca:カルシウム, P:リン/IP, Mg:マグネシウム, HCO3:重炭酸イオン
TSH, FT3:遊離T3, FT4:遊離T4, TRAb, TPOAb, TgAb, Tg:サイログロブリン
Cort:コルチゾール, ACTH, Aldo:アルドステロン/PAC, PRA:レニン活性
GH:成長ホルモン, PRL:プロラクチン, IGF1:IGF-1
PTH:副甲状腺ホルモン, vitD:25-OHD
IgG, IgA, IgM, IgE, CH50, C3, C4
BetaDGlu:βDグルカン, CEA, AFP, CA199:CA19-9, PSA, PIVKA2:PIVKA-II

注意:
- 単位変換が必要な場合は変換して数値のみ格納
- H/↑/高などの異常フラグは無視して数値だけ抽出
- 性別は「男性/male/M」「女性/female/F」から判定
- 数値のない項目（陽性/陰性）はunparsedに入れる
- 絶対にJSONのみ返す`;

  if (examples.length === 0) return base;

  const exampleText = examples.map((e, i) =>
    `【例${i + 1}】\n入力:\n${e.inputSnippet}\n出力:\n${JSON.stringify({ values: e.parsedValues })}`
  ).join("\n\n");

  return `${base}\n\n以下は過去にユーザーが正解を教えてくれたフォーマットの例です。同じようなフォーマットが来たら参考にしてください:\n\n${exampleText}`;
}

// ─────────────────────────────────────────────────────────────────
// JSONパース
// ─────────────────────────────────────────────────────────────────
function parseAIResponse(text) {
  const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const parsed = JSON.parse(clean);
  const validated = {};
  const unknown = [];
  for (const [k, v] of Object.entries(parsed.values || {})) {
    if (REF[k] !== undefined) validated[k] = String(v);
    else unknown.push(`${k}: ${v}`);
  }
  return {
    sex: parsed.sex || null,
    values: validated,
    confidence: parsed.confidence || "medium",
    unparsed: [...(parsed.unparsed || []), ...unknown],
    source: null,
  };
}

// ─────────────────────────────────────────────────────────────────
// 1. Ollama（ローカル）
// ─────────────────────────────────────────────────────────────────
async function tryOllama(userMessage, systemPrompt) {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(8000),
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userMessage },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
  const data = await res.json();
  return data.message?.content || "";
}

// ─────────────────────────────────────────────────────────────────
// 2. Cloudflare Worker 経由 Groq
// ─────────────────────────────────────────────────────────────────
async function tryWorkerGroq(userMessage, systemPrompt, password) {
  if (!WORKER_URL) throw new Error("WORKER_URL not set");
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-App-Password": password,
    },
    body: JSON.stringify({
      action: "chat",
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
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
// メインエントリ（テキスト入力）
// ─────────────────────────────────────────────────────────────────
export async function extractLabValuesWithAI(text, password) {
  const userMessage = `以下のテキストから検査値を抽出してください:\n\n${text}`;
  const errors = [];

  // KVから few-shot 例を取得してプロンプトに組み込む
  const examples = await fetchExamples(password);
  const systemPrompt = buildSystemPrompt(examples);

  // 1. Ollama
  try {
    const raw = await tryOllama(userMessage, systemPrompt);
    const result = parseAIResponse(raw);
    return { ...result, source: "ollama", examples };
  } catch (e) {
    errors.push(`Ollama: ${e.message}`);
  }

  // 2. Groq
  if (WORKER_URL && password) {
    try {
      const raw = await tryWorkerGroq(userMessage, systemPrompt, password);
      const result = parseAIResponse(raw);
      return { ...result, source: "groq", examples };
    } catch (e) {
      errors.push(`Groq: ${e.message}`);
    }
  }

  // 3. ルールベース
  console.warn("AI抽出失敗、ルールベースにフォールバック:", errors);
  const result = extractLabValuesRuleBased(text);
  return { ...result, source: "rule", errors, examples };
}

// ─────────────────────────────────────────────────────────────────
// 画像入力
// ─────────────────────────────────────────────────────────────────
export async function extractLabValuesFromImage(base64, mimeType, password) {
  const errors = [];
  const examples = await fetchExamples(password);
  const systemPrompt = buildSystemPrompt(examples);

  try {
    const res = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        model: "llava",
        stream: false,
        messages: [{
          role: "user",
          content: [
            { type: "text",      text: systemPrompt + "\n\nこの画像から検査値を抽出してください。" },
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
          ],
        }],
      }),
    });
    if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
    const data = await res.json();
    const result = parseAIResponse(data.message?.content || "");
    return { ...result, source: "ollama-vision", examples };
  } catch (e) {
    errors.push(`Ollama vision: ${e.message}`);
  }

  return {
    sex: null, values: {}, confidence: "low", unparsed: [], source: "error", errors,
    errorMessage: "画像解析にはローカルOllama（llavaモデル）が必要です。テキスト貼り付けをお試しください。",
  };
}

// ─────────────────────────────────────────────────────────────────
// ルールベースフォールバック
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
