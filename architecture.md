# 🏛️ Architecture: Smart Planner AI (Dayframe Pro)

## 1. System Overview & Core Philosophy

Smart Planner AI is engineered as a **Local-First, Edge-Assisted hybrid architecture**. 

### Architectural Tenets:
1. **Zero-Latency Client Execution:** The UI executes entirely within the browser DOM using Vanilla HTML5/ES6 and Dynamic SVG canvas rendering at 60 FPS.
2. **Local-First Privacy:** All tasks, journal blocks, financial logs, and settings are written immediately to browser `localStorage` (`smart-planner-user-{id}`) before any network call is initiated.
3. **Sub-Second Edge AI Inference:** Heavy AI workloads (Whisper speech-to-text, Tesseract image OCR, and Llama 3.3 entity categorization) run on high-performance edge compute (Vercel Serverless + Groq LPU LPUs) with sub-800ms Time-To-First-Token (TTFT).
4. **Isolated Multi-Tenant Cloud Sync:** User states are securely synchronized to Supabase Cloud PostgreSQL, partitioned strictly via Row-Level Security (RLS) policies.

---

## 2. High-Level System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Client Presentation Tier (Progressive Web App)"]
        UI["Modern Glassmorphic Dashboard"]
        Dial["360° Circular Circadian Dial (SVG 60 FPS)"]
        DumpUI["Multimodal Brain Dump Input Bar"]
        VoiceRec["Web Audio / MediaRecorder (Voice)"]
        OCRDrop["Clipboard / Image Paste (Receipt OCR)"]
        LocalCache[("LocalStorage Cache (smart-planner-user-id)")]
        SW["Service Worker (sw.js - Offline Cache)"]
        ExportModule["Excel UTF-8 BOM CSV Generator"]
    end

    subgraph EdgeGateway ["Edge Gateway & Routing Tier (Vercel)"]
        ServerAPI["Node.js Express / Serverless API (server.js)"]
        AuthMid["Google GIS JWT Verification"]
        RateLimit["Edge Rate Limiter & Schema Validator"]
    end

    subgraph NeuralAI ["Neural AI Inference Engine (Groq LPU)"]
        Whisper["Groq Whisper Large v3 (Voice-to-Text)"]
        Tesseract["Tesseract.js OCR (Receipt Parsing)"]
        Llama["Groq Llama-3.3-70b-versatile (<800ms TTFT)"]
        JSONSchema["Deterministic JSON Schema Enforcer"]
    end

    subgraph Persistence ["Persistence Layer (Supabase Cloud PostgreSQL)"]
        SupabaseDB[("Supabase PostgreSQL")]
        UserPlannerTable["user_planner Table (JSONB per User)"]
        RLS["Row-Level Security (RLS) Isolation"]
    end

    %% Client Input Pathways
    VoiceRec -->|Raw Audio Blob| Whisper
    Whisper -->|Transcribed Text| Llama
    OCRDrop -->|Receipt Image| Tesseract
    Tesseract -->|Extracted Text| Llama
    DumpUI -->|Unstructured Hinglish / English Text| Llama

    %% AI Pipeline
    Llama --> JSONSchema
    JSONSchema -->|Structured JSON Payload| ServerAPI
    ServerAPI -->|Hydrated State| UI

    %% Local & Cloud Storage Sync
    UI <-->|Immediate Local-First Write| LocalCache
    UI -->|Render Time Blocks| Dial
    UI -->|1-Click Download| ExportModule
    UI -->|Encrypted HTTPS Sync| ServerAPI
    ServerAPI -->|Upsert Payload| UserPlannerTable
    UserPlannerTable --- RLS
    UserPlannerTable --- SupabaseDB
```

---

## 3. Multimodal AI Processing Pipeline Flow

```mermaid
flowchart TD
    Start(["User Input (Voice / Screenshot / Raw Text)"]) --> CheckType{"Input Modality?"}

    CheckType -->|Voice Note| VoiceStep["Web Audio Capture / Mic"]
    VoiceStep --> WhisperStep["Groq Whisper Large v3 Transcription"]
    WhisperStep --> Combine["Unified Text Prompt"]

    CheckType -->|Receipt Screenshot| OCRStep["Tesseract OCR Engine"]
    OCRStep --> Combine

    CheckType -->|Text / Hinglish| Combine

    Combine --> LLM["Groq Llama-3.3-70b-versatile Processing"]
    LLM --> JSONParse["Strict JSON Entity Extraction"]

    JSONParse --> RouteEntities{"Entity Routing"}

    RouteEntities -->|Schedule Slots| DialBlock["24h Circular Dial (Journal Block)"]
    RouteEntities -->|Todo Items| TaskList["Priority Tasks Backlog (High/Med/Low)"]
    RouteEntities -->|Bill / Expense| Finance["Finances & Budget Tracker"]
    RouteEntities -->|Focus Goals| Timers["Pomodoro Focus Timers"]

    DialBlock --> StateUpdate["Update LocalStorage & Sync to Supabase"]
    TaskList --> StateUpdate
    Finance --> StateUpdate
    Timers --> StateUpdate

    StateUpdate --> End(["Render Interactive UI & Sound Haptics"])
```

---

## 4. Database Schema & Entity Relational Design (ERD)

```mermaid
erDiagram
    USER_PLANNER ||--o{ TASK : contains
    USER_PLANNER ||--o{ SCHEDULE_BLOCK : schedules
    USER_PLANNER ||--o{ FINANCIAL_RECORD : logs
    USER_PLANNER ||--o{ MILESTONE : tracks
    USER_PLANNER ||--o{ NOT_TO_DO : guards

    USER_PLANNER {
        string email PK "User Primary Key"
        string user_name "User Display Name"
        timestamp last_synced "Last Sync Timestamp"
        jsonb settings "Theme, Currency, Notification Config"
    }

    TASK {
        uuid id PK
        string title "Task Title"
        string priority "high | medium | low"
        string category "Work | Health | Personal | Learning"
        int estimated_minutes "Duration in minutes"
        boolean completed "Completion Status"
        date due_date "Due Date"
    }

    SCHEDULE_BLOCK {
        uuid id PK
        string title "Block Title"
        string start_time "HH:mm"
        string end_time "HH:mm"
        string category "Deep Work | Meeting | Rest | Personal"
        float dial_angle_start "0 to 360 degrees"
        float dial_angle_end "0 to 360 degrees"
    }

    FINANCIAL_RECORD {
        uuid id PK
        string type "income | expense"
        string item "Title / Item Description"
        float amount "Transaction Amount"
        string category "Food | Transport | SaaS | Utilities"
        timestamp timestamp "Record Date & Time"
    }

    MILESTONE {
        uuid id PK
        string goal_title "Goal Description"
        int progress_percentage "0 - 100"
        json key_steps "Checklist of sub-steps"
        date target_date "Target Completion"
    }

    NOT_TO_DO {
        uuid id PK
        string bad_habit "Anti-habit trigger to avoid"
        boolean active "Active guardrail"
    }
```

---

## 5. Architectural Layers Breakdown

### Layer 1: Client Presentation Tier (PWA)
- **Tech Stack:** Vanilla ES2024 JavaScript, HTML5, Modern CSS3 with CSS Custom Properties, Material Symbols.
- **24-Hour Circular Dial Canvas:** Real-time 360° SVG dial calculating trigonometric angles (`angle = (hours * 15) + (minutes * 0.25)`).
- **Service Worker (`sw.js`):** Intercepts network requests and caches core app assets for full offline functionality.
- **Local Storage Engine:** Isolates user states with key prefix `smart-planner-user-{email/id}`.

### Layer 2: Edge Gateway & Serverless API
- **Tech Stack:** Node.js v20+, Express.js, Vercel Serverless Functions (`server.js`, `api/`).
- **Secret Isolation:** Securely manages Groq API keys, Supabase Service Role keys, and OAuth client credentials without exposing secrets to client browsers.
- **Middleware:** CORS protection, rate limiting, and multipart audio parsing via Multer.

### Layer 3: Neural AI Inference Tier
- **Speech-to-Text:** Groq Whisper Large v3 transcribing multi-lingual audio in sub-second latency.
- **OCR Engine:** Tesseract.js / Base64 vision parsing UPI transaction IDs, merchant names, and monetary values.
- **NLP Categorization:** Groq Llama-3.3-70b-versatile steered with strict JSON Schema prompt engineering to prevent date/currency hallucinations.

### Layer 4: Multi-Tenant Cloud Persistence Tier
- **Tech Stack:** Supabase Cloud PostgreSQL with JSONB columns.
- **Row-Level Security (RLS):** Enforces data boundaries (`auth.uid() = user_id`), ensuring zero data cross-contamination between users.

---

## 6. Technical Performance & Security SLAs

| SLA Attribute | Target Benchmark | Architectural Guarantee |
| :--- | :--- | :--- |
| **Inference Latency** | `< 800 ms` | Groq Cloud LPU inference streaming |
| **Offline Readiness** | `100% Core Functionality` | Local-First LocalStorage + Service Worker |
| **Data Privacy** | `Zero Third-Party Trackers` | No Google Analytics, no Facebook Pixels, no telemetry |
| **Export Integrity** | `100% Excel Compatible` | UTF-8 Byte Order Mark (`\uFEFF`) CSV stream |
| **Dial Frame Rate** | `60 FPS` | SVG dynamic angle transforms with hardware acceleration |
