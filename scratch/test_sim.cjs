const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  resources: 'usable',
  url: 'https://smartplanner-pro.vercel.app/'
});

const { window } = dom;

// Wait for DOM to load
setTimeout(() => {
  try {
    console.log('Testing app initialization in JSDOM...');
    const appData = window.appData;
    console.log('Current user:', window.currentUser ? window.currentUser.name : 'none');
    console.log('Initial tasks count:', appData.tasks ? appData.tasks.length : 0);
    console.log('Initial journal count:', appData.journal ? appData.journal.length : 0);

    const testInput = 'bola na tarun ke saath meeting set krde kal 12';
    console.log('\nSimulating brain dump:', testInput);

    window.fallbackClientParse(testInput);

    console.log('\n--- AFTER DUMP ---');
    console.log('Total tasks:', appData.tasks.length);
    const addedTask = appData.tasks.find(t => t.title.toLowerCase().includes('tarun'));
    console.log('Added task:', addedTask ? { title: addedTask.title, date: addedTask.date, time: addedTask.time, priority: addedTask.priority } : 'NOT FOUND');

    const addedJournal = (appData.journal || []).find(j => j.activity.toLowerCase().includes('tarun'));
    console.log('Added schedule block:', addedJournal ? { activity: addedJournal.activity, date: addedJournal.date, time: addedJournal.startTime } : 'NOT FOUND');

    const todayISO = new Date().toISOString().split('T')[0];
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    const tomISO = tom.toISOString().split('T')[0];

    // Check today's schedule rendering
    window.selectScheduleDate(todayISO);
    const timelineEl = window.document.getElementById('scheduleTimelineList');
    console.log('Today (' + todayISO + ') schedule contains Tarun?:', timelineEl ? timelineEl.innerHTML.includes('Tarun') : false);

    // Check tomorrow's schedule rendering
    window.selectScheduleDate(tomISO);
    console.log('Tomorrow (' + tomISO + ') schedule contains Tarun?:', timelineEl ? timelineEl.innerHTML.includes('Tarun') : false);

    // Check activeTab (should NOT be focus)
    console.log('Active tab:', window.activeTab);

    // Check Habit Shield
    window.switchTab('screentime');
    console.log('Switched to Habit Shield, active tab:', window.activeTab);
    const shieldSection = window.document.getElementById('tab-screentime');
    console.log('Habit Shield hidden?:', shieldSection ? shieldSection.classList.contains('hidden') : 'not found');

    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}, 1000);
