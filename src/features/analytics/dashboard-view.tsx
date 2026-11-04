"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PhoneCall,
  Clock,
  CheckCircle2,
  Bot,
  Timer,
  IndianRupee,
  Plus,
  GitBranch,
  Megaphone,
  ArrowUpRight,
  Calendar,
  Sparkles,
  PhoneIncoming,
  PhoneOutgoing,
  Blocks,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppStore } from "@/stores/use-app-store";
import { useDashboardOverview } from "@/hooks/use-zenviah-queries";
import { formatDuration, formatINR, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function DashboardView() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<"24h" | "7d" | "30d">("7d");

  const {
    user,
    workspaces,
    activeWorkspaceId,
    agents,
    calls,
    campaigns,
    integrations,
  } = useAppStore();

  const { data, isLoading } = useDashboardOverview(dateRange);

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const kpiCards = [
    {
      title: "Total Calls",
      value: data ? formatNumber(data.totalCalls) : "40,560",
      delta: "+18.4% vs prior period",
      icon: PhoneCall,
      accent: "bg-[#635BFF]/10 text-[#635BFF]",
    },
    {
      title: "Total Minutes",
      value: data ? `${formatNumber(data.totalMinutes)}m` : "98,420m",
      delta: "+21.2% voice stream time",
      icon: Clock,
      accent: "bg-[#8B7CFF]/15 text-[#635BFF]",
    },
    {
      title: "Successful Calls",
      value: data ? formatNumber(data.successfulCalls) : "38,290",
      delta: "94.4% autonomous resolution",
      icon: CheckCircle2,
      accent: "bg-[#16A36A]/10 text-[#16A36A]",
    },
    {
      title: "Active AI Agents",
      value: `${agents.filter((a) => a.status === "Published").length} / ${agents.length}`,
      delta: "8 Indian + Global languages",
      icon: Bot,
      accent: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
    },
    {
      title: "Average Call Duration",
      value: formatDuration(data?.avgCallDurationSeconds ?? 146),
      delta: "275ms avg turn latency",
      icon: Timer,
      accent: "bg-[#F59E0B]/10 text-[#D97706]",
    },
    {
      title: "Estimated Usage Cost",
      value: formatINR(data?.estimatedCostINR ?? 248900),
      delta: "₹2.53 avg cost / minute",
      icon: IndianRupee,
      accent: "bg-[#16A36A]/10 text-[#16A36A]",
    },
  ];

  const agentUsageChartData = agents.map((a) => ({
    name: a.name.split("—")[0].trim(),
    calls: a.totalCalls || 420,
    successRate: a.successRate || 90,
  }));

  return (
    <div className="space-y-6 pb-10">
      {/* Top Welcome & Action Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E8EAF0] bg-white p-6 shadow-card lg:flex-row lg:items-center">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {activeWorkspace.name}
            </Badge>
            <Badge variant="success">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A36A]" />
              Mumbai & Bengaluru Voice Clusters Live
            </Badge>
          </div>
          <h1 className="pt-1 text-2xl font-bold tracking-tight text-[#171923]">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="text-xs text-[#777E90]">
            Zenviah.ai — Intelligent Voice. Automated Business. Monitor your live AI phone agents, workflows, and call outcomes.
          </p>
        </div>

        {/* Date Filter & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-1">
            {(
              [
                { id: "24h", label: "24 Hours" },
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setDateRange(item.id);
                  toast.info(`Dashboard metrics updated to Last ${item.label}`);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  dateRange === item.id
                    ? "bg-white text-[#171923] shadow-subtle"
                    : "text-[#777E90] hover:text-[#171923]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={() => router.push("/workflows")}
          >
            <GitBranch className="h-4 w-4 text-[#635BFF]" />
            <span>Workflow Builder</span>
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={() => router.push("/campaigns")}
          >
            <Megaphone className="h-4 w-4 text-[#16A36A]" />
            <span>New Campaign</span>
          </Button>

          <Button size="default" onClick={() => router.push("/agents/new")}>
            <Plus className="h-4 w-4" />
            <span>Create AI Agent</span>
          </Button>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-32 w-full rounded-xl" />
            ))
          : kpiCards.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <Card
                  key={kpi.title}
                  className="hover:border-[#635BFF]/40 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#777E90]">
                        {kpi.title}
                      </span>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${kpi.accent}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-3 text-2xl font-bold tracking-tight text-[#171923]">
                      {kpi.value}
                    </div>
                    <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-[#16A36A]">
                      <ArrowUpRight className="h-3 w-3" />
                      {kpi.delta}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Main Charts Row: Inbound vs Outbound Call Volume Over Time + Call Outcome Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Call Volume & Direction Over Time</CardTitle>
              <CardDescription>
                Daily inbound vs. outbound AI voice calls across all +91 virtual numbers and SIP trunks
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-[#171923]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#635BFF]" />
                Inbound Calls
              </span>
              <span className="flex items-center gap-1.5 font-medium text-[#171923]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#16A36A]" />
                Outbound Calls
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[290px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data?.dailyVolume ?? []}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#635BFF" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#635BFF" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A36A" stopOpacity={0.24} />
                      <stop offset="95%" stopColor="#16A36A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#777E90" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#777E90" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E8EAF0",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="inbound"
                    name="Inbound Calls"
                    stroke="#635BFF"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorInbound)"
                  />
                  <Area
                    type="monotone"
                    dataKey="outbound"
                    name="Outbound Calls"
                    stroke="#16A36A"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorOutbound)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Call Outcome Distribution */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle>Call Outcome Distribution</CardTitle>
            <CardDescription>
              Resolution breakdown across autonomous agents & warm transfers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.outcomeDistribution ?? []}
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {(data?.outcomeDistribution ?? []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: number) => [`${val}%`, "Share"]}
                    contentStyle={{
                      borderRadius: "10px",
                      borderColor: "#E8EAF0",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2">
              {(data?.outcomeDistribution ?? []).map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[#4A5060]">{item.name}</span>
                  </div>
                  <span className="font-semibold text-[#171923]">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row: Usage by AI Agent + Call Success Rate Trend */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6">
          <CardHeader className="pb-2">
            <CardTitle>Usage by AI Voice Agent</CardTitle>
            <CardDescription>
              Total calls handled per specialized AI agent in your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={agentUsageChartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#777E90" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#777E90" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "10px",
                      borderColor: "#E8EAF0",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="calls"
                    name="Total Calls"
                    fill="#635BFF"
                    radius={[6, 6, 0, 0]}
                    barSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader className="pb-2">
            <CardTitle>Call Success Rate & Language Telemetry</CardTitle>
            <CardDescription>
              Multilingual resolution accuracy across Indian & global voice streams
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 pt-2">
            {(data?.languageDistribution ?? []).map((lang) => (
              <div key={lang.language} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#171923]">
                    {lang.language}
                  </span>
                  <span className="text-[#777E90]">
                    {formatNumber(lang.calls)} calls ({lang.share}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F3F9]">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${lang.share}%`,
                      backgroundColor: lang.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Grid: Recent Calls, Agent Activity, Campaigns, Integrations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Calls */}
        <Card className="lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Calls</CardTitle>
              <CardDescription>
                Live inbound & outbound AI conversations with INR cost telemetry
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/calls">View All Calls</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-[#E8EAF0]">
              {calls.slice(0, 5).map((call) => (
                <div
                  key={call.id}
                  onClick={() => router.push("/calls")}
                  className="flex cursor-pointer items-center justify-between py-3 transition-colors hover:bg-[#F8F9FC] px-2 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        call.direction === "Inbound"
                          ? "bg-[#635BFF]/10 text-[#635BFF]"
                          : "bg-[#16A36A]/10 text-[#16A36A]"
                      }`}
                    >
                      {call.direction === "Inbound" ? (
                        <PhoneIncoming className="h-4 w-4" />
                      ) : (
                        <PhoneOutgoing className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#171923]">
                          {call.callerNumber}
                        </span>
                        {call.callerName && (
                          <span className="text-xs text-[#777E90]">
                            • {call.callerName}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#777E90]">
                        {call.agentName} • {call.language}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-xs font-semibold text-[#171923]">
                        {formatDuration(call.durationSeconds)}
                      </p>
                      <p className="text-[11px] text-[#777E90]">
                        {formatINR(call.costINR, true)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        call.status === "Completed"
                          ? "success"
                          : call.status === "Missed"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {call.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Recent Agent Activity, Campaigns & Integrations */}
        <div className="space-y-6 lg:col-span-5">
          {/* Recent Campaigns */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Active Outbound Campaigns</CardTitle>
                <CardDescription>Real-time dialer progress & spend</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/campaigns">Manage</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {campaigns.slice(0, 2).map((cmp) => {
                const progress = Math.round(
                  (cmp.callsAttempted / cmp.totalContacts) * 100
                );
                return (
                  <div
                    key={cmp.id}
                    className="rounded-xl border border-[#E8EAF0] p-3.5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#171923]">
                        {cmp.name}
                      </span>
                      <Badge
                        variant={
                          cmp.status === "Running" ? "success" : "warning"
                        }
                      >
                        {cmp.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#777E90]">
                      <span>
                        {formatNumber(cmp.callsCompleted)} /{" "}
                        {formatNumber(cmp.totalContacts)} contacts
                      </span>
                      <span>
                        Answer Rate: <strong>{cmp.answerRate}%</strong> •{" "}
                        {formatINR(cmp.spentINR)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E8EAF0]">
                      <div
                        className="h-full rounded-full bg-[#635BFF]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Agent & Integration Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Recent Agents & Integrations</CardTitle>
                <CardDescription>Connected telephony & AI gateways</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/integrations">Marketplace</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {agents.slice(0, 2).map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => router.push(`/agents/${ag.id}`)}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-[#E8EAF0] p-2.5 hover:border-[#635BFF]/40"
                >
                  <div className="flex items-center gap-2.5">
                    <Activity className="h-4 w-4 text-[#635BFF]" />
                    <div>
                      <p className="text-xs font-semibold text-[#171923]">
                        {ag.name}
                      </p>
                      <p className="text-[11px] text-[#777E90]">
                        {ag.voiceProvider} • {ag.assignedPhoneNumber || "Unassigned"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">{ag.status}</Badge>
                </div>
              ))}

              <div className="flex flex-wrap gap-2 pt-1">
                {integrations
                  .filter((i) => i.status === "Connected")
                  .slice(0, 5)
                  .map((int) => (
                    <span
                      key={int.id}
                      onClick={() => router.push("/integrations")}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#E8EAF0] bg-[#F8F9FC] px-2.5 py-1 text-[11px] font-medium text-[#171923] hover:border-[#635BFF]"
                    >
                      <Blocks className="h-3 w-3 text-[#16A36A]" />
                      {int.name}
                    </span>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

