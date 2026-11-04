import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ZenviahLogo } from "@/components/shared/zenviah-logo";
import { formatINR, formatDuration, formatPhoneIN } from "@/lib/utils";
import { useAppStore } from "@/stores/use-app-store";
import { BRAND_CONFIG, SUPPORTED_LANGUAGES } from "@/config/constants";

describe("Zenviah.ai Brand & Core Platform Verification", () => {
  it("enforces official Zenviah.ai branding and tagline", () => {
    expect(BRAND_CONFIG.name).toBe("Zenviah.ai");
    expect(BRAND_CONFIG.tagline).toBe("Intelligent Voice. Automated Business.");

    render(<ZenviahLogo showTagline />);
    expect(screen.getByText("Zenviah")).toBeInTheDocument();
    expect(screen.getByText(".ai")).toBeInTheDocument();
    expect(
      screen.getByText("Intelligent Voice. Automated Business.")
    ).toBeInTheDocument();
  });

  it("formats INR currency and call durations accurately", () => {
    expect(formatINR(49999)).toContain("49,999");
    expect(formatDuration(148)).toBe("2m 28s");
    expect(formatDuration(148, "clock")).toBe("02:28");
    expect(formatPhoneIN("+919840271490")).toBe("+91 98402 71490");
  });

  it("supports all 8 Indian + global languages and Tamil-English code-switching", () => {
    const languageNames = SUPPORTED_LANGUAGES.map((l) => l.name);
    expect(languageNames).toContain("Tamil");
    expect(languageNames).toContain("Tamil-English (Tanglish)");
    expect(languageNames).toContain("Hindi");
    expect(languageNames).toContain("Telugu");
    expect(languageNames).toContain("Malayalam");
    expect(languageNames).toContain("Kannada");
    expect(languageNames).toContain("Bengali");
    expect(languageNames).toContain("Marathi");
  });

  it("manages AI agents, knowledge bases, and masked API keys in Zustand store", () => {
    const initialCount = useAppStore.getState().agents.length;
    const firstAgent = useAppStore.getState().agents[0];

    const duplicated = useAppStore.getState().duplicateAgent(firstAgent.id);
    expect(duplicated).not.toBeNull();
    expect(useAppStore.getState().agents.length).toBe(initialCount + 1);

    const newKey = useAppStore
      .getState()
      .createApiKey("Test Suite Key", "Staging");
    expect(newKey.maskedKey).toContain("••••");
  });
});

