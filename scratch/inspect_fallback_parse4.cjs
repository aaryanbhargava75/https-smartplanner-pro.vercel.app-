const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('function fallbackClientParse');
console.log('--- fallbackClientParse (part 4) ---');
console.log(content.slice(idx + 10000, idx + 14000));
