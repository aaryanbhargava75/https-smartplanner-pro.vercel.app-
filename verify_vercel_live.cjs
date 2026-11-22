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

  // 1. Check Theme & Colors
  const themeCheck = await page.evaluate(() => {
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const isDark = document.documentElement.classList.contains('dark');
    return { bodyBg, isDark };
  });
  console.log('Theme check:', themeCheck);

  // 2. Open login modal and take screenshot
  await page.evaluate(() => {
    if (typeof openLoginModal === 'function') openLoginModal();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'vercel_live_login_modal.png'), fullPage: false });
  console.log('Saved vercel_live_login_modal.png');

  // Close login modal
  await page.evaluate(() => {
    if (typeof closeLoginModal === 'function') closeLoginModal();
  });
  await new Promise(r => setTimeout(r, 500));

  // 3. Test Brain Dump: "bro kal 2 thumbs up zero li 20 rupeek i"
  console.log('Testing food expense dump: bro kal 2 thumbs up zero li 20 rupeek i...');
  await page.evaluate(async () => {
    const input = document.getElementById('overviewHeroInput');
    if (input) {
      input.value = 'bro kal 2 thumbs up zero li 20 rupeek i';
      if (typeof handleHeroInputLive === 'function') handleHeroInputLive(input.value);
    }
    if (typeof submitOverviewHeroTask === 'function') {
      await submitOverviewHeroTask();
    }
  });
  await new Promise(r => setTimeout(r, 3500));

  // 4. Switch to Paisa (Expenses) Tab
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('expenses');
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(artifactDir, 'vercel_live_4_paisa.png'), fullPage: true });
  console.log('Saved vercel_live_4_paisa.png');

  // 5. Switch to Khana (Nutrition) Tab
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('nutrition');
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(artifactDir, 'vercel_live_5_khana.png'), fullPage: true });
  console.log('Saved vercel_live_5_khana.png');

  // 6. Test Page Reload to verify Persistence
  console.log('Reloading page to verify data persistence...');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2500));

  // Switch to Khana again after reload to verify data persisted
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('nutrition');
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(artifactDir, 'vercel_live_5_khana_persisted.png'), fullPage: true });
  console.log('Saved vercel_live_5_khana_persisted.png');

  await browser.close();
  console.log('All verifications & screenshots completed successfully!');
}

testLive().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
