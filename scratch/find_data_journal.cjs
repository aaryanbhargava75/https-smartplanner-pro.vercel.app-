const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const apIdx = html.indexOf('function applyParsedData');
let pos = apIdx;
while ((pos = html.indexOf('journal', pos)) !== -1 && pos < apIdx + 8000) {
  const line = html.slice(Math.max(0, pos - 40), pos + 100).split('\n')[0];
  console.log(`Journal ref at pos ${pos}:`, line);
  pos += 15;
}
