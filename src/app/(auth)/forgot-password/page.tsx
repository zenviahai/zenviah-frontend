"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, MailCheck, Send } from "lucide-react";
import { ZenviahLogo } from "@/components/shared/zenviah-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid work email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (values: ForgotFormValues) => {
    await new Promise((r) => setTimeout(r, 350));
    setSubmittedEmail(values.email);
    toast.success(`Password reset instructions sent to ${values.email}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FC] px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <ZenviahLogo variant="light" size="lg" showTagline />
          <h1 className="mt-6 text-2xl font-bold text-[#171923]">
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-[#777E90]">
            Enter the work email linked to your Zenviah.ai workspace.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8EAF0] bg-white p-7 shadow-card">
          {submittedEmail ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16A36A]/10 text-[#16A36A]">
                <MailCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-[#171923]">
                Check your inbox
              </h3>
              <p className="text-xs leading-relaxed text-[#777E90]">
                We sent a secure 15-minute password reset link to{" "}
                <span className="font-semibold text-[#171923]">
                  {submittedEmail}
                </span>
                .
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSubmittedEmail(null)}
              >
                Try another email address
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="arjun@zenviah.ai"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-[#E5484D]">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4" />
                <span>Send Reset Link</span>
              </Button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#635BFF] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

