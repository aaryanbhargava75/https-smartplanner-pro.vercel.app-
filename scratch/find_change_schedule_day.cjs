const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = html.indexOf('function changeScheduleDay');
if (idx !== -1) {
  console.log(html.slice(idx, idx + 1000));
} else {
  console.log('changeScheduleDay function NOT FOUND!');
}
