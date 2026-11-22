const fs = require('fs');

let html = fs.readFileSync('smart-planner-ai.html', 'utf8');

// 1. Update HTML in tab-schedule
const oldScheduleNavHtml = `          <div
            class="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--df-card)] border border-[var(--df-border)] text-xs text-[var(--df-text)]">
            <button type="button" onclick="changeScheduleDay(-1)"
              class="hover:text-white px-1 cursor-pointer">‹</button>
            <span id="scheduleDayLabel" class="font-medium px-2">Aaj</span>
            <button type="button" onclick="changeScheduleDay(1)" class="hover:text-white px-1 cursor-pointer">›</button>
          </div>`;

const newScheduleNavHtml = `          <div
            class="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--df-card)] border border-[var(--df-border)] text-xs text-[var(--df-text)] select-none">
            <button type="button" onclick="changeScheduleDay(-1)" title="Pichla din"
              class="hover:text-white px-1.5 py-0.5 cursor-pointer rounded hover:bg-white/[0.08] transition-colors">‹</button>
            <span id="scheduleDayLabel" onclick="selectScheduleDate(new Date().toISOString().split('T')[0])"
              class="font-medium px-2 cursor-pointer hover:text-[#a4d03b] transition-colors select-none"
              title="Click karke Aaj pe jao">Aaj</span>
            <button type="button" onclick="changeScheduleDay(1)" title="Agla din (Kal)"
              class="hover:text-white px-1.5 py-0.5 cursor-pointer rounded hover:bg-white/[0.08] transition-colors">›</button>
          </div>`;

if (html.includes(oldScheduleNavHtml)) {
  html = html.replace(oldScheduleNavHtml, newScheduleNavHtml);
  console.log('✔ Updated tab-schedule header navigation HTML');
} else {
  console.log('✖ Could not find oldScheduleNavHtml');
}

// 2. Remove dummy functions from `if (document.readyState === 'loading') {`
const oldLoadingBlock = `      if (document.readyState === 'loading') {

        function changeScheduleDay(delta) {
          showToast(delta < 0 ? 'Kal ka schedule' : 'Agle din ka schedule');
        }
        function changeKhanaDay(delta) {
          showToast(delta < 0 ? 'Kal ka khana' : 'Agle din ka khana');
        }
        function openAddMealModal() {
          const dish = prompt('Khana / Dish ka naam kya hai? (e.g. 2 anda aur poha, 1 cup chai)');
          if (!dish || !dish.trim()) return;
          const cal = parseInt(prompt('Approximate calories (kcal)?', '250')) || 200;
          const prot = parseInt(prompt('Approximate protein (grams)?', '10')) || 8;
          const type = prompt('Meal Type (Breakfast / Lunch / Snack / Dinner)?', 'Lunch') || 'Lunch';
          if (!appData.nutrition) appData.nutrition = { meals: [] };
          if (!Array.isArray(appData.nutrition.meals)) appData.nutrition.meals = [];
          appData.nutrition.meals.push({
            id: 'meal_' + Date.now().toString(36),
            date: new Date().toISOString(),
            dish: dish.trim(),
            mealType: type.trim(),
            calories: cal,
            protein: prot
          });
          saveData();
          renderNutrition();
          showToast('Khana log ho gaya!');
        }`;

const newLoadingBlock = `      function openAddMealModal() {
        const dish = prompt('Khana / Dish ka naam kya hai? (e.g. 2 anda aur poha, 1 cup chai)');
        if (!dish || !dish.trim()) return;
        const cal = parseInt(prompt('Approximate calories (kcal)?', '250')) || 200;
        const prot = parseInt(prompt('Approximate protein (grams)?', '10')) || 8;
        const type = prompt('Meal Type (Breakfast / Lunch / Snack / Dinner)?', 'Lunch') || 'Lunch';
        if (!appData.nutrition) appData.nutrition = { meals: [] };
        if (!Array.isArray(appData.nutrition.meals)) appData.nutrition.meals = [];
        appData.nutrition.meals.push({
          id: 'meal_' + Date.now().toString(36),
          date: new Date().toISOString(),
          dish: dish.trim(),
          mealType: type.trim(),
          calories: cal,
          protein: prot
        });
        saveData();
        renderNutrition();
        showToast('Khana log ho gaya!');
      }

      if (document.readyState === 'loading') {`;

if (html.includes(oldLoadingBlock)) {
  html = html.replace(oldLoadingBlock, newLoadingBlock);
  console.log('✔ Cleaned up loading block');
} else {
  console.log('✖ Could not find oldLoadingBlock');
}

// 3. Define robust Date Navigation functions globally
const oldSelectScheduleDateBlock = `      window.currentScheduleDate = window.currentScheduleDate || new Date().toISOString().split('T')[0];

      function selectScheduleDate(dateISO) {
        window.currentScheduleDate = dateISO;
        renderScheduleCalendar();
        renderSchedule();
        renderScheduleClock();
      }
      window.selectScheduleDate = selectScheduleDate;`;

const newDateNavBlock = `      window.currentScheduleDate = window.currentScheduleDate || new Date().toISOString().split('T')[0];
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

if (html.includes(oldSelectScheduleDateBlock)) {
  html = html.replace(oldSelectScheduleDateBlock, newDateNavBlock);
  console.log('✔ Installed robust Date Navigation functions');
} else {
  console.log('✖ Could not find oldSelectScheduleDateBlock');
}

// 4. In renderSchedule(), call updateScheduleDateUI()
const oldRenderScheduleTop = `      function renderSchedule() {
        const timelineContainer = document.getElementById('scheduleTimelineList');
        if (!timelineContainer) return;
        timelineContainer.innerHTML = '';`;

const newRenderScheduleTop = `      function renderSchedule() {
        if (typeof updateScheduleDateUI === 'function') updateScheduleDateUI();
        const timelineContainer = document.getElementById('scheduleTimelineList');
        if (!timelineContainer) return;
        timelineContainer.innerHTML = '';`;

if (html.includes(oldRenderScheduleTop)) {
  html = html.replace(oldRenderScheduleTop, newRenderScheduleTop);
  console.log('✔ Wired updateScheduleDateUI into renderSchedule');
} else {
  console.log('✖ Could not find oldRenderScheduleTop');
}

// 5. In renderNutrition(), call updateKhanaDateUI() and filter by currentKhanaDate
const oldRenderNutritionTop = `      function renderNutrition() {
        const container = document.getElementById('khanaMealsContainer');
        const subtitleEl = document.getElementById('khanaSummarySubtitle');
        if (!container) return;
        container.innerHTML = '';

        const meals = Array.isArray(appData.nutrition?.meals) ? appData.nutrition.meals : [];`;

const newRenderNutritionTop = `      function renderNutrition() {
        if (typeof updateKhanaDateUI === 'function') updateKhanaDateUI();
        const container = document.getElementById('khanaMealsContainer');
        const subtitleEl = document.getElementById('khanaSummarySubtitle');
        if (!container) return;
        container.innerHTML = '';

        const todayISO = new Date().toISOString().split('T')[0];
        const activeDate = window.currentKhanaDate || todayISO;
        const allMeals = Array.isArray(appData.nutrition?.meals) ? appData.nutrition.meals : [];
        const meals = allMeals.filter(m => (m.date || todayISO).slice(0, 10) === activeDate);`;

if (html.includes(oldRenderNutritionTop)) {
  html = html.replace(oldRenderNutritionTop, newRenderNutritionTop);
  console.log('✔ Wired updateKhanaDateUI and date filter into renderNutrition');
} else {
  console.log('✖ Could not find oldRenderNutritionTop');
}

fs.writeFileSync('smart-planner-ai.html', html, 'utf8');
console.log('Done fix_schedule_nav.cjs');
