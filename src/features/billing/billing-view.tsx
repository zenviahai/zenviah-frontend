"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Check,
  Sparkles,
  Download,
  Plus,
  Clock,
  IndianRupee,
  Zap,
  Building2,
} from "lucide-react";
import { useAppStore } from "@/stores/use-app-store";
import { CONFIGURABLE_PRICING_PLANS } from "@/config/constants";
import { PricingPlan } from "@/types";
import { formatINR, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function BillingView() {
  const {
    workspaces,
    activeWorkspaceId,
    invoices,
    changeSubscriptionPlan,
    addCreditsINR,
  } = useAppStore();

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(10000);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const currentPlanObj =
    CONFIGURABLE_PRICING_PLANS.find((p) => p.id === activeWorkspace.plan) ||
    CONFIGURABLE_PRICING_PLANS[2];

  const usagePct = Math.min(
    100,
    Math.round(
      (activeWorkspace.minutesUsed / activeWorkspace.minutesLimit) * 100
    )
  );

  const estimatedMonthlyCostINR =
    (currentPlanObj.monthlyPriceINR || 49999) +
    Math.max(
      0,
      (activeWorkspace.minutesUsed - activeWorkspace.minutesLimit) *
        currentPlanObj.overagePerMinINR
    );

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.id === activeWorkspace.plan) return;
    changeSubscriptionPlan(plan.id, plan.includedMinutes);
    toast.success(
      `Switched ${activeWorkspace.name} subscription to ${plan.name} Plan (${formatNumber(
        plan.includedMinutes
      )} mins/mo)`
    );
  };

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (topUpAmount <= 0) return;
    addCreditsINR(topUpAmount);
    setTopUpOpen(false);
    toast.success(
      `Added ${formatINR(topUpAmount)} voice compute credits to ${activeWorkspace.name}`
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
            Subscriptions, Usage & INR Billing
          </h1>
          <p className="mt-1 text-xs text-[#777E90]">
            Manage your Zenviah.ai workspace plan, voice minute quotas, prepaid INR credits, and GST tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" onClick={() => setPaymentModalOpen(true)}>
            <CreditCard className="h-4 w-4" />
            <span>Payment Method</span>
          </Button>
          <Button onClick={() => setTopUpOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Top Up INR Credits</span>
          </Button>
        </div>
      </div>

      {/* Current Subscription & Usage Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card className="bg-[#111318] text-white border-[#222631]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A3A9B8]">Current Plan</span>
              <Badge variant="default">{activeWorkspace.plan}</Badge>
            </div>
            <p className="mt-3 text-2xl font-bold">
              {currentPlanObj.monthlyPriceINR
                ? `${formatINR(currentPlanObj.monthlyPriceINR)}/mo`
                : "Custom SLA"}
            </p>
            <p className="mt-1 text-[11px] text-[#777E90]">
              Up to {currentPlanObj.concurrencyLimit} concurrent voice lines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#777E90]">
                Minutes Consumed
              </span>
              <Clock className="h-4 w-4 text-[#635BFF]" />
            </div>
            <p className="mt-3 text-2xl font-bold text-[#171923]">
              {formatNumber(activeWorkspace.minutesUsed)}m
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E8EAF0]">
              <div
                className="h-full rounded-full bg-[#635BFF]"
                style={{ width: `${usagePct}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-[#777E90]">
              {usagePct}% of {formatNumber(activeWorkspace.minutesLimit)}m quota
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#777E90]">
                Remaining Credits
              </span>
              <Zap className="h-4 w-4 text-[#16A36A]" />
            </div>
            <p className="mt-3 text-2xl font-bold text-[#16A36A]">
              {formatINR(activeWorkspace.creditsBalanceINR)}
            </p>
            <p className="mt-1 text-[11px] text-[#777E90]">
              Auto-recharge enabled below ₹5,000
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#777E90]">
                Estimated Cycle Cost
              </span>
              <IndianRupee className="h-4 w-4 text-[#635BFF]" />
            </div>
            <p className="mt-3 text-2xl font-bold text-[#171923]">
              {formatINR(estimatedMonthlyCostINR)}
            </p>
            <p className="mt-1 text-[11px] text-[#777E90]">
              Overage rate: ₹{currentPlanObj.overagePerMinINR}/min
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#777E90]">
                Payment Method
              </span>
              <Building2 className="h-4 w-4 text-[#171923]" />
            </div>
            <p className="mt-3 text-base font-bold text-[#171923]">
              HDFC Corporate Visa •••• 4821
            </p>
            <p className="mt-1 text-[11px] text-[#16A36A]">
              RBI e-Mandate & UPI AutoPay Verified
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configurable Pricing Plans Grid (Starter, Growth, Business, Enterprise) */}
      <div className="space-y-3">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-[#171923]">
              Subscription Tiers (Upgrade or Downgrade Anytime)
            </h2>
            <p className="text-xs text-[#777E90]">
              Configurable reference tiers in INR (`src/config/constants.ts`). All plans include visual workflow builder & multilingual voices.
            </p>
          </div>
          <Badge variant="outline">Configurable INR Pricing</Badge>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {CONFIGURABLE_PRICING_PLANS.map((plan) => {
            const isCurrent = plan.id === activeWorkspace.plan;
            return (
              <Card
                key={plan.id}
                className={`flex flex-col justify-between ${
                  plan.highlighted
                    ? "border-[#635BFF] ring-2 ring-[#635BFF]/20 shadow-elevated"
                    : ""
                }`}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#171923]">
                      {plan.name}
                    </h3>
                    {isCurrent ? (
                      <Badge variant="success">Active Plan</Badge>
                    ) : plan.highlighted ? (
                      <Badge variant="default">Most Popular</Badge>
                    ) : null}
                  </div>

                  <div>
                    <span className="text-2xl font-bold text-[#171923]">
                      {plan.monthlyPriceINR
                        ? formatINR(plan.monthlyPriceINR)
                        : "Custom"}
                    </span>
                    {plan.monthlyPriceINR && (
                      <span className="text-xs text-[#777E90]"> / month</span>
                    )}
                    <p className="mt-1.5 text-xs text-[#777E90]">
                      {plan.tagline}
                    </p>
                  </div>

                  <ul className="space-y-2 border-t border-[#E8EAF0] pt-3 text-xs text-[#4A5060]">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#16A36A]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={isCurrent ? "outline" : "default"}
                    className="w-full"
                    disabled={isCurrent}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {isCurrent
                      ? "Current Active Plan"
                      : plan.monthlyPriceINR
                      ? `Switch to ${plan.name}`
                      : "Activate Enterprise Tier"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Invoice History Table */}
      <Card>
        <CardHeader>
          <CardTitle>GST Tax Invoice History</CardTitle>
          <CardDescription>
            Download official INR invoices for accounting and GST input credit
          </CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Billing Period</TableHead>
              <TableHead>Plan & Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount (INR)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-xs font-bold">
                  {inv.invoiceNumber}
                </TableCell>
                <TableCell className="text-xs">{inv.period}</TableCell>
                <TableCell className="text-xs text-[#777E90]">
                  {inv.planName}
                </TableCell>
                <TableCell className="text-xs text-[#777E90]">
                  {inv.date}
                </TableCell>
                <TableCell className="font-semibold text-xs">
                  {formatINR(inv.amountINR)}
                </TableCell>
                <TableCell>
                  <Badge variant="success">{inv.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      toast.success(
                        `Downloaded GST Invoice ${inv.invoiceNumber}.pdf`
                      )
                    }
                  >
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Top Up Credits Dialog */}
      <Dialog open={topUpOpen} onOpenChange={setTopUpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up Prepaid Voice Credits (INR)</DialogTitle>
            <DialogDescription>
              Add instant voice compute credits via UPI, Corporate Card, or NetBanking.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTopUp} className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[5000, 10000, 25000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt)}
                  className={`rounded-xl border py-2 text-xs font-bold ${
                    topUpAmount === amt
                      ? "border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF]"
                      : "border-[#E8EAF0] text-[#171923]"
                  }`}
                >
                  {formatINR(amt)}
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label>Custom Amount (INR)</Label>
              <Input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setTopUpOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add {formatINR(topUpAmount)}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Method Dialog */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Payment Methods & GSTIN</DialogTitle>
            <DialogDescription>
              Configure RBI-compliant recurring e-Mandates and company GST details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Company GSTIN (India)</Label>
              <Input defaultValue="29AABCZ9182K1Z5 (Karnataka)" />
            </div>
            <div className="space-y-1.5">
              <Label>Primary Card / UPI AutoPay Handle</Label>
              <Input defaultValue="HDFC Corporate Visa •••• 4821" />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setPaymentModalOpen(false);
                toast.success("Updated billing & GSTIN preferences!");
              }}
            >
              Save Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

