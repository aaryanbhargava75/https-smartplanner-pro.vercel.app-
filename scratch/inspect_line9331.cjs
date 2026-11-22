const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const lines = content.split('\n');
console.log('Around line 9331:');
for (let i = 9290; i <= 9360; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
