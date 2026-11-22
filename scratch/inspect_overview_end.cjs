const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const lines = content.split('\n');
console.log('Lines 5930-5975:');
for (let i = 5930; i <= 5975; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
