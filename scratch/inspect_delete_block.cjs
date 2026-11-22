const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = html.indexOf('function deleteScheduleBlock');
console.log('--- deleteScheduleBlock ---');
console.log(html.slice(idx, idx + 800));
