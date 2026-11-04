"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  Cpu,
  Volume2,
  BookOpen,
  PhoneForwarded,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Play,
  Square,
  Upload,
  Globe,
  Plus,
  Sparkles,
  Save,
} from "lucide-react";
import { useAppStore } from "@/stores/use-app-store";
import {
  LLM_MODELS_BY_PROVIDER,
  SUPPORTED_LANGUAGES,
  VOICE_CATALOG,
} from "@/config/constants";
import {
  AIAgent,
  CallDirection,
  LLMProvider,
  SupportedLanguage,
  VoiceProvider,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const WIZARD_STEPS = [
  { step: 1, title: "Basic Details", icon: Bot },
  { step: 2, title: "Model Config", icon: Cpu },
  { step: 3, title: "Voice & Language", icon: Volume2 },
  { step: 4, title: "Knowledge Base", icon: BookOpen },
  { step: 5, title: "Call Behavior", icon: PhoneForwarded },
  { step: 6, title: "Review & Launch", icon: CheckCircle2 },
];

export function AgentWizard() {
  const router = useRouter();
  const { addAgent, knowledgeBases, addDocumentToKB, addFaqToKB } = useAppStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [previewPlayingId, setPreviewPlayingId] = useState<string | null>(null);

  // Step 1: Basic Details
  const [name, setName] = useState("Nila — Bilingual Order & Support Concierge");
  const [description, setDescription] = useState(
    "Automated inbound and outbound customer support voice agent handling order status, returns, and appointment confirmation."
  );
  const [agentType, setAgentType] = useState<AIAgent["agentType"]>("Customer Support");
  const [direction, setDirection] = useState<CallDirection | "Both">("Inbound");
  const [businessUseCase, setBusinessUseCase] = useState(
    "24/7 Multilingual Order Tracking & Instant UPI Refund Desk"
  );

  // Step 2: Model Configuration
  const [llmProvider, setLlmProvider] = useState<LLMProvider>("Google Gemini");
  const [model, setModel] = useState("gemini-2.0-flash");
  const [systemPrompt, setSystemPrompt] = useState(
    `You are Nila, an intelligent AI phone specialist at Zenviah.ai.\nSpeak naturally and concisely. When callers switch between Tamil and English (Tanglish) or Hindi and English, match their code-switching seamlessly.\nAlways verify their 6-digit Order ID before sharing dispatch status.`
  );
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(450);
  const [responseBehavior, setResponseBehavior] =
    useState<AIAgent["responseBehavior"]>("Balanced & Conversational");

  // Step 3: Voice Configuration
  const [voiceProvider, setVoiceProvider] = useState<VoiceProvider>("Sarvam AI");
  const [selectedVoiceId, setSelectedVoiceId] = useState("sarvam-ananya-ta-en");
  const [language, setLanguage] = useState<SupportedLanguage>(
    "Tamil-English (Tanglish)"
  );
  const [codeSwitching, setCodeSwitching] = useState(true);
  const [speakingSpeed, setSpeakingSpeed] = useState(1.02);
  const [voiceGender, setVoiceGender] = useState<"Female" | "Male" | "Neutral">(
    "Female"
  );
  const [interruptionSensitivity, setInterruptionSensitivity] = useState<
    "Low" | "Medium" | "High"
  >("High");

  // Step 4: Knowledge Base
  const [selectedKbIds, setSelectedKbIds] = useState<string[]>([
    "kb-ecom-policies",
  ]);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  // Step 5: Call Behavior
  const [greetingMessage, setGreetingMessage] = useState(
    "Vanakkam! Welcome to Zenviah Customer Support. Naan Nila pesuren. How can I assist you today?"
  );
  const [conversationInstructions, setConversationInstructions] = useState(
    "Keep each spoken turn under 2 sentences. Confirm caller's order ID before calling the OMS webhook."
  );
  const [callTimeoutSeconds, setCallTimeoutSeconds] = useState(12);
  const [maxCallDurationSeconds, setMaxCallDurationSeconds] = useState(600);
  const [humanTransferNumber, setHumanTransferNumber] =
    useState("+91 44 4812 9900");
  const [fallbackBehavior, setFallbackBehavior] =
    useState<AIAgent["fallbackBehavior"]>("Transfer to Human");
  const [endCallConditions, setEndCallConditions] = useState(
    "Customer confirms issue is resolved, Caller says goodbye/nandri, Call transferred to human supervisor"
  );

  const selectedVoiceObj =
    VOICE_CATALOG.find((v) => v.id === selectedVoiceId) || VOICE_CATALOG[0];

  const handleVoicePreview = (voiceId: string, sampleText: string) => {
    if (previewPlayingId === voiceId) {
      setPreviewPlayingId(null);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }
    setPreviewPlayingId(voiceId);
    toast.info(`Playing neural voice sample: "${sampleText}"`);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.rate = speakingSpeed;
      utterance.onend = () => setPreviewPlayingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPreviewPlayingId(null), 3000);
    }
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!name.trim() || !businessUseCase.trim()) {
        toast.error("Please enter both an Agent Name and Business Use Case.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!systemPrompt.trim()) {
        toast.error("Please provide a system prompt for the AI model.");
        return false;
      }
    }
    if (currentStep === 5) {
      if (!greetingMessage.trim()) {
        toast.error("Please specify an initial greeting message.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setCurrentStep((prev) => Math.min(6, prev + 1));
  };

  const handleFinalize = (status: "Draft" | "Published") => {
    if (!validateCurrentStep()) return;
    const newAgent: AIAgent = {
      id: `agt-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      avatarColor: status === "Published" ? "#635BFF" : "#8B7CFF",
      agentType,
      direction,
      businessUseCase: businessUseCase.trim(),
      status,
      llmProvider,
      model,
      systemPrompt,
      temperature,
      maxTokens,
      responseBehavior,
      voiceProvider: selectedVoiceObj.provider,
      voiceId: selectedVoiceObj.id,
      voiceName: selectedVoiceObj.name,
      voiceGender,
      language,
      codeSwitching,
      speakingSpeed,
      interruptionSensitivity,
      knowledgeBaseIds: selectedKbIds,
      greetingMessage,
      conversationInstructions,
      callTimeoutSeconds,
      maxCallDurationSeconds,
      humanTransferNumber,
      fallbackBehavior,
      endCallConditions: endCallConditions
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      connectedIntegrations: ["int-exotel", "int-hubspot"],
      totalCalls: 0,
      successRate: 95.0,
      avgDurationSeconds: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addAgent(newAgent);
    toast.success(
      status === "Published"
        ? `AI Agent "${newAgent.name}" created and published!`
        : `Saved "${newAgent.name}" as Draft.`
    );
    router.push(`/agents/${newAgent.id}`);
  };

  const toggleKbSelection = (kbId: string) => {
    setSelectedKbIds((prev) =>
      prev.includes(kbId) ? prev.filter((id) => id !== kbId) : [...prev, kbId]
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            type="button"
            onClick={() => router.push("/agents")}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#635BFF] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to AI Agents
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
            Create AI Voice Agent
          </h1>
          <p className="text-xs text-[#777E90]">
            Configure your agent’s persona, LLM reasoning engine, Indian/global neural voice, and RAG knowledge base.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleFinalize("Draft")}>
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </Button>
        </div>
      </div>

      {/* 6-Step Progress Stepper */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#E8EAF0] bg-white p-3 shadow-subtle sm:grid-cols-3 lg:grid-cols-6">
        {WIZARD_STEPS.map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.step;
          const isCompleted = currentStep > s.step;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step)}
              className={`flex items-center gap-2.5 rounded-xl p-2.5 text-left transition-all ${
                isActive
                  ? "bg-[#635BFF] text-white shadow-brand"
                  : isCompleted
                  ? "bg-[#16A36A]/10 text-[#16A36A]"
                  : "bg-[#F8F9FC] text-[#777E90] hover:text-[#171923]"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : isCompleted
                    ? "bg-[#16A36A] text-white"
                    : "bg-white text-[#777E90]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase opacity-80">
                  Step {s.step}
                </p>
                <p className="truncate text-xs font-semibold">{s.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step Content Card */}
      <Card className="border-[#E8EAF0]">
        {/* STEP 1: BASIC DETAILS */}
        {currentStep === 1 && (
          <>
            <CardHeader>
              <CardTitle>Step 1: Basic Agent Details</CardTitle>
              <CardDescription>
                Define your AI phone agent’s identity, call direction, and primary business objective.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="agent-name">Agent Name</Label>
                  <Input
                    id="agent-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Ananya — Customer Support Desk"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agent-type">Agent Type</Label>
                  <select
                    id="agent-type"
                    value={agentType}
                    onChange={(e) =>
                      setAgentType(e.target.value as AIAgent["agentType"])
                    }
                    className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm text-[#171923] focus:border-[#635BFF] focus:outline-none"
                  >
                    <option value="Customer Support">Customer Support</option>
                    <option value="Appointment Booking">Appointment Booking</option>
                    <option value="Lead Qualification">Lead Qualification</option>
                    <option value="Order Collection">Order Collection & COD Verification</option>
                    <option value="Payment Reminder">Payment & Renewal Reminder</option>
                    <option value="Technical Helpdesk">Technical Helpdesk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Call Direction</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Inbound", "Outbound", "Both"] as const).map((dir) => (
                      <button
                        key={dir}
                        type="button"
                        onClick={() => setDirection(dir)}
                        className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                          direction === dir
                            ? "border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF]"
                            : "border-[#E8EAF0] bg-white text-[#4A5060] hover:bg-[#F8F9FC]"
                        }`}
                      >
                        {dir}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="use-case">Business Use Case</Label>
                  <Input
                    id="use-case"
                    value={businessUseCase}
                    onChange={(e) => setBusinessUseCase(e.target.value)}
                    placeholder="e.g., 24/7 Order Tracking & Refund Desk"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent-desc">Agent Description</Label>
                <Textarea
                  id="agent-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this voice agent handles..."
                />
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 2: MODEL CONFIGURATION */}
        {currentStep === 2 && (
          <>
            <CardHeader>
              <CardTitle>Step 2: LLM & Reasoning Configuration</CardTitle>
              <CardDescription>
                Choose the foundation LLM provider, model latency profile, and system instructions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>LLM Provider</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {(
                      [
                        "OpenAI",
                        "Google Gemini",
                        "Anthropic",
                        "Groq",
                        "Azure OpenAI",
                      ] as LLMProvider[]
                    ).map((prov) => (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => {
                          setLlmProvider(prov);
                          setModel(LLM_MODELS_BY_PROVIDER[prov][0].id);
                        }}
                        className={`rounded-xl border p-2.5 text-left text-xs font-semibold transition-all ${
                          llmProvider === prov
                            ? "border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF]"
                            : "border-[#E8EAF0] bg-white text-[#171923] hover:bg-[#F8F9FC]"
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="llm-model">Model Selection</Label>
                  <select
                    id="llm-model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm text-[#171923] focus:border-[#635BFF] focus:outline-none"
                  >
                    {LLM_MODELS_BY_PROVIDER[llmProvider].map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} ({m.latency})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sys-prompt">System Prompt & Persona Guardrails</Label>
                <Textarea
                  id="sys-prompt"
                  rows={5}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Temperature</Label>
                    <span className="text-xs font-bold text-[#635BFF]">
                      {temperature}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-[#635BFF]"
                  />
                  <p className="text-[11px] text-[#777E90]">
                    Lower values (0.2–0.4) prevent hallucination on calls.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Maximum Tokens per Turn</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resp-behavior">Response Behavior</Label>
                  <select
                    id="resp-behavior"
                    value={responseBehavior}
                    onChange={(e) =>
                      setResponseBehavior(
                        e.target.value as AIAgent["responseBehavior"]
                      )
                    }
                    className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm text-[#171923]"
                  >
                    <option value="Concise & Fast">Concise & Fast</option>
                    <option value="Balanced & Conversational">
                      Balanced & Conversational
                    </option>
                    <option value="Detailed & Empathetic">
                      Detailed & Empathetic
                    </option>
                  </select>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 3: VOICE CONFIGURATION */}
        {currentStep === 3 && (
          <>
            <CardHeader>
              <CardTitle>Step 3: Neural Voice & Multilingual Configuration</CardTitle>
              <CardDescription>
                Select voice provider, language (Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali, Marathi, English), and Tamil-English code-switching.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Voice Provider</Label>
                  <select
                    value={voiceProvider}
                    onChange={(e) =>
                      setVoiceProvider(e.target.value as VoiceProvider)
                    }
                    className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm text-[#171923]"
                  >
                    <option value="Sarvam AI">Sarvam AI (Indic Neural HD)</option>
                    <option value="ElevenLabs">ElevenLabs (Turbo v2.5)</option>
                    <option value="Cartesia">Cartesia Sonic</option>
                    <option value="PlayHT">PlayHT 3.0 Mini</option>
                    <option value="Azure Neural">Azure Neural India</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Primary Language</Label>
                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as SupportedLanguage)
                    }
                    className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm text-[#171923]"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.name} value={lang.name}>
                        {lang.name} — {lang.nativeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Voice Gender</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Female", "Male", "Neutral"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setVoiceGender(g)}
                        className={`rounded-lg border py-1.5 text-xs font-semibold ${
                          voiceGender === g
                            ? "border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF]"
                            : "border-[#E8EAF0] text-[#4A5060]"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tamil-English / Indic Code-Switching Banner */}
              <div className="flex items-center justify-between rounded-xl border border-[#635BFF]/25 bg-[#635BFF]/5 p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#635BFF]" />
                    <span className="text-xs font-bold text-[#171923]">
                      Enable Dynamic Tamil-English (Tanglish) & Hindi-English Code-Switching
                    </span>
                  </div>
                  <p className="text-xs text-[#777E90]">
                    Automatically adapts pronunciation and grammar when callers blend regional Indian languages with English technical terms.
                  </p>
                </div>
                <Switch
                  checked={codeSwitching}
                  onCheckedChange={setCodeSwitching}
                />
              </div>

              {/* Voice Selection Cards with Live Preview */}
              <div className="space-y-2">
                <Label>Select Voice Persona & Preview Sample</Label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {VOICE_CATALOG.map((v) => {
                    const isSelected = selectedVoiceId === v.id;
                    const isPlaying = previewPlayingId === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => {
                          setSelectedVoiceId(v.id);
                          setVoiceProvider(v.provider);
                          setVoiceGender(v.gender);
                        }}
                        className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                          isSelected
                            ? "border-[#635BFF] bg-[#635BFF]/[0.04] shadow-subtle"
                            : "border-[#E8EAF0] bg-white hover:border-[#D5D9E4]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-[#171923]">
                              {v.name}
                            </p>
                            <p className="text-[11px] text-[#777E90]">
                              {v.provider} • {v.gender} • {v.accent}
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant={isPlaying ? "default" : "outline"}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVoicePreview(v.id, v.sampleLine);
                            }}
                          >
                            {isPlaying ? (
                              <>
                                <Square className="h-3 w-3" />
                                Stop
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3" />
                                Preview
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="mt-2 rounded-lg bg-[#F8F9FC] p-2 text-[11px] italic text-[#4A5060]">
                          “{v.sampleLine}”
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Speed & Interruption Handling */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Speaking Speed</Label>
                    <span className="text-xs font-bold text-[#635BFF]">
                      {speakingSpeed}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.75}
                    max={1.35}
                    step={0.01}
                    value={speakingSpeed}
                    onChange={(e) =>
                      setSpeakingSpeed(parseFloat(e.target.value))
                    }
                    className="w-full accent-[#635BFF]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Barge-In / Interruption Sensitivity</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Low", "Medium", "High"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setInterruptionSensitivity(lvl)}
                        className={`rounded-lg border py-1.5 text-xs font-semibold ${
                          interruptionSensitivity === lvl
                            ? "border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF]"
                            : "border-[#E8EAF0] text-[#4A5060]"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 4: KNOWLEDGE BASE */}
        {currentStep === 4 && (
          <>
            <CardHeader>
              <CardTitle>Step 4: Knowledge Base & RAG Grounding</CardTitle>
              <CardDescription>
                Attach existing knowledge bases, upload PDF/DOCX/TXT documents, crawl URLs, or add instant FAQs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Select Existing Knowledge Bases</Label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {knowledgeBases.map((kb) => {
                    const attached = selectedKbIds.includes(kb.id);
                    return (
                      <div
                        key={kb.id}
                        onClick={() => toggleKbSelection(kb.id)}
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${
                          attached
                            ? "border-[#635BFF] bg-[#635BFF]/5"
                            : "border-[#E8EAF0] bg-white hover:bg-[#F8F9FC]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant={attached ? "default" : "secondary"}>
                            {attached ? "Attached" : "Click to Attach"}
                          </Badge>
                          <span className="text-[11px] text-[#777E90]">
                            {kb.totalChunks} chunks
                          </span>
                        </div>
                        <h4 className="mt-2.5 text-xs font-bold text-[#171923]">
                          {kb.name}
                        </h4>
                        <p className="mt-1 text-[11px] text-[#777E90] line-clamp-2">
                          {kb.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Upload & URL Crawl inside Wizard */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-dashed border-[#D5D9E4] bg-[#F8F9FC] p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#171923]">
                    <Upload className="h-4 w-4 text-[#635BFF]" />
                    Quick Upload Document (PDF, DOCX, TXT)
                  </div>
                  <p className="mt-1 text-[11px] text-[#777E90]">
                    Automatically chunks and embeds into the selected Knowledge Base.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      const targetKb = selectedKbIds[0] || knowledgeBases[0].id;
                      addDocumentToKB(targetKb, {
                        id: `doc-${Date.now()}`,
                        name: "Custom_Agent_SOP_2026.pdf",
                        type: "PDF",
                        sizeLabel: "1.4 MB",
                        chunksCount: 64,
                        status: "Indexed",
                        uploadedAt: "2026-11-04",
                        previewContent:
                          "Indexed SOP rules for instant voice verification, escalation matrix, and regional greeting scripts.",
                      });
                      toast.success(
                        "Uploaded and indexed Custom_Agent_SOP_2026.pdf (64 chunks)"
                      );
                    }}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Simulate Document Upload
                  </Button>
                </div>

                <div className="rounded-xl border border-[#E8EAF0] bg-white p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#171923]">
                    <Globe className="h-4 w-4 text-[#16A36A]" />
                    Add Website URL to Index
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://docs.yourcompany.in/faq"
                      value={newWebsiteUrl}
                      onChange={(e) => setNewWebsiteUrl(e.target.value)}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (!newWebsiteUrl.trim()) return;
                        const targetKb =
                          selectedKbIds[0] || knowledgeBases[0].id;
                        addDocumentToKB(targetKb, {
                          id: `url-${Date.now()}`,
                          name: newWebsiteUrl.trim(),
                          type: "URL",
                          sizeLabel: "Live Crawl",
                          chunksCount: 38,
                          status: "Indexed",
                          uploadedAt: "2026-11-04",
                          previewContent: `Crawled live web content from ${newWebsiteUrl.trim()}`,
                        });
                        setNewWebsiteUrl("");
                        toast.success("Website URL crawled and indexed!");
                      }}
                    >
                      Add URL
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add FAQ */}
              <div className="rounded-xl border border-[#E8EAF0] p-4 space-y-3">
                <Label>Add Instant Grounded FAQ Pair</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="Question (e.g., What are your customer support hours?)"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Answer spoken by the AI agent..."
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
                        const targetKb =
                          selectedKbIds[0] || knowledgeBases[0].id;
                        addFaqToKB(targetKb, {
                          id: `faq-${Date.now()}`,
                          question: newFaqQuestion.trim(),
                          answer: newFaqAnswer.trim(),
                          category: "Custom",
                        });
                        setNewFaqQuestion("");
                        setNewFaqAnswer("");
                        toast.success("FAQ added to Knowledge Base!");
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 5: CALL BEHAVIOR */}
        {currentStep === 5 && (
          <>
            <CardHeader>
              <CardTitle>Step 5: Call Behavior & Escalation Rules</CardTitle>
              <CardDescription>
                Configure initial greeting, timeouts, warm transfer to human supervisors, and end-call triggers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="greeting">First Spoken Greeting Message</Label>
                <Textarea
                  id="greeting"
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conv-inst">Conversation & Guardrail Instructions</Label>
                <Textarea
                  id="conv-inst"
                  value={conversationInstructions}
                  onChange={(e) => setConversationInstructions(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="space-y-1.5">
                  <Label>Silence Timeout (sec)</Label>
                  <Input
                    type="number"
                    value={callTimeoutSeconds}
                    onChange={(e) =>
                      setCallTimeoutSeconds(Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Max Call Duration (sec)</Label>
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
                <div className="space-y-1.5">
                  <Label>Fallback Behavior</Label>
                  <select
                    value={fallbackBehavior}
                    onChange={(e) =>
                      setFallbackBehavior(
                        e.target.value as AIAgent["fallbackBehavior"]
                      )
                    }
                    className="flex h-9 w-full rounded-lg border border-[#E8EAF0] bg-white px-3 text-sm"
                  >
                    <option value="Transfer to Human">Transfer to Human</option>
                    <option value="Apologize & End Call">
                      Apologize & End Call
                    </option>
                    <option value="Retry Prompt">Retry Prompt</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>End-Call Conditions (comma-separated)</Label>
                <Input
                  value={endCallConditions}
                  onChange={(e) => setEndCallConditions(e.target.value)}
                />
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 6: REVIEW */}
        {currentStep === 6 && (
          <>
            <CardHeader>
              <CardTitle>Step 6: Review & Deploy AI Voice Agent</CardTitle>
              <CardDescription>
                Verify all settings before launching your agent into your Zenviah.ai workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
                    1. Identity & Use Case
                  </h4>
                  <p className="text-sm font-bold text-[#171923]">{name}</p>
                  <p className="text-xs text-[#777E90]">{description}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="outline">{agentType}</Badge>
                    <Badge variant="default">{direction}</Badge>
                  </div>
                </div>

                <div className="rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
                    2. LLM & Reasoning Engine
                  </h4>
                  <p className="text-sm font-bold text-[#171923]">
                    {llmProvider} • {model}
                  </p>
                  <p className="text-xs text-[#777E90]">
                    Temperature: {temperature} • Max Tokens: {maxTokens} •{" "}
                    {responseBehavior}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
                    3. Voice & Multilingual Setup
                  </h4>
                  <p className="text-sm font-bold text-[#171923]">
                    {selectedVoiceObj.name} ({selectedVoiceObj.provider})
                  </p>
                  <p className="text-xs text-[#777E90]">
                    Language: <strong>{language}</strong> • Speed:{" "}
                    {speakingSpeed}x • Code-Switching:{" "}
                    {codeSwitching ? "Enabled" : "Off"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E8EAF0] bg-[#F8F9FC] p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
                    4. Knowledge Base & Escalation
                  </h4>
                  <p className="text-sm font-bold text-[#171923]">
                    {selectedKbIds.length} Knowledge Base(s) Attached
                  </p>
                  <p className="text-xs text-[#777E90]">
                    Warm Transfer: {humanTransferNumber} • Max Duration:{" "}
                    {maxCallDurationSeconds}s
                  </p>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>

      {/* Wizard Footer Controls */}
      <div className="flex items-center justify-between rounded-2xl border border-[#E8EAF0] bg-white p-4 shadow-subtle">
        <Button
          type="button"
          variant="outline"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleFinalize("Draft")}
          >
            Save Draft
          </Button>
          {currentStep < 6 ? (
            <Button type="button" onClick={handleNext}>
              <span>Next Step</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              onClick={() => handleFinalize("Published")}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Create Agent</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

