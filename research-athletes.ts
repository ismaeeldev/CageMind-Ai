import * as cheerio from "cheerio";

async function run() {
  try {
    const html = await fetch("https://www.ufc.com/athletes/all", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }).then(res => res.text());
    const $ = cheerio.load(html);
    
    console.log("Found athlete cards:", $('.c-listing-athlete-flipcard__inner, .c-listing-athlete, .athlete-card, .l-listing__item').length);
    
    let i = 0;
    $('.c-listing-athlete-flipcard__inner, .c-listing-athlete, .athlete-card, .l-listing__item').each((_, el) => {
      if (i > 1) return;
      console.log("HTML:", $(el).html()?.substring(0, 1500));
      i++;
    });
  } catch (e) {
    console.error(e);
  }
}

run();
