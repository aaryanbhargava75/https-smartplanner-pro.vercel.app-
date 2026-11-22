const puppeteer = require('puppeteer-core');
const path = require('path');

async function checkConsole() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const htmlPath = path.resolve('smart-planner-ai.html');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  const result = await page.evaluate(async () => {
    const dumpEl = document.getElementById('brainDumpInput');
    dumpEl.value = 'bola na tarun ke saath meeting set krde kal 12';
    await processBrainDumpAI();
    return {
      tasks: (appData.tasks || []).map(t => ({ title: t.title, date: t.date, time: t.time })),
      journal: (appData.journal || []).map(j => ({ activity: j.activity, date: j.date, time: j.startTime }))
    };
  });

  console.log('Result from browser evaluation:', JSON.stringify(result, null, 2));

  await browser.close();
}

checkConsole().catch(console.error);
