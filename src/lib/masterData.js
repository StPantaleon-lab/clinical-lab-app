// src/lib/masterData.js
// ═══════════════════════════════════════════════════════════════════════
//  KVマスターデータの読み書き ― 静的データへの「オーバーライド」を扱う
// ═══════════════════════════════════════════════════════════════════════
//  ・loadOverrides()   … KVから追加/上書き分を取得（無ければ null → 静的のみ）
//  ・kvUpsert / kvDelete / kvUpsertMap / kvBulkPatch … 管理者の書き込み
//  ・exportPatch()     … 現在のオーバーライドを「Claudeに渡せるJSON」として出力
//
//  KVが無い・ログインしていない場合も、アプリは静的データで完全に動く。
// ═══════════════════════════════════════════════════════════════════════

// import.meta.env は Vite 実行時のみ存在する。Nodeスクリプトから間接importされても壊れないようガード。
const WORKER_URL = (import.meta.env?.VITE_WORKER_URL) || '';
const CACHE_TTL  = 5 * 60 * 1000;

export const PW_KEY       = 'atlas_app_pw';
export const ADMIN_PW_KEY = 'atlas_admin_pw';

export const hasWorker = () => !!WORKER_URL;
export const getPw      = () => sessionStorage.getItem(PW_KEY) || '';
export const getAdminPw = () => sessionStorage.getItem(ADMIN_PW_KEY) || '';

let cache = null, cacheTime = 0;
export function clearCache() { cache = null; cacheTime = 0; }

async function post(body, { admin = false } = {}) {
  if (!WORKER_URL) throw new Error('VITE_WORKER_URL が未設定です（.env.local を確認してください）');
  const headers = { 'Content-Type': 'application/json' };
  const pw = getPw(), apw = getAdminPw();
  if (pw) headers['X-App-Password'] = pw;
  if (admin || apw) headers['X-Admin-Password'] = apw;
  const res = await fetch(WORKER_URL, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ── 認証 ─────────────────────────────────────────────
/** 合言葉を検証してsessionStorageに保存する。role: 'user' | 'admin' */
export async function login(password, role = 'user') {
  const headers = { 'Content-Type': 'application/json' };
  headers[role === 'admin' ? 'X-Admin-Password' : 'X-App-Password'] = password;
  const res = await fetch(WORKER_URL, {
    method: 'POST', headers,
    body: JSON.stringify({ action: role === 'admin' ? 'admin_ping' : 'ping' }),
  });
  if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? '合言葉が違います' : `HTTP ${res.status}`);
  sessionStorage.setItem(role === 'admin' ? ADMIN_PW_KEY : PW_KEY, password);
  clearCache();
  const data = await res.json();
  return { ok: true, admin: role === 'admin' || !!data.admin };
}

export function logout() {
  sessionStorage.removeItem(PW_KEY);
  sessionStorage.removeItem(ADMIN_PW_KEY);
  clearCache();
}

// ── 読み取り ─────────────────────────────────────────
/** KVのオーバーライドを取得。未ログイン/未設定/失敗時は null（静的のみで動く）。 */
export async function loadOverrides() {
  if (!WORKER_URL || (!getPw() && !getAdminPw())) return null;
  if (cache && Date.now() - cacheTime < CACHE_TTL) return cache;
  try {
    const { data } = await post({ action: 'kv_get_overrides' });
    cache = data; cacheTime = Date.now();
    return data;
  } catch { return null; }
}

// ── 書き込み（管理者） ───────────────────────────────
const adminPost = async (body) => { const r = await post(body, { admin: true }); clearCache(); return r; };

/** collection: 'tests'|'findings'|'diseases'|'pathways'|'presentations' */
export const kvUpsert    = (collection, item)        => adminPost({ action: 'kv_upsert', collection, item });
export const kvDelete    = (collection, id, hard)    => adminPost({ action: 'kv_delete', collection, id, hard });
/** map: 'groups'|'ref'|'labinfo' */
export const kvUpsertMap = (map, key, value)         => adminPost({ action: 'kv_upsert_map', map, key, value });
/** Claudeが出力したJSONをそのまま流し込む */
export const kvBulkPatch = (patch)                   => adminPost({ action: 'kv_bulk_patch', patch });
export const kvReset     = ()                        => adminPost({ action: 'kv_reset' });

// ── 自動読み取りのfew-shot例 ─────────────────────────
export const getExamples = () => post({ action: 'get_examples' }).then((d) => d.examples || []).catch(() => []);
export const saveExample = (inputSnippet, parsedValues) => post({ action: 'save_example', inputSnippet, parsedValues });

// ── AI（Groq経由） ───────────────────────────────────
export const groqChat  = (messages, opts = {}) => post({ action: 'chat', messages, ...opts });
export const groqVision = (base64, mimeType, prompt) => post({ action: 'vision', base64, mimeType, prompt });

// ── エクスポート ─────────────────────────────────────
/** 現在のKVオーバーライドを、そのまま貼り戻せるJSON文字列にする */
export function exportPatch(ov) {
  const clean = { TESTS: [], FINDINGS: [], DISEASES: [], PATHWAYS: [], PRESENTATIONS: [], GROUPS: {}, REF: {}, LAB_INFO: {} };
  if (!ov) return JSON.stringify(clean, null, 2);
  for (const k of Object.keys(clean)) if (ov[k]) clean[k] = ov[k];
  return JSON.stringify(clean, null, 2);
}
