const fs = require('fs');

let html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const target = `      // SIGN IN EXISTING USER (PASSWORD PROTECTED)
      if (e) e.preventDefault();`;

const replacement = `      // SIGN IN EXISTING USER (PASSWORD PROTECTED)
      async function handleAccountLogin(e) {
        if (e) e.preventDefault();`;

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync('smart-planner-ai.html', html, 'utf8');
  console.log('✔ Restored handleAccountLogin declaration');
} else {
  console.error('✖ Could not find target');
}
