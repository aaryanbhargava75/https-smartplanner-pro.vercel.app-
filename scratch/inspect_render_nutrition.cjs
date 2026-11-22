const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const nIdx = html.indexOf('function renderNutrition');
console.log('--- renderNutrition ---');
console.log(html.slice(nIdx, nIdx + 1200));
