// src/components/AdminPanel.jsx
// ═══════════════════════════════════════════════════════════════════════
//  管理パネル ― KVに対して疾患・検査・所見などを追加/編集する（管理者専用）
// ═══════════════════════════════════════════════════════════════════════
//  2つの入力経路を用意している:
//    A) フォーム編集    … 1件ずつ、フィールドを埋めて upsert
//    B) 一括パッチ貼付  … Claudeが出力したJSONをそのまま貼って反映
//  さらに、現在のKVオーバーライドを「貼り戻せるJSON」として書き出せる（エクスポート）。
//
//  KVは静的データへの“差分”だけを持つ。ここでの編集は静的ファイルを壊さない。
//  ローカルへ恒久反映したいときは `node scripts/apply-kv.mjs` を叩く（README参照）。
import React, { useState, useEffect } from 'react';
import {
  kvUpsert, kvDelete, kvUpsertMap, kvBulkPatch, kvReset,
  loadOverrides, exportPatch, logout, getAdminPw,
} from '../lib/masterData.js';

const COLLECTIONS = [
  { id: 'diseases',      label: '疾患' },
  { id: 'tests',         label: '検査' },
  { id: 'findings',      label: '所見' },
  { id: 'presentations', label: '入口（主訴・異常）' },
  { id: 'pathways',      label: '鑑別路' },
];

// ─────────────────────────────────────────────────────
//  Claudeに渡すためのフォーマット説明（コピー可能）
// ─────────────────────────────────────────────────────
const CLAUDE_FORMAT = `あなたは臨床鑑別アトラスのデータ編集者です。以下のJSON“だけ”を出力してください。
各配列はidで upsert（既存idは上書き）されます。GROUPS/REF/LAB_INFOはキーでマージされます。
要素に "__deleted": true を付けると、その id を削除できます。

{
  "TESTS": [
    { "id": "英数字ID", "name": "表示名", "abbr": "略号", "modality": "blood|urine|physical|physiology|imaging|pathology|function|genetic",
      "system": "診療系統", "defaultLayer": 1, "valued": true, "refKey": "REFのキー",
      "panel": ["構成TestId", "..."], "findings": ["この検査が生むFindingId"] }
  ],
  "FINDINGS": [
    { "id": "英数字ID", "testId": "親TestId", "label": "所見名", "direction": "low|high|normal|present",
      "meaning": "何を意味するか（機序）。必ず書く", "layerHint": 1 }
  ],
  "DISEASES": [
    { "id": "英数字ID", "name": "疾患名", "system": "診療系統", "group": "GROUPSのキー",
      "oneLiner": "一言要約",
      "keyFindings": [ { "finding": "FindingId", "layer": 1, "role": "rule_in|rule_out|support", "required": true } ],
      "confirm": "確定に使うTestIdまたはFindingId", "confirmNote": "確定の考え方",
      "mechanism": "病態機序", "typical": { "REFキー": 数値 } }
  ],
  "PRESENTATIONS": [
    { "id": "英数字ID", "label": "入口名", "kind": "complaint|abnormality", "system": "診療系統",
      "firstTests": "最初にやる検査の説明", "pathwayId": "対応するpathwayのid" }
  ],
  "GROUPS": { "grp_xxx": "疾患群の表示名" },
  "REF": { "キー": { "label": "名称", "abbr": "略号", "unit": "単位", "min": 0, "max": 0, "group": "分野" } },
  "LAB_INFO": { "キー": { "label": "名称", "overview": "概要", "mechanism": "機序",
                         "highDiseases": [{"name":"…","mechanism":"…"}], "lowDiseases": [] } }
}

不要なトップレベルキーは省略可。説明文やコードブロックは付けず、JSONのみを返してください。`;

export default function AdminPanel({ onDataChanged }) {
  const [tab, setTab] = useState('form');
  const [collection, setCollection] = useState('diseases');
  const [overrides, setOverrides] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const refresh = async () => {
    const ov = await loadOverrides();
    setOverrides(ov);
    onDataChanged?.();
  };
  useEffect(() => { refresh(); }, []);

  const flash = (m, isErr) => {
    if (isErr) { setErr(m); setMsg(''); } else { setMsg(m); setErr(''); }
    setTimeout(() => { setMsg(''); setErr(''); }, 3500);
  };

  return (
    <div className="admin">
      <div className="row-wrap" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="h-eyebrow" style={{ margin: 0 }}>管理</p>
          <h2 className="h-title" style={{ margin: '2px 0 0' }}>マスターデータの編集</h2>
        </div>
        <button className="togglebtn" onClick={() => { logout(); onDataChanged?.(); }}>ログアウト</button>
      </div>
      <p className="lead">
        ここでの編集は<b>KV上の“差分”</b>として保存され、静的ファイルは書き換わりません。
        アプリを再読み込みすると反映されます。ローカルのソースへ恒久反映するには
        <code>node scripts/apply-kv.mjs</code> を実行してください。
      </p>

      <div className="row-wrap" style={{ margin: '10px 0 16px' }}>
        {[['form', '📝 フォーム編集'], ['bulk', '📋 一括貼り付け（Claude）'], ['export', '⬇ エクスポート'], ['danger', '⚠ リセット']].map(([id, label]) => (
          <button key={id} className={`togglebtn${tab === id ? ' on' : ''}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {msg && <div className="banner ok">{msg}</div>}
      {err && <div className="banner err">{err}</div>}

      {tab === 'form' && (
        <FormEditor collection={collection} setCollection={setCollection} overrides={overrides}
                    onSaved={(m) => { flash(m); refresh(); }} onError={(m) => flash(m, true)} />
      )}

      {tab === 'bulk' && (
        <BulkPaste onDone={(m) => { flash(m); refresh(); }} onError={(m) => flash(m, true)} />
      )}

      {tab === 'export' && <ExportView overrides={overrides} />}

      {tab === 'danger' && (
        <div className="card pad">
          <p className="h-eyebrow">KVのオーバーライドを全消去</p>
          <p className="small muted">静的データ（ソースに書かれた内容）はそのまま残ります。KVで追加/上書き/削除した分だけが消えます。</p>
          <button className="btn-danger" onClick={async () => {
            if (!confirm('KV上の全オーバーライドを消去します。よろしいですか？')) return;
            try { await kvReset(); flash('KVをリセットしました'); refresh(); }
            catch (e) { flash(e.message, true); }
          }}>すべて消去する</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  A) フォーム編集
// ─────────────────────────────────────────────────────
const TEMPLATES = {
  diseases: { id: '', name: '', system: '', group: '', oneLiner: '', mechanism: '', confirm: '', confirmNote: '',
    keyFindings: [{ finding: '', layer: 1, role: 'rule_in', required: false }], typical: {} },
  tests: { id: '', name: '', abbr: '', modality: 'blood', system: '', defaultLayer: 1, valued: true, refKey: '' },
  findings: { id: '', testId: '', label: '', direction: 'present', meaning: '', layerHint: 1 },
  presentations: { id: '', label: '', kind: 'complaint', system: '', firstTests: '', pathwayId: '' },
  pathways: { id: '', title: '', system: '', entryId: '', summary: '', root: {} },
};

function FormEditor({ collection, setCollection, overrides, onSaved, onError }) {
  const [json, setJson] = useState(() => JSON.stringify(TEMPLATES[collection], null, 2));
  const existing = overrides?.[collection.toUpperCase()] || [];

  const pick = (c) => { setCollection(c); setJson(JSON.stringify(TEMPLATES[c], null, 2)); };
  const loadItem = (item) => setJson(JSON.stringify(item, null, 2));

  const save = async () => {
    let item;
    try { item = JSON.parse(json); } catch (e) { return onError('JSONが不正です: ' + e.message); }
    if (!item.id) return onError('id は必須です');
    try {
      const r = await kvUpsert(collection, item);
      onSaved(`${collection} を${r.action === 'created' ? '追加' : '更新'}しました（id: ${r.id}）`);
    } catch (e) { onError(e.message); }
  };
  const del = async () => {
    let item; try { item = JSON.parse(json); } catch { return onError('idを含む正しいJSONにしてください'); }
    if (!item.id) return onError('id が必要です');
    if (!confirm(`${collection} の "${item.id}" を削除（非表示化）します。よろしいですか？`)) return;
    try { await kvDelete(collection, item.id); onSaved(`${item.id} を削除しました`); }
    catch (e) { onError(e.message); }
  };

  return (
    <div className="grid cols-2">
      <div className="card pad">
        <div className="row-wrap" style={{ marginBottom: 10 }}>
          {COLLECTIONS.map((c) => (
            <button key={c.id} className={`togglebtn${collection === c.id ? ' on' : ''}`} onClick={() => pick(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: 0 }}>
          値を直接編集して保存します。フィールドの意味は
          <code>docs/ADD_DISEASE.md</code> を参照。
        </p>
        <textarea className="codearea" rows={20} value={json} onChange={(e) => setJson(e.target.value)} spellCheck={false} />
        <div className="row-wrap" style={{ marginTop: 10 }}>
          <button className="btn-primary" onClick={save}>保存（追加・更新）</button>
          <button className="btn-danger" onClick={del}>削除</button>
          <button className="togglebtn" onClick={() => setJson(JSON.stringify(TEMPLATES[collection], null, 2))}>テンプレに戻す</button>
        </div>
      </div>

      <div className="card pad">
        <p className="h-eyebrow">KVで編集済みの {COLLECTIONS.find((c) => c.id === collection)?.label}（{existing.length}）</p>
        {existing.length === 0 && <p className="small muted">まだこの種別のオーバーライドはありません。</p>}
        <div style={{ maxHeight: 460, overflow: 'auto' }}>
          {existing.map((it) => (
            <div key={it.id} className="status-row" style={{ justifyContent: 'space-between' }}>
              <button className="backlink" onClick={() => loadItem(it)}>
                {it.__deleted ? '🗑 ' : ''}{it.name || it.label || it.title || it.id}
              </button>
              <span className="small muted">{it.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  B) 一括貼り付け（Claude出力をそのまま反映）
// ─────────────────────────────────────────────────────
function BulkPaste({ onDone, onError }) {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const apply = async () => {
    let patch;
    try {
      const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      patch = JSON.parse(clean);
    } catch (e) { return onError('JSONが不正です: ' + e.message); }
    try {
      const r = await kvBulkPatch(patch);
      const summary = Object.entries(r.report || {}).map(([k, v]) => `${k}: ${v.received}件`).join(' / ') || '変更なし';
      onDone(`反映しました（${summary}）`);
      setText('');
    } catch (e) { onError(e.message); }
  };

  const copyFormat = () => {
    navigator.clipboard?.writeText(CLAUDE_FORMAT);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid cols-2">
      <div className="card pad">
        <p className="h-eyebrow">Claudeの出力JSONを貼り付け</p>
        <p className="small muted" style={{ marginTop: 0 }}>
          右のフォーマットをClaudeに渡し、返ってきたJSONをここに貼って「反映」を押します。
          コードブロック記法（```）が付いていても除去されます。
        </p>
        <textarea className="codearea" rows={18} value={text} onChange={(e) => setText(e.target.value)}
                  placeholder='{ "DISEASES": [ ... ], "FINDINGS": [ ... ] }' spellCheck={false} />
        <div className="row-wrap" style={{ marginTop: 10 }}>
          <button className="btn-primary" onClick={apply}>KVへ反映</button>
        </div>
      </div>
      <div className="card pad">
        <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
          <p className="h-eyebrow" style={{ margin: 0 }}>Claudeに渡すフォーマット</p>
          <button className="togglebtn" onClick={copyFormat}>{copied ? '✓ コピーしました' : 'コピー'}</button>
        </div>
        <pre className="pre-scroll" style={{ maxHeight: 460 }}>{CLAUDE_FORMAT}</pre>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  C) エクスポート
// ─────────────────────────────────────────────────────
function ExportView({ overrides }) {
  const [copied, setCopied] = useState(false);
  const patchJson = exportPatch(overrides);
  const copy = () => { navigator.clipboard?.writeText(patchJson); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const download = () => {
    const blob = new Blob([patchJson], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'atlas-overrides.json';
    a.click();
  };
  return (
    <div className="card pad">
      <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
        <p className="h-eyebrow" style={{ margin: 0 }}>現在のKVオーバーライド</p>
        <div className="row-wrap">
          <button className="togglebtn" onClick={copy}>{copied ? '✓ コピー' : 'コピー'}</button>
          <button className="btn-primary" onClick={download}>JSONをダウンロード</button>
        </div>
      </div>
      <p className="small muted">
        これは <code>src/data/overrides.generated.js</code> に貼り込める形式です。
        通常は <code>node scripts/apply-kv.mjs</code> が自動でこれを取得してローカルへ書き込みます。
      </p>
      <pre className="pre-scroll" style={{ maxHeight: 480 }}>{patchJson}</pre>
    </div>
  );
}
