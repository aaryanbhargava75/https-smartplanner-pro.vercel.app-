const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const PORT = 8766;
const artifactDir = 'C:\\Users\\aarya\\.gemini\\antigravity\\brain\\7ffe15cf-bf22-4296-8b3d-1f29c8311a2e';

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

    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    // Add a test meeting for Kal to make sure we see it when switching to Kal
    await page.evaluate(() => {
      const tom = new Date();
      tom.setDate(tom.getDate() + 1);
      const tomISO = tom.toISOString().split('T')[0];
      if (!appData.journal) appData.journal = [];
      appData.journal.unshift({
        id: 'j_test_kal',
        activity: 'Meeting with Tarun Kal',
        startTime: '12:00',
        endTime: '13:00',
        duration: 60,
        date: tomISO,
        category: 'Meetings & Calls',
        notes: 'Kal 12 baje'
      });
      saveData();
      switchTab('schedule');
    });
    await new Promise(r => setTimeout(r, 1000));

    // Check initial label on schedule tab
    let label = await page.$eval('#scheduleDayLabel', el => el.textContent.trim());
    console.log('1. Initial Schedule Day Label:', label);
    if (label !== 'Aaj') throw new Error(`Expected 'Aaj', got '${label}'`);

    await page.screenshot({ path: path.join(artifactDir, 'sched_test_1_aaj.png') });

    // Click > (Next Day / Kal)
    console.log('Clicking > (Next Day)...');
    await page.evaluate(() => changeScheduleDay(1));
    await new Promise(r => setTimeout(r, 800));

    label = await page.$eval('#scheduleDayLabel', el => el.textContent.trim());
    console.log('2. After changeScheduleDay(1):', label);
    if (label !== 'Kal') throw new Error(`Expected 'Kal', got '${label}'`);

    const hasKalMeeting = await page.evaluate(() => {
      const el = document.getElementById('scheduleTimelineList');
      return el ? el.innerText.includes('Tarun') : false;
    });
    console.log('Does Kal schedule display the Tarun meeting?:', hasKalMeeting);
    if (!hasKalMeeting) throw new Error('Kal schedule should show the Tarun meeting!');

    await page.screenshot({ path: path.join(artifactDir, 'sched_test_2_kal.png') });

    // Click > again (Day after tomorrow)
    console.log('Clicking > again...');
    await page.evaluate(() => changeScheduleDay(1));
    await new Promise(r => setTimeout(r, 800));

    label = await page.$eval('#scheduleDayLabel', el => el.textContent.trim());
    console.log('3. After another changeScheduleDay(1):', label);

    await page.screenshot({ path: path.join(artifactDir, 'sched_test_3_day_after.png') });

    // Click label to reset to Aaj
    console.log('Clicking label to reset to Aaj...');
    await page.click('#scheduleDayLabel');
    await new Promise(r => setTimeout(r, 800));

    label = await page.$eval('#scheduleDayLabel', el => el.textContent.trim());
    console.log('4. After clicking label (Reset):', label);
    if (label !== 'Aaj') throw new Error(`Expected 'Aaj', got '${label}'`);

    // Click < (Previous Day / Beeta Kal)
    console.log('Clicking < (Previous Day)...');
    await page.evaluate(() => changeScheduleDay(-1));
    await new Promise(r => setTimeout(r, 800));

    label = await page.$eval('#scheduleDayLabel', el => el.textContent.trim());
    console.log('5. After changeScheduleDay(-1):', label);
    if (label !== 'Beeta Kal') throw new Error(`Expected 'Beeta Kal', got '${label}'`);

    await page.screenshot({ path: path.join(artifactDir, 'sched_test_4_beeta_kal.png') });

    console.log('🎉 SCHEDULE DAY SWITCHING WORKS FLAWLESSLY IN ALL DIRECTIONS!');
    await browser.close();
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('Schedule test failed:', err);
    server.close();
    process.exit(1);
  }
});
