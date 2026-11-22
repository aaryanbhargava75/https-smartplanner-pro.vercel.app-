const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf-8');

const actualScriptStart = content.lastIndexOf('<script>', content.indexOf('defaultSeedData'));
const scriptEnd = content.indexOf('</script>', actualScriptStart);
const code = content.slice(actualScriptStart + 8, scriptEnd);
const lines = code.split('\n');

// Binary search or line search to find where the error is
let low = 0;
let high = lines.length;

function testSlice(n) {
  const subCode = lines.slice(0, n).join('\n');
  try {
    new Function(subCode);
    return 'ok';
  } catch (e) {
    return e.message;
  }
}

// Check every occurrence of await
const awaitLines = [];
for (let i = 0; i < lines.length; i++) {
  if (/\bawait\s+/.test(lines[i])) {
    awaitLines.push(i + 1);
  }
}

console.log('Found await on lines:', awaitLines.length);

for (const lineNum of awaitLines) {
  // Wrap this single line in a test or check its surrounding function
  const lineText = lines[lineNum - 1];
  // Check if replacing this await makes the code pass or move forward
  // Let's check by wrapping just the function containing this line
  let funcStart = -1;
  let funcEnd = -1;
  for (let j = lineNum - 1; j >= 0; j--) {
    if (/^\s*(?:async\s+)?function\s+([a-zA-Z0-9_$]+)/.test(lines[j])) {
      funcStart = j;
      break;
    }
  }
  if (funcStart !== -1) {
    const isAsync = /^\s*async\s+function/.test(lines[funcStart]);
    if (!isAsync) {
      console.log(`❌ Line ${lineNum} has await inside NON-ASYNC function on line ${funcStart + 1}: ${lines[funcStart].trim()}`);
      console.log(`   Await line: ${lineText.trim()}`);
    }
  } else {
    console.log(`❌ Line ${lineNum} has await at TOP LEVEL (no function found): ${lineText.trim()}`);
  }
}
