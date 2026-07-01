// src/components/LabDetail.jsx
// 検査値詳細ページ

import { useState } from 'react';
import { LAB_INFO } from '../data/labInfo.js';
import { REF, GROUP_ORDER } from '../data/referenceRanges.js';

const CAT_COLOR = { high: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', label: '↑ 高値になる疾患' }, low: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd', label: '↓ 低値になる疾患' } };

function DiseaseList({ diseases, type }) {
  if (!diseases || diseases.length === 0) return null;
  const col = CAT_COLOR[type];
  return (
    <div style={{ marginBottom: 16 }}>
      <h4 style={{ fontSize: 13, fontWeight: 700, color: col.text, marginBottom: 8, padding: '4px 10px', background: col.bg, borderRadius: 6, display: 'inline-block' }}>
        {col.label}（{diseases.length}件）
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {diseases.map((d, i) => (
          <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: 'white', border: `1.5px solid ${d.criteria ? col.border : '#e2e8f0'}`, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              {d.criteria && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: col.bg, color: col.text, border: `1px solid ${col.border}`, whiteSpace: 'nowrap' }}>
                  診断基準
                </span>
              )}
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{d.name}</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
              💡 <strong>機序：</strong>{d.mechanism}
            </p>
            {d.note && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>{d.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LabDetail({ selectedKey, onSelect }) {
  const [search, setSearch] = useState('');

  const groups = GROUP_ORDER.map(g => ({
    group: g,
    keys: Object.entries(REF).filter(([, r]) => r.group === g).map(([k]) => k),
  })).filter(g => g.keys.length > 0);

  const filtered = !search.trim() ? null : Object.entries(LAB_INFO).filter(([k, v]) =>
    v.label.includes(search) || (REF[k]?.abbr || '').toLowerCase().includes(search.toLowerCase()) || v.brief.includes(search)
  );

  const info = selectedKey ? LAB_INFO[selectedKey] : null;
  const ref = selectedKey ? REF[selectedKey] : null;

  return (
    <div style={{ display: 'flex', gap: 14, minHeight: 600 }}>
      {/* 左：検査値リスト */}
      <div style={{ width: 260, flexShrink: 0, background: 'white', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 12px 8px' }}>
          <input
            type="text" placeholder="検査値を検索..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }}
          />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered ? (
            filtered.length === 0 ? (
              <p style={{ padding: 16, color: '#94a3b8', fontSize: 13 }}>見つかりません</p>
            ) : filtered.map(([k, v]) => (
              <button key={k} onClick={() => { onSelect(k); setSearch(''); }} style={{ width: '100%', textAlign: 'left', padding: '8px 14px', border: 'none', borderBottom: '1px solid #f1f5f9', background: selectedKey === k ? '#eff6ff' : 'white', color: selectedKey === k ? '#1d4ed8' : '#334155', fontSize: 13, fontWeight: selectedKey === k ? 700 : 400, cursor: 'pointer', borderLeft: selectedKey === k ? '3px solid #3b82f6' : '3px solid transparent' }}>
                <span style={{ fontWeight: 700, color: '#3b82f6', marginRight: 6 }}>{REF[k]?.abbr || k}</span>
                {v.label}
              </button>
            ))
          ) : (
            groups.map(({ group, keys }) => (
              <div key={group}>
                <div style={{ padding: '6px 12px', background: '#f8fafc', fontSize: 11, fontWeight: 700, color: '#64748b', position: 'sticky', top: 0, borderBottom: '1px solid #f1f5f9' }}>
                  {group}
                </div>
                {keys.filter(k => LAB_INFO[k]).map(k => (
                  <button key={k} onClick={() => onSelect(k)} style={{ width: '100%', textAlign: 'left', padding: '7px 14px', border: 'none', background: selectedKey === k ? '#eff6ff' : 'white', color: selectedKey === k ? '#1d4ed8' : '#334155', fontSize: 12, fontWeight: selectedKey === k ? 700 : 400, cursor: 'pointer', borderLeft: selectedKey === k ? '3px solid #3b82f6' : '3px solid transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><span style={{ fontWeight: 700, color: '#3b82f6', marginRight: 6 }}>{REF[k]?.abbr || k}</span>{LAB_INFO[k].label}</span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 右：検査値詳細 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {!info ? (
          <div style={{ background: 'white', borderRadius: 14, padding: '48px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔬</div>
            <p style={{ fontSize: 15, fontWeight: 600 }}>左のリストから検査値を選んでください</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            {/* ヘッダー */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{info.label}</h2>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#3b82f6' }}>{ref?.abbr}</span>
                <span style={{ fontSize: 14, color: '#64748b' }}>{ref?.unit}</span>
              </div>
              {/* 正常範囲 */}
              {ref && (
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  {['male', 'female'].map(sex => {
                    const lo = ref.min ?? (sex === 'female' ? ref.femaleMin : ref.maleMin);
                    const hi = ref.max ?? (sex === 'female' ? ref.femaleMax : ref.maleMax);
                    if (lo === undefined) return null;
                    const hasSexDiff = ref.maleMin !== undefined;
                    return (
                      <span key={sex} style={{ padding: '4px 12px', borderRadius: 20, background: '#f0fdf4', border: '1px solid #86efac', fontSize: 12, fontWeight: 600, color: '#166534' }}>
                        {hasSexDiff ? (sex === 'male' ? '♂' : '♀') : ''} 基準値: {lo} – {hi === 9999 ? '—' : hi} {ref.unit}
                      </span>
                    );
                  })}
                </div>
              )}
              <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.7, padding: '10px 14px', background: '#eff6ff', borderRadius: 8 }}>
                📌 {info.brief}
              </p>
            </div>

            {/* 概要 */}
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>概要</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#334155', lineHeight: 1.8 }}>{info.overview}</p>
            </div>

            {/* 機序 */}
            <div style={{ marginBottom: 20, padding: '12px 14px', background: '#fdf4ff', borderRadius: 10, borderLeft: '3px solid #c084fc' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#7e22ce', marginBottom: 6 }}>⚙️ 異常値になる機序</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#334155', lineHeight: 1.8 }}>{info.mechanism}</p>
            </div>

            {/* 高値疾患 */}
            <DiseaseList diseases={info.highDiseases} type="high" />

            {/* 低値疾患 */}
            <DiseaseList diseases={info.lowDiseases} type="low" />

            {/* 除外できる疾患 */}
            {info.excludes && info.excludes.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 8, padding: '4px 10px', background: '#f0fdf4', borderRadius: 6, display: 'inline-block' }}>
                  ✅ 正常値で除外できる疾患
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {info.excludes.map((e, i) => (
                    <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: '#f0fdf4', border: '1px solid #86efac' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '1px 8px', borderRadius: 4, fontSize: 11, marginRight: 8 }}>{e.value}</span>
                        → {e.disease} を否定/可能性低い
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: '#475569', lineHeight: 1.7 }}>{e.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
