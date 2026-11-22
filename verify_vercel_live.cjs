const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testLive() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const artifactDir = 'C:\\Users\\aarya\\.gemini\\antigravity\\brain\\7ffe15cf-bf22-4296-8b3d-1f29c8311a2e';
  
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  console.log('Navigating to live Vercel URL...');
  await page.goto('https://smartplanner-pro.vercel.app', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  // Screenshot 1: Overview
  await page.screenshot({ path: path.join(artifactDir, 'vercel_live_1_overview.png'), fullPage: true });
  console.log('Saved vercel_live_1_overview.png');

  // Screenshot 2: Tasks
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('tasks');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'vercel_live_2_tasks.png'), fullPage: true });
  console.log('Saved vercel_live_2_tasks.png');

  // Screenshot 3: Schedule
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('schedule');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'vercel_live_3_schedule.png'), fullPage: true });
  console.log('Saved vercel_live_3_schedule.png');

  // Screenshot 4: Paisa
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('paisa');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'vercel_live_4_paisa.png'), fullPage: true });
  console.log('Saved vercel_live_4_paisa.png');

  // Screenshot 5: Khana
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('khana');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'vercel_live_5_khana.png'), fullPage: true });
  console.log('Saved vercel_live_5_khana.png');

  // Screenshot 6: Journal
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('journal');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'vercel_live_6_journal.png'), fullPage: true });
  console.log('Saved vercel_live_6_journal.png');

  await browser.close();
  console.log('All live vercel screenshots captured successfully!');
}

testLive().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
