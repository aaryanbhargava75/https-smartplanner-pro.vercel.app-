const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const lines = content.split('\n');
console.log('Lines 9540-9620:');
for (let i = 9540; i <= 9620; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
