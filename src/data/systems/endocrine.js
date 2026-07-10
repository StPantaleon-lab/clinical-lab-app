// src/data/systems/endocrine.js
// ═══════════════════════════════════════════════════════════════════════
//  内分泌 ― 甲状腺 / 副腎 / 下垂体 / Ca代謝 / 糖代謝
// ═══════════════════════════════════════════════════════════════════════
//  内分泌の鑑別は「ホルモンと、その上位ホルモンを必ずペアで読む」に尽きる。
//  FT4とTSH、コルチゾールとACTH、CaとPTH ―― 一方だけでは原発性か中枢性かが決まらない。
//  そのため多くの所見が Pattern（組み合わせ解釈）として patterns.js にも登録されている。
// ═══════════════════════════════════════════════════════════════════════

import { S, D, C, numT, obsT, panelT, num, obs, kf, st, dz, br, pres } from './_kit.js';

export const TESTS = [
  // 甲状腺
  numT('TSH','TSH','内分泌', S),
  numT('FT4','遊離T4','内分泌', S, { abbr:'FT4' }),
  numT('FT3','遊離T3','内分泌', D, { abbr:'FT3' }),
  numT('TRAb','TSH受容体抗体','内分泌', C),
  numT('TPOAb','抗TPO抗体','内分泌', D),
  numT('TgAb','抗サイログロブリン抗体','内分泌', D),
  numT('Tg','サイログロブリン','内分泌', D),
  panelT('thyroid_panel','甲状腺機能検査（TSH+FT4）','内分泌', S, ['TSH','FT4','FT3'],
    'TSHとFT4は必ず対で読む。TSHは負のフィードバックの結果なので、原発性か中枢性かを一撃で決める。'),
  obsT('thyroid_us','甲状腺超音波','imaging','内分泌', D,
    ['thyroid_diffuse_goiter','thyroid_nodule','thyroid_hypoechoic','thyroid_flow_increase'],
    'びまん性腫大＋血流増加＝Basedow病。低エコーで不整な結節＝甲状腺癌を疑う。', { cost:'低' }),
  obsT('thyroid_scinti','甲状腺シンチグラフィー（123I / 99mTc）','imaging','内分泌', D,
    ['scinti_diffuse_uptake','scinti_low_uptake','scinti_cold_nodule','scinti_hot_nodule'],
    '「甲状腺が自分でホルモンを作っているか」を可視化する。摂取率が高ければ合成亢進（Basedow）、' +
    '低ければ破壊による漏出（亜急性甲状腺炎・無痛性甲状腺炎）や外因性摂取。中毒症の原因を分ける決定打。', { cost:'中' }),
  obsT('thyroid_fna','甲状腺穿刺吸引細胞診(FNA)','pathology','内分泌', C,
    ['fna_papillary','fna_lymphocyte'],
    '結節の良悪を細胞診で判定。乳頭癌の核所見（すりガラス核・核内細胞質封入体）。'),

  // 副腎・下垂体
  numT('Cort','コルチゾール（朝）','内分泌', D, { abbr:'Cortisol' }),
  numT('ACTH','ACTH','内分泌', D),
  numT('Aldo','アルドステロン(PAC)','内分泌', D, { abbr:'PAC' }),
  numT('PRA','レニン活性(PRA)','内分泌', D),
  numT('GH','成長ホルモン','内分泌', D),
  numT('IGF1','IGF-1','内分泌', D),
  numT('PRL','プロラクチン','内分泌', D),
  numT('PTH','副甲状腺ホルモン','内分泌', D),
  numT('vitD','25-OHビタミンD','内分泌', D, { abbr:'25-OHD' }),
  obsT('dex_suppression','デキサメサゾン抑制試験','function','内分泌', C,
    ['dex_not_suppressed','dex_suppressed'],
    '外からステロイドを与えてもコルチゾールが下がらない＝自律性分泌。Cushing症候群のスクリーニング/確定。'),
  obsT('acth_load','迅速ACTH負荷試験','function','内分泌', C,
    ['acth_no_response'],
    'ACTHを打っても副腎がコルチゾールを出せない＝原発性副腎不全（Addison病）。'),
  obsT('saline_load','生理食塩水負荷試験（＋カプトプリル試験）','function','内分泌', C,
    ['aldo_not_suppressed'],
    '生食を負荷してもアルドステロンが抑制されない＝自律性分泌＝原発性アルドステロン症の機能確定。'),
  obsT('ogtt','75g経口ブドウ糖負荷試験(OGTT)','function','内分泌', D,
    ['ogtt_dm_pattern','ogtt_gh_not_suppressed'],
    '糖尿病型の判定に用いるほか、先端巨大症ではGHが抑制されないことの確認にも使う。'),
  obsT('water_deprivation','水制限試験＋バソプレシン負荷','function','内分泌', C,
    ['wd_urine_not_concentrated','wd_ddavp_response'],
    '尿崩症の確定。水制限で尿が濃縮しない → DDAVPで濃縮すれば中枢性、しなければ腎性。'),
  obsT('catecholamine','血中・尿中カテコラミンと代謝産物','blood','内分泌', D,
    ['metanephrine_high'],
    '尿中メタネフリン/ノルメタネフリンは褐色細胞腫のスクリーニングとして感度が高い。'),
  obsT('pituitary_mri','下垂体MRI','imaging','内分泌', C,
    ['mri_pituitary_adenoma','mri_empty_sella'],
    '下垂体腺腫の局在診断。微小腺腫は造影ダイナミックで捉える。', { cost:'中' }),
  obsT('adrenal_ct','副腎CT','imaging','内分泌', D,
    ['ct_adrenal_adenoma','ct_adrenal_tumor'],
    '腺腫（低吸収・小型）か褐色細胞腫（大型・造影不均一）か。機能検査の後に行うのが原則。', { cost:'中' }),
  obsT('mibg_scinti','MIBGシンチグラフィー','imaging','内分泌', C,
    ['mibg_uptake'],
    'ノルアドレナリン類似体を取り込むクロム親和性細胞を可視化。褐色細胞腫の局在と転移の確定。', { cost:'高' }),
  obsT('bone_density','骨密度検査(DXA)','imaging','内分泌', D,
    ['bmd_low'],
    '腰椎・大腿骨頸部のYAM値。若年成人平均の70%未満で骨粗鬆症。'),
  obsT('gad_ab','抗GAD抗体・膵島関連自己抗体','blood','内分泌', C,
    ['gad_ab_pos'],
    '膵β細胞への自己免疫を証明。1型糖尿病を2型から分ける。'),

  // 身体所見
  obsT('endocrine_exam','内分泌の身体所見','physical','内分泌', S,
    ['exophthalmos','goiter_diffuse','thyroid_tender','moon_face','central_obesity','striae_rubrae','skin_pigmentation','tremor_fine','acral_enlargement','chvostek_sign'],
    '眼球突出・満月様顔貌・皮膚色素沈着・手指の細かい振戦など、内分泌疾患は「見た目」に出る。'),
];

export const FINDINGS = [
  // 甲状腺
  num('TSH_low','TSH','TSH低値','low','FT4高値と組めば原発性甲状腺中毒症。FT4低値と組めば中枢性（下垂体）甲状腺機能低下症。',1),
  num('TSH_high','TSH','TSH高値','high','FT4低値と組めば原発性甲状腺機能低下症。単独高値なら潜在性甲状腺機能低下症。',1),
  num('FT4_high','FT4','FT4高値','high','甲状腺ホルモン過剰。合成亢進か、破壊による漏出か（シンチで分ける）。',1),
  num('FT4_low','FT4','FT4低値','low','甲状腺ホルモン不足。TSHで原発性か中枢性かを決める。',1),
  num('FT3_high','FT3','FT3高値','high','中毒症。Basedow病ではT3優位になりやすい。',2),
  num('TRAb_high','TRAb','TRAb陽性','high','TSH受容体を刺激する自己抗体＝Basedow病を確定する。',3),
  num('TPOAb_high','TPOAb','抗TPO抗体陽性','high','慢性甲状腺炎（橋本病）の自己免疫の証拠。',2),
  num('TgAb_high','TgAb','抗サイログロブリン抗体陽性','high','橋本病・Basedow病で陽性となる。',2),
  obs('thyroid_diffuse_goiter','thyroid_us','US:びまん性甲状腺腫大','Basedow病・橋本病。結節性かびまん性かで鑑別が分かれる。',1),
  obs('thyroid_nodule','thyroid_us','US:甲状腺結節','境界不整・微細高エコー（微小石灰化）は乳頭癌を示唆。',1),
  obs('thyroid_hypoechoic','thyroid_us','US:内部エコー低下','橋本病・亜急性甲状腺炎で見られる。',2),
  obs('thyroid_flow_increase','thyroid_us','US:血流増加（thyroid inferno）','甲状腺の合成が亢進している＝Basedow病。',2),
  obs('scinti_diffuse_uptake','thyroid_scinti','シンチ:びまん性に摂取率増加','甲状腺が自らホルモンを作っている＝Basedow病。',2),
  obs('scinti_low_uptake','thyroid_scinti','シンチ:摂取率低下','甲状腺は作っていないのに血中ホルモンが高い＝破壊性（亜急性・無痛性甲状腺炎）または外因性摂取。',2),
  obs('scinti_cold_nodule','thyroid_scinti','シンチ:cold nodule（集積欠損）','ホルモンを作らない結節。悪性の可能性があり細胞診へ。',2),
  obs('scinti_hot_nodule','thyroid_scinti','シンチ:hot nodule（集積亢進）','自律性機能性結節（Plummer病）。悪性はまれ。',2),
  obs('fna_papillary','thyroid_fna','細胞診:乳頭癌の核所見','すりガラス核・核溝・核内細胞質封入体。甲状腺癌で最多。',3),
  obs('fna_lymphocyte','thyroid_fna','細胞診:リンパ球浸潤','慢性甲状腺炎（橋本病）。',3),

  // 副腎・下垂体
  num('Cort_high','Cort','コルチゾール高値','high','Cushing症候群。ACTHとの組み合わせでACTH依存性/非依存性を分ける。',2),
  num('Cort_low','Cort','コルチゾール低値','low','副腎不全。ACTH高値なら原発性(Addison)、低値なら続発性(下垂体)。',2),
  num('ACTH_high','ACTH','ACTH高値','high','下垂体または異所性のACTH過剰、あるいは副腎からのフィードバック消失（Addison病）。',2),
  num('ACTH_low','ACTH','ACTH低値','low','副腎自身がコルチゾールを作りすぎている（副腎腺腫）か、下垂体機能低下。',2),
  num('Aldo_high','Aldo','アルドステロン高値','high','レニンとの比(ARR)で原発性か二次性かを分ける。',2),
  num('PRA_low','PRA','レニン活性低値','low','アルドステロンが自律的に出てレニンが抑制されている＝原発性アルドステロン症。',2),
  num('GH_high','GH','GH高値','high','先端巨大症。ただし分泌が拍動性のため単回測定では判定できず、IGF-1とOGTTで評価する。',2),
  num('IGF1_high','IGF1','IGF-1高値','high','GHの作用を積分した指標。先端巨大症のスクリーニングに適する。',2),
  num('PRL_high','PRL','プロラクチン高値','high','プロラクチノーマ・薬剤性（抗精神病薬）・下垂体茎圧迫。無月経・乳汁漏出。',2),
  num('PTH_high','PTH','PTH高値','high','高Ca血症と組めば原発性副甲状腺機能亢進症。低Ca血症と組めば二次性（CKD・VitD欠乏）。',2),
  num('PTH_low','PTH','PTH低値','low','高Ca血症と組めば悪性腫瘍性高Ca血症（PTHrP）。低Ca血症と組めば副甲状腺機能低下症。',2),
  num('vitD_low','vitD','ビタミンD低値','low','腸管Ca吸収低下→低Ca→二次性副甲状腺機能亢進症→骨軟化症・骨粗鬆症。',2),
  obs('dex_not_suppressed','dex_suppression','デキサメサゾンでコルチゾールが抑制されない','ネガティブフィードバックが効かない＝自律性のコルチゾール分泌（Cushing症候群）。',3),
  obs('dex_suppressed','dex_suppression','デキサメサゾンで抑制される','正常。Cushing症候群は否定的。',3),
  obs('acth_no_response','acth_load','ACTH負荷でコルチゾールが上昇しない','副腎皮質そのものが機能していない＝原発性副腎不全（Addison病）。',3),
  obs('aldo_not_suppressed','saline_load','生食負荷でアルドステロンが抑制されない','自律性分泌＝原発性アルドステロン症の機能確定。',3),
  obs('metanephrine_high','catecholamine','尿中メタネフリン高値','カテコラミン過剰産生＝褐色細胞腫。',2),
  obs('mibg_uptake','mibg_scinti','MIBGシンチ:腫瘍に異常集積','クロム親和性細胞の腫瘍を確定。多発・転移も検出できる。',3),
  obs('mri_pituitary_adenoma','pituitary_mri','MRI:下垂体腺腫','機能性腺腫（GH/PRL/ACTH産生）か非機能性か。視交叉圧迫で両耳側半盲。',3),
  obs('mri_empty_sella','pituitary_mri','MRI:empty sella','下垂体機能低下症の背景となりうる。',3),
  obs('ct_adrenal_adenoma','adrenal_ct','CT:副腎腺腫（小型・低吸収）','機能検査で自律性が示された後に局在診断として撮る。',2),
  obs('ct_adrenal_tumor','adrenal_ct','CT:副腎腫瘍（大型・不均一）','褐色細胞腫・副腎癌。造影は原則カテコラミン確認後に。',2),

  // 糖代謝・Ca代謝
  obs('gad_ab_pos','gad_ab','抗GAD抗体陽性','膵β細胞に対する自己免疫＝1型糖尿病を確定する。',3),
  obs('ogtt_dm_pattern','ogtt','OGTT 2時間値 ≥200mg/dL','糖尿病型。別日にもう一度、またはHbA1c 6.5%以上と組めば糖尿病と診断。',2),
  obs('ogtt_gh_not_suppressed','ogtt','OGTTでGHが抑制されない','正常ならブドウ糖でGHは抑制される。抑制不良＝先端巨大症の確定所見。',3),
  obs('wd_urine_not_concentrated','water_deprivation','水制限しても尿が濃縮しない','ADHが無い（中枢性）か、ADHが効かない（腎性）尿崩症。',3),
  obs('wd_ddavp_response','water_deprivation','DDAVP投与で尿浸透圧が上昇','ADHを補えば濃縮できる＝中枢性尿崩症。上昇しなければ腎性。',3),
  obs('bmd_low','bone_density','骨密度低下（YAM<70%）','骨粗鬆症。ALP・Ca・Pが正常なのが原発性骨粗鬆症の特徴。',2),

  // 身体所見
  obs('exophthalmos','endocrine_exam','眼球突出','眼窩後脂肪・外眼筋の増生。Basedow病に特異的（甲状腺眼症）。',1),
  obs('goiter_diffuse','endocrine_exam','びまん性甲状腺腫','Basedow病・橋本病。結節性なら腫瘍を考える。',1),
  obs('thyroid_tender','endocrine_exam','甲状腺の圧痛','亜急性甲状腺炎。前頸部痛と発熱、赤沈亢進を伴う。',1),
  obs('tremor_fine','endocrine_exam','手指の細かい振戦','交感神経活性亢進＝甲状腺中毒症。',1),
  obs('moon_face','endocrine_exam','満月様顔貌','コルチゾール過剰による脂肪再分布。',1),
  obs('central_obesity','endocrine_exam','中心性肥満・水牛様肩','四肢は細く体幹に脂肪。Cushing徴候。',1),
  obs('striae_rubrae','endocrine_exam','赤紫色皮膚線条','蛋白異化で皮膚が薄くなり真皮血管が透ける。Cushing症候群に特異度が高い。',1),
  obs('skin_pigmentation','endocrine_exam','皮膚・粘膜の色素沈着','ACTH前駆体(POMC)由来のMSH作用。原発性副腎不全(Addison病)に特徴的で、続発性では起こらない。',1),
  obs('acral_enlargement','endocrine_exam','手足・下顎の肥大','GH過剰。指輪や靴のサイズ変化で気づかれる。',1),
  obs('chvostek_sign','endocrine_exam','Chvostek徴候・Trousseau徴候','低Ca血症による神経筋の被刺激性亢進（テタニー）。',1),
];

export const GROUPS = {
  grp_thyrotoxicosis: '甲状腺中毒症',
  grp_hypothyroid:    '甲状腺機能低下症',
  grp_thyroid_tumor:  '甲状腺腫瘍',
  grp_adrenal_excess: '副腎ホルモン過剰',
  grp_adrenal_insuff: '副腎不全',
  grp_pituitary:      '下垂体疾患',
  grp_calcium:        'Ca・骨代謝異常',
  grp_diabetes:       '糖尿病',
  grp_water_balance:  '水・Na代謝異常',
};

export const DISEASES = [
  {
    id:'graves', name:'Basedow病（Graves病）', system:'内分泌', group:'grp_thyrotoxicosis',
    oneLiner:'TSH↓＋FT4↑＋TRAb陽性＋眼球突出。シンチ摂取率は増加。',
    keyFindings:[ kf('TSH_low',S,'rule_in',true), kf('FT4_high',S,'rule_in',true), kf('tremor_fine',S), kf('exophthalmos',S), kf('goiter_diffuse',S), kf('scinti_diffuse_uptake',D,'rule_in',true), kf('TRAb_high',C,'rule_in',true) ],
    confirm:'TRAb_high', confirmNote:'TSH低値＋FT4高値の中毒症で、TRAb陽性なら確定。破壊性甲状腺炎との決定的な差はシンチの摂取率（増加 vs 低下）。',
    mechanism:'TSH受容体を刺激する自己抗体がホルモン合成を持続的に駆動する。眼窩線維芽細胞にも同じ受容体があり眼症を起こす。',
    typical:{ TSH:0.01, FT4:3.8, FT3:12.0, TRAb:8.5 },
  },
  {
    id:'subacute_thyroiditis', name:'亜急性甲状腺炎', system:'内分泌', group:'grp_thyrotoxicosis',
    oneLiner:'有痛性甲状腺腫＋発熱＋赤沈亢進。中毒症だがシンチ摂取率は低下。',
    keyFindings:[ kf('thyroid_tender',S,'rule_in',true), kf('ESR_high',S,'rule_in',true), kf('FT4_high',S), kf('TSH_low',S), kf('scinti_low_uptake',D,'rule_in',true), kf('TRAb_high',C,'rule_out') ],
    confirm:'scinti_low_uptake', confirmNote:'中毒症状があるのにシンチ摂取率が低い＝甲状腺が作っているのではなく壊れて漏れている。Basedow病との鑑別の核心。',
    mechanism:'ウイルス感染後の肉芽腫性炎症で濾胞が破壊され、貯蔵ホルモンが血中に漏出する。数か月で一過性の機能低下期を経て回復。',
    typical:{ TSH:0.02, FT4:2.9, ESR:78, CRP:4.5 },
  },
  {
    id:'hashimoto', name:'橋本病（慢性甲状腺炎）', system:'内分泌', group:'grp_hypothyroid',
    oneLiner:'TSH↑＋FT4↓＋抗TPO抗体陽性。無痛性のびまん性甲状腺腫。',
    keyFindings:[ kf('TSH_high',S,'rule_in',true), kf('FT4_low',S,'rule_in',true), kf('goiter_diffuse',S), kf('TPOAb_high',D,'rule_in',true), kf('TgAb_high',D), kf('LDL_high',D), kf('CK_high',D) ],
    confirm:'TPOAb_high', confirmNote:'原発性甲状腺機能低下症（TSH↑FT4↓）＋抗TPO/Tg抗体。LDL・CKの上昇や徐脈・浮腫（粘液水腫）を伴う。',
    mechanism:'自己免疫による甲状腺濾胞の慢性破壊。代謝低下でLDL異化が落ち、筋からCKが漏れる。',
    typical:{ TSH:38.0, FT4:0.5, LDL:180, CK:420 },
  },
  {
    id:'thyroid_cancer', name:'甲状腺乳頭癌', system:'内分泌', group:'grp_thyroid_tumor',
    oneLiner:'無痛性の硬い結節。甲状腺機能は正常。リンパ節転移が多いが予後良好。',
    keyFindings:[ kf('thyroid_nodule',S,'rule_in',true), kf('TSH_high',S,'rule_out'), kf('scinti_cold_nodule',D), kf('lymphadenopathy',D), kf('fna_papillary',C,'rule_in',true) ],
    confirm:'fna_papillary', confirmNote:'結節はまず甲状腺機能を確認し（機能亢進ならhot noduleで良性）、機能正常でエコー所見が疑わしければFNA。',
    mechanism:'濾胞上皮由来。乳頭状構造と特徴的核所見。リンパ行性転移が多い。',
  },
  {
    id:'cushing', name:'Cushing症候群', system:'内分泌', group:'grp_adrenal_excess',
    oneLiner:'中心性肥満・満月様顔貌・赤紫色皮膚線条。デキサメサゾンで抑制されない。',
    keyFindings:[ kf('moon_face',S), kf('central_obesity',S), kf('striae_rubrae',S,'rule_in',true), kf('Glu_high',S), kf('K_low',D), kf('Cort_high',D,'rule_in',true), kf('dex_not_suppressed',C,'rule_in',true), kf('ACTH_low',D), kf('ct_adrenal_adenoma',D) ],
    confirm:'dex_not_suppressed', confirmNote:'まず「自律性分泌があるか」をデキサメサゾン抑制試験で確定し、その後ACTHで原因の階層（下垂体／副腎／異所性）を決める。順序を逆にしない。',
    mechanism:'コルチゾール過剰による蛋白異化・糖新生亢進・脂肪再分布。ACTH依存性（Cushing病・異所性）ではACTHが高く、副腎腺腫では低い。',
    typical:{ Cort:28, ACTH:3, Glu:145, K:3.1 },
  },
  {
    id:'primary_aldosteronism', name:'原発性アルドステロン症', system:'内分泌', group:'grp_adrenal_excess',
    oneLiner:'低K血症を伴う高血圧。アルドステロン↑・レニン↓（ARR高値）。',
    keyFindings:[ kf('SBP_high',S,'rule_in',true), kf('K_low',S,'rule_in',true), kf('Aldo_high',D,'rule_in',true), kf('PRA_low',D,'rule_in',true), kf('HCO3_high',D), kf('aldo_not_suppressed',C,'rule_in',true), kf('ct_adrenal_adenoma',D) ],
    confirm:'aldo_not_suppressed', confirmNote:'ARR（PAC/PRA）でスクリーニング → 生食負荷等の機能確認試験で確定 → 副腎静脈サンプリングで左右差を決め手術適応を判断。二次性高血圧で最多。',
    mechanism:'自律性アルドステロン過剰でNa再吸収とK・H+排泄が亢進。高血圧＋低K＋代謝性アルカローシス。',
    typical:{ SBP:172, K:2.9, Aldo:320, PRA:0.1, HCO3:30 },
  },
  {
    id:'pheochromocytoma', name:'褐色細胞腫', system:'内分泌', group:'grp_adrenal_excess',
    oneLiner:'発作性高血圧・頭痛・動悸・発汗。尿中メタネフリン↑。',
    keyFindings:[ kf('SBP_high',S,'rule_in',true), kf('Glu_high',D), kf('metanephrine_high',D,'rule_in',true), kf('ct_adrenal_tumor',D), kf('mibg_uptake',C,'rule_in',true) ],
    confirm:'mibg_uptake', confirmNote:'生化学的にカテコラミン過剰を示してから局在診断へ。α遮断薬で前処置せずに手術・造影を行わない。',
    mechanism:'クロム親和性細胞の腫瘍がカテコラミンを発作性に放出。10%病（両側/悪性/副腎外/家族性）。',
  },
  {
    id:'addison', name:'Addison病（原発性副腎不全）', system:'内分泌', group:'grp_adrenal_insuff',
    oneLiner:'低Na・高K・低血糖・皮膚色素沈着。コルチゾール↓なのにACTH↑。',
    keyFindings:[ kf('skin_pigmentation',S,'rule_in',true), kf('Na_low',S,'rule_in',true), kf('K_high',S,'rule_in',true), kf('Glu_low',D), kf('Cort_low',D,'rule_in',true), kf('ACTH_high',D,'rule_in',true), kf('acth_no_response',C,'rule_in',true) ],
    confirm:'acth_no_response', confirmNote:'コルチゾール低値＋ACTH高値で原発性。続発性（下垂体性）ではACTHも低く、色素沈着がなく、アルドステロンが保たれるため高Kにならない。',
    mechanism:'副腎皮質の破壊で糖質・鉱質コルチコイドがともに欠乏。ACTH前駆体POMC由来のMSH作用で色素沈着が起こる。',
    typical:{ Na:126, K:5.9, Glu:58, Cort:2.1, ACTH:320 },
  },
  {
    id:'acromegaly', name:'先端巨大症', system:'内分泌', group:'grp_pituitary',
    oneLiner:'手足・下顎の肥大。IGF-1↑、OGTTでGHが抑制されない。',
    keyFindings:[ kf('acral_enlargement',S,'rule_in',true), kf('Glu_high',S), kf('IGF1_high',D,'rule_in',true), kf('GH_high',D), kf('ogtt_gh_not_suppressed',C,'rule_in',true), kf('mri_pituitary_adenoma',C) ],
    confirm:'ogtt_gh_not_suppressed', confirmNote:'GHは拍動性なので単回測定では診断できない。IGF-1（積分値）でスクリーニングし、OGTTでの抑制不良で確定、MRIで局在。',
    mechanism:'GH産生下垂体腺腫。肝でIGF-1が産生され骨・軟部組織が肥大。インスリン抵抗性で糖尿病を合併。',
  },
  {
    id:'prolactinoma', name:'プロラクチノーマ', system:'内分泌', group:'grp_pituitary',
    oneLiner:'無月経・乳汁漏出・視野障害。PRL著明高値。',
    keyFindings:[ kf('PRL_high',S,'rule_in',true), kf('mri_pituitary_adenoma',C,'rule_in',true) ],
    confirm:'mri_pituitary_adenoma', confirmNote:'PRL高値では、まず薬剤性（抗精神病薬・制吐薬）と甲状腺機能低下症、下垂体茎圧迫を除外する。著明高値（>200ng/mL）は腺腫を強く示唆。',
    mechanism:'PRL産生腺腫。PRLがGnRHを抑制して性腺機能低下を来す。ドパミン作動薬が第一選択（手術より薬物）。',
  },
  {
    id:'diabetes_insipidus', name:'尿崩症', system:'内分泌', group:'grp_water_balance',
    oneLiner:'多尿・多飲。高Na＋低張尿。水制限で濃縮しない。',
    keyFindings:[ kf('Na_high',S,'rule_in',true), kf('Osm_low',S,'rule_out'), kf('wd_urine_not_concentrated',C,'rule_in',true), kf('wd_ddavp_response',C) ],
    confirm:'water_deprivation', confirmNote:'水制限試験で尿が濃縮しないことを示し、DDAVPで濃縮すれば中枢性、しなければ腎性。心因性多飲では水制限で濃縮する。',
    mechanism:'ADHの分泌障害（中枢性）または腎集合管のADH反応性低下（腎性）。自由水を保持できず高Na血症へ。',
  },
  {
    id:'siadh', name:'SIADH（ADH不適合分泌症候群）', system:'内分泌', group:'grp_water_balance',
    oneLiner:'低Na＋低血漿浸透圧なのに、尿は濃く尿Naも高い。浮腫はない。',
    keyFindings:[ kf('Na_low',S,'rule_in',true), kf('Osm_low',S,'rule_in',true), kf('UOsm_high',D,'rule_in',true), kf('UNa_high',D,'rule_in',true), kf('edema',S,'rule_out'), kf('Cort_low',D,'rule_out') ],
    confirm:'UOsm_high', confirmNote:'低張性低Na血症で、①体液量正常（浮腫も脱水もない）②尿浸透圧>100③尿Na>20-40④副腎・甲状腺機能正常。肺小細胞癌・肺炎・薬剤・中枢神経疾患を探す。',
    mechanism:'浸透圧に依存せずADHが出続け、集合管で水だけが再吸収される。Naは希釈されるが体内総Naは正常。',
    typical:{ Na:118, Osm:245, UOsm:520, UNa:65 },
  },
  {
    id:'hyperparathyroidism', name:'原発性副甲状腺機能亢進症', system:'内分泌', group:'grp_calcium',
    oneLiner:'高Ca＋低P＋PTH高値。骨・結石・腹部症状・精神症状。',
    keyFindings:[ kf('Ca_high',S,'rule_in',true), kf('P_low',D,'rule_in',true), kf('PTH_high',D,'rule_in',true), kf('ALP_high',D), kf('us_hydronephrosis',D) ],
    confirm:'PTH_high', confirmNote:'高Ca血症でPTHが抑制されていない（高値〜正常）＝PTH依存性。悪性腫瘍性高Ca血症ではPTHは抑制される。',
    mechanism:'副甲状腺腺腫が自律的にPTHを分泌。骨吸収↑・腎でCa再吸収↑/P排泄↑・活性型VitD↑で高Ca低P。',
    typical:{ Ca:12.4, P:2.0, PTH:180, ALP:290 },
  },
  {
    id:'malignancy_hypercalcemia', name:'悪性腫瘍性高Ca血症', system:'内分泌', group:'grp_calcium',
    oneLiner:'高Ca＋PTH低値。PTHrPまたは骨転移・骨髄腫による。',
    keyFindings:[ kf('Ca_high',S,'rule_in',true), kf('PTH_low',D,'rule_in',true), kf('weight_loss',S), kf('punched_out_lesion',D) ],
    confirm:'PTH_low', confirmNote:'高Ca血症でPTHが正常に抑制されている（低値）＝PTH非依存性。原発巣（肺扁平上皮癌・乳癌・骨髄腫）を探す。',
    mechanism:'腫瘍由来PTHrPがPTH受容体を刺激する（体液性）か、骨転移・骨髄腫が局所で骨吸収を起こす。',
  },
  {
    id:'hypoparathyroidism', name:'副甲状腺機能低下症', system:'内分泌', group:'grp_calcium',
    oneLiner:'低Ca＋高P＋PTH低値。テタニー（Chvostek/Trousseau徴候）。',
    keyFindings:[ kf('Ca_low',S,'rule_in',true), kf('P_high',D,'rule_in',true), kf('PTH_low',D,'rule_in',true), kf('chvostek_sign',S) ],
    confirm:'PTH_low', confirmNote:'低Ca血症なのにPTHが上がらない（低値〜不適切正常）。甲状腺手術後が最多。CKDでは逆にPTHが上がる（二次性）。',
    mechanism:'PTH欠乏で骨吸収↓・腎Ca再吸収↓・活性型VitD↓。低Caで神経筋の被刺激性が亢進しテタニー。',
    typical:{ Ca:6.8, P:5.6, PTH:5 },
  },
  {
    id:'osteoporosis', name:'骨粗鬆症', system:'内分泌', group:'grp_calcium',
    oneLiner:'骨密度低下のみ。Ca・P・ALPは正常（そこが骨軟化症との差）。',
    keyFindings:[ kf('bmd_low',D,'rule_in',true), kf('Ca_low',S,'rule_out'), kf('ALP_high',S,'rule_out') ],
    confirm:'bmd_low', confirmNote:'DXAでYAM70%未満、または脆弱性骨折の既往。生化学が正常なことが、骨軟化症（ALP↑・P↓）や骨髄腫（Ca↑）との鑑別点。',
    mechanism:'骨吸収と形成のバランスが崩れ骨量が減少。閉経後のエストロゲン低下・ステロイド長期投与が代表。',
  },
  {
    id:'t1dm', name:'1型糖尿病', system:'内分泌', group:'grp_diabetes',
    oneLiner:'若年発症・急激。インスリン分泌枯渇（CPR低値）＋抗GAD抗体陽性。',
    keyFindings:[ kf('Glu_high',S,'rule_in',true), kf('HbA1c_high',S), kf('u_ketone_pos',S), kf('CPep_low',D,'rule_in',true), kf('gad_ab_pos',C,'rule_in',true) ],
    confirm:'gad_ab_pos', confirmNote:'糖尿病の診断（Glu＋HbA1c）を先に確定し、その上で「1型か2型か」をCペプチド（内因性分泌能）と膵島自己抗体で決める。',
    mechanism:'自己免疫による膵β細胞破壊。インスリン絶対的欠乏でケトーシスに陥りやすい。',
    typical:{ Glu:380, HbA1c:11.2, CPep:0.2 },
  },
  {
    id:'t2dm', name:'2型糖尿病', system:'内分泌', group:'grp_diabetes',
    oneLiner:'肥満・家族歴。インスリン抵抗性＋分泌低下。CPRは保たれる。',
    keyFindings:[ kf('Glu_high',S,'rule_in',true), kf('HbA1c_high',S,'rule_in',true), kf('UAlb_high',D), kf('TG_high',D), kf('gad_ab_pos',C,'rule_out') ],
    confirm:'HbA1c_high', confirmNote:'空腹時126以上/随時200以上/OGTT2時間値200以上のいずれか＋HbA1c6.5%以上で1回の検査で診断可。合併症（網膜症・腎症・神経障害）の検索を同時に始める。',
    mechanism:'インスリン抵抗性に分泌不全が加わる。微量アルブミン尿は腎症の最早期サインで、可逆性がある段階。',
    typical:{ Glu:168, HbA1c:8.4, UAlb:120, TG:280 },
  },
  {
    id:'dka', name:'糖尿病性ケトアシドーシス(DKA)', system:'内分泌', group:'grp_diabetes',
    oneLiner:'高血糖＋ケトン＋AG開大性代謝性アシドーシス。Kは見かけ上正常でも総量は枯渇。',
    keyFindings:[ kf('Glu_high',S,'rule_in',true), kf('u_ketone_pos',S,'rule_in',true), kf('pH_low',S,'rule_in',true), kf('HCO3_low',S,'rule_in',true), kf('K_high',S), kf('PaCO2_low',D) ],
    confirm:'pH_low', confirmNote:'高血糖・ケトン体・アシドーシスの三徴。血清Kは細胞外シフトで見かけ上高いが体内総量は欠乏しており、インスリン投与で急落する（K補正が必須）。',
    mechanism:'インスリン絶対欠乏で脂肪分解が暴走し、ケトン体（酸）が蓄積。Kussmaul呼吸は呼吸性代償。',
    typical:{ Glu:520, pH:7.12, HCO3:8, K:5.4, PaCO2:20 },
  },
];

export const PRESENTATIONS = [
  pres('pres_thyroid','甲状腺機能異常（TSH異常）','abnormality','内分泌',
    'TSHとFT4を必ず対で読む。TSHの向きが原発性か中枢性かを決め、中毒症ならシンチで「作っている／壊れている」を分ける。','pw_thyroid'),
  pres('pres_hypercalcemia','高Ca血症','abnormality','内分泌',
    '低Alb時は補正Caで評価。次はPTH一択 ―― PTHが抑制されていなければ副甲状腺、抑制されていれば悪性腫瘍。','pw_hypercalcemia'),
  pres('pres_hyponatremia','低ナトリウム血症','abnormality','内分泌',
    '血漿浸透圧で偽性を除外し、体液量（浮腫・脱水）を診て、尿Na・尿浸透圧で機序を決める。','pw_hyponatremia'),
  pres('pres_secondary_htn','高血圧（二次性を疑うとき）','abnormality','内分泌',
    '若年発症・治療抵抗性・低K血症・発作性の症状があれば二次性を疑い、内分泌性と腎性を分ける。','pw_secondary_htn'),
  pres('pres_hyperglycemia','高血糖','abnormality','内分泌',
    'まず糖尿病かどうかを確定（Glu＋HbA1c）。次に1型か2型か（CPR・抗GAD抗体）。急性ならケトアシドーシスを除外。','pw_hyperglycemia'),
];

export const PATHWAYS = [
  {
    id:'pw_thyroid', title:'甲状腺機能異常の鑑別', system:'内分泌', entryId:'pres_thyroid',
    summary:'TSHは「甲状腺ホルモンが足りているか」に対する下垂体の答えである。したがってTSHとFT4は必ず対で読む。' +
            'この2つの向きの組み合わせが、原発性か中枢性かをただちに決める。中毒症ならもう一段、' +
            'シンチグラフィーで「甲状腺が作っているのか、壊れて漏れているのか」を分ける。ここが治療を分ける最重要の分岐。',
    root: st('TSH異常', {
      layer:S, test:'FT4', ask:'FT4はどちらに動いているか？（TSHと同方向か、逆方向か）',
      note:'TSHとFT4が逆方向＝甲状腺自身の問題（原発性）。同方向＝下垂体の問題（中枢性）。この読み方が内分泌全体の型。',
      branches:[
        br('FT4_high','TSH↓＋FT4↑ → 原発性甲状腺中毒症', st('甲状腺中毒症', {
          layer:D, test:'thyroid_scinti', ask:'シンチの摂取率は増加か、低下か？',
          note:'「ホルモンが多い」という結果は同じでも、作りすぎ（合成亢進）と壊れて漏れた（破壊性）では治療が正反対。抗甲状腺薬か、経過観察・NSAIDsか。',
          branches:[
            br('scinti_diffuse_uptake','摂取率↑・びまん性（TRAb陽性・眼球突出）',
               dz('graves','Basedow病','TRAb陽性で確定。抗甲状腺薬・アイソトープ・手術。')),
            br('scinti_low_uptake','摂取率↓（有痛性甲状腺腫・赤沈↑）',
               dz('subacute_thyroiditis','亜急性甲状腺炎','破壊性。一過性で自然軽快する。抗甲状腺薬は無効。')),
            br('scinti_hot_nodule','単発のhot nodule',
               st('Plummer病（自律性機能性結節）', { layer:D, test:'thyroid_us', note:'結節が自律的にホルモンを産生。周囲は抑制される。' })),
          ],
        })),
        br('FT4_low','TSH↑＋FT4↓ → 原発性甲状腺機能低下症', st('原発性甲状腺機能低下症', {
          layer:D, test:'TPOAb', ask:'自己抗体（抗TPO/Tg抗体）は？',
          note:'甲状腺が働けないので下垂体がTSHを振り絞っている状態。LDL上昇・CK上昇・徐脈・浮腫を伴う。',
          branches:[
            br('TPOAb_high','抗TPO抗体陽性・びまん性甲状腺腫', dz('hashimoto','橋本病（慢性甲状腺炎）','自己免疫性。甲状腺ホルモン補充。')),
          ],
        })),
        br('TSH_low','TSH↓〜正常＋FT4↓ → 中枢性', st('中枢性（下垂体性）甲状腺機能低下症', {
          layer:C, test:'pituitary_mri', ask:'下垂体病変は？ 他の下垂体ホルモンは？',
          note:'FT4が低いのにTSHが上がってこない＝下垂体が反応していない。他の前葉ホルモンの欠落も必ず確認する。',
          branches:[ br('mri_pituitary_adenoma','下垂体腺腫・empty sella', st('下垂体機能低下症', { layer:C, test:'Cort', note:'副腎不全の合併を先に補正してから甲状腺ホルモンを補充する（順序を誤ると副腎クリーゼ）。' })) ],
        })),
        br('thyroid_nodule','甲状腺機能は正常・結節あり', st('甲状腺結節', {
          layer:D, test:'thyroid_us', ask:'エコー所見は悪性を疑うか？',
          note:'機能正常の結節はまずエコーで良悪を層別化し、疑わしければ細胞診。機能亢進していればhot noduleで悪性はまれ。',
          branches:[ br('fna_papillary','FNAで乳頭癌の核所見', dz('thyroid_cancer','甲状腺乳頭癌','細胞診で確定。予後は良好。')) ],
        })),
      ],
    }),
  },
  {
    id:'pw_hypercalcemia', title:'高Ca血症の鑑別', system:'内分泌', entryId:'pres_hypercalcemia',
    summary:'低Alb血症では総Caが見かけ上低くなるため、まず補正Caで「本当に高いか」を確かめる。' +
            '本当に高ければ、次の一手はPTHただ一つ。高Ca血症では正常ならPTHは抑制されるはずで、' +
            '抑制されていない＝副甲状腺が犯人、抑制されている＝副甲状腺以外（腫瘍）が犯人。',
    root: st('高Ca血症（補正Ca > 10.4）', {
      layer:S, test:'PTH', ask:'PTHは抑制されているか？',
      note:'ここでPTHを測らずに画像を撮るのは順序が逆。PTHの一手で鑑別は二分される。',
      branches:[
        br('PTH_high','PTHが高値〜不適切正常 → PTH依存性', st('PTH依存性高Ca血症', {
          layer:D, test:'P', ask:'Pは低いか？ ALPは？',
          note:'PTHは腎でPを捨てCaを保つ。だから「高Ca＋低P」がPTH過剰の生化学的な指紋になる。',
          branches:[
            br('P_low','P低値・ALP↑・尿路結石', dz('hyperparathyroidism','原発性副甲状腺機能亢進症','副甲状腺腺腫。骨・結石・腹部・精神症状。')),
            br('Cre_high','CKD背景でPTH↑・P↑', st('二次性副甲状腺機能亢進症', { layer:D, test:'vitD', note:'CKDでは低Ca・高Pが刺激となりPTHが上がる。高Caではなく低Ca〜正常Caが基本。' })),
          ],
        })),
        br('PTH_low','PTHが抑制（低値） → PTH非依存性', st('PTH非依存性高Ca血症', {
          layer:D, test:'serum_ep', ask:'悪性腫瘍の証拠は？（PTHrP・骨病変・M蛋白）',
          note:'副甲状腺は正しく抑制されている。ではCaはどこから来たか ―― 腫瘍が骨を溶かしているか、PTHrPを出している。',
          branches:[
            br('m_protein','M蛋白・打ち抜き像・貧血・腎障害', dz('myeloma','多発性骨髄腫','CRAB症状。ALPが上がらないのが骨転移との差。')),
            br('punched_out_lesion','骨転移・PTHrP高値・体重減少', dz('malignancy_hypercalcemia','悪性腫瘍性高Ca血症','原発巣（肺扁平上皮癌・乳癌）を探す。')),
          ],
        })),
      ],
    }),
  },
  {
    id:'pw_hyponatremia', title:'低Na血症の鑑別', system:'内分泌', entryId:'pres_hyponatremia',
    summary:'低Na血症は「Naが足りない」より「水が多い」病態であることが多い。' +
            '手順は3段構え ―― ①血漿浸透圧で偽性/高張性を除外 → ②体液量（浮腫・脱水）を身体所見で評価 → ③尿Na・尿浸透圧で腎の言い分を聞く。',
    root: st('低Na血症（Na < 136）', {
      layer:S, test:'Osm', ask:'血漿浸透圧は低いか？（真の低張性か）',
      note:'高血糖や高脂血症では、Naが低くても浸透圧は保たれる（偽性・高張性）。この除外を飛ばすと全て間違える。',
      branches:[
        br('Osm_low','低張性（真の低Na血症）', st('低張性低Na血症', {
          layer:S, test:'general_exam', ask:'体液量は？（浮腫があるか、脱水か、正常か）',
          note:'ここが背骨の分岐。体液量が「多い／少ない／正常」の3通りで、まったく別の疾患群に分かれる。',
          branches:[
            br('edema','体液量過剰（浮腫あり）', st('浮腫性低Na血症', {
              layer:D, test:'BNP', ask:'心不全か、肝硬変か、ネフローゼか？',
              note:'有効循環血漿量が低下し、ADHとレニンが働いて水とNaを溜め込む。総Naはむしろ増えている。',
              branches:[
                br('BNP_high','BNP↑・III音', dz('heart_failure','心不全','うっ血で有効循環血漿量が低下しADHが出る。')),
                br('us_ascites','腹水・Alb↓・脾腫', dz('liver_cirrhosis','肝硬変','末梢血管拡張で有効循環血漿量が低下。')),
                br('u_fatty_cast','高度蛋白尿・低Alb', dz('nephrotic_syndrome','ネフローゼ症候群','膠質浸透圧低下による浮腫。')),
              ],
            })),
            br('UNa_low','体液量減少（脱水・尿Na低値）', st('体液量減少性低Na血症', {
              layer:D, test:'UNa', ask:'尿Naは低いか（腎外性喪失）、高いか（腎性/副腎不全）？',
              note:'腎が正常なら、脱水時はNaを必死に再吸収する（尿Na<20）。それでも尿Naが高ければ、腎かアルドステロンの異常。',
              branches:[
                br('UNa_high','尿Na高値・高K・色素沈着', dz('addison','Addison病（副腎不全）','鉱質コルチコイド欠乏でNaを保持できない。低Na＋高K。')),
              ],
            })),
            br('UOsm_high','体液量正常（浮腫も脱水もない）', st('等容量性低Na血症', {
              layer:D, test:'UOsm', ask:'尿は濃縮されているか？ 尿Naは？',
              note:'低張血症なのに尿が濃い＝ADHが不適切に出続けている。これがSIADHの本質。',
              branches:[
                br('UOsm_high','尿浸透圧>100・尿Na>20・甲状腺/副腎正常', dz('siadh','SIADH','肺小細胞癌・肺炎・中枢神経疾患・薬剤を探す。')),
                br('FT4_low','甲状腺機能低下症・副腎不全の除外', st('内分泌性の除外', { layer:D, test:'Cort', note:'SIADHは除外診断。甲状腺・副腎機能を必ず確認する。' })),
              ],
            })),
          ],
        })),
        br('Glu_high','高血糖による高張性低Na血症', st('偽性・高張性低Na血症', { layer:S, test:'Glu', note:'血糖100mg/dL上昇ごとにNaは約1.6mEq/L見かけ上低下する。治療対象は高血糖であって低Naではない。' })),
      ],
    }),
  },
  {
    id:'pw_secondary_htn', title:'二次性高血圧の鑑別', system:'内分泌', entryId:'pres_secondary_htn',
    summary:'高血圧の大半は本態性だが、「若年発症・治療抵抗性・低K血症・発作性症状」の手がかりがあれば二次性を疑う。' +
            '内分泌性はホルモンとその上位ホルモンの比（ARR）で、腎血管性はレニンの上昇で捉える。',
    root: st('高血圧（二次性を疑う手がかりあり）', {
      layer:S, test:'K', ask:'低K血症はあるか？',
      note:'低K血症を伴う高血圧を見たら、まず原発性アルドステロン症を考える。二次性高血圧で最も頻度が高い。',
      branches:[
        br('K_low','低K血症あり', st('鉱質コルチコイド過剰の疑い', {
          layer:D, test:'Aldo', ask:'アルドステロン/レニン比(ARR)は？',
          note:'アルドステロンが自律的に出ていれば、レニンは抑制される。両者の「比」を見るのがポイントで、片方だけでは決まらない。',
          branches:[
            br('PRA_low','PAC↑・PRA↓（ARR高値）', st('原発性アルドステロン症の確認', {
              layer:C, test:'saline_load', ask:'負荷試験で抑制されるか？',
              branches:[ br('aldo_not_suppressed','抑制されない', dz('primary_aldosteronism','原発性アルドステロン症','副腎静脈サンプリングで左右差を判定し手術適応を決める。')) ],
            })),
            br('Cort_high','満月様顔貌・皮膚線条・高血糖', dz('cushing','Cushing症候群','コルチゾールが鉱質コルチコイド受容体にも作用する。')),
          ],
        })),
        br('metanephrine_high','発作性高血圧・頭痛・動悸・発汗', st('カテコラミン過剰', {
          layer:D, test:'catecholamine', ask:'尿中メタネフリンは？',
          note:'発作性の三徴（頭痛・動悸・発汗）。α遮断で前処置せずに造影・手術をしてはならない。',
          branches:[ br('mibg_uptake','MIBGシンチで集積', dz('pheochromocytoma','褐色細胞腫','局在診断は生化学的確認の後に行う。')) ],
        })),
        br('us_hydronephrosis','腎機能障害・蛋白尿・腎サイズ左右差', st('腎性高血圧', {
          layer:D, test:'Cre', ask:'腎実質性か、腎血管性か？',
          note:'腎実質性（CKD）はNa貯留、腎血管性（腎動脈狭窄）はレニン上昇が機序。若年女性なら線維筋性異形成。',
          branches:[ br('Cre_high','eGFR低下・蛋白尿', dz('ckd','慢性腎臓病(CKD)','Na貯留と交感神経活性化。')) ],
        })),
      ],
    }),
  },
  {
    id:'pw_hyperglycemia', title:'高血糖の鑑別', system:'内分泌', entryId:'pres_hyperglycemia',
    summary:'2段階で考える。第1段階「糖尿病か」（GluとHbA1c）。第2段階「1型か2型か、あるいは二次性か」' +
            '（Cペプチド＝内因性分泌能、抗GAD抗体＝自己免疫）。急性発症で意識障害があれば、まずケトアシドーシスを除外する。',
    root: st('高血糖', {
      layer:S, test:'HbA1c', ask:'HbA1cは6.5%以上か？ 急性の脱水・意識障害はあるか？',
      note:'HbA1cは過去1〜2か月の平均。急性の高血糖ではHbA1cが追いついていないこともあり、その乖離自体が情報になる。',
      branches:[
        br('u_ketone_pos','ケトン陽性＋アシドーシス（急性）', st('糖尿病緊急症', {
          layer:S, test:'abg', ask:'pH・HCO3・アニオンギャップは？',
          note:'インスリン絶対欠乏の急性像。輸液・インスリン・K補正が同時進行。Kは見かけ上正常でも枯渇している。',
          branches:[ br('pH_low','pH↓・HCO3↓・AG開大', dz('dka','糖尿病性ケトアシドーシス(DKA)','1型糖尿病の初発であることも多い。')) ],
        })),
        br('HbA1c_high','慢性の高血糖（糖尿病型）', st('糖尿病の病型分類', {
          layer:D, test:'CPep', ask:'内因性インスリン分泌は保たれているか？',
          note:'ここが1型/2型を分ける本質。Cペプチドは内因性インスリン分泌の代替指標（外因性インスリンとは区別できる）。',
          branches:[
            br('CPep_low','CPR低値（分泌枯渇）', st('インスリン依存状態', {
              layer:C, test:'gad_ab', ask:'膵島自己抗体は？',
              branches:[ br('gad_ab_pos','抗GAD抗体陽性', dz('t1dm','1型糖尿病','自己免疫性。インスリン療法が必須。')) ],
            })),
            br('UAlb_high','CPR保持・肥満・家族歴', dz('t2dm','2型糖尿病','診断と同時に細小血管合併症の検索を始める。')),
            br('ct_pancreas_calcification','膵石・膵萎縮', dz('chronic_pancreatitis','膵性糖尿病（慢性膵炎）','グルカゴンも失われ低血糖を起こしやすい。')),
            br('Cort_high','中心性肥満・皮膚線条', dz('cushing','Cushing症候群（二次性糖尿病）','糖新生亢進とインスリン抵抗性。')),
            br('acral_enlargement','手足の肥大・IGF-1↑', dz('acromegaly','先端巨大症（二次性糖尿病）','GHの抗インスリン作用。')),
          ],
        })),
      ],
    }),
  },
];
