const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

console.log('--- Searching for all occurrences of "tab-focus" or focus switching ---');
const regex = /(?:focusHub|switchTab\(['"]focus['"]\)|activePomodoro|setTimerPreset)/g;
let m;
while ((m = regex.exec(content)) !== null) {
  const lineNum = content.slice(0, m.index).split('\n').length;
  console.log(`Line ${lineNum} [${m[0]}]: ${content.slice(Math.max(0, m.index - 80), Math.min(content.length, m.index + 120)).replace(/\n/g, ' ')}`);
}
