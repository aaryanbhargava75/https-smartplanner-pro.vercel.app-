const fs = require('fs');

let html = fs.readFileSync('smart-planner-ai.html', 'utf8');

// 1. Add pattern 4 to extractTimeFromText
const oldExtractTimeEnd = `        // 3. "17:00", "18:30"
        const m3 = lower.match(/\\b([01]?\\d|2[0-3]):([0-5]\\d)\\b/);
        if (m3) {
          return \`\${String(m3[1]).padStart(2, '0')}:\${m3[2]}\`;
        }

        return null;`;

const newExtractTimeEnd = `        // 3. "17:00", "18:30"
        const m3 = lower.match(/\\b([01]?\\d|2[0-3]):([0-5]\\d)\\b/);
        if (m3) {
          return \`\${String(m3[1]).padStart(2, '0')}:\${m3[2]}\`;
        }

        // 4. "kal 12", "aaj 12", "at 12", "by 12", "ko 12"
        const m4 = lower.match(/\\b(?:kal|aaj|at|by|ko|around|shaam|dopahar|subah|raat)\\s+(\\d{1,2})\\b/i);
        if (m4) {
          let h = parseInt(m4[1], 10);
          if (h >= 1 && h <= 6) h += 12; // 1 to 6 default to PM
          return \`\${String(h).padStart(2, '0')}:00\`;
        }

        return null;`;

if (html.includes(oldExtractTimeEnd)) {
  html = html.replace(oldExtractTimeEnd, newExtractTimeEnd);
  console.log('✔ Updated extractTimeFromText with m4 pattern');
} else {
  console.log('✖ Could not find oldExtractTimeEnd');
}

// 2. Improve meeting person cleaning in fallbackClientParse
const oldMeetingCleaning = `          // Polish meeting titles (e.g. "nitin bhaia ke saaath meeting" -> "Meeting with Nitin Bhaiya")
          if (isMeeting || /ke\\s*(?:saaath|saath|sath)\\s*meeting/i.test(lower)) {
            let person = cleanTitle.replace(/\\b(ke\\s*saaath|ke\\s*saath|ke\\s*sath|with|meeting|call|sync|appointment)\\b/gi, '').trim();
            if (person) {
              person = person.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
                .replace(/bhaia\\b/i, 'Bhaiya').replace(/bhaiya\\b/i, 'Bhaiya');
              cleanTitle = \`Meeting with \${person}\`;
            } else {
              cleanTitle = 'Meeting';
            }
          }`;

const newMeetingCleaning = `          // Polish meeting titles (e.g. "bola na tarun ke saath meeting set krde kal 12" -> "Meeting with Tarun")
          if (isMeeting || /ke\\s*(?:saaath|saath|sath)\\s*meeting/i.test(lower)) {
            let person = cleanTitle
              .replace(/\\b(ke\\s*saaath|ke\\s*saath|ke\\s*sath|with|meeting|call|sync|appointment)\\b/gi, '')
              .replace(/\\b(bola\\s*na|bol\\s*raha\\s*hun|sun\\s*na|sun|set\\s*krde|set\\s*kar\\s*do|set\\s*karo|kal|aaj|parson|today|tomorrow|\\d{1,2}(?::\\d{2})?)\\b/gi, '')
              .replace(/[^a-zA-Z\\s]/g, '')
              .trim();
            if (person && person.length >= 2) {
              person = person.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
                .replace(/bhaia\\b/i, 'Bhaiya').replace(/bhaiya\\b/i, 'Bhaiya');
              cleanTitle = \`Meeting with \${person}\`;
            } else {
              cleanTitle = 'Meeting';
            }
          }`;

if (html.includes(oldMeetingCleaning)) {
  html = html.replace(oldMeetingCleaning, newMeetingCleaning);
  console.log('✔ Updated meeting title cleaning');
} else {
  console.log('✖ Could not find oldMeetingCleaning');
}

fs.writeFileSync('smart-planner-ai.html', html, 'utf8');
console.log('Done polish patch');
