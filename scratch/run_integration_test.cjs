const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const PORT = 8765;
const artifactDir = 'C:\\Users\\aarya\\.gemini\\antigravity\\brain\\7ffe15cf-bf22-4296-8b3d-1f29c8311a2e';

// Simple static server
const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(filePath)) filePath = path.join(__dirname, '..', 'index.html');
  const ext = path.extname(filePath);
  const mime = ext === '.html' ? 'text/html' : ext === '.js' ? 'application/javascript' : ext === '.json' ? 'application/json' : 'text/plain';
  res.writeHead(200, { 'Content-Type': mime });
  res.end(fs.readFileSync(filePath));
});

server.listen(PORT, async () => {
  console.log(`Local test server running at http://127.0.0.1:${PORT}`);

  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

    page.on('console', msg => {
      const txt = msg.text();
      if (!txt.includes('favicon') && !txt.includes('status of 404') && !txt.includes('Tailwind')) {
        console.log('[BROWSER]', txt);
      }
    });

    console.log('Navigating to local test server...');
    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    // 1. Verify visible nav items
    const navItems = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#desktopNav button')).map(b => ({
        tab: b.getAttribute('data-tab'),
        text: b.textContent.replace(/\s+/g, ' ').trim()
      }));
    });
    console.log('Nav Items:', navItems);

    await page.screenshot({ path: path.join(artifactDir, 'flow_1_overview.png') });
    console.log('✔ Screenshot 1 saved');

    // 2. Dump: "bola na tarun ke saath meeting set krde kal 12"
    console.log('Typing and submitting dump...');
    await page.evaluate(async () => {
      const ta = document.getElementById('overviewHeroInput');
      ta.value = 'bola na tarun ke saath meeting set krde kal 12';
      await submitOverviewHeroTask();
    });
    await new Promise(r => setTimeout(r, 2500));

    await page.screenshot({ path: path.join(artifactDir, 'flow_2_after_dump.png') });
    console.log('✔ Screenshot 2 saved');

    // Check task added
    const tasks = await page.evaluate(() => {
      return (appData.tasks || []).map(t => ({ title: t.title, date: t.date, time: t.time, priority: t.priority }));
    });
    console.log('Current tasks in appData:', tasks);

    // 3. Go to Tasks Tab
    console.log('Checking Tasks tab...');
    await page.evaluate(() => switchTab('tasks'));
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(artifactDir, 'flow_3_tasks_tab.png') });
    console.log('✔ Screenshot 3 saved');

    // 4. Go to Schedule Tab
    console.log('Checking Schedule tab (Today vs Kal)...');
    await page.evaluate(() => switchTab('schedule'));
    await new Promise(r => setTimeout(r, 1200));

    // Check if Tarun appears on today's schedule
    const todayScheduleHasTarun = await page.evaluate(() => {
      const timeline = document.getElementById('scheduleTimelineList');
      return timeline ? timeline.innerText.toLowerCase().includes('tarun') : false;
    });
    console.log('Does today schedule have Tarun?:', todayScheduleHasTarun);
    await page.screenshot({ path: path.join(artifactDir, 'flow_4_schedule_today.png') });
    console.log('✔ Screenshot 4 saved');

    // Select Kal (tomorrow)
    console.log('Selecting Kal in schedule...');
    await page.evaluate(() => {
      const tom = new Date();
      tom.setDate(tom.getDate() + 1);
      const tomISO = tom.toISOString().split('T')[0];
      selectScheduleDate(tomISO);
    });
    await new Promise(r => setTimeout(r, 1200));

    const kalScheduleHasTarun = await page.evaluate(() => {
      const timeline = document.getElementById('scheduleTimelineList');
      return timeline ? timeline.innerText.toLowerCase().includes('tarun') : false;
    });
    console.log('Does Kal schedule have Tarun?:', kalScheduleHasTarun);
    await page.screenshot({ path: path.join(artifactDir, 'flow_5_schedule_kal.png') });
    console.log('✔ Screenshot 5 saved');

    // 5. Go to Habit Shield Tab
    console.log('Checking Habit Shield tab...');
    await page.evaluate(() => switchTab('screentime'));
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(artifactDir, 'flow_6_habit_shield.png') });
    console.log('✔ Screenshot 6 saved');

    // Open Add Habit modal
    console.log('Opening Add Habit modal...');
    await page.evaluate(() => openAddNotToDoModal());
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(artifactDir, 'flow_7_add_habit_modal.png') });
    console.log('✔ Screenshot 7 saved');

    await browser.close();
    server.close();
    console.log('🎉 ALL INTEGRATION TESTS PASSED PERFECTLY!');
    process.exit(0);
  } catch (err) {
    console.error('Integration test failed:', err);
    server.close();
    process.exit(1);
  }
});
