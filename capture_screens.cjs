const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const filePath = 'file:///' + path.resolve(__dirname, 'smart-planner-ai.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  // 0. Sign In / Welcome Modal Screenshot
  console.log('Capturing Stage 0: Sign In / Guest Mode Modal...');
  await page.evaluate(() => {
    if (typeof openLoginModal === 'function') openLoginModal();
    else document.getElementById('loginModal')?.classList.remove('hidden');
  });
  await new Promise(r => setTimeout(r, 500));
  const modalBox = await page.$('#loginModal > div, #loginModal');
  if (modalBox) {
    await modalBox.screenshot({ path: path.join(__dirname, 'real_ss_0_signin.png') });
    console.log('Saved real_ss_0_signin.png');
  }
  await page.evaluate(() => {
    if (typeof closeLoginModal === 'function') closeLoginModal();
    else document.getElementById('loginModal')?.classList.add('hidden');
  });
  await new Promise(r => setTimeout(r, 400));

  // 1. Stage 1: Home & Brain Dump
  console.log('Capturing Stage 1: Brain Dump...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('overview');
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(__dirname, 'real_ss_1_braindump.png'),
    clip: { x: 260, y: 70, width: 920, height: 430 }
  });
  console.log('Saved real_ss_1_braindump.png');

  // 2. Stage 2 & 3: Circular 24-Hour Dial & Schedule
  console.log('Capturing Stage 2/3: Circular Dial & Spatial Schedule...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('schedule');
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(__dirname, 'real_ss_2_dial.png'),
    clip: { x: 260, y: 70, width: 920, height: 580 }
  });
  console.log('Saved real_ss_2_dial.png');

  // 3. Stage 4: Tasks & Priority Backlog
  console.log('Capturing Tasks Backlog...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('tasks');
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(__dirname, 'real_ss_3_tasks.png'),
    clip: { x: 260, y: 70, width: 920, height: 540 }
  });
  console.log('Saved real_ss_3_tasks.png');

  // 4. Stage 4 Focus: Focus Mode & Pomodoro Timer + Not-To-Do
  console.log('Capturing Stage 4 Focus: Pomodoro & Not-To-Do...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('focus');
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(__dirname, 'real_ss_4_focus.png'),
    clip: { x: 260, y: 70, width: 920, height: 560 }
  });
  console.log('Saved real_ss_4_focus.png');

  // 5. Stage 5: Finances & SMS / UPI Hub
  console.log('Capturing Stage 5: Expenses & SMS Hub...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('expenses');
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(__dirname, 'real_ss_5_money.png'),
    clip: { x: 260, y: 70, width: 920, height: 560 }
  });
  console.log('Saved real_ss_5_money.png');

  // 6. Settings Modal with Excel Spreadsheet Exporter
  console.log('Capturing Settings & Excel Spreadsheet Modal...');
  await page.evaluate(() => {
    if (typeof openSettingsModal === 'function') openSettingsModal();
    else document.getElementById('settingsModal')?.classList.remove('hidden');
  });
  await new Promise(r => setTimeout(r, 600));
  const settingsBox = await page.$('#settingsModal > div, #settingsModal');
  if (settingsBox) {
    await settingsBox.screenshot({ path: path.join(__dirname, 'real_ss_6_settings.png') });
    console.log('Saved real_ss_6_settings.png');
  }

  await browser.close();
  console.log('ALL REAL SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
