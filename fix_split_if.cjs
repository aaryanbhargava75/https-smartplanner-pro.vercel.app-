const fs = require('fs');
const filePath = 'smart-planner-ai.html';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove the misplaced 'if (document.readyState === loading) {' before changeScheduleDay
const misplacedIf = /if\s*\(\s*document\.readyState\s*===\s*'loading'\s*\)\s*\{\s*(?:document\.addEventListener\('DOMContentLoaded',\s*initApp\);\s*\}\s*else\s*\{\s*initApp\(\);\s*\})?\s*function\s+changeScheduleDay/g;

content = content.replace(misplacedIf, 'function changeScheduleDay');

// 2. Wrap window.addEventListener('DOMContentLoaded', initApp) in the proper if/else at line 845
const oldDomLoaded = /window\.addEventListener\('DOMContentLoaded',\s*initApp\);\s*\}\s*else\s*\{\s*initApp\(\);\s*\}/g;

const newDomLoaded = `if (document.readyState === 'loading') {\r\n      window.addEventListener('DOMContentLoaded', initApp);\r\n    } else {\r\n      initApp();\r\n    }`;

content = content.replace(oldDomLoaded, newDomLoaded);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed split if-else block!');
