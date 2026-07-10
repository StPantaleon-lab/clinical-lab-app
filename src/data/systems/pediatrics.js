// src/data/systems/pediatrics.js
// ═══════════════════════════════════════════════════════════════════════
//  小児 ― 発疹を伴う感染症 / 小児外科的急性腹症 / 先天性疾患
// ═══════════════════════════════════════════════════════════════════════
//  小児では「発熱と発疹の時間的関係」と「年齢」が、成人でいう検査値に相当する
//  強力な鑑別軸になる。所見（keyword finding）としてそれらを明示的に扱う。
// ═══════════════════════════════════════════════════════════════════════

import { S, D, C, numT, obsT, panelT, num, obs, kf, st, dz, br, pres } from './_kit.js';

export const TESTS = [
  obsT('rash_exam','発疹の診察（性状・分布・出現時期）','physical','小児', S,
    ['rash_maculopapular','rash_vesicular','rash_sandpaper','rash_koplik','rash_rash_after_fever','rash_polymorphic','strawberry_tongue','conjunctival_injection','bcg_redness','desquamation'],
    '発疹の「形」と「発熱との時間関係」が診断の中心。発熱中に出るか、解熱してから出るかで疾患群が変わる。'),
  obsT('rapid_antigen','迅速抗原検査（溶連菌・インフルエンザ・RSV・アデノ）','pathology','小児', S,
    ['strep_antigen_pos','flu_antigen_pos','rsv_antigen_pos','adeno_antigen_pos'],
    '外来で数分。咽頭・鼻腔ぬぐい液から抗原を検出し、抗菌薬の要否を即決できる。'),
  obsT('peds_us','小児腹部超音波','imaging','小児', S,
    ['us_target_sign','us_pyloric_thickening','us_appendix_swelling_child'],
    '被曝がなく第一選択。腸重積のtarget sign、肥厚性幽門狭窄症の幽門筋肥厚を捉える。', { cost:'低' }),
  obsT('peds_cardiac_exam','小児の心音・チアノーゼの診察','physical','小児', S,
    ['vsd_murmur','continuous_murmur','cyanotic_spell','clubbing_child'],
    '無害性雑音と病的雑音の区別。チアノーゼの有無で「肺血流が減る心疾患」を見分ける。'),
  obsT('lumbar_puncture','腰椎穿刺（髄液検査）','pathology','共通', C,
    ['csf_neutrophil','csf_lymphocyte','csf_glucose_low','csf_protein_high','csf_culture_pos'],
    '髄膜炎の確定。細菌性は好中球優位・糖低下、ウイルス性はリンパ球優位・糖正常。頭蓋内圧亢進があれば先に画像。'),
  obsT('coronary_echo','冠動脈エコー（小児）','imaging','小児', C,
    ['coronary_aneurysm'],
    '川崎病の合併症である冠動脈瘤を追う。診断そのものより「治療の目的」を規定する検査。'),
];

export const FINDINGS = [
  obs('rash_maculopapular','rash_exam','斑丘疹','麻疹・風疹・伝染性紅斑・薬疹。分布と発熱との時間関係で分ける。',1),
  obs('rash_vesicular','rash_exam','水疱疹（各期の皮疹が混在）','水痘。新旧の皮疹（紅斑・水疱・痂皮）が同時に存在するのが特徴。',1),
  obs('rash_sandpaper','rash_exam','鮫肌様の紅斑（sandpaper rash）','猩紅熱（A群溶連菌）。口囲蒼白を伴う。',1),
  obs('rash_koplik','rash_exam','Koplik斑（頬粘膜の白色斑）','麻疹に病理学的特異度が高い。発疹出現の1〜2日前、カタル期に現れる。',1),
  obs('rash_rash_after_fever','rash_exam','解熱後に発疹が出現','突発性発疹（HHV-6）。3〜4日の高熱が下がってから体幹に発疹。',1),
  obs('rash_polymorphic','rash_exam','不定形発疹','川崎病。決まった形をとらないことが特徴。',1),
  obs('strawberry_tongue','rash_exam','いちご舌','川崎病・猩紅熱。舌乳頭が発赤・腫大する。',1),
  obs('conjunctival_injection','rash_exam','眼球結膜の充血（眼脂なし）','川崎病。滲出性でないのが結膜炎との差。',1),
  obs('bcg_redness','rash_exam','BCG接種部位の発赤','川崎病に特異度が高い（日本で診断に有用）。',1),
  obs('desquamation','rash_exam','指趾末端の膜様落屑','川崎病の回復期。診断は間に合わないが確認になる。',2),
  obs('strep_antigen_pos','rapid_antigen','溶連菌迅速抗原 陽性','A群β溶血性連鎖球菌。抗菌薬でリウマチ熱を予防する（腎炎は予防できない）。',1),
  obs('flu_antigen_pos','rapid_antigen','インフルエンザ迅速抗原 陽性','発症12〜48時間で感度が高い。早すぎる検査は偽陰性。',1),
  obs('rsv_antigen_pos','rapid_antigen','RSウイルス抗原 陽性','乳児の細気管支炎。喘鳴と多呼吸。',1),
  obs('adeno_antigen_pos','rapid_antigen','アデノウイルス抗原 陽性','咽頭結膜熱・扁桃炎。高熱が続くが抗菌薬は不要。',1),
  obs('us_target_sign','peds_us','US:target sign / pseudokidney sign','腸重積。腸管が腸管に入り込んだ多層構造。高圧浣腸で整復する。',2),
  obs('us_pyloric_thickening','peds_us','US:幽門筋の肥厚（>4mm）','肥厚性幽門狭窄症。生後2〜8週の非胆汁性噴水状嘔吐。',2),
  obs('us_appendix_swelling_child','peds_us','US:虫垂腫大（小児）','小児急性虫垂炎。CTより先にエコーを試みる（被曝回避）。',2),
  obs('vsd_murmur','peds_cardiac_exam','胸骨左縁下部の全収縮期雑音','心室中隔欠損(VSD)。小欠損ほど雑音が大きい。',1),
  obs('continuous_murmur','peds_cardiac_exam','連続性雑音（機械様）','動脈管開存症(PDA)。収縮期・拡張期を通じて左右短絡が続く。',1),
  obs('cyanotic_spell','peds_cardiac_exam','無酸素発作・蹲踞','Fallot四徴症。右左短絡が増加して起こる。蹲踞で体血管抵抗を上げ短絡を減らす。',1),
  obs('clubbing_child','peds_cardiac_exam','小児のばち指','慢性の右左短絡（チアノーゼ性心疾患）。',2),
  obs('csf_neutrophil','lumbar_puncture','髄液:好中球優位の細胞増多','細菌性髄膜炎。糖低下を伴う。緊急に抗菌薬。',2),
  obs('csf_lymphocyte','lumbar_puncture','髄液:リンパ球優位の細胞増多','ウイルス性髄膜炎・結核性・真菌性。糖は正常（結核・真菌では低下）。',2),
  obs('csf_glucose_low','lumbar_puncture','髄液:糖の低下（血糖の1/2未満）','細菌が糖を消費している＝細菌性・結核性・真菌性髄膜炎。ウイルス性では低下しない。',2),
  obs('csf_protein_high','lumbar_puncture','髄液:蛋白上昇','血液髄液関門の破綻。細胞数が増えない蛋白細胞解離ならGuillain-Barré症候群。',2),
  obs('csf_culture_pos','lumbar_puncture','髄液培養 陽性','細菌性髄膜炎の確定。年齢で起炎菌が変わる。',3),
  obs('coronary_aneurysm','coronary_echo','冠動脈瘤','川崎病の最重症合併症。急性期の免疫グロブリン大量療法はこれを防ぐために行う。',3),
];

export const GROUPS = {
  grp_exanthem:     '発疹性ウイルス感染症',
  grp_kawasaki:     '川崎病・血管炎',
  grp_peds_abdomen: '小児の急性腹症',
  grp_chd:          '先天性心疾患',
  grp_peds_resp:    '小児の呼吸器感染症',
  grp_meningitis:   '髄膜炎',
};

export const DISEASES = [
  {
    id:'measles', name:'麻疹', system:'小児', group:'grp_exanthem',
    oneLiner:'カタル症状→Koplik斑→いったん解熱後に再発熱＋発疹（二峰性）。',
    keyFindings:[ kf('BT_high',S,'rule_in',true), kf('rash_koplik',S,'rule_in',true), kf('rash_maculopapular',S), kf('conjunctival_injection',S) ],
    confirm:'rash_koplik', confirmNote:'カタル期のKoplik斑が診断的。空気感染するため直ちに隔離。IgM抗体・PCRで確定し届出。',
    mechanism:'麻疹ウイルスによる全身感染。一過性の細胞性免疫抑制で肺炎・中耳炎を合併し、まれに亜急性硬化性全脳炎(SSPE)。',
  },
  {
    id:'rubella', name:'風疹', system:'小児', group:'grp_exanthem',
    oneLiner:'発熱と同時の発疹＋耳後部リンパ節腫脹。妊娠初期感染で先天性風疹症候群。',
    keyFindings:[ kf('rash_maculopapular',S,'rule_in',true), kf('lymphadenopathy',S,'rule_in',true), kf('rash_koplik',S,'rule_out') ],
    confirm:'rash_maculopapular', confirmNote:'麻疹より軽症で、Koplik斑がなく発疹と発熱が同時。IgMで確定。妊婦への曝露が最大の問題。',
    mechanism:'風疹ウイルス。胎児期感染で白内障・心奇形（PDA）・難聴の三徴。',
  },
  {
    id:'varicella', name:'水痘', system:'小児', group:'grp_exanthem',
    oneLiner:'紅斑・水疱・痂皮が同時に混在。空気感染。',
    keyFindings:[ kf('rash_vesicular',S,'rule_in',true), kf('BT_high',S) ],
    confirm:'rash_vesicular', confirmNote:'皮疹の「新旧混在」が特徴的で臨床診断できる。すべて痂皮化するまで感染性がある。',
    mechanism:'水痘・帯状疱疹ウイルスの初感染。後根神経節に潜伏し、再活性化で帯状疱疹となる。',
  },
  {
    id:'exanthem_subitum', name:'突発性発疹', system:'小児', group:'grp_exanthem',
    oneLiner:'乳児の3〜4日の高熱。解熱してから体幹に発疹（順序が逆）。',
    keyFindings:[ kf('BT_high',S,'rule_in',true), kf('rash_rash_after_fever',S,'rule_in',true) ],
    confirm:'rash_rash_after_fever', confirmNote:'「発熱中は元気で、解熱してから発疹」という時間関係が診断の核心。熱性けいれんの原因として頻度が高い。',
    mechanism:'HHV-6/7の初感染。生後6か月〜2歳（移行抗体が消える時期）に好発。',
  },
  {
    id:'scarlet_fever', name:'猩紅熱（A群溶連菌感染症）', system:'小児', group:'grp_exanthem',
    oneLiner:'咽頭炎＋鮫肌様紅斑＋いちご舌。迅速抗原陽性。抗菌薬10日間。',
    keyFindings:[ kf('BT_high',S), kf('rash_sandpaper',S,'rule_in',true), kf('strawberry_tongue',S), kf('strep_antigen_pos',S,'rule_in',true), kf('ASO_high',D) ],
    confirm:'strep_antigen_pos', confirmNote:'迅速抗原または培養で確定。抗菌薬はリウマチ熱を予防するが、急性糸球体腎炎は予防できない点が問われる。',
    mechanism:'A群β溶血性連鎖球菌の発赤毒素。菌体成分と心筋・腎糸球体の交差反応が続発症を起こす。',
  },
  {
    id:'kawasaki', name:'川崎病', system:'小児', group:'grp_kawasaki',
    oneLiner:'5日以上の発熱＋主要6症状。冠動脈瘤を防ぐために免疫グロブリンを急ぐ。',
    keyFindings:[ kf('BT_high',S,'rule_in',true), kf('conjunctival_injection',S,'rule_in',true), kf('strawberry_tongue',S), kf('rash_polymorphic',S), kf('lymphadenopathy',S), kf('bcg_redness',S), kf('desquamation',D), kf('CRP_high',S), kf('PLT_low',S,'rule_out'), kf('coronary_aneurysm',C) ],
    confirm:'coronary_echo', confirmNote:'6主要症状のうち5つ以上（または5つ未満でも冠動脈病変があれば）で診断する臨床診断。抗菌薬が無効な5日以上の発熱で必ず想起する。血小板は急性期には減らず、回復期に著増する。',
    mechanism:'中型動脈の全身性血管炎。冠動脈瘤が予後を決めるため、発症10日以内の免疫グロブリン大量療法＋アスピリンで炎症を鎮める。',
    typical:{ BT:39.5, CRP:12.0, PLT:600, WBC:18.0 },
  },
  {
    id:'intussusception', name:'腸重積症', system:'小児', group:'grp_peds_abdomen',
    oneLiner:'間欠的啼泣＋嘔吐＋イチゴゼリー状粘血便。エコーでtarget sign。',
    keyFindings:[ kf('us_target_sign',S,'rule_in',true), kf('mass_palpable',S), kf('tarry_stool',S) ],
    confirm:'us_target_sign', confirmNote:'乳幼児の間欠的な不機嫌（腹痛）は本症を疑う最重要サイン。エコーで確定し、腹膜炎がなければ高圧浣腸で整復する。',
    mechanism:'回腸末端が結腸に嵌入。腸間膜が引き込まれ静脈還流が障害され、粘膜が壊死して粘血便になる。',
  },
  {
    id:'pyloric_stenosis', name:'肥厚性幽門狭窄症', system:'小児', group:'grp_peds_abdomen',
    oneLiner:'生後2〜8週の噴水状嘔吐（非胆汁性）。低Cl性代謝性アルカローシス。',
    keyFindings:[ kf('us_pyloric_thickening',S,'rule_in',true), kf('HCO3_high',S,'rule_in',true), kf('K_low',D), kf('Cl_low',D) ],
    confirm:'us_pyloric_thickening', confirmNote:'胆汁を含まない嘔吐＝閉塞はVater乳頭より口側。エコーで幽門筋厚。手術前に電解質・アルカローシスの補正が必須。',
    mechanism:'幽門筋の肥厚で胃内容が通過できない。胃液（HClとK）を吐き続けるため低Cl・低K性代謝性アルカローシスになる。',
    typical:{ HCO3:34, Cl:88, K:3.0 },
  },
  {
    id:'bronchiolitis', name:'細気管支炎（RSウイルス）', system:'小児', group:'grp_peds_resp',
    oneLiner:'2歳未満の喘鳴・多呼吸・陥没呼吸。RSV抗原陽性。',
    keyFindings:[ kf('wheeze',S,'rule_in',true), kf('rsv_antigen_pos',S,'rule_in',true), kf('SpO2_low',S), kf('RR_high',S) ],
    confirm:'rsv_antigen_pos', confirmNote:'臨床診断が基本で、抗原検査は疫学・隔離のため。抗菌薬は無効。哺乳量と呼吸努力で入院を判断する。',
    mechanism:'細気管支上皮の壊死と粘液栓による末梢気道閉塞。乳児は気道が細く容易に閉塞する。',
  },
  {
    id:'croup','name':'クループ症候群', system:'小児', group:'grp_peds_resp',
    oneLiner:'犬吠様咳嗽＋吸気性喘鳴＋嗄声。夜間に増悪。',
    keyFindings:[ kf('wheeze',S), kf('SpO2_low',S), kf('BT_high',S) ],
    confirm:'lung_auscultation', confirmNote:'声門下の狭窄なので「吸気性」喘鳴になる（喘息の呼気性と対照的）。急性喉頭蓋炎（流涎・起坐位・重篤感）を必ず除外する。',
    mechanism:'パラインフルエンザウイルスによる声門下浮腫。アドレナリン吸入とステロイドで浮腫を減らす。',
  },
  {
    id:'bacterial_meningitis', name:'細菌性髄膜炎', system:'小児', group:'grp_meningitis',
    oneLiner:'発熱＋項部硬直＋意識障害。髄液は好中球優位・糖低下。',
    keyFindings:[ kf('BT_high',S,'rule_in',true), kf('csf_neutrophil',D,'rule_in',true), kf('csf_glucose_low',D,'rule_in',true), kf('csf_protein_high',D), kf('csf_culture_pos',C), kf('CRP_high',S) ],
    confirm:'lumbar_puncture', confirmNote:'髄液の細胞分画と糖が最も速く答えを出す。抗菌薬は培養結果を待たず、疑った時点で速やかに開始する（血培は先に取る）。',
    mechanism:'細菌が髄腔で増殖し好中球が集まる。細菌と白血球が糖を消費するため髄液糖が下がる（ウイルス性では下がらない）。',
    typical:{ BT:39.8, CRP:20.0, WBC:22.0 },
  },
  {
    id:'viral_meningitis', name:'ウイルス性髄膜炎（無菌性髄膜炎）', system:'小児', group:'grp_meningitis',
    oneLiner:'発熱＋頭痛。髄液はリンパ球優位で糖は正常。予後良好。',
    keyFindings:[ kf('csf_lymphocyte',D,'rule_in',true), kf('csf_glucose_low',D,'rule_out'), kf('BT_high',S) ],
    confirm:'lumbar_puncture', confirmNote:'リンパ球優位＋糖正常。糖が低いリンパ球優位なら結核性・真菌性を考える（この一手が予後を分ける）。',
    mechanism:'エンテロウイルス・ムンプスなど。細胞性免疫が主体でリンパ球が集まり、糖は消費されない。',
  },
  {
    id:'vsd', name:'心室中隔欠損(VSD)', system:'小児', group:'grp_chd',
    oneLiner:'非チアノーゼ性の左→右短絡。胸骨左縁下部の全収縮期雑音。',
    keyFindings:[ kf('vsd_murmur',S,'rule_in',true), kf('cyanotic_spell',S,'rule_out'), kf('cxr_cardiomegaly',D) ],
    confirm:'echo', confirmNote:'先天性心疾患で最多。小欠損は自然閉鎖しうる。放置して肺高血圧が進むと短絡が逆転する（Eisenmenger化）。',
    mechanism:'左室圧＞右室圧のため左→右短絡。肺血流が増え、肺うっ血と心不全を来す（チアノーゼは出ない）。',
  },
  {
    id:'tof', name:'Fallot四徴症(TOF)', system:'小児', group:'grp_chd',
    oneLiner:'チアノーゼ性心疾患の代表。無酸素発作と蹲踞。肺血流は減る。',
    keyFindings:[ kf('cyanotic_spell',S,'rule_in',true), kf('cyanosis',S,'rule_in',true), kf('clubbing_child',D), kf('systolic_murmur',S) ],
    confirm:'echo', confirmNote:'四徴＝肺動脈狭窄・VSD・大動脈騎乗・右室肥大。雑音は肺動脈狭窄によるもので、VSDの雑音ではない点に注意。',
    mechanism:'肺動脈狭窄で右室圧が上がり、VSDを通じて右→左短絡が生じチアノーゼになる。蹲踞は体血管抵抗を上げて右左短絡を減らす合目的的な行動。',
  },
];

export const PRESENTATIONS = [
  pres('pres_fever_rash','小児の発熱と発疹','complaint','小児',
    '発疹の性状（斑丘疹・水疱・鮫肌）と「発熱との時間関係」を確認する。5日以上続く発熱なら川崎病を必ず考える。','pw_fever_rash'),
  pres('pres_infant_vomiting','乳児の嘔吐','complaint','小児',
    '嘔吐物に胆汁を含むかで閉塞部位が分かれる。腹部エコーが第一選択（被曝を避ける）。','pw_infant_vomiting'),
];

export const PATHWAYS = [
  {
    id:'pw_fever_rash', title:'小児の発熱＋発疹の鑑別', system:'小児', entryId:'pres_fever_rash',
    summary:'小児では「発疹の形」と「発熱との時間関係」が、成人でいう検査値の役割を果たす。' +
            '発熱中に出るのか解熱後に出るのか、水疱か斑丘疹か鮫肌か。' +
            'そして何より、抗菌薬が効かない5日以上の発熱を見たら川崎病を想起する ―― 冠動脈瘤の予防に時間制限があるからである。',
    root: st('小児の発熱＋発疹', {
      layer:S, test:'rash_exam', ask:'発疹の性状は？ 発熱と発疹の時間関係は？',
      note:'まず皮疹を「見る」。ここでの観察が、以降の検査の必要性そのものを決める。',
      branches:[
        br('rash_rash_after_fever','解熱してから発疹（乳児）', dz('exanthem_subitum','突発性発疹','熱性けいれんの好発。予後良好。')),
        br('rash_vesicular','水疱（新旧混在）', dz('varicella','水痘','空気感染。全て痂皮化するまで隔離。')),
        br('rash_koplik','カタル症状＋Koplik斑→二峰性発熱', dz('measles','麻疹','空気感染。直ちに隔離し届出。')),
        br('rash_sandpaper','咽頭炎＋鮫肌様紅斑＋いちご舌', st('溶連菌感染症の確認', {
          layer:S, test:'rapid_antigen', ask:'溶連菌迅速抗原は？',
          note:'抗菌薬はリウマチ熱を予防するが、急性糸球体腎炎は予防できない。',
          branches:[ br('strep_antigen_pos','迅速抗原陽性', dz('scarlet_fever','猩紅熱（A群溶連菌感染症）','抗菌薬10日間。2〜3週後の血尿に注意。')) ],
        })),
        br('rash_polymorphic','5日以上の発熱＋不定形発疹＋結膜充血', st('川崎病を疑う', {
          layer:D, test:'coronary_echo', ask:'主要6症状はいくつ揃うか？ 冠動脈病変は？',
          note:'これは「診断のための検査」ではなく「治療を急ぐための検査」。発症10日以内のIVIGが冠動脈瘤を減らす。',
          branches:[ br('coronary_aneurysm','冠動脈瘤あり／主要症状5つ以上', dz('kawasaki','川崎病','IVIG＋アスピリン。回復期の血小板著増と膜様落屑。')) ],
        })),
        br('lymphadenopathy','発疹と発熱が同時＋耳後部リンパ節腫脹', dz('rubella','風疹','妊婦への曝露が最大の問題。')),
      ],
    }),
  },
  {
    id:'pw_infant_vomiting', title:'乳児の嘔吐の鑑別', system:'小児', entryId:'pres_infant_vomiting',
    summary:'嘔吐物に胆汁が混じるかどうかが、閉塞部位をVater乳頭で二分する。' +
            '非胆汁性なら幽門より口側（肥厚性幽門狭窄症）、胆汁性なら十二指腸より肛門側（腸回転異常・中腸軸捻転＝緊急）。' +
            '間欠的啼泣と粘血便があれば腸重積。いずれもまず腹部エコーで、CTは避ける。',
    root: st('乳児の嘔吐', {
      layer:S, test:'peds_us', ask:'嘔吐物に胆汁は含まれるか？ 年齢は？ 間欠的に不機嫌か？',
      note:'胆汁の有無は「閉塞がVater乳頭より上か下か」という解剖学的な情報そのもの。問診が画像より先に鑑別を絞る。',
      branches:[
        br('us_pyloric_thickening','非胆汁性・噴水状・生後2〜8週', st('幽門より口側の閉塞', {
          layer:D, test:'abg', ask:'電解質・酸塩基平衡は？',
          note:'胃液（HClとK）を失い続けた結果が低Cl・低K性代謝性アルカローシス。手術前に必ず補正する。',
          branches:[ br('HCO3_high','低Cl性代謝性アルカローシス', dz('pyloric_stenosis','肥厚性幽門狭窄症','エコーで幽門筋肥厚を確認。補正後に手術。')) ],
        })),
        br('us_target_sign','間欠的啼泣＋粘血便＋腹部腫瘤', dz('intussusception','腸重積症','エコーでtarget sign。腹膜炎がなければ高圧浣腸。')),
        br('bowel_sound_metallic','胆汁性嘔吐（緑色）', st('十二指腸より肛門側の閉塞', {
          layer:D, test:'abdo_xray', ask:'イレウス所見は？ 中腸軸捻転を否定できるか？',
          note:'胆汁性嘔吐の乳児は中腸軸捻転を否定するまで緊急。腸管壊死まで時間がない。',
          branches:[ br('niveau','鏡面像・腸管拡張', dz('ileus','腸閉塞（イレウス）','小児では中腸軸捻転・ヒルシュスプルング病を考える。')) ],
        })),
      ],
    }),
  },
];
