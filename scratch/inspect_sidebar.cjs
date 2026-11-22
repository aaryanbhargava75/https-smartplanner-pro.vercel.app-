const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

const idx = content.indexOf('<nav class="flex-1 px-3');
console.log('--- Sidebar Nav ---');
console.log(content.slice(idx, idx + 1500));
