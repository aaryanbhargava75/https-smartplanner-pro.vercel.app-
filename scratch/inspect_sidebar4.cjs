const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('data-tab="nutrition"');
console.log('--- Sidebar Nav from nutrition ---');
console.log(content.slice(idx, idx + 1000));
