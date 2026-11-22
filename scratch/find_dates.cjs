const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const matches = [...content.matchAll(/(?:scheduleDate|selectedDate|currentScheduleDate|activeDate)/g)];
console.log('Matches:', matches.map(m => m[0]));
