// src/data/findings.js
// ═══════════════════════════════════════════════════════════════════════
//  所見カタログ ― 「観測結果の最小単位」
// ═══════════════════════════════════════════════════════════════════════
//  ・数値検査の異常 (direction: high/low) と、画像/身体/病理の所見 (direction: present)
//    を同じ構造で扱う。疾患・パスウェイはこの Finding.id を参照する。
//  ・meaning = その所見が意味すること（機序・解釈）。学習の核なので必ず書く。
//
//  ★ Sonnetへ: id 命名規則
//     数値: <TestId>_<low|high>        例: MCV_low, ALT_high
//     所見: <modality略>_<所見>         例: us_gallstone, ct_free_air, path_hcc
// ═══════════════════════════════════════════════════════════════════════

// 数値所見を短く書くヘルパー
const num = (id, testId, label, direction, meaning, layerHint) =>
  ({ id, testId, label, direction, meaning, layerHint });
// 所見（keyword）を短く書くヘルパー
const obs = (id, testId, label, meaning, layerHint) =>
  ({ id, testId, label, direction: 'present', meaning, layerHint });

export const FINDINGS = [
  // ── 数値: 血算・貧血 ────────────────────────────
  num('Hb_low',   'Hb',  'Hb低値（貧血）',       'low',  '酸素運搬能の低下。貧血の存在を示すが原因は問わない。まずMCVで大きさを分類する。', 1),
  num('MCV_low',  'MCV', '小球性（MCV<80）',     'low',  'Hb合成障害を示唆（鉄欠乏・サラセミア・慢性疾患）。', 2),
  num('MCV_high', 'MCV', '大球性（MCV>100）',    'high', 'DNA合成障害を示唆（B12/葉酸欠乏）または網赤血球増加(溶血/出血後)。', 2),
  num('MCV_normal','MCV','正球性（MCV正常）',    'normal','急性出血・溶血・腎性・骨髄不全・慢性疾患を考える。Retで代償の有無を見る。', 2),
  num('MCH_low',  'MCH', '低色素性（MCH低下）',  'low',  '1赤血球あたりのHb量が少ない＝鉄欠乏の裏づけ。', 2),
  num('Ret_high', 'Ret', '網赤血球増加',         'high', '骨髄が赤血球を大量産生＝末梢での喪失(出血/溶血)への代償。', 2),
  num('Ret_low',  'Ret', '網赤血球低下',         'low',  '骨髄の産生低下(骨髄不全・腎性・栄養欠乏)。代償できていない。', 2),

  // ── 数値: 汎血球・凝固 ─────────────────────────
  num('WBC_low',  'WBC', '白血球減少',   'low',  '骨髄抑制・ウイルス感染・脾機能亢進。汎血球減少の一部かを確認。', 1),
  num('WBC_high', 'WBC', '白血球増加',   'high', '細菌感染・炎症・血液腫瘍。核左方移動なら細菌性を示唆。', 1),
  num('PLT_low',  'PLT', '血小板減少',   'low',  '産生低下・消費/破壊亢進・脾捕捉。出血傾向の原因。PT/APTTと合わせ読む。', 1),
  num('PT_prolong','PT', 'PT延長',       'high', '外因系/共通経路の低下。肝障害・DIC・ワーファリン・VitK欠乏。', 2),
  num('APTT_prolong','APTT','APTT延長',  'high', '内因系の低下。血友病・DIC・ヘパリン・ループスアンチコアグラント。', 2),
  num('Fib_low',  'Fib', 'フィブリノゲン低下', 'low', '消費性凝固障害(DIC)や産生低下(重症肝不全)。', 2),
  num('FDP_high', 'FDP', 'FDP上昇',      'high', '線溶亢進＝二次線溶。DICでD-ダイマーとともに上昇。', 2),
  num('DD_high',  'DD',  'D-ダイマー上昇','high', '架橋フィブリンの分解産物。DIC・血栓症・肺塞栓で上昇。', 2),

  // ── 数値: 肝胆膵 ───────────────────────────────
  num('AST_high', 'AST', 'AST上昇',   'high', '肝細胞・心筋・骨格筋・赤血球に分布。ALTと比で肝の障害様式を読む。', 1),
  num('ALT_high', 'ALT', 'ALT上昇',   'high', '肝特異性が高い。肝細胞傷害の指標。', 1),
  num('ALP_high', 'ALP', 'ALP上昇',   'high', '胆道うっ滞または骨代謝亢進。γGTPで由来を鑑別する。', 1),
  num('GGT_high', 'GGT', 'γ-GTP上昇', 'high', '胆道系・アルコール性で上昇。ALP高値の由来判定に必須。', 1),
  num('TBil_high','TBil','総ビリルビン上昇','high','黄疸。直接/間接の優位で肝前性・肝性・肝後性を分ける。', 1),
  num('DBil_high','DBil','直接ビリルビン優位','high','抱合型優位＝肝内胆汁うっ滞・閉塞性黄疸(肝後性)。', 2),
  num('AMY_high', 'AMY', 'アミラーゼ上昇','high','膵逸脱酵素。急性膵炎で基準上限の3倍以上が目安。', 1),
  num('Alb_low',  'Alb', 'アルブミン低下','low', '肝合成能低下・栄養不良・喪失。肝硬変の重症度に関与。', 2),
  num('ChE_low',  'ChE', 'ChE低下',    'low',  '肝の蛋白合成能低下を反映(肝硬変で低下)。', 2),
  num('AFP_high', 'AFP', 'AFP上昇',    'high', '肝細胞癌・肝再生で上昇する腫瘍マーカー。', 2),
  num('PIVKA2_high','PIVKA2','PIVKA-II上昇','high','肝細胞癌に特異性が高い(VitK依存性異常プロトロンビン)。', 2),
  num('CA199_high','CA199','CA19-9上昇','high','膵癌・胆道癌で上昇。閉塞性黄疸でも偽陽性に注意。', 2),
  num('CEA_high', 'CEA', 'CEA上昇',    'high', '大腸癌をはじめ消化器癌で上昇。経過観察に有用。', 2),

  // ── 数値: 腎・炎症 ─────────────────────────────
  num('Cre_high', 'Cre', 'クレアチニン上昇','high','GFR低下＝腎機能低下。BUN/Cre比で腎前性か腎性かを読む。', 1),
  num('BUN_high', 'BUN', 'BUN上昇',   'high', '腎機能低下・脱水・消化管出血・高蛋白。', 1),
  num('CRP_high', 'CRP', 'CRP上昇',   'high', '急性炎症の存在。感染・組織傷害・自己免疫を非特異的に示す。', 1),

  // ── 鉄動態・溶血（数値検査。パネル iron_panel / hemolysis_panel の構成要素） ──
  num('fe_low',        'Fe',       '血清鉄低下',       'low',  '鉄の絶対的不足または慢性疾患による利用障害。単独では両者を分けられない。', 2),
  num('ferritin_low',  'Ferritin', 'フェリチン低下',   'low',  '貯蔵鉄の枯渇＝鉄欠乏性貧血に特異性が高い。ただし炎症で偽正常化する。', 2),
  num('ferritin_high', 'Ferritin', 'フェリチン高値',   'high', '貯蔵鉄は保たれるが利用障害＝慢性疾患性貧血/炎症。急性期蛋白でもある。', 2),
  num('tibc_high',     'TIBC',     'TIBC上昇',        'high', 'トランスフェリンが鉄を求めて増加＝鉄欠乏の裏づけ（ACDでは逆に低下）。', 2),
  num('haptoglobin_low','Hapto',   'ハプトグロビン低下','low', '遊離Hbと結合して消費される＝血管内溶血の裏づけ。', 2),
  num('indirect_bil_high','IBil',  '間接ビリルビン優位上昇','high','赤血球破壊で非抱合型が増加＝溶血・無効造血。', 2),
  obs('coombs_pos',    'coombs', '直接クームス陽性',   '赤血球に自己抗体/補体が結合＝自己免疫性溶血性貧血(AIHA)を確定。', 3),

  // ── 感染・肝炎ウイルス ─────────────────────────
  obs('hbsag_pos', 'hbv_serology', 'HBs抗原陽性', '現在のB型肝炎ウイルス感染。慢性肝炎/肝硬変/肝癌の背景。', 2),
  obs('hcvab_pos', 'hcv_serology', 'HCV抗体陽性', 'C型肝炎既往/現感染。RNA陽性で現感染を確定。', 2),

  // ── 身体所見 ───────────────────────────────────
  obs('jaundice_visible',   'inspection', '眼球黄染（黄疸）', 'ビリルビン2mg/dL以上で顕在化。肝胆道系の異常を示唆。', 1),
  obs('conjunctival_pallor','inspection', '眼瞼結膜蒼白',     '貧血の身体所見。Hb低下を臨床的に拾う。', 1),
  obs('spider_angioma',     'inspection', 'クモ状血管腫',     'エストロゲン代謝低下＝慢性肝障害/肝硬変の徴候。', 2),
  obs('palmar_erythema',    'inspection', '手掌紅斑',         '慢性肝障害の皮膚徴候。', 2),
  obs('murphy_sign',        'abdo_palpation', 'Murphy徴候陽性','右季肋部圧迫で吸気時に痛みで呼吸停止＝急性胆嚢炎。', 1),
  obs('rebound',            'abdo_palpation', '反跳痛（Blumberg）','腹膜刺激徴候＝腹膜炎・穿孔・虫垂炎の進行。', 1),
  obs('abdo_tenderness_ruq','abdo_palpation', '右季肋部圧痛',  '胆嚢・肝・胆管の病変を示唆。', 1),
  obs('abdo_tenderness_epigastric','abdo_palpation','心窩部圧痛','胃・十二指腸・膵の病変を示唆。', 1),
  obs('abdo_tenderness_rlq','abdo_palpation', '右下腹部圧痛（McBurney）','急性虫垂炎の典型的圧痛点。', 1),
  obs('hepatomegaly',       'abdo_palpation', '肝腫大',        'うっ血肝・脂肪肝・腫瘍・肝炎。', 2),
  obs('splenomegaly',       'abdo_palpation', '脾腫',          '門脈圧亢進(肝硬変)・血液疾患・溶血。', 2),
  obs('mass_palpable',      'abdo_palpation', '腹部腫瘤触知',  '腫瘍・膿瘍・臓器腫大の可能性。画像で精査。', 2),
  obs('bowel_sound_absent', 'abdo_auscultation','腸雑音消失',  '麻痺性イレウス・腹膜炎。', 1),
  obs('bowel_sound_metallic','abdo_auscultation','金属性腸雑音','機械的腸閉塞(腸管が拡張して振動)。', 1),
  obs('s3_gallop',          'auscultation_heart','III音（ギャロップ）','心室の容量負荷＝心不全を示唆。', 2),
  obs('diastolic_murmur',   'auscultation_heart','拡張期雑音',  '僧帽弁狭窄・大動脈弁閉鎖不全など。', 2),
  obs('systolic_murmur',    'auscultation_heart','収縮期雑音',  '大動脈弁狭窄・僧帽弁閉鎖不全・貧血性など。', 2),
  obs('melena_on_glove',    'rectal_exam', '黒色便（指血染）', '上部消化管出血を示唆。', 1),
  obs('tarry_stool',        'rectal_exam', 'タール便',         '上部消化管出血が腸内で酸化。', 1),
  obs('rectal_mass',        'rectal_exam', '直腸腫瘤触知',     '直腸癌の可能性。内視鏡＋生検へ。', 2),

  // ── 画像所見 ───────────────────────────────────
  obs('us_gallstone',       'abdo_us', 'US:胆嚢結石（音響陰影）','胆石症。胆嚢炎/胆管炎/膵炎の原因になりうる。', 1),
  obs('us_bile_duct_dilation','abdo_us','US:胆管拡張',         '閉塞性黄疸の存在＝下流の結石/腫瘍を示唆。', 1),
  obs('us_fatty_liver',     'abdo_us', 'US:脂肪肝（bright liver）','肝への脂肪沈着。NAFLD/NASH・アルコール性。', 1),
  obs('us_liver_mass',      'abdo_us', 'US:肝腫瘤',           '肝細胞癌・転移・血管腫。造影CT/MRIで精査。', 1),
  obs('us_ascites',         'abdo_us', 'US:腹水',             '肝硬変・癌性腹膜炎・心不全・低アルブミン。', 1),
  obs('us_hydronephrosis',  'abdo_us', 'US:水腎症',           '尿路閉塞(結石/腫瘍)による腎盂拡張。', 1),
  obs('niveau',             'abdo_xray','X線:鏡面像(niveau)', '腸管内の液面形成＝イレウス(腸閉塞)。', 1),
  obs('free_air',           'abdo_xray','X線:遊離ガス(free air)','横隔膜下の遊離ガス＝消化管穿孔。緊急。', 1),
  obs('ct_pancreas_swelling','abdo_ct','CT:膵腫大・脂肪織濃度上昇','急性膵炎の所見。重症度・合併症評価に有用。', 2),
  obs('ct_pancreas_mass',   'abdo_ct', 'CT:膵腫瘤（乏血性）', '膵癌を示唆。CA19-9・上流膵管拡張と合わせる。', 2),
  obs('ct_liver_mass_arterial','abdo_ct','CT:肝腫瘤の早期濃染＋washout','肝細胞癌に典型的な造影パターン。', 2),
  obs('ct_bile_duct_dilation','abdo_ct','CT:肝内外胆管拡張',  '閉塞部位の同定。閉塞性黄疸の原因検索。', 2),
  obs('ct_appendix_swelling','abdo_ct','CT:虫垂腫大・周囲脂肪織混濁','急性虫垂炎の確定的所見。', 2),
  obs('ct_bowel_wall_thick','abdo_ct','CT:腸管壁肥厚',        '炎症性腸疾患・虚血・腫瘍。', 2),
  obs('ct_free_air',        'abdo_ct', 'CT:遊離ガス',         '消化管穿孔。X線より高感度。', 2),
  obs('mrcp_stone',         'mrcp',    'MRCP:総胆管結石',     '閉塞性黄疸の原因＝総胆管結石を非侵襲に確認。', 2),
  obs('mrcp_stricture',     'mrcp',    'MRCP:胆管狭窄',       '胆管癌・膵頭部癌による狭窄を示唆。', 2),
  obs('egd_ulcer',          'egd',     'EGD:胃十二指腸潰瘍',  '消化性潰瘍。H. pylori/NSAIDsの検索へ。', 2),
  obs('egd_gastric_tumor',  'egd',     'EGD:胃腫瘍',          '胃癌を示唆。生検で組織確定。', 2),
  obs('egd_esophagitis',    'egd',     'EGD:逆流性食道炎',    'GERDの粘膜傷害(LA分類)。', 2),
  obs('egd_varices',        'egd',     'EGD:食道静脈瘤',      '門脈圧亢進(肝硬変)の合併。出血リスク。', 2),
  obs('cs_tumor',           'colonoscopy','CS:大腸腫瘍',      '大腸癌を示唆。生検で確定。', 2),
  obs('cs_ulcer_continuous','colonoscopy','CS:連続性びらん/潰瘍','潰瘍性大腸炎に典型(直腸から連続)。', 2),
  obs('cs_skip_lesion',     'colonoscopy','CS:非連続性病変(skip)','Crohn病に典型(全層性・区域性)。', 2),

  // ── 病理・機能 ─────────────────────────────────
  obs('path_hcc',        'biopsy_liver', '病理:肝細胞癌',   '肝細胞癌の組織確定。', 3),
  obs('path_cirrhosis',  'biopsy_liver', '病理:肝硬変(線維化)','偽小葉形成＝肝硬変の組織確定。', 3),
  obs('path_nash',       'biopsy_liver', '病理:NASH(脂肪+炎症+線維化)','NAFLDの中でNASHを組織学的に区別。', 3),
  obs('path_adenocarcinoma','biopsy_gi','病理:腺癌',        '消化管癌の組織確定。', 3),
  obs('path_ibd',        'biopsy_gi',    '病理:IBD所見',    '陰窩膿瘍(UC)/非乾酪性肉芽腫(Crohn)。', 3),
  obs('bm_hypoplasia',   'bone_marrow',  '骨髄:低形成',     '造血細胞の著減＝再生不良性貧血の確定。', 3),
  obs('bm_blasts',       'bone_marrow',  '骨髄:芽球増加',   '急性白血病の確定(芽球≥20%)。', 3),
  obs('bm_megaloblast',  'bone_marrow',  '骨髄:巨赤芽球',   '巨赤芽球性貧血の裏づけ。', 3),
  obs('hp_positive',     'ubt',          'H. pylori陽性',   '消化性潰瘍/胃MALTリンパ腫/胃癌の背景。除菌の適応。', 2),
  obs('fob_positive',    'fecal_occult', '便潜血陽性',      '消化管出血の存在。下部内視鏡の適応。', 1),
];

export const FINDING_BY_ID = Object.fromEntries(FINDINGS.map(f => [f.id, f]));
