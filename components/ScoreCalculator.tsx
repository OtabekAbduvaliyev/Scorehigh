"use client";

import React, { useState, useRef } from "react";
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
  Sparkles,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { calculateSAT, SATInput } from "@/lib/sat-scoring";
import { calculateIELTS, IELTSInput, ReadingType } from "@/lib/ielts-scoring";

type TabMode = "sat" | "ielts";

export default function ScoreCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>("sat");
  const breakdownRef = useRef<HTMLDivElement>(null);

  // SAT State (Module 1 & 2 for Reading & Writing and Math)
  const [satInputs, setSatInputs] = useState<SATInput>({
    rwModule1: 22,
    rwModule2: 21,
    mathModule1: 20,
    mathModule2: 19,
  });

  // IELTS State (Listening, Reading, Writing, Speaking)
  const [ieltsInputs, setIeltsInputs] = useState<IELTSInput>({
    listeningRaw: 34,
    readingRaw: 32,
    readingType: "academic",
    writingBand: 7.0,
    speakingBand: 7.5,
  });

  // Derived Calculations
  const satResult = calculateSAT(satInputs);
  const ieltsResult = calculateIELTS(ieltsInputs);

  // Presets
  const applySATPreset = (m1RW: number, m2RW: number, m1M: number, m2M: number) => {
    setSatInputs({
      rwModule1: m1RW,
      rwModule2: m2RW,
      mathModule1: m1M,
      mathModule2: m2M,
    });
  };

  const applyIELTSPreset = (l: number, r: number, w: number, s: number, type: ReadingType = "academic") => {
    setIeltsInputs({
      listeningRaw: l,
      readingRaw: r,
      readingType: type,
      writingBand: w,
      speakingBand: s,
    });
  };

  const handleSATChange = (key: keyof SATInput, val: number, max: number) => {
    const clamped = isNaN(val) ? 0 : Math.max(0, Math.min(max, val));
    setSatInputs((prev) => ({ ...prev, [key]: clamped }));
  };

  const scrollToBreakdown = () => {
    if (breakdownRef.current) {
      breakdownRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Helper for dynamic solid slider background fill
  const getSliderTrackBg = (val: number, max: number) => {
    const pct = Math.min(100, Math.max(0, (val / max) * 100));
    return `linear-gradient(to right, #7C3AED 0%, #7C3AED ${pct}%, #E2E8F0 ${pct}%, #E2E8F0 100%)`;
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-900 pb-20 sm:pb-16">
      
      {/* ============================================================== */}
      {/* 1. FIXED TOP APP HEADER                                        */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img
              src="/logo-icon.svg"
              alt="ScoreHigh Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#5522C2]">
                  Score<span className="text-[#9D84F3]">High</span>
                </span>
                <span className="hidden xs:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-[#5522C2] border border-purple-200">
                  2026
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 -mt-0.5">
                Digital SAT & IELTS Scoring System
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center border border-slate-200 rounded-md p-1 bg-slate-100/90 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("sat")}
              className={`px-3 sm:px-4 py-1.5 text-xs font-bold rounded cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 ${
                activeTab === "sat"
                  ? "bg-[#7C3AED] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>SAT</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ielts")}
              className={`px-3 sm:px-4 py-1.5 text-xs font-bold rounded cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 ${
                activeTab === "ielts"
                  ? "bg-[#7C3AED] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>IELTS</span>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MAIN APPLICATION CONTENT                                    */}
      {/* ============================================================== */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5 sm:space-y-6">
        
        {/* ============================================================ */}
        {/* DIGITAL SAT TAB VIEW                                         */}
        {/* ============================================================ */}
        {activeTab === "sat" && (
          <div className="space-y-5 sm:space-y-6">
            
            {/* HORIZONTAL PRESET CHIPS BAR */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs -mx-3 px-3 sm:mx-0 sm:px-0">
              <span className="text-slate-500 font-semibold shrink-0 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" /> Presets:
              </span>
              <button
                type="button"
                onClick={() => applySATPreset(27, 27, 22, 22)}
                className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold hover:border-[#7C3AED] hover:text-[#7C3AED] active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                1600 (Max)
              </button>
              <button
                type="button"
                onClick={() => applySATPreset(25, 24, 21, 20)}
                className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold hover:border-[#7C3AED] hover:text-[#7C3AED] active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                1500 (Elite)
              </button>
              <button
                type="button"
                onClick={() => applySATPreset(22, 20, 18, 17)}
                className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold hover:border-[#7C3AED] hover:text-[#7C3AED] active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                1350 (Target)
              </button>
              <button
                type="button"
                onClick={() => applySATPreset(17, 16, 14, 13)}
                className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold hover:border-[#7C3AED] hover:text-[#7C3AED] active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                1100 (Avg)
              </button>
              <button
                type="button"
                onClick={() => applySATPreset(22, 21, 20, 19)}
                className="shrink-0 px-3 py-1.5 text-slate-400 hover:text-slate-700 active:scale-95 transition-all ml-auto flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* RESPONSIVE GRID:
                - On Mobile (< lg): order-1 puts Score Dashboard at TOP for instant feedback!
                - On Desktop (lg+): order-2 puts Score Dashboard on RIGHT (5 cols sticky).
            */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              
              {/* SCORE SUMMARY DASHBOARD (ORDER-1 ON MOBILE, ORDER-2 ON DESKTOP) */}
              <div className="order-1 lg:order-2 lg:col-span-5 space-y-4 lg:sticky lg:top-20">
                
                {/* Primary Solid Purple Card */}
                <div className="bg-[#7C3AED] text-white p-4 sm:p-6 rounded-lg sm:rounded-md border border-[#6D28D9] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-purple-200 flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      SAT Composite Score
                    </span>
                    <span className="text-xs bg-white text-[#7C3AED] font-black px-2.5 py-0.5 rounded shadow-2xs">
                      {satResult.status}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between sm:justify-start gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                        {satResult.compositeScore}
                      </span>
                      <span className="text-sm font-semibold text-purple-200">/ 1600</span>
                    </div>

                    {/* Quick mobile section badges */}
                    <div className="flex lg:hidden items-center gap-2">
                      <span className="text-xs font-bold bg-white/15 px-2 py-0.5 rounded border border-white/20">
                        RW {satResult.rwScore}
                      </span>
                      <span className="text-xs font-bold bg-white/15 px-2 py-0.5 rounded border border-white/20">
                        Math {satResult.mathScore}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-purple-500/60 flex items-center justify-between text-xs text-purple-100">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> Benchmark:
                    </span>
                    <span className="font-bold text-white">{satResult.percentile}th Percentile</span>
                  </div>

                  {/* MOBILE BUTTON TO SPOT/JUMP TO SCORE RANGING SECTION AT BOTTOM */}
                  <div className="pt-1 block lg:hidden">
                    <button
                      type="button"
                      onClick={scrollToBreakdown}
                      className="w-full py-2 px-3 rounded bg-white/15 hover:bg-white/20 active:bg-white/25 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>View Score Ranges & Breakdown</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* DETAILED SCORE BREAKDOWN & RANGING TILES */}
                <div
                  ref={breakdownRef}
                  id="sat-score-ranges"
                  className="bg-white border border-slate-200 rounded-lg sm:rounded-md p-4 sm:p-5 space-y-3.5 shadow-2xs scroll-mt-20"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#7C3AED]" />
                      Score Ranging & Details
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Scale 400–1600</span>
                  </div>

                  {/* RW Breakdown Tile */}
                  <div className="p-3.5 border border-slate-100 rounded-md bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#7C3AED]" />
                        Reading & Writing Range
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        {satResult.rwScore} <span className="text-xs font-normal text-slate-400">/ 800</span>
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#7C3AED] transition-all duration-150"
                        style={{ width: `${((satResult.rwScore - 200) / 600) * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>M1: <strong className="text-slate-700">{satInputs.rwModule1}/27</strong></span>
                      <span>M2: <strong className="text-slate-700">{satInputs.rwModule2}/27</strong></span>
                      <span>Raw: <strong className="text-slate-800">{satResult.rwRawTotal}/54</strong></span>
                    </div>
                  </div>

                  {/* Math Breakdown Tile */}
                  <div className="p-3.5 border border-slate-100 rounded-md bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-[#7C3AED]" />
                        Math Range
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        {satResult.mathScore} <span className="text-xs font-normal text-slate-400">/ 800</span>
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#7C3AED] transition-all duration-150"
                        style={{ width: `${((satResult.mathScore - 200) / 600) * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>M1: <strong className="text-slate-700">{satInputs.mathModule1}/22</strong></span>
                      <span>M2: <strong className="text-slate-700">{satInputs.mathModule2}/22</strong></span>
                      <span>Raw: <strong className="text-slate-800">{satResult.mathRawTotal}/44</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE CONTROLLERS (ORDER-2 ON MOBILE, ORDER-1 ON DESKTOP) */}
              <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 sm:space-y-5">
                
                {/* 1. READING & WRITING MODULES */}
                <div className="border border-slate-200 rounded-lg sm:rounded-md bg-white p-4 sm:p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">Reading & Writing</h2>
                    </div>
                    <span className="text-xs font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded border border-purple-100">
                      Scaled: {satResult.rwScore} / 800
                    </span>
                  </div>

                  {/* RW Module 1 */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800">Module 1 (Routing)</div>
                        <div className="text-[11px] text-slate-400">Total 27 questions</div>
                      </div>

                      {/* Touch-Friendly Stepper */}
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button
                          type="button"
                          aria-label="Decrease RW Module 1"
                          onClick={() => handleSATChange("rwModule1", satInputs.rwModule1 - 1, 27)}
                          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        >
                          <Minus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={27}
                          value={satInputs.rwModule1}
                          onChange={(e) => handleSATChange("rwModule1", parseInt(e.target.value) || 0, 27)}
                          className="w-14 sm:w-12 h-10 sm:h-8 text-center text-base sm:text-xs font-bold text-slate-900 border-x border-slate-200 bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          aria-label="Increase RW Module 1"
                          onClick={() => handleSATChange("rwModule1", satInputs.rwModule1 + 1, 27)}
                          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Refined 8px Range Slider */}
                    <input
                      type="range"
                      min={0}
                      max={27}
                      value={satInputs.rwModule1}
                      style={{ background: getSliderTrackBg(satInputs.rwModule1, 27) }}
                      onChange={(e) => handleSATChange("rwModule1", Number(e.target.value), 27)}
                      className="score-slider"
                    />
                  </div>

                  {/* RW Module 2 */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800">Module 2 (Adaptive Stage)</div>
                        <div className="text-[11px] text-slate-500">
                          Route: <strong className="text-slate-700">{satResult.rwRouting}</strong>
                        </div>
                      </div>

                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button
                          type="button"
                          aria-label="Decrease RW Module 2"
                          onClick={() => handleSATChange("rwModule2", satInputs.rwModule2 - 1, 27)}
                          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        >
                          <Minus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={27}
                          value={satInputs.rwModule2}
                          onChange={(e) => handleSATChange("rwModule2", parseInt(e.target.value) || 0, 27)}
                          className="w-14 sm:w-12 h-10 sm:h-8 text-center text-base sm:text-xs font-bold text-slate-900 border-x border-slate-200 bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          aria-label="Increase RW Module 2"
                          onClick={() => handleSATChange("rwModule2", satInputs.rwModule2 + 1, 27)}
                          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={27}
                      value={satInputs.rwModule2}
                      style={{ background: getSliderTrackBg(satInputs.rwModule2, 27) }}
                      onChange={(e) => handleSATChange("rwModule2", Number(e.target.value), 27)}
                      className="score-slider"
                    />
                  </div>
                </div>

                {/* 2. MATH MODULES */}
                <div className="border border-slate-200 rounded-lg sm:rounded-md bg-white p-4 sm:p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">Math</h2>
                    </div>
                    <span className="text-xs font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded border border-purple-100">
                      Scaled: {satResult.mathScore} / 800
                    </span>
                  </div>

                  {/* Math Module 1 */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800">Module 1 (Routing)</div>
                        <div className="text-[11px] text-slate-400">Total 22 questions</div>
                      </div>

                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button
                          type="button"
                          aria-label="Decrease Math Module 1"
                          onClick={() => handleSATChange("mathModule1", satInputs.mathModule1 - 1, 22)}
                          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        >
                          <Minus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={22}
                          value={satInputs.mathModule1}
                          onChange={(e) => handleSATChange("mathModule1", parseInt(e.target.value) || 0, 22)}
                          className="w-14 sm:w-12 h-10 sm:h-8 text-center text-base sm:text-xs font-bold text-slate-900 border-x border-slate-200 bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          aria-label="Increase Math Module 1"
                          onClick={() => handleSATChange("mathModule1", satInputs.mathModule1 + 1, 22)}
                          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={22}
                      value={satInputs.mathModule1}
                      style={{ background: getSliderTrackBg(satInputs.mathModule1, 22) }}
                      onChange={(e) => handleSATChange("mathModule1", Number(e.target.value), 22)}
                      className="score-slider"
                    />
                  </div>

                  {/* Math Module 2 */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800">Module 2 (Adaptive Stage)</div>
                        <div className="text-[11px] text-slate-500">
                          Route: <strong className="text-slate-700">{satResult.mathRouting}</strong>
                        </div>
                      </div>

                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button
                          type="button"
                          aria-label="Decrease Math Module 2"
                          onClick={() => handleSATChange("mathModule2", satInputs.mathModule2 - 1, 22)}
                          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        >
                          <Minus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={22}
                          value={satInputs.mathModule2}
                          onChange={(e) => handleSATChange("mathModule2", parseInt(e.target.value) || 0, 22)}
                          className="w-14 sm:w-12 h-10 sm:h-8 text-center text-base sm:text-xs font-bold text-slate-900 border-x border-slate-200 bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          aria-label="Increase Math Module 2"
                          onClick={() => handleSATChange("mathModule2", satInputs.mathModule2 + 1, 22)}
                          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={22}
                      value={satInputs.mathModule2}
                      style={{ background: getSliderTrackBg(satInputs.mathModule2, 22) }}
                      onChange={(e) => handleSATChange("mathModule2", Number(e.target.value), 22)}
                      className="score-slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* IELTS TAB VIEW                                               */}
        {/* ============================================================ */}
        {activeTab === "ielts" && (
          <div className="space-y-5 sm:space-y-6">
            
            {/* HORIZONTAL PRESET CHIPS BAR */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs -mx-3 px-3 sm:mx-0 sm:px-0">
              <span className="text-slate-500 font-semibold shrink-0 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" /> Presets:
              </span>
              <button
                type="button"
                onClick={() => applyIELTSPreset(39, 39, 8.5, 8.5)}
                className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold hover:border-[#7C3AED] hover:text-[#7C3AED] active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                Band 8.5 (Expert)
              </button>
              <button
                type="button"
                onClick={() => applyIELTSPreset(35, 34, 7.5, 7.5)}
                className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold hover:border-[#7C3AED] hover:text-[#7C3AED] active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                Band 7.5 (Good)
              </button>
              <button
                type="button"
                onClick={() => applyIELTSPreset(30, 29, 6.5, 6.5)}
                className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold hover:border-[#7C3AED] hover:text-[#7C3AED] active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                Band 6.5 (Competent)
              </button>
              <button
                type="button"
                onClick={() => applyIELTSPreset(23, 23, 5.5, 5.5)}
                className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold hover:border-[#7C3AED] hover:text-[#7C3AED] active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                Band 5.5 (Modest)
              </button>
              <button
                type="button"
                onClick={() => applyIELTSPreset(34, 32, 7.0, 7.5)}
                className="shrink-0 px-3 py-1.5 text-slate-400 hover:text-slate-700 active:scale-95 transition-all ml-auto flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* RESPONSIVE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              
              {/* SCORE SUMMARY DASHBOARD (ORDER-1 ON MOBILE, ORDER-2 ON DESKTOP) */}
              <div className="order-1 lg:order-2 lg:col-span-5 space-y-4 lg:sticky lg:top-20">
                
                {/* Primary Overall Band Card */}
                <div className="bg-[#7C3AED] text-white p-4 sm:p-6 rounded-lg sm:rounded-md border border-[#6D28D9] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-purple-200 flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      Overall IELTS Band
                    </span>
                    <span className="text-xs bg-white text-[#7C3AED] font-black px-2.5 py-0.5 rounded shadow-2xs">
                      CEFR: {ieltsResult.cefrLevel}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between sm:justify-start gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                        {ieltsResult.overallBand.toFixed(1)}
                      </span>
                      <span className="text-sm font-semibold text-purple-200">/ 9.0</span>
                    </div>

                    {/* Quick mobile 4-skill summary chips */}
                    <div className="flex lg:hidden items-center gap-1 text-[11px] font-bold">
                      <span className="bg-white/15 px-1.5 py-0.5 rounded border border-white/20">L:{ieltsResult.listeningBand.toFixed(1)}</span>
                      <span className="bg-white/15 px-1.5 py-0.5 rounded border border-white/20">R:{ieltsResult.readingBand.toFixed(1)}</span>
                      <span className="bg-white/15 px-1.5 py-0.5 rounded border border-white/20">W:{ieltsInputs.writingBand.toFixed(1)}</span>
                      <span className="bg-white/15 px-1.5 py-0.5 rounded border border-white/20">S:{ieltsInputs.speakingBand.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-purple-500/60 flex items-center justify-between text-xs text-purple-100">
                    <span>Proficiency Descriptor:</span>
                    <span className="font-bold text-white">{ieltsResult.competencyTitle}</span>
                  </div>

                  {/* MOBILE BUTTON TO SPOT/JUMP TO SCORE RANGING SECTION AT BOTTOM */}
                  <div className="pt-1 block lg:hidden">
                    <button
                      type="button"
                      onClick={scrollToBreakdown}
                      className="w-full py-2 px-3 rounded bg-white/15 hover:bg-white/20 active:bg-white/25 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>View 4-Skill Matrix & Rounding</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4-SKILL MATRIX TILES & RANGING DETAILS */}
                <div
                  ref={breakdownRef}
                  id="ielts-score-ranges"
                  className="bg-white border border-slate-200 rounded-lg sm:rounded-md p-4 sm:p-5 space-y-3.5 shadow-2xs scroll-mt-20"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#7C3AED]" />
                      Skill Matrix & Rounding
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Bands 0.0–9.0</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Listening */}
                    <div className="p-3 border border-slate-100 rounded-md bg-slate-50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                          <Headphones className="w-3.5 h-3.5 text-[#7C3AED]" /> Listening
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          {ieltsResult.listeningBand.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">{ieltsInputs.listeningRaw} / 40 correct</div>
                    </div>

                    {/* Reading */}
                    <div className="p-3 border border-slate-100 rounded-md bg-slate-50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-[#7C3AED]" /> Reading
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          {ieltsResult.readingBand.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">{ieltsInputs.readingRaw} / 40 correct</div>
                    </div>

                    {/* Writing */}
                    <div className="p-3 border border-slate-100 rounded-md bg-slate-50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                          <PenLine className="w-3.5 h-3.5 text-[#7C3AED]" /> Writing
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          {ieltsInputs.writingBand.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">Band estimated</div>
                    </div>

                    {/* Speaking */}
                    <div className="p-3 border border-slate-100 rounded-md bg-slate-50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                          <Mic className="w-3.5 h-3.5 text-[#7C3AED]" /> Speaking
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          {ieltsInputs.speakingBand.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">Band estimated</div>
                    </div>
                  </div>

                  {/* Formula Transparency */}
                  <div className="p-3 border border-slate-200 rounded-md bg-slate-50 text-[11px] space-y-1 text-slate-600">
                    <div className="font-semibold text-slate-800">Official IELTS Rounding:</div>
                    <div className="text-[11px] text-slate-500">
                      ({ieltsResult.listeningBand.toFixed(1)} + {ieltsResult.readingBand.toFixed(1)} + {ieltsInputs.writingBand.toFixed(1)} + {ieltsInputs.speakingBand.toFixed(1)}) / 4 = <strong className="text-slate-800">{ieltsResult.exactAverage}</strong>
                    </div>
                    <div className="text-[11px] text-slate-700">
                      Official Rounding → <strong className="text-[#7C3AED]">Band {ieltsResult.overallBand.toFixed(1)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 SKILL CONTROLLERS (ORDER-2 ON MOBILE, ORDER-1 ON DESKTOP) */}
              <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 sm:space-y-5">
                
                {/* 1. LISTENING */}
                <div className="border border-slate-200 rounded-lg sm:rounded-md bg-white p-4 sm:p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                        <Headphones className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">Listening</h2>
                        <p className="text-[11px] text-slate-400">0 to 40 questions</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded border border-purple-100">
                      Band {ieltsResult.listeningBand.toFixed(1)}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm text-slate-600 font-medium">Correct Answers:</span>
                      
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button
                          type="button"
                          aria-label="Decrease Listening"
                          onClick={() => setIeltsInputs((p) => ({ ...p, listeningRaw: Math.max(0, p.listeningRaw - 1) }))}
                          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        >
                          <Minus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={40}
                          value={ieltsInputs.listeningRaw}
                          onChange={(e) =>
                            setIeltsInputs((p) => ({
                              ...p,
                              listeningRaw: Math.max(0, Math.min(40, parseInt(e.target.value) || 0)),
                            }))
                          }
                          className="w-14 sm:w-12 h-10 sm:h-8 text-center text-base sm:text-xs font-bold text-slate-900 border-x border-slate-200 bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          aria-label="Increase Listening"
                          onClick={() => setIeltsInputs((p) => ({ ...p, listeningRaw: Math.min(40, p.listeningRaw + 1) }))}
                          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={ieltsInputs.listeningRaw}
                      style={{ background: getSliderTrackBg(ieltsInputs.listeningRaw, 40) }}
                      onChange={(e) => setIeltsInputs((p) => ({ ...p, listeningRaw: Number(e.target.value) }))}
                      className="score-slider"
                    />
                  </div>
                </div>

                {/* 2. READING */}
                <div className="border border-slate-200 rounded-lg sm:rounded-md bg-white p-4 sm:p-5 space-y-3 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">Reading</h2>
                        <p className="text-[11px] text-slate-400">0 to 40 questions</p>
                      </div>
                    </div>

                    {/* Academic vs General 50/50 Toggle */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                      <div className="grid grid-cols-2 border border-slate-200 rounded-md overflow-hidden text-xs font-semibold w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setIeltsInputs((p) => ({ ...p, readingType: "academic" }))}
                          className={`px-3 py-1.5 sm:py-1 text-center cursor-pointer transition-colors active:scale-95 ${
                            ieltsInputs.readingType === "academic"
                              ? "bg-[#7C3AED] text-white"
                              : "text-slate-500 hover:text-slate-900 bg-slate-50"
                          }`}
                        >
                          Academic
                        </button>
                        <button
                          type="button"
                          onClick={() => setIeltsInputs((p) => ({ ...p, readingType: "general" }))}
                          className={`px-3 py-1.5 sm:py-1 text-center cursor-pointer transition-colors active:scale-95 ${
                            ieltsInputs.readingType === "general"
                              ? "bg-[#7C3AED] text-white"
                              : "text-slate-500 hover:text-slate-900 bg-slate-50"
                          }`}
                        >
                          General
                        </button>
                      </div>
                      <span className="text-xs font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded border border-purple-100 shrink-0">
                        Band {ieltsResult.readingBand.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm text-slate-600 font-medium">Correct Answers:</span>
                      
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button
                          type="button"
                          aria-label="Decrease Reading"
                          onClick={() => setIeltsInputs((p) => ({ ...p, readingRaw: Math.max(0, p.readingRaw - 1) }))}
                          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        >
                          <Minus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={40}
                          value={ieltsInputs.readingRaw}
                          onChange={(e) =>
                            setIeltsInputs((p) => ({
                              ...p,
                              readingRaw: Math.max(0, Math.min(40, parseInt(e.target.value) || 0)),
                            }))
                          }
                          className="w-14 sm:w-12 h-10 sm:h-8 text-center text-base sm:text-xs font-bold text-slate-900 border-x border-slate-200 bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          aria-label="Increase Reading"
                          onClick={() => setIeltsInputs((p) => ({ ...p, readingRaw: Math.min(40, p.readingRaw + 1) }))}
                          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={ieltsInputs.readingRaw}
                      style={{ background: getSliderTrackBg(ieltsInputs.readingRaw, 40) }}
                      onChange={(e) => setIeltsInputs((p) => ({ ...p, readingRaw: Number(e.target.value) }))}
                      className="score-slider"
                    />
                  </div>
                </div>

                {/* 3. WRITING */}
                <div className="border border-slate-200 rounded-lg sm:rounded-md bg-white p-4 sm:p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                        <PenLine className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">Writing</h2>
                        <p className="text-[11px] text-slate-400">Estimated Band (0.0 – 9.0)</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded border border-purple-100">
                      Band {ieltsInputs.writingBand.toFixed(1)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Horizontal scrollable band chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-2 px-2 sm:mx-0 sm:px-0">
                      {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setIeltsInputs((p) => ({ ...p, writingBand: b }))}
                          className={`px-3 py-1.5 shrink-0 text-xs font-bold rounded-md cursor-pointer transition-all active:scale-95 ${
                            ieltsInputs.writingBand === b
                              ? "bg-[#7C3AED] text-white shadow-xs"
                              : "bg-white border border-slate-200 text-slate-700 hover:border-[#7C3AED]"
                          }`}
                        >
                          {b.toFixed(1)}
                        </button>
                      ))}
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={9.0}
                      step={0.5}
                      value={ieltsInputs.writingBand}
                      style={{ background: getSliderTrackBg(ieltsInputs.writingBand, 9.0) }}
                      onChange={(e) => setIeltsInputs((p) => ({ ...p, writingBand: parseFloat(e.target.value) }))}
                      className="score-slider"
                    />
                  </div>
                </div>

                {/* 4. SPEAKING */}
                <div className="border border-slate-200 rounded-lg sm:rounded-md bg-white p-4 sm:p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">Speaking</h2>
                        <p className="text-[11px] text-slate-400">Estimated Band (0.0 – 9.0)</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded border border-purple-100">
                      Band {ieltsInputs.speakingBand.toFixed(1)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Horizontal scrollable band chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-2 px-2 sm:mx-0 sm:px-0">
                      {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setIeltsInputs((p) => ({ ...p, speakingBand: b }))}
                          className={`px-3 py-1.5 shrink-0 text-xs font-bold rounded-md cursor-pointer transition-all active:scale-95 ${
                            ieltsInputs.speakingBand === b
                              ? "bg-[#7C3AED] text-white shadow-xs"
                              : "bg-white border border-slate-200 text-slate-700 hover:border-[#7C3AED]"
                          }`}
                        >
                          {b.toFixed(1)}
                        </button>
                      ))}
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={9.0}
                      step={0.5}
                      value={ieltsInputs.speakingBand}
                      style={{ background: getSliderTrackBg(ieltsInputs.speakingBand, 9.0) }}
                      onChange={(e) => setIeltsInputs((p) => ({ ...p, speakingBand: parseFloat(e.target.value) }))}
                      className="score-slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* 3. MOBILE FLOATING ACTION BUTTON (ALWAYS SPOTS SCORE RANGES)   */}
      {/* ============================================================== */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto">
        <button
          type="button"
          onClick={scrollToBreakdown}
          className="px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-full shadow-[0_4px_16px_rgba(124,58,237,0.35)] flex items-center gap-2 border border-purple-400/50 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <TrendingUp className="w-4 h-4 text-purple-200" />
          <span>View Score Ranges & Details</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2">
          <img src="/logo-icon.svg" alt="ScoreHigh" className="w-5 h-5 object-contain" />
          <span className="font-bold text-slate-700">ScoreHigh</span>
          <span>• Standardized Testing Diagnostic</span>
        </div>
        <span>College Board Adaptive IRT & Official IELTS 4-Skill Standard</span>
      </footer>
    </div>
  );
}
