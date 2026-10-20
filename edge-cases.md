# ⚠️ Edge Cases & Failure Mode Analysis: Smart Planner AI

This document catalogs critical edge cases, failure modes, and automated recovery strategies across all layers of the Smart Planner AI (Dayframe Pro) platform.

---

## 1. Multimodal AI Input Edge Cases

### 1.1 Mixed Hinglish & Code-Switching Speech
* **Scenario:** User records: *"Subah 10:30 standup call hai client k sath, fir 1 baje presentation, aur shaam ko 450 rs zomato lunch."*
* **Risk:** Standard Whisper or English LLMs misinterpret colloquial verbs or translate numbers into literal phonetic words.
* **Mitigation:**
  - Groq Whisper Large v3 configured with language auto-detect (`prompt: "Hindi English Hinglish code-switching daily tasks schedule"`).
  - Llama-3.3-70b system prompt includes 5 few-shot Hinglish examples mapping words like *"shaam"*, *"subah"*, *"dopahar"*, and *"rs / rupay"* directly to ISO times and currency values.

### 1.2 Blurry, Cropped, or Low-Contrast UPI Screenshots
* **Scenario:** User snaps a screenshot of a Google Pay or Paytm payment screen under low lighting or cropped header.
* **Risk:** OCR fails to extract the transaction amount or confuses the transaction ID with the amount.
* **Mitigation:**
  - Regex pre-filter scans OCR text for Indian currency symbols (`₹`, `INR`, `Rs`, `Rs.`) followed by digits `[0-9]+(\.[0-9]{2})?`.
  - Confidence scoring: If OCR confidence < 70%, the capture bar highlights the extracted amount with an edit badge for 1-tap confirmation.

### 1.3 Ambiguous or Missing Relative Timestamps
* **Scenario:** User types *"Call dentist tomorrow"* or *"Review contract in the afternoon"*.
* **Risk:** LLM assigns an arbitrary or invalid date/time.
* **Mitigation:**
  - System injects dynamic client context (`current_local_time`, `today_date`, `user_timezone`) into the prompt header.
  - Defaults: *"Morning"* &rarr; 09:00, *"Afternoon"* &rarr; 14:00, *"Evening"* &rarr; 19:00.
  - If no time can be reasonably inferred, the item is routed to the **Task Backlog** (unassigned) rather than forcing an arbitrary dial block.

### 1.4 Overlapping / Conflicting Time Blocks
* **Scenario:** User dumps: *"10am to 12pm deep coding, 11am client sync"*.
* **Risk:** Schedule dial renders overlapping blocks, creating visual collision and confusion.
* **Mitigation:**
  - Collision Detection Algorithm: The engine sorts blocks by start time.
  - If Block B overlaps Block A, the system prioritizes the higher priority task, renders the conflict with an amber warning badge, and suggests the next contiguous open slot.

---

## 2. 24-Hour Circular Dial & Visual Edge Cases

### 2.1 Midnight Wraparound Schedule Blocks (23:00 to 02:00)
* **Scenario:** User schedules a sleep block or late-night coding sprint starting at 23:00 and ending at 02:00.
* **Risk:** Standard SVG arc calculation (`endAngle - startAngle`) produces a negative angle (`30° - 345° = -315°`), causing the arc to invert or fail to render.
* **Mitigation:**
  - Trigonometric Wrap: If `endTime < startTime`, the arc renderer splits the block into two contiguous visual segments:
    - Segment 1: `startTime` to `24:00` (Angle `345°` to `360°`)
    - Segment 2: `00:00` to `endTime` (Angle `0°` to `30°`)
  - Both segments share the same block ID and hover tooltip.

### 2.2 Micro-Tasks (< 5 Minutes)
* **Scenario:** User adds a 2-minute task: *"Take medicine at 14:00"*.
* **Risk:** 2 minutes represents only 0.5° on a 360° dial (`2 * 0.25° = 0.5°`), making the block invisible and unclickable.
* **Mitigation:**
  - Minimum visual threshold: All blocks have a minimum display thickness of `2.5°` (~10 minutes visual width) with a dot anchor for micro-tasks.

### 2.3 Dense Block Clustering (> 15 Blocks in 3 Hours)
* **Scenario:** User packs 10 quick calls between 14:00 and 16:00.
* **Risk:** Label collisions and unreadable text overlays on the circular dial.
* **Mitigation:**
  - Labels hide automatically if arc length is under 15°; details display on hover/tap via floating tooltip card.

---

## 3. Storage, Sync & Offline Edge Cases

### 3.1 LocalStorage 5MB Quota Limit
* **Scenario:** User logs months of high-volume journal entries, task archives, and receipts.
* **Risk:** Mobile browsers (Safari/Chrome) throw `QuotaExceededError`, breaking the app.
* **Mitigation:**
  - Storage Manager: Automated LRU (Least Recently Used) archival purges completed tasks and ephemeral journal entries older than 30 days from local cache, while preserving them in Supabase Cloud.
  - Storage telemetry monitor in Settings displays current storage consumption.

### 3.2 Offline Mode & Mid-Network Disconnects
* **Scenario:** User adds tasks while in subway or airplane mode, then reconnects with intermittent connectivity.
* **Risk:** Network request fails and writes are lost.
* **Mitigation:**
  - **Local-First Guarantee:** UI writes synchronously to `localStorage` first.
  - An offline sync queue (`sync_pending_queue`) holds un-synced items with exponential backoff retry when `navigator.onLine` fires.

### 3.3 Multi-Tab Concurrent Edits (Race Conditions)
* **Scenario:** User opens Dayframe in Tab A and Tab B simultaneously and checks off tasks in both.
* **Risk:** Tab B overwrites Tab A's state on blur/unload.
* **Mitigation:**
  - Window `storage` event listener detects changes across tabs and triggers automatic reactive state re-hydration.

### 3.4 Guest to Authenticated Account Transition
* **Scenario:** User uses Dayframe in Guest mode for 3 days, then signs in with Google OAuth.
* **Risk:** Local guest data is overwritten by an empty cloud account.
* **Mitigation:**
  - Account Migration Prompt: Upon login, system detects local guest data and prompts: *"Merge your local guest tasks and schedule into your cloud account?"* with 1-click non-destructive upsert.

---

## 4. Finance, Currency & Export Edge Cases

### 4.1 Currency Switcher with Mixed Records
* **Scenario:** User logs an expense of ₹500 in INR mode, then switches currency to USD (`$`).
* **Risk:** The app displays "$500", artificially multiplying user expenses tenfold.
* **Mitigation:**
  - Monetary values are stored with an explicit currency code `{ amount: 500, currency: "INR" }`.
  - The currency switcher acts as an active input preference, but does not alter historical record currency tags.

### 4.2 Excel CSV Export Encoding (Rupee Symbol & Asian Characters)
* **Scenario:** User exports CSV and opens it in Microsoft Excel on Windows.
* **Risk:** Excel defaults to ANSI encoding on Windows, causing `₹`, accented letters, or Hindi scripts to display as garbled characters (`â‚¹500`).
* **Mitigation:**
  - The CSV generator prepends the UTF-8 Byte Order Mark (`\uFEFF`) at byte 0 of the export stream, forcing Excel to parse the file in full UTF-8 encoding.

### 4.3 Task Titles with Commas, Quotes, and Line Breaks
* **Scenario:** Task title: `Meeting with "Acme, Inc.", discuss Q3 budget`.
* **Risk:** Breaks standard CSV column separation, shifting data into wrong columns.
* **Mitigation:**
  - All CSV cell values are enclosed in double quotes and internal quotes are escaped (`""`) according to RFC 4180 standards.
