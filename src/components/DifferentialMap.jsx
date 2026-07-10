// src/components/DifferentialMap.jsx
// ═══════════════════════════════════════════════════════════════════════
//  鑑別マップ ― 入口(主訴/異常)を選び、分岐ツリーをレイヤー・ラダーで歩く
// ═══════════════════════════════════════════════════════════════════════
//  このアプリの主役ビュー。「ある検査で何が分岐し、どの疾患群に絞れ、
//  最後に何で確定するか」を、レイヤー色で塗った階段として提示する。
import React, { useState } from 'react';
import { LayerBadge, LayerLegend, BackLink, FilterBar, matches, Empty } from './ui.jsx';
import { testLayer } from '../model/engine.js';

// 1ノードを再帰描画（レイヤー・ラダーの1段）
function Node({ node, atlas, activeFindings, onSelectDisease, onSelectTest, last }) {
  const test = node.test ? atlas.testById[node.test] : null;
  const layer = node.layer || (test ? testLayer(test).id : null);
  const bulletCls =
    node.kind === 'disease' ? 'disease' : layer ? `l${layer}` : '';

  return (
    <div className={`node ${node.kind}`}>
      <div className="node__row">
        <div className="node__spine">
          <span className={`node__bullet ${bulletCls}`} />
          {!last && <span className="node__connector" />}
        </div>
        <div className="node__body">
          <div className="node__head">
            <span className="node__label">{node.label}</span>
            {layer && <LayerBadge layer={layer} />}
            {node.kind === 'disease' && node.diseaseId && atlas.diseaseById[node.diseaseId] && (
              <button className="backlink" onClick={() => onSelectDisease(node.diseaseId)}>
                疾患を見る →
              </button>
            )}
          </div>

          {test && (
            <div style={{ marginTop: 6 }}>
              <button
                className="node__test"
                onClick={() => onSelectTest && onSelectTest(test.id)}
                title="この検査を詳しく見る"
              >
                🔎 次の一手：{test.name}
              </button>
            </div>
          )}
          {node.ask && <p className="node__ask">❓ {node.ask}</p>}
          {node.note && <p className="node__note">{node.note}</p>}
          {node.kind === 'disease' && node.note && node.diseaseId &&
            atlas.diseaseById[node.diseaseId]?.confirmNote && (
              <div className="node__confirm">
                確定：{atlas.diseaseById[node.diseaseId].confirmNote}
              </div>
            )}

          {/* 枝 */}
          {node.branches && node.branches.length > 0 && (
            <div className="branches">
              {node.branches.map((b, i) => {
                const finding = atlas.findingById[b.finding];
                const active = activeFindings?.has(b.finding);
                return (
                  <div className={`branch${active ? ' active' : ''}`} key={i}>
                    <div className="branch__label" title={finding?.meaning || ''}>
                      {b.label}
                    </div>
                    <Node
                      node={b.to}
                      atlas={atlas}
                      activeFindings={activeFindings}
                      onSelectDisease={onSelectDisease}
                      onSelectTest={onSelectTest}
                      last
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DifferentialMap({ atlas, activeFindings, initialEntryId, onSelectDisease, onSelectTest }) {
  const { PRESENTATIONS, pathwayById, presentById } = atlas;
  const [openId, setOpenId] = useState(initialEntryId || null);
  const [query, setQuery] = useState('');
  const [sysFilter, setSysFilter] = useState('all');

  const open = openId ? presentById[openId] : null;
  const pathway = open?.pathwayId ? pathwayById[open.pathwayId] : null;

  if (open && pathway) {
    return (
      <div>
        <BackLink onClick={() => setOpenId(null)}>入口の一覧へ</BackLink>
        <p className="h-eyebrow" style={{ marginTop: 10 }}>{open.kind === 'complaint' ? '主訴' : '検査異常'}からの鑑別</p>
        <h2 className="h-title">{pathway.title}</h2>
        <p className="lead">{pathway.summary}</p>
        <LayerLegend />
        <div className="card pad">
          <div className="ladder">
            <Node
              node={pathway.root}
              atlas={atlas}
              activeFindings={activeFindings}
              onSelectDisease={onSelectDisease}
              onSelectTest={onSelectTest}
              last
            />
          </div>
        </div>
        <p className="small muted" style={{ marginTop: 12 }}>
          ● の色は検査のレイヤー（<b style={{color:'var(--l1)'}}>L1最初</b> /
          <b style={{color:'var(--l2)'}}> L2鑑別</b> /
          <b style={{color:'var(--l3)'}}> L3確定</b>）。黒丸は確定した疾患。
          分岐を降りるほど鑑別が絞られていく。
        </p>
      </div>
    );
  }

  // 入口一覧
  const allSystems = [...new Set(PRESENTATIONS.map((p) => p.system))].sort();
  const hit = (p) =>
    (sysFilter === 'all' || p.system === sysFilter) &&
    (matches(p.label, query) || matches(p.firstTests, query));
  const shown = PRESENTATIONS.filter(hit);
  const complaints = shown.filter((p) => p.kind === 'complaint');
  const abns = shown.filter((p) => p.kind === 'abnormality');

  const Section = ({ title, items }) => (
    items.length === 0 ? null :
    <div style={{ marginBottom: 22 }}>
      <p className="h-eyebrow">{title}</p>
      <div className="grid cols-2">
        {items.map((p) => {
          const has = !!(p.pathwayId && pathwayById[p.pathwayId]);
          return (
            <button
              key={p.id}
              className="tile"
              onClick={() => has && setOpenId(p.id)}
              style={{ opacity: has ? 1 : 0.55, cursor: has ? 'pointer' : 'not-allowed' }}
            >
              <p className="t-name">{p.label}</p>
              <p className="t-sub">{p.firstTests}</p>
              <p className="t-sub" style={{ marginTop: 6 }}>
                {has ? '鑑別マップを開く →' : '（マップ準備中）'}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <p className="h-eyebrow">鑑別マップ</p>
      <h2 className="h-title">どこから鑑別を始める？</h2>
      <p className="lead">
        患者の訴え（主訴）か、スクリーニングで拾った検査異常を入口に選ぶと、
        「どの検査で何が分岐し、どの疾患群に絞れて、最後に何で確定するか」を
        レイヤー色で塗った鑑別の地図として歩けます。診断名を当てるためではなく、
        <b>いま鑑別作業全体のどこにいるのか</b>を掴むためのビューです。
      </p>
      <LayerLegend />
      <FilterBar
        query={query} setQuery={setQuery} placeholder="入口を検索（例: 貧血, 黄疸, 胸痛, 発疹）"
        systems={allSystems} system={sysFilter} setSystem={setSysFilter} count={shown.length}
      />
      <Section title="検査異常から入る" items={abns} />
      <Section title="主訴から入る" items={complaints} />
      {!shown.length && <Empty>該当する入口がありません。</Empty>}
    </div>
  );
}
