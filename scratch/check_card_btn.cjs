const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('launchFocusHub');
if (idx !== -1) {
  console.log(content.slice(Math.max(0, idx - 100), idx + 250));
} else {
  console.log('launchFocusHub not found');
}
