// src/components/CoveragePanel.jsx
import { REF } from '../data/referenceRanges.js';
import { analyzeCoverage, getRuleOutOpportunities, getSuggestedNextTests } from '../lib/coverage.js';

const CATEGORY_COLORS = {
  '貧血': '#dbeafe',
  '出血性疾患': '#fee2e2',
  '肝・胆・膵疾患': '#fef9c3',
  '腎疾患': '#e0f2fe',
  '代謝疾患': '#f0fdf4',
  '内分泌疾患': '#fdf4ff',
  '自己免疫疾患': '#fff7ed',
  '感染・炎症': '#fef2f2',
  '心疾患': '#ffe4e6',
  '血液腫瘍': '#f5f3ff',
  '腫瘍': '#fdf2f8',
};

export default function CoveragePanel({ values, sex, matchedDiseases }) {
  const { evaluable, partial, unevaluable } = analyzeCoverage(values, sex);
  const ruleOutOpps = getRuleOutOpportunities(values, sex, matchedDiseases);
  const suggested = getSuggestedNextTests(values);

  const entered = Object.keys(values).filter(
    (k) => values[k] !== '' && values[k] !== null && values[k] !== undefined
  );

  if (entered.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ─ 判定カバレッジ サマリーバー ─ */}
      <div style={{
        background: 'white', borderRadius: 14, padding: '16px 20px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>
          📊 現在の入力値による判定カバレッジ
        </h3>
        <div style={{ display: 'flex', gap: 2, borderRadius: 8, overflow: 'hidden', height: 16, marginBottom: 12 }}>
          <div
            title={`判定可能: ${evaluable.length}疾患`}
            style={{
              flex: evaluable.length, background: '#22c55e',
              transition: 'flex 0.4s',
            }}
          />
          <div
            title={`一部のみ: ${partial.length}疾患`}
            style={{ flex: partial.length, background: '#f59e0b' }}
          />
          <div
            title={`判定不可: ${unevaluable.length}疾患`}
            style={{ flex: unevaluable.length, background: '#e2e8f0' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#22c55e', display: 'inline-block' }} />
            <strong style={{ color: '#16a34a' }}>{evaluable.length}</strong> 疾患を判定可能
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#f59e0b', display: 'inline-block' }} />
            <strong style={{ color: '#d97706' }}>{partial.length}</strong> 疾患が一部のみ
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#e2e8f0', display: 'inline-block' }} />
            <strong style={{ color: '#94a3b8' }}>{unevaluable.length}</strong> 疾患は判定不可
          </span>
        </div>
      </div>

      {/* ─ 次に追加すると良い検査 ─ */}
      {suggested.length > 0 && (
        <div style={{
          background: 'white', borderRadius: 14, padding: '16px 20px',
          boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
            🎯 追加するとより多くの疾患を判定できる検査
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {suggested.slice(0, 8).map(({ key, diseases }) => (
              <div key={key} style={{
                padding: '8px 12px', borderRadius: 10,
                background: '#eff6ff', border: '1.5px solid #bfdbfe',
                fontSize: 13,
              }}>
                <span style={{ fontWeight: 700, color: '#1d4ed8' }}>
                  {REF[key]?.abbr || key}
                </span>
                <span style={{ color: '#64748b', fontSize: 11, marginLeft: 6 }}>
                  を追加 → {diseases.length}疾患が判定可能に
                </span>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>
                  {diseases.join('・')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─ 陽性疾患の否定に必要な追加検査 ─ */}
      {ruleOutOpps.length > 0 && (
        <div style={{
          background: 'white', borderRadius: 14, padding: '16px 20px',
          boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
            🔬 陽性候補を否定/確定するために追加すべき検査
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ruleOutOpps.map(({ disease, missingRuleOutKeys }) => (
              <div key={disease.id} style={{
                padding: '10px 14px', borderRadius: 10,
                background: '#fff7ed', border: '1px solid #fed7aa',
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', marginBottom: 4 }}>
                  {disease.name}
                </div>
                <div style={{ fontSize: 12, color: '#92400e', marginBottom: 6 }}>
                  {disease.ruleOutNote}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {missingRuleOutKeys.map((k) => (
                    <span key={k} style={{
                      padding: '2px 10px', borderRadius: 20,
                      background: '#fef3c7', border: '1px solid #fcd34d',
                      fontSize: 12, fontWeight: 600, color: '#92400e',
                    }}>
                      + {REF[k]?.abbr || k}（{REF[k]?.label}）
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─ 一部のみ入力済み（あと少しで判定可能）─ */}
      {partial.length > 0 && (
        <div style={{
          background: 'white', borderRadius: 14, padding: '16px 20px',
          boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
            ⚡ あと少しで判定可能になる疾患
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {partial
              .sort((a, b) => a.missing.length - b.missing.length) // 不足が少ない順
              .slice(0, 12)
              .map(({ disease, missing, present }) => {
                const catColor = CATEGORY_COLORS[disease.category] || '#f8fafc';
                return (
                  <div key={disease.id} style={{
                    padding: '10px 14px', borderRadius: 10,
                    background: catColor,
                    border: '1px solid',
                    borderColor: catColor.replace('f', 'e'),
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                    gap: 10,
                  }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>
                        {disease.name}
                      </span>
                      <span style={{ fontSize: 11, color: '#64748b', marginLeft: 8 }}>
                        {disease.category}
                      </span>
                      <div style={{ marginTop: 5, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {present.map((k) => (
                          <span key={k} style={{
                            padding: '1px 8px', borderRadius: 12,
                            background: '#dcfce7', color: '#166534',
                            fontSize: 11, fontWeight: 600,
                          }}>
                            ✓ {REF[k]?.abbr || k}
                          </span>
                        ))}
                        {missing.map((k) => (
                          <span key={k} style={{
                            padding: '1px 8px', borderRadius: 12,
                            background: '#fee2e2', color: '#991b1b',
                            fontSize: 11, fontWeight: 600,
                          }}>
                            ✕ {REF[k]?.abbr || k}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, color: '#64748b', whiteSpace: 'nowrap',
                      paddingTop: 2,
                    }}>
                      残り {missing.length}項目
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
