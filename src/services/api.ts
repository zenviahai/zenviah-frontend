import { useAppStore } from "@/stores/use-app-store";
import {
  ANALYTICS_DAILY_VOLUME,
  ANALYTICS_LANGUAGE_DISTRIBUTION,
  ANALYTICS_OUTCOME_DISTRIBUTION,
} from "@/mocks/data";
import { AIAgent, CallRecord, CampaignRecord, KnowledgeBase } from "@/types";

/**
 * Clean API Service Abstraction Layer for Zenviah.ai.
 * Currently backed by in-memory Zustand state & realistic telemetry mocks.
 * Ready to swap with `fetch(process.env.NEXT_PUBLIC_API_URL + ...)` in production.
 */
const delay = (ms = 120) => new Promise((res) => setTimeout(res, ms));

export const zenviahApi = {
  async getDashboardOverview(range: string = "7d") {
    await delay(100);
    const state = useAppStore.getState();
    const multiplier = range === "24h" ? 0.16 : range === "30d" ? 3.4 : 1;

    return {
      totalCalls: Math.round(40560 * multiplier),
      totalMinutes: Math.round(98420 * multiplier),
      successfulCalls: Math.round(38290 * multiplier),
      activeAgents: state.agents.filter((a) => a.status === "Published").length,
      avgCallDurationSeconds: 146,
      estimatedCostINR: Math.round(248900 * multiplier),
      dailyVolume: ANALYTICS_DAILY_VOLUME,
      languageDistribution: ANALYTICS_LANGUAGE_DISTRIBUTION,
      outcomeDistribution: ANALYTICS_OUTCOME_DISTRIBUTION,
    };
  },

  async getAgents(): Promise<AIAgent[]> {
    await delay(80);
    return useAppStore.getState().agents;
  },

  async getAgentById(id: string): Promise<AIAgent | undefined> {
    await delay(60);
    return useAppStore.getState().agents.find((a) => a.id === id);
  },

  async getKnowledgeBases(): Promise<KnowledgeBase[]> {
    await delay(80);
    return useAppStore.getState().knowledgeBases;
  },

  async getCalls(): Promise<CallRecord[]> {
    await delay(90);
    return useAppStore.getState().calls;
  },

  async getCampaigns(): Promise<CampaignRecord[]> {
    await delay(80);
    return useAppStore.getState().campaigns;
  },
};

