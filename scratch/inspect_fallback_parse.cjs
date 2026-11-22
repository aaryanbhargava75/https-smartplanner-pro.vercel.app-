const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

// Let's find fallbackClientParse
const idx = content.indexOf('function fallbackClientParse');
console.log('--- fallbackClientParse start ---');
console.log(content.slice(idx, idx + 2500));
