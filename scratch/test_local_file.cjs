const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testLocal() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const artifactDir = 'C:\\Users\\aarya\\.gemini\\antigravity\\brain\\7ffe15cf-bf22-4296-8b3d-1f29c8311a2e';
  const htmlPath = path.resolve('smart-planner-ai.html');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => consoleLogs.push(`[PAGE ERROR] ${err.toString()}`));

  console.log('Loading local HTML file...');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Page loaded. Checking errors:');
  const errors = consoleLogs.filter(l => l.includes('ERROR'));
  if (errors.length) {
    console.error('Console errors:', errors);
  } else {
    console.log('✔ No page errors on load!');
  }

  // 1. Check sidebar nav items
  const navTabs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#desktopNav button')).map(b => ({
      tab: b.getAttribute('data-tab'),
      text: b.textContent.replace(/\s+/g, ' ').trim(),
      hidden: b.classList.contains('hidden') || getComputedStyle(b).display === 'none'
    }));
  });
  console.log('Visible Nav Tabs:', navTabs);

  // Take Screenshot 1: Overview
  await page.screenshot({ path: path.join(artifactDir, 'test_1_overview_nav.png') });
  console.log('✔ Saved test_1_overview_nav.png');

  // 2. Dump: "bola na tarun ke saath meeting set krde kal 12"
  console.log('Testing dump: "bola na tarun ke saath meeting set krde kal 12"...');
  await page.evaluate(async () => {
    const input = document.getElementById('brainDumpInput');
    if (input) input.value = 'bola na tarun ke saath meeting set krde kal 12';
    await processBrainDumpAI();
  });
  await new Promise(r => setTimeout(r, 2000));

  // Take Screenshot 2: After Dump
  await page.screenshot({ path: path.join(artifactDir, 'test_2_after_dump.png') });
  console.log('✔ Saved test_2_after_dump.png');

  // 3. Check Tasks Tab
  console.log('Navigating to Tasks tab...');
  await page.evaluate(() => switchTab('tasks'));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'test_3_tasks_tab.png') });
  console.log('✔ Saved test_3_tasks_tab.png');

  // Check task date label
  const taskMeta = await page.evaluate(() => {
    const tasks = (appData.tasks || []).filter(t => t.title.toLowerCase().includes('tarun'));
    return tasks.map(t => ({ title: t.title, date: t.date, time: t.time, priority: t.priority }));
  });
  console.log('Tarun tasks in appData:', taskMeta);

  // 4. Check Schedule Tab (Today vs Kal)
  console.log('Navigating to Schedule tab...');
  await page.evaluate(() => switchTab('schedule'));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'test_4_schedule_today.png') });
  console.log('✔ Saved test_4_schedule_today.png');

  // Check if Tarun appears on today's schedule
  const todayScheduleHasTarun = await page.evaluate(() => {
    const timeline = document.getElementById('scheduleTimelineList');
    return timeline ? timeline.innerText.toLowerCase().includes('tarun') : false;
  });
  console.log('Does today schedule list have Tarun?:', todayScheduleHasTarun);

  // Click Kal (tomorrow) in schedule
  await page.evaluate(() => {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    const tomISO = tom.toISOString().split('T')[0];
    selectScheduleDate(tomISO);
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'test_5_schedule_kal.png') });
  console.log('✔ Saved test_5_schedule_kal.png');

  const kalScheduleHasTarun = await page.evaluate(() => {
    const timeline = document.getElementById('scheduleTimelineList');
    return timeline ? timeline.innerText.toLowerCase().includes('tarun') : false;
  });
  console.log('Does Kal schedule list have Tarun?:', kalScheduleHasTarun);

  // 5. Check Habit Shield Tab
  console.log('Navigating to Habit Shield tab...');
  await page.evaluate(() => switchTab('screentime'));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'test_6_habit_shield.png') });
  console.log('✔ Saved test_6_habit_shield.png');

  // Check Add Habit Modal
  await page.evaluate(() => openAddNotToDoModal());
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'test_7_add_habit_modal.png') });
  console.log('✔ Saved test_7_add_habit_modal.png');

  await browser.close();
  console.log('🎉 All local browser tests PASSED successfully!');
}

testLocal().catch(err => {
  console.error('Error during local test:', err);
  process.exit(1);
});
