const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = html.indexOf('function changeScheduleDay(delta)');
console.log('--- Current definition in file ---');
console.log(html.slice(Math.max(0, idx - 100), idx + 400));
