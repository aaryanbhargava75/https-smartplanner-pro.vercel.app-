const puppeteer = require('puppeteer-core');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://smartplanner-pro.vercel.app', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const result1 = await page.evaluate(() => {
    switchTab('expenses');
    const active = document.getElementById('tab-expenses');
    return {
      hidden: active.classList.contains('hidden'),
      display: active.style.display,
      computedDisplay: window.getComputedStyle(active).display
    };
  });
  console.log('expenses tab state:', result1);

  // Click the sidebar button directly:
  const clickResult = await page.evaluate(() => {
    const btn = document.querySelector('button[data-tab="expenses"]');
    if (btn) {
      btn.click();
      const active = document.getElementById('tab-expenses');
      return {
        clicked: true,
        hidden: active.classList.contains('hidden'),
        computedDisplay: window.getComputedStyle(active).display
      };
    }
    return { clicked: false };
  });
  console.log('click expenses button result:', clickResult);

  await browser.close();
}

test().catch(console.error);
