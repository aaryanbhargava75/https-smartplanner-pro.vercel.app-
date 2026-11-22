const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const lines = content.split('\n');
console.log('Lines 8364-8450:');
for (let i = 8363; i <= 8450; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
