// src/data/systems/gastro.js
// ═══════════════════════════════════════════════════════════════════════
//  消化器 ― 拡張分（コアの tests/findings/diseases.js に上乗せ）
// ═══════════════════════════════════════════════════════════════════════

import { S, D, C, numT, obsT, panelT, num, obs, kf, st, dz, br, pres } from './_kit.js';

export const TESTS = [
  // 自己抗体・特殊採血
  obsT('auto_ab_liver', '肝関連自己抗体（ANA/AMA-M2/IgG/IgM）', 'blood', '消化器', D,
    ['ana_pos','ama_m2_pos','igg_high','igm_high'],
    '肝内胆汁うっ滞や慢性肝炎の病因を分ける。AMA-M2陽性＝PBC、ANA＋IgG高値＝自己免疫性肝炎。'),
  obsT('calprotectin', '便中カルプロテクチン', 'urine', '消化器', D,
    ['calprotectin_high'],
    '腸管粘膜の好中球由来蛋白。器質的腸炎（IBD）と機能性（IBS）を非侵襲に切り分ける。'),

  // 画像・内視鏡（追加）
  obsT('eus', '超音波内視鏡(EUS)', 'imaging', '消化器', D,
    ['eus_pancreas_mass','eus_submucosal'],
    '胃・十二指腸から膵胆道を至近距離で描出。膵小腫瘤の検出に最も鋭敏で、EUS-FNAで組織も取れる。', { cost:'中' }),
  obsT('ercp', 'ERCP（内視鏡的逆行性胆管膵管造影）', 'imaging', '消化器', C,
    ['ercp_stricture','ercp_beaded_duct'],
    '胆管を直接造影し、狭窄部の擦過細胞診・ステント留置まで行える。侵襲的（膵炎のリスク）。', { cost:'高' }),
  obsT('ugi_series', '上部消化管造影', 'imaging', '消化器', D,
    ['ugi_niche','ugi_stenosis'],
    'バリウムによる二重造影。壁の伸展不良・ニッシェ（陥凹）で癌や潰瘍を捉える。', { cost:'低' }),
  obsT('ascites_tap', '腹水穿刺（腹水検査）', 'pathology', '消化器', D,
    ['saag_high','ascites_neutrophil_high','ascites_cytology_pos'],
    'SAAG（血清‑腹水アルブミン濃度差）1.1以上＝門脈圧亢進性。好中球250/μL以上＝特発性細菌性腹膜炎。'),
  obsT('stool_culture', '便培養・便中毒素', 'pathology', '消化器', D,
    ['stool_pathogen','cdiff_toxin_pos'],
    'カンピロバクター・サルモネラ・O157、CD毒素。血便＋発熱では必須。'),

  // 身体所見（追加）
  obsT('neuro_liver', '肝性脳症の身体所見', 'physical', '消化器', D,
    ['asterixis','flapping_consciousness'],
    '羽ばたき振戦（asterixis）と意識レベル低下。アンモニア上昇と合わせて肝性脳症を評価する。'),
  obsT('triad_check', '症候の組み合わせ（三徴の確認）', 'physical', '消化器', S,
    ['charcot_triad','reynolds_pentad'],
    'Charcot三徴（発熱・黄疸・右季肋部痛）＝急性胆管炎。＋ショック・意識障害＝Reynolds五徴（緊急ドレナージ）。'),
];

export const FINDINGS = [
  obs('calprotectin_high','calprotectin','便中カルプロテクチン高値','腸管に好中球が動員されている＝器質的な腸炎（IBD）。IBSでは上がらない。',1),
  obs('ana_pos','auto_ab_liver','抗核抗体(ANA)陽性','自己免疫性肝炎の補助所見。膠原病でも陽性になり特異度は低い。',2),
  obs('ama_m2_pos','auto_ab_liver','抗ミトコンドリア抗体(AMA-M2)陽性','原発性胆汁性胆管炎(PBC)に高い特異度。ALP/γGTP優位の胆汁うっ滞で確認する。',2),
  obs('igg_high','auto_ab_liver','IgG高値','自己免疫性肝炎で上昇。',2),
  obs('igm_high','auto_ab_liver','IgM高値','PBCで上昇しやすい。',2),
  obs('eus_pancreas_mass','eus','EUS:膵小腫瘤','CTで写らない小さな膵癌・膵内分泌腫瘍を検出。FNAで組織確定へ。',2),
  obs('eus_submucosal','eus','EUS:粘膜下腫瘍の層構造','GISTなど粘膜下腫瘍の由来層を判定する。',2),
  obs('ercp_stricture','ercp','ERCP:胆管狭窄＋擦過細胞診','胆管癌の確定に直結（細胞診で悪性を証明）。',3),
  obs('ercp_beaded_duct','ercp','ERCP:数珠状（beaded）胆管','狭窄と拡張が交互＝原発性硬化性胆管炎(PSC)に典型。',3),
  obs('ugi_niche','ugi_series','造影:ニッシェ（陥凹）','潰瘍の陥凹像。',2),
  obs('ugi_stenosis','ugi_series','造影:壁硬化・狭窄','スキルス胃癌などの壁全層浸潤を示唆。',2),
  obs('saag_high','ascites_tap','SAAG ≥1.1 g/dL','門脈圧亢進性腹水（肝硬変・心不全）。＜1.1なら癌性腹膜炎・結核性。',2),
  obs('ascites_neutrophil_high','ascites_tap','腹水中好中球 ≥250/μL','特発性細菌性腹膜炎(SBP)の診断基準。培養陰性でも診断してよい。',3),
  obs('ascites_cytology_pos','ascites_tap','腹水細胞診 陽性','癌性腹膜炎の確定。',3),
  obs('stool_pathogen','stool_culture','便培養で病原菌検出','細菌性腸炎の確定（カンピロバクター・サルモネラ・O157など）。',3),
  obs('cdiff_toxin_pos','stool_culture','CD毒素陽性','抗菌薬関連腸炎（偽膜性腸炎）。',3),
  obs('asterixis','neuro_liver','羽ばたき振戦(asterixis)','手関節背屈保持で不随意に落ちる。代謝性脳症（肝性・尿毒症・CO2ナルコーシス）。',2),
  obs('flapping_consciousness','neuro_liver','意識レベル低下（昏睡度分類）','肝性脳症の重症度。誘因（消化管出血・便秘・感染・脱水）を必ず探す。',2),
  obs('charcot_triad','triad_check','Charcot三徴（発熱・黄疸・右季肋部痛）','急性胆管炎。閉塞＋感染の組み合わせで、緊急胆道ドレナージの適応。',1),
  obs('reynolds_pentad','triad_check','Reynolds五徴（＋ショック・意識障害）','急性閉塞性化膿性胆管炎。致死的で、直ちにドレナージ。',1),

  // 既存検査に所見を追加
  obs('egd_esophageal_cancer','egd','EGD:食道腫瘍（ヨード不染帯）','扁平上皮癌はルゴール不染。生検で確定。',2),
  obs('egd_atrophic_gastritis','egd','EGD:萎縮性胃炎','H. pylori感染の結果。胃癌の高リスク背景。',2),
  obs('cs_longitudinal_ulcer','colonoscopy','CS:縦走潰瘍・敷石像','Crohn病に特徴的（全層性炎症・非連続性）。',2),
  obs('cs_pseudopolyp','colonoscopy','CS:偽ポリープ・血管透見消失','潰瘍性大腸炎の慢性期。直腸から連続する。',2),
  obs('cs_diverticula','colonoscopy','CS:大腸憩室','S状結腸に多い。憩室炎・憩室出血の背景。',2),
  obs('cs_segmental_ulcer','colonoscopy','CS:区域性の縦走潰瘍（左側結腸）','虚血性大腸炎。可逆性で保存的に改善することが多い。',2),
  obs('ct_pancreas_calcification','abdo_ct','CT:膵石・膵実質萎縮','慢性膵炎。外分泌・内分泌機能不全（脂肪便・膵性糖尿病）を伴う。',2),
  obs('ct_diverticulitis','abdo_ct','CT:憩室周囲の脂肪織濃度上昇','大腸憩室炎。膿瘍・穿孔の有無を評価する。',2),
  obs('ct_sma_occlusion','abdo_ct','CT:上腸間膜動脈の造影欠損','急性腸間膜動脈閉塞症。「症状の強さに比して腹部所見が乏しい」が典型。',2),
];

export const GROUPS = {
  grp_esophagus:    '食道疾患',
  grp_pancreas:     '膵疾患',
  grp_biliary:      '胆道疾患',
  grp_functional_gi:'機能性消化管疾患',
  grp_cholestasis:  '胆汁うっ滞（肝内）',
  grp_enteritis:    '感染性・虚血性腸炎',
};

export const DISEASES = [
  {
    id:'esophageal_cancer', name:'食道癌', system:'消化器', group:'grp_esophagus',
    oneLiner:'嚥下障害・つかえ感。扁平上皮癌が多く、飲酒・喫煙が危険因子。',
    keyFindings:[ kf('weight_loss',S), kf('egd_esophageal_cancer',D,'rule_in',true), kf('ugi_stenosis',D), kf('path_adenocarcinoma',C,'rule_in',true) ],
    confirm:'biopsy_gi', confirmNote:'EGD＋生検で組織確定。進展度はCT/EUS/PETで評価する。',
    mechanism:'アルコール代謝産物アセトアルデヒドと喫煙で食道扁平上皮が発癌。胸部中部食道に好発。',
  },
  {
    id:'gastric_cancer', name:'胃癌', system:'消化器', group:'grp_upper_gi',
    oneLiner:'H. pylori感染による萎縮性胃炎を背景に発生。',
    keyFindings:[ kf('Hb_low',S), kf('fob_positive',S), kf('egd_gastric_tumor',D,'rule_in',true), kf('egd_atrophic_gastritis',D), kf('hp_positive',D), kf('CEA_high',D), kf('path_adenocarcinoma',C,'rule_in',true) ],
    confirm:'biopsy_gi', confirmNote:'EGDで腫瘍を見つけ、生検で腺癌を証明する。CEA/CA19-9は診断より経過観察に使う。',
    mechanism:'H. pylori慢性感染 → 萎縮性胃炎 → 腸上皮化生 → 異型上皮 → 癌、という多段階発癌。',
    typical:{ Hb:9.5, CEA:12 },
  },
  {
    id:'chronic_hepatitis_b', name:'B型慢性肝炎', system:'消化器', group:'grp_hepatitis',
    oneLiner:'HBs抗原が6か月以上持続。肝硬変・肝癌の母地。',
    keyFindings:[ kf('ALT_high',S), kf('hbsag_pos',D,'rule_in',true), kf('PLT_low',D) ],
    confirm:'hbv_serology', confirmNote:'HBs抗原6か月以上持続＋ALT上昇。HBV-DNA量とHBe抗原で治療適応を決める。',
    mechanism:'HBVそのものではなく、感染肝細胞を攻撃する細胞傷害性T細胞が肝炎を起こす。',
  },
  {
    id:'chronic_hepatitis_c', name:'C型慢性肝炎', system:'消化器', group:'grp_hepatitis',
    oneLiner:'HCV持続感染。線維化が進行し肝癌リスクが高い。DAAで治癒可能。',
    keyFindings:[ kf('ALT_high',S), kf('hcvab_pos',D,'rule_in',true), kf('PLT_low',D) ],
    confirm:'hcv_serology', confirmNote:'HCV抗体陽性＋HCV-RNA陽性で現感染。PLT低下は線維化進行の代替指標。',
    mechanism:'慢性の壊死・再生が線維化を進め、20〜30年で肝硬変・肝細胞癌に至る。',
  },
  {
    id:'autoimmune_hepatitis', name:'自己免疫性肝炎(AIH)', system:'消化器', group:'grp_hepatitis',
    oneLiner:'中年女性。ANA陽性・IgG高値・ステロイド反応性。',
    keyFindings:[ kf('ALT_high',S), kf('ana_pos',D,'rule_in',true), kf('igg_high',D,'rule_in',true), kf('path_cirrhosis',C) ],
    confirm:'biopsy_liver', confirmNote:'ウイルス・薬剤・アルコールを除外し、ANA/抗平滑筋抗体・IgG高値・組織（interface hepatitis）で診断。',
    mechanism:'肝細胞に対する自己免疫的傷害。門脈域からのinterface hepatitisと形質細胞浸潤が組織学的特徴。',
  },
  {
    id:'pbc', name:'原発性胆汁性胆管炎(PBC)', system:'消化器', group:'grp_cholestasis',
    oneLiner:'中年女性の掻痒＋ALP/γGTP上昇＋AMA陽性。',
    keyFindings:[ kf('ALP_high',S,'rule_in',true), kf('GGT_high',S), kf('ama_m2_pos',D,'rule_in',true), kf('igm_high',D) ],
    confirm:'ama_m2_pos', confirmNote:'ALP優位の胆汁うっ滞＋AMA-M2陽性で診断（肝生検は必須でない）。胆管拡張がないのが閉塞性黄疸との差。',
    mechanism:'肝内小葉間胆管の慢性非化膿性破壊性胆管炎。胆汁うっ滞から線維化・肝硬変へ。',
    typical:{ ALP:520, GGT:210, TBil:1.1 },
  },
  {
    id:'psc', name:'原発性硬化性胆管炎(PSC)', system:'消化器', group:'grp_cholestasis',
    oneLiner:'若年男性。潰瘍性大腸炎の合併が多い。数珠状胆管。',
    keyFindings:[ kf('ALP_high',S,'rule_in',true), kf('GGT_high',S), kf('ercp_beaded_duct',C,'rule_in',true), kf('mrcp_stricture',D) ],
    confirm:'ercp_beaded_duct', confirmNote:'MRCP/ERCPで多発性の狭窄と拡張（数珠状）。胆管癌の合併に注意。',
    mechanism:'肝内外胆管のびまん性線維性狭窄。IBD（特にUC）と強く関連。',
  },
  {
    id:'alcoholic_liver', name:'アルコール性肝障害', system:'消化器', group:'grp_hepatitis',
    oneLiner:'AST>ALT かつ γGTP著明高値。禁酒で改善。',
    keyFindings:[ kf('AST_high',S,'rule_in',true), kf('GGT_high',S,'rule_in',true), kf('us_fatty_liver',S), kf('MCV_high',D) ],
    confirm:'GGT', confirmNote:'飲酒歴＋AST/ALT>2＋γGTP高値。MCV高値も慢性飲酒の傍証。禁酒で速やかに改善するかを見る。',
    mechanism:'アルコール代謝でNADH/NAD比が上昇し脂肪合成へ傾く。ミトコンドリア障害のためAST優位となる。',
    typical:{ AST:180, ALT:70, GGT:420, MCV:104 },
  },
  {
    id:'drug_induced_liver', name:'薬剤性肝障害(DILI)', system:'消化器', group:'grp_hepatitis',
    oneLiner:'被疑薬の開始から数週。中止で改善。除外診断。',
    keyFindings:[ kf('ALT_high',S), kf('ALP_high',D), kf('Eos_high',D) ],
    confirm:'ALT', confirmNote:'投与歴と時間経過、他病因の除外、中止後の改善で診断。R値（ALT/ALP比）で肝細胞型・胆汁うっ滞型・混合型を分ける。',
    mechanism:'中毒性（用量依存：アセトアミノフェン）とアレルギー性（特異体質性）に大別される。',
  },
  {
    id:'hepatic_encephalopathy', name:'肝性脳症', system:'消化器', group:'grp_chronic_liver',
    oneLiner:'肝硬変＋意識障害＋羽ばたき振戦＋NH3上昇。',
    keyFindings:[ kf('asterixis',S,'rule_in',true), kf('NH3_high',D,'rule_in',true), kf('flapping_consciousness',S), kf('Alb_low',D) ],
    confirm:'NH3', confirmNote:'肝硬変の存在＋意識障害＋NH3上昇。ただしNH3値と重症度は必ずしも相関しない。誘因の検索が本質。',
    mechanism:'門脈大循環短絡と肝の解毒能低下でアンモニア等が脳へ。アストロサイトの浮腫が意識障害を来す。',
  },
  {
    id:'cholangitis', name:'急性胆管炎', system:'消化器', group:'grp_biliary',
    oneLiner:'Charcot三徴。閉塞＋感染＝緊急ドレナージ。',
    keyFindings:[ kf('charcot_triad',S,'rule_in',true), kf('CRP_high',S), kf('WBC_high',S), kf('TBil_high',S), kf('ALP_high',S), kf('us_bile_duct_dilation',S,'rule_in',true), kf('reynolds_pentad',S) ],
    confirm:'abdo_us', confirmNote:'全身炎症＋胆汁うっ滞＋画像での胆管拡張/結石。抗菌薬だけでは治らず、ドレナージが治療の本体。',
    mechanism:'胆管閉塞で胆汁がうっ滞し、腸内細菌が逆行性に増殖。胆管内圧上昇で細菌が血中へ（胆道敗血症）。',
    typical:{ TBil:5.2, ALP:610, CRP:18, WBC:16.5 },
  },
  {
    id:'cholangiocarcinoma', name:'胆管癌', system:'消化器', group:'grp_obstructive_jaundice',
    oneLiner:'無痛性黄疸。CA19-9高値。胆管狭窄。',
    keyFindings:[ kf('TBil_high',S), kf('DBil_high',D), kf('ALP_high',S), kf('CA199_high',D), kf('mrcp_stricture',D,'rule_in',true), kf('ercp_stricture',C,'rule_in',true) ],
    confirm:'ercp_stricture', confirmNote:'胆管拡張の下流に狭窄。ERCPの擦過細胞診/生検で確定。結石との差は「無痛性・進行性」。',
    mechanism:'胆管上皮由来の腺癌。PSC・膵胆管合流異常が危険因子。',
  },
  {
    id:'chronic_pancreatitis', name:'慢性膵炎', system:'消化器', group:'grp_pancreas',
    oneLiner:'反復性腹痛→膵石・萎縮→脂肪便と膵性糖尿病。',
    keyFindings:[ kf('abdo_tenderness_epigastric',S), kf('ct_pancreas_calcification',D,'rule_in',true), kf('Glu_high',D), kf('AMY_high',S) ],
    confirm:'ct_pancreas_calcification', confirmNote:'画像での膵石・膵管不整拡張・実質萎縮。非代償期はむしろ膵酵素が上がらない点に注意。',
    mechanism:'慢性のアルコール等で膵実質が不可逆的に線維化。外分泌不全（脂肪便）→内分泌不全（糖尿病）の順に進む。',
  },
  {
    id:'ibs', name:'過敏性腸症候群(IBS)', system:'消化器', group:'grp_functional_gi',
    oneLiner:'腹痛＋排便で軽快。器質的異常なし（除外診断）。',
    keyFindings:[ kf('fob_positive',S,'rule_out'), kf('CRP_high',S,'rule_out'), kf('Hb_low',S,'rule_out') ],
    confirm:'colonoscopy', confirmNote:'Rome基準を満たし、警告徴候（体重減少・血便・貧血・発症年齢50歳以上・夜間症状）がないこと。器質疾患の除外が診断そのもの。',
    mechanism:'脳腸相関の異常による内臓知覚過敏と消化管運動異常。炎症も構造異常も伴わない。',
  },
  {
    id:'ischemic_colitis', name:'虚血性大腸炎', system:'消化器', group:'grp_enteritis',
    oneLiner:'突然の腹痛→血便。左側結腸の区域性病変。保存的に改善。',
    keyFindings:[ kf('abdo_tenderness_rlq',S,'support'), kf('cs_segmental_ulcer',D,'rule_in',true), kf('ct_bowel_wall_thick',D) ],
    confirm:'cs_segmental_ulcer', confirmNote:'左側結腸（下行〜S状）の区域性・縦走潰瘍。虚血が可逆的な点が、腸間膜動脈閉塞との決定的な差。',
    mechanism:'辺縁動脈の一過性血流低下（分水嶺領域=脾彎曲部が弱い）。便秘・脱水が誘因。',
  },
  {
    id:'mesenteric_ischemia', name:'急性腸間膜動脈閉塞症', system:'消化器', group:'grp_acute_abdomen',
    oneLiner:'激烈な腹痛に対し腹部所見が乏しい。Lac↑。心房細動が背景。',
    keyFindings:[ kf('Lac_high',S,'rule_in',true), kf('ct_sma_occlusion',D,'rule_in',true), kf('WBC_high',S), kf('rebound',D) ],
    confirm:'ct_sma_occlusion', confirmNote:'造影CTでSMAの造影欠損。腹部所見が乏しい時期に診断できるかが予後を決める（乳酸上昇は既に腸管壊死を示唆）。',
    mechanism:'心房細動由来の塞栓がSMAを閉塞。腸管全層壊死→穿孔・敗血症。',
    typical:{ Lac:45, WBC:18.0, CRP:2.0 },
  },
  {
    id:'diverticulitis', name:'大腸憩室炎', system:'消化器', group:'grp_acute_abdomen',
    oneLiner:'左下腹部痛＋発熱＋CRP上昇（日本では右側も多い）。',
    keyFindings:[ kf('CRP_high',S), kf('WBC_high',S), kf('ct_diverticulitis',D,'rule_in',true), kf('cs_diverticula',D) ],
    confirm:'ct_diverticulitis', confirmNote:'CTで憩室周囲の炎症。急性期の内視鏡は穿孔リスクのため避ける。',
    mechanism:'憩室内に糞石が詰まり、粘膜が炎症・微小穿孔を起こす。',
  },
  {
    id:'infectious_enteritis', name:'感染性腸炎', system:'消化器', group:'grp_enteritis',
    oneLiner:'発熱・下痢・血便。便培養で病原体を証明。',
    keyFindings:[ kf('CRP_high',S), kf('stool_pathogen',C,'rule_in',true), kf('cdiff_toxin_pos',C) ],
    confirm:'stool_culture', confirmNote:'便培養・CD毒素で病原体を特定。血便＋発熱では侵襲性菌（カンピロバクター・サルモネラ・O157）を考える。',
    mechanism:'毒素型（黄色ブドウ球菌）は数時間で嘔吐、侵襲型は1〜数日で発熱・血便と、潜伏期が機序を語る。',
  },
  {
    id:'gilbert', name:'Gilbert症候群', system:'消化器', group:'grp_hepatitis',
    oneLiner:'間接Bilのみ軽度上昇。肝機能・溶血所見は正常。無治療でよい。',
    keyFindings:[ kf('TBil_high',S,'rule_in',true), kf('indirect_bil_high',D,'rule_in',true), kf('ALT_high',S,'rule_out'), kf('haptoglobin_low',D,'rule_out') ],
    confirm:'IBil', confirmNote:'間接Bil優位の軽度高ビリルビン血症で、溶血（Hapto・LD・Ret正常）と肝障害（AST/ALT正常）がないこと。絶食・ストレスで増悪。',
    mechanism:'UGT1A1のプロモーター変異でグルクロン酸抱合能が約30%に低下。良性。',
    typical:{ TBil:2.4, IBil:2.1, ALT:22, Hapto:90 },
  },
  {
    id:'sbp', name:'特発性細菌性腹膜炎(SBP)', system:'消化器', group:'grp_chronic_liver',
    oneLiner:'肝硬変腹水＋発熱/腹痛。腹水好中球250以上で診断。',
    keyFindings:[ kf('us_ascites',S,'rule_in',true), kf('ascites_neutrophil_high',D,'rule_in',true), kf('CRP_high',S), kf('saag_high',D) ],
    confirm:'ascites_neutrophil_high', confirmNote:'腹水穿刺で好中球≥250/μL。培養陰性でも診断してよい（穿孔性腹膜炎との鑑別が要る）。',
    mechanism:'腸管からの細菌移行(bacterial translocation)と腹水のオプソニン活性低下。',
  },
];

export const PRESENTATIONS = [
  pres('pres_cholestasis','胆汁うっ滞（ALP・γGTP上昇）','abnormality','消化器',
    'ALP高値をγGTPで肝胆道由来か骨由来かに分け、次に画像で「胆管が拡張しているか」を見る。','pw_cholestasis'),
  pres('pres_bloody_stool','血便・下痢','complaint','消化器',
    '発熱・腹痛の有無、発症様式（突然か慢性か）、年齢と血管危険因子。CRPと便培養、内視鏡へ。','pw_bloody_stool'),
];

export const PATHWAYS = [
  {
    id:'pw_cholestasis', title:'胆汁うっ滞（ALP↑）の鑑別', system:'消化器', entryId:'pres_cholestasis',
    summary:'ALP単独では「肝胆道か骨か」すら決まらない。γGTPで由来を決め、次に画像で「胆管が拡張しているか」を問う。' +
            '拡張していれば肝外閉塞（機械的な詰まり）、していなければ肝内胆汁うっ滞（細胞・小胆管の問題）。この二分がこの鑑別の背骨。',
    root: st('ALP上昇', {
      layer:S, test:'GGT', ask:'γGTPも上がっているか？（ALPの由来はどこか）',
      note:'ALPは肝胆道にも骨にもある。γGTPは肝胆道にしかないので、両者が揃えば肝胆道由来と確定できる。',
      branches:[
        br('GGT_high','γGTP↑ → 肝胆道由来', st('肝胆道系の胆汁うっ滞', {
          layer:S, test:'abdo_us', ask:'胆管は拡張しているか？',
          note:'ここが最大の分岐点。「拡張あり＝下流で詰まっている（肝外閉塞）」「拡張なし＝肝内の問題」。',
          branches:[
            br('us_bile_duct_dilation','胆管拡張あり → 肝外閉塞', st('閉塞性黄疸', {
              layer:D, test:'mrcp', ask:'閉塞の原因は結石か腫瘍か？',
              note:'痛みを伴う間欠的黄疸なら結石、無痛性・進行性なら腫瘍。CA19-9も参考にする。',
              branches:[
                br('mrcp_stone','MRCP:結石 → 痛みを伴う', dz('choledocholithiasis','総胆管結石','発熱を伴えば急性胆管炎（Charcot三徴）としてドレナージ。')),
                br('mrcp_stricture','MRCP:狭窄 → 無痛性・進行性', st('腫瘍性閉塞', {
                  layer:D, test:'abdo_ct', ask:'腫瘤は膵頭部か胆管か？',
                  branches:[
                    br('ct_pancreas_mass','CT:膵頭部の乏血性腫瘤', dz('pancreatic_cancer','膵癌','EUS-FNAまたは切除標本で組織確定。')),
                    br('ercp_stricture','ERCP:胆管狭窄＋細胞診陽性', dz('cholangiocarcinoma','胆管癌','ERCP擦過細胞診で確定。')),
                  ],
                })),
              ],
            })),
            br('mrcp_stricture','胆管拡張なし → 肝内胆汁うっ滞', st('肝内胆汁うっ滞', {
              layer:D, test:'auto_ab_liver', ask:'自己抗体（AMA-M2）は？ 薬剤歴は？',
              note:'胆管が詰まっていないのに胆汁が流れない＝小胆管・肝細胞レベルの障害。自己免疫・薬剤・敗血症を考える。',
              branches:[
                br('ama_m2_pos','AMA-M2陽性・IgM↑', dz('pbc','原発性胆汁性胆管炎(PBC)','AMA-M2陽性＋ALP優位で確定。生検は必須でない。')),
                br('ercp_beaded_duct','数珠状胆管（MRCP/ERCP）・UC合併', dz('psc','原発性硬化性胆管炎(PSC)','画像所見が診断。胆管癌の合併を追う。')),
                br('Eos_high','被疑薬あり・好酸球増多', dz('drug_induced_liver','薬剤性肝障害（胆汁うっ滞型）','中止で改善するかを見る。')),
              ],
            })),
          ],
        })),
        br('GGT_normal','γGTP正常 → 骨由来', st('骨由来のALP上昇', {
          layer:D, test:'Ca', ask:'Ca・P・PTHは？ 骨転移は？',
          note:'肝胆道は否定的。骨形成が亢進している状態（成長期・骨転移・骨軟化症・副甲状腺機能亢進症）。',
          branches:[
            br('Ca_high','Ca↑ → 高Ca血症の鑑別へ', st('高Ca血症を伴う骨病変', { layer:D, test:'PTH', note:'PTH依存か非依存かで分ける（→「高Ca血症」のマップへ）。' })),
          ],
        })),
      ],
    }),
  },
  {
    id:'pw_bloody_stool', title:'血便・下痢の鑑別', system:'消化器', entryId:'pres_bloody_stool',
    summary:'まず「急性か慢性か」を分ける。急性なら感染性・虚血性、慢性なら炎症性腸疾患・腫瘍。' +
            '年齢と血管危険因子、発症の突然さが、内視鏡の前にすでに鑑別を大きく絞る。',
    root: st('血便', {
      layer:S, test:'CRP', ask:'発熱・炎症反応はあるか？ 発症は突然か？',
      note:'血便は「どこから」「なぜ」の2つを分けて考える。まず全身の炎症の有無で感染/虚血/慢性炎症に振り分ける。',
      branches:[
        br('CRP_high','発熱＋CRP↑（急性）', st('急性の血便', {
          layer:D, test:'stool_culture', ask:'便培養は？ 発症様式は？',
          note:'数日の経過で発熱を伴うなら侵襲性細菌。突然の腹痛→血便で高齢・便秘なら虚血性大腸炎。',
          branches:[
            br('stool_pathogen','便培養陽性', dz('infectious_enteritis','感染性腸炎','病原体の同定で確定。O157では溶血性尿毒症症候群に注意。')),
            br('cs_segmental_ulcer','左側結腸の区域性縦走潰瘍', dz('ischemic_colitis','虚血性大腸炎','内視鏡所見が診断的。保存的に改善する。')),
            br('ct_diverticulitis','CT:憩室周囲の炎症', dz('diverticulitis','大腸憩室炎','急性期の内視鏡は避ける。')),
          ],
        })),
        br('CRP_normal','慢性の経過（数週〜）', st('慢性の血便・下痢', {
          layer:D, test:'colonoscopy', ask:'内視鏡で病変の分布は？（連続性か、非連続性か、腫瘤か）',
          note:'ここでの分岐は「分布」。直腸から連続＝UC、口〜肛門の非連続＝Crohn、限局した腫瘤＝癌。',
          branches:[
            br('cs_ulcer_continuous','直腸から連続するびらん・偽ポリープ', dz('ulcerative_colitis','潰瘍性大腸炎','生検で陰窩膿瘍。粘膜層に限局。')),
            br('cs_longitudinal_ulcer','縦走潰瘍・敷石像・非連続性', dz('crohn','Crohn病','生検で非乾酪性肉芽腫。全層性。')),
            br('cs_tumor','限局した腫瘤', dz('colorectal_cancer','大腸癌','生検で腺癌を証明。CEAは経過観察用。')),
            br('fob_positive','器質的異常なし・排便で軽快', dz('ibs','過敏性腸症候群(IBS)','警告徴候がないことを確認した上での除外診断。')),
          ],
        })),
      ],
    }),
  },
];
