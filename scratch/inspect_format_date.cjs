const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('function formatCompactTaskDate');
console.log('--- formatCompactTaskDate ---');
console.log(content.slice(idx, idx + 800));
