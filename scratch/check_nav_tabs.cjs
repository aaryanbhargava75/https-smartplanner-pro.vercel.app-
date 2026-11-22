const fs = require('fs');

const html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const navRegex = /<button[^>]*data-tab=["']([^"']+)["'][^>]*>([\s\S]*?)<\/button>/g;
let m;
console.log('Sidebar Navigation Tabs:');
while ((m = navRegex.exec(html)) !== null) {
  const label = m[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`- ${m[1]}: "${label}"`);
}
