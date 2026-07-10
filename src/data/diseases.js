// src/data/diseases.js
// ═══════════════════════════════════════════════════════════════════════
//  疾患定義 ― 所見にレイヤー(1最初/2鑑別/3確定)を付与するのが要点
// ═══════════════════════════════════════════════════════════════════════
//  keyFindings[].layer が「この疾患の鑑別過程でその所見をどの段階で使うか」。
//  role: 'rule_in'(陽性所見) | 'rule_out'(否定所見) | 'support'
//  confirm: 確定に必要な Finding.id または Test.id。
//
//  ★ Sonnetへ: 優先順位 消化器→血液→内分泌→泌尿器→小児→他科。
//    新疾患は system と group を必ず付け、group は鑑別で絞り込む単位に揃える
//    （例: 小球性貧血, 閉塞性黄疸, 肝炎…）。typical は入力デモ用の代表値(任意)。
// ═══════════════════════════════════════════════════════════════════════

import { LAYER } from '../model/schema.js';
const S = LAYER.SCREEN, D = LAYER.DIFF, C = LAYER.CONFIRM;
// keyFinding ヘルパー: kf(findingId, layer, role, required?)
const kf = (finding, layer, role = 'rule_in', required = false) => ({ finding, layer, role, required });

export const DISEASES = [
  // ═══════════════ 消化器：肝胆膵 ═══════════════
  {
    id: 'acute_hepatitis', name: '急性肝炎', system: '消化器', group: 'grp_hepatitis',
    oneLiner: 'トランスアミナーゼ著明上昇。肝細胞傷害型。',
    keyFindings: [ kf('ALT_high',S,'rule_in',true), kf('AST_high',S), kf('TBil_high',D), kf('hbsag_pos',D), kf('hcvab_pos',D) ],
    confirm: 'hbv_serology',
    confirmNote: 'ウイルスマーカー(HBs抗原/HCV抗体・RNA)・薬剤歴・自己抗体で病因を確定。ALT優位(AST/ALT<1)が典型。',
    mechanism: 'ウイルス/薬剤/自己免疫による肝細胞の急性壊死。細胞内酵素ALT・ASTが逸脱して上昇する。',
    typical: { ALT: 850, AST: 620, TBil: 3.5, ALP: 300 },
  },
  {
    id: 'liver_cirrhosis', name: '肝硬変', system: '消化器', group: 'grp_chronic_liver',
    oneLiner: '肝の線維化。合成能低下＋門脈圧亢進の徴候。',
    keyFindings: [ kf('Alb_low',D), kf('ChE_low',D), kf('PLT_low',S), kf('PT_prolong',D), kf('spider_angioma',S), kf('splenomegaly',D), kf('us_ascites',D), kf('egd_varices',D) ],
    confirm: 'path_cirrhosis',
    confirmNote: '合成能低下(Alb↓/ChE↓/PT延長)＋門脈圧亢進(脾腫/静脈瘤/腹水)。画像＋必要時肝生検で確定。',
    mechanism: '慢性肝障害→線維化・偽小葉形成。蛋白合成能が落ち、門脈圧が上がって側副血行・脾腫・腹水を来す。',
    typical: { Alb: 2.8, PLT: 80, PT: 18, TBil: 2.4 },
  },
  {
    id: 'hcc', name: '肝細胞癌(HCC)', system: '消化器', group: 'grp_chronic_liver',
    oneLiner: '慢性肝疾患を背景に発生。特異的腫瘍マーカー＋造影パターン。',
    keyFindings: [ kf('us_liver_mass',S), kf('AFP_high',D), kf('PIVKA2_high',D,'rule_in',true), kf('ct_liver_mass_arterial',D,'rule_in',true) ],
    confirm: 'path_hcc',
    confirmNote: '背景肝(肝硬変/慢性肝炎)＋AFP・PIVKA-II上昇＋造影CTの早期濃染/washoutで診断。非典型例は生検。',
    mechanism: '慢性炎症・肝硬変を母地に肝細胞が腫瘍化。動脈血流優位となり造影で特徴的パターンを示す。',
  },
  {
    id: 'nafld_nash', name: 'NAFLD / NASH', system: '消化器', group: 'grp_hepatitis',
    oneLiner: '非アルコール性の脂肪肝。NASHは炎症＋線維化を伴う。',
    keyFindings: [ kf('us_fatty_liver',S), kf('ALT_high',S), kf('AST_high',D) ],
    confirm: 'path_nash',
    confirmNote: '飲酒歴が乏しい脂肪肝。NASHの確定は肝生検(脂肪+炎症+線維化)。ALT優位が多い。',
    mechanism: 'インスリン抵抗性→肝への脂肪蓄積。酸化ストレスで炎症・線維化が進むとNASH。',
  },
  {
    id: 'obstructive_jaundice', name: '閉塞性黄疸', system: '消化器', group: 'grp_obstructive_jaundice',
    oneLiner: '直接Bil優位＋胆道系酵素上昇＋胆管拡張。',
    keyFindings: [ kf('TBil_high',S,'rule_in',true), kf('DBil_high',D,'rule_in',true), kf('ALP_high',S), kf('GGT_high',S), kf('us_bile_duct_dilation',S,'rule_in',true), kf('jaundice_visible',S) ],
    confirm: 'ct_bile_duct_dilation',
    confirmNote: '直接Bil優位＋ALP/γGTP↑＋US/CTで胆管拡張。次に閉塞の原因(結石か腫瘍か)を鑑別する。',
    mechanism: '胆汁の流出路が閉塞→抱合型ビリルビンが逆流。ALP・γGTPが胆管上皮から誘導されて上昇。',
    typical: { TBil: 8.5, DBil: 6.2, ALP: 620, GGT: 380 },
  },
  {
    id: 'choledocholithiasis', name: '総胆管結石', system: '消化器', group: 'grp_obstructive_jaundice',
    oneLiner: '閉塞性黄疸の良性原因。MRCPで結石を確認。',
    keyFindings: [ kf('us_bile_duct_dilation',S), kf('us_gallstone',S), kf('mrcp_stone',D,'rule_in',true), kf('abdo_tenderness_ruq',S) ],
    confirm: 'mrcp',
    confirmNote: 'MRCP/EUSで総胆管結石を証明。胆管炎を合併するとCharcot三徴(発熱・黄疸・右上腹部痛)。',
    mechanism: '胆嚢/胆管の結石が総胆管を閉塞。感染を伴うと急性胆管炎に進展。',
  },
  {
    id: 'pancreatic_cancer', name: '膵癌', system: '消化器', group: 'grp_obstructive_jaundice',
    oneLiner: '閉塞性黄疸の悪性原因。乏血性膵腫瘤＋CA19-9。',
    keyFindings: [ kf('ct_pancreas_mass',D,'rule_in',true), kf('CA199_high',D), kf('us_bile_duct_dilation',S), kf('mrcp_stricture',D) ],
    confirm: 'biopsy_gi',
    confirmNote: '膵頭部癌は総胆管を圧排し閉塞性黄疸で発見されることが多い。CT乏血性腫瘤＋CA19-9↑＋EUS-FNAで確定。',
    mechanism: '膵管上皮由来の腺癌。膵頭部発生では胆管を巻き込み黄疸を来す。',
  },
  {
    id: 'acute_cholecystitis', name: '急性胆嚢炎', system: '消化器', group: 'grp_acute_abdomen',
    oneLiner: 'Murphy徴候＋胆石＋炎症反応。',
    keyFindings: [ kf('murphy_sign',S,'rule_in',true), kf('abdo_tenderness_ruq',S), kf('us_gallstone',S,'rule_in',true), kf('CRP_high',S), kf('WBC_high',S) ],
    confirm: 'abdo_us',
    confirmNote: '胆石＋胆嚢壁肥厚＋Murphy徴候(超音波下でも)。閉塞性黄疸がなければ肝機能は軽度異常にとどまる。',
    mechanism: '胆石が胆嚢管を閉塞→胆嚢内圧上昇・虚血・細菌感染で急性炎症。',
    typical: { CRP: 12, WBC: 14.5 },
  },
  {
    id: 'acute_pancreatitis', name: '急性膵炎', system: '消化器', group: 'grp_acute_abdomen',
    oneLiner: 'アミラーゼ上昇＋心窩部痛＋膵腫大。',
    keyFindings: [ kf('AMY_high',S,'rule_in',true), kf('abdo_tenderness_epigastric',S), kf('CRP_high',S), kf('ct_pancreas_swelling',D,'rule_in',true) ],
    confirm: 'abdo_ct',
    confirmNote: '①上腹部痛②膵酵素≧基準上限3倍③CT/US所見 の2つ以上で診断。原因はアルコール・胆石が二大。',
    mechanism: '膵酵素が膵内で活性化し自己消化。血中へ逸脱してアミラーゼ・リパーゼが上昇。',
    typical: { AMY: 620, CRP: 18, ALT: 40 },
  },

  // ═══════════════ 消化器：消化管 ═══════════════
  {
    id: 'peptic_ulcer', name: '消化性潰瘍', system: '消化器', group: 'grp_gi_bleeding',
    oneLiner: '心窩部痛＋タール便。EGDで潰瘍、H. pylori検索。',
    keyFindings: [ kf('abdo_tenderness_epigastric',S), kf('melena_on_glove',S), kf('egd_ulcer',D,'rule_in',true), kf('hp_positive',D) ],
    confirm: 'egd',
    confirmNote: 'EGDで潰瘍を直視＋出血の有無を評価。背景にH. pylori/NSAIDs。貧血合併ならHb低下。',
    mechanism: '攻撃因子(酸・ペプシン・Hp・NSAIDs)と防御因子の破綻で粘膜が欠損。露出血管から出血。',
  },
  {
    id: 'gerd', name: '胃食道逆流症(GERD)', system: '消化器', group: 'grp_upper_gi',
    oneLiner: '胸やけ・呑酸。EGDで逆流性食道炎。',
    keyFindings: [ kf('egd_esophagitis',D,'rule_in',true) ],
    confirm: 'egd',
    confirmNote: '典型症状＋PPI反応で臨床診断。びらん性はEGD(LA分類)で確認。',
    mechanism: '下部食道括約筋の弛緩で胃酸が逆流し食道粘膜を傷害。',
  },
  {
    id: 'colorectal_cancer', name: '大腸癌', system: '消化器', group: 'grp_lower_gi',
    oneLiner: '便潜血陽性→下部内視鏡→生検で確定。',
    keyFindings: [ kf('fob_positive',S,'rule_in',true), kf('cs_tumor',D,'rule_in',true), kf('CEA_high',D), kf('rectal_mass',S) ],
    confirm: 'path_adenocarcinoma',
    confirmNote: '便潜血→大腸内視鏡＋生検で腺癌を確定。CEAは経過観察に。鉄欠乏性貧血が初発のこともある。',
    mechanism: '腺腫-癌シークエンス。腫瘍から慢性出血し便潜血陽性・鉄欠乏性貧血を来す。',
  },
  {
    id: 'ulcerative_colitis', name: '潰瘍性大腸炎(UC)', system: '消化器', group: 'grp_ibd',
    oneLiner: '直腸から連続性のびらん。血便・粘血便。',
    keyFindings: [ kf('cs_ulcer_continuous',D,'rule_in',true), kf('CRP_high',S), kf('path_ibd',C) ],
    confirm: 'biopsy_gi',
    confirmNote: '直腸から連続する炎症＋病理で陰窩膿瘍。Crohnとの鑑別が要。',
    mechanism: '大腸粘膜〜粘膜下層の慢性炎症。連続性・表在性が特徴。',
  },
  {
    id: 'crohn', name: 'Crohn病', system: '消化器', group: 'grp_ibd',
    oneLiner: '全消化管に非連続性(skip)・全層性の炎症。',
    keyFindings: [ kf('cs_skip_lesion',D,'rule_in',true), kf('ct_bowel_wall_thick',D), kf('CRP_high',S), kf('path_ibd',C) ],
    confirm: 'biopsy_gi',
    confirmNote: '非連続性・全層性・非乾酪性肉芽腫。瘻孔・狭窄を来しやすい。',
    mechanism: '全層性の肉芽腫性炎症。口〜肛門のどこにでも非連続に生じる。',
  },
  {
    id: 'appendicitis', name: '急性虫垂炎', system: '消化器', group: 'grp_acute_abdomen',
    oneLiner: '心窩部→右下腹部への痛みの移動＋McBurney圧痛。',
    keyFindings: [ kf('abdo_tenderness_rlq',S,'rule_in',true), kf('rebound',S), kf('WBC_high',S), kf('CRP_high',S), kf('ct_appendix_swelling',D,'rule_in',true) ],
    confirm: 'abdo_ct',
    confirmNote: '臨床＋炎症反応で疑い、CT/USで虫垂腫大を確認。穿孔前の診断が重要。',
    mechanism: '糞石等で虫垂内腔が閉塞→内圧上昇・虚血・細菌増殖で炎症、進行すると穿孔・腹膜炎。',
    typical: { WBC: 15, CRP: 8 },
  },
  {
    id: 'ileus', name: 'イレウス(腸閉塞)', system: '消化器', group: 'grp_acute_abdomen',
    oneLiner: '腹部膨満・嘔吐。鏡面像＋腸雑音の異常。',
    keyFindings: [ kf('niveau',S,'rule_in',true), kf('bowel_sound_metallic',S), kf('bowel_sound_absent',S) ],
    confirm: 'abdo_xray',
    confirmNote: '機械的(金属音)か麻痺性(腸雑音消失)かを聴診＋画像で区別。絞扼の有無が緊急度を決める。',
    mechanism: '腸管内容の通過障害。機械的閉塞では拡張腸管が金属音、麻痺性では蠕動消失。',
  },
  {
    id: 'gi_perforation', name: '消化管穿孔', system: '消化器', group: 'grp_acute_abdomen',
    oneLiner: '遊離ガス＋腹膜刺激徴候＝緊急手術適応。',
    keyFindings: [ kf('free_air',S,'rule_in',true), kf('rebound',S), kf('ct_free_air',D) ],
    confirm: 'abdo_ct',
    confirmNote: '立位X線/CTで横隔膜下遊離ガス。板状硬・反跳痛など汎発性腹膜炎の徴候。',
    mechanism: '潰瘍・憩室・腫瘍などで消化管壁が全層破綻→腸内容が腹腔に漏れ腹膜炎。',
  },

  // ═══════════════ 血液：貧血 ═══════════════
  {
    id: 'iron_deficiency', name: '鉄欠乏性貧血', system: '血液', group: 'grp_microcytic',
    oneLiner: '小球性低色素性＋フェリチン低下。',
    keyFindings: [ kf('Hb_low',S,'rule_in',true), kf('MCV_low',D,'rule_in',true), kf('MCH_low',D), kf('ferritin_low',D,'rule_in',true), kf('tibc_high',D), kf('fe_low',D) ],
    confirm: 'iron_panel',
    confirmNote: '小球性(MCV↓)＋貯蔵鉄枯渇(フェリチン↓・TIBC↑)。原因(月経・消化管出血)の検索が必須。',
    mechanism: '鉄不足→ヘム合成障害→小型・低色素の赤血球。慢性出血が背景に多い。',
    typical: { Hb: 8.5, MCV: 68, MCH: 22 },
  },
  {
    id: 'chronic_disease_anemia', name: '慢性疾患性貧血(ACD)', system: '血液', group: 'grp_microcytic',
    oneLiner: '炎症でヘプシジン↑→鉄利用障害。フェリチンは保たれる。',
    keyFindings: [ kf('Hb_low',S), kf('MCV_normal',D), kf('ferritin_high',D,'rule_in',true), kf('CRP_high',S) ],
    confirm: 'iron_panel',
    confirmNote: '鉄欠乏と異なりフェリチンは正常〜高値(貯蔵鉄はあるが使えない)。基礎疾患(感染/膠原病/悪性腫瘍)を探す。',
    mechanism: '炎症性サイトカイン→ヘプシジン増加→腸管鉄吸収抑制・マクロファージ内鉄の囲い込み＝機能的鉄欠乏。',
  },
  {
    id: 'megaloblastic', name: '巨赤芽球性貧血', system: '血液', group: 'grp_macrocytic',
    oneLiner: '大球性＋B12/葉酸欠乏。骨髄で巨赤芽球。',
    keyFindings: [ kf('Hb_low',S,'rule_in',true), kf('MCV_high',D,'rule_in',true), kf('Ret_low',D), kf('bm_megaloblast',C) ],
    confirm: 'bone_marrow',
    confirmNote: '大球性(MCV↑)＋血清B12/葉酸低下。神経症状があれば亜急性連合性脊髄変性症を疑う。',
    mechanism: 'B12/葉酸欠乏でDNA合成が障害され核成熟が遅延→大型赤血球。無効造血でLD↑・間接Bil↑も。',
    typical: { Hb: 8.0, MCV: 118 },
  },
  {
    id: 'hemolytic', name: '溶血性貧血', system: '血液', group: 'grp_hemolytic',
    oneLiner: '網赤血球↑＋間接Bil↑＋ハプトグロビン↓＝溶血三徴。',
    keyFindings: [ kf('Hb_low',S,'rule_in',true), kf('Ret_high',D,'rule_in',true), kf('indirect_bil_high',D), kf('haptoglobin_low',D), kf('coombs_pos',C) ],
    confirm: 'coombs',
    confirmNote: '溶血の裏づけ(Ret↑/間接Bil↑/ハプトグロビン↓/LD↑)後、直接クームスで自己免疫性(AIHA)を確定。',
    mechanism: '末梢での赤血球破壊亢進。骨髄は代償で網赤血球を増やす。破壊産物で間接Bil・LDが上昇。',
    typical: { Hb: 8.5, Ret: 45 },
  },
  {
    id: 'aplastic', name: '再生不良性貧血', system: '血液', group: 'grp_pancytopenia',
    oneLiner: '汎血球減少＋網赤血球低下＝骨髄不全。',
    keyFindings: [ kf('Hb_low',S,'rule_in',true), kf('WBC_low',S,'rule_in',true), kf('PLT_low',S,'rule_in',true), kf('Ret_low',D,'rule_in',true), kf('bm_hypoplasia',C,'rule_in',true) ],
    confirm: 'bone_marrow',
    confirmNote: '汎血球減少＋Ret低値＋骨髄低形成で確定。白血病(芽球)との鑑別に骨髄検査が必須。',
    mechanism: '造血幹細胞の障害で全血球系の産生が低下。代償できず網赤血球も低い。',
    typical: { Hb: 7.5, WBC: 2.1, PLT: 30, Ret: 3 },
  },
  {
    id: 'renal_anemia', name: '腎性貧血', system: '血液', group: 'grp_normocytic',
    oneLiner: '正球性＋腎機能低下＝EPO産生低下。',
    keyFindings: [ kf('Hb_low',S,'rule_in',true), kf('MCV_normal',D), kf('Cre_high',S,'rule_in',true), kf('Ret_low',D) ],
    confirm: 'Cre',
    confirmNote: 'CKD＋正球性正色素性貧血＋Ret低値。EPO低値で確認。鉄欠乏の合併も評価する。',
    mechanism: '腎のEPO産生低下で赤血球産生が減少。CKDの進行に伴い貧血が進む。',
  },

  // ═══════════════ 血液：出血・凝固 ═══════════════
  {
    id: 'ITP', name: '特発性血小板減少性紫斑病(ITP)', system: '血液', group: 'grp_thrombocytopenia',
    oneLiner: '血小板のみ減少、PT/APTT正常。除外診断。',
    keyFindings: [ kf('PLT_low',S,'rule_in',true) ],
    confirm: 'PLT',
    confirmNote: '血小板単独減少で凝固(PT/APTT)正常。他の原因(薬剤/DIC/白血病/脾機能亢進)を除外して診断。',
    mechanism: '抗血小板抗体による脾での破壊亢進。産生は保たれるが末梢で消費される。',
    typical: { PLT: 25, PT: 12, APTT: 32 },
  },
  {
    id: 'disseminated_ic', name: '播種性血管内凝固(DIC)', system: '血液', group: 'grp_thrombocytopenia',
    oneLiner: '血小板↓＋Fib↓＋FDP/D-ダイマー↑＋PT延長。基礎疾患必発。',
    keyFindings: [ kf('PLT_low',S,'rule_in',true), kf('Fib_low',D), kf('FDP_high',D,'rule_in',true), kf('DD_high',D), kf('PT_prolong',D) ],
    confirm: 'FDP',
    confirmNote: '消費性凝固障害。基礎疾患(敗血症/悪性腫瘍/産科疾患)を必ず伴う。スコアリングで診断。',
    mechanism: '全身で凝固が活性化→微小血栓で凝固因子・血小板を消費→出血。二次線溶でFDP/D-ダイマー上昇。',
    typical: { PLT: 60, Fib: 110, FDP: 40, DD: 25, PT: 17 },
  },
];

export const DISEASE_BY_ID = Object.fromEntries(DISEASES.map(d => [d.id, d]));

// 疾患群(group)の表示名。パスウェイやパターンが参照する。
export const GROUPS = {
  grp_hepatitis:          '肝細胞傷害型（肝炎）',
  grp_chronic_liver:      '慢性肝疾患（肝硬変・肝癌）',
  grp_obstructive_jaundice:'閉塞性黄疸',
  grp_acute_abdomen:      '急性腹症',
  grp_gi_bleeding:        '消化管出血',
  grp_upper_gi:           '上部消化管疾患',
  grp_lower_gi:           '下部消化管疾患',
  grp_ibd:                '炎症性腸疾患',
  grp_microcytic:         '小球性貧血',
  grp_macrocytic:         '大球性貧血',
  grp_normocytic:         '正球性貧血',
  grp_hemolytic:          '溶血性貧血',
  grp_pancytopenia:       '汎血球減少',
  grp_thrombocytopenia:   '血小板減少',
};
