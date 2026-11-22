const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('data-tab="overview"');
console.log('--- Sidebar Nav from data-tab="overview" ---');
console.log(content.slice(Math.max(0, idx - 200), idx + 1500));
