const fs = require('fs');
const filePath = 'smart-planner-ai.html';
let content = fs.readFileSync(filePath, 'utf-8');

const oldStr = `    // SIGN IN EXISTING USER (PASSWORD PROTECTED)\r\n      if (e) e.preventDefault();`;
const oldStrLF = `    // SIGN IN EXISTING USER (PASSWORD PROTECTED)\n      if (e) e.preventDefault();`;

const newStr = `    // SIGN IN EXISTING USER (PASSWORD PROTECTED)\r\n    async function handleAccountLogin(e) {\r\n      if (e) e.preventDefault();`;

if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  console.log('Replaced CRLF version');
} else if (content.includes(oldStrLF)) {
  content = content.replace(oldStrLF, newStr);
  console.log('Replaced LF version');
} else {
  // Regex fallback
  content = content.replace(/(\/\/\s*SIGN IN EXISTING USER[^\r\n]*[\r\n]+)\s*if\s*\(\s*e\s*\)\s*e\.preventDefault\(\);/, '$1    async function handleAccountLogin(e) {\r\n      if (e) e.preventDefault();');
  console.log('Replaced via regex');
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Restored handleAccountLogin declaration!');
