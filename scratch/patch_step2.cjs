const fs = require('fs');

let html = fs.readFileSync('smart-planner-ai.html', 'utf8');

// 1. UPDATE switchTab TO REDIRECT REMOVED HUBS AND SUPPORT HABIT SHIELD
const oldSwitchTabStart = `      function switchTab(tabName) {
        if (tabName === 'paisa') tabName = 'expenses';
        if (tabName === 'khana') tabName = 'nutrition';`;

const newSwitchTabStart = `      function switchTab(tabName) {
        if (tabName === 'paisa') tabName = 'expenses';
        if (tabName === 'khana') tabName = 'nutrition';
        if (tabName === 'shield' || tabName === 'habits' || tabName === 'habit-shield') tabName = 'screentime';
        // Safeguard: Redirect any removed hubs to core tabs
        if (['focus', 'wealth', 'analytics', 'dump'].includes(tabName)) {
          tabName = 'tasks';
        }`;

if (html.includes(oldSwitchTabStart)) {
  html = html.replace(oldSwitchTabStart, newSwitchTabStart);
  console.log('✔ Updated switchTab with safety redirects');
} else {
  console.log('✖ Could not find oldSwitchTabStart');
}

// 2. REMOVE LAUNCH FOCUS HUB BUTTON FROM TASK CARDS
const oldCardTimerBtn = `<button type="button" onclick="event.stopPropagation(); launchFocusHub('\${safeTitle}', '\${task.id}')" class="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--df-text-muted)] hover:text-[#5b7cfa] hover:bg-[var(--df-card)] transition-colors cursor-pointer" title="Focus 25m Timer">
            <span class="material-symbols-outlined text-[16px]">timer</span>
          </button>`;

if (html.includes(oldCardTimerBtn)) {
  html = html.replace(oldCardTimerBtn, '');
  console.log('✔ Removed launchFocusHub timer button from task cards');
} else {
  console.log('✖ Could not find oldCardTimerBtn');
}

// Disable launchFocusHub so even if called anywhere, it does not open focus station or start timer
const oldLaunchFocusHub = `      function launchFocusHub(taskTitle, taskId) {
        if (taskId) {
          activePomodoroTaskId = taskId;
          const matched = (appData.tasks || []).find(t => t.id === taskId);
          if (matched) activePomodoroTask = matched.title;
        } else if (taskTitle) {
          activePomodoroTask = taskTitle;
          const matched = (appData.tasks || []).find(t => t.title.toLowerCase() === taskTitle.toLowerCase());
          if (matched) activePomodoroTaskId = matched.id;
        }

        populateTaskDropdowns();

        if (activePomodoroTaskId) {
          const headerSelect = document.getElementById('headerTaskSelect');
          const heroSelect = document.getElementById('heroTaskSelect');
          const hubSelect = document.getElementById('focusHubTaskSelect');
          if (headerSelect) headerSelect.value = activePomodoroTaskId;
          if (heroSelect) heroSelect.value = activePomodoroTaskId;
          if (hubSelect) hubSelect.value = activePomodoroTaskId;
        }

        const hubTitle = document.getElementById('focusHubTaskTitle');
        if (hubTitle) hubTitle.textContent = activePomodoroTask;
        const currentTaskTag = document.getElementById('focusCurrentTaskTag');
        if (currentTaskTag) currentTaskTag.textContent = activePomodoroTask;

        timerSeconds = 25 * 60;
        initialTimerSeconds = 25 * 60;
        updateTimerDisplay();

        // Seamlessly switch to the dedicated Focus Timer page
        switchTab('focus');

        // Start the timer
        if (!isTimerRunning) {
          toggleGlobalTimer();
        }

        showToast(\`Focus session started for "\${activePomodoroTask}"\`);
      }`;

const newLaunchFocusHub = `      function launchFocusHub(taskTitle, taskId) {
        if (taskTitle) showToast(\`Task: \${taskTitle}\`);
      }`;

if (html.includes(oldLaunchFocusHub)) {
  html = html.replace(oldLaunchFocusHub, newLaunchFocusHub);
  console.log('✔ Disabled launchFocusHub implementation');
} else {
  console.log('✖ Could not find oldLaunchFocusHub');
}

// Also neutralize startBlockFocus
const oldStartBlockFocus = `      function startBlockFocus(title) {
        activePomodoroTask = title;
        switchTab('focus');
        showToast(\`Focus session set to: \${title}\`);
      }`;

const newStartBlockFocus = `      function startBlockFocus(title) {
        showToast(\`Schedule block: \${title}\`);
      }`;

if (html.includes(oldStartBlockFocus)) {
  html = html.replace(oldStartBlockFocus, newStartBlockFocus);
  console.log('✔ Neutralized startBlockFocus');
} else {
  console.log('✖ Could not find oldStartBlockFocus');
}

// 3. IMPROVE formatCompactTaskDate TO CLEARLY HIGHLIGHT TODAY VS TOMORROW
const oldFormatCompactTaskDate = `      function formatCompactTaskDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        if (isNaN(d.getTime())) return dateStr;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return \`\${d.getDate()} \${months[d.getMonth()]}\`;
      }`;

const newFormatCompactTaskDate = `      function formatCompactTaskDate(dateStr) {
        if (!dateStr) return '';
        const todayISO = new Date().toISOString().split('T')[0];
        const tom = new Date();
        tom.setDate(tom.getDate() + 1);
        const tomISO = tom.toISOString().split('T')[0];

        if (dateStr === todayISO) return 'Today';
        if (dateStr === tomISO) return 'Kal (Tomorrow)';

        const d = new Date(dateStr + 'T00:00:00');
        if (isNaN(d.getTime())) return dateStr;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return \`\${d.getDate()} \${months[d.getMonth()]}\`;
      }`;

if (html.includes(oldFormatCompactTaskDate)) {
  html = html.replace(oldFormatCompactTaskDate, newFormatCompactTaskDate);
  console.log('✔ Updated formatCompactTaskDate with Kal (Tomorrow)');
} else {
  console.log('✖ Could not find oldFormatCompactTaskDate');
}

// 4. FIX applyParsedData:
// - Prevent timerAction auto-start
// - Store date on journal block for timed tasks so tomorrow's tasks don't spill into today
const oldTimerActionBlock = `      function applyParsedData(data, rawInputText = '') {
        if (data.timerAction && data.timerAction.start) {
          const mins = Number(data.timerAction.durationMinutes) || 25;
          if (data.timerAction.task) activePomodoroTask = data.timerAction.task;
          setTimerPreset(mins);
          showToast(\`⏳ \${mins}-minute Focus Timer started!\`);
        }`;

const newTimerActionBlock = `      function applyParsedData(data, rawInputText = '') {
        // Disabled timerAction auto-redirect on meeting notes`;

if (html.includes(oldTimerActionBlock)) {
  html = html.replace(oldTimerActionBlock, newTimerActionBlock);
  console.log('✔ Disabled timerAction in applyParsedData');
} else {
  console.log('✖ Could not find oldTimerActionBlock');
}

// Fix journal push in applyParsedData
const oldTimedJournalPush = `            // If task has a specific time, also schedule it in Daily Schedule Timeline
            if (t.time && typeof t.time === 'string' && t.time.includes(':')) {
              if (!appData.journal) appData.journal = [];
              const [th, tm] = t.time.split(':').map(Number);
              const dur = Number(t.durationMinutes || t.duration) || 30;
              const endMins = (th * 60 + (tm || 0) + dur) % 1440;
              const endTimeStr = minutesToTime(endMins);
              const existsInJournal = appData.journal.some(j => j.activity.toLowerCase() === cleanTitle.toLowerCase() && j.startTime === t.time);
              if (!existsInJournal) {
                appData.journal.unshift({
                  id: 'j_' + Math.random().toString(36).substr(2, 9),
                  activity: cleanTitle,
                  startTime: t.time,
                  endTime: endTimeStr,
                  duration: dur,
                  category: t.category === 'Work' ? 'Meetings & Calls' : (t.category || 'General'),
                  mood: '⚡ Productive',
                  notes: 'Scheduled from voice/brain dump'
                });
              }
            }`;

const newTimedJournalPush = `            // If task has a specific time, schedule it in Daily Schedule Timeline for its specific date
            if (t.time && typeof t.time === 'string' && t.time.includes(':')) {
              if (!appData.journal) appData.journal = [];
              const [th, tm] = t.time.split(':').map(Number);
              const dur = Number(t.durationMinutes || t.duration) || 30;
              const endMins = (th * 60 + (tm || 0) + dur) % 1440;
              const endTimeStr = minutesToTime(endMins);
              const taskDate = t.date || new Date().toISOString().split('T')[0];
              const existsInJournal = appData.journal.some(j => j.activity.toLowerCase() === cleanTitle.toLowerCase() && j.startTime === t.time && (j.date || todayISO) === taskDate);
              if (!existsInJournal) {
                appData.journal.unshift({
                  id: 'j_' + Math.random().toString(36).substr(2, 9),
                  activity: cleanTitle,
                  startTime: t.time,
                  endTime: endTimeStr,
                  duration: dur,
                  date: taskDate,
                  category: t.category === 'Work' ? 'Meetings & Calls' : (t.category || 'General'),
                  mood: '⚡ Productive',
                  notes: 'Scheduled from voice/brain dump'
                });
              }
            }`;

if (html.includes(oldTimedJournalPush)) {
  html = html.replace(oldTimedJournalPush, newTimedJournalPush);
  console.log('✔ Fixed timed task journal push in applyParsedData to save date');
} else {
  console.log('✖ Could not find oldTimedJournalPush');
}

// 5. FIX renderOverview UP-NEXT SCHEDULE
// Filter by (j.date || todayISO) === todayISO
const oldUpNextFilter = `        // 6. Up next schedule card
        const upNextEl = document.getElementById('overviewUpNextList');
        if (upNextEl) {
          const schedule = (appData.journal || []).filter(j => j.startTime);`;

const newUpNextFilter = `        // 6. Up next schedule card (STRICTLY TODAY'S SCHEDULE)
        const upNextEl = document.getElementById('overviewUpNextList');
        if (upNextEl) {
          const schedule = (appData.journal || []).filter(j => j.startTime && (j.date || todayISO) === todayISO);`;

if (html.includes(oldUpNextFilter)) {
  html = html.replace(oldUpNextFilter, newUpNextFilter);
  console.log('✔ Fixed up-next filter in renderOverview to strictly show today');
} else {
  console.log('✖ Could not find oldUpNextFilter');
}

fs.writeFileSync('smart-planner-ai.html', html, 'utf8');
console.log('Done test patch 2');
