async function testEvents() {
  let hasErrors = false;

  console.log("1. Testing Events List Page (/events)");
  const res1 = await fetch("http://localhost:3000/events");
  if (res1.status === 200) {
    const text1 = await res1.text();
    // Check for seeded events
    if (text1.includes("UFC 300") && text1.includes("UFC 302")) {
      console.log("✓ Events list loads and contains seeded events.");
    } else {
      console.error("X Events list missing expected seeded events.");
      hasErrors = true;
    }
  } else {
    console.error("X Events list failed status:", res1.status);
    const err = await res1.text();
    console.error(err.slice(0, 500));
    hasErrors = true;
  }

  // Extract an event ID to test detail page
  const html = await (await fetch("http://localhost:3000/events")).text();
  const match = html.match(/href="\/events\/([a-zA-Z0-9-]+)"/);

  if (match && match[1]) {
    const eventId = match[1];
    console.log(`2. Testing Event Detail Page (/events/${eventId})`);
    
    const res2 = await fetch(`http://localhost:3000/events/${eventId}`);
    if (res2.status === 200) {
      const text2 = await res2.text();
      // Check for fight card UI elements and fighter names
      if (text2.includes("Fight Card") && (text2.includes("Poirier") || text2.includes("Gaethje") || text2.includes("Hill"))) {
        console.log("✓ Event detail page loads and contains the fight card.");
      } else {
        console.error("X Event detail page missing expected fight card content.");
        hasErrors = true;
      }
    } else {
      console.error("X Event detail page failed status:", res2.status);
      const err = await res2.text();
      console.error(err.slice(0, 500));
      hasErrors = true;
    }
  } else {
    console.error("X Could not extract an event ID to test detail page.");
    hasErrors = true;
  }

  console.log("\n--- Test Summary ---");
  if (hasErrors) {
    console.error("FAILED: Some tests did not pass.");
    process.exit(1);
  } else {
    console.log("ALL TESTS PASSED ✓");
  }
}

testEvents();
