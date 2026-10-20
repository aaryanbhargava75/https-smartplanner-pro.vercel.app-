# 📋 Implementation Plan: Smart Planner AI (Dayframe Pro)

## 1. Project Overview & Delivery Strategy

The implementation of Smart Planner AI follows a modular, local-first engineering strategy. Development is structured across six systematic phases, ensuring each subsystem is fully testable and functional offline before connecting to cloud AI and database services.

---

## 2. Phase-by-Phase Roadmap

```mermaid
gantt
    title Smart Planner AI Implementation Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: Core UI & Dial
    Design Tokens & Glassmorphic CSS       :done, p1_1, 2026-09-01, 5d
    24h Circadian SVG Dial Engine          :done, p1_2, 2026-09-06, 7d
    section Phase 2: Multimodal AI
    Web Audio Recorder & Whisper v3        :done, p2_1, 2026-09-13, 6d
    Tesseract.js OCR Receipt Pipeline      :done, p2_2, 2026-09-19, 5d
    Groq Llama-3.3 Extraction Prompts      :done, p2_3, 2026-09-24, 6d
    section Phase 3: Productivity Core
    Eisenhower Priority Task Backlog       :done, p3_1, 2026-09-30, 4d
    Pomodoro Focus Timer & Chimes          :done, p3_2, 2026-10-04, 4d
    Not-To-Do Guardrail Shield             :done, p3_3, 2026-10-08, 3d
    section Phase 4: Finance & Hub
    Income/Expense Ledger Engine           :done, p4_1, 2026-10-11, 4d
    Bank SMS & Webhook Simulator           :done, p4_2, 2026-10-15, 3d
    section Phase 5: Cloud & Offline
    PWA Service Worker & Cache             :done, p5_1, 2026-10-18, 3d
    Supabase Postgres Multi-Tenant Sync    :done, p5_2, 2026-10-21, 4d
    section Phase 6: Polish & Export
    Excel UTF-8 BOM CSV Exporter           :done, p6_1, 2026-10-25, 2d
    Vercel Production Deployment           :done, p6_2, 2026-10-27, 2d
```

---

## 3. Detailed Phase Breakdown

### Phase 1: Core Shell, Design Tokens & 24h Circular Dial Engine
* **Objective:** Establish the visual foundation and interactive circular dial.
* **Key Tasks:**
  1. Define CSS custom properties for circadian day/night sectors (Deep Night, Morning Focus, Afternoon Execution, Evening Rest).
  2. Implement SVG math: map 24-hour timestamps to 360° circular polar coordinates (`x = cx + r * cos(theta)`, `y = cy + r * sin(theta)`).
  3. Build the live real-time pulsing sweep hand updated via `setInterval` every 60 seconds.
  4. Enable click-and-drag schedule block resizing directly on the circular arc.
* **Acceptance Criteria:** Dial renders at smooth 60 FPS without layout shift or dropped frames.

### Phase 2: Multimodal AI Brain Dump Pipeline
* **Objective:** Enable effortless capture via Voice, Screenshots, and raw text.
* **Key Tasks:**
  1. Integrate `MediaRecorder` API for voice recording with fallback to WhatsApp audio file upload (`.m4a`, `.opus`, `.wav`).
  2. Connect **Groq Whisper Large v3** edge endpoint (`POST /api/ai/brain-dump`) for sub-second speech-to-text.
  3. Implement clipboard paste event (`Ctrl+V`) capturing raw images and extracting text via **Tesseract.js** OCR.
  4. Build strict JSON Schema prompt steering for **Groq Llama-3.3-70b-versatile** to categorize items into `tasks[]`, `schedule_blocks[]`, and `expenses[]`.
* **Acceptance Criteria:** Brain dump processing latency under 800ms; zero hallucinated dates or malformed JSON payloads.

### Phase 3: Task Backlog, Pomodoro Engine & Not-To-Do Shield
* **Objective:** Link planned tasks directly to execution tools.
* **Key Tasks:**
  1. Implement Eisenhower priority tags (`high`, `medium`, `low`) with duration badges.
  2. Build configurable 25-minute Pomodoro timer linked to the active task, logging cumulative deep focus minutes.
  3. Create the "Not-To-Do List" anti-habit guardrail to prevent distraction trigger windows.
* **Acceptance Criteria:** One-click transition from backlog task to active focus sprint with audio completion chimes.

### Phase 4: Financial Tracker & India SMS Hub
* **Objective:** Combine personal budgeting and daily spending into the same view.
* **Key Tasks:**
  1. Real-time balance, daily cash burn rate, and net worth asset calculator.
  2. Dynamic global currency switcher (`₹`, `$`, `€`, `£`, `¥`).
  3. Webhook receiver and simulator for Indian bank SMS formats (HDFC, SBI, ICICI, Paytm).
* **Acceptance Criteria:** Instant transaction logging without page reloads; accurate net worth summing.

### Phase 5: Local-First Storage, Service Worker & Cloud Sync
* **Objective:** Guarantee 100% offline functionality with seamless cloud sync.
* **Key Tasks:**
  1. Implement client-side repository pattern reading and writing synchronously to `localStorage`.
  2. Configure `sw.js` (Service Worker) to cache all static scripts, stylesheets, and icons for offline PWA installation.
  3. Implement `POST /api/sync/supabase` to upsert user state into Supabase `user_planner` table with Row-Level Security.
* **Acceptance Criteria:** App works completely offline in airplane mode; syncs immediately upon reconnecting to network.

### Phase 6: Universal Data Portability & Excel Exporter
* **Objective:** Ensure users own their data with zero platform lock-in.
* **Key Tasks:**
  1. Build client-side CSV generator injecting UTF-8 Byte Order Mark (`\uFEFF`) to prevent corrupt rupee symbols (`₹`) or character encoding errors in Microsoft Excel.
  2. Implement multi-section structured spreadsheet formatting (Tasks, Schedule Blocks, Expenses, Incomes, Net Worth, Milestones).
  3. Provide raw JSON backup export and import for developer migrations.
* **Acceptance Criteria:** CSV opens cleanly in Microsoft Excel, Google Sheets, and Apple Numbers without garbled text or broken columns.
