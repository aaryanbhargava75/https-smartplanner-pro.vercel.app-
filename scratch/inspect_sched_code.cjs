const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const lines = content.split('\n');
console.log('Lines 8475-8560:');
for (let i = 8475; i <= 8560; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
