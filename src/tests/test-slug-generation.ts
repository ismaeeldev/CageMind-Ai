import { getSlugCandidates } from "../scripts/reactivate-active-fighters"; // wait, let's export it or import it

// Since we cannot run standard db operations, let's test the helper logic in-memory.
function testSlugCandidates() {
  console.log("=== Testing Slug Candidates Generation ===");

  const testCases = [
    {
      ufcId: "/athlete/jon-jones",
      name: "Jon Jones",
      expected: ["/athlete/jon-jones", "/athlete/jonjones"]
    },
    {
      ufcId: "/athlete/conor-mcgregor",
      name: "Conor McGregor",
      expected: ["/athlete/conor-mcgregor", "/athlete/conormcgregor"]
    },
    {
      ufcId: "/athlete/jonathan-jones",
      name: "Jonathan 'Bones' Jones",
      expected: [
        "/athlete/jonathan-jones",
        "/athlete/jonathan-bones-jones",
        "/athlete/jonathan-jones",
        "/athlete/jonathanjones",
        "/athlete/jonathan-bones-jones"
      ]
    },
    {
      ufcId: "/athlete/sean-omalley",
      name: "Sean O'Malley",
      expected: [
        "/athlete/sean-omalley",
        "/athlete/sean-o-malley",
        "/athlete/sean-omalley"
      ]
    }
  ];

  let allPassed = true;
  for (const tc of testCases) {
    const candidates = getSlugCandidates(tc.ufcId, tc.name);
    console.log(`\nName: "${tc.name}", UFC ID: "${tc.ufcId}"`);
    console.log(`Generated candidates:`, candidates);
    
    // Check if expected candidates are in generated list
    for (const exp of tc.expected) {
      if (candidates.includes(exp)) {
        console.log(`✓ Generated: ${exp}`);
      } else {
        console.error(`X Missing expected candidate: ${exp}`);
        allPassed = false;
      }
    }
  }

  if (allPassed) {
    console.log("\n✓ ALL SLUG GENERATION TESTS PASSED!");
  } else {
    console.error("\nX SOME SLUG GENERATION TESTS FAILED!");
    process.exit(1);
  }
}

testSlugCandidates();

// Duplicate function from reactivate script to run in isolation
function getSlugCandidates(ufcId: string, name: string): string[] {
  const candidates = new Set<string>();
  const clean = (s: string) => s.toLowerCase().replace(/['"’‘“”\.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const cleanWithHyphen = (s: string) => s.toLowerCase().replace(/['"’‘“”]/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  
  let originalSlug = ufcId;
  if (originalSlug.startsWith("/athlete/")) {
    originalSlug = originalSlug.replace("/athlete/", "");
  }
  candidates.add(clean(originalSlug));
  candidates.add(cleanWithHyphen(originalSlug));
  
  const nameCleaned = name.toLowerCase().replace(/['"’‘“”]/g, "-").replace(/[^a-z0-9]+/g, " ").trim();
  const parts = nameCleaned.split(/\s+/);
  
  if (parts.length >= 2) {
    const first = parts[0];
    const last = parts[parts.length - 1];
    candidates.add(`${clean(first)}-${clean(last)}`);
    candidates.add(parts.map(clean).filter(Boolean).join("-"));
    candidates.add(`${clean(first)}${clean(last)}`);
  }
  candidates.add(clean(name));
  candidates.add(cleanWithHyphen(name));
  
  return Array.from(candidates).map(slug => `/athlete/${slug}`);
}
