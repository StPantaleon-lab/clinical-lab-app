// src/components/ResultPanel.jsx
import { useState } from 'react';
import { DISEASES, CATEGORIES } from '../data/diseases.js';
import { evalVal, REF, enteredKeys } from '../data/referenceRanges.js';
import CoveragePanel from './CoveragePanel.jsx';

const CAT_COLOR = {
  '貧血': { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af' },
  '出血性疾患': { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' },
  '肝・胆・膵疾患': { bg: '#fef9c3', border: '#fde047', text: '#713f12' },
  '腎疾患': { bg: '#e0f2fe', border: '#7dd3fc', text: '#0369a1' },
  '代謝疾患': { bg: '#f0fdf4', border: '#86efac', text: '#166534' },
  '内分泌疾患': { bg: '#fdf4ff', border: '#e879f9', text: '#7e22ce' },
  '自己免疫疾患': { bg: '#fff7ed', border: '#fdba74', text: '#c2410c' },
  '感染・炎症': { bg: '#fef2f2', border: '#fca5a5', text: '#b91c1c' },
  '心疾患': { bg: '#ffe4e6', border: '#fda4af', text: '#9f1239' },
  '血液腫瘍': { bg: '#f5f3ff', border: '#c4b5fd', text: '#6d28d9' },
  '腫瘍': { bg: '#fdf2f8', border: '#f0abfc', text: '#86198f' },
};

function DiseaseCard({ disease, evaluated, values, symptoms, toggleSymptom }) {
  const [open, setOpen] = useState(false);
  const matchedSymptoms = disease.symptoms.filter((s) => symptoms[s.key]);
  const col = CAT_COLOR[disease.category] || { bg: '#f8fafc', border: '#e2e8f0', text: '#1e293b' };

  return (
    <div style={{
      border: `1.5px solid ${col.border}`,
      borderRadius: 12,
      marginBottom: 8,
      background: 'white',
      overflow: 'hidden',
    }}>
      {/* カードヘッダー */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%', textAlign: 'left', background: col.bg,
          border: 'none', padding: '12px 16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', flex: 1 }}>
          {disease.name}
        </span>
        {matchedSymptoms.length > 0 && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 12,
            background: '#7c3aed', color: 'white',
          }}>
            症候 {matchedSymptoms.length}件 ✓
          </span>
        )}
        <span style={{ fontSize: 12, color: '#64748b', marginLeft: 4 }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {/* 展開内容 */}
      {open && (
        <div style={{ padding: '14px 16px' }}>
          {/* 症候チェックリスト */}
          <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 8 }}>
            ＋ 以下の症候があれば診断をより強く支持：
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {disease.symptoms.map((s) => (
              <label key={s.key} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <input
                  type="checkbox"
                  checked={!!symptoms[s.key]}
                  onChange={() => toggleSymptom(s.key)}
                  style={{ accentColor: '#7c3aed', width: 14, height: 14 }}
                />
                <span style={{
                  fontSize: 12, padding: '3px 10px', borderRadius: 20,
                  background: symptoms[s.key] ? '#ede9fe' : '#f8fafc',
                  color: symptoms[s.key] ? '#6d28d9' : '#475569',
                  fontWeight: symptoms[s.key] ? 700 : 400,
                  border: '1px solid',
                  borderColor: symptoms[s.key] ? '#c4b5fd' : '#e2e8f0',
                }}>
                  {s.label}
                </span>
              </label>
            ))}
          </div>

          {/* 一致症候バッジ */}
          {matchedSymptoms.length > 0 && (
            <div style={{
              marginBottom: 10, padding: '8px 12px',
              background: '#ede9fe', borderRadius: 8,
              fontSize: 12, color: '#5b21b6',
            }}>
              ✅ 一致症候: {matchedSymptoms.map((s) => s.label).join('、')}
            </div>
          )}

          {/* 臨床メモ */}
          <div style={{
            padding: '10px 12px', background: '#f8fafc', borderRadius: 8,
            borderLeft: '3px solid #3b82f6', marginBottom: disease.ruleOutNote ? 10 : 0,
          }}>
            <p style={{ margin: 0, fontSize: 12, color: '#334155', lineHeight: 1.7 }}>
              💬 {disease.note}
            </p>
          </div>

          {/* 否定に必要な検査 */}
          {disease.ruleOutNote && (
            <div style={{
              padding: '8px 12px', background: '#fff7ed', borderRadius: 8,
              borderLeft: '3px solid #f59e0b', marginTop: 0,
            }}>
              <p style={{ margin: 0, fontSize: 12, color: '#92400e', lineHeight: 1.7 }}>
                🔬 <strong>否定・確定に必要な追加検査:</strong> {disease.ruleOutNote}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultPanel({ values, sex, symptoms, toggleSymptom }) {
  const [coverageOpen, setCoverageOpen] = useState(true);

  // 全評価値を計算
  const evaluated = {};
  for (const k of Object.keys(REF)) {
    evaluated[k] = evalVal(k, values[k], sex);
  }

  const entered = Object.keys(values).filter(
    (k) => values[k] !== '' && values[k] !== null && values[k] !== undefined
  );

  // 疾患マッチング（requiredKeys が全て揃っている場合のみ）
  const matchedDiseases = DISEASES.filter((d) => {
    const hasAll = d.requiredKeys.every((k) => entered.includes(k));
    if (!hasAll) return false;
    return d.conditionFn(values, evaluated, sex);
  });

  if (entered.length === 0) {
    return (
      <div style={{
        background: 'white', borderRadius: 14, padding: '48px 24px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.08)', textAlign: 'center',
        color: '#94a3b8',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
        <p style={{ fontSize: 15, fontWeight: 600 }}>まず検査値を入力してください</p>
        <p style={{ fontSize: 13, marginTop: 6 }}>
          「検査値入力」タブから直接入力するか、<br />
          「自動読み取り」で検査結果を貼り付けてください
        </p>
      </div>
    );
  }

  const byCat = {};
  for (const cat of CATEGORIES) {
    byCat[cat] = matchedDiseases.filter((d) => d.category === cat);
  }

  return (
    <div>
      {/* 検査値サマリー */}
      <div style={{
        background: 'white', borderRadius: 14, padding: '16px 20px',
        marginBottom: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: '#0f172a' }}>
          📊 入力済み検査値
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {entered.map((k) => {
            const ev = evaluated[k];
            const style = ev === 'low'
              ? { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' }
              : ev === 'high'
              ? { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' }
              : { bg: '#f0fdf4', text: '#166534', border: '#86efac' };
            return (
              <span key={k} style={{
                padding: '3px 10px', borderRadius: 20,
                background: style.bg, color: style.text,
                border: `1px solid ${style.border}`,
                fontSize: 12, fontWeight: 600,
              }}>
                {REF[k]?.abbr || k} {values[k]}
                {ev !== 'normal' && (ev === 'low' ? ' ↓' : ' ↑')}
              </span>
            );
          })}
        </div>
      </div>

      {/* カバレッジパネル */}
      <div style={{ marginBottom: 14 }}>
        <button
          onClick={() => setCoverageOpen((v) => !v)}
          style={{
            width: '100%', textAlign: 'left', background: '#f8fafc',
            border: '1px solid #e2e8f0', borderRadius: 12,
            padding: '10px 16px', cursor: 'pointer',
            fontWeight: 700, fontSize: 13, color: '#374151',
            display: 'flex', justifyContent: 'space-between',
            marginBottom: coverageOpen ? 10 : 0,
          }}
        >
          🗺️ 判定カバレッジ・追加検査の提案
          <span>{coverageOpen ? '▲ 折りたたむ' : '▼ 展開する'}</span>
        </button>
        {coverageOpen && (
          <CoveragePanel values={values} sex={sex} matchedDiseases={matchedDiseases} />
        )}
      </div>

      {/* 疾患候補リスト */}
      <div style={{
        background: 'white', borderRadius: 14, padding: '16px 20px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#0f172a' }}>
          🔍 検査値から示唆される疾患候補
          <span style={{
            marginLeft: 10, fontSize: 12, fontWeight: 400, color: '#64748b',
          }}>
            ※ 必要な検査値が全て揃っている疾患のみ表示
          </span>
        </h3>

        {matchedDiseases.length === 0 ? (
          <div style={{
            padding: '24px', background: '#f0fdf4', borderRadius: 12,
            textAlign: 'center', color: '#15803d',
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>
              現在の検査値の組み合わせでは、判定基準を満たす疾患はありません
            </p>
            <p style={{ fontSize: 12, color: '#4ade80', marginTop: 6 }}>
              判定に必要な検査値が不足している疾患は上の「カバレッジ」パネルで確認できます
            </p>
          </div>
        ) : (
          CATEGORIES.map((cat) => {
            const diseases = byCat[cat];
            if (!diseases || diseases.length === 0) return null;
            const col = CAT_COLOR[cat] || {};
            return (
              <div key={cat} style={{ marginBottom: 20 }}>
                <div style={{
                  padding: '6px 14px', borderRadius: '8px 8px 0 0',
                  background: col.bg || '#f1f5f9',
                  fontSize: 13, fontWeight: 700, color: col.text || '#1e293b',
                  borderBottom: `2px solid ${col.border || '#e2e8f0'}`,
                }}>
                  {cat}　({diseases.length}件)
                </div>
                <div style={{ paddingTop: 8 }}>
                  {diseases.map((d) => (
                    <DiseaseCard
                      key={d.id}
                      disease={d}
                      evaluated={evaluated}
                      values={values}
                      symptoms={symptoms}
                      toggleSymptom={toggleSymptom}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 免責事項 */}
      <div style={{
        marginTop: 14, padding: '12px 16px',
        background: '#fff7ed', border: '1px solid #fed7aa',
        borderRadius: 12, fontSize: 12, color: '#92400e', lineHeight: 1.7,
      }}>
        ⚠️ <strong>本ツールは医学教育目的です。</strong>
        実際の診断・治療は必ず医師の判断によってください。
        検査値の解釈は臨床状況・患者背景・他の検査との組み合わせで異なります。
      </div>
    </div>
  );
}
