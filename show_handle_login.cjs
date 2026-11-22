const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf-8');

const actualScriptStart = content.lastIndexOf('<script>', content.indexOf('defaultSeedData'));
const lines = content.slice(actualScriptStart + 8).split('\n');

console.log('--- Lines 8390-8430 ---');
console.log(lines.slice(8390, 8430).map((l, idx) => (8390 + idx + 1) + ': ' + l).join('\n'));
