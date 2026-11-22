const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const regex = /switchTab\(['"](focus|wealth|analytics|dump)['"]\)/g;
let m;
while ((m = regex.exec(content)) !== null) {
  const lineNum = content.slice(0, m.index).split('\n').length;
  console.log(`Line ${lineNum}:`, content.slice(Math.max(0, m.index - 50), Math.min(content.length, m.index + 80)).replace(/\n/g, ' '));
}
