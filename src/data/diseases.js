// src/data/diseases.js
// requiredKeys: { key, direction }
//   direction: "low" | "high" | "positive"(異常であること) | "any"(値があればOK)

export const DISEASES = [
  // ═══════════════════════════════════════════════
  //  貧血
  // ═══════════════════════════════════════════════
  {
    id: "iron_deficiency",
    name: "鉄欠乏性貧血",
    category: "貧血",
    requiredKeys: [
      { key: "Hb",   direction: "low" },
      { key: "MCV",  direction: "low" },
      { key: "MCH",  direction: "low" },
      { key: "MCHC", direction: "low" },
      { key: "Ret",  direction: "low" },
    ],
    conditionFn: (v, ev) => ev.Hb === "low" && ev.MCV === "low",
    symptoms: [
      { key: "koilonychia", label: "スプーン爪（匙状爪）" },
      { key: "pica",        label: "異食症（氷・土を食べたい）" },
      { key: "stomatitis",  label: "口角炎・舌炎" },
      { key: "fatigue",     label: "倦怠感・易疲労感" },
      { key: "pallor",      label: "眼瞼結膜蒼白" },
    ],
    note: "小球性低色素性貧血。Fe↓・TIBC↑・フェリチン↓で確定。",
    ruleOutKeys: ["Ret", "MCH", "MCHC"],
    ruleOutNote: "Ret・MCH・MCHCを追加することで溶血性貧血との鑑別精度が上がる。",
  },
  {
    id: "megaloblastic",
    name: "巨赤芽球性貧血（B12/葉酸欠乏）",
    category: "貧血",
    requiredKeys: [
      { key: "Hb",  direction: "low" },
      { key: "MCV", direction: "high" },
      { key: "Ret", direction: "low" },
    ],
    conditionFn: (v, ev) => ev.Hb === "low" && ev.MCV === "high",
    symptoms: [
      { key: "neuro",      label: "神経症状（しびれ・歩行障害）" },
      { key: "glossitis",  label: "舌炎（Hunter舌炎）" },
      { key: "gastrectomy",label: "胃切除術後・菜食主義者" },
    ],
    note: "大球性貧血。血清ビタミンB12・葉酸を追加測定。神経症状があれば亜急性連合性脊髄変性症を疑う。",
    ruleOutKeys: ["Ret", "LD", "TBil"],
    ruleOutNote: "Ret・LD・TBilで溶血性貧血との鑑別。",
  },
  {
    id: "hemolytic",
    name: "溶血性貧血",
    category: "貧血",
    requiredKeys: [
      { key: "Hb",   direction: "low" },
      { key: "Ret",  direction: "high" },
      { key: "LD",   direction: "high" },
      { key: "TBil", direction: "high" },
    ],
    conditionFn: (v, ev) => ev.Hb === "low" && ev.Ret === "high",
    symptoms: [
      { key: "jaundice",     label: "黄疸" },
      { key: "splenomegaly", label: "脾腫" },
      { key: "dark_urine",   label: "暗色尿" },
      { key: "drug",         label: "薬剤投与歴あり" },
    ],
    note: "Ret上昇＋間接Bil上昇＋LD上昇が溶血の三徴。直接クームス試験で自己免疫性を確認。",
    ruleOutKeys: ["LD", "TBil", "DBil"],
    ruleOutNote: "LD↑・間接Bil優位で溶血確認。",
  },
  {
    id: "aplastic",
    name: "再生不良性貧血 / 骨髄不全",
    category: "貧血",
    requiredKeys: [
      { key: "Hb",  direction: "low" },
      { key: "WBC", direction: "low" },
      { key: "PLT", direction: "low" },
      { key: "Ret", direction: "low" },
    ],
    conditionFn: (v, ev) => ev.Hb === "low" && ev.WBC === "low" && ev.PLT === "low" && ev.Ret !== "high",
    symptoms: [
      { key: "fever",    label: "易感染（頻繁な発熱）" },
      { key: "bleeding", label: "出血傾向（点状出血・紫斑）" },
      { key: "exposure", label: "放射線・薬剤曝露歴" },
    ],
    note: "汎血球減少＋Ret低値→骨髄不全。骨髄穿刺で確定。",
    ruleOutKeys: [],
    ruleOutNote: "骨髄穿刺なしでは確定診断不可。",
  },
  {
    id: "renal_anemia",
    name: "腎性貧血",
    category: "貧血",
    requiredKeys: [
      { key: "Hb",   direction: "low" },
      { key: "Cre",  direction: "high" },
      { key: "eGFR", direction: "low" },
      { key: "Ret",  direction: "low" },
      { key: "MCV",  direction: "any" },
    ],
    conditionFn: (v, ev) => ev.Hb === "low" && (ev.Cre === "high" || ev.eGFR === "low"),
    symptoms: [
      { key: "edema",   label: "浮腫" },
      { key: "fatigue", label: "倦怠感" },
      { key: "dialysis",label: "透析中・慢性腎疾患の既往" },
    ],
    note: "正球性正色素性貧血＋CKD。EPO産生低下が原因。",
    ruleOutKeys: ["Ret", "MCV"],
    ruleOutNote: "正球性（MCV正常）＋Ret低値でほぼ腎性貧血。",
  },

  // ═══════════════════════════════════════════════
  //  出血性疾患
  // ═══════════════════════════════════════════════
  {
    id: "ITP",
    name: "特発性血小板減少性紫斑病（ITP）",
    category: "出血性疾患",
    requiredKeys: [
      { key: "PLT",  direction: "low" },
      { key: "PT",   direction: "any" },   // 正常であることが重要
      { key: "APTT", direction: "any" },
    ],
    conditionFn: (v, ev) => ev.PLT === "low" && ev.PT === "normal" && ev.APTT === "normal",
    symptoms: [
      { key: "purpura",    label: "点状出血・紫斑" },
      { key: "nosebleed",  label: "鼻血・歯肉出血" },
      { key: "menorrhagia",label: "過多月経（女性）" },
    ],
    note: "血小板単独減少＋PT・APTT正常。EDTA偽性血小板減少症を除外。",
    ruleOutKeys: ["Fib", "FDP"],
    ruleOutNote: "Fib・FDP正常でDICを否定。",
  },
  {
    id: "DIC",
    name: "播種性血管内凝固症候群（DIC）",
    category: "出血性疾患",
    requiredKeys: [
      { key: "PLT",  direction: "low" },
      { key: "PT",   direction: "high" },
      { key: "APTT", direction: "high" },
      { key: "Fib",  direction: "low" },
      { key: "FDP",  direction: "high" },
      { key: "DD",   direction: "high" },
    ],
    conditionFn: (v, ev) => ev.PLT === "low" && ev.PT === "high" && ev.APTT === "high" && ev.Fib === "low" && ev.FDP === "high",
    symptoms: [
      { key: "malignancy", label: "悪性腫瘍・白血病の基礎疾患" },
      { key: "obstetric",  label: "産科的疾患（早剥・羊水塞栓）" },
      { key: "sepsis",     label: "敗血症・重篤な外傷" },
    ],
    note: "厚生省基準：基礎疾患＋血小板↓＋FDP↑＋Fib↓＋PT延長。",
    ruleOutKeys: ["DD", "TAT"],
    ruleOutNote: "D-ダイマー・TATが正常であればDICはほぼ否定できる。",
  },
  {
    id: "hemophilia",
    name: "血友病A / B",
    category: "出血性疾患",
    requiredKeys: [
      { key: "APTT", direction: "high" },
      { key: "PT",   direction: "any" },
      { key: "PLT",  direction: "any" },
    ],
    conditionFn: (v, ev) => ev.APTT === "high" && ev.PT === "normal" && ev.PLT === "normal",
    symptoms: [
      { key: "joint_bleed", label: "関節出血（膝・肘・足首）" },
      { key: "hematoma",    label: "深部血腫（筋肉内・後腹膜）" },
      { key: "male",        label: "男性（X連鎖劣性遺伝）" },
      { key: "family_hx",   label: "家族歴あり" },
    ],
    note: "APTT単独延長→内因系異常。第VIII因子（A）・第IX因子（B）活性で確定。",
    ruleOutKeys: [],
    ruleOutNote: "第VIII・IX因子活性測定なしでは確定困難。",
  },
  {
    id: "warfarin_vk",
    name: "ワーファリン投与中 / ビタミンK欠乏症",
    category: "出血性疾患",
    requiredKeys: [
      { key: "PT",   direction: "high" },
      { key: "APTT", direction: "high" },
      { key: "PLT",  direction: "any" },
    ],
    conditionFn: (v, ev) => ev.PT === "high" && ev.APTT === "high" && ev.PLT === "normal",
    symptoms: [
      { key: "warfarin",     label: "抗凝固薬（ワーファリン）服用中" },
      { key: "natto",        label: "納豆・クロレラ摂取" },
      { key: "neonate",      label: "新生児（新生児メレナ）" },
      { key: "malabsorption",label: "吸収不良・腸手術後" },
    ],
    note: "PT・APTT両延長＋血小板正常。VK依存性因子（II・VII・IX・X）が低下。",
    ruleOutKeys: ["Fib"],
    ruleOutNote: "Fib正常でDICを否定。",
  },
  {
    id: "vwd",
    name: "von Willebrand病（vWD）",
    category: "出血性疾患",
    requiredKeys: [
      { key: "APTT", direction: "high" },
      { key: "PT",   direction: "any" },
      { key: "PLT",  direction: "any" },
    ],
    conditionFn: (v, ev) => ev.PLT === "normal" && ev.APTT === "high" && ev.PT === "normal",
    symptoms: [
      { key: "mucosal_bleed", label: "粘膜出血（鼻血・過多月経）" },
      { key: "family_hx",     label: "家族歴あり" },
      { key: "female",        label: "女性に多い（1型が最多）" },
    ],
    note: "出血時間延長＋APTT延長。vWF抗原・活性測定で確定。血友病Aとの鑑別が重要。",
    ruleOutKeys: [],
    ruleOutNote: "vWF抗原・活性・リストセチン凝集試験なしでは確定困難。",
  },

  // ═══════════════════════════════════════════════
  //  肝・胆・膵疾患
  // ═══════════════════════════════════════════════
  {
    id: "acute_hepatitis",
    name: "急性肝炎",
    category: "肝・胆・膵疾患",
    requiredKeys: [
      { key: "AST", direction: "high" },
      { key: "ALT", direction: "high" },
      { key: "TBil",direction: "high" },
    ],
    conditionFn: (v, ev) => {
      const ast = parseFloat(v.AST), alt = parseFloat(v.ALT);
      return ev.AST === "high" && ev.ALT === "high" && (ast > 200 || alt > 200);
    },
    symptoms: [
      { key: "flu_like",  label: "全身倦怠感・食欲不振・発熱" },
      { key: "jaundice",  label: "黄疸" },
      { key: "dark_urine",label: "暗色尿" },
      { key: "hx_alcohol",label: "飲酒歴・輸血歴・薬剤歴" },
    ],
    note: "AST/ALT急激上昇（正常上限の10倍以上）。HBs抗原・HCV抗体を確認。",
    ruleOutKeys: ["PT", "TBil", "Alb"],
    ruleOutNote: "PT・Alb正常なら劇症化リスク低。",
  },
  {
    id: "liver_cirrhosis",
    name: "慢性肝炎 / 肝硬変",
    category: "肝・胆・膵疾患",
    requiredKeys: [
      { key: "AST", direction: "high" },
      { key: "ALT", direction: "high" },
      { key: "Alb", direction: "low" },
      { key: "ChE", direction: "low" },
      { key: "PLT", direction: "low" },
      { key: "PT",  direction: "high" },
    ],
    conditionFn: (v, ev) => ev.AST === "high" && ev.ALT === "high" && ev.Alb === "low",
    symptoms: [
      { key: "ascites",       label: "腹部膨満（腹水）" },
      { key: "spider_angioma",label: "蜘蛛状血管腫・手掌紅斑" },
      { key: "hbv_hcv",      label: "B型・C型肝炎ウイルス感染歴" },
    ],
    note: "肝予備能低下：Alb低下・ChE低下・PT延長・血小板減少。Child-Pugh分類で重症度評価。",
    ruleOutKeys: ["PT", "ChE", "PLT"],
    ruleOutNote: "PT・ChE・PLT三つが正常なら肝予備能はほぼ保たれている。",
  },
  {
    id: "obstructive_jaundice",
    name: "閉塞性黄疸",
    category: "肝・胆・膵疾患",
    requiredKeys: [
      { key: "ALP",  direction: "high" },
      { key: "GGT",  direction: "high" },
      { key: "TBil", direction: "high" },
      { key: "DBil", direction: "high" },
    ],
    conditionFn: (v, ev) => ev.ALP === "high" && ev.GGT === "high" && ev.TBil === "high" && ev.DBil === "high",
    symptoms: [
      { key: "painless_ictus", label: "無痛性黄疸（膵癌・胆管癌）" },
      { key: "biliary_colic",  label: "右季肋部痛・発熱（胆管炎）" },
      { key: "clay_stool",     label: "灰白色便・暗色尿" },
    ],
    note: "直接Bil優位上昇＋ALP・GGT著明上昇→閉塞性。腹部US・CT・MRCPで胆管拡張を確認。",
    ruleOutKeys: ["AST", "ALT"],
    ruleOutNote: "AST/ALT著明高値（>10倍）なら急性肝炎の合併を考える。",
  },
  {
    id: "fatty_liver_nash",
    name: "脂肪肝 / NASH",
    category: "肝・胆・膵疾患",
    requiredKeys: [
      { key: "AST", direction: "high" },
      { key: "ALT", direction: "high" },
      { key: "GGT", direction: "high" },
      { key: "TG",  direction: "high" },
    ],
    conditionFn: (v, ev) => {
      const ast = parseFloat(v.AST), alt = parseFloat(v.ALT);
      return ev.AST === "high" && ev.ALT === "high" && ast < 200 && alt < 200 && ev.GGT === "high";
    },
    symptoms: [
      { key: "obesity",    label: "肥満（BMI≥25）" },
      { key: "alcohol_hx", label: "多量飲酒歴（アルコール性）" },
      { key: "dm_dyslip",  label: "糖尿病・脂質異常症の合併" },
    ],
    note: "AST/ALT軽度上昇（10倍未満）＋GGT上昇。アルコール性はAST≥ALT。腹部エコーで確認。",
    ruleOutKeys: ["TC", "TG", "Glu"],
    ruleOutNote: "腹部エコー必要。",
  },
  {
    id: "pancreatitis",
    name: "急性膵炎",
    category: "肝・胆・膵疾患",
    requiredKeys: [
      { key: "AMY", direction: "high" },
      { key: "CRP", direction: "high" },
      { key: "Glu", direction: "high" },
    ],
    conditionFn: (v, ev) => ev.AMY === "high" && parseFloat(v.AMY) > 3 * 125,
    symptoms: [
      { key: "abdom_pain", label: "上腹部〜背部の激痛（帯状）" },
      { key: "nausea",     label: "悪心・嘔吐" },
      { key: "etiology",   label: "アルコール多飲または胆石症" },
    ],
    note: "アミラーゼ3倍以上＋腹痛で臨床診断。CT/MRIで膵腫大・壊死を評価。",
    ruleOutKeys: ["CRP", "Glu"],
    ruleOutNote: "CRP著明上昇は重症化を示唆。",
  },

  // ═══════════════════════════════════════════════
  //  腎疾患
  // ═══════════════════════════════════════════════
  {
    id: "ckd",
    name: "慢性腎臓病（CKD）",
    category: "腎疾患",
    requiredKeys: [
      { key: "Cre",  direction: "high" },
      { key: "eGFR", direction: "low" },
      { key: "BUN",  direction: "high" },
      { key: "K",    direction: "high" },
      { key: "P",    direction: "high" },
    ],
    conditionFn: (v, ev) => ev.Cre === "high" || ev.eGFR === "low",
    symptoms: [
      { key: "edema",      label: "浮腫" },
      { key: "hypertension",label: "高血圧" },
      { key: "nocturia",   label: "夜間頻尿・多尿（初期）" },
      { key: "uremia",     label: "倦怠感・食欲不振（尿毒症症状）" },
    ],
    note: "eGFR<60が3ヶ月以上持続、またはアルブミン尿でCKD診断。G1〜G5でステージ分類。",
    ruleOutKeys: ["BUN", "K", "P", "Hb"],
    ruleOutNote: "BUN・K・P・Hbで合併症を確認。",
  },
  {
    id: "nephrotic",
    name: "ネフローゼ症候群",
    category: "腎疾患",
    requiredKeys: [
      { key: "Alb", direction: "low" },
      { key: "TC",  direction: "high" },
      { key: "TG",  direction: "high" },
      { key: "TP",  direction: "low" },
    ],
    conditionFn: (v, ev) => ev.Alb === "low" && ev.TC === "high",
    symptoms: [
      { key: "severe_edema",  label: "高度浮腫（眼瞼・下腿・腹水）" },
      { key: "proteinuria_3g",label: "尿蛋白≥3.5g/日" },
      { key: "weight_gain",   label: "急激な体重増加" },
    ],
    note: "尿蛋白≥3.5g/日＋低Alb血症（≤3.0g/dL）が診断基準。高脂血症・脂肪尿を伴う。",
    ruleOutKeys: ["TG", "BUN", "Cre"],
    ruleOutNote: "TG↑でネフローゼの脂質異常を裏付け。",
  },
  {
    id: "iga_nephropathy",
    name: "IgA腎症 / 糸球体腎炎",
    category: "腎疾患",
    requiredKeys: [
      { key: "IgA", direction: "high" },
      { key: "Cre", direction: "high" },
    ],
    conditionFn: (v, ev) => ev.IgA === "high" && ev.Cre === "high",
    symptoms: [
      { key: "hematuria",   label: "血尿（肉眼的または顕微鏡的）" },
      { key: "proteinuria", label: "尿蛋白陽性" },
      { key: "urti",        label: "上気道炎後に血尿悪化" },
    ],
    note: "血清IgA↑＋血尿・蛋白尿。確定診断は腎生検。",
    ruleOutKeys: ["CH50", "C3"],
    ruleOutNote: "補体低下なら連鎖球菌感染後糸球体腎炎を鑑別。",
  },

  // ═══════════════════════════════════════════════
  //  代謝疾患
  // ═══════════════════════════════════════════════
  {
    id: "diabetes",
    name: "糖尿病",
    category: "代謝疾患",
    requiredKeys: [
      { key: "Glu",   direction: "high" },
      { key: "HbA1c", direction: "high" },
    ],
    conditionFn: (v, ev) => parseFloat(v.Glu) >= 126 || parseFloat(v.HbA1c) >= 6.5 || ev.Glu === "high",
    symptoms: [
      { key: "thirst",       label: "口渇・多飲・多尿" },
      { key: "weight_loss",  label: "体重減少" },
      { key: "neuropathy",   label: "手足のしびれ（末梢神経障害）" },
      { key: "visual_change",label: "視力変化（網膜症）" },
    ],
    note: "空腹時血糖≥126mg/dL または HbA1c≥6.5%。",
    ruleOutKeys: ["HbA1c", "Ins", "CPep"],
    ruleOutNote: "インスリン・Cペプチドで1型と2型を鑑別。",
  },
  {
    id: "dyslipidemia",
    name: "脂質異常症",
    category: "代謝疾患",
    requiredKeys: [
      { key: "LDL", direction: "high" },
      { key: "TG",  direction: "high" },
      { key: "HDL", direction: "low" },
    ],
    conditionFn: (v, ev) => ev.LDL === "high" || ev.TG === "high" || ev.HDL === "low",
    symptoms: [
      { key: "xanthoma",   label: "腱黄色腫（アキレス腱・手背）" },
      { key: "corneal_arc",label: "角膜弓（若年者）" },
      { key: "family_hx",  label: "家族性高コレステロール血症の家族歴" },
    ],
    note: "LDL≥140 or HDL<40 or TG≥150 mg/dL。スタチン適応確認。",
    ruleOutKeys: ["TC", "HDL", "TG"],
    ruleOutNote: "TC・HDL・TGが揃うとLDLの推算精度が上がる（TG<400が条件）。",
  },
  {
    id: "gout",
    name: "痛風 / 高尿酸血症",
    category: "代謝疾患",
    requiredKeys: [
      { key: "UA",  direction: "high" },
      { key: "Cre", direction: "any" },
    ],
    conditionFn: (v, ev) => ev.UA === "high",
    symptoms: [
      { key: "gout_attack",  label: "母趾MTP関節の急性発赤・腫脹・激痛" },
      { key: "tophi",        label: "痛風結節" },
      { key: "kidney_stone", label: "腎結石" },
    ],
    note: "男性UA>7.0mg/dL、女性>6.0mg/dL。発作時に正常化することがある。",
    ruleOutKeys: ["Cre", "BUN"],
    ruleOutNote: "Cre・BUNで尿酸腎症の合併を確認。",
  },
  {
    id: "metabolic_syndrome",
    name: "メタボリックシンドローム",
    category: "代謝疾患",
    requiredKeys: [
      { key: "TG",  direction: "high" },
      { key: "HDL", direction: "low" },
      { key: "Glu", direction: "high" },
    ],
    conditionFn: (v, ev) => ev.TG === "high" && ev.HDL === "low" && ev.Glu === "high",
    symptoms: [
      { key: "obesity",     label: "腹囲 男性≥85cm / 女性≥90cm" },
      { key: "hypertension",label: "血圧 収縮期≥130 または 拡張期≥85 mmHg" },
    ],
    note: "腹部肥満＋高TG＋低HDL＋高血糖＋高血圧のうち3項目以上。",
    ruleOutKeys: ["Ins"],
    ruleOutNote: "インスリン値でHOMA-IRを算出しインスリン抵抗性を定量化できる。",
  },

  // ═══════════════════════════════════════════════
  //  電解質・内分泌疾患
  // ═══════════════════════════════════════════════
  {
    id: "primary_hyperaldosteronism",
    name: "原発性アルドステロン症",
    category: "内分泌疾患",
    requiredKeys: [
      { key: "K",    direction: "low" },
      { key: "Na",   direction: "high" },
      { key: "Aldo", direction: "high" },
      { key: "PRA",  direction: "low" },
    ],
    conditionFn: (v, ev) => ev.K === "low" && ev.Aldo === "high" && ev.PRA === "low",
    symptoms: [
      { key: "hypertension", label: "治療抵抗性高血圧" },
      { key: "weakness",     label: "筋力低下・周期性四肢麻痺" },
      { key: "polyuria",     label: "多尿・夜間頻尿" },
    ],
    note: "低K血症＋高PAC＋低PRA（ARR≥200）でスクリーニング陽性。副腎CTと副腎静脈サンプリングで確定。",
    ruleOutKeys: [],
    ruleOutNote: "副腎静脈サンプリングで一側/両側を鑑別。",
  },
  {
    id: "hyperparathyroidism",
    name: "原発性副甲状腺機能亢進症",
    category: "内分泌疾患",
    requiredKeys: [
      { key: "Ca",  direction: "high" },
      { key: "P",   direction: "low" },
      { key: "PTH", direction: "high" },
    ],
    conditionFn: (v, ev) => ev.Ca === "high" && ev.P === "low" && ev.PTH === "high",
    symptoms: [
      { key: "bone_pain",   label: "骨痛・病的骨折" },
      { key: "kidney_stone",label: "腎結石" },
      { key: "gi_symptoms", label: "悪心・便秘・消化性潰瘍" },
      { key: "psych",       label: "抑うつ・認知機能低下" },
    ],
    note: "高Ca＋低P＋PTH高値。Bones, Stones, Groans, Psychic Moans。",
    ruleOutKeys: ["vitD"],
    ruleOutNote: "ビタミンD欠乏による二次性副甲状腺機能亢進症と鑑別するためビタミンD測定が重要。",
  },
  {
    id: "hypoparathyroidism",
    name: "副甲状腺機能低下症 / 低Ca血症",
    category: "内分泌疾患",
    requiredKeys: [
      { key: "Ca",  direction: "low" },
      { key: "P",   direction: "high" },
      { key: "PTH", direction: "low" },
    ],
    conditionFn: (v, ev) => ev.Ca === "low" && ev.P === "high" && ev.PTH === "low",
    symptoms: [
      { key: "tetany",    label: "テタニー（手足の硬直・けいれん）" },
      { key: "chvostek",  label: "Chvostek徴候・Trousseau徴候" },
      { key: "thyroid_op",label: "甲状腺手術・頸部手術後" },
    ],
    note: "低Ca＋高P＋PTH低値。補正Ca=[実測Ca+0.8×(4-Alb)]で低Alb血症を除外。",
    ruleOutKeys: ["Alb", "Mg"],
    ruleOutNote: "Albで補正Ca計算。Mg低値でもPTH分泌が抑制される。",
  },
  {
    id: "siadh",
    name: "SIADH / 低ナトリウム血症",
    category: "内分泌疾患",
    requiredKeys: [
      { key: "Na", direction: "low" },
    ],
    conditionFn: (v, ev) => ev.Na === "low",
    symptoms: [
      { key: "nausea",    label: "悪心・嘔吐・倦怠感" },
      { key: "confusion", label: "意識障害・頭痛（重症時）" },
      { key: "drug",      label: "向精神薬・抗癌剤服用中" },
    ],
    note: "血清Na<136mEq/L。心不全・肝硬変・腎不全・副腎不全との鑑別が必要。",
    ruleOutKeys: ["K", "Cre", "Alb"],
    ruleOutNote: "K低下は原発性アルドステロン症と鑑別。Cre・Albで心不全・肝硬変を評価。",
  },
  {
    id: "hyperthyroid",
    name: "甲状腺機能亢進症（バセドウ病など）",
    category: "内分泌疾患",
    requiredKeys: [
      { key: "TSH", direction: "low" },
      { key: "FT4", direction: "high" },
      { key: "FT3", direction: "high" },
    ],
    conditionFn: (v, ev) => ev.TSH === "low" && ev.FT4 === "high",
    symptoms: [
      { key: "palpitation",  label: "動悸・頻脈（心房細動）" },
      { key: "weight_loss",  label: "体重減少・食欲亢進" },
      { key: "heat_intol",   label: "暑がり・発汗過多" },
      { key: "goiter",       label: "甲状腺腫大" },
      { key: "exophthalmos", label: "眼球突出（バセドウ病）" },
      { key: "tremor",       label: "手指振戦" },
    ],
    note: "TSH低下＋FT4上昇が基本。バセドウ病はTRAb陽性。",
    ruleOutKeys: ["FT3", "TRAb"],
    ruleOutNote: "TRAb陽性でバセドウ病と確定。",
  },
  {
    id: "hypothyroid",
    name: "甲状腺機能低下症（橋本病など）",
    category: "内分泌疾患",
    requiredKeys: [
      { key: "TSH", direction: "high" },
      { key: "FT4", direction: "low" },
    ],
    conditionFn: (v, ev) => ev.TSH === "high" && ev.FT4 === "low",
    symptoms: [
      { key: "cold_intol",  label: "寒がり・体温低下" },
      { key: "edema",       label: "浮腫（粘液水腫）・体重増加" },
      { key: "bradycardia", label: "徐脈" },
      { key: "constipation",label: "便秘" },
      { key: "fatigue",     label: "倦怠感・眠気" },
      { key: "hair_loss",   label: "脱毛・眉毛外1/3消失" },
    ],
    note: "TSH上昇＋FT4低下。橋本病はTPOAb・TgAb陽性。",
    ruleOutKeys: ["TPOAb", "TgAb"],
    ruleOutNote: "TPOAb・TgAb陽性で橋本病と診断。",
  },
  {
    id: "subclinical_hypo",
    name: "潜在性甲状腺機能低下症",
    category: "内分泌疾患",
    requiredKeys: [
      { key: "TSH", direction: "high" },
      { key: "FT4", direction: "any" },
    ],
    conditionFn: (v, ev) => ev.TSH === "high" && ev.FT4 === "normal",
    symptoms: [
      { key: "fatigue_mild", label: "軽度の倦怠感（症状は軽微）" },
    ],
    note: "TSH上昇＋FT4正常。TSH>10であれば治療を考慮。",
    ruleOutKeys: ["TPOAb"],
    ruleOutNote: "TPOAb陽性なら顕性低下症への進行リスクが高い。",
  },
  {
    id: "addison",
    name: "副腎皮質機能低下症（Addison病）",
    category: "内分泌疾患",
    requiredKeys: [
      { key: "Cort", direction: "low" },
      { key: "ACTH", direction: "high" },
      { key: "Na",   direction: "low" },
      { key: "K",    direction: "high" },
    ],
    conditionFn: (v, ev) => ev.Cort === "low" && ev.ACTH === "high" && ev.Na === "low" && ev.K === "high",
    symptoms: [
      { key: "fatigue",      label: "全身倦怠感・易疲労感" },
      { key: "hypotension",  label: "起立性低血圧" },
      { key: "skin_pigment", label: "皮膚・粘膜の色素沈着" },
      { key: "weight_loss",  label: "体重減少・食欲不振" },
    ],
    note: "コルチゾール低値＋ACTH高値（原発性）。低Na＋高K＋低血糖。副腎クリーゼは生命危機。",
    ruleOutKeys: [],
    ruleOutNote: "ACTH負荷試験でコルチゾール反応を確認することで確定診断。",
  },
  {
    id: "cushing",
    name: "Cushing症候群",
    category: "内分泌疾患",
    requiredKeys: [
      { key: "Cort", direction: "high" },
      { key: "Glu",  direction: "high" },
      { key: "K",    direction: "low" },
      { key: "ACTH", direction: "any" },
    ],
    conditionFn: (v, ev) => ev.Cort === "high" && ev.Glu === "high" && ev.K === "low",
    symptoms: [
      { key: "moon_face",      label: "満月様顔貌（ムーンフェイス）" },
      { key: "central_obesity",label: "中心性肥満・水牛様脂肪沈着" },
      { key: "striae",         label: "皮膚線条（腹部・大腿の紫色条紋）" },
      { key: "hypertension",   label: "高血圧" },
      { key: "osteoporosis",   label: "骨粗鬆症・病的骨折" },
    ],
    note: "コルチゾール高値＋高血糖＋低K。ACTHで下垂体性vs異所性vs副腎腺腫を鑑別。",
    ruleOutKeys: ["ACTH"],
    ruleOutNote: "ACTH高値→下垂体・異所性、ACTH低値→副腎腺腫/癌。",
  },
  {
    id: "acromegaly",
    name: "先端巨大症 / 巨人症",
    category: "内分泌疾患",
    requiredKeys: [
      { key: "GH",   direction: "high" },
      { key: "IGF1", direction: "high" },
    ],
    conditionFn: (v, ev) => ev.GH === "high" && ev.IGF1 === "high",
    symptoms: [
      { key: "acral_enlarge", label: "手足・顔貌（鼻・唇・下顎）の肥大" },
      { key: "hyperhidrosis", label: "多汗・皮膚肥厚" },
      { key: "headache",      label: "頭痛（下垂体腫瘍）" },
      { key: "visual_field",  label: "視野障害（耳側半盲）" },
    ],
    note: "GH↑＋IGF-1↑。75gOGTT後もGHが抑制されないことで確定。",
    ruleOutKeys: [],
    ruleOutNote: "GH抑制試験（OGTT）なしでは確定診断不可。",
  },
  {
    id: "hyperprolactinemia",
    name: "高プロラクチン血症",
    category: "内分泌疾患",
    requiredKeys: [
      { key: "PRL", direction: "high" },
    ],
    conditionFn: (v, ev) => ev.PRL === "high",
    symptoms: [
      { key: "galactorrhea", label: "乳汁分泌（非産褥期）" },
      { key: "amenorrhea",   label: "月経不順・無月経" },
      { key: "infertility",  label: "不妊症" },
      { key: "headache",     label: "頭痛・視野障害（プロラクチノーマ）" },
      { key: "drug",         label: "抗精神病薬・制吐剤服用中" },
    ],
    note: "PRL>30ng/mLで高PRL血症。薬剤性とプロラクチノーマを鑑別。MRI確認。",
    ruleOutKeys: ["TSH"],
    ruleOutNote: "甲状腺機能低下症でもPRLが上昇するためTSH測定が重要。",
  },

  // ═══════════════════════════════════════════════
  //  自己免疫疾患
  // ═══════════════════════════════════════════════
  {
    id: "SLE",
    name: "全身性エリテマトーデス（SLE）",
    category: "自己免疫疾患",
    requiredKeys: [
      { key: "CH50", direction: "low" },
      { key: "C3",   direction: "low" },
      { key: "WBC",  direction: "low" },
      { key: "PLT",  direction: "low" },
      { key: "Alb",  direction: "low" },
    ],
    conditionFn: (v, ev) => ev.CH50 === "low" && ev.C3 === "low" && (ev.WBC === "low" || ev.PLT === "low"),
    symptoms: [
      { key: "malar_rash",  label: "蝶形紅斑（頬〜鼻根部）" },
      { key: "photo_sens",  label: "光線過敏症" },
      { key: "arthritis",   label: "関節痛・非破壊性関節炎" },
      { key: "serositis",   label: "漿膜炎（胸膜炎・心嚢炎）" },
      { key: "oral_ulcer",  label: "口腔内潰瘍" },
      { key: "renal",       label: "蛋白尿・血尿（ループス腎炎）" },
    ],
    note: "抗核抗体・抗dsDNA抗体・抗Sm抗体陽性。補体低下（CH50・C3・C4）。",
    ruleOutKeys: ["C4", "Alb", "Cre"],
    ruleOutNote: "C4低下→古典的経路の関与。Alb・Creでループス腎炎の重症度評価。",
  },
  {
    id: "multiple_myeloma",
    name: "多発性骨髄腫（MM）",
    category: "血液腫瘍",
    requiredKeys: [
      { key: "IgG", direction: "high" },
      { key: "Alb", direction: "low" },
      { key: "Ca",  direction: "high" },
      { key: "Cre", direction: "high" },
      { key: "Hb",  direction: "low" },
    ],
    conditionFn: (v, ev) => (ev.IgG === "high" || ev.IgA === "high") && ev.Alb === "low",
    symptoms: [
      { key: "bone_pain",  label: "骨痛（腰痛・背部痛）・病的骨折" },
      { key: "renal_fail", label: "腎機能低下" },
      { key: "infection",  label: "反復する感染症（易感染性）" },
      { key: "fatigue",    label: "倦怠感・貧血" },
    ],
    note: "M蛋白血症＋CRAB基準（高Ca・腎障害・貧血・骨病変）。血清蛋白電気泳動でMピーク確認。",
    ruleOutKeys: ["Ca", "Cre", "Hb"],
    ruleOutNote: "高Ca・高Cre・低HbでCRAB基準の充足度を評価。骨髄穿刺で形質細胞比率を確認。",
  },

  // ═══════════════════════════════════════════════
  //  感染症・炎症
  // ═══════════════════════════════════════════════
  {
    id: "bacterial_infection",
    name: "細菌感染症（急性炎症）",
    category: "感染・炎症",
    requiredKeys: [
      { key: "WBC", direction: "high" },
      { key: "CRP", direction: "high" },
      { key: "PCT", direction: "high" },
    ],
    conditionFn: (v, ev) => ev.WBC === "high" && ev.CRP === "high",
    symptoms: [
      { key: "fever_38",  label: "発熱（38℃以上）" },
      { key: "local_sign",label: "局所感染症状（咽頭痛・排尿痛・咳など）" },
      { key: "chills",    label: "悪寒・戦慄" },
    ],
    note: "白血球増多（好中球主体）＋CRP高値。PCTは細菌性感染の特異性が高い。",
    ruleOutKeys: ["PCT", "Neut"],
    ruleOutNote: "PCT≥0.25で細菌感染症の可能性が高まる。",
  },
  {
    id: "viral_infection",
    name: "ウイルス感染症",
    category: "感染・炎症",
    requiredKeys: [
      { key: "WBC",   direction: "low" },
      { key: "CRP",   direction: "high" },
      { key: "Lymph", direction: "high" },
    ],
    conditionFn: (v, ev) => ev.WBC === "low" && ev.CRP === "high",
    symptoms: [
      { key: "fever",           label: "発熱・倦怠感" },
      { key: "myalgia",         label: "筋肉痛・関節痛" },
      { key: "urti",            label: "上気道症状（鼻水・咳）" },
      { key: "lymphadenopathy", label: "リンパ節腫脹" },
    ],
    note: "白血球減少またはリンパ球優位＋CRP中等度上昇→ウイルス感染を示唆。",
    ruleOutKeys: ["PCT", "Lymph"],
    ruleOutNote: "PCT正常（<0.25）はウイルス感染を支持。",
  },
  {
    id: "invasive_fungal",
    name: "侵襲性真菌感染症",
    category: "感染・炎症",
    requiredKeys: [
      { key: "BetaDGlu", direction: "high" },
      { key: "WBC",      direction: "low" },
    ],
    conditionFn: (v, ev) => ev.BetaDGlu === "high" && (ev.CRP === "high" || ev.WBC === "low"),
    symptoms: [
      { key: "immunocomp",    label: "免疫不全（好中球減少・ステロイド・移植後）" },
      { key: "prolonged_fever",label: "抗菌薬不応性の遷延する発熱" },
      { key: "pulmonary",     label: "肺浸潤影・空洞（アスペルギルス）" },
    ],
    note: "β-Dグルカン>11pg/mLで陽性。培養・組織診なしでは確定困難。",
    ruleOutKeys: [],
    ruleOutNote: "培養・組織診（ゴールドスタンダード）なしでは確定困難。",
  },

  // ═══════════════════════════════════════════════
  //  心疾患
  // ═══════════════════════════════════════════════
  {
    id: "ami",
    name: "急性心筋梗塞（AMI）",
    category: "心疾患",
    requiredKeys: [
      { key: "Trop", direction: "high" },
      { key: "CK",   direction: "high" },
      { key: "LD",   direction: "high" },
    ],
    conditionFn: (v, ev) => ev.Trop === "high" && ev.CK === "high",
    symptoms: [
      { key: "chest_pain",  label: "胸痛（締め付け・圧迫感）30分以上" },
      { key: "radiation",   label: "放散痛（左肩・顎・背部）" },
      { key: "diaphoresis", label: "冷汗・悪心・呼吸困難" },
      { key: "risk_factors",label: "高血圧・糖尿病・喫煙・脂質異常症の既往" },
    ],
    note: "高感度トロポニン上昇が最重要。12誘導心電図でSTEMIとNSTEMIを鑑別。",
    ruleOutKeys: ["LD", "AST"],
    ruleOutNote: "LD・ASTは心筋梗塞でも上昇するが特異性低。心電図と組み合わせた判断が必要。",
  },
  {
    id: "heart_failure",
    name: "心不全",
    category: "心疾患",
    requiredKeys: [
      { key: "BNP", direction: "high" },
      { key: "Na",  direction: "low" },
    ],
    conditionFn: (v, ev) => ev.BNP === "high",
    symptoms: [
      { key: "dyspnea",   label: "労作時・安静時息切れ" },
      { key: "orthopnea", label: "起座呼吸・夜間発作性呼吸困難" },
      { key: "leg_edema", label: "下腿浮腫" },
      { key: "fatigue",   label: "易疲労感・活動制限" },
    ],
    note: "BNP>18.4pg/mLで心不全を示唆。BNP<35pg/mLは心不全をほぼ否定。",
    ruleOutKeys: ["Cre", "Na"],
    ruleOutNote: "腎機能低下や低Na血症は心不全の予後悪化因子。",
  },

  // ═══════════════════════════════════════════════
  //  腫瘍マーカー
  // ═══════════════════════════════════════════════
  {
    id: "hepatocellular_ca",
    name: "肝細胞癌（スクリーニング）",
    category: "腫瘍",
    requiredKeys: [
      { key: "AFP",    direction: "high" },
      { key: "PIVKA2", direction: "high" },
    ],
    conditionFn: (v, ev) => ev.AFP === "high" || ev.PIVKA2 === "high",
    symptoms: [
      { key: "liver_dz",   label: "慢性肝炎・肝硬変の既往" },
      { key: "abdom_mass", label: "腹部腫瘤・上腹部違和感" },
      { key: "weight_loss",label: "体重減少" },
    ],
    note: "AFP>10 または PIVKA-II>40でスクリーニング陽性。造影CTまたはMRIで確認。",
    ruleOutKeys: [],
    ruleOutNote: "造影CTまたはMRIで腫瘍の特徴的濃染像を確認。",
  },
];

export const CATEGORIES = [
  "貧血", "出血性疾患", "肝・胆・膵疾患", "腎疾患",
  "代謝疾患", "内分泌疾患", "自己免疫疾患", "感染・炎症",
  "心疾患", "血液腫瘍", "腫瘍",
];
