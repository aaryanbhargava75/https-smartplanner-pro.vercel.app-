const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('function fallbackClientParse');
console.log('--- fallbackClientParse (part 6 - Saving Task/Schedule) ---');
console.log(content.slice(idx + 18500, idx + 22500));
