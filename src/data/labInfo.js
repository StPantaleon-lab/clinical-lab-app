// src/data/labInfo.js
// 各検査値の詳細情報
// brief: 簡易説明（UI各所に付記）
// overview: 概要
// mechanism: 総論的な機序
// highDiseases / lowDiseases: { name, criteria, mechanism }
//   criteria=true → その疾患の診断基準に関わる
// excludes: { value, disease, note }

export const LAB_INFO = {

  // ════════════ 血球系 ════════════
  WBC: { label:"白血球数", brief:"感染・炎症・血液腫瘍で増加。ウイルス感染・骨髄抑制で減少。",
    overview:"好中球・リンパ球・単球・好酸球・好塩基球の総称。感染防御・免疫応答の主役。",
    mechanism:"骨髄での産生亢進（G-CSF）または脾臓への捕捉減少で上昇。骨髄抑制・ウイルス感染・脾機能亢進で低下。",
    highDiseases:[
      {name:"細菌感染症・敗血症",criteria:true,mechanism:"LPS→G-CSF産生→骨髄から好中球大量動員。核左方移動（桿状核球増加）が特徴。"},
      {name:"急性白血病（AML・ALL）",criteria:true,mechanism:"白血病細胞が骨髄で無制限増殖し末梢血に溢れ出る。"},
      {name:"慢性骨髄性白血病（CML）",criteria:true,mechanism:"BCR-ABL融合遺伝子→顆粒球系の異常増殖（>20万/μLも）。"},
      {name:"ステロイド投与",criteria:false,mechanism:"好中球の血管壁接着抑制→循環プールへ動員（脱固着）。"},
    ],
    lowDiseases:[
      {name:"ウイルス感染症（インフルエンザ・EBV等）",criteria:true,mechanism:"IFN-α・βが顆粒球産生を抑制。リンパ球は逆に増加。"},
      {name:"再生不良性貧血",criteria:true,mechanism:"造血幹細胞の自己免疫的破壊→全血球系産生障害（汎血球減少）。"},
      {name:"SLE",criteria:true,mechanism:"抗白血球抗体による末梢での破壊＋免疫複合体による骨髄抑制。"},
      {name:"薬剤性無顆粒球症（チアマゾール・クロザピン等）",criteria:true,mechanism:"好中球前駆細胞を傷害。好中球絶対数<500/μLが診断基準。"},
      {name:"脾機能亢進症（肝硬変等）",criteria:false,mechanism:"脾腫→白血球が脾臓に過剰捕捉・破壊（汎血球減少）。"},
    ],
    excludes:[{value:"WBC正常",disease:"重症敗血症",note:"免疫不全者・高齢者では白血球反応が乏しいことがある。PCT・乳酸値を合わせて評価。"}]},

  RBC: { label:"赤血球数", brief:"酸素運搬能の指標。貧血で低下、多血症・脱水で上昇。",
    overview:"ヘモグロビンを含み肺から組織へ酸素を運搬。EPO（腎産生）が主な産生調節因子。",
    mechanism:"EPO産生増加（低酸素）または脱水で上昇。EPO産生低下（腎不全）・骨髄抑制・出血・溶血・鉄欠乏で低下。",
    highDiseases:[
      {name:"真性多血症（PV）",criteria:true,mechanism:"JAK2変異→EPOシグナル恒常活性化→赤血球系自律増殖。"},
      {name:"二次性多血症（COPD・高山病）",criteria:false,mechanism:"慢性低酸素→EPO産生増加→赤血球産生亢進。"},
      {name:"脱水",criteria:false,mechanism:"血漿量減少→相対的RBC濃縮（偽性多血症）。"},
    ],
    lowDiseases:[
      {name:"鉄欠乏性貧血",criteria:true,mechanism:"鉄不足→ヘモグロビン合成障害→赤血球が小型・低色素でRBCも低下。"},
      {name:"溶血性貧血",criteria:true,mechanism:"末梢での赤血球破壊亢進→半減期短縮（正常120日→重症では数日）。"},
      {name:"再生不良性貧血",criteria:true,mechanism:"造血幹細胞障害→赤血球系産生低下。"},
      {name:"腎性貧血",criteria:true,mechanism:"腎機能低下→EPO産生不足→赤血球産生低下。"},
    ],
    excludes:[]},

  Hb: { label:"ヘモグロビン", brief:"血液の酸素運搬能の直接指標。男性<13.0、女性<12.0 g/dLで貧血。",
    overview:"ヘム（鉄+ポルフィリン）とグロビン蛋白の複合体。酸素と可逆的に結合し組織へ酸素を届ける。",
    mechanism:"鉄・B12・葉酸欠乏、骨髄抑制、出血、溶血、EPO産生低下で低下。脱水・多血症で上昇。",
    highDiseases:[
      {name:"真性多血症",criteria:true,mechanism:"JAK2変異→赤血球系自律増殖。Hb男性>18.5、女性>16.5 g/dLが診断基準の一つ。"},
    ],
    lowDiseases:[
      {name:"鉄欠乏性貧血",criteria:true,mechanism:"ヘム合成に必須な鉄が不足→Hb産生低下（小球性低色素性貧血）。"},
      {name:"巨赤芽球性貧血（B12/葉酸欠乏）",criteria:true,mechanism:"DNA合成障害→核分裂遅延→大型赤血球。"},
      {name:"溶血性貧血",criteria:true,mechanism:"末梢での赤血球破壊亢進→Ret上昇（代償）。"},
      {name:"再生不良性貧血",criteria:true,mechanism:"造血幹細胞障害→全血球産生低下。"},
      {name:"腎性貧血",criteria:true,mechanism:"EPO産生低下→正球性正色素性貧血。"},
      {name:"慢性疾患性貧血（ACD）",criteria:false,mechanism:"炎症→ヘプシジン↑→腸管鉄吸収抑制→機能的鉄欠乏→正球性または小球性貧血。"},
      {name:"多発性骨髄腫",criteria:false,mechanism:"骨髄への形質細胞浸潤が正常造血を排除→赤血球産生低下。"},
    ],
    excludes:[]},

  Hct: { label:"ヘマトクリット", brief:"赤血球容積比率。Hbと並行して動く。脱水・多血症で上昇、貧血で低下。",
    overview:"全血液中に占める赤血球の体積割合（%）。",
    mechanism:"Hbとほぼ同様。脱水では血漿量減少によりHctが急速に上昇。",
    highDiseases:[{name:"真性多血症",criteria:true,mechanism:"男性>49%、女性>48%が診断基準の一つ。"},{name:"脱水",criteria:false,mechanism:"血漿量減少による相対的上昇。"}],
    lowDiseases:[{name:"各種貧血",criteria:true,mechanism:"Hb低下と並行して低下。"}],
    excludes:[]},

  PLT: { label:"血小板数", brief:"一次止血を担う。10万未満で出血リスク増加、5万未満で自然出血のリスク。",
    overview:"骨髄巨核球から産生。血管損傷部位に集積して一次血栓を形成。TPOが主な産生調節因子。",
    mechanism:"産生低下・末梢破壊増加・脾臓への捕捉増加・消費亢進（DIC）で低下。骨髄増殖性疾患で上昇。",
    highDiseases:[
      {name:"本態性血小板血症（ET）",criteria:true,mechanism:"JAK2/CALR変異→巨核球系自律増殖→100万/μL以上になることも。"},
      {name:"反応性血小板増多（感染・鉄欠乏・術後）",criteria:false,mechanism:"IL-6・TPOが増加し血小板産生が亢進（通常100万以下）。"},
    ],
    lowDiseases:[
      {name:"ITP（特発性血小板減少性紫斑病）",criteria:true,mechanism:"抗GPIIb/IIIa抗体→脾臓マクロファージによる血小板貪食。PT・APTT正常。"},
      {name:"DIC",criteria:true,mechanism:"全身微小血管内凝固→血小板消費。PT延長・FDP↑・Fib↓を伴う。"},
      {name:"TTP（血栓性血小板減少性紫斑病）",criteria:true,mechanism:"ADAMTS13欠乏→vWFマルチマーが切断されず血小板が過剰消費（血栓性微小血管症）。"},
      {name:"HIT（ヘパリン起因性血小板減少症）",criteria:true,mechanism:"ヘパリン-PF4複合体に対するIgG→血小板活性化→消費＋逆説的血栓症。"},
      {name:"肝硬変・脾機能亢進",criteria:false,mechanism:"脾腫による過剰捕捉＋TPO産生低下（肝細胞減少）。"},
      {name:"再生不良性貧血",criteria:true,mechanism:"造血幹細胞障害→巨核球産生も低下。"},
    ],
    excludes:[{value:"PLT正常、PT正常、APTT正常",disease:"DIC",note:"三者全て正常であればDICはほぼ否定できる。"}]},

  Ret: { label:"網状赤血球", brief:"骨髄の赤血球産生能の指標。溶血・出血後は上昇、骨髄不全では低下。",
    overview:"脱核直後の未成熟赤血球。RNAを含む。末梢血に出てから1〜2日で成熟赤血球になる。",
    mechanism:"溶血・出血→EPO↑→骨髄産生亢進→Ret↑。骨髄不全や材料欠乏（鉄・B12・葉酸）ではRet↓。",
    highDiseases:[
      {name:"溶血性貧血",criteria:true,mechanism:"末梢での破壊に対する骨髄代償産生亢進。Ret>5%が特徴（重症では>10%）。"},
      {name:"急性出血後（回復期）",criteria:false,mechanism:"出血後2〜3日で骨髄反応が始まりRet増加、5〜7日でピーク。"},
      {name:"鉄・B12・葉酸補充後",criteria:false,mechanism:"欠乏が補充されると骨髄機能が回復し急速にRet増加（治療反応の指標）。"},
    ],
    lowDiseases:[
      {name:"再生不良性貧血",criteria:true,mechanism:"造血幹細胞障害→赤血球産生が根本的に低下。Ret<1%は重症の指標。"},
      {name:"腎性貧血",criteria:false,mechanism:"EPO産生低下→骨髄刺激不十分→Ret産生低下。"},
      {name:"MDS（骨髄異形成症候群）",criteria:false,mechanism:"無効造血（産生されても骨髄内で破壊）→Ret低値。"},
    ],
    excludes:[{value:"Ret高値（>2%）",disease:"骨髄不全・産生障害",note:"Ret増加は骨髄が機能している証拠→溶血か出血後と判断。"}]},

  MCV: { label:"平均赤血球容積", brief:"<80 fLで小球性（鉄欠乏・サラセミア）、>100 fLで大球性（B12/葉酸欠乏・溶血）。",
    overview:"赤血球の平均体積。貧血の形態的分類（小球性/正球性/大球性）の基準として使用。",
    mechanism:"Hb合成障害（鉄欠乏）→細胞が小さくなる。DNA合成障害（B12/葉酸欠乏）→核分裂回数減少→大型赤血球。",
    highDiseases:[
      {name:"ビタミンB12欠乏症",criteria:true,mechanism:"B12はDNA合成に必須。欠乏でDNA合成遅延→核分裂回数減少→大型赤血球（MCV>100）。"},
      {name:"葉酸欠乏症",criteria:true,mechanism:"同様にDNA合成障害→大球性貧血。アルコール多飲・妊娠で起きやすい。"},
      {name:"アルコール性肝障害",criteria:false,mechanism:"アルコールの骨髄直接障害＋葉酸欠乏の合併→大球性。"},
      {name:"溶血性貧血（代償性）",criteria:false,mechanism:"Ret（正常赤血球より大きい）が増加するためMCVが見かけ上上昇。"},
    ],
    lowDiseases:[
      {name:"鉄欠乏性貧血",criteria:true,mechanism:"鉄不足→ヘム合成低下→Hb不足→細胞が十分に大きくなれない（MCV<80）。"},
      {name:"サラセミア",criteria:true,mechanism:"グロビン鎖合成異常（遺伝性）→赤血球が小型化。MCV低値でも貧血が軽度なことが多い。"},
    ],
    excludes:[]},

  MCH: { label:"平均赤血球ヘモグロビン量", brief:"赤血球1個あたりのHb量。MCVと並行して動く。鉄欠乏で低下。",
    overview:"MCH（pg）= Hb × 10 / RBC。MCVと高い相関。",
    mechanism:"MCV低下原因（鉄欠乏・サラセミア）と同様に低下。",
    highDiseases:[{name:"大球性貧血（B12/葉酸欠乏）",criteria:false,mechanism:"細胞が大きいためHb量も多い。"}],
    lowDiseases:[
      {name:"鉄欠乏性貧血",criteria:true,mechanism:"ヘモグロビン合成低下→1個あたりHb量減少。MCHC↓と同時に低下。"},
      {name:"サラセミア",criteria:false,mechanism:"グロビン鎖合成低下→Hb量減少。"},
    ],
    excludes:[]},

  MCHC: { label:"平均赤血球ヘモグロビン濃度", brief:"赤血球内のHb濃度。低色素性貧血で低下、遺伝性球状赤血球症で高値。",
    overview:"MCHC（g/dL）= Hb / Hct × 100。赤血球の「濃さ」を表す。",
    mechanism:"鉄欠乏でHb合成が低下しMCHCが低下（低色素性）。遺伝性球状赤血球症では球状化で見かけ上MCHCが上昇。",
    highDiseases:[{name:"遺伝性球状赤血球症",criteria:true,mechanism:"スペクトリン等の細胞骨格蛋白異常→赤血球球状化。MCHC>36 g/dLが特徴。"}],
    lowDiseases:[
      {name:"鉄欠乏性貧血",criteria:true,mechanism:"鉄不足→ヘム合成低下→Hb↓→MCHC↓（低色素性）。"},
      {name:"サラセミア",criteria:false,mechanism:"グロビン鎖合成異常でHb↓→MCHC↓。"},
    ],
    excludes:[]},

  Neut: { label:"好中球比率", brief:"細菌感染・急性炎症で上昇。ウイルス感染では低下（リンパ球が相対的に増加）。",
    overview:"白血球の中で最多（40〜70%）。細菌の貪食・殺菌が主な役割。核左方移動（桿状核球増加）は急性細菌感染の指標。",
    mechanism:"細菌感染・炎症ではG-CSFにより骨髄から大量動員。ウイルス感染ではリンパ球が増えるため相対的に比率低下。",
    highDiseases:[
      {name:"細菌感染症",criteria:true,mechanism:"G-CSFにより骨髄から成熟・未熟好中球が動員。桿状核球>10%なら核左方移動陽性。"},
      {name:"ステロイド投与",criteria:false,mechanism:"好中球の血管壁接着を抑制し循環中に増加。"},
    ],
    lowDiseases:[
      {name:"薬剤性無顆粒球症",criteria:true,mechanism:"抗甲状腺薬・クロザピン等による骨髄障害。好中球絶対数<500/μLが診断基準。"},
      {name:"ウイルス感染症",criteria:false,mechanism:"リンパ球が相対的に増加するため好中球比率が低下（絶対数は正常なことも）。"},
    ],
    excludes:[]},

  Lymph: { label:"リンパ球比率", brief:"ウイルス感染・CLL・百日咳で上昇。細菌感染・ステロイドで低下。",
    overview:"T細胞（細胞性免疫）・B細胞（液性免疫）・NK細胞からなる。",
    mechanism:"ウイルス感染ではウイルス特異的T細胞が増殖。CLLではB細胞が腫瘍性に増殖。",
    highDiseases:[
      {name:"ウイルス感染症（EBV・CMV）",criteria:false,mechanism:"異型リンパ球（活性化T細胞）が増加。伝染性単核症では異型リンパ球>10%が特徴。"},
      {name:"慢性リンパ性白血病（CLL）",criteria:true,mechanism:"成熟B細胞（CD5+CD23+）腫瘍性増殖。リンパ球>5000/μLが診断基準。"},
      {name:"百日咳",criteria:false,mechanism:"百日咳毒素がリンパ球の血管外移行を阻害し末梢血で蓄積。"},
    ],
    lowDiseases:[
      {name:"HIV感染症（進行期）",criteria:true,mechanism:"HIVがCD4陽性T細胞に感染・破壊。CD4<200/μLでAIDS定義疾患。"},
      {name:"ステロイド・免疫抑制薬投与",criteria:false,mechanism:"リンパ球のアポトーシス誘導と再循環障害。"},
    ],
    excludes:[]},

  Eos: { label:"好酸球比率", brief:"アレルギー・寄生虫感染で上昇。>10%は好酸球増多症として精査が必要。",
    overview:"IL-5依存性の白血球。寄生虫殺傷・アレルギー反応の調節に関与。",
    mechanism:"Th2免疫応答（アレルギー・寄生虫）でIL-5が産生され好酸球の分化・動員を促進。",
    highDiseases:[
      {name:"気管支喘息・アトピー性皮膚炎",criteria:false,mechanism:"Th2→IL-5→好酸球が動員。気道・皮膚に浸潤し組織障害。"},
      {name:"寄生虫感染症（回虫・アニサキス等）",criteria:false,mechanism:"組織侵入性寄生虫に対する免疫応答でIL-5が著増。"},
      {name:"EGPA（好酸球性多発血管炎性肉芽腫症）",criteria:true,mechanism:"自己免疫炎症＋IL-5過剰→好酸球が血管壁・組織に浸潤。MPO-ANCA陽性が多い。"},
    ],
    lowDiseases:[{name:"急性細菌感染症（急性期）",criteria:false,mechanism:"コルチゾール↑→好酸球を骨髄に引き戻す。"}],
    excludes:[]},

  // ════════════ 炎症マーカー ════════════
  CRP: { label:"C反応性蛋白（CRP）", brief:"炎症の定量指標。細菌感染で>10が多い。ウイルス感染では軽度上昇（1〜3程度）。",
    overview:"肝臓で産生される急性相蛋白。IL-6によって産生が誘導される。炎症後6〜12時間で上昇、消失後48〜72時間で正常化。赤沈より早く反応する。",
    mechanism:"感染・組織障害・自己免疫などあらゆる炎症でIL-6産生→肝臓でCRP産生亢進。炎症の消退とともに急速に低下（半減期19時間）。",
    highDiseases:[
      {name:"細菌感染症・敗血症",criteria:true,mechanism:"細菌・内毒素→マクロファージ→IL-6大量産生→CRP急激上昇（>10 mg/dLが多い）。"},
      {name:"関節リウマチ（RA）",criteria:false,mechanism:"炎症性サイトカイン持続産生→CRP持続高値。疾患活動性指標（DAS28に含まれる）。"},
      {name:"急性心筋梗塞",criteria:false,mechanism:"心筋壊死→IL-6産生。高感度CRP（hsCRP）は冠動脈リスク指標にも使用。"},
      {name:"悪性腫瘍",criteria:false,mechanism:"腫瘍細胞・腫瘍関連マクロファージがIL-6を産生。"},
    ],
    lowDiseases:[],
    excludes:[
      {value:"CRP正常（<0.3）",disease:"SLE（活動期）",note:"SLEではIFNがCRP産生を抑制するためCRPが上昇しないことがある（感染合併時は上昇）。"},
    ]},

  ESR: { label:"赤血球沈降速度（赤沈）", brief:"慢性炎症・自己免疫疾患のスクリーニング。CRPより反応が遅く長期評価向き。",
    overview:"抗凝固処理した血液を静置したとき赤血球が1時間に沈む速度。フィブリノゲン・免疫グロブリン増加でルロー形成→沈降促進。",
    mechanism:"急性相蛋白（フィブリノゲン・Ig）の増加→赤血球のルロー形成→沈降速度増加。貧血も加速因子。",
    highDiseases:[
      {name:"関節リウマチ（RA）",criteria:false,mechanism:"慢性炎症→フィブリノゲン・Ig増加→ESR高値（疾患活動性指標として使用）。"},
      {name:"SLE",criteria:false,mechanism:"CRPが正常でもESRが高いことがある（SLEの特徴）。"},
      {name:"多発性骨髄腫",criteria:false,mechanism:"M蛋白著増→強いルロー形成→ESRが極端に高値（>100 mm/h）。"},
      {name:"結核・慢性感染症",criteria:false,mechanism:"慢性炎症とフィブリノゲン増加。"},
    ],
    lowDiseases:[{name:"真性多血症",criteria:false,mechanism:"RBC数増加→ルロー形成が妨げられ→ESR著明低下。"}],
    excludes:[]},

  PCT: { label:"プロカルシトニン（PCT）", brief:"細菌感染症の特異的マーカー。>0.25で細菌感染を示唆。ウイルス感染では上昇しない。",
    overview:"細菌感染で著増（ウイルス感染では増加しない）。CRPより早く上昇（2〜4時間）、半減期24〜30時間。",
    mechanism:"細菌LPS→TNF-α・IL-6→全身組織でPCT産生。IFN-γ（ウイルス感染時）がPCT産生を抑制。",
    highDiseases:[
      {name:"細菌性敗血症",criteria:true,mechanism:">0.5 ng/mLで敗血症スクリーニング、>2で重症敗血症を示唆。"},
      {name:"細菌性肺炎",criteria:false,mechanism:"ウイルス性（<0.25）vs細菌性（>0.5）の鑑別に使用。"},
    ],
    lowDiseases:[],
    excludes:[{value:"PCT<0.1",disease:"細菌性感染症",note:"局所感染（蜂窩織炎・軽症UTI）ではPCTが上昇しないことがある。臨床状況と合わせて判断。"}]},

  // ════════════ 凝固系 ════════════
  PT: { label:"プロトロンビン時間（PT）", brief:"外因系（VII・X・V・II・I）の評価。肝機能・VK状態の指標。延長＝凝固能低下。",
    overview:"組織因子（TF）添加後の凝固時間。第VII・X・V・II・I因子を反映。ワーファリンはPTを延長させる。",
    mechanism:"肝臓での凝固因子合成低下（肝不全）またはVK欠乏・拮抗（ワーファリン）→VK依存性因子（II・VII・IX・X）低下→PT延長。",
    highDiseases:[
      {name:"肝不全・重症肝炎",criteria:true,mechanism:"肝細胞障害→凝固因子合成低下。PT<40%（延長>20秒）は劇症肝炎の診断基準の一つ。"},
      {name:"ビタミンK欠乏・ワーファリン過剰",criteria:true,mechanism:"VK依存性凝固因子（II・VII・IX・X）の活性が低下。PT・APTTが同時延長。"},
      {name:"DIC",criteria:true,mechanism:"凝固因子の消費亢進→全凝固因子低下。"},
    ],
    lowDiseases:[],
    excludes:[{value:"PT正常",disease:"血友病A/B",note:"血友病はAPTT単独延長・PT正常が特徴（外因系には関与しない）。"}]},

  PTINR: { label:"PT-INR", brief:"PTを標準化した値。ワーファリン管理に使用。目標2.0〜3.0（機械弁は2.5〜3.5）。",
    overview:"施設間差を補正した標準化PT値。抗凝固療法のモニタリングに使用。",
    mechanism:"PTと同様の機序。",
    highDiseases:[
      {name:"ワーファリン過剰投与",criteria:true,mechanism:"VK依存性因子の過剰抑制。INR>3で出血リスクが急増。"},
      {name:"重症肝不全",criteria:false,mechanism:"凝固因子産生低下。INR>1.5は肝不全の重症指標。"},
    ],
    lowDiseases:[],
    excludes:[]},

  APTT: { label:"APTT", brief:"内因系（VIII・IX・XI・XII）と共通系の評価。血友病・ヘパリン・lupus抗凝固因子でAPTT単独延長。",
    overview:"内因系（XII→XI→IX→VIII→X）と共通系を評価。ヘパリン療法のモニタリングに使用（目標1.5〜2.5倍）。",
    mechanism:"内因系凝固因子欠乏、または阻害因子（ループス抗凝固因子・第VIII因子インヒビター）でAPTT延長。",
    highDiseases:[
      {name:"血友病A（第VIII因子欠乏）",criteria:true,mechanism:"X染色体連鎖劣性。第VIII因子欠乏→内因系凝固障害→APTT単独延長。PT正常・PLT正常。"},
      {name:"血友病B（第IX因子欠乏）",criteria:true,mechanism:"同様にX連鎖劣性。第IX因子欠乏→APTT単独延長。"},
      {name:"von Willebrand病",criteria:true,mechanism:"vWF欠乏→FVIII低下→APTT延長（1型では軽度）。"},
      {name:"ループス抗凝固因子（LA）",criteria:false,mechanism:"リン脂質依存性凝固反応を阻害する自己抗体。in vivoでは血栓傾向。"},
      {name:"ヘパリン投与中",criteria:false,mechanism:"ATIIIを介してトロンビン・Xa・IXaを阻害→APTT延長。"},
      {name:"DIC",criteria:true,mechanism:"凝固因子消費でAPTTも延長（PT同時延長）。"},
    ],
    lowDiseases:[],
    excludes:[{value:"APTT正常・PT正常",disease:"ITPを除く出血性疾患",note:"両者正常で出血傾向があれば血小板機能異常（vWD1型など）または血管性紫斑病を考える。"}]},

  Fib: { label:"フィブリノゲン", brief:"凝固の最終基質。DICで消費→低下。炎症時は急性相反応として上昇。",
    overview:"肝臓で産生される凝固因子I。トロンビンにより切断されフィブリンとなり血栓を形成。急性相蛋白でもある。",
    mechanism:"DIC・重症肝不全→消費・産生低下→Fib↓。炎症・妊娠では急性相反応として上昇。",
    highDiseases:[{name:"急性炎症・感染症",criteria:false,mechanism:"急性相反応として肝臓でのフィブリノゲン産生が増加。"}],
    lowDiseases:[
      {name:"DIC",criteria:true,mechanism:"全身微小血管内凝固→フィブリノゲンが大量消費。<100 mg/dLは重症DIC。"},
      {name:"重症肝不全",criteria:true,mechanism:"肝細胞での産生が低下。"},
    ],
    excludes:[{value:"Fib正常（>150）",disease:"DIC",note:"Fib正常はDICをほぼ否定できる（炎症時は元々高いため相対的低下に注意）。"}]},

  FDP: { label:"フィブリン分解産物（FDP）", brief:"フィブリン・フィブリノゲンの分解産物。DICで著増。血栓溶解治療後も上昇。",
    overview:"プラスミンによるフィブリン/フィブリノゲン分解産物の総称。DICの診断に使用。",
    mechanism:"DICでは全身の微小血栓に対して二次線溶が亢進→FDP大量産生。",
    highDiseases:[
      {name:"DIC",criteria:true,mechanism:"線溶亢進によりFDPが著増（>10 μg/mL）。D-ダイマーと合わせて診断。"},
      {name:"DVT・PE・血栓溶解療法後",criteria:false,mechanism:"血栓溶解によりFDPが上昇。"},
    ],
    lowDiseases:[],
    excludes:[{value:"FDP正常（<5）",disease:"DIC",note:"FDP正常はDICをほぼ否定できる。"}]},

  DD: { label:"D-ダイマー", brief:"架橋フィブリンの分解産物。DIC・DVT・PEのスクリーニング。<0.5 μg/mLでDVT・PEをほぼ否定。",
    overview:"フィブリンが架橋化された後にプラスミンで分解された産物。FDPより特異性が高い（フィブリン由来のみ反映）。",
    mechanism:"DVT・PE・DICでは架橋フィブリン血栓が形成され→線溶により分解→D-ダイマー増加。",
    highDiseases:[
      {name:"深部静脈血栓症（DVT）",criteria:true,mechanism:"下肢静脈の血栓→線溶→D-ダイマー上昇。Wells scoreと合わせてスクリーニング。"},
      {name:"肺塞栓症（PE）",criteria:true,mechanism:"D-ダイマー<0.5で感度>95%でPEを否定（年齢補正値使用）。"},
      {name:"DIC",criteria:true,mechanism:"全身の微小血栓形成→線溶→D-ダイマー著増（>10 μg/mLも）。"},
      {name:"妊娠・産褥期",criteria:false,mechanism:"生理的な凝固亢進・線溶亢進状態でD-ダイマーが上昇。妊娠後期は正常でも高値。"},
    ],
    lowDiseases:[],
    excludes:[{value:"D-ダイマー<0.5 μg/mL",disease:"DVT・PE",note:"Wells score低〜中等度リスクでD-ダイマー<0.5であればDVT・PEをほぼ否定できる（感度>95%）。"}]},

  TAT: { label:"TAT（トロンビン-アンチトロンビン複合体）", brief:"凝固亢進の早期マーカー。DICの早期診断に使用。>3 ng/mLで異常。",
    overview:"トロンビンがATIIIと結合した複合体。凝固亢進の直接指標。FDP・D-ダイマーより早期に上昇。",
    mechanism:"凝固亢進（DIC・血栓症）→トロンビン産生増加→ATIIIと結合してTAT形成。",
    highDiseases:[
      {name:"DIC（早期）",criteria:true,mechanism:"DICの最も早期に上昇するマーカーの一つ。補助診断基準に含まれる。"},
      {name:"DVT・PE",criteria:false,mechanism:"静脈血栓でもトロンビン産生亢進によりTATが上昇。"},
    ],
    lowDiseases:[],
    excludes:[]},

  // ════════════ 肝機能・胆道系 ════════════
  AST: { label:"AST（GOT）", brief:"肝細胞・心筋・骨格筋に多い。ALTより広範な臓器反映。AST>ALTはアルコール性や心筋障害を示唆。",
    overview:"肝臓・心筋・骨格筋・赤血球に多い酵素。半減期が短く（17時間）ALTより先に正常化する。",
    mechanism:"細胞障害→細胞内のASTが血中に漏出。肝細胞壊死・心筋壊死・横紋筋融解症などで上昇。",
    highDiseases:[
      {name:"急性肝炎（ウイルス性・薬剤性）",criteria:true,mechanism:"肝細胞の大量壊死により細胞内ASTが血中に急激に漏出。AST>200 IU/Lが急性肝炎の目安。"},
      {name:"急性心筋梗塞",criteria:false,mechanism:"心筋壊死によりASTが漏出。ピークは発症後24〜48時間。現在はトロポニン・CKに置き換えられている。"},
      {name:"横紋筋融解症",criteria:false,mechanism:"骨格筋の大量壊死でCK・ASTが著増。ミオグロビン尿による急性腎障害を合併。"},
      {name:"アルコール性肝障害",criteria:false,mechanism:"AST/ALT比>2が特徴（アルコールでALTの産生が相対的に抑制される）。"},
    ],
    lowDiseases:[],excludes:[]},

  ALT: { label:"ALT（GPT）", brief:"肝細胞にほぼ特異的。肝障害の最も鋭敏な指標。ALT単独上昇なら肝臓由来。",
    overview:"主に肝細胞に局在する酵素。半減期47時間（ASTより長い）のため肝障害が続く間高値が持続する。",
    mechanism:"肝細胞障害→ALTが血中に漏出。ウイルス性肝炎ではALT>ASTが多い。",
    highDiseases:[
      {name:"急性ウイルス性肝炎",criteria:true,mechanism:"肝細胞の炎症・壊死によりALTが著増（A型・B型・C型・E型・EBV・CMVなど）。"},
      {name:"慢性肝炎（B型・C型）",criteria:false,mechanism:"持続的な肝細胞障害でALTが軽〜中等度上昇（数十〜数百IU/L）。"},
      {name:"NASH（非アルコール性脂肪性肝炎）",criteria:false,mechanism:"脂肪蓄積→酸化ストレス→肝細胞障害。ALT>ASTのことが多い。"},
      {name:"薬剤性肝障害",criteria:false,mechanism:"直接毒性型（アセトアミノフェン）または免疫介在型（抗結核薬等）で肝細胞が障害される。"},
    ],
    lowDiseases:[],excludes:[]},

  LD: { label:"LDH", brief:"多臓器に存在する酵素。組織破壊全般で上昇。溶血・心筋梗塞・腫瘍・肺梗塞で著増。単独では臓器特定不可。",
    overview:"ほぼ全ての細胞に含まれる酵素。5種のアイソザイム（LD1が心臓・赤血球、LD5が肝臓・骨格筋）。",
    mechanism:"あらゆる組織破壊→細胞内LDHが血中へ漏出。特異性は低いが組織障害の感度は高い。",
    highDiseases:[
      {name:"溶血性貧血",criteria:true,mechanism:"赤血球破壊によりLD1が著増。Ret↑・TBil↑と合わせて溶血の三徴。"},
      {name:"急性心筋梗塞",criteria:false,mechanism:"心筋壊死でLD1が上昇。ピークは72〜96時間後（CK・トロポニンより遅れる）。"},
      {name:"悪性リンパ腫・白血病",criteria:false,mechanism:"腫瘍細胞の高い代謝活性と急速な細胞死によりLDHが著増。治療反応性の指標にも使用。"},
      {name:"肺塞栓症・肺梗塞",criteria:false,mechanism:"肺組織の壊死でLD2・LD3が上昇。"},
    ],
    lowDiseases:[],excludes:[]},

  ALP: { label:"ALP（アルカリフォスファターゼ）", brief:"肝・胆道・骨・小腸・胎盤由来。閉塞性黄疸・骨疾患・成長期で著増。γ-GTPと同時上昇なら胆道系疾患。",
    overview:"肝臓・胆道・骨・小腸・胎盤に多い酵素。肝臓では胆管上皮細胞に多く含まれ、胆汁うっ滞で著増。骨疾患（骨芽細胞活性亢進）でも上昇。",
    mechanism:"胆汁うっ滞→胆管上皮細胞へのALPの誘導産生増加＋胆汁への排泄阻害→血中ALPが上昇。骨代謝亢進では骨由来ALPが上昇。",
    highDiseases:[
      {name:"閉塞性黄疸（胆管結石・膵癌・胆管癌）",criteria:true,mechanism:"胆道閉塞→胆汁うっ滞→胆管上皮でALPが誘導産生。γ-GTPも同時上昇。"},
      {name:"原発性硬化性胆管炎（PSC）",criteria:true,mechanism:"自己免疫性胆管炎症→慢性胆汁うっ滞→ALP著増。"},
      {name:"原発性胆汁性胆管炎（PBC）",criteria:true,mechanism:"抗ミトコンドリア抗体（AMA）陽性の自己免疫性胆管破壊→ALP著増。"},
      {name:"骨転移・骨パジェット病",criteria:false,mechanism:"骨芽細胞活性亢進→骨由来ALPが上昇。γ-GTPは正常（肝由来との鑑別）。"},
      {name:"成長期・妊娠後期",criteria:false,mechanism:"骨成長・胎盤からのALP産生（生理的上昇）。"},
    ],
    lowDiseases:[{name:"低フォスファターゼ症（先天性）",criteria:true,mechanism:"ALP遺伝子変異による産生低下。まれ。"}],
    excludes:[]},

  GGT: { label:"γ-GTP", brief:"アルコール・薬剤・胆道系疾患で上昇。アルコール多飲の最も鋭敏なマーカー。ALPと同時上昇なら胆道系疾患を強く示唆。",
    overview:"肝臓・胆管・腎臓・膵臓に多い酵素。アルコールに誘導される。胆汁うっ滞でも著増。",
    mechanism:"アルコール→肝臓でのGGT産生誘導（マイクロゾームの誘導）。胆汁うっ滞→胆管上皮でGGT産生亢進。薬剤（抗てんかん薬・バルビタール）でも誘導される。",
    highDiseases:[
      {name:"アルコール性肝障害",criteria:true,mechanism:"アルコール代謝過程でGGT産生が誘導される。飲酒後2〜3日で上昇、禁酒後3〜6週で正常化。"},
      {name:"閉塞性黄疸・胆汁うっ滞",criteria:true,mechanism:"胆管上皮でGGTが産生亢進。ALPと並行して上昇。"},
      {name:"薬剤性（抗てんかん薬・抗精神病薬）",criteria:false,mechanism:"ミクロソーム酵素誘導によりGGTが上昇（肝細胞障害なし）。"},
      {name:"脂肪肝・NASH",criteria:false,mechanism:"脂肪蓄積→酸化ストレス→GGT上昇。"},
    ],
    lowDiseases:[],excludes:[]},

  TBil: { label:"総ビリルビン", brief:"黄疸の定量指標。>2 mg/dLで肉眼的黄疸。直接/間接比で病態を鑑別。",
    overview:"ヘモグロビン→ビリルビン（間接型）→肝臓で抱合→直接型→胆汁として排泄。直接型増加なら肝/胆道系疾患、間接型増加なら溶血/体質性黄疸。",
    mechanism:"赤血球破壊増加（溶血）→間接型↑。肝細胞障害→抱合・排泄障害→両者上昇。胆道閉塞→直接型の逆流→直接型↑。",
    highDiseases:[
      {name:"閉塞性黄疸（胆管結石・膵癌）",criteria:true,mechanism:"胆管閉塞→直接型ビリルビンが十二指腸へ排泄されず血中に逆流→直接型優位の黄疸。"},
      {name:"急性・慢性肝炎",criteria:false,mechanism:"肝細胞障害→ビリルビン抱合・排泄が両方障害→直接型・間接型ともに上昇。"},
      {name:"溶血性貧血",criteria:true,mechanism:"赤血球大量破壊→間接型ビリルビン大量産生→肝臓の処理能力を超える→間接型優位の黄疸。"},
      {name:"Gilbert症候群",criteria:false,mechanism:"UGT1A1遺伝子多型→ビリルビン抱合酵素の活性低下→絶食・ストレスで間接型が上昇（良性）。"},
    ],
    lowDiseases:[],excludes:[]},

  DBil: { label:"直接ビリルビン", brief:"肝臓で処理された（抱合型）ビリルビン。高値なら肝/胆道系疾患。正常なら間接型優位（溶血・体質性）。",
    overview:"肝臓でグルクロン酸抱合されたビリルビン。水溶性で尿に排泄される（閉塞性黄疸では尿が褐色になる理由）。",
    mechanism:"胆道閉塞→直接型が胆汁排泄できず血中に逆流。肝細胞障害→排泄障害→直接型↑。",
    highDiseases:[
      {name:"閉塞性黄疸",criteria:true,mechanism:"直接型/総ビリルビン比>50%が閉塞性黄疸の指標。ALP・GGTも同時上昇。"},
      {name:"肝炎",criteria:false,mechanism:"肝細胞障害による排泄障害。直接・間接型ともに上昇。"},
    ],
    lowDiseases:[{name:"溶血性貧血（鑑別として）",criteria:false,mechanism:"溶血では直接型は正常〜軽度上昇、間接型が優位に上昇する。"}],
    excludes:[]},

  TP: { label:"総蛋白（TP）", brief:"血清蛋白の総量。低値は栄養不足・肝合成低下・腎漏出。高値は脱水・M蛋白（骨髄腫）を疑う。",
    overview:"アルブミン（約60%）＋グロブリン（IgG・IgA・IgM等）の総量。",
    mechanism:"低Albは肝合成低下・腎漏出・栄養不良が原因。高値は脱水（濃縮）または免疫グロブリンの増加（骨髄腫）。",
    highDiseases:[
      {name:"多発性骨髄腫",criteria:false,mechanism:"M蛋白（単クローン性Ig）の著増→TP高値・Alb正常〜低値→TP-Alb乖離（γグロブリン著増）。"},
      {name:"慢性肝疾患",criteria:false,mechanism:"アルブミン↓だが免疫グロブリン↑→TP総量は正常〜高値（A/G比逆転）。"},
    ],
    lowDiseases:[
      {name:"ネフローゼ症候群",criteria:true,mechanism:"大量の蛋白尿（主にアルブミン）→低蛋白血症→TP↓。"},
      {name:"重症肝不全",criteria:false,mechanism:"アルブミンを含む全ての蛋白の合成が低下。"},
      {name:"栄養不良・吸収不全",criteria:false,mechanism:"蛋白の摂取・吸収が不十分で産生材料が不足。"},
    ],
    excludes:[]},

  Alb: { label:"アルブミン", brief:"肝合成能・栄養状態の指標。<3.5 g/dLで低アルブミン血症。慢性疾患・ネフローゼ・肝不全で低下。",
    overview:"肝臓で産生される主要な血清蛋白。半減期14〜20日（長い）なので慢性の肝障害・栄養状態を反映。",
    mechanism:"肝合成低下（肝硬変・肝不全）・腎漏出（ネフローゼ）・炎症（急性相でAlb↓）・低栄養で低下。",
    highDiseases:[],
    lowDiseases:[
      {name:"肝硬変・慢性肝不全",criteria:true,mechanism:"肝細胞の機能的減少により合成が慢性的に低下。Child-Pugh分類に含まれる重要な指標。"},
      {name:"ネフローゼ症候群",criteria:true,mechanism:"糸球体透過性亢進→アルブミンが尿中に大量漏出（>3.5 g/日）→血中Alb↓。"},
      {name:"炎症（急性相反応）",criteria:false,mechanism:"IL-6等が肝臓でのアルブミン合成を抑制（Negative acute-phase protein）。CRPと逆方向に動く。"},
      {name:"低栄養・吸収不全",criteria:false,mechanism:"蛋白合成材料（アミノ酸）の不足。"},
      {name:"タンパク漏出性胃腸症",criteria:false,mechanism:"腸管粘膜からアルブミンが漏出。浮腫・低Albが主症状。"},
    ],
    excludes:[{value:"Alb正常（>3.5）",disease:"ネフローゼ症候群",note:"診断基準としてAlb≤3.0 g/dLが必要。Alb正常ならネフローゼ診断不可。"}]},

  ChE: { label:"コリンエステラーゼ（ChE）", brief:"肝臓の合成能の指標（特に慢性肝障害）。低値は肝硬変・肝不全・農薬（有機リン）中毒。高値はネフローゼ・脂肪肝。",
    overview:"肝臓で合成される酵素。半減期が約10日と長く、慢性的な肝合成能の低下を反映する。有機リン系農薬により阻害される。",
    mechanism:"肝細胞機能低下→ChE産生減少→血清ChE↓。ネフローゼでは補償的産生亢進により↑。",
    highDiseases:[
      {name:"ネフローゼ症候群",criteria:false,mechanism:"低アルブミン血症に対する補償として肝臓での蛋白合成が亢進→ChEも上昇。"},
    ],
    lowDiseases:[
      {name:"肝硬変・肝不全",criteria:true,mechanism:"肝細胞の機能的減少→ChE産生低下。Albと並行して低下。"},
      {name:"有機リン農薬中毒",criteria:true,mechanism:"コリンエステラーゼが有機リンにより不可逆的に阻害→ChE著減。コリン作動性クリーゼ（縮瞳・流涎・徐脈・気管支攣縮）を起こす。"},
    ],
    excludes:[]},

  AMY: { label:"アミラーゼ（AMY）", brief:"膵臓・唾液腺由来。膵炎で著増（3倍以上）。耳下腺炎でも上昇。腎不全で排泄低下→上昇。",
    overview:"主に膵臓（膵型）と唾液腺（唾液型）から産生されるデンプン分解酵素。血中半減期が短く（2〜3時間）、急性膵炎では発症後2〜12時間で上昇し、3〜5日で正常化。",
    mechanism:"膵炎→膵腺房細胞障害→膵液中のアミラーゼが血中に漏出。唾液腺炎（流行性耳下腺炎）でも上昇。腎排泄障害（腎不全）でも上昇。",
    highDiseases:[
      {name:"急性膵炎",criteria:true,mechanism:"膵腺房細胞の急性炎症・壊死→膵液中のアミラーゼが大量に血中へ漏出。正常上限の3倍以上が診断基準。"},
      {name:"慢性膵炎急性増悪",criteria:false,mechanism:"急性増悪した際に上昇するが、膵実質の線維化が進むと上昇しにくくなる。"},
      {name:"耳下腺炎（ムンプス）",criteria:false,mechanism:"唾液腺由来アミラーゼ（唾液型）が増加。アイソザイム分析で膵型か唾液型かを鑑別。"},
      {name:"慢性腎不全",criteria:false,mechanism:"腎排泄能低下でアミラーゼが血中に蓄積（上限の2〜3倍程度）。"},
    ],
    lowDiseases:[],excludes:[]},

  // ════════════ 腎機能 ════════════
  BUN: { label:"尿素窒素（BUN）", brief:"腎機能の指標。高値は腎不全・脱水・消化管出血。BUN/Cre比>20は前腎性（脱水・出血）を示唆。",
    overview:"アミノ酸代謝の最終産物。肝臓で産生され腎糸球体で自由に濾過される。蛋白摂取量・消化管出血にも影響される。",
    mechanism:"GFR低下→BUN排泄低下→蓄積。高蛋白食・消化管出血・高異化状態でも増加。脱水では前腎性に上昇（BUNがCreより相対的に多く上昇）。",
    highDiseases:[
      {name:"急性・慢性腎不全",criteria:true,mechanism:"GFR低下→BUN排泄障害→蓄積。Cre同時上昇。尿毒症症状（>60 mg/dL）に注意。"},
      {name:"脱水（前腎性）",criteria:false,mechanism:"腎血流低下→GFR低下→BUN↑（ただしCreより相対的に多く上昇）。BUN/Cre比>20が前腎性の指標。"},
      {name:"消化管出血",criteria:false,mechanism:"腸管内での血液蛋白の消化・吸収→尿素産生増加。BUN↑だがCreは正常〜軽度上昇→BUN/Cre比>20。"},
    ],
    lowDiseases:[
      {name:"重症肝不全",criteria:false,mechanism:"肝臓での尿素合成能低下→BUN↓。アンモニア↑（肝性脳症の原因）。"},
    ],
    excludes:[]},

  Cre: { label:"クレアチニン（Cre）", brief:"筋肉由来。GFRの最重要指標。筋肉量に依存（高齢者・女性は基準値が低め）。BUNより腎機能を正確に反映。",
    overview:"筋肉でクレアチンから産生。ほぼ全量が糸球体で濾過され、尿細管での再吸収はほとんどない。産生量が一定なので変動はほぼGFRの変化を反映する。",
    mechanism:"GFR低下→Cre排泄低下→血中に蓄積。筋肉量が多い人は産生量が多く基準値が高い。",
    highDiseases:[
      {name:"慢性腎臓病（CKD）",criteria:true,mechanism:"GFR低下→Cre排泄低下。eGFR算出に使用。Cre>2.0 mg/dLでCKD G4〜相当。"},
      {name:"急性腎障害（AKI）",criteria:true,mechanism:"急激なGFR低下（虚血・腎毒性薬物・尿路閉塞等）→Cre急上昇。AKI診断：48時間以内にCre≥0.3 mg/dL上昇。"},
      {name:"横紋筋融解症",criteria:false,mechanism:"筋肉の大量崩壊→クレアチンが大量産生→Cre↑（同時にCK著増・ミオグロビン尿）。"},
    ],
    lowDiseases:[{name:"筋ジストロフィー・高齢・低筋肉量",criteria:false,mechanism:"筋肉量が少ないとクレアチンの産生が減少→Cre低値。腎機能障害を見落とす危険（eGFR計算時に過大評価）。"}],
    excludes:[{value:"Cre正常かつeGFR>60",disease:"CKD（G1-2）",note:"CKD G1・G2はCre正常でも蛋白尿や尿沈渣異常で診断される。Cre正常のみでCKDを否定しない。"}]},

  eGFR: { label:"推算GFR（eGFR）", brief:"腎機能の総合指標。<60で3ヶ月以上続けばCKD。G1〜G5でステージ分類。透析適応はG5（<15）。",
    overview:"年齢・性別・血清クレアチニンから算出した糸球体濾過量の推算値。CKD重症度分類（G1: ≥90、G2: 60-89、G3a: 45-59、G3b: 30-44、G4: 15-29、G5: <15）。",
    mechanism:"Creと逆相関（GFR低下→Cre上昇→eGFR低下）。",
    highDiseases:[],
    lowDiseases:[
      {name:"CKD（G3以下）",criteria:true,mechanism:"eGFR<60が3ヶ月以上持続。原因疾患（DM・高血圧・糸球体腎炎等）の治療と合併症管理が必要。"},
      {name:"急性腎障害（AKI）",criteria:true,mechanism:"急激なeGFR低下。原因（前腎性・腎性・後腎性）の同定と迅速な対応が必要。"},
    ],
    excludes:[]},

  UA: { label:"尿酸（UA）", brief:"プリン体代謝産物。>7.0 mg/dLで高尿酸血症。痛風発作・尿路結石・腎障害のリスク。",
    overview:"プリン体（核酸の構成成分）がキサンチンオキシダーゼにより代謝された最終産物。腎臓から排泄される。",
    mechanism:"産生過剰（多食・腫瘍崩壊症候群）または排泄低下（腎不全・利尿薬）で上昇。",
    highDiseases:[
      {name:"痛風",criteria:true,mechanism:"高尿酸血症→尿酸塩結晶が関節（特に母趾MTP関節）に沈着→マクロファージが貪食→炎症（急性痛風発作）。"},
      {name:"腫瘍崩壊症候群",criteria:true,mechanism:"白血病・リンパ腫の化学療法後→大量の核酸が分解→UA著増（同時に高K・高P・低Ca）。"},
      {name:"慢性腎不全",criteria:false,mechanism:"腎排泄低下でUAが蓄積。"},
      {name:"子癇・妊娠高血圧症候群",criteria:false,mechanism:"腎血流低下→UA排泄低下。UA上昇は予後不良因子の一つ。"},
    ],
    lowDiseases:[
      {name:"Fanconi症候群",criteria:false,mechanism:"近位尿細管機能障害→尿酸の再吸収低下→UA↓。"},
      {name:"キサンチン尿症",criteria:true,mechanism:"キサンチンオキシダーゼ欠損→尿酸産生低下。まれ。"},
    ],
    excludes:[]},

  // ════════════ 筋酵素・心マーカー ════════════
  CK: { label:"クレアチンキナーゼ（CK）", brief:"骨格筋・心筋・脳の障害マーカー。AMIでTropの後に上昇。横紋筋融解症・筋ジストロフィーで著増。",
    overview:"筋肉内のクレアチンリン酸を合成/分解する酵素。CK-MM（骨格筋）・CK-MB（心筋）・CK-BB（脳）の3種のアイソザイムがある。",
    mechanism:"筋細胞膜の傷害→細胞内CKが血中へ漏出。激しい運動後も生理的に上昇する。",
    highDiseases:[
      {name:"急性心筋梗塞（AMI）",criteria:true,mechanism:"心筋壊死→CK-MBが漏出。発症後4〜8時間で上昇、24時間でピーク、72時間で正常化（トロポニンより早く正常化）。"},
      {name:"横紋筋融解症",criteria:true,mechanism:"外傷・薬剤（スタチン）・過度の運動・熱中症→骨格筋大量崩壊→CK-MMが著増（>10,000 IU/Lも）。ミオグロビン尿→急性腎障害。"},
      {name:"筋ジストロフィー",criteria:true,mechanism:"デュシェンヌ型ではジストロフィン欠損→筋細胞膜が脆弱→CKが持続高値（10,000〜100,000 IU/L）。"},
      {name:"多発性筋炎・皮膚筋炎",criteria:true,mechanism:"自己免疫性筋炎→骨格筋の炎症性破壊→CK著増。抗Jo-1抗体等の筋炎特異的抗体が陽性。"},
      {name:"甲状腺機能低下症",criteria:false,mechanism:"甲状腺ホルモン低下→筋代謝低下・筋細胞膜透過性亢進→CK軽〜中等度上昇。"},
    ],
    lowDiseases:[],excludes:[]},

  Trop: { label:"トロポニン（TnI/TnT）", brief:"心筋壊死の最も特異的なマーカー。AMIで4〜6時間後に上昇し7〜14日持続。",
    overview:"心筋に特異的な収縮蛋白複合体の構成成分。高感度アッセイ（hs-TnI）では99パーセンタイルをカットオフとして使用。",
    mechanism:"心筋細胞の不可逆的壊死→トロポニンが血中へ漏出。半減期が長いため（7〜14日）梗塞後も長期間高値が持続する。",
    highDiseases:[
      {name:"急性心筋梗塞（STEMI・NSTEMI）",criteria:true,mechanism:"冠動脈閉塞→心筋虚血→壊死→トロポニン漏出。hs-TnIは発症後1〜3時間で上昇（感度>95%）。"},
      {name:"急性心筋炎",criteria:false,mechanism:"ウイルス性炎症→心筋細胞の炎症性破壊→Trop上昇。若年者で心電図変化＋Trop上昇なら心筋炎を考慮。"},
      {name:"肺塞栓症（大型）",criteria:false,mechanism:"右室負荷→右室心筋の虚血・壊死→Trop上昇。予後不良の指標。"},
      {name:"腎不全",criteria:false,mechanism:"慢性腎不全では排泄低下により軽度のTrop上昇（特にTnT）。心筋梗塞との鑑別が必要。"},
    ],
    lowDiseases:[],
    excludes:[{value:"hs-TnI正常（2回測定）",disease:"急性心筋梗塞",note:"発症0h・3h両方正常であれば、AMIをほぼ否定できる（感度>99%）。ただし早期（発症<2h）は偽陰性に注意。"}]},

  BNP: { label:"BNP（脳性ナトリウム利尿ペプチド）", brief:"心臓の壁伸展・容量負荷を反映。>18.4 pg/mLで心不全の可能性。<35でほぼ否定。",
    overview:"主に心室筋から分泌されるペプチドホルモン。心室壁の伸展（容量過負荷・圧負荷）により産生亢進。",
    mechanism:"心室壁ストレス→BNP産生・分泌亢進。腎排泄されるため腎不全では偽高値に注意。",
    highDiseases:[
      {name:"心不全（HFrEF・HFpEF）",criteria:true,mechanism:"心室壁の伸展・圧負荷→BNP産生亢進。BNP>100（NT-proBNP>300）で心不全を強く示唆。"},
      {name:"肺高血圧症",criteria:false,mechanism:"右室への圧負荷→BNP産生。PAHの重症度・予後指標。"},
      {name:"腎不全",criteria:false,mechanism:"BNPの腎排泄低下→偽高値。心不全診断の特異度が低下するため注意。"},
    ],
    lowDiseases:[],
    excludes:[{value:"BNP<35 pg/mL",disease:"心不全",note:"息切れの原因が心不全である可能性をほぼ否定できる（除外診断に有用）。"}]},

  // ════════════ 糖代謝 ════════════
  Glu: { label:"血糖（空腹時）", brief:"空腹時≥126 mg/dLで糖尿病。100〜125 mg/dLは境界型。低血糖<70 mg/dLは危険。",
    overview:"空腹時（8時間以上絶食後）の血糖値。糖尿病診断：空腹時≥126、随時≥200、OGTT 2h≥200、HbA1c≥6.5%のいずれか。",
    mechanism:"インスリン分泌不足（1型：自己免疫的β細胞破壊、2型：相対的不足）またはインスリン抵抗性→血糖上昇。ストレス・感染症では反調節ホルモンが血糖を上昇させる。",
    highDiseases:[
      {name:"1型糖尿病",criteria:true,mechanism:"自己免疫によるβ細胞破壊→インスリン絶対的欠乏→高血糖（DKA合併リスク高い）。"},
      {name:"2型糖尿病",criteria:true,mechanism:"インスリン分泌低下＋抵抗性（肥満・運動不足・遺伝的素因）→高血糖。"},
      {name:"Cushing症候群",criteria:false,mechanism:"コルチゾール過剰→肝糖新生促進＋インスリン抵抗性→高血糖（ステロイド糖尿病）。"},
      {name:"急性膵炎・慢性膵炎末期",criteria:false,mechanism:"β細胞の炎症性破壊→インスリン分泌低下→高血糖（膵性糖尿病）。"},
      {name:"先端巨大症",criteria:false,mechanism:"GH過剰→インスリン拮抗作用→インスリン抵抗性→高血糖。"},
    ],
    lowDiseases:[
      {name:"インスリノーマ（膵β細胞腫瘍）",criteria:true,mechanism:"腫瘍がインスリンを自律的に分泌→低血糖発作（Whippleの三徴：低血糖症状・血糖<50・ブドウ糖投与で改善）。"},
      {name:"インスリン・SU薬過剰投与",criteria:true,mechanism:"過剰なインスリン作用→低血糖。意識障害・冷汗・動悸。"},
      {name:"Addison病（副腎不全）",criteria:false,mechanism:"コルチゾール低下→糖新生低下→空腹時低血糖。"},
    ],
    excludes:[]},

  HbA1c: { label:"HbA1c", brief:"過去1〜2ヶ月の平均血糖コントロールの指標。≥6.5%で糖尿病診断基準の一つ。治療目標は<7.0%。",
    overview:"赤血球中のヘモグロビンにグルコースが非酵素的に結合した割合。赤血球寿命（約120日）の間の平均血糖を反映。",
    mechanism:"血糖が高いほどHbへの糖化が進みHbA1cが上昇。赤血球寿命が短い（溶血性貧血）と実際の血糖より低く出る（偽低値）。",
    highDiseases:[{name:"糖尿病（1型・2型）",criteria:true,mechanism:"持続的高血糖→HbA1c上昇。≥6.5%が糖尿病診断基準の一つ。"}],
    lowDiseases:[
      {name:"溶血性貧血（偽低値）",criteria:false,mechanism:"赤血球寿命短縮→糖化される時間が短い→HbA1c↓（実際の血糖より低く出る）。"},
      {name:"妊娠（偽低値）",criteria:false,mechanism:"赤血球寿命短縮＋血漿量増大→相対的にHbA1c↓。"},
    ],
    excludes:[]},

  Ins: { label:"インスリン（空腹時）", brief:"膵β細胞の分泌能指標。HOMA-IR = Ins × Glu / 405でインスリン抵抗性を評価。",
    overview:"膵β細胞から分泌されるペプチドホルモン。空腹時の基礎インスリン値を測定し、インスリン抵抗性を評価（HOMA-IR>2.5で抵抗性あり）。",
    mechanism:"高血糖→インスリン分泌。インスリン抵抗性があれば同じ血糖値でも高インスリン血症になる。",
    highDiseases:[
      {name:"2型糖尿病（早期）・インスリン抵抗性",criteria:false,mechanism:"インスリン抵抗性→血糖を下げるために代償的に多量のインスリンを分泌→高インスリン血症。"},
      {name:"インスリノーマ",criteria:true,mechanism:"自律的なインスリン分泌→低血糖時でも高インスリン（Ins>3 μU/mLかつGlu<50 mg/dL）。"},
    ],
    lowDiseases:[{name:"1型糖尿病",criteria:true,mechanism:"β細胞破壊→インスリン絶対的欠乏。空腹時インスリン低値＋Cペプチド低値で確認。"}],
    excludes:[]},

  CPep: { label:"Cペプチド", brief:"インスリン分泌能の指標（外因性インスリンに影響されない）。1型と2型糖尿病の鑑別に有用。",
    overview:"プロインスリンがインスリンとCペプチドに等モル切断される。内因性インスリン分泌量の指標。",
    mechanism:"β細胞機能を反映。1型ではCペプチドが低下。2型では正常〜高値。",
    highDiseases:[{name:"インスリノーマ",criteria:true,mechanism:"腫瘍からの自律的インスリン分泌→Cペプチドも高値（外因性インスリン投与との鑑別に重要）。"}],
    lowDiseases:[
      {name:"1型糖尿病",criteria:true,mechanism:"β細胞破壊→インスリン・Cペプチドともに低下。Cペプチド<0.5 ng/mLはインスリン依存状態の指標。"},
    ],
    excludes:[]},

  AG1_5: { label:"1,5-アンヒドログルシトール（1,5-AG）", brief:"最近1〜2週間の血糖変動のマーカー。HbA1cが正常でも食後高血糖を検出できる。低値=高血糖エピソードあり。",
    overview:"食事由来のポリオール。血糖が高いとブドウ糖と尿細管での再吸収を競合→尿中排泄が増加→血中低下。",
    mechanism:"高血糖→1,5-AGの尿細管再吸収が競合阻害→1,5-AG尿中排泄増加→血中濃度低下。",
    highDiseases:[],
    lowDiseases:[{name:"糖尿病（食後高血糖）",criteria:false,mechanism:"HbA1cが正常でも食後の高血糖エピソードがあれば1,5-AGが低下。食後血糖コントロールの指標として使用。"}],
    excludes:[]},

  // ════════════ 脂質代謝 ════════════
  TC: { label:"総コレステロール", brief:"LDL・HDL・VLDLの合計。単独評価は少なく、内訳（LDL・HDL・TG）が重要。",
    overview:"LDL、HDL、VLDL（TG/5で近似）の合計。TC単独では動脈硬化リスクの評価が不十分。",
    mechanism:"主に肝臓でコレステロールが合成され、LDLとして末梢に運搬される。",
    highDiseases:[
      {name:"家族性高コレステロール血症（FH）",criteria:true,mechanism:"LDL受容体遺伝子変異→LDLが末梢に取り込まれず→TC・LDL著増（ヘテロ：>250、ホモ：>600 mg/dL）。"},
      {name:"甲状腺機能低下症",criteria:false,mechanism:"甲状腺ホルモン低下→LDL受容体発現低下→LDL代謝低下→TC↑。"},
      {name:"ネフローゼ症候群",criteria:false,mechanism:"低アルブミン→肝での脂質産生亢進（代償）→TC・LDL著増。"},
    ],
    lowDiseases:[
      {name:"重症肝不全",criteria:false,mechanism:"肝臓でのコレステロール合成能低下→TC↓。予後不良の指標。"},
    ],
    excludes:[]},

  TG: { label:"中性脂肪（トリグリセリド）", brief:"≥150 mg/dLで高TG血症。>500でパネル性膵炎リスク。食後・アルコール・糖尿病で上昇。",
    overview:"グリセロールに3本の脂肪酸が結合したエネルギー貯蔵物質。食後に上昇するため空腹時採血が必要。",
    mechanism:"カロリー・糖質過剰摂取→肝臓でのVLDL産生増加→血中TG↑。インスリン不足（糖尿病）→リポプロテインリパーゼ活性低下→TG↑。",
    highDiseases:[
      {name:"家族性高TG血症",criteria:true,mechanism:"LPL遺伝子・ApoC-II変異→VLDLの分解低下→TG著増（>1000 mg/dLも）。急性膵炎の危険。"},
      {name:"2型糖尿病・インスリン抵抗性",criteria:false,mechanism:"インスリン抵抗性→LPL活性低下→TG代謝低下。高TG・低HDLが2型DM動脈硬化の特徴。"},
      {name:"アルコール多飲",criteria:false,mechanism:"アルコール→肝臓でのVLDL産生亢進→TG↑。"},
    ],
    lowDiseases:[],excludes:[]},

  HDL: { label:"HDLコレステロール", brief:"善玉コレステロール。<40 mg/dLで低HDL血症（動脈硬化リスク増加）。",
    overview:"末梢組織から余剰コレステロールを回収して肝臓に運ぶ（逆転送）。抗酸化・抗炎症作用もある。",
    mechanism:"運動・禁煙でHDL↑。肥満・糖尿病・高TG・喫煙・運動不足でHDL↓。",
    highDiseases:[],
    lowDiseases:[
      {name:"メタボリックシンドローム",criteria:true,mechanism:"内臓脂肪蓄積→遊離脂肪酸増加→肝VLDL産生亢進→TG↑・HDL↓。"},
      {name:"2型糖尿病",criteria:false,mechanism:"インスリン抵抗性→同様の機序でHDL↓。"},
      {name:"家族性低HDL血症（タンジール病等）",criteria:true,mechanism:"ABC-A1遺伝子変異→HDL合成低下→HDL著減。"},
    ],
    excludes:[]},

  LDL: { label:"LDLコレステロール", brief:"悪玉コレステロール。≥140 mg/dLで高LDL血症。動脈硬化・冠動脈疾患のリスク。スタチンの主な治療ターゲット。",
    overview:"コレステロールを末梢に運搬するリポタンパク。酸化LDLが動脈壁に沈着し粥状動脈硬化を形成。",
    mechanism:"LDL受容体の発現低下（FH・甲状腺機能低下症）またはLDL産生過剰（高カロリー食）でLDL↑。",
    highDiseases:[
      {name:"家族性高コレステロール血症（FH）",criteria:true,mechanism:"LDL受容体遺伝子変異→LDLが末梢に取り込まれず血中に蓄積。若年での心筋梗塞リスク。"},
      {name:"甲状腺機能低下症",criteria:false,mechanism:"甲状腺ホルモン低下→LDL受容体発現低下→LDL代謝低下→LDL↑。"},
      {name:"ネフローゼ症候群",criteria:false,mechanism:"肝臓での脂質産生亢進→LDL↑。"},
    ],
    lowDiseases:[
      {name:"重症肝不全",criteria:false,mechanism:"肝臓でのLDL合成・VLDLの産生低下→LDL低値。"},
      {name:"無βリポ蛋白血症",criteria:true,mechanism:"ApoB遺伝子変異→LDLが産生されない→TC・LDL著減。脂溶性ビタミン欠乏・神経症状。"},
    ],
    excludes:[]},

  // ════════════ 電解質 ════════════
  Na: { label:"ナトリウム（Na）", brief:"細胞外液の主要陽イオン。低Na（<136）は最多の電解質異常。高Na（>145）は脱水・尿崩症。",
    overview:"細胞外液浸透圧の調節に中心的役割を果たす。ADH（抗利尿ホルモン）が水の再吸収を調節。",
    mechanism:"低Na：水過剰または塩分不足（SIADH・心不全・肝硬変・Addison病）。高Na：水不足（脱水・尿崩症）または塩分過剰。",
    highDiseases:[
      {name:"脱水（水欠乏型）",criteria:false,mechanism:"自由水の不足→血漿浸透圧↑→ADH分泌→水保持→Na相対的過剰。"},
      {name:"尿崩症（中枢性・腎性）",criteria:true,mechanism:"ADH欠乏または腎の無反応→水が保持できず大量の薄い尿→血中Na↑。"},
    ],
    lowDiseases:[
      {name:"SIADH",criteria:true,mechanism:"ADH不適切分泌（肺癌・中枢神経疾患・薬剤）→水保持→希釈性低Na血症。尿Na高値・尿浸透圧高値が特徴。"},
      {name:"心不全・肝硬変・ネフローゼ",criteria:false,mechanism:"有効循環血漿量の低下→ADH代償性分泌↑→水保持→希釈性低Na。浮腫を伴う。"},
      {name:"Addison病（副腎不全）",criteria:true,mechanism:"アルドステロン欠乏→腎でのNa再吸収低下→Na喪失→低Na血症（同時に高K血症）。"},
    ],
    excludes:[]},

  K: { label:"カリウム（K）", brief:"心筋興奮性の制御に重要。<3.0で致死性不整脈のリスク。>6.0でも致死的。最も危険な電解質異常の一つ。",
    overview:"細胞内液の主要陽イオン（細胞外の約30倍）。心筋・骨格筋・神経の興奮性と静止膜電位の決定に不可欠。",
    mechanism:"低K：消化管喪失・アルドステロン過剰・利尿薬・インスリン→細胞内移動。高K：腎排泄低下（腎不全）・細胞外移動（アシドーシス・組織崩壊）・Addison病。",
    highDiseases:[
      {name:"急性腎不全・CKD末期",criteria:true,mechanism:"K排泄低下→高K血症。K>6.0 mEq/Lで心電図変化（テント状T波）、>7.0で心停止のリスク。"},
      {name:"Addison病（副腎不全）",criteria:true,mechanism:"アルドステロン欠乏→腎でのK排泄低下→高K血症（同時に低Na血症）。"},
      {name:"アシドーシス（代謝性）",criteria:false,mechanism:"H+が細胞内に入る際にK+が細胞外に出る（H+/K+交換）→血清K↑。"},
      {name:"横紋筋融解症・溶血",criteria:false,mechanism:"細胞内Kが大量放出→高K血症（同時にCK著増・LDH著増）。"},
    ],
    lowDiseases:[
      {name:"原発性アルドステロン症",criteria:true,mechanism:"アルドステロン過剰→腎でのK排泄増加→低K血症（同時に相対的高Na・高血圧）。"},
      {name:"Cushing症候群",criteria:false,mechanism:"コルチゾール過剰→ミネラルコルチコイド作用→K排泄増加。"},
      {name:"嘔吐・下痢",criteria:false,mechanism:"消化管からのK喪失。嘔吐では代謝性アルカローシスも合併し腎でのK排泄も増加。"},
      {name:"ループ利尿薬・チアジド",criteria:false,mechanism:"腎でのK排泄増加。"},
      {name:"インスリン投与",criteria:false,mechanism:"インスリン→Na/K-ATPase活性化→K細胞内移動→低K血症（DKA治療時に注意）。"},
    ],
    excludes:[]},

  Cl: { label:"クロール（Cl）", brief:"Na・HCO3とともに酸塩基平衡の評価に使用。陰イオンギャップ（AG）= Na - (Cl + HCO3) の計算に必要。",
    overview:"細胞外液の主要陰イオン。陰イオンギャップ（AG、正常値8〜12 mEq/L）の計算に使用。",
    mechanism:"AG上昇型代謝性アシドーシス（乳酸・ケトン・毒物）ではClは正常。AG正常型（下痢・RTA）ではCl↑（高Cl性アシドーシス）。",
    highDiseases:[{name:"高Cl性代謝性アシドーシス（下痢・RTA）",criteria:false,mechanism:"下痢でHCO3喪失→代償としてClが保持→高Cl性アシドーシス（AG正常型）。"}],
    lowDiseases:[{name:"嘔吐（代謝性アルカローシス）",criteria:false,mechanism:"胃酸（HCl）の喪失→Cl↓・HCO3↑→代謝性アルカローシス（低Cl性アルカローシス）。"}],
    excludes:[]},

  Ca: { label:"カルシウム（Ca）", brief:"高Ca（>10.5）はPTH・VD過剰・悪性腫瘍。低Ca（<8.5）はPTH欠乏・VD欠乏・腎不全。",
    overview:"骨・神経・心筋機能に関与。低Alb血症では補正Ca = 実測Ca + 0.8 × (4 - Alb) で評価する。",
    mechanism:"PTH→骨からCa動員・腎でのCa再吸収増加・VD活性化→Ca↑。悪性腫瘍関連高Ca：PTHrP産生（扁平上皮癌・乳癌）または骨転移。",
    highDiseases:[
      {name:"原発性副甲状腺機能亢進症",criteria:true,mechanism:"副甲状腺腺腫（80〜85%）→PTH自律分泌→Ca↑・P↓・尿Ca排泄増加。"},
      {name:"悪性腫瘍関連高Ca血症",criteria:true,mechanism:"PTHrP産生（扁平上皮癌・腎癌・乳癌）またはサイトカインによる骨吸収亢進（骨転移）→Ca↑。"},
      {name:"ビタミンD中毒",criteria:false,mechanism:"VD過剰摂取→腸管Ca吸収亢進・骨吸収亢進→高Ca血症。"},
      {name:"サルコイドーシス",criteria:false,mechanism:"肉芽腫内でのビタミンD活性化→VD産生亢進→Ca↑。"},
      {name:"多発性骨髄腫",criteria:false,mechanism:"IL-6等による骨吸収亢進＋腎障害（排泄低下）→高Ca。CRABの一つ。"},
    ],
    lowDiseases:[
      {name:"副甲状腺機能低下症",criteria:true,mechanism:"PTH欠乏（手術後・自己免疫）→Ca動員低下・腎Ca再吸収低下→低Ca血症。テタニー・痙攣。"},
      {name:"ビタミンD欠乏症（くる病・骨軟化症）",criteria:true,mechanism:"腸管Ca吸収低下→低Ca→PTH↑（二次性副甲状腺機能亢進症）→骨吸収→骨密度低下。"},
      {name:"慢性腎不全",criteria:false,mechanism:"活性型VD産生低下→腸管Ca吸収低下→低Ca→二次性副甲状腺機能亢進症。"},
    ],
    excludes:[]},

  P: { label:"リン（P）", brief:"PTH高値→P低下。腎不全→P上昇。高P血症は血管石灰化を促進。",
    overview:"骨の構成成分、ATP合成、細胞膜の材料。主に腎臓で調節される（PTH→P排泄増加）。",
    mechanism:"PTH↑→腎でのP排泄増加→低P血症。腎不全→P排泄低下→高P血症。",
    highDiseases:[
      {name:"慢性腎不全（CKD）",criteria:true,mechanism:"GFR低下→P排泄低下→高P血症→血管石灰化。CKD-MBDの中心。"},
      {name:"副甲状腺機能低下症",criteria:true,mechanism:"PTH欠乏→腎でのP排泄低下→高P血症（同時に低Ca血症）。"},
    ],
    lowDiseases:[
      {name:"原発性副甲状腺機能亢進症",criteria:true,mechanism:"PTH過剰→腎でのP排泄増加→低P血症（同時に高Ca血症）。"},
      {name:"ビタミンD欠乏",criteria:false,mechanism:"VD低下→腸管P吸収低下→低P血症。"},
      {name:"再栄養症候群（リフィーディング症候群）",criteria:true,mechanism:"長期絶食後の再栄養→インスリン分泌→P・K・Mgが細胞内に移行→急激な低P血症→心不全・呼吸不全。"},
    ],
    excludes:[]},

  Mg: { label:"マグネシウム（Mg）", brief:"低Mg血症は難治性低K・低Ca血症の原因になる。利尿薬・アルコール・下痢で低下。",
    overview:"300種以上の酵素の補因子。Na/K-ATPaseの機能にも必要。低Mg血症では腎でのK排泄増加→低K血症が難治性になる。",
    mechanism:"利尿薬（ループ・チアジド）→腎でのMg排泄増加。アルコール→腸管吸収低下＋腎排泄増加。",
    highDiseases:[{name:"腎不全",criteria:false,mechanism:"腎排泄低下→Mg蓄積。Mg>4 mEq/Lで深部腱反射消失、>6で呼吸抑制。"}],
    lowDiseases:[
      {name:"アルコール依存症",criteria:false,mechanism:"摂取不足＋腸管吸収低下＋腎排泄増加の三重苦。振戦・痙攣の原因。"},
      {name:"ループ利尿薬・チアジド",criteria:false,mechanism:"尿細管でのMg再吸収阻害→尿中Mg排泄増加。"},
      {name:"難治性低K血症・低Ca血症",criteria:false,mechanism:"低Mgでは腎でのK排泄が増加し低K血症が改善しない。またPTH分泌にMgが必要なため低Mgで低Ca血症が難治性になる。"},
    ],
    excludes:[]},

  HCO3: { label:"重炭酸イオン（HCO3-）", brief:"酸塩基平衡のアルカリ側。低下→代謝性アシドーシス、上昇→代謝性アルカローシス。血液ガスと合わせて解釈。",
    overview:"血漿中の主要な緩衝系。正常値22〜26 mEq/L。",
    mechanism:"下痢・RTA→HCO3喪失→低下。嘔吐・利尿薬→H+喪失→HCO3相対的増加。",
    highDiseases:[{name:"代謝性アルカローシス（嘔吐・利尿薬）",criteria:true,mechanism:"胃酸喪失（嘔吐）またはH+の腎排泄増加（利尿薬）→HCO3相対的増加。低K血症を合併することが多い。"}],
    lowDiseases:[
      {name:"糖尿病性ケトアシドーシス（DKA）",criteria:true,mechanism:"インスリン欠乏→脂肪分解→ケトン体産生→代謝性アシドーシス（AG上昇型）→HCO3消費→低下。"},
      {name:"乳酸アシドーシス",criteria:true,mechanism:"組織低酸素→嫌気性解糖→乳酸産生→HCO3消費（AG上昇型アシドーシス）。"},
      {name:"腎尿細管性アシドーシス（RTA）",criteria:true,mechanism:"遠位型（1型）：H+排泄障害。近位型（2型）：HCO3再吸収障害。AG正常型アシドーシス。"},
      {name:"下痢",criteria:false,mechanism:"腸液（HCO3リッチ）の喪失→AG正常型代謝性アシドーシス。"},
    ],
    excludes:[]},

  // ════════════ 内分泌（甲状腺） ════════════
  TSH: { label:"TSH（甲状腺刺激ホルモン）", brief:"甲状腺機能の最も鋭敏な指標。低値→機能亢進。高値→機能低下（原発性）。TSH正常なら原発性甲状腺機能異常をほぼ否定できる。",
    overview:"下垂体前葉から分泌。甲状腺でのT3・T4産生を刺激。フィードバック制御：T3・T4↑→TSH↓。",
    mechanism:"原発性甲状腺機能低下症→T4↓→フィードバック解除→TSH著増。バセドウ病→T3・T4↑→TSH抑制。",
    highDiseases:[
      {name:"原発性甲状腺機能低下症（橋本病）",criteria:true,mechanism:"甲状腺破壊→T4↓→TSH著増。TSH>10 μIU/mLで治療を考慮。TPOAb・TgAb陽性が多い。"},
      {name:"潜在性甲状腺機能低下症",criteria:true,mechanism:"TSH上昇＋FT4正常。軽度のフィードバック障害。妊婦・高TSH（>10）では治療。"},
    ],
    lowDiseases:[
      {name:"バセドウ病（Graves病）",criteria:true,mechanism:"TRAb（TSH受容体刺激抗体）→TSH受容体を持続刺激→T3・T4過剰産生→TSH抑制（TSH<0.1）。"},
      {name:"機能性甲状腺結節",criteria:false,mechanism:"自律的にT3・T4を産生する結節→TSH抑制。シンチグラフィでhot nodule。"},
      {name:"中枢性甲状腺機能低下症",criteria:true,mechanism:"下垂体障害→TSH産生低下→FT4低下（TSH低値＋FT4低値という稀な組み合わせ）。"},
    ],
    excludes:[{value:"TSH正常（0.5〜5.0）",disease:"甲状腺機能異常",note:"TSH正常なら原発性甲状腺機能亢進症・低下症はほぼ否定できる。中枢性（下垂体性）は例外。"}]},

  FT3: { label:"遊離T3（FT3）", brief:"甲状腺ホルモンの活性型（T4の末梢変換で産生）。亢進症でT4より先に上昇。低T3症候群（重篤疾患）に注意。",
    overview:"最も生物活性の高い甲状腺ホルモン。T4→T3変換酵素（5'-脱ヨウ素酵素）で変換されて産生される。",
    mechanism:"重篤な全身疾患（飢餓・肝不全等）では5'-脱ヨウ素酵素が低下→FT3↓（低T3症候群、sick euthyroid syndrome）。",
    highDiseases:[{name:"甲状腺機能亢進症（T3型中毒症）",criteria:true,mechanism:"FT4正常だがFT3のみ著増するT3優位型。FT3↑＋TSH↓＋FT4正常という組み合わせ。"}],
    lowDiseases:[
      {name:"低T3症候群（sick euthyroid）",criteria:false,mechanism:"重症疾患・飢餓→T4→T3変換低下→FT3↓（TSH正常・FT4正常）。真の甲状腺疾患ではない。"},
      {name:"甲状腺機能低下症",criteria:true,mechanism:"TSH↑・FT4↓と並行してFT3も低下。ただしFT4の方が鋭敏。"},
    ],
    excludes:[]},

  FT4: { label:"遊離T4（FT4）", brief:"甲状腺ホルモン（貯蔵・輸送型）。TSHと合わせて甲状腺機能を評価。TSH低値＋FT4高値→機能亢進。TSH高値＋FT4低値→機能低下。",
    overview:"甲状腺が主に産生する不活性型ホルモン（T4）の遊離型。末梢でT3に変換される。",
    mechanism:"甲状腺での産生がTSHとのフィードバック制御で調節される。",
    highDiseases:[
      {name:"バセドウ病",criteria:true,mechanism:"TRAb→甲状腺を持続刺激→T4・T3過剰産生→FT4↑・TSH↓。"},
      {name:"亜急性甲状腺炎",criteria:false,mechanism:"ウイルス性炎症→甲状腺破壊→貯蔵ホルモンが一過性に血中へ漏出→FT4↑・TSH↓→その後低下期。"},
    ],
    lowDiseases:[
      {name:"橋本病（慢性甲状腺炎）",criteria:true,mechanism:"自己免疫による甲状腺破壊→T4産生低下→FT4↓・TSH↑。TPOAb・TgAb陽性。"},
      {name:"中枢性甲状腺機能低下症",criteria:true,mechanism:"下垂体障害→TSH産生低下→甲状腺刺激不足→FT4↓（TSH低値or正常という特徴的な組み合わせ）。"},
    ],
    excludes:[]},

  TRAb: { label:"TSH受容体抗体（TRAb）", brief:"バセドウ病の診断に特異的。陽性＋機能亢進所見でバセドウ病を確定診断。",
    overview:"TSH受容体に結合する自己抗体。刺激型（TSAb）と阻害型（TBAb）がある。",
    mechanism:"自己免疫でTSH受容体に対する抗体産生。刺激型（TSAb）はTSH受容体を持続刺激→T3・T4過剰産生。",
    highDiseases:[{name:"バセドウ病（Graves病）",criteria:true,mechanism:"TRAb（特にTSAb）陽性が診断基準の中核。陰性でも5〜10%は陽性化する。"}],
    lowDiseases:[],
    excludes:[{value:"TRAb陰性",disease:"バセドウ病",note:"TRAb陰性でもバセドウ病の5〜10%は陰性（感度85〜95%）。臨床的に疑う場合はTSAb測定または経過観察。"}]},

  TPOAb: { label:"抗TPO抗体", brief:"橋本病の最も鋭敏な自己抗体（90〜95%で陽性）。バセドウ病でも陽性になることがある。",
    overview:"甲状腺ペルオキシダーゼに対する自己抗体。橋本病患者の90〜95%で陽性。",
    mechanism:"自己免疫による甲状腺抗原への免疫寛容の破綻→TPOに対する自己抗体産生→補体活性化・ADCC→甲状腺細胞傷害→橋本病。",
    highDiseases:[
      {name:"橋本病（慢性甲状腺炎）",criteria:true,mechanism:"自己免疫性甲状腺炎の診断。TPOAb陽性＋エコー上低エコー＋TSH高値で診断確定。"},
      {name:"バセドウ病",criteria:false,mechanism:"バセドウ病の約75%でTPOAbが陽性。"},
    ],
    lowDiseases:[],excludes:[]},

  TgAb: { label:"抗サイログロブリン抗体（TgAb）", brief:"橋本病の診断補助。甲状腺癌術後のTgモニタリングを妨害するため重要。",
    overview:"サイログロブリンに対する自己抗体。橋本病の80〜85%で陽性。",
    mechanism:"TPOAbと同様の自己免疫機序。甲状腺癌術後フォローアップでTgAb陽性の場合、Tg値が正確に測定できない（過小評価される）。",
    highDiseases:[{name:"橋本病",criteria:false,mechanism:"TPOAbとともに自己免疫性甲状腺炎のマーカー。TPOAb陰性でもTgAb陽性なら橋本病を支持。"}],
    lowDiseases:[],excludes:[]},

  Tg: { label:"サイログロブリン（Tg）", brief:"甲状腺組織量の指標。甲状腺癌術後の再発モニタリングに使用。TgAb陽性時は干渉に注意。",
    overview:"甲状腺濾胞で産生される甲状腺ホルモン前駆体。甲状腺全摘後に低値になれば残存組織・再発がないことを示す。",
    mechanism:"甲状腺組織量に比例して上昇。炎症・甲状腺疾患でも上昇。",
    highDiseases:[
      {name:"甲状腺癌（術後再発）",criteria:true,mechanism:"甲状腺全摘後にTgが検出されれば再発または残存を示唆。TSH刺激後Tg>2 ng/mLが再発の指標。"},
    ],
    lowDiseases:[],excludes:[]},

  // ════════════ 内分泌（副腎） ════════════
  Cort: { label:"コルチゾール（朝）", brief:"副腎皮質ホルモン。低値→副腎不全（Addison病）。高値→Cushing症候群・ストレス反応。",
    overview:"副腎皮質（束状帯）から分泌されるグルコルチコイド。日内変動があり朝が最高値、夕方が最低値。",
    mechanism:"ACTH依存性（下垂体CRH-ACTH軸）で調節。朝のコルチゾール<3 μg/dLで副腎不全を強く示唆。",
    highDiseases:[
      {name:"Cushing症候群",criteria:true,mechanism:"コルチゾール過剰産生→フィードバック障害。深夜コルチゾール>1.8 μg/dLまたは1mg DEX抑制試験での非抑制が診断の入口。"},
      {name:"急性ストレス反応（感染症・手術・外傷）",criteria:false,mechanism:"視床下部-下垂体-副腎軸の活性化によるコルチゾール急増（適応反応）。"},
    ],
    lowDiseases:[
      {name:"Addison病（原発性副腎不全）",criteria:true,mechanism:"副腎皮質の自己免疫的破壊（80%）→コルチゾール産生低下→ACTH↑（フィードバック解除）。"},
      {name:"下垂体機能低下症（二次性副腎不全）",criteria:true,mechanism:"ACTH分泌低下→コルチゾール産生低下。ACTHは低値（原発性との鑑別点）。"},
    ],
    excludes:[]},

  ACTH: { label:"ACTH（副腎皮質刺激ホルモン）", brief:"コルチゾール低値のとき：ACTH高値→原発性副腎不全、ACTH低値→下垂体性（二次性）。",
    overview:"下垂体前葉から分泌され副腎皮質を刺激してコルチゾールを産生させる。早朝採血（9時まで）が必要。",
    mechanism:"コルチゾール低下→フィードバック解除→ACTH↑（原発性）。下垂体障害→ACTH産生低下→コルチゾール↓（二次性）。",
    highDiseases:[
      {name:"Addison病（原発性副腎不全）",criteria:true,mechanism:"副腎の機能低下→コルチゾール↓→フィードバック解除→ACTH著増（>300 pg/mLも）。"},
      {name:"下垂体ACTH産生腫瘍（Cushing病）",criteria:true,mechanism:"腺腫からのACTH自律産生→副腎を持続刺激→コルチゾール↑（ACTH依存性Cushing症候群）。"},
      {name:"異所性ACTH産生（肺小細胞癌等）",criteria:true,mechanism:"腫瘍がACTHを産生→副腎刺激→コルチゾール↑。ACTHが非常に高値（>300 pg/mL）のことが多い。"},
    ],
    lowDiseases:[
      {name:"下垂体機能低下症（二次性副腎不全）",criteria:true,mechanism:"下垂体腫瘍・術後・Sheehan症候群によるACTH産生低下→コルチゾール↓。コルチゾール↓＋ACTH↓の組み合わせ。"},
      {name:"副腎皮質腺腫（Cushing症候群）",criteria:true,mechanism:"腺腫がコルチゾールを自律産生→高コルチゾール→下垂体ACTH分泌抑制→ACTH↓（ACTH非依存性Cushing症候群）。"},
    ],
    excludes:[]},

  Aldo: { label:"アルドステロン（PAC）", brief:"副腎球状帯から分泌。Na保持・K排泄を調節。高値＋低レニン＝原発性アルドステロン症。",
    overview:"RAAS系の最終産物。腎遠位尿細管でNa再吸収・K排泄を調節。ARR（アルドステロン/レニン比）がスクリーニングに使用される。",
    mechanism:"低血圧・低Na→レニン→アンジオテンシンII→アルドステロン産生。原発性アルドステロン症では自律的にアルドステロンが産生される（レニンに依存しない）。",
    highDiseases:[{name:"原発性アルドステロン症",criteria:true,mechanism:"副腎腺腫（Conn腺腫）または過形成→アルドステロン自律産生→PAC高値＋PRA低値（ARR≥200）。低K・高血圧。"}],
    lowDiseases:[
      {name:"Addison病",criteria:false,mechanism:"副腎皮質破壊→アルドステロン産生低下→Na喪失・K蓄積（低Na・高K）。"},
    ],
    excludes:[]},

  PRA: { label:"レニン活性（PRA）", brief:"RAASの起点。低値＋高アルドステロン＝原発性アルドステロン症。高値＋高アルドステロン＝二次性（腎血管性高血圧等）。",
    overview:"腎傍糸球体細胞から分泌されるプロテアーゼ。アンジオテンシノゲン→アンジオテンシンI→（ACE）→アンジオテンシンII→アルドステロン産生。",
    mechanism:"低血圧・低Na・立位でレニン分泌↑。原発性アルドステロン症では自律産生→レニンは抑制（PRA↓）。",
    highDiseases:[
      {name:"腎血管性高血圧（腎動脈狭窄）",criteria:true,mechanism:"腎血流低下→レニン産生→アルドステロン↑→高血圧。PRA↑＋PAC↑（二次性アルドステロン症）。"},
      {name:"Bartter症候群・Gitelman症候群",criteria:true,mechanism:"遺伝性の電解質輸送体異常→Na喪失→RAAS活性化→PRA↑・PAC↑。低K血症。"},
    ],
    lowDiseases:[{name:"原発性アルドステロン症",criteria:true,mechanism:"アルドステロン自律産生→血圧上昇・Na貯留→レニン分泌抑制→PRA↓（<0.2 ng/mL/h）。"}],
    excludes:[]},

  // ════════════ 内分泌（下垂体） ════════════
  GH: { label:"成長ホルモン（GH）", brief:"下垂体前葉から分泌。パルス性のため単回測定は参考程度。IGF-1の方が安定した指標。",
    overview:"成長促進・代謝調節（蛋白同化・脂肪分解・インスリン拮抗）。肝臓でIGF-1の産生を刺激。",
    mechanism:"パルス性分泌のため随時値は信頼性が低い。GH産生腫瘍では基礎値が高値＋OGTT後も抑制されない（抑制試験）。",
    highDiseases:[{name:"先端巨大症（成人）・巨人症（小児）",criteria:true,mechanism:"下垂体GH産生腺腫→GH・IGF-1過剰→軟部組織・骨の肥大。75gOGTT後GH>1 ng/mLで確定（正常では<1に抑制）。"}],
    lowDiseases:[
      {name:"下垂体性低身長（小児）",criteria:true,mechanism:"GH分泌低下→IGF-1低下→骨端軟骨での成長障害。インスリン低血糖試験でGH<3 ng/mLが診断基準。"},
      {name:"成人GH欠乏症",criteria:true,mechanism:"下垂体腫瘍・手術・外傷後。中心性肥満・筋力低下・脂質異常・QOL低下。"},
    ],
    excludes:[]},

  PRL: { label:"プロラクチン（PRL）", brief:"下垂体前葉から分泌。乳汁分泌・生殖機能の抑制に関与。>200 ng/mLならプロラクチノーマをほぼ確定。薬剤性でも上昇。",
    overview:"ドーパミンにより分泌が抑制される（ドーパミン拮抗薬で上昇する理由）。",
    mechanism:"プロラクチノーマ→PRL自律産生。ドーパミン拮抗薬（抗精神病薬・胃薬）→PRL↑。甲状腺機能低下症→TRHがPRL産生を刺激。",
    highDiseases:[
      {name:"プロラクチノーマ",criteria:true,mechanism:"下垂体のPRL産生腺腫。>200 ng/mLならプロラクチノーマをほぼ確定（薬剤性は通常<200）。"},
      {name:"薬剤性高PRL血症（ドーパミン拮抗薬）",criteria:true,mechanism:"ハロペリドール・メトクロプラミド・リスペリドン→PRL分泌抑制解除→PRL↑（<200 ng/mL程度）。"},
      {name:"甲状腺機能低下症",criteria:false,mechanism:"TRH増加→TRHがPRL分泌も刺激→PRL軽度上昇。"},
    ],
    lowDiseases:[],excludes:[]},

  IGF1: { label:"IGF-1（インスリン様成長因子-1）", brief:"GHの作用を反映する安定したマーカー。先端巨大症の最重要スクリーニング検査。年齢・性別補正が必要。",
    overview:"肝臓でGHの刺激により産生。GHの生物活性を媒介（蛋白同化・軟骨成長促進）。半減期が長く日内変動が少ない。",
    mechanism:"GH産生腫瘍→GH↑→肝臓でIGF-1過剰産生→IGF-1↑。GH欠乏・栄養不良・肝不全→IGF-1↓。",
    highDiseases:[{name:"先端巨大症",criteria:true,mechanism:"GH産生腺腫→IGF-1著増（年齢・性別補正値でzスコア>2SD）。GH・IGF-1両方の上昇が診断の核心。"}],
    lowDiseases:[
      {name:"GH欠乏症",criteria:true,mechanism:"GH不足→IGF-1産生低下。負荷試験（インスリン低血糖・GH分泌刺激）で確認。"},
      {name:"栄養不良・肝不全",criteria:false,mechanism:"産生材料不足または産生臓器（肝臓）の機能低下→IGF-1↓。"},
    ],
    excludes:[]},

  // ════════════ 内分泌（副甲状腺） ════════════
  PTH: { label:"副甲状腺ホルモン（PTH）", brief:"高Ca＋高PTH→原発性副甲状腺機能亢進症。低Ca＋低PTH→副甲状腺機能低下症。低Ca＋高PTH→二次性（VD欠乏・腎不全）。",
    overview:"副甲状腺から分泌。骨からのCa動員・腎でのCa再吸収増加・P排泄増加・活性型VD産生促進の作用を持つ。",
    mechanism:"低Ca→PTH分泌を刺激。高Ca→PTH分泌を抑制。原発性副甲状腺機能亢進症ではCaが高値でもPTHが抑制されない（自律的産生）。",
    highDiseases:[
      {name:"原発性副甲状腺機能亢進症",criteria:true,mechanism:"副甲状腺腺腫（80〜85%）・過形成（15〜20%）・癌（<1%）→PTH自律産生→高Ca・低P・尿Ca排泄増加。"},
      {name:"二次性副甲状腺機能亢進症（腎不全・VD欠乏）",criteria:true,mechanism:"慢性低Ca（腎不全・VD欠乏）→持続的PTH刺激→副甲状腺過形成→PTH著増。腎性骨異栄養症の原因。"},
    ],
    lowDiseases:[
      {name:"副甲状腺機能低下症",criteria:true,mechanism:"PTH産生低下（手術後・自己免疫・DiGeorge症候群）→Ca動員・再吸収低下→低Ca・高P。"},
      {name:"偽性副甲状腺機能低下症",criteria:true,mechanism:"PTHは産生されるが標的臓器での受容体/シグナル障害→低Ca・高P・PTH高値（効かないため）。Albright遺骨炎。"},
    ],
    excludes:[]},

  vitD: { label:"25-OHビタミンD", brief:"ビタミンDの貯蔵型。<20 ng/mLでVD欠乏。骨粗鬆症・くる病・骨軟化症・免疫機能低下と関連。",
    overview:"食事・日光で産生されたVDが肝臓で25-OH化された中間代謝物。体内のVD貯蔵量を反映。",
    mechanism:"VD欠乏→活性型VD産生低下→腸管Ca吸収低下→低Ca→PTH↑（二次性副甲状腺機能亢進症）→骨吸収亢進→骨密度低下。",
    highDiseases:[{name:"VD中毒（サプリメント過剰摂取）",criteria:true,mechanism:"VD過剰→25-OHD著増→高Ca血症・腎石灰化・軟組織石灰化。"}],
    lowDiseases:[
      {name:"くる病（小児）",criteria:true,mechanism:"VD欠乏→骨石灰化障害→骨端部拡大・脚変形・Rachitic rosary。"},
      {name:"骨軟化症（成人）",criteria:true,mechanism:"VD欠乏→骨の低石灰化→骨痛・筋力低下・病的骨折。"},
      {name:"骨粗鬆症（二次性要因）",criteria:false,mechanism:"VD欠乏→Ca吸収低下→骨密度低下。"},
    ],
    excludes:[]},

  // ════════════ 免疫・補体 ════════════
  IgG: { label:"免疫グロブリンG（IgG）", brief:"最多の免疫グロブリン（全Igの75%）。慢性感染・自己免疫で多クローン性に増加。骨髄腫で単クローン性（M蛋白）増加。",
    overview:"二次免疫応答の主体。胎盤通過性あり（母体から胎児への受動免疫）。",
    mechanism:"慢性感染・自己免疫→多クローン性Ig産生。骨髄腫→単一形質細胞クローンが増殖→IgG単クローン性増加（M蛋白）。",
    highDiseases:[
      {name:"多発性骨髄腫（IgG型）",criteria:true,mechanism:"形質細胞の腫瘍性増殖→IgG単クローン性著増（血清蛋白電気泳動でMバンド）。CRAB基準。"},
      {name:"慢性肝疾患（肝硬変）",criteria:false,mechanism:"腸管内細菌産物が門脈からシャント→全身性免疫刺激→IgG多クローン性増加（A/G比逆転）。"},
      {name:"IgG4関連疾患（IgG4-RD）",criteria:true,mechanism:"IgG4陽性形質細胞浸潤→IgG4選択的上昇（>135 mg/dL）。自己免疫性膵炎・胆管・腎臓等に線維化。"},
    ],
    lowDiseases:[
      {name:"X連鎖無γグロブリン血症（Bruton病）",criteria:true,mechanism:"BTK遺伝子変異→B細胞発達障害→全Ig著減。反復細菌感染が特徴。"},
      {name:"分類不能型免疫不全症（CVID）",criteria:true,mechanism:"成人発症型の低γグロブリン血症。B細胞は存在するが抗体産生できない。"},
    ],
    excludes:[]},

  IgA: { label:"免疫グロブリンA（IgA）", brief:"粘膜免疫の主体。IgA腎症・アレルギー性紫斑病で上昇。IgA欠乏は1/500〜700と最多の免疫不全症。",
    overview:"唾液・涙・母乳・腸管分泌液に多い（分泌型IgA）。粘膜感染防御に重要。",
    mechanism:"IgA腎症ではIgA産生亢進（特に糖鎖異常IgA1）→メサンギウム沈着→糸球体腎炎。",
    highDiseases:[
      {name:"IgA腎症",criteria:true,mechanism:"血清IgA↑（約50%で上昇）＋メサンギウムへのIgA沈着。血尿・蛋白尿。腎生検で確定診断。"},
      {name:"多発性骨髄腫（IgA型）",criteria:true,mechanism:"IgAを産生する形質細胞の腫瘍性増殖（骨髄腫の20〜25%）。"},
      {name:"アレルギー性紫斑病（Henoch-Schönlein紫斑病）",criteria:false,mechanism:"IgAが血管壁に沈着→血管炎→紫斑・腹痛・関節痛・腎炎。"},
    ],
    lowDiseases:[{name:"選択的IgA欠乏症",criteria:true,mechanism:"最多の免疫不全症（1/500〜700）。多くは無症状だが反復感染・アレルギー・自己免疫疾患リスク。輸血でアナフィラキシーに注意。"}],
    excludes:[]},

  IgM: { label:"免疫グロブリンM（IgM）", brief:"一次免疫応答の主体（早期に産生される）。Waldenström高ガンマグロブリン血症で著増。",
    overview:"5量体構造の最大の抗体。補体活性化能が高い。感染後最初に産生される（後にIgGにクラススイッチ）。",
    mechanism:"急性感染→IgMが先行産生。Waldenström高ガンマグロブリン血症ではリンパ形質細胞がIgMを産生→過粘稠度症候群。",
    highDiseases:[
      {name:"Waldenström高ガンマグロブリン血症",criteria:true,mechanism:"IgMを産生するリンパ形質細胞腫の増殖→血清IgM著増→過粘稠度症候群（視力障害・神経症状・出血傾向）。"},
      {name:"急性感染症（早期）",criteria:false,mechanism:"IgM型抗体が最初に産生される（例：IgM型HA抗体陽性→A型肝炎の急性期）。"},
    ],
    lowDiseases:[{name:"X連鎖無γグロブリン血症",criteria:true,mechanism:"全Igが低下（IgMも含む）。"}],
    excludes:[]},

  IgE: { label:"総IgE", brief:"アレルギー・寄生虫感染で上昇。>170 IU/mLで高IgE。アレルギー性疾患のスクリーニングに使用。",
    overview:"肥満細胞・好塩基球のFcε受容体に結合し、アレルゲンとの架橋で脱顆粒（ヒスタミン放出）→アレルギー反応を起こす。",
    mechanism:"Th2優位の免疫応答（アレルギー・寄生虫）でIgE産生亢進。",
    highDiseases:[
      {name:"アトピー性皮膚炎・気管支喘息",criteria:false,mechanism:"Th2炎症→IL-4・IL-13→B細胞でのIgEクラススイッチ→IgE増加。"},
      {name:"寄生虫感染症",criteria:false,mechanism:"組織侵入性寄生虫→Th2反応→IgE著増（好酸球増多を伴う）。"},
      {name:"高IgE症候群（Job症候群）",criteria:true,mechanism:"STAT3遺伝子変異→IgE著増（>2000 IU/mL）＋反復皮膚感染（黄色ブドウ球菌性湿疹）＋肺嚢腫。"},
    ],
    lowDiseases:[],excludes:[]},

  CH50: { label:"血清補体価（CH50）", brief:"補体全体の機能評価。低値→補体消費（SLE・感染症）または先天的欠乏。",
    overview:"赤血球を50%溶解する血清の希釈度。古典的経路（C1〜C9）全体の機能を反映。",
    mechanism:"免疫複合体→古典的経路活性化→補体が消費→CH50↓。先天性補体欠乏（後期補体C5〜C9欠乏）では髄膜炎菌感染リスク増加。",
    highDiseases:[],
    lowDiseases:[
      {name:"SLE（特にループス腎炎）",criteria:true,mechanism:"免疫複合体による古典的経路活性化でC3・C4が消費される。SLEの活動性指標（C3・C4・CH50が三者揃って低下）。"},
      {name:"感染性心内膜炎",criteria:false,mechanism:"細菌性免疫複合体が循環→補体消費→CH50↓。"},
      {name:"先天性補体欠乏症（C2欠乏・後期補体欠乏）",criteria:true,mechanism:"C2欠乏（最多）：SLE様疾患。後期補体（C5〜C9）欠乏：髄膜炎菌感染症の反復。"},
    ],
    excludes:[{value:"CH50正常",disease:"SLE（非活動期）",note:"SLE寛解期は補体が正常化することがある。活動期の指標として連続測定が重要。"}]},

  C3: { label:"補体 C3", brief:"補体の中心的分子。古典的・第二経路の合流点。SLE・感染症で消費→低下。",
    overview:"補体カスケードの最も重要な成分。C3は古典的経路と第二経路の両方が収束する中心点。",
    mechanism:"SLEの免疫複合体・感染症の病原体→補体活性化→C3の大量消費→血中C3↓。肝合成低下でも低下。",
    highDiseases:[{name:"急性相反応",criteria:false,mechanism:"C3は正の急性相蛋白。感染・炎症では産生増加するが、同時に消費も増えるためSLEなどでは低下する。"}],
    lowDiseases:[
      {name:"SLE（特にループス腎炎）",criteria:true,mechanism:"免疫複合体による古典的経路活性化でC3が消費される。SLEの活動性指標。"},
      {name:"膜性増殖性糸球体腎炎（MPGN）",criteria:true,mechanism:"C3ネフリティック因子（自己抗体）が第二経路を持続活性化→C3著減（C4は正常のことが多い）。"},
    ],
    excludes:[]},

  C4: { label:"補体 C4", brief:"古典的経路のみを反映（第二経路に含まれない）。SLE・遺伝性血管性浮腫（HAE）で低下。",
    overview:"C1s（C1複合体活性化後）により切断される補体成分。古典的経路（免疫複合体・抗体介在）に特異的。",
    mechanism:"SLEの免疫複合体（古典的経路）→C4消費→C4↓。C4遺伝子多型（null allele）で遺伝的にC4が低い人がいる（偽低値）。",
    highDiseases:[],
    lowDiseases:[
      {name:"SLE",criteria:true,mechanism:"古典的経路活性化によるC4消費。C3・CH50も同時低下。"},
      {name:"遺伝性血管性浮腫（HAE）",criteria:true,mechanism:"C1-INH欠乏→C4が持続的に消費→C4著減（C3は正常）。発作時に四肢・顔面・気道に浮腫。"},
    ],
    excludes:[]},

  // ════════════ 感染症マーカー ════════════
  BetaDGlu: { label:"β-Dグルカン", brief:"真菌細胞壁の構成成分。侵襲性真菌感染のスクリーニング。>11 pg/mLで陽性。クリプトコッカスとムコールは偽陰性に注意。",
    overview:"アスペルギルス・カンジダ・ニューモシスチス等の真菌細胞壁に含まれるグルカンが血中に漏出して検出される。クリプトコッカス（莢膜でグルカンが覆われる）とムコール（グルカン産生なし）は検出できない。",
    mechanism:"真菌が組織に侵入→細胞壁β-Dグルカンが血中に漏出→limulus反応で検出。",
    highDiseases:[
      {name:"侵襲性アスペルギルス症",criteria:false,mechanism:"好中球減少患者での真菌性肺炎。β-DG↑＋ガラクトマンナン↑が強く示唆。"},
      {name:"侵襲性カンジダ症",criteria:false,mechanism:"中心静脈カテーテル・腹部手術後の免疫不全者で発症。β-DG↑が早期診断に有用。"},
      {name:"ニューモシスチス肺炎（PCP）",criteria:false,mechanism:"HIV感染・免疫抑制患者での日和見感染。β-DG著増（>500 pg/mLも）が特徴。"},
    ],
    lowDiseases:[],
    excludes:[{value:"β-DG正常（<11 pg/mL）",disease:"侵襲性真菌感染症",note:"陰性予測値は高いが、クリプトコッカス・ムコールは検出できない（偽陰性）。"}]},

  // ════════════ 腫瘍マーカー ════════════
  CEA: { label:"癌胎児性抗原（CEA）", brief:"大腸癌・胃癌・肺癌・膵癌などのフォローアップに使用。診断より治療効果・再発モニタリングが主な用途。喫煙・炎症でも軽度上昇。",
    overview:"胎児期に産生される糖蛋白。悪性腫瘍で産生が再活性化される。診断特異度が低いため診断目的には向かないが、治療後の再発モニタリングに有用。",
    mechanism:"腫瘍細胞が過剰産生。喫煙・肝硬変・炎症性腸疾患でも軽度上昇する（<10 ng/mL程度）。",
    highDiseases:[
      {name:"大腸癌",criteria:false,mechanism:"大腸癌のフォローアップに最も使用される腫瘍マーカー。ステージIVでは90%で高値。"},
      {name:"胃癌・膵癌",criteria:false,mechanism:"CA19-9と組み合わせて使用。"},
      {name:"肺腺癌",criteria:false,mechanism:"非小細胞肺癌（腺癌）でCEAが上昇することが多い。"},
    ],
    lowDiseases:[],excludes:[]},

  AFP: { label:"αフェトプロテイン（AFP）", brief:"肝細胞癌・肝硬変・生殖細胞腫瘍で上昇。>200 ng/mLで肝細胞癌を強く示唆。PIVKA-IIと合わせて使用。",
    overview:"胎児期の主要血清蛋白。肝細胞癌で再活性化されて著増する。生殖細胞腫瘍（非セミノーマ）でも産生される。",
    mechanism:"肝細胞癌→発癌性肝細胞がAFPを産生。肝炎・肝硬変（肝再生）でも軽〜中等度上昇（通常<100 ng/mL）。",
    highDiseases:[
      {name:"肝細胞癌",criteria:true,mechanism:"AFP>200（特に>400）は肝細胞癌を強く示唆。PIVKA-IIと合わせてスクリーニング（6ヶ月ごと）。"},
      {name:"非セミノーマ型精巣腫瘍（卵黄嚢腫瘍成分）",criteria:true,mechanism:"卵黄嚢腫瘍はAFPを産生する。治療効果・再発のモニタリングに使用。"},
      {name:"慢性肝炎・肝硬変",criteria:false,mechanism:"肝細胞再生時にAFPが産生される。活動性肝炎の指標にもなる（通常<100 ng/mL）。"},
    ],
    lowDiseases:[],excludes:[]},

  CA199: { label:"CA19-9", brief:"膵癌・胆道癌のマーカー。膵癌の診断・フォローアップに最も使用される（感度70〜80%）。Lewis血液型b(-) a(-) では産生されない（偽陰性注意）。",
    overview:"ルイス抗原に関連した糖鎖抗原。胆道・膵管・胃腸上皮に発現。",
    mechanism:"腫瘍細胞が過剰産生。胆道系の炎症・閉塞でも上昇する。",
    highDiseases:[
      {name:"膵癌",criteria:false,mechanism:"膵癌の最重要腫瘍マーカー（感度70〜80%、特異度80〜90%）。CEAと組み合わせて感度を向上。"},
      {name:"胆道癌（胆嚢癌・肝内胆管癌・総胆管癌）",criteria:false,mechanism:"胆道癌では高率に上昇。閉塞性黄疸のみでも上昇するため画像との組み合わせが必要。"},
    ],
    lowDiseases:[],excludes:[]},

  PSA: { label:"PSA（前立腺特異抗原）", brief:"前立腺癌のスクリーニング。>4.0 ng/mLで精査対象。前立腺炎・BPHでも上昇する。",
    overview:"前立腺上皮細胞から産生される糖蛋白。前立腺に特異的（癌に特異的ではない）。",
    mechanism:"前立腺組織の増大（癌・BPH）または炎症（前立腺炎）でPSAが血中に漏出。",
    highDiseases:[
      {name:"前立腺癌",criteria:true,mechanism:"PSA>10で前立腺癌の可能性が高い（>50%）。f/tPSA比が低い（<0.1〜0.15）なら癌リスク高。"},
      {name:"良性前立腺肥大（BPH）",criteria:false,mechanism:"前立腺の物理的増大でPSAが軽度上昇（通常4〜10 ng/mL）。"},
      {name:"前立腺炎",criteria:false,mechanism:"急性前立腺炎では著明に上昇（>50 ng/mLも）。炎症消退で正常化。"},
    ],
    lowDiseases:[],excludes:[]},

  PIVKA2: { label:"PIVKA-II", brief:"肝細胞癌の特異的マーカー。>40 mAU/mLで陽性。AFPと相補的に使用（感度向上）。ワーファリン服用中は偽高値に注意。",
    overview:"ビタミンK欠乏または拮抗（ワーファリン）時に産生される異常プロトロンビン。肝細胞癌でビタミンK非依存性に産生される。",
    mechanism:"肝細胞癌細胞→ビタミンKが存在してもPIVKA-IIを産生（γカルボキシル化が障害）。ワーファリン投与でも上昇するため注意。",
    highDiseases:[{name:"肝細胞癌",criteria:true,mechanism:"AFP陰性肝細胞癌でも検出可能（AFP・PIVKAの相補性：両者で感度が向上）。>100で高リスク。"}],
    lowDiseases:[],excludes:[]},

};
赤血球破壊→LD1が著増。LD5/LD1比が低下する。" },
      { name: "急性心筋梗塞",        criteria: false, mechanism: "心筋壊死→LD1上昇。ピークは72〜96時間後（CK・トロポニンより遅れる）。" },
      { name: "悪性リンパ腫・白血病", criteria: false, mechanism: "腫瘍細胞の高い代謝活性と急速な細胞死→LDH著増。治療反応性の指標にも使用。" },
      { name: "肺塞栓症・肺梗塞",    criteria: false, mechanism: "肺組織の壊死でLD2・LD3が上昇。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  ALP: {
    label: "アルカリフォスファターゼ", brief: "肝・胆道・骨・小腸・胎盤由来。閉塞性黄疸・骨疾患で著増。γ-GTPと同時上昇なら胆道系疾患。",
    overview: "肝臓では胆管上皮細胞に多く含まれ、胆汁うっ滞で著増。骨疾患（骨芽細胞活性亢進）でも上昇。",
    mechanism: "胆汁うっ滞→胆管上皮でのALPが誘導産生増加＋胆汁への排泄阻害→血中ALP上昇。",
    highDiseases: [
      { name: "閉塞性黄疸（胆管結石・膵癌・胆管癌）", criteria: true,  mechanism: "胆道閉塞→胆汁うっ滞→胆管上皮でALPが誘導産生。γ-GTPも同時上昇。" },
      { name: "原発性硬化性胆管炎（PSC）",            criteria: true,  mechanism: "自己免疫性胆管炎症→慢性胆汁うっ滞→ALP著増。" },
      { name: "原発性胆汁性胆管炎（PBC）",            criteria: true,  mechanism: "抗ミトコンドリア抗体（AMA）陽性の自己免疫性胆管破壊→ALP著増。" },
      { name: "骨転移・骨パジェット病",               criteria: false, mechanism: "骨芽細胞活性亢進→骨由来ALPが上昇（γ-GTは正常）。" },
      { name: "成長期・妊娠後期",                     criteria: false, mechanism: "骨成長・胎盤からのALP産生（生理的上昇）。" },
    ],
    lowDiseases: [
      { name: "低フォスファターゼ症（先天性）", criteria: true, mechanism: "ALP遺伝子変異による産生低下。まれ。" },
    ],
    excludes: [],
  },

  GGT: {
    label: "γ-GTP", brief: "アルコール・薬剤・胆道系疾患で上昇。アルコール多飲の最も鋭敏なマーカー。",
    overview: "肝臓・胆管・腎臓・膵臓に多い酵素。アルコールに誘導される。胆汁うっ滞でも著増。",
    mechanism: "アルコール→肝臓でのGGT産生誘導。胆汁うっ滞→胆管上皮でGGT産生亢進。薬剤（フェニトイン等）でも誘導。",
    highDiseases: [
      { name: "アルコール性肝障害",        criteria: true,  mechanism: "アルコール代謝でGGT産生誘導。飲酒後2〜3日で上昇、禁酒後3〜6週で正常化。" },
      { name: "閉塞性黄疸・胆汁うっ滞",   criteria: true,  mechanism: "胆管上皮でGGTが産生亢進。ALPと並行して上昇。" },
      { name: "薬剤性（抗てんかん薬等）",  criteria: false, mechanism: "ミクロソーム酵素誘導によりGGTが上昇（肝細胞障害なし）。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  TBil: {
    label: "総ビリルビン", brief: "黄疸の定量指標。>2 mg/dLで肉眼的黄疸。直接/間接比で病態を鑑別。",
    overview: "Hb→ビリベルジン→ビリルビン（間接型）→肝臓で抱合→直接型→胆汁排泄。直接型増加なら肝/胆道系、間接型増加なら溶血/体質性黄疸。",
    mechanism: "溶血→間接型↑。肝細胞障害→抱合・排泄障害→両者上昇。胆道閉塞→直接型の逆流→直接型↑。",
    highDiseases: [
      { name: "閉塞性黄疸（胆管結石・膵癌）", criteria: true,  mechanism: "胆管閉塞→直接型ビリルビンが血中に逆流→直接型優位の黄疸。" },
      { name: "急性・慢性肝炎",               criteria: false, mechanism: "肝細胞障害→ビリルビン抱合・排泄が両方障害→両者上昇。" },
      { name: "溶血性貧血",                   criteria: true,  mechanism: "赤血球大量破壊→間接型優位の黄疸（肝臓の処理能力を超える）。" },
      { name: "Gilbert症候群",                criteria: false, mechanism: "UGT1A1遺伝子多型→ビリルビン抱合酵素活性低下→絶食・ストレスで間接型が上昇（良性）。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  DBil: {
    label: "直接ビリルビン", brief: "肝臓で抱合された（抱合型）ビリルビン。高値なら肝/胆道系疾患。正常なら間接型優位（溶血・体質性）。",
    overview: "肝臓でグルクロン酸抱合されたビリルビン。水溶性で尿に排泄される（閉塞性黄疸では尿が褐色になる理由）。",
    mechanism: "胆道閉塞→直接型が血中に逆流。肝細胞障害→排泄障害→直接型↑。",
    highDiseases: [
      { name: "閉塞性黄疸",  criteria: true,  mechanism: "直接型/総Bil比>50%が閉塞性黄疸の指標。ALP・GGTも同時上昇。" },
      { name: "肝炎",        criteria: false, mechanism: "肝細胞障害による排泄障害。直接・間接型ともに上昇。" },
    ],
    lowDiseases: [
      { name: "溶血性貧血（鑑別）", criteria: false, mechanism: "溶血では直接型は正常〜軽度上昇、間接型が優位に上昇する（抱合以前の段階での産生亢進）。" },
    ],
    excludes: [],
  },

  TP: {
    label: "総蛋白", brief: "低値は栄養不足・肝合成低下・腎漏出。高値は脱水・M蛋白（骨髄腫）を疑う。",
    overview: "アルブミン（約60%）＋グロブリン（IgG・IgA・IgM等）の総量。",
    mechanism: "低Albは肝合成低下・腎漏出・栄養不良。高値は脱水または免疫グロブリン増加（骨髄腫）。",
    highDiseases: [
      { name: "多発性骨髄腫", criteria: false, mechanism: "M蛋白著増→TP高値・Alb正常〜低値→A/G比逆転（γグロブリン著増）。" },
      { name: "慢性肝疾患",   criteria: false, mechanism: "Alb↓だがIgG・IgA↑→TP総量は正常〜高値のことがある。" },
    ],
    lowDiseases: [
      { name: "ネフローゼ症候群",   criteria: true,  mechanism: "大量尿蛋白（主にAlb）→低蛋白血症。" },
      { name: "重症肝不全",        criteria: false, mechanism: "全蛋白の合成が低下。" },
      { name: "栄養不良・吸収不全", criteria: false, mechanism: "蛋白の摂取・吸収が不十分。" },
    ],
    excludes: [],
  },

  Alb: {
    label: "アルブミン", brief: "肝合成能・栄養状態の指標。<3.5 g/dLで低アルブミン血症。慢性疾患・ネフローゼ・肝不全で低下。",
    overview: "肝臓で産生される主要な血清蛋白。半減期14〜20日で慢性の肝障害・栄養状態を反映。膠質浸透圧の維持、薬物・ホルモンの輸送にも関与。",
    mechanism: "肝合成低下（肝硬変）・腎漏出（ネフローゼ）・炎症（急性相でAlb↓）・低栄養で低下。",
    highDiseases: [],
    lowDiseases: [
      { name: "肝硬変・慢性肝不全",  criteria: true,  mechanism: "肝細胞の機能的減少→合成が慢性的に低下。Child-Pugh分類の重要指標。" },
      { name: "ネフローゼ症候群",    criteria: true,  mechanism: "糸球体透過性亢進→Albが尿中に大量漏出（>3.5 g/日）→血中Alb↓。" },
      { name: "炎症（急性相反応）",  criteria: false, mechanism: "IL-6等がAlb合成を抑制（Negative acute-phase protein）。CRPと逆方向に動く。" },
      { name: "低栄養・吸収不全",   criteria: false, mechanism: "蛋白合成材料（アミノ酸）の不足。" },
      { name: "蛋白漏出性胃腸症",   criteria: false, mechanism: "腸管粘膜からAlbが漏出。浮腫・低Albが主症状。" },
    ],
    excludes: [
      { value: "Alb正常（>3.5）", disease: "ネフローゼ症候群", note: "診断基準としてAlb≤3.0 g/dLが必要。Alb正常ならネフローゼ診断不可。" },
    ],
  },

  ChE: {
    label: "コリンエステラーゼ", brief: "肝臓の合成能の指標。低値は肝硬変・有機リン中毒。高値はネフローゼ・脂肪肝。",
    overview: "肝臓で合成される酵素。半減期約10日で慢性的な肝合成能の低下を反映。有機リン系農薬により阻害される。",
    mechanism: "肝細胞機能低下→ChE産生減少→血清ChE↓。有機リンにより不可逆的に阻害される。",
    highDiseases: [
      { name: "ネフローゼ症候群", criteria: false, mechanism: "低Alb血症への補償として肝臓での蛋白合成が亢進→ChEも上昇。" },
    ],
    lowDiseases: [
      { name: "肝硬変・肝不全",   criteria: true,  mechanism: "肝細胞減少→ChE産生低下。Albと並行して低下。Child-Pugh準拠の重症度評価に使用。" },
      { name: "有機リン農薬中毒", criteria: true,  mechanism: "ChEが有機リンにより不可逆的に阻害→ChE著減。コリン作動性クリーゼ（縮瞳・流涎・徐脈・気管支攣縮）。" },
    ],
    excludes: [],
  },

  AMY: {
    label: "アミラーゼ", brief: "膵臓・唾液腺由来。膵炎で著増（3倍以上）。耳下腺炎でも上昇。腎不全で排泄低下→上昇。",
    overview: "主に膵臓（膵型）と唾液腺（唾液型）から産生。血中半減期が短く（2〜3時間）、急性膵炎では発症後2〜12時間で上昇し3〜5日で正常化。",
    mechanism: "膵炎→膵腺房細胞障害→膵液中のアミラーゼが血中に漏出。腎排泄障害（腎不全）でも上昇。",
    highDiseases: [
      { name: "急性膵炎",      criteria: true,  mechanism: "膵腺房細胞の急性炎症・壊死→アミラーゼが大量に血中へ漏出。正常上限の3倍以上が診断基準。" },
      { name: "耳下腺炎（ムンプス）", criteria: false, mechanism: "唾液腺由来アミラーゼ（唾液型）が増加。膵型との鑑別はアイソザイム分析。" },
      { name: "慢性腎不全",    criteria: false, mechanism: "腎排泄能低下でアミラーゼが血中に蓄積（上限の2〜3倍程度）。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  // ════════════ 腎機能 ════════════

  BUN: {
    label: "尿素窒素", brief: "腎機能の指標。高値は腎不全・脱水・消化管出血。BUN/Cre比>20は前腎性（脱水・出血）を示唆。",
    overview: "アミノ酸代謝の最終産物。肝臓で産生され腎糸球体で自由に濾過される。GFR低下で蓄積。蛋白摂取量・消化管出血にも影響される。",
    mechanism: "GFR低下→BUN排泄低下→蓄積。高蛋白食・消化管出血・高異化状態でも増加。脱水では前腎性に上昇（BUNがCreより相対的に多く上昇）。",
    highDiseases: [
      { name: "急性・慢性腎不全",  criteria: true,  mechanism: "GFR低下→BUN排泄障害。Cre同時上昇。尿毒症症状（>60 mg/dL）に注意。" },
      { name: "脱水（前腎性）",    criteria: false, mechanism: "腎血流低下→GFR低下。BUN/Cre比>20が前腎性の指標。" },
      { name: "消化管出血",        criteria: false, mechanism: "腸管内での血液蛋白消化・吸収→尿素産生増加。BUN↑だがCre正常→BUN/Cre比>20。" },
    ],
    lowDiseases: [
      { name: "重症肝不全",        criteria: false, mechanism: "肝臓での尿素合成能低下→BUN↓。アンモニア↑（肝性脳症の原因）。" },
      { name: "低蛋白食・低栄養",  criteria: false, mechanism: "アミノ酸代謝産物として尿素が減少。" },
    ],
    excludes: [],
  },

  Cre: {
    label: "クレアチニン", brief: "筋肉由来。GFRの最重要指標。筋肉量に依存（高齢者・女性は基準値が低め）。BUNより腎機能を正確に反映。",
    overview: "筋肉でクレアチンから産生。ほぼ全量が糸球体で濾過され尿細管での再吸収はほとんどない。産生量が一定なので変動はほぼGFR変化を反映。",
    mechanism: "GFR低下→Cre排泄低下→血中に蓄積。筋肉量が多い人（男性・若年）は産生量が多く基準値が高い。",
    highDiseases: [
      { name: "CKD",          criteria: true,  mechanism: "GFR低下→Cre排泄低下。eGFR算出に使用。" },
      { name: "AKI",          criteria: true,  mechanism: "急激なGFR低下（虚血・腎毒性薬物・尿路閉塞）→Cre急上昇。48時間以内に≥0.3 mg/dL上昇がAKI診断基準。" },
      { name: "横紋筋融解症", criteria: false, mechanism: "筋肉大量崩壊→クレアチン産生→Cre↑（同時にCK著増・ミオグロビン尿）。" },
    ],
    lowDiseases: [
      { name: "筋ジストロフィー・高齢・低筋肉量", criteria: false, mechanism: "筋肉量が少ない→クレアチン産生減少→Cre低値。腎機能障害を見落とす危険（eGFR計算時に過大評価）。" },
    ],
    excludes: [
      { value: "Cre正常かつeGFR>60", disease: "CKD（G1-2）", note: "CKD G1・G2はCre正常でも蛋白尿や尿沈渣異常で診断される。Cre正常のみでCKDを否定しない。" },
    ],
  },

  eGFR: {
    label: "推算GFR", brief: "腎機能の総合指標。<60で3ヶ月以上続けばCKD。G1〜G5でステージ分類。透析適応はG5（<15）。",
    overview: "年齢・性別・血清クレアチニンから算出。CKD重症度分類：G1≥90、G2 60-89、G3a 45-59、G3b 30-44、G4 15-29、G5<15。",
    mechanism: "Creと逆相関（GFR低下→Cre上昇→eGFR低下）。",
    highDiseases: [],
    lowDiseases: [
      { name: "CKD（G3以下）",  criteria: true,  mechanism: "eGFR<60が3ヶ月以上持続。原因疾患の治療と合併症管理が必要。" },
      { name: "AKI",            criteria: true,  mechanism: "急激なeGFR低下。前腎性・腎性・後腎性の原因同定と迅速な対応が必要。" },
    ],
    excludes: [],
  },

  UA: {
    label: "尿酸", brief: "プリン体代謝産物。>7.0 mg/dLで高尿酸血症。痛風発作・尿路結石・腎障害のリスク。",
    overview: "プリン体がキサンチンオキシダーゼにより代謝された最終産物。腎臓から排泄される。尿酸塩結晶が関節に沈着すると痛風発作を起こす。",
    mechanism: "産生過剰（多食・腫瘍崩壊症候群）または排泄低下（腎不全・利尿薬）で上昇。",
    highDiseases: [
      { name: "痛風",              criteria: true,  mechanism: "高尿酸血症→尿酸塩結晶が母趾MTP関節に沈着→マクロファージ貪食→急性炎症（痛風発作）。" },
      { name: "腫瘍崩壊症候群",    criteria: true,  mechanism: "化学療法後→大量の核酸分解→UA著増（同時に高K・高P・低Ca）。" },
      { name: "慢性腎不全",        criteria: false, mechanism: "腎排泄低下でUAが蓄積。" },
    ],
    lowDiseases: [
      { name: "Fanconi症候群",   criteria: false, mechanism: "近位尿細管機能障害→尿酸再吸収低下→UA↓。" },
      { name: "キサンチン尿症",  criteria: true,  mechanism: "キサンチンオキシダーゼ欠損→尿酸産生低下。まれ。" },
    ],
    excludes: [],
  },

  // ════════════ 筋酵素・心マーカー ════════════

  CK: {
    label: "クレアチンキナーゼ", brief: "骨格筋・心筋・脳の障害マーカー。横紋筋融解症・筋ジストロフィーで著増。",
    overview: "CK-MM（骨格筋）・CK-MB（心筋）・CK-BB（脳）の3アイソザイム。筋細胞膜の傷害→細胞内CKが漏出。",
    mechanism: "筋細胞膜の傷害→CKが血中へ漏出。激しい運動後も生理的に上昇する。",
    highDiseases: [
      { name: "急性心筋梗塞（AMI）", criteria: true,  mechanism: "心筋壊死→CK-MB漏出。発症後4〜8時間で上昇、24時間でピーク、72時間で正常化。" },
      { name: "横紋筋融解症",        criteria: true,  mechanism: "外傷・薬剤（スタチン）・運動・熱中症→骨格筋大量崩壊→CK-MM著増（10,000 IU/L以上も）。ミオグロビン尿→AKI。" },
      { name: "筋ジストロフィー",    criteria: true,  mechanism: "デュシェンヌ型ではジストロフィン欠損→CK持続高値（10,000〜100,000 IU/L）。" },
      { name: "多発性筋炎・皮膚筋炎", criteria: true, mechanism: "自己免疫性筋炎→骨格筋炎症性破壊→CK著増。" },
      { name: "甲状腺機能低下症",    criteria: false, mechanism: "筋代謝低下・筋細胞膜透過性亢進→CK軽〜中等度上昇。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  Trop: {
    label: "トロポニン（TnI/TnT）", brief: "心筋壊死の最も特異的なマーカー。AMIで4〜6時間後に上昇し7〜14日持続。",
    overview: "心筋に特異的な収縮蛋白。高感度アッセイ（hs-TnI）では発症後1〜3時間で上昇（感度>95%）。",
    mechanism: "心筋細胞の不可逆的壊死→トロポニン血中へ漏出。半減期が長い（7〜14日）。",
    highDiseases: [
      { name: "急性心筋梗塞（STEMI・NSTEMI）", criteria: true,  mechanism: "冠動脈閉塞→心筋虚血→壊死→トロポニン漏出。" },
      { name: "急性心筋炎",          criteria: false, mechanism: "ウイルス性炎症→心筋細胞破壊→Trop上昇。若年者で心電図変化＋Trop上昇なら心筋炎を考慮。" },
      { name: "肺塞栓症（大型）",    criteria: false, mechanism: "右室負荷→右室心筋の虚血・壊死→Trop上昇。予後不良の指標。" },
      { name: "腎不全",              criteria: false, mechanism: "排泄低下により軽度のTrop上昇（特にTnT）。心筋梗塞との鑑別が必要。" },
    ],
    lowDiseases: [],
    excludes: [
      { value: "hs-TnI正常（2回測定・0h＋3h）", disease: "急性心筋梗塞", note: "発症0h・3h両方正常であればAMIをほぼ否定できる（感度>99%）。ただし発症<2hは偽陰性に注意。" },
    ],
  },

  BNP: {
    label: "BNP", brief: "心室壁伸展・容量負荷を反映。>18.4 pg/mLで心不全の可能性。<35でほぼ否定。息切れの鑑別に有用。",
    overview: "主に心室筋から分泌。心室壁の伸展（容量過負荷・圧負荷）により産生亢進。腎排泄されるため腎不全では偽高値に注意。",
    mechanism: "心室壁ストレス（容量過負荷・圧負荷）→BNP産生・分泌亢進。",
    highDiseases: [
      { name: "心不全（HFrEF・HFpEF）", criteria: true,  mechanism: "心室壁の伸展・圧負荷→BNP産生亢進。BNP>100（NT-proBNP>300）で心不全を強く示唆。" },
      { name: "肺高血圧症",             criteria: false, mechanism: "右室への圧負荷→BNP産生。重症度・予後指標。" },
    ],
    lowDiseases: [],
    excludes: [
      { value: "BNP<35 pg/mL", disease: "心不全", note: "息切れの原因が心不全である可能性をほぼ否定できる（除外診断に有用）。" },
    ],
  },

  // ════════════ 糖代謝 ════════════

  Glu: {
    label: "血糖（空腹時）", brief: "空腹時≥126 mg/dLで糖尿病。100〜125 mg/dLは境界型。低血糖<70 mg/dLは危険。",
    overview: "空腹時（8時間以上絶食後）の血糖値。糖尿病診断基準：空腹時≥126、随時≥200、OGTT 2h値≥200、HbA1c≥6.5%のいずれか。",
    mechanism: "インスリン分泌不足または抵抗性→血糖上昇。ストレス・感染症では反調節ホルモン（コルチゾール・カテコラミン）が血糖を上昇させる。",
    highDiseases: [
      { name: "1型糖尿病", criteria: true,  mechanism: "自己免疫によるβ細胞破壊→インスリン絶対的欠乏→高血糖（DKA合併リスク高い）。" },
      { name: "2型糖尿病", criteria: true,  mechanism: "インスリン分泌低下＋抵抗性（肥満・運動不足・遺伝的素因）→高血糖。" },
      { name: "Cushing症候群", criteria: false, mechanism: "コルチゾール過剰→肝糖新生促進＋インスリン抵抗性→高血糖（ステロイド糖尿病）。" },
      { name: "急性膵炎・慢性膵炎（後期）", criteria: false, mechanism: "β細胞の炎症性・線維性破壊→インスリン分泌低下→膵性糖尿病。" },
    ],
    lowDiseases: [
      { name: "インスリノーマ",  criteria: true,  mechanism: "腫瘍がインスリンを自律的に分泌→低血糖発作（Whippleの三徴：低血糖症状・血糖<50・ブドウ糖投与で改善）。" },
      { name: "Addison病",       criteria: false, mechanism: "コルチゾール低下→糖新生低下→空腹時低血糖。" },
    ],
    excludes: [],
  },

  HbA1c: {
    label: "HbA1c", brief: "過去1〜2ヶ月の平均血糖コントロールの指標。≥6.5%で糖尿病診断基準の一つ。治療目標は<7.0%。",
    overview: "赤血球中のヘモグロビンにグルコースが非酵素的に結合した割合。赤血球寿命（約120日）の間の平均血糖を反映。",
    mechanism: "血糖が高いほどHbへの糖化が進む。溶血性貧血では赤血球寿命短縮→HbA1cは実際の血糖より低く出る（偽低値）。",
    highDiseases: [
      { name: "糖尿病（1型・2型）", criteria: true, mechanism: "持続的高血糖→HbA1cが上昇。≥6.5%が糖尿病診断基準の一つ。" },
    ],
    lowDiseases: [
      { name: "溶血性貧血（偽低値）", criteria: false, mechanism: "赤血球寿命短縮→糖化される時間が短い→HbA1c↓。実際の血糖より低く出るため注意。" },
      { name: "妊娠（偽低値）",       criteria: false, mechanism: "赤血球寿命短縮＋血漿量増大→相対的にHbA1c↓。妊娠糖尿病ではHbA1cより血糖を重視。" },
    ],
    excludes: [],
  },

  Ins: {
    label: "インスリン（空腹時）", brief: "膵β細胞の分泌能指標。HOMA-IR = Ins × Glu / 405 でインスリン抵抗性を評価（>2.5で抵抗性あり）。",
    overview: "膵β細胞から分泌されるペプチドホルモン。肝・筋・脂肪組織でのグルコース取り込みを促進。",
    mechanism: "高血糖・高アミノ酸→インスリン分泌。インスリン抵抗性があれば同じ血糖値でも高インスリン血症になる。",
    highDiseases: [
      { name: "インスリン抵抗性・2型糖尿病（早期）", criteria: false, mechanism: "インスリン抵抗性→血糖を下げるために代償的に多量のインスリンを分泌→高インスリン血症。" },
      { name: "インスリノーマ",           criteria: true,  mechanism: "自律的なインスリン分泌→低血糖時でも高インスリン（Ins>3 μU/mLかつGlu<50 mg/dL）。" },
    ],
    lowDiseases: [
      { name: "1型糖尿病", criteria: true, mechanism: "β細胞破壊→インスリン絶対的欠乏。Cペプチドも低値。" },
    ],
    excludes: [],
  },

  CPep: {
    label: "Cペプチド", brief: "インスリン分泌能の指標（外因性インスリンに影響されない）。1型と2型糖尿病の鑑別に有用。",
    overview: "プロインスリンがインスリンとCペプチドに等モル切断。内因性インスリン分泌量の指標。",
    mechanism: "β細胞機能を反映。1型ではCペプチドが低下。2型では正常〜高値。",
    highDiseases: [
      { name: "インスリノーマ", criteria: true, mechanism: "腫瘍からの自律的インスリン分泌→Cペプチドも高値（外因性インスリン投与との鑑別に重要）。" },
    ],
    lowDiseases: [
      { name: "1型糖尿病",       criteria: true,  mechanism: "β細胞破壊→インスリン・Cペプチドともに低下。<0.5 ng/mLはインスリン依存状態の指標。" },
    ],
    excludes: [],
  },

  AG1_5: {
    label: "1,5-アンヒドログルシトール（1,5-AG）", brief: "最近1〜2週間の血糖変動のマーカー。低値=高血糖エピソードあり。HbA1cが正常でも食後高血糖を検出できる。",
    overview: "食事由来のポリオール。血糖が高いとブドウ糖と尿細管での再吸収を競合するため尿中排泄が増加→血中低下。",
    mechanism: "高血糖→1,5-AGの尿細管再吸収が競合阻害→尿中排泄増加→血中濃度低下。",
    highDiseases: [],
    lowDiseases: [
      { name: "糖尿病（食後高血糖）", criteria: false, mechanism: "食後高血糖エピソードがあれば1,5-AGが低下。食後血糖コントロールの指標。" },
    ],
    excludes: [],
  },

  // ════════════ 脂質代謝 ════════════

  TC: {
    label: "総コレステロール", brief: "LDL・HDL・VLDLの合計。単独での評価は少なく内訳が重要。",
    overview: "LDL・HDL・VLDL（TG/5で近似）の合計。",
    mechanism: "主に肝臓でコレステロールが合成されLDLとして末梢に運搬される。",
    highDiseases: [
      { name: "家族性高コレステロール血症（FH）", criteria: true,  mechanism: "LDL受容体遺伝子変異→LDLが末梢に取り込まれず→TC・LDL著増。" },
      { name: "甲状腺機能低下症",  criteria: false, mechanism: "LDH受容体発現低下→LDL代謝低下→TC↑。" },
      { name: "ネフローゼ症候群",  criteria: false, mechanism: "低Alb→肝での脂質産生亢進（代償）→TC著増。" },
    ],
    lowDiseases: [
      { name: "重症肝不全",  criteria: false, mechanism: "肝臓でのコレステロール合成能低下→TC↓。予後不良の指標。" },
    ],
    excludes: [],
  },

  TG: {
    label: "中性脂肪", brief: "≥150 mg/dLで高TG血症。>500でパネル性膵炎リスク。食後・アルコール・糖尿病で上昇。",
    overview: "グリセロールに3本の脂肪酸が結合したエネルギー貯蔵物質。食後に上昇するため空腹時採血が必要。",
    mechanism: "カロリー・糖質過剰摂取→肝臓でVLDL産生増加→TG↑。インスリン不足（糖尿病）→リポプロテインリパーゼ活性低下→TG↑。",
    highDiseases: [
      { name: "家族性高TG血症",        criteria: true,  mechanism: "LPL遺伝子・ApoC-II変異→VLDL分解低下→TG著増（>1000 mg/dLも）。急性膵炎の危険。" },
      { name: "2型糖尿病・インスリン抵抗性", criteria: false, mechanism: "インスリン抵抗性→LPL活性低下→TG代謝低下。" },
      { name: "アルコール多飲",         criteria: false, mechanism: "アルコール→肝臓でのVLDL産生亢進→TG↑。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  HDL: {
    label: "HDLコレステロール", brief: "善玉コレステロール。<40 mg/dLで低HDL血症（動脈硬化リスク増加）。",
    overview: "末梢組織から余剰コレステロールを回収して肝臓に運ぶ（逆転送）。低HDLは独立した冠動脈疾患リスク因子。",
    mechanism: "運動・禁煙でHDL↑。肥満・糖尿病・高TG・喫煙・運動不足でHDL↓。",
    highDiseases: [],
    lowDiseases: [
      { name: "メタボリックシンドローム", criteria: true,  mechanism: "内臓脂肪→遊離脂肪酸増加→肝VLDL産生亢進→TG↑・HDL↓（HDLがTGリッチVLDLと交換されて分解される）。" },
      { name: "家族性低HDL血症（Tangier病等）", criteria: true, mechanism: "ABC-A1遺伝子変異→HDL合成低下→HDL著減。" },
    ],
    excludes: [],
  },

  LDL: {
    label: "LDLコレステロール", brief: "悪玉コレステロール。≥140 mg/dLで高LDL血症。動脈硬化・冠動脈疾患のリスク。スタチンの主な治療ターゲット。",
    overview: "コレステロールを末梢に運搬するリポタンパク。酸化LDLが動脈壁に沈着し粥状動脈硬化を形成。",
    mechanism: "LDL受容体の発現低下（FH・甲状腺機能低下症）またはLDL産生過剰でLDL↑。",
    highDiseases: [
      { name: "家族性高コレステロール血症（FH）", criteria: true, mechanism: "LDL受容体遺伝子変異→LDLが末梢組織に取り込まれず血中に蓄積。若年での心筋梗塞リスク。" },
      { name: "甲状腺機能低下症", criteria: false, mechanism: "LDR受容体発現低下→LDL代謝低下→LDL↑。" },
      { name: "ネフローゼ症候群", criteria: false, mechanism: "肝臓での脂質産生亢進→LDL↑。" },
    ],
    lowDiseases: [
      { name: "重症肝不全",  criteria: false, mechanism: "肝臓でのLDL合成・VLDL産生低下→LDL低値。" },
    ],
    excludes: [],
  },

  // ════════════ 電解質 ════════════

  Na: {
    label: "ナトリウム", brief: "細胞外液の主要陽イオン。低Na（<136）は最多の電解質異常。高Na（>145）は脱水・尿崩症。",
    overview: "細胞外液浸透圧の調節に中心的役割。ADH（抗利尿ホルモン）が水の再吸収を調節しNaと水のバランスを維持。",
    mechanism: "低Na：水過剰（SIADH・心不全・肝硬変）または塩分不足（Addison病）。高Na：水不足（脱水・尿崩症）または塩分過剰。",
    highDiseases: [
      { name: "脱水（水欠乏型）",   criteria: false, mechanism: "自由水の不足→血漿浸透圧↑→相対的Na過剰。" },
      { name: "尿崩症（中枢性・腎性）", criteria: true, mechanism: "ADH欠乏または腎の無反応→水が保持できず大量の薄い尿→血中Na↑。" },
    ],
    lowDiseases: [
      { name: "SIADH",                      criteria: true,  mechanism: "ADH不適切分泌（肺癌・中枢神経疾患・薬剤）→水保持→希釈性低Na血症。尿Na高値・尿浸透圧高値が特徴。" },
      { name: "心不全・肝硬変・ネフローゼ",  criteria: false, mechanism: "有効循環血漿量の低下→ADH代償性分泌↑→水保持→希釈性低Na。浮腫を伴う。" },
      { name: "Addison病（副腎不全）",       criteria: true,  mechanism: "アルドステロン欠乏→腎でのNa再吸収低下→Na喪失（同時に高K血症）。" },
    ],
    excludes: [],
  },

  K: {
    label: "カリウム", brief: "心筋興奮性の制御に重要。<3.0で致死性不整脈のリスク。>6.0でも致死的。最も危険な電解質異常の一つ。",
    overview: "細胞内液の主要陽イオン。心筋・骨格筋・神経の興奮性に不可欠。腎臓で主に調節（アルドステロン→K排泄増加）。",
    mechanism: "低K：下痢・嘔吐・アルドステロン過剰・利尿薬・インスリン（細胞内移動）。高K：腎排泄低下（腎不全）・細胞外移動（アシドーシス）・Addison病。",
    highDiseases: [
      { name: "急性腎不全・CKD末期", criteria: true,  mechanism: "K排泄低下→高K血症。K>6.0 mEq/Lで心電図変化（テント状T波）、>7.0で心停止リスク。" },
      { name: "Addison病",          criteria: true,  mechanism: "アルドステロン欠乏→腎でのK排泄低下→高K血症（同時に低Na血症）。" },
      { name: "代謝性アシドーシス",  criteria: false, mechanism: "H+が細胞内に入る際にK+が細胞外に出る（H+/K+交換）→血清K↑。" },
      { name: "横紋筋融解症・溶血",  criteria: false, mechanism: "細胞内Kが大量放出→高K血症。" },
    ],
    lowDiseases: [
      { name: "原発性アルドステロン症", criteria: true,  mechanism: "アルドステロン過剰→腎でのK排泄増加→低K血症（同時に高血圧）。" },
      { name: "嘔吐・下痢",            criteria: false, mechanism: "消化管からのK喪失。嘔吐では代謝性アルカローシスも合併し腎でのK排泄も増加。" },
      { name: "ループ利尿薬・チアジド", criteria: false, mechanism: "ヘンレ係蹄・遠位尿細管でのMg再吸収阻害→尿中K排泄増加。" },
      { name: "インスリン投与",         criteria: false, mechanism: "インスリン→Na/K-ATPase活性化→K細胞内移動→低K（DKA治療時に注意）。" },
    ],
    excludes: [],
  },

  Cl: {
    label: "クロール", brief: "Na・HCO3とともに酸塩基平衡の評価に使用。陰イオンギャップ（AG = Na - (Cl + HCO3)）の計算に必要。",
    overview: "細胞外液の主要陰イオン。AG（正常値8〜12 mEq/L）の計算に使用。",
    mechanism: "AG上昇型代謝性アシドーシス（乳酸・ケトン）ではCl正常。AG正常型代謝性アシドーシス（下痢・RTA）ではCl↑。",
    highDiseases: [
      { name: "高Cl性代謝性アシドーシス（下痢・RTA）", criteria: false, mechanism: "下痢でHCO3喪失→代償としてCl保持→高Cl性アシドーシス（AG正常型）。" },
    ],
    lowDiseases: [
      { name: "嘔吐（代謝性アルカローシス）", criteria: false, mechanism: "胃酸（HCl）の喪失→Cl↓・HCO3↑→代謝性アルカローシス。" },
    ],
    excludes: [],
  },

  Ca: {
    label: "カルシウム", brief: "高Ca（>10.5）はPTH・VD過剰・悪性腫瘍。低Ca（<8.5）はPTH欠乏・VD欠乏・腎不全。補正Ca = 実測Ca + 0.8×(4-Alb)。",
    overview: "血清Ca：イオン化Ca（活性型、約50%）＋アルブミン結合Ca（約40%）＋複合体Ca（約10%）。低Alb血症では補正Ca計算が必須。",
    mechanism: "PTH→骨からCa動員・腎でのCa再吸収増加・VD活性化→Ca↑。悪性腫瘍関連高Ca：PTHrP産生または骨転移。",
    highDiseases: [
      { name: "原発性副甲状腺機能亢進症", criteria: true,  mechanism: "副甲状腺腺腫（99%）→PTH自律分泌→Ca↑・P↓・尿Ca↑。多くは無症候性（健診で偶然発見）。" },
      { name: "悪性腫瘍関連高Ca血症",    criteria: true,  mechanism: "PTHrP産生（扁平上皮癌・腎癌・乳癌）または骨転移によるサイトカインでCa↑。PTH低値で鑑別。" },
      { name: "サルコイドーシス",         criteria: false, mechanism: "肉芽腫内でのVD活性化（1α-水酸化酵素）→VD産生亢進→Ca↑。" },
      { name: "多発性骨髄腫",             criteria: false, mechanism: "IL-6等による骨吸収亢進＋腎障害（排泄低下）→高Ca。CRAB基準の一つ。" },
    ],
    lowDiseases: [
      { name: "副甲状腺機能低下症",       criteria: true,  mechanism: "PTH欠乏（手術後・自己免疫）→Ca動員低下・腎Ca再吸収低下→低Ca。テタニー・痙攣。" },
      { name: "ビタミンD欠乏症",          criteria: true,  mechanism: "腸管Ca吸収低下→低Ca→PTH↑（二次性副甲状腺機能亢進症）→骨吸収→骨密度低下。" },
      { name: "慢性腎不全",               criteria: false, mechanism: "活性型VD産生低下→腸管Ca吸収低下→低Ca→二次性副甲状腺機能亢進症。" },
    ],
    excludes: [],
  },

  P: {
    label: "リン", brief: "腎機能・PTH・VDで調節。PTH高値→P低下。腎不全→P上昇。高P血症は血管石灰化を促進。",
    overview: "骨の構成成分、ATP合成、細胞膜の材料。主に腎臓で調節（PTH→P排泄増加、VD→P吸収増加）。",
    mechanism: "PTH↑→腎でのP排泄増加→低P。腎不全→P排泄低下→高P。",
    highDiseases: [
      { name: "慢性腎不全（CKD）", criteria: true,  mechanism: "GFR低下→P排泄低下→高P血症→血管石灰化。CKD-MBDの中心。" },
      { name: "副甲状腺機能低下症", criteria: true,  mechanism: "PTH欠乏→腎でのP排泄低下→高P（同時に低Ca）。" },
    ],
    lowDiseases: [
      { name: "原発性副甲状腺機能亢進症", criteria: true,  mechanism: "PTH過剰→腎でのP排泄増加→低P（同時に高Ca）。" },
      { name: "Fanconi症候群",            criteria: false, mechanism: "近位尿細管機能障害→P再吸収低下→腎性P喪失。" },
      { name: "リフィーディング症候群",   criteria: true,  mechanism: "長期絶食後の再栄養→インスリン→P・K・Mgが細胞内に移行→急激な低P→心不全・呼吸不全。" },
    ],
    excludes: [],
  },

  Mg: {
    label: "マグネシウム", brief: "低Mg血症は低K・低Ca血症の原因になる。利尿薬・アルコール・下痢で低下。",
    overview: "300種以上の酵素の補因子。Na/K-ATPaseにも必要。低Mg血症では腎でのK排泄増加→低K血症が難治性になる。",
    mechanism: "ループ・チアジド利尿薬→腎Mg排泄増加。アルコール→腸管吸収低下＋腎排泄増加。",
    highDiseases: [
      { name: "腎不全",   criteria: false, mechanism: "腎排泄低下→Mg蓄積。Mg>4 mEq/Lで深部腱反射消失、>6で呼吸抑制。" },
    ],
    lowDiseases: [
      { name: "アルコール依存症",   criteria: false, mechanism: "摂取不足＋腸管吸収低下＋腎排泄増加の三重苦。振戦・痙攣の原因。" },
      { name: "難治性低K・低Ca血症", criteria: false, mechanism: "低MgでNa/K-ATPaseが障害→低Kが改善しない。低MgでPTH分泌も抑制→低Caも難治性。" },
    ],
    excludes: [],
  },

  HCO3: {
    label: "重炭酸イオン（HCO3-）", brief: "酸塩基平衡のアルカリ側。低下→代謝性アシドーシス、上昇→代謝性アルカローシス。血液ガスと合わせて解釈。",
    overview: "血漿中の主要な緩衝系。正常値22〜26 mEq/L。",
    mechanism: "下痢・RTA→HCO3喪失→低下。嘔吐・利尿薬→H+喪失→HCO3相対的増加。",
    highDiseases: [
      { name: "代謝性アルカローシス（嘔吐・利尿薬）", criteria: true, mechanism: "胃酸喪失またはH+の腎排泄増加→HCO3相対的増加。低K血症を合併することが多い。" },
    ],
    lowDiseases: [
      { name: "糖尿病性ケトアシドーシス（DKA）", criteria: true,  mechanism: "インスリン欠乏→脂肪分解→ケトン体産生→AG上昇型アシドーシス→HCO3消費。" },
      { name: "乳酸アシドーシス",                criteria: true,  mechanism: "組織低酸素→嫌気性解糖→乳酸産生→HCO3消費（AG上昇型）。" },
      { name: "腎尿細管性アシドーシス（RTA）",   criteria: true,  mechanism: "遠位型（1型）：H+排泄障害。近位型（2型）：HCO3再吸収障害。AG正常型アシドーシス。" },
    ],
    excludes: [],
  },

  // ════════════ 内分泌（甲状腺） ════════════

  TSH: {
    label: "TSH（甲状腺刺激ホルモン）", brief: "甲状腺機能の最も鋭敏な指標。低値→機能亢進。高値→機能低下（原発性）。",
    overview: "下垂体前葉から分泌。甲状腺でのT3・T4産生を刺激。フィードバック制御：T3・T4↑→TSH↓。",
    mechanism: "原発性甲状腺機能低下症→T4↓→フィードバック解除→TSH著増。機能亢進症→T3・T4↑→TSH抑制。",
    highDiseases: [
      { name: "原発性甲状腺機能低下症（橋本病）", criteria: true, mechanism: "甲状腺破壊→T4↓→TSH著増。TSH>10 μIU/mLで治療を考慮。" },
      { name: "潜在性甲状腺機能低下症",          criteria: true, mechanism: "TSH上昇＋FT4正常。妊婦・高TSH（>10）では治療。" },
    ],
    lowDiseases: [
      { name: "バセドウ病（Graves病）", criteria: true,  mechanism: "TRAb→TSH受容体を持続刺激→T3・T4過剰産生→TSH抑制（<0.1 μIU/mL）。" },
      { name: "中枢性甲状腺機能低下症", criteria: true,  mechanism: "下垂体障害→TSH産生低下→FT4低下（TSH低値＋FT4低値という稀な組み合わせ）。" },
    ],
    excludes: [
      { value: "TSH正常（0.5〜5.0）", disease: "甲状腺機能異常", note: "TSH正常なら原発性甲状腺機能亢進症・低下症はほぼ否定できる。中枢性は例外。" },
    ],
  },

  FT3: {
    label: "遊離T3（FT3）", brief: "甲状腺ホルモンの活性型。亢進症でT4より先に上昇。低T3症候群（重篤疾患）に注意。",
    overview: "最も生物活性の高い甲状腺ホルモン。T4→T3変換酵素（5'-脱ヨウ素酵素）で産生。",
    mechanism: "重篤な全身疾患（飢餓・肝不全等）では5'-脱ヨウ素酵素低下→T4→T3変換低下→FT3↓（低T3症候群）。",
    highDiseases: [
      { name: "T3型甲状腺中毒症", criteria: true, mechanism: "T4正常だがFT3のみ著増するT3優位型。FT3↑＋TSH↓＋FT4正常。" },
    ],
    lowDiseases: [
      { name: "低T3症候群（sick euthyroid）", criteria: false, mechanism: "重症疾患・飢餓・術後→T4→T3変換低下→FT3↓（TSH正常・FT4正常）。真の甲状腺疾患ではない。" },
      { name: "甲状腺機能低下症",            criteria: true,  mechanism: "TSH↑・FT4↓と並行してFT3も低下。" },
    ],
    excludes: [],
  },

  FT4: {
    label: "遊離T4（FT4）", brief: "甲状腺ホルモン（貯蔵・輸送型）。TSH低値＋FT4高値→機能亢進。TSH高値＋FT4低値→機能低下。",
    overview: "甲状腺が主に産生する不活性型ホルモン（T4）の遊離型。末梢でT3に変換される。",
    mechanism: "甲状腺での産生が反映される。TSHとのフィードバック制御で調節される。",
    highDiseases: [
      { name: "バセドウ病",     criteria: true,  mechanism: "TRAb→甲状腺を持続刺激→T4・T3過剰産生→FT4↑・TSH↓。" },
      { name: "亜急性甲状腺炎", criteria: false, mechanism: "ウイルス性炎症→甲状腺破壊→貯蔵ホルモンが一過性に血中へ漏出→FT4↑→その後低下期。" },
    ],
    lowDiseases: [
      { name: "橋本病（慢性甲状腺炎）", criteria: true, mechanism: "自己免疫による甲状腺破壊→T4産生低下→FT4↓・TSH↑。" },
      { name: "中枢性甲状腺機能低下症", criteria: true, mechanism: "下垂体障害→TSH産生低下→甲状腺刺激不足→FT4↓（TSH低値or正常）。" },
    ],
    excludes: [],
  },

  TRAb: {
    label: "TSH受容体抗体（TRAb）", brief: "バセドウ病に特異的。陽性＋機能亢進でバセドウ病を確定診断。妊娠中は胎盤を通過し新生児バセドウ病の原因。",
    overview: "TSH受容体に結合する自己抗体。刺激型（TSAb）がバセドウ病の主体。",
    mechanism: "自己免疫でTSH受容体に対する抗体が産生。TSAbはTSH受容体を持続刺激→T3・T4過剰産生。",
    highDiseases: [
      { name: "バセドウ病（Graves病）", criteria: true, mechanism: "TRAb（TSAb）陽性が診断基準の中核。陰性でも5〜10%は陽性化する。" },
    ],
    lowDiseases: [],
    excludes: [
      { value: "TRAb陰性", disease: "バセドウ病", note: "TRAb陰性でもバセドウ病の5〜10%は陰性（感度85〜95%）。臨床的に疑う場合はTSAb測定または経過観察。" },
    ],
  },

  TPOAb: {
    label: "抗TPO抗体", brief: "橋本病の最も鋭敏な自己抗体。陽性なら自己免疫性甲状腺炎を強く示唆。",
    overview: "甲状腺ペルオキシダーゼに対する自己抗体。橋本病患者の90〜95%で陽性。",
    mechanism: "自己免疫による甲状腺抗原への免疫寛容の破綻→TPOに対する自己抗体産生→補体活性化・ADCC→甲状腺細胞傷害。",
    highDiseases: [
      { name: "橋本病（慢性甲状腺炎）", criteria: true, mechanism: "自己免疫性甲状腺炎の診断。TPOAb陽性＋エコー上低エコー＋TSH高値で診断確定。" },
      { name: "バセドウ病",             criteria: false, mechanism: "バセドウ病の約75%でTPOAbが陽性。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  TgAb: {
    label: "抗サイログロブリン抗体（TgAb）", brief: "橋本病の診断補助。甲状腺癌術後のTgモニタリングを妨害するため重要。",
    overview: "サイログロブリンに対する自己抗体。橋本病の80〜85%で陽性。",
    mechanism: "TPOAbと同様の自己免疫機序。甲状腺癌術後フォローでTgAb陽性の場合、Tg値が正確に測定できない（過小評価）。",
    highDiseases: [
      { name: "橋本病", criteria: false, mechanism: "TPOAbとともに自己免疫性甲状腺炎のマーカー。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  Tg: {
    label: "サイログロブリン（Tg）", brief: "甲状腺組織量の指標。甲状腺癌術後の再発モニタリングに使用。TgAb陽性時は干渉に注意。",
    overview: "甲状腺濾胞で産生される甲状腺ホルモン前駆体。甲状腺全摘後に低値（検出感度以下）になれば残存組織・再発がないことを示す。",
    mechanism: "甲状腺組織量に比例して上昇。",
    highDiseases: [
      { name: "甲状腺癌（術後再発）", criteria: true, mechanism: "全摘後にTg検出されれば再発または残存を示唆。TSH刺激後Tg>2 ng/mLが再発の指標。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  // ════════════ 内分泌（副腎） ════════════

  Cort: {
    label: "コルチゾール（朝）", brief: "副腎皮質ホルモン。低値→副腎不全（Addison病）。高値→Cushing症候群・ストレス反応。",
    overview: "副腎皮質（束状帯）から分泌されるグルコルチコイド。日内変動（朝が最高値）あり。ストレス・感染症で著増。",
    mechanism: "ACTH依存性で調節。朝のコルチゾール<3 μg/dLで副腎不全を強く示唆。",
    highDiseases: [
      { name: "Cushing症候群", criteria: true,  mechanism: "コルチゾール過剰産生→フィードバック障害。深夜コルチゾール>1.8または1mg DEX抑制試験での非抑制が診断の入口。" },
    ],
    lowDiseases: [
      { name: "Addison病（原発性副腎不全）",      criteria: true, mechanism: "副腎皮質の自己免疫的破壊（80%）→コルチゾール産生低下→ACTH↑。" },
      { name: "下垂体機能低下症（二次性副腎不全）", criteria: true, mechanism: "ACTH産生低下→コルチゾール産生低下。ACTH低値（原発性との鑑別点）。" },
    ],
    excludes: [],
  },

  ACTH: {
    label: "ACTH", brief: "下垂体前葉から分泌。コルチゾール低値のとき：ACTH高値→原発性副腎不全、低値→下垂体性（二次性）。",
    overview: "下垂体前葉から分泌され副腎皮質を刺激してコルチゾールを産生させる。早朝採血（9時まで）が必要。",
    mechanism: "コルチゾール低下→フィードバック解除→ACTH↑（原発性）。下垂体障害→ACTH産生低下→コルチゾール↓（二次性）。",
    highDiseases: [
      { name: "Addison病（原発性副腎不全）",  criteria: true,  mechanism: "副腎の機能低下→コルチゾール↓→フィードバック解除→ACTH著増（>300 pg/mLも）。" },
      { name: "下垂体ACTH産生腫瘍（Cushing病）", criteria: true, mechanism: "腺腫からのACTH自律産生→副腎持続刺激→コルチゾール↑。" },
      { name: "異所性ACTH産生（肺小細胞癌等）", criteria: true, mechanism: "腫瘍がACTHを産生→副腎刺激→コルチゾール↑。ACTHが非常に高値（>300 pg/mL）のことが多い。" },
    ],
    lowDiseases: [
      { name: "下垂体機能低下症（二次性副腎不全）", criteria: true, mechanism: "ACTH産生低下→コルチゾール↓。コルチゾール↓＋ACTH↓の組み合わせ。" },
      { name: "副腎腺腫（Cushing症候群）",          criteria: true, mechanism: "腺腫が自律産生→高コルチゾール→下垂体ACTH抑制→ACTH↓（ACTH非依存性）。" },
    ],
    excludes: [],
  },

  Aldo: {
    label: "アルドステロン（PAC）", brief: "副腎球状帯から分泌。Na保持・K排泄を調節。高値＋低レニン＝原発性アルドステロン症。",
    overview: "RAASの最終産物。腎遠位尿細管でNa再吸収・K排泄を調節。ARR（アルドステロン/レニン比）がスクリーニングに使用。",
    mechanism: "低血圧・低Na→レニン→アンジオテンシンII→アルドステロン産生。原発性アルドステロン症では自律的産生。",
    highDiseases: [
      { name: "原発性アルドステロン症", criteria: true, mechanism: "副腎腺腫（Conn腺腫）または過形成→アルドステロン自律産生→PAC高値＋PRA低値（ARR≥200）。" },
    ],
    lowDiseases: [
      { name: "Addison病", criteria: false, mechanism: "副腎皮質破壊→アルドステロン産生低下→Na喪失・K蓄積。" },
    ],
    excludes: [],
  },

  PRA: {
    label: "レニン活性（PRA）", brief: "RAASの起点。低値＋高アルドステロン＝原発性アルドステロン症。高値＋高アルドステロン＝二次性（腎血管性高血圧等）。",
    overview: "腎傍糸球体細胞から分泌されるプロテアーゼ。アンジオテンシノゲン→アンジオテンシンI→（ACE）→アンジオテンシンII→アルドステロン産生。",
    mechanism: "低血圧・低Na・立位でレニン分泌↑。原発性アルドステロン症では自律産生→レニンは抑制（PRA↓）。",
    highDiseases: [
      { name: "腎血管性高血圧（腎動脈狭窄）", criteria: true,  mechanism: "腎血流低下→レニン産生→アンジオテンシンII↑→高血圧。PRA↑＋PAC↑（二次性アルドステロン症）。" },
    ],
    lowDiseases: [
      { name: "原発性アルドステロン症", criteria: true, mechanism: "アルドステロン自律産生→血圧上昇・Na貯留→レニン分泌抑制→PRA↓（<0.2 ng/mL/h）。" },
    ],
    excludes: [],
  },

  // ════════════ 内分泌（下垂体） ════════════

  GH: {
    label: "成長ホルモン（GH）", brief: "下垂体前葉から分泌。パルス性に分泌されるため単回測定は参考程度。IGF-1の方が安定した指標。",
    overview: "成長促進・代謝調節（蛋白同化・脂肪分解・インスリン拮抗）。肝臓でIGF-1産生を刺激。",
    mechanism: "GH産生腫瘍では基礎値が高値＋OGTT後も抑制されない（抑制試験）。GH欠乏では低値＋負荷試験でも上昇しない。",
    highDiseases: [
      { name: "先端巨大症（成人）・巨人症（小児）", criteria: true, mechanism: "下垂体GH産生腺腫→GH・IGF-1過剰→軟部組織・骨の肥大。75gOGTT後GH>1 ng/mLで確定。" },
    ],
    lowDiseases: [
      { name: "下垂体性低身長（小児）", criteria: true,  mechanism: "GH分泌低下→IGF-1低下→骨端軟骨での成長障害。" },
      { name: "成人GH欠乏症",          criteria: true,  mechanism: "下垂体腫瘍・手術・外傷後。中心性肥満・筋力低下・脂質異常・QOL低下。" },
    ],
    excludes: [],
  },

  PRL: {
    label: "プロラクチン（PRL）", brief: "授乳・乳汁分泌を促進。>200 ng/mLならプロラクチノーマをほぼ確定。薬剤性（ドーパミン拮抗薬）でも上昇。",
    overview: "乳汁分泌・生殖機能の抑制に関与。ドーパミンにより分泌が抑制される。",
    mechanism: "プロラクチノーマ（下垂体腺腫）→PRL自律産生。ドーパミン拮抗薬→ドーパミン阻害→PRL↑。",
    highDiseases: [
      { name: "プロラクチノーマ",  criteria: true, mechanism: "下垂体PRL産生腺腫。>200 ng/mLならプロラクチノーマをほぼ確定（薬剤性は通常<200）。" },
      { name: "薬剤性高PRL血症",   criteria: true, mechanism: "ドーパミン拮抗薬（ハロペリドール・メトクロプラミド等）→PRL分泌抑制解除→PRL↑。" },
      { name: "甲状腺機能低下症",  criteria: false, mechanism: "TRH増加→TRHがPRL分泌も刺激→PRL軽度上昇。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  IGF1: {
    label: "IGF-1（ソマトメジンC）", brief: "GHの作用を反映する安定したマーカー。先端巨大症の最重要スクリーニング検査。年齢・性別補正が必要。",
    overview: "肝臓でGHの刺激により産生。GHの生物活性を媒介。半減期が長く（16〜28時間）日内変動が少ない。",
    mechanism: "GH産生腫瘍→GH↑→肝臓でIGF-1過剰産生。GH欠乏・栄養不良・肝不全→IGF-1↓。",
    highDiseases: [
      { name: "先端巨大症", criteria: true, mechanism: "GH産生腺腫→IGF-1著増（年齢・性別補正値でzスコア>2SD）。" },
    ],
    lowDiseases: [
      { name: "GH欠乏症", criteria: true,  mechanism: "GH不足→IGF-1産生低下。" },
      { name: "栄養不良", criteria: false, mechanism: "材料（アミノ酸）不足→IGF-1産生低下。" },
      { name: "肝不全",   criteria: false, mechanism: "産生臓器の機能低下→IGF-1↓。" },
    ],
    excludes: [],
  },

  // ════════════ 内分泌（副甲状腺） ════════════

  PTH: {
    label: "副甲状腺ホルモン（PTH）", brief: "高Ca＋高PTH→原発性副甲状腺機能亢進症。低Ca＋低PTH→副甲状腺機能低下症。低Ca＋高PTH→二次性（VD欠乏・腎不全）。",
    overview: "副甲状腺から分泌。骨からのCa動員・腎でのCa再吸収増加・P排泄増加・活性型VD産生促進。",
    mechanism: "低Ca→CaSR→PTH分泌刺激。高Ca→PTH分泌抑制。原発性副甲状腺機能亢進症ではCaが高値でもPTHが抑制されない。",
    highDiseases: [
      { name: "原発性副甲状腺機能亢進症",              criteria: true, mechanism: "副甲状腺腺腫（80〜85%）・過形成・癌→PTH自律産生→高Ca・低P。" },
      { name: "二次性副甲状腺機能亢進症（腎不全・VD欠乏）", criteria: true, mechanism: "慢性低Ca→持続的PTH刺激→副甲状腺過形成→PTH著増。腎性骨異栄養症の原因。" },
    ],
    lowDiseases: [
      { name: "副甲状腺機能低下症",     criteria: true, mechanism: "PTH産生低下（手術後・自己免疫・DiGeorge症候群）→Ca動員・再吸収低下→低Ca・高P。" },
      { name: "偽性副甲状腺機能低下症", criteria: true, mechanism: "PTHは産生されるが標的臓器での受容体/シグナル障害→低Ca・高P・PTH高値（効かないため）。" },
    ],
    excludes: [],
  },

  vitD: {
    label: "25-OHビタミンD", brief: "ビタミンDの貯蔵型。<20 ng/mLでVD欠乏。骨粗鬆症・くる病・骨軟化症・免疫機能低下と関連。",
    overview: "食事・日光で産生されたVD2・VD3が肝臓で25-OH化された中間代謝物。腎臓でさらに活性型（1,25-(OH)2D）に変換。",
    mechanism: "VD欠乏→活性型VD産生低下→腸管Ca吸収低下→低Ca→PTH↑（二次性副甲状腺機能亢進症）→骨密度低下。",
    highDiseases: [
      { name: "VD中毒（サプリ過剰摂取）", criteria: true, mechanism: "VD過剰→25-OHD著増→高Ca血症・腎石灰化。" },
    ],
    lowDiseases: [
      { name: "くる病（小児）",   criteria: true,  mechanism: "VD欠乏→骨石灰化障害→骨端部拡大・脚変形。" },
      { name: "骨軟化症（成人）", criteria: true,  mechanism: "VD欠乏→骨の低石灰化→骨痛・筋力低下・病的骨折。" },
      { name: "骨粗鬆症（二次性要因）", criteria: false, mechanism: "VD欠乏→Ca吸収低下→骨密度低下（一次性骨粗鬆症は閉経後エストロゲン低下が主因）。" },
    ],
    excludes: [],
  },

  // ════════════ 免疫・補体 ════════════

  IgG: {
    label: "IgG", brief: "最多の免疫グロブリン（全Igの75%）。慢性感染・自己免疫で多クローン性増加。骨髄腫で単クローン性（M蛋白）増加。",
    overview: "二次免疫応答の主体。胎盤通過性あり（母体から胎児への受動免疫）。IgG4関連疾患ではIgG4が選択的に増加。",
    mechanism: "慢性感染・自己免疫→多クローン性Ig産生→IgG増加。骨髄腫→単一形質細胞クローン→IgG単クローン性増加（M蛋白）。",
    highDiseases: [
      { name: "多発性骨髄腫（IgG型）",  criteria: true,  mechanism: "形質細胞腫瘍性増殖→IgG単クローン性著増（血清蛋白電気泳動でMバンド）。CRAB基準（高Ca・腎障害・貧血・骨病変）。" },
      { name: "慢性肝疾患（肝硬変）",    criteria: false, mechanism: "腸管内細菌産物が門脈からシャント→全身性免疫刺激→IgG多クローン性増加（A/G比逆転）。" },
      { name: "IgG4関連疾患（IgG4-RD）", criteria: true,  mechanism: "IgG4陽性形質細胞浸潤→IgG4選択的上昇（>135 mg/dL）。膵臓・胆管・腎臓等に線維化。" },
    ],
    lowDiseases: [
      { name: "X連鎖無γグロブリン血症（Bruton病）", criteria: true, mechanism: "BTK遺伝子変異→B細胞発達障害→全Ig著減。反復細菌感染が特徴。" },
      { name: "分類不能型免疫不全症（CVID）",        criteria: true, mechanism: "成人発症型の低γグロブリン血症。抗体産生できない。" },
    ],
    excludes: [],
  },

  IgA: {
    label: "IgA", brief: "粘膜免疫の主体。IgA腎症・アレルギー性紫斑病で上昇。IgA欠乏は日本人の1/700。",
    overview: "唾液・涙・母乳・腸管分泌液に多い（分泌型IgA）。粘膜感染防御に重要。",
    mechanism: "IgA腎症ではIgA産生亢進（特に糖鎖異常IgA1）→メサンギウム沈着→糸球体腎炎。",
    highDiseases: [
      { name: "IgA腎症",                criteria: true,  mechanism: "血清IgA↑（約50%で上昇）＋メサンギウムへのIgA沈着。血尿・蛋白尿。腎生検で確定診断。" },
      { name: "多発性骨髄腫（IgA型）",  criteria: true,  mechanism: "IgAを産生する形質細胞の腫瘍性増殖（骨髄腫の20〜25%）。" },
      { name: "アレルギー性紫斑病（HSP）", criteria: false, mechanism: "IgAが血管壁に沈着→血管炎→紫斑・腹痛・関節痛・腎炎。" },
    ],
    lowDiseases: [
      { name: "選択的IgA欠乏症", criteria: true, mechanism: "最多の免疫不全症（1/500〜700）。輸血でアナフィラキシーに注意。" },
    ],
    excludes: [],
  },

  IgM: {
    label: "IgM", brief: "一次免疫応答の主体（早期に産生）。Waldenström高ガンマグロブリン血症で著増。",
    overview: "5量体構造の最大の抗体。補体活性化能が高い。感染後最初に産生され後にIgGにクラススイッチ。",
    mechanism: "急性感染→IgMが先行産生。Waldenström高ガンマグロブリン血症ではIgM著増→過粘稠度症候群。",
    highDiseases: [
      { name: "Waldenström高ガンマグロブリン血症", criteria: true,  mechanism: "IgMを産生するリンパ形質細胞腫の増殖→血清IgM著増→過粘稠度症候群（視力障害・神経症状・出血傾向）。" },
      { name: "急性感染症（早期）",               criteria: false, mechanism: "IgM型抗体が最初に産生される（例：IgM型HA抗体陽性→A型肝炎の急性期）。" },
    ],
    lowDiseases: [
      { name: "X連鎖無γグロブリン血症", criteria: true, mechanism: "全Igが低下（IgMも含む）。" },
    ],
    excludes: [],
  },

  IgE: {
    label: "総IgE", brief: "アレルギー・寄生虫感染で上昇。>170 IU/mLで高IgE。アレルギー性疾患のスクリーニングに使用。",
    overview: "肥満細胞・好塩基球のFcε受容体に結合し、アレルゲンとの架橋で脱顆粒→アレルギー反応。",
    mechanism: "Th2優位の免疫応答（アレルギー・寄生虫）でIgE産生亢進。",
    highDiseases: [
      { name: "アトピー性皮膚炎・気管支喘息", criteria: false, mechanism: "Th2炎症→IL-4・IL-13→IgEクラススイッチ→IgE増加。" },
      { name: "寄生虫感染症",                 criteria: false, mechanism: "組織侵入性寄生虫→Th2反応→IgE著増（好酸球増多を伴う）。" },
      { name: "高IgE症候群（Job症候群）",     criteria: true,  mechanism: "STAT3遺伝子変異→IgE著増（>2000 IU/mL）＋反復皮膚感染＋肺嚢腫。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  CH50: {
    label: "血清補体価（CH50）", brief: "補体全体の機能評価。低値→補体消費（SLE・ループス腎炎）または先天的欠乏。",
    overview: "古典的経路（C1〜C9）全体の機能を反映。個々の補体（C3・C4）が低下していても低値になる。",
    mechanism: "免疫複合体→古典的経路活性化→補体消費→CH50↓。",
    highDiseases: [],
    lowDiseases: [
      { name: "SLE（特にループス腎炎）",       criteria: true,  mechanism: "免疫複合体による古典的経路活性化でC3・C4が消費→CH50↓。疾患活動性のモニタリングに使用。" },
      { name: "感染性心内膜炎",                criteria: false, mechanism: "細菌性免疫複合体→補体消費→CH50↓。" },
      { name: "先天性後期補体（C5〜C9）欠乏症", criteria: true,  mechanism: "後期補体欠乏→膜傷害複合体（MAC）形成不全→髄膜炎菌感染症の反復。" },
    ],
    excludes: [
      { value: "CH50正常", disease: "SLE（非活動期）", note: "SLE寛解期は補体が正常化することがある。活動期の指標として連続測定が重要。" },
    ],
  },

  C3: {
    label: "補体 C3", brief: "補体の中心的分子。古典的・第二経路の合流点。SLE・感染症で消費→低下。",
    overview: "補体カスケードで古典的経路と第二経路が収束する中心点。C3b（オプソニン）とC3a（アナフィラトキシン）に切断される。",
    mechanism: "SLEの免疫複合体・感染症の病原体→補体活性化→C3の大量消費→血中C3↓。",
    highDiseases: [],
    lowDiseases: [
      { name: "SLE（特にループス腎炎）",         criteria: true, mechanism: "免疫複合体による古典的経路活性化でC3が消費。SLEの活動性指標（C3・C4・CH50が三者揃って低下）。" },
      { name: "膜性増殖性糸球体腎炎（MPGN）",    criteria: true, mechanism: "C3ネフリティック因子（自己抗体）が第二経路を持続活性化→C3著減（C4は正常なことが多い）。" },
    ],
    excludes: [],
  },

  C4: {
    label: "補体 C4", brief: "古典的経路のみを反映（第二経路に含まれない）。SLE・遺伝的C4欠乏で低下。",
    overview: "C1s（C1複合体活性化後）により切断される補体成分。古典的経路（免疫複合体・抗体介在）に特異的。",
    mechanism: "SLEの免疫複合体（古典的経路）→C4消費→C4↓。C4遺伝子多型（null allele）で遺伝的にC4が低い人がいる（偽低値）。",
    highDiseases: [],
    lowDiseases: [
      { name: "SLE",                  criteria: true, mechanism: "古典的経路活性化によるC4消費。C3・CH50も同時低下。" },
      { name: "遺伝性血管性浮腫（HAE）", criteria: true, mechanism: "C1-INH欠乏→C4が持続的に消費→C4著減（C3は正常）。四肢・顔面・気道に浮腫（アナフィラキシーと異なりアドレナリン無効）。" },
    ],
    excludes: [],
  },

  // ════════════ 感染症マーカー ════════════

  BetaDGlu: {
    label: "β-Dグルカン", brief: "真菌細胞壁の構成成分。侵襲性真菌感染のスクリーニング。>11 pg/mLで陽性。クリプトコッカスとムコールは偽陰性に注意。",
    overview: "アスペルギルス・カンジダ・ニューモシスチス等の真菌細胞壁に含まれるグルカンが血中に漏出して検出。",
    mechanism: "真菌が組織に侵入→細胞壁β-Dグルカンが血中に漏出→limulus反応で検出。",
    highDiseases: [
      { name: "侵襲性アスペルギルス症", criteria: false, mechanism: "免疫不全患者での真菌性肺炎。β-DG↑＋ガラクトマンナン↑が強く示唆。" },
      { name: "侵襲性カンジダ症",       criteria: false, mechanism: "中心静脈カテーテル・免疫不全者での菌血症。β-DG↑が早期診断に有用。" },
      { name: "ニューモシスチス肺炎（PCP）", criteria: false, mechanism: "HIV感染・免疫抑制患者での日和見感染。β-DG著増（>500 pg/mLも）が特徴。" },
    ],
    lowDiseases: [],
    excludes: [
      { value: "β-DG正常（<11）", disease: "侵襲性真菌感染症", note: "陰性予測値は高いが、クリプトコッカス・ムコールは検出できない（偽陰性）。" },
    ],
  },

  // ════════════ 腫瘍マーカー ════════════

  CEA: {
    label: "癌胎児性抗原（CEA）", brief: "大腸癌・胃癌・肺癌・膵癌などのフォローアップに使用。診断より治療効果・再発モニタリングが主な用途。",
    overview: "胎児期に産生される糖蛋白。成人では微量。悪性腫瘍で産生が再活性化。診断特異度が低いため治療後のモニタリングに有用。",
    mechanism: "腫瘍細胞が過剰産生。喫煙・肝硬変・炎症性腸疾患でも軽度上昇（<10 ng/mL程度）。",
    highDiseases: [
      { name: "大腸癌",       criteria: false, mechanism: "大腸癌フォローアップに最も使用。ステージIVでは90%で高値。" },
      { name: "胃癌・膵癌",  criteria: false, mechanism: "CA19-9と組み合わせて使用。" },
      { name: "肺腺癌",       criteria: false, mechanism: "非小細胞肺癌（腺癌）でCEAが上昇することが多い。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  AFP: {
    label: "αフェトプロテイン（AFP）", brief: "肝細胞癌・生殖細胞腫瘍で上昇。>200 ng/mLで肝細胞癌を強く示唆。PIVKA-IIと合わせて使用。",
    overview: "胎児期の主要血清蛋白。正常成人では微量。肝細胞癌で再活性化されて著増。非セミノーマ型精巣腫瘍でも産生される。",
    mechanism: "肝細胞癌→発癌性肝細胞がAFPを産生。肝炎・肝硬変（肝再生）でも軽〜中等度上昇（通常<100 ng/mL）。",
    highDiseases: [
      { name: "肝細胞癌",          criteria: true,  mechanism: "AFP>200（特に>400）は肝細胞癌を強く示唆。PIVKA-IIと合わせてスクリーニング（6ヶ月ごと）。" },
      { name: "非セミノーマ型精巣腫瘍（卵黄嚢腫瘍成分）", criteria: true, mechanism: "卵黄嚢腫瘍はAFPを産生する。治療効果・再発のモニタリングに使用。" },
      { name: "慢性肝炎・肝硬変",  criteria: false, mechanism: "肝細胞再生時にAFPが産生される（通常<100 ng/mL）。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  CA199: {
    label: "CA19-9", brief: "膵癌・胆道癌のマーカー。膵癌に最も使用（感度70〜80%）。Lewis血液型b(-)a(-)の人では産生されない（偽陰性注意）。",
    overview: "ルイス抗原に関連した糖鎖抗原。胆道・膵管・胃腸上皮に発現。",
    mechanism: "腫瘍細胞が過剰産生。胆道系の炎症・閉塞でも上昇（胆汁うっ滞により胆管上皮CA19-9が逆流）。",
    highDiseases: [
      { name: "膵癌",        criteria: false, mechanism: "膵癌の最重要腫瘍マーカー（感度70〜80%、特異度80〜90%）。CEAと組み合わせて感度向上。" },
      { name: "胆道癌",      criteria: false, mechanism: "胆道癌では高率に上昇。閉塞性黄疸のみでも上昇するため画像との組み合わせが必要。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  PSA: {
    label: "PSA（前立腺特異抗原）", brief: "前立腺癌のスクリーニング。>4.0 ng/mLで精査対象。前立腺炎・BPHでも上昇する。",
    overview: "前立腺上皮細胞から産生される糖蛋白。前立腺に特異的（癌に特異的ではない）。50歳以上の男性スクリーニングに推奨。",
    mechanism: "前立腺組織の増大（癌・BPH）または炎症（前立腺炎）でPSAが血中に漏出。直腸診・生検後も一過性上昇。",
    highDiseases: [
      { name: "前立腺癌",     criteria: true,  mechanism: "PSA>10で前立腺癌の可能性が高い（>50%）。f/tPSA比が低い（<0.1〜0.15）なら癌リスク高。" },
      { name: "BPH（良性前立腺肥大）", criteria: false, mechanism: "前立腺の物理的増大でPSA軽度上昇（通常4〜10 ng/mL）。" },
      { name: "前立腺炎",     criteria: false, mechanism: "急性前立腺炎では著明に上昇（>50 ng/mLも）。炎症消退で正常化。" },
    ],
    lowDiseases: [],
    excludes: [],
  },

  PIVKA2: {
    label: "PIVKA-II", brief: "肝細胞癌の特異的マーカー。>40 mAU/mLで陽性。AFPと相補的に使用。ワーファリン服用中は偽高値に注意。",
    overview: "ビタミンK欠乏または拮抗時に産生される異常プロトロンビン。肝細胞癌でビタミンK非依存性に産生される。",
    mechanism: "肝細胞癌細胞→VKが存在してもPIVKA-IIを産生（γカルボキシル化が障害）。ワーファリン投与でも上昇するため注意。",
    highDiseases: [
      { name: "肝細胞癌", criteria: true, mechanism: "AFP陰性肝細胞癌でも検出可能（AFP・PIVKAの相補性：両者で感度が向上）。>100で高リスク。" },
    ],
    lowDiseases: [],
    excludes: [],
  },
};
