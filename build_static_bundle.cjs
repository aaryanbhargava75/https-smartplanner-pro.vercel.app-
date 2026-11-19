const fs = require('fs');
const path = require('path');

const plannerData = fs.readFileSync(path.join(__dirname, 'planner-data.json'), 'utf-8');
fs.writeFileSync(path.join(__dirname, 'default_data.js'), `export default ${plannerData};\n`, 'utf-8');
console.log('Generated default_data.js');

const html = fs.readFileSync(path.join(__dirname, 'smart-planner-ai.html'), 'utf-8');
fs.writeFileSync(path.join(__dirname, 'html_content.js'), `export default ${JSON.stringify(html)};\n`, 'utf-8');
console.log('Generated html_content.js');
