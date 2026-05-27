import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as cheerio from "cheerio";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const fighter = await prisma.fighter.findUnique({
      where: { id: params.id },
    });

    if (!fighter) {
      return NextResponse.json({ error: "Fighter not found" }, { status: 404 });
    }

    // Clean name to construct slug for UFC athlete page
    // Safeguard: Check if name is duplicated in the DB (e.g. "Danny Abbadi Danny Abbadi")
    const words = fighter.name.split(" ");
    let cleanedName = fighter.name;
    if (words.length > 1 && words.length % 2 === 0) {
      const half = words.length / 2;
      const firstHalf = words.slice(0, half).join(" ");
      const secondHalf = words.slice(half).join(" ");
      if (firstHalf === secondHalf) {
        cleanedName = firstHalf;
      }
    }

    const slug = cleanedName.toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-");

    const url = `https://www.ufc.com/athlete/${slug}`;
    
    let age = fighter.age;
    let height = fighter.height;
    let reach = fighter.reach;
    let koWins = fighter.koWins;
    let subWins = fighter.subWins;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(10000), // 10s timeout to keep page loads fast
      });

      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);

        // Parse physical bio info
        $(".c-bio__label").each((_, el) => {
          const label = $(el).text().trim().toLowerCase();
          const valueText = $(el).next().text().trim();
          
          if (valueText) {
            if (label === "age") {
              const num = parseInt(valueText, 10);
              if (!isNaN(num)) age = num;
            } else if (label === "height") {
              const num = parseFloat(valueText);
              if (!isNaN(num)) height = num;
            } else if (label === "reach") {
              const num = parseFloat(valueText);
              if (!isNaN(num)) reach = num;
            }
          }
        });

        // Parse stats (Method of Victory wins)
        $(".hero-profile__stat").each((_, el) => {
          const statText = $(el).find(".hero-profile__stat-text").text().trim().toLowerCase();
          const statNumbText = $(el).find(".hero-profile__stat-numb").text().trim();
          
          if (statNumbText) {
            const num = parseInt(statNumbText, 10);
            if (!isNaN(num)) {
              if (statText.includes("knockout")) {
                koWins = num;
              } else if (statText.includes("submission")) {
                subWins = num;
              }
            }
          }
        });

        // Update database with freshly scraped attributes
        await prisma.fighter.update({
          where: { id: fighter.id },
          data: { age, height, reach, koWins, subWins },
        });
      }
    } catch (scrapeError) {
      console.error(`Failed to scrape live profile for ${fighter.name}:`, scrapeError);
    }

    return NextResponse.json({
      id: fighter.id,
      name: fighter.name,
      weightClass: fighter.weightClass,
      imageUrl: fighter.imageUrl,
      eloRating: fighter.eloRating,
      wins: fighter.wins,
      losses: fighter.losses,
      draws: fighter.draws,
      age,
      height,
      reach,
      koWins,
      subWins,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
