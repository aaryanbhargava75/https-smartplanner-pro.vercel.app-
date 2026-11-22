const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf-8');

const scriptRegex = /<script(?:\s+([^>]*))?>([\s\S]*?)<\/script>/gi;
let match;
let idx = 0;

while ((match = scriptRegex.exec(content)) !== null) {
  idx++;
  const attrs = match[1] || '';
  const code = match[2];
  if (!code.trim() || attrs.includes('src=') || attrs.includes('application/ld+json')) continue;
  
  try {
    new Function(`(async () => {\n${code}\n})`);
    console.log(`Script #${idx} (${code.length} chars, attrs: "${attrs}"): Syntax 100% VALID`);
  } catch (err) {
    console.error(`Script #${idx} ERROR:`, err.message);
  }
}
