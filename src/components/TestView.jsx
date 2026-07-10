// src/components/TestView.jsx
// ═══════════════════════════════════════════════════════════════════════
//  検査から見る ― この検査は鑑別全体のどこで使うのか / 何を意味するのか
// ═══════════════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import { LayerBadge, ModalityTag, Mechanism, BackLink, FilterBar, matches, Empty } from './ui.jsx';
import { MODALITY, MODALITY_ORDER, LAYER_META } from '../model/schema.js';
import { testLayer } from '../model/engine.js';

export default function TestView({ atlas, initialId, onSelectDisease, onOpenPathway }) {
  const { TESTS, testById, findingsByTest, LAB_INFO, pathwayUsesTest,
          patternsByTest, derivedByInput } = atlas;
  const [openId, setOpenId] = useState(initialId || null);
  const [modFilter, setModFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [sysFilter, setSysFilter] = useState('all');

  const test = openId ? testById[openId] : null;

  // 詳細ビュー
  if (test) {
    const info = LAB_INFO[test.refKey || test.id];
    const findings = findingsByTest[test.id] || [];
    const usedIn = pathwayUsesTest[test.id] || [];
    const patterns = patternsByTest[test.id] || [];
    const derived = derivedByInput[test.id] || [];
    const layer = testLayer(test);

    return (
      <div>
        <BackLink onClick={() => setOpenId(null)}>検査の一覧へ</BackLink>
        <div className="row-wrap" style={{ marginTop: 10 }}>
          <h2 className="h-title" style={{ margin: 0 }}>{test.name}</h2>
          {test.abbr && <span className="muted">（{test.abbr}）</span>}
          <LayerBadge layer={layer.id} showLabel />
          <ModalityTag id={test.modality} />
          {test.cost && <span className="chip">侵襲・コスト：{test.cost}</span>}
        </div>

        {(test.overview || info?.overview) && (
          <p className="lead" style={{ marginTop: 12 }}>{test.overview || info?.overview}</p>
        )}
        <Mechanism>{test.mechanism || info?.mechanism}</Mechanism>

        {/* パネル検査: 構成する検査 */}
        {test.panel?.length > 0 && (
          <div className="card pad" style={{ marginTop: 14 }}>
            <p className="h-eyebrow">この検査を構成する項目（束で読む）</p>
            <p className="small muted" style={{ marginTop: 0 }}>
              単独では意味が定まらず、組み合わせで初めて解釈できる検査群です。
            </p>
            <div className="panelbox">
              {test.panel.map((pid) => {
                const pt = testById[pid];
                if (!pt) return null;
                return (
                  <span key={pid} className="chip clickable" onClick={() => setOpenId(pid)}>
                    {pt.name}{pt.abbr && pt.abbr !== pt.name ? `（${pt.abbr}）` : ''}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* この検査が生む所見 */}
        {findings.length > 0 && (
          <div className="card pad" style={{ marginTop: 14 }}>
            <p className="h-eyebrow">この検査が生む所見</p>
            <div className="grid cols-2">
              {findings.map((f) => (
                <div key={f.id} className="status-row" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <div className="s-name" style={{ fontSize: 14 }}>{f.label}</div>
                    <div className="small muted" style={{ marginTop: 2 }}>{f.meaning}</div>
                  </div>
                  {f.layerHint && <span style={{ marginLeft: 'auto' }}><LayerBadge layer={f.layerHint} /></span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 組み合わせ・算出 */}
        {(patterns.length > 0 || derived.length > 0) && (
          <div className="card pad" style={{ marginTop: 14 }}>
            <p className="h-eyebrow">組み合わせ・算出での使われ方</p>
            {derived.map((d) => (
              <div className="derived-hit" key={d.id} style={{ marginBottom: 8 }}>
                <b>{d.label}</b> <span className="muted">= {d.formula}</span>
                <div className="small muted">{d.meaning}</div>
              </div>
            ))}
            {patterns.map((p) => (
              <div className="pattern-hit" key={p.id} style={{ marginBottom: 8 }}>
                <span className="p-name">{p.label}</span>
                <div className="small">{p.meaning}</div>
              </div>
            ))}
          </div>
        )}

        {/* 鑑別のどこで使われるか */}
        {usedIn.length > 0 && (
          <div className="card pad" style={{ marginTop: 14 }}>
            <p className="h-eyebrow">鑑別マップでの位置づけ</p>
            <p className="small muted" style={{ marginTop: 0 }}>
              この検査は次の鑑別で「次の一手」として登場します：
            </p>
            <div className="row-wrap">
              {dedupePathways(usedIn).map((u) => (
                <button key={u.pathway.id} className="chip clickable" onClick={() => onOpenPathway?.(u.pathway.entryId)}>
                  🗺 {u.pathway.title} 内「{u.node.label}」
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LAB_INFO 由来の疾患関連 */}
        {info && (info.highDiseases?.length || info.lowDiseases?.length) && (
          <details className="disclosure" style={{ marginTop: 12 }}>
            <summary>高値・低値で考える疾患（機序つき）</summary>
            <div className="grid cols-2" style={{ marginTop: 8 }}>
              <DiseaseColumn title="高値で考える" items={info.highDiseases} />
              <DiseaseColumn title="低値で考える" items={info.lowDiseases} />
            </div>
          </details>
        )}
      </div>
    );
  }

  // 一覧（モダリティで絞り込み）
  const mods = ['all', ...MODALITY_ORDER];
  const systems = [...new Set(TESTS.map((t) => t.system))].sort();
  const filtered = TESTS
    .filter((t) => modFilter === 'all' || t.modality === modFilter)
    .filter((t) => sysFilter === 'all' || t.system === sysFilter)
    .filter((t) => matches(t.name, query) || matches(t.abbr, query) || matches(t.id, query));
  const byMod = MODALITY_ORDER
    .map((mid) => ({ mid, list: filtered.filter((t) => t.modality === mid) }))
    .filter((g) => g.list.length);

  return (
    <div>
      <p className="h-eyebrow">検査から見る</p>
      <h2 className="h-title">検査の位置づけと機序</h2>
      <p className="lead">
        各検査を選ぶと、機序・生みうる所見・組み合わせ／算出での使われ方、そして
        <b>鑑別マップのどこで「次の一手」として登場するか</b>が分かります。
        検査を「値の正常/異常」ではなく「鑑別を動かす手」として捉えるビューです。
      </p>

      <FilterBar
        query={query} setQuery={setQuery} placeholder="検査名・略号で検索（例: ALP, シンチ, 骨髄）"
        systems={systems} system={sysFilter} setSystem={setSysFilter} count={filtered.length}
      />

      <div className="row-wrap" style={{ marginBottom: 16 }}>
        {mods.map((m) => {
          const label = m === 'all' ? 'すべて' :
            Object.values(MODALITY).find((x) => x.id === m)?.label || m;
          const icon = m === 'all' ? '⬚' : Object.values(MODALITY).find((x) => x.id === m)?.icon;
          return (
            <button key={m} className={`togglebtn${modFilter === m ? ' on' : ''}`} onClick={() => setModFilter(m)}>
              {icon} {label}
            </button>
          );
        })}
      </div>

      {byMod.map(({ mid, list }) => {
        const m = Object.values(MODALITY).find((x) => x.id === mid);
        return (
          <div key={mid} style={{ marginBottom: 20 }}>
            <p className="h-eyebrow">{m.icon} {m.label}</p>
            <div className="grid cols-auto">
              {list.map((t) => {
                const layer = testLayer(t);
                return (
                  <button key={t.id} className="tile" onClick={() => setOpenId(t.id)}>
                    <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
                      <span className="t-name">{t.name}</span>
                      <LayerBadge layer={layer.id} />
                    </div>
                    <p className="t-sub" style={{ marginTop: 4 }}>{t.system}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {!byMod.length && <Empty>該当する検査がありません。検索語や絞り込みを変えてみてください。</Empty>}
    </div>
  );
}

function DiseaseColumn({ title, items }) {
  if (!items || !items.length) return null;
  return (
    <div>
      <p className="small" style={{ fontWeight: 800, margin: '0 0 6px' }}>{title}</p>
      {items.map((d, i) => (
        <div key={i} className="status-row" style={{ marginBottom: 6, alignItems: 'flex-start' }}>
          <div>
            <div className="s-name" style={{ fontSize: 13.5 }}>
              {d.name}{d.criteria && <span className="chip" style={{ marginLeft: 6 }}>診断基準</span>}
            </div>
            <div className="small muted" style={{ marginTop: 2 }}>{d.mechanism}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function dedupePathways(usedIn) {
  const seen = new Set();
  const out = [];
  for (const u of usedIn) {
    const k = u.pathway.id + '|' + u.node.label;
    if (seen.has(k)) continue;
    seen.add(k); out.push(u);
  }
  return out;
}
