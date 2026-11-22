const puppeteer = require('puppeteer-core');
const path = require('path');

async function testLocal() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
  });

  const fileUrl = 'file:///' + path.join(__dirname, 'smart-planner-ai.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  const result = await page.evaluate(() => {
    return {
      switchTabExists: typeof window.switchTab === 'function',
      openLoginModalExists: typeof window.openLoginModal === 'function',
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      activeTab: typeof activeTab !== 'undefined' ? activeTab : 'unknown'
    };
  });
  console.log('Local page evaluation result:', result);

  // Test switching to expenses
  await page.evaluate(() => {
    window.switchTab('expenses');
  });
  await new Promise(r => setTimeout(r, 500));
  const expensesDisplay = await page.evaluate(() => {
    const el = document.getElementById('tab-expenses');
    return {
      hidden: el.classList.contains('hidden'),
      display: window.getComputedStyle(el).display
    };
  });
  console.log('tab-expenses display after switch:', expensesDisplay);

  // Test dump: "bro kal 2 thumbs up zero li 20 rupeek i"
  console.log('Testing dump submission...');
  await page.evaluate(async () => {
    window.switchTab('overview');
    const input = document.getElementById('overviewHeroInput');
    input.value = 'bro kal 2 thumbs up zero li 20 rupeek i';
    handleHeroInputLive(input.value);
    await submitOverviewHeroTask();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Check Paisa expenses
  const paisaCheck = await page.evaluate(() => {
    return {
      expenses: (appData.expenses || []).slice(0, 3),
      meals: (appData.nutrition?.meals || []).slice(0, 3)
    };
  });
  console.log('Paisa expenses:', JSON.stringify(paisaCheck.expenses, null, 2));
  console.log('Khana meals:', JSON.stringify(paisaCheck.meals, null, 2));

  await browser.close();
}

testLocal().catch(console.error);
