"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Plus,
  Upload,
  Play,
  Pause,
  Square,
  Users,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Globe,
  Sliders,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useAppStore } from "@/stores/use-app-store";
import { CampaignRecord } from "@/types";
import { formatINR, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function CampaignsView() {
  const { campaigns, agents, addCampaign, setCampaignStatus } = useAppStore();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Campaign Wizard Fields
  const [cmpName, setCmpName] = useState(
    "Diwali Pre-Paid Order Confirmation Drive"
  );
  const [cmpDesc, setCmpDesc] = useState(
    "Multilingual Tamil, Hindi & English confirmation calls for festive express dispatch."
  );
  const [cmpAgentId, setCmpAgentId] = useState(agents[0]?.id || "");
  const [csvFileName, setCsvFileName] = useState(
    "festive_cohort_2500_contacts.csv"
  );
  const [contactCount, setContactCount] = useState(2500);
  const [scheduledStart, setScheduledStart] = useState("2026-11-05 09:30 IST");
  const [callingHoursStart, setCallingHoursStart] = useState("09:30");
  const [callingHoursEnd, setCallingHoursEnd] = useState("19:30");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [concurrency, setConcurrency] = useState(20);
  const [consentVerified, setConsentVerified] = useState(true);

  // Aggregated Analytics across all campaigns
  const totalContacts = campaigns.reduce((acc, c) => acc + c.totalContacts, 0);
  const callsAttempted = campaigns.reduce((acc, c) => acc + c.callsAttempted, 0);
  const callsCompleted = campaigns.reduce((acc, c) => acc + c.callsCompleted, 0);
  const failedCalls = campaigns.reduce((acc, c) => acc + c.failedCalls, 0);
  const avgAnswerRate = (
    campaigns.reduce((acc, c) => acc + c.answerRate, 0) /
    Math.max(1, campaigns.length)
  ).toFixed(1);
  const avgSuccessRate = (
    campaigns.reduce((acc, c) => acc + c.successRate, 0) /
    Math.max(1, campaigns.length)
  ).toFixed(1);

  const handleCreateCampaign = () => {
    if (!cmpName.trim()) {
      toast.error("Please enter a campaign name.");
      return;
    }
    if (!consentVerified) {
      toast.error(
        "Please confirm DND/TRAI consent compliance before scheduling."
      );
      return;
    }
    const chosenAgent =
      agents.find((a) => a.id === cmpAgentId) || agents[0];

    const created: CampaignRecord = {
      id: `cmp-${Date.now()}`,
      name: cmpName.trim(),
      description: cmpDesc.trim(),
      agentId: chosenAgent.id,
      agentName: chosenAgent.name,
      status: "Scheduled",
      totalContacts: contactCount,
      callsAttempted: 0,
      callsCompleted: 0,
      answerRate: 0,
      successRate: 0,
      failedCalls: 0,
      scheduledStart,
      callingHoursStart,
      callingHoursEnd,
      timezone,
      concurrency,
      contactListName: csvFileName,
      estimatedBudgetINR: Math.round(contactCount * 6.5),
      spentINR: 0,
    };

    addCampaign(created);
    setWizardOpen(false);
    setWizardStep(1);
    toast.success(`Scheduled campaign "${created.name}" (${contactCount} contacts)`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
            Outbound AI Calling Campaigns
          </h1>
          <p className="mt-1 text-xs text-[#777E90]">
            Orchestrate scheduled bulk voice campaigns with CSV contact lists, IST calling windows, and concurrency controls.
          </p>
        </div>

        <Button
          onClick={() => {
            setWizardStep(1);
            setWizardOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          <span>Create Campaign Wizard</span>
        </Button>
      </div>

      {/* Compliance Guardrail Banner */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#635BFF]/25 bg-[#635BFF]/[0.05] p-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#635BFF]" />
          <div>
            <p className="text-xs font-bold text-[#171923]">
              TRAI DLT & Consent Compliance Guardrails Enabled (UI Simulation)
            </p>
            <p className="mt-0.5 text-xs text-[#4A5060]">
              Outbound campaign dialing is simulated in the frontend. Real PSTN outbound dialing requires backend telephony integration, verified customer opt-in consent, and TRAI TCCCP calling window enforcement (09:00–21:00 IST).
            </p>
          </div>
        </div>
        <Badge variant="default">Compliance Verified</Badge>
      </div>

      {/* 6 Campaign Analytics KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Total Contacts", value: formatNumber(totalContacts) },
          { label: "Calls Attempted", value: formatNumber(callsAttempted) },
          { label: "Calls Completed", value: formatNumber(callsCompleted) },
          { label: "Avg Answer Rate", value: `${avgAnswerRate}%` },
          { label: "Avg Success Rate", value: `${avgSuccessRate}%` },
          { label: "Failed Calls", value: formatNumber(failedCalls) },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-[#777E90]">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-[#171923]">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {campaigns.map((cmp) => {
          const pct = Math.min(
            100,
            Math.round((cmp.callsAttempted / Math.max(1, cmp.totalContacts)) * 100)
          );
          return (
            <Card
              key={cmp.id}
              className="flex flex-col justify-between hover:border-[#635BFF]/40"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#171923]">
                        {cmp.name}
                      </h3>
                      <Badge
                        variant={
                          cmp.status === "Running"
                            ? "success"
                            : cmp.status === "Paused"
                            ? "warning"
                            : cmp.status === "Stopped"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {cmp.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-[#777E90]">
                      {cmp.description}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#4A5060]">
                      Progress: {formatNumber(cmp.callsAttempted)} /{" "}
                      {formatNumber(cmp.totalContacts)} contacts ({pct}%)
                    </span>
                    <span className="font-semibold text-[#171923]">
                      Spent: {formatINR(cmp.spentINR)} /{" "}
                      {formatINR(cmp.estimatedBudgetINR)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#E8EAF0]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#635BFF] to-[#16A36A]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-4 gap-2 rounded-xl bg-[#F8F9FC] p-3 text-center text-xs">
                  <div>
                    <p className="text-[10px] text-[#777E90]">Completed</p>
                    <p className="mt-0.5 font-bold text-[#171923]">
                      {formatNumber(cmp.callsCompleted)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#777E90]">Answer Rate</p>
                    <p className="mt-0.5 font-bold text-[#635BFF]">
                      {cmp.answerRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#777E90]">Success Rate</p>
                    <p className="mt-0.5 font-bold text-[#16A36A]">
                      {cmp.successRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#777E90]">Failed</p>
                    <p className="mt-0.5 font-bold text-[#E5484D]">
                      {cmp.failedCalls}
                    </p>
                  </div>
                </div>

                {/* Schedule & Concurrency Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E8EAF0] pt-3 text-[11px] text-[#777E90]">
                  <span>
                    Agent: <strong className="text-[#171923]">{cmp.agentName.split("—")[0]}</strong>
                  </span>
                  <span>
                    Hours: {cmp.callingHoursStart}–{cmp.callingHoursEnd} ({cmp.timezone})
                  </span>
                  <span>Concurrency: {cmp.concurrency} lines</span>
                </div>

                {/* Action Buttons: Pause, Resume, Stop */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="font-mono text-[11px] text-[#777E90]">
                    CSV: {cmp.contactListName}
                  </span>
                  <div className="flex items-center gap-2">
                    {cmp.status === "Running" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCampaignStatus(cmp.id, "Paused");
                          toast.warning(`Paused campaign "${cmp.name}"`);
                        }}
                      >
                        <Pause className="h-3.5 w-3.5 text-[#D97706]" />
                        Pause
                      </Button>
                    ) : (
                      cmp.status !== "Completed" && (
                        <Button
                          size="sm"
                          variant="soft"
                          onClick={() => {
                            setCampaignStatus(cmp.id, "Running");
                            toast.success(`Resumed campaign "${cmp.name}"`);
                          }}
                        >
                          <Play className="h-3.5 w-3.5" />
                          Resume
                        </Button>
                      )
                    )}
                    {cmp.status !== "Stopped" && cmp.status !== "Completed" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setCampaignStatus(cmp.id, "Stopped");
                          toast.error(`Stopped campaign "${cmp.name}"`);
                        }}
                      >
                        <Square className="h-3.5 w-3.5" />
                        Stop
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Multi-Step Campaign Creation Wizard Modal */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Create Outbound AI Campaign — Step {wizardStep} of 3
            </DialogTitle>
            <DialogDescription>
              Configure AI agent, upload CSV contact list, and set IST calling windows & concurrency.
            </DialogDescription>
          </DialogHeader>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-3 gap-2 py-1">
            {[
              { step: 1, label: "1. Agent & Details" },
              { step: 2, label: "2. CSV Contact List" },
              { step: 3, label: "3. Schedule & Pacing" },
            ].map((s) => (
              <div
                key={s.step}
                className={`rounded-lg px-3 py-1.5 text-center text-xs font-semibold ${
                  wizardStep === s.step
                    ? "bg-[#635BFF] text-white"
                    : "bg-[#F8F9FC] text-[#777E90]"
                }`}
              >
                {s.label}
              </div>
            ))}
          </div>

          {wizardStep === 1 && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Campaign Name</Label>
                <Input
                  value={cmpName}
                  onChange={(e) => setCmpName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Select AI Voice Agent</Label>
                <select
                  value={cmpAgentId}
                  onChange={(e) => setCmpAgentId(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.language})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Campaign Objective</Label>
                <Textarea
                  value={cmpDesc}
                  onChange={(e) => setCmpDesc(e.target.value)}
                />
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-4 py-2">
              <div className="rounded-2xl border-2 border-dashed border-[#D5D9E4] bg-[#F8F9FC] p-6 text-center space-y-2">
                <Upload className="mx-auto h-6 w-6 text-[#635BFF]" />
                <p className="text-xs font-bold text-[#171923]">
                  Upload CSV Contact List (+91 Phone, Customer Name, Custom Variables)
                </p>
                <p className="text-[11px] text-[#777E90]">
                  Active file: <strong>{csvFileName}</strong> ({contactCount}{" "}
                  verified opt-in rows)
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCsvFileName("q4_verified_customers_3200.csv");
                    setContactCount(3200);
                    toast.success(
                      "Parsed 3,200 contacts and scrubbed DND numbers!"
                    );
                  }}
                >
                  Select Another CSV Cohort
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label>Total Verified Contacts</Label>
                <Input
                  type="number"
                  value={contactCount}
                  onChange={(e) => setContactCount(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Scheduled Start</Label>
                  <Input
                    value={scheduledStart}
                    onChange={(e) => setScheduledStart(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Time Zone</Label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm"
                  >
                    <option value="Asia/Kolkata (IST)">
                      Asia/Kolkata (IST +05:30)
                    </option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York (EST)">
                      America/New_York (EST)
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Start Hour</Label>
                  <Input
                    type="time"
                    value={callingHoursStart}
                    onChange={(e) => setCallingHoursStart(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>End Hour</Label>
                  <Input
                    type="time"
                    value={callingHoursEnd}
                    onChange={(e) => setCallingHoursEnd(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Concurrency</Label>
                  <Input
                    type="number"
                    value={concurrency}
                    onChange={(e) => setConcurrency(Number(e.target.value))}
                  />
                </div>
              </div>

              <label className="flex items-start gap-2.5 rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-3 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentVerified}
                  onChange={(e) => setConsentVerified(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#E8EAF0] text-[#635BFF]"
                />
                <span>
                  I confirm all contacts in this CSV have provided explicit opt-in consent and comply with TRAI TCCCP commercial communication rules.
                </span>
              </label>
            </div>
          )}

          <DialogFooter>
            {wizardStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setWizardStep((s) => s - 1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            {wizardStep < 3 ? (
              <Button
                type="button"
                onClick={() => setWizardStep((s) => s + 1)}
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleCreateCampaign}>
                <CheckCircle2 className="h-4 w-4" />
                Schedule Campaign
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

