import { create } from "zustand";
import {
  AIAgent,
  AgentStatus,
  ApiKeyRecord,
  CallRecord,
  CampaignRecord,
  FAQItem,
  IntegrationItem,
  InvoiceRecord,
  KnowledgeBase,
  KnowledgeDocument,
  PhoneNumberRecord,
  PricingPlan,
  TeamMember,
  UserProfile,
  WebhookEndpoint,
  Workspace,
} from "@/types";
import {
  INITIAL_AGENTS,
  INITIAL_API_KEYS,
  INITIAL_CALLS,
  INITIAL_CAMPAIGNS,
  INITIAL_INVOICES,
  INITIAL_INTEGRATIONS,
  INITIAL_KNOWLEDGE_BASES,
  INITIAL_PHONE_NUMBERS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_WEBHOOKS,
  MOCK_USER,
  MOCK_WORKSPACES,
} from "@/mocks/data";

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "success" | "warning" | "info";
}

interface AppState {
  // Layout & Navigation
  isSidebarCollapsed: boolean;
  isMobileNavOpen: boolean;
  toggleSidebar: () => void;
  setMobileNavOpen: (open: boolean) => void;

  // Auth & Workspace
  user: UserProfile;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  setActiveWorkspace: (id: string) => void;
  updateUserProfile: (partial: Partial<UserProfile>) => void;

  // Notifications
  notifications: AppNotification[];
  markAllNotificationsRead: () => void;

  // AI Agents
  agents: AIAgent[];
  addAgent: (agent: AIAgent) => void;
  updateAgent: (id: string, updates: Partial<AIAgent>) => void;
  duplicateAgent: (id: string) => AIAgent | null;
  deleteAgent: (id: string) => void;
  setAgentStatus: (id: string, status: AgentStatus) => void;

  // Knowledge Bases
  knowledgeBases: KnowledgeBase[];
  addKnowledgeBase: (kb: KnowledgeBase) => void;
  addDocumentToKB: (kbId: string, doc: KnowledgeDocument) => void;
  deleteDocumentFromKB: (kbId: string, docId: string) => void;
  addFaqToKB: (kbId: string, faq: FAQItem) => void;
  toggleAgentOnKB: (kbId: string, agentId: string) => void;

  // Phone Numbers
  phoneNumbers: PhoneNumberRecord[];
  addPhoneNumber: (record: PhoneNumberRecord) => void;
  assignPhoneToAgent: (phoneId: string, agentId: string | null) => void;
  togglePhoneCapability: (phoneId: string, field: "inboundEnabled" | "outboundEnabled") => void;

  // Calls
  calls: CallRecord[];
  addCallRecord: (call: CallRecord) => void;

  // Campaigns
  campaigns: CampaignRecord[];
  addCampaign: (campaign: CampaignRecord) => void;
  setCampaignStatus: (id: string, status: CampaignRecord["status"]) => void;

  // Integrations
  integrations: IntegrationItem[];
  updateIntegrationStatus: (id: string, status: IntegrationItem["status"], maskedConfig?: Record<string, string>) => void;

  // Billing
  invoices: InvoiceRecord[];
  changeSubscriptionPlan: (planId: PricingPlan["id"], newLimit: number) => void;
  addCreditsINR: (amountINR: number) => void;

  // Settings
  teamMembers: TeamMember[];
  inviteTeamMember: (member: TeamMember) => void;
  removeTeamMember: (id: string) => void;
  apiKeys: ApiKeyRecord[];
  createApiKey: (name: string, environment: ApiKeyRecord["environment"]) => ApiKeyRecord;
  revokeApiKey: (id: string) => void;
  webhooks: WebhookEndpoint[];
  addWebhook: (wh: WebhookEndpoint) => void;
  toggleWebhook: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isSidebarCollapsed: false,
  isMobileNavOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),

  user: MOCK_USER,
  workspaces: MOCK_WORKSPACES,
  activeWorkspaceId: MOCK_WORKSPACES[0].id,
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  updateUserProfile: (partial) =>
    set((s) => ({ user: { ...s.user, ...partial } })),

  notifications: [
    {
      id: "notif-1",
      title: "Campaign Milestone Reached",
      description: "South India Festive COD Verification crossed 3,400 calls with 92.4% success.",
      time: "6 mins ago",
      read: false,
      type: "success",
    },
    {
      id: "notif-2",
      title: "Knowledge Base Indexed",
      description: "India_Refund_And_Replacement_Policy_2026.pdf (128 vector chunks) is live.",
      time: "1 hour ago",
      read: false,
      type: "info",
    },
    {
      id: "notif-3",
      title: "Exotel SIP Trunk Latency Optimal",
      description: "Mumbai & Chennai PoP round-trip media latency averaging 24ms.",
      time: "3 hours ago",
      read: true,
      type: "info",
    },
  ],
  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  agents: INITIAL_AGENTS,
  addAgent: (agent) =>
    set((s) => ({ agents: [agent, ...s.agents] })),
  updateAgent: (id, updates) =>
    set((s) => ({
      agents: s.agents.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      ),
    })),
  duplicateAgent: (id) => {
    const existing = get().agents.find((a) => a.id === id);
    if (!existing) return null;
    const copy: AIAgent = {
      ...existing,
      id: `agt-copy-${Date.now()}`,
      name: `${existing.name} (Copy)`,
      status: "Draft",
      totalCalls: 0,
      assignedPhoneNumber: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({ agents: [copy, ...s.agents] }));
    return copy;
  },
  deleteAgent: (id) =>
    set((s) => ({ agents: s.agents.filter((a) => a.id !== id) })),
  setAgentStatus: (id, status) =>
    set((s) => ({
      agents: s.agents.map((a) =>
        a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
      ),
    })),

  knowledgeBases: INITIAL_KNOWLEDGE_BASES,
  addKnowledgeBase: (kb) =>
    set((s) => ({ knowledgeBases: [kb, ...s.knowledgeBases] })),
  addDocumentToKB: (kbId, doc) =>
    set((s) => ({
      knowledgeBases: s.knowledgeBases.map((kb) =>
        kb.id === kbId
          ? {
              ...kb,
              documents: [doc, ...kb.documents],
              documentCount: kb.documentCount + 1,
              totalChunks: kb.totalChunks + doc.chunksCount,
              lastUpdated: "Just now",
            }
          : kb
      ),
    })),
  deleteDocumentFromKB: (kbId, docId) =>
    set((s) => ({
      knowledgeBases: s.knowledgeBases.map((kb) => {
        if (kb.id !== kbId) return kb;
        const removed = kb.documents.find((d) => d.id === docId);
        return {
          ...kb,
          documents: kb.documents.filter((d) => d.id !== docId),
          documentCount: Math.max(0, kb.documentCount - 1),
          totalChunks: Math.max(0, kb.totalChunks - (removed?.chunksCount ?? 0)),
          lastUpdated: "Just now",
        };
      }),
    })),
  addFaqToKB: (kbId, faq) =>
    set((s) => ({
      knowledgeBases: s.knowledgeBases.map((kb) =>
        kb.id === kbId
          ? { ...kb, faqs: [faq, ...kb.faqs], lastUpdated: "Just now" }
          : kb
      ),
    })),
  toggleAgentOnKB: (kbId, agentId) =>
    set((s) => ({
      knowledgeBases: s.knowledgeBases.map((kb) => {
        if (kb.id !== kbId) return kb;
        const exists = kb.attachedAgentIds.includes(agentId);
        return {
          ...kb,
          attachedAgentIds: exists
            ? kb.attachedAgentIds.filter((id) => id !== agentId)
            : [...kb.attachedAgentIds, agentId],
        };
      }),
    })),

  phoneNumbers: INITIAL_PHONE_NUMBERS,
  addPhoneNumber: (record) =>
    set((s) => ({ phoneNumbers: [record, ...s.phoneNumbers] })),
  assignPhoneToAgent: (phoneId, agentId) =>
    set((s) => {
      const targetPhone = s.phoneNumbers.find((p) => p.id === phoneId);
      return {
        phoneNumbers: s.phoneNumbers.map((p) =>
          p.id === phoneId ? { ...p, assignedAgentId: agentId } : p
        ),
        agents: s.agents.map((a) =>
          a.id === agentId && targetPhone
            ? { ...a, assignedPhoneNumber: targetPhone.number }
            : a
        ),
      };
    }),
  togglePhoneCapability: (phoneId, field) =>
    set((s) => ({
      phoneNumbers: s.phoneNumbers.map((p) =>
        p.id === phoneId ? { ...p, [field]: !p[field] } : p
      ),
    })),

  calls: INITIAL_CALLS,
  addCallRecord: (call) => set((s) => ({ calls: [call, ...s.calls] })),

  campaigns: INITIAL_CAMPAIGNS,
  addCampaign: (campaign) =>
    set((s) => ({ campaigns: [campaign, ...s.campaigns] })),
  setCampaignStatus: (id, status) =>
    set((s) => ({
      campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, status } : c)),
    })),

  integrations: INITIAL_INTEGRATIONS,
  updateIntegrationStatus: (id, status) =>
    set((s) => ({
      integrations: s.integrations.map((int) =>
        int.id === id
          ? {
              ...int,
              status,
              lastSynced: status === "Connected" ? "Just now" : undefined,
            }
          : int
      ),
    })),

  invoices: INITIAL_INVOICES,
  changeSubscriptionPlan: (planId, newLimit) =>
    set((s) => ({
      workspaces: s.workspaces.map((ws) =>
        ws.id === s.activeWorkspaceId
          ? { ...ws, plan: planId, minutesLimit: newLimit }
          : ws
      ),
    })),
  addCreditsINR: (amountINR) =>
    set((s) => ({
      workspaces: s.workspaces.map((ws) =>
        ws.id === s.activeWorkspaceId
          ? { ...ws, creditsBalanceINR: ws.creditsBalanceINR + amountINR }
          : ws
      ),
    })),

  teamMembers: INITIAL_TEAM_MEMBERS,
  inviteTeamMember: (member) =>
    set((s) => ({ teamMembers: [...s.teamMembers, member] })),
  removeTeamMember: (id) =>
    set((s) => ({ teamMembers: s.teamMembers.filter((m) => m.id !== id) })),

  apiKeys: INITIAL_API_KEYS,
  createApiKey: (name, environment) => {
    const prefix =
      environment === "Production"
        ? "znv_live_"
        : environment === "Staging"
        ? "znv_test_"
        : "znv_dev_";
    const suffix = Math.random().toString(36).substring(2, 6);
    const newKey: ApiKeyRecord = {
      id: `key-${Date.now()}`,
      name,
      maskedKey: `${prefix}${Math.random().toString(36).substring(2, 6)}••••••••••••••••••••••••${suffix}`,
      environment,
      createdAt: "04 Nov 2026",
      lastUsed: "Never",
    };
    set((s) => ({ apiKeys: [newKey, ...s.apiKeys] }));
    return newKey;
  },
  revokeApiKey: (id) =>
    set((s) => ({ apiKeys: s.apiKeys.filter((k) => k.id !== id) })),

  webhooks: INITIAL_WEBHOOKS,
  addWebhook: (wh) => set((s) => ({ webhooks: [wh, ...s.webhooks] })),
  toggleWebhook: (id) =>
    set((s) => ({
      webhooks: s.webhooks.map((w) =>
        w.id === id
          ? { ...w, status: w.status === "Active" ? "Paused" : "Active" }
          : w
      ),
    })),
}));

