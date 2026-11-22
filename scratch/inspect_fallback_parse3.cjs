const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('function fallbackClientParse');
console.log('--- fallbackClientParse (task & meeting logic) ---');
console.log(content.slice(idx + 6000, idx + 10000));
