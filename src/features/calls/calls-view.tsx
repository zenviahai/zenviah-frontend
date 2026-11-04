"use client";

import React, { useState, useEffect } from "react";
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Search,
  Play,
  Pause,
  Download,
  Sparkles,
  Wrench,
  Clock,
  FileText,
  CheckCircle2,
  Bot,
  User,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { useAppStore } from "@/stores/use-app-store";
import { CallDirection, CallRecord, CallStatus } from "@/types";
import { formatDuration, formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function CallsView() {
  const { calls, agents } = useAppStore();

  // Filter states
  const [search, setSearch] = useState("");
  const [directionFilter, setDirectionFilter] = useState<"All" | CallDirection>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | CallStatus>("All");
  const [agentFilter, setAgentFilter] = useState<string>("All");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("7d");

  // Selected Call for Detail Inspector
  const [selectedCallId, setSelectedCallId] = useState<string>(
    calls[0]?.id || ""
  );

  // Audio Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgressSec, setPlayProgressSec] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.callerNumber.toLowerCase().includes(search.toLowerCase()) ||
      (call.callerName &&
        call.callerName.toLowerCase().includes(search.toLowerCase())) ||
      call.agentName.toLowerCase().includes(search.toLowerCase()) ||
      call.summary.toLowerCase().includes(search.toLowerCase());
    const matchesDir =
      directionFilter === "All" || call.direction === directionFilter;
    const matchesStatus =
      statusFilter === "All" || call.status === statusFilter;
    const matchesAgent =
      agentFilter === "All" || call.agentId === agentFilter;
    return matchesSearch && matchesDir && matchesStatus && matchesAgent;
  });

  const activeCall: CallRecord | undefined =
    filteredCalls.find((c) => c.id === selectedCallId) ||
    calls.find((c) => c.id === selectedCallId) ||
    filteredCalls[0];

  useEffect(() => {
    setIsPlaying(false);
    setPlayProgressSec(0);
  }, [selectedCallId]);

  useEffect(() => {
    if (!isPlaying || !activeCall) return;
    const maxSec = activeCall.recordingDurationSeconds || 60;
    const timer = setInterval(() => {
      setPlayProgressSec((prev) => {
        if (prev >= maxSec) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);
    return () => clearInterval(timer);
  }, [isPlaying, activeCall, playbackSpeed]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
            Call Logs, Recordings & AI Transcripts
          </h1>
          <p className="mt-1 text-xs text-[#777E90]">
            Inspect inbound and outbound voice sessions, extracted CRM data, mid-call tool executions, and audio recordings.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            toast.success("Exported filtered call logs to CSV (INR cost breakdown included)")
          }
        >
          <Download className="h-4 w-4" />
          <span>Export Call Logs CSV</span>
        </Button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E8EAF0] bg-white p-4 shadow-subtle xl:flex-row xl:items-center">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#777E90]" />
            <Input
              placeholder="Search caller +91, name, summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Direction Filter */}
          <div className="inline-flex rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-1">
            {(["All", "Inbound", "Outbound"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => setDirectionFilter(dir)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  directionFilter === dir
                    ? "bg-white text-[#171923] shadow-subtle"
                    : "text-[#777E90] hover:text-[#171923]"
                }`}
              >
                {dir}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="inline-flex rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-1">
            {(["All", "Completed", "Failed", "Missed"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? "bg-white text-[#171923] shadow-subtle"
                    : "text-[#777E90] hover:text-[#171923]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Agent Filter */}
          <select
            aria-label="Filter calls by AI Agent"
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="h-9 rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs font-medium text-[#171923]"
          >
            <option value="All">All AI Agents</option>
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name}
              </option>
            ))}
          </select>

          {/* Date Range Filter */}
          <select
            aria-label="Filter calls by date range"
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
            className="h-9 rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs font-medium text-[#171923]"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        <div className="text-xs text-[#777E90]">
          Showing <strong>{filteredCalls.length}</strong> calls
        </div>
      </div>

      {/* Main Master-Detail Split Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 7 Columns: Call Logs Table */}
        <Card className="lg:col-span-7 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caller Number</TableHead>
                <TableHead>AI Agent</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCalls.map((call) => {
                const isSelected = call.id === activeCall?.id;
                return (
                  <TableRow
                    key={call.id}
                    onClick={() => setSelectedCallId(call.id)}
                    className={`cursor-pointer ${
                      isSelected ? "bg-[#635BFF]/[0.06]" : ""
                    }`}
                  >
                    <TableCell>
                      <p className="font-mono text-xs font-bold text-[#171923]">
                        {call.callerNumber}
                      </p>
                      <p className="text-[11px] text-[#777E90]">
                        {call.callerName || call.language}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs font-semibold text-[#171923] line-clamp-1 max-w-[160px]">
                        {call.agentName.split("—")[0].trim()}
                      </p>
                      <p className="text-[10px] text-[#777E90]">
                        {call.language}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          call.direction === "Inbound"
                            ? "text-[#635BFF]"
                            : "text-[#16A36A]"
                        }`}
                      >
                        {call.direction === "Inbound" ? (
                          <PhoneIncoming className="h-3.5 w-3.5" />
                        ) : (
                          <PhoneOutgoing className="h-3.5 w-3.5" />
                        )}
                        {call.direction}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {formatDuration(call.durationSeconds)}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-xs text-[#777E90]">
                      {format(new Date(call.startTime), "dd MMM, hh:mm a")}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-xs">
                      {formatINR(call.costINR, true)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        {/* Right 5 Columns: Comprehensive Call Detail Inspector */}
        <div className="lg:col-span-5">
          {activeCall ? (
            <Card className="sticky top-20 space-y-1">
              <CardHeader className="border-b border-[#E8EAF0] pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="default">{activeCall.outcome}</Badge>
                  <span className="font-mono text-xs text-[#777E90]">
                    ID: {activeCall.id}
                  </span>
                </div>
                <CardTitle className="pt-2 text-lg">
                  {activeCall.callerNumber}
                </CardTitle>
                <CardDescription>
                  {activeCall.callerName || "Verified Caller"} • Handled by{" "}
                  <strong className="text-[#171923]">
                    {activeCall.agentName}
                  </strong>
                </CardDescription>

                {/* Recording Player UI */}
                <div className="mt-3 rounded-xl bg-[#111318] p-3.5 text-white space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        disabled={activeCall.recordingDurationSeconds === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#635BFF] text-white hover:bg-[#5249F5] disabled:opacity-40"
                        aria-label={isPlaying ? "Pause recording" : "Play recording"}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                      <div>
                        <p className="text-xs font-semibold">
                          Stereo Call Recording (Opus HD)
                        </p>
                        <p className="font-mono text-[10px] text-[#A3A9B8]">
                          {formatDuration(playProgressSec, "clock")} /{" "}
                          {formatDuration(
                            activeCall.recordingDurationSeconds,
                            "clock"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {([1, 1.25, 1.5] as const).map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={() => setPlaybackSpeed(spd)}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            playbackSpeed === spd
                              ? "bg-[#635BFF] text-white"
                              : "bg-white/10 text-[#A3A9B8]"
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrubber */}
                  <input
                    type="range"
                    min={0}
                    max={Math.max(1, activeCall.recordingDurationSeconds)}
                    value={playProgressSec}
                    onChange={(e) => setPlayProgressSec(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer accent-[#8B7CFF]"
                  />
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <Tabs defaultValue="summary">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="transcript">
                      Transcript ({activeCall.transcript.length})
                    </TabsTrigger>
                    <TabsTrigger value="tools">
                      Tools ({activeCall.toolExecutions.length})
                    </TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  </TabsList>

                  {/* AI Summary & Extracted Information */}
                  <TabsContent value="summary" className="space-y-4">
                    <div className="rounded-xl border border-[#635BFF]/20 bg-[#635BFF]/[0.04] p-3.5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#635BFF]">
                        <Sparkles className="h-3.5 w-3.5" />
                        AI-Generated Call Summary
                      </div>
                      <p className="text-xs leading-relaxed text-[#171923]">
                        {activeCall.summary}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#777E90]">
                        Extracted Structured Information
                      </h4>
                      <div className="divide-y divide-[#E8EAF0] rounded-xl border border-[#E8EAF0] bg-[#F8F9FC]">
                        {Object.entries(activeCall.extractedData).map(
                          ([key, val]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between px-3.5 py-2.5 text-xs"
                            >
                              <span className="font-medium text-[#777E90]">
                                {key}
                              </span>
                              <span className="font-semibold text-[#171923]">
                                {val}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Transcript */}
                  <TabsContent value="transcript">
                    <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                      {activeCall.transcript.length === 0 ? (
                        <p className="py-6 text-center text-xs text-[#777E90]">
                          No transcript recorded for this call.
                        </p>
                      ) : (
                        activeCall.transcript.map((turn) => (
                          <div
                            key={turn.id}
                            className="rounded-xl border border-[#E8EAF0] p-3 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`font-bold ${
                                  turn.speaker === "Agent"
                                    ? "text-[#635BFF]"
                                    : "text-[#171923]"
                                }`}
                              >
                                {turn.speaker === "Agent"
                                  ? `AI Agent (${activeCall.agentName.split("—")[0].trim()})`
                                  : `Caller (${activeCall.callerName || activeCall.callerNumber})`}
                              </span>
                              <span className="font-mono text-[10px] text-[#777E90]">
                                {turn.timestamp}
                                {turn.latencyMs ? ` • ${turn.latencyMs}ms` : ""}
                              </span>
                            </div>
                            <p className="leading-relaxed text-[#4A5060]">
                              {turn.text}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {/* Tool Execution History */}
                  <TabsContent value="tools">
                    <div className="space-y-3">
                      {activeCall.toolExecutions.length === 0 ? (
                        <p className="py-6 text-center text-xs text-[#777E90]">
                          No mid-call webhooks or API tools were triggered.
                        </p>
                      ) : (
                        activeCall.toolExecutions.map((tool) => (
                          <div
                            key={tool.id}
                            className="rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-3 text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-[#171923]">
                                {tool.toolName}
                              </span>
                              <Badge variant="success">
                                {tool.durationMs}ms • {tool.status}
                              </Badge>
                            </div>
                            <div className="rounded bg-white p-2 font-mono text-[10px] text-[#4A5060]">
                              <div>In: {tool.inputPayload}</div>
                              <div className="mt-1 text-[#16A36A]">
                                Out: {tool.outputPayload}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {/* Call Timeline */}
                  <TabsContent value="timeline">
                    <div className="space-y-3 py-2 text-xs">
                      {[
                        {
                          time: "00:00.0",
                          event: `SIP INVITE received (${activeCall.direction})`,
                          detail: "Mumbai PoP Media Gateway connected",
                        },
                        {
                          time: "00:00.4",
                          event: "Neural Voice & ASR Stream Initialized",
                          detail: `Language: ${activeCall.language}`,
                        },
                        {
                          time: formatDuration(
                            Math.floor(activeCall.durationSeconds / 2),
                            "clock"
                          ),
                          event: "Intent Classification & Tool Execution",
                          detail: `Outcome: ${activeCall.outcome}`,
                        },
                        {
                          time: formatDuration(
                            activeCall.durationSeconds,
                            "clock"
                          ),
                          event: "Call Completed & Post-Call Webhook Dispatched",
                          detail: `Total Cost: ${formatINR(activeCall.costINR, true)}`,
                        },
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="mt-0.5 rounded bg-[#635BFF]/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#635BFF]">
                            {step.time}
                          </span>
                          <div>
                            <p className="font-semibold text-[#171923]">
                              {step.event}
                            </p>
                            <p className="text-[11px] text-[#777E90]">
                              {step.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

