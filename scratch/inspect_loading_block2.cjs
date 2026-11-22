const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = html.indexOf('if (document.readyState === \'loading\')');
console.log(html.slice(idx + 700, idx + 1800));
