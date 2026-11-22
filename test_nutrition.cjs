const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'smart-planner-ai.html'), 'utf-8');

const foodDbStart = content.indexOf('const FOOD_DATABASE = [');
const foodDbEnd = content.indexOf('];', foodDbStart) + 2;
eval(content.slice(foodDbStart, foodDbEnd).replace('const FOOD_DATABASE', 'var FOOD_DATABASE'));

const estStart = content.indexOf('function estimateDishNutrition(');
const estEnd = content.indexOf('// Check if an expense item', estStart);
eval(content.slice(estStart, estEnd));

const isFoodStart = content.indexOf('function isFoodClauseOrItem(');
const isFoodEnd = content.indexOf('window.isFoodClauseOrItem', isFoodStart);
eval(content.slice(isFoodStart, isFoodEnd));

console.log('Testing estimateDishNutrition:');

const testCases = [
  'thumbs up zero',
  '2 thumbs up zero',
  'coke zero',
  'pizza slice',
  'shawarma',
  'chicken momos',
  'maggi',
  'chips'
];

for (const tc of testCases) {
  const res = estimateDishNutrition(tc);
  console.log(`"${tc}" -> cals: ${res.cals}, protein: ${res.protein}g, detected: ${JSON.stringify(res.detectedItems)}`);
}

console.log('\nTesting isFoodClauseOrItem:');
const foodPhrases = [
  'bro kal 2 thumbs up zero li 20 rupeek i',
  '520 ka pza khalia',
  '180 ka shawarma',
  'coke zero 20 rs',
  'maggi 30 rs',
  'meeting set krde 4 baje',
  '10 se 12 coding'
];

for (const phrase of foodPhrases) {
  console.log(`"${phrase}" -> isFood: ${isFoodClauseOrItem(phrase)}`);
}
