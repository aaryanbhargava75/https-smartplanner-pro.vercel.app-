const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('function fallbackClientParse');
console.log('--- fallbackClientParse (continued) ---');
console.log(content.slice(idx + 2000, idx + 6000));
