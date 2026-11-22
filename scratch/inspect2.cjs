const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

console.log('--- switchTab calls ---');
const stMatches = [...content.matchAll(/switchTab\(['"]([^'"]+)['"]\)/g)];
console.log(stMatches.map(m => m[0]));

console.log('\n--- Where is switchTab("focus")? ---');
let pos = 0;
while ((pos = content.indexOf("switchTab('focus')", pos)) !== -1) {
  console.log(content.slice(Math.max(0, pos - 150), Math.min(content.length, pos + 200)));
  console.log('---');
  pos += 18;
}

console.log('\n--- More applyParsedData schedule logic ---');
const apIdx = content.indexOf('function applyParsedData');
const apEnd = content.indexOf('// SAVE & NOTIFY', apIdx);
console.log(content.slice(apIdx + 1500, apEnd !== -1 ? apEnd + 300 : apIdx + 4500));
