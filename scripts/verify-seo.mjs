async function testSEO() {
  console.log("Checking SEO on http://localhost:3000 ...");
  const res = await fetch("http://localhost:3000");
  const html = await res.text();

  console.log("Status:", res.status);

  // Check Title
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  console.log("Title:", title);

  // Check Metas
  const metaRegex = /<meta\s+([^>]+)>/g;
  let match;
  const metas = [];
  while ((match = metaRegex.exec(html)) !== null) {
    metas.push(match[1]);
  }
  console.log(`Found ${metas.length} meta tags:`);
  metas.filter(m => m.includes("name=") || m.includes("property=")).forEach(m => console.log(" -", m));

  // Check JSON-LD
  const jsonLdRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let ldMatch;
  let count = 0;
  while ((ldMatch = jsonLdRegex.exec(html)) !== null) {
    count++;
    try {
      const parsed = JSON.parse(ldMatch[1]);
      console.log(`JSON-LD #${count} Type:`, parsed["@type"] || parsed["@graph"]?.[0]?.["@type"]);
    } catch (err) {
      console.error(`JSON-LD #${count} JSON parse error:`, err.message);
    }
  }

  // Check Robots.txt
  console.log("\nChecking /robots.txt ...");
  const robotsRes = await fetch("http://localhost:3000/robots.txt");
  console.log("Robots status:", robotsRes.status);
  const robotsText = await robotsRes.text();
  console.log("Robots content preview:\n" + robotsText.slice(0, 300));

  // Check Sitemap.xml
  console.log("\nChecking /sitemap.xml ...");
  const sitemapRes = await fetch("http://localhost:3000/sitemap.xml");
  console.log("Sitemap status:", sitemapRes.status);
  const sitemapText = await sitemapRes.text();
  console.log("Sitemap content preview:\n" + sitemapText.slice(0, 400));

  // Check Manifest
  console.log("\nChecking /manifest.webmanifest ...");
  const manifestRes = await fetch("http://localhost:3000/manifest.webmanifest");
  console.log("Manifest status:", manifestRes.status);
  const manifestJson = await manifestRes.json();
  console.log("Manifest name:", manifestJson.name, "theme_color:", manifestJson.theme_color);

  // Check OG Image static fallback
  console.log("\nChecking /og-image.png ...");
  const ogRes = await fetch("http://localhost:3000/og-image.png");
  console.log("OG Image static status:", ogRes.status, "content-type:", ogRes.headers.get("content-type"));
}

testSEO().catch(console.error);
