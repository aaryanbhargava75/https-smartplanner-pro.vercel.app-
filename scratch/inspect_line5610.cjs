const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const lines = content.split('\n');
console.log('Lines 5610-5670:');
for (let i = 5610; i <= 5670; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
