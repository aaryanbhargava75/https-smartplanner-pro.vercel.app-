const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf-8');

const actualScriptStart = content.lastIndexOf('<script>', content.indexOf('defaultSeedData'));
const scriptEnd = content.indexOf('</script>', actualScriptStart);
const code = content.slice(actualScriptStart + 8, scriptEnd);
const lines = code.split('\n');

for (let i = 1; i <= lines.length; i++) {
  const subCode = lines.slice(0, i).join('\n');
  try {
    new Function(`(async () => {\n${subCode}\n})`);
  } catch (err) {
    if (err.message.includes("Unexpected token 'async'")) {
      console.log(`Error triggered at line ${i}: ${lines[i - 1]}`);
      console.log('Surrounding lines:');
      console.log(lines.slice(Math.max(0, i - 10), Math.min(lines.length, i + 5)).map((l, idx) => `${Math.max(0, i - 10) + idx + 1}: ${l}`).join('\n'));
      break;
    }
  }
}
