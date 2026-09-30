import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ScoreHigh — Digital SAT, IELTS, Milliy Sertifikat & CEFR Calculator";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0F19",
          backgroundImage:
            "radial-gradient(circle at 50% 10%, rgba(124, 58, 237, 0.35) 0%, rgba(11, 15, 25, 0.98) 75%)",
          fontFamily: "sans-serif",
          color: "white",
          padding: "60px 40px",
          position: "relative",
        }}
      >
        {/* Subtle Top Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(124, 58, 237, 0.2)",
            border: "1px solid rgba(167, 139, 250, 0.35)",
            borderRadius: "9999px",
            padding: "8px 24px",
            fontSize: "19px",
            fontWeight: 700,
            color: "#DDD6FE",
            marginBottom: "28px",
            letterSpacing: "0.02em",
          }}
        >
          <span>✦ Rasmiy Test Ballari Kalkulyatori</span>
        </div>

        {/* Brand Logo & Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              fontSize: "76px",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>Score</span>
            <span style={{ color: "#A855F7" }}>High</span>
          </div>
        </div>

        {/* Subtitle / Value Proposition */}
        <div
          style={{
            fontSize: "25px",
            color: "#94A3B8",
            textAlign: "center",
            maxWidth: "920px",
            lineHeight: "1.4",
            marginBottom: "44px",
            fontWeight: 400,
          }}
        >
          Digital SAT Adaptive IRT · IELTS 4-Skill · UzBMBA Milliy Sertifikat · CEFR Multi-level
        </div>

        {/* 4 Supported Exam Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              padding: "12px 26px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#F8FAFC",
            }}
          >
            Digital SAT
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              padding: "12px 26px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#F8FAFC",
            }}
          >
            IELTS 9.0 Band
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              padding: "12px 26px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#F8FAFC",
            }}
          >
            Milliy Sertifikat (A+)
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              padding: "12px 26px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#F8FAFC",
            }}
          >
            CEFR Multi-level (C1)
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "17px",
            color: "#64748B",
            fontWeight: 500,
          }}
        >
          <span>Real-time Scoring Engine · UzBMBA & International Standards</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
