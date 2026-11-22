const fs = require('fs');

let html = fs.readFileSync('smart-planner-ai.html', 'utf8');

const oldFetchCheck = `        // 1. Try local Node.js backend loopback first (if running locally)
        try {
          const res = await fetch('/api/parse', {`;

const newFetchCheck = `        // 1. Try local Node.js backend loopback first (if running locally over http/https)
        if (window.location.protocol.startsWith('http')) {
          try {
            const res = await fetch('/api/parse', {`;

// and close the if
const oldCatchEnd = `        } catch (err) {
          // Backend not available (e.g. deployed on Netlify)
        }`;

const newCatchEnd = `          } catch (err) {
            // Backend not available (e.g. deployed on Netlify)
          }
        }`;

if (html.includes(oldFetchCheck) && html.includes(oldCatchEnd)) {
  html = html.replace(oldFetchCheck, newFetchCheck);
  html = html.replace(oldCatchEnd, newCatchEnd);
  fs.writeFileSync('smart-planner-ai.html', html, 'utf8');
  console.log('✔ Added http check around /api/parse fetch');
} else {
  console.log('✖ Could not find oldFetchCheck');
}
