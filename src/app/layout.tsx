import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Zenviah.ai — Intelligent Voice. Automated Business.",
  description:
    "Enterprise AI Voice Automation SaaS Platform. Build, orchestrate, and scale low-latency multilingual AI phone agents, visual call workflows, and outbound campaigns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
