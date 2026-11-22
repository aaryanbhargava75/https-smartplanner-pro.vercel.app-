const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const lines = content.split('\n');
console.log('Lines 5970-6020:');
for (let i = 5970; i <= 6020; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
