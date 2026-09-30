/**
 * Uzbekistan Multi-level / CEFR Scoring Engine (UzBMBA)
 * Chet tilini bilish darajasini aniqlash test sinovlari (Multi-level / CEFR)
 * Yangi UzBMBA 75 ballik standart shkalasi va Rasch metodologiyasi.
 */

export type CEFRLevel = "C1" | "B2" | "B1" | "Fail";

export interface CEFRLevelInfo {
  level: CEFRLevel;
  title: string;
  badgeText: string;
  passed: boolean;
  minScore: number;
  maxScore: number;
  rawQuestionsRange: string;
  description: string;
  colorClass: string;
  bgLightClass: string;
}

export const CEFR_THRESHOLDS: Record<CEFRLevel, CEFRLevelInfo> = {
  "C1": {
    level: "C1",
    title: "C1 Daraja (Oliy)",
    badgeText: "C1 Daraja",
    passed: true,
    minScore: 65,
    maxScore: 75,
    rawQuestionsRange: "28–35",
    description: "Chet tilini mukammal egallaganlik darajasi. OTMlarga kirishda fan bo'yicha 100% maksimal ball beriladi hamda pedagogik faoliyatda oylik ustama olish huquqini beradi.",
    colorClass: "text-[#7C3AED]",
    bgLightClass: "bg-purple-50 text-[#7C3AED] border-purple-200",
  },
  "B2": {
    level: "B2",
    title: "B2 Daraja (Yetakchi)",
    badgeText: "B2 Daraja",
    passed: true,
    minScore: 51,
    maxScore: 64,
    rawQuestionsRange: "18–27",
    description: "Erkin muloqot va tahlil darajasi. Davlat OTMlarining bakalavriat va magistratura yo'nalishlarida maksimal imtiyoz beriladi.",
    colorClass: "text-emerald-600",
    bgLightClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "B1": {
    level: "B1",
    title: "B1 Daraja (Mustaqil)",
    badgeText: "B1 Daraja",
    passed: true,
    minScore: 38,
    maxScore: 50,
    rawQuestionsRange: "10–17",
    description: "Kundalik va professional muloqot uchun yetarli daraja. Belgilangan tartibda tabaqalashtirilgan imtiyoz yoki rasmiy sertifikat beriladi.",
    colorClass: "text-blue-600",
    bgLightClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "Fail": {
    level: "Fail",
    title: "B1 dan quyi",
    badgeText: "B1 dan quyi",
    passed: false,
    minScore: 0,
    maxScore: 37,
    rawQuestionsRange: "0–9",
    description: "Umumiy ball minimal o'tish talabi (38 ball)ga yetmadi. Ushbu natija bilan milliy sertifikat taqdim etilmaydi.",
    colorClass: "text-rose-600",
    bgLightClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

/**
 * Rasmiy UzBMBA konvertatsiya shkalasi (Listening & Reading: 35 ta topshiriq):
 * 28–35 to'g'ri javob -> 65–75 ball (C1)
 * 18–27 to'g'ri javob -> 51–64 ball (B2)
 * 10–17 to'g'ri javob -> 38–50 ball (B1)
 * 0–9 to'g'ri javob   -> 0–37 ball (B1 dan quyi)
 */
export function rawToCEFRStandardScore(rawCorrect: number): number {
  const raw = Math.max(0, Math.min(35, Math.round(rawCorrect)));
  if (raw === 0) return 0;
  if (raw <= 9) {
    // 0 - 9 -> 0 - 37
    return Math.round((raw / 9) * 37);
  }
  if (raw <= 17) {
    // 10 - 17 -> 38 - 50
    return Math.round(38 + ((raw - 10) / (17 - 10)) * (50 - 38));
  }
  if (raw <= 27) {
    // 18 - 27 -> 51 - 64
    return Math.round(51 + ((raw - 18) / (27 - 18)) * (64 - 51));
  }
  // 28 - 35 -> 65 - 75
  return Math.round(65 + ((raw - 28) / (35 - 28)) * (75 - 65));
}

/**
 * Rasmiy UzBMBA Yozma ish (Writing) va Gapirish (Speaking) ekspert mezonlari shkalasi (0 - 36 ball)
 */
export const CEFR_WRITING_SPEAKING_TABLE: Array<{ minRaw: number; maxRaw: number; scaled: number }> = [
  { minRaw: 35.1, maxRaw: 36.0, scaled: 75 },
  { minRaw: 34.1, maxRaw: 35.0, scaled: 74 },
  { minRaw: 33.1, maxRaw: 34.0, scaled: 73 },
  { minRaw: 32.6, maxRaw: 33.0, scaled: 72 },
  { minRaw: 32.1, maxRaw: 32.5, scaled: 71 },
  { minRaw: 31.6, maxRaw: 32.0, scaled: 70 },
  { minRaw: 31.1, maxRaw: 31.5, scaled: 69 },
  { minRaw: 30.6, maxRaw: 31.0, scaled: 68 },
  { minRaw: 30.1, maxRaw: 30.5, scaled: 67 },
  { minRaw: 29.1, maxRaw: 30.0, scaled: 66 },
  { minRaw: 28.1, maxRaw: 29.0, scaled: 65 },
  { minRaw: 27.1, maxRaw: 28.0, scaled: 64 },
  { minRaw: 26.6, maxRaw: 27.0, scaled: 63 },
  { minRaw: 26.1, maxRaw: 26.5, scaled: 62 },
  { minRaw: 25.6, maxRaw: 26.0, scaled: 61 },
  { minRaw: 25.1, maxRaw: 25.5, scaled: 60 },
  { minRaw: 24.6, maxRaw: 25.0, scaled: 59 },
  { minRaw: 24.1, maxRaw: 24.5, scaled: 58 },
  { minRaw: 23.6, maxRaw: 24.0, scaled: 57 },
  { minRaw: 23.1, maxRaw: 23.5, scaled: 56 },
  { minRaw: 22.6, maxRaw: 23.0, scaled: 55 },
  { minRaw: 22.1, maxRaw: 22.5, scaled: 54 },
  { minRaw: 21.6, maxRaw: 22.0, scaled: 53 },
  { minRaw: 21.1, maxRaw: 21.5, scaled: 52 },
  { minRaw: 20.6, maxRaw: 21.0, scaled: 51 },
  { minRaw: 20.1, maxRaw: 20.5, scaled: 50 },
  { minRaw: 19.6, maxRaw: 20.0, scaled: 49 },
  { minRaw: 19.1, maxRaw: 19.5, scaled: 48 },
  { minRaw: 18.6, maxRaw: 19.0, scaled: 47 },
  { minRaw: 18.1, maxRaw: 18.5, scaled: 46 },
  { minRaw: 17.6, maxRaw: 18.0, scaled: 45 },
  { minRaw: 17.1, maxRaw: 17.5, scaled: 44 },
  { minRaw: 16.6, maxRaw: 17.0, scaled: 43 },
  { minRaw: 16.1, maxRaw: 16.5, scaled: 42 },
  { minRaw: 15.6, maxRaw: 16.0, scaled: 41 },
  { minRaw: 15.1, maxRaw: 15.5, scaled: 40 },
  { minRaw: 14.6, maxRaw: 15.0, scaled: 39 },
  { minRaw: 14.1, maxRaw: 14.5, scaled: 38 },
  { minRaw: 13.6, maxRaw: 14.0, scaled: 37 },
  { minRaw: 13.1, maxRaw: 13.5, scaled: 36 },
  { minRaw: 12.6, maxRaw: 13.0, scaled: 35 },
  { minRaw: 12.1, maxRaw: 12.5, scaled: 34 },
  { minRaw: 11.6, maxRaw: 12.0, scaled: 33 },
  { minRaw: 11.1, maxRaw: 11.5, scaled: 32 },
  { minRaw: 10.6, maxRaw: 11.0, scaled: 31 },
  { minRaw: 10.1, maxRaw: 10.5, scaled: 30 },
  { minRaw: 9.6, maxRaw: 10.0, scaled: 29 },
  { minRaw: 9.1, maxRaw: 9.5, scaled: 28 },
  { minRaw: 8.6, maxRaw: 9.0, scaled: 27 },
  { minRaw: 8.1, maxRaw: 8.5, scaled: 26 },
  { minRaw: 7.6, maxRaw: 8.0, scaled: 25 },
  { minRaw: 7.1, maxRaw: 7.5, scaled: 24 },
  { minRaw: 6.6, maxRaw: 7.0, scaled: 23 },
  { minRaw: 6.1, maxRaw: 6.5, scaled: 22 },
  { minRaw: 5.6, maxRaw: 6.0, scaled: 21 },
  { minRaw: 5.1, maxRaw: 5.5, scaled: 20 },
  { minRaw: 4.6, maxRaw: 5.0, scaled: 19 },
  { minRaw: 4.1, maxRaw: 4.5, scaled: 18 },
  { minRaw: 3.6, maxRaw: 4.0, scaled: 17 },
  { minRaw: 3.1, maxRaw: 3.5, scaled: 16 },
  { minRaw: 2.6, maxRaw: 3.0, scaled: 15 },
  { minRaw: 2.1, maxRaw: 2.5, scaled: 14 },
  { minRaw: 1.6, maxRaw: 2.0, scaled: 13 },
  { minRaw: 1.1, maxRaw: 1.5, scaled: 12 },
  { minRaw: 0.6, maxRaw: 1.0, scaled: 11 },
  { minRaw: 0.1, maxRaw: 0.5, scaled: 10 },
  { minRaw: 0.0, maxRaw: 0.0, scaled: 0 },
];

export function rubricRawToScaled(raw: number): number {
  if (raw <= 0) return 0;
  for (const entry of CEFR_WRITING_SPEAKING_TABLE) {
    if (raw >= entry.minRaw && raw <= entry.maxRaw) {
      return entry.scaled;
    }
  }
  if (raw > 36.0) return 75;
  return 0;
}

export interface CEFRInput {
  inputMode: "raw" | "scale";
  listeningRaw: number;   // 0 - 35
  readingRaw: number;     // 0 - 35
  listeningScale: number; // 0 - 75
  readingScale: number;   // 0 - 75
}

export interface CEFRResult {
  listeningRaw: number;
  listeningScore: number;
  readingRaw: number;
  readingScore: number;
  overallScore: number;
  levelInfo: CEFRLevelInfo;
  activeSkillsCount: number;
}

export function calculateCEFR(input: CEFRInput): CEFRResult {
  let lScore = 0;
  let rScore = 0;

  const lRaw = Math.max(0, Math.min(35, Math.round(input.listeningRaw) || 0));
  const rRaw = Math.max(0, Math.min(35, Math.round(input.readingRaw) || 0));

  if (input.inputMode === "scale") {
    lScore = Math.max(0, Math.min(75, Math.round(input.listeningScale) || 0));
    rScore = Math.max(0, Math.min(75, Math.round(input.readingScale) || 0));
  } else {
    lScore = rawToCEFRStandardScore(lRaw);
    rScore = rawToCEFRStandardScore(rRaw);
  }

  // Speaking and Writing are disabled as "Coming Soon".
  // The overall score is calculated as the average of the active skills (Listening + Reading):
  const rawAvg = (lScore + rScore) / 2;
  const overallScore = Math.round(rawAvg * 10) / 10;

  let levelInfo: CEFRLevelInfo;
  if (overallScore >= 65.0) {
    levelInfo = CEFR_THRESHOLDS["C1"];
  } else if (overallScore >= 51.0) {
    levelInfo = CEFR_THRESHOLDS["B2"];
  } else if (overallScore >= 38.0) {
    levelInfo = CEFR_THRESHOLDS["B1"];
  } else {
    levelInfo = CEFR_THRESHOLDS["Fail"];
  }

  return {
    listeningRaw: lRaw,
    listeningScore: lScore,
    readingRaw: rRaw,
    readingScore: rScore,
    overallScore,
    levelInfo,
    activeSkillsCount: 2,
  };
}
