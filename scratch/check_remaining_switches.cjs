const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const regex = /switchTab\(['"](focus|wealth|analytics|dump)['"]\)/g;
let m;
let found = 0;
while ((m = regex.exec(html)) !== null) {
  found++;
  const lineNum = html.slice(0, m.index).split('\n').length;
  console.log(`Remaining call at line ${lineNum}:`, html.slice(Math.max(0, m.index - 40), m.index + 50));
}

console.log(`Found ${found} remaining calls.`);
