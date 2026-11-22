const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = html.indexOf('id="tab-schedule"');
console.log('--- tab-schedule header ---');
console.log(html.slice(idx, idx + 1500));
