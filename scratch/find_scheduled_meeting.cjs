const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

let pos = 0;
while ((pos = html.indexOf('Scheduled meeting', pos)) !== -1) {
  console.log(html.slice(Math.max(0, pos - 100), pos + 200));
  pos += 18;
}
