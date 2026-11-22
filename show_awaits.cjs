const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf-8');

const actualScriptStart = content.lastIndexOf('<script>', content.indexOf('defaultSeedData'));
const scriptEnd = content.indexOf('</script>', actualScriptStart);
const code = content.slice(actualScriptStart + 8, scriptEnd);
const lines = code.split('\n');

console.log('--- Around 6604 ---');
console.log(lines.slice(6595, 6615).map((l, idx) => `${6595 + idx}: ${l}`).join('\n'));

console.log('--- Around 8414 ---');
console.log(lines.slice(8405, 8425).map((l, idx) => `${8405 + idx}: ${l}`).join('\n'));
