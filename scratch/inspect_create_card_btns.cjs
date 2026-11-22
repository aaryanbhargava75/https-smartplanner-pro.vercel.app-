const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('function createTaskCardEl');
console.log('--- createTaskCardEl (buttons) ---');
console.log(content.slice(idx + 1500, idx + 3500));
