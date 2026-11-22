const fs = require('fs');

const src = fs.readFileSync('smart-planner-ai.html', 'utf8');

fs.writeFileSync('index.html', src, 'utf8');
console.log('✔ Synced index.html');

if (fs.existsSync('netlify-deploy')) {
  fs.writeFileSync('netlify-deploy/index.html', src, 'utf8');
  fs.writeFileSync('netlify-deploy/smart-planner-ai.html', src, 'utf8');
  console.log('✔ Synced netlify-deploy files');
}
