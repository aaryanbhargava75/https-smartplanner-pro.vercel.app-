const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

let pos = 0;
while ((pos = content.indexOf('function renderSchedule', pos)) !== -1) {
  const lineNum = content.slice(0, pos).split('\n').length;
  console.log(`Line ${lineNum}:`, content.slice(pos, pos + 100).split('\n')[0]);
  pos += 20;
}
