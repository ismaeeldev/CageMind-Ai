import * as cheerio from "cheerio";

async function testDDG() {
  const query = 'site:tapology.com UFC 300';
  const url = `https://www.ask.com/web?q=${encodeURIComponent(query)}`;
  console.log("Fetching Ask.com search:", url);
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });
  console.log("Status:", response.status);
  const html = await response.text();
  console.log("HTML Preview (first 1000 chars):", html.substring(0, 1000));
  const $ = cheerio.load(html);
  
  console.log("All Links found:");
  $('a').each((i, el) => {
    const href = $(el).attr("href");
    const text = $(el).text();
    if (href) {
      console.log(`Href: ${href} | Text: ${text}`);
    }
  });
}

testDDG();
