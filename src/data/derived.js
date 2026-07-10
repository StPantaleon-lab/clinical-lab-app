// src/data/derived.js
// ═══════════════════════════════════════════════════════════════════════
//  算出値 ― 他の検査値から計算して使う指標
// ═══════════════════════════════════════════════════════════════════════
//  compute(values, ctx) は値が計算できないとき null を返す。
//  formula / meaning / interpret は学習用（UIに表示）。
//  ★ Sonnetへ: inputs には計算に使う Test.id を並べる（逆引きに使う）。
// ═══════════════════════════════════════════════════════════════════════

const n = (v, k) => { const x = parseFloat(v?.[k]); return Number.isNaN(x) ? null : x; };

export const DERIVED = [
  {
    id: 'AST_ALT_ratio', label: 'AST/ALT比', inputs: ['AST', 'ALT'],
    unit: '', formula: 'AST ÷ ALT',
    compute: (v) => { const a = n(v,'AST'), b = n(v,'ALT'); return (a!=null && b>0) ? +(a/b).toFixed(2) : null; },
    meaning: '肝障害の様式を示す。>2はアルコール性/肝硬変、<1は急性ウイルス性/脂肪肝を示唆。',
    interpret: (x) => x >= 2 ? 'AST優位(≥2)：アルコール性・肝硬変を示唆'
                    : x < 1  ? 'ALT優位(<1)：急性ウイルス性・NAFLDを示唆'
                    : '境界域：経過と他項目で判断',
  },
  {
    id: 'BUN_Cre_ratio', label: 'BUN/Cre比', inputs: ['BUN', 'Cre'],
    unit: '', formula: 'BUN ÷ Cre',
    compute: (v) => { const a = n(v,'BUN'), b = n(v,'Cre'); return (a!=null && b>0) ? +(a/b).toFixed(1) : null; },
    meaning: '腎前性か腎性かの手がかり。>20は脱水/消化管出血(腎前性)、≒10は腎性。',
    interpret: (x) => x >= 20 ? '高比(≥20)：腎前性(脱水・消化管出血)を示唆'
                    : x <= 10 ? '正常比：腎実質性を示唆' : '中間',
  },
  {
    id: 'eGFR', label: 'eGFR(推算)', inputs: ['Cre'],
    unit: 'mL/min/1.73m²', formula: '194×Cr^-1.094×Age^-0.287 (女性×0.739) ※日本人式',
    compute: (v, ctx) => {
      const cr = n(v,'Cre'), age = n(v,'Age');
      if (cr == null || cr <= 0 || age == null) return null;
      let e = 194 * Math.pow(cr, -1.094) * Math.pow(age, -0.287);
      if (ctx?.sex === 'female') e *= 0.739;
      return +e.toFixed(1);
    },
    meaning: '腎機能の推算値。CKDの病期(G1〜G5)分類に用いる。年齢が必要。',
    interpret: (x) => x >= 90 ? 'G1(正常〜高値)' : x >= 60 ? 'G2(軽度低下)'
                    : x >= 45 ? 'G3a' : x >= 30 ? 'G3b' : x >= 15 ? 'G4(高度低下)' : 'G5(末期腎不全)',
  },
  {
    id: 'corrected_Ca', label: '補正Ca', inputs: ['Ca', 'Alb'],
    unit: 'mg/dL', formula: 'Ca + (4 − Alb)  ※Alb<4のとき',
    compute: (v) => { const ca = n(v,'Ca'), alb = n(v,'Alb'); if (ca==null||alb==null) return null; return alb < 4 ? +(ca + (4 - alb)).toFixed(1) : ca; },
    meaning: 'アルブミンが低いと総Caは見かけ上低下する。低Alb時は補正して評価。',
    interpret: (x) => x > 10.4 ? '高Ca血症：悪性腫瘍・原発性副甲状腺機能亢進を疑う'
                    : x < 8.5 ? '低Ca血症' : '基準内',
  },
  {
    id: 'NLR', label: '好中球/リンパ球比(NLR)', inputs: ['Neut', 'Lymph'],
    unit: '', formula: '好中球数 ÷ リンパ球数',
    compute: (v) => { const a = n(v,'Neut'), b = n(v,'Lymph'); return (a!=null && b>0) ? +(a/b).toFixed(1) : null; },
    meaning: '全身炎症・ストレスの簡易指標。上昇は重症感染・侵襲・予後不良の代替指標。',
    interpret: (x) => x >= 5 ? '高値：強い炎症/ストレス反応' : '基準域',
  },

  // ══════════ v2追加分（各科展開に伴う算出値）══════════
  {
    id: 'TSAT', label: 'トランスフェリン飽和度(TSAT)', inputs: ['Fe', 'TIBC'],
    unit: '%', formula: '血清鉄 ÷ TIBC × 100',
    compute: (v) => { const a = n(v,'Fe'), b = n(v,'TIBC'); return (a!=null && b>0) ? +(a/b*100).toFixed(1) : null; },
    meaning: '鉄が運搬体にどれだけ乗っているか。鉄欠乏では低下し、鉄過剰では上昇する。フェリチンと組で読む。',
    interpret: (x) => x < 20 ? '低値(<20%)：鉄欠乏または鉄利用障害' : x > 45 ? '高値：鉄過剰・鉄芽球性貧血' : '基準域',
  },
  {
    id: 'anion_gap', label: 'アニオンギャップ(AG)', inputs: ['Na', 'Cl', 'HCO3'],
    unit: 'mEq/L', formula: 'Na − (Cl + HCO3⁻)',
    compute: (v) => { const na=n(v,'Na'), cl=n(v,'Cl'), hco3=n(v,'HCO3'); return (na!=null&&cl!=null&&hco3!=null) ? +(na-(cl+hco3)).toFixed(1) : null; },
    meaning: '代謝性アシドーシスを二分する。AG開大＝酸が増えた（乳酸・ケトン・腎不全・中毒）、AG正常＝HCO3を失った（下痢・尿細管性アシドーシス）。',
    interpret: (x) => x > 16 ? 'AG開大：乳酸/ケトン/腎不全/中毒による酸の蓄積' : x < 8 ? 'AG低下：低Alb・多発性骨髄腫' : 'AG正常：HCO3喪失型（下痢・RTA）',
  },
  {
    id: 'corrected_AG', label: '補正AG（低Alb時）', inputs: ['Na', 'Cl', 'HCO3', 'Alb'],
    unit: 'mEq/L', formula: 'AG + 2.5 × (4.0 − Alb)',
    compute: (v) => { const na=n(v,'Na'), cl=n(v,'Cl'), hco3=n(v,'HCO3'), alb=n(v,'Alb');
      if (na==null||cl==null||hco3==null||alb==null) return null;
      return +((na-(cl+hco3)) + 2.5*(4.0-alb)).toFixed(1); },
    meaning: 'アルブミンは陰イオンなので、低Alb血症ではAGが見かけ上小さくなり、隠れたAG開大を見逃す。補正して評価する。',
    interpret: (x) => x > 16 ? '補正後AG開大：酸の蓄積が隠れていた' : '補正後も正常',
  },
  {
    id: 'FENa', label: 'Na排泄率(FENa)', inputs: ['UNa', 'Na', 'UCre', 'Cre'],
    unit: '%', formula: '(尿Na × 血清Cre) ÷ (血清Na × 尿Cre) × 100',
    compute: (v) => { const un=n(v,'UNa'), sn=n(v,'Na'), uc=n(v,'UCre'), sc=n(v,'Cre');
      if (un==null||sn==null||uc==null||sc==null||sn<=0||uc<=0) return null;
      return +((un*sc)/(sn*uc)*100).toFixed(2); },
    meaning: '「尿細管がまだNaを再吸収できているか」を測る。腎前性AKIと腎性AKI(ATN)を分ける最も直接的な指標。',
    interpret: (x) => x < 1 ? '<1%：腎前性（尿細管は生きていてNaを保持している）' : x > 2 ? '>2%：腎性・ATN（尿細管が壊れNaを保持できない）' : '中間（利尿薬使用時は解釈不能）',
  },
  {
    id: 'FIB4', label: 'FIB-4 index（肝線維化）', inputs: ['Age', 'AST', 'ALT', 'PLT'],
    unit: '', formula: '(年齢 × AST) ÷ (血小板[10⁹/L] × √ALT)',
    compute: (v) => { const age=n(v,'Age'), ast=n(v,'AST'), alt=n(v,'ALT'), plt=n(v,'PLT');
      if (age==null||ast==null||alt==null||plt==null||plt<=0||alt<=0) return null;
      return +((age*ast)/(plt*Math.sqrt(alt))).toFixed(2); },
    meaning: '採血だけで肝線維化を推定する。生検の前段階のスクリーニング（NAFLD・慢性肝炎）。',
    interpret: (x) => x >= 2.67 ? '高値：進行した線維化の可能性が高い' : x < 1.3 ? '低値：進行線維化は否定的' : '中間域：他の指標・画像と合わせる',
  },
  {
    id: 'HOMA_IR', label: 'HOMA-IR（インスリン抵抗性）', inputs: ['Glu', 'Ins'],
    unit: '', formula: '空腹時血糖 × 空腹時インスリン ÷ 405',
    compute: (v) => { const g=n(v,'Glu'), i=n(v,'Ins'); return (g!=null&&i!=null) ? +(g*i/405).toFixed(2) : null; },
    meaning: 'インスリンが効きにくいほど、同じ血糖を保つのに多くのインスリンが要る。2型糖尿病・メタボリック症候群の病態指標。',
    interpret: (x) => x >= 2.5 ? '2.5以上：インスリン抵抗性あり' : '基準域',
  },
  {
    id: 'corrected_Na', label: '補正Na（高血糖時）', inputs: ['Na', 'Glu'],
    unit: 'mEq/L', formula: 'Na + 1.6 × (血糖 − 100) ÷ 100',
    compute: (v) => { const na=n(v,'Na'), g=n(v,'Glu'); if (na==null||g==null) return null;
      return +(na + 1.6*(g-100)/100).toFixed(1); },
    meaning: '高血糖では細胞内から水が引き出されNaが希釈される。見かけの低Na血症に騙されないための補正。',
    interpret: (x) => x > 145 ? '補正後は高Na（自由水欠乏）' : x < 136 ? '補正後も低Na（真の低Na血症）' : '補正後は正常',
  },
  {
    id: 'calc_Osm', label: '血漿浸透圧（計算値）', inputs: ['Na', 'Glu', 'BUN'],
    unit: 'mOsm/kg', formula: '2×Na + 血糖/18 + BUN/2.8',
    compute: (v) => { const na=n(v,'Na'), g=n(v,'Glu'), b=n(v,'BUN');
      if (na==null||g==null||b==null) return null;
      return +(2*na + g/18 + b/2.8).toFixed(1); },
    meaning: '実測浸透圧との差（浸透圧ギャップ）が10以上なら、測れていない浸透圧物質（エタノール・メタノール・エチレングリコール）の存在を示す。',
    interpret: (x) => x < 275 ? '低張：SIADH・水中毒を考える' : x > 295 ? '高張：脱水・高血糖・尿崩症' : '基準域',
  },
  {
    id: 'CTR_note', label: 'BUN/Cre比の再掲（消化管出血）', inputs: ['BUN', 'Cre'],
    unit: '', formula: 'BUN ÷ Cre（>30で上部消化管出血を示唆）',
    compute: (v) => { const a=n(v,'BUN'), b=n(v,'Cre'); return (a!=null&&b>0) ? +(a/b).toFixed(1) : null; },
    meaning: '上部消化管出血では血液が腸で吸収されBUNだけが上がる。脱水と同じ「腎前性パターン」を示すが機序が違う。',
    interpret: (x) => x >= 30 ? '≥30：上部消化管出血・高度脱水を強く示唆' : x >= 20 ? '≥20：腎前性' : '腎性〜正常',
  },
];

export const DERIVED_BY_ID = Object.fromEntries(DERIVED.map(d => [d.id, d]));
