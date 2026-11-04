import {
  LLMProvider,
  PricingPlan,
  SupportedLanguage,
  VoiceProvider,
} from "@/types";

export const BRAND_CONFIG = {
  name: "Zenviah.ai",
  tagline: "Intelligent Voice. Automated Business.",
  supportEmail: "support@zenviah.ai",
  docsUrl: "https://docs.zenviah.ai",
  statusText: "All Voice Clusters Operational (Mumbai & Bengaluru PoPs)",
};

export const LLM_MODELS_BY_PROVIDER: Record<
  LLMProvider,
  { id: string; label: string; latency: string; badge?: string }[]
> = {
  OpenAI: [
    { id: "gpt-4o-realtime", label: "GPT-4o Realtime Audio", latency: "290ms", badge: "Ultra Low Latency" },
    { id: "gpt-4o", label: "GPT-4o Omni", latency: "380ms", badge: "Recommended" },
    { id: "gpt-4o-mini", label: "GPT-4o Mini", latency: "240ms", badge: "Cost Efficient" },
  ],
  "Google Gemini": [
    { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash Live", latency: "260ms", badge: "Multilingual Native" },
    { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro", latency: "450ms", badge: "Long Context" },
    { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash", latency: "270ms" },
  ],
  Anthropic: [
    { id: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet", latency: "410ms", badge: "Natural Reasoning" },
    { id: "claude-3-5-haiku", label: "Claude 3.5 Haiku", latency: "280ms", badge: "Fast" },
  ],
  Groq: [
    { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B LPU", latency: "180ms", badge: "Instant" },
    { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant", latency: "140ms" },
  ],
  "Azure OpenAI": [
    { id: "azure-gpt-4o-india", label: "Azure GPT-4o (Central India)", latency: "340ms", badge: "DPDP Compliant" },
  ],
};

export interface VoiceOption {
  id: string;
  name: string;
  provider: VoiceProvider;
  gender: "Female" | "Male" | "Neutral";
  languages: SupportedLanguage[];
  supportsCodeSwitching: boolean;
  accent: string;
  sampleLine: string;
}

export const VOICE_CATALOG: VoiceOption[] = [
  {
    id: "sarvam-ananya-ta-en",
    name: "Ananya (Indic Neural)",
    provider: "Sarvam AI",
    gender: "Female",
    languages: ["Tamil", "Tamil-English (Tanglish)", "English (India)"],
    supportsCodeSwitching: true,
    accent: "Chennai / Tamil Nadu",
    sampleLine: "Vanakkam! Welcome to Zenviah.ai support. Ungaluku epdi help pannalam today?",
  },
  {
    id: "sarvam-karthik-ta-en",
    name: "Karthik (Conversational)",
    provider: "Sarvam AI",
    gender: "Male",
    languages: ["Tamil", "Tamil-English (Tanglish)", "English (India)", "Malayalam"],
    supportsCodeSwitching: true,
    accent: "Coimbatore / South India",
    sampleLine: "Hello sir, unga order dispatch aagiduchu. Delivery tracking link SMS-la anupirukom.",
  },
  {
    id: "sarvam-meera-hi-en",
    name: "Meera (Bharatiya HD)",
    provider: "Sarvam AI",
    gender: "Female",
    languages: ["Hindi", "Hindi-English (Hinglish)", "English (India)", "Marathi"],
    supportsCodeSwitching: true,
    accent: "Delhi NCR / Pan-India",
    sampleLine: "Namaste! Main Zenviah.ai ki automated assistant bol rahi hoon. Aapki kya sahayata kar sakti hoon?",
  },
  {
    id: "eleven-aarav-en-in",
    name: "Aarav (Enterprise Executive)",
    provider: "ElevenLabs",
    gender: "Male",
    languages: ["English (India)", "Hindi", "Tamil-English (Tanglish)"],
    supportsCodeSwitching: true,
    accent: "Bengaluru / Neutral Indian",
    sampleLine: "Good afternoon! I'm calling from Zenviah.ai regarding your scheduled enterprise demo at 4 PM IST.",
  },
  {
    id: "eleven-kavya-multilingual",
    name: "Kavya (Multilingual v2)",
    provider: "ElevenLabs",
    gender: "Female",
    languages: ["English (India)", "Telugu", "Kannada", "Tamil", "Hindi"],
    supportsCodeSwitching: true,
    accent: "Hyderabad / Bengaluru",
    sampleLine: "Namaskaram! Your health checkup appointment is confirmed for tomorrow morning at 10 AM.",
  },
  {
    id: "cartesia-riley-sonic",
    name: "Riley Sonic (Ultra-Low Latency)",
    provider: "Cartesia",
    gender: "Female",
    languages: ["English (US)", "English (India)", "Hindi"],
    supportsCodeSwitching: false,
    accent: "Global Neutral",
    sampleLine: "Hi there! Let me check your account status right away—one moment please.",
  },
  {
    id: "playht-devika-bn",
    name: "Devika (Eastern Indic)",
    provider: "PlayHT",
    gender: "Female",
    languages: ["Bengali", "English (India)", "Hindi"],
    supportsCodeSwitching: true,
    accent: "Kolkata / Eastern India",
    sampleLine: "Nomoshkar! Apnar banking query-r jonno amra ekhon prostut.",
  },
  {
    id: "azure-pranav-mr",
    name: "Pranav Neural HD",
    provider: "Azure Neural",
    gender: "Male",
    languages: ["Marathi", "Hindi", "English (India)", "Kannada", "Malayalam"],
    supportsCodeSwitching: false,
    accent: "Mumbai / Pune",
    sampleLine: "Namaskar! Tumche loan application verification purna zhale aahe.",
  },
];

export const SUPPORTED_LANGUAGES: {
  name: SupportedLanguage;
  nativeName: string;
  code: string;
  supportsCodeSwitching: boolean;
}[] = [
  { name: "English (India)", nativeName: "English (IN)", code: "en-IN", supportsCodeSwitching: true },
  { name: "Tamil", nativeName: "தமிழ்", code: "ta-IN", supportsCodeSwitching: true },
  { name: "Tamil-English (Tanglish)", nativeName: "தமிழ் + English", code: "ta-en-IN", supportsCodeSwitching: true },
  { name: "Hindi", nativeName: "हिन्दी", code: "hi-IN", supportsCodeSwitching: true },
  { name: "Hindi-English (Hinglish)", nativeName: "हिन्दी + English", code: "hi-en-IN", supportsCodeSwitching: true },
  { name: "Telugu", nativeName: "తెలుగు", code: "te-IN", supportsCodeSwitching: true },
  { name: "Malayalam", nativeName: "മലയാളം", code: "ml-IN", supportsCodeSwitching: false },
  { name: "Kannada", nativeName: "ಕನ್ನಡ", code: "kn-IN", supportsCodeSwitching: false },
  { name: "Bengali", nativeName: "বাংলা", code: "bn-IN", supportsCodeSwitching: true },
  { name: "Marathi", nativeName: "मराठी", code: "mr-IN", supportsCodeSwitching: false },
  { name: "English (US)", nativeName: "English (US)", code: "en-US", supportsCodeSwitching: false },
];

export const CONFIGURABLE_PRICING_PLANS: PricingPlan[] = [
  {
    id: "Starter",
    name: "Starter",
    tagline: "For early-stage teams building & testing AI phone workflows.",
    monthlyPriceINR: 4999,
    includedMinutes: 1000,
    overagePerMinINR: 4.5,
    maxAgents: 5,
    concurrencyLimit: 5,
    features: [
      "1,000 AI voice minutes / month",
      "Up to 5 active AI Voice Agents",
      "8 Indian + Global languages",
      "Visual React Flow Workflow Builder",
      "1 Virtual +91 DID Number slot",
      "Standard Webhook & CRM sync",
    ],
  },
  {
    id: "Growth",
    name: "Growth",
    tagline: "For scaling businesses running inbound & outbound voice operations.",
    monthlyPriceINR: 18999,
    includedMinutes: 4500,
    overagePerMinINR: 3.8,
    maxAgents: 25,
    concurrencyLimit: 25,
    highlighted: true,
    features: [
      "4,500 AI voice minutes / month",
      "Up to 25 active AI Voice Agents",
      "Tamil-English & Hindi-English code-switching",
      "Knowledge Base RAG with PDF & URL indexing",
      "Outbound Campaign Scheduler & CSV dialer",
      "Exotel, Twilio, HubSpot & Zoho integrations",
    ],
  },
  {
    id: "Business",
    name: "Business",
    tagline: "High-concurrency voice automation for multi-region operations.",
    monthlyPriceINR: 49999,
    includedMinutes: 14000,
    overagePerMinINR: 3.2,
    maxAgents: "Unlimited",
    concurrencyLimit: 100,
    features: [
      "14,000 AI voice minutes / month",
      "Unlimited AI Voice Agents & Workflows",
      "100 concurrent active calls",
      "Custom SIP Trunking (Airtel IQ / Tata Tele / Exotel)",
      "Real-time Call Analytics & Sentiment Extraction",
      "Role-based access control & audit logs",
    ],
  },
  {
    id: "Enterprise",
    name: "Enterprise",
    tagline: "Custom volume, dedicated India PoP latency & compliance SLAs.",
    monthlyPriceINR: null,
    includedMinutes: 50000,
    overagePerMinINR: 2.4,
    maxAgents: "Unlimited",
    concurrencyLimit: 500,
    features: [
      "Custom minute volume & committed INR tiers",
      "500+ concurrent calls with dedicated GPU voice nodes",
      "DPDP Act & TRAI DLT compliance guardrails",
      "Custom voice cloning & private LLM VPC deployment",
      "Dedicated Solutions Architect & 99.95% SLA",
      "Custom SSO / SAML & enterprise invoicing",
    ],
  },
];

