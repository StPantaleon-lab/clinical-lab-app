// src/data/tests.js
// ═══════════════════════════════════════════════════════════════════════
//  検査カタログ ― 血液に限らず「あらゆる医療で行う検査」を1つの器で扱う
// ═══════════════════════════════════════════════════════════════════════
//  ・数値検査は refKey で referenceRanges.js の REF を再利用（正常範囲・単位を共有）
//  ・画像/身体/病理などは valued:false とし、findings[] に所見キーワードを列挙
//  ・defaultLayer は「典型的にどの段階で行うか」の目安（パスウェイ側で上書き可）
//
//  ★ Sonnetへ: 新しい検査を足すときは modality / system / defaultLayer を必ず付ける。
//    数値検査なら refKey を referenceRanges.js のキーに合わせる（無ければREFに追加）。
//    所見系検査なら findings[] に Finding.id を並べ、findings.js 側に本体を書く。
// ═══════════════════════════════════════════════════════════════════════

import { LAYER } from '../model/schema.js';

const S = LAYER.SCREEN, D = LAYER.DIFF, C = LAYER.CONFIRM;

export const TESTS = [
  // ─────────────────────────────────────────────
  //  血液 ― 一般（スクリーニング）
  // ─────────────────────────────────────────────
  { id:'Hb',   name:'ヘモグロビン',   abbr:'Hb',  modality:'blood', system:'共通', defaultLayer:S, valued:true, refKey:'Hb' },
  { id:'MCV',  name:'平均赤血球容積', abbr:'MCV', modality:'blood', system:'血液', defaultLayer:D, valued:true, refKey:'MCV' },
  { id:'MCH',  name:'平均赤血球Hb量', abbr:'MCH', modality:'blood', system:'血液', defaultLayer:D, valued:true, refKey:'MCH' },
  { id:'Ret',  name:'網状赤血球',     abbr:'Ret', modality:'blood', system:'血液', defaultLayer:D, valued:true, refKey:'Ret' },
  { id:'WBC',  name:'白血球数',       abbr:'WBC', modality:'blood', system:'共通', defaultLayer:S, valued:true, refKey:'WBC' },
  { id:'PLT',  name:'血小板数',       abbr:'PLT', modality:'blood', system:'共通', defaultLayer:S, valued:true, refKey:'PLT' },
  { id:'CRP',  name:'CRP',            abbr:'CRP', modality:'blood', system:'共通', defaultLayer:S, valued:true, refKey:'CRP' },

  // ─────────────────────────────────────────────
  //  血液 ― 肝胆膵（生化学）
  // ─────────────────────────────────────────────
  { id:'AST',  name:'AST(GOT)',   abbr:'AST',  modality:'blood', system:'消化器', defaultLayer:S, valued:true, refKey:'AST' },
  { id:'ALT',  name:'ALT(GPT)',   abbr:'ALT',  modality:'blood', system:'消化器', defaultLayer:S, valued:true, refKey:'ALT' },
  { id:'ALP',  name:'ALP',        abbr:'ALP',  modality:'blood', system:'消化器', defaultLayer:S, valued:true, refKey:'ALP' },
  { id:'GGT',  name:'γ-GTP',      abbr:'γGT', modality:'blood', system:'消化器', defaultLayer:S, valued:true, refKey:'GGT' },
  { id:'TBil', name:'総ビリルビン', abbr:'T-Bil', modality:'blood', system:'消化器', defaultLayer:S, valued:true, refKey:'TBil' },
  { id:'DBil', name:'直接ビリルビン',abbr:'D-Bil', modality:'blood', system:'消化器', defaultLayer:D, valued:true, refKey:'DBil' },
  { id:'AMY',  name:'アミラーゼ',   abbr:'AMY', modality:'blood', system:'消化器', defaultLayer:S, valued:true, refKey:'AMY' },
  { id:'ChE',  name:'コリンエステラーゼ', abbr:'ChE', modality:'blood', system:'消化器', defaultLayer:D, valued:true, refKey:'ChE' },
  { id:'Alb',  name:'アルブミン',   abbr:'Alb', modality:'blood', system:'消化器', defaultLayer:S, valued:true, refKey:'Alb' },
  { id:'LD',   name:'LDH',         abbr:'LD',  modality:'blood', system:'共通', defaultLayer:S, valued:true, refKey:'LD' },

  // ─────────────────────────────────────────────
  //  血液 ― 腎・凝固
  // ─────────────────────────────────────────────
  { id:'Cre',  name:'クレアチニン', abbr:'Cre', modality:'blood', system:'腎泌尿器', defaultLayer:S, valued:true, refKey:'Cre' },
  { id:'BUN',  name:'尿素窒素',     abbr:'BUN', modality:'blood', system:'腎泌尿器', defaultLayer:S, valued:true, refKey:'BUN' },
  { id:'PT',   name:'プロトロンビン時間', abbr:'PT', modality:'blood', system:'消化器', defaultLayer:D, valued:true, refKey:'PT' },
  { id:'APTT', name:'APTT',        abbr:'APTT', modality:'blood', system:'血液', defaultLayer:D, valued:true, refKey:'APTT' },
  { id:'Fib',  name:'フィブリノゲン', abbr:'Fib', modality:'blood', system:'血液', defaultLayer:D, valued:true, refKey:'Fib' },
  { id:'FDP',  name:'FDP',         abbr:'FDP', modality:'blood', system:'血液', defaultLayer:D, valued:true, refKey:'FDP' },
  { id:'DD',   name:'D-ダイマー',   abbr:'D-dimer', modality:'blood', system:'血液', defaultLayer:D, valued:true, refKey:'DD' },

  // ─────────────────────────────────────────────
  //  血液 ― 腫瘍マーカー・鉄動態（鑑別〜確定寄り）
  // ─────────────────────────────────────────────
  { id:'AFP',    name:'AFP',      abbr:'AFP',    modality:'blood', system:'消化器', defaultLayer:D, valued:true, refKey:'AFP' },
  { id:'PIVKA2', name:'PIVKA-II', abbr:'PIVKA-II', modality:'blood', system:'消化器', defaultLayer:D, valued:true, refKey:'PIVKA2' },
  { id:'CA199',  name:'CA19-9',   abbr:'CA19-9', modality:'blood', system:'消化器', defaultLayer:D, valued:true, refKey:'CA199' },
  { id:'CEA',    name:'CEA',      abbr:'CEA',    modality:'blood', system:'消化器', defaultLayer:D, valued:true, refKey:'CEA' },
  // 鉄動態（数値検査 + それらを束ねる「パネル検査」）
  { id:'Fe',       name:'血清鉄',      abbr:'Fe',       modality:'blood', system:'血液', defaultLayer:D, valued:true, refKey:'Fe' },
  { id:'TIBC',     name:'総鉄結合能',  abbr:'TIBC',     modality:'blood', system:'血液', defaultLayer:D, valued:true, refKey:'TIBC' },
  { id:'Ferritin', name:'フェリチン',  abbr:'Ferritin', modality:'blood', system:'血液', defaultLayer:D, valued:true, refKey:'Ferritin' },
  { id:'Hapto',    name:'ハプトグロビン', abbr:'Hp',    modality:'blood', system:'血液', defaultLayer:D, valued:true, refKey:'Hapto' },
  { id:'IBil',     name:'間接ビリルビン', abbr:'I-Bil', modality:'blood', system:'血液', defaultLayer:D, valued:true, refKey:'IBil' },

  // パネル検査 ― 単独では意味が定まらず「セットで出して束で読む」検査
  { id:'iron_panel', name:'鉄動態（Fe/TIBC/フェリチン）', modality:'blood', system:'血液', defaultLayer:D, valued:false,
    panel:['Fe','TIBC','Ferritin'],
    overview:'血清鉄・TIBC・フェリチンの3点セット。小球性貧血の鑑別の要。フェリチン（貯蔵鉄）が最も特異的。' },
  { id:'hemolysis_panel', name:'溶血マーカー（間接Bil/ハプトグロビン/LD/Ret）', modality:'blood', system:'血液', defaultLayer:D, valued:false,
    panel:['IBil','Hapto','LD','Ret'],
    overview:'溶血の裏づけ。ハプトグロビン低下＋間接Bil上昇＋LD上昇＋網赤血球上昇の4点が揃うと強い。' },
  { id:'coombs', name:'直接クームス試験', modality:'blood', system:'血液', defaultLayer:C, valued:false,
    findings:['coombs_pos'], overview:'自己免疫性溶血性貧血(AIHA)の確定に用いる。' },

  // ─────────────────────────────────────────────
  //  感染・肝炎ウイルス（定性 → finding）
  // ─────────────────────────────────────────────
  { id:'hbv_serology', name:'B型肝炎ウイルスマーカー', modality:'blood', system:'消化器', defaultLayer:D, valued:false,
    findings:['hbsag_pos'], overview:'HBs抗原陽性で現在のHBV感染。' },
  { id:'hcv_serology', name:'C型肝炎ウイルスマーカー', modality:'blood', system:'消化器', defaultLayer:D, valued:false,
    findings:['hcvab_pos'], overview:'HCV抗体＋HCV-RNAで現在の感染を確認。' },

  // ─────────────────────────────────────────────
  //  身体所見（視診・触診・聴診・打診）
  // ─────────────────────────────────────────────
  { id:'inspection', name:'視診（黄疸・貧血様）', modality:'physical', system:'共通', defaultLayer:S, valued:false,
    findings:['jaundice_visible','conjunctival_pallor','spider_angioma','palmar_erythema'],
    overview:'眼球結膜・皮膚・手掌などの視診。黄疸/貧血/肝疾患の徴候を拾う。' },
  { id:'abdo_palpation', name:'腹部触診', modality:'physical', system:'消化器', defaultLayer:S, valued:false,
    findings:['murphy_sign','rebound','abdo_tenderness_ruq','abdo_tenderness_epigastric','abdo_tenderness_rlq','hepatomegaly','splenomegaly','mass_palpable'],
    overview:'圧痛部位・反跳痛・臓器腫大・腫瘤の触知。急性腹症の局在診断の起点。' },
  { id:'abdo_auscultation', name:'腹部聴診', modality:'physical', system:'消化器', defaultLayer:S, valued:false,
    findings:['bowel_sound_absent','bowel_sound_metallic'],
    overview:'腸雑音の減弱/消失（麻痺性）や金属音（機械的閉塞）を聴く。' },
  { id:'auscultation_heart', name:'心音聴診', modality:'physical', system:'循環器', defaultLayer:S, valued:false,
    findings:['s3_gallop','diastolic_murmur','systolic_murmur'],
    overview:'過剰心音・心雑音。心不全(III音)や弁膜症の一次スクリーニング。' },
  { id:'rectal_exam', name:'直腸診', modality:'physical', system:'消化器', defaultLayer:S, valued:false,
    findings:['melena_on_glove','rectal_mass','tarry_stool'],
    overview:'黒色便・腫瘤・出血の確認。消化管出血/直腸病変の初期評価。' },

  // ─────────────────────────────────────────────
  //  画像検査（所見はキーワードで表現、画像そのものは扱わない）
  // ─────────────────────────────────────────────
  { id:'abdo_us', name:'腹部超音波(US)', modality:'imaging', system:'消化器', defaultLayer:S, valued:false, cost:'低',
    findings:['us_gallstone','us_bile_duct_dilation','us_fatty_liver','us_liver_mass','us_ascites','us_hydronephrosis'],
    overview:'非侵襲・ベッドサイド可。胆石・胆管拡張・脂肪肝・腹水・水腎症の一次評価。' },
  { id:'abdo_xray', name:'腹部単純X線', modality:'imaging', system:'消化器', defaultLayer:S, valued:false, cost:'低',
    findings:['niveau','free_air'],
    overview:'立位で鏡面像(niveau)＝イレウス、遊離ガス(free air)＝消化管穿孔。' },
  { id:'abdo_ct', name:'腹部造影CT', modality:'imaging', system:'消化器', defaultLayer:D, valued:false, cost:'中',
    findings:['ct_pancreas_swelling','ct_liver_mass_arterial','ct_bile_duct_dilation','ct_pancreas_mass','ct_appendix_swelling','ct_bowel_wall_thick','ct_free_air'],
    overview:'膵腫大・肝腫瘤の造影パターン・胆管拡張・虫垂腫大などを高解像度で評価。' },
  { id:'mrcp', name:'MRCP', modality:'imaging', system:'消化器', defaultLayer:D, valued:false, cost:'中',
    findings:['mrcp_stone','mrcp_stricture'],
    overview:'胆管・膵管を非侵襲に描出。総胆管結石・狭窄の評価。' },
  { id:'egd', name:'上部消化管内視鏡(EGD)', modality:'imaging', system:'消化器', defaultLayer:D, valued:false, cost:'中',
    findings:['egd_ulcer','egd_gastric_tumor','egd_esophagitis','egd_varices'],
    overview:'胃十二指腸潰瘍・胃癌・逆流性食道炎・食道静脈瘤を直視下で評価＋生検。' },
  { id:'colonoscopy', name:'下部消化管内視鏡(CS)', modality:'imaging', system:'消化器', defaultLayer:D, valued:false, cost:'中',
    findings:['cs_tumor','cs_ulcer_continuous','cs_skip_lesion'],
    overview:'大腸癌・潰瘍性大腸炎(連続性)・Crohn病(skip)を評価＋生検。' },

  // ─────────────────────────────────────────────
  //  病理・生検・培養（確定寄り）
  // ─────────────────────────────────────────────
  { id:'biopsy_liver', name:'肝生検', modality:'pathology', system:'消化器', defaultLayer:C, valued:false, cost:'高',
    findings:['path_hcc','path_cirrhosis','path_nash'],
    overview:'肝細胞癌・肝硬変・NASHなどの組織確定。' },
  { id:'biopsy_gi', name:'消化管生検', modality:'pathology', system:'消化器', defaultLayer:C, valued:false, cost:'中',
    findings:['path_adenocarcinoma','path_ibd'],
    overview:'内視鏡下の狙撃生検で癌・炎症性腸疾患を組織確定。' },
  { id:'bone_marrow', name:'骨髄穿刺', modality:'pathology', system:'血液', defaultLayer:C, valued:false, cost:'中',
    findings:['bm_hypoplasia','bm_blasts','bm_megaloblast'],
    overview:'再生不良性貧血(低形成)・白血病(芽球)・巨赤芽球性貧血の確定。' },
  { id:'ubt', name:'尿素呼気試験(UBT)', modality:'function', system:'消化器', defaultLayer:D, valued:false, cost:'低',
    findings:['hp_positive'],
    overview:'H. pylori 感染の判定。消化性潰瘍の背景検索。' },
  { id:'fecal_occult', name:'便潜血', modality:'urine', system:'消化器', defaultLayer:S, valued:false, cost:'低',
    findings:['fob_positive'],
    overview:'大腸癌スクリーニングの一次検査。陽性なら下部内視鏡へ。' },
];

export const TEST_BY_ID = Object.fromEntries(TESTS.map(t => [t.id, t]));
