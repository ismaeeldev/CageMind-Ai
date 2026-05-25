async function main() {
  const r = await fetch('http://localhost:3000/fighters');
  console.log('Status:', r.status);
  const text = await r.text();
  require('fs').writeFileSync('fighters-error.txt', text, 'utf8');
  const titleMatch = text.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) console.log('Title:', titleMatch[1]);
  // look for RSC error digest
  const digestStart = text.indexOf('"digest"');
  if (digestStart !== -1) console.log('Digest area:', text.slice(digestStart, digestStart + 80));
}
main().catch(e => console.error(e.message));
