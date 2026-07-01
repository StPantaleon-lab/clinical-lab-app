// src/components/AutoInput.jsx
import { useState, useRef } from 'react';
import { extractLabValuesWithAI, extractLabValuesFromImage, extractLabValuesRuleBased, saveExample } from '../lib/parseLabValues.js';
import { REF } from '../data/referenceRanges.js';

const SOURCE_LABEL = {
  ollama: "🖥️ ローカルAI",
  groq: "☁️ Groq AI",
  rule: "📐 ルールベース",
  "ollama-vision": "🖥️ ローカルAI（画像）",
  error: "⚠️ エラー",
};

const S = {
  wrap: { background: '#fff', borderRadius: 14, padding: '20px 20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', marginBottom: 16 },
  tab: (a) => ({ padding: '6px 14px', borderRadius: 8, border: '1.5px solid', borderColor: a ? '#3b82f6' : '#e2e8f0', background: a ? '#eff6ff' : 'white', color: a ? '#1d4ed8' : '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }),
  btn: (c) => ({ padding: '9px 20px', borderRadius: 8, background: c === 'blue' ? '#2563eb' : c === 'green' ? '#16a34a' : '#f1f5f9', color: c === 'blue' || c === 'green' ? 'white' : '#475569', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }),
};

export default function AutoInput({ onApply, password }) {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [imageB64, setImageB64] = useState(null);
  const [imageMime, setImageMime] = useState("image/jpeg");
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  // フォーマット学習
  const [teachMode, setTeachMode] = useState(false);
  const [snippet, setSnippet] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setImageMime(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target.result;
      setImagePreview(url);
      setImageB64(url.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const run = async () => {
    setError(''); setResult(null); setLoading(true); setTeachMode(false); setSaveMsg('');
    try {
      let parsed;
      if (mode === 'text') {
        if (!text.trim()) { setError('テキストを入力してください。'); setLoading(false); return; }
        parsed = await extractLabValuesWithAI(text, password);
        setSnippet(text.slice(0, 300)); // スニペットとして先頭300文字を保持
      } else {
        if (!imageB64) { setError('画像をアップロードしてください。'); setLoading(false); return; }
        parsed = await extractLabValuesFromImage(imageB64, imageMime, password);
        if (parsed.source === 'error') { setError(parsed.errorMessage || "画像解析に失敗しました。"); setLoading(false); return; }
      }
      setResult(parsed);
    } catch (e) {
      setError(`エラー: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyAll = () => {
    if (!result) return;
    onApply(result.values, result.sex);
    setResult(null); setText(''); setImageB64(null); setImagePreview(null); setTeachMode(false);
  };

  // 現在の入力値（反映後）を正解として保存
  const handleTeachSave = async (correctedValues) => {
    if (!snippet || Object.keys(correctedValues).length === 0) return;
    setSaving(true);
    const ok = await saveExample(snippet, correctedValues, password);
    setSaveMsg(ok ? `✅ ${Object.keys(correctedValues).length}件のパターンを保存しました。次回から参考にされます。` : "⚠️ 保存に失敗しました。");
    setSaving(false);
    setTeachMode(false);
  };

  return (
    <div style={S.wrap}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>📄</span> 検査結果の自動読み取り
        <span style={{ fontSize: 11, fontWeight: 400, color: '#94a3b8' }}>
          （ローカルAI → Groq AI → ルールベースの順）
          {result?.examples?.length > 0 && <span style={{ color: '#7c3aed' }}>　📚 学習済み{result.examples.length}件参照中</span>}
        </span>
      </h3>

      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        <button style={S.tab(mode === 'text')}  onClick={() => setMode('text')}>📝 テキスト貼り付け</button>
        <button style={S.tab(mode === 'image')} onClick={() => setMode('image')}>🖼️ 画像アップロード</button>
      </div>

      {mode === 'text' ? (
        <textarea
          style={{ width: '100%', minHeight: 110, padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, lineHeight: 1.6, resize: 'vertical', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }}
          placeholder={"例：\nWBC 8.5  RBC 4.23  Hb 12.3\nAST 45  ALT 67  γ-GTP 89\n\n健康診断の結果表や国試問題文をそのまま貼り付けてください"}
          value={text}
          onChange={e => setText(e.target.value)}
        />
      ) : (
        <>
          <div
            style={{ border: `2px dashed ${dragging ? '#3b82f6' : '#cbd5e1'}`, borderRadius: 12, padding: '28px 16px', textAlign: 'center', background: dragging ? '#eff6ff' : '#f8fafc', cursor: 'pointer', transition: 'all 0.2s' }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current.click()}
          >
            {imagePreview
              ? <img src={imagePreview} alt="preview" style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 8 }} />
              : <><div style={{ fontSize: 32, marginBottom: 6 }}>📂</div><p style={{ color: '#64748b', fontSize: 13 }}>クリックまたはドラッグ＆ドロップ</p><p style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>※ 画像解析はローカルOllama（llavaモデル）が必要です</p></>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
          {imagePreview && <button style={{ ...S.btn('gray'), marginTop: 8, fontSize: 12 }} onClick={() => { setImageB64(null); setImagePreview(null); }}>✕ クリア</button>}
        </>
      )}

      <button style={{ ...S.btn('blue'), marginTop: 12 }} onClick={run} disabled={loading}>
        {loading ? '⏳ 解析中...' : '🔍 検査値を自動抽出'}
      </button>

      {error && <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2', borderRadius: 10, border: '1px solid #fca5a5', fontSize: 13, color: '#b91c1c' }}>⚠️ {error}</div>}

      {result && (
        <div style={{ marginTop: 14, padding: '14px', background: '#f0fdf4', borderRadius: 10, border: '1px solid #86efac' }}>
          {/* 結果ヘッダー */}
          <div style={{ fontWeight: 700, fontSize: 13, color: '#166534', marginBottom: 10, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            ✅ {Object.keys(result.values).length}件の検査値を検出
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: '#dcfce7', color: '#166534' }}>
              {SOURCE_LABEL[result.source] || result.source}
            </span>
            {result.sex && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: '#eff6ff', color: '#1d4ed8' }}>性別: {result.sex === 'female' ? '女性' : '男性'}</span>}
            {result.confidence && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: '#fef9c3', color: '#713f12' }}>信頼度: {result.confidence === 'high' ? '高' : result.confidence === 'medium' ? '中' : '低'}</span>}
          </div>

          {/* 抽出値チップ */}
          <div style={{ marginBottom: 12 }}>
            {Object.entries(result.values).map(([k, v]) => (
              <span key={k} style={{ display: 'inline-block', padding: '2px 9px', margin: '2px 3px', borderRadius: 20, background: '#dcfce7', color: '#166534', fontSize: 11, fontWeight: 600, border: '1px solid #86efac' }}>
                {REF[k]?.abbr || k}: {v}
              </span>
            ))}
          </div>

          {result.unparsed?.length > 0 && (
            <div style={{ fontSize: 12, color: '#92400e', marginBottom: 10 }}>⚠️ 解析できなかった項目: {result.unparsed.join('、')}</div>
          )}

          {/* アクションボタン */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={applyAll} style={S.btn('green')}>
              📋 この値を全て反映する
            </button>
            <button
              onClick={() => setTeachMode(v => !v)}
              style={{ ...S.btn('gray'), background: teachMode ? '#fef9c3' : '#f1f5f9', color: teachMode ? '#713f12' : '#475569' }}
            >
              📚 取りこぼしを教える
            </button>
            <button onClick={() => setResult(null)} style={S.btn('gray')}>キャンセル</button>
          </div>

          {/* 学習モード */}
          {teachMode && (
            <TeachPanel
              currentValues={result.values}
              onSave={handleTeachSave}
              saving={saving}
            />
          )}

          {saveMsg && (
            <div style={{ marginTop: 10, padding: '8px 12px', background: '#f0fdf4', borderRadius: 8, fontSize: 13, color: '#166534' }}>
              {saveMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── 取りこぼし教示パネル ────────────────────────────────────────
function TeachPanel({ currentValues, onSave, saving }) {
  const [edits, setEdits] = useState({ ...currentValues });
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');

  const addEntry = () => {
    if (!newKey || !newVal) return;
    const key = newKey.trim();
    if (REF[key] === undefined) {
      alert(`「${key}」はこのアプリで対応していない検査値キーです。`);
      return;
    }
    setEdits(prev => ({ ...prev, [key]: newVal.trim() }));
    setNewKey(''); setNewVal('');
  };

  const removeEntry = (k) => setEdits(prev => { const n = { ...prev }; delete n[k]; return n; });

  return (
    <div style={{ marginTop: 14, padding: '14px', background: '#fefce8', borderRadius: 10, border: '1px solid #fde047' }}>
      <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#713f12' }}>
        📚 取りこぼした検査値を追加してください。保存すると次回から自動で参照されます。
      </p>

      {/* 現在の値（削除可能） */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {Object.entries(edits).map(([k, v]) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, background: '#dcfce7', border: '1px solid #86efac', fontSize: 12 }}>
            <span style={{ fontWeight: 700 }}>{REF[k]?.abbr || k}</span>: {v}
            <button onClick={() => removeEntry(k)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 12, padding: 0 }}>✕</button>
          </span>
        ))}
      </div>

      {/* 新規追加 */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        <input
          placeholder="キー（例: TSH）"
          value={newKey}
          onChange={e => setNewKey(e.target.value)}
          style={{ padding: '6px 10px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, width: 120, outline: 'none' }}
        />
        <input
          placeholder="数値（例: 8.2）"
          value={newVal}
          onChange={e => setNewVal(e.target.value)}
          style={{ padding: '6px 10px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, width: 100, outline: 'none' }}
        />
        <button onClick={addEntry} style={{ padding: '6px 14px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          ＋ 追加
        </button>
      </div>

      <button
        onClick={() => onSave(edits)}
        disabled={saving || Object.keys(edits).length === 0}
        style={{ padding: '8px 20px', background: saving ? '#94a3b8' : '#7c3aed', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: saving ? 'default' : 'pointer' }}
      >
        {saving ? '保存中...' : '💾 このパターンを覚えさせる'}
      </button>
    </div>
  );
}
