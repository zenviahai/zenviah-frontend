"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  GitBranch,
  BookOpen,
  Phone,
  PhoneCall,
  Megaphone,
  Blocks,
  BarChart3,
  CreditCard,
  Settings,
  FileText,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Check,
  Sparkles,
  ExternalLink,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ZenviahLogo } from "@/components/shared/zenviah-logo";
import { useAppStore } from "@/stores/use-app-store";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: "MAIN",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "AI Agents", href: "/agents", icon: Bot },
      { label: "Workflows", href: "/workflows", icon: GitBranch, badge: "Visual" },
      { label: "Knowledge Base", href: "/knowledge-base", icon: BookOpen },
    ],
  },
  {
    group: "COMMUNICATION",
    items: [
      { label: "Phone Numbers", href: "/phone-numbers", icon: Phone },
      { label: "Calls", href: "/calls", icon: PhoneCall },
      { label: "Campaigns", href: "/campaigns", icon: Megaphone },
    ],
  },
  {
    group: "MANAGEMENT",
    items: [
      { label: "Integrations", href: "/integrations", icon: Blocks },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    group: "ACCOUNT",
    items: [
      { label: "Billing", href: "/billing", icon: CreditCard },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileNavOpen,
    setMobileNavOpen,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspace,
    user,
  } = useAppStore();

  const [docsOpen, setDocsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const isRouteActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject.trim()) {
      toast.error("Please enter a subject for your support request.");
      return;
    }
    toast.success("Priority Support Ticket #ZNV-9402 created! Our Solutions team will respond within 30 minutes.");
    setSupportSubject("");
    setSupportMessage("");
    setSupportOpen(false);
  };

  const renderSidebarContent = (collapsed: boolean, isMobile = false) => (
    <div className="flex h-full flex-col bg-[#111318] text-[#F8F9FC] select-none">
      {/* Top Brand Header */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-[#222631] px-4",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link
          href="/dashboard"
          onClick={() => isMobile && setMobileNavOpen(false)}
          className="flex items-center focus:outline-none"
        >
          <ZenviahLogo variant="dark" collapsed={collapsed} size="md" />
        </Link>

        {isMobile ? (
          <button
            onClick={() => setMobileNavOpen(false)}
            className="rounded-lg p-1.5 text-[#777E90] hover:bg-[#1C1F28] hover:text-white"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          !collapsed && (
            <button
              onClick={toggleSidebar}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#222631] bg-[#171A21] text-[#777E90] transition-colors hover:border-[#323846] hover:text-white"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )
        )}
      </div>

      {/* Expand button when collapsed on desktop */}
      {!isMobile && collapsed && (
        <div className="flex justify-center border-b border-[#222631] py-2.5">
          <button
            onClick={toggleSidebar}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#222631] bg-[#171A21] text-[#777E90] transition-colors hover:border-[#635BFF] hover:text-white"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((section) => (
          <div key={section.group} className="space-y-1">
            {!collapsed && (
              <div className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777E90]">
                {section.group}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && setMobileNavOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-150",
                    collapsed && "justify-center px-0 py-2.5",
                    active
                      ? "bg-gradient-to-r from-[#635BFF] to-[#776BFF] text-white shadow-brand"
                      : "text-[#A3A9B8] hover:bg-[#1C1F28] hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-150",
                      active
                        ? "text-white"
                        : "text-[#777E90] group-hover:text-white"
                    )}
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                        active
                          ? "bg-white/20 text-white"
                          : "bg-[#635BFF]/20 text-[#8B7CFF]"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Section: Documentation, Help & Support, Workspace Selector, User Profile */}
      <div className="shrink-0 space-y-2 border-t border-[#222631] p-3">
        {/* Documentation & Support links */}
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => setDocsOpen(true)}
            title={collapsed ? "Documentation" : undefined}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#A3A9B8] transition-colors hover:bg-[#1C1F28] hover:text-white",
              collapsed && "justify-center px-0"
            )}
          >
            <FileText className="h-3.5 w-3.5 shrink-0 text-[#777E90]" />
            {!collapsed && <span>Documentation</span>}
          </button>
          <button
            type="button"
            onClick={() => setSupportOpen(true)}
            title={collapsed ? "Help & Support" : undefined}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#A3A9B8] transition-colors hover:bg-[#1C1F28] hover:text-white",
              collapsed && "justify-center px-0"
            )}
          >
            <LifeBuoy className="h-3.5 w-3.5 shrink-0 text-[#777E90]" />
            {!collapsed && <span>Help & Support</span>}
          </button>
        </div>

        {/* Workspace Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-between rounded-xl border border-[#222631] bg-[#171A21] p-2 text-left transition-colors hover:border-[#323846]",
                collapsed && "justify-center p-2"
              )}
              title="Switch Workspace"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#635BFF]/20 text-xs font-bold text-[#8B7CFF]">
                  {activeWorkspace.name.slice(0, 2).toUpperCase()}
                </div>
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">
                      {activeWorkspace.name}
                    </p>
                    <p className="truncate text-[10px] text-[#777E90]">
                      {activeWorkspace.plan} Plan • {activeWorkspace.role}
                    </p>
                  </div>
                )}
              </div>
              {!collapsed && (
                <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-[#777E90]" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Switch Multi-Tenant Workspace</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => {
                  setActiveWorkspace(ws.id);
                  toast.success(`Switched active workspace to ${ws.name}`);
                }}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-xs font-semibold text-[#171923]">{ws.name}</p>
                  <p className="text-[11px] text-[#777E90]">
                    {ws.plan} • {ws.minutesUsed.toLocaleString("en-IN")} /{" "}
                    {ws.minutesLimit.toLocaleString("en-IN")} mins
                  </p>
                </div>
                {ws.id === activeWorkspace.id && (
                  <Check className="h-4 w-4 text-[#635BFF]" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="text-xs text-[#635BFF]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Manage Workspaces & Teams
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile summary */}
        {!collapsed && (
          <div className="flex items-center justify-between rounded-xl px-2 py-1.5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#635BFF] to-[#8B7CFF] text-[11px] font-semibold text-white">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-white">
                  {user.name}
                </p>
                <p className="truncate text-[10px] text-[#777E90]">
                  {user.email}
                </p>
              </div>
            </div>
            <Link
              href="/settings"
              className="rounded-md p-1 text-[#777E90] hover:bg-[#1C1F28] hover:text-white"
              title="Account Settings"
            >
              <Settings className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden h-screen shrink-0 border-r border-[#222631] bg-[#111318] transition-all duration-200 lg:block",
          isSidebarCollapsed ? "w-[72px]" : "w-[256px]"
        )}
      >
        {renderSidebarContent(isSidebarCollapsed, false)}
      </aside>

      {/* Responsive Mobile Drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#111318]/60 backdrop-blur-xs"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-10 flex w-[270px] flex-col">
            {renderSidebarContent(false, true)}
          </div>
        </div>
      )}

      {/* Documentation Quick Reference Modal */}
      <Dialog open={docsOpen} onOpenChange={setDocsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Zenviah.ai Developer & Voice Platform Docs</DialogTitle>
            <DialogDescription>
              Quick architecture references, WebSocket streaming specs, and India SIP trunking guides.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2 sm:grid-cols-2">
            {[
              {
                title: "Voice Agent Prompting Guide",
                desc: "Best practices for sub-350ms turn-taking and Tamil-English / Hindi-English code-switching.",
                tag: "Voice AI",
              },
              {
                title: "React Flow Workflow Webhooks",
                desc: "Passing dynamic JSON variables (`{{order_id}}`) between mid-call HTTP nodes and LLMs.",
                tag: "Workflows",
              },
              {
                title: "Exotel & Airtel IQ SIP Setup",
                desc: "Configuring +91 virtual DIDs, RTP media streams, and TRAI DLT compliance windows.",
                tag: "Telephony",
              },
              {
                title: "REST API & Server Webhooks",
                desc: "Triggering outbound calls programmatically and verifying `X-Zenviah-Signature` headers.",
                tag: "API v2",
              },
            ].map((doc) => (
              <div
                key={doc.title}
                onClick={() => {
                  toast.info(`Opened guide: ${doc.title}`);
                  setDocsOpen(false);
                }}
                className="group cursor-pointer rounded-xl border border-[#E8EAF0] p-3.5 transition-all hover:border-[#635BFF] hover:bg-[#F8F9FC]"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-[#635BFF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#635BFF]">
                    {doc.tag}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#777E90] group-hover:text-[#635BFF]" />
                </div>
                <h4 className="mt-2 text-xs font-semibold text-[#171923]">
                  {doc.title}
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-[#777E90]">
                  {doc.desc}
                </p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocsOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setDocsOpen(false);
                router.push("/settings");
              }}
            >
              View API Keys & Webhooks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help & Support Modal */}
      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zenviah.ai Priority Help & Support</DialogTitle>
            <DialogDescription>
              All voice clusters in Mumbai (`ap-south-1`) and Bengaluru (`ap-south-2`) are operating at 99.98% uptime.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSupportSubmit} className="space-y-4 py-2">
            <div className="rounded-xl border border-[#16A36A]/25 bg-[#16A36A]/5 p-3 text-xs text-[#16A36A] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#16A36A] animate-pulse" />
              Live System Status: All Telephony & LLM Gateways Operational (Avg Turn Latency: 275ms)
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#171923]">
                Subject
              </label>
              <Input
                placeholder="e.g., Custom SIP trunk onboarding for +91 Bengaluru DID"
                value={supportSubject}
                onChange={(e) => setSupportSubject(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#171923]">
                How can our Solutions Engineering team help?
              </label>
              <Textarea
                placeholder="Include agent ID, call ID, or telephony provider details..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSupportOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Priority Ticket</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

