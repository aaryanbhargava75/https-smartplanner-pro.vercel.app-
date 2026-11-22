const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf("launchFocusHub('${safeTitle}'");
console.log(content.slice(Math.max(0, idx - 100), idx + 400));
