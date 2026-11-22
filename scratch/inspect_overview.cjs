const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

// Check renderOverview and where journal is shown on overview / naya dump
const idx = content.indexOf('function renderOverview');
console.log('--- renderOverview ---');
console.log(content.slice(idx, idx + 2000));
