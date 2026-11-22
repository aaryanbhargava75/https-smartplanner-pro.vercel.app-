const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

// Find fallbackClientParse and related helpers
const startIdx = html.indexOf('function fallbackClientParse');
const endIdx = html.indexOf('function renderDumpFeed');
const code = html.slice(startIdx, endIdx);

// Also get helper functions needed
const helpers = [
  'function classifyNonTaskActivity',
  'function isFoodIntakeClause',
  'function estimateDishNutrition',
  'function minutesToTime',
  'function timeToMinutes',
  'function formatTime12h',
  'function extractTimeFromText',
  'function extractDateFromText',
  'function cleanActivityDisplayTitle',
  'function inferActivityCategory',
  'function extractDurationFromClause',
  'function markMatchingPendingTaskDone',
  'function ensureHabitShieldData',
  'function isFoodClauseOrItem',
  'function autoSyncFoodExpenseToNutrition'
];

let helperCode = '';
helpers.forEach(h => {
  const idx = html.indexOf(h);
  if (idx !== -1) {
    const end = html.indexOf('\n      function ', idx + 10);
    helperCode += html.slice(idx, end !== -1 ? end : idx + 1500) + '\n';
  }
});

const sandbox = `
let appData = { tasks: [], journal: [], expenses: [], notToDoList: [] };
let showToast = (m) => console.log('TOAST:', m);
let saveData = () => {};
let renderAll = () => {};
let renderHabitShields = () => {};
let renderWhatNotToDo = () => {};
let Notification = { permission: 'granted', requestPermission: () => {} };
let window = { Notification };

${helperCode}
${code}

const text = "bola na tarun ke saath meeting set krde kal 12";
console.log('Testing text:', text);
fallbackClientParse(text);

console.log('Tasks:', appData.tasks);
console.log('Journal:', appData.journal);
`;

eval(sandbox);
