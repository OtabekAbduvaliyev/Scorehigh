/**
 * Uzbekistan National Certificate (Umumta'lim fanlaridan Milliy Sertifikat) Scoring Engine
 * Official UzBMBA / Bilimni baholash agentligi Rasch 75-point scaling standards.
 */

export type SubjectCategory = "categoryA" | "categoryB";

export interface MilliySubject {
  id: string;
  name: string;
  category: SubjectCategory;
  categoryLabel: string;
  maxQuestions?: number;
  testMaxRaw?: number;
  essayMaxRaw?: number;
}

export const MILLIY_SUBJECTS: MilliySubject[] = [
  // Category A: Exact & Natural Sciences & Humanities
  { id: "matematika", name: "Matematika", category: "categoryA", categoryLabel: "Aniq fanlar", maxQuestions: 45 },
  { id: "fizika", name: "Fizika", category: "categoryA", categoryLabel: "Aniq fanlar", maxQuestions: 45 },
  { id: "kimyo", name: "Kimyo", category: "categoryA", categoryLabel: "Tabiiy fanlar", maxQuestions: 45 },
  { id: "biologiya", name: "Biologiya", category: "categoryA", categoryLabel: "Tabiiy fanlar", maxQuestions: 45 },
  { id: "tarix", name: "Tarix", category: "categoryA", categoryLabel: "Ijtimoiy-gumanitar", maxQuestions: 45 },
  { id: "geografiya", name: "Geografiya", category: "categoryA", categoryLabel: "Ijtimoiy-gumanitar", maxQuestions: 45 },

  // Category B: Languages & Philology
  { id: "ona-tili", name: "Ona tili va adabiyot", category: "categoryB", categoryLabel: "Tillar va filologiya", testMaxRaw: 51, essayMaxRaw: 24 },
];

export type CertificateGrade = "A+" | "A" | "B+" | "B" | "C+" | "C" | "Fail";

export interface GradeInfo {
  grade: CertificateGrade;
  title: string;
  badgeText: string;
  passed: boolean;
  minScore: number;
  maxScore: number;
  description: string;
  colorClass: string;
  bgLightClass: string;
}

export const GRADE_THRESHOLDS: Record<CertificateGrade, GradeInfo> = {
  "A+": {
    grade: "A+",
    title: "Eng yuqori daraja",
    badgeText: "Grade A+",
    passed: true,
    minScore: 70.0,
    maxScore: 75.0,
    description: "Davlat OTMlariga kirish imtihonlarida ushbu fandan belgilangan maksimal ball (100%) beriladi.",
    colorClass: "text-[#7C3AED]",
    bgLightClass: "bg-purple-50 text-[#7C3AED] border-purple-200",
  },
  "A": {
    grade: "A",
    title: "A'lo daraja",
    badgeText: "Grade A",
    passed: true,
    minScore: 65.0,
    maxScore: 69.9,
    description: "Maksimal ballga nisbatan proporsional yuqori tabaqalashtirilgan imtiyoz beriladi.",
    colorClass: "text-[#7C3AED]",
    bgLightClass: "bg-purple-50 text-[#7C3AED] border-purple-200",
  },
  "B+": {
    grade: "B+",
    title: "Yaxshi daraja",
    badgeText: "Grade B+",
    passed: true,
    minScore: 60.0,
    maxScore: 64.9,
    description: "Fan bo'yicha mustahkam va chuqur bilim darajasi, imtihonda tabaqalashtirilgan ball beriladi.",
    colorClass: "text-emerald-600",
    bgLightClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "B": {
    grade: "B",
    title: "Qoniqarli daraja",
    badgeText: "Grade B",
    passed: true,
    minScore: 55.0,
    maxScore: 59.9,
    description: "Davlat ta'lim standartlari talablariga javob beruvchi ijobiy sertifikat darajasi.",
    colorClass: "text-blue-600",
    bgLightClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "C+": {
    grade: "C+",
    title: "Quyi daraja",
    badgeText: "Grade C+",
    passed: true,
    minScore: 50.0,
    maxScore: 54.9,
    description: "Asosiy bilim va kompetensiyalar shakllangan, o'tish balliga ega sertifikat darajasi.",
    colorClass: "text-amber-600",
    bgLightClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  "C": {
    grade: "C",
    title: "Minimal o'tish darajasi",
    badgeText: "Grade C",
    passed: true,
    minScore: 46.0,
    maxScore: 49.9,
    description: "Milliy sertifikat taqdim etiladigan minimal chegara (46.0 ball).",
    colorClass: "text-orange-600",
    bgLightClass: "bg-orange-50 text-orange-700 border-orange-200",
  },
  "Fail": {
    grade: "Fail",
    title: "Sertifikat berilmaydi",
    badgeText: "Chegara yetmadi",
    passed: false,
    minScore: 0.0,
    maxScore: 45.9,
    description: "To'plangan ball minimal 46.0 ballik o'tish talabiga yetmadi. Sertifikat berilmaydi.",
    colorClass: "text-rose-600",
    bgLightClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

/**
 * Determines grade from 0–75 standardized score
 */
export function getGradeFromScore(score: number): GradeInfo {
  const rounded = Math.round(score * 10) / 10;
  if (rounded >= 70.0) return GRADE_THRESHOLDS["A+"];
  if (rounded >= 65.0) return GRADE_THRESHOLDS["A"];
  if (rounded >= 60.0) return GRADE_THRESHOLDS["B+"];
  if (rounded >= 55.0) return GRADE_THRESHOLDS["B"];
  if (rounded >= 50.0) return GRADE_THRESHOLDS["C+"];
  if (rounded >= 46.0) return GRADE_THRESHOLDS["C"];
  return GRADE_THRESHOLDS["Fail"];
}

/**
 * Category A: Computes final 0–75 score
 */
export function calculateCategoryAScore(
  mode: "rasch" | "raw",
  raschScore: number,
  rawCorrect: number,
  maxQuestions: number = 45
): number {
  if (mode === "rasch") {
    return Math.max(0, Math.min(75, Math.round(raschScore)));
  }
  // Raw mode: Linear/proportional conversion from correct questions (0 - 45) to 0 - 75
  const clampedRaw = Math.max(0, Math.min(maxQuestions, rawCorrect));
  const converted = (clampedRaw / maxQuestions) * 75;
  return Math.round(converted * 10) / 10;
}

/**
 * Category B (Languages): Computes final 0–75 score from test (max 51) and essay (max 24)
 */
export function calculateCategoryBScore(
  testRaw: number,
  essayRaw: number,
  maxTest: number = 51,
  maxEssay: number = 24
): {
  testStandardized: number;
  essayStandardized: number;
  finalScore: number;
} {
  const clampedTest = Math.max(0, Math.min(maxTest, testRaw));
  const clampedEssay = Math.max(0, Math.min(maxEssay, essayRaw));

  // Both parts normalized to 75 scale
  const testStandardized = Math.round(((clampedTest / maxTest) * 75) * 10) / 10;
  const essayStandardized = Math.round(((clampedEssay / maxEssay) * 75) * 10) / 10;

  // Final subject score = Average of both standardized parts
  const finalScore = Math.round(((testStandardized + essayStandardized) / 2) * 10) / 10;

  return {
    testStandardized,
    essayStandardized,
    finalScore,
  };
}
