// validate.mjs ― データの参照整合性チェック
// 使い方: node validate.mjs
// 検査⇄所見⇄疾患⇄パスウェイの全リンクが実在IDを指しているかを検証する。
// 疾患や検査を追加したら必ず実行すること。
import { ATLAS, DUPLICATE_IDS, ATLAS_STATS } from './src/data/index.js';
import { walk } from './src/model/engine.js';

const { TESTS, FINDINGS, DISEASES, PATHWAYS, PRESENTATIONS,
        testById, findingById, diseaseById, presentById, pathwayById } = ATLAS;

let errs = 0;
const err = (m) => { console.log('❌ ' + m); errs++; };

for (const f of FINDINGS) if (!testById[f.testId]) err(`finding ${f.id}: testId '${f.testId}' が存在しない`);
for (const t of TESTS) for (const fid of (t.findings || [])) if (!findingById[fid]) err(`test ${t.id}: finding '${fid}' が存在しない`);
for (const d of DISEASES) for (const kf of (d.keyFindings || [])) if (!findingById[kf.finding]) err(`disease ${d.id}: keyFinding '${kf.finding}' が存在しない`);
for (const d of DISEASES) if (d.confirm && !testById[d.confirm] && !findingById[d.confirm]) err(`disease ${d.id}: confirm '${d.confirm}' が test/finding のどちらにもない`);
for (const p of PRESENTATIONS) if (p.pathwayId && !pathwayById[p.pathwayId]) err(`presentation ${p.id}: pathwayId '${p.pathwayId}' が存在しない`);
for (const pw of PATHWAYS) if (pw.entryId && !presentById[pw.entryId]) err(`pathway ${pw.id}: entryId '${pw.entryId}' が存在しない`);

const freeKeys = new Set();
for (const pw of PATHWAYS) walk(pw.root, (node) => {
  if (node.test && !testById[node.test]) err(`pathway ${pw.id}: node '${node.label}' の test '${node.test}' が存在しない`);
  if (node.kind === 'disease' && node.diseaseId && !diseaseById[node.diseaseId]) err(`pathway ${pw.id}: disease node '${node.label}' の diseaseId '${node.diseaseId}' が存在しない`);
  for (const b of (node.branches || [])) if (b.finding && !findingById[b.finding]) freeKeys.add(pw.id + ': ' + b.finding);
});

// meaning 未記入の所見を警告（学習の核なので）
const noMeaning = FINDINGS.filter((f) => !f.meaning).map((f) => f.id);

// ID重複（コアと各科モジュールで同じidを定義してしまった場合）
for (const [k, ids] of Object.entries(DUPLICATE_IDS)) {
  for (const id of (ids || [])) err(`${k}: id '${id}' が重複定義されている（先に読まれた定義が採用された）`);
}

// パネル検査の構成要素が実在するか
for (const t of TESTS) for (const pid of (t.panel || [])) if (!testById[pid]) err(`test ${t.id}: panel '${pid}' が存在しない`);

// 疾患の typical キーが REF に存在するか（入力デモが効かなくなるため）
for (const d of DISEASES) for (const k of Object.keys(d.typical || {})) {
  if (!ATLAS.REF[k]) console.log(`⚠ disease ${d.id}: typical '${k}' が referenceRanges に無い（デモ値が評価されない）`);
}

console.log(`\n検査 ${TESTS.length} / 所見 ${FINDINGS.length} / 疾患 ${DISEASES.length} / 鑑別路 ${PATHWAYS.length} / 入口 ${PRESENTATIONS.length} / 診療系統 ${ATLAS_STATS.systems}`);
if (freeKeys.size) { console.log('\nℹ 分岐の自由記述キー（Finding未登録＝マップのハイライト対象外・意図的なら可）:'); for (const k of freeKeys) console.log('   - ' + k); }
if (noMeaning.length) console.log(`\n⚠ meaning 未記入の所見 ${noMeaning.length} 件: ${noMeaning.join(', ')}`);
console.log(errs === 0 ? '\n✅ 参照整合性 OK（dangling reference なし）' : `\n⚠ ${errs} 件のエラー`);
process.exit(errs === 0 ? 0 : 1);
