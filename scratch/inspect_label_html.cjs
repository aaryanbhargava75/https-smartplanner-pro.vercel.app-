const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = html.indexOf('id="scheduleDayLabel"');
console.log('--- scheduleDayLabel HTML ---');
console.log(html.slice(Math.max(0, idx - 200), idx + 300));
