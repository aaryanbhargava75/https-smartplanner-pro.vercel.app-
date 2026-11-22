const fs = require('fs');

let html = fs.readFileSync('smart-planner-ai.html', 'utf8');

console.log('Original length:', html.length);

// 1. UPDATE DESKTOP NAV
// Replace the hidden hooks with visible Habit Shield button
const oldNavSecondary = `        <!-- Hidden hooks for secondary views -->
        <button data-tab="focus" onclick="switchTab('focus')" class="hidden nav-item"></button>
        <button data-tab="wealth" onclick="switchTab('wealth')" class="hidden nav-item"></button>
        <button data-tab="screentime" onclick="switchTab('screentime')" class="hidden nav-item"></button>
        <button data-tab="analytics" onclick="switchTab('analytics')" class="hidden nav-item"></button>`;

const newNavSecondary = `        <!-- Habit Shield (Not-To-Do Calendar) -->
        <button data-tab="screentime" onclick="switchTab('screentime')"
          class="nav-item flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all text-[#b4bab0] hover:bg-[#161913] hover:text-white font-normal">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[18px] text-[#e59a38]">shield</span>
            <span>Habit Shield</span>
          </div>
          <span id="shieldNavBadge" class="text-xs text-[#a6aca0] font-medium tabular-nums"></span>
        </button>`;

if (html.includes(oldNavSecondary)) {
  html = html.replace(oldNavSecondary, newNavSecondary);
  console.log('✔ Replaced desktop nav hooks with visible Habit Shield');
} else {
  console.log('✖ Could not find oldNavSecondary');
}

// 2. UPDATE MOBILE NAV
// Replace focus & wealth in mobile nav with Habit Shield & Schedule
const oldMobileNavFocus = `<button onclick="switchTab('focus')" data-mobile-tab="focus"
      class="mobile-nav-item flex flex-col items-center justify-center p-1 text-on-surface-variant hover:text-on-surface transition-colors">
      <span class="material-symbols-outlined text-[20px]">timer</span>
      <span class="text-[10px] font-medium">Focus</span>
    </button>`;

const newMobileNavShield = `<button onclick="switchTab('screentime')" data-mobile-tab="screentime"
      class="mobile-nav-item flex flex-col items-center justify-center p-1 text-on-surface-variant hover:text-on-surface transition-colors">
      <span class="material-symbols-outlined text-[20px]">shield</span>
      <span class="text-[10px] font-medium">Shield</span>
    </button>`;

if (html.includes(oldMobileNavFocus)) {
  html = html.replace(oldMobileNavFocus, newMobileNavShield);
  console.log('✔ Replaced mobile nav focus with shield');
} else {
  console.log('✖ Could not find oldMobileNavFocus');
}

// Remove wealth from mobile nav if present
const oldMobileWealthRegex = /<button onclick="switchTab\('wealth'\)"[\s\S]*?<\/button>/;
if (oldMobileWealthRegex.test(html)) {
  html = html.replace(oldMobileWealthRegex, '');
  console.log('✔ Removed mobile wealth button');
}

// 3. COMPLETELY HIDE / DISABLE REMOVED HUBS
// Add style="display:none !important;" and class hidden to tab-focus, tab-wealth, tab-analytics, tab-dump
const hubsToHide = ['tab-focus', 'tab-wealth', 'tab-analytics', 'tab-dump'];
hubsToHide.forEach(id => {
  const re = new RegExp(`<section([^>]*id=["']${id}["'][^>]*)>`, 'i');
  if (re.test(html)) {
    html = html.replace(re, (match, attrs) => {
      let cleanAttrs = attrs.replace(/style=["'][^"']*["']/i, '');
      return `<section${cleanAttrs} style="display: none !important;" class="tab-pane hidden pointer-events-none">`;
    });
    console.log(`✔ Permanently hid section ${id}`);
  } else {
    console.log(`✖ Section ${id} not matched`);
  }
});

fs.writeFileSync('smart-planner-ai.html', html, 'utf8');
console.log('Done test patch 1');
