// src/components/DiseaseView.jsx
// ═══════════════════════════════════════════════════════════════════════
//  疾患から見る ― この疾患に到達するまでの「最初→鑑別→確定」の連鎖
// ═══════════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { LayerBadge, Mechanism, BackLink, FilterBar, matches, Empty } from './ui.jsx';
import { LAYER_META } from '../model/schema.js';

export default function DiseaseView({ atlas, initialId, onSelectTest, onOpenPathway }) {
  const { DISEASES, diseaseById, findingById, testById, GROUPS,
          diseasesBySystem, diseaseReachedIn } = atlas;
  const [openId, setOpenId] = useState(initialId || null);
  const [query, setQuery] = useState('');
  const [sysFilter, setSysFilter] = useState('all');

  const disease = openId ? diseaseById[openId] : null;

  if (disease) {
    const refs = disease.keyFindings || [];
    const byLayer = { 1: [], 2: [], 3: [] };
    for (const r of refs) (byLayer[r.layer] ||= []).push(r);
    const reached = diseaseReachedIn[disease.id] || [];
    const confirmTest = disease.confirm ? testById[disease.confirm] : null;

    return (
      <div>
        <BackLink onClick={() => setOpenId(null)}>疾患の一覧へ</BackLink>
        <div className="row-wrap" style={{ marginTop: 10 }}>
          <h2 className="h-title" style={{ margin: 0 }}>{disease.name}</h2>
          <span className="chip">{disease.system}</span>
          {disease.group && GROUPS[disease.group] && <span className="chip">群：{GROUPS[disease.group]}</span>}
        </div>
        {disease.oneLiner && <p className="lead" style={{ marginTop: 10 }}>{disease.oneLiner}</p>}
        <Mechanism label="病態">{disease.mechanism}</Mechanism>

        {/* レイヤー・ラダー: 最初→鑑別→確定 */}
        <div className="card pad" style={{ marginTop: 14 }}>
          <p className="h-eyebrow">この疾患に至る所見の連鎖</p>
          <p className="small muted" style={{ marginTop: 0 }}>
            同じ疾患でも、所見は「最初に拾う(L1)→鑑別で使う(L2)→確定に効く(L3)」と役割が分かれます。
          </p>
          {[1, 2, 3].map((L) => {
            const items = byLayer[L] || [];
            if (!items.length) return null;
            const m = LAYER_META[L];
            return (
              <div key={L} style={{ marginTop: 12 }}>
                <div className="row-wrap" style={{ marginBottom: 6 }}>
                  <LayerBadge layer={L} showLabel />
                </div>
                <div className="grid cols-2">
                  {items.map((r, i) => {
                    const f = findingById[r.finding];
                    const t = f ? testById[f.testId] : null;
                    return (
                      <div key={i} className="status-row" style={{ alignItems: 'flex-start' }}>
                        <div style={{ minWidth: 0 }}>
                          <div className="s-name" style={{ fontSize: 14 }}>
                            {f?.label || r.finding}
                            {r.required && <span className="chip" style={{ marginLeft: 6 }}>必須</span>}
                            {r.role === 'rule_out' && <span className="chip contra" style={{ marginLeft: 6 }}>除外</span>}
                          </div>
                          {f?.meaning && <div className="small muted" style={{ marginTop: 2 }}>{f.meaning}</div>}
                          {t && (
                            <button className="backlink small" style={{ marginTop: 4 }} onClick={() => onSelectTest?.(t.id)}>
                              検査：{t.name} →
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {(confirmTest || disease.confirmNote) && (
            <div className="node__confirm" style={{ marginTop: 14 }}>
              <b>確定：</b>
              {confirmTest && (
                <button className="backlink" onClick={() => onSelectTest?.(confirmTest.id)} style={{ margin: '0 4px' }}>
                  {confirmTest.name}
                </button>
              )}
              — {disease.confirmNote}
            </div>
          )}
        </div>

        {/* どの鑑別マップで到達するか */}
        {reached.length > 0 && (
          <div className="card pad" style={{ marginTop: 14 }}>
            <p className="h-eyebrow">どの鑑別マップで到達するか</p>
            <div className="row-wrap">
              {dedupe(reached).map((r) => (
                <button key={r.pathway.id} className="chip clickable" onClick={() => onOpenPathway?.(r.pathway.entryId)}>
                  🗺 {r.pathway.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {disease.typical && (
          <details className="disclosure" style={{ marginTop: 12 }}>
            <summary>典型的な検査値（入力モードのデモ用）</summary>
            <div className="row-wrap" style={{ marginTop: 8 }}>
              {Object.entries(disease.typical).map(([k, v]) => (
                <span key={k} className="chip"><b>{k}</b>&nbsp;<span className="num">{v}</span></span>
              ))}
            </div>
          </details>
        )}
      </div>
    );
  }

  // 一覧（診療系統ごと）
  const allSystems = Object.keys(diseasesBySystem);
  const hit = (d) =>
    (sysFilter === 'all' || d.system === sysFilter) &&
    (matches(d.name, query) || matches(d.oneLiner, query) ||
     matches(GROUPS[d.group], query) || matches(d.id, query));
  const shown = DISEASES.filter(hit);
  const systems = allSystems.filter((s) => diseasesBySystem[s].some(hit));
  return (
    <div>
      <p className="h-eyebrow">疾患から見る</p>
      <h2 className="h-title">疾患の特徴と到達経路</h2>
      <p className="lead">
        疾患を選ぶと、病態機序と、<b>その疾患に至る所見の連鎖（最初→鑑別→確定）</b>、
        そしてどの鑑別マップから到達するかが分かります。診断の暗記ではなく、
        「どの検査がどの役割で効くのか」を理解するためのビューです。
      </p>

      <FilterBar
        query={query} setQuery={setQuery} placeholder="疾患名・疾患群・特徴で検索（例: 貧血, 甲状腺, DIC）"
        systems={allSystems} system={sysFilter} setSystem={setSysFilter} count={shown.length}
      />
      {systems.map((sys) => (
        <div key={sys} style={{ marginBottom: 20 }}>
          <p className="h-eyebrow">{sys}</p>
          <div className="grid cols-auto">
            {diseasesBySystem[sys].filter(hit).map((d) => (
              <button key={d.id} className="tile" onClick={() => setOpenId(d.id)}>
                <p className="t-name">{d.name}</p>
                <p className="t-sub">{GROUPS[d.group] || d.group}</p>
                {d.oneLiner && <p className="t-sub" style={{ marginTop: 5 }}>{d.oneLiner}</p>}
              </button>
            ))}
          </div>
        </div>
      ))}
      {!systems.length && <Empty>該当する疾患がありません。検索語や絞り込みを変えてみてください。</Empty>}
    </div>
  );
}

function dedupe(arr) {
  const seen = new Set(); const out = [];
  for (const r of arr) { if (seen.has(r.pathway.id)) continue; seen.add(r.pathway.id); out.push(r); }
  return out;
}
