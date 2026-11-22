const fs = require('fs');

const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let m;
let count = 0;

while ((m = scriptRegex.exec(content)) !== null) {
  count++;
  if (count === 10) {
    const code = m[2];
    const scriptStartLine = content.slice(0, m.index).split('\n').length;
    console.log(`Script #10 starts at line ${scriptStartLine}`);

    // Binary search or line search to find where it breaks
    const lines = code.split('\n');
    console.log(`Script #10 has ${lines.length} lines`);

    // Let's use acorn or esprima or node VM if available, or incremental try/catch
    const vm = require('vm');
    try {
      new vm.Script(code);
    } catch (e) {
      console.log('VM Error:', e.stack);
    }
    break;
  }
}
