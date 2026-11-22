const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf-8');

const actualScriptStart = content.lastIndexOf('<script>', content.indexOf('defaultSeedData'));
const lines = content.slice(actualScriptStart + 8).split('\n');

console.log('--- 4940-4975 ---');
console.log(lines.slice(4940, 4975).map((l, idx) => (4940 + idx) + ': ' + l).join('\n'));

console.log('--- 9240-9270 ---');
console.log(lines.slice(9240, 9270).map((l, idx) => (9240 + idx) + ': ' + l).join('\n'));
