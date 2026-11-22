const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const lines = content.split('\n');
console.log('Lines 9345-9430:');
for (let i = 9345; i <= 9430; i++) {
  if (lines[i]) console.log(`${i+1}: ${lines[i]}`);
}
