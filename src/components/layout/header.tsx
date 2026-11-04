"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
  Plus,
  Bot,
  GitBranch,
  PhoneCall,
  CreditCard,
  Settings,
  LogOut,
  KeyRound,
  User,
  Sparkles,
  CheckCheck,
} from "lucide-react";
import { useAppStore } from "@/stores/use-app-store";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Overview",
  agents: "AI Agents",
  new: "Create Agent Wizard",
  workflows: "Visual Workflow Builder",
  "knowledge-base": "Knowledge Base",
  "phone-numbers": "Phone Numbers (+91)",
  calls: "Call Logs & Transcripts",
  campaigns: "Outbound Campaigns",
  integrations: "Integration Marketplace",
  analytics: "Voice Analytics",
  billing: "Billing & Subscriptions",
  settings: "Workspace Settings",
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    setMobileNavOpen,
    workspaces,
    activeWorkspaceId,
    notifications,
    markAllNotificationsRead,
    user,
    agents,
    calls,
    phoneNumbers,
  } = useAppStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const usagePct = Math.min(
    100,
    Math.round((activeWorkspace.minutesUsed / activeWorkspace.minutesLimit) * 100)
  );

  // Build breadcrumbs
  const segments = pathname.split("/").filter(Boolean);

  // Filter global search results
  const q = searchQuery.toLowerCase().trim();
  const matchedAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.language.toLowerCase().includes(q) ||
      a.voiceProvider.toLowerCase().includes(q)
  );
  const matchedCalls = calls.filter(
    (c) =>
      c.callerNumber.toLowerCase().includes(q) ||
      (c.callerName && c.callerName.toLowerCase().includes(q)) ||
      c.agentName.toLowerCase().includes(q)
  );
  const matchedPhones = phoneNumbers.filter(
    (p) =>
      p.number.toLowerCase().includes(q) ||
      p.region.toLowerCase().includes(q)
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[#E8EAF0] bg-white/90 px-4 backdrop-blur-md lg:px-6">
        {/* Left: Mobile Menu Trigger + Breadcrumb Navigation */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-lg border border-[#E8EAF0] p-2 text-[#171923] hover:bg-[#F8F9FC] lg:hidden"
            aria-label="Open navigation drawer"
          >
            <Menu className="h-4 w-4" />
          </button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
            <Link
              href="/dashboard"
              className="font-medium text-[#777E90] transition-colors hover:text-[#171923]"
            >
              Zenviah.ai
            </Link>
            {segments.map((seg, idx) => {
              const href = "/" + segments.slice(0, idx + 1).join("/");
              const isLast = idx === segments.length - 1;
              const agentMatch = agents.find((a) => a.id === seg);
              const label =
                agentMatch?.name || ROUTE_LABELS[seg] || seg;

              return (
                <React.Fragment key={href}>
                  <ChevronRight className="h-3.5 w-3.5 text-[#777E90]/60" />
                  {isLast ? (
                    <span className="max-w-[200px] truncate font-semibold text-[#171923] sm:max-w-[300px]">
                      {label}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="font-medium text-[#777E90] transition-colors hover:text-[#171923]"
                    >
                      {label}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Right: Global Search, Usage Indicator, Notifications, User Avatar Dropdown */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Global Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-9 items-center gap-2.5 rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] px-3 text-xs text-[#777E90] transition-all hover:border-[#635BFF]/40 hover:bg-white sm:w-60"
          >
            <Search className="h-3.5 w-3.5 text-[#777E90]" />
            <span className="hidden flex-1 text-left sm:inline">
              Search agents, calls, +91 DIDs...
            </span>
            <kbd className="hidden rounded border border-[#E8EAF0] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#777E90] sm:inline-block">
              ⌘K
            </kbd>
          </button>

          {/* Usage Indicator Pill */}
          <Link
            href="/billing"
            className="hidden items-center gap-3 rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] px-3 py-1.5 transition-colors hover:border-[#635BFF]/40 xl:flex"
            title="View Workspace Usage & INR Credits"
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="font-semibold text-[#171923]">
                  {activeWorkspace.minutesUsed.toLocaleString("en-IN")} /{" "}
                  {activeWorkspace.minutesLimit.toLocaleString("en-IN")} mins
                </span>
                <span className="font-semibold text-[#635BFF]">{usagePct}%</span>
              </div>
              <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-[#E8EAF0]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#635BFF] to-[#8B7CFF]"
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            </div>
            <div className="h-5 w-px bg-[#E8EAF0]" />
            <div className="text-right">
              <p className="text-[10px] font-medium text-[#777E90]">Credits</p>
              <p className="text-xs font-semibold text-[#16A36A]">
                {formatINR(activeWorkspace.creditsBalanceINR)}
              </p>
            </div>
          </Link>

          {/* Quick Create Agent Button */}
          <Button
            size="sm"
            onClick={() => router.push("/agents/new")}
            className="hidden sm:inline-flex"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Agent</span>
          </Button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8EAF0] bg-white text-[#171923] transition-colors hover:bg-[#F8F9FC]"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 text-[#4A5060]" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#635BFF] px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-2.5 py-1.5">
                <span className="text-xs font-semibold text-[#171923]">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      markAllNotificationsRead();
                      toast.success("All notifications marked as read");
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#635BFF] hover:underline"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className="flex flex-col items-start gap-1 py-2.5"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-xs font-semibold text-[#171923]">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-[#635BFF]" />
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#777E90]">
                      {n.description}
                    </p>
                    <span className="text-[10px] text-[#777E90]/80">{n.time}</span>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Avatar & Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-[#E8EAF0] bg-white p-1 pr-2.5 transition-colors hover:bg-[#F8F9FC]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#635BFF] to-[#8B7CFF] text-xs font-semibold text-white">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-xs font-semibold leading-none text-[#171923]">
                    {user.name.split(" ")[0]}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#777E90]">
                    {activeWorkspace.role}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#171923]">
                    {user.name}
                  </span>
                  <span className="text-[11px] font-normal text-[#777E90]">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <User className="h-3.5 w-3.5 text-[#777E90]" />
                Profile & Workspace
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <KeyRound className="h-3.5 w-3.5 text-[#777E90]" />
                Masked API Keys
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/billing")}>
                <CreditCard className="h-3.5 w-3.5 text-[#777E90]" />
                Subscription & INR Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="h-3.5 w-3.5 text-[#777E90]" />
                Security & Audit Logs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  toast.info("Signed out of Zenviah.ai session");
                  router.push("/login");
                }}
                className="text-[#E5484D] focus:text-[#E5484D]"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Global Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#635BFF]" />
              Zenviah.ai Global Command & Search
            </DialogTitle>
            <DialogDescription className="text-xs">
              Jump directly to AI voice agents, workflows, call transcripts, or +91 numbers.
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#777E90]" />
              <Input
                autoFocus
                placeholder="Type agent name, language (Tamil, Hindi), caller number, or module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto border-t border-[#E8EAF0] divide-y divide-[#E8EAF0]">
            {/* AI Agents matches */}
            <div className="p-3">
              <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#777E90]">
                AI Voice Agents ({matchedAgents.length})
              </p>
              {matchedAgents.slice(0, 3).map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    setSearchOpen(false);
                    router.push(`/agents/${agent.id}`);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs hover:bg-[#F8F9FC]"
                >
                  <div className="flex items-center gap-2.5">
                    <Bot className="h-4 w-4 text-[#635BFF]" />
                    <div>
                      <p className="font-semibold text-[#171923]">{agent.name}</p>
                      <p className="text-[11px] text-[#777E90]">
                        {agent.voiceProvider} • {agent.language}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#635BFF]">
                    Configure →
                  </span>
                </button>
              ))}
            </div>

            {/* Calls matches */}
            <div className="p-3">
              <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#777E90]">
                Recent Calls ({matchedCalls.length})
              </p>
              {matchedCalls.slice(0, 2).map((call) => (
                <button
                  key={call.id}
                  onClick={() => {
                    setSearchOpen(false);
                    router.push("/calls");
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs hover:bg-[#F8F9FC]"
                >
                  <div className="flex items-center gap-2.5">
                    <PhoneCall className="h-4 w-4 text-[#16A36A]" />
                    <div>
                      <p className="font-semibold text-[#171923]">
                        {call.callerNumber}{" "}
                        {call.callerName ? `(${call.callerName})` : ""}
                      </p>
                      <p className="text-[11px] text-[#777E90]">
                        {call.agentName} • {call.outcome}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#777E90]">
                    {formatINR(call.costINR, true)}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Navigation Actions */}
            <div className="p-3">
              <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#777E90]">
                Quick Actions & Modules ({matchedPhones.length} DIDs)
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Create AI Agent Wizard", href: "/agents/new", icon: Bot },
                  { label: "Open Visual Workflow Builder", href: "/workflows", icon: GitBranch },
                  { label: "Manage +91 Phone Numbers", href: "/phone-numbers", icon: PhoneCall },
                  { label: "Subscription & INR Billing", href: "/billing", icon: CreditCard },
                ].map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.href}
                      onClick={() => {
                        setSearchOpen(false);
                        router.push(act.href);
                      }}
                      className="flex items-center gap-2 rounded-lg border border-[#E8EAF0] px-2.5 py-2 text-xs font-medium text-[#171923] hover:border-[#635BFF] hover:bg-[#F8F9FC]"
                    >
                      <Icon className="h-3.5 w-3.5 text-[#635BFF]" />
                      <span className="truncate">{act.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

