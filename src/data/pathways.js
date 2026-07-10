// src/data/pathways.js
// ═══════════════════════════════════════════════════════════════════════
//  鑑別路（Pathway）― 「検査 → 所見 → 疾患群が絞られる → 確定」の分岐ツリー
// ═══════════════════════════════════════════════════════════════════════
//  このアプリの核心。ある入口（主訴/異常）から、どの検査で何が分岐し、
//  どの疾患群に絞れて、最後に何で確定するか、を1本の木として表す。
//
//  ノード(PathwayNode):
//    kind:'state'  … 鑑別の途中の状態。test(次の一手)と ask(問い)と branches を持つ。
//    kind:'disease'… 葉。diseaseId で疾患に接続。
//  枝(PathwayBranch): { finding, label, to }
//    finding … その枝を選ぶ所見 Finding.id（無い分岐は説明用の自由キーでも可）
//
//  ★ Sonnetへ: 分岐の finding と葉の diseaseId は実在IDに合わせること。
//    新しい木を足したら presentations.js の pathwayId で入口と結ぶ。
//    「レイヤーを降りるほど確定に近づく」構造を保つ（layerは目安）。
// ═══════════════════════════════════════════════════════════════════════

import { LAYER } from '../model/schema.js';
const S = LAYER.SCREEN, D = LAYER.DIFF, C = LAYER.CONFIRM;

// ── 木を短く書くヘルパー ──────────────────────────────
// 状態ノード
const st = (label, { layer, test, ask, note, branches } = {}) =>
  ({ kind: 'state', label, layer, test, ask, note, branches: branches || [] });
// 疾患ノード（葉）
const dz = (diseaseId, label, note) =>
  ({ kind: 'disease', label, diseaseId, note });
// 枝
const br = (finding, label, to) => ({ finding, label, to });

export const PATHWAYS = [

  // ═══════════════════════════════════════════════════════════════
  //  貧血の鑑別 ― MCVで大きさ分類 → 各群で機序別に確定
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'pw_anemia', title: '貧血（Hb低下）の鑑別', system: '血液', entryId: 'pres_anemia',
    summary: 'Hb低下を確認したら、まずMCV（赤血球の大きさ）で小球性・正球性・大球性に三分する。' +
             '大きさは産生障害の「様式」を反映し、鑑別の全体像を一気に絞り込む。',
    root: st('貧血（Hb低下）', {
      layer: S, test: 'MCV', ask: 'MCV（赤血球の大きさ）は？',
      note: 'Hb低下は「貧血がある」ことしか言わない。次の一手はMCVで、これが鑑別の背骨になる。',
      branches: [
        // 小球性
        br('MCV_low', 'MCV<80 → 小球性', st('小球性貧血', {
          layer: D, test: 'iron_panel', ask: '鉄動態（フェリチン・TIBC）は？',
          note: 'ヘム合成が追いつかず小さく淡い赤血球に。鉄欠乏か、炎症による利用障害(ACD)かをフェリチンで分ける。',
          branches: [
            br('ferritin_low',  'フェリチン↓・TIBC↑ → 貯蔵鉄枯渇',
               dz('iron_deficiency', '鉄欠乏性貧血', '確定後は必ず出血源（消化管・月経）を探す。')),
            br('ferritin_high', 'フェリチン正常〜↑ → 鉄利用障害',
               dz('chronic_disease_anemia', '慢性疾患性貧血(ACD)', '基礎の炎症/腫瘍/膠原病を探す。')),
          ],
        })),
        // 正球性
        br('MCV_normal', 'MCV 80–100 → 正球性', st('正球性貧血', {
          layer: D, test: 'Ret', ask: '網赤血球は？（骨髄は代償できているか）',
          note: '大きさが正常なら、骨髄が代償しているか(Ret↑=末梢の喪失)、産生が落ちているか(Ret↓)で二分する。',
          branches: [
            br('Ret_high', '網赤血球↑ → 末梢での喪失（代償あり）', st('溶血/出血の疑い', {
              layer: D, test: 'hemolysis_panel', ask: '溶血所見（ハプトグロビン↓・間接Bil↑）は？',
              note: '骨髄は元気に作っている＝壊れているか失っている。溶血マーカーで溶血を裏づける。',
              branches: [
                br('haptoglobin_low', 'ハプトグロビン↓・間接Bil↑ → 溶血',
                   dz('hemolytic', '溶血性貧血', '溶血を確認したら直接クームスでAIHAを確定(L3)。')),
              ],
            })),
            br('Ret_low', '網赤血球↓ → 産生低下', st('産生低下型', {
              layer: D, test: 'Cre', ask: '腎機能（Cre）は？ 骨髄は？',
              note: '作れていない。腎性(EPO低下)・骨髄不全などへ。',
              branches: [
                br('Cre_high', 'Cre↑ → EPO産生低下',
                   dz('renal_anemia', '腎性貧血', 'CKD＋正球性＋Ret低値。EPO低値で確認。')),
                br('bm_hypoplasia', '汎血球減少＋骨髄低形成',
                   dz('aplastic', '再生不良性貧血', '汎血球減少を伴う。白血病(芽球)との鑑別に骨髄が必須。')),
              ],
            })),
          ],
        })),
        // 大球性
        br('MCV_high', 'MCV>100 → 大球性', st('大球性貧血', {
          layer: D, test: 'bone_marrow', ask: 'B12/葉酸・骨髄（巨赤芽球）は？',
          note: 'DNA合成が遅れて核成熟が遅れ、大きな赤血球に。B12/葉酸欠乏が代表。無効造血でLD↑・間接Bil↑も。',
          branches: [
            br('bm_megaloblast', '骨髄で巨赤芽球・B12/葉酸↓',
               dz('megaloblastic', '巨赤芽球性貧血', '神経症状があれば亜急性連合性脊髄変性症を疑う。')),
          ],
        })),
      ],
    }),
  },

  // ═══════════════════════════════════════════════════════════════
  //  肝逸脱酵素上昇 ― 肝細胞型 か 胆汁うっ滞型 か
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'pw_liver_enzyme', title: '肝逸脱酵素上昇の鑑別', system: '消化器', entryId: 'pres_liver_enzyme',
    summary: 'AST/ALT優位（肝細胞傷害型）か、ALP/γGTP優位（胆汁うっ滞型）かをまず分ける。' +
             'この一分岐で「肝実質の問題」か「胆道の問題」かという全体像が決まる。',
    root: st('肝逸脱酵素上昇', {
      layer: S, test: 'ALP', ask: 'AST/ALT優位か、ALP/γGTP優位か？',
      note: '同じ「肝機能異常」でも、傷んでいる場所が細胞か胆道かで進む方向が全く違う。パターン(ALP+γGTP)も参照。',
      branches: [
        br('ALT_high', 'AST/ALT優位 → 肝細胞傷害型', st('肝細胞傷害型', {
          layer: D, test: 'hbv_serology', ask: 'ウイルス・脂肪肝・腫瘤は？',
          note: '細胞が壊れて酵素が漏れている。原因はウイルス・薬剤・脂肪・自己免疫。画像で脂肪/腫瘤も見る。',
          branches: [
            br('hbsag_pos', 'ウイルスマーカー陽性',
               dz('acute_hepatitis', '急性肝炎', 'ALT優位(AST/ALT<1)が典型。病因はマーカーで確定。')),
            br('us_fatty_liver', '脂肪肝（bright liver）',
               dz('nafld_nash', 'NAFLD / NASH', '飲酒歴が乏しい脂肪肝。NASH確定は肝生検。')),
            br('us_liver_mass', '背景肝＋肝腫瘤',
               dz('hcc', '肝細胞癌(HCC)', 'AFP/PIVKA-II＋造影パターン→必要なら生検で確定。')),
          ],
        })),
        br('ALP_high', 'ALP/γGTP優位 → 胆汁うっ滞型', st('胆汁うっ滞型', {
          layer: D, test: 'DBil', ask: '直接ビリルビン優位か？ 胆管は拡張しているか？',
          note: 'ALP↑かつγGTP↑なら胆道由来（γGTP正常なら骨由来を疑う＝パターン参照）。閉塞性黄疸の鑑別へ接続。',
          branches: [
            br('us_bile_duct_dilation', '胆管拡張あり → 閉塞性黄疸へ',
               st('閉塞性黄疸（→黄疸の鑑別へ）', {
                 layer: D, test: 'mrcp', ask: '閉塞の原因は結石か腫瘍か？',
                 note: '胆管が拡張＝下流で詰まっている。原因検索は黄疸パスウェイと同じ（結石 vs 腫瘍）。',
                 branches: [
                   br('mrcp_stone', 'MRCPで総胆管結石',
                      dz('choledocholithiasis', '総胆管結石', '良性の閉塞。胆管炎合併でCharcot三徴。')),
                   br('ct_pancreas_mass', '膵頭部腫瘤＋CA19-9↑',
                      dz('pancreatic_cancer', '膵癌', '悪性の閉塞。EUS-FNAで確定。')),
                 ],
               })),
          ],
        })),
      ],
    }),
  },

  // ═══════════════════════════════════════════════════════════════
  //  黄疸 ― 直接/間接で肝前・肝・肝後を分け、閉塞なら結石 vs 腫瘍
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'pw_jaundice', title: '黄疸（ビリルビン上昇）の鑑別', system: '消化器', entryId: 'pres_jaundice',
    summary: '総ビリルビン上昇を直接／間接に分けるのが最初の分岐。間接優位は溶血など肝前性、' +
             '直接優位は肝性/肝後性。直接優位＋胆管拡張なら閉塞性として原因（結石/腫瘍）を詰める。',
    root: st('黄疸（総ビリルビン↑）', {
      layer: S, test: 'DBil', ask: '直接ビリルビン優位か、間接優位か？',
      note: 'ビリルビンの「型」で上流(産生過剰=溶血)か下流(排泄障害=胆道)かが分かれる。',
      branches: [
        br('indirect_bil_high', '間接優位 → 肝前性（溶血など）',
           st('肝前性黄疸（溶血の疑い）', {
             layer: D, test: 'Ret', ask: '網赤血球↑・ハプトグロビン↓など溶血所見は？',
             note: '非抱合型が増える＝赤血球破壊(溶血)や抱合障害。溶血パスウェイと合流。',
             branches: [
               br('haptoglobin_low', '溶血三徴そろう',
                  dz('hemolytic', '溶血性貧血', '間接Bil↑は溶血の一徴。貧血の鑑別と地続き。')),
             ],
           })),
        br('DBil_high', '直接優位 → 肝性/肝後性', st('直接ビリルビン優位', {
          layer: D, test: 'abdo_us', ask: '胆管は拡張しているか？（閉塞の有無）',
          note: '抱合型が逆流している。胆管が拡張していれば「閉塞性(肝後性)」、しなければ肝内胆汁うっ滞。',
          branches: [
            br('us_bile_duct_dilation', '胆管拡張あり → 閉塞性黄疸', st('閉塞性黄疸', {
              layer: D, test: 'mrcp', ask: '閉塞の原因は結石か腫瘍か？',
              note: 'ここが「疾患群→個別疾患」の確定分岐。良性(結石)か悪性(腫瘍)かを画像で詰める。',
              branches: [
                br('mrcp_stone', '総胆管結石（MRCP）',
                   dz('choledocholithiasis', '総胆管結石', '内視鏡的截石(EST/ERCP)へ。')),
                br('ct_pancreas_mass', '膵頭部腫瘤（乏血性）＋CA19-9↑',
                   dz('pancreatic_cancer', '膵癌', '無痛性閉塞性黄疸で発見されることが多い。')),
                br('mrcp_stricture', '胆管狭窄（腫瘍性）',
                   dz('pancreatic_cancer', '膵・胆道癌', '狭窄部の生検・EUS-FNAで確定。')),
              ],
            })),
          ],
        })),
      ],
    }),
  },

  // ═══════════════════════════════════════════════════════════════
  //  血小板減少 ― 消費性(DIC) / 汎血球減少 / 単独(ITP)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'pw_thrombocytopenia', title: '血小板減少の鑑別', system: '血液', entryId: 'pres_thrombocytopenia',
    summary: '血小板減少を見たら「単独か、他系統も減っているか」「凝固も動いているか」を見る。' +
             '消費(DIC)・産生低下(骨髄)・破壊(ITP)のどれかへ振り分ける。',
    root: st('血小板減少（PLT↓）', {
      layer: S, test: 'FDP', ask: '凝固（FDP/D-ダイマー・PT）と他系統の血球は？',
      note: 'まず「重篤で全身性のDIC」を外し、次に汎血球減少(骨髄)か、血小板だけの破壊(ITP)かを分ける。',
      branches: [
        br('FDP_high', 'FDP/D-ダイマー↑＋Fib↓＋PT延長 → 消費性',
           dz('disseminated_ic', '播種性血管内凝固(DIC)', '必ず基礎疾患(敗血症/悪性腫瘍/産科)を伴う。')),
        br('WBC_low', '白血球・赤血球も減少 → 汎血球減少', st('汎血球減少', {
          layer: D, test: 'bone_marrow', ask: '骨髄は低形成か、芽球が増えているか？',
          note: '全系統が減る＝骨髄そのものの問題。低形成なら再生不良性、芽球増加なら白血病。',
          branches: [
            br('bm_hypoplasia', '骨髄低形成＋Ret低値',
               dz('aplastic', '再生不良性貧血', '造血幹細胞障害。輸血・免疫抑制・移植を検討。')),
            br('bm_blasts', '骨髄で芽球増加（≥20%）',
               st('急性白血病（疾患は今後追加）', { layer: C,
                 note: '芽球増加＝急性白血病。表面マーカー・染色体で病型を確定（データ追加予定）。' })),
          ],
        })),
        br('plt_isolated', '血小板単独減少・PT/APTT正常 → 破壊/免疫性',
           dz('ITP', '特発性血小板減少性紫斑病(ITP)', '他原因を除外して診断する除外診断。')),
      ],
    }),
  },

  // ═══════════════════════════════════════════════════════════════
  //  急性腹症 ― 圧痛の局在で第一分岐、緊急所見(遊離ガス/鏡面像)は最優先
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'pw_acute_abdomen', title: '急性腹症の鑑別', system: '消化器', entryId: 'pres_abdominal_pain',
    summary: 'まず腹膜炎・穿孔・腸閉塞などの緊急を外す（遊離ガス・鏡面像・板状硬）。' +
             'その上で圧痛の局在（右季肋部/心窩部/右下腹部）から臓器を絞り、画像で確定する。',
    root: st('急性腹症（腹痛）', {
      layer: S, test: 'abdo_palpation', ask: '腹膜刺激徴候は？ 圧痛はどこ？',
      note: '最初に「今すぐ手術か」を決める緊急所見を探し、次に局在から臓器へ。',
      branches: [
        // 緊急枝
        br('free_air', '遊離ガス＋反跳痛 → 穿孔（緊急）',
           dz('gi_perforation', '消化管穿孔', '横隔膜下free air＋汎発性腹膜炎＝緊急手術。')),
        br('niveau', '腹部膨満＋鏡面像・腸雑音異常 → 腸閉塞',
           dz('ileus', 'イレウス(腸閉塞)', '機械的(金属音)か麻痺性(腸雑音消失)か、絞扼の有無を評価。')),
        // 局在枝
        br('abdo_tenderness_ruq', '右季肋部圧痛', st('右季肋部痛', {
          layer: D, test: 'abdo_us', ask: '胆石・Murphy徴候・胆管拡張は？',
          note: '胆嚢・肝・胆管を疑う。胆石＋Murphyなら胆嚢炎、胆管拡張＋黄疸なら閉塞性へ。',
          branches: [
            br('murphy_sign', '胆石＋Murphy徴候陽性',
               dz('acute_cholecystitis', '急性胆嚢炎', '胆石＋胆嚢壁肥厚＋Murphyで診断。')),
            br('us_bile_duct_dilation', '胆管拡張＋黄疸 → 閉塞性黄疸へ',
               dz('choledocholithiasis', '総胆管結石', '黄疸パスウェイに合流。胆管炎の合併に注意。')),
          ],
        })),
        br('abdo_tenderness_epigastric', '心窩部圧痛', st('心窩部痛', {
          layer: D, test: 'AMY', ask: '膵酵素は？ タール便は？',
          note: '胃・十二指腸・膵を疑う。アミラーゼ高値なら膵炎、タール便＋潰瘍なら消化性潰瘍。',
          branches: [
            br('AMY_high', 'アミラーゼ↑（基準3倍以上）',
               dz('acute_pancreatitis', '急性膵炎', '上腹部痛＋膵酵素↑＋画像の2つ以上で診断。')),
            br('melena_on_glove', 'タール便＋心窩部痛',
               dz('peptic_ulcer', '消化性潰瘍', 'EGDで潰瘍と出血を確認、H. pylori/NSAIDsを検索。')),
          ],
        })),
        br('abdo_tenderness_rlq', '右下腹部圧痛（McBurney）', st('右下腹部痛', {
          layer: D, test: 'abdo_ct', ask: '虫垂は腫大しているか？',
          note: '痛みの移動（心窩部→右下腹部）＋McBurney圧痛＋反跳痛が典型。CTで虫垂腫大を確認。',
          branches: [
            br('ct_appendix_swelling', 'CTで虫垂腫大・周囲脂肪織混濁',
               dz('appendicitis', '急性虫垂炎', '穿孔前の診断が重要。')),
          ],
        })),
      ],
    }),
  },
];

export const PATHWAY_BY_ID = Object.fromEntries(PATHWAYS.map(p => [p.id, p]));
