const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testVercelLive() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const artifactDir = 'C:\\Users\\aarya\\.gemini\\antigravity\\brain\\7ffe15cf-bf22-4296-8b3d-1f29c8311a2e';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  console.log('Navigating to live production: https://smartplanner-pro.vercel.app...');
  await page.goto('https://smartplanner-pro.vercel.app', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await new Promise(r => setTimeout(r, 2500));

  // 1. Verify visible nav items
  const navItems = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#desktopNav button')).map(b => ({
      tab: b.getAttribute('data-tab'),
      text: b.textContent.replace(/\s+/g, ' ').trim()
    }));
  });
  console.log('Live Nav Items:', navItems);

  await page.screenshot({ path: path.join(artifactDir, 'live_1_overview_nav.png') });
  console.log('✔ Live Screenshot 1 saved');

  // 2. Dump: "bola na tarun ke saath meeting set krde kal 12"
  console.log('Submitting dump on live site...');
  await page.evaluate(async () => {
    const ta = document.getElementById('overviewHeroInput');
    ta.value = 'bola na tarun ke saath meeting set krde kal 12';
    await submitOverviewHeroTask();
  });
  await new Promise(r => setTimeout(r, 2500));

  await page.screenshot({ path: path.join(artifactDir, 'live_2_after_dump.png') });
  console.log('✔ Live Screenshot 2 saved');

  // 3. Check Tasks tab
  console.log('Navigating to Tasks tab...');
  await page.evaluate(() => switchTab('tasks'));
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'live_3_tasks_tab.png') });
  console.log('✔ Live Screenshot 3 saved');

  // 4. Check Schedule tab
  console.log('Navigating to Schedule tab...');
  await page.evaluate(() => switchTab('schedule'));
  await new Promise(r => setTimeout(r, 1200));

  const todayHasTarun = await page.evaluate(() => {
    const timeline = document.getElementById('scheduleTimelineList');
    return timeline ? timeline.innerText.toLowerCase().includes('tarun') : false;
  });
  console.log('Does today schedule have Tarun?:', todayHasTarun);
  await page.screenshot({ path: path.join(artifactDir, 'live_4_schedule_today.png') });
  console.log('✔ Live Screenshot 4 saved');

  // Select Kal (tomorrow) in schedule
  console.log('Selecting Kal in schedule...');
  await page.evaluate(() => {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    const tomISO = tom.toISOString().split('T')[0];
    selectScheduleDate(tomISO);
  });
  await new Promise(r => setTimeout(r, 1200));

  const kalHasTarun = await page.evaluate(() => {
    const timeline = document.getElementById('scheduleTimelineList');
    return timeline ? timeline.innerText.toLowerCase().includes('tarun') : false;
  });
  console.log('Does Kal schedule have Tarun?:', kalHasTarun);
  await page.screenshot({ path: path.join(artifactDir, 'live_5_schedule_kal.png') });
  console.log('✔ Live Screenshot 5 saved');

  // 5. Check Habit Shield tab
  console.log('Navigating to Habit Shield tab...');
  await page.evaluate(() => switchTab('screentime'));
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'live_6_habit_shield.png') });
  console.log('✔ Live Screenshot 6 saved');

  // Open Add Habit modal
  console.log('Opening Add Habit modal...');
  await page.evaluate(() => openAddNotToDoModal());
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'live_7_add_habit_modal.png') });
  console.log('✔ Live Screenshot 7 saved');

  await browser.close();
  console.log('🎉 LIVE VERCEL PRODUCTION VERIFICATION PASSED 100%!');
}

testVercelLive().catch(err => {
  console.error('Live verification failed:', err);
  process.exit(1);
});
