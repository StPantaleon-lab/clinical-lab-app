// src/data/systems/urology.js
// ═══════════════════════════════════════════════════════════════════════
//  腎・泌尿器 ― 腎不全 / 糸球体疾患 / 尿路の閉塞・感染・腫瘍
// ═══════════════════════════════════════════════════════════════════════
//  腎臓の鑑別は「どこが壊れたか」の部位診断がすべて。
//    腎前性（灌流）→ 腎性（糸球体・尿細管・間質）→ 腎後性（閉塞）
//  尿沈渣の円柱は「腎から来た」証拠であり、この部位診断の決め手になる。
// ═══════════════════════════════════════════════════════════════════════

import { S, D, C, numT, obsT, panelT, num, obs, kf, st, dz, br, pres } from './_kit.js';

export const TESTS = [
  numT('PSA','PSA','腎泌尿器', S),
  obsT('renal_us','腎・膀胱超音波','imaging','腎泌尿器', S,
    ['us_kidney_atrophy','us_kidney_cysts','us_renal_mass','us_bladder_residual','us_kidney_stone'],
    '最初に撮る。腎サイズ（萎縮＝慢性）、水腎症（＝腎後性）、嚢胞、残尿を非侵襲に評価する。', { cost:'低' }),
  obsT('kub_ct','腹部単純CT（尿路結石プロトコル）','imaging','腎泌尿器', D,
    ['ct_ureteral_stone','ct_renal_mass_enhance','ct_bladder_tumor'],
    '尿路結石は単純CTで9割以上が描出される（造影不要）。腎細胞癌は造影で早期濃染。', { cost:'中' }),
  obsT('renal_biopsy','腎生検','pathology','腎泌尿器', C,
    ['path_iga_mesangial','path_mcns','path_membranous','path_crescent','path_diabetic_nodule'],
    '糸球体疾患の確定診断。光顕・蛍光抗体（免疫沈着）・電顕（沈着部位）の3点セットで読む。', { cost:'高' }),
  obsT('cystoscopy','膀胱鏡','imaging','腎泌尿器', C,
    ['cysto_tumor'],
    '肉眼的血尿の精査。膀胱腫瘍を直視下に確認し、生検・TURBTへ。'),
  obsT('urine_cytology','尿細胞診','pathology','腎泌尿器', D,
    ['urine_cytology_pos'],
    '尿路上皮癌のスクリーニング。高異型度癌では感度が高い。'),
  obsT('urine_culture','尿培養','pathology','腎泌尿器', D,
    ['urine_culture_pos'],
    '有意細菌尿（10^5 CFU/mL以上）。抗菌薬投与前に採取する。'),
  obsT('anca_gbm','ANCA・抗GBM抗体','blood','腎泌尿器', C,
    ['mpo_anca_pos','pr3_anca_pos','anti_gbm_pos'],
    '急速進行性糸球体腎炎(RPGN)の病因を分ける。ANCA関連血管炎か、抗GBM病(Goodpasture)か。'),
  obsT('complement_test','補体（C3/C4/CH50）','blood','腎泌尿器', D,
    ['c3_low','c4_low'],
    '低補体は「補体が消費されている」＝免疫複合体が沈着している証拠。溶連菌感染後腎炎・ループス腎炎・膜性増殖性腎炎。'),
  obsT('prostate_exam','前立腺の直腸診','physical','腎泌尿器', S,
    ['prostate_enlarged_smooth','prostate_hard_nodule'],
    '弾性軟で表面平滑なら前立腺肥大症、石様硬で表面不整なら前立腺癌を疑う。'),
  obsT('cva_tenderness','肋骨脊柱角(CVA)叩打痛','physical','腎泌尿器', S,
    ['cva_pain'],
    '腎実質・腎盂の炎症や尿管結石による腎盂内圧上昇で陽性。膀胱炎では陰性。'),
];

export const FINDINGS = [
  num('PSA_high','PSA','PSA高値','high','前立腺癌のスクリーニング。前立腺肥大症・前立腺炎・直腸診後にも上昇する（特異度は低い）。',1),
  obs('us_kidney_atrophy','renal_us','US:腎萎縮・皮質菲薄化','慢性経過の証拠。急性腎障害と慢性腎臓病を分ける最も簡便な所見。',1),
  obs('us_kidney_cysts','renal_us','US:両腎の多発嚢胞','常染色体顕性多発性嚢胞腎(ADPKD)。腎腫大＋高血圧＋家族歴。',1),
  obs('us_renal_mass','renal_us','US:腎腫瘤','腎細胞癌・血管筋脂肪腫。造影CTで血流を評価する。',1),
  obs('us_bladder_residual','renal_us','US:残尿増加','下部尿路閉塞（前立腺肥大症）または排尿筋収縮不全。',1),
  obs('us_kidney_stone','renal_us','US:腎結石・音響陰影','水腎症を伴えば尿管に落ちた可能性。',1),
  obs('ct_ureteral_stone','kub_ct','CT:尿管結石','単純CTで高吸収の結石。水腎症の原因部位を特定する。',2),
  obs('ct_renal_mass_enhance','kub_ct','CT:腎腫瘤の早期濃染','腎細胞癌に典型（多血性）。生検せず画像＋手術で診断することが多い。',2),
  obs('ct_bladder_tumor','kub_ct','CT:膀胱腫瘍','肉眼的血尿の原因検索。膀胱鏡で確認。',2),
  obs('path_iga_mesangial','renal_biopsy','病理:メサンギウム領域へのIgA沈着','IgA腎症の確定所見（蛍光抗体法）。',3),
  obs('path_mcns','renal_biopsy','病理:光顕でほぼ正常・電顕で足突起消失','微小変化型ネフローゼ症候群。小児のネフローゼで最多。',3),
  obs('path_membranous','renal_biopsy','病理:糸球体基底膜の上皮下沈着（spike）','膜性腎症。成人ネフローゼで多く、悪性腫瘍の合併を検索する。',3),
  obs('path_crescent','renal_biopsy','病理:半月体形成','急速進行性糸球体腎炎(RPGN)。数週で腎不全に至るため緊急。',3),
  obs('path_diabetic_nodule','renal_biopsy','病理:結節性病変(Kimmelstiel-Wilson)','糖尿病性腎症。通常は生検せず経過で診断する。',3),
  obs('cysto_tumor','cystoscopy','膀胱鏡:乳頭状腫瘍','膀胱癌。TURBTで組織確定と治療を兼ねる。',3),
  obs('urine_cytology_pos','urine_cytology','尿細胞診 陽性(class IV-V)','尿路上皮癌。膀胱鏡へ進む。',2),
  obs('urine_culture_pos','urine_culture','尿培養で有意細菌尿','尿路感染の起炎菌を同定。大腸菌が最多。',2),
  obs('mpo_anca_pos','anca_gbm','MPO-ANCA陽性','顕微鏡的多発血管炎。RPGN＋肺胞出血・間質性肺炎を来す。',3),
  obs('pr3_anca_pos','anca_gbm','PR3-ANCA陽性','多発血管炎性肉芽腫症（上気道・肺・腎の三徴）。',3),
  obs('anti_gbm_pos','anca_gbm','抗GBM抗体陽性','Goodpasture症候群。肺胞出血＋RPGN。血漿交換を急ぐ。',3),
  obs('c3_low','complement_test','C3低下','補体が消費されている＝免疫複合体の沈着。溶連菌感染後腎炎・ループス腎炎。',2),
  obs('c4_low','complement_test','C4低下','古典経路の活性化。ループス腎炎（C3・C4ともに低下）。',2),
  obs('prostate_enlarged_smooth','prostate_exam','直腸診:弾性軟・表面平滑な腫大','前立腺肥大症。移行領域の増生。',1),
  obs('prostate_hard_nodule','prostate_exam','直腸診:石様硬・表面不整の結節','前立腺癌を強く疑う。辺縁領域から発生する。',1),
  obs('cva_pain','cva_tenderness','CVA叩打痛陽性','腎盂腎炎・尿管結石。膀胱炎では陰性であることが鑑別点。',1),
];

export const GROUPS = {
  grp_aki:            '急性腎障害(AKI)',
  grp_ckd:            '慢性腎臓病(CKD)',
  grp_nephritic:      '腎炎症候群（血尿主体）',
  grp_nephrotic:      'ネフローゼ症候群（蛋白尿主体）',
  grp_uti:            '尿路感染症',
  grp_urolith:        '尿路結石',
  grp_uro_tumor:      '泌尿器腫瘍',
  grp_cystic_kidney:  '嚢胞性腎疾患',
};

export const DISEASES = [
  {
    id:'prerenal_aki', name:'腎前性急性腎障害', system:'腎泌尿器', group:'grp_aki',
    oneLiner:'灌流低下。BUN/Cre>20、尿Na低値、FENa<1%。輸液で戻る。',
    keyFindings:[ kf('Cre_high',S,'rule_in',true), kf('BUN_high',S,'rule_in',true), kf('UNa_low',D,'rule_in',true), kf('u_rbc_cast',D,'rule_out'), kf('us_hydronephrosis',S,'rule_out') ],
    confirm:'UNa', confirmNote:'腎そのものは無事で、尿細管はNaと水を必死に再吸収している（尿Na<20、FENa<1%、尿浸透圧>500）。輸液で速やかに改善するかが診断でもある。',
    mechanism:'脱水・出血・心不全・肝硬変で有効循環血漿量が低下しGFRが落ちる。BUNは尿素として再吸収されるためCreより上がりやすく、BUN/Cre比が開く。',
    typical:{ Cre:2.2, BUN:58, UNa:12, UOsm:620 },
  },
  {
    id:'atn', name:'急性尿細管壊死(ATN)／腎性AKI', system:'腎泌尿器', group:'grp_aki',
    oneLiner:'虚血・腎毒性物質。尿Na高値、FENa>2%、褐色顆粒円柱。輸液で戻らない。',
    keyFindings:[ kf('Cre_high',S,'rule_in',true), kf('UNa_high',D,'rule_in',true), kf('K_high',D), kf('HCO3_low',D), kf('us_hydronephrosis',S,'rule_out') ],
    confirm:'UNa', confirmNote:'尿細管が壊れているのでNaを再吸収できない（尿Na>40、FENa>2%、尿浸透圧≒血漿）。腎前性との鑑別は「尿が濃縮できているか」に尽きる。',
    mechanism:'腎前性が遷延、または造影剤・アミノグリコシド・横紋筋融解（ミオグロビン）で尿細管上皮が壊死。',
    typical:{ Cre:3.8, BUN:62, UNa:55, UOsm:290, K:5.8 },
  },
  {
    id:'postrenal_aki', name:'腎後性急性腎障害', system:'腎泌尿器', group:'grp_aki',
    oneLiner:'閉塞。水腎症＋残尿。解除で速やかに改善するので見逃してはならない。',
    keyFindings:[ kf('Cre_high',S,'rule_in',true), kf('us_hydronephrosis',S,'rule_in',true), kf('us_bladder_residual',S), kf('prostate_enlarged_smooth',S) ],
    confirm:'us_hydronephrosis', confirmNote:'AKIを見たら「まず超音波で水腎症を否定する」。治療可能な原因を最初に除外するのが鉄則。',
    mechanism:'両側尿管または下部尿路の閉塞（前立腺肥大・結石・腫瘍）で尿が流れず、尿細管内圧が上昇してGFRが低下する。',
  },
  {
    id:'ckd', name:'慢性腎臓病(CKD)', system:'腎泌尿器', group:'grp_ckd',
    oneLiner:'eGFR<60または蛋白尿が3か月以上。腎萎縮＋貧血＋高P＋PTH↑。',
    keyFindings:[ kf('Cre_high',S,'rule_in',true), kf('UPro_high',S), kf('Hb_low',S), kf('P_high',D), kf('PTH_high',D), kf('Ca_low',D), kf('HCO3_low',D), kf('us_kidney_atrophy',S,'rule_in',true) ],
    confirm:'us_kidney_atrophy', confirmNote:'eGFR<60が3か月以上、または蛋白尿。腎萎縮・正球性貧血（EPO低下）・二次性副甲状腺機能亢進症の存在が「慢性」の証拠になる。',
    mechanism:'ネフロン喪失が進行。EPO低下で腎性貧血、P排泄低下と活性型VitD低下でCaが下がりPTHが上がる（CKD-MBD）。',
    typical:{ Cre:2.8, Hb:9.8, P:5.4, PTH:180, Ca:8.2, HCO3:19 },
  },
  {
    id:'iga_nephropathy', name:'IgA腎症', system:'腎泌尿器', group:'grp_nephritic',
    oneLiner:'感冒後1〜3日の肉眼的血尿。持続する顕微鏡的血尿＋軽度蛋白尿。補体は正常。',
    keyFindings:[ kf('URBCh_high',S,'rule_in',true), kf('u_rbc_cast',S,'rule_in',true), kf('UPro_high',D), kf('c3_low',D,'rule_out'), kf('path_iga_mesangial',C,'rule_in',true) ],
    confirm:'path_iga_mesangial', confirmNote:'糸球体性血尿（変形赤血球・赤血球円柱）が持続し、補体は正常。確定は腎生検の蛍光抗体法でメサンギウムへのIgA沈着。日本で最多の慢性糸球体腎炎。',
    mechanism:'糖鎖異常IgA1を含む免疫複合体がメサンギウムに沈着し、増殖と炎症を起こす。上気道感染と同時期に血尿が出る（PSAGNの1〜2週の潜伏期と対照的）。',
    typical:{ URBCh:40, UPro:60, C3:90 },
  },
  {
    id:'psagn', name:'溶連菌感染後急性糸球体腎炎(PSAGN)', system:'腎泌尿器', group:'grp_nephritic',
    oneLiner:'咽頭炎の1〜2週後の血尿・浮腫・高血圧。C3低下、ASO上昇。',
    keyFindings:[ kf('URBCh_high',S,'rule_in',true), kf('u_rbc_cast',S), kf('edema',S), kf('SBP_high',S), kf('c3_low',D,'rule_in',true), kf('ASO_high',D,'rule_in',true) ],
    confirm:'c3_low', confirmNote:'感染からの潜伏期（1〜2週）＋腎炎症候群（血尿・浮腫・高血圧）＋C3低下＋ASO上昇。C3は6〜8週で正常化する（正常化しなければ別疾患）。',
    mechanism:'溶連菌抗原と抗体の免疫複合体が糸球体に沈着し、補体を消費して炎症を起こす。小児では予後良好。',
    typical:{ URBCh:80, C3:30, ASO:600, SBP:150 },
  },
  {
    id:'rpgn', name:'急速進行性糸球体腎炎(RPGN)', system:'腎泌尿器', group:'grp_nephritic',
    oneLiner:'数週〜数か月で腎不全へ。半月体形成。ANCA/抗GBM抗体で病因を分ける。',
    keyFindings:[ kf('Cre_high',S,'rule_in',true), kf('URBCh_high',S), kf('u_rbc_cast',S,'rule_in',true), kf('CRP_high',S), kf('mpo_anca_pos',C,'rule_in',true), kf('anti_gbm_pos',C), kf('path_crescent',C,'rule_in',true) ],
    confirm:'path_crescent', confirmNote:'「血尿＋赤血球円柱＋急速な腎機能低下」を見たら緊急。ANCA・抗GBM抗体を即日提出し、腎生検で半月体を確認する。診断の遅れがそのまま透析導入になる。',
    mechanism:'糸球体基底膜の破綻でBowman腔にフィブリン・単球が流入し半月体を形成。ANCA関連血管炎、抗GBM病、免疫複合体性に大別。',
  },
  {
    id:'nephrotic_syndrome', name:'ネフローゼ症候群', system:'腎泌尿器', group:'grp_nephrotic',
    oneLiner:'高度蛋白尿(3.5g/日以上)＋低Alb血症。浮腫・高LDL・脂肪円柱。',
    keyFindings:[ kf('UPro_high',S,'rule_in',true), kf('UPCR_high',D,'rule_in',true), kf('Alb_low',S,'rule_in',true), kf('edema',S), kf('LDL_high',D), kf('u_fatty_cast',D), kf('path_mcns',C), kf('path_membranous',C) ],
    confirm:'renal_biopsy', confirmNote:'蛋白尿3.5g/gCr以上＋血清Alb 3.0g/dL以下で診断（浮腫・脂質異常は必須でない）。病型は腎生検で決める：小児は微小変化型、成人は膜性腎症が多い。',
    mechanism:'糸球体の荷電・サイズバリアが破綻しアルブミンが漏出。膠質浸透圧低下で浮腫、肝の代償的リポ蛋白合成で高LDL、アンチトロンビンIII喪失で血栓症。',
    typical:{ UPro:800, UPCR:8.2, Alb:1.9, LDL:280 },
  },
  {
    id:'diabetic_nephropathy', name:'糖尿病性腎症', system:'腎泌尿器', group:'grp_nephrotic',
    oneLiner:'微量アルブミン尿→顕性蛋白尿→腎不全。血尿は乏しい。網膜症を伴う。',
    keyFindings:[ kf('UAlb_high',S,'rule_in',true), kf('HbA1c_high',S), kf('UPro_high',D), kf('URBCh_high',S,'rule_out'), kf('path_diabetic_nodule',C) ],
    confirm:'UAlb_high', confirmNote:'糖尿病歴＋微量アルブミン尿から顕性蛋白尿へ進む経過と、網膜症の併存で臨床診断する（通常は生検しない）。血尿が目立つ、網膜症がない、急激な進行なら他の腎炎を疑って生検する。',
    mechanism:'高血糖による糸球体過剰濾過とメサンギウム基質増加。透析導入原因の第1位。',
  },
  {
    id:'lupus_nephritis', name:'ループス腎炎', system:'腎泌尿器', group:'grp_nephritic',
    oneLiner:'SLEに伴う腎炎。C3・C4ともに低下、抗ds-DNA抗体高値。',
    keyFindings:[ kf('URBCh_high',S), kf('UPro_high',S), kf('c3_low',D,'rule_in',true), kf('c4_low',D,'rule_in',true), kf('ana_pos',D,'rule_in',true) ],
    confirm:'renal_biopsy', confirmNote:'SLEの診断＋腎所見。腎生検でISN/RPS分類のクラス（I〜VI）を決め、治療強度を選ぶ。低補体は活動性の指標。',
    mechanism:'免疫複合体の糸球体沈着。補体を消費するためC3・C4がともに低下する（PSAGNではC3優位）。',
  },
  {
    id:'adpkd', name:'常染色体顕性多発性嚢胞腎(ADPKD)', system:'腎泌尿器', group:'grp_cystic_kidney',
    oneLiner:'両腎の多発嚢胞＋腎腫大＋高血圧＋家族歴。脳動脈瘤の合併。',
    keyFindings:[ kf('us_kidney_cysts',S,'rule_in',true), kf('SBP_high',S), kf('URBCh_high',S), kf('Cre_high',D) ],
    confirm:'us_kidney_cysts', confirmNote:'家族歴＋年齢に応じた嚢胞数（画像診断基準）。頭部MRAで脳動脈瘤のスクリーニングを行う（くも膜下出血の予防）。',
    mechanism:'PKD1/PKD2変異により尿細管上皮の嚢胞が進行性に増大し、正常実質を圧排する。',
  },
  {
    id:'urolithiasis', name:'尿路結石症', system:'腎泌尿器', group:'grp_urolith',
    oneLiner:'突然の側腹部激痛＋顕微鏡的血尿。単純CTで結石と水腎症。',
    keyFindings:[ kf('cva_pain',S,'rule_in',true), kf('URBCh_high',S,'rule_in',true), kf('us_hydronephrosis',S), kf('ct_ureteral_stone',D,'rule_in',true), kf('UA_high',D) ],
    confirm:'ct_ureteral_stone', confirmNote:'疝痛＋血尿で疑い、単純CTで結石・水腎症を確認（造影不要）。発熱を伴えば結石性腎盂腎炎として緊急ドレナージ。',
    mechanism:'シュウ酸Ca結石が最多。尿管の生理的狭窄部（腎盂尿管移行部・総腸骨動脈交叉部・膀胱壁内部）で嵌頓する。',
  },
  {
    id:'pyelonephritis', name:'急性腎盂腎炎', system:'腎泌尿器', group:'grp_uti',
    oneLiner:'発熱＋CVA叩打痛＋膿尿＋白血球円柱。膀胱炎との差は「発熱と全身症状」。',
    keyFindings:[ kf('BT_high',S,'rule_in',true), kf('cva_pain',S,'rule_in',true), kf('UWBCh_high',S,'rule_in',true), kf('u_wbc_cast',D,'rule_in',true), kf('CRP_high',S), kf('urine_culture_pos',D) ],
    confirm:'urine_culture', confirmNote:'膿尿＋発熱＋CVA叩打痛。白血球円柱は「腎実質の炎症」を示し、膀胱炎（発熱なし・円柱なし）との決定的な差になる。閉塞があれば緊急ドレナージ。',
    mechanism:'膀胱から尿管を逆行した細菌（大腸菌が最多）が腎実質に達する。菌血症・敗血症に進展しうる。',
    typical:{ BT:39.2, CRP:15, UWBCh:80, WBC:17.0 },
  },
  {
    id:'cystitis', name:'急性膀胱炎', system:'腎泌尿器', group:'grp_uti',
    oneLiner:'頻尿・排尿時痛・残尿感。発熱なし。CVA叩打痛陰性。',
    keyFindings:[ kf('UWBCh_high',S,'rule_in',true), kf('u_nitrite_pos',S), kf('BT_high',S,'rule_out'), kf('cva_pain',S,'rule_out'), kf('CRP_high',S,'rule_out') ],
    confirm:'urinalysis', confirmNote:'膿尿・細菌尿＋膀胱刺激症状で、発熱と背部痛がないこと。発熱があれば腎盂腎炎か前立腺炎を考える。',
    mechanism:'尿道から膀胱への上行性感染。女性に多い（尿道が短い）。',
  },
  {
    id:'bph', name:'前立腺肥大症(BPH)', system:'腎泌尿器', group:'grp_uro_tumor',
    oneLiner:'排尿困難・残尿・夜間頻尿。直腸診で弾性軟・平滑な腫大。',
    keyFindings:[ kf('us_bladder_residual',S,'rule_in',true), kf('prostate_enlarged_smooth',S,'rule_in',true), kf('PSA_high',S), kf('prostate_hard_nodule',S,'rule_out') ],
    confirm:'prostate_enlarged_smooth', confirmNote:'症状（IPSS）＋残尿＋直腸診。PSAは軽度上昇しうるが、著明高値や硬結があれば癌を疑って生検へ。',
    mechanism:'移行領域の間質・腺の増生が尿道を圧迫。癌が発生する辺縁領域とは別の場所である点が、直腸診の所見の差につながる。',
  },
  {
    id:'prostate_cancer', name:'前立腺癌', system:'腎泌尿器', group:'grp_uro_tumor',
    oneLiner:'PSA高値＋直腸診で硬結。骨転移（造骨性）でALP上昇。',
    keyFindings:[ kf('PSA_high',S,'rule_in',true), kf('prostate_hard_nodule',S,'rule_in',true), kf('ALP_high',D), kf('punched_out_lesion',D,'rule_out') ],
    confirm:'PSA_high', confirmNote:'PSA高値＋直腸診/MRIで疑い、前立腺生検で確定（Gleasonスコア）。骨転移は造骨性のためALPが上がり、骨シンチで集積する（骨髄腫の溶骨性・打ち抜き像とは対照的）。',
    mechanism:'辺縁領域の腺癌。アンドロゲン依存性のため内分泌療法が有効。',
  },
  {
    id:'renal_cell_carcinoma', name:'腎細胞癌', system:'腎泌尿器', group:'grp_uro_tumor',
    oneLiner:'古典的三徴（血尿・腹部腫瘤・側腹部痛）は今は稀。多くは偶発発見。',
    keyFindings:[ kf('URBCh_high',S), kf('us_renal_mass',S,'rule_in',true), kf('ct_renal_mass_enhance',D,'rule_in',true), kf('Hct_high',D) ],
    confirm:'ct_renal_mass_enhance', confirmNote:'造影CTでの早期濃染と洗い出し。生検せずに画像＋手術で診断することが多い。EPO産生による多血症など傍腫瘍症候群を伴う。',
    mechanism:'近位尿細管上皮由来（淡明細胞型が多い）。VHL遺伝子異常で低酸素誘導因子が蓄積し血管新生が亢進、多血性腫瘍となる。',
  },
  {
    id:'bladder_cancer', name:'膀胱癌', system:'腎泌尿器', group:'grp_uro_tumor',
    oneLiner:'無症候性肉眼的血尿。喫煙が最大の危険因子。尿細胞診＋膀胱鏡。',
    keyFindings:[ kf('URBCh_high',S,'rule_in',true), kf('u_blood_pos',S), kf('urine_cytology_pos',D,'rule_in',true), kf('cysto_tumor',C,'rule_in',true) ],
    confirm:'cysto_tumor', confirmNote:'「痛みのない肉眼的血尿」は膀胱癌までは否定しない。尿細胞診と膀胱鏡が必須で、TURBTで組織確定と初期治療を兼ねる。',
    mechanism:'尿路上皮癌。芳香族アミン・喫煙が原因。多中心性に発生し再発しやすい。',
  },
];

export const PRESENTATIONS = [
  pres('pres_aki','腎機能低下（Cre上昇）','abnormality','腎泌尿器',
    'まず超音波で水腎症（腎後性）を否定し、腎サイズで急性か慢性かを見る。次に尿Na・FENaで腎前性か腎性かを分ける。','pw_aki'),
  pres('pres_proteinuria_hematuria','蛋白尿・血尿','abnormality','腎泌尿器',
    '尿沈渣で「糸球体から来たか」を判定する（変形赤血球・赤血球円柱）。蛋白尿の量で腎炎症候群かネフローゼかに分かれる。','pw_urinalysis'),
  pres('pres_dysuria','排尿時痛・頻尿','complaint','腎泌尿器',
    '発熱とCVA叩打痛の有無で膀胱炎と腎盂腎炎を分ける。男性では前立腺も考える。',null),
];

export const PATHWAYS = [
  {
    id:'pw_aki', title:'腎機能低下（Cre上昇）の鑑別', system:'腎泌尿器', entryId:'pres_aki',
    summary:'腎障害の鑑別は「部位」から始まる ―― 腎前性（灌流）・腎性（実質）・腎後性（閉塞）。' +
            '順番が決まっており、まず治せる腎後性を超音波で否定する。次に腎サイズで急性/慢性を分け、' +
            '最後に尿検査で「尿細管がまだNaと水を再吸収できているか」を問う。これが腎前性と腎性を分ける核心。',
    root: st('Cre上昇', {
      layer:S, test:'renal_us', ask:'水腎症はあるか？ 腎は萎縮しているか？',
      note:'最初の一手は超音波。①水腎症＝腎後性（治せる）②腎萎縮＝慢性（急性ではない）。この2つを最初に片づける。',
      branches:[
        br('us_hydronephrosis','水腎症あり → 腎後性', st('腎後性AKI（閉塞）', {
          layer:D, test:'kub_ct', ask:'閉塞の原因と部位は？',
          note:'閉塞を解除すれば速やかに戻る。逆に見逃せば不可逆になる。だから最初に否定する。',
          branches:[
            br('ct_ureteral_stone','尿管結石', dz('urolithiasis','尿路結石症','発熱を伴えば結石性腎盂腎炎として緊急ドレナージ。')),
            br('us_bladder_residual','残尿・前立腺腫大', dz('bph','前立腺肥大症','導尿・尿道カテーテルで劇的に改善する。')),
          ],
        })),
        br('us_kidney_atrophy','腎萎縮あり → 慢性', st('慢性腎臓病(CKD)', {
          layer:D, test:'PTH', ask:'腎性貧血・二次性副甲状腺機能亢進症はあるか？',
          note:'萎縮・貧血・高P・PTH上昇は「時間がかかった」証拠。急性のCre上昇と区別する材料になる。',
          branches:[
            br('PTH_high','Hb↓・P↑・PTH↑', dz('ckd','慢性腎臓病(CKD)','原疾患（糖尿病・腎炎・腎硬化症）を探す。')),
            br('us_kidney_cysts','両腎多発嚢胞・家族歴', dz('adpkd','常染色体顕性多発性嚢胞腎','頭部MRAで脳動脈瘤を検索。')),
          ],
        })),
        br('Cre_high','水腎症なし・腎サイズ正常 → 急性', st('急性腎障害(AKI)', {
          layer:D, test:'UNa', ask:'尿Na・FENa・尿浸透圧は？ 尿沈渣に円柱は？',
          note:'ここが最重要の分岐。「尿細管が生きていればNaを再吸収して尿を濃縮できる（腎前性）」' +
               '「尿細管が壊れていればNaを垂れ流し尿は濃縮できない（腎性）」。輸液で戻るかどうかも同じことを見ている。',
          branches:[
            br('UNa_low','尿Na<20・FENa<1%・尿浸透圧>500・BUN/Cre>20',
               dz('prerenal_aki','腎前性AKI','脱水・出血・心不全・肝硬変。輸液で改善する。')),
            br('UNa_high','尿Na>40・FENa>2%・褐色顆粒円柱',
               dz('atn','急性尿細管壊死(ATN)','虚血の遷延・造影剤・薬剤・横紋筋融解。輸液では戻らない。')),
            br('u_rbc_cast','血尿＋赤血球円柱＋急速な進行', st('腎性（糸球体性）AKI', {
              layer:C, test:'anca_gbm', ask:'ANCA・抗GBM抗体は？',
              note:'赤血球円柱は糸球体炎症の証拠。急速進行性なら数週で不可逆になるため緊急に生検・治療する。',
              branches:[ br('path_crescent','半月体形成', dz('rpgn','急速進行性糸球体腎炎(RPGN)','ANCA関連血管炎か抗GBM病か。ステロイド・免疫抑制・血漿交換。')) ],
            })),
          ],
        })),
      ],
    }),
  },
  {
    id:'pw_urinalysis', title:'蛋白尿・血尿の鑑別', system:'腎泌尿器', entryId:'pres_proteinuria_hematuria',
    summary:'尿所見の読み方は「どこから来たか」と「どれくらい漏れているか」の2軸。' +
            '沈渣の赤血球円柱・変形赤血球は糸球体由来を意味し、尿路（結石・腫瘍）由来を排除する。' +
            '蛋白量が3.5g/gCrを超えればネフローゼ、血尿主体なら腎炎症候群。ここから先は補体と自己抗体が病因を絞る。',
    root: st('蛋白尿・血尿', {
      layer:S, test:'urinalysis', ask:'沈渣に赤血球円柱・変形赤血球はあるか？',
      note:'円柱は尿細管の鋳型であり、「腎から来た」ことの証明。これがあるかどうかで泌尿器科と腎臓内科に道が分かれる。',
      branches:[
        br('u_rbc_cast','赤血球円柱あり → 糸球体性', st('糸球体疾患', {
          layer:D, test:'UPCR', ask:'蛋白尿は3.5g/gCr以上か？（ネフローゼ域か）',
          note:'血尿が主役なら腎炎症候群、蛋白尿が主役ならネフローゼ症候群。この2つは機序も治療も異なる。',
          branches:[
            br('UPCR_high','高度蛋白尿＋低Alb＋浮腫', st('ネフローゼ症候群', {
              layer:C, test:'renal_biopsy', ask:'組織型は？',
              note:'成人では膜性腎症・巣状分節性糸球体硬化症、小児では微小変化型が多い。悪性腫瘍・薬剤・感染の二次性を必ず除外。',
              branches:[
                br('path_mcns','光顕正常・電顕で足突起消失', dz('nephrotic_syndrome','微小変化型ネフローゼ症候群','小児に多くステロイド反応性が良い。')),
                br('path_membranous','基底膜上皮下沈着(spike)', dz('nephrotic_syndrome','膜性腎症','成人。悪性腫瘍の合併を検索する。')),
                br('UAlb_high','糖尿病歴＋網膜症＋血尿に乏しい', dz('diabetic_nephropathy','糖尿病性腎症','通常は生検せず臨床経過で診断。')),
              ],
            })),
            br('c3_low','血尿主体＋補体低下', st('低補体血症を伴う腎炎', {
              layer:D, test:'complement_test', ask:'C3のみ低下か、C3・C4ともに低下か？',
              note:'補体の消費は免疫複合体の沈着を意味する。C3単独＝溶連菌感染後、C3+C4＝ループス腎炎という読み方ができる。',
              branches:[
                br('ASO_high','C3低下・ASO↑・感染の1〜2週後', dz('psagn','溶連菌感染後急性糸球体腎炎','C3は6〜8週で正常化する。小児では予後良好。')),
                br('c4_low','C3・C4ともに低下・ANA陽性', dz('lupus_nephritis','ループス腎炎','腎生検でクラス分類し治療強度を決める。')),
              ],
            })),
            br('path_iga_mesangial','血尿主体＋補体正常＋感冒と同時の肉眼的血尿',
               dz('iga_nephropathy','IgA腎症','日本で最多の慢性糸球体腎炎。生検で確定。')),
            br('path_crescent','急速な腎機能低下を伴う', dz('rpgn','急速進行性糸球体腎炎(RPGN)','緊急。ANCA・抗GBM抗体を即日提出。')),
          ],
        })),
        br('u_blood_pos','円柱なし・変形赤血球なし → 非糸球体性（尿路）', st('尿路からの血尿', {
          layer:D, test:'kub_ct', ask:'疼痛はあるか？（結石）無痛性か？（腫瘍）',
          note:'糸球体を通っていない赤血球は形が保たれている。痛みの有無が結石と腫瘍を大きく分ける。',
          branches:[
            br('ct_ureteral_stone','疝痛＋結石', dz('urolithiasis','尿路結石症','単純CTで確定。')),
            br('urine_cytology_pos','無痛性肉眼的血尿＋細胞診陽性', dz('bladder_cancer','膀胱癌','膀胱鏡・TURBTへ。喫煙歴を確認。')),
            br('ct_renal_mass_enhance','腎腫瘤の早期濃染', dz('renal_cell_carcinoma','腎細胞癌','偶発発見が多い。')),
            br('UWBCh_high','膿尿・細菌尿・膀胱刺激症状', dz('cystitis','急性膀胱炎','発熱があれば腎盂腎炎を考える。')),
          ],
        })),
      ],
    }),
  },
];
