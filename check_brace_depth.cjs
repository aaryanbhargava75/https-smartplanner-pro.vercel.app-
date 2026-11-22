const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf-8');

const actualScriptStart = content.lastIndexOf('<script>', content.indexOf('defaultSeedData'));
const scriptEnd = content.indexOf('</script>', actualScriptStart);
const code = content.slice(actualScriptStart + 8, scriptEnd);
const lines = code.split('\n');

let depth = 0;
for (let i = 0; i < 8427; i++) {
  const line = lines[i];
  for (let c of line) {
    if (c === '{') depth++;
    else if (c === '}') depth--;
  }
}
console.log('Brace depth right before line 8428:', depth);

// Print where depth changed unexpectedly or find where depth went above expected
let d = 0;
for (let i = 0; i < 8427; i++) {
  const line = lines[i];
  const prev = d;
  for (let c of line) {
    if (c === '{') d++;
    else if (c === '}') d--;
  }
  // Check if at the end of a function declaration, depth didn't return to 0
  if (/^\s*(?:async\s+)?function\s+([a-zA-Z0-9_$]+)/.test(line)) {
    if (prev !== 0) {
      console.log(`Function declared while depth is ${prev} at line ${i + 1}: ${line.trim()}`);
    }
  }
}
