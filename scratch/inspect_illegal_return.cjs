const fs = require('fs');

const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let m;
let count = 0;

while ((m = scriptRegex.exec(content)) !== null) {
  count++;
  if (count === 10) {
    const lines = m[2].split('\n');
    for (let i = 8320; i <= 8345; i++) {
      console.log(`${i+1}: ${lines[i]}`);
    }
    break;
  }
}
