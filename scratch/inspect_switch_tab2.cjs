const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('function switchTab');
console.log(content.slice(idx + 800, idx + 2500));
