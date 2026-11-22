const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('data-tab="schedule"');
console.log('--- Sidebar Nav rest ---');
console.log(content.slice(idx, idx + 1200));
