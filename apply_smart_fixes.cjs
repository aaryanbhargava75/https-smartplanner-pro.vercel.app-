const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'smart-planner-ai.html');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Original length:', content.length);

// 1. UPDATE loadInitialData()
const oldLoadInitialData = `    // Load Data from Supabase Cloud, Backend, or Isolated LocalStorage
    async function loadInitialData() {
      purgeLegacyLeakedData();
      await initAuth();
      updateThemeUI();

      const userEmail = (currentUser && currentUser.email) ? currentUser.email.trim().toLowerCase() : '';
      const userKey = getUserStorageKey();

      // 1. Try Supabase Cloud DB if connected
      if (supabaseClient && userEmail) {
        try {
          const cloudData = await loadSupabaseData();
          if (cloudData && (cloudData.tasks?.length || cloudData.expenses?.length || cloudData.assets?.length || cloudData.journal?.length || cloudData.milestones?.length)) {
            appData = { ...defaultSeedData, ...cloudData };
            localStorage.setItem(userKey, JSON.stringify(appData));
            const sel = document.getElementById('globalCurrencySelect');
            if (sel && appData.currencySymbol) sel.value = appData.currencySymbol;
            updateEngineStatus();
            return;
          }
        } catch (e) {
          console.warn('Supabase fetch error:', e);
        }
      }

      // 2. Check local Node.js backend loopback
      try {
        const url = userEmail ? \`/api/data?user=\${encodeURIComponent(userEmail)}\` : '/api/data';
        const res = await fetch(url, {
          headers: userEmail ? { 'x-user-email': userEmail } : {}
        });
        if (res.ok) {
          const remoteData = await res.json();
          if (remoteData && !remoteData.isNewUser && (remoteData.tasks?.length || remoteData.expenses?.length || remoteData.assets?.length || remoteData.journal?.length)) {
            appData = { ...defaultSeedData, ...remoteData };
            localStorage.setItem(userKey, JSON.stringify(appData));
            const sel = document.getElementById('globalCurrencySelect');
            if (sel && appData.currencySymbol) sel.value = appData.currencySymbol;
            updateEngineStatus();
            return;
          }
        }
      } catch (e) {}

      // 3. Isolated user-specific storage key in localStorage
      const local = localStorage.getItem(userKey);
      if (local) {
        try {
          appData = { ...defaultSeedData, ...JSON.parse(local) };
          const sel = document.getElementById('globalCurrencySelect');
          if (sel && appData.currencySymbol) sel.value = appData.currencySymbol;
          updateEngineStatus();
          return;
        } catch (e) {}
      }

      // Fresh state for this user/guest:
      appData = JSON.parse(JSON.stringify(defaultSeedData));

      const sel = document.getElementById('globalCurrencySelect');
      if (sel && appData.currencySymbol) sel.value = appData.currencySymbol;
      if (userEmail) {
        saveData();
      }
      updateEngineStatus();
    }`;

const newLoadInitialData = `    // Load Data from Supabase Cloud, Backend, or Isolated LocalStorage
    async function loadInitialData() {
      purgeLegacyLeakedData();
      await initAuth();
      updateThemeUI();

      const userEmail = (currentUser && currentUser.email) ? currentUser.email.trim().toLowerCase() : '';
      const userKey = getUserStorageKey();

      // 1. PRIORITY 1: Check localStorage FIRST (Preserves user's local work, prevents server defaults from wiping edits)
      const local = localStorage.getItem(userKey);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (parsed && typeof parsed === 'object') {
            appData = { ...defaultSeedData, ...parsed };
            const sel = document.getElementById('globalCurrencySelect');
            if (sel && appData.currencySymbol) sel.value = appData.currencySymbol;
            updateEngineStatus();
            // Asynchronously sync local data to backend
            try {
              const url = userEmail ? \`/api/data?user=\${encodeURIComponent(userEmail)}\` : '/api/data';
              fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(userEmail ? { 'x-user-email': userEmail } : {}) },
                body: JSON.stringify({ user: userEmail, data: appData })
              }).catch(() => {});
            } catch (e) {}
            return;
          }
        } catch (e) {
          console.warn('Local storage parse error:', e);
        }
      }

      // 2. PRIORITY 2: Try Supabase Cloud DB if connected
      if (supabaseClient && userEmail) {
        try {
          const cloudData = await loadSupabaseData();
          if (cloudData && (cloudData.tasks?.length || cloudData.expenses?.length || cloudData.assets?.length || cloudData.journal?.length || cloudData.milestones?.length)) {
            appData = { ...defaultSeedData, ...cloudData };
            localStorage.setItem(userKey, JSON.stringify(appData));
            const sel = document.getElementById('globalCurrencySelect');
            if (sel && appData.currencySymbol) sel.value = appData.currencySymbol;
            updateEngineStatus();
            return;
          }
        } catch (e) {
          console.warn('Supabase fetch error:', e);
        }
      }

      // 3. PRIORITY 3: Check Node.js backend loopback
      try {
        const url = userEmail ? \`/api/data?user=\${encodeURIComponent(userEmail)}\` : '/api/data';
        const res = await fetch(url, {
          headers: userEmail ? { 'x-user-email': userEmail } : {}
        });
        if (res.ok) {
          const remoteData = await res.json();
          if (remoteData && !remoteData.isNewUser && (remoteData.tasks?.length || remoteData.expenses?.length || remoteData.assets?.length || remoteData.journal?.length)) {
            appData = { ...defaultSeedData, ...remoteData };
            localStorage.setItem(userKey, JSON.stringify(appData));
            const sel = document.getElementById('globalCurrencySelect');
            if (sel && appData.currencySymbol) sel.value = appData.currencySymbol;
            updateEngineStatus();
            return;
          }
        }
      } catch (e) {}

      // 4. PRIORITY 4: Fallback for clean user / guest
      // If Aaryan or guest: load verified default seed dataset
      if (!userEmail || userEmail.includes('aaryan') || userEmail.includes('guest')) {
        appData = JSON.parse(JSON.stringify(defaultSeedData));
      } else {
        // Any OTHER user gets an isolated, clean starter workspace (NOT Aaryan's private tasks!)
        appData = {
          currencySymbol: '₹',
          tasks: [],
          expenses: [],
          journal: [],
          nutrition: {
            proteinGoal: 120,
            caloriesGoal: 2000,
            waterGoalMl: 3000,
            waterLoggedMl: 0,
            sleepHours: 7.5,
            meals: []
          },
          milestones: [],
          notToDoList: [],
          incomes: [],
          assets: []
        };
      }

      const sel = document.getElementById('globalCurrencySelect');
      if (sel && appData.currencySymbol) sel.value = appData.currencySymbol;
      localStorage.setItem(userKey, JSON.stringify(appData));
      if (userEmail) {
        saveData();
      }
      updateEngineStatus();
    }`;

if (!content.includes(oldLoadInitialData)) {
  console.error('ERROR: oldLoadInitialData not found!');
  process.exit(1);
}
content = content.replace(oldLoadInitialData, newLoadInitialData);
console.log('Step 1 complete: loadInitialData updated.');

// 2. ADD EASY LOGIN AND PROFILE SWITCHING HANDLERS
const oldAuthSection = `    // SIGN IN EXISTING USER (PASSWORD PROTECTED)
    async function handleAccountLogin(e) {`;

const newAuthSection = `    // EASY FRICTIONLESS LOGIN & MULTI-USER WORKSPACE SWITCHING
    function handleEasyLogin(e) {
      if (e) e.preventDefault();
      const input = document.getElementById('easyLoginInput');
      const raw = (input ? input.value : '').trim();
      if (!raw) {
        showAuthError('Please enter your Name or Email');
        input?.focus();
        return;
      }
      const isEmail = raw.includes('@');
      const cleanEmail = isEmail ? raw.toLowerCase() : \`\${raw.toLowerCase().replace(/[^a-z0-9]/g, '')}@workspace.local\`;
      const name = isEmail ? (raw.split('@')[0].charAt(0).toUpperCase() + raw.split('@')[0].slice(1)) : raw;
      quickSwitchProfile(cleanEmail, name);
    }
    window.handleEasyLogin = handleEasyLogin;

    async function quickSwitchProfile(email, name) {
      const cleanEmail = String(email).trim().toLowerCase();
      const displayName = name || cleanEmail.split('@')[0];
      
      currentUser = {
        email: cleanEmail,
        name: displayName,
        picture: \`https://api.dicebear.com/7.x/bottts/svg?seed=\${encodeURIComponent(cleanEmail)}\`
      };
      localStorage.setItem('smart-planner-auth-user', JSON.stringify(currentUser));
      closeLoginModal();
      updateAuthUI();
      await loadInitialData();
      renderAll();
      showToast(\`Switched to \${displayName}'s workspace!\`);
    }
    window.quickSwitchProfile = quickSwitchProfile;

    // SIGN IN EXISTING USER (PASSWORD PROTECTED)`;

if (!content.includes(oldAuthSection)) {
  console.error('ERROR: oldAuthSection not found!');
  process.exit(1);
}
content = content.replace(oldAuthSection, newAuthSection);
console.log('Step 2 complete: easy login handlers added.');

// 3. EXPAND FOOD_DATABASE WITH JUNK FOOD & COLD DRINKS ("GANDI CHEEZ")
const oldFoodDb = `    const FOOD_DATABASE = [
      // Eggs & Poultry`;

const newFoodDb = `    const FOOD_DATABASE = [
      // Fast Food, Junk Food, Street Food & Cold Drinks ("Gandi Cheez" & Beverages)
      { keys: ['thumbs up zero', 'thums up zero', 'coke zero', 'diet coke', 'pepsi black', 'zero soda', 'diet soda', 'zero cola'], cals: 1, p: 0, c: 0, f: 0, fiber: 0, ca: 0, fe: 0, vitC: 0 },
      { keys: ['thumbs up', 'thums up', 'coke', 'coca cola', 'pepsi', 'sprite', 'fanta', 'limca', 'mountain dew', 'cold drink', 'soft drink', 'soda'], cals: 140, p: 0, c: 35, f: 0, fiber: 0, ca: 0, fe: 0, vitC: 0 },
      { keys: ['shawarma roll', 'chicken shawarma', 'shawarma', 'shwarma'], cals: 420, p: 26, c: 35, f: 18, fiber: 2.5, ca: 60, fe: 2.0, vitC: 4 },
      { keys: ['peri peri chicken momos', 'chicken momos', 'momos chicken', 'chicken momo'], cals: 240, p: 16, c: 26, f: 7, fiber: 1.5, ca: 30, fe: 1.5, vitC: 2 },
      { keys: ['fried momos', 'kurkure momos'], cals: 320, p: 8, c: 32, f: 18, fiber: 1.5, ca: 25, fe: 1.2, vitC: 1 },
      { keys: ['veg momos', 'steamed momos', 'paneer momos', 'momos', 'momo'], cals: 180, p: 6, c: 28, f: 4, fiber: 2.0, ca: 40, fe: 1.2, vitC: 3 },
      { keys: ['pizza slice', 'pza slice', 'slice pizza', 'pizza', 'pza'], cals: 260, p: 10, c: 30, f: 11, fiber: 2.0, ca: 140, fe: 1.8, vitC: 2 },
      { keys: ['burger', 'chicken burger', 'veg burger', 'mcaloo tikki', 'crispy burger'], cals: 350, p: 14, c: 38, f: 16, fiber: 2.5, ca: 80, fe: 2.0, vitC: 3 },
      { keys: ['maggi', 'maggie', '2 minute noodles', 'instant noodles', 'noodles', 'chowmein', 'hakka noodles'], cals: 310, p: 7, c: 44, f: 12, fiber: 2.0, ca: 20, fe: 1.8, vitC: 0 },
      { keys: ['chips', 'lays', 'kurkure', 'bingo', 'doritos', 'namkeen', 'bhujia'], cals: 270, p: 3, c: 28, f: 16, fiber: 1.5, ca: 15, fe: 0.8, vitC: 5 },
      { keys: ['biscuit', 'biscuits', 'parle g', 'good day', 'oreo', 'cookie', 'cookies'], cals: 140, p: 2, c: 24, f: 4, fiber: 0.8, ca: 20, fe: 0.6, vitC: 0 },
      { keys: ['chole bhature', 'bhature', 'bhatura'], cals: 680, p: 16, c: 75, f: 34, fiber: 7.0, ca: 90, fe: 4.0, vitC: 5 },
      { keys: ['pav bhaji', 'bhaji'], cals: 400, p: 8, c: 52, f: 18, fiber: 4.5, ca: 50, fe: 2.5, vitC: 15 },
      { keys: ['samosa', 'aloo samosa'], cals: 250, p: 4, c: 28, f: 14, fiber: 2.0, ca: 20, fe: 1.2, vitC: 4 },
      { keys: ['kachori', 'khasta kachori'], cals: 280, p: 5, c: 26, f: 17, fiber: 2.5, ca: 25, fe: 1.5, vitC: 1 },
      { keys: ['pakora', 'pakode', 'bread pakora', 'bhajiya'], cals: 260, p: 6, c: 24, f: 16, fiber: 2.5, ca: 30, fe: 1.8, vitC: 3 },
      { keys: ['kathi roll', 'paneer roll', 'egg roll', 'chicken roll', 'roll', 'wrap'], cals: 390, p: 18, c: 40, f: 18, fiber: 3.0, ca: 80, fe: 2.2, vitC: 4 },
      { keys: ['french fries', 'fries'], cals: 310, p: 3.5, c: 41, f: 15, fiber: 3.5, ca: 15, fe: 0.8, vitC: 6 },
      { keys: ['beer', 'can beer', 'pint beer'], cals: 150, p: 1, c: 13, f: 0, fiber: 0, ca: 15, fe: 0.1, vitC: 0 },
      { keys: ['whiskey', 'rum', 'vodka', 'gin', 'daru', 'alcohol', 'scotch', 'peg'], cals: 130, p: 0, c: 0, f: 0, fiber: 0, ca: 0, fe: 0, vitC: 0 },
      { keys: ['ice cream', 'kulfi', 'soft serve'], cals: 210, p: 4, c: 28, f: 10, fiber: 0.5, ca: 120, fe: 0.2, vitC: 1 },
      { keys: ['gulab jamun', 'rasgulla', 'sweet', 'mithai', 'jalebi'], cals: 175, p: 3, c: 26, f: 7, fiber: 0.5, ca: 40, fe: 0.5, vitC: 0 },

      // Eggs & Poultry`;

if (!content.includes(oldFoodDb)) {
  console.error('ERROR: oldFoodDb not found!');
  process.exit(1);
}
content = content.replace(oldFoodDb, newFoodDb);
console.log('Step 3 complete: FOOD_DATABASE expanded.');

// 4. ADD isFoodClauseOrItem & autoSyncFoodExpenseToNutrition RIGHT AFTER estimateDishNutrition
const oldEstReturn = `      return {
        cals: Math.round(totalCals * mult),
        protein: Math.round(totalP * mult * 10) / 10,
        carbs: Math.round(totalC * mult * 10) / 10,
        fats: Math.round(totalF * mult * 10) / 10,
        fiber: Math.round(totalFiber * mult * 10) / 10,
        calcium: Math.round(totalCa * mult),
        iron: Math.round(totalFe * mult * 10) / 10,
        vitC: Math.round(totalVitC * mult),
        detectedItems: detected
      };
    }`;

const newEstReturn = `      return {
        cals: Math.round(totalCals * mult),
        protein: Math.round(totalP * mult * 10) / 10,
        carbs: Math.round(totalC * mult * 10) / 10,
        fats: Math.round(totalF * mult * 10) / 10,
        fiber: Math.round(totalFiber * mult * 10) / 10,
        calcium: Math.round(totalCa * mult),
        iron: Math.round(totalFe * mult * 10) / 10,
        vitC: Math.round(totalVitC * mult),
        detectedItems: detected
      };
    }

    // Check if an expense item or dump clause represents food/drinks
    function isFoodClauseOrItem(str) {
      if (!str || typeof str !== 'string') return false;
      const lower = str.toLowerCase().trim();
      const foodKeywords = /\\b(thumbs\\s*up|thums\\s*up|coke|diet\\s*coke|pepsi|sprite|fanta|limca|mountain\\s*dew|cold\\s*drink|soft\\s*drink|soda|shawarma|shwarma|momos?|momo|maggi|maggie|noodles|chowmein|cheel[ae]|chill[ae]|besan|chicken|paneer|tofu|eggs?|anda|omelette|bhurji|roti|parath[ae]|paranthe|dal|rice|chawal|khichdi|biryani|pulao|whey|protein|creatine|doodh|milk|curd|dahi|lassi|chaas|fruits?|banana|kela|apple|seb|papaya|mango|salad|burger|pizza|pza|sandwich|toast|bread|sprouts|soya|oats|oatmeal|muesli|chole|bhature|bhatura|rajma|kadhi|samosa|kachori|pakor[ae]|poha|upma|idli|dosa|fish|mutton|shake|smoothie|wrap|roll|chips|lays|kurkure|namkeen|biscuit|biscuits|parle|cookie|cookies|tea|chai|coffee|beer|whiskey|rum|vodka|daru|alcohol|fries|ice\\s*cream|kulfi|mithai|sweet|lunch|dinner|breakfast|snack|khana|sabzi)\\b/i;
      return foodKeywords.test(lower);
    }
    window.isFoodClauseOrItem = isFoodClauseOrItem;

    // Automatically sync food/drink purchases into appData.nutrition.meals
    function autoSyncFoodExpenseToNutrition(rawDishName, dateStr, amount) {
      if (!rawDishName) return;
      const lower = String(rawDishName).toLowerCase().trim();
      
      // Clean noise words
      let cleanDish = rawDishName
        .replace(/\\b(bro|bhai|yaar|kal|aaj|today|yesterday|meine|maine|mene|li|lee|liya|khaya|khayi|khaye|khae|khalie|khali|piya|piye|pi|pee|spent|kharcha|rupeek\\s*i|rupeek|rupaye?|rupees|rs\\.?|₹|inr|ka|ke|ki|aur|and)\\b/gi, ' ')
        .replace(/\\d+\\s*(?:rs|rupaye?|rupees|rpee|bucks)?/gi, ' ')
        .replace(/\\s+/g, ' ')
        .trim();

      let count = 1;
      const countMatch = lower.match(/\\b(\\d+)\\s*(?:thumbs|thums|coke|pizza|momos|shawarma|roti|eggs?|biscuit|pack|slice|beer|peg|cup|plate|glass)/i);
      if (countMatch && countMatch[1]) {
        count = parseFloat(countMatch[1]) || 1;
      }

      if (!cleanDish || cleanDish.length < 2) {
        cleanDish = rawDishName;
      }

      let displayDish = cleanDish.charAt(0).toUpperCase() + cleanDish.slice(1);
      if (/thumbs\\s*up\\s*zero|thums\\s*up\\s*zero/i.test(lower)) displayDish = count > 1 ? \`Thumbs Up Zero (\${count} cans)\` : 'Thumbs Up Zero';
      else if (/coke\\s*zero/i.test(lower)) displayDish = count > 1 ? \`Coke Zero (\${count} cans)\` : 'Coke Zero';
      else if (/diet\\s*coke/i.test(lower)) displayDish = count > 1 ? \`Diet Coke (\${count} cans)\` : 'Diet Coke';
      else if (/pza|pizza/i.test(lower)) displayDish = amount >= 300 ? 'Pizza (Medium / Dinner)' : 'Pizza (Slice)';
      else if (/momos?/i.test(lower)) displayDish = /chicken/i.test(lower) ? 'Chicken Momos' : 'Momos';
      else if (/shawarma|shwarma/i.test(lower)) displayDish = count > 1 ? \`Shawarma (\${count} pcs)\` : 'Shawarma';
      else if (/maggi|maggie/i.test(lower)) displayDish = count > 1 ? \`Maggi (\${count} packs)\` : 'Maggi';
      else if (/chai|tea/i.test(lower)) displayDish = 'Chai / Tea';
      else if (/chips|lays|kurkure/i.test(lower)) displayDish = 'Chips / Snack';

      if (!appData.nutrition) {
        appData.nutrition = { proteinGoal: 120, caloriesGoal: 2000, waterGoalMl: 3000, waterLoggedMl: 0, sleepHours: 7.5, meals: [] };
      }
      if (!Array.isArray(appData.nutrition.meals)) appData.nutrition.meals = [];

      const targetDate = dateStr || new Date().toISOString().split('T')[0];
      const targetIso = targetDate.includes('T') ? targetDate : \`\${targetDate}T\${new Date().toTimeString().slice(0, 8)}\`;

      // Prevent exact duplicates within the same day
      const isDuplicate = appData.nutrition.meals.some(m => {
        const mDate = (m.date || '').split('T')[0];
        const tDate = targetDate.split('T')[0];
        return mDate === tDate && m.dish && m.dish.toLowerCase() === displayDish.toLowerCase();
      });
      if (isDuplicate) return;

      const est = estimateDishNutrition(displayDish, count);
      const hour = new Date().getHours();
      const mealType = hour < 11 ? 'Breakfast' : hour < 16 ? 'Lunch' : hour < 19 ? 'Snacks' : 'Dinner';

      appData.nutrition.meals.unshift({
        id: 'meal_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        date: targetIso,
        dish: displayDish,
        mealType: mealType,
        portion: count,
        calories: est.cals,
        protein: est.protein || 0,
        carbs: est.carbs || 0,
        fats: est.fats || 0,
        fiber: est.fiber || 0,
        calcium: est.calcium || 0,
        iron: est.iron || 0,
        vitC: est.vitC || 0,
        source: 'Expense Sync'
      });

      showToast(\`🍗 Synced to Khana: \${displayDish} (+\${est.protein || 0}g Protein, \${est.cals} kcal)\`);
    }
    window.autoSyncFoodExpenseToNutrition = autoSyncFoodExpenseToNutrition;`;

if (!content.includes(oldEstReturn)) {
  console.error('ERROR: oldEstReturn not found!');
  process.exit(1);
}
content = content.replace(oldEstReturn, newEstReturn);
console.log('Step 4 complete: autoSyncFoodExpenseToNutrition implemented.');

// 5. HOOK autoSyncFoodExpenseToNutrition IN applyParsedData
const oldApplyExpenses = `      if (data.expenses?.length) {
        if (!appData.expenses) appData.expenses = [];
        data.expenses.filter(e => Number(e.amount) > 0).forEach(e => {
          appData.expenses.unshift({
            id: 'e_' + Math.random().toString(36).substr(2, 9),
            item: e.item || e.title || 'Expense',
            amount: Number(e.amount) || 0,
            category: e.category || 'Food & Dining',
            date: e.date || new Date().toISOString().split('T')[0],
            source: 'Auto-Extracted'
          });
        });
      }`;

const newApplyExpenses = `      if (data.expenses?.length) {
        if (!appData.expenses) appData.expenses = [];
        data.expenses.filter(e => Number(e.amount) > 0).forEach(e => {
          const expItem = e.item || e.title || 'Expense';
          const expAmt = Number(e.amount) || 0;
          const expCat = e.category || 'Food & Dining';
          const expDate = e.date || new Date().toISOString().split('T')[0];
          appData.expenses.unshift({
            id: 'e_' + Math.random().toString(36).substr(2, 9),
            item: expItem,
            amount: expAmt,
            category: expCat,
            date: expDate,
            source: 'Auto-Extracted'
          });
          // Auto-sync food purchases to Nutrition / Khana
          if (typeof autoSyncFoodExpenseToNutrition === 'function') {
            if (expCat === 'Food & Dining' || isFoodClauseOrItem(expItem) || isFoodClauseOrItem(rawInputText)) {
              autoSyncFoodExpenseToNutrition(expItem || rawInputText, expDate, expAmt);
            }
          }
        });
      }`;

if (!content.includes(oldApplyExpenses)) {
  console.error('ERROR: oldApplyExpenses not found!');
  process.exit(1);
}
content = content.replace(oldApplyExpenses, newApplyExpenses);
console.log('Step 5 complete: auto-sync hooked in applyParsedData.');

// 6. HOOK autoSyncFoodExpenseToNutrition IN fallbackClientParse
const oldFallbackSpend = `        // -------------------------------------------------------------
        // B. EXPENSES / MONEY SPENT / FOOD PURCHASE
        // -------------------------------------------------------------
        const hasSpendKeyword = /\\b(chips|coke|chai|coffee|pizza|burger|khana|swiggy|zomato|blinkit|zepto|auto|cab|uber|ola|metro|petrol|kharcha|spent|khalie|khaya|khai|piya|liya|khareeda|paid|debit|debit(?:ed)?|rs\\.?|₹|\\$|inr|rpee|rupaye?|rupees|bucks|ke\\s+(?:chips|coke|chai|saman))\\b/i.test(lower);
        const hasNumber = /\\d+/.test(lower);

        if (hasSpendKeyword && (hasNumber || /chips|kharcha|khalie/i.test(lower))) {
          if (!appData.expenses) appData.expenses = [];
          const numMatch = lower.match(/\\d+(?:,\\d+)*(?:\\.\\d+)?/);
          const amount = numMatch ? Number(numMatch[0].replace(/,/g, '')) : 30;

          let item = 'Snack / Expense';
          if (/chips/i.test(lower)) item = 'Chips / Snacks';
          else if (/coke/i.test(lower)) item = 'Coke / Beverage';
          else if (/chai|tea/i.test(lower)) item = 'Chai / Tea';
          else if (/coffee/i.test(lower)) item = 'Coffee';
          else if (/swiggy|zomato|khana/i.test(lower)) item = 'Food Delivery';
          else if (/auto|cab|uber|ola|metro/i.test(lower)) item = 'Travel / Transit';
          else if (/petrol/i.test(lower)) item = 'Fuel / Petrol';
          else {
            const clean = clause.replace(/\\b(\\d+|ka|ke|ki|rs|rpee|rupaye?|rupees|inr|kharcha|spent|khalie|khaya|khai|bhai|yaar)\\b/gi, '').trim();
            item = clean.length > 2 ? clean.charAt(0).toUpperCase() + clean.slice(1) : 'General Expense';
          }

          appData.expenses.unshift({
            id: 'e_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            item: item,
            amount: amount,
            category: /auto|cab|uber|ola|metro|petrol/i.test(lower) ? 'Transport' : 'Food & Dining',
            date: today,
            source: 'Auto-Extracted'
          });
          expensesAdded++;
          return; // Strictly skip adding to tasks!
        }`;

const newFallbackSpend = `        // -------------------------------------------------------------
        // B. EXPENSES / MONEY SPENT / FOOD PURCHASE
        // -------------------------------------------------------------
        const hasSpendKeyword = /\\b(chips|coke|chai|coffee|pizza|pza|burger|khana|shawarma|shwarma|momos?|maggi|maggie|thumbs\\s*up|thums\\s*up|cold\\s*drink|swiggy|zomato|blinkit|zepto|auto|cab|uber|ola|metro|petrol|kharcha|spent|khalie|khaya|khai|piya|liya|li|lee|khareeda|paid|debit|debit(?:ed)?|rs\\.?|₹|\\$|inr|rpee|rupeek?\\s*i?|rupaye?|rupees|bucks|ke\\s+(?:chips|coke|chai|saman))\\b/i.test(lower);
        const hasNumber = /\\d+/.test(lower);

        if (hasSpendKeyword && (hasNumber || /chips|kharcha|khalie|shawarma|momos|coke|thumbs/i.test(lower))) {
          if (!appData.expenses) appData.expenses = [];
          const numMatch = lower.match(/\\d+(?:,\\d+)*(?:\\.\\d+)?/);
          const amount = numMatch ? Number(numMatch[0].replace(/,/g, '')) : 30;

          let item = 'Snack / Expense';
          if (/thumbs\\s*up\\s*zero|thums\\s*up\\s*zero/i.test(lower)) item = 'Thumbs Up Zero';
          else if (/thumbs\\s*up|thums\\s*up/i.test(lower)) item = 'Thumbs Up';
          else if (/coke\\s*zero/i.test(lower)) item = 'Coke Zero';
          else if (/coke/i.test(lower)) item = 'Coke / Beverage';
          else if (/shawarma|shwarma/i.test(lower)) item = 'Shawarma';
          else if (/momos?/i.test(lower)) item = 'Momos';
          else if (/pizza|pza/i.test(lower)) item = 'Pizza';
          else if (/maggi|maggie/i.test(lower)) item = 'Maggi';
          else if (/chips/i.test(lower)) item = 'Chips / Snacks';
          else if (/chai|tea/i.test(lower)) item = 'Chai / Tea';
          else if (/coffee/i.test(lower)) item = 'Coffee';
          else if (/swiggy|zomato|khana/i.test(lower)) item = 'Food Delivery';
          else if (/auto|cab|uber|ola|metro/i.test(lower)) item = 'Travel / Transit';
          else if (/petrol/i.test(lower)) item = 'Fuel / Petrol';
          else {
            const clean = clause.replace(/\\b(\\d+|ka|ke|ki|rs|rpee|rupeek?\\s*i?|rupaye?|rupees|inr|kharcha|spent|khalie|khaya|khai|li|lee|liya|bhai|yaar)\\b/gi, '').trim();
            item = clean.length > 2 ? clean.charAt(0).toUpperCase() + clean.slice(1) : 'General Expense';
          }

          const cat = /auto|cab|uber|ola|metro|petrol/i.test(lower) ? 'Transport' : 'Food & Dining';
          appData.expenses.unshift({
            id: 'e_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            item: item,
            amount: amount,
            category: cat,
            date: today,
            source: 'Auto-Extracted'
          });
          expensesAdded++;

          // Auto-sync food expense into nutrition meals
          if (cat === 'Food & Dining' || isFoodClauseOrItem(item) || isFoodClauseOrItem(clause)) {
            if (typeof autoSyncFoodExpenseToNutrition === 'function') {
              autoSyncFoodExpenseToNutrition(clause, today, amount);
            }
          }

          return; // Strictly skip adding to tasks!
        }`;

if (!content.includes(oldFallbackSpend)) {
  console.error('ERROR: oldFallbackSpend not found!');
  process.exit(1);
}
content = content.replace(oldFallbackSpend, newFallbackSpend);
console.log('Step 6 complete: auto-sync hooked in fallbackClientParse.');

// 7. HOOK autoSyncFoodExpenseToNutrition IN handleManualExpense
const oldManualExpense = `        appData.expenses.unshift({
          id: 'e_' + Date.now().toString(36),
          item: item,
          amount: amount,
          category: cat,
          date: dt,
          source: 'Manual'
        });
        showToast(\`Logged \${formatCurrency(amount, true)} for \${item}\`);
      }`;

const newManualExpense = `        appData.expenses.unshift({
          id: 'e_' + Date.now().toString(36),
          item: item,
          amount: amount,
          category: cat,
          date: dt,
          source: 'Manual'
        });
        showToast(\`Logged \${formatCurrency(amount, true)} for \${item}\`);
        if (cat === 'Food & Dining' || (typeof isFoodClauseOrItem === 'function' && isFoodClauseOrItem(item))) {
          if (typeof autoSyncFoodExpenseToNutrition === 'function') {
            autoSyncFoodExpenseToNutrition(item, dt, amount);
            if (typeof renderKhanaView === 'function') renderKhanaView();
          }
        }
      }`;

if (!content.includes(oldManualExpense)) {
  console.error('ERROR: oldManualExpense not found!');
  process.exit(1);
}
content = content.replace(oldManualExpense, newManualExpense);
console.log('Step 7 complete: auto-sync hooked in handleManualExpense.');

// WRITE BACK
fs.writeFileSync(filePath, content, 'utf-8');
console.log('ALL FIXES SUCCESSFULLY APPLIED TO smart-planner-ai.html! New length:', content.length);
