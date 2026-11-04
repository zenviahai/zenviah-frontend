"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Download,
  PhoneCall,
  Clock,
  Timer,
  CheckCircle2,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { useAppStore } from "@/stores/use-app-store";
import {
  ANALYTICS_DAILY_VOLUME,
  ANALYTICS_LANGUAGE_DISTRIBUTION,
  ANALYTICS_OUTCOME_DISTRIBUTION,
} from "@/mocks/data";
import { formatDuration, formatINR, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export function AnalyticsView() {
  const { agents, campaigns } = useAppStore();

  const [dateFilter, setDateFilter] = useState<"7d" | "30d" | "90d">("30d");
  const [agentFilter, setAgentFilter] = useState<string>("All");
  const [campaignFilter, setCampaignFilter] = useState<string>("All");

  const mult = dateFilter === "7d" ? 0.35 : dateFilter === "90d" ? 2.6 : 1;

  const kpis = [
    {
      label: "Total Calls",
      value: formatNumber(Math.round(40560 * mult)),
      sub: "+19.4% vs previous cycle",
      icon: PhoneCall,
    },
    {
      label: "Total Minutes",
      value: `${formatNumber(Math.round(98420 * mult))}m`,
      sub: "Sub-300ms median turn latency",
      icon: Clock,
    },
    {
      label: "Average Call Duration",
      value: formatDuration(146),
      sub: "Optimal resolution speed",
      icon: Timer,
    },
    {
      label: "Answer Rate",
      value: "88.4%",
      sub: "Verified +91 Exotel / SIP Caller ID",
      icon: TrendingUp,
    },
    {
      label: "Success Rate",
      value: "94.6%",
      sub: "Autonomous AI resolution",
      icon: CheckCircle2,
    },
    {
      label: "Cost per Call",
      value: formatINR(6.14, true),
      sub: "Includes LLM + Voice + Telephony",
      icon: IndianRupee,
    },
  ];

  const agentPerfData = agents.map((a) => ({
    name: a.name.split("—")[0].trim(),
    calls: a.totalCalls || 650,
    successRate: a.successRate || 91,
  }));

  const campaignPerfData = campaigns.map((c) => ({
    name: c.name.split(" ").slice(0, 3).join(" "),
    completed: c.callsCompleted,
    answerRate: c.answerRate,
    successRate: c.successRate,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filters */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E8EAF0] bg-white p-5 shadow-card lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
            Real-Time Voice Analytics & Telemetry
          </h1>
          <p className="mt-1 text-xs text-[#777E90]">
            Deep insights into call volume, multilingual accuracy, agent performance, campaign ROI, and INR usage trends.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Filter */}
          <select
            aria-label="Date range filter"
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value as "7d" | "30d" | "90d")
            }
            className="h-9 rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs font-semibold text-[#171923]"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days (Quarter)</option>
          </select>

          {/* Agent Filter */}
          <select
            aria-label="Agent filter"
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="h-9 rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs font-medium text-[#171923]"
          >
            <option value="All">All AI Agents</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          {/* Campaign Filter */}
          <select
            aria-label="Campaign filter"
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="h-9 rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs font-medium text-[#171923]"
          >
            <option value="All">All Campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={() =>
              toast.success("Downloaded Analytics Telemetry Report (CSV & PDF)")
            }
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#777E90]">
                    {k.label}
                  </span>
                  <Icon className="h-4 w-4 text-[#635BFF]" />
                </div>
                <p className="mt-2.5 text-2xl font-bold text-[#171923]">
                  {k.value}
                </p>
                <p className="mt-1 text-[11px] font-medium text-[#16A36A]">
                  {k.sub}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Row 1: Daily Call Volume (Inbound vs Outbound) + Usage Cost Trend */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Daily Call Volume — Inbound vs. Outbound</CardTitle>
            <CardDescription>
              Concurrent SIP and virtual DID call volume across Indian telecom circles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_DAILY_VOLUME}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#777E90" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#777E90" }} />
                  <RechartsTooltip />
                  <Area
                    type="monotone"
                    dataKey="inbound"
                    name="Inbound"
                    stroke="#635BFF"
                    fill="#635BFF"
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="outbound"
                    name="Outbound"
                    stroke="#16A36A"
                    fill="#16A36A"
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Usage & Cost Trends (INR)</CardTitle>
            <CardDescription>
              Daily voice compute & telephony spend in ₹ INR
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ANALYTICS_DAILY_VOLUME}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#777E90" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#777E90" }} />
                  <RechartsTooltip
                    formatter={(v: number) => [formatINR(v), "Daily Spend"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="costINR"
                    name="Daily Cost (INR)"
                    stroke="#8B7CFF"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#635BFF" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Agent Performance + Campaign Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>AI Agent Performance Comparison</CardTitle>
            <CardDescription>
              Call volume and resolution accuracy per deployed agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentPerfData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#777E90" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#777E90" }} />
                  <RechartsTooltip />
                  <Bar
                    dataKey="calls"
                    name="Calls Handled"
                    fill="#635BFF"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Outbound Campaign Performance</CardTitle>
            <CardDescription>
              Answer rate (%) vs. conversion success rate (%) by campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerfData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#777E90" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#777E90" }} />
                  <RechartsTooltip />
                  <Bar
                    dataKey="answerRate"
                    name="Answer Rate %"
                    fill="#8B7CFF"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="successRate"
                    name="Success Rate %"
                    fill="#16A36A"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Language Distribution + Call Outcomes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Language & Code-Switching Distribution</CardTitle>
            <CardDescription>
              Breakdown across Tamil-English, Hindi-English, English, Telugu, Kannada, Malayalam, Bengali & Marathi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {ANALYTICS_LANGUAGE_DISTRIBUTION.map((l) => (
              <div key={l.language} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#171923]">
                    {l.language}
                  </span>
                  <span className="text-[#777E90]">
                    {formatNumber(l.calls)} calls ({l.share}%)
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F1F3F9]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${l.share}%`, backgroundColor: l.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Call Outcomes Breakdown</CardTitle>
            <CardDescription>
              End-of-call classification across all voice workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[190px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ANALYTICS_OUTCOME_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={76}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {ANALYTICS_OUTCOME_DISTRIBUTION.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 pt-2">
              {ANALYTICS_OUTCOME_DISTRIBUTION.map((o) => (
                <div
                  key={o.name}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-2 text-[#4A5060]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: o.color }}
                    />
                    {o.name}
                  </span>
                  <span className="font-bold text-[#171923]">{o.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

