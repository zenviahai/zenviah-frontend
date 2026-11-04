"use client";

import React, { useState } from "react";
import {
  Phone,
  Plus,
  Search,
  Server,
  ShieldAlert,
  CheckCircle2,
  PhoneIncoming,
  PhoneOutgoing,
  Settings2,
  Bot,
  Radio,
} from "lucide-react";
import { useAppStore } from "@/stores/use-app-store";
import { PhoneNumberRecord } from "@/types";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function PhoneNumbersView() {
  const {
    phoneNumbers,
    agents,
    addPhoneNumber,
    assignPhoneToAgent,
    togglePhoneCapability,
  } = useAppStore();

  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("All");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sipModalPhone, setSipModalPhone] = useState<PhoneNumberRecord | null>(
    null
  );

  // Add Number Form
  const [newNumber, setNewNumber] = useState("+91 80 4719 5510");
  const [newRegion, setNewRegion] = useState("Bengaluru, Karnataka");
  const [newType, setNewType] = useState<PhoneNumberRecord["type"]>("Virtual DID");
  const [newProvider, setNewProvider] =
    useState<PhoneNumberRecord["provider"]>("Exotel");
  const [newSipUri, setNewSipUri] = useState(
    "sip:918047195510@pstn.exotel.in"
  );
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    agents[0]?.id || ""
  );

  const filteredNumbers = phoneNumbers.filter((item) => {
    const matchesSearch =
      item.number.toLowerCase().includes(search.toLowerCase()) ||
      item.region.toLowerCase().includes(search.toLowerCase()) ||
      item.provider.toLowerCase().includes(search.toLowerCase());
    const matchesProvider =
      providerFilter === "All" || item.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  const handleAddNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumber.trim()) {
      toast.error("Please enter a valid +91 phone number or toll-free DID.");
      return;
    }
    const created: PhoneNumberRecord = {
      id: `ph-${Date.now()}`,
      number: newNumber.trim(),
      region: newRegion.trim() || "India (+91)",
      type: newType,
      provider: newProvider,
      assignedAgentId: selectedAgentId || null,
      inboundEnabled: true,
      outboundEnabled: true,
      status: "Simulated",
      monthlyRentalINR: newType === "Toll-Free" ? 3500 : 1200,
      sipUri: newSipUri.trim(),
      createdAt: "2026-11-04",
    };
    addPhoneNumber(created);
    if (selectedAgentId) {
      assignPhoneToAgent(created.id, selectedAgentId);
    }
    setAddModalOpen(false);
    toast.success(
      `Added simulated ${newProvider} number ${created.number} to workspace.`
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
            Phone Numbers & India SIP Trunking
          </h1>
          <p className="mt-1 text-xs text-[#777E90]">
            Manage +91 virtual DIDs, Exotel & Twilio trunks, and route inbound/outbound calls to AI voice agents.
          </p>
        </div>

        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Add +91 Number / SIP Trunk</span>
        </Button>
      </div>

      {/* Clear Simulation Notice Banner (Section 12 Requirement) */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/[0.06] p-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#D97706]" />
          <div>
            <p className="text-xs font-bold text-[#171923]">
              Frontend UI Simulation Mode — No Live Telecom Number Provisioning
            </p>
            <p className="mt-0.5 text-xs text-[#4A5060]">
              Numbers displayed below are UI simulations for routing configuration. Live PSTN number purchasing, KYC verification, and TRAI DLT provisioning occur only when connected to your backend Exotel / Airtel IQ / Twilio API gateway.
            </p>
          </div>
        </div>
        <Badge variant="warning" className="shrink-0">
          UI Simulation Active
        </Badge>
      </div>

      {/* Provider Connection Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            provider: "Exotel India",
            status: "Simulated Gateway Ready",
            region: "Mumbai & Bengaluru PoPs",
            protocol: "WebSocket + SIP TLS",
          },
          {
            provider: "Tata Tele Business SIP",
            status: "Simulated Trunk Ready",
            region: "Chennai & Hyderabad",
            protocol: "SIP Trunk (G.711u / Opus)",
          },
          {
            provider: "Twilio Elastic India",
            status: "Simulated Gateway Ready",
            region: "ap-south-1 (Mumbai)",
            protocol: "Media Streams v2",
          },
          {
            provider: "Airtel IQ Cloud",
            status: "KYC Verification Pending",
            region: "Pan-India 1800 Toll-Free",
            protocol: "DLT Scrubbing Enabled",
          },
        ].map((p) => (
          <Card key={p.provider}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#171923]">
                  {p.provider}
                </span>
                <Radio className="h-4 w-4 text-[#16A36A]" />
              </div>
              <p className="text-[11px] text-[#777E90]">{p.region}</p>
              <div className="flex items-center justify-between pt-1">
                <Badge variant="secondary" className="text-[10px]">
                  {p.protocol}
                </Badge>
                <span className="text-[10px] font-semibold text-[#635BFF]">
                  {p.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E8EAF0] bg-white p-4 shadow-subtle sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#777E90]" />
          <Input
            placeholder="Search +91 number, city, or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["All", "Exotel", "Tata Tele SIP", "Twilio India", "Airtel IQ"] as const).map(
            (prov) => (
              <button
                key={prov}
                type="button"
                onClick={() => setProviderFilter(prov)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  providerFilter === prov
                    ? "bg-[#635BFF] text-white"
                    : "bg-[#F8F9FC] text-[#777E90] hover:text-[#171923]"
                }`}
              >
                {prov}
              </button>
            )
          )}
        </div>
      </div>

      {/* Phone Numbers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phone Number (+91)</TableHead>
              <TableHead>Provider & Type</TableHead>
              <TableHead>Assigned AI Agent</TableHead>
              <TableHead>Inbound Calling</TableHead>
              <TableHead>Outbound Calling</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Est. Rental</TableHead>
              <TableHead className="text-right">SIP Config</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNumbers.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF]">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold text-[#171923]">
                        {item.number}
                      </p>
                      <p className="text-[11px] text-[#777E90]">{item.region}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-semibold text-[#171923]">
                    {item.provider}
                  </span>
                  <p className="text-[11px] text-[#777E90]">{item.type}</p>
                </TableCell>
                <TableCell>
                  <select
                    aria-label={`Assign agent for ${item.number}`}
                    value={item.assignedAgentId || ""}
                    onChange={(e) => {
                      const val = e.target.value || null;
                      assignPhoneToAgent(item.id, val);
                      toast.success(
                        val
                          ? `Assigned ${item.number} to AI Agent`
                          : `Unassigned ${item.number}`
                      );
                    }}
                    className="h-8 rounded-lg border border-[#E8EAF0] bg-white px-2.5 text-xs font-medium text-[#171923] focus:border-[#635BFF] focus:outline-none"
                  >
                    <option value="">— Unassigned —</option>
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.inboundEnabled}
                      onCheckedChange={() => {
                        togglePhoneCapability(item.id, "inboundEnabled");
                        toast.info(
                          `Updated inbound routing for ${item.number}`
                        );
                      }}
                    />
                    <span className="text-xs text-[#777E90]">
                      {item.inboundEnabled ? "Enabled" : "Off"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.outboundEnabled}
                      onCheckedChange={() => {
                        togglePhoneCapability(item.id, "outboundEnabled");
                        toast.info(
                          `Updated outbound caller ID for ${item.number}`
                        );
                      }}
                    />
                    <span className="text-xs text-[#777E90]">
                      {item.outboundEnabled ? "Enabled" : "Off"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "Simulated" ? "default" : "warning"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-semibold">
                  {formatINR(item.monthlyRentalINR)}/mo
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSipModalPhone(item)}
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                    SIP Trunk
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add Simulated +91 Number Dialog */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Simulated +91 Number / SIP Trunk</DialogTitle>
            <DialogDescription>
              Configure a virtual Indian DID or custom SIP trunk for UI routing simulation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddNumber} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Phone Number (+91 Format)</Label>
                <Input
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="+91 80 4719 5510"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Telecom Circle / City</Label>
                <Input
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  placeholder="Bengaluru, Karnataka"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Provider</Label>
                <select
                  value={newProvider}
                  onChange={(e) =>
                    setNewProvider(
                      e.target.value as PhoneNumberRecord["provider"]
                    )
                  }
                  className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm"
                >
                  <option value="Exotel">Exotel</option>
                  <option value="Tata Tele SIP">Tata Tele SIP</option>
                  <option value="Twilio India">Twilio India</option>
                  <option value="Airtel IQ">Airtel IQ</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Number Type</Label>
                <select
                  value={newType}
                  onChange={(e) =>
                    setNewType(e.target.value as PhoneNumberRecord["type"])
                  }
                  className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm"
                >
                  <option value="Virtual DID">Virtual DID</option>
                  <option value="SIP Trunk">SIP Trunk</option>
                  <option value="Toll-Free">1800 Toll-Free</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Assign to AI Voice Agent</Label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm"
              >
                <option value="">— Assign Later —</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>SIP Termination URI</Label>
              <Input
                value={newSipUri}
                onChange={(e) => setNewSipUri(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Simulated Number</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* SIP Trunk Inspector Dialog */}
      <Dialog
        open={!!sipModalPhone}
        onOpenChange={(o) => !o && setSipModalPhone(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              SIP Trunk & Exotel Bridge Configuration ({sipModalPhone?.number})
            </DialogTitle>
            <DialogDescription>
              Endpoint parameters for connecting {sipModalPhone?.provider} media streams to Zenviah.ai.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-3.5 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#777E90]">SIP URI Endpoint:</span>
                <span className="font-mono font-semibold text-[#171923]">
                  {sipModalPhone?.sipUri}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777E90]">WebSocket Stream Target:</span>
                <span className="font-mono font-semibold text-[#635BFF]">
                  wss://voice-edge-mum.zenviah.ai/v2/stream
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777E90]">Audio Codec:</span>
                <span className="font-semibold text-[#171923]">
                  PCM 16kHz / G.711 μ-law (Bidirectional)
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSipModalPhone(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

