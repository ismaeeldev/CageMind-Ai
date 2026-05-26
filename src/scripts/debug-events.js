async function main() {
  const r = await fetch('http://localhost:3000/events/eeafc6c4-e188-4277-a514-5bf70ab6c679');
  console.log('Status:', r.status);
  const text = await r.text();
  const titleMatch = text.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) console.log('Title:', titleMatch[1]);
  // look for RSC error digest
  const digestStart = text.indexOf('"digest"');
  if (digestStart !== -1) console.log('Digest area:', text.slice(digestStart, digestStart + 80));
  
  // also dump to a file just in case
  require('fs').writeFileSync('events-error.txt', text, 'utf8');
}
main().catch(e => console.error(e.message));
