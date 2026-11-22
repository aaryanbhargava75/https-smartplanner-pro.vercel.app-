const fs = require('fs');
const filePath = 'smart-planner-ai.html';
let content = fs.readFileSync(filePath, 'utf-8');

const target = `          if (!appData.expenses) appData.expenses = [];
          const numMatch = lower.match(/\\d+(?:,\\d+)*(?:\\.\\d+)?/);
          const amount = numMatch ? Number(numMatch[0].replace(/,/g, '')) : 30;`;

const replacement = `          if (!appData.expenses) appData.expenses = [];
          const moneyMatch = lower.match(/(?:rs\\.?|₹|\\$|inr|rpee|rupeek?\\s*i?|rupaye?|rupees|bucks)\\s*(\\d+(?:,\\d+)*(?:\\.\\d+)?)/i) ||
                             lower.match(/(\\d+(?:,\\d+)*(?:\\.\\d+)?)\\s*(?:rs|rpee|rupeek?\\s*i?|rupaye?|rupees|bucks|inr)/i);
          const numMatch = moneyMatch ? [moneyMatch[1]] : lower.match(/\\d+(?:,\\d+)*(?:\\.\\d+)?/);
          const amount = numMatch ? Number(numMatch[0].replace(/,/g, '')) : 30;`;

if (!content.includes(target)) {
  // Try CRLF
  const targetCRLF = target.replace(/\n/g, '\r\n');
  const replacementCRLF = replacement.replace(/\n/g, '\r\n');
  if (!content.includes(targetCRLF)) {
    console.error('ERROR: target not found!');
    process.exit(1);
  }
  content = content.replace(targetCRLF, replacementCRLF);
} else {
  content = content.replace(target, replacement);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed money match logic in fallbackClientParse!');
