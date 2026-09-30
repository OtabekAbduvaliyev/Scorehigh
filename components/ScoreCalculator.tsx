"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Minus,
  BookOpen,
  Calculator,
  Headphones,
  PenLine,
  Mic,
  RotateCcw,
  Award,
  GraduationCap,
  FileText,
  CheckCircle2,
  Languages,
  Lock,
  Info,
} from "lucide-react";
import { calculateSAT, SATInput } from "@/lib/sat-scoring";
import { calculateIELTS, IELTSInput, ReadingType } from "@/lib/ielts-scoring";
import {
  MILLIY_SUBJECTS,
  MilliySubject,
  getGradeFromScore,
  calculateCategoryAScore,
  calculateCategoryBScore,
  GRADE_THRESHOLDS,
  CertificateGrade,
} from "@/lib/milliy-scoring";
import {
  calculateCEFR,
  CEFRInput,
  CEFR_THRESHOLDS,
  CEFRLevel,
} from "@/lib/cefr-scoring";

type TabMode = "sat" | "ielts" | "milliy" | "cefr";

// ─── Precision Stepper Control (Refined, minimal border-radius) ─────────────
function Stepper({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const clamp = (v: number) =>
    Math.max(min, Math.min(max, step < 1 ? Math.round(v * 10) / 10 : Math.round(v)));
  return (
    <div className="inline-flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shrink-0">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        onClick={() => onChange(clamp(value - step))}
        className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const raw = parseFloat(e.target.value);
          onChange(clamp(isNaN(raw) ? min : raw));
        }}
        className="w-12 sm:w-12 h-8 text-center text-xs sm:text-sm font-semibold text-gray-900 border-x border-gray-200 bg-transparent focus:outline-none"
      />
      <button
        type="button"
        aria-label={`Increase ${label}`}
        onClick={() => onChange(clamp(value + step))}
        className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Input Row (label + stepper + smooth slider) ───────────────────────────
function InputRow({
  label,
  subtitle,
  value,
  min,
  max,
  step = 1,
  onChange,
  sliderBg,
}: {
  label: string;
  subtitle?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  sliderBg: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-xs sm:text-sm font-medium text-gray-800 block truncate">{label}</span>
          {subtitle && (
            <span className="text-[11px] text-gray-400 block truncate">{subtitle}</span>
          )}
        </div>
        <Stepper value={value} min={min} max={max} step={step} onChange={onChange} label={label} />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ background: sliderBg }}
        onChange={(e) => onChange(Number(e.target.value))}
        className="score-slider"
      />
    </div>
  );
}

// ─── Band Selector (Refined compact pills) ──────────────────────────────────
function BandSelector({
  bands,
  selected,
  onSelect,
}: {
  bands: number[];
  selected: number;
  onSelect: (v: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 sm:gap-1.5 py-0.5">
      {bands.map((b) => (
        <button
          key={b}
          type="button"
          onClick={() => onSelect(b)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer transition-all active:scale-95 ${
            selected === b
              ? "bg-[#7C3AED] text-white shadow-2xs"
              : "bg-gray-100/80 text-gray-600 hover:text-gray-900 hover:bg-gray-200/70"
          }`}
        >
          {b.toFixed(1)}
        </button>
      ))}
    </div>
  );
}

// ─── Main Calculator Component ─────────────────────────────────────────────
export default function ScoreCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>("sat");

  // SAT State
  const [satInputs, setSatInputs] = useState<SATInput>({
    rwModule1: 22,
    rwModule2: 21,
    mathModule1: 20,
    mathModule2: 19,
  });

  // IELTS State
  const [ieltsInputs, setIeltsInputs] = useState<IELTSInput>({
    listeningRaw: 34,
    readingRaw: 32,
    readingType: "academic",
    writingBand: 7.0,
    speakingBand: 7.5,
  });

  // Milliy Sertifikat State
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("matematika");
  // Category A state
  const [catAMode, setCatAMode] = useState<"rasch" | "raw">("raw");
  const [catARasch, setCatARasch] = useState<number>(68);
  const [catARaw, setCatARaw] = useState<number>(41);
  // Category B state (Languages)
  const [catBTestRaw, setCatBTestRaw] = useState<number>(45);
  const [catBEssayRaw, setCatBEssayRaw] = useState<number>(21);

  // CEFR / Multi-level State
  const [cefrMode, setCefrMode] = useState<"raw" | "scale">("raw");
  const [cefrListeningRaw, setCefrListeningRaw] = useState<number>(26);
  const [cefrReadingRaw, setCefrReadingRaw] = useState<number>(24);
  const [cefrListeningScale, setCefrListeningScale] = useState<number>(63);
  const [cefrReadingScale, setCefrReadingScale] = useState<number>(60);

  // Derived Calculations
  const satResult = calculateSAT(satInputs);
  const ieltsResult = calculateIELTS(ieltsInputs);
  const cefrResult = calculateCEFR({
    inputMode: cefrMode,
    listeningRaw: cefrListeningRaw,
    readingRaw: cefrReadingRaw,
    listeningScale: cefrListeningScale,
    readingScale: cefrReadingScale,
  });

  // Milliy Sertifikat Calculations
  const activeSubject =
    MILLIY_SUBJECTS.find((s) => s.id === selectedSubjectId) || MILLIY_SUBJECTS[0];
  const isCategoryB = activeSubject.category === "categoryB";

  let milliyFinalScore = 0;
  let catBBreakdown: { testStandardized: number; essayStandardized: number; finalScore: number } | null = null;

  if (isCategoryB) {
    catBBreakdown = calculateCategoryBScore(
      catBTestRaw,
      catBEssayRaw,
      activeSubject.testMaxRaw || 51,
      activeSubject.essayMaxRaw || 24
    );
    milliyFinalScore = catBBreakdown.finalScore;
  } else {
    milliyFinalScore = calculateCategoryAScore(
      catAMode,
      catARasch,
      catARaw,
      activeSubject.maxQuestions || 45
    );
  }

  const milliyGradeInfo = getGradeFromScore(milliyFinalScore);

  const handleSATChange = (key: keyof SATInput, val: number, max: number) => {
    const clamped = isNaN(val) ? 0 : Math.max(0, Math.min(max, val));
    setSatInputs((prev) => ({ ...prev, [key]: clamped }));
  };

  const getSliderBg = (val: number, max: number) => {
    const pct = Math.min(100, Math.max(0, (val / max) * 100));
    return `linear-gradient(to right, #7C3AED 0%, #7C3AED ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`;
  };

  const resetSAT = () => setSatInputs({ rwModule1: 22, rwModule2: 21, mathModule1: 20, mathModule2: 19 });
  const resetIELTS = () => setIeltsInputs({ listeningRaw: 34, readingRaw: 32, readingType: "academic", writingBand: 7.0, speakingBand: 7.5 });
  const resetMilliy = () => {
    setCatAMode("raw");
    setCatARasch(68);
    setCatARaw(41);
    setCatBTestRaw(45);
    setCatBEssayRaw(21);
  };
  const resetCEFR = () => {
    setCefrMode("raw");
    setCefrListeningRaw(26);
    setCefrReadingRaw(24);
    setCefrListeningScale(63);
    setCefrReadingScale(60);
  };

  return (
    <div className="w-full min-h-screen bg-white font-sans text-gray-900">

      {/* ━━━ FIXED TOP APP HEADER ━━━ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <Image
              src="/logo-icon.svg"
              alt="ScoreHigh"
              width={26}
              height={26}
              priority
              className="w-6 h-6 sm:w-6.5 sm:h-6.5 object-contain shrink-0"
            />
            <span className="text-base font-bold tracking-tight text-gray-900">
              Score<span className="text-[#7C3AED]">High</span>
            </span>
          </div>

          {/* 4-Tab Selector: SAT / IELTS / Milliy / CEFR */}
          <div className="flex items-center bg-gray-100 rounded-md p-0.5 border border-gray-200/50 overflow-x-auto no-scrollbar max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab("sat")}
              className={`px-2.5 sm:px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === "sat"
                  ? "bg-white text-gray-900 shadow-2xs font-bold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {activeTab === "sat" && <BookOpen className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />}
              <span>SAT</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ielts")}
              className={`px-2.5 sm:px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === "ielts"
                  ? "bg-white text-gray-900 shadow-2xs font-bold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {activeTab === "ielts" && <Award className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />}
              <span>IELTS</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("milliy")}
              className={`px-2.5 sm:px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === "milliy"
                  ? "bg-white text-gray-900 shadow-2xs font-bold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {activeTab === "milliy" && <GraduationCap className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />}
              <span>Milliy</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cefr")}
              className={`px-2.5 sm:px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === "cefr"
                  ? "bg-white text-gray-900 shadow-2xs font-bold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {activeTab === "cefr" && <Languages className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />}
              <span>CEFR</span>
            </button>
          </div>
        </div>
      </header>

      {/* ━━━ MAIN CONTAINER ━━━ */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-7">

        {/* ════════════════════════════════════════════════════════════ */}
        {/* SAT TAB VIEW                                                */}
        {/* ════════════════════════════════════════════════════════════ */}
        {activeTab === "sat" && (
          <div className="animate-fade-in space-y-6">

            {/* UNIFIED HERO SCORE STRIP (Complete Score has Higher Intensity) */}
            <div className="border border-gray-200/80 rounded-lg p-4 sm:p-5 bg-gray-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                
                {/* 1. Complete Score (HERO INTENSITY) */}
                <div className="flex items-center justify-between md:justify-start gap-4 sm:gap-6 pr-0 md:pr-8 md:border-r md:border-gray-200/80 shrink-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Composite Score
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-[#7C3AED]">
                        {satResult.status}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight leading-none">
                        {satResult.compositeScore}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-gray-400">/ 1600</span>
                    </div>
                  </div>

                  {/* Mobile Reset */}
                  <button
                    type="button"
                    onClick={resetSAT}
                    className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* 2. Subscores (Refined, Subordinate Hierarchy) */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 flex-1 items-center">
                  
                  {/* Reading & Writing Subscore */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] sm:text-xs font-medium text-gray-500 block truncate">
                      Reading & Writing
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl sm:text-2xl font-bold text-gray-800">
                        {satResult.rwScore}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">/ 800</span>
                    </div>
                  </div>

                  {/* Math Subscore */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] sm:text-xs font-medium text-gray-500 block truncate">
                      Math Section
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl sm:text-2xl font-bold text-gray-800">
                        {satResult.mathScore}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">/ 800</span>
                    </div>
                  </div>

                  {/* Percentile + Desktop Reset */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[11px] sm:text-xs font-medium text-gray-500 block truncate">
                        Percentile
                      </span>
                      <div className="text-xl sm:text-2xl font-bold text-gray-800">
                        {satResult.percentile}<span className="text-xs font-normal text-gray-400 ml-0.5">th</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={resetSAT}
                      className="hidden md:block p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer shrink-0"
                      title="Reset to defaults"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Subtle Progress Bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden -mt-2">
              <div
                className="h-full bg-[#7C3AED] rounded-full transition-all duration-200"
                style={{ width: `${((satResult.compositeScore - 400) / 1200) * 100}%` }}
              />
            </div>

            {/* 2-COLUMN REFINED CONTROLS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

              {/* ── Section: Reading & Writing ── */}
              <section className="border border-gray-200/80 rounded-lg p-4 sm:p-5 bg-white space-y-4">
                
                {/* Refined Section Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#7C3AED]" />
                    <h2 className="text-sm font-semibold text-gray-900">Reading & Writing</h2>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-400">Score:</span>
                    <span className="text-base sm:text-lg font-bold text-[#7C3AED]">{satResult.rwScore}</span>
                    <span className="text-xs text-gray-400">/ 800</span>
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4 pt-1">
                  <InputRow
                    label="Module 1"
                    subtitle="27 questions · Routing stage"
                    value={satInputs.rwModule1}
                    min={0}
                    max={27}
                    onChange={(v) => handleSATChange("rwModule1", v, 27)}
                    sliderBg={getSliderBg(satInputs.rwModule1, 27)}
                  />
                  <InputRow
                    label="Module 2"
                    subtitle={`27 questions · ${satResult.rwRouting}`}
                    value={satInputs.rwModule2}
                    min={0}
                    max={27}
                    onChange={(v) => handleSATChange("rwModule2", v, 27)}
                    sliderBg={getSliderBg(satInputs.rwModule2, 27)}
                  />
                </div>
              </section>

              {/* ── Section: Math ── */}
              <section className="border border-gray-200/80 rounded-lg p-4 sm:p-5 bg-white space-y-4">
                
                {/* Refined Section Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#7C3AED]" />
                    <h2 className="text-sm font-semibold text-gray-900">Math</h2>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-400">Score:</span>
                    <span className="text-base sm:text-lg font-bold text-[#7C3AED]">{satResult.mathScore}</span>
                    <span className="text-xs text-gray-400">/ 800</span>
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4 pt-1">
                  <InputRow
                    label="Module 1"
                    subtitle="22 questions · Routing stage"
                    value={satInputs.mathModule1}
                    min={0}
                    max={22}
                    onChange={(v) => handleSATChange("mathModule1", v, 22)}
                    sliderBg={getSliderBg(satInputs.mathModule1, 22)}
                  />
                  <InputRow
                    label="Module 2"
                    subtitle={`22 questions · ${satResult.mathRouting}`}
                    value={satInputs.mathModule2}
                    min={0}
                    max={22}
                    onChange={(v) => handleSATChange("mathModule2", v, 22)}
                    sliderBg={getSliderBg(satInputs.mathModule2, 22)}
                  />
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* IELTS TAB VIEW                                               */}
        {/* ════════════════════════════════════════════════════════════ */}
        {activeTab === "ielts" && (
          <div className="animate-fade-in space-y-6">

            {/* UNIFIED HERO SCORE STRIP (Complete Score has Higher Intensity) */}
            <div className="border border-gray-200/80 rounded-lg p-4 sm:p-5 bg-gray-50/50">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                
                {/* 1. Complete Score (HERO INTENSITY) */}
                <div className="flex items-center justify-between lg:justify-start gap-4 sm:gap-6 pr-0 lg:pr-8 lg:border-r lg:border-gray-200/80 shrink-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Overall IELTS Band
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-[#7C3AED]">
                        CEFR {ieltsResult.cefrLevel}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight leading-none">
                        {ieltsResult.overallBand.toFixed(1)}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-gray-400">/ 9.0</span>
                    </div>
                  </div>

                  {/* Mobile Reset */}
                  <button
                    type="button"
                    onClick={resetIELTS}
                    className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* 2. Subscores (Refined, Subordinate Hierarchy) */}
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 sm:gap-6 flex-1 items-center">
                  
                  {/* Listening */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] sm:text-xs font-medium text-gray-500 block truncate">
                      Listening
                    </span>
                    <div className="text-lg sm:text-xl font-bold text-gray-800">
                      {ieltsResult.listeningBand.toFixed(1)}
                    </div>
                  </div>

                  {/* Reading */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] sm:text-xs font-medium text-gray-500 block truncate">
                      Reading
                    </span>
                    <div className="text-lg sm:text-xl font-bold text-gray-800">
                      {ieltsResult.readingBand.toFixed(1)}
                    </div>
                  </div>

                  {/* Writing */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] sm:text-xs font-medium text-gray-500 block truncate">
                      Writing
                    </span>
                    <div className="text-lg sm:text-xl font-bold text-gray-800">
                      {ieltsInputs.writingBand.toFixed(1)}
                    </div>
                  </div>

                  {/* Speaking + Desktop Reset */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[11px] sm:text-xs font-medium text-gray-500 block truncate">
                        Speaking
                      </span>
                      <div className="text-lg sm:text-xl font-bold text-gray-800">
                        {ieltsInputs.speakingBand.toFixed(1)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={resetIELTS}
                      className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer shrink-0"
                      title="Reset to defaults"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Subtle Progress Bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden -mt-2">
              <div
                className="h-full bg-[#7C3AED] rounded-full transition-all duration-200"
                style={{ width: `${(ieltsResult.overallBand / 9.0) * 100}%` }}
              />
            </div>

            {/* 2-COLUMN REFINED CONTROLS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

              {/* ── 1. Listening ── */}
              <section className="border border-gray-200/80 rounded-lg p-4 sm:p-5 bg-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-[#7C3AED]" />
                    <h2 className="text-sm font-semibold text-gray-900">Listening</h2>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-400">Score:</span>
                    <span className="text-base sm:text-lg font-bold text-[#7C3AED]">
                      Band {ieltsResult.listeningBand.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <InputRow
                    label="Correct answers"
                    subtitle="Out of 40 questions"
                    value={ieltsInputs.listeningRaw}
                    min={0}
                    max={40}
                    onChange={(v) => setIeltsInputs((p) => ({ ...p, listeningRaw: v }))}
                    sliderBg={getSliderBg(ieltsInputs.listeningRaw, 40)}
                  />
                </div>
              </section>

              {/* ── 2. Reading ── */}
              <section className="border border-gray-200/80 rounded-lg p-4 sm:p-5 bg-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#7C3AED]" />
                    <h2 className="text-sm font-semibold text-gray-900">Reading</h2>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-400">Score:</span>
                    <span className="text-base sm:text-lg font-bold text-[#7C3AED]">
                      Band {ieltsResult.readingBand.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Academic vs General Toggle */}
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden w-fit">
                  <button
                    type="button"
                    onClick={() => setIeltsInputs((p) => ({ ...p, readingType: "academic" }))}
                    className={`px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                      ieltsInputs.readingType === "academic"
                        ? "bg-[#7C3AED] text-white"
                        : "text-gray-500 hover:text-gray-800 bg-white"
                    }`}
                  >
                    Academic
                  </button>
                  <button
                    type="button"
                    onClick={() => setIeltsInputs((p) => ({ ...p, readingType: "general" }))}
                    className={`px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                      ieltsInputs.readingType === "general"
                        ? "bg-[#7C3AED] text-white"
                        : "text-gray-500 hover:text-gray-800 bg-white"
                    }`}
                  >
                    General
                  </button>
                </div>

                <div className="pt-1">
                  <InputRow
                    label="Correct answers"
                    subtitle="Out of 40 questions"
                    value={ieltsInputs.readingRaw}
                    min={0}
                    max={40}
                    onChange={(v) => setIeltsInputs((p) => ({ ...p, readingRaw: v }))}
                    sliderBg={getSliderBg(ieltsInputs.readingRaw, 40)}
                  />
                </div>
              </section>

              {/* ── 3. Writing ── */}
              <section className="border border-gray-200/80 rounded-lg p-4 sm:p-5 bg-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <PenLine className="w-4 h-4 text-[#7C3AED]" />
                    <h2 className="text-sm font-semibold text-gray-900">Writing</h2>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-400">Score:</span>
                    <span className="text-base sm:text-lg font-bold text-[#7C3AED]">
                      Band {ieltsInputs.writingBand.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <BandSelector
                    bands={[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0]}
                    selected={ieltsInputs.writingBand}
                    onSelect={(v) => setIeltsInputs((p) => ({ ...p, writingBand: v }))}
                  />
                  <input
                    type="range"
                    min={0}
                    max={9.0}
                    step={0.5}
                    value={ieltsInputs.writingBand}
                    style={{ background: getSliderBg(ieltsInputs.writingBand, 9.0) }}
                    onChange={(e) => setIeltsInputs((p) => ({ ...p, writingBand: parseFloat(e.target.value) }))}
                    className="score-slider"
                  />
                </div>
              </section>

              {/* ── 4. Speaking ── */}
              <section className="border border-gray-200/80 rounded-lg p-4 sm:p-5 bg-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[#7C3AED]" />
                    <h2 className="text-sm font-semibold text-gray-900">Speaking</h2>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-400">Score:</span>
                    <span className="text-base sm:text-lg font-bold text-[#7C3AED]">
                      Band {ieltsInputs.speakingBand.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <BandSelector
                    bands={[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0]}
                    selected={ieltsInputs.speakingBand}
                    onSelect={(v) => setIeltsInputs((p) => ({ ...p, speakingBand: v }))}
                  />
                  <input
                    type="range"
                    min={0}
                    max={9.0}
                    step={0.5}
                    value={ieltsInputs.speakingBand}
                    style={{ background: getSliderBg(ieltsInputs.speakingBand, 9.0) }}
                    onChange={(e) => setIeltsInputs((p) => ({ ...p, speakingBand: parseFloat(e.target.value) }))}
                    className="score-slider"
                  />
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* MILLIY SERTIFIKAT TAB VIEW                                  */}
        {/* ════════════════════════════════════════════════════════════ */}
        {activeTab === "milliy" && (
          <div className="animate-fade-in space-y-6">

            {/* 1. SUBJECT SELECTOR CHIPS */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fan tanlang:
                </span>
                <span className="text-[11px] font-medium text-gray-400">
                  {activeSubject.categoryLabel} · {isCategoryB ? "Test + Yozma ish (Insho)" : "45 ta topshiriq"}
                </span>
              </div>

              {/* Mobile-optimized swipeable chips / desktop wrap */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                {MILLIY_SUBJECTS.map((subj) => (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => setSelectedSubjectId(subj.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-all active:scale-95 shrink-0 whitespace-nowrap ${
                      selectedSubjectId === subj.id
                        ? "bg-[#7C3AED] text-white shadow-2xs font-bold"
                        : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/70 border border-gray-200/50"
                    }`}
                  >
                    {subj.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. UNIFIED HERO SCORE STRIP (High-Intensity Complete Grade & Score) */}
            <div className="border border-gray-200/80 rounded-lg p-3.5 sm:p-5 bg-gray-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
                
                {/* HERO Complete Awarded Grade */}
                <div className="flex items-center justify-between md:justify-start gap-4 sm:gap-6 pr-0 md:pr-8 md:border-r md:border-gray-200/80 shrink-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Sertifikat Darajasi
                      </span>
                      <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded border ${milliyGradeInfo.bgLightClass}`}>
                        {milliyGradeInfo.title}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl sm:text-5xl font-black tracking-tight leading-none ${milliyGradeInfo.colorClass}`}>
                        {milliyGradeInfo.grade}
                      </span>
                      <span className="text-xs sm:text-base font-semibold text-gray-400">
                        {milliyGradeInfo.passed ? "Muvaffaqiyatli" : "Yetmadi"}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Reset */}
                  <button
                    type="button"
                    onClick={resetMilliy}
                    className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Subscores / Standardized Metrics Strip (Symmetrical 3-Column on all screens!) */}
                <div className="grid grid-cols-3 gap-2 sm:gap-6 flex-1 items-center">
                  
                  {/* Standartlashtirilgan ball */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-500 block truncate">
                      Yakuniy Ball
                    </span>
                    <div className="flex items-baseline gap-0.5 sm:gap-1">
                      <span className="text-lg sm:text-2xl font-bold text-gray-900">
                        {milliyFinalScore.toFixed(1)}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400 font-medium">/ 75</span>
                    </div>
                  </div>

                  {/* If Category B: Show Test & Essay Standardized breakdown */}
                  {isCategoryB && catBBreakdown ? (
                    <div className="space-y-0.5">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-500 block truncate">
                        Test / Yozma
                      </span>
                      <div className="text-sm sm:text-lg font-bold text-gray-800 truncate">
                        {catBBreakdown.testStandardized.toFixed(0)} <span className="text-xs text-gray-400">/</span> {catBBreakdown.essayStandardized.toFixed(0)}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-500 block truncate">
                        O'tish chegarasi
                      </span>
                      <div className="text-sm sm:text-lg font-bold text-gray-800">
                        46 <span className="text-[10px] sm:text-xs text-gray-400 font-normal">(C)</span>
                      </div>
                    </div>
                  )}

                  {/* Imtiyoz holati + Desktop Reset */}
                  <div className="flex items-center justify-between gap-1 sm:gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-500 block truncate">
                        Sertifikat
                      </span>
                      <div className="text-xs sm:text-base font-bold text-gray-900 flex items-center gap-1">
                        {milliyGradeInfo.passed ? (
                          <span className="text-emerald-600 flex items-center gap-0.5 sm:gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Beriladi</span>
                          </span>
                        ) : (
                          <span className="text-rose-600">Berilmaydi</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={resetMilliy}
                      className="hidden md:block p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer shrink-0"
                      title="Reset to defaults"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Subtle Progress Bar */}
            <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden -mt-2">
              <div
                className="h-full bg-[#7C3AED] rounded-full transition-all duration-200"
                style={{ width: `${Math.min(100, Math.max(0, (milliyFinalScore / 75) * 100))}%` }}
              />
            </div>

            {/* 3. DYNAMIC INPUT CONTROLS BASED ON SUBJECT CATEGORY */}
            
            {/* ─── CATEGORY A: Exact & Natural Sciences & Humanities (45 Questions) ─── */}
            {!isCategoryB && (
              <section className="border border-gray-200/80 rounded-lg p-3.5 sm:p-5 bg-white space-y-4 sm:space-y-5">
                
                {/* Header & Mode Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2.5 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#7C3AED] shrink-0" />
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">{activeSubject.name}</h2>
                      <p className="text-[11px] text-gray-400">45 ta topshiriq · UzBMBA Rasch shkalasi</p>
                    </div>
                  </div>

                  {/* Input Mode Selector: Rasch vs Raw (Symmetrical full width on mobile) */}
                  <div className="grid grid-cols-2 sm:flex sm:items-center border border-gray-200 rounded-md overflow-hidden text-xs w-full sm:w-auto text-center">
                    <button
                      type="button"
                      onClick={() => setCatAMode("raw")}
                      className={`px-3 py-1.5 sm:py-1 font-semibold cursor-pointer transition-colors ${
                        catAMode === "raw"
                          ? "bg-[#7C3AED] text-white"
                          : "text-gray-500 hover:text-gray-800 bg-white"
                      }`}
                    >
                      To'g'ri javoblar (0–45)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatAMode("rasch")}
                      className={`px-3 py-1.5 sm:py-1 font-semibold cursor-pointer transition-colors ${
                        catAMode === "rasch"
                          ? "bg-[#7C3AED] text-white"
                          : "text-gray-500 hover:text-gray-800 bg-white"
                      }`}
                    >
                      Rasch bali (0–75)
                    </button>
                  </div>
                </div>

                {/* Active Mode Input Slider */}
                <div className="pt-1">
                  {catAMode === "rasch" ? (
                    <InputRow
                      label="Standartlashtirilgan Rasch bali"
                      subtitle="0 dan 75 gacha to'plangan yakuniy shkala bali"
                      value={catARasch}
                      min={0}
                      max={75}
                      step={1}
                      onChange={(v) => setCatARasch(v)}
                      sliderBg={getSliderBg(catARasch, 75)}
                    />
                  ) : (
                    <div className="space-y-3">
                      <InputRow
                        label="To'g'ri yechilgan topshiriqlar soni"
                        subtitle="Maksimal 45 ta topshiriq (Proporsional 75 ballik konvertatsiya)"
                        value={catARaw}
                        min={0}
                        max={45}
                        step={1}
                        onChange={(v) => setCatARaw(v)}
                        sliderBg={getSliderBg(catARaw, 45)}
                      />
                      <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-md border border-gray-200/60 flex items-center justify-between">
                        <span>75 ballik ekvivalent:</span>
                        <span className="font-bold text-gray-900">{milliyFinalScore.toFixed(1)} ball</span>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ─── CATEGORY B: Languages & Philology (Test + Essay) ─── */}
            {isCategoryB && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                
                {/* 1. Test Section (1-bo'lim) */}
                <section className="border border-gray-200/80 rounded-lg p-3.5 sm:p-5 bg-white space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-[#7C3AED] shrink-0" />
                      <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-gray-900 truncate">1-bo'lim: Test topshiriqlari</h2>
                        <p className="text-[11px] text-gray-400 truncate">Matnni tushunish, qoidalar va tahlil</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide block">Standart</span>
                      <span className="text-sm font-bold text-[#7C3AED]">
                        {catBBreakdown ? catBBreakdown.testStandardized.toFixed(0) : 0} <span className="text-xs text-gray-400">/ 75</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <InputRow
                      label="To'plangan xom test bali"
                      subtitle="0 dan 51 ballgacha (BMBA standarti)"
                      value={catBTestRaw}
                      min={0}
                      max={51}
                      step={1}
                      onChange={(v) => setCatBTestRaw(v)}
                      sliderBg={getSliderBg(catBTestRaw, 51)}
                    />
                  </div>
                </section>

                {/* 2. Written Essay Section (2-bo'lim) */}
                <section className="border border-gray-200/80 rounded-lg p-3.5 sm:p-5 bg-white space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <PenLine className="w-4 h-4 text-[#7C3AED] shrink-0" />
                      <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-gray-900 truncate">2-bo'lim: Yozma ish (Insho)</h2>
                        <p className="text-[11px] text-gray-400 truncate">Mavzu, mantiq, orfografiya va struktura</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide block">Standart</span>
                      <span className="text-sm font-bold text-[#7C3AED]">
                        {catBBreakdown ? catBBreakdown.essayStandardized.toFixed(0) : 0} <span className="text-xs text-gray-400">/ 75</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <InputRow
                      label="Insho baholash mezonlari bali"
                      subtitle="0 dan 24 ballgacha (Rasmiy 24 ballik mezon)"
                      value={catBEssayRaw}
                      min={0}
                      max={24}
                      step={1}
                      onChange={(v) => setCatBEssayRaw(v)}
                      sliderBg={getSliderBg(catBEssayRaw, 24)}
                    />
                  </div>
                </section>

              </div>
            )}

            {/* 4. OFFICIAL GRADE REFERENCE & PERFORMANCE SUMMARY */}
            <section className="border border-gray-200/80 rounded-lg p-3.5 sm:p-5 bg-white space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                    Rasmiy Darajalar Shkalasi (UzBMBA)
                  </h3>
                </div>
                <span className="text-[11px] text-gray-400">0 – 75 shkala</span>
              </div>

              {/* Thresholds: Smooth swipeable row on mobile, clean 7-column grid on desktop! */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-7 sm:gap-2 text-xs">
                {(["A+", "A", "B+", "B", "C+", "C", "Fail"] as CertificateGrade[]).map((gKey) => {
                  const t = GRADE_THRESHOLDS[gKey];
                  const isCurrent = milliyGradeInfo.grade === gKey;
                  return (
                    <div
                      key={gKey}
                      className={`p-2 sm:p-2.5 rounded-md border text-center transition-all min-w-[74px] sm:min-w-0 shrink-0 sm:shrink ${
                        isCurrent
                          ? "border-[#7C3AED] bg-purple-50/70 shadow-2xs font-semibold ring-1 ring-[#7C3AED]/20"
                          : "border-gray-200/70 bg-gray-50/50 text-gray-600"
                      }`}
                    >
                      <div className={`text-sm sm:text-base font-black ${isCurrent ? "text-[#7C3AED]" : "text-gray-800"}`}>
                        {t.grade}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-bold text-gray-500 mt-0.5">
                        {gKey === "A+"
                          ? "≥ 70"
                          : gKey === "Fail"
                          ? "< 46"
                          : `${Math.round(t.minScore)}–${Math.round(t.maxScore)}`}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 truncate">
                        {t.title}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Description of Current Grade */}
              <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-md text-xs text-purple-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5 flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-[#7C3AED] shrink-0" />
                  <span>{activeSubject.name} bo'yicha baholash natijasi:</span>
                  <span className="font-bold underline">{milliyGradeInfo.title} ({milliyGradeInfo.grade})</span>
                </div>
                <p className="text-[11px] text-purple-800/80 leading-relaxed">
                  {milliyGradeInfo.description}
                </p>
              </div>
            </section>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* CEFR / MULTI-LEVEL (UZBEKISTAN) TAB VIEW                     */}
        {/* ════════════════════════════════════════════════════════════ */}
        {activeTab === "cefr" && (
          <div className="animate-fade-in space-y-6">

            {/* 1. UNIFIED HERO SCORE STRIP */}
            <div className="border border-gray-200/80 rounded-lg p-3.5 sm:p-5 bg-gray-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
                
                {/* HERO Complete Awarded CEFR Level */}
                <div className="flex items-center justify-between md:justify-start gap-4 sm:gap-6 pr-0 md:pr-8 md:border-r md:border-gray-200/80 shrink-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        CEFR Darajasi
                      </span>
                      <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded border ${cefrResult.levelInfo.bgLightClass}`}>
                        {cefrResult.levelInfo.title}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl sm:text-5xl font-black tracking-tight leading-none ${cefrResult.levelInfo.colorClass}`}>
                        {cefrResult.levelInfo.level === "Fail" ? "B1 dan quyi" : `${cefrResult.levelInfo.level} Daraja`}
                      </span>
                      <span className="text-xs sm:text-base font-semibold text-gray-400">
                        {cefrResult.levelInfo.passed ? "Sertifikat beriladi" : "Sertifikat berilmaydi"}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Reset */}
                  <button
                    type="button"
                    onClick={resetCEFR}
                    className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Subscores / Standardized Metrics Strip */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 flex-1 items-center">
                  
                  {/* Overall Average Score */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-500 block truncate">
                      Umumiy Ball
                    </span>
                    <div className="flex items-baseline gap-0.5 sm:gap-1">
                      <span className="text-lg sm:text-2xl font-bold text-gray-900">
                        {cefrResult.overallScore.toFixed(1)}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400 font-medium">/ 75</span>
                    </div>
                  </div>

                  {/* Listening */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-500 block truncate">
                      Listening
                    </span>
                    <div className="text-sm sm:text-xl font-bold text-gray-800">
                      {cefrResult.listeningScore}
                      {cefrMode === "raw" && (
                        <span className="text-[10px] sm:text-xs text-gray-400 font-normal ml-1">
                          ({cefrListeningRaw}/35)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reading */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-500 block truncate">
                      Reading
                    </span>
                    <div className="text-sm sm:text-xl font-bold text-gray-800">
                      {cefrResult.readingScore}
                      {cefrMode === "raw" && (
                        <span className="text-[10px] sm:text-xs text-gray-400 font-normal ml-1">
                          ({cefrReadingRaw}/35)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Writing (Coming soon) */}
                  <div className="space-y-0.5 opacity-60">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-500 block truncate">
                      Writing
                    </span>
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                      <Lock className="w-3 h-3 text-amber-500" />
                      <span>Tez kunda</span>
                    </div>
                  </div>

                  {/* Speaking (Coming soon) + Desktop Reset */}
                  <div className="flex items-center justify-between gap-1 sm:gap-2">
                    <div className="space-y-0.5 opacity-60">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-500 block truncate">
                        Speaking
                      </span>
                      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                        <Lock className="w-3 h-3 text-amber-500" />
                        <span>Tez kunda</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={resetCEFR}
                      className="hidden md:block p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer shrink-0"
                      title="Reset to defaults"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Subtle Progress Bar */}
            <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden -mt-2">
              <div
                className="h-full bg-[#7C3AED] rounded-full transition-all duration-200"
                style={{ width: `${Math.min(100, Math.max(0, (cefrResult.overallScore / 75) * 100))}%` }}
              />
            </div>

            {/* Mode Switcher Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white border border-gray-200/80 rounded-lg">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                    Baholash Rejimi (Tinglab tushunish va O'qib tushunish)
                  </h3>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-50 text-[#7C3AED] border border-purple-200">
                    UzBMBA Rasch
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  {cefrMode === "raw"
                    ? "Testda to'plangan to'g'ri javoblar soni (0–35 ta) asosida 75 ballik shkalaga hisoblash"
                    : "Standartlashtirilgan Rasch bali (0–75 ball) asosida darajani aniqlash"}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center border border-gray-200 rounded-md overflow-hidden text-xs w-full sm:w-auto text-center shrink-0">
                <button
                  type="button"
                  onClick={() => setCefrMode("raw")}
                  className={`px-3 py-1.5 font-semibold cursor-pointer transition-colors ${
                    cefrMode === "raw"
                      ? "bg-[#7C3AED] text-white"
                      : "text-gray-500 hover:text-gray-800 bg-white"
                  }`}
                >
                  To'g'ri javoblar (0–35)
                </button>
                <button
                  type="button"
                  onClick={() => setCefrMode("scale")}
                  className={`px-3 py-1.5 font-semibold cursor-pointer transition-colors ${
                    cefrMode === "scale"
                      ? "bg-[#7C3AED] text-white"
                      : "text-gray-500 hover:text-gray-800 bg-white"
                  }`}
                >
                  Standart ball (0–75)
                </button>
              </div>
            </div>

            {/* 2. 4-SKILL CONTROLS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* 1. Listening (Active) */}
              <section className="border border-gray-200/80 rounded-lg p-3.5 sm:p-5 bg-white space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-[#7C3AED]" />
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">Listening Section</h2>
                      <p className="text-[11px] text-gray-400">Tinglab tushunish (Maksimal 35 ta topshiriq)</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-400">Ball:</span>
                    <span className="text-base sm:text-lg font-bold text-[#7C3AED]">
                      {cefrResult.listeningScore}
                    </span>
                    <span className="text-xs text-gray-400">/ 75</span>
                  </div>
                </div>

                <div className="pt-1">
                  {cefrMode === "raw" ? (
                    <div className="space-y-3">
                      <InputRow
                        label="To'g'ri javoblar soni"
                        subtitle="0 dan 35 tagacha to'g'ri yechilgan savollar"
                        value={cefrListeningRaw}
                        min={0}
                        max={35}
                        step={1}
                        onChange={(v) => setCefrListeningRaw(v)}
                        sliderBg={getSliderBg(cefrListeningRaw, 35)}
                      />
                      <div className="text-xs text-gray-600 bg-purple-50/50 p-2.5 rounded-md border border-purple-100/70 flex items-center justify-between">
                        <span>75 ballik ekvivalent:</span>
                        <span className="font-bold text-[#7C3AED]">
                          {cefrResult.listeningScore} ball ({cefrResult.listeningScore >= 65 ? "C1" : cefrResult.listeningScore >= 51 ? "B2" : cefrResult.listeningScore >= 38 ? "B1" : "B1 dan quyi"})
                        </span>
                      </div>
                    </div>
                  ) : (
                    <InputRow
                      label="Standartlashtirilgan shkala bali"
                      subtitle="0 dan 75 gacha to'plangan standart ball"
                      value={cefrListeningScale}
                      min={0}
                      max={75}
                      step={1}
                      onChange={(v) => setCefrListeningScale(v)}
                      sliderBg={getSliderBg(cefrListeningScale, 75)}
                    />
                  )}
                </div>
              </section>

              {/* 2. Reading (Active) */}
              <section className="border border-gray-200/80 rounded-lg p-3.5 sm:p-5 bg-white space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#7C3AED]" />
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">Reading Section</h2>
                      <p className="text-[11px] text-gray-400">O'qib tushunish (Maksimal 35 ta topshiriq)</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-400">Ball:</span>
                    <span className="text-base sm:text-lg font-bold text-[#7C3AED]">
                      {cefrResult.readingScore}
                    </span>
                    <span className="text-xs text-gray-400">/ 75</span>
                  </div>
                </div>

                <div className="pt-1">
                  {cefrMode === "raw" ? (
                    <div className="space-y-3">
                      <InputRow
                        label="To'g'ri javoblar soni"
                        subtitle="0 dan 35 tagacha to'g'ri yechilgan savollar"
                        value={cefrReadingRaw}
                        min={0}
                        max={35}
                        step={1}
                        onChange={(v) => setCefrReadingRaw(v)}
                        sliderBg={getSliderBg(cefrReadingRaw, 35)}
                      />
                      <div className="text-xs text-gray-600 bg-purple-50/50 p-2.5 rounded-md border border-purple-100/70 flex items-center justify-between">
                        <span>75 ballik ekvivalent:</span>
                        <span className="font-bold text-[#7C3AED]">
                          {cefrResult.readingScore} ball ({cefrResult.readingScore >= 65 ? "C1" : cefrResult.readingScore >= 51 ? "B2" : cefrResult.readingScore >= 38 ? "B1" : "B1 dan quyi"})
                        </span>
                      </div>
                    </div>
                  ) : (
                    <InputRow
                      label="Standartlashtirilgan shkala bali"
                      subtitle="0 dan 75 gacha to'plangan standart ball"
                      value={cefrReadingScale}
                      min={0}
                      max={75}
                      step={1}
                      onChange={(v) => setCefrReadingScale(v)}
                      sliderBg={getSliderBg(cefrReadingScale, 75)}
                    />
                  )}
                </div>
              </section>

              {/* 3. Writing (Disabled - Coming Soon) */}
              <section className="border border-dashed border-gray-300 rounded-lg p-3.5 sm:p-5 bg-gray-50/70 space-y-3 relative overflow-hidden select-none">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200/80">
                  <div className="flex items-center gap-2">
                    <PenLine className="w-4 h-4 text-gray-400" />
                    <div>
                      <h2 className="text-sm font-semibold text-gray-700">Writing Section (Yozma ish)</h2>
                      <p className="text-[11px] text-gray-400">1 va 2-topshiriqlar · 36 ballik ekspert rubrikasi</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Tez kunda</span>
                  </span>
                </div>

                <div className="p-3 bg-white/90 rounded-md border border-gray-200/70 text-xs text-gray-600 space-y-1.5">
                  <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <span>UzBMBA baholash mezonlari:</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Yozma ish 1-topshiriq (33% / 12 ball) va 2-topshiriq (67% / 24 ball) bo'yicha baholanadi. Ekspert baholarining o'rtachasi 75 ballik shkalaga o'giriladi. Tez kunda ishga tushiriladi.
                  </p>
                </div>
              </section>

              {/* 4. Speaking (Disabled - Coming Soon) */}
              <section className="border border-dashed border-gray-300 rounded-lg p-3.5 sm:p-5 bg-gray-50/70 space-y-3 relative overflow-hidden select-none">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200/80">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-gray-400" />
                    <div>
                      <h2 className="text-sm font-semibold text-gray-700">Speaking Section (Og'zaki nutq)</h2>
                      <p className="text-[11px] text-gray-400">Topshiriqlarning 3 turi · 36 ballik ekspert rubrikasi</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Tez kunda</span>
                  </span>
                </div>

                <div className="p-3 bg-white/90 rounded-md border border-gray-200/70 text-xs text-gray-600 space-y-1.5">
                  <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <span>UzBMBA baholash mezonlari:</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Og'zaki nutq topshiriqlarining 3 turi bo'yicha ekspertlar umumlashtirilgan baho qo'yadi va rasmiy 75 ballik shkalaga aylantiriladi. Tez kunda ishga tushiriladi.
                  </p>
                </div>
              </section>

            </div>

            {/* 3. OFFICIAL CEFR REFERENCE & PERFORMANCE SUMMARY */}
            <section className="border border-gray-200/80 rounded-lg p-3.5 sm:p-5 bg-white space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                    Rasmiy CEFR / Multi-level Shkalasi va Chegaralar (UzBMBA)
                  </h3>
                </div>
                <span className="text-[11px] text-gray-400">0 – 75 standart shkala</span>
              </div>

              {/* 4 CEFR Tiers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {(["C1", "B2", "B1", "Fail"] as CEFRLevel[]).map((levelKey) => {
                  const t = CEFR_THRESHOLDS[levelKey];
                  const isCurrent = cefrResult.levelInfo.level === levelKey;
                  return (
                    <div
                      key={levelKey}
                      className={`p-2.5 sm:p-3 rounded-md border text-center transition-all ${
                        isCurrent
                          ? "border-[#7C3AED] bg-purple-50/70 shadow-2xs font-semibold ring-1 ring-[#7C3AED]/20"
                          : "border-gray-200/70 bg-gray-50/50 text-gray-600"
                      }`}
                    >
                      <div className={`text-base sm:text-lg font-black ${isCurrent ? "text-[#7C3AED]" : "text-gray-800"}`}>
                        {levelKey === "Fail" ? "B1 dan quyi" : `${levelKey} Daraja`}
                      </div>
                      <div className="text-[11px] font-bold text-gray-600 mt-0.5">
                        {t.minScore} – {t.maxScore} ball
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5 font-medium">
                        {t.rawQuestionsRange} ta to'g'ri javob
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                        {t.title}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Description of Current Result & Official Note */}
              <div className="space-y-2">
                <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-md text-xs text-purple-900 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 flex-wrap">
                    <span className="w-2 h-2 rounded-full bg-[#7C3AED] shrink-0" />
                    <span>Multi-level imtihoni baholash natijasi:</span>
                    <span className="font-bold underline">{cefrResult.levelInfo.title}</span>
                  </div>
                  <p className="text-[11px] text-purple-800/80 leading-relaxed">
                    {cefrResult.levelInfo.description}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200/70 rounded-md text-[11px] text-gray-500 leading-relaxed space-y-1">
                  <p className="font-medium text-gray-700">
                    ℹ️ UzBMBA rasmiy qoidasi bo'yicha:
                  </p>
                  <p>
                    Chet tilini bilish darajasini baholash test tafsilotlarida CEFRning eng yuqori C2 darajasiga mos keladigan topshiriqlar ko'zda tutilmaganligi sababli standart shkalaning eng yuqori bali 75 ball sifatida belgilangan. Hozirda umumiy ball faol ko'nikmalar (Listening va Reading) o'rtacha arifmetigi sifatida aniqlanmoqda.
                  </p>
                </div>
              </div>
            </section>

          </div>
        )}

      </main>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-6 mt-8 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Image src="/logo-icon.svg" alt="ScoreHigh" width={16} height={16} className="object-contain opacity-50" />
            <span>ScoreHigh — Standardized Testing Calculator</span>
          </div>
          <span>Digital SAT Adaptive IRT · IELTS 4-Skill · UzBMBA Milliy Sertifikat</span>
        </div>
      </footer>
    </div>
  );
}
