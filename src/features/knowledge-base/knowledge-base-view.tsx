"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Upload,
  FileText,
  Globe,
  HelpCircle,
  Search,
  Trash2,
  Eye,
  Bot,
  CheckCircle2,
  Sparkles,
  FileSpreadsheet,
} from "lucide-react";
import { useAppStore } from "@/stores/use-app-store";
import { KnowledgeBase, KnowledgeDocument } from "@/types";
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

export function KnowledgeBaseView() {
  const {
    knowledgeBases,
    agents,
    addKnowledgeBase,
    addDocumentToKB,
    deleteDocumentFromKB,
    addFaqToKB,
    toggleAgentOnKB,
  } = useAppStore();

  const [selectedKbId, setSelectedKbId] = useState<string>(
    knowledgeBases[0]?.id || ""
  );
  const [docSearch, setDocSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Modals
  const [createKbOpen, setCreateKbOpen] = useState(false);
  const [newKbName, setNewKbName] = useState("");
  const [newKbDesc, setNewKbDesc] = useState("");

  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");

  const [previewDoc, setPreviewDoc] = useState<KnowledgeDocument | null>(null);

  const activeKB =
    knowledgeBases.find((kb) => kb.id === selectedKbId) || knowledgeBases[0];

  const filteredDocs = (activeKB?.documents || []).filter((d) =>
    d.name.toLowerCase().includes(docSearch.toLowerCase())
  );

  const handleCreateKB = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKbName.trim()) {
      toast.error("Please enter a Knowledge Base name.");
      return;
    }
    const created: KnowledgeBase = {
      id: `kb-${Date.now()}`,
      name: newKbName.trim(),
      description:
        newKbDesc.trim() ||
        "Custom vector knowledge base for Zenviah.ai voice agents.",
      documentCount: 0,
      totalChunks: 0,
      status: "Indexed",
      lastUpdated: "Just now",
      attachedAgentIds: [],
      documents: [],
      faqs: [],
    };
    addKnowledgeBase(created);
    setSelectedKbId(created.id);
    setNewKbName("");
    setNewKbDesc("");
    setCreateKbOpen(false);
    toast.success(`Created Knowledge Base "${created.name}"`);
  };

  const handleMockUpload = (fileType: "PDF" | "DOCX" | "TXT", customFileName?: string) => {
    if (!activeKB) return;
    const defaultNames = {
      PDF: "Product_Warranty_And_Escalation_Policy_2026.pdf",
      DOCX: "Regional_Call_Center_Greeting_Scripts.docx",
      TXT: "Instant_UPI_Refund_PinCodes_List.txt",
    };
    const fileName = customFileName || defaultNames[fileType];
    const newDoc: KnowledgeDocument = {
      id: `doc-${Date.now()}`,
      name: fileName,
      type: fileType,
      sizeLabel: fileType === "PDF" ? "1.9 MB" : fileType === "DOCX" ? "840 KB" : "120 KB",
      chunksCount: fileType === "PDF" ? 96 : 48,
      status: "Indexed",
      uploadedAt: "2026-11-04",
      previewContent: `Extracted vector chunks from ${fileName}. Ready for sub-50ms semantic retrieval during live inbound and outbound voice calls.`,
    };
    addDocumentToKB(activeKB.id, newDoc);
    toast.success(`Uploaded & indexed "${fileName}" into ${activeKB.name}`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop()?.toUpperCase();
      const type: "PDF" | "DOCX" | "TXT" =
        ext === "DOCX" ? "DOCX" : ext === "TXT" ? "TXT" : "PDF";
      handleMockUpload(type, file.name);
    } else {
      handleMockUpload("PDF");
    }
  };

  const handleAddWebsiteUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim() || !activeKB) return;
    addDocumentToKB(activeKB.id, {
      id: `url-${Date.now()}`,
      name: websiteUrl.trim(),
      type: "URL",
      sizeLabel: "Live Crawl",
      chunksCount: 52,
      status: "Indexed",
      uploadedAt: "2026-11-04",
      previewContent: `Crawled and indexed all public FAQ & documentation sections from ${websiteUrl.trim()}.`,
    });
    setWebsiteUrl("");
    setUrlModalOpen(false);
    toast.success("Website URL crawled and indexed!");
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQ.trim() || !faqA.trim() || !activeKB) return;
    addFaqToKB(activeKB.id, {
      id: `faq-${Date.now()}`,
      question: faqQ.trim(),
      answer: faqA.trim(),
      category: "Voice Grounding",
    });
    setFaqQ("");
    setFaqA("");
    setFaqModalOpen(false);
    toast.success("Added FAQ pair to Knowledge Base");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
            Knowledge Base & Vector RAG
          </h1>
          <p className="mt-1 text-xs text-[#777E90]">
            Upload PDFs, DOCX, TXT files, crawl website URLs, and manage grounded FAQs for your AI voice agents.
          </p>
        </div>

        <Button onClick={() => setCreateKbOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Create Knowledge Base</span>
        </Button>
      </div>

      {/* Knowledge Base Cards Selector */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {knowledgeBases.map((kb) => {
          const isSelected = kb.id === activeKB?.id;
          return (
            <Card
              key={kb.id}
              onClick={() => setSelectedKbId(kb.id)}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "border-[#635BFF] ring-2 ring-[#635BFF]/20 shadow-elevated"
                  : "hover:border-[#635BFF]/40"
              }`}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF]">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <Badge variant="success">{kb.status}</Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#171923]">{kb.name}</h3>
                  <p className="mt-1 text-xs text-[#777E90] line-clamp-2">
                    {kb.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#E8EAF0] pt-3 text-[11px] text-[#777E90]">
                  <span>
                    <strong className="text-[#171923]">{kb.documentCount}</strong>{" "}
                    docs •{" "}
                    <strong className="text-[#171923]">{kb.totalChunks}</strong>{" "}
                    chunks
                  </span>
                  <span>Updated {kb.lastUpdated}</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold uppercase text-[#777E90]">
                    Agents:
                  </span>
                  {kb.attachedAgentIds.length === 0 ? (
                    <span className="text-[11px] text-[#777E90]">None</span>
                  ) : (
                    kb.attachedAgentIds.map((aid) => {
                      const ag = agents.find((a) => a.id === aid);
                      return (
                        <Badge key={aid} variant="secondary" className="text-[10px]">
                          {ag ? ag.name.split("—")[0].trim() : aid}
                        </Badge>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activeKB && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 8 Columns: Drag-and-Drop Upload + Documents Table + FAQs */}
          <div className="space-y-6 lg:col-span-8">
            {/* Drag-and-Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                isDragging
                  ? "border-[#635BFF] bg-[#635BFF]/10"
                  : "border-[#D5D9E4] bg-white hover:border-[#635BFF]/50"
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#635BFF]/10 text-[#635BFF]">
                <Upload className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-[#171923]">
                Drag and drop documents into “{activeKB.name}”
              </h3>
              <p className="mt-1 text-xs text-[#777E90]">
                Supports PDF, DOCX, TXT, website URLs, and structured FAQs with automatic semantic chunking.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMockUpload("PDF")}
                >
                  <FileText className="h-3.5 w-3.5 text-[#E5484D]" />
                  Upload PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMockUpload("DOCX")}
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-[#635BFF]" />
                  Upload DOCX
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMockUpload("TXT")}
                >
                  <FileText className="h-3.5 w-3.5 text-[#16A36A]" />
                  Upload TXT
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setUrlModalOpen(true)}
                >
                  <Globe className="h-3.5 w-3.5 text-[#0EA5E9]" />
                  Add Website URL
                </Button>
                <Button
                  size="sm"
                  variant="soft"
                  onClick={() => setFaqModalOpen(true)}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Add FAQ Pair
                </Button>
              </div>
            </div>

            {/* Indexed Documents List */}
            <Card>
              <CardHeader className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <CardTitle>Indexed Documents ({filteredDocs.length})</CardTitle>
                  <CardDescription>
                    Preview or manage chunked documents inside {activeKB.name}
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#777E90]" />
                  <Input
                    placeholder="Search documents..."
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-[#E8EAF0]">
                {filteredDocs.length === 0 ? (
                  <p className="py-8 text-center text-xs text-[#777E90]">
                    No documents match your search query.
                  </p>
                ) : (
                  filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col justify-between gap-3 py-3.5 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F9FC] text-xs font-bold text-[#635BFF] border border-[#E8EAF0]">
                          {doc.type}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#171923]">
                            {doc.name}
                          </p>
                          <p className="text-[11px] text-[#777E90]">
                            {doc.sizeLabel} • {doc.chunksCount} vector chunks • Indexed{" "}
                            {doc.uploadedAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="success">{doc.status}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewDoc(doc)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#E5484D]"
                          onClick={() => {
                            deleteDocumentFromKB(activeKB.id, doc.id);
                            toast.info(`Deleted "${doc.name}"`);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* FAQs Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Grounded Voice FAQs ({activeKB.faqs.length})</CardTitle>
                  <CardDescription>
                    High-priority question & answer pairs for zero-hallucination voice responses
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => setFaqModalOpen(true)}>
                  <Plus className="h-3.5 w-3.5" />
                  Add FAQ
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeKB.faqs.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-3.5 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#171923]">
                        Q: {f.question}
                      </p>
                      <Badge variant="outline">{f.category}</Badge>
                    </div>
                    <p className="text-xs text-[#4A5060]">A: {f.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right 4 Columns: Attach Knowledge Base to AI Agents */}
          <div className="space-y-6 lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Attach to AI Voice Agents</CardTitle>
                <CardDescription>
                  Toggle which AI agents have real-time retrieval access to “{activeKB.name}”.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {agents.map((ag) => {
                  const isAttached = activeKB.attachedAgentIds.includes(ag.id);
                  return (
                    <div
                      key={ag.id}
                      onClick={() => {
                        toggleAgentOnKB(activeKB.id, ag.id);
                        toast.success(
                          isAttached
                            ? `Detached ${ag.name} from ${activeKB.name}`
                            : `Attached ${ag.name} to ${activeKB.name}`
                        );
                      }}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                        isAttached
                          ? "border-[#635BFF] bg-[#635BFF]/5"
                          : "border-[#E8EAF0] bg-white hover:bg-[#F8F9FC]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Bot className="h-4 w-4 shrink-0 text-[#635BFF]" />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-[#171923]">
                            {ag.name}
                          </p>
                          <p className="text-[10px] text-[#777E90]">
                            {ag.language}
                          </p>
                        </div>
                      </div>
                      <Badge variant={isAttached ? "default" : "secondary"}>
                        {isAttached ? "Attached" : "Attach"}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Create Knowledge Base Dialog */}
      <Dialog open={createKbOpen} onOpenChange={setCreateKbOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Knowledge Base</DialogTitle>
            <DialogDescription>
              Organize domain documents, SOPs, and FAQs into an isolated vector index.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateKB} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Knowledge Base Name</Label>
              <Input
                placeholder="e.g., Banking KYC & RBI Compliance Guide"
                value={newKbName}
                onChange={(e) => setNewKbName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                placeholder="What documents and policies are stored in this collection?"
                value={newKbDesc}
                onChange={(e) => setNewKbDesc(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateKbOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Knowledge Base</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Website URL Dialog */}
      <Dialog open={urlModalOpen} onOpenChange={setUrlModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crawl & Index Website URL</DialogTitle>
            <DialogDescription>
              Zenviah.ai will extract clean markdown and index chunks into {activeKB?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddWebsiteUrl} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Website or Help Center URL</Label>
              <Input
                type="url"
                placeholder="https://help.yourcompany.in/returns"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setUrlModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Start Crawl & Index</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add FAQ Dialog */}
      <Dialog open={faqModalOpen} onOpenChange={setFaqModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Grounded Voice FAQ</DialogTitle>
            <DialogDescription>
              Define exact answers for high-frequency caller questions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddFaq} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Caller Question</Label>
              <Input
                placeholder="e.g., How do I track my Cash-on-Delivery order?"
                value={faqQ}
                onChange={(e) => setFaqQ(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Grounded Agent Answer</Label>
              <Textarea
                placeholder="Enter the exact response the AI voice agent should provide..."
                value={faqA}
                onChange={(e) => setFaqA(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFaqModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save FAQ</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog
        open={!!previewDoc}
        onOpenChange={(o) => !o && setPreviewDoc(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{previewDoc?.name}</DialogTitle>
            <DialogDescription>
              {previewDoc?.type} • {previewDoc?.sizeLabel} •{" "}
              {previewDoc?.chunksCount} Indexed Vector Chunks
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-4 font-mono text-xs leading-relaxed text-[#171923]">
            {previewDoc?.previewContent}
          </div>
          <DialogFooter>
            <Button onClick={() => setPreviewDoc(null)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

