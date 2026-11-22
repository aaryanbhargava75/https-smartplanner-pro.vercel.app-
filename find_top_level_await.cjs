const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf-8');

const scriptStart = content.indexOf('<script>', content.indexOf('defaultSeedData'));
const actualScriptStart = content.lastIndexOf('<script>', content.indexOf('defaultSeedData'));
const scriptEnd = content.indexOf('</script>', actualScriptStart);
const code = content.slice(actualScriptStart + 8, scriptEnd);

const lines = code.split('\n');
console.log('Script has lines:', lines.length);

// Check around line 4090: remember earlier we saw line 4090: await loadInitialData();
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('await ') && !line.includes('async function') && !line.includes('async ()')) {
    // Check if it's inside an async function by scanning backwards
    let insideAsync = false;
    let braceCount = 0;
    for (let j = i; j >= Math.max(0, i - 100); j--) {
      if (lines[j].includes('async function') || lines[j].includes('async (')) {
        insideAsync = true;
        break;
      }
      if (lines[j].includes('function ') && !lines[j].includes('async function')) {
        insideAsync = false;
        break;
      }
    }
    if (!insideAsync) {
      console.log(`Line ${i + 1}: ${line.trim()}`);
    }
  }
}
