const fs = require('fs');

let html = fs.readFileSync('smart-planner-ai.html', 'utf8');

// 1. Fix data.journal?.length in applyParsedData
const oldDataJournal = `        if (data.journal?.length) {
          if (!appData.journal) appData.journal = [];
          data.journal.forEach(j => {
            appData.journal.unshift({
              id: 'j_' + Math.random().toString(36).substr(2, 9),
              activity: j.activity || 'Activity',
              startTime: j.startTime || '10:00',
              endTime: j.endTime || '11:00',
              duration: j.durationMinutes || j.duration || 60,
              category: j.category || 'Work & Deep Focus',
              mood: j.mood || '⚡ Productive',
              notes: j.notes || j.feeling || ''
            });
          });
        }`;

const newDataJournal = `        if (data.journal?.length) {
          if (!appData.journal) appData.journal = [];
          const inferredDate = (typeof extractDateFromText === 'function' ? extractDateFromText(rawInputText) : null) || new Date().toISOString().split('T')[0];
          data.journal.forEach(j => {
            const jDate = j.date || inferredDate;
            appData.journal.unshift({
              id: 'j_' + Math.random().toString(36).substr(2, 9),
              activity: j.activity || 'Activity',
              startTime: j.startTime || '10:00',
              endTime: j.endTime || '11:00',
              duration: j.durationMinutes || j.duration || 60,
              category: j.category || 'Work & Deep Focus',
              mood: j.mood || '⚡ Productive',
              date: jDate,
              notes: j.notes || j.feeling || ''
            });
          });
        }`;

if (html.includes(oldDataJournal)) {
  html = html.replace(oldDataJournal, newDataJournal);
  console.log('✔ Fixed data.journal date saving in applyParsedData');
} else {
  console.log('✖ Could not find oldDataJournal');
}

// 2. Add journal migration / undated cleanup to loadInitialData
const oldLoadEnd = `              appData = { ...defaultSeedData, ...parsed };`;
const newLoadEnd = `              appData = { ...defaultSeedData, ...parsed };
              // Clean up and migrate undated journal items matching tomorrow's tasks
              if (Array.isArray(appData.journal)) {
                const todayISO = new Date().toISOString().split('T')[0];
                appData.journal = appData.journal.filter((j, idx, arr) => {
                  if (!j.date && Array.isArray(appData.tasks)) {
                    const matchedTask = appData.tasks.find(t => t.title && j.activity && (t.title.toLowerCase().includes(j.activity.toLowerCase()) || j.activity.toLowerCase().includes(t.title.toLowerCase())));
                    if (matchedTask && matchedTask.date) {
                      j.date = matchedTask.date;
                    }
                  }
                  if (!j.date) {
                    const hasDatedDuplicate = arr.some(other => other !== j && other.date && other.activity === j.activity && other.startTime === j.startTime);
                    if (hasDatedDuplicate) return false;
                    j.date = todayISO;
                  }
                  return true;
                });
              }`;

if (html.includes(oldLoadEnd)) {
  html = html.replace(oldLoadEnd, newLoadEnd);
  console.log('✔ Added journal migration and duplicate cleanup to loadInitialData');
} else {
  console.log('✖ Could not find oldLoadEnd');
}

fs.writeFileSync('smart-planner-ai.html', html, 'utf8');
console.log('Done fix_journal_dates.cjs');
