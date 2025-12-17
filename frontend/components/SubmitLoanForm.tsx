"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreateLoanValues } from "@/hooks/useLoanOperations";
import { 
  Lock, 
  Shield, 
  DollarSign, 
  Percent, 
  Clock, 
  Coins,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const collateralOptions = ["ETH", "BTC", "USDC", "Mixed"] as const;

const collateralIcons: Record<string, string> = {
  ETH: "⟠",
  BTC: "₿",
  USDC: "💵",
  Mixed: "🔀",
};

interface SubmitLoanFormProps {
  onSubmit: (values: CreateLoanValues) => Promise<void>;
  isSubmitting: boolean;
  disabledMessage?: string;
}

export function SubmitLoanForm({ onSubmit, isSubmitting, disabledMessage }: SubmitLoanFormProps) {
  const [amount, setAmount] = useState(50_000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [duration, setDuration] = useState(12);
  const [collateralType, setCollateralType] = useState<typeof collateralOptions[number]>("ETH");
  const [collateralAmount, setCollateralAmount] = useState(100_000);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await onSubmit({
        amount,
        interestRate,
        duration,
        collateralType,
        collateralAmount,
      });
      toast.success("🔐 Encrypted loan submitted", {
        description: "Your request is pending funding on-chain.",
      });
    } catch (error) {
      console.error("Submit loan failed", error);
      toast.error("Submission failed", {
        description: (error as Error).message ?? "Unknown error",
      });
    }
  };

  const collateralRatio = amount > 0 ? ((collateralAmount / amount) * 100).toFixed(0) : 0;

  return (
    <Card className="glass-card p-6 md:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-primary uppercase tracking-widest font-medium">
              Submit Encrypted Loan
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold gradient-text">
            Private Borrowing with FHE
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your loan details are encrypted before touching the blockchain
          </p>
        </div>
        
        {/* Security Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
          <Shield className="h-4 w-4 text-secondary" />
          <span className="text-xs text-secondary font-medium">FHE Secured</span>
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 text-primary" />
              Requested Amount (USD)
            </label>
            <div className="relative">
              <Input
                type="number"
                min={1}
                step={100}
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
                required
                className="input-enhanced pl-8 text-lg font-medium"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" /> Will be encrypted
            </p>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Percent className="h-4 w-4 text-secondary" />
              Interest Rate (APY)
            </label>
            <div className="relative">
              <Input
                type="number"
                min={0.1}
                step={0.1}
                value={interestRate}
                onChange={(event) => setInterestRate(Number(event.target.value))}
                required
                className="input-enhanced pr-8 text-lg font-medium"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" /> Will be encrypted
            </p>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-purple-400" />
              Duration
            </label>
            <div className="relative">
              <Input
                type="number"
                min={1}
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
                required
                className="input-enhanced pr-16 text-lg font-medium"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">months</span>
            </div>
          </div>

          {/* Collateral Amount */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="h-4 w-4 text-yellow-400" />
              Collateral Amount (USD)
            </label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                step={100}
                value={collateralAmount}
                onChange={(event) => setCollateralAmount(Number(event.target.value))}
                required
                className="input-enhanced pl-8 text-lg font-medium"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" /> Will be encrypted
            </p>
          </div>
        </div>

        {/* Collateral Type */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            Collateral Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {collateralOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCollateralType(option)}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                  collateralType === option
                    ? "bg-primary/10 border-primary/50 text-primary"
                    : "bg-card/50 border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-2xl">{collateralIcons[option]}</span>
                <span className="text-sm font-medium">{option}</span>
                {collateralType === option && (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-xl bg-card/50 border border-border/50 space-y-3">
          <p className="text-sm font-medium text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Loan Summary
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Amount</p>
              <p className="font-medium text-foreground">${amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">APY</p>
              <p className="font-medium text-foreground">{interestRate}%</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Duration</p>
              <p className="font-medium text-foreground">{duration} months</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Collateral Ratio</p>
              <p className={`font-medium ${Number(collateralRatio) >= 150 ? 'text-secondary' : 'text-yellow-400'}`}>
                {collateralRatio}%
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || Boolean(disabledMessage)}
          className="w-full btn-primary h-14 text-lg relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Encrypting & Submitting...
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                Submit Encrypted Loan Request
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </Button>

        {/* Info Text */}
        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
          <Shield className="h-3 w-3" />
          {disabledMessage || "Your numeric inputs are encrypted locally inside the browser before touching the blockchain."}
        </p>
      </form>
    </Card>
  );
}
