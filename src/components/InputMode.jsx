// src/components/InputMode.jsx
// ═══════════════════════════════════════════════════════════════════════
//  検査値入力 ― 入れた値/所見が「鑑別全体のどこに来たか」を示す
// ═══════════════════════════════════════════════════════════════════════
//  診断名を当てるのが目的ではない。入力するたびに、
//    ・成立しているパターン(ALP+γGTP 等)・算出値(eGFR 等)
//    ・支持/部分的/矛盾する疾患
//    ・次にやると絞り込みが進む検査（レイヤーの若い順）
//  を返し、「今どの段階にいて、次の一手は何か」を体感させる。
import React, { useState, useMemo } from 'react';
import { LayerBadge, BackLink, matches, Empty } from './ui.jsx';
import { computePosition, computeDerived, evalPatterns } from '../model/engine.js';
import { LAYER_META } from '../model/schema.js';

export default function InputMode({ atlas, onSelectDisease, onSelectTest }) {
  const { TESTS, FINDINGS, DISEASES, DERIVED, PATTERNS, testById, diseaseById } = atlas;
  const [values, setValues] = useState({});
  const [findingsOn, setFindingsOn] = useState(new Set());
  const [sex, setSex] = useState('male');
  const [q, setQ] = useState('');

  const hitT = (t) => matches(t.name, q) || matches(t.abbr, q) || matches(t.id, q) || matches(t.system, q);
  // 数値入力対象（valued な検査）。Age は上部に専用フィールドがあるため除く。
  const numericTests = TESTS.filter((t) => t.valued && t.refKey && t.id !== 'Age').filter(hitT);
  // keyword所見（トグル）を検査ごとにまとめる
  const keywordTests = TESTS.filter((t) => !t.valued && (t.findings || []).length)
    .filter((t) => hitT(t) || (t.findings || []).some((fid) => matches(atlas.findingById[fid]?.label, q)));

  const setVal = (k, v) => setValues((s) => ({ ...s, [k]: v }));
  const toggle = (id) =>
    setFindingsOn((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const reset = () => { setValues({}); setFindingsOn(new Set()); };

  // 疾患のtypicalを流し込むデモ
  const loadTypical = (d) => {
    if (!d.typical) return;
    setValues((s) => ({ ...s, ...d.typical }));
  };

  const result = useMemo(
    () => computePosition(atlas, values, sex, findingsOn),
    [atlas, values, sex, findingsOn]
  );
  const derived = useMemo(() => computeDerived(DERIVED, values, sex), [DERIVED, values, sex]);
  const { hits: patternHits } = useMemo(
    () => evalPatterns(PATTERNS, values, sex, testById),
    [PATTERNS, values, sex, testById]
  );

  const anyInput = Object.values(values).some((v) => v !== '' && v != null) || findingsOn.size > 0;
  const demoDiseases = DISEASES.filter((d) => d.typical).slice(0, 6);

  return (
    <div>
      <p className="h-eyebrow">検査値入力</p>
      <h2 className="h-title">いま鑑別のどこにいる？</h2>
      <p className="lead">
        値や所見を入れると、成立するパターン・算出値と、<b>支持／部分的／矛盾する疾患</b>、
        そして<b>次にやると絞り込みが進む検査</b>を返します。答え合わせではなく、
        入力が鑑別の地図上で自分をどう動かすかを体感するビューです。
      </p>

      <div className="row-wrap" style={{ marginBottom: 14 }}>
        <div className="field" style={{ maxWidth: 140 }}>
          <label>性別（基準値・eGFR）</label>
          <select value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>
        <div className="field" style={{ maxWidth: 120 }}>
          <label>年齢（eGFR用）</label>
          <input type="number" value={values.Age || ''} onChange={(e) => setVal('Age', e.target.value)} placeholder="例 60" />
        </div>
        <div className="field" style={{ flex: '1 1 240px' }}>
          <label>検査を絞り込む（項目が多いので検索してください）</label>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)}
                 placeholder="例: TSH / 甲状腺 / 骨髄 / シンチ" />
        </div>
        <button className="togglebtn" onClick={reset} style={{ alignSelf: 'flex-end' }}>クリア</button>
      </div>

      {demoDiseases.length > 0 && (
        <div className="row-wrap" style={{ marginBottom: 16 }}>
          <span className="small muted">デモ値を流し込む：</span>
          {demoDiseases.map((d) => (
            <button key={d.id} className="chip clickable" onClick={() => loadTypical(d)}>{d.name}</button>
          ))}
        </div>
      )}

      <div className="grid cols-2">
        {/* 入力側 */}
        <div>
          <div className="card pad">
            <p className="h-eyebrow">数値検査（{numericTests.length}）</p>
            {!numericTests.length && <Empty>該当する数値検査がありません。</Empty>}
            <div className="grid cols-2">
              {numericTests.map((t) => {
                const hit = values[t.refKey] !== '' && values[t.refKey] != null;
                return (
                  <div className={`field${hit ? ' hit' : ''}`} key={t.id}>
                    <label>{t.abbr || t.name}</label>
                    <input
                      type="number" step="any"
                      value={values[t.refKey] ?? ''}
                      onChange={(e) => setVal(t.refKey, e.target.value)}
                      placeholder={t.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card pad" style={{ marginTop: 14 }}>
            <p className="h-eyebrow">所見（画像・身体・病理・定性）（{keywordTests.length}）</p>
            {!keywordTests.length && <Empty>該当する所見検査がありません。</Empty>}
            {keywordTests.map((t) => (
              <div key={t.id} style={{ marginBottom: 10 }}>
                <p className="small" style={{ fontWeight: 800, margin: '0 0 5px' }}>{t.name}</p>
                <div className="row-wrap">
                  {(t.findings || []).map((fid) => {
                    const f = atlas.findingById[fid];
                    if (!f) return null;
                    return (
                      <button key={fid} className={`togglebtn${findingsOn.has(fid) ? ' on' : ''}`} onClick={() => toggle(fid)} title={f.meaning}>
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 結果側 */}
        <div>
          {!anyInput && (
            <div className="card pad muted">
              値や所見を入力すると、ここに「現在位置」が表示されます。
              上のデモ値ボタンを押すと動きが分かります。
            </div>
          )}

          {anyInput && (
            <>
              {(patternHits.length > 0 || Object.keys(derived).length > 0) && (
                <div className="card pad" style={{ marginBottom: 14 }}>
                  <p className="h-eyebrow">読み取れる組み合わせ・算出値</p>
                  {Object.values(derived).map((d) => (
                    <div className="derived-hit" key={d.def.id} style={{ marginBottom: 8 }}>
                      <b>{d.def.label}</b>：<span className="d-val">{d.value}{d.def.unit ? ` ${d.def.unit}` : ''}</span>
                      {d.text && <div className="small muted">{d.text}</div>}
                    </div>
                  ))}
                  {patternHits.map((p) => (
                    <div className="pattern-hit" key={p.id} style={{ marginBottom: 8 }}>
                      <span className="p-name">{p.label}</span>
                      <div className="small">{p.meaning}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="card pad" style={{ marginBottom: 14 }}>
                <p className="h-eyebrow">疾患との照合</p>
                <StatusList title="支持される" cls="supported" list={result.supported} diseaseById={diseaseById} onSelectDisease={onSelectDisease} />
                <StatusList title="部分的に合致" cls="partial" list={result.partial} diseaseById={diseaseById} onSelectDisease={onSelectDisease} />
                <StatusList title="矛盾する所見あり" cls="contradicted" list={result.contradicted} diseaseById={diseaseById} onSelectDisease={onSelectDisease} />
                {result.supported.length === 0 && result.partial.length === 0 && (
                  <p className="small muted">まだ疾患に触れていません。所見を足すと候補が動きます。</p>
                )}
              </div>

              {result.nextTests.length > 0 && (
                <div className="card pad">
                  <p className="h-eyebrow">次の一手（絞り込みが進む検査）</p>
                  <p className="small muted" style={{ marginTop: 0 }}>レイヤーの若い順（＝先にやるべき順）に並びます。</p>
                  {result.nextTests.slice(0, 8).map((g) => {
                    const t = testById[g.testId];
                    if (!t) return null;
                    return (
                      <div key={g.testId} className="status-row" style={{ marginBottom: 6 }}>
                        <LayerBadge layer={g.layer} />
                        <button className="backlink" onClick={() => onSelectTest?.(t.id)}>{t.name}</button>
                        <span className="small muted" style={{ marginLeft: 'auto' }}>
                          {g.forDiseases.slice(0, 2).join('・')}{g.forDiseases.length > 2 ? ' ほか' : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusList({ title, cls, list, diseaseById, onSelectDisease }) {
  if (!list || !list.length) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <p className="small" style={{ fontWeight: 800, margin: '0 0 6px' }}>{title}（{list.length}）</p>
      {list.map((s) => (
        <div key={s.disease.id} className={`status-row ${cls}`}>
          <button className="backlink s-name" onClick={() => onSelectDisease?.(s.disease.id)}>{s.disease.name}</button>
          <span className="small muted">{s.disease.group && ''}</span>
          <span className="s-bar">
            {[1, 2, 3].map((L) => {
              const rows = s.byLayer[L] || [];
              const met = rows.filter((r) => r.state === 'met').length;
              return Array.from({ length: Math.max(1, rows.length) }).map((_, i) => (
                <span key={L + '-' + i} className={`pip ${i < met ? 'l' + L : 'off'}`} />
              ));
            })}
          </span>
        </div>
      ))}
    </div>
  );
}
