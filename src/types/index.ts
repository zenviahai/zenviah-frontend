// Core TypeScript definitions for Zenviah.ai - AI Voice Automation SaaS Platform

export type AgentStatus = "Published" | "Draft" | "Paused";

export type CallDirection = "Inbound" | "Outbound";

export type CallStatus = "Completed" | "Failed" | "Missed" | "In Progress";

export type SupportedLanguage =
  | "English (India)"
  | "English (US)"
  | "Tamil"
  | "Hindi"
  | "Telugu"
  | "Malayalam"
  | "Kannada"
  | "Bengali"
  | "Marathi"
  | "Tamil-English (Tanglish)"
  | "Hindi-English (Hinglish)";

export type LLMProvider = "OpenAI" | "Google Gemini" | "Anthropic" | "Groq" | "Azure OpenAI";

export type VoiceProvider = "Sarvam AI" | "ElevenLabs" | "PlayHT" | "Cartesia" | "Deepgram Aura" | "Azure Neural";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: "Starter" | "Growth" | "Business" | "Enterprise";
  role: "Owner" | "Admin" | "Developer" | "Operator";
  minutesUsed: number;
  minutesLimit: number;
  creditsBalanceINR: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  role: "Owner" | "Admin" | "Developer" | "Viewer";
  avatarUrl?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  avatarColor: string;
  agentType: "Customer Support" | "Appointment Booking" | "Lead Qualification" | "Order Collection" | "Payment Reminder" | "Technical Helpdesk";
  direction: CallDirection | "Both";
  businessUseCase: string;
  status: AgentStatus;
  // Model Config
  llmProvider: LLMProvider;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  responseBehavior: "Concise & Fast" | "Balanced & Conversational" | "Detailed & Empathetic";
  // Voice Config
  voiceProvider: VoiceProvider;
  voiceId: string;
  voiceName: string;
  voiceGender: "Female" | "Male" | "Neutral";
  language: SupportedLanguage;
  codeSwitching: boolean;
  speakingSpeed: number;
  interruptionSensitivity: "Low" | "Medium" | "High";
  // Knowledge Base
  knowledgeBaseIds: string[];
  // Call Behavior
  greetingMessage: string;
  conversationInstructions: string;
  callTimeoutSeconds: number;
  maxCallDurationSeconds: number;
  humanTransferNumber: string;
  fallbackBehavior: "Transfer to Human" | "Apologize & End Call" | "Retry Prompt";
  endCallConditions: string[];
  // Integrations
  connectedIntegrations: string[];
  // Telemetry
  totalCalls: number;
  successRate: number;
  avgDurationSeconds: number;
  assignedPhoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkflowNodeCategory =
  | "start"
  | "ai_agent"
  | "speak_message"
  | "collect_input"
  | "condition"
  | "http_request"
  | "webhook"
  | "transfer_human"
  | "kb_lookup"
  | "end_call";

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  category: WorkflowNodeCategory;
  description: string;
  config: {
    prompt?: string;
    message?: string;
    agentId?: string;
    variableName?: string;
    inputType?: "Speech" | "DTMF" | "Both";
    conditionExpression?: string;
    branches?: string[];
    endpointUrl?: string;
    httpMethod?: "GET" | "POST" | "PUT";
    headersJson?: string;
    transferPhone?: string;
    department?: string;
    knowledgeBaseId?: string;
    topK?: number;
    endReason?: string;
  };
  hasError?: boolean;
  errorMessage?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  status: "Published" | "Draft";
  lastModified: string;
  assignedAgentName?: string;
  nodesCount: number;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  type: "PDF" | "DOCX" | "TXT" | "URL" | "FAQ";
  sizeLabel: string;
  chunksCount: number;
  status: "Indexed" | "Processing" | "Failed";
  uploadedAt: string;
  previewContent: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  totalChunks: number;
  status: "Indexed" | "Indexing" | "Needs Sync";
  lastUpdated: string;
  attachedAgentIds: string[];
  documents: KnowledgeDocument[];
  faqs: FAQItem[];
}

export interface PhoneNumberRecord {
  id: string;
  number: string; // e.g., +91 80 4719 2830
  region: string; // e.g., Bengaluru, Karnataka
  type: "Virtual DID" | "Toll-Free" | "SIP Trunk";
  provider: "Exotel" | "Twilio India" | "Tata Tele SIP" | "Airtel IQ";
  assignedAgentId: string | null;
  inboundEnabled: boolean;
  outboundEnabled: boolean;
  status: "Active" | "Simulated" | "Verification Pending";
  monthlyRentalINR: number;
  sipUri?: string;
  createdAt: string;
}

export interface TranscriptTurn {
  id: string;
  speaker: "Agent" | "Caller" | "System";
  text: string;
  timestamp: string;
  sentiment?: "Positive" | "Neutral" | "Frustrated";
  latencyMs?: number;
}

export interface ToolExecutionStep {
  id: string;
  toolName: string;
  timestamp: string;
  durationMs: number;
  status: "Success" | "Error";
  inputPayload: string;
  outputPayload: string;
}

export interface CallRecord {
  id: string;
  callerNumber: string;
  callerName?: string;
  agentId: string;
  agentName: string;
  direction: CallDirection;
  durationSeconds: number;
  status: CallStatus;
  startTime: string;
  costINR: number;
  language: SupportedLanguage;
  outcome: "Resolved" | "Appointment Booked" | "Transferred to Human" | "Voicemail" | "Dropped" | "Follow-up Scheduled";
  summary: string;
  extractedData: Record<string, string>;
  transcript: TranscriptTurn[];
  toolExecutions: ToolExecutionStep[];
  recordingDurationSeconds: number;
}

export interface CampaignRecord {
  id: string;
  name: string;
  description: string;
  agentId: string;
  agentName: string;
  status: "Running" | "Scheduled" | "Paused" | "Completed" | "Stopped";
  totalContacts: number;
  callsAttempted: number;
  callsCompleted: number;
  answerRate: number;
  successRate: number;
  failedCalls: number;
  scheduledStart: string;
  callingHoursStart: string; // e.g., "09:30"
  callingHoursEnd: string;   // e.g., "19:30"
  timezone: string;          // e.g., "Asia/Kolkata (IST)"
  concurrency: number;
  contactListName: string;
  estimatedBudgetINR: number;
  spentINR: number;
}

export type IntegrationCategory = "Telephony" | "CRM" | "Automation" | "Webhooks" | "AI Providers";

export interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  status: "Connected" | "Not Connected" | "Simulated";
  logoText: string;
  accentColor: string;
  lastSynced?: string;
  configFields: {
    key: string;
    label: string;
    placeholder: string;
    type: "text" | "password" | "url";
    maskedValue?: string;
  }[];
}

export interface PricingPlan {
  id: "Starter" | "Growth" | "Business" | "Enterprise";
  name: string;
  tagline: string;
  monthlyPriceINR: number | null; // null for Enterprise custom
  includedMinutes: number;
  overagePerMinINR: number;
  maxAgents: number | "Unlimited";
  concurrencyLimit: number;
  features: string[];
  highlighted?: boolean;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  date: string;
  period: string;
  amountINR: number;
  status: "Paid" | "Pending" | "Processing";
  planName: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Developer" | "Analyst";
  status: "Active" | "Invited";
  lastActive: string;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  maskedKey: string;
  environment: "Production" | "Staging" | "Development";
  createdAt: string;
  lastUsed: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: "Active" | "Paused";
  secretMasked: string;
  lastTriggered: string;
}

