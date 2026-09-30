import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scorehigh.vercel.app";

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ScoreHigh — Digital SAT, IELTS, Milliy Sertifikat & CEFR Calculator",
    template: "%s | ScoreHigh",
  },
  description:
    "Aniq va tezkor test ballari kalkulyatori: Digital SAT (Adaptive IRT), IELTS (4-Skill Band), Umumta'lim fanlaridan Milliy Sertifikat (A+, A, B+, B, C) va UzBMBA CEFR Multi-level (C1, B2, B1) darajalarini rasmiy metodologiya asosida hisoblang.",
  applicationName: "ScoreHigh",
  authors: [{ name: "ScoreHigh Team", url: siteUrl }],
  creator: "ScoreHigh",
  publisher: "ScoreHigh",
  generator: "Next.js",
  keywords: [
    "ScoreHigh",
    "Digital SAT score calculator",
    "Digital SAT ball hisoblash",
    "SAT raw to scaled score",
    "SAT score calculator online",
    "IELTS band score calculator",
    "IELTS listening score calculator",
    "IELTS reading score calculator",
    "IELTS ball hisoblash",
    "IELTS overall band",
    "Milliy sertifikat ball hisoblash",
    "Umumta'lim fanlaridan milliy sertifikat",
    "UzBMBA milliy sertifikat",
    "DTM sertifikat darajalari",
    "Milliy sertifikat A+",
    "Milliy sertifikat A",
    "Milliy sertifikat B+",
    "CEFR ball hisoblash",
    "Multi-level ball hisoblash",
    "UzBMBA CEFR kalkulyator",
    "Chet tilini bilish darajasi kalkulyator",
    "C1 daraja ball",
    "B2 daraja ball",
    "B1 daraja ball",
    "Rasch shkalasi",
    "Test ballari kalkulyatori",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "uz-UZ": "/",
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "ScoreHigh",
    title: "ScoreHigh — Digital SAT, IELTS, Milliy Sertifikat & CEFR Calculator",
    description:
      "Digital SAT (Adaptive IRT), IELTS 9.0 Band, UzBMBA Milliy Sertifikat (A+) va CEFR Multi-level (C1) natijalarini rasmiy standartlar bo'yicha tezkor hisoblang.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ScoreHigh — Standardized Testing Score Calculator",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ScoreHigh — Digital SAT, IELTS, Milliy Sertifikat & CEFR Calculator",
    description:
      "Digital SAT, IELTS, UzBMBA Milliy Sertifikat va CEFR Multi-level test ballari kalkulyatori.",
    images: ["/og-image.png"],
    creator: "@ScoreHigh",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/logo-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.webmanifest",
  category: "education",
  classification: "Standardized Testing Score Calculator",
  other: {
    "google-site-verification": "scorehigh-verification-token",
    "msvalidate.01": "scorehigh-bing-verification",
    "yandex-verification": "scorehigh-yandex-verification",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      name: "ScoreHigh",
      url: siteUrl,
      applicationCategory: "EducationalApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript",
      description:
        "Digital SAT, IELTS, Umumta'lim fanlaridan Milliy Sertifikat va UzBMBA CEFR Multi-level test ballari kalkulyatori.",
      inLanguage: ["uz", "en"],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Digital SAT Adaptive IRT Score Calculator",
        "IELTS 4-Skill Band Score Calculator",
        "UzBMBA Milliy Sertifikat 75-Point Rasch Calculator",
        "UzBMBA CEFR Multi-level 35-Question Scoring Engine",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Digital SAT bali qanday hisoblanadi?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Digital SAT imtihoni ikki bosqichli adaptiv model (IRT) asosida ishlaydi. 1-moduldagi to'g'ri javoblar soniga qarab 2-modul qiyin yoki oson bo'ladi va umumiy 400 dan 1600 ballgacha baholanadi.",
          },
        },
        {
          "@type": "Question",
          name: "IELTS overall band bali qanday hisoblanadi?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "IELTS bo'yicha to'rtta ko'nikma (Listening, Reading, Writing, Speaking) ballarining o'rta arifmetigi hisoblanadi va eng yaqin yarim yoki butun bandga (.0 yoki .5) yaxlitlanadi.",
          },
        },
        {
          "@type": "Question",
          name: "Umumta'lim fanlaridan Milliy Sertifikat darajalari qanday taqsimlanadi?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "UzBMBA rasmiy Rasch shkalasi bo'yicha: 70–75 ball A+, 65–69.9 ball A, 60–64.9 ball B+, 55–59.9 ball B, 50–54.9 ball C+, 46–49.9 ball C darajalariga to'g'ri keladi. 46 balldan past natijaga sertifikat berilmaydi.",
          },
        },
        {
          "@type": "Question",
          name: "UzBMBA CEFR Multi-level imtihoni qanday baholanadi?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Multi-level imtihoni 75 ballik standart shkalada baholanadi: 65–75 ball C1, 51–64 ball B2, 38–50 ball B1 darajalarini beradi. 38 balldan past ballarda sertifikat berilmaydi.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
