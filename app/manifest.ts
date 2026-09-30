import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ScoreHigh — Digital SAT, IELTS, Milliy Sertifikat & CEFR Calculator",
    short_name: "ScoreHigh",
    description:
      "Rasmiy test ballari kalkulyatori: Digital SAT (Adaptive IRT), IELTS (4-Skill), UzBMBA Milliy Sertifikat va CEFR Multi-level darajalarini tezkor va aniq hisoblang.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7C3AED",
    lang: "uz",
    categories: ["education", "tools", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/logo-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
