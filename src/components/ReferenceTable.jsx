// src/components/ReferenceTable.jsx
import { REF, GROUP_ORDER } from '../data/referenceRanges.js';

export default function ReferenceTable() {
  return (
    <div style={{
      background: 'white', borderRadius: 14, padding: '20px',
      boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
    }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#0f172a' }}>
        📖 正常範囲一覧（臨床検査医学スライド PDF1〜12 より）
      </h3>
      {GROUP_ORDER.map((group) => {
        const rows = Object.entries(REF).filter(([, r]) => r.group === group);
        if (rows.length === 0) return null;
        return (
          <div key={group} style={{ marginBottom: 24 }}>
            <h4 style={{
              fontSize: 12, fontWeight: 700, color: '#64748b',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              marginBottom: 8, paddingBottom: 4,
              borderBottom: '1px solid #f1f5f9',
            }}>
              {group}
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  {['検査項目', '略称', '単位', '基準値（男性）', '基準値（女性）'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '5px 8px',
                      color: '#64748b', fontWeight: 600, background: '#f8fafc',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([key, ref], i) => {
                  const mLo = ref.min ?? ref.maleMin;
                  const mHi = ref.max ?? ref.maleMax;
                  const fLo = ref.min ?? ref.femaleMin;
                  const fHi = ref.max ?? ref.femaleMax;
                  const hasSexDiff = ref.maleMin !== undefined;
                  return (
                    <tr key={key} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                      <td style={{ padding: '5px 8px', fontWeight: 600, color: '#1e293b' }}>{ref.label}</td>
                      <td style={{ padding: '5px 8px', color: '#3b82f6', fontFamily: 'monospace', fontWeight: 700 }}>{ref.abbr}</td>
                      <td style={{ padding: '5px 8px', color: '#64748b' }}>{ref.unit}</td>
                      <td style={{ padding: '5px 8px', color: '#334155' }}>
                        {mLo !== undefined ? `${mLo}${mHi !== 9999 ? ` – ${mHi}` : ' 以上'}` : '—'}
                      </td>
                      <td style={{ padding: '5px 8px', color: '#334155' }}>
                        {hasSexDiff
                          ? (fLo !== undefined ? `${fLo}${fHi !== 9999 ? ` – ${fHi}` : ' 以上'}` : '—')
                          : '（同上）'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
