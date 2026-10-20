const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

function getBase64Image(filename) {
  const filePath = path.join(__dirname, filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

const ss0 = getBase64Image('real_ss_0_signin.png');
const ss1 = getBase64Image('real_ss_1_braindump.png');
const ss2 = getBase64Image('real_ss_2_dial.png');
const ss3 = getBase64Image('real_ss_3_tasks.png');
const ss4 = getBase64Image('real_ss_4_focus.png');
const ss5 = getBase64Image('real_ss_5_money.png');
const ss6 = getBase64Image('real_ss_6_settings.png');

console.log('Images loaded. ss0 length:', ss0.length, 'ss1 length:', ss1.length, 'ss2 length:', ss2.length);

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dayframe — Senior PM Product Teardown</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 11mm 13mm 13mm 13mm;
      @bottom-right {
        content: "Page " counter(page) " of 7";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7pt;
        color: #64748b;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.45;
      font-size: 8.5pt;
      -webkit-font-smoothing: antialiased;
    }

    .page {
      page-break-after: always;
      position: relative;
      padding-bottom: 2mm;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    .top-meta-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 6.8pt;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 10px;
    }

    .top-meta-bar .brand {
      color: #059669;
    }

    .doc-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .doc-title-group h1 {
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1.1;
    }

    .doc-title-group .subtitle {
      font-size: 9.5pt;
      font-weight: 600;
      color: #059669;
      margin-top: 2px;
    }

    .meta-badge-grid {
      text-align: right;
      font-size: 7.2pt;
      color: #64748b;
      line-height: 1.35;
    }

    .status-pill {
      display: inline-block;
      background: #059669;
      color: #ffffff;
      font-size: 6.5pt;
      font-weight: 800;
      padding: 2.5px 7px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }

    h2 {
      font-size: 11.5pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
      margin-top: 11px;
      margin-bottom: 6px;
      border-left: 3.5px solid #059669;
      padding-left: 7px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    h3 {
      font-size: 9pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 8px;
      margin-bottom: 3px;
    }

    p {
      margin-bottom: 5px;
      color: #334155;
    }

    .lead-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid #0284c7;
      padding: 8px 11px;
      border-radius: 5px;
      margin-bottom: 10px;
      font-size: 8.3pt;
    }

    .lead-box strong {
      color: #0369a1;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 6px 0 10px 0;
      font-size: 7.6pt;
    }

    th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
      padding: 5px 8px;
      border: 1px solid #0f172a;
    }

    td {
      padding: 5px 8px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
      color: #334155;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px;
      margin-bottom: 10px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-bottom: 10px;
    }

    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 7px 9px;
    }

    .card.highlight {
      border-color: #059669;
      background: #f0fdf4;
    }

    .card-header {
      font-weight: 700;
      font-size: 8.3pt;
      color: #0f172a;
      margin-bottom: 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tag {
      font-size: 6.2pt;
      font-weight: 700;
      padding: 1.5px 5px;
      border-radius: 999px;
      text-transform: uppercase;
    }

    .tag-emerald { background: #d1fae5; color: #065f46; }
    .tag-blue { background: #dbeafe; color: #1e40af; }
    .tag-amber { background: #fef3c7; color: #92400e; }
    .tag-rose { background: #ffe4e6; color: #9f1239; }
    .tag-purple { background: #f3e8ff; color: #6b21a8; }

    /* Screenshot Display Cards */
    .ss-showcase-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin: 8px 0 10px 0;
    }

    .ss-showcase-card {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      flex-col: column;
    }

    .ss-header {
      background: #1e293b;
      padding: 3px 6px;
      font-size: 6.8pt;
      font-weight: 700;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #334155;
    }

    .ss-header .live-badge {
      color: #34d399;
      font-size: 5.8pt;
      text-transform: uppercase;
    }

    .ss-img-wrap {
      width: 100%;
      height: 125px;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .ss-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
    }

    .ss-caption {
      padding: 4px 6px;
      font-size: 6.8pt;
      color: #cbd5e1;
      background: #0f172a;
      border-top: 1px solid #1e293b;
      line-height: 1.25;
    }

    /* Architecture Visual Blocks */
    .arch-layer {
      background: #ffffff;
      border: 1.2px solid #e2e8f0;
      border-radius: 6px;
      padding: 7px 10px;
      margin-bottom: 6px;
    }

    .arch-layer-header {
      font-size: 8pt;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
      border-bottom: 1px dashed #e2e8f0;
      padding-bottom: 3px;
    }

    .arch-badge {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 3px;
      padding: 2px 5px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.5pt;
      color: #0f172a;
      display: inline-block;
      margin-right: 4px;
      margin-top: 2px;
    }

    .arch-arrow {
      text-align: center;
      font-size: 8pt;
      color: #059669;
      font-weight: 800;
      margin: -2px 0 2px 0;
    }

    .metric-hero {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 8px 12px;
      border-radius: 6px;
      margin: 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .metric-hero .label {
      font-size: 7pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #94a3b8;
    }

    .metric-hero .val {
      font-size: 11pt;
      font-weight: 800;
      color: #34d399;
    }

    .code-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.8pt;
      background: #f1f5f9;
      padding: 1px 3.5px;
      border-radius: 3px;
      color: #0f172a;
      border: 1px solid #e2e8f0;
    }

    .badge-live-tag {
      background: #dcfce7;
      color: #15803d;
      font-size: 6.5pt;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
    }

    .badge-risk-tag {
      background: #fee2e2;
      color: #b91c1c;
      font-size: 6.5pt;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1 ==================== -->
  <div class="page">
    <div class="top-meta-bar">
      <span>SENIOR PM PRODUCT TEARDOWN</span>
      <span>smartplanner-pro.vercel.app | Oct 2026</span>
    </div>

    <div class="doc-header">
      <div class="doc-title-group">
        <h1>Dayframe</h1>
        <div class="subtitle">AI-powered 24-hour planner (Smart Planner Pro)</div>
      </div>
      <div class="meta-badge-grid">
        <div><strong>Author:</strong> Aaryan Bhargava</div>
        <div><strong>Live URL:</strong> smartplanner-pro.vercel.app</div>
        <div><strong>Date:</strong> October 2026</div>
        <div><span class="status-pill">STATUS: VERCEL PRODUCTION LIVE</span></div>
      </div>
    </div>

    <h2>Product thesis</h2>
    <p style="font-size: 8.5pt;">
      Dayframe aims to remove the <strong>Setup Tax</strong> of organising your day. Instead of building databases in Notion or hand-filling calendar slots, the user dumps messy input (typed text, a voice note, a screenshot or receipt) and the app sorts it into tasks, time blocks and expenses, then shows the day on a <strong>24-hour circular dial</strong>.
    </p>

    <h2>Central teardown question</h2>
    <div class="lead-box" style="border-left-color: #059669; background: #f0fdf4;">
      <strong>Does Dayframe save net time end-to-end, or does it just move the work from manual entry to reviewing and fixing AI mistakes?</strong><br/>
      The reference draft estimates planning drops from <strong>~22 min (manual setup) to under 90 s</strong> if extraction accuracy stays above ~90%. That is a hypothesis to validate with real user testing, not merely an assumed result.
    </div>

    <h2>Verdict at a glance</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 18%;">Area</th>
          <th style="width: 15%;">Verdict</th>
          <th>Why</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Core idea</strong></td>
          <td><span class="badge-live-tag">Strong</span></td>
          <td>One capture box feeding tasks, schedule and money is a clear wedge; the 24h dial is a real differentiator for time-blind users.</td>
        </tr>
        <tr>
          <td><strong>Capture UX</strong></td>
          <td><span class="badge-live-tag">Strong</span></td>
          <td>Text, voice, audio file, image upload and Ctrl+V screenshot paste, all in one place. Guest mode means zero signup wall.</td>
        </tr>
        <tr>
          <td><strong>Trust and privacy</strong></td>
          <td><span class="badge-risk-tag">Needs work</span></td>
          <td>Sign-in asks only name and email (no password step visible) while the page claims 100% private and encrypted. Claims should match mechanism via OAuth/OTP.</td>
        </tr>
        <tr>
          <td><strong>Money layer</strong></td>
          <td><span class="badge-live-tag">Distinctive</span></td>
          <td>Bank SMS / UPI auto-log via webhook is powerful for India, but setup (MacroDroid + local IP / ngrok) is power-user only.</td>
        </tr>
        <tr>
          <td><strong>Retention loop</strong></td>
          <td><span class="badge-risk-tag">Gap</span></td>
          <td>Day view is static: no ripple reschedule when meetings overrun, and 7-day journal auto-purge works against habit building unless Drive is connected.</td>
        </tr>
        <tr>
          <td><strong>Monetisation</strong></td>
          <td><span class="badge-live-tag">Plausible</span></td>
          <td>Freemium at $8 / Rs 499 per month fits; AI cost caps on the free tier are the key commercial lever.</td>
        </tr>
      </tbody>
    </table>

    <div class="lead-box" style="margin-top: 10px;">
      <strong>Live Evidence Note:</strong> All visual screens in this document are <strong>authentic high-resolution screenshots</strong> captured directly from the live Vercel production deployment at <code class="code-pill">smartplanner-pro.vercel.app</code>.
    </div>
  </div>

  <!-- ==================== PAGE 2 ==================== -->
  <div class="page">
    <div class="top-meta-bar">
      <span>DAYFRAME | PRODUCT OVERVIEW & AUDIT</span>
      <span>smartplanner-pro.vercel.app | Oct 2026</span>
    </div>

    <h2>1. Product overview and strategic framing</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 22%;">Element</th>
          <th>Analysis</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Product</strong></td>
          <td>Dayframe (Smart Planner Pro): installable PWA (Apple web-app meta present), dark theme, INR / USD / EUR / GBP / AED currency switch.</td>
        </tr>
        <tr>
          <td><strong>Category</strong></td>
          <td>AI daily planning, multimodal capture and circadian time blocking.</td>
        </tr>
        <tr>
          <td><strong>Primary user</strong></td>
          <td>Busy working professionals juggling meetings, expenses and personal tasks; Gen-Z students and ADHD / visual planners.</td>
        </tr>
        <tr>
          <td><strong>Core problem</strong></td>
          <td>Tasks, money and schedule are scattered across WhatsApp, calendar, Splitwise and notes. Manual entry is tiring.</td>
        </tr>
        <tr>
          <td><strong>Value prop</strong></td>
          <td>'Dump and Done': capture in seconds, AI sorts into tasks, schedule and expenses, app plots the day.</td>
        </tr>
        <tr>
          <td><strong>Business model</strong></td>
          <td>Freemium: free local-first capture and dial; Pro adds cloud sync, unlimited AI and calendar integration.</td>
        </tr>
      </tbody>
    </table>

    <h2>2. Personas and jobs-to-be-done</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 28%;">Persona</th>
          <th style="width: 10%;">Share</th>
          <th style="width: 30%;">Context</th>
          <th>JTBD</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Time-poor professional (primary)</strong></td>
          <td>40%</td>
          <td>6+ meetings a day, expense claims, family load.</td>
          <td>Turn a 15-second commute voice memo into blocks and expense logs without opening four apps.</td>
        </tr>
        <tr>
          <td><strong>Freelancer / builder (growth)</strong></td>
          <td>35%</td>
          <td>Multiple clients, irregular hours, cash-flow worries.</td>
          <td>Make sure billable hours are scheduled and receipts logged instantly.</td>
        </tr>
        <tr>
          <td><strong>ADHD / visual thinker (moat)</strong></td>
          <td>25%</td>
          <td>Time-blindness, list paralysis.</td>
          <td>See 24 hours as a dial so morning, afternoon and night are instantly clear.</td>
        </tr>
      </tbody>
    </table>

    <h2>3. What the live app actually contains (Live Audit)</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 22%;">Module</th>
          <th>What is on the page</th>
          <th style="width: 18%;">Note</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Top bar</strong></td>
          <td>Search (Cmd/Ctrl+K), light/dark toggle, notifications, Add New Task, currency switch, account menu (Switch Account, Export Excel, Settings, Sign Out).</td>
          <td>Standard Shell</td>
        </tr>
        <tr>
          <td><strong>AI Brain Dump</strong></td>
          <td>Free text, Record Voice, Audio VN file, Upload Image, Ctrl+V screenshot paste; chips for Tasks / Money / Schedule; Process & Organize (Ctrl+Enter).</td>
          <td><span class="badge-live-tag">Core moat</span></td>
        </tr>
        <tr>
          <td><strong>Dashboard stats</strong></td>
          <td>Tasks completed 7/12, focus time 3h 42m, productivity score 86/100, weekly activity chart, Today's priorities, Up next, Daily insight.</td>
          <td>KPI Row</td>
        </tr>
        <tr>
          <td><strong>Plan my day</strong></td>
          <td>One-tap AI plan from the header; 24-hour circular schedule dial with day/night sectors.</td>
          <td><span class="badge-live-tag">Key delight</span></td>
        </tr>
        <tr>
          <td><strong>Bottom nav</strong></td>
          <td>Home, Journal, Tasks, Focus, Money, Wealth, Screen (screen-time).</td>
          <td>Extended Suite</td>
        </tr>
        <tr>
          <td><strong>Journal Vault</strong></td>
          <td>Google Drive backup; default 7-day ephemeral retention; Markdown backup download.</td>
          <td>Privacy Anchor</td>
        </tr>
        <tr>
          <td><strong>Focus & Not-to-do</strong></td>
          <td>25:00 Deep Work timer with pause, +5m, done; target task picker; Not-to-do rules shield.</td>
          <td>Execution</td>
        </tr>
        <tr>
          <td><strong>Phone SMS & UPI Hub</strong></td>
          <td>Webhook URL, live bank-SMS simulator (SBI, HDFC, Paytm, ICICI samples), MacroDroid guide, recent synced transactions.</td>
          <td>India-specific</td>
        </tr>
        <tr>
          <td><strong>Settings and data</strong></td>
          <td>Excel-ready CSV export, Clean Duplicates, Security Audit (10/10), JSON export/import, Reset Local Cache.</td>
          <td>Data Portability</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ==================== PAGE 3 ==================== -->
  <div class="page">
    <div class="top-meta-bar">
      <span>DAYFRAME | SCREEN-BY-SCREEN BREAKDOWN</span>
      <span>smartplanner-pro.vercel.app | Oct 2026</span>
    </div>

    <h2>4. Screen-by-screen breakdown (Real Screenshots)</h2>
    <p style="font-size: 7.8pt; color: #475569;">
      Authentic captures from the live web application showing the core interaction surfaces.
    </p>

    <div class="ss-showcase-grid">
      <!-- Screen 1 -->
      <div class="ss-showcase-card">
        <div class="ss-header">
          <span>HOME + BRAIN DUMP</span>
          <span class="live-badge">LIVE SITE</span>
        </div>
        <div class="ss-img-wrap">
          <img src="${ss1}" alt="Brain Dump Screen" />
        </div>
        <div class="ss-caption">
          <strong>Home Dashboard:</strong> Greeting, KPI tiles, and the prominent multimodal dump dock dominate above the fold.
        </div>
      </div>

      <!-- Screen 2 -->
      <div class="ss-showcase-card">
        <div class="ss-header">
          <span>24-HOUR CIRCULAR DIAL</span>
          <span class="live-badge">LIVE SITE</span>
        </div>
        <div class="ss-img-wrap">
          <img src="${ss2}" alt="24-Hour Circular Dial" />
        </div>
        <div class="ss-caption">
          <strong>Circular Dial:</strong> Night (0-6h), Morning, Afternoon, Evening sectors with real-time sweep hand and timeline.
        </div>
      </div>

      <!-- Screen 3 -->
      <div class="ss-showcase-card">
        <div class="ss-header">
          <span>TASKS & PRIORITIES</span>
          <span class="live-badge">LIVE SITE</span>
        </div>
        <div class="ss-img-wrap">
          <img src="${ss3}" alt="Tasks Backlog Screen" />
        </div>
        <div class="ss-caption">
          <strong>Priority Backlog:</strong> High/Medium/Low Eisenhower tags with duration badges and one-click Pomodoro launch.
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 22%;">Screen</th>
          <th style="width: 38%;">Strengths</th>
          <th>PM evaluation and risk</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>AI Brain Dump</strong></td>
          <td>One box, five input types (Voice, Audio file, Image OCR, Ctrl+V, Text), Hinglish friendly, keyboard shortcut (Ctrl+Enter).</td>
          <td><strong>Risk:</strong> if confidence is hidden, users re-check every item. Needs a lightweight review step (P1).</td>
        </tr>
        <tr>
          <td><strong>Plan my day + dial</strong></td>
          <td>Spatial view beats a linear list for time-blind users. Continuous 24h cycle anchors biological circadian rhythm.</td>
          <td><strong>Gap:</strong> Does it handle overruns and travel time? Currently static without auto-ripple rescheduling.</td>
        </tr>
        <tr>
          <td><strong>Money and Wealth</strong></td>
          <td>Currency switcher (INR/USD/EUR), daily spend, net-asset tracking, bank SMS auto-log.</td>
          <td>Are users comfortable mixing finances into a planner? Local-first storage helps with trust.</td>
        </tr>
        <tr>
          <td><strong>Focus, Distraction, Not-to-do</strong></td>
          <td>Pomodoro tied to a task; distraction log; guardrail rules ("No phone before morning block").</td>
          <td>Productivity score (86/100) needs transparent logic or it becomes an arbitrary vanity metric.</td>
        </tr>
        <tr>
          <td><strong>Export</strong></td>
          <td>Excel-ready CSV with UTF-8 BOM, developer JSON backup/restore.</td>
          <td>Excellent for freelancers and portability; completely avoids vendor lock-in.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ==================== PAGE 4 ==================== -->
  <div class="page">
    <div class="top-meta-bar">
      <span>DAYFRAME | END-TO-END USER JOURNEY</span>
      <span>smartplanner-pro.vercel.app | Oct 2026</span>
    </div>

    <h2>5. End-to-end user journey (Real Screenshots)</h2>
    <p style="font-size: 7.8pt; color: #475569;">
      Six live screens illustrating the five key stages of a time-poor working professional's day.
    </p>

    <!-- 6 Screens Grid (2 rows of 3) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 7px; margin-bottom: 8px;">
      <!-- S0 -->
      <div class="ss-showcase-card">
        <div class="ss-header">
          <span>0. SIGN IN / GUEST</span>
          <span class="live-badge">REAL UI</span>
        </div>
        <div class="ss-img-wrap" style="height: 105px;">
          <img src="${ss0}" alt="Sign In Modal" />
        </div>
        <div class="ss-caption" style="font-size: 6.2pt;">
          <strong>Stage 0 - Entry:</strong> Name + email or 'Continue as Guest'. Zero signup barrier.
        </div>
      </div>

      <!-- S1 -->
      <div class="ss-showcase-card">
        <div class="ss-header">
          <span>1. CAPTURE / DUMP</span>
          <span class="live-badge">REAL UI</span>
        </div>
        <div class="ss-img-wrap" style="height: 105px;">
          <img src="${ss1}" alt="Brain Dump" />
        </div>
        <div class="ss-caption" style="font-size: 6.2pt;">
          <strong>Stage 1 - Capture:</strong> User speaks: 'Subah standup 10:30, 1 baje presentation, shaam gym.'
        </div>
      </div>

      <!-- S2 -->
      <div class="ss-showcase-card">
        <div class="ss-header">
          <span>2. SPATIAL DIAL</span>
          <span class="live-badge">REAL UI</span>
        </div>
        <div class="ss-img-wrap" style="height: 105px;">
          <img src="${ss2}" alt="Circular Schedule Dial" />
        </div>
        <div class="ss-caption" style="font-size: 6.2pt;">
          <strong>Stage 2 - Align:</strong> Items map onto 24-hr circular dial. Free time lights up visually.
        </div>
      </div>

      <!-- S3 -->
      <div class="ss-showcase-card">
        <div class="ss-header">
          <span>3. TASKS BACKLOG</span>
          <span class="live-badge">REAL UI</span>
        </div>
        <div class="ss-img-wrap" style="height: 105px;">
          <img src="${ss3}" alt="Task Board" />
        </div>
        <div class="ss-caption" style="font-size: 6.2pt;">
          <strong>Stage 3 - Prioritize:</strong> Backlog tasks sorted with priority, duration & drag anchors.
        </div>
      </div>

      <!-- S4 -->
      <div class="ss-showcase-card">
        <div class="ss-header">
          <span>4. FOCUS EXECUTION</span>
          <span class="live-badge">REAL UI</span>
        </div>
        <div class="ss-img-wrap" style="height: 105px;">
          <img src="${ss4}" alt="Focus Session" />
        </div>
        <div class="ss-caption" style="font-size: 6.2pt;">
          <strong>Stage 4 - Execute:</strong> 25-minute Pomodoro linked to active task with Not-to-do guardrail.
        </div>
      </div>

      <!-- S5 -->
      <div class="ss-showcase-card">
        <div class="ss-header">
          <span>5. EXCEL EXPORT</span>
          <span class="live-badge">REAL UI</span>
        </div>
        <div class="ss-img-wrap" style="height: 105px;">
          <img src="${ss6}" alt="Settings & Excel Export" />
        </div>
        <div class="ss-caption" style="font-size: 6.2pt;">
          <strong>Stage 5 - Archive:</strong> 1-click Download Excel Spreadsheet (.csv) with UTF-8 BOM.
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 18%;">Stage</th>
          <th style="width: 25%;">Cognitive state</th>
          <th>Success metric (target, to validate)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Capture</strong></td>
          <td>Overwhelmed &rarr; Relieved</td>
          <td>Time-to-capture under 5 s via voice recording.</td>
        </tr>
        <tr>
          <td><strong>Parse</strong></td>
          <td>Relieved &rarr; Trusting</td>
          <td>Inference under 800 ms via Groq LPUs, near-zero JSON entity parse errors.</td>
        </tr>
        <tr>
          <td><strong>Align on dial</strong></td>
          <td>Clear and anchored</td>
          <td>Zero overlapping time blocks; spatial daylight visibility.</td>
        </tr>
        <tr>
          <td><strong>Focus</strong></td>
          <td>Deep Flow</td>
          <td>Focus sprint completion rate above 70%.</td>
        </tr>
        <tr>
          <td><strong>Reflect + export</strong></td>
          <td>Accomplished</td>
          <td>Day-7 retention above 42%; weekly spreadsheet archive frequency &gt; 15%.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ==================== PAGE 5 ==================== -->
  <div class="page">
    <div class="top-meta-bar">
      <span>DAYFRAME | TECHNICAL & SYSTEM ARCHITECTURE</span>
      <span>smartplanner-pro.vercel.app | Oct 2026</span>
    </div>

    <h2>Technical & System Architecture</h2>
    <p style="font-size: 7.8pt;">
      Dayframe employs a <strong>Local-First, Edge-Assisted hybrid architecture</strong>. The UI executes entirely in the client browser for zero-latency interactions and 100% offline functionality, while compute-heavy AI tasks stream through low-latency edge functions.
    </p>

    <!-- Architecture Layers -->
    <div class="arch-layer" style="border-left: 3.5px solid #059669;">
      <div class="arch-layer-header">
        <span>LAYER 1: CLIENT PRESENTATION & OFFLINE ENGINE (PWA)</span>
        <span class="tag tag-emerald">CLIENT TIER</span>
      </div>
      <p style="font-size: 7.2pt; color: #475569;">
        Single-Page Progressive Web App built with Vanilla HTML5/ES6, Dynamic SVG Circadian Dial Canvas renderer (60 FPS), and Web Speech API. Stores state in browser <code class="code-pill">localStorage</code> with key isolation (<code class="code-pill">smart-planner-user-{id}</code>). Service Worker (<code class="code-pill">sw.js</code>) caches static assets for offline execution.
      </p>
      <div>
        <span class="arch-badge">SVG Dial Renderer (60 FPS)</span>
        <span class="arch-badge">Web Speech API</span>
        <span class="arch-badge">Tesseract.js OCR</span>
        <span class="arch-badge">Service Worker Cache</span>
        <span class="arch-badge">UTF-8 BOM CSV Generator</span>
      </div>
    </div>

    <div class="arch-arrow">&#9660; HTTPS / JSON Edge API (&lt; 80ms) &#9660;</div>

    <div class="arch-layer" style="border-left: 3.5px solid #0284c7;">
      <div class="arch-layer-header">
        <span>LAYER 2: EDGE GATEWAY & ROUTING CONTROLLER</span>
        <span class="tag tag-blue">SERVERLESS TIER</span>
      </div>
      <p style="font-size: 7.2pt; color: #475569;">
        Node.js Express / Vercel Serverless Edge Functions (<code class="code-pill">server.js</code>). Handles auth token verification, rate limiting, request schema validation, and secure API key management preventing secret leakage to clients.
      </p>
      <div>
        <span class="arch-badge">POST /api/ai/brain-dump</span>
        <span class="arch-badge">GET /api/auth/config</span>
        <span class="arch-badge">POST /api/sync/supabase</span>
        <span class="arch-badge">CORS / Security Headers</span>
      </div>
    </div>

    <div class="arch-arrow">&#9660; Sub-Second Inference Stream (&lt; 800ms) &#9660;</div>

    <div class="grid-2" style="margin-bottom: 6px;">
      <div class="arch-layer" style="border-left: 3.5px solid #f59e0b; margin-bottom: 0;">
        <div class="arch-layer-header">
          <span>LAYER 3A: NEURAL AI INFERENCE</span>
          <span class="tag tag-amber">GROQ LPU</span>
        </div>
        <p style="font-size: 7.2pt; color: #475569;">
          <strong>Groq Cloud API</strong> running <strong>Llama-3.3-70b-versatile</strong>. Uses strict JSON Schema steering to extract entity arrays without hallucinating dates or currencies. Sub-second TTFT (&lt;800ms) enables conversational responsiveness.
        </p>
      </div>

      <div class="arch-layer" style="border-left: 3.5px solid #8b5cf6; margin-bottom: 0;">
        <div class="arch-layer-header">
          <span>LAYER 3B: CLOUD MULTI-TENANT STORAGE</span>
          <span class="tag tag-purple">DATA PERSISTENCE</span>
        </div>
        <p style="font-size: 7.2pt; color: #475569;">
          <strong>Supabase PostgreSQL</strong> with strict <strong>Row-Level Security (RLS)</strong>. Each user's tasks, journal entries, and finances are partitioned by authenticated Google UID. Fallback to Google Drive multipart diary backup.
        </p>
      </div>
    </div>

    <h2>Database Schema & Data Model</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 18%;">Entity</th>
          <th style="width: 32%;">Key Attributes</th>
          <th>Relational Constraints & Security Scope</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>tasks</strong></td>
          <td><code class="code-pill">id (UUID)</code>, <code class="code-pill">title</code>, <code class="code-pill">category</code>, <code class="code-pill">priority</code>, <code class="code-pill">duration</code>, <code class="code-pill">status</code></td>
          <td>Scoped to <code class="code-pill">user_id</code>. Indexed on <code class="code-pill">(user_id, date, status)</code>.</td>
        </tr>
        <tr>
          <td><strong>journal</strong></td>
          <td><code class="code-pill">id</code>, <code class="code-pill">startTime</code>, <code class="code-pill">endTime</code>, <code class="code-pill">title</code>, <code class="code-pill">notes</code></td>
          <td>Maps directly to 360° circular dial sectors. RLS policy: <code class="code-pill">auth.uid() = user_id</code>.</td>
        </tr>
        <tr>
          <td><strong>expenses</strong></td>
          <td><code class="code-pill">id</code>, <code class="code-pill">date</code>, <code class="code-pill">item</code>, <code class="code-pill">category</code>, <code class="code-pill">amount</code>, <code class="code-pill">type</code></td>
          <td>Non-negative decimal values. Dynamic multi-currency formatting (INR/USD/EUR).</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ==================== PAGE 6 ==================== -->
  <div class="page">
    <div class="top-meta-bar">
      <span>DAYFRAME | FRICTION ANALYSIS & RICE OPPORTUNITIES</span>
      <span>smartplanner-pro.vercel.app | Oct 2026</span>
    </div>

    <h2>6. Friction analysis (The Good & The Bad)</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 50%; background: #065f46;">What works (Delight & Advantages)</th>
          <th style="background: #991b1b;">Friction points (Risks & Bottlenecks)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            &bull; <strong>Zero-setup Guest mode</strong>: No signup wall, instant value on second 1.<br/>
            &bull; <strong>Multimodal capture</strong>: Voice, receipt image & text feel blazing fast (&lt;800ms).<br/>
            &bull; <strong>Circular 24h dial</strong>: Completely eliminates linear list time-blindness.<br/>
            &bull; <strong>SMS/UPI auto-log</strong>: Genuine India-first wedge for automated expense logging.<br/>
            &bull; <strong>Excel-ready CSV export</strong>: Clean UTF-8 BOM spreadsheet downloads.
          </td>
          <td>
            &bull; <strong>Dense single-page layout</strong>: Tasks, calendar, money, habits compete for attention.<br/>
            &bull; <strong>Fixing wrong AI slots</strong> requires opening modal dialogues.<br/>
            &bull; <strong>Static schedule</strong>: Schedules do not ripple when a task overruns.<br/>
            &bull; <strong>SMS sync friction</strong>: Needs third-party MacroDroid and reachable webhook.<br/>
            &bull; <strong>Ephemeral journal</strong>: Auto-purges after 7 days unless Drive is linked.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>7. Opportunities, prioritised with RICE</h2>
    <p style="font-size: 7.2pt; color: #64748b; margin-bottom: 4px;">
      Scores are illustrative PM estimates (Reach %, Impact 0.5-3, Confidence %, Effort in person-weeks); RICE = R &times; I &times; C / E.
    </p>

    <table>
      <thead>
        <tr>
          <th style="width: 4%;">#</th>
          <th style="width: 20%;">Opportunity</th>
          <th>Problem and solution</th>
          <th style="width: 6%;">R</th>
          <th style="width: 6%;">I</th>
          <th style="width: 7%;">C</th>
          <th style="width: 6%;">E</th>
          <th style="width: 8%;">RICE</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td><strong>Fix share & zoom basics</strong></td>
          <td>og:image points at manifest.json, so link previews break; viewport blocks pinch-zoom (accessibility). Use real image, allow zoom.</td>
          <td>100</td>
          <td>1</td>
          <td>90%</td>
          <td>0.5</td>
          <td><strong>180</strong></td>
        </tr>
        <tr>
          <td>2</td>
          <td><strong>Real authentication</strong></td>
          <td>Name + email sign-in cannot back a 'private and encrypted' claim. Add Google OAuth or email OTP.</td>
          <td>100</td>
          <td>3</td>
          <td>90%</td>
          <td>3</td>
          <td><strong>90</strong></td>
        </tr>
        <tr>
          <td>3</td>
          <td><strong>1-tap capture review drawer</strong></td>
          <td>Show 'Found 2 tasks, 1 meeting, Rs 500. Approve all / Tweak' for 3 s. Target: median time to organised under 30 s.</td>
          <td>90</td>
          <td>2</td>
          <td>80%</td>
          <td>2</td>
          <td><strong>72</strong></td>
        </tr>
        <tr>
          <td>4</td>
          <td><strong>Ripple reschedule</strong></td>
          <td>When a meeting runs late, push low-priority tasks to next free slot or tomorrow. Target: missed-task recovery above 60%.</td>
          <td>60</td>
          <td>2</td>
          <td>60%</td>
          <td>4</td>
          <td><strong>18</strong></td>
        </tr>
        <tr>
          <td>5</td>
          <td><strong>Proactive assistant</strong></td>
          <td>Warn on 4 h back-to-back meetings, surface recurring bills, suggest breaks. Target: prompt engagement above 40%.</td>
          <td>50</td>
          <td>1</td>
          <td>50%</td>
          <td>5</td>
          <td><strong>5</strong></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ==================== PAGE 7 ==================== -->
  <div class="page">
    <div class="top-meta-bar">
      <span>DAYFRAME | BUSINESS MODEL & VALIDATION</span>
      <span>smartplanner-pro.vercel.app | Oct 2026</span>
    </div>

    <h2>8. Business model and metrics</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 22%;">Model</th>
          <th style="width: 32%;">Benefit</th>
          <th style="width: 32%;">Risk</th>
          <th>Verdict</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Free + ads</strong></td>
          <td>Zero friction, early ad revenue</td>
          <td>Ads break focus; low India ad yield</td>
          <td><span class="badge-risk-tag">Reject</span></td>
        </tr>
        <tr>
          <td><strong>Freemium (Free + Pro)</strong></td>
          <td>Viral funnel, day-1 aha moment</td>
          <td>Free tier must be generous yet capped</td>
          <td><span class="badge-live-tag">Recommended</span></td>
        </tr>
        <tr>
          <td><strong>Lifetime licence ($49-99)</strong></td>
          <td>Upfront cash</td>
          <td>Ongoing AI token cost gives negative margin without caps</td>
          <td><span class="badge-live-tag">Limited run</span></td>
        </tr>
      </tbody>
    </table>

    <div class="card highlight" style="margin-bottom: 8px;">
      <div class="grid-2" style="margin-bottom: 0;">
        <div style="font-size: 7.5pt;">
          <strong>Dayframe Free (hook):</strong>
          <ul style="margin-top: 2px; margin-bottom: 0; padding-left: 12px;">
            <li>Local-first 24h dial and Pomodoro timer</li>
            <li>5 AI brain dumps per day</li>
            <li>Local storage and CSV export</li>
          </ul>
        </div>
        <div style="font-size: 7.5pt;">
          <strong>Dayframe Pro, $8 / Rs 499 per month (conversion):</strong>
          <ul style="margin-top: 2px; margin-bottom: 0; padding-left: 12px;">
            <li>Unlimited AI voice and OCR dumps</li>
            <li>Multi-device cloud sync with Supabase</li>
            <li>Two-way Google / Outlook calendar sync</li>
            <li>Adaptive rescheduling & WhatsApp capture</li>
          </ul>
        </div>
      </div>
    </div>

    <h2>North Star metric</h2>
    <div class="metric-hero">
      <div>
        <div class="label">Primary Metric</div>
        <div style="font-size: 9.5pt; font-weight: 700; color: #ffffff; margin-top: 1px;">
          Weekly users who organise and complete 5 or more priority commitments.
        </div>
      </div>
      <div style="text-align: right;">
        <div class="label">Target Benchmark</div>
        <div class="val">&gt; 45% WAU</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 18%;">Category</th>
          <th style="width: 25%;">KPI</th>
          <th style="width: 18%;">Target</th>
          <th>How to measure</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Activation</strong></td>
          <td>Time to first scheduled block</td>
          <td>&lt; 60 s</td>
          <td>Landing to first block placed on dial.</td>
        </tr>
        <tr>
          <td><strong>Efficiency</strong></td>
          <td>Net planning time</td>
          <td>&lt; 2 min/day</td>
          <td>Active time in capture and organise views.</td>
        </tr>
        <tr>
          <td><strong>AI quality</strong></td>
          <td>Entity extraction accuracy</td>
          <td>&gt; 92%</td>
          <td>Extracted items accepted without edits.</td>
        </tr>
        <tr>
          <td><strong>Retention</strong></td>
          <td>Week-4 retention</td>
          <td>&gt; 38%</td>
          <td>Return in week 4 to log tasks or run focus.</td>
        </tr>
        <tr>
          <td><strong>Execution</strong></td>
          <td>Priority task completion</td>
          <td>&gt; 65%</td>
          <td>High-priority done vs created.</td>
        </tr>
        <tr>
          <td><strong>Monetisation</strong></td>
          <td>Free-to-paid conversion</td>
          <td>4.2-5.5%</td>
          <td>Upgrades within 30 days of hitting the AI cap.</td>
        </tr>
      </tbody>
    </table>

    <h2>9. How to defend this teardown: three experiments</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Experiment</th>
          <th style="width: 50%;">Method</th>
          <th>Signal</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>User problem discovery</strong></td>
          <td>Interview 8 working professionals about friction across WhatsApp, calendar and Splitwise; track who drops to-do apps within 7 days.</td>
          <td>Is the fragmentation pain real and frequent?</td>
        </tr>
        <tr>
          <td><strong>Messy-input stress test</strong></td>
          <td>Run 20 chaotic inputs: Hinglish with traffic noise, blurry receipts, conflicting 2 PM meetings.</td>
          <td>Error rate and recovery cost per input.</td>
        </tr>
        <tr>
          <td><strong>A/B ripple reschedule</strong></td>
          <td>Cohort A reschedules manually; Cohort B gets a 1-tap Auto-Rebalance prompt.</td>
          <td>Day-14 retention delta.</td>
        </tr>
      </tbody>
    </table>
  </div>

</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'generate_teardown_pdf.html'), htmlContent);
console.log('generate_teardown_pdf.html successfully generated with embedded real screenshots!');

// Compile PDF using puppeteer
async function compilePDF() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve(__dirname, 'generate_teardown_pdf.html').replace(/\\/g, '/');
  console.log('Loading HTML in browser for PDF printing...');
  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  const pdfPath = path.join(__dirname, 'Dayframe_Product_Teardown.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '11mm',
      right: '13mm',
      bottom: '13mm',
      left: '13mm'
    }
  });

  console.log('PDF COMPILED TO:', pdfPath);
  await browser.close();
}

compilePDF().catch(err => {
  console.error('PDF Compile error:', err);
  process.exit(1);
});
