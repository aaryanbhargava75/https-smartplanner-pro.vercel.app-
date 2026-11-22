const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const sIdx = content.indexOf('function renderScheduleCalendar()');
console.log('--- renderScheduleCalendar & renderSchedule snippet ---');
console.log(content.slice(sIdx, sIdx + 1200));

const rIdx = content.indexOf('function renderSchedule()');
console.log('--- renderSchedule snippet ---');
console.log(content.slice(rIdx, rIdx + 1200));
