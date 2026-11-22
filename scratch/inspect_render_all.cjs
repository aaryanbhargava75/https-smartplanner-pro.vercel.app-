const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

console.log('renderHabitShields in renderAll?');
const raIdx = content.indexOf('function renderAll');
console.log(content.slice(raIdx, raIdx + 800));
