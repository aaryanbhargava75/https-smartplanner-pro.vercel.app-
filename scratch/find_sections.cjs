const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

['tab-overview', 'tab-dump', 'tab-journal', 'tab-tasks', 'tab-focus', 'tab-schedule', 'tab-expenses', 'tab-wealth', 'tab-screentime', 'tab-analytics', 'tab-guide', 'tab-nutrition'].forEach(id => {
  const idx = content.indexOf(`id="${id}"`);
  if (idx !== -1) {
    const lineNum = content.slice(0, idx).split('\n').length;
    console.log(`${id}: Line ${lineNum}`);
  }
});
