const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf-8');

const actualScriptStart = content.lastIndexOf('<script>', content.indexOf('defaultSeedData'));
const scriptEnd = content.indexOf('</script>', actualScriptStart);
const code = content.slice(actualScriptStart + 8, scriptEnd);
const lines = code.split('\n');

console.log('--- Lines 6560-6595 ---');
console.log(lines.slice(6560, 6595).map((l, idx) => `${6560 + idx}: ${l}`).join('\n'));
