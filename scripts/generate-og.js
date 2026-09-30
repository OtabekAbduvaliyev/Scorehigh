const sharp = require("sharp");
const path = require("path");

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="15%" r="85%">
      <stop offset="0%" stop-color="#3B0764" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#1E1B4B" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#0B0F19" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#C084FC"/>
    </linearGradient>
    <linearGradient id="cardBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(168, 85, 247, 0.5)"/>
      <stop offset="100%" stop-color="rgba(255, 255, 255, 0.1)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#0B0F19"/>
  <rect width="1200" height="630" fill="url(#bgGrad)"/>

  <!-- Subtle grid lines -->
  <g stroke="rgba(255,255,255,0.03)" stroke-width="1">
    <line x1="0" y1="105" x2="1200" y2="105"/>
    <line x1="0" y1="210" x2="1200" y2="210"/>
    <line x1="0" y1="315" x2="1200" y2="315"/>
    <line x1="0" y1="420" x2="1200" y2="420"/>
    <line x1="0" y1="525" x2="1200" y2="525"/>
    <line x1="200" y1="0" x2="200" y2="630"/>
    <line x1="400" y1="0" x2="400" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="800" y1="0" x2="800" y2="630"/>
    <line x1="1000" y1="0" x2="1000" y2="630"/>
  </g>

  <!-- Top Badge -->
  <g transform="translate(435, 75)">
    <rect width="330" height="42" rx="21" fill="rgba(124, 58, 237, 0.25)" stroke="rgba(167, 139, 250, 0.4)" stroke-width="1.5"/>
    <text x="165" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="700" fill="#DDD6FE" text-anchor="middle">
      ✦ RASMIY TEST BALLARI KALKULYATORI
    </text>
  </g>

  <!-- Brand Title -->
  <g transform="translate(600, 220)">
    <text text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="82" font-weight="900" letter-spacing="-2px">
      <tspan fill="#FFFFFF">Score</tspan><tspan fill="url(#brandGrad)">High</tspan>
    </text>
  </g>

  <!-- Subtitle -->
  <g transform="translate(600, 275)">
    <text text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#94A3B8" letter-spacing="0.5px">
      Digital SAT (Adaptive IRT) · IELTS · Milliy Sertifikat · CEFR Multi-level
    </text>
  </g>

  <!-- 4 Feature Cards -->
  <!-- Card 1: SAT -->
  <g transform="translate(70, 355)">
    <rect width="245" height="110" rx="14" fill="rgba(255,255,255,0.04)" stroke="url(#cardBorder)" stroke-width="1.5"/>
    <text x="24" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="21" font-weight="800" fill="#F8FAFC">Digital SAT</text>
    <text x="24" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#A855F7">Adaptive 2-Module IRT</text>
    <text x="24" y="94" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="400" fill="#64748B">RW &amp; Math (400–1600)</text>
  </g>

  <!-- Card 2: IELTS -->
  <g transform="translate(340, 355)">
    <rect width="245" height="110" rx="14" fill="rgba(255,255,255,0.04)" stroke="url(#cardBorder)" stroke-width="1.5"/>
    <text x="24" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="21" font-weight="800" fill="#F8FAFC">IELTS 9.0</text>
    <text x="24" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#A855F7">4-Skill Overall Band</text>
    <text x="24" y="94" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="400" fill="#64748B">Listening &amp; Reading 40Q</text>
  </g>

  <!-- Card 3: Milliy -->
  <g transform="translate(615, 355)">
    <rect width="245" height="110" rx="14" fill="rgba(255,255,255,0.04)" stroke="url(#cardBorder)" stroke-width="1.5"/>
    <text x="24" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="21" font-weight="800" fill="#F8FAFC">Milliy Sertifikat</text>
    <text x="24" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#A855F7">UzBMBA Rasch Shkalasi</text>
    <text x="24" y="94" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="400" fill="#64748B">A+, A, B+, B, C (0–75)</text>
  </g>

  <!-- Card 4: CEFR -->
  <g transform="translate(885, 355)">
    <rect width="245" height="110" rx="14" fill="rgba(255,255,255,0.04)" stroke="url(#cardBorder)" stroke-width="1.5"/>
    <text x="24" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="21" font-weight="800" fill="#F8FAFC">CEFR Multi-level</text>
    <text x="24" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#A855F7">35 Savol · 75 Ballik</text>
    <text x="24" y="94" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="400" fill="#64748B">C1, B2, B1 Darajalari</text>
  </g>

  <!-- Bottom Bar -->
  <g transform="translate(600, 560)">
    <text text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="500" fill="#64748B">
      Rasmiy UzBMBA standartlari va Xalqaro test metodologiyalari asosida ishlaydi
    </text>
  </g>
</svg>
`;

const outputPath = path.join(__dirname, "..", "public", "og-image.png");

sharp(Buffer.from(svg))
  .png({ quality: 95 })
  .toFile(outputPath)
  .then(() => {
    console.log("Successfully generated public/og-image.png at", outputPath);
  })
  .catch((err) => {
    console.error("Error generating OG image:", err);
    process.exit(1);
  });
