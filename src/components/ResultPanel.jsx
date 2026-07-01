// src/components/ResultPanel.jsx
import { useState } from 'react';
import { DISEASES, CATEGORIES } from '../data/diseases.js';
import { evalVal, REF } from '../data/referenceRanges.js';
import { SYMPTOM_GROUPS, SYMPTOM_MAP } from '../data/symptoms.js';
import { scoreDiseases, getRuleOutOpportunities } from '../lib/coverage.js';
import CoveragePanel from './CoveragePanel.jsx';

const CAT_COLOR = {
  '貧血':        { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af' },
  '出血性疾患':  { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' },
  '肝・胆・膵疾患': { bg: '#fef9c3', border: '#fde047', text: '#713f12' },
  '腎疾患':      { bg: '#e0f2fe', border: '#7dd3fc', text: '#0369a1' },
  '代謝疾患':    { bg: '#f0fdf4', border: '#86efac', text: '#166534' },
  '内分泌疾患':  { bg: '#fdf4ff', border: '#e879f9', text: '#7e22ce' },
  '自己免疫疾患':{ bg: '#fff7ed', border: '#fdba74', text: '#c2410c' },
  '感染・炎症':  { bg: '#fef2f2', border: '#fca5a5', text: '#b91c1c' },
  '心疾患':      { bg: '#ffe4e6', border: '#fda4af', text: '#9f1239' },
  '血液腫瘍':    { bg: '#f5f3ff', border: '#c4b5fd', text: '#6d28d9' },
  '腫瘍':        { bg: '#fdf2f8', border: '#f0abfc', text: '#86198f' },
};

// ── スコアバー ────────────────────────────────────────────────────
function ScoreBar({ match, normalOut, opposite, missing, total, symptomCount, symptomTotal }) {
  const pct = total === 0 ? 0 : Math.round(((match.length * 2 - normalOut.length - opposite.length * 2) / (total * 2)) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', width: 100, background: '#f1f5f9' }}>
        <div style={{ flex: match.length,    background: '#22c55e' }} />
        <div style={{ flex: normalOut.length, background: '#f59e0b' }} />
        <div style={{ flex: opposite.length,  background: '#ef4444' }} />
        <div style={{ flex: missing.length,   background: '#e2e8f0' }} />
      </div>
      <span style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>
        <span style={{ color: '#16a34a', fontWeight: 700 }}>✅{match.length}</span>
        {normalOut.length > 0 && <span style={{ color: '#d97706' }}> ⚠️{normalOut.length}</span>}
        {opposite.length > 0  && <span style={{ color: '#dc2626' }}> ❌{opposite.length}</span>}
        <span style={{ color: '#94a3b8' }}> ⬜{missing.length}/{total}</span>
        {symptomTotal > 0 && (
          <span style={{ color: '#7c3aed', marginLeft: 6 }}>🩺{symptomCount}/{symptomTotal}</span>
        )}
      </span>
    </div>
  );
}

// ── 疾患カード ────────────────────────────────────────────────────
function DiseaseCard({ scored, symptoms, toggleSymptom, onShowDetail }) {
  const [open, setOpen] = useState(false);
  const { disease: d, match, missing, normalOut, opposite, total, matchedSymptoms } = scored;
  const col = CAT_COLOR[d.category] || { bg: '#f8fafc', border: '#e2e8f0', text: '#1e293b' };

  return (
    <div style={{ border: `1.5px solid ${col.border}`, borderRadius: 12, marginBottom: 8, background: 'white', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', textAlign: 'left', background: col.bg, border: 'none', padding: '11px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}
      >
        <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{d.name}</span>
        {matchedSymptoms.length > 0 && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: '#7c3aed', color: 'white' }}>
            🩺症候{matchedSymptoms.length}件
          </span>
        )}
        <ScoreBar match={match} normalOut={normalOut} opposite={opposite} missing={missing} total={total}
          symptomCount={matchedSymptoms.length} symptomTotal={d.symptoms.length} />
        <span style={{ fontSize: 11, color: '#94a3b8' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '12px 14px' }}>
          {/* 検査値項目別 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
            {scored.items.map(item => {
              const ref = REF[item.key];
              const s = item.status;
              const style =
                s === 'match'      ? { bg: '#dcfce7', text: '#166534', icon: '✅' } :
                s === 'normal_out' ? { bg: '#fef9c3', text: '#92400e', icon: '⚠️' } :
                s === 'opposite'   ? { bg: '#fee2e2', text: '#991b1b', icon: '❌' } :
                                     { bg: '#f1f5f9', text: '#94a3b8', icon: '⬜' };
              const dirLabel = item.direction === 'high' ? '↑' : item.direction === 'low' ? '↓' : '異常';
              return (
                <span key={item.key} style={{ padding: '2px 8px', borderRadius: 20, background: style.bg, color: style.text, fontSize: 11, fontWeight: 600 }}>
                  {style.icon} {ref?.abbr || item.key}{dirLabel}
                </span>
              );
            })}
          </div>

          {/* 症候チェック */}
          <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>🩺 症候チェック：</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
            {d.symptoms.map(s => (
              <label key={s.key} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <input type="checkbox" checked={!!symptoms[s.key]} onChange={() => toggleSymptom(s.key)}
                  style={{ accentColor: '#7c3aed', width: 13, height: 13 }} />
                <span style={{ fontSize: 12, padding: '2px 9px', borderRadius: 20,
                  background: symptoms[s.key] ? '#ede9fe' : '#f8fafc',
                  color: symptoms[s.key] ? '#6d28d9' : '#475569',
                  fontWeight: symptoms[s.key] ? 700 : 400,
                  border: '1px solid', borderColor: symptoms[s.key] ? '#c4b5fd' : '#e2e8f0' }}>
                  {s.label}
                </span>
              </label>
            ))}
          </div>

          {/* 臨床メモ */}
          <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid #3b82f6', marginBottom: 8 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#334155', lineHeight: 1.7 }}>💬 {d.note}</p>
          </div>
          {d.ruleOutNote && (
            <div style={{ padding: '8px 12px', background: '#fff7ed', borderRadius: 8, borderLeft: '3px solid #f59e0b', marginBottom: 8 }}>
              <p style={{ margin: 0, fontSize: 12, color: '#92400e', lineHeight: 1.7 }}>🔬 <strong>追加検査:</strong> {d.ruleOutNote}</p>
            </div>
          )}

          {/* 疾患詳細へ */}
          {onShowDetail && (
            <button onClick={() => onShowDetail(d.id)} style={{ marginTop: 4, padding: '6px 14px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              📚 疾患詳細を見る →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── 症候パネル ────────────────────────────────────────────────────
function SymptomPanel({ symptoms, toggleSymptom }) {
  const [open, setOpen] = useState(true);
  const checkedCount = Object.values(symptoms).filter(Boolean).length;

  return (
    <div style={{ background: 'white', borderRadius: 14, marginBottom: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
      <button onClick={() => setOpen(v => !v)} style={{ width: '100%', textAlign: 'left', background: '#fdf4ff', border: 'none', padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#7e22ce' }}>
          🩺 症候チェックリスト
          {checkedCount > 0 && <span style={{ marginLeft: 8, fontSize: 12, background: '#7c3aed', color: 'white', padding: '1px 8px', borderRadius: 12 }}>{checkedCount}件チェック中</span>}
        </span>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>{open ? '▲ 閉じる' : '▼ 開く'}</span>
      </button>
      {open && (
        <div style={{ padding: '14px 16px' }}>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: '#64748b' }}>
            該当する症候にチェックを入れると判定スコアに反映されます（検査値7割・症候3割）
          </p>
          {SYMPTOM_GROUPS.map(g => (
            <div key={g.group} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{g.group}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {g.symptoms.map(s => (
                  <label key={s.key} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input type="checkbox" checked={!!symptoms[s.key]} onChange={() => toggleSymptom(s.key)}
                      style={{ accentColor: '#7c3aed', width: 13, height: 13 }} />
                    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20,
                      background: symptoms[s.key] ? '#ede9fe' : '#f8fafc',
                      color: symptoms[s.key] ? '#6d28d9' : '#475569',
                      fontWeight: symptoms[s.key] ? 700 : 400,
                      border: '1px solid', borderColor: symptoms[s.key] ? '#c4b5fd' : '#e2e8f0',
                      transition: 'all 0.15s' }}>
                      {s.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── メイン ────────────────────────────────────────────────────────
export default function ResultPanel({ values, sex, symptoms, toggleSymptom, onShowDiseaseDetail }) {
  const [view, setView] = useState('best');
  const [coverageOpen, setCoverageOpen] = useState(false);

  const entered = Object.keys(values).filter(k => values[k] !== "" && values[k] !== null && values[k] !== undefined);
  const ev = {};
  for (const k of Object.keys(REF)) ev[k] = evalVal(k, values[k], sex);

  const scored = scoreDiseases(values, sex, symptoms);

  const matched = scored.filter(s =>
    s.disease.requiredKeys.every(r => entered.includes(r.key)) &&
    s.disease.conditionFn(values, ev, sex)
  );

  const bestMatch = scored.filter(s => s.match.length > 0 || s.matchedSymptoms.length > 0).slice(0, 10);

  if (entered.length === 0 && Object.values(symptoms).filter(Boolean).length === 0) {
    return (
      <div>
        <SymptomPanel symptoms={symptoms} toggleSymptom={toggleSymptom} />
        <div style={{ background: 'white', borderRadius: 14, padding: '48px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>検査値を入力するか、症候にチェックを入れてください</p>
        </div>
      </div>
    );
  }

  const byCat = {};
  for (const cat of CATEGORIES) byCat[cat] = matched.filter(s => s.disease.category === cat);

  return (
    <div>
      {/* 症候パネル */}
      <SymptomPanel symptoms={symptoms} toggleSymptom={toggleSymptom} />

      {/* 検査値サマリー */}
      {entered.length > 0 && (
        <div style={{ background: 'white', borderRadius: 14, padding: '14px 18px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>📊 入力済み検査値</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {entered.map(k => {
              const e = ev[k];
              const s = e === 'low' ? { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' }
                      : e === 'high' ? { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' }
                      : { bg: '#f0fdf4', text: '#166534', border: '#86efac' };
              return (
                <span key={k} style={{ padding: '2px 9px', borderRadius: 20, background: s.bg, color: s.text, border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 600 }}>
                  {REF[k]?.abbr || k} {values[k]}{e !== 'normal' && (e === 'low' ? ' ↓' : ' ↑')}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* カバレッジ */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setCoverageOpen(v => !v)} style={{ width: '100%', textAlign: 'left', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '9px 14px', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#374151', display: 'flex', justifyContent: 'space-between' }}>
          🗺️ 判定カバレッジ・追加検査の提案
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{coverageOpen ? '▲ 閉じる' : '▼ 開く'}</span>
        </button>
        {coverageOpen && <div style={{ marginTop: 8 }}><CoveragePanel values={values} sex={sex} matchedDiseases={matched.map(s => s.disease)} /></div>}
      </div>

      {/* 表示切り替え */}
      <div style={{ background: 'white', borderRadius: 14, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {[{ id: 'best', label: '🏆 ベストマッチ順' }, { id: 'category', label: '📂 カテゴリ別（確定済み）' }].map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{ padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${view === t.id ? '#3b82f6' : '#e2e8f0'}`, background: view === t.id ? '#eff6ff' : 'white', color: view === t.id ? '#1d4ed8' : '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              {t.label}
            </button>
          ))}
        </div>

        {view === 'best' && (
          <div>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
              検査値一致（70%）＋症候一致（30%）の合計スコア順。
              <strong style={{ color: '#16a34a' }}>✅検査値一致</strong>　
              <strong style={{ color: '#d97706' }}>⚠️正常値が出た</strong>　
              <strong style={{ color: '#dc2626' }}>❌逆方向</strong>　
              <strong style={{ color: '#94a3b8' }}>⬜未検査</strong>　
              <strong style={{ color: '#7c3aed' }}>🩺症候</strong>
            </p>
            {bestMatch.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>一致する検査値・症候が1件もありません。</p>
            ) : (
              bestMatch.map((s, i) => (
                <div key={s.disease.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: i < 3 ? '#f59e0b' : '#cbd5e1', minWidth: 24, marginTop: 12 }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <DiseaseCard scored={s} symptoms={symptoms} toggleSymptom={toggleSymptom} onShowDetail={onShowDiseaseDetail} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {view === 'category' && (
          <div>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
              必要な検査値が全て揃い、かつ判定基準を満たした疾患のみ表示。
            </p>
            {matched.length === 0 ? (
              <div style={{ padding: 24, background: '#f0fdf4', borderRadius: 12, textAlign: 'center', color: '#15803d' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>判定基準を満たす疾患はありません</p>
                <p style={{ fontSize: 12, color: '#4ade80', marginTop: 4 }}>ベストマッチ順で候補を確認できます</p>
              </div>
            ) : (
              CATEGORIES.map(cat => {
                const inCat = byCat[cat];
                if (!inCat || inCat.length === 0) return null;
                const col = CAT_COLOR[cat] || {};
                return (
                  <div key={cat} style={{ marginBottom: 16 }}>
                    <div style={{ padding: '6px 14px', borderRadius: '8px 8px 0 0', background: col.bg || '#f1f5f9', fontSize: 13, fontWeight: 700, color: col.text || '#1e293b', borderBottom: `2px solid ${col.border || '#e2e8f0'}` }}>
                      {cat}（{inCat.length}件）
                    </div>
                    <div style={{ paddingTop: 8 }}>
                      {inCat.map(s => <DiseaseCard key={s.disease.id} scored={s} symptoms={symptoms} toggleSymptom={toggleSymptom} onShowDetail={onShowDiseaseDetail} />)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, padding: '10px 14px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, fontSize: 12, color: '#92400e', lineHeight: 1.7 }}>
        ⚠️ <strong>本ツールは医学教育目的です。</strong>実際の診断・治療は必ず医師の判断によってください。
      </div>
    </div>
  );
}
