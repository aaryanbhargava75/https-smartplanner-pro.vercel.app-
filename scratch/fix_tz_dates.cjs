const fs = require('fs');

let html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const oldDateNavBlock = `      window.currentScheduleDate = window.currentScheduleDate || new Date().toISOString().split('T')[0];
      window.currentKhanaDate = window.currentKhanaDate || new Date().toISOString().split('T')[0];

      function getScheduleDateDisplayLabel(dateISO) {
        if (!dateISO) return 'Aaj';
        const todayISO = new Date().toISOString().split('T')[0];
        const tom = new Date();
        tom.setDate(tom.getDate() + 1);
        const tomISO = tom.toISOString().split('T')[0];

        const yest = new Date();
        yest.setDate(yest.getDate() - 1);
        const yestISO = yest.toISOString().split('T')[0];

        if (dateISO === todayISO) return 'Aaj';
        if (dateISO === tomISO) return 'Kal';
        if (dateISO === yestISO) return 'Beeta Kal';

        const d = new Date(dateISO + 'T00:00:00');
        if (isNaN(d.getTime())) return dateISO;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return \`\${d.getDate()} \${months[d.getMonth()]}\`;
      }
      window.getScheduleDateDisplayLabel = getScheduleDateDisplayLabel;

      function updateScheduleDateUI() {
        const todayISO = new Date().toISOString().split('T')[0];
        const activeDate = window.currentScheduleDate || todayISO;
        const labelEl = document.getElementById('scheduleDayLabel');
        if (labelEl) {
          labelEl.textContent = getScheduleDateDisplayLabel(activeDate);
          labelEl.title = \`Viewing date: \${activeDate} (Click karke Aaj pe jao)\`;
        }
      }
      window.updateScheduleDateUI = updateScheduleDateUI;

      function selectScheduleDate(dateISO) {
        const todayISO = new Date().toISOString().split('T')[0];
        window.currentScheduleDate = dateISO || todayISO;
        updateScheduleDateUI();
        renderScheduleCalendar();
        renderSchedule();
        renderScheduleClock();
      }
      window.selectScheduleDate = selectScheduleDate;

      function changeScheduleDay(delta) {
        const todayISO = new Date().toISOString().split('T')[0];
        const curDate = window.currentScheduleDate || todayISO;
        const d = new Date(curDate + 'T00:00:00');
        d.setDate(d.getDate() + Number(delta || 0));
        const newDateISO = d.toISOString().split('T')[0];
        selectScheduleDate(newDateISO);
      }
      window.changeScheduleDay = changeScheduleDay;

      function updateKhanaDateUI() {
        const todayISO = new Date().toISOString().split('T')[0];
        const activeDate = window.currentKhanaDate || todayISO;
        const labelEl = document.getElementById('khanaDayLabel');
        if (labelEl) {
          labelEl.textContent = getScheduleDateDisplayLabel(activeDate);
        }
      }
      window.updateKhanaDateUI = updateKhanaDateUI;

      function selectKhanaDate(dateISO) {
        const todayISO = new Date().toISOString().split('T')[0];
        window.currentKhanaDate = dateISO || todayISO;
        updateKhanaDateUI();
        renderNutrition();
      }
      window.selectKhanaDate = selectKhanaDate;

      function changeKhanaDay(delta) {
        const todayISO = new Date().toISOString().split('T')[0];
        const curDate = window.currentKhanaDate || todayISO;
        const d = new Date(curDate + 'T00:00:00');
        d.setDate(d.getDate() + Number(delta || 0));
        const newDateISO = d.toISOString().split('T')[0];
        selectKhanaDate(newDateISO);
      }
      window.changeKhanaDay = changeKhanaDay;`;

const newDateNavBlock = `      function formatLocalDateISO(d) {
        if (!d || isNaN(d.getTime())) return '';
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return \`\${year}-\${month}-\${day}\`;
      }
      window.formatLocalDateISO = formatLocalDateISO;

      function getTodayLocalDateISO() {
        return formatLocalDateISO(new Date());
      }
      window.getTodayLocalDateISO = getTodayLocalDateISO;

      window.currentScheduleDate = window.currentScheduleDate || getTodayLocalDateISO();
      window.currentKhanaDate = window.currentKhanaDate || getTodayLocalDateISO();

      function getScheduleDateDisplayLabel(dateISO) {
        if (!dateISO) return 'Aaj';
        const todayISO = getTodayLocalDateISO();
        const tom = new Date();
        tom.setDate(tom.getDate() + 1);
        const tomISO = formatLocalDateISO(tom);

        const yest = new Date();
        yest.setDate(yest.getDate() - 1);
        const yestISO = formatLocalDateISO(yest);

        if (dateISO === todayISO) return 'Aaj';
        if (dateISO === tomISO) return 'Kal';
        if (dateISO === yestISO) return 'Beeta Kal';

        const d = new Date(dateISO + 'T12:00:00');
        if (isNaN(d.getTime())) return dateISO;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return \`\${d.getDate()} \${months[d.getMonth()]}\`;
      }
      window.getScheduleDateDisplayLabel = getScheduleDateDisplayLabel;

      function updateScheduleDateUI() {
        const todayISO = getTodayLocalDateISO();
        const activeDate = window.currentScheduleDate || todayISO;
        const labelEl = document.getElementById('scheduleDayLabel');
        if (labelEl) {
          labelEl.textContent = getScheduleDateDisplayLabel(activeDate);
          labelEl.title = \`Viewing date: \${activeDate} (Click karke Aaj pe jao)\`;
        }
      }
      window.updateScheduleDateUI = updateScheduleDateUI;

      function selectScheduleDate(dateISO) {
        const todayISO = getTodayLocalDateISO();
        window.currentScheduleDate = dateISO || todayISO;
        updateScheduleDateUI();
        renderScheduleCalendar();
        renderSchedule();
        renderScheduleClock();
      }
      window.selectScheduleDate = selectScheduleDate;

      function changeScheduleDay(delta) {
        const todayISO = getTodayLocalDateISO();
        const curDate = window.currentScheduleDate || todayISO;
        const d = new Date(curDate + 'T12:00:00');
        d.setDate(d.getDate() + Number(delta || 0));
        const newDateISO = formatLocalDateISO(d);
        selectScheduleDate(newDateISO);
      }
      window.changeScheduleDay = changeScheduleDay;

      function updateKhanaDateUI() {
        const todayISO = getTodayLocalDateISO();
        const activeDate = window.currentKhanaDate || todayISO;
        const labelEl = document.getElementById('khanaDayLabel');
        if (labelEl) {
          labelEl.textContent = getScheduleDateDisplayLabel(activeDate);
        }
      }
      window.updateKhanaDateUI = updateKhanaDateUI;

      function selectKhanaDate(dateISO) {
        const todayISO = getTodayLocalDateISO();
        window.currentKhanaDate = dateISO || todayISO;
        updateKhanaDateUI();
        renderNutrition();
      }
      window.selectKhanaDate = selectKhanaDate;

      function changeKhanaDay(delta) {
        const todayISO = getTodayLocalDateISO();
        const curDate = window.currentKhanaDate || todayISO;
        const d = new Date(curDate + 'T12:00:00');
        d.setDate(d.getDate() + Number(delta || 0));
        const newDateISO = formatLocalDateISO(d);
        selectKhanaDate(newDateISO);
      }
      window.changeKhanaDay = changeKhanaDay;`;

if (html.includes(oldDateNavBlock)) {
  html = html.replace(oldDateNavBlock, newDateNavBlock);
  console.log('✔ Replaced with timezone-safe Date Navigation block');
} else {
  console.log('✖ Could not find oldDateNavBlock');
}

fs.writeFileSync('smart-planner-ai.html', html, 'utf8');
console.log('Done fix_tz_dates.cjs');
