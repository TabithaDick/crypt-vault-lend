"use client";

import { useMemo, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PoolStats } from "@/components/PoolStats";
import { SubmitLoanForm } from "@/components/SubmitLoanForm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useLoanData } from "@/hooks/useLoanData";
import { useLoanOperations } from "@/hooks/useLoanOperations";
import { getLendingPoolAddress } from "@/contracts/lendingPool";
import { LoanEntry } from "@/lib/lending";
import { useFhevm } from "@/fhevm/useFhevm";

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [refreshKey, setRefreshKey] = useState(0);
  const contractAddress = useMemo(() => (chain?.id ? getLendingPoolAddress(chain.id) : undefined), [chain?.id]);

  const { instance, status: fheStatus, error: fheError } = useFhevm({
    provider: walletClient?.transport,
    chainId: chain?.id,
    enabled: Boolean(walletClient && chain?.id),
  });

  const { stats, myLoans, availableLoans, isLoading } = useLoanData({
    contractAddress,
    publicClient,
    refreshKey,
    account: address,
  });

  const onSettled = () => setRefreshKey((prev) => prev + 1);

  const { createLoan, fundLoan, repayLoan, isCreating, isFunding, isRepaying } = useLoanOperations({
    contractAddress,
    instance,
    account: address,
    publicClient,
    onSettled,
  });

  const submitDisabledMessage = useMemo(() => {
    if (!isConnected) {
      return "Connect your wallet to submit encrypted loans.";
    }
    if (!contractAddress) {
      return "Unsupported network. Switch to Sepolia or Localhost.";
    }
    if (fheStatus === "loading") {
      return "Initializing FHE runtime...";
    }
    if (fheStatus === "error") {
      return fheError?.message || "FHE runtime failed to start.";
    }
    return undefined;
  }, [isConnected, contractAddress, fheStatus, fheError]);

  const shortAddress = (value: string) => `${value.slice(0, 6)}…${value.slice(-4)}`;
  const formatHandle = (value: string) => `${value.slice(0, 8)}…${value.slice(-6)}`;

  const handleFundLoan = async (loan: LoanEntry) => {
    try {
      const hash = await fundLoan(loan.id);
      toast.success("Loan funded", { description: `Transaction sent: ${hash}` });
    } catch (error) {
      toast.error("Funding failed", { description: (error as Error).message });
    }
  };

  const handleRepayLoan = async (loan: LoanEntry) => {
    try {
      const hash = await repayLoan(loan.id);
      toast.success("Loan repaid", { description: `Transaction sent: ${hash}` });
    } catch (error) {
      toast.error("Repayment failed", { description: (error as Error).message });
    }
  };

  const LoanList = ({
    title,
    description,
    loans,
    emptyState,
    renderAction,
  }: {
    title: string;
    description: string;
    loans: LoanEntry[];
    emptyState: string;
    renderAction?: (loan: LoanEntry) => React.ReactNode;
  }) => (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-secondary uppercase tracking-widest">{title}</p>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
      </div>

      {loans.length === 0 ? (
        <div className="text-sm text-muted-foreground">{emptyState}</div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div
              key={loan.id.toString()}
              className="rounded-lg border border-border p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm text-muted-foreground">Loan #{loan.id.toString()}</div>
                <Badge
                  className={
                    loan.status === "available"
                      ? "bg-secondary/20 text-secondary"
                      : loan.status === "active"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted/40 text-muted-foreground"
                  }
                >
                  {loan.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Borrower</p>
                  <p className="font-mono text-foreground">{shortAddress(loan.borrower)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="text-foreground">{loan.duration} months</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Collateral</p>
                  <p className="text-foreground">{loan.collateralType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Encrypted Amount</p>
                  <p className="font-mono text-xs text-primary">{formatHandle(loan.amountHandle)}</p>
                </div>
              </div>

              {renderAction?.(loan)}
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-secondary uppercase tracking-[0.4em]">
            <ShieldCheck className="h-4 w-4" />
            FULLY HOMOMORPHIC ENCRYPTED LENDING
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 glow-text">
            Submit private loan intents, settle transparently on-chain.
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            This MVP wires RainbowKit, wagmi and the FHE relayer so every amount stays encrypted end-to-end.
            Use your wallet to submit, fund or repay encrypted loans on Sepolia or a local Hardhat node.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <SubmitLoanForm
            onSubmit={async (values) => {
              await createLoan(values);
            }}
            isSubmitting={isCreating}
            disabledMessage={submitDisabledMessage}
          />

          <PoolStats
            totalValueLocked={stats?.totalValueLocked}
            totalLoansActive={stats?.totalLoansActive}
            averageAPY={stats?.averageAPY}
            utilizationRate={stats?.utilizationRate}
            isLoading={isLoading}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <LoanList
            title="My Loans"
            description="Encrypted requests created with this wallet"
            loans={myLoans}
            emptyState="No loans yet. Submit an encrypted request to get started."
            renderAction={(loan) => {
              if (loan.status === "active") {
                return (
                  <Button
                    onClick={() => handleRepayLoan(loan)}
                    disabled={isRepaying}
                    className="w-full"
                  >
                    {isRepaying ? "Submitting repayment..." : "Repay Loan"}
                  </Button>
                );
              }
              if (loan.status === "available") {
                return (
                  <div className="text-xs text-muted-foreground">Waiting for lender funding…</div>
                );
              }
              return (
                <div className="text-xs text-muted-foreground">Completed</div>
              );
            }}
          />

          <LoanList
            title="Available Loans"
            description="Fund borrowers and earn encrypted yield"
            loans={availableLoans}
            emptyState="No loans are open for funding right now."
            renderAction={(loan) => (
              <Button
                onClick={() => handleFundLoan(loan)}
                disabled={isFunding || !isConnected}
                className="w-full bg-secondary hover:bg-secondary/90"
              >
                {isFunding ? "Funding..." : "Fund Loan"}
              </Button>
            )}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
