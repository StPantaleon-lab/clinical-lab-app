/**
 * workers/proxy.js
 * ══════════════════════════════════════════════════════════════════════
 *  臨床鑑別アトラス ― 認証 + Groq APIプロキシ + KVマスターデータ
 * ══════════════════════════════════════════════════════════════════════
 *
 *  環境変数（Cloudflare Dashboard の Variables で設定。ファイルには書かない）:
 *    APP_PASSWORD    : 一般ユーザー合言葉
 *    ADMIN_PASSWORD  : 管理者合言葉
 *    GROQ_API_KEY    : Groq APIキー（自動読み取りに使う）
 *  KV Binding:
 *    ATLAS_KV        : マスターデータ + few-shot例
 *
 *  KVキー（すべて data/index.js の buildAtlas() が受け取る形と同じ）:
 *    kv_tests / kv_findings / kv_diseases / kv_pathways / kv_presentations  … 配列
 *    kv_groups / kv_ref / kv_labinfo                                        … オブジェクト
 *    examples                                                               … 自動読み取りのfew-shot例
 *
 *  設計方針: KVは「静的データへのオーバーライド（追加・上書き・削除）」だけを持つ。
 *  全データを丸ごと持たないので、KVが空でもアプリは静的データで完全に動く。
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MAX_EXAMPLES = 15;

// エンティティ種別 → KVキー
const COLLECTIONS = {
  tests:         'kv_tests',
  findings:      'kv_findings',
  diseases:      'kv_diseases',
  pathways:      'kv_pathways',
  presentations: 'kv_presentations',
};
const MAPS = {
  groups:  'kv_groups',
  ref:     'kv_ref',
  labinfo: 'kv_labinfo',
};

const cors = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-App-Password, X-Admin-Password',
});

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json', ...cors() },
  });

const getArr = async (env, key) => JSON.parse((await env.ATLAS_KV.get(key)) || '[]');
const getObj = async (env, key) => JSON.parse((await env.ATLAS_KV.get(key)) || '{}');

async function callGroq(env, messages, model = 'llama-3.3-70b-versatile', maxTokens = 1200) {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.GROQ_API_KEY}` },
    body: JSON.stringify({ model, messages, temperature: 0, max_tokens: maxTokens }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Groq ${res.status}`);
  return data.choices?.[0]?.message?.content || '';
}

export default {
  async fetch(request, env) {
    try { return await handle(request, env); }
    catch (e) { return json({ error: `Internal error: ${e.message}` }, 500); }
  },
};

async function handle(request, env) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: cors() });

  const pw      = request.headers.get('X-App-Password') || '';
  const adminPw = request.headers.get('X-Admin-Password') || '';
  const isUser  = !!env.APP_PASSWORD && pw === env.APP_PASSWORD;
  const isAdmin = !!env.ADMIN_PASSWORD && adminPw === env.ADMIN_PASSWORD;
  if (!isUser && !isAdmin) return json({ error: 'Unauthorized' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const action = body.action || 'ping';

  // ════════ 一般ユーザーも使えるアクション ════════

  if (action === 'ping') return json({ ok: true, admin: isAdmin });

  /** マスターデータ（オーバーライド）を一括取得。アプリ起動時に呼ぶ。 */
  if (action === 'kv_get_overrides') {
    const out = { __source: 'kv' };
    for (const [k, key] of Object.entries(COLLECTIONS)) out[k.toUpperCase()] = await getArr(env, key);
    out.GROUPS   = await getObj(env, MAPS.groups);
    out.REF      = await getObj(env, MAPS.ref);
    out.LAB_INFO = await getObj(env, MAPS.labinfo);
    return json({ ok: true, data: out });
  }

  /** Groqへ素通し（自動読み取りのテキスト抽出に使う） */
  if (action === 'chat') {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: body.model || 'llama-3.3-70b-versatile',
        messages: body.messages,
        temperature: body.temperature ?? 0,
        max_tokens: body.max_tokens ?? 1200,
      }),
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status, headers: { 'Content-Type': 'application/json', ...cors() },
    });
  }

  /** 画像をGroqビジョンで直接読み取る */
  if (action === 'vision') {
    const { base64, mimeType, prompt } = body;
    if (!base64) return json({ error: 'Missing base64' }, 400);
    try {
      const raw = await callGroq(env, [{
        role: 'user',
        content: [
          { type: 'text', text: prompt || '画像内の臨床検査値をJSONで返してください。' },
          { type: 'image_url', image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${base64}` } },
        ],
      }], 'meta-llama/llama-4-scout-17b-16e-instruct', 1200);
      return json({ ok: true, content: raw });
    } catch (e) { return json({ error: e.message }, 502); }
  }

  /** 自動読み取りのfew-shot例 */
  if (action === 'get_examples') return json({ examples: await getArr(env, 'examples') });
  if (action === 'save_example') {
    const { inputSnippet, parsedValues } = body;
    if (!inputSnippet || !parsedValues) return json({ error: 'Missing fields' }, 400);
    const ex = await getArr(env, 'examples');
    const i = ex.findIndex((e) => e.inputSnippet === inputSnippet);
    if (i >= 0) ex[i] = { ...ex[i], parsedValues, updatedAt: Date.now() };
    else ex.push({ inputSnippet, parsedValues, savedAt: Date.now() });
    const trimmed = ex.slice(-MAX_EXAMPLES);
    await env.ATLAS_KV.put('examples', JSON.stringify(trimmed));
    return json({ ok: true, count: trimmed.length });
  }

  // ════════ ここから管理者専用 ════════
  if (!isAdmin) return json({ error: 'Admin required' }, 403);

  if (action === 'admin_ping') return json({ ok: true, message: '管理者認証成功' });

  /**
   * 単一エンティティの追加・更新
   * body: { collection: 'tests'|'findings'|'diseases'|'pathways'|'presentations', item: {...} }
   */
  if (action === 'kv_upsert') {
    const { collection, item } = body;
    const key = COLLECTIONS[collection];
    if (!key) return json({ error: `Unknown collection: ${collection}` }, 400);
    if (!item?.id) return json({ error: 'Missing item.id' }, 400);
    const list = await getArr(env, key);
    const i = list.findIndex((x) => x.id === item.id);
    if (i >= 0) list[i] = item; else list.push(item);
    await env.ATLAS_KV.put(key, JSON.stringify(list));
    return json({ ok: true, action: i >= 0 ? 'updated' : 'created', id: item.id });
  }

  /** 静的データの id を「削除扱い」にする（tombstone） */
  if (action === 'kv_delete') {
    const { collection, id, hard } = body;
    const key = COLLECTIONS[collection];
    if (!key || !id) return json({ error: 'Missing collection or id' }, 400);
    let list = await getArr(env, key);
    if (hard) list = list.filter((x) => x.id !== id);       // KV上の追加分を消すだけ
    else {                                                   // 静的データごと隠す
      const i = list.findIndex((x) => x.id === id);
      const tomb = { id, __deleted: true };
      if (i >= 0) list[i] = tomb; else list.push(tomb);
    }
    await env.ATLAS_KV.put(key, JSON.stringify(list));
    return json({ ok: true, deleted: id, hard: !!hard });
  }

  /** GROUPS / REF / LAB_INFO のキー単位の更新 */
  if (action === 'kv_upsert_map') {
    const { map, key: k, value } = body;
    const kvKey = MAPS[map];
    if (!kvKey || !k) return json({ error: 'Missing map or key' }, 400);
    const obj = await getObj(env, kvKey);
    if (value === null) delete obj[k]; else obj[k] = value;
    await env.ATLAS_KV.put(kvKey, JSON.stringify(obj));
    return json({ ok: true, map, key: k });
  }

  /**
   * まとめて反映（Claudeが出力したJSONをそのまま貼り付ける用）
   * body: { patch: { TESTS:[], FINDINGS:[], DISEASES:[], PATHWAYS:[], PRESENTATIONS:[], GROUPS:{}, REF:{}, LAB_INFO:{} } }
   * 各配列は id で upsert、各オブジェクトはキーでマージする。
   */
  if (action === 'kv_bulk_patch') {
    const patch = body.patch || {};
    const report = {};
    for (const [name, key] of Object.entries(COLLECTIONS)) {
      const incoming = patch[name.toUpperCase()];
      if (!Array.isArray(incoming) || !incoming.length) continue;
      const list = await getArr(env, key);
      const m = new Map(list.map((x) => [x.id, x]));
      for (const item of incoming) {
        if (!item?.id) continue;
        m.set(item.id, item);
      }
      const merged = [...m.values()];
      await env.ATLAS_KV.put(key, JSON.stringify(merged));
      report[name] = { received: incoming.length, total: merged.length };
    }
    for (const [name, key] of Object.entries(MAPS)) {
      const incoming = patch[name.toUpperCase()] || patch[name === 'labinfo' ? 'LAB_INFO' : name.toUpperCase()];
      if (!incoming || typeof incoming !== 'object' || !Object.keys(incoming).length) continue;
      const obj = await getObj(env, key);
      Object.assign(obj, incoming);
      await env.ATLAS_KV.put(key, JSON.stringify(obj));
      report[name] = { received: Object.keys(incoming).length, total: Object.keys(obj).length };
    }
    await env.ATLAS_KV.put('kv_meta', JSON.stringify({ updatedAt: Date.now() }));
    return json({ ok: true, report });
  }

  /** KVのオーバーライドを全消去（静的データだけの状態に戻す） */
  if (action === 'kv_reset') {
    for (const key of [...Object.values(COLLECTIONS)]) await env.ATLAS_KV.put(key, '[]');
    for (const key of [...Object.values(MAPS)]) await env.ATLAS_KV.put(key, '{}');
    return json({ ok: true, message: 'KVのオーバーライドを全消去しました' });
  }

  return json({ error: `Unknown action: ${action}` }, 400);
}
