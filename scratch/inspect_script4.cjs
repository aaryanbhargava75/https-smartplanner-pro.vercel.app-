const fs = require('fs');

const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let count = 0;

while ((m = scriptRegex.exec(content)) !== null) {
  count++;
  if (count === 4) {
    console.log(`Script #4 attrs:`, m[0].slice(0, 100));
    console.log(`Script #4 code:`);
    console.log(m[1].slice(0, 500));
    break;
  }
}
