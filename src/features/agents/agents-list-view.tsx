"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bot,
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Copy,
  Pencil,
  Trash2,
  Play,
  Pause,
  PhoneCall,
  Globe2,
  AudioWaveform,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { useAppStore } from "@/stores/use-app-store";
import { AgentStatus, AIAgent } from "@/types";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "sonner";

export function AgentsListView() {
  const router = useRouter();
  const {
    agents,
    duplicateAgent,
    deleteAgent,
    setAgentStatus,
  } = useAppStore();

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | AgentStatus>("All");
  const [languageFilter, setLanguageFilter] = useState<string>("All");
  const [agentToDelete, setAgentToDelete] = useState<AIAgent | null>(null);

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.description.toLowerCase().includes(search.toLowerCase()) ||
      agent.voiceProvider.toLowerCase().includes(search.toLowerCase()) ||
      agent.language.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || agent.status === statusFilter;
    const matchesLanguage =
      languageFilter === "All" ||
      agent.language.toLowerCase().includes(languageFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesLanguage;
  });

  const handleDuplicate = (agent: AIAgent) => {
    const copy = duplicateAgent(agent.id);
    if (copy) {
      toast.success(`Duplicated "${agent.name}" as Draft`);
    }
  };

  const handleStatusToggle = (agent: AIAgent, targetStatus: AgentStatus) => {
    setAgentStatus(agent.id, targetStatus);
    toast.success(`Agent "${agent.name}" is now ${targetStatus}`);
  };

  const confirmDelete = () => {
    if (!agentToDelete) return;
    deleteAgent(agentToDelete.id);
    toast.success(`Deleted AI Agent "${agentToDelete.name}"`);
    setAgentToDelete(null);
  };

  const getStatusBadgeVariant = (status: AgentStatus) => {
    if (status === "Published") return "success";
    if (status === "Paused") return "warning";
    return "secondary";
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
            AI Voice Agents
          </h1>
          <p className="mt-1 text-xs text-[#777E90]">
            Create, configure, test, and deploy low-latency multilingual AI phone agents across Indian and global languages.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" onClick={() => router.push("/workflows")}>
            <Sparkles className="h-4 w-4 text-[#635BFF]" />
            <span>Workflow Studio</span>
          </Button>
          <Button onClick={() => router.push("/agents/new")}>
            <Plus className="h-4 w-4" />
            <span>Create AI Agent</span>
          </Button>
        </div>
      </div>

      {/* Filters & View Toggle Bar */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E8EAF0] bg-white p-4 shadow-subtle lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#777E90]" />
            <Input
              placeholder="Search agents by name, voice, or language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="inline-flex items-center rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-1">
            {(["All", "Published", "Draft", "Paused"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? "bg-white text-[#171923] shadow-subtle"
                    : "text-[#777E90] hover:text-[#171923]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Language Filter */}
          <select
            aria-label="Filter by language"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="h-9 rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs font-medium text-[#171923] focus:border-[#635BFF] focus:outline-none"
          >
            <option value="All">All Languages</option>
            <option value="Tamil">Tamil / Tanglish</option>
            <option value="Hindi">Hindi / Hinglish</option>
            <option value="English">English (India / US)</option>
            <option value="Telugu">Telugu</option>
            <option value="Kannada">Kannada</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Bengali">Bengali</option>
            <option value="Marathi">Marathi</option>
          </select>
        </div>

        {/* Grid vs Table View Switcher */}
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-[#777E90]">
            Showing <strong>{filteredAgents.length}</strong> of {agents.length} agents
          </span>
          <div className="inline-flex rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-[#635BFF] shadow-subtle"
                  : "text-[#777E90] hover:text-[#171923]"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === "table"
                  ? "bg-white text-[#635BFF] shadow-subtle"
                  : "text-[#777E90] hover:text-[#171923]"
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredAgents.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No matching AI Voice Agents found"
          description="Try clearing your search or status filters, or launch the 6-step Agent Creation Wizard to build a new multilingual voice agent."
          actionLabel="Create New AI Agent"
          onAction={() => router.push("/agents/new")}
        />
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAgents.map((agent) => (
            <Card
              key={agent.id}
              className="group flex flex-col justify-between hover:border-[#635BFF]/50 hover:shadow-elevated transition-all"
            >
              <CardContent className="p-5 space-y-4">
                {/* Top Row: Avatar + Status + Actions Dropdown */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ backgroundColor: agent.avatarColor }}
                    >
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <Link
                        href={`/agents/${agent.id}`}
                        className="text-sm font-bold text-[#171923] hover:text-[#635BFF] transition-colors line-clamp-1"
                      >
                        {agent.name}
                      </Link>
                      <p className="text-[11px] font-medium text-[#777E90]">
                        {agent.agentType} • {agent.direction}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge variant={getStatusBadgeVariant(agent.status)}>
                      {agent.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-[#777E90] hover:bg-[#F8F9FC] hover:text-[#171923]"
                          aria-label="Agent actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/agents/${agent.id}`)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit & Test Agent
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(agent)}>
                          <Copy className="h-3.5 w-3.5" />
                          Duplicate Agent
                        </DropdownMenuItem>
                        {agent.status !== "Published" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusToggle(agent, "Published")
                            }
                            className="text-[#16A36A]"
                          >
                            <Play className="h-3.5 w-3.5" />
                            Publish Agent
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleStatusToggle(agent, "Paused")}
                            className="text-[#D97706]"
                          >
                            <Pause className="h-3.5 w-3.5" />
                            Pause Agent
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setAgentToDelete(agent)}
                          className="text-[#E5484D] focus:text-[#E5484D]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Agent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs leading-relaxed text-[#777E90] line-clamp-2">
                  {agent.description}
                </p>

                {/* Voice, LLM & Language Pills */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#E8EAF0] bg-[#F8F9FC] px-2 py-1 text-[11px] font-medium text-[#171923]">
                    <AudioWaveform className="h-3 w-3 text-[#635BFF]" />
                    {agent.voiceProvider} ({agent.voiceName.split(" ")[0]})
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#E8EAF0] bg-[#F8F9FC] px-2 py-1 text-[11px] font-medium text-[#171923]">
                    <Globe2 className="h-3 w-3 text-[#16A36A]" />
                    {agent.language}
                  </span>
                </div>

                {/* Telemetry & Dates Footer */}
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#F8F9FC] p-3 text-center">
                  <div>
                    <p className="text-[10px] font-medium text-[#777E90]">
                      Total Calls
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-[#171923]">
                      {formatNumber(agent.totalCalls)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-[#777E90]">
                      Success Rate
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-[#16A36A]">
                      {agent.successRate ? `${agent.successRate}%` : "New"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-[#777E90]">
                      LLM Engine
                    </p>
                    <p className="mt-0.5 truncate text-xs font-bold text-[#171923]">
                      {agent.llmProvider}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#E8EAF0] pt-3 text-[11px] text-[#777E90]">
                  <span>
                    Created {format(new Date(agent.createdAt), "dd MMM yyyy")}
                  </span>
                  <span>
                    Modified {format(new Date(agent.updatedAt), "dd MMM yyyy")}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/agents/${agent.id}`)}
                  >
                    Configure & Test
                  </Button>
                  {agent.status === "Published" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusToggle(agent, "Paused")}
                    >
                      <Pause className="h-3.5 w-3.5 text-[#D97706]" />
                      Pause
                    </Button>
                  ) : (
                    <Button
                      variant="soft"
                      size="sm"
                      onClick={() => handleStatusToggle(agent, "Published")}
                    >
                      <Play className="h-3.5 w-3.5" />
                      Publish
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>AI Voice Agent</TableHead>
                <TableHead>Voice Provider</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Calls</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: agent.avatarColor }}
                      >
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <Link
                          href={`/agents/${agent.id}`}
                          className="font-semibold text-[#171923] hover:text-[#635BFF]"
                        >
                          {agent.name}
                        </Link>
                        <p className="text-xs text-[#777E90] line-clamp-1 max-w-xs">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium">
                      {agent.voiceProvider}
                    </span>
                    <p className="text-[11px] text-[#777E90]">
                      {agent.voiceName}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{agent.language}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(agent.status)}>
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatNumber(agent.totalCalls)}
                  </TableCell>
                  <TableCell className="text-xs text-[#777E90]">
                    {format(new Date(agent.createdAt), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-xs text-[#777E90]">
                    {format(new Date(agent.updatedAt), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/agents/${agent.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDuplicate(agent)}
                        title="Duplicate"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setAgentToDelete(agent)}
                        className="text-[#E5484D]"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!agentToDelete}
        onOpenChange={(o) => !o && setAgentToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete AI Voice Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              <strong className="text-[#171923]">{agentToDelete?.name}</strong>? Any +91 virtual numbers assigned to this agent will be unassigned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAgentToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

