const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const lines = content.split('\n');
console.log('Around line 11629:');
for (let i = 11600; i <= 11645; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
