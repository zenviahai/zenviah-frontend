import React from "react";
import { cn } from "@/lib/utils";

interface ZenviahLogoProps {
  variant?: "dark" | "light";
  collapsed?: boolean;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

/**
 * Official Zenviah.ai Geometric Brand Mark & Wordmark
 * Features a precision geometric acoustic-prism emblem (no generic robots).
 */
export function ZenviahLogo({
  variant = "dark",
  collapsed = false,
  size = "md",
  showTagline = false,
  className,
}: ZenviahLogoProps) {
  const iconDimensions =
    size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const textSize =
    size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-[17px]";

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#635BFF] via-[#7165FF] to-[#8B7CFF] shadow-brand ring-1 ring-white/15",
          iconDimensions
        )}
      >
        {/* Geometric Acoustic Prism SVG */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[64%] w-[64%]"
          aria-hidden="true"
        >
          {/* Outer Z-Prism Geometry */}
          <path
            d="M7 9.5H23.5L9.5 22.5H25"
            stroke="white"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Harmonic Voice Pulse Nodes */}
          <circle cx="7" cy="9.5" r="2.1" fill="white" />
          <circle cx="25" cy="22.5" r="2.1" fill="white" />
          <path
            d="M16 5.5V8M16 24V26.5"
            stroke="white"
            strokeOpacity="0.7"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-0.5">
            <span
              className={cn(
                "font-semibold tracking-tight",
                textSize,
                variant === "dark" ? "text-white" : "text-[#171923]"
              )}
            >
              Zenviah
            </span>
            <span
              className={cn(
                "font-semibold tracking-tight text-[#8B7CFF]",
                textSize
              )}
            >
              .ai
            </span>
          </div>
          {showTagline && (
            <span
              className={cn(
                "mt-1 text-[10px] font-medium tracking-wide",
                variant === "dark" ? "text-[#777E90]" : "text-[#777E90]"
              )}
            >
              Intelligent Voice. Automated Business.
            </span>
          )}
        </div>
      )}
    </div>
  );
}

