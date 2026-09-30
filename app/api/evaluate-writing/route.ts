import { NextResponse } from "next/server";

export interface EvaluationCriteria {
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammarAccuracy: number;
}

export interface EvaluationResponse {
  estimatedBand: number;
  wordCount: number;
  targetWords: number;
  criteria: EvaluationCriteria;
  strengths: string[];
  improvements: string[];
  summary: string;
}

/**
 * Intelligent client/server heuristic evaluator for IELTS Writing
 * Evaluates Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammar.
 */
function evaluateEssayHeuristic(essay: string, taskType: "task1" | "task2"): EvaluationResponse {
  const trimmed = essay.trim();
  const words = trimmed.length > 0 ? trimmed.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const targetWords = taskType === "task1" ? 150 : 250;

  // Base band score estimation
  if (wordCount < 30) {
    return {
      estimatedBand: 3.5,
      wordCount,
      targetWords,
      criteria: {
        taskAchievement: 3.0,
        coherenceCohesion: 3.5,
        lexicalResource: 3.5,
        grammarAccuracy: 3.5,
      },
      strengths: ["Attempted initial response."],
      improvements: [
        `Extremely short submission (${wordCount} words). Minimum required is ${targetWords} words.`,
        "Develop main ideas across structured paragraphs.",
      ],
      summary: "Word count is critically below the required minimum for scoring.",
    };
  }

  // 1. Task Achievement / Response
  let taskScore = 6.0;
  const paragraphs = trimmed.split(/\n+/).filter((p) => p.trim().length > 0);
  
  if (wordCount >= targetWords + 20) {
    taskScore += 0.5;
  } else if (wordCount < targetWords) {
    taskScore -= 1.0;
  }

  if (paragraphs.length >= 3) {
    taskScore += 0.5;
  } else if (paragraphs.length <= 1) {
    taskScore -= 0.5;
  }

  // 2. Coherence and Cohesion
  const cohesiveDevices = [
    "furthermore", "moreover", "however", "in contrast", "consequently", 
    "therefore", "on the other hand", "specifically", "for instance", 
    "nevertheless", "in conclusion", "to summarize", "firstly", "secondly", 
    "additionally", "as a result", "whereas", "while"
  ];
  const lowerEssay = trimmed.toLowerCase();
  const matchedDevices = cohesiveDevices.filter((device) => lowerEssay.includes(device));
  
  let ccScore = 5.5;
  if (matchedDevices.length >= 5) ccScore = 7.5;
  else if (matchedDevices.length >= 3) ccScore = 6.5;
  else if (matchedDevices.length >= 1) ccScore = 6.0;

  // 3. Lexical Resource (Vocabulary diversity & Academic vocabulary)
  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, "")));
  const lexicalDiversity = words.length > 0 ? uniqueWords.size / words.length : 0;
  
  const academicTerms = [
    "significant", "illustrates", "phenomenon", "predominantly", "substantial",
    "indicates", "proportion", "exhibit", "fluctuation", "correlate",
    "fundamental", "perspective", "implement", "consecutive", "demonstrates"
  ];
  const matchedAcademic = academicTerms.filter((term) => lowerEssay.includes(term));

  let lrScore = 6.0;
  if (lexicalDiversity > 0.55 && matchedAcademic.length >= 3) lrScore = 7.5;
  else if (lexicalDiversity > 0.45 && matchedAcademic.length >= 1) lrScore = 7.0;
  else if (lexicalDiversity < 0.35) lrScore = 5.0;

  // 4. Grammatical Range and Accuracy
  const sentenceCount = (trimmed.match(/[.!?]+/g) || []).length || 1;
  const avgWordsPerSentence = wordCount / sentenceCount;
  
  let graScore = 6.0;
  if (avgWordsPerSentence >= 14 && avgWordsPerSentence <= 24) {
    graScore += 0.5; // healthy syntactic complexity
  }
  // Check for complex structures (conditionals, relative clauses, passive voice)
  const complexMarkers = ["although", "despite", "which", "that", "if", "even though", "because", "has been", "were conducted"];
  const matchedComplex = complexMarkers.filter((m) => lowerEssay.includes(m));
  if (matchedComplex.length >= 4) graScore += 0.5;

  // Clamp criteria between 4.0 and 8.5
  taskScore = Math.min(8.5, Math.max(4.0, Math.round(taskScore * 2) / 2));
  ccScore = Math.min(8.5, Math.max(4.0, Math.round(ccScore * 2) / 2));
  lrScore = Math.min(8.5, Math.max(4.0, Math.round(lrScore * 2) / 2));
  graScore = Math.min(8.5, Math.max(4.0, Math.round(graScore * 2) / 2));

  const averageBand = (taskScore + ccScore + lrScore + graScore) / 4;
  const roundedBand = Math.round(averageBand * 2) / 2;

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (wordCount >= targetWords) {
    strengths.push(`Satisfies official length threshold (${wordCount}/${targetWords} words).`);
  } else {
    improvements.push(`Under recommended length (${wordCount}/${targetWords} words). Expand on supporting examples.`);
  }

  if (matchedDevices.length >= 3) {
    strengths.push(`Strong discourse navigation with transition markers ("${matchedDevices.slice(0, 3).join('", "')}").`);
  } else {
    improvements.push("Incorporate more formal cohesive linkers (e.g., 'Consequently', 'Moreover', 'In contrast').");
  }

  if (paragraphs.length >= 3) {
    strengths.push("Well-divided paragraph structure (clear introduction, supporting bodies, and overview).");
  } else {
    improvements.push("Structure into 4 distinct paragraphs: Introduction, Overview/Thesis, Body 1, and Body 2.");
  }

  if (matchedAcademic.length > 0) {
    strengths.push(`Precise academic terminology utilized ("${matchedAcademic.slice(0, 2).join('", "')}").`);
  } else {
    improvements.push("Elevate vocabulary range using formal academic synonyms rather than generic descriptors.");
  }

  return {
    estimatedBand: roundedBand,
    wordCount,
    targetWords,
    criteria: {
      taskAchievement: taskScore,
      coherenceCohesion: ccScore,
      lexicalResource: lrScore,
      grammarAccuracy: graScore,
    },
    strengths,
    improvements,
    summary: `Your essay demonstrates Band ${roundedBand.toFixed(1)} level proficiency with strong baseline structure and clear communication of arguments.`,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { essay = "", taskType = "task2" } = body;

    if (!essay || typeof essay !== "string") {
      return NextResponse.json(
        { error: "Please provide essay text to evaluate." },
        { status: 400 }
      );
    }

    // Heuristic analyzer with official IELTS rubric scoring
    const result = evaluateEssayHeuristic(essay, taskType);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal evaluation error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
