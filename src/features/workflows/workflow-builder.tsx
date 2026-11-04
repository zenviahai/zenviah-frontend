"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  NodeProps,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Play,
  Bot,
  MessageSquare,
  Mic,
  GitBranch,
  Globe,
  Webhook,
  PhoneForwarded,
  BookOpen,
  PhoneOff,
  Save,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Plus,
  RotateCcw,
} from "lucide-react";
import { INITIAL_WORKFLOW_EDGES, INITIAL_WORKFLOW_NODES } from "@/mocks/data";
import { WorkflowNodeCategory, WorkflowNodeData } from "@/types";
import { useAppStore } from "@/stores/use-app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

interface NodePaletteItem {
  category: WorkflowNodeCategory;
  title: string;
  description: string;
  color: string;
  icon: React.ElementType;
}

const NODE_LIBRARY: NodePaletteItem[] = [
  {
    category: "start",
    title: "Start",
    description: "Inbound / Outbound call entry trigger",
    color: "#16A36A",
    icon: Play,
  },
  {
    category: "ai_agent",
    title: "AI Agent",
    description: "Invoke LLM voice persona turn",
    color: "#635BFF",
    icon: Bot,
  },
  {
    category: "speak_message",
    title: "Speak Message",
    description: "Synthesize deterministic voice prompt",
    color: "#8B7CFF",
    icon: MessageSquare,
  },
  {
    category: "collect_input",
    title: "Collect User Input",
    description: "Capture speech or DTMF digits into variables",
    color: "#0EA5E9",
    icon: Mic,
  },
  {
    category: "condition",
    title: "Condition / Branch",
    description: "Route call based on logic expression",
    color: "#F59E0B",
    icon: GitBranch,
  },
  {
    category: "http_request",
    title: "HTTP API Request",
    description: "Execute mid-call REST GET/POST lookup",
    color: "#0284C7",
    icon: Globe,
  },
  {
    category: "webhook",
    title: "Webhook",
    description: "Dispatch real-time event payload to CRM",
    color: "#EC4899",
    icon: Webhook,
  },
  {
    category: "transfer_human",
    title: "Transfer to Human",
    description: "Warm SIP bridge to +91 escalation desk",
    color: "#EA580C",
    icon: PhoneForwarded,
  },
  {
    category: "kb_lookup",
    title: "Knowledge Base Lookup",
    description: "Query vector RAG chunks mid-conversation",
    color: "#10B981",
    icon: BookOpen,
  },
  {
    category: "end_call",
    title: "End Call",
    description: "Gracefully hang up & log outcome",
    color: "#E5484D",
    icon: PhoneOff,
  },
];

function getCategoryMeta(cat: WorkflowNodeCategory): NodePaletteItem {
  return (
    NODE_LIBRARY.find((n) => n.category === cat) || NODE_LIBRARY[1]
  );
}

/**
 * Custom Zenviah.ai React Flow Node Component
 */
function ZenviahCustomNode({ data, selected }: NodeProps<Node<WorkflowNodeData>>) {
  const meta = getCategoryMeta(data.category);
  const Icon = meta.icon;

  return (
    <div
      className={`w-[255px] rounded-2xl border bg-white p-3.5 shadow-card transition-all ${
        data.hasError
          ? "border-[#E5484D] ring-2 ring-[#E5484D]/25"
          : selected
          ? "border-[#635BFF] ring-2 ring-[#635BFF]/25 shadow-elevated"
          : "border-[#E8EAF0] hover:border-[#635BFF]/50"
      }`}
    >
      {/* Input Handle (all nodes except Start) */}
      {data.category !== "start" && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-3 !w-3 !border-2 !border-white !bg-[#635BFF]"
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
            style={{ backgroundColor: meta.color }}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#777E90]">
              {meta.title}
            </span>
            <h4 className="truncate text-xs font-bold text-[#171923]">
              {data.label}
            </h4>
          </div>
        </div>
        {data.hasError ? (
          <span
            title={data.errorMessage || "Missing required field"}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E5484D]/10 text-[#E5484D]"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
          </span>
        ) : (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16A36A]/10 text-[#16A36A]">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mt-2 text-[11px] leading-relaxed text-[#777E90] line-clamp-2">
        {data.description}
      </p>

      {/* Config Preview Pill */}
      <div className="mt-2.5 rounded-lg border border-[#E8EAF0] bg-[#F8F9FC] px-2.5 py-1.5 text-[10px] font-mono text-[#4A5060] truncate">
        {data.config.endpointUrl ||
          data.config.conditionExpression ||
          data.config.variableName ||
          data.config.transferPhone ||
          data.config.message ||
          data.config.prompt ||
          "Configured & Validated"}
      </div>

      {data.hasError && data.errorMessage && (
        <p className="mt-1.5 text-[10px] font-semibold text-[#E5484D]">
          ⚠ {data.errorMessage}
        </p>
      )}

      {/* Output Handle (all nodes except End Call) */}
      {data.category !== "end_call" && (
        <Handle
          type="source"
          position={Position.Right}
          className="!h-3 !w-3 !border-2 !border-white !bg-[#635BFF]"
        />
      )}
    </div>
  );
}

const nodeTypes = {
  zenviahNode: ZenviahCustomNode,
};

function WorkflowCanvasInner() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { agents, knowledgeBases } = useAppStore();

  const [workflowName, setWorkflowName] = useState(
    "Customer Support — Order Tracking & Instant UPI Refund Flow"
  );
  const [isPublished, setIsPublished] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNodeData>>(
    INITIAL_WORKFLOW_NODES
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
    INITIAL_WORKFLOW_EDGES
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    "node-collect-order"
  );

  // Undo / Redo History Stack
  const [past, setPast] = useState<
    { nodes: Node<WorkflowNodeData>[]; edges: Edge[] }[]
  >([]);
  const [future, setFuture] = useState<
    { nodes: Node<WorkflowNodeData>[]; edges: Edge[] }[]
  >([]);

  // Saved Snapshot for Restore
  const savedSnapshotRef = useRef<{
    nodes: Node<WorkflowNodeData>[];
    edges: Edge[];
  }>({
    nodes: INITIAL_WORKFLOW_NODES,
    edges: INITIAL_WORKFLOW_EDGES,
  });

  // Test Workflow Dialog
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [simulatedStepIndex, setSimulatedStepIndex] = useState(0);

  const pushHistory = useCallback(() => {
    setPast((p) => [...p.slice(-15), { nodes, edges }]);
    setFuture([]);
  }, [nodes, edges]);

  const handleUndo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setFuture((f) => [{ nodes, edges }, ...f]);
    setPast((p) => p.slice(0, -1));
    setNodes(previous.nodes);
    setEdges(previous.edges);
    toast.info("Undid workflow action");
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setPast((p) => [...p, { nodes, edges }]);
    setFuture((f) => f.slice(1));
    setNodes(next.nodes);
    setEdges(next.edges);
    toast.info("Redid workflow action");
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      pushHistory();
      setEdges((eds) =>
        addEdge({ ...connection, animated: true, id: `e-${Date.now()}` }, eds)
      );
      toast.success("Connected workflow nodes");
    },
    [pushHistory, setEdges]
  );

  const handleAddNode = (item: NodePaletteItem, dropPos?: { x: number; y: number }) => {
    pushHistory();
    const newId = `node-${item.category}-${Date.now()}`;
    const newNode: Node<WorkflowNodeData> = {
      id: newId,
      type: "zenviahNode",
      position: dropPos || {
        x: 280 + (nodes.length % 4) * 260,
        y: 160 + (nodes.length % 3) * 140,
      },
      data: {
        label: `${item.title} Node`,
        category: item.category,
        description: item.description,
        config: {
          message:
            item.category === "speak_message"
              ? "Vanakkam! Please wait a moment while I check your details."
              : undefined,
          variableName:
            item.category === "collect_input" ? "customer_response" : undefined,
          conditionExpression:
            item.category === "condition"
              ? "intent == 'refund_request'"
              : undefined,
          endpointUrl:
            item.category === "http_request" || item.category === "webhook"
              ? "https://api.zenviah.ai/v2/lookup"
              : undefined,
          transferPhone:
            item.category === "transfer_human"
              ? "+91 44 4812 9900"
              : undefined,
          agentId:
            item.category === "ai_agent" ? agents[0]?.id : undefined,
          knowledgeBaseId:
            item.category === "kb_lookup"
              ? knowledgeBases[0]?.id
              : undefined,
        },
        hasError: false,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(newId);
    toast.success(`Added "${item.title}" node to canvas`);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const cat = event.dataTransfer.getData(
        "application/zenviah-node"
      ) as WorkflowNodeCategory;
      if (!cat) return;
      const item = getCategoryMeta(cat);
      const rect = event.currentTarget.getBoundingClientRect();
      handleAddNode(item, {
        x: event.clientX - rect.left - 120,
        y: event.clientY - rect.top - 40,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes]
  );

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const updateSelectedNodeData = (
    updates: Partial<WorkflowNodeData>,
    configUpdates?: Partial<WorkflowNodeData["config"]>
  ) => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== selectedNodeId) return n;
        const nextLabel = updates.label ?? n.data.label;
        const hasError = !nextLabel.trim();
        return {
          ...n,
          data: {
            ...n.data,
            ...updates,
            hasError: updates.hasError ?? hasError,
            errorMessage:
              updates.errorMessage ??
              (hasError ? "Node title is required" : undefined),
            config: {
              ...n.data.config,
              ...(configUpdates || {}),
            },
          },
        };
      })
    );
  };

  const handleDeleteSelectedNode = () => {
    if (!selectedNodeId) return;
    pushHistory();
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
      )
    );
    setSelectedNodeId(null);
    toast.success("Removed node from workflow");
  };

  const handleSaveWorkflow = () => {
    savedSnapshotRef.current = { nodes, edges };
    toast.success(`Saved workflow "${workflowName}" (${nodes.length} nodes)`);
  };

  const handleRestoreWorkflow = () => {
    pushHistory();
    setNodes(savedSnapshotRef.current.nodes);
    setEdges(savedSnapshotRef.current.edges);
    toast.info("Restored workflow to last saved snapshot");
  };

  const handleValidateAndPublish = () => {
    const invalidNodes = nodes.filter((n) => n.data.hasError || !n.data.label.trim());
    if (invalidNodes.length > 0) {
      toast.error(
        `Cannot publish: ${invalidNodes.length} node(s) have validation errors.`
      );
      setSelectedNodeId(invalidNodes[0].id);
      return;
    }
    setIsPublished(true);
    savedSnapshotRef.current = { nodes, edges };
    toast.success(
      `Published workflow "${workflowName}" to live Zenviah.ai voice routing engine!`
    );
  };

  return (
    <div className="flex h-[calc(100vh-112px)] min-h-[640px] flex-col rounded-2xl border border-[#E8EAF0] bg-white shadow-card overflow-hidden">
      {/* TOP TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8EAF0] bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF]">
            <GitBranch className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                aria-label="Workflow name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-64 rounded border border-transparent px-1.5 py-0.5 text-sm font-bold text-[#171923] hover:border-[#E8EAF0] focus:border-[#635BFF] focus:outline-none sm:w-96"
              />
              <Badge variant={isPublished ? "success" : "warning"}>
                {isPublished ? "Published" : "Unpublished Changes"}
              </Badge>
            </div>
            <p className="px-1.5 text-[11px] text-[#777E90]">
              {nodes.length} nodes • {edges.length} transitions • Drag nodes from left library or click to add
            </p>
          </div>
        </div>

        {/* Toolbar Controls: Undo, Redo, Zoom, Save, Restore, Test, Publish */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={past.length === 0}
            title="Undo"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={future.length === 0}
            title="Redo"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </Button>

          <div className="mx-1 h-5 w-px bg-[#E8EAF0]" />

          <Button
            variant="outline"
            size="sm"
            onClick={() => zoomIn({ duration: 200 })}
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => zoomOut({ duration: 200 })}
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fitView({ duration: 300, padding: 0.2 })}
            title="Fit View"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>

          <div className="mx-1 h-5 w-px bg-[#E8EAF0]" />

          <Button variant="outline" size="sm" onClick={handleRestoreWorkflow}>
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Restore</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleSaveWorkflow}>
            <Save className="h-3.5 w-3.5" />
            <span>Save</span>
          </Button>

          <Button
            variant="soft"
            size="sm"
            onClick={() => {
              setSimulatedStepIndex(0);
              setTestModalOpen(true);
            }}
          >
            <Play className="h-3.5 w-3.5" />
            <span>Test Workflow</span>
          </Button>

          <Button size="sm" onClick={handleValidateAndPublish}>
            <Sparkles className="h-3.5 w-3.5" />
            <span>Publish</span>
          </Button>
        </div>
      </div>

      {/* 3-PANEL BODY: Left Node Library + Center React Flow Canvas + Right Node Inspector */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL: Node Library */}
        <div className="w-64 shrink-0 overflow-y-auto border-r border-[#E8EAF0] bg-[#F8F9FC] p-3.5 space-y-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171923]">
              Node Library (10)
            </h3>
            <p className="text-[11px] text-[#777E90]">
              Drag onto canvas or click <Plus className="inline h-3 w-3" /> to insert
            </p>
          </div>

          <div className="space-y-2">
            {NODE_LIBRARY.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.category}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      "application/zenviah-node",
                      item.category
                    );
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onClick={() => handleAddNode(item)}
                  className="group flex cursor-grab items-center justify-between rounded-xl border border-[#E8EAF0] bg-white p-2.5 shadow-subtle transition-all hover:border-[#635BFF] hover:shadow-card active:cursor-grabbing"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#171923]">
                        {item.title}
                      </p>
                      <p className="truncate text-[10px] text-[#777E90]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <Plus className="h-3.5 w-3.5 shrink-0 text-[#777E90] group-hover:text-[#635BFF]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER: Interactive React Flow Canvas */}
        <div
          className="relative flex-1 bg-[#F4F6FA]"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            defaultEdgeOptions={{
              style: { stroke: "#635BFF", strokeWidth: 2 },
              animated: true,
            }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1.4}
              color="#CBD2E1"
            />
            <Controls className="!rounded-xl !border-[#E8EAF0] !bg-white !shadow-card" />
            <MiniMap
              nodeColor={(n) => {
                const cat = (n.data as WorkflowNodeData)?.category;
                return getCategoryMeta(cat).color;
              }}
              maskColor="rgba(248, 249, 252, 0.75)"
              className="!rounded-xl !border !border-[#E8EAF0] !bg-white !shadow-card"
            />
          </ReactFlow>
        </div>

        {/* RIGHT PANEL: Selected Node Configuration Inspector */}
        <div className="w-80 shrink-0 overflow-y-auto border-l border-[#E8EAF0] bg-white p-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8EAF0] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#635BFF]">
                    Node Configuration
                  </span>
                  <h3 className="text-sm font-bold text-[#171923]">
                    {selectedNode.data.label}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteSelectedNode}
                  className="text-[#E5484D] hover:bg-[#E5484D]/10"
                  title="Delete Node"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1.5">
                <Label>Node Title</Label>
                <Input
                  value={selectedNode.data.label}
                  onChange={(e) =>
                    updateSelectedNodeData({ label: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={selectedNode.data.description}
                  onChange={(e) =>
                    updateSelectedNodeData({ description: e.target.value })
                  }
                />
              </div>

              {/* Category-Specific Configuration Fields */}
              {(selectedNode.data.category === "speak_message" ||
                selectedNode.data.category === "start") && (
                <div className="space-y-1.5">
                  <Label>Spoken Message / Script (Supports Tanglish & Variables)</Label>
                  <Textarea
                    rows={3}
                    value={selectedNode.data.config.message || ""}
                    onChange={(e) =>
                      updateSelectedNodeData({}, { message: e.target.value })
                    }
                  />
                </div>
              )}

              {selectedNode.data.category === "ai_agent" && (
                <>
                  <div className="space-y-1.5">
                    <Label>Assigned AI Voice Agent</Label>
                    <select
                      value={selectedNode.data.config.agentId || agents[0]?.id}
                      onChange={(e) =>
                        updateSelectedNodeData({}, { agentId: e.target.value })
                      }
                      className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs"
                    >
                      {agents.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Node Sub-Prompt Instructions</Label>
                    <Textarea
                      rows={3}
                      value={selectedNode.data.config.prompt || ""}
                      onChange={(e) =>
                        updateSelectedNodeData({}, { prompt: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {selectedNode.data.category === "collect_input" && (
                <>
                  <div className="space-y-1.5">
                    <Label>Extracted Variable Names</Label>
                    <Input
                      value={selectedNode.data.config.variableName || ""}
                      onChange={(e) =>
                        updateSelectedNodeData(
                          {},
                          { variableName: e.target.value }
                        )
                      }
                      placeholder="e.g., order_id, pin_code"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Capture Mode</Label>
                    <select
                      value={selectedNode.data.config.inputType || "Both"}
                      onChange={(e) =>
                        updateSelectedNodeData(
                          {},
                          {
                            inputType: e.target.value as
                              | "Speech"
                              | "DTMF"
                              | "Both",
                          }
                        )
                      }
                      className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs"
                    >
                      <option value="Both">Speech ASR + DTMF Keypad</option>
                      <option value="Speech">Speech Only</option>
                      <option value="DTMF">DTMF Keypad Digits Only</option>
                    </select>
                  </div>
                </>
              )}

              {selectedNode.data.category === "condition" && (
                <div className="space-y-1.5">
                  <Label>Branch Expression</Label>
                  <Textarea
                    rows={3}
                    className="font-mono text-xs"
                    value={selectedNode.data.config.conditionExpression || ""}
                    onChange={(e) =>
                      updateSelectedNodeData(
                        {},
                        { conditionExpression: e.target.value }
                      )
                    }
                  />
                </div>
              )}

              {(selectedNode.data.category === "http_request" ||
                selectedNode.data.category === "webhook") && (
                <>
                  <div className="space-y-1.5">
                    <Label>HTTP Method</Label>
                    <select
                      value={selectedNode.data.config.httpMethod || "POST"}
                      onChange={(e) =>
                        updateSelectedNodeData(
                          {},
                          {
                            httpMethod: e.target.value as
                              | "GET"
                              | "POST"
                              | "PUT",
                          }
                        )
                      }
                      className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Endpoint URL</Label>
                    <Input
                      value={selectedNode.data.config.endpointUrl || ""}
                      onChange={(e) =>
                        updateSelectedNodeData(
                          {},
                          { endpointUrl: e.target.value }
                        )
                      }
                    />
                  </div>
                </>
              )}

              {selectedNode.data.category === "transfer_human" && (
                <>
                  <div className="space-y-1.5">
                    <Label>Destination +91 Phone / SIP URI</Label>
                    <Input
                      value={selectedNode.data.config.transferPhone || ""}
                      onChange={(e) =>
                        updateSelectedNodeData(
                          {},
                          { transferPhone: e.target.value }
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Escalation Department</Label>
                    <Input
                      value={selectedNode.data.config.department || ""}
                      onChange={(e) =>
                        updateSelectedNodeData(
                          {},
                          { department: e.target.value }
                        )
                      }
                    />
                  </div>
                </>
              )}

              {selectedNode.data.category === "kb_lookup" && (
                <div className="space-y-1.5">
                  <Label>Target Knowledge Base</Label>
                  <select
                    value={
                      selectedNode.data.config.knowledgeBaseId ||
                      knowledgeBases[0]?.id
                    }
                    onChange={(e) =>
                      updateSelectedNodeData(
                        {},
                        { knowledgeBaseId: e.target.value }
                      )
                    }
                    className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-xs"
                  >
                    {knowledgeBases.map((kb) => (
                      <option key={kb.id} value={kb.id}>
                        {kb.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Validation Error Simulator Toggle */}
              <div className="rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#171923]">
                    Node Validation State
                  </span>
                  <Badge
                    variant={
                      selectedNode.data.hasError ? "destructive" : "success"
                    }
                  >
                    {selectedNode.data.hasError ? "Error" : "Valid"}
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() =>
                    updateSelectedNodeData({
                      hasError: !selectedNode.data.hasError,
                      errorMessage: !selectedNode.data.hasError
                        ? "Missing webhook timeout fallback edge"
                        : undefined,
                    })
                  }
                >
                  {selectedNode.data.hasError
                    ? "Mark Node as Resolved"
                    : "Simulate Validation Warning"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-xs text-[#777E90]">
              <GitBranch className="mb-2 h-8 w-8 text-[#635BFF]/40" />
              <p className="font-semibold text-[#171923]">No Node Selected</p>
              <p className="mt-1">
                Click any node on the canvas to inspect and edit its parameters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Workflow Simulator Modal */}
      <Dialog open={testModalOpen} onOpenChange={setTestModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Live Workflow Path Simulator</DialogTitle>
            <DialogDescription>
              Step-by-step execution trace for{" "}
              <strong className="text-[#171923]">{workflowName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-80 space-y-2.5 overflow-y-auto py-2">
            {nodes.map((node, idx) => {
              const isPassed = idx <= simulatedStepIndex;
              return (
                <div
                  key={node.id}
                  onClick={() => {
                    setSimulatedStepIndex(idx);
                    setSelectedNodeId(node.id);
                  }}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                    idx === simulatedStepIndex
                      ? "border-[#635BFF] bg-[#635BFF]/10"
                      : isPassed
                      ? "border-[#16A36A]/30 bg-[#16A36A]/5"
                      : "border-[#E8EAF0] bg-white opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111318] text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-[#171923]">
                        {node.data.label}
                      </p>
                      <p className="text-[11px] text-[#777E90]">
                        {node.data.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant={isPassed ? "success" : "secondary"}>
                    {idx === simulatedStepIndex
                      ? "Executing"
                      : isPassed
                      ? "Passed"
                      : "Pending"}
                  </Badge>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setSimulatedStepIndex((i) => Math.max(0, i - 1))
              }
              disabled={simulatedStepIndex === 0}
            >
              Previous Node
            </Button>
            <Button
              onClick={() => {
                if (simulatedStepIndex < nodes.length - 1) {
                  setSimulatedStepIndex((i) => i + 1);
                } else {
                  toast.success(
                    "Workflow simulation completed all nodes with 0 errors!"
                  );
                  setTestModalOpen(false);
                }
              }}
            >
              {simulatedStepIndex < nodes.length - 1
                ? "Step to Next Node →"
                : "Finish Simulation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
}

