const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const kIdx = html.indexOf('changeKhanaDay');
console.log('--- changeKhanaDay occurrences ---');
let pos = 0;
while ((pos = html.indexOf('changeKhanaDay', pos)) !== -1) {
  console.log(html.slice(Math.max(0, pos - 50), pos + 100));
  pos += 14;
}
