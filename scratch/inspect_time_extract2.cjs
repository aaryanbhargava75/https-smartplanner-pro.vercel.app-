const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const tIdx = html.indexOf('function extractTimeFromText');
console.log(html.slice(tIdx + 600, tIdx + 1800));
