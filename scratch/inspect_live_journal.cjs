const puppeteer = require('puppeteer-core');

async function inspectLiveJournal() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://smartplanner-pro.vercel.app', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const info = await page.evaluate(() => {
    const todayISO = new Date().toISOString().split('T')[0];
    const journal = appData.journal || [];
    const tarunEntries = journal.filter(j => (j.activity || '').toLowerCase().includes('tarun'));
    return {
      todayISO,
      currentScheduleDate: window.currentScheduleDate,
      tarunEntries
    };
  });

  console.log('Live Journal Info:', JSON.stringify(info, null, 2));

  await browser.close();
}

inspectLiveJournal().catch(console.error);
