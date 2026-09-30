/**
 * Digital SAT Scoring Engine
 * Based on College Board Digital SAT multi-stage adaptive scoring standards.
 * 
 * Reading & Writing (RW): 2 modules, 27 questions each (54 total raw points)
 * Math: 2 modules, 22 questions each (44 total raw points)
 * Section Scores: 200 - 800 (10-point increments)
 * Total Score: 400 - 1600
 */

export interface SATInput {
  rwModule1: number; // 0 - 27
  rwModule2: number; // 0 - 27
  mathModule1: number; // 0 - 22
  mathModule2: number; // 0 - 22
}

export interface SATResult {
  rwRawTotal: number;
  rwMaxTotal: number;
  rwScore: number;
  rwRouting: "Harder (Advanced)" | "Standard (Foundational)";
  mathRawTotal: number;
  mathMaxTotal: number;
  mathScore: number;
  mathRouting: "Harder (Advanced)" | "Standard (Foundational)";
  compositeScore: number;
  percentile: number;
  status: "Needs Work" | "Competitive" | "Top Tier" | "Elite";
}

/**
 * Calculates scaled score (200 - 800) for Digital SAT Reading & Writing
 */
export function calculateRWScore(module1: number, module2: number): { score: number; routing: "Harder (Advanced)" | "Standard (Foundational)" } {
  const m1 = Math.max(0, Math.min(27, Math.round(module1 || 0)));
  const m2 = Math.max(0, Math.min(27, Math.round(module2 || 0)));
  const rawTotal = m1 + m2;

  if (rawTotal === 0) return { score: 200, routing: "Standard (Foundational)" };
  if (rawTotal === 54) return { score: 800, routing: "Harder (Advanced)" };

  // Digital SAT Adaptive routing threshold: Module 1 threshold is typically ~14-15
  const isHarderTrack = m1 >= 14;
  const routing = isHarderTrack ? "Harder (Advanced)" : "Standard (Foundational)";

  let scaled: number;
  if (isHarderTrack) {
    // Upper track: Range 480 - 800
    // 14 on M1 + 0 on M2 gives ~480. 27 on M1 + 27 on M2 gives 800.
    const excess = rawTotal - 14; // range 0 to 40
    scaled = 480 + Math.round((excess / 40) * 320);
  } else {
    // Lower track: Range 200 - 640
    // Max ceiling on lower track is capped at approx 640
    scaled = 200 + Math.round((rawTotal / 40) * 440);
  }

  // Bound to 200-800 in 10-point increments
  scaled = Math.min(800, Math.max(200, Math.round(scaled / 10) * 10));
  return { score: scaled, routing };
}

/**
 * Calculates scaled score (200 - 800) for Digital SAT Math
 */
export function calculateMathScore(module1: number, module2: number): { score: number; routing: "Harder (Advanced)" | "Standard (Foundational)" } {
  const m1 = Math.max(0, Math.min(22, Math.round(module1 || 0)));
  const m2 = Math.max(0, Math.min(22, Math.round(module2 || 0)));
  const rawTotal = m1 + m2;

  if (rawTotal === 0) return { score: 200, routing: "Standard (Foundational)" };
  if (rawTotal === 44) return { score: 800, routing: "Harder (Advanced)" };

  // Digital SAT Math Adaptive routing threshold: Module 1 threshold is typically ~12
  const isHarderTrack = m1 >= 12;
  const routing = isHarderTrack ? "Harder (Advanced)" : "Standard (Foundational)";

  let scaled: number;
  if (isHarderTrack) {
    // Upper track: Range 500 - 800
    const excess = rawTotal - 12; // range 0 to 32
    scaled = 500 + Math.round((excess / 32) * 300);
  } else {
    // Lower track: Range 200 - 620
    scaled = 200 + Math.round((rawTotal / 33) * 420);
  }

  scaled = Math.min(800, Math.max(200, Math.round(scaled / 10) * 10));
  return { score: scaled, routing };
}

/**
 * Computes nationally representative percentile from composite SAT score
 */
export function getSATPercentile(composite: number): number {
  if (composite >= 1550) return 99;
  if (composite >= 1500) return 98;
  if (composite >= 1450) return 96;
  if (composite >= 1400) return 93;
  if (composite >= 1350) return 89;
  if (composite >= 1300) return 84;
  if (composite >= 1250) return 78;
  if (composite >= 1200) return 72;
  if (composite >= 1150) return 65;
  if (composite >= 1100) return 57;
  if (composite >= 1050) return 49;
  if (composite >= 1000) return 41;
  if (composite >= 950) return 33;
  if (composite >= 900) return 25;
  if (composite >= 800) return 14;
  return Math.max(1, Math.round((composite - 400) / 40));
}

export function calculateSAT(input: SATInput): SATResult {
  const rw = calculateRWScore(input.rwModule1, input.rwModule2);
  const math = calculateMathScore(input.mathModule1, input.mathModule2);
  const compositeScore = rw.score + math.score;
  const percentile = getSATPercentile(compositeScore);

  let status: SATResult["status"] = "Needs Work";
  if (compositeScore >= 1450) status = "Elite";
  else if (compositeScore >= 1300) status = "Top Tier";
  else if (compositeScore >= 1150) status = "Competitive";

  return {
    rwRawTotal: Math.min(27, Math.max(0, input.rwModule1)) + Math.min(27, Math.max(0, input.rwModule2)),
    rwMaxTotal: 54,
    rwScore: rw.score,
    rwRouting: rw.routing,
    mathRawTotal: Math.min(22, Math.max(0, input.mathModule1)) + Math.min(22, Math.max(0, input.mathModule2)),
    mathMaxTotal: 44,
    mathScore: math.score,
    mathRouting: math.routing,
    compositeScore,
    percentile,
    status,
  };
}
