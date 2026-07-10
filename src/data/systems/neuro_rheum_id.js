// src/data/systems/neuro_rheum_id.js
// ═══════════════════════════════════════════════════════════════════════
//  神経・膠原病・感染症（他科）
// ═══════════════════════════════════════════════════════════════════════

import { S, D, C, numT, obsT, panelT, num, obs, kf, st, dz, br, pres } from './_kit.js';

export const TESTS = [
  obsT('neuro_exam','神経学的診察','physical','神経', S,
    ['hemiparesis','aphasia','neck_stiffness','thunderclap_headache','resting_tremor','rigidity','bradykinesia','ptosis_fatigable','areflexia','ascending_weakness','babinski'],
    '局在診断の本体。「どの神経路が、どの高さで壊れたか」を、画像を撮る前に決める。'),
  obsT('head_ct','頭部単純CT','imaging','神経', S,
    ['ct_high_density_brain','ct_sah','ct_early_ischemic'],
    '出血は即座に高吸収として写る。「まず出血を否定する」ための検査であり、超急性期の梗塞は写らない。', { cost:'低' }),
  obsT('head_mri','頭部MRI（拡散強調画像 DWI）','imaging','神経', D,
    ['dwi_high','mra_stenosis','mri_demyelination'],
    '発症数分後の細胞性浮腫をDWIが高信号として捉える。超急性期脳梗塞の診断はMRIが必須。', { cost:'中' }),
  obsT('emg_ncs','筋電図・神経伝導検査','physiology','神経', C,
    ['ncs_conduction_block','emg_myopathic','waning_phenomenon'],
    '末梢神経か筋か、脱髄か軸索か、神経筋接合部か。反復刺激でのwaningは重症筋無力症。'),
  obsT('autoab_rheum','膠原病の自己抗体','blood','膠原病', D,
    ['rf_pos','anti_ccp_pos','anti_dsdna_pos','anti_sm_pos','anti_ssa_pos','anti_scl70_pos','anti_achr_pos'],
    '抗核抗体は入口にすぎない。個々の疾患特異抗体（抗ds-DNA/Sm＝SLE、抗CCP＝RA、抗Scl-70＝強皮症）で病名が決まる。'),
  obsT('joint_xray','関節X線・関節エコー','imaging','膠原病', D,
    ['xray_joint_erosion','xray_joint_narrowing','xray_punched_out_gout'],
    '骨びらんと関節裂隙狭小化＝関節リウマチ。辺縁明瞭な打ち抜き像＝痛風結節。'),
  obsT('joint_aspiration','関節液穿刺・偏光顕微鏡','pathology','膠原病', C,
    ['crystal_urate','crystal_cppd','joint_fluid_bacteria'],
    '針状で負の複屈折＝尿酸塩（痛風）。棒状で正の複屈折＝ピロリン酸Ca（偽痛風）。細菌がいれば化膿性関節炎（緊急）。'),
  obsT('sepsis_bundle','敗血症の初期評価（qSOFA・乳酸・血培）','physiology','共通', S,
    ['qsofa_positive'],
    '意識変容・呼吸数≥22・収縮期血圧≤100 の2項目以上でqSOFA陽性。感染＋臓器障害＝敗血症。'),
];

export const FINDINGS = [
  obs('hemiparesis','neuro_exam','片麻痺','錐体路の障害。顔面を含めば中枢性、上下肢の分布で責任血管が推定できる。',1),
  obs('aphasia','neuro_exam','失語','優位半球（多くは左）の言語野。中大脳動脈領域の梗塞を示唆。',1),
  obs('babinski','neuro_exam','Babinski徴候陽性','上位運動ニューロン障害（錐体路徴候）。末梢神経障害では出ない。',1),
  obs('neck_stiffness','neuro_exam','項部硬直・Kernig徴候','髄膜刺激徴候。髄膜炎・くも膜下出血。',1),
  obs('thunderclap_headache','neuro_exam','突然発症の激烈な頭痛','「人生最悪の頭痛」。くも膜下出血を否定するまで帰さない。',1),
  obs('resting_tremor','neuro_exam','安静時振戦（丸薬丸め様）','Parkinson病。動作時に軽減するのが本態性振戦との差。',1),
  obs('rigidity','neuro_exam','筋強剛（歯車様）','Parkinson病。錐体外路徴候。',1),
  obs('bradykinesia','neuro_exam','無動・寡動','Parkinson病の必須所見。仮面様顔貌・小刻み歩行。',1),
  obs('ptosis_fatigable','neuro_exam','易疲労性の眼瞼下垂・複視','反復で悪化し休息で回復する＝神経筋接合部の障害（重症筋無力症）。日内変動が特徴。',1),
  obs('areflexia','neuro_exam','腱反射消失','末梢神経（下位運動ニューロン）の障害。Guillain-Barré症候群。',1),
  obs('ascending_weakness','neuro_exam','下肢から上行する筋力低下','Guillain-Barré症候群。先行感染（カンピロバクター等）の1〜3週後。',1),
  obs('ct_high_density_brain','head_ct','CT:脳実質内の高吸収域','脳出血。発症直後から写る（梗塞は写らない）。',1),
  obs('ct_sah','head_ct','CT:脳底槽のヒトデ型高吸収','くも膜下出血。陰性でも疑いが強ければ腰椎穿刺（キサントクロミー）。',1),
  obs('ct_early_ischemic','head_ct','CT:early CT sign（皮髄境界不明瞭化）','広範な脳梗塞の早期サイン。血栓溶解の適応判断に使う。',2),
  obs('dwi_high','head_mri','MRI:拡散強調画像(DWI)で高信号','細胞性浮腫＝発症数分後から捉えられる急性期脳梗塞。',2),
  obs('mra_stenosis','head_mri','MRA:主幹動脈の狭窄・閉塞','責任血管の同定。血栓回収療法の適応判断。',2),
  obs('mri_demyelination','head_mri','MRI:脳室周囲の多発白質病変','多発性硬化症。時間的・空間的多発性が診断の要件。',2),
  obs('ncs_conduction_block','emg_ncs','神経伝導検査:伝導ブロック・伝導速度低下','脱髄性ニューロパチー（Guillain-Barré症候群・CIDP）。',3),
  obs('emg_myopathic','emg_ncs','筋電図:筋原性変化','筋炎・筋ジストロフィー。神経原性（線維自発電位）と区別する。',3),
  obs('waning_phenomenon','emg_ncs','反復刺激試験でwaning（漸減現象）','神経筋接合部での伝達が疲弊する＝重症筋無力症。',3),
  obs('rf_pos','autoab_rheum','リウマトイド因子(RF)陽性','関節リウマチで陽性だが特異度は低い（高齢者・肝疾患・Sjögren症候群でも陽性）。',2),
  obs('anti_ccp_pos','autoab_rheum','抗CCP抗体陽性','関節リウマチに高い特異度。発症前から陽性となり、骨破壊の進行を予測する。',2),
  obs('anti_dsdna_pos','autoab_rheum','抗ds-DNA抗体陽性','SLEに特異的。活動性（特にループス腎炎）と相関し、補体低下を伴う。',3),
  obs('anti_sm_pos','autoab_rheum','抗Sm抗体陽性','SLEに最も特異的（感度は低い）。',3),
  obs('anti_ssa_pos','autoab_rheum','抗SS-A抗体陽性','Sjögren症候群。新生児ループス・先天性心ブロックの原因になる。',2),
  obs('anti_scl70_pos','autoab_rheum','抗Scl-70抗体陽性','びまん皮膚硬化型全身性強皮症。間質性肺炎を合併しやすい。',3),
  obs('anti_achr_pos','autoab_rheum','抗アセチルコリン受容体抗体陽性','重症筋無力症を確定する。胸腺腫の合併を胸部CTで探す。',3),
  obs('xray_joint_erosion','joint_xray','X線:骨びらん','滑膜炎による軟骨・骨の破壊。関節リウマチ。不可逆的。',2),
  obs('xray_joint_narrowing','joint_xray','X線:関節裂隙の狭小化','軟骨の消失。RAでは対称性・多関節、変形性関節症では荷重関節。',2),
  obs('xray_punched_out_gout','joint_xray','X線:辺縁の打ち抜き像（overhanging edge）','慢性痛風の骨破壊。',2),
  obs('crystal_urate','joint_aspiration','関節液:針状結晶・負の複屈折','尿酸ナトリウム結晶＝痛風の確定診断。',3),
  obs('crystal_cppd','joint_aspiration','関節液:棒状結晶・正の複屈折','ピロリン酸Ca＝偽痛風。膝に多い。',3),
  obs('joint_fluid_bacteria','joint_aspiration','関節液:細菌・好中球著増','化膿性関節炎。関節破壊が数日で進むため緊急ドレナージ。',3),
  obs('qsofa_positive','sepsis_bundle','qSOFA陽性（2項目以上）','感染症＋臓器障害＝敗血症。1時間以内に血培・抗菌薬・輸液。',1),
];

export const GROUPS = {
  grp_stroke:      '脳卒中',
  grp_neuromuscular:'神経筋接合部・末梢神経疾患',
  grp_neurodegen:  '神経変性疾患',
  grp_ra:          '関節リウマチ・関節炎',
  grp_ctd:         '全身性自己免疫疾患',
  grp_crystal:     '結晶誘発性関節炎',
  grp_sepsis:      '敗血症',
};

export const DISEASES = [
  {
    id:'cerebral_infarction', name:'脳梗塞', system:'神経', group:'grp_stroke',
    oneLiner:'突然発症の局所神経症状。CTは正常でもDWIで高信号。時間が脳。',
    keyFindings:[ kf('hemiparesis',S,'rule_in',true), kf('aphasia',S), kf('babinski',S), kf('ct_high_density_brain',S,'rule_out'), kf('dwi_high',D,'rule_in',true), kf('ecg_af',D) ],
    confirm:'dwi_high', confirmNote:'頭部CTはまず「出血を否定する」ために撮る（超急性期の梗塞は写らない）。DWIで確定し、発症時刻から血栓溶解・回収の適応を決める。心房細動があれば心原性塞栓。',
    mechanism:'アテローム血栓性・心原性塞栓性・ラクナ。虚血中心部の周囲のペナンブラを救うために再灌流を急ぐ。',
  },
  {
    id:'intracerebral_hemorrhage', name:'脳出血', system:'神経', group:'grp_stroke',
    oneLiner:'高血圧性が多い。CTで即座に高吸収域。被殻・視床に好発。',
    keyFindings:[ kf('hemiparesis',S), kf('SBP_high',S,'rule_in',true), kf('ct_high_density_brain',S,'rule_in',true) ],
    confirm:'ct_high_density_brain', confirmNote:'CTで即座に診断できる。梗塞と出血の区別が最初の分岐で、抗血栓薬を使うかどうかが正反対になる。',
    mechanism:'高血圧による穿通枝（レンズ核線条体動脈）の微小動脈瘤破綻。',
  },
  {
    id:'sah', name:'くも膜下出血(SAH)', system:'神経', group:'grp_stroke',
    oneLiner:'突然の人生最悪の頭痛＋項部硬直。CTでヒトデ型高吸収。',
    keyFindings:[ kf('thunderclap_headache',S,'rule_in',true), kf('neck_stiffness',S), kf('ct_sah',S,'rule_in',true) ],
    confirm:'ct_sah', confirmNote:'CT陰性でも臨床的に強く疑えば腰椎穿刺（キサントクロミー）。再破裂が予後を決めるため、診断後は直ちに血圧管理と根治術。',
    mechanism:'脳動脈瘤の破裂。血液がくも膜下腔に広がり髄膜刺激徴候を起こす。数日後に脳血管攣縮。',
  },
  {
    id:'myasthenia_gravis', name:'重症筋無力症', system:'神経', group:'grp_neuromuscular',
    oneLiner:'日内変動する眼瞼下垂・複視。反復で悪化。抗AChR抗体陽性。',
    keyFindings:[ kf('ptosis_fatigable',S,'rule_in',true), kf('waning_phenomenon',C,'rule_in',true), kf('anti_achr_pos',C,'rule_in',true), kf('cxr_mass',D) ],
    confirm:'anti_achr_pos', confirmNote:'「使うと弱くなり、休むと回復する」という日内変動が本質。抗AChR抗体と反復刺激試験のwaningで確定し、胸部CTで胸腺腫を探す。',
    mechanism:'アセチルコリン受容体への自己抗体が神経筋伝達を阻害。反復刺激で伝達物質が枯渇し漸減する（waning）。',
  },
  {
    id:'guillain_barre', name:'Guillain-Barré症候群', system:'神経', group:'grp_neuromuscular',
    oneLiner:'先行感染の1〜3週後、下肢から上行する弛緩性麻痺＋腱反射消失。',
    keyFindings:[ kf('ascending_weakness',S,'rule_in',true), kf('areflexia',S,'rule_in',true), kf('csf_protein_high',D,'rule_in',true), kf('ncs_conduction_block',C), kf('babinski',S,'rule_out') ],
    confirm:'csf_protein_high', confirmNote:'髄液の「蛋白細胞解離」（蛋白は上がるが細胞数は増えない）が特徴。呼吸筋麻痺の進行を必ず監視する。',
    mechanism:'先行感染（カンピロバクター等）の菌体糖鎖と末梢神経ガングリオシドの分子相同性による自己免疫性脱髄。',
  },
  {
    id:'parkinson', name:'Parkinson病', system:'神経', group:'grp_neurodegen',
    oneLiner:'安静時振戦・筋強剛・無動・姿勢反射障害。左右差をもって始まる。',
    keyFindings:[ kf('resting_tremor',S,'rule_in',true), kf('rigidity',S,'rule_in',true), kf('bradykinesia',S,'rule_in',true) ],
    confirm:'neuro_exam', confirmNote:'臨床診断。無動は必須で、これに振戦か筋強剛が加わる。L-ドパへの反応性が診断を支持する。',
    mechanism:'黒質緻密部のドパミン神経細胞脱落（Lewy小体）。線条体のドパミンが減り、運動抑制系が優位になる。',
  },
  {
    id:'multiple_sclerosis', name:'多発性硬化症(MS)', system:'神経', group:'grp_neurodegen',
    oneLiner:'時間的・空間的多発。視神経炎・脊髄炎を繰り返す。若年女性。',
    keyFindings:[ kf('mri_demyelination',D,'rule_in',true), kf('csf_protein_high',D) ],
    confirm:'mri_demyelination', confirmNote:'「時間的多発（再発）」と「空間的多発（複数部位）」の証明が診断要件。髄液オリゴクローナルバンドが補助的。',
    mechanism:'中枢神経の自己免疫性脱髄。温めると症状が悪化する（Uhthoff現象）。',
  },
  {
    id:'rheumatoid_arthritis', name:'関節リウマチ(RA)', system:'膠原病', group:'grp_ra',
    oneLiner:'朝のこわばり1時間以上。対称性の小関節（MCP/PIP）滑膜炎。抗CCP抗体。',
    keyFindings:[ kf('CRP_high',S), kf('ESR_high',S), kf('rf_pos',D), kf('anti_ccp_pos',D,'rule_in',true), kf('xray_joint_erosion',D,'rule_in',true), kf('xray_joint_narrowing',D) ],
    confirm:'anti_ccp_pos', confirmNote:'対称性多発関節炎＋抗CCP抗体（RFより特異的）＋骨びらん。DIP関節は侵さない（変形性関節症・乾癬性関節炎との差）。',
    mechanism:'滑膜の増殖（パンヌス）が軟骨・骨を破壊する。破壊は不可逆なので、早期に生物学的製剤等で炎症を止める。',
    typical:{ CRP:3.8, ESR:62 },
  },
  {
    id:'sle', name:'全身性エリテマトーデス(SLE)', system:'膠原病', group:'grp_ctd',
    oneLiner:'若年女性の多臓器障害。蝶形紅斑・腎炎・血球減少。低補体＋抗ds-DNA。',
    keyFindings:[ kf('ana_pos',S,'rule_in',true), kf('anti_dsdna_pos',D,'rule_in',true), kf('anti_sm_pos',D), kf('c3_low',D,'rule_in',true), kf('c4_low',D), kf('PLT_low',S), kf('WBC_low',S), kf('UPro_high',S), kf('coombs_pos',D) ],
    confirm:'anti_dsdna_pos', confirmNote:'ANAは入口（感度は高いが特異度は低い）。抗ds-DNA・抗Sm抗体が特異的で、抗ds-DNAと低補体は活動性の指標になる。腎炎の有無が予後を決める。',
    mechanism:'免疫複合体の全身沈着と補体消費。血球にも自己抗体が向き、汎血球減少とAIHAを起こす。',
    typical:{ C3:35, C4:6, PLT:90, WBC:2.8, UPro:150 },
  },
  {
    id:'systemic_sclerosis', name:'全身性強皮症', system:'膠原病', group:'grp_ctd',
    oneLiner:'Raynaud現象＋皮膚硬化。抗Scl-70抗体（間質性肺炎）／抗セントロメア抗体（肺高血圧）。',
    keyFindings:[ kf('anti_scl70_pos',D,'rule_in',true), kf('ct_honeycomb',D), kf('spiro_restrictive',D) ],
    confirm:'anti_scl70_pos', confirmNote:'皮膚硬化の範囲で「びまん型」「限局型」に分け、自己抗体が合併症を予測する。強皮症腎クリーゼではACE阻害薬。',
    mechanism:'血管内皮傷害と線維芽細胞の活性化によるコラーゲン過剰産生。皮膚・肺・消化管が硬くなる。',
  },
  {
    id:'sjogren', name:'Sjögren症候群', system:'膠原病', group:'grp_ctd',
    oneLiner:'乾燥症状（ドライアイ・ドライマウス）＋抗SS-A抗体。',
    keyFindings:[ kf('anti_ssa_pos',D,'rule_in',true), kf('rf_pos',D), kf('igg_high',D,'support') ],
    confirm:'anti_ssa_pos', confirmNote:'乾燥症状＋自己抗体＋涙腺/唾液腺の機能検査・生検。悪性リンパ腫の合併リスクが高い。',
    mechanism:'外分泌腺へのリンパ球浸潤による腺の破壊。',
  },
  {
    id:'gout', name:'痛風', system:'膠原病', group:'grp_crystal',
    oneLiner:'第1中足趾節関節の激烈な単関節炎。関節液に針状の尿酸塩結晶。',
    keyFindings:[ kf('UA_high',S,'rule_in',true), kf('CRP_high',S), kf('crystal_urate',C,'rule_in',true), kf('xray_punched_out_gout',D) ],
    confirm:'crystal_urate', confirmNote:'発作時は尿酸値がむしろ正常のこともある（尿酸値では診断できない）。関節液の偏光顕微鏡で負の複屈折を示す針状結晶を見るのが確定。',
    mechanism:'尿酸塩結晶が滑膜で好中球に貪食され、NLRP3インフラマソームを介したIL-1β産生で急性炎症を起こす。',
    typical:{ UA:9.2, CRP:6.5 },
  },
  {
    id:'sepsis', name:'敗血症', system:'感染症', group:'grp_sepsis',
    oneLiner:'感染＋臓器障害。qSOFA陽性、乳酸上昇。1時間バンドル。',
    keyFindings:[ kf('qsofa_positive',S,'rule_in',true), kf('Lac_high',S,'rule_in',true), kf('blood_culture_pos',D), kf('PCT_high',D), kf('SBP_low',S), kf('PLT_low',D), kf('Cre_high',D) ],
    confirm:'blood_culture', confirmNote:'「感染＋臓器障害」が定義であり、菌血症の証明は必須ではない。血培2セットを先に採り、1時間以内に広域抗菌薬と輸液を開始する。乳酸は組織低灌流の指標。',
    mechanism:'制御不能な宿主反応で血管透過性亢進・血管拡張・微小循環障害。DICを合併し多臓器不全へ。',
    typical:{ Lac:42, SBP:82, PCT:12.0, PLT:88, Cre:2.1 },
  },
];

export const PRESENTATIONS = [
  pres('pres_focal_deficit','突然の神経症状（麻痺・言語障害）','complaint','神経',
    'まず頭部CTで出血か梗塞かを分ける。梗塞ならDWIで確定し、発症時刻から再灌流療法の適応を決める。','pw_stroke'),
  pres('pres_joint_pain','関節痛','complaint','膠原病',
    '単関節か多関節か、対称性か、朝のこわばりの長さ。急性単関節炎は化膿性関節炎を除外するまで穿刺する。','pw_joint_pain'),
  pres('pres_fever_unknown','発熱（感染源不明）','complaint','感染症',
    'qSOFAで敗血症を判定し、血培2セット・乳酸を取る。感染巣（肺・尿路・腹腔・血管内）を系統的に探す。',null),
];

export const PATHWAYS = [
  {
    id:'pw_stroke', title:'突然の神経症状（脳卒中）の鑑別', system:'神経', entryId:'pres_focal_deficit',
    summary:'脳卒中の鑑別は2段構え。第一に「出血か梗塞か」―― ここで治療が正反対（抗血栓薬か、血圧管理と手術か）になるため、' +
            'まずCTを撮る。CTは出血を写すために撮るのであって、梗塞を写すためではない。' +
            '第二に、梗塞ならDWIで確定し、発症時刻を確認して再灌流療法の窓に入るかを判断する。',
    root: st('突然発症の局所神経症状', {
      layer:S, test:'head_ct', ask:'CTに高吸収域（出血）はあるか？',
      note:'ここが最初で最大の分岐。超急性期の梗塞はCTでは写らないので、「CTが正常＝異常なし」ではない。',
      branches:[
        br('ct_sah','脳底槽のヒトデ型高吸収＋突然の激烈な頭痛', dz('sah','くも膜下出血','再破裂を防ぐ。CT陰性でも疑えば腰椎穿刺。')),
        br('ct_high_density_brain','脳実質内の高吸収域', dz('intracerebral_hemorrhage','脳出血','血圧管理。抗血栓薬は禁忌。')),
        br('dwi_high','CTでは出血なし → MRIへ', st('脳梗塞', {
          layer:D, test:'head_mri', ask:'DWIで高信号は？ 責任血管は？ 発症時刻は？',
          note:'DWIは発症数分後から陽性。ここで責任血管と発症時刻が揃えば、血栓溶解・血栓回収の適応が決まる。',
          branches:[
            br('ecg_af','心房細動あり（心原性塞栓）', dz('cerebral_infarction','心原性脳塞栓症','抗凝固療法。皮質を含む大きな梗塞になりやすい。')),
            br('mra_stenosis','主幹動脈の狭窄（アテローム血栓性）', dz('cerebral_infarction','アテローム血栓性脳梗塞','抗血小板療法。')),
          ],
        })),
      ],
    }),
  },
  {
    id:'pw_joint_pain', title:'関節痛の鑑別', system:'膠原病', entryId:'pres_joint_pain',
    summary:'関節痛はまず「単関節か多関節か」で二分する。急性の単関節炎は、化膿性関節炎を否定するまで穿刺する' +
            '（数日で関節が壊れるため）。多関節なら対称性・朝のこわばり・侵される関節の分布が、リウマチと変形性関節症を分ける。',
    root: st('関節痛', {
      layer:S, test:'joint_aspiration', ask:'単関節か多関節か？ 急性か慢性か？',
      note:'急性単関節炎で最初に否定すべきは化膿性関節炎。「痛風だろう」と決めつけて穿刺しないのが最大の落とし穴。',
      branches:[
        br('joint_fluid_bacteria','急性単関節炎＋関節液に細菌・好中球著増', st('化膿性関節炎', { layer:C, test:'joint_aspiration', note:'緊急ドレナージと抗菌薬。数日で軟骨が破壊される。' })),
        br('crystal_urate','急性単関節炎＋針状・負の複屈折結晶', dz('gout','痛風','発作時の尿酸値は正常でありうる。結晶の証明が確定。')),
        br('crystal_cppd','急性単関節炎（膝）＋棒状・正の複屈折結晶', st('偽痛風（CPPD結晶沈着症）', { layer:C, test:'joint_aspiration', note:'高齢者の膝。X線で軟骨石灰化。' })),
        br('anti_ccp_pos','対称性多関節炎＋朝のこわばり1時間以上', st('慢性炎症性多関節炎', {
          layer:D, test:'autoab_rheum', ask:'抗CCP抗体・RFは？ 全身症状はあるか？',
          note:'MCP/PIPを対称性に侵しDIPは侵さない。抗CCP抗体は特異度が高く、骨破壊の進行も予測する。',
          branches:[
            br('xray_joint_erosion','抗CCP抗体陽性＋骨びらん', dz('rheumatoid_arthritis','関節リウマチ','骨破壊は不可逆。早期に炎症を止める。')),
            br('anti_dsdna_pos','蝶形紅斑・腎炎・血球減少・低補体', dz('sle','全身性エリテマトーデス','関節炎は非破壊性であることが多い。')),
            br('anti_ssa_pos','乾燥症状を伴う', dz('sjogren','Sjögren症候群','悪性リンパ腫の合併に注意。')),
          ],
        })),
      ],
    }),
  },
];
