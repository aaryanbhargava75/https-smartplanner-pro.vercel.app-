const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const lines = content.split('\n');
console.log('Around line 11580-11605:');
for (let i = 11575; i <= 11605; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
