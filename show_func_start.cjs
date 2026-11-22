const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf-8');

const actualScriptStart = content.lastIndexOf('<script>', content.indexOf('defaultSeedData'));
const scriptEnd = content.indexOf('</script>', actualScriptStart);
const code = content.slice(actualScriptStart + 8, scriptEnd);
const lines = code.split('\n');

console.log('--- Lines 6520-6560 ---');
console.log(lines.slice(6520, 6560).map((l, idx) => `${6520 + idx}: ${l}`).join('\n'));
