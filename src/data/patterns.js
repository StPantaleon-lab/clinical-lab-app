// src/data/patterns.js
// ═══════════════════════════════════════════════════════════════════════
//  組み合わせ解釈 ― 単独では意味が定まらず、関係で読む検査
// ═══════════════════════════════════════════════════════════════════════
//  when(ev, v): ev は各検査の 'low'|'normal'|'high'、v は生値。
//  成立時に meaning を提示し、suggests で疾患群へ橋渡しする。
//  ★ Sonnetへ: uses に関与検査 Test.id を並べる（逆引き＆UI表示に使う）。
// ═══════════════════════════════════════════════════════════════════════

export const PATTERNS = [
  {
    id: 'cholestatic', label: '胆道系優位の肝障害', uses: ['ALP', 'GGT'], layer: 1,
    when: (ev) => ev.ALP === 'high' && ev.GGT === 'high',
    meaning: 'ALP↑かつγGTP↑＝ALPの上昇は肝胆道由来。閉塞性黄疸・胆汁うっ滞を考える。',
    suggests: ['grp_obstructive_jaundice'],
  },
  {
    id: 'bone_alp', label: '骨由来のALP上昇', uses: ['ALP', 'GGT'], layer: 2,
    when: (ev) => ev.ALP === 'high' && ev.GGT === 'normal',
    meaning: 'ALP↑だがγGTP正常＝ALPは骨由来。骨転移・成長期・骨疾患を考える(肝胆道は否定的)。',
    suggests: [],
  },
  {
    id: 'hepatocellular', label: '肝細胞優位の肝障害', uses: ['AST', 'ALT', 'ALP'], layer: 1,
    when: (ev) => (ev.AST === 'high' || ev.ALT === 'high') && ev.ALP !== 'high',
    meaning: 'トランスアミナーゼ優位＝肝細胞傷害型。ウイルス性・薬剤性・自己免疫性肝炎を考える。',
    suggests: ['grp_hepatitis'],
  },
  {
    id: 'alcoholic', label: 'アルコール性肝障害パターン', uses: ['AST', 'ALT', 'GGT'], layer: 2,
    when: (ev, v) => ev.GGT === 'high' && parseFloat(v.AST) > parseFloat(v.ALT),
    meaning: 'AST>ALT かつ γGTP↑＝アルコール性肝障害を強く示唆。',
    suggests: ['grp_hepatitis'],
  },
  {
    id: 'hemolysis_ld', label: '溶血/組織崩壊パターン(LD↑・AST↑)', uses: ['LD', 'AST', 'ALT'], layer: 2,
    when: (ev) => ev.LD === 'high' && ev.AST === 'high' && ev.ALT !== 'high',
    meaning: 'LD↑＋AST↑でALT正常＝肝細胞由来でない。溶血・心筋傷害・組織崩壊(腫瘍崩壊等)を考える。',
    suggests: ['grp_hemolytic'],
  },
  {
    id: 'dic_pattern', label: 'DICパターン', uses: ['PLT', 'Fib', 'FDP', 'DD', 'PT'], layer: 2,
    when: (ev) => ev.PLT === 'low' && (ev.FDP === 'high' || ev.DD === 'high'),
    meaning: '血小板減少＋FDP/D-ダイマー上昇(±Fib低下・PT延長)＝消費性凝固障害(DIC)。基礎疾患を探す。',
    suggests: ['disseminated_ic'],
  },
  {
    id: 'obstructive_bil', label: '閉塞性黄疸パターン', uses: ['TBil', 'DBil', 'ALP', 'GGT'], layer: 1,
    when: (ev) => ev.TBil === 'high' && ev.DBil === 'high' && ev.ALP === 'high',
    meaning: '直接Bil優位＋ALP/γGTP↑＝肝後性(閉塞性)黄疸。US/CT/MRCPで閉塞部位を探す。',
    suggests: ['grp_obstructive_jaundice'],
  },

  // ══════════ v2追加分 ― 「上位ホルモンと対で読む」型 ══════════
  //  内分泌の読み方の核心。片方だけでは原発性か中枢性かが決まらない。
  {
    id: 'primary_thyrotoxicosis', label: '原発性甲状腺中毒症（TSH↓＋FT4↑）', uses: ['TSH','FT4'], layer: 1,
    when: (ev) => ev.TSH === 'low' && ev.FT4 === 'high',
    meaning: '甲状腺ホルモンが多く、下垂体は正しくTSHを抑えている＝甲状腺自身の問題。次はシンチで「作っている(Basedow)」か「壊れて漏れている(甲状腺炎)」かを分ける。',
    suggests: ['grp_thyrotoxicosis'],
  },
  {
    id: 'primary_hypothyroid', label: '原発性甲状腺機能低下症（TSH↑＋FT4↓）', uses: ['TSH','FT4'], layer: 1,
    when: (ev) => ev.TSH === 'high' && ev.FT4 === 'low',
    meaning: '甲状腺が働けず、下垂体がTSHを振り絞っている。橋本病が代表。LDL↑・CK↑・徐脈を伴う。',
    suggests: ['hashimoto'],
  },
  {
    id: 'central_hypothyroid', label: '中枢性甲状腺機能低下症（TSH低〜正常＋FT4↓）', uses: ['TSH','FT4'], layer: 2,
    when: (ev) => (ev.TSH === 'low' || ev.TSH === 'normal') && ev.FT4 === 'low',
    meaning: 'FT4が低いのにTSHが上がってこない＝下垂体が反応していない。他の前葉ホルモンの欠落と、副腎不全の合併を必ず確認する。',
    suggests: ['grp_pituitary'],
  },
  {
    id: 'primary_adrenal_insuff', label: '原発性副腎不全（Cort↓＋ACTH↑）', uses: ['Cort','ACTH','Na','K'], layer: 2,
    when: (ev) => ev.Cort === 'low' && ev.ACTH === 'high',
    meaning: '副腎が作れず、下垂体がACTHを出し続けている。ACTH前駆体由来のMSH作用で色素沈着。鉱質コルチコイドも欠けるので低Na＋高K。',
    suggests: ['addison'],
  },
  {
    id: 'acth_independent_cushing', label: 'ACTH非依存性Cushing（Cort↑＋ACTH↓）', uses: ['Cort','ACTH'], layer: 2,
    when: (ev) => ev.Cort === 'high' && ev.ACTH === 'low',
    meaning: '副腎が自律的にコルチゾールを作り、下垂体は正しく抑制されている＝副腎腺腫。ACTHが高ければ下垂体性(Cushing病)か異所性。',
    suggests: ['cushing'],
  },
  {
    id: 'pth_dependent_hyperca', label: 'PTH依存性高Ca血症（Ca↑＋PTH↑＋P↓）', uses: ['Ca','PTH','P'], layer: 2,
    when: (ev) => ev.Ca === 'high' && (ev.PTH === 'high' || ev.PTH === 'normal'),
    meaning: '高Caなのに副甲状腺が抑制されていない＝副甲状腺が犯人。PTHは腎でPを捨てるので「高Ca＋低P」が指紋になる。',
    suggests: ['hyperparathyroidism'],
  },
  {
    id: 'pth_independent_hyperca', label: 'PTH非依存性高Ca血症（Ca↑＋PTH↓）', uses: ['Ca','PTH'], layer: 2,
    when: (ev) => ev.Ca === 'high' && ev.PTH === 'low',
    meaning: '副甲状腺は正しく抑制されている。ではCaはどこから来たか ―― 腫瘍のPTHrP、骨転移、多発性骨髄腫を探す。',
    suggests: ['malignancy_hypercalcemia','myeloma'],
  },
  {
    id: 'primary_aldo_pattern', label: '原発性アルドステロン症パターン（PAC↑＋PRA↓＋低K）', uses: ['Aldo','PRA','K','SBP'], layer: 2,
    when: (ev) => ev.Aldo === 'high' && ev.PRA === 'low',
    meaning: 'アルドステロンが自律的に出てレニンが抑制されている。高血圧＋低K血症＋代謝性アルカローシス。二次性高血圧で最多。',
    suggests: ['primary_aldosteronism'],
  },

  // ══════════ 鉄・貧血 ══════════
  {
    id: 'iron_deficiency_pattern', label: '鉄欠乏パターン（Fe↓＋TIBC↑＋フェリチン↓）', uses: ['Fe','TIBC','Ferritin','MCV'], layer: 2,
    when: (ev) => ev.Ferritin === 'low' && (ev.Fe === 'low' || ev.TIBC === 'high'),
    meaning: '貯蔵鉄が枯渇し、トランスフェリンが鉄を求めて増える（TIBC↑）。確定したら必ず出血源（消化管・月経）を探す。',
    suggests: ['iron_deficiency'],
  },
  {
    id: 'acd_pattern', label: '慢性疾患性貧血パターン（Fe↓＋TIBC↓〜正常＋フェリチン↑）', uses: ['Fe','TIBC','Ferritin'], layer: 2,
    when: (ev) => ev.Fe === 'low' && ev.Ferritin === 'high',
    meaning: '鉄はあるのに使えない（ヘプシジンによる隔離）。鉄欠乏との決定的な差はフェリチン（貯蔵鉄）が保たれていること。',
    suggests: ['chronic_disease_anemia'],
  },
  {
    id: 'hemolysis_full', label: '溶血の4点セット（Hapto↓＋間接Bil↑＋LD↑＋Ret↑）', uses: ['Hapto','IBil','LD','Ret'], layer: 2,
    when: (ev) => ev.Hapto === 'low' && (ev.IBil === 'high' || ev.LD === 'high'),
    meaning: '赤血球が壊れ、遊離Hbがハプトグロビンを消費し、非抱合型Bilと細胞内LDが増え、骨髄が代償してRetが上がる。次は直接クームスでAIHAを分ける。',
    suggests: ['grp_hemolytic'],
  },
  {
    id: 'tma_vs_dic', label: 'TMA（血小板↓＋破砕赤血球＋凝固正常）', uses: ['PLT','LD','Fib','PT'], layer: 2,
    when: (ev) => ev.PLT === 'low' && ev.LD === 'high' && ev.Fib !== 'low' && ev.PT !== 'high',
    meaning: '血小板減少と溶血がありながら、PT・フィブリノゲンが正常＝消費性凝固障害(DIC)ではない。TTP/HUSを考え、血漿交換を急ぐ。',
    suggests: ['ttp'],
  },

  // ══════════ 腎・電解質・酸塩基 ══════════
  {
    id: 'prerenal_pattern', label: '腎前性パターン（BUN/Cre>20＋尿Na低値）', uses: ['BUN','Cre','UNa'], layer: 2,
    when: (ev, v) => { const b=parseFloat(v.BUN), c=parseFloat(v.Cre); return !isNaN(b)&&!isNaN(c)&&c>0&&(b/c)>=20 && ev.UNa !== 'high'; },
    meaning: '腎そのものは無事で、尿細管がNaと水を必死に再吸収している。輸液で戻る。上部消化管出血でも同じパターンになる。',
    suggests: ['prerenal_aki'],
  },
  {
    id: 'atn_pattern', label: '腎性(ATN)パターン（尿Na高値＋濃縮できない）', uses: ['UNa','UOsm','Cre'], layer: 2,
    when: (ev) => ev.Cre === 'high' && ev.UNa === 'high',
    meaning: '尿細管が壊れてNaを再吸収できず、尿を濃縮できない。輸液では戻らない。腎前性との分岐点。',
    suggests: ['atn'],
  },
  {
    id: 'nephrotic_pattern', label: 'ネフローゼパターン（高度蛋白尿＋低Alb＋高LDL）', uses: ['UPro','UPCR','Alb','LDL'], layer: 1,
    when: (ev) => ev.Alb === 'low' && (ev.UPro === 'high' || ev.UPCR === 'high'),
    meaning: 'アルブミンが尿へ漏れ、膠質浸透圧が下がって浮腫。肝が代償的にリポ蛋白を作り高LDLに。アンチトロンビンIIIも失われ血栓症のリスク。',
    suggests: ['nephrotic_syndrome'],
  },
  {
    id: 'siadh_pattern', label: 'SIADHパターン（低Na＋低浸透圧なのに尿は濃い）', uses: ['Na','Osm','UOsm','UNa'], layer: 2,
    when: (ev) => ev.Na === 'low' && ev.Osm === 'low' && ev.UOsm === 'high',
    meaning: '低張血症なら尿は薄くなるはず。それなのに濃縮されている＝ADHが不適切に出続けている。肺小細胞癌・肺炎・中枢神経疾患・薬剤を探す。',
    suggests: ['siadh'],
  },
  {
    id: 'metabolic_acidosis_ag', label: 'AG開大性代謝性アシドーシス', uses: ['pH','HCO3','Na','Cl','Lac'], layer: 2,
    when: (ev, v) => {
      const na=parseFloat(v.Na), cl=parseFloat(v.Cl), hco3=parseFloat(v.HCO3);
      if ([na,cl,hco3].some(isNaN)) return false;
      return ev.pH === 'low' && hco3 < 22 && (na-(cl+hco3)) > 16;
    },
    meaning: '酸が加わってHCO3が消費された。乳酸(ショック・腸管虚血)・ケトン(DKA)・腎不全・中毒。原因物質を探す。',
    suggests: ['dka','sepsis','mesenteric_ischemia'],
  },
  {
    id: 'hypochloremic_alkalosis', label: '低Cl性代謝性アルカローシス（嘔吐パターン）', uses: ['HCO3','Cl','K'], layer: 2,
    when: (ev) => ev.HCO3 === 'high' && ev.Cl === 'low',
    meaning: '胃液(HCl)とKを吐き続けて失った結果。乳児なら肥厚性幽門狭窄症、成人なら幽門狭窄・利尿薬・アルドステロン過剰。',
    suggests: ['pyloric_stenosis'],
  },
  {
    id: 'type2_resp_failure', label: 'II型呼吸不全（PaO2↓＋PaCO2↑）', uses: ['PaO2','PaCO2','pH'], layer: 1,
    when: (ev) => ev.PaO2 === 'low' && ev.PaCO2 === 'high',
    meaning: '肺胞低換気。COPD増悪・神経筋疾患・鎮静。高濃度酸素はCO2ナルコーシスを招きうるため、NPPVを考える。',
    suggests: ['copd'],
  },

  // ══════════ 循環器・膵・糖 ══════════
  {
    id: 'acs_pattern', label: '心筋壊死パターン（トロポニン↑＋CK-MB↑）', uses: ['Trop','CKMB','CK'], layer: 1,
    when: (ev) => ev.Trop === 'high',
    meaning: 'トロポニンは心筋に高特異的。ただし心不全・腎不全・肺塞栓でも軽度上昇するため、心電図と症状で解釈する。',
    suggests: ['stemi'],
  },
  {
    id: 'heart_failure_pattern', label: '心不全パターン（BNP↑＋低Na）', uses: ['BNP','Na'], layer: 1,
    when: (ev) => ev.BNP === 'high',
    meaning: '心室壁ストレスの指標。低Na血症を伴うのは、有効循環血漿量低下でADHが出るため。低Naは心不全の重症度指標でもある。',
    suggests: ['heart_failure'],
  },
  {
    id: 'pancreatitis_pattern', label: '急性膵炎パターン（AMY↑＋リパーゼ↑）', uses: ['AMY','Lip'], layer: 1,
    when: (ev) => ev.Lip === 'high' || ev.AMY === 'high',
    meaning: 'リパーゼは膵特異性がアミラーゼより高く、上昇が持続する。アミラーゼ単独高値では唾液腺・腎不全・マクロアミラーゼ血症も考える。',
    suggests: ['acute_pancreatitis'],
  },
  {
    id: 'dka_pattern', label: 'DICパターンではなくDKA（高血糖＋ケトン＋AG開大）', uses: ['Glu','pH','HCO3'], layer: 1,
    when: (ev) => ev.Glu === 'high' && ev.pH === 'low' && ev.HCO3 === 'low',
    meaning: 'インスリン絶対欠乏で脂肪分解が暴走しケトン体が蓄積。血清Kは細胞外シフトで見かけ上正常〜高値だが、体内総量は枯渇している。',
    suggests: ['dka'],
  },
  {
    id: 'cirrhosis_synthetic', label: '肝合成能低下パターン（Alb↓＋ChE↓＋PT延長＋PLT↓）', uses: ['Alb','ChE','PT','PLT'], layer: 2,
    when: (ev) => ev.Alb === 'low' && (ev.ChE === 'low' || ev.PT === 'high'),
    meaning: '肝が蛋白（アルブミン・凝固因子・ChE）を作れない。血小板減少は脾機能亢進（門脈圧亢進）を示し、線維化進行の代替指標になる。',
    suggests: ['liver_cirrhosis'],
  },
];

export const PATTERN_BY_ID = Object.fromEntries(PATTERNS.map(p => [p.id, p]));
