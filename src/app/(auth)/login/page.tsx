"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, ArrowRight, ShieldCheck, AudioWaveform, Globe2 } from "lucide-react";
import { ZenviahLogo } from "@/components/shared/zenviah-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid work email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "arjun@zenviah.ai",
      password: "••••••••••••",
      rememberMe: true,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    toast.success(`Welcome back to Zenviah.ai, ${values.email}`);
    router.push("/dashboard");
  };

  const handleGoogleSignIn = () => {
    toast.success("Authenticated via Google Workspace SSO (Zenviah.ai)");
    router.push("/dashboard");
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-12 bg-[#F8F9FC]">
      {/* Left Brand Showcase Panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#111318] p-12 text-white lg:col-span-5 lg:flex">
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#635BFF]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-80 w-80 rounded-full bg-[#8B7CFF]/15 blur-3xl" />

        <div className="relative z-10">
          <ZenviahLogo variant="dark" size="lg" showTagline />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#8B7CFF]">
            <AudioWaveform className="h-3.5 w-3.5" />
            Sub-300ms Real-Time Multilingual Voice AI
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
            Intelligent Voice.
            <br />
            <span className="bg-gradient-to-r from-[#8B7CFF] to-[#C4B5FD] bg-clip-text text-transparent">
              Automated Business.
            </span>
          </h1>
          <p className="text-sm leading-relaxed text-[#A3A9B8]">
            Deploy human-like AI phone agents across Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, and English with visual workflow orchestration.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Globe2 className="h-4 w-4 text-[#8B7CFF]" />
                Native Code-Switching
              </div>
              <p className="mt-1 text-[11px] text-[#777E90]">
                Seamless Tanglish & Hinglish turn detection with zero robotic pauses.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-[#16A36A]" />
                India Data Residency
              </div>
              <p className="mt-1 text-[11px] text-[#777E90]">
                DPDP Act, RBI & TRAI compliant voice clusters in Mumbai & Bengaluru.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-[#777E90]">
          <span>© 2026 Zenviah.ai Inc.</span>
          <span>SOC2 Type II • ISO 27001</span>
        </div>
      </div>

      {/* Right Authentication Form */}
      <div className="flex flex-col items-center justify-center px-6 py-12 lg:col-span-7">
        <div className="w-full max-w-md space-y-7">
          <div className="flex flex-col items-start space-y-2">
            <div className="lg:hidden mb-2">
              <ZenviahLogo variant="light" size="md" showTagline />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#171923]">
              Sign in to Zenviah.ai
            </h2>
            <p className="text-sm text-[#777E90]">
              Enter your workspace credentials to manage your AI phone agents.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8EAF0] bg-white p-7 shadow-card space-y-5">
            {/* Google Sign-In UI */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 font-medium"
              onClick={handleGoogleSignIn}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                />
              </svg>
              Continue with Google Workspace
            </Button>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[#E8EAF0]" />
              <span className="bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-[#777E90]">
                Or with work email
              </span>
              <div className="w-full border-t border-[#E8EAF0]" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-[#E5484D]">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#635BFF] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#777E90] hover:text-[#171923]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-[#E5484D]">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-[#4A5060] cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#E8EAF0] text-[#635BFF] focus:ring-[#635BFF]"
                    {...register("rememberMe")}
                  />
                  Remember this device for 30 days
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "Signing in..." : "Sign in to Zenviah.ai"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-[#777E90]">
            New to Zenviah.ai?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#635BFF] hover:underline"
            >
              Create your enterprise workspace
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

