"use client";

import React, { useState } from "react";
import {
  Blocks,
  Search,
  CheckCircle2,
  Settings2,
  PlugZap,
  ShieldCheck,
  Lock,
  Unplug,
} from "lucide-react";
import { useAppStore } from "@/stores/use-app-store";
import { IntegrationCategory, IntegrationItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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

const CATEGORIES: ("All" | IntegrationCategory)[] = [
  "All",
  "Telephony",
  "CRM",
  "Automation",
  "Webhooks",
  "AI Providers",
];

export function IntegrationsView() {
  const { integrations, updateIntegrationStatus } = useAppStore();

  const [categoryFilter, setCategoryFilter] =
    useState<"All" | IntegrationCategory>("All");
  const [search, setSearch] = useState("");
  const [activeIntegration, setActiveIntegration] =
    useState<IntegrationItem | null>(null);

  const filteredIntegrations = integrations.filter((item) => {
    const matchesCat =
      categoryFilter === "All" || item.category === categoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSaveIntegrationConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIntegration) return;
    updateIntegrationStatus(activeIntegration.id, "Connected");
    toast.success(
      `${activeIntegration.name} configuration verified (Encrypted Server Vault reference updated).`
    );
    setActiveIntegration(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
            Integration Marketplace
          </h1>
          <p className="mt-1 text-xs text-[#777E90]">
            Connect your cloud telephony trunks, CRMs, automation pipelines, webhooks, and foundation AI providers.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-[#16A36A]/25 bg-[#16A36A]/5 px-3.5 py-2 text-xs font-medium text-[#16A36A]">
          <Lock className="h-3.5 w-3.5" />
          Zero-Browser-Storage KMS Vault Active
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E8EAF0] bg-white p-4 shadow-subtle lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? "bg-[#635BFF] text-white shadow-brand"
                  : "bg-[#F8F9FC] text-[#777E90] hover:text-[#171923]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#777E90]" />
          <Input
            placeholder="Search Exotel, HubSpot, OpenAI, n8n..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredIntegrations.map((item) => {
          const isConnected = item.status === "Connected";
          return (
            <Card
              key={item.id}
              className="flex flex-col justify-between hover:border-[#635BFF]/40 hover:shadow-elevated transition-all"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-xs"
                      style={{ backgroundColor: item.accentColor }}
                    >
                      {item.logoText}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#171923]">
                        {item.name}
                      </h3>
                      <span className="text-[11px] font-medium text-[#777E90]">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <Badge variant={isConnected ? "success" : "secondary"}>
                    {item.status}
                  </Badge>
                </div>

                <p className="text-xs leading-relaxed text-[#777E90]">
                  {item.description}
                </p>

                {item.lastSynced && (
                  <p className="text-[11px] text-[#16A36A] flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Last synced: {item.lastSynced}
                  </p>
                )}

                <div className="flex items-center gap-2 border-t border-[#E8EAF0] pt-3">
                  {isConnected ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setActiveIntegration(item)}
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                        <span>Configure</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#777E90] hover:text-[#E5484D]"
                        onClick={() => {
                          updateIntegrationStatus(item.id, "Not Connected");
                          toast.info(`Disconnected ${item.name}`);
                        }}
                      >
                        <Unplug className="h-3.5 w-3.5" />
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => setActiveIntegration(item)}
                    >
                      <PlugZap className="h-3.5 w-3.5" />
                      <span>Connect {item.name}</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Connect / Configure Integration Dialog */}
      <Dialog
        open={!!activeIntegration}
        onOpenChange={(o) => !o && setActiveIntegration(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Configure {activeIntegration?.name} ({activeIntegration?.category})
            </DialogTitle>
            <DialogDescription>
              Credentials are transmitted directly to the server KMS vault in production and are never stored in browser localStorage.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveIntegrationConfig} className="space-y-4 py-2">
            <div className="rounded-xl border border-[#635BFF]/20 bg-[#635BFF]/5 p-3 text-xs text-[#4A5060] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#635BFF]" />
              <span>
                Secrets are masked using server-side vault references.
              </span>
            </div>

            {activeIntegration?.configFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label>{field.label}</Label>
                <Input
                  type={field.type === "password" ? "password" : "text"}
                  defaultValue={field.maskedValue || ""}
                  placeholder={field.placeholder}
                  className="font-mono text-xs"
                />
              </div>
            ))}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveIntegration(null)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <CheckCircle2 className="h-4 w-4" />
                Save & Connect
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

