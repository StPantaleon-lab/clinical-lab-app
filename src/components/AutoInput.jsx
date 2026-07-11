// src/components/AutoInput.jsx
// ═══════════════════════════════════════════════════════════════════════
//  自動読み取り ― テキスト/画像から検査値・所見を抽出して「適用」する
// ═══════════════════════════════════════════════════════════════════════
//  ・抽出結果は必ずプレビューし、ユーザーが「適用」を押して初めて入力欄に入る
//  ・誤りは手で直せる（読み取りを盲信させない）
//  ・Workerが未設定でも、ルールベース抽出だけで動く（オフライン動作）
import React, { useState, useRef } from 'react';
import { extractFromText, extractFromImage } from '../lib/parseLabValues.js';
import { hasWorker, saveExample } from '../lib/masterData.js';
import { evalVal } from '../data/referenceRanges.js';

const SOURCE_LABEL = {
  rule: '📐 ルールベース',
  'groq+rule': '☁️ AI＋ルールベース',
  groq: '☁️ AI（テキスト）',
  'groq-vision': '🖼️ AI（画像を直接読み取り）',
};

export default function AutoInput({ atlas, sex, onApply }) {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);          // { b64, mime, preview }
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [ocrPct, setOcrPct] = useState(null);
  const [result, setResult] = useState(null);    // { values, findings, source, ocrText, warning }
  const [error, setError] = useState('');
  const [teach, setTeach] = useState(false);
  const [snippet, setSnippet] = useState('');
  const fileRef = useRef();

  const { REF, findingById } = atlas;

  const readFile = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => {
      const url = e.target.result;
      setImg({ b64: url.split(',')[1], mime: file.type || 'image/jpeg', preview: url });
      setResult(null); setError('');
    };
    r.readAsDataURL(file);
  };

  const run = async () => {
    setError(''); setResult(null); setBusy(true); setOcrPct(null); setTeach(false);
    try {
      let res;
      if (mode === 'text') {
        if (!text.trim()) throw new Error('テキストを入力してください');
        setMsg(hasWorker() ? 'AIで解析中…' : 'ルールベースで解析中…');
        res = await extractFromText(text, atlas);
      } else {
        if (!img) throw new Error('画像を選択してください');
        setMsg('画像をOCR中…（初回は言語データのダウンロードに時間がかかります）');
        res = await extractFromImage(img.b64, img.mime, atlas, {
          onOcrProgress: (p) => setOcrPct(p),
        });
      }
      if (!Object.keys(res.values).length && !res.findings.length) {
        throw new Error('検査値・所見を検出できませんでした。テキストを整形するか、画像を鮮明にしてください。');
      }
      setResult(res);
      setSnippet((res.ocrText || text).slice(0, 120));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false); setMsg(''); setOcrPct(null);
    }
  };

  const apply = () => {
    if (!result) return;
    onApply(result.values, result.findings.map((f) => f.id));
    setMsg(`${Object.keys(result.values).length}件の検査値と${result.findings.length}件の所見を適用しました`);
    setTimeout(() => setMsg(''), 2600);
  };

  const teachSave = async () => {
    try {
      await saveExample(snippet, result.values);
      setMsg('この読み取り例をAIに学習させました（次回以降の精度が上がります）');
      setTeach(false);
      setTimeout(() => setMsg(''), 2600);
    } catch (e) { setError(`保存に失敗: ${e.message}`); }
  };

  const editValue = (k, v) =>
    setResult((r) => ({ ...r, values: { ...r.values, [k]: v === '' ? undefined : parseFloat(v) } }));
  const dropValue = (k) =>
    setResult((r) => { const nv = { ...r.values }; delete nv[k]; return { ...r, values: nv }; });

  return (
    <div className="card pad autoinput">
      <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
        <p className="h-eyebrow" style={{ margin: 0 }}>自動読み取り（テキスト・画像）</p>
        <span className="small muted">
          {hasWorker() ? 'AI抽出が有効' : 'ルールベースのみ（Worker未設定）'}
        </span>
      </div>
      <p className="small muted" style={{ marginTop: 4 }}>
        検査結果を貼り付ける／画像を読み込むと、値と所見を抽出します。
        <b>抽出結果は必ず確認してから「入力欄に適用」を押してください。</b>
      </p>

      <div className="row-wrap" style={{ margin: '10px 0' }}>
        <button className={`togglebtn${mode === 'text' ? ' on' : ''}`} onClick={() => setMode('text')}>📝 テキスト</button>
        <button className={`togglebtn${mode === 'image' ? ' on' : ''}`} onClick={() => setMode('image')}>🖼️ 画像</button>
      </div>

      {mode === 'text' ? (
        <textarea
          className="autoinput__text"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={'例）\nWBC 12.4  Hb 9.8  PLT 88\nAST 180  ALT 70  γ-GTP 420  T-Bil 2.4\n腹部エコー: 胆嚢結石あり、胆管拡張なし'}
        />
      ) : (
        <div
          className={`dropzone${drag ? ' over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); readFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
        >
          {img ? <img src={img.preview} alt="preview" className="dropzone__img" />
               : <p className="small muted">画像をドラッグ＆ドロップ、またはクリックして選択</p>}
          <input ref={fileRef} type="file" accept="image/*" hidden
                 onChange={(e) => readFile(e.target.files[0])} />
        </div>
      )}

      <div className="row-wrap" style={{ marginTop: 10 }}>
        <button className="btn-primary" onClick={run} disabled={busy}>
          {busy ? '解析中…' : '🔍 読み取る'}
        </button>
        {(text || img) && (
          <button className="togglebtn" onClick={() => { setText(''); setImg(null); setResult(null); setError(''); }}>
            クリア
          </button>
        )}
        {ocrPct != null && <span className="small muted">OCR {ocrPct}%</span>}
        {msg && <span className="small ok">{msg}</span>}
        {error && <span className="small err">{error}</span>}
      </div>

      {result && (
        <div className="autoinput__result">
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <p className="h-eyebrow" style={{ margin: 0 }}>
              読み取り結果 <span className="chip">{SOURCE_LABEL[result.source] || result.source}</span>
            </p>
            <button className="btn-primary" onClick={apply}>✅ 入力欄に適用</button>
          </div>
          {result.warning && <p className="small warn">{result.warning}</p>}

          <div className="grid cols-auto" style={{ marginTop: 8 }}>
            {Object.entries(result.values).map(([k, v]) => {
              const ref = REF[k];
              const ev = evalVal(k, v, sex);
              return (
                <div key={k} className={`field ev-${ev || 'none'}`}>
                  <label>
                    {ref?.abbr || k}
                    <button className="xbtn" onClick={() => dropValue(k)} title="この項目を除外">×</button>
                  </label>
                  <input type="number" step="any" value={v ?? ''} onChange={(e) => editValue(k, e.target.value)} />
                  <span className="unit">{ref?.unit}</span>
                </div>
              );
            })}
          </div>

          {result.findings.length > 0 && (
            <>
              <p className="h-eyebrow" style={{ marginTop: 12 }}>検出された所見</p>
              <div className="row-wrap">
                {result.findings.map((f) => (
                  <span key={f.id} className="chip on" title={findingById[f.id]?.meaning}>{f.label}</span>
                ))}
              </div>
            </>
          )}

          {result.ocrText && (
            <details className="disclosure" style={{ marginTop: 10 }}>
              <summary>OCRで読み取った生テキストを確認する</summary>
              <pre className="pre-scroll">{result.ocrText}</pre>
            </details>
          )}

          {hasWorker() && (
            <div style={{ marginTop: 10 }}>
              {!teach ? (
                <button className="backlink" onClick={() => setTeach(true)}>
                  この読み取りをAIに覚えさせる（フォーマット学習）→
                </button>
              ) : (
                <div className="card pad" style={{ marginTop: 6 }}>
                  <p className="small muted" style={{ marginTop: 0 }}>
                    上の値を正しく直したうえで保存すると、同じ書式の検査票の精度が上がります。
                  </p>
                  <textarea rows={3} className="autoinput__text" value={snippet}
                            onChange={(e) => setSnippet(e.target.value)} />
                  <div className="row-wrap" style={{ marginTop: 6 }}>
                    <button className="btn-primary" onClick={teachSave}>この例を保存</button>
                    <button className="togglebtn" onClick={() => setTeach(false)}>やめる</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
