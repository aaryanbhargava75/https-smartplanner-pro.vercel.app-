const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

let pos = 0;
while ((pos = content.indexOf("switchTab('focus')", pos)) !== -1) {
  const lineNum = content.slice(0, pos).split('\n').length;
  console.log(`Line ${lineNum}:`);
  console.log(content.slice(Math.max(0, pos - 200), Math.min(content.length, pos + 300)));
  console.log('='.repeat(40));
  pos += 18;
}
