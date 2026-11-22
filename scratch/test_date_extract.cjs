const fs = require('fs');
const content = fs.readFileSync('smart-planner-ai.html', 'utf8');

// Extract the functions extractDateFromText and extractTimeFromText
const fn1Idx = content.indexOf('function extractDateFromText');
const fn1End = content.indexOf('\n      function ', fn1Idx + 10);
const fn1 = content.slice(fn1Idx, fn1End);

const fn2Idx = content.indexOf('function extractTimeFromText');
const fn2End = content.indexOf('\n      function ', fn2Idx + 10);
const fn2 = content.slice(fn2Idx, fn2End);

eval(fn1);
eval(fn2);

const testPhrase = 'bola na tarun ke saath meeting set krde kal 12';
console.log('Test text:', testPhrase);
console.log('Extracted date:', extractDateFromText(testPhrase));
console.log('Extracted time:', extractTimeFromText(testPhrase));
