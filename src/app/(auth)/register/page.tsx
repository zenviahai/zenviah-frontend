"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { ZenviahLogo } from "@/components/shared/zenviah-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/stores/use-app-store";
import { toast } from "sonner";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    workEmail: z.string().email("Enter a valid work email"),
    companyName: z.string().min(2, "Company name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Zenviah.ai Terms & DPDP Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const updateUserProfile = useAppStore((s) => s.updateUserProfile);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      workEmail: "",
      companyName: "",
      password: "",
      confirmPassword: "",
      acceptTerms: true,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    await new Promise((r) => setTimeout(r, 450));
    updateUserProfile({
      name: values.fullName,
      email: values.workEmail,
      company: values.companyName,
    });
    toast.success(
      `Workspace created for ${values.companyName}! ₹2,500 free voice test credits unlocked.`
    );
    router.push("/dashboard");
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-12 bg-[#F8F9FC]">
      {/* Left Brand Sidebar */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#111318] p-12 text-white lg:col-span-5 lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#635BFF]/25 blur-3xl" />
        <ZenviahLogo variant="dark" size="lg" showTagline />

        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Launch your first AI Phone Agent in under 5 minutes.
          </h1>
          <ul className="space-y-3.5 text-sm text-[#A3A9B8]">
            {[
              "₹2,500 complimentary voice sandbox credits included",
              "8 Indian languages + Tamil-English & Hindi-English code-switching",
              "Visual React Flow call workflow builder with live simulator",
              "Instant Exotel, Twilio, HubSpot & Webhook connectors",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A36A]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-white/10 pt-6 text-xs text-[#777E90]">
          Zenviah.ai — Intelligent Voice. Automated Business.
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="flex flex-col items-center justify-center px-6 py-10 lg:col-span-7">
        <div className="w-full max-w-md space-y-6">
          <div>
            <div className="lg:hidden mb-3">
              <ZenviahLogo variant="light" size="md" showTagline />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#171923]">
              Create your Zenviah.ai account
            </h2>
            <p className="mt-1 text-sm text-[#777E90]">
              Start orchestrating intelligent inbound and outbound voice workflows.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8EAF0] bg-white p-7 shadow-card">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Arjun Suryanarayanan"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-[#E5484D]">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="workEmail">Work Email</Label>
                  <Input
                    id="workEmail"
                    type="email"
                    placeholder="arjun@company.in"
                    {...register("workEmail")}
                  />
                  {errors.workEmail && (
                    <p className="text-xs text-[#E5484D]">
                      {errors.workEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Aarohan Technologies"
                    {...register("companyName")}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-[#E5484D]">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 characters"
                      className="pr-9"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-[#777E90]"
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

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-[#E5484D]">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-[#4A5060] cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-[#E8EAF0] text-[#635BFF]"
                    {...register("acceptTerms")}
                  />
                  <span>
                    I agree to the Zenviah.ai Terms of Service, Privacy Policy, and TRAI/DPDP voice compliance guidelines.
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-xs text-[#E5484D]">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                <span>
                  {isSubmitting ? "Provisioning Workspace..." : "Create Account"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-[#777E90]">
            Already have a Zenviah.ai workspace?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#635BFF] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

