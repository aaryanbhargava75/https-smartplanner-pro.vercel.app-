const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('function renderSchedule');
console.log('--- renderSchedule ---');
console.log(content.slice(idx, idx + 2500));
