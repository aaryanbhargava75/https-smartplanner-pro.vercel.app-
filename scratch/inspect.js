const fs = require('fs');

const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

console.log('--- TAB SECTIONS ---');
const secRegex = /<section[^>]*id=["']([^"']+)["'][^>]*>/g;
let m;
while ((m = secRegex.exec(content)) !== null) {
  if (m[1].startsWith('tab-')) {
    console.log(m[1]);
  }
}

console.log('\n--- NAV BUTTONS ---');
const navRegex = /data-tab=["']([^"']+)["'][^>]*>([\s\S]*?)<\/button>/g;
while ((m = navRegex.exec(content)) !== null) {
  console.log(m[1], '-->', m[2].replace(/\s+/g, ' ').trim());
}

console.log('\n--- CHECKING FOCUS / TIMER AUTO TRIGGER ---');
const timerMatches = content.match(/timerAction|isTimerCommand|launchFocusHub|activePomodoroTask/g);
console.log('Timer related tokens count:', timerMatches ? timerMatches.length : 0);

console.log('\n--- SEARCHING FOR "applyParsedData" ---');
const idx = content.indexOf('function applyParsedData');
if (idx !== -1) {
  console.log(content.slice(idx, idx + 1200));
}
