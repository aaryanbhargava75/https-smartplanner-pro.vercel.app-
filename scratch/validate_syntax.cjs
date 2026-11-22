const fs = require('fs');

const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let m;
let count = 0;
let errors = 0;

while ((m = scriptRegex.exec(content)) !== null) {
  count++;
  const attrs = m[1];
  const code = m[2];
  if (!code.trim() || attrs.includes('src=') || attrs.includes('json')) {
    continue;
  }
  try {
    new Function('async () => {\n' + code + '\n}');
    console.log(`Script #${count}: VALID (${code.length} chars)`);
  } catch (err) {
    errors++;
    console.error(`Script #${count}: SYNTAX ERROR!`, err.message);
  }
}

if (errors === 0) {
  console.log(`\n🎉 ALL executable scripts are 100% SYNTAX VALID!`);
} else {
  console.error(`\n❌ Found ${errors} script syntax errors!`);
  process.exit(1);
}
