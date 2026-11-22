const fs = require('fs');
const filePath = 'smart-planner-ai.html';
let content = fs.readFileSync(filePath, 'utf-8');

const targetStr = `        if (hasSpendKeyword && (hasNumber || /chips|kharcha|khalie|shawarma|momos|coke|thumbs/i.test(lower))) {
          if (!appData.expenses) appData.expenses = [];
          const numMatch = lower.match(/\\d+(?:,\\d+)*(?:\\.\\d+)?/);
          const amount = numMatch ? Number(numMatch[0].replace(/,/g, '')) : 30;`;

const replacementStr = `        if (hasSpendKeyword && (hasNumber || /chips|kharcha|khalie|shawarma|momos|coke|thumbs/i.test(lower))) {
          if (!appData.expenses) appData.expenses = [];
          const moneyMatch = lower.match(/(?:rs\\.?|₹|\\$|inr|rpee|rupeek?\\s*i?|rupaye?|rupees|bucks)\\s*(\\d+(?:,\\d+)*(?:\\.\\d+)?)/i) ||
                             lower.match(/(\\d+(?:,\\d+)*(?:\\.\\d+)?)\\s*(?:rs|rpee|rupeek?\\s*i?|rupaye?|rupees|bucks|inr)/i);
          const numMatch = moneyMatch ? [moneyMatch[1]] : lower.match(/\\d+(?:,\\d+)*(?:\\.\\d+)?/);
          const amount = numMatch ? Number(numMatch[0].replace(/,/g, '')) : 30;`;

// Handle CRLF
const targetCRLF = targetStr.replace(/\n/g, '\r\n');
const replacementCRLF = replacementStr.replace(/\n/g, '\r\n');

if (content.includes(targetCRLF)) {
  content = content.replace(targetCRLF, replacementCRLF);
  console.log('Replaced CRLF in fallbackClientParse!');
} else if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  console.log('Replaced LF in fallbackClientParse!');
} else {
  console.error('ERROR: targetStr not found in fallbackClientParse!');
  process.exit(1);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Updated fallbackClientParse successfully!');
