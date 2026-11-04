"use client";

import { useQuery } from "@tanstack/react-query";
import { zenviahApi } from "@/services/api";
import { useAppStore } from "@/stores/use-app-store";

export function useDashboardOverview(range: string) {
  const agentsCount = useAppStore((s) => s.agents.length);
  return useQuery({
    queryKey: ["dashboard-overview", range, agentsCount],
    queryFn: () => zenviahApi.getDashboardOverview(range),
  });
}

export function useAgentsQuery() {
  const agents = useAppStore((s) => s.agents);
  return useQuery({
    queryKey: ["agents", agents.length],
    queryFn: () => zenviahApi.getAgents(),
    initialData: agents,
  });
}

export function useCallsQuery() {
  const calls = useAppStore((s) => s.calls);
  return useQuery({
    queryKey: ["calls", calls.length],
    queryFn: () => zenviahApi.getCalls(),
    initialData: calls,
  });
}

