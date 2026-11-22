const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf-8');

const actualScriptStart = content.lastIndexOf('<script>', content.indexOf('defaultSeedData'));
const lines = content.slice(actualScriptStart + 8).split('\n');

let d = 0;
for (let i = 0; i < 8430; i++) {
  const line = lines[i];
  const startD = d;
  for (let c of line) {
    if (c === '{') d++;
    else if (c === '}') d--;
  }
  if (i >= 8310 && i <= 8430) {
    console.log(`${i + 1} [d:${startD}->${d}]: ${line}`);
  }
}
