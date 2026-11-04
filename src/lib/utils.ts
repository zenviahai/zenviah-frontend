import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats monetary values in Indian Rupees (INR) with proper Indian numbering system
 */
export function formatINR(amount: number, showDecimals = false): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Formats numbers using Indian locale grouping (e.g., 1,24,500)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Formats seconds into mm:ss or Xm Ys
 */
export function formatDuration(seconds: number, style: "clock" | "compact" = "compact"): string {
  if (!seconds || seconds <= 0) return style === "clock" ? "00:00" : "0s";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (style === "clock") {
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${String(secs).padStart(2, "0")}s`;
}

/**
 * Formats an Indian phone number nicely: +91 98765 43210
 */
export function formatPhoneIN(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+91") && cleaned.length === 13) {
    return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
}

