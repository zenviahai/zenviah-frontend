"use client";

import React, { useState } from "react";
import {
  User,
  Building2,
  Users,
  Shield,
  KeyRound,
  Webhook,
  Bell,
  Lock,
  CreditCard,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  Save,
} from "lucide-react";
import { useAppStore } from "@/stores/use-app-store";
import { ApiKeyRecord } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function SettingsView() {
  const {
    user,
    updateUserProfile,
    workspaces,
    activeWorkspaceId,
    teamMembers,
    inviteTeamMember,
    removeTeamMember,
    apiKeys,
    createApiKey,
    revokeApiKey,
    webhooks,
    addWebhook,
    toggleWebhook,
  } = useAppStore();

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  // General form state
  const [fullName, setFullName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [company, setCompany] = useState(user.company);

  // Invite Team Member modal
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Developer" | "Analyst">("Developer");

  // Create API Key modal
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [keyEnv, setKeyEnv] = useState<ApiKeyRecord["environment"]>("Production");

  // Add Webhook modal
  const [whModalOpen, setWhModalOpen] = useState(false);
  const [whUrl, setWhUrl] = useState("");

  // Notification & Security Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackEscalation, setSlackEscalation] = useState(true);
  const [budgetThresholdAlert, setBudgetThresholdAlert] = useState(true);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [piiRedaction, setPiiRedaction] = useState(true);
  const [autoRechargeEnabled, setAutoRechargeEnabled] = useState(true);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: fullName, email, company });
    toast.success("Saved general profile & organization settings");
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    inviteTeamMember({
      id: `tm-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "Invited",
      lastActive: "Invited just now",
    });
    setInviteName("");
    setInviteEmail("");
    setInviteOpen(false);
    toast.success(`Sent workspace invitation to ${inviteEmail}`);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    const created = createApiKey(keyName.trim(), keyEnv);
    setKeyName("");
    setKeyModalOpen(false);
    toast.success(`Generated masked API key: ${created.maskedKey}`);
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whUrl.trim()) return;
    addWebhook({
      id: `wh-${Date.now()}`,
      url: whUrl.trim(),
      events: ["call.completed", "call.transcript.ready"],
      status: "Active",
      secretMasked: "whsec_znv_••••••••••••••••712e",
      lastTriggered: "Ready",
    });
    setWhUrl("");
    setWhModalOpen(false);
    toast.success("Added signed webhook endpoint");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
          Platform & Workspace Settings
        </h1>
        <p className="mt-1 text-xs text-[#777E90]">
          Configure multi-tenant workspace preferences, team access, masked API keys, webhooks, and DPDP compliance controls.
        </p>
      </div>

      {/* 9-Tab Settings Navigation */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-white p-1.5 shadow-subtle">
          <TabsTrigger value="general">
            <User className="h-3.5 w-3.5" />
            General
          </TabsTrigger>
          <TabsTrigger value="workspace">
            <Building2 className="h-3.5 w-3.5" />
            Workspace
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="h-3.5 w-3.5" />
            Team Members
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="h-3.5 w-3.5" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="api-keys">
            <KeyRound className="h-3.5 w-3.5" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Webhook className="h-3.5 w-3.5" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-3.5 w-3.5" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing-prefs">
            <CreditCard className="h-3.5 w-3.5" />
            Billing Preferences
          </TabsTrigger>
        </TabsList>

        {/* 1. GENERAL */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Account Profile</CardTitle>
              <CardDescription>
                Manage your personal operator profile and primary contact details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveGeneral} className="max-w-xl space-y-4">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Work Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Organization Name</Label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <Button type="submit">
                  <Save className="h-4 w-4" />
                  Save Profile Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. WORKSPACE */}
        <TabsContent value="workspace">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Tenant Workspace Configuration</CardTitle>
              <CardDescription>
                Regional voice cluster residency and default timezone for{" "}
                <strong>{activeWorkspace.name}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="max-w-xl space-y-4">
              <div className="space-y-1.5">
                <Label>Workspace Name</Label>
                <Input defaultValue={activeWorkspace.name} />
              </div>
              <div className="space-y-1.5">
                <Label>Workspace Slug</Label>
                <Input defaultValue={activeWorkspace.slug} className="font-mono text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label>Primary Voice Data Residency Region</Label>
                <select className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm">
                  <option>India — Mumbai & Bengaluru (`ap-south-1` / `ap-south-2`)</option>
                  <option>Singapore (`ap-southeast-1`)</option>
                  <option>US East (`us-east-1`)</option>
                </select>
              </div>
              <Button
                onClick={() =>
                  toast.success("Workspace regional configuration saved!")
                }
              >
                Update Workspace
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. TEAM MEMBERS */}
        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members ({teamMembers.length})</CardTitle>
                <CardDescription>
                  Invite engineers, voice prompt designers, and operations analysts.
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setInviteOpen(true)}>
                <Plus className="h-4 w-4" />
                Invite Member
              </Button>
            </CardHeader>
            <CardContent className="divide-y divide-[#E8EAF0]">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm font-bold text-[#171923]">
                      {member.name}
                    </p>
                    <p className="text-xs text-[#777E90]">
                      {member.email} • {member.lastActive}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Badge variant="outline">{member.role}</Badge>
                    <Badge
                      variant={
                        member.status === "Active" ? "success" : "warning"
                      }
                    >
                      {member.status}
                    </Badge>
                    {member.role !== "Owner" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[#E5484D]"
                        onClick={() => {
                          removeTeamMember(member.id);
                          toast.info(`Removed ${member.name} from workspace`);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. ROLES AND PERMISSIONS */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
              <CardDescription>
                Granular permissions across AI agents, workflows, billing, and API credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  role: "Owner",
                  desc: "Full administrative access including INR billing, workspace deletion, SIP trunks, and RBAC.",
                },
                {
                  role: "Admin",
                  desc: "Create/publish AI agents, edit React Flow workflows, manage campaigns, and configure integrations.",
                },
                {
                  role: "Developer",
                  desc: "Edit prompts, workflows, webhooks, and sandbox testing. No billing or team deletion access.",
                },
                {
                  role: "Analyst",
                  desc: "Read-only access to call transcripts, recordings, analytics charts, and CSV exports.",
                },
              ].map((r) => (
                <div
                  key={r.role}
                  className="rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-4 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#171923]">
                      {r.role}
                    </h4>
                    <Badge variant="default">Configured</Badge>
                  </div>
                  <p className="text-xs text-[#777E90] leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. API KEYS (Always Masked) */}
        <TabsContent value="api-keys">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Masked API Keys</CardTitle>
                <CardDescription>
                  All Zenviah.ai API keys are strictly masked in the UI and validated on the server.
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setKeyModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Generate Masked Key
              </Button>
            </CardHeader>
            <CardContent className="divide-y divide-[#E8EAF0]">
              {apiKeys.map((k) => (
                <div
                  key={k.id}
                  className="flex flex-col justify-between gap-3 py-3.5 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#171923]">
                        {k.name}
                      </span>
                      <Badge variant="outline">{k.environment}</Badge>
                    </div>
                    <p className="mt-1 font-mono text-xs text-[#635BFF]">
                      {k.maskedKey}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#777E90]">
                      Created {k.createdAt} • Last used {k.lastUsed}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.info("Copied masked key reference ID")
                      }
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy Reference
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        revokeApiKey(k.id);
                        toast.warning(`Revoked API key "${k.name}"`);
                      }}
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. WEBHOOKS */}
        <TabsContent value="webhooks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Event Webhook Endpoints</CardTitle>
                <CardDescription>
                  Receive real-time HMAC-SHA256 signed POST callbacks when calls finish or extract variables.
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setWhModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Endpoint
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {webhooks.map((wh) => (
                <div
                  key={wh.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-[#E8EAF0] p-4 sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <p className="font-mono text-xs font-bold text-[#171923]">
                      {wh.url}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {wh.events.map((ev) => (
                        <Badge key={ev} variant="secondary" className="text-[10px]">
                          {ev}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#777E90]">
                      Signing Secret: <code>{wh.secretMasked}</code> •{" "}
                      {wh.lastTriggered}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={wh.status === "Active"}
                      onCheckedChange={() => {
                        toggleWebhook(wh.id);
                        toast.info(`Updated webhook status for ${wh.url}`);
                      }}
                    />
                    <Badge
                      variant={
                        wh.status === "Active" ? "success" : "secondary"
                      }
                    >
                      {wh.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7. NOTIFICATIONS */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification & Alert Channels</CardTitle>
              <CardDescription>
                Configure real-time alerts for SIP trunk latency, campaign completion, and credit thresholds.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-[#E8EAF0] p-4">
                <div>
                  <p className="text-sm font-bold text-[#171923]">
                    Daily Voice Operations Digest Email
                  </p>
                  <p className="text-xs text-[#777E90]">
                    Send morning summary of total calls, resolution rate, and INR spend.
                  </p>
                </div>
                <Switch
                  checked={emailAlerts}
                  onCheckedChange={setEmailAlerts}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#E8EAF0] p-4">
                <div>
                  <p className="text-sm font-bold text-[#171923]">
                    Instant Escalation & Failed Call Alerts
                  </p>
                  <p className="text-xs text-[#777E90]">
                    Notify engineering channel if SIP 5xx errors exceed 1% over 5 minutes.
                  </p>
                </div>
                <Switch
                  checked={slackEscalation}
                  onCheckedChange={setSlackEscalation}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#E8EAF0] p-4">
                <div>
                  <p className="text-sm font-bold text-[#171923]">
                    Low INR Credit Balance Warning
                  </p>
                  <p className="text-xs text-[#777E90]">
                    Alert workspace owners when prepaid credits fall below ₹5,000.
                  </p>
                </div>
                <Switch
                  checked={budgetThresholdAlert}
                  onCheckedChange={setBudgetThresholdAlert}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 8. SECURITY */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Security & DPDP Compliance</CardTitle>
              <CardDescription>
                Enforce multi-factor authentication, automatic PII redaction, and DTMF masking.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-[#E8EAF0] p-4">
                <div>
                  <p className="text-sm font-bold text-[#171923]">
                    Enforce 2FA / MFA for All Workspace Members
                  </p>
                  <p className="text-xs text-[#777E90]">
                    Require TOTP or Google Workspace SSO before accessing call recordings.
                  </p>
                </div>
                <Switch
                  checked={mfaEnforced}
                  onCheckedChange={setMfaEnforced}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#E8EAF0] p-4">
                <div>
                  <p className="text-sm font-bold text-[#171923]">
                    Automatic Aadhaar, PAN & Card PII Redaction in Transcripts
                  </p>
                  <p className="text-xs text-[#777E90]">
                    Masks sensitive numbers (`•••• •••• 9182`) before storing transcripts on disk.
                  </p>
                </div>
                <Switch
                  checked={piiRedaction}
                  onCheckedChange={setPiiRedaction}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 9. BILLING PREFERENCES */}
        <TabsContent value="billing-prefs">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Auto-Recharge Preferences</CardTitle>
              <CardDescription>
                Configure automatic INR credit top-ups and tax invoice recipients.
              </CardDescription>
            </CardHeader>
            <CardContent className="max-w-xl space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-[#E8EAF0] p-4">
                <div>
                  <p className="text-sm font-bold text-[#171923]">
                    Automatic INR Credit Recharge
                  </p>
                  <p className="text-xs text-[#777E90]">
                    Automatically top up ₹10,000 when balance drops below ₹2,500 so live calls never drop.
                  </p>
                </div>
                <Switch
                  checked={autoRechargeEnabled}
                  onCheckedChange={setAutoRechargeEnabled}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Finance & GST Invoice Email Recipients</Label>
                <Input defaultValue="finance@zenviah.ai, arjun@zenviah.ai" />
              </div>
              <Button
                onClick={() =>
                  toast.success("Saved billing & auto-recharge preferences!")
                }
              >
                Save Billing Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Member Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member to {activeWorkspace.name}</DialogTitle>
            <DialogDescription>
              Send an email invitation with role-based permissions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInviteMember} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input
                placeholder="e.g.,Vikramaditya R."
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Work Email</Label>
              <Input
                type="email"
                placeholder="vikram@zenviah.ai"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <select
                value={inviteRole}
                onChange={(e) =>
                  setInviteRole(
                    e.target.value as "Admin" | "Developer" | "Analyst"
                  )
                }
                className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm"
              >
                <option value="Admin">Admin</option>
                <option value="Developer">Developer</option>
                <option value="Analyst">Analyst</option>
              </select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setInviteOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Send Invitation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Masked API Key Dialog */}
      <Dialog open={keyModalOpen} onOpenChange={setKeyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Masked API Key</DialogTitle>
            <DialogDescription>
              Keys are generated in your server vault and displayed in masked format.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Key Name / Description</Label>
              <Input
                placeholder="e.g., Production CRM Voice Sync"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Environment</Label>
              <select
                value={keyEnv}
                onChange={(e) =>
                  setKeyEnv(e.target.value as ApiKeyRecord["environment"])
                }
                className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm"
              >
                <option value="Production">Production</option>
                <option value="Staging">Staging</option>
                <option value="Development">Development</option>
              </select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setKeyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Generate Key</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Webhook Dialog */}
      <Dialog open={whModalOpen} onOpenChange={setWhModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Signed Webhook Endpoint</DialogTitle>
            <DialogDescription>
              Zenviah.ai will deliver signed JSON payloads for call lifecycle events.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateWebhook} className="space-y-4">
            <div className="space-y-1.5">
              <Label>HTTPS Endpoint URL</Label>
              <Input
                type="url"
                placeholder="https://api.yourcompany.in/webhooks/zenviah"
                value={whUrl}
                onChange={(e) => setWhUrl(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setWhModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Webhook</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

