const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('data-mobile-tab="tasks"');
console.log('--- mobile nav rest ---');
console.log(content.slice(idx, idx + 800));
