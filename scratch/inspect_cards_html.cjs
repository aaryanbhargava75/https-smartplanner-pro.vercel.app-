const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const lines = content.split('\n');
console.log('Lines 5560-5612:');
for (let i = 5560; i <= 5612; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
