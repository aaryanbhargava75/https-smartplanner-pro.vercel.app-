const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('data-mobile-tab=');
console.log('--- mobile nav ---');
console.log(content.slice(Math.max(0, idx - 200), idx + 1000));
