"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Play,
  Pause,
  PhoneCall,
  PhoneOff,
  Send,
  Bot,
  User,
  Sparkles,
  Volume2,
  Cpu,
  BookOpen,
  Blocks,
  Sliders,
  MessageSquareCode,
  Mic,
  MicOff,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/stores/use-app-store";
import {
  LLM_MODELS_BY_PROVIDER,
  SUPPORTED_LANGUAGES,
  VOICE_CATALOG,
} from "@/config/constants";
import {
  AIAgent,
  LLMProvider,
  SupportedLanguage,
  TranscriptTurn,
  VoiceProvider,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { formatDuration } from "@/lib/utils";
import { toast } from "sonner";

export function AgentEditorView({ agentId }: { agentId: string }) {
  const router = useRouter();
  const {
    agents,
    updateAgent,
    setAgentStatus,
    knowledgeBases,
    integrations,
    addCallRecord,
  } = useAppStore();

  const agent = agents.find((a) => a.id === agentId) || agents[0];

  // Editable state initialized from `agent`
  const [name, setName] = useState(agent.name);
  const [description, setDescription] = useState(agent.description);
  const [businessUseCase, setBusinessUseCase] = useState(agent.businessUseCase);
  const [llmProvider, setLlmProvider] = useState<LLMProvider>(agent.llmProvider);
  const [model, setModel] = useState(agent.model);
  const [temperature, setTemperature] = useState(agent.temperature);
  const [maxTokens, setMaxTokens] = useState(agent.maxTokens);
  const [systemPrompt, setSystemPrompt] = useState(agent.systemPrompt);
  const [greetingMessage, setGreetingMessage] = useState(agent.greetingMessage);
  const [conversationInstructions, setConversationInstructions] = useState(
    agent.conversationInstructions
  );
  const [voiceProvider, setVoiceProvider] = useState<VoiceProvider>(
    agent.voiceProvider
  );
  const [voiceId, setVoiceId] = useState(agent.voiceId);
  const [language, setLanguage] = useState<SupportedLanguage>(agent.language);
  const [codeSwitching, setCodeSwitching] = useState(agent.codeSwitching);
  const [speakingSpeed, setSpeakingSpeed] = useState(agent.speakingSpeed);
  const [callTimeoutSeconds, setCallTimeoutSeconds] = useState(
    agent.callTimeoutSeconds
  );
  const [maxCallDurationSeconds, setMaxCallDurationSeconds] = useState(
    agent.maxCallDurationSeconds
  );
  const [humanTransferNumber, setHumanTransferNumber] = useState(
    agent.humanTransferNumber
  );
  const [selectedKbIds, setSelectedKbIds] = useState<string[]>(
    agent.knowledgeBaseIds
  );
  const [connectedInts, setConnectedInts] = useState<string[]>(
    agent.connectedIntegrations
  );

  // Interactive Test Agent Simulator State
  const [testCallActive, setTestCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([
    {
      id: "init-turn",
      speaker: "Agent",
      text: agent.greetingMessage,
      timestamp: "00:01",
      sentiment: "Positive",
      latencyMs: 265,
    },
  ]);

  useEffect(() => {
    if (!testCallActive) return;
    const interval = setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [testCallActive]);

  const handleSaveChanges = () => {
    const voiceObj =
      VOICE_CATALOG.find((v) => v.id === voiceId) || VOICE_CATALOG[0];
    updateAgent(agent.id, {
      name,
      description,
      businessUseCase,
      llmProvider,
      model,
      temperature,
      maxTokens,
      systemPrompt,
      greetingMessage,
      conversationInstructions,
      voiceProvider,
      voiceId,
      voiceName: voiceObj.name,
      language,
      codeSwitching,
      speakingSpeed,
      callTimeoutSeconds,
      maxCallDurationSeconds,
      humanTransferNumber,
      knowledgeBaseIds: selectedKbIds,
      connectedIntegrations: connectedInts,
    });
    toast.success(`Saved configuration updates for "${name}"`);
  };

  const handleStartTestCall = () => {
    setTestCallActive(true);
    setCallSeconds(0);
    setTranscript([
      {
        id: `t-${Date.now()}`,
        speaker: "Agent",
        text: greetingMessage,
        timestamp: "00:01",
        sentiment: "Positive",
        latencyMs: 255,
      },
    ]);
    toast.success(
      `Connected simulated WebRTC voice session with ${name} (${language})`
    );
  };

  const handleEndTestCall = () => {
    setTestCallActive(false);
    addCallRecord({
      id: `call-sim-${Date.now()}`,
      callerNumber: "+91 98400 00111 (WebRTC Sandbox)",
      callerName: "Sandbox Test User",
      agentId: agent.id,
      agentName: name,
      direction: "Inbound",
      durationSeconds: Math.max(12, callSeconds),
      status: "Completed",
      startTime: new Date().toISOString(),
      costINR: Number(((Math.max(12, callSeconds) / 60) * 3.8).toFixed(2)),
      language,
      outcome: "Resolved",
      summary: `Interactive sandbox voice test with ${name}. Completed ${transcript.length} conversational turns.`,
      extractedData: {
        "Test Environment": "Zenviah WebRTC Studio",
        "Voice Model": `${voiceProvider} (${language})`,
      },
      transcript,
      toolExecutions: [],
      recordingDurationSeconds: Math.max(12, callSeconds),
    });
    toast.info("Test call ended and saved to Call Logs.");
  };

  const generateSmartAgentReply = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    if (lower.includes("order") || lower.includes("status") || lower.includes("track")) {
      return language.includes("Tamil")
        ? "Sure sir! Unga Order #ZV-884210 ippo Chennai Anna Nagar hub-la iruku. Nalaiku morning 11 AM kulla priority-la deliver aagidum. Tracking link WhatsApp-la anupiruken!"
        : language.includes("Hindi")
        ? "Bilkul! Aapka Order #ZV-884210 aaj subah local courier hub pahunch gaya hai aur shaam 6 baje tak deliver ho jayega."
        : "I just checked our Order Management System—your parcel #ZV-884210 arrived at your local hub and is scheduled for priority delivery by 11:00 AM tomorrow.";
    }
    if (lower.includes("refund") || lower.includes("return") || lower.includes("cancel")) {
      return language.includes("Tamil")
        ? "Kavalai padathinga! Unga order instant UPI refund-ku eligible. Naan ipave ₹1,499 refund initiate panniten, 15 minutes-la unga account-ku credit aagidum."
        : "I have verified your return eligibility in our policy knowledge base and triggered an instant ₹1,499 UPI refund. You will receive the confirmation SMS within 2 minutes.";
    }
    if (lower.includes("book") || lower.includes("appointment") || lower.includes("demo") || lower.includes("slot")) {
      return "We have two priority slots open tomorrow at 10:30 AM IST and 3:30 PM IST. Shall I lock in the 10:30 AM slot and send a calendar invite to your registered number?";
    }
    if (lower.includes("human") || lower.includes("manager") || lower.includes("supervisor")) {
      return `I understand. I am initiating a warm SIP transfer to our Senior Specialist desk at ${humanTransferNumber} along with a summary of our conversation.`;
    }
    return language.includes("Tamil")
      ? `Nandri! Naan unga request ("${userMessage}") note pannikiten. Vera edhavathu help venuma today?`
      : `Got it! Based on our ${businessUseCase} workflow, I have processed your request and synced the update. Is there anything else I can assist you with?`;
  };

  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (!testCallActive) {
      setTestCallActive(true);
    }

    const userText = chatInput.trim();
    setChatInput("");

    const callerTurn: TranscriptTurn = {
      id: `caller-${Date.now()}`,
      speaker: "Caller",
      text: userText,
      timestamp: formatDuration(callSeconds + 2, "clock"),
      sentiment: "Neutral",
    };

    const replyText = generateSmartAgentReply(userText);
    const agentTurn: TranscriptTurn = {
      id: `agent-${Date.now() + 1}`,
      speaker: "Agent",
      text: replyText,
      timestamp: formatDuration(callSeconds + 4, "clock"),
      sentiment: "Positive",
      latencyMs: Math.floor(240 + Math.random() * 65),
    };

    setTranscript((prev) => [...prev, callerTurn, agentTurn]);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E8EAF0] bg-white p-5 shadow-card lg:flex-row lg:items-center">
        <div className="flex items-start gap-3.5">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-brand"
            style={{ backgroundColor: agent.avatarColor }}
          >
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => router.push("/agents")}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#635BFF] hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                AI Agents
              </button>
              <span className="text-xs text-[#777E90]">/</span>
              <Badge
                variant={
                  agent.status === "Published"
                    ? "success"
                    : agent.status === "Paused"
                    ? "warning"
                    : "secondary"
                }
              >
                {agent.status}
              </Badge>
              <Badge variant="outline">{language}</Badge>
            </div>
            <h1 className="mt-1 text-xl font-bold text-[#171923]">{name}</h1>
            <p className="text-xs text-[#777E90]">
              {voiceProvider} • {llmProvider} ({model}) •{" "}
              {agent.assignedPhoneNumber || "No +91 DID Assigned"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {agent.status === "Published" ? (
            <Button
              variant="outline"
              onClick={() => {
                setAgentStatus(agent.id, "Paused");
                toast.warning(`Paused agent "${name}"`);
              }}
            >
              <Pause className="h-4 w-4 text-[#D97706]" />
              <span>Pause Agent</span>
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={() => {
                setAgentStatus(agent.id, "Published");
                toast.success(`Published agent "${name}" to live voice cluster!`);
              }}
            >
              <Play className="h-4 w-4" />
              <span>Publish Agent</span>
            </Button>
          )}

          <Button onClick={handleSaveChanges}>
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {/* 8-Tab Editor Layout */}
      <Tabs defaultValue="test" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-white p-1.5 shadow-subtle">
          <TabsTrigger value="general">
            <Bot className="h-3.5 w-3.5" />
            General
          </TabsTrigger>
          <TabsTrigger value="model">
            <Cpu className="h-3.5 w-3.5" />
            Model
          </TabsTrigger>
          <TabsTrigger value="voice">
            <Volume2 className="h-3.5 w-3.5" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="prompt">
            <MessageSquareCode className="h-3.5 w-3.5" />
            Prompt
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            <BookOpen className="h-3.5 w-3.5" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="call-settings">
            <Sliders className="h-3.5 w-3.5" />
            Call Settings
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Blocks className="h-3.5 w-3.5" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="test" className="data-[state=active]:bg-[#635BFF] data-[state=active]:text-white">
            <Sparkles className="h-3.5 w-3.5" />
            Test Agent
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: GENERAL */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Agent Identity</CardTitle>
              <CardDescription>
                Update the agent name, description, and operational business use case.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Agent Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Business Use Case</Label>
                  <Input
                    value={businessUseCase}
                    onChange={(e) => setBusinessUseCase(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: MODEL */}
        <TabsContent value="model">
          <Card>
            <CardHeader>
              <CardTitle>LLM Provider & Inference Parameters</CardTitle>
              <CardDescription>
                Configure your real-time reasoning provider, model version, and token limits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>LLM Provider</Label>
                  <select
                    value={llmProvider}
                    onChange={(e) => {
                      const prov = e.target.value as LLMProvider;
                      setLlmProvider(prov);
                      setModel(LLM_MODELS_BY_PROVIDER[prov][0].id);
                    }}
                    className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm"
                  >
                    <option value="OpenAI">OpenAI</option>
                    <option value="Google Gemini">Google Gemini</option>
                    <option value="Anthropic">Anthropic</option>
                    <option value="Groq">Groq</option>
                    <option value="Azure OpenAI">Azure OpenAI</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label>Model</Label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm"
                  >
                    {LLM_MODELS_BY_PROVIDER[llmProvider].map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} ({m.latency})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Temperature ({temperature})</Label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-[#635BFF]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Maximum Tokens</Label>
                  <Input
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: VOICE */}
        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle>Voice & Multilingual Synthesis</CardTitle>
              <CardDescription>
                Configure Indian and global neural voices, speaking speed, and Tamil-English / Hindi-English code-switching.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Voice Provider</Label>
                  <select
                    value={voiceProvider}
                    onChange={(e) =>
                      setVoiceProvider(e.target.value as VoiceProvider)
                    }
                    className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm"
                  >
                    <option value="Sarvam AI">Sarvam AI</option>
                    <option value="ElevenLabs">ElevenLabs</option>
                    <option value="Cartesia">Cartesia</option>
                    <option value="PlayHT">PlayHT</option>
                    <option value="Azure Neural">Azure Neural</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label>Voice Persona</Label>
                  <select
                    value={voiceId}
                    onChange={(e) => setVoiceId(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm"
                  >
                    {VOICE_CATALOG.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.provider})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label>Language</Label>
                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as SupportedLanguage)
                    }
                    className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.name} value={l.name}>
                        {l.name} ({l.nativeName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-4">
                <div>
                  <p className="text-xs font-bold text-[#171923]">
                    Dynamic Tamil-English & Hindi-English Code-Switching
                  </p>
                  <p className="text-xs text-[#777E90]">
                    Allows the voice synthesizer to seamlessly switch mid-sentence between English and Indic scripts.
                  </p>
                </div>
                <Switch
                  checked={codeSwitching}
                  onCheckedChange={setCodeSwitching}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: PROMPT */}
        <TabsContent value="prompt">
          <Card>
            <CardHeader>
              <CardTitle>System Prompt & Greeting Script</CardTitle>
              <CardDescription>
                Define exact instructions, tone, and variable injection rules.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Spoken Greeting Message</Label>
                <Textarea
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Core System Prompt</Label>
                <Textarea
                  rows={7}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Conversation Guardrails</Label>
                <Textarea
                  value={conversationInstructions}
                  onChange={(e) => setConversationInstructions(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: KNOWLEDGE BASE */}
        <TabsContent value="knowledge">
          <Card>
            <CardHeader>
              <CardTitle>Attached Knowledge Bases (RAG)</CardTitle>
              <CardDescription>
                Select which indexed document collections this agent can query mid-call.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {knowledgeBases.map((kb) => {
                const isSelected = selectedKbIds.includes(kb.id);
                return (
                  <div
                    key={kb.id}
                    onClick={() =>
                      setSelectedKbIds((prev) =>
                        prev.includes(kb.id)
                          ? prev.filter((id) => id !== kb.id)
                          : [...prev, kb.id]
                      )
                    }
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? "border-[#635BFF] bg-[#635BFF]/5"
                        : "border-[#E8EAF0] bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={isSelected ? "default" : "secondary"}>
                        {isSelected ? "Attached" : "Unattached"}
                      </Badge>
                      <span className="text-xs text-[#777E90]">
                        {kb.documentCount} docs
                      </span>
                    </div>
                    <h4 className="mt-2.5 text-sm font-bold text-[#171923]">
                      {kb.name}
                    </h4>
                    <p className="mt-1 text-xs text-[#777E90]">
                      {kb.description}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: CALL SETTINGS */}
        <TabsContent value="call-settings">
          <Card>
            <CardHeader>
              <CardTitle>Call Timeouts & Human Escalation Settings</CardTitle>
              <CardDescription>
                Configure silence detection, maximum duration, and warm SIP transfer target.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Silence Timeout (Seconds)</Label>
                <Input
                  type="number"
                  value={callTimeoutSeconds}
                  onChange={(e) =>
                    setCallTimeoutSeconds(Number(e.target.value))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Maximum Call Duration (Seconds)</Label>
                <Input
                  type="number"
                  value={maxCallDurationSeconds}
                  onChange={(e) =>
                    setMaxCallDurationSeconds(Number(e.target.value))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Human Transfer Number (+91)</Label>
                <Input
                  value={humanTransferNumber}
                  onChange={(e) => setHumanTransferNumber(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 7: INTEGRATIONS */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Agent Tool & CRM Integrations</CardTitle>
              <CardDescription>
                Enable third-party tools that this AI voice agent can trigger during or after a call.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {integrations.map((int) => {
                const enabled = connectedInts.includes(int.id);
                return (
                  <div
                    key={int.id}
                    className="flex items-center justify-between rounded-xl border border-[#E8EAF0] p-3.5"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#171923]">
                        {int.name}
                      </p>
                      <p className="text-[11px] text-[#777E90]">
                        {int.category}
                      </p>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={() =>
                        setConnectedInts((prev) =>
                          prev.includes(int.id)
                            ? prev.filter((i) => i !== int.id)
                            : [...prev, int.id]
                        )
                      }
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 8: TEST AGENT (Interactive Voice & Chat Sandbox) */}
        <TabsContent value="test">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Simulated Call Controls & Audio Telemetry */}
            <Card className="lg:col-span-4 flex flex-col justify-between bg-[#111318] text-white border-[#222631]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={testCallActive ? "success" : "secondary"}
                    className="gap-1.5"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        testCallActive
                          ? "bg-[#16A36A] animate-ping"
                          : "bg-[#777E90]"
                      }`}
                    />
                    {testCallActive ? "LIVE VOICE SESSION" : "READY TO TEST"}
                  </Badge>
                  <span className="font-mono text-xs text-[#8B7CFF]">
                    {formatDuration(callSeconds, "clock")}
                  </span>
                </div>
                <CardTitle className="pt-3 text-white">{name}</CardTitle>
                <CardDescription className="text-[#A3A9B8]">
                  {voiceProvider} • {language} • {model}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Visual Voice Orb / Waveform */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-8">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#635BFF] to-[#8B7CFF] shadow-brand transition-transform duration-300 ${
                      testCallActive ? "scale-110 animate-pulse" : "opacity-80"
                    }`}
                  >
                    <PhoneCall className="h-8 w-8 text-white" />
                  </div>
                  <p className="mt-4 text-xs font-medium text-[#A3A9B8]">
                    {testCallActive
                      ? "Streaming bidirectional audio & ASR..."
                      : "Click 'Start Test' to begin simulated call"}
                  </p>
                  {testCallActive && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#16A36A]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Turn Latency: 265ms • Barge-in Active
                    </div>
                  )}
                </div>

                {/* Call Controls */}
                <div className="space-y-2.5">
                  {!testCallActive ? (
                    <Button
                      size="lg"
                      className="w-full bg-[#16A36A] hover:bg-[#138A59]"
                      onClick={handleStartTestCall}
                    >
                      <PhoneCall className="h-4 w-4" />
                      <span>Start Test Call</span>
                    </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      <Button
                        variant="outline"
                        className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? (
                          <>
                            <MicOff className="h-4 w-4 text-[#E5484D]" />
                            Muted
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 text-[#16A36A]" />
                            Mic Live
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleEndTestCall}
                      >
                        <PhoneOff className="h-4 w-4" />
                        <span>End Test</span>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Quick Sample Prompts */}
                <div className="space-y-1.5 border-t border-white/10 pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#777E90]">
                    Try Sample Utterances
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Ennoda order ID 884210 status enna?",
                      "Can I get an instant UPI refund?",
                      "Book a demo slot for tomorrow morning",
                      "Transfer me to a human supervisor",
                    ].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => setChatInput(sample)}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-left text-[11px] text-[#D5D9E4] hover:border-[#8B7CFF] hover:text-white"
                      >
                        “{sample}”
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Interactive Conversation Transcript & Text Input */}
            <Card className="lg:col-span-8 flex flex-col justify-between">
              <CardHeader className="border-b border-[#E8EAF0] pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Live Conversation Transcript</CardTitle>
                    <CardDescription>
                      Test how {name} responds in real time using your prompt and attached RAG knowledge base.
                    </CardDescription>
                  </div>
                  <Badge variant="outline">WebRTC + Text Sandbox</Badge>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between p-5">
                <div className="max-h-[380px] min-h-[300px] space-y-4 overflow-y-auto pr-2">
                  {transcript.map((turn) => (
                    <div
                      key={turn.id}
                      className={`flex items-start gap-3 ${
                        turn.speaker === "Caller" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                          turn.speaker === "Agent"
                            ? "bg-[#635BFF] text-white"
                            : "bg-[#111318] text-white"
                        }`}
                      >
                        {turn.speaker === "Agent" ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          turn.speaker === "Agent"
                            ? "border border-[#E8EAF0] bg-[#F8F9FC] text-[#171923]"
                            : "bg-[#635BFF] text-white"
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between gap-3 text-[10px] opacity-75">
                          <span className="font-semibold">
                            {turn.speaker === "Agent" ? name : "Caller (You)"}
                          </span>
                          <span>
                            {turn.timestamp}
                            {turn.latencyMs ? ` • ${turn.latencyMs}ms` : ""}
                          </span>
                        </div>
                        <p>{turn.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleSendTestMessage}
                  className="mt-4 flex items-center gap-2 border-t border-[#E8EAF0] pt-4"
                >
                  <Input
                    placeholder="Type a caller utterance in English, Tanglish, or Hinglish..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Send className="h-4 w-4" />
                    <span>Send Turn</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

