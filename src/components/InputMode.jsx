// src/components/InputMode.jsx
// ═══════════════════════════════════════════════════════════════════════
//  検査値入力 ― 入れた値/所見が「鑑別全体のどこに来たか」を示す（最初のタブ）
// ═══════════════════════════════════════════════════════════════════════
//  レイアウトの考え方:
//    分野（血球系・肝機能…）で区切り、その中を
//      L1 最初によくする検査 ／ L2 鑑別のために追加する検査 ／ L3 確定に必要な検査
//    の3列に分ける。「まず何を出し、次に何を足すのか」が入力画面そのもので分かる。
//
//  数値は入力すると 高値(赤)／低値(青)／正常(緑) に着色され、単位と基準範囲が並ぶ。
//  各項目の「概要」は ⓘ で開き、機序と高値/低値で考える疾患まで辿れる。
import React, { useState, useMemo } from 'react';
import { LayerBadge, matches, Empty } from './ui.jsx';
import AutoInput from './AutoInput.jsx';
import { computePosition, computeDerived, evalPatterns } from '../model/engine.js';
import { LAYER_META } from '../model/schema.js';
import { evalVal } from '../data/referenceRanges.js';

const EV_BADGE = { low: '↓低値', high: '↑高値', normal: '正常' };

// ─────────────────────────────────────────────────────
//  数値検査の1マス
// ─────────────────────────────────────────────────────
function LabField({ test, atlas, values, sex, setVal, onOpenDetail }) {
  const key = test.refKey || test.id;
  const ref = atlas.REF[key];
  if (!ref) return null;
  const raw = values[key] ?? '';
  const ev = raw !== '' && raw != null ? evalVal(key, raw, sex) : null;
  const lo = ref.min ?? (sex === 'female' ? ref.femaleMin : ref.maleMin);
  const hi = ref.max ?? (sex === 'female' ? ref.femaleMax : ref.maleMax);
  const info = atlas.LAB_INFO[key];

  return (
    <div className={`labfield ev-${ev || 'none'}`}>
      <div className="labfield__head">
        <span className="labfield__name" title={ref.label}>{ref.abbr || test.abbr || test.id}</span>
        {info && (
          <button className="ibtn" title="この検査の概要・機序を見る" onClick={() => onOpenDetail(key)}>ⓘ</button>
        )}
        {ev && <span className={`evbadge ev-${ev}`}>{EV_BADGE[ev]}</span>}
      </div>
      <div className="labfield__row">
        <input type="number" step="any" value={raw}
               onChange={(e) => setVal(key, e.target.value)} placeholder="—" />
        <span className="labfield__unit">{ref.unit}</span>
      </div>
      <div className="labfield__ref">{lo != null && hi != null ? `基準 ${lo}–${hi}` : '\u00a0'}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  検査値の概要パネル（旧アプリの LabDetail 相当）
// ─────────────────────────────────────────────────────
function LabDetail({ refKey, atlas, onClose }) {
  const ref = atlas.REF[refKey];
  const info = atlas.LAB_INFO[refKey];
  if (!ref) return null;
  const Column = ({ title, items }) =>
    !items?.length ? null : (
      <div>
        <p className="small" style={{ fontWeight: 800, margin: '0 0 6px' }}>{title}</p>
        {items.map((d, i) => (
          <div key={i} className="status-row" style={{ marginBottom: 6, alignItems: 'flex-start' }}>
            <div>
              <div className="s-name" style={{ fontSize: 13.5 }}>{d.name}</div>
              <div className="small muted" style={{ marginTop: 2 }}>{d.mechanism}</div>
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__body card pad" onClick={(e) => e.stopPropagation()}>
        <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>{info?.label || ref.label}</h3>
          <button className="togglebtn" onClick={onClose}>閉じる</button>
        </div>
        <p className="small muted" style={{ marginTop: 4 }}>
          単位 {ref.unit || '—'} ／ 基準 {ref.min ?? ref.maleMin}–{ref.max ?? ref.maleMax}
          {ref.femaleMin != null && `（女性 ${ref.femaleMin}–${ref.femaleMax}）`} ／ 分野 {ref.group}
        </p>
        {info?.overview && <p className="lead" style={{ marginTop: 10 }}>{info.overview}</p>}
        {info?.mechanism && <div className="mech"><b>機序：</b>{info.mechanism}</div>}
        {(info?.highDiseases?.length || info?.lowDiseases?.length) && (
          <div className="grid cols-2" style={{ marginTop: 12 }}>
            <Column title="高値で考える" items={info.highDiseases} />
            <Column title="低値で考える" items={info.lowDiseases} />
          </div>
        )}
        {!info && <p className="small muted">この検査の概要はまだ登録されていません。</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
export default function InputMode({ atlas, onSelectDisease, onSelectTest }) {
  const { TESTS, DISEASES, DERIVED, PATTERNS, testById, REF, GROUP_ORDER } = atlas;
  const [values, setValues] = useState({});
  const [findingsOn, setFindingsOn] = useState(new Set());
  const [sex, setSex] = useState('male');
  const [q, setQ] = useState('');
  const [detailKey, setDetailKey] = useState(null);
  const [showAuto, setShowAuto] = useState(false);

  const setVal = (k, v) => setValues((s) => ({ ...s, [k]: v }));
  const toggle = (id) =>
    setFindingsOn((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const reset = () => { setValues({}); setFindingsOn(new Set()); };

  const applyAuto = (vals, findingIds) => {
    setValues((s) => ({ ...s, ...vals }));
    setFindingsOn((s) => { const n = new Set(s); findingIds.forEach((id) => n.add(id)); return n; });
  };
  const loadTypical = (d) => d.typical && setValues((s) => ({ ...s, ...d.typical }));

  const hitT = (t) =>
    matches(t.name, q) || matches(t.abbr, q) || matches(t.id, q) || matches(t.system, q) ||
    matches(REF[t.refKey || t.id]?.label, q);

  // ── 数値検査を「分野 × レイヤー」に配置 ─────────────
  const byGroup = useMemo(() => {
    const numeric = TESTS
      .filter((t) => t.valued && t.refKey && REF[t.refKey] && t.id !== 'Age')
      .filter(hitT);
    const map = {};
    for (const t of numeric) {
      const g = REF[t.refKey].group || 'その他';
      const L = t.defaultLayer || 2;
      ((map[g] ||= { 1: [], 2: [], 3: [] })[L]).push(t);
    }
    const order = [...(GROUP_ORDER || []), ...Object.keys(map)];
    const seen = new Set();
    return order
      .filter((g) => map[g] && !seen.has(g) && (seen.add(g), true))
      .map((g) => ({ group: g, cols: map[g] }));
  }, [TESTS, REF, GROUP_ORDER, q]);

  // ── 所見系検査（トグル） ─────────────────────────────
  const keywordTests = useMemo(() =>
    TESTS.filter((t) => !t.valued && (t.findings || []).length)
      .filter((t) => hitT(t) || (t.findings || []).some((fid) => matches(atlas.findingById[fid]?.label, q)))
      .sort((a, b) => (a.defaultLayer || 2) - (b.defaultLayer || 2)),
  [TESTS, q, atlas.findingById]);

  const result = useMemo(() => computePosition(atlas, values, sex, findingsOn), [atlas, values, sex, findingsOn]);
  const derived = useMemo(() => computeDerived(DERIVED, values, sex), [DERIVED, values, sex]);
  const { hits: patternHits } = useMemo(() => evalPatterns(PATTERNS, values, sex, testById), [PATTERNS, values, sex, testById]);

  const anyInput = Object.values(values).some((v) => v !== '' && v != null) || findingsOn.size > 0;
  const entered = Object.keys(values).filter((k) => values[k] !== '' && values[k] != null).length;
  const demoDiseases = DISEASES.filter((d) => d.typical).slice(0, 8);

  return (
    <div>
      <p className="h-eyebrow">検査値入力</p>
      <h2 className="h-title">いま鑑別のどこにいる？</h2>
      <p className="lead">
        値や所見を入れると、成立するパターン・算出値と、<b>支持／部分的／矛盾する疾患</b>、
        そして<b>次にやると絞り込みが進む検査</b>を返します。答え合わせではなく、
        入力が鑑別の地図上で自分をどう動かすかを体感するビューです。
      </p>

      {/* 操作バー */}
      <div className="filterbar">
        <div className="field" style={{ maxWidth: 110 }}>
          <label>性別</label>
          <select value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>
        <div className="field" style={{ maxWidth: 100 }}>
          <label>年齢</label>
          <input type="number" value={values.Age || ''} onChange={(e) => setVal('Age', e.target.value)} placeholder="60" />
        </div>
        <input className="searchbox" type="search" value={q} onChange={(e) => setQ(e.target.value)}
               placeholder="検査を絞り込む（例: TSH / 甲状腺 / シンチ）" />
        <button className={`togglebtn${showAuto ? ' on' : ''}`} onClick={() => setShowAuto((v) => !v)}>
          ⚡ 自動読み取り
        </button>
        <button className="togglebtn" onClick={reset}>クリア</button>
        <span className="small muted" style={{ marginLeft: 'auto' }}>{entered} 項目入力中</span>
      </div>

      {showAuto && <AutoInput atlas={atlas} sex={sex} onApply={applyAuto} />}

      {demoDiseases.length > 0 && (
        <div className="row-wrap" style={{ margin: '14px 0' }}>
          <span className="small muted">デモ値を流し込む：</span>
          {demoDiseases.map((d) => (
            <button key={d.id} className="chip clickable" onClick={() => loadTypical(d)}>{d.name}</button>
          ))}
        </div>
      )}

      <div className="grid inputlayout">
        {/* ── 入力側 ── */}
        <div>
          <div className="card pad">
            <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
              <p className="h-eyebrow" style={{ margin: 0 }}>数値検査（分野 × レイヤー）</p>
              <span className="small muted">列は左から L1最初 → L2鑑別 → L3確定</span>
            </div>

            <div className="laneheads">
              {[1, 2, 3].map((L) => (
                <div key={L} className={`lanehead l${L}`}>
                  <LayerBadge layer={L} /><span className="small">{LAYER_META[L].label}</span>
                </div>
              ))}
            </div>

            {byGroup.map(({ group, cols }) => (
              <div key={group} className="labgroup">
                <p className="labgroup__title">{group}</p>
                <div className="lanes">
                  {[1, 2, 3].map((L) => (
                    <div key={L} className={`lane l${L}`}>
                      {cols[L].length === 0
                        ? <span className="lane__empty">—</span>
                        : cols[L].map((t) => (
                            <LabField key={t.id} test={t} atlas={atlas} values={values} sex={sex}
                                      setVal={setVal} onOpenDetail={setDetailKey} />
                          ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {!byGroup.length && <Empty>該当する数値検査がありません。</Empty>}
          </div>

          <div className="card pad" style={{ marginTop: 14 }}>
            <p className="h-eyebrow">所見（画像・身体・病理・生理・遺伝子）</p>
            <p className="small muted" style={{ marginTop: 0 }}>
              名前のついた所見をトグルで入れます。検査名の左のバッジがレイヤーです。
            </p>
            {!keywordTests.length && <Empty>該当する所見検査がありません。</Empty>}
            {keywordTests.map((t) => (
              <div key={t.id} className="obsblock">
                <div className="row-wrap" style={{ gap: 8 }}>
                  <LayerBadge layer={t.defaultLayer || 2} />
                  <button className="backlink" onClick={() => onSelectTest?.(t.id)}>{t.name}</button>
                </div>
                <div className="row-wrap" style={{ marginTop: 5 }}>
                  {(t.findings || []).map((fid) => {
                    const f = atlas.findingById[fid];
                    if (!f) return null;
                    return (
                      <button key={fid} className={`togglebtn${findingsOn.has(fid) ? ' on' : ''}`}
                              onClick={() => toggle(fid)} title={f.meaning}>
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 結果側 ── */}
        <div>
          {!anyInput && (
            <div className="card pad muted">
              値や所見を入力すると、ここに「現在位置」が表示されます。
              上のデモ値ボタン、または「⚡ 自動読み取り」を試してください。
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
                      <div className="small muted">{d.def.formula}</div>
                      {d.text && <div className="small">{d.text}</div>}
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
                <StatusList title="支持される" cls="supported" list={result.supported} onSelectDisease={onSelectDisease} />
                <StatusList title="部分的に合致" cls="partial" list={result.partial} onSelectDisease={onSelectDisease} />
                <StatusList title="矛盾する所見あり" cls="contradicted" list={result.contradicted} onSelectDisease={onSelectDisease} />
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

      {detailKey && <LabDetail refKey={detailKey} atlas={atlas} onClose={() => setDetailKey(null)} />}
    </div>
  );
}

function StatusList({ title, cls, list, onSelectDisease }) {
  if (!list || !list.length) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <p className="small" style={{ fontWeight: 800, margin: '0 0 6px' }}>{title}（{list.length}）</p>
      {list.map((s) => (
        <div key={s.disease.id} className={`status-row ${cls}`}>
          <button className="backlink s-name" onClick={() => onSelectDisease?.(s.disease.id)}>{s.disease.name}</button>
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
