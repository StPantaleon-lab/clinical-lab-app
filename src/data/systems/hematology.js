// src/data/systems/hematology.js
// ═══════════════════════════════════════════════════════════════════════
//  血液 ― 拡張分（貧血の各論・白血病/リンパ腫/骨髄腫・出血凝固）
// ═══════════════════════════════════════════════════════════════════════

import { S, D, C, numT, obsT, panelT, num, obs, kf, st, dz, br, pres } from './_kit.js';

export const TESTS = [
  numT('sIL2R','可溶性IL-2受容体','血液', D, { abbr:'sIL-2R' }),
  obsT('blood_smear','末梢血塗抹標本', 'pathology', '血液', S,
    ['smear_blasts','smear_spherocyte','smear_schistocyte','smear_atypical_lymph','smear_auer_rod','smear_target_cell','smear_rouleaux','smear_left_shift'],
    '「安価で最も情報量が多い検査」。数値では見えない赤血球の形・芽球・破砕赤血球を直接見る。'),
  obsT('vitb12_folate','ビタミンB12・葉酸', 'blood', '血液', D,
    ['b12_low','folate_low'],
    '大球性貧血でDNA合成障害の原因を分ける。B12欠乏では神経症状（後索・側索障害）を伴う。'),
  obsT('hb_electrophoresis','ヘモグロビン分画', 'blood', '血液', C,
    ['hba2_high'],
    'HbA2・HbFの増加でβサラセミアを確定する。'),
  obsT('flow_cytometry','フローサイトメトリー（表面抗原）', 'pathology', '血液', C,
    ['fcm_myeloid','fcm_bcell','fcm_tcell','fcm_cd55_59_loss'],
    '芽球やリンパ球の系統（骨髄系/B/T）を決める。PNHではCD55/CD59欠損を検出。'),
  obsT('cytogenetics','染色体・遺伝子検査', 'genetic', '血液', C,
    ['ph_chromosome','bcr_abl','pml_rara','jak2_mutation'],
    'Ph染色体t(9;22)/BCR-ABL＝CML、t(15;17)/PML-RARA＝APL、JAK2 V617F＝真性多血症。'),
  obsT('lymph_node_biopsy','リンパ節生検', 'pathology', '血液', C,
    ['path_reed_sternberg','path_lymphoma'],
    'リンパ腫の確定。Reed-Sternberg細胞＝Hodgkinリンパ腫。'),
  obsT('serum_ep','血清・尿蛋白電気泳動（M蛋白）', 'blood', '血液', C,
    ['m_protein','bence_jones'],
    '単クローン性の異常蛋白（M蛋白）を検出。多発性骨髄腫の柱。'),
  obsT('coag_factor','凝固因子活性・インヒビター', 'blood', '血液', C,
    ['factor8_low','factor9_low','vwf_low','adamts13_low'],
    'APTT単独延長の内訳を決める。ADAMTS13著減＝TTP。'),
  obsT('skeletal_survey','全身骨X線・PET/CT', 'imaging', '血液', D,
    ['punched_out_lesion','pet_uptake'],
    '打ち抜き像（punched-out lesion）＝多発性骨髄腫。PET集積でリンパ腫の病期を決める。'),
];

export const FINDINGS = [
  num('sIL2R_high','sIL2R','可溶性IL-2受容体高値','high','活性化リンパ球から遊離。悪性リンパ腫の腫瘍量・活動性の指標。',2),
  obs('smear_blasts','blood_smear','塗抹:芽球出現','末梢に芽球＝急性白血病。骨髄検査へ直行する。',1),
  obs('smear_auer_rod','blood_smear','塗抹:Auer小体','骨髄系の芽球に特異的。急性骨髄性白血病(AML)を示す。',2),
  obs('smear_spherocyte','blood_smear','塗抹:球状赤血球','膜の表面積が減り球状に。遺伝性球状赤血球症・AIHA。',2),
  obs('smear_schistocyte','blood_smear','塗抹:破砕赤血球(schistocyte)','細血管内でフィブリン網に赤血球が裂かれた＝TTP/HUS/DIC（微小血管障害性溶血）。',2),
  obs('smear_atypical_lymph','blood_smear','塗抹:異型リンパ球','EBV等のウイルス感染に反応したT細胞。伝染性単核球症。',1),
  obs('smear_target_cell','blood_smear','塗抹:標的赤血球','サラセミア・肝疾患。膜/Hb比の異常。',2),
  obs('smear_rouleaux','blood_smear','塗抹:連銭形成','M蛋白による赤血球の重なり。多発性骨髄腫で赤沈が著明に亢進する理由。',2),
  obs('smear_left_shift','blood_smear','塗抹:核左方移動','桿状核球の増加＝細菌感染への骨髄の反応。',1),
  obs('b12_low','vitb12_folate','ビタミンB12低値','胃全摘・悪性貧血（内因子欠乏）・回腸病変。神経症状を伴う。',2),
  obs('folate_low','vitb12_folate','葉酸低値','摂取不足・アルコール・妊娠。神経症状は伴わない。',2),
  obs('hba2_high','hb_electrophoresis','HbA2増加','βグロビン鎖の産生低下を代償。βサラセミアの確定所見。',3),
  obs('fcm_myeloid','flow_cytometry','FCM:骨髄系マーカー陽性(MPO+)','急性骨髄性白血病(AML)。',3),
  obs('fcm_bcell','flow_cytometry','FCM:B細胞マーカー陽性(CD19/20)','B前駆細胞性ALL・B細胞リンパ腫。',3),
  obs('fcm_tcell','flow_cytometry','FCM:T細胞マーカー陽性(CD3)','T細胞性ALL・成人T細胞白血病。',3),
  obs('fcm_cd55_59_loss','flow_cytometry','FCM:CD55/CD59欠損血球','GPIアンカー欠損＝発作性夜間ヘモグロビン尿症(PNH)の確定。',3),
  obs('ph_chromosome','cytogenetics','Ph染色体 t(9;22)','慢性骨髄性白血病(CML)の目印。',3),
  obs('bcr_abl','cytogenetics','BCR-ABL融合遺伝子','恒常活性型チロシンキナーゼ。CMLの確定でありTKIの標的。',3),
  obs('pml_rara','cytogenetics','PML-RARA t(15;17)','急性前骨髄球性白血病(APL)。DICを合併しやすくATRAで分化誘導。',3),
  obs('jak2_mutation','cytogenetics','JAK2 V617F変異','真性多血症をはじめとする骨髄増殖性腫瘍。',3),
  obs('path_reed_sternberg','lymph_node_biopsy','病理:Reed-Sternberg細胞','Hodgkinリンパ腫の確定。',3),
  obs('path_lymphoma','lymph_node_biopsy','病理:リンパ腫細胞のびまん性増殖','非Hodgkinリンパ腫の確定。',3),
  obs('m_protein','serum_ep','血清M蛋白（Mスパイク）','単クローン性免疫グロブリン。多発性骨髄腫・MGUS。',3),
  obs('bence_jones','serum_ep','Bence Jones蛋白（尿中軽鎖）','尿中に遊離軽鎖。腎障害（cast nephropathy）の原因。',3),
  obs('factor8_low','coag_factor','第VIII因子活性低下','血友病A。APTT単独延長。',3),
  obs('factor9_low','coag_factor','第IX因子活性低下','血友病B。',3),
  obs('vwf_low','coag_factor','von Willebrand因子低下','血小板粘着障害＋第VIII因子の運搬体低下。粘膜出血と出血時間延長。',3),
  obs('adamts13_low','coag_factor','ADAMTS13活性著減','vWF多量体を切れず微小血栓が多発＝血栓性血小板減少性紫斑病(TTP)。',3),
  obs('punched_out_lesion','skeletal_survey','X線:打ち抜き像','破骨細胞活性化による溶骨。多発性骨髄腫。',2),
  obs('pet_uptake','skeletal_survey','PET:異常集積','悪性リンパ腫の病期診断・治療効果判定。',2),
  // 既存検査への所見追加
  obs('bm_dysplasia','bone_marrow','骨髄:異形成（三系統）','骨髄異形成症候群(MDS)。無効造血で血球減少なのに骨髄は過形成。',3),
  obs('bm_plasma_cell','bone_marrow','骨髄:形質細胞増加(≥10%)','多発性骨髄腫の診断基準の一つ。',3),
  obs('bm_hyperplasia_meg','bone_marrow','骨髄:巨核球増加','末梢での血小板破壊亢進（ITP）を骨髄が代償している。',2),
];

export const GROUPS = {
  grp_leukemia:      '白血病',
  grp_lymphoma:      'リンパ腫・形質細胞腫瘍',
  grp_mpn:           '骨髄増殖性腫瘍',
  grp_mds:           '骨髄異形成症候群',
  grp_coagulopathy:  '凝固因子異常（出血傾向）',
  grp_tma:           '微小血管障害性溶血（TMA）',
};

export const DISEASES = [
  {
    id:'thalassemia', name:'サラセミア（βサラセミア）', system:'血液', group:'grp_microcytic',
    oneLiner:'小球性なのに鉄は足りている。標的赤血球・HbA2増加。',
    keyFindings:[ kf('MCV_low',S,'rule_in',true), kf('ferritin_low',D,'rule_out'), kf('smear_target_cell',D), kf('hba2_high',C,'rule_in',true) ],
    confirm:'hba2_high', confirmNote:'小球性＋フェリチン正常〜高値（鉄欠乏の否定）＋Hb分画でHbA2増加。「鉄を入れても治らない小球性貧血」。',
    mechanism:'グロビン鎖の産生不均衡でHb量が不足し小球性に。過剰鎖が赤血球膜を傷害し無効造血・溶血を来す。',
    typical:{ MCV:66, Hb:10.5, Ferritin:150 },
  },
  {
    id:'sideroblastic', name:'鉄芽球性貧血', system:'血液', group:'grp_microcytic',
    oneLiner:'小球性〜正球性。鉄は過剰なのにヘムが作れない。環状鉄芽球。',
    keyFindings:[ kf('MCV_low',S), kf('ferritin_high',D,'rule_in',true), kf('fe_low',D,'rule_out'), kf('bm_dysplasia',C) ],
    confirm:'bone_marrow', confirmNote:'骨髄で環状鉄芽球。鉄はミトコンドリアに溜まるがヘムに組み込めない（フェリチン・血清鉄は高い）。',
    mechanism:'ヘム合成酵素（ALA合成酵素等）の異常。先天性・MDS・アルコール・鉛中毒。',
  },
  {
    id:'hereditary_spherocytosis', name:'遺伝性球状赤血球症', system:'血液', group:'grp_hemolytic',
    oneLiner:'球状赤血球＋脾腫＋胆石。浸透圧脆弱性亢進。クームス陰性。',
    keyFindings:[ kf('Hb_low',S), kf('indirect_bil_high',D,'rule_in',true), kf('smear_spherocyte',D,'rule_in',true), kf('splenomegaly',D), kf('us_gallstone',D), kf('coombs_pos',C,'rule_out') ],
    confirm:'smear_spherocyte', confirmNote:'球状赤血球＋溶血所見＋クームス陰性＋家族歴。AIHAとの決定的な差はクームス陰性であること。',
    mechanism:'膜骨格蛋白（アンキリン・スペクトリン）の異常で膜が失われ球状化。脾臓の索を通れず破壊される（血管外溶血）。',
  },
  {
    id:'aiha', name:'自己免疫性溶血性貧血(AIHA)', system:'血液', group:'grp_hemolytic',
    oneLiner:'クームス陽性の溶血。温式はIgG、寒冷凝集素はIgM。',
    keyFindings:[ kf('Hb_low',S), kf('Ret_high',D,'rule_in',true), kf('haptoglobin_low',D,'rule_in',true), kf('indirect_bil_high',D), kf('LD_high',D), kf('coombs_pos',C,'rule_in',true), kf('smear_spherocyte',D) ],
    confirm:'coombs_pos', confirmNote:'溶血の証明（Hapto↓・間接Bil↑・LD↑・Ret↑）＋直接クームス陽性。SLE・リンパ腫・薬剤の背景を探す。',
    mechanism:'赤血球膜への自己抗体結合。脾のマクロファージが貪食（血管外溶血）し、球状赤血球が生じる。',
    typical:{ Hb:7.2, Ret:80, Hapto:5, IBil:3.1, LD:520 },
  },
  {
    id:'pnh', name:'発作性夜間ヘモグロビン尿症(PNH)', system:'血液', group:'grp_hemolytic',
    oneLiner:'補体による血管内溶血＋血栓症＋汎血球減少。CD55/59欠損。',
    keyFindings:[ kf('haptoglobin_low',D,'rule_in',true), kf('LD_high',D), kf('u_blood_pos',S), kf('coombs_pos',C,'rule_out'), kf('fcm_cd55_59_loss',C,'rule_in',true) ],
    confirm:'fcm_cd55_59_loss', confirmNote:'クームス陰性の血管内溶血＋ヘモグロビン尿。フローサイトメトリーでGPIアンカー蛋白欠損血球を証明。',
    mechanism:'造血幹細胞のPIG-A変異でGPIアンカーが作れず、補体制御因子CD55/CD59を失う。補体で赤血球が溶ける。',
  },
  {
    id:'aml', name:'急性骨髄性白血病(AML)', system:'血液', group:'grp_leukemia',
    oneLiner:'汎血球減少＋末梢芽球。Auer小体。骨髄芽球20%以上で確定。',
    keyFindings:[ kf('WBC_high',S), kf('Hb_low',S), kf('PLT_low',S), kf('smear_blasts',S,'rule_in',true), kf('smear_auer_rod',D), kf('bm_blasts',C,'rule_in',true), kf('fcm_myeloid',C) ],
    confirm:'bm_blasts', confirmNote:'骨髄で芽球≥20%。フローサイトメトリー/MPO染色で骨髄系と決め、染色体で予後を層別化する。',
    mechanism:'骨髄系前駆細胞が分化を止めたまま増殖。正常造血が押しのけられ、貧血・出血・感染の三徴を来す。',
    typical:{ WBC:45.0, Hb:7.0, PLT:25 },
  },
  {
    id:'apl', name:'急性前骨髄球性白血病(APL)', system:'血液', group:'grp_leukemia',
    oneLiner:'AMLのうちDICを合併する型。t(15;17)。ATRAで分化誘導。',
    keyFindings:[ kf('smear_blasts',S), kf('PLT_low',S), kf('FDP_high',D,'rule_in',true), kf('Fib_low',D), kf('pml_rara',C,'rule_in',true) ],
    confirm:'pml_rara', confirmNote:'PML-RARA融合遺伝子で確定。DICを伴うため、疑った時点でATRAを先行投与する（診断確定を待たない）。',
    mechanism:'前骨髄球の顆粒に組織因子が豊富で、崩壊時に凝固カスケードが暴走しDICを起こす。',
  },
  {
    id:'all', name:'急性リンパ性白血病(ALL)', system:'血液', group:'grp_leukemia',
    oneLiner:'小児に多い。骨痛・リンパ節腫脹。中枢神経浸潤に注意。',
    keyFindings:[ kf('smear_blasts',S,'rule_in',true), kf('Hb_low',S), kf('PLT_low',S), kf('lymphadenopathy',S), kf('bm_blasts',C,'rule_in',true), kf('fcm_bcell',C) ],
    confirm:'bm_blasts', confirmNote:'骨髄芽球≥20%＋フローサイトメトリーでリンパ系（CD19/CD3）と決める。髄液検査で中枢浸潤を評価。',
    mechanism:'リンパ球前駆細胞の腫瘍化。小児癌で最多だが治癒率も高い。',
  },
  {
    id:'cml', name:'慢性骨髄性白血病(CML)', system:'血液', group:'grp_mpn',
    oneLiner:'著明な白血球増加（全成熟段階）＋脾腫。Ph染色体。',
    keyFindings:[ kf('WBC_high',S,'rule_in',true), kf('PLT_low',S,'rule_out'), kf('splenomegaly',S), kf('ph_chromosome',C,'rule_in',true), kf('bcr_abl',C,'rule_in',true) ],
    confirm:'bcr_abl', confirmNote:'白血球著増（芽球から成熟好中球まで揃う＝白血病裂孔がない）＋Ph染色体/BCR-ABL。好塩基球増加も特徴。',
    mechanism:'t(9;22)によるBCR-ABLキナーゼの恒常活性化。分化能は保たれるので成熟球も増える。',
    typical:{ WBC:120.0, PLT:600, Hb:11.0 },
  },
  {
    id:'cll', name:'慢性リンパ性白血病(CLL)', system:'血液', group:'grp_lymphoma',
    oneLiner:'高齢者の無症候性リンパ球増加＋リンパ節腫脹。',
    keyFindings:[ kf('WBC_high',S), kf('Lymph_high',S,'rule_in',true), kf('lymphadenopathy',D), kf('fcm_bcell',C,'rule_in',true) ],
    confirm:'flow_cytometry', confirmNote:'成熟Bリンパ球の単クローン性増加をフローサイトメトリーで証明。AIHAを合併しうる。',
    mechanism:'成熟B細胞のアポトーシス抵抗性による蓄積。進行が緩徐で無治療経過観察のことも多い。',
  },
  {
    id:'lymphoma', name:'悪性リンパ腫', system:'血液', group:'grp_lymphoma',
    oneLiner:'無痛性リンパ節腫脹＋B症状（発熱・盗汗・体重減少）。LD・sIL-2R高値。',
    keyFindings:[ kf('lymphadenopathy',S,'rule_in',true), kf('weight_loss',S), kf('LD_high',S), kf('sIL2R_high',D,'rule_in',true), kf('pet_uptake',D), kf('path_lymphoma',C,'rule_in',true), kf('path_reed_sternberg',C) ],
    confirm:'lymph_node_biopsy', confirmNote:'リンパ節生検が必須（穿刺吸引では構造が見えず不十分）。Reed-Sternberg細胞があればHodgkin。',
    mechanism:'リンパ球の単クローン性増殖。LDとsIL-2Rは腫瘍量を反映する。',
    typical:{ LD:480, sIL2R:2400 },
  },
  {
    id:'myeloma', name:'多発性骨髄腫', system:'血液', group:'grp_lymphoma',
    oneLiner:'CRAB（高Ca・腎障害・貧血・骨病変）＋M蛋白。赤沈著明亢進。',
    keyFindings:[ kf('Hb_low',S,'rule_in',true), kf('Ca_high',S,'rule_in',true), kf('Cre_high',S), kf('ESR_high',S), kf('smear_rouleaux',D), kf('punched_out_lesion',D,'rule_in',true), kf('m_protein',C,'rule_in',true), kf('bence_jones',C), kf('bm_plasma_cell',C,'rule_in',true) ],
    confirm:'m_protein', confirmNote:'M蛋白（血清/尿の電気泳動・免疫固定法）＋骨髄形質細胞≥10%＋CRAB症状。ALPは骨転移と違い上がらない点が鑑別上重要。',
    mechanism:'形質細胞の単クローン性増殖。破骨細胞を活性化して溶骨（punched-out）と高Ca血症、軽鎖が尿細管を傷害して腎障害。',
    typical:{ Hb:8.5, Ca:11.8, Cre:2.1, ESR:110, TP:9.8 },
  },
  {
    id:'polycythemia_vera', name:'真性多血症', system:'血液', group:'grp_mpn',
    oneLiner:'赤血球増加＋脾腫＋血栓症。JAK2変異。EPOは低い。',
    keyFindings:[ kf('Hct_high',S,'rule_in',true), kf('RBC_high',S), kf('splenomegaly',D), kf('jak2_mutation',C,'rule_in',true) ],
    confirm:'jak2_mutation', confirmNote:'Hb/Hct高値＋JAK2 V617F＋EPO低値。二次性多血症（低酸素・EPO産生腫瘍）ではEPOが高い点で区別する。',
    mechanism:'JAK2の恒常活性化でEPO非依存性に赤血球が増える。血液粘度上昇で血栓症を起こす。',
  },
  {
    id:'mds', name:'骨髄異形成症候群(MDS)', system:'血液', group:'grp_mds',
    oneLiner:'高齢者の血球減少。骨髄は過形成なのに末梢は減る（無効造血）。',
    keyFindings:[ kf('Hb_low',S), kf('PLT_low',S), kf('WBC_low',S), kf('MCV_high',D), kf('bm_dysplasia',C,'rule_in',true) ],
    confirm:'bm_dysplasia', confirmNote:'骨髄の三系統異形成。芽球が20%を超えればAMLへ移行と判定する。再生不良性貧血とは骨髄の細胞密度で区別。',
    mechanism:'造血幹細胞のクローン性異常で成熟過程にアポトーシスが起こる（無効造血）。',
  },
  {
    id:'itp', name:'免疫性血小板減少性紫斑病(ITP)', system:'血液', group:'grp_thrombocytopenia',
    oneLiner:'血小板だけが減る。骨髄巨核球は増加。除外診断。',
    keyFindings:[ kf('PLT_low',S,'rule_in',true), kf('petechiae',S), kf('Hb_low',S,'rule_out'), kf('WBC_low',S,'rule_out'), kf('PT_prolong',D,'rule_out'), kf('bm_hyperplasia_meg',C) ],
    confirm:'PLT', confirmNote:'孤立性の血小板減少（他系統・凝固は正常）で、薬剤・脾腫・DIC・偽性血小板減少を除外。H. pylori除菌が奏効することがある。',
    mechanism:'血小板膜糖蛋白に対する自己抗体で脾で破壊される。骨髄は代償して巨核球が増える。',
    typical:{ PLT:15, Hb:13.0, WBC:6.0, PT:12 },
  },
  {
    id:'ttp', name:'血栓性血小板減少性紫斑病(TTP)', system:'血液', group:'grp_tma',
    oneLiner:'破砕赤血球＋血小板減少＋腎障害＋神経症状＋発熱（五徴）。凝固は正常。',
    keyFindings:[ kf('PLT_low',S,'rule_in',true), kf('smear_schistocyte',D,'rule_in',true), kf('LD_high',D), kf('haptoglobin_low',D), kf('Cre_high',S), kf('PT_prolong',D,'rule_out'), kf('adamts13_low',C,'rule_in',true) ],
    confirm:'adamts13_low', confirmNote:'微小血管障害性溶血＋血小板減少で、PT/APTT・フィブリノゲンが正常（＝DICでない）ことが決定的。ADAMTS13活性<10%で確定。血漿交換が救命。',
    mechanism:'ADAMTS13欠損でvWF超多量体が切れず、血小板血栓が微小血管に多発。赤血球が裂かれ破砕赤血球に。',
    typical:{ PLT:12, LD:1200, Hapto:3, Cre:2.4, PT:12, Fib:280 },
  },
  {
    id:'hemophilia', name:'血友病A / B', system:'血液', group:'grp_coagulopathy',
    oneLiner:'APTT単独延長。関節内・筋肉内の深部出血。X連鎖劣性。',
    keyFindings:[ kf('APTT_prolong',S,'rule_in',true), kf('PT_prolong',S,'rule_out'), kf('PLT_low',S,'rule_out'), kf('factor8_low',C,'rule_in',true), kf('factor9_low',C) ],
    confirm:'coag_factor', confirmNote:'APTTのみ延長＋PT/血小板正常。第VIII（A）または第IX（B）因子活性で確定。クロスミキシング試験でインヒビターを除外。',
    mechanism:'内因系凝固因子の欠損。一次止血（血小板）は正常なので、点状出血ではなく関節・筋の深部出血になる。',
    typical:{ APTT:68, PT:12, PLT:250 },
  },
  {
    id:'vwd', name:'von Willebrand病', system:'血液', group:'grp_coagulopathy',
    oneLiner:'粘膜出血（鼻出血・月経過多）＋出血時間延長＋APTT軽度延長。',
    keyFindings:[ kf('APTT_prolong',D), kf('PLT_low',S,'rule_out'), kf('vwf_low',C,'rule_in',true) ],
    confirm:'vwf_low', confirmNote:'血小板数は正常なのに一次止血が働かない（粘膜出血）。vWF抗原・活性で確定。最も頻度の高い先天性出血性疾患。',
    mechanism:'vWFは①血小板を血管内皮下コラーゲンに接着させ、②第VIII因子を運ぶ。両方が落ちるため一次・二次止血が共に障害される。',
  },
];

export const PRESENTATIONS = [
  pres('pres_pancytopenia','汎血球減少','abnormality','血液',
    '末梢血塗抹で芽球の有無を見て、骨髄穿刺で「細胞が少ないのか、多いのに出せないのか」を決める。','pw_pancytopenia'),
  pres('pres_leukocytosis','白血球増加','abnormality','血液',
    '塗抹で分画を見る。芽球があれば急性白血病、成熟球が全段階なら慢性骨髄性白血病、桿状核増加なら細菌感染。','pw_leukocytosis'),
  pres('pres_bleeding','出血傾向','complaint','血液',
    '出血の「型」を見る。点状出血・粘膜出血＝一次止血（血小板・vWF）、深部/関節出血＝二次止血（凝固因子）。','pw_bleeding'),
  pres('pres_lymphadenopathy','リンパ節腫脹','complaint','血液',
    '部位・硬さ・可動性・経過とB症状。LD・sIL-2R、そして生検（穿刺吸引では不十分）。','pw_lymphadenopathy'),
];

export const PATHWAYS = [
  {
    id:'pw_pancytopenia', title:'汎血球減少の鑑別', system:'血液', entryId:'pres_pancytopenia',
    summary:'三系統が減るのは「作れない（骨髄）」「壊される/捕まる（末梢・脾）」のどちらか。' +
            '末梢血塗抹で芽球を探し、骨髄穿刺で細胞密度を見る。この2手でほぼ決まる。',
    root: st('汎血球減少（Hb↓・WBC↓・PLT↓）', {
      layer:S, test:'blood_smear', ask:'末梢血に芽球はいるか？',
      note:'最初の一手は最も安価な塗抹。芽球が見えたら急性白血病として直ちに骨髄へ進む。',
      branches:[
        br('smear_blasts','芽球あり → 急性白血病', st('急性白血病の疑い', {
          layer:C, test:'bone_marrow', ask:'骨髄芽球は20%以上か？ 系統は？',
          note:'骨髄で芽球比率と系統（骨髄系/リンパ系）を決める。染色体で予後と治療が変わる。',
          branches:[
            br('smear_auer_rod','Auer小体・MPO陽性', dz('aml','急性骨髄性白血病(AML)','骨髄芽球≥20%＋骨髄系マーカー。')),
            br('pml_rara','PML-RARA・DIC合併', dz('apl','急性前骨髄球性白血病(APL)','疑った時点でATRAを開始する。')),
            br('fcm_bcell','リンパ系マーカー陽性', dz('all','急性リンパ性白血病(ALL)','髄液検査で中枢神経浸潤を確認。')),
          ],
        })),
        br('bm_hypoplasia','芽球なし → 骨髄の細胞密度は？', st('芽球のない汎血球減少', {
          layer:C, test:'bone_marrow', ask:'骨髄は低形成か、過形成か？',
          note:'ここが背骨の分岐。「低形成＝作る細胞がいない（再生不良性貧血）」「過形成なのに末梢が少ない＝作っても壊れる（無効造血=MDS）」。',
          branches:[
            br('bm_hypoplasia','骨髄低形成（脂肪髄）', dz('aplastic','再生不良性貧血','造血細胞の著減。PNHクローンの合併を調べる。')),
            br('bm_dysplasia','骨髄過形成＋三系統異形成', dz('mds','骨髄異形成症候群(MDS)','無効造血。芽球20%超ならAMLへ移行と判定。')),
            br('splenomegaly','脾腫あり（脾機能亢進）', dz('liver_cirrhosis','肝硬変（脾機能亢進）','門脈圧亢進で脾に血球が捕捉される。骨髄は正常。')),
            br('fcm_cd55_59_loss','溶血＋CD55/59欠損', dz('pnh','発作性夜間ヘモグロビン尿症(PNH)','再生不良性貧血と連続したスペクトラム。')),
          ],
        })),
      ],
    }),
  },
  {
    id:'pw_leukocytosis', title:'白血球増加の鑑別', system:'血液', entryId:'pres_leukocytosis',
    summary:'数だけでは何も分からない。「どの細胞が増えているか」を塗抹で見るのが唯一の入口。' +
            '芽球（未熟のみ）か、全成熟段階が揃うか、桿状核だけか ―― この形の違いが機序の違いをそのまま映す。',
    root: st('白血球増加', {
      layer:S, test:'blood_smear', ask:'増えているのはどの細胞か？',
      note:'白血球数は反応性にも腫瘍性にも上がる。分画（塗抹）を見ずに次へ進んではいけない。',
      branches:[
        br('smear_blasts','芽球のみが増加（白血病裂孔）', dz('aml','急性白血病','芽球と成熟球の間が抜ける＝分化が止まっている。骨髄へ。')),
        br('smear_left_shift','桿状核球の増加（核左方移動）＋CRP↑', st('反応性白血球増加', {
          layer:S, test:'PCT', ask:'細菌感染の裏づけは？',
          note:'骨髄が正常に反応している状態。感染源を探すのが次の仕事で、血液内科的精査は不要。',
          branches:[ br('PCT_high','プロカルシトニン高値 → 細菌感染/敗血症', st('感染症として精査', { layer:S, test:'CRP' })) ],
        })),
        br('ph_chromosome','芽球〜成熟好中球まで全段階＋脾腫', st('慢性骨髄性白血病の疑い', {
          layer:C, test:'cytogenetics', ask:'Ph染色体 / BCR-ABL は？',
          note:'分化能が保たれるので成熟球も増える（＝白血病裂孔がない）。ここがALL/AMLとの決定的な差。',
          branches:[ br('bcr_abl','BCR-ABL陽性', dz('cml','慢性骨髄性白血病(CML)','TKIが標的治療となる。')) ],
        })),
        br('Lymph_high','成熟リンパ球の増加（高齢・無症候）', dz('cll','慢性リンパ性白血病(CLL)','フローサイトメトリーで単クローン性を証明。')),
        br('smear_atypical_lymph','異型リンパ球（若年・咽頭痛・肝脾腫）', st('伝染性単核球症', { layer:D, test:'blood_smear', note:'EBV初感染。ペニシリンで皮疹が出ることで有名。' })),
      ],
    }),
  },
  {
    id:'pw_bleeding', title:'出血傾向の鑑別', system:'血液', entryId:'pres_bleeding',
    summary:'「出血の型」が止血のどの段階が壊れたかを教える。点状出血・粘膜出血は一次止血（血小板・vWF）、' +
            '関節や筋肉の深部出血は二次止血（凝固因子）。次に血小板数・PT・APTTの3つで機序を確定する。',
    root: st('出血傾向', {
      layer:S, test:'PLT', ask:'血小板数は？ 出血の型は点状か、深部か？',
      note:'まず一次止血か二次止血か。ここを間違えると検査を無駄に撃つことになる。',
      branches:[
        br('PLT_low','血小板減少（点状出血・紫斑）', st('血小板減少の鑑別', {
          layer:D, test:'PT', ask:'凝固（PT/APTT/フィブリノゲン）は正常か？ 破砕赤血球は？',
          note:'血小板だけが減るのか、凝固も一緒に壊れているのかで、全く別の疾患群になる。',
          branches:[
            br('FDP_high','凝固も異常（PT延長・Fib↓・FDP↑）', dz('disseminated_ic','播種性血管内凝固(DIC)','基礎疾患（敗血症・APL・産科合併症）を必ず探す。')),
            br('smear_schistocyte','凝固は正常・破砕赤血球あり', dz('ttp','血栓性血小板減少性紫斑病(TTP)','ADAMTS13<10%で確定。血漿交換を急ぐ。')),
            br('bm_hyperplasia_meg','孤立性の血小板減少・他は正常', dz('itp','免疫性血小板減少性紫斑病(ITP)','除外診断。骨髄巨核球はむしろ増加。')),
          ],
        })),
        br('APTT_prolong','血小板正常・APTT延長（関節/筋の深部出血）', st('凝固因子異常', {
          layer:C, test:'coag_factor', ask:'PTは正常か？ どの因子が低いか？',
          note:'APTT単独延長＝内因系。PTも延長するなら共通経路（肝不全・DIC・VitK欠乏）を考える。',
          branches:[
            br('factor8_low','第VIII因子低下', dz('hemophilia','血友病A','クロスミキシング試験でインヒビターを除外。')),
            br('vwf_low','vWF低下（粘膜出血が主体）', dz('vwd','von Willebrand病','一次止血も障害されるため出血の型が混ざる。')),
          ],
        })),
        br('PT_prolong','PT・APTTともに延長（血小板正常）', st('共通経路/肝合成能の障害', {
          layer:D, test:'Alb', ask:'肝合成能は？ ビタミンK欠乏は？',
          note:'PT優位ならビタミンK欠乏・肝障害。Alb・ChEも低ければ肝硬変。',
          branches:[ br('Alb_low','Alb↓・ChE↓', dz('liver_cirrhosis','肝硬変','凝固因子は肝で作られる。PTは肝機能の鋭敏な指標。')) ],
        })),
      ],
    }),
  },
  {
    id:'pw_lymphadenopathy', title:'リンパ節腫脹の鑑別', system:'血液', entryId:'pres_lymphadenopathy',
    summary:'「反応性か、腫瘍か」。痛みを伴い可動性のある柔らかい節は反応性、無痛性で硬く固定された節は腫瘍。' +
            'B症状とLD・sIL-2Rが腫瘍量を示し、最後は生検（穿刺吸引ではなく摘出）で確定する。',
    root: st('リンパ節腫脹', {
      layer:S, test:'general_exam', ask:'無痛性か？ 全身性か？ B症状（発熱・盗汗・体重減少）は？',
      note:'痛い・柔らかい・可動性＝感染への反応。痛くない・硬い・固定＝腫瘍を疑う。',
      branches:[
        br('weight_loss','無痛性・B症状あり', st('悪性リンパ腫の疑い', {
          layer:D, test:'sIL2R', ask:'LD・sIL-2Rは？ PETでの分布は？',
          note:'LDとsIL-2Rは腫瘍量を反映する。しかし診断は必ず組織で行う。',
          branches:[
            br('sIL2R_high','sIL-2R↑・LD↑', st('組織診断へ', {
              layer:C, test:'lymph_node_biopsy', ask:'Reed-Sternberg細胞はあるか？',
              branches:[
                br('path_reed_sternberg','Reed-Sternberg細胞あり', dz('lymphoma','Hodgkinリンパ腫','連続性に隣接領域へ進展する。')),
                br('path_lymphoma','びまん性のリンパ腫細胞', dz('lymphoma','非Hodgkinリンパ腫','病型により治療が大きく異なる。')),
              ],
            })),
          ],
        })),
        br('smear_atypical_lymph','有痛性・急性経過・異型リンパ球', st('反応性リンパ節腫脹', { layer:S, test:'blood_smear', note:'ウイルス感染（EBV/CMV）や細菌感染への反応。経過観察でよいことが多い。' })),
        br('Lymph_high','高齢・末梢リンパ球増加', dz('cll','慢性リンパ性白血病(CLL)','フローサイトメトリーで確定。')),
        br('lymphadenopathy','限局性・硬く固定・原発巣あり', st('癌のリンパ節転移', { layer:D, test:'abdo_ct', note:'所属リンパ節の腫大。原発巣の検索が本体。' })),
      ],
    }),
  },
];
