const fs = require('fs');

let html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const oldTimerSwitch = `        if (!isTimerRunning) {
          toggleGlobalTimer();
        }

        switchTab('focus');
        showToast(\`⏳ \${minutes}-minute Focus Timer started for "\${activePomodoroTask}"!\`);`;

const newTimerSwitch = `        if (!isTimerRunning) {
          toggleGlobalTimer();
        }

        showToast(\`⏳ \${minutes}-minute Focus Timer started for "\${activePomodoroTask}"!\`);`;

if (html.includes(oldTimerSwitch)) {
  html = html.replace(oldTimerSwitch, newTimerSwitch);
  fs.writeFileSync('smart-planner-ai.html', html, 'utf8');
  console.log('✔ Removed switchTab("focus") from timer command handler');
} else {
  console.log('✖ Could not find oldTimerSwitch');
}
