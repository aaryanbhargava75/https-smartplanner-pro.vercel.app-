const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

let pos = 0;
while ((pos = content.indexOf('launchFocusHub', pos)) !== -1) {
  const lineNum = content.slice(0, pos).split('\n').length;
  console.log(`Line ${lineNum}:`, content.slice(Math.max(0, pos - 100), Math.min(content.length, pos + 150)).replace(/\n/g, ' '));
  pos += 14;
}
