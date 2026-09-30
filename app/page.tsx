import ScoreCalculator from "@/components/ScoreCalculator";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased selection:bg-purple-100 selection:text-purple-900">
      <ScoreCalculator />
    </main>
  );
}
