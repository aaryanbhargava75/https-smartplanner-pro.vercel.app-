const fs = require('fs');
const filePath = 'smart-planner-ai.html';
let content = fs.readFileSync(filePath, 'utf-8');

const regex = /if\s*\(\s*document\.readyState\s*===\s*'loading'\s*\)\s*\{\s*function\s+changeScheduleDay/g;

if (!regex.test(content)) {
  console.error('ERROR: regex did not match!');
  process.exit(1);
}

content = content.replace(regex, `if (document.readyState === 'loading') {\r\n      document.addEventListener('DOMContentLoaded', initApp);\r\n    } else {\r\n      initApp();\r\n    }\r\n\r\n    function changeScheduleDay`);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed unclosed if (document.readyState) block successfully!');
