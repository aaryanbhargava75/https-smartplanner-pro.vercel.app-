const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('id="tab-screentime"');
console.log('--- tab-screentime continued ---');
console.log(content.slice(idx + 1500, idx + 4500));
