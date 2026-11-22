const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = html.indexOf('function changeScheduleDay');
console.log('Lines around changeScheduleDay:');
console.log(html.slice(Math.max(0, idx - 400), idx + 600));
