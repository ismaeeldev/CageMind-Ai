const fs = require('fs');

async function main() {
  const res = await fetch('https://www.ufc.com/events');
  const text = await res.text();
  fs.writeFileSync('ufc.html', text);
  console.log('Saved ufc.html');
}
main();
