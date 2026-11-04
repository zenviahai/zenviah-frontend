# Zenviah.ai — Intelligent Voice. Automated Business.

**Zenviah.ai** is an enterprise multi-tenant AI Voice Automation SaaS platform designed for creating, orchestrating, deploying, and monitoring low-latency multilingual AI phone agents.

---

## Core Capabilities

1. **Authenticated Multi-Tenant SaaS Shell**
   - Collapsible dark charcoal sidebar (`#111318`) with compact icon mode, responsive mobile drawer, workspace switcher, documentation modal, and priority support desk.
   - Sticky top header with breadcrumb navigation, global command search (`⌘K`), live minute & INR credit usage indicator, notifications center, and account menu.
2. **Authentication (`/login`, `/register`, `/forgot-password`)**
   - Built with React Hook Form + Zod validation, password visibility toggles, Google Workspace SSO UI, and DPDP compliance terms.
3. **Executive Overview Dashboard (`/dashboard`)**
   - 6 KPI cards (Total Calls, Total Minutes, Successful Calls, Active AI Agents, Average Call Duration, Estimated Usage Cost in INR).
   - Interactive Recharts visualizations (Inbound vs. Outbound Call Volume, Call Outcome Distribution, Usage by AI Agent, Multilingual Accuracy) and recent activity feeds.
4. **AI Agent Management (`/agents`, `/agents/new`, `/agents/[id]`)**
   - Grid & Table views, search, status/language filters, duplicate, publish/pause, and delete confirmation dialogs.
   - **6-Step Agent Creation Wizard (`/agents/new`)**: Basic Details → Model Config (OpenAI, Google Gemini, Anthropic, Groq, Azure OpenAI) → Voice Config (Sarvam AI, ElevenLabs, Cartesia, PlayHT, Azure Neural across English, Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali, Marathi + Tamil-English code-switching) → Knowledge Base RAG → Call Behavior → Review & Launch.
   - **8-Tab Agent Editor (`/agents/[id]`)**: Includes an interactive **Test Agent** WebRTC/chat sandbox with live simulated voice call controls, turn latency telemetry, and automatic call log recording.
5. **Visual Workflow Builder (`/workflows`)**
   - Powered by **React Flow / XYFlow (`@xyflow/react`)** with 10 custom node categories (`Start`, `AI Agent`, `Speak Message`, `Collect User Input`, `Condition / Branch`, `HTTP API Request`, `Webhook`, `Transfer to Human`, `Knowledge Base Lookup`, `End Call`), drag-and-drop palette, right-hand node inspector, undo/redo history, zoom/fit controls, mini-map, validation badges, and step-by-step live simulator.
6. **Knowledge Base (`/knowledge-base`)**
   - Drag-and-drop document upload (PDF, DOCX, TXT), website URL crawler, grounded voice FAQs, document chunk preview, and one-click agent attachment.
7. **India-First Phone Number Management (`/phone-numbers`)**
   - `+91` virtual DIDs, 1800 toll-free numbers, Exotel/Twilio/Tata Tele/Airtel IQ SIP trunk inspection, and clear UI simulation notices.
8. **Call Logs & Transcripts (`/calls`)**
   - Master-detail call explorer with stereo recording player UI, full conversational transcript, AI summary, extracted key-value data, mid-call tool execution history, and call timeline.
9. **Outbound Campaign Management (`/campaigns`)**
   - 3-step campaign wizard, CSV contact list uploader, IST calling hours, concurrency pacing, pause/resume/stop actions, and TRAI DLT compliance guardrails.
10. **Integration Marketplace (`/integrations`), Analytics (`/analytics`), Billing (`/billing`), & Settings (`/settings`)**
    - 10 integration connectors with masked KMS vault references, deep Recharts voice telemetry, configurable INR subscription plans (`Starter`, `Growth`, `Business`, `Enterprise`), and 9-tab workspace settings.

---

## Getting Started

```bash
# Start development server
pnpm dev

# Run TypeScript check
pnpm typecheck

# Run unit tests (Vitest + React Testing Library)
pnpm test

# Build production bundle
pnpm build
```

