// src/components/AutoInput.jsx
import { useState, useRef } from 'react';
import { extractLabValuesWithAI, extractLabValuesRuleBased } from '../lib/parseLabValues.js';
import { REF } from '../data/referenceRanges.js';

const S = {
  wrap: { background: '#fff', borderRadius: 14, padding: '20px 20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', marginBottom: 16 },
  h3: { fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 },
  tabs: { display: 'flex', gap: 4, marginBottom: 14 },
  tab: (active) => ({
    padding: '6px 14px', borderRadius: 8, border: '1.5px solid',
    borderColor: active ? '#3b82f6' : '#e2e8f0',
    background: active ? '#eff6ff' : 'white',
    color: active ? '#1d4ed8' : '#64748b',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  }),
  textarea: {
    width: '100%', minHeight: 120, padding: '10px 12px',
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    fontSize: 13, lineHeight: 1.6, resize: 'vertical',
    fontFamily: 'monospace', outline: 'none',
  },
  dropzone: (dragging) => ({
    border: `2px dashed ${dragging ? '#3b82f6' : '#cbd5e1'}`,
    borderRadius: 12, padding: '32px 16px', textAlign: 'center',
    background: dragging ? '#eff6ff' : '#f8fafc', cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  btn: (color) => ({
    marginTop: 12, padding: '9px 20px', borderRadius: 8,
    background: color === 'blue' ? '#2563eb' : '#f1f5f9',
    color: color === 'blue' ? 'white' : '#475569',
    border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer',
  }),
  result: { marginTop: 14, padding: '12px 14px', background: '#f0fdf4', borderRadius: 10, border: '1px solid #86efac' },
  warn: { marginTop: 14, padding: '12px 14px', background: '#fff7ed', borderRadius: 10, border: '1px solid #fed7aa', fontSize: 13, color: '#92400e' },
  err: { marginTop: 14, padding: '12px 14px', background: '#fef2f2', borderRadius: 10, border: '1px solid #fca5a5', fontSize: 13, color: '#b91c1c' },
  chip: (exists) => ({
    display: 'inline-block', padding: '3px 10px', margin: '3px 4px',
    borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: exists ? '#dcfce7' : '#f0fdf4',
    color: exists ? '#166534' : '#4ade80',
    border: '1px solid', borderColor: exists ? '#86efac' : '#bbf7d0',
  }),
};

export default function AutoInput({ onApply }) {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [imageB64, setImageB64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target.result;
      setImagePreview(url);
      // base64 data urlからdata部分のみ抽出
      setImageB64(url.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const run = async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      let parsed;
      if (mode === 'text') {
        if (!text.trim()) { setError('テキストを入力してください。'); setLoading(false); return; }
        try {
          parsed = await extractLabValuesWithAI(text, 'text');
        } catch {
          parsed = extractLabValuesRuleBased(text);
        }
      } else {
        if (!imageB64) { setError('画像をアップロードしてください。'); setLoading(false); return; }
        try {
          parsed = await extractLabValuesWithAI(imageB64, 'image_base64');
        } catch (e) {
          setError(`画像解析エラー: ${e.message}。テキスト貼り付けをお試しください。`);
          setLoading(false); return;
        }
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
    setResult(null); setText(''); setImageB64(null); setImagePreview(null);
  };

  return (
    <div style={S.wrap}>
      <h3 style={S.h3}>
        <span style={{ fontSize: 20 }}>📄</span>
        検査結果の自動読み取り
        <span style={{ fontSize: 11, fontWeight: 400, color: '#94a3b8', marginLeft: 4 }}>
          （テキスト貼り付け or 画像アップロード → AIが自動入力）
        </span>
      </h3>

      {/* モードタブ */}
      <div style={S.tabs}>
        <button style={S.tab(mode === 'text')} onClick={() => setMode('text')}>📝 テキスト貼り付け</button>
        <button style={S.tab(mode === 'image')} onClick={() => setMode('image')}>🖼️ 画像アップロード</button>
      </div>

      {mode === 'text' ? (
        <>
          <textarea
            style={S.textarea}
            placeholder={`例：\nWBC 8.5 ×千/μL　RBC 4.23 ×百万/μL　Hb 12.3 g/dL\nAST 45 U/L　ALT 67 U/L　γ-GTP 89 U/L\nTSH 8.2 μIU/mL　FT4 0.7 ng/dL\n\n健康診断の結果表、国試問題文などをそのまま貼り付けてください`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
            ※ 表記揺れ（GOT/AST、γ-GTP/GGTなど）・スペース・単位の有無を問わず対応します
          </div>
        </>
      ) : (
        <>
          <div
            style={S.dropzone(dragging)}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="preview" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8 }} />
            ) : (
              <>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📂</div>
                <p style={{ color: '#64748b', fontSize: 13 }}>
                  クリックまたはドラッグ＆ドロップで画像をアップロード
                </p>
                <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
                  健診結果・検査報告書・教科書の写真・スクリーンショットなど
                </p>
              </>
            )}
          </div>
          <input
            ref={fileRef} type="file" accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {imagePreview && (
            <button
              style={{ ...S.btn('gray'), marginTop: 8, fontSize: 12 }}
              onClick={() => { setImageB64(null); setImagePreview(null); }}
            >
              ✕ 画像をクリア
            </button>
          )}
        </>
      )}

      <button style={S.btn('blue')} onClick={run} disabled={loading}>
        {loading ? '⏳ AI解析中...' : '🔍 検査値を自動抽出'}
      </button>

      {error && <div style={S.err}>⚠️ {error}</div>}

      {result && (
        <div style={S.result}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#166534', marginBottom: 10 }}>
            ✅ {Object.keys(result.values).length}件の検査値を検出
            <span style={{
              marginLeft: 8, fontSize: 11, padding: '2px 8px', borderRadius: 12,
              background: result.confidence === 'high' ? '#dcfce7' : result.confidence === 'medium' ? '#fef9c3' : '#fee2e2',
              color: result.confidence === 'high' ? '#166534' : result.confidence === 'medium' ? '#713f12' : '#991b1b',
            }}>
              信頼度: {result.confidence === 'high' ? '高' : result.confidence === 'medium' ? '中' : '低'}
            </span>
            {result.sex && (
              <span style={{ marginLeft: 8, fontSize: 11, padding: '2px 8px', borderRadius: 12, background: '#eff6ff', color: '#1d4ed8' }}>
                性別: {result.sex === 'female' ? '女性' : '男性'}
              </span>
            )}
          </div>

          <div style={{ marginBottom: 10 }}>
            {Object.entries(result.values).map(([k, v]) => (
              <span key={k} style={S.chip(true)}>
                {REF[k]?.abbr || k}: {v}
              </span>
            ))}
          </div>

          {result.unparsed.length > 0 && (
            <div style={{ fontSize: 12, color: '#92400e', marginBottom: 10 }}>
              ⚠️ 解析できなかった項目: {result.unparsed.join('、')}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{ padding: '8px 18px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
              onClick={applyAll}
            >
              📋 この値を全て反映する
            </button>
            <button
              style={{ padding: '8px 14px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              onClick={() => setResult(null)}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {!result && !error && (
        <div style={S.warn}>
          💡 <strong>使い方：</strong>
          国試・CBTの問題文や健康診断の結果表をそのままコピー＆ペーストするか、
          検査報告書の写真をアップロードしてください。
          AIが自動で検査値を識別・入力します。
        </div>
      )}
    </div>
  );
}
