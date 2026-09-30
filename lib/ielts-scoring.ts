/**
 * Official IELTS Scoring Engine
 * Includes Listening, Academic Reading, General Training Reading, Writing, Speaking, and Official Rounding Logic.
 */

export type ReadingType = "academic" | "general";

export interface IELTSInput {
  listeningRaw: number; // 0 - 40
  readingRaw: number;   // 0 - 40
  readingType: ReadingType;
  writingBand: number;  // 0 - 9.0 (0.5 increments)
  speakingBand: number; // 0 - 9.0 (0.5 increments)
}

export interface IELTSResult {
  listeningBand: number;
  readingBand: number;
  writingBand: number;
  speakingBand: number;
  exactAverage: number;
  overallBand: number;
  cefrLevel: string;
  competencyTitle: string;
}

/**
 * Listening Raw Score (0 - 40) to IELTS Band
 */
export function rawToListeningBand(raw: number): number {
  const r = Math.max(0, Math.min(40, Math.round(raw || 0)));
  if (r >= 39) return 9.0;
  if (r >= 37) return 8.5;
  if (r >= 35) return 8.0;
  if (r >= 32) return 7.5;
  if (r >= 30) return 7.0;
  if (r >= 26) return 6.5;
  if (r >= 23) return 6.0;
  if (r >= 18) return 5.5;
  if (r >= 16) return 5.0;
  if (r >= 13) return 4.5;
  if (r >= 10) return 4.0;
  if (r >= 8) return 3.5;
  if (r >= 6) return 3.0;
  if (r >= 4) return 2.5;
  if (r >= 2) return 2.0;
  if (r >= 1) return 1.0;
  return 0.0;
}

/**
 * Academic Reading Raw Score (0 - 40) to IELTS Band
 */
export function rawToAcademicReadingBand(raw: number): number {
  const r = Math.max(0, Math.min(40, Math.round(raw || 0)));
  if (r >= 39) return 9.0;
  if (r >= 37) return 8.5;
  if (r >= 35) return 8.0;
  if (r >= 33) return 7.5;
  if (r >= 30) return 7.0;
  if (r >= 27) return 6.5;
  if (r >= 23) return 6.0;
  if (r >= 19) return 5.5;
  if (r >= 15) return 5.0;
  if (r >= 13) return 4.5;
  if (r >= 10) return 4.0;
  if (r >= 8) return 3.5;
  if (r >= 6) return 3.0;
  if (r >= 4) return 2.5;
  if (r >= 2) return 2.0;
  if (r >= 1) return 1.0;
  return 0.0;
}

/**
 * General Training Reading Raw Score (0 - 40) to IELTS Band
 */
export function rawToGeneralReadingBand(raw: number): number {
  const r = Math.max(0, Math.min(40, Math.round(raw || 0)));
  if (r >= 40) return 9.0;
  if (r >= 39) return 8.5;
  if (r >= 37) return 8.0;
  if (r >= 36) return 7.5;
  if (r >= 34) return 7.0;
  if (r >= 32) return 6.5;
  if (r >= 30) return 6.0;
  if (r >= 27) return 5.5;
  if (r >= 23) return 5.0;
  if (r >= 19) return 4.5;
  if (r >= 15) return 4.0;
  if (r >= 12) return 3.5;
  if (r >= 9) return 3.0;
  if (r >= 6) return 2.5;
  if (r >= 3) return 2.0;
  if (r >= 1) return 1.0;
  return 0.0;
}

/**
 * Official IELTS Rounding Algorithm:
 * - Fractional < 0.25 rounds down to whole band (e.g. 6.125 -> 6.0)
 * - Fractional >= 0.25 and < 0.75 rounds to half band (e.g. 6.25 -> 6.5, 6.74 -> 6.5)
 * - Fractional >= 0.75 rounds up to next whole band (e.g. 6.75 -> 7.0)
 */
export function roundIELTSBand(average: number): number {
  if (average <= 0) return 0.0;
  const intPart = Math.floor(average);
  const fracPart = average - intPart;

  if (fracPart < 0.2499) {
    return Number(intPart.toFixed(1));
  } else if (fracPart < 0.7499) {
    return Number((intPart + 0.5).toFixed(1));
  } else {
    return Number((intPart + 1.0).toFixed(1));
  }
}

export function getCEFRLevel(band: number): { level: string; title: string } {
  if (band >= 8.5) return { level: "C2", title: "Expert User" };
  if (band >= 7.5) return { level: "C1", title: "Very Good User" };
  if (band >= 6.5) return { level: "B2+", title: "Good User" };
  if (band >= 5.5) return { level: "B2", title: "Competent User" };
  if (band >= 4.5) return { level: "B1", title: "Modest User" };
  if (band >= 3.5) return { level: "A2", title: "Limited User" };
  return { level: "A1", title: "Intermittent / Non User" };
}

export function calculateIELTS(input: IELTSInput): IELTSResult {
  const listeningBand = rawToListeningBand(input.listeningRaw);
  const readingBand =
    input.readingType === "academic"
      ? rawToAcademicReadingBand(input.readingRaw)
      : rawToGeneralReadingBand(input.readingRaw);
  const writingBand = Math.max(0, Math.min(9.0, Number(input.writingBand) || 0));
  const speakingBand = Math.max(0, Math.min(9.0, Number(input.speakingBand) || 0));

  // Average of 4 official IELTS skills: Listening, Reading, Writing, Speaking
  const exactAverage = (listeningBand + readingBand + writingBand + speakingBand) / 4;
  const overallBand = roundIELTSBand(exactAverage);
  const { level: cefrLevel, title: competencyTitle } = getCEFRLevel(overallBand);

  return {
    listeningBand,
    readingBand,
    writingBand,
    speakingBand,
    exactAverage: Number(exactAverage.toFixed(3)),
    overallBand,
    cefrLevel,
    competencyTitle,
  };
}
