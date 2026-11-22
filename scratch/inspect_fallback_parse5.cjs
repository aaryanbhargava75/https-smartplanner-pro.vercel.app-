const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('function fallbackClientParse');
console.log('--- fallbackClientParse (part 5 - Tasks/Meetings) ---');
console.log(content.slice(idx + 14000, idx + 18500));
