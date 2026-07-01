// src/data/symptoms.js
// 症候マスターリスト
// key: 内部キー（diseases.js の symptoms[].key と一致させる）
// label: 表示名
// aliases: Groqが抽出する際に使うキーワード群

export const SYMPTOM_GROUPS = [
  {
    group: "全身症状",
    symptoms: [
      { key: "fever",           label: "発熱（38℃以上）",         aliases: ["発熱", "熱", "体温上昇", "fever", "38℃", "39℃", "40℃"] },
      { key: "fatigue",         label: "倦怠感・易疲労感",          aliases: ["倦怠", "だるい", "疲労", "易疲労", "fatigue", "全身倦怠"] },
      { key: "weight_loss",     label: "体重減少",                  aliases: ["体重減少", "体重が減", "やせ", "weight loss"] },
      { key: "weight_gain",     label: "体重増加・浮腫",            aliases: ["体重増加", "体重が増", "浮腫", "むくみ", "edema", "weight gain"] },
      { key: "night_sweats",    label: "寝汗",                     aliases: ["寝汗", "night sweats"] },
      { key: "chills",          label: "悪寒・戦慄",               aliases: ["悪寒", "戦慄", "ふるえ", "chills", "shivering"] },
      { key: "anorexia",        label: "食欲不振",                  aliases: ["食欲不振", "食欲低下", "食欲がない", "anorexia"] },
    ],
  },
  {
    group: "循環器症状",
    symptoms: [
      { key: "chest_pain",      label: "胸痛・胸部圧迫感",         aliases: ["胸痛", "胸部痛", "胸の痛み", "胸部圧迫", "chest pain"] },
      { key: "palpitation",     label: "動悸",                     aliases: ["動悸", "palpitation", "心拍が速い", "頻脈"] },
      { key: "dyspnea",         label: "息切れ・呼吸困難",         aliases: ["息切れ", "呼吸困難", "dyspnea", "息苦しい", "呼吸が苦しい"] },
      { key: "orthopnea",       label: "起座呼吸",                 aliases: ["起座呼吸", "横になると苦しい", "orthopnea"] },
      { key: "leg_edema",       label: "下腿浮腫",                 aliases: ["下腿浮腫", "足のむくみ", "下肢浮腫", "両下腿", "圧痕性浮腫"] },
      { key: "hypertension",    label: "高血圧",                   aliases: ["高血圧", "hypertension", "血圧が高い"] },
      { key: "hypotension",     label: "低血圧・ショック",         aliases: ["低血圧", "ショック", "血圧低下", "hypotension"] },
      { key: "syncope",         label: "失神・意識消失",           aliases: ["失神", "意識消失", "syncope", "気を失った"] },
    ],
  },
  {
    group: "消化器症状",
    symptoms: [
      { key: "nausea",          label: "悪心・嘔吐",               aliases: ["悪心", "嘔吐", "吐き気", "nausea", "vomiting"] },
      { key: "abdom_pain",      label: "腹痛",                     aliases: ["腹痛", "お腹が痛い", "腹部痛", "abdominal pain"] },
      { key: "diarrhea",        label: "下痢",                     aliases: ["下痢", "diarrhea", "水様便"] },
      { key: "constipation",    label: "便秘",                     aliases: ["便秘", "constipation"] },
      { key: "jaundice",        label: "黄疸",                     aliases: ["黄疸", "jaundice", "眼球黄染", "皮膚黄染"] },
      { key: "dark_urine",      label: "暗色尿・濃色尿",           aliases: ["暗色尿", "濃色尿", "尿が茶色", "褐色尿", "dark urine"] },
      { key: "clay_stool",      label: "灰白色便",                 aliases: ["灰白色便", "白っぽい便", "clay stool"] },
      { key: "ascites",         label: "腹水・腹部膨満",           aliases: ["腹水", "腹部膨満", "お腹が張る", "ascites"] },
      { key: "hematemesis",     label: "吐血・下血",               aliases: ["吐血", "下血", "血便", "タール便", "hematemesis", "melena"] },
    ],
  },
  {
    group: "泌尿器症状",
    symptoms: [
      { key: "proteinuria",     label: "蛋白尿",                   aliases: ["蛋白尿", "proteinuria", "尿蛋白", "尿蛋白陽性", "蛋白＋", "蛋白3+", "蛋白2+", "蛋白1+"] },
      { key: "hematuria",       label: "血尿",                     aliases: ["血尿", "hematuria", "潜血", "赤血球尿", "肉眼的血尿"] },
      { key: "polyuria",        label: "多尿・夜間頻尿",           aliases: ["多尿", "夜間頻尿", "頻尿", "polyuria", "nocturia"] },
      { key: "oliguria",        label: "乏尿・無尿",               aliases: ["乏尿", "無尿", "oliguria", "anuria", "尿が出ない"] },
      { key: "dysuria",         label: "排尿痛・排尿困難",         aliases: ["排尿痛", "排尿困難", "dysuria"] },
    ],
  },
  {
    group: "神経・精神症状",
    symptoms: [
      { key: "headache",        label: "頭痛",                     aliases: ["頭痛", "headache"] },
      { key: "confusion",       label: "意識障害・混乱",           aliases: ["意識障害", "意識混濁", "confusion", "せん妄", "錯乱"] },
      { key: "neuropathy",      label: "手足のしびれ",             aliases: ["しびれ", "neuropathy", "末梢神経障害", "感覚障害"] },
      { key: "weakness",        label: "筋力低下・脱力",           aliases: ["筋力低下", "脱力", "weakness", "四肢脱力"] },
      { key: "tremor",          label: "振戦・手指振戦",           aliases: ["振戦", "tremor", "手が震える", "手指振戦"] },
      { key: "visual_change",   label: "視力変化・視野障害",       aliases: ["視力低下", "視野障害", "visual", "かすみ目"] },
    ],
  },
  {
    group: "内分泌・代謝症状",
    symptoms: [
      { key: "thirst",          label: "口渇・多飲",               aliases: ["口渇", "多飲", "thirst", "水をよく飲む"] },
      { key: "heat_intol",      label: "暑がり・発汗過多",         aliases: ["暑がり", "多汗", "発汗過多", "heat intolerance"] },
      { key: "cold_intol",      label: "寒がり",                   aliases: ["寒がり", "cold intolerance", "寒さに弱い"] },
      { key: "goiter",          label: "甲状腺腫大",               aliases: ["甲状腺腫", "goiter", "甲状腺が腫れ", "頸部腫脹"] },
      { key: "exophthalmos",    label: "眼球突出",                 aliases: ["眼球突出", "exophthalmos", "眼が飛び出"] },
      { key: "moon_face",       label: "満月様顔貌",               aliases: ["満月様顔貌", "moon face", "ムーンフェイス"] },
      { key: "central_obesity", label: "中心性肥満",               aliases: ["中心性肥満", "腹部肥満", "内臓脂肪"] },
      { key: "skin_pigment",    label: "皮膚色素沈着",             aliases: ["色素沈着", "皮膚が黒ずむ", "色黒"] },
    ],
  },
  {
    group: "血液・免疫症状",
    symptoms: [
      { key: "purpura",         label: "点状出血・紫斑",           aliases: ["点状出血", "紫斑", "purpura", "出血斑"] },
      { key: "nosebleed",       label: "鼻血・歯肉出血",           aliases: ["鼻血", "歯肉出血", "nosebleed", "鼻出血", "epistaxis"] },
      { key: "joint_bleed",     label: "関節出血",                 aliases: ["関節出血", "関節が腫れる", "関節内出血"] },
      { key: "pallor",          label: "眼瞼結膜蒼白",             aliases: ["蒼白", "貧血様", "pallor", "眼瞼結膜蒼白", "顔色が悪い"] },
      { key: "lymphadenopathy", label: "リンパ節腫脹",             aliases: ["リンパ節腫脹", "lymphadenopathy", "リンパ節が腫れ"] },
      { key: "splenomegaly",    label: "脾腫",                     aliases: ["脾腫", "splenomegaly", "脾臓が腫れ"] },
      { key: "malar_rash",      label: "蝶形紅斑",                 aliases: ["蝶形紅斑", "malar rash", "頬の発疹", "顔面紅斑"] },
      { key: "photo_sens",      label: "光線過敏症",               aliases: ["光線過敏", "photosensitivity", "日光で悪化"] },
    ],
  },
  {
    group: "筋骨格症状",
    symptoms: [
      { key: "arthritis",       label: "関節痛・関節炎",           aliases: ["関節痛", "関節炎", "arthritis", "関節が痛い"] },
      { key: "bone_pain",       label: "骨痛",                     aliases: ["骨痛", "bone pain", "骨が痛い", "腰痛"] },
      { key: "myalgia",         label: "筋肉痛",                   aliases: ["筋肉痛", "myalgia", "筋痛"] },
      { key: "tetany",          label: "テタニー・けいれん",        aliases: ["テタニー", "tetany", "けいれん", "痙攣", "手足の硬直"] },
      { key: "gout_attack",     label: "痛風発作（母趾MTP関節痛）",aliases: ["痛風", "gout", "母趾", "足の親指が痛い"] },
    ],
  },
  {
    group: "呼吸器症状",
    symptoms: [
      { key: "cough",           label: "咳嗽",                     aliases: ["咳", "cough", "咳嗽", "咳が出る"] },
      { key: "hemoptysis",      label: "喀血",                     aliases: ["喀血", "hemoptysis", "血を吐く（肺から）"] },
      { key: "wheezing",        label: "喘鳴",                     aliases: ["喘鳴", "wheeze", "ゼーゼー", "ヒューヒュー"] },
    ],
  },
  {
    group: "皮膚症状",
    symptoms: [
      { key: "xanthoma",        label: "腱黄色腫",                 aliases: ["黄色腫", "xanthoma", "アキレス腱の腫れ", "腱黄色腫"] },
      { key: "hair_loss",       label: "脱毛",                     aliases: ["脱毛", "hair loss", "抜け毛", "眉毛が薄い"] },
      { key: "dry_skin",        label: "皮膚乾燥・浮腫（粘液水腫）", aliases: ["皮膚乾燥", "粘液水腫", "むくみ顔", "myxedema"] },
      { key: "striae",          label: "皮膚線条（紫色）",         aliases: ["皮膚線条", "striae", "妊娠線様", "紫色の線"] },
    ],
  },
  {
    group: "既往・生活歴",
    symptoms: [
      { key: "hbv_hcv",         label: "B型/C型肝炎ウイルス感染歴", aliases: ["B型肝炎", "C型肝炎", "HBV", "HCV", "肝炎の既往"] },
      { key: "alcohol_hx",      label: "多量飲酒歴",               aliases: ["飲酒", "大量飲酒", "アルコール", "alcohol"] },
      { key: "smoking",         label: "喫煙歴",                   aliases: ["喫煙", "タバコ", "smoking", "煙草"] },
      { key: "family_hx",       label: "家族歴（同疾患）",         aliases: ["家族歴", "family history", "遺伝"] },
      { key: "drug",            label: "薬剤歴（関連薬）",         aliases: ["薬剤", "内服", "服薬", "薬を飲んでい"] },
      { key: "dialysis",        label: "透析中",                   aliases: ["透析", "dialysis", "血液透析", "腹膜透析"] },
      { key: "obesity",         label: "肥満（BMI≥25）",          aliases: ["肥満", "obesity", "BMI 25以上", "太り気味"] },
    ],
  },
];

// フラットなマップ（key → symptom）
export const SYMPTOM_MAP = {};
for (const g of SYMPTOM_GROUPS) {
  for (const s of g.symptoms) {
    SYMPTOM_MAP[s.key] = s;
  }
}

// 全症候キー一覧
export const ALL_SYMPTOM_KEYS = Object.keys(SYMPTOM_MAP);
