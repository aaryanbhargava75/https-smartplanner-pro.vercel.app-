const fs = require('fs');

let html = fs.readFileSync('smart-planner-ai.html', 'utf8');

// 1. Remove timer button from createTaskCardEl
const btnRegex = /<button type="button" onclick="event\.stopPropagation\(\);\s*launchFocusHub\('[^']*',\s*'[^']*'\)"[\s\S]*?<\/button>/g;
if (btnRegex.test(html)) {
  html = html.replace(btnRegex, '');
  console.log('✔ Removed launchFocusHub timer buttons via regex');
} else {
  console.log('✖ Could not match launchFocusHub button regex');
}

// 2. Add selectScheduleDate and update renderScheduleCalendar
const oldRenderCalendarStart = `      function renderScheduleCalendar() {
        const grid = document.getElementById('scheduleTimelineGrid');
        if (!grid) return;

        const journal = appData.journal || [];
        const now = new Date();
        const currentMin = now.getHours() * 60 + now.getMinutes();

        const stripEl = document.getElementById('calendarWeekStrip');
        if (stripEl) {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          let stripHtml = '';
          for (let i = -3; i <= 3; i++) {
            const d = new Date(now);
            d.setDate(now.getDate() + i);
            const isToday = i === 0;
            stripHtml += \`
            <div class="flex flex-col items-center py-1.5 rounded-xl cursor-pointer transition-all \${isToday ? 'bg-[#d2f84a] text-[#0c1511] font-bold shadow-sm' : 'hover:bg-[var(--df-card-inner)] text-[var(--df-text-muted)]'}">
              <span class="text-[10px] uppercase">\${days[d.getDay()]}</span>
              <span class="text-xs font-bold">\${d.getDate()}</span>
            </div>
          \`;
          }
          stripEl.innerHTML = stripHtml;
        }`;

const newRenderCalendarStart = `      window.currentScheduleDate = window.currentScheduleDate || new Date().toISOString().split('T')[0];

      function selectScheduleDate(dateISO) {
        window.currentScheduleDate = dateISO;
        renderScheduleCalendar();
        renderSchedule();
        renderScheduleClock();
      }
      window.selectScheduleDate = selectScheduleDate;

      function renderScheduleCalendar() {
        const grid = document.getElementById('scheduleTimelineGrid');
        if (!grid) return;

        const todayISO = new Date().toISOString().split('T')[0];
        const activeDate = window.currentScheduleDate || todayISO;
        const allJournal = appData.journal || [];
        const journal = allJournal.filter(j => (j.date || todayISO) === activeDate);
        const now = new Date();
        const currentMin = now.getHours() * 60 + now.getMinutes();

        const stripEl = document.getElementById('calendarWeekStrip');
        if (stripEl) {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          let stripHtml = '';
          for (let i = -3; i <= 3; i++) {
            const d = new Date(now);
            d.setDate(now.getDate() + i);
            const dISO = d.toISOString().split('T')[0];
            const isSelected = dISO === activeDate;
            const isRealToday = i === 0;
            stripHtml += \`
            <div onclick="selectScheduleDate('\${dISO}')" class="flex flex-col items-center py-1.5 rounded-xl cursor-pointer transition-all \${isSelected ? 'bg-[#d2f84a] text-[#0c1511] font-bold shadow-sm ring-1 ring-[#d2f84a]' : 'hover:bg-[var(--df-card-inner)] text-[var(--df-text-muted)]'}">
              <span class="text-[10px] uppercase font-bold">\${isRealToday ? 'Aaj' : days[d.getDay()]}</span>
              <span class="text-xs font-bold">\${d.getDate()}</span>
            </div>
          \`;
          }
          stripEl.innerHTML = stripHtml;
        }`;

if (html.includes(oldRenderCalendarStart)) {
  html = html.replace(oldRenderCalendarStart, newRenderCalendarStart);
  console.log('✔ Updated renderScheduleCalendar with date filtering and clickable date strip');
} else {
  console.log('✖ Could not find oldRenderCalendarStart');
}

// 3. Update renderScheduleClock
const oldRenderClockStart = `      function renderScheduleClock() {
        const svg = document.getElementById('scheduleClockSvg');
        if (!svg) return;

        const journal = appData.journal || [];`;

const newRenderClockStart = `      function renderScheduleClock() {
        const svg = document.getElementById('scheduleClockSvg');
        if (!svg) return;

        const todayISO = new Date().toISOString().split('T')[0];
        const activeDate = window.currentScheduleDate || todayISO;
        const journal = (appData.journal || []).filter(j => (j.date || todayISO) === activeDate);`;

if (html.includes(oldRenderClockStart)) {
  html = html.replace(oldRenderClockStart, newRenderClockStart);
  console.log('✔ Updated renderScheduleClock with active date filter');
} else {
  console.log('✖ Could not find oldRenderClockStart');
}

// 4. Update renderSchedule
const oldRenderScheduleStart = `      function renderSchedule() {
        const timelineContainer = document.getElementById('scheduleTimelineList');
        if (!timelineContainer) return;
        timelineContainer.innerHTML = '';

        const journal = appData.journal || [];
        const totalMins = journal.reduce((acc, j) => acc + (typeof getBlockDuration === 'function' ? getBlockDuration(j) : 60), 0);
        const hrs = Math.max(1, Math.round(totalMins / 60));

        const subEl = document.getElementById('scheduleBlocksSubtitle');
        if (subEl) subEl.textContent = \`\${journal.length} blocks · \${hrs}h planned\`;

        const navBadge = document.getElementById('scheduleNavBadge');
        if (navBadge) navBadge.textContent = journal.length > 0 ? journal.length : '';

        if (journal.length === 0) {
          timelineContainer.innerHTML = \`
          <div class="bg-[var(--df-card)] rounded-2xl p-12 border border-[var(--df-border)] flex flex-col items-center justify-center text-center gap-2">
            <p class="text-sm text-[var(--df-text-muted)]">Is din kuch planned nahi. Likho "10 se 12 coding, 4 baje call".</p>
            <button onclick="switchTab('overview')" class="text-xs font-semibold text-[#a4d03b] hover:underline cursor-pointer">Dump karo →</button>
          </div>
        \`;
          return;
        }`;

const newRenderScheduleStart = `      function renderSchedule() {
        const timelineContainer = document.getElementById('scheduleTimelineList');
        if (!timelineContainer) return;
        timelineContainer.innerHTML = '';

        const todayISO = new Date().toISOString().split('T')[0];
        const tom = new Date();
        tom.setDate(tom.getDate() + 1);
        const tomISO = tom.toISOString().split('T')[0];
        const activeDate = window.currentScheduleDate || todayISO;

        const allJournal = appData.journal || [];
        const journal = allJournal.filter(j => (j.date || todayISO) === activeDate);

        const totalMins = journal.reduce((acc, j) => acc + (typeof getBlockDuration === 'function' ? getBlockDuration(j) : 60), 0);
        const hrs = Math.max(1, Math.round(totalMins / 60));
        const dateLabel = activeDate === todayISO ? 'Aaj (Today)' : activeDate === tomISO ? 'Kal (Tomorrow)' : activeDate;

        const subEl = document.getElementById('scheduleBlocksSubtitle');
        if (subEl) subEl.textContent = \`\${dateLabel} · \${journal.length} blocks · \${hrs}h planned\`;

        const navBadge = document.getElementById('scheduleNavBadge');
        if (navBadge) navBadge.textContent = journal.length > 0 ? journal.length : '';

        if (journal.length === 0) {
          timelineContainer.innerHTML = \`
          <div class="bg-[var(--df-card)] rounded-2xl p-12 border border-[var(--df-border)] flex flex-col items-center justify-center text-center gap-2">
            <p class="text-sm text-[var(--df-text-muted)]">\${dateLabel} ke liye kuch planned nahi. Likho "10 se 12 coding, 4 baje call".</p>
            \${activeDate !== todayISO ? \`<button onclick="selectScheduleDate('\${todayISO}')" class="text-xs font-semibold text-[#a4d03b] hover:underline cursor-pointer">← Aaj ka schedule dekho</button>\` : \`<button onclick="switchTab('overview')" class="text-xs font-semibold text-[#a4d03b] hover:underline cursor-pointer">Dump karo →</button>\`}
          </div>
        \`;
          return;
        }`;

if (html.includes(oldRenderScheduleStart)) {
  html = html.replace(oldRenderScheduleStart, newRenderScheduleStart);
  console.log('✔ Updated renderSchedule with active date filter and navigation button');
} else {
  console.log('✖ Could not find oldRenderScheduleStart');
}

// 5. Update updateBadges to include shieldNavBadge
const oldUpdateBadges = `      // Update Sidebar Badges
      function updateBadges() {
        const totalTasks = (appData.tasks || []).length;
        const tasksBadge = document.getElementById('tasksCountBadge');
        if (tasksBadge) tasksBadge.textContent = totalTasks;`;

const newUpdateBadges = `      // Update Sidebar Badges
      function updateBadges() {
        const totalTasks = (appData.tasks || []).length;
        const tasksBadge = document.getElementById('tasksCountBadge');
        if (tasksBadge) tasksBadge.textContent = totalTasks;

        const shieldBadge = document.getElementById('shieldNavBadge');
        if (shieldBadge) {
          const habits = appData.notToDoList || [];
          shieldBadge.textContent = habits.length > 0 ? habits.length : '';
        }`;

if (html.includes(oldUpdateBadges)) {
  html = html.replace(oldUpdateBadges, newUpdateBadges);
  console.log('✔ Updated updateBadges with shieldNavBadge');
} else {
  console.log('✖ Could not find oldUpdateBadges');
}

fs.writeFileSync('smart-planner-ai.html', html, 'utf8');
console.log('Done test patch 3');
