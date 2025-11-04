"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { toast } from "sonner";
import { Activity, BarChart2, RefreshCw, ShieldCheck } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PoolStats } from "@/components/PoolStats";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useFhevm } from "@/fhevm/useFhevm";
import { useLoanData } from "@/hooks/useLoanData";
import { useLoanOperations } from "@/hooks/useLoanOperations";
import { getLendingPoolAddress } from "@/contracts/lendingPool";
import { LoanEntry } from "@/lib/lending";

export default function DashboardPage() {
  const { address, isConnected, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [refreshKey, setRefreshKey] = useState(0);
  const contractAddress = useMemo(() => (chain?.id ? getLendingPoolAddress(chain.id) : undefined), [chain?.id]);

  const { instance, status: fheStatus, error: fheError, refresh: refreshFhevm } = useFhevm({
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

  const { fundLoan, repayLoan, isFunding, isRepaying } = useLoanOperations({
    contractAddress,
    instance,
    account: address,
    publicClient,
    onSettled,
  });

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
        {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-primary" />}
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

  const statusColorMap: Record<string, string> = {
    ready: "text-emerald-400",
    loading: "text-amber-400",
    error: "text-red-400",
    idle: "text-muted-foreground",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-secondary uppercase tracking-[0.4em]">
            <ShieldCheck className="h-4 w-4" />
            ENCRYPTED OPERATIONS
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 glow-text">
            Operational dashboard for your encrypted lending activity.
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Monitor wallet, network, RainbowKit connection, and FHE relayer health. Fund open requests, settle active loans,
            and keep an auditable trail without revealing confidential amounts.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary uppercase tracking-widest">Wallet & Network</p>
                <p className="text-lg text-muted-foreground">RainbowKit connection status</p>
              </div>
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Wallet</p>
                <p className="font-mono text-foreground">{address ? shortAddress(address) : "Not connected"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Network</p>
                <p className="text-foreground">{chain?.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Active Contract</p>
                <p className="font-mono text-xs text-primary">
                  {contractAddress ? contractAddress : "Select Hardhat or Sepolia"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary uppercase tracking-widest">FHE Runtime</p>
                <p className="text-lg text-muted-foreground">Relayer status & diagnostics</p>
              </div>
              <BarChart2 className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className={`text-base font-semibold ${statusColorMap[fheStatus] ?? "text-muted-foreground"}`}>
                  {fheStatus.toUpperCase()}
                </span>
                <Button variant="outline" size="sm" onClick={refreshFhevm} disabled={fheStatus === "loading"}>
                  Refresh
                </Button>
              </div>
              {fheError && <p className="text-xs text-red-400">{fheError.message}</p>}
              <p className="text-muted-foreground text-xs">
                Encryption requires a live relayer. Keep your wallet unlocked while initialization completes.
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary uppercase tracking-widest">Quick Actions</p>
                <p className="text-lg text-muted-foreground">Shortcuts for daily operations</p>
              </div>
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/">Submit New Encrypted Loan</Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setRefreshKey((prev) => prev + 1)}>
                Refresh Loan Lists
              </Button>
            </div>
          </Card>
        </div>

        <PoolStats
          totalValueLocked={stats?.totalValueLocked}
          totalLoansActive={stats?.totalLoansActive}
          averageAPY={stats?.averageAPY}
          utilizationRate={stats?.utilizationRate}
          isLoading={isLoading}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <LoanList
            title="My Loans"
            description="Requests originated by this wallet"
            loans={myLoans}
            emptyState="No encrypted loans yet. Submit one to get started."
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
                return <p className="text-xs text-muted-foreground">Waiting for funding…</p>;
              }
              return <p className="text-xs text-muted-foreground">Completed</p>;
            }}
          />

          <LoanList
            title="Available Loans"
            description="Encrypted orders open for funding"
            loans={availableLoans}
            emptyState="There are no open loans at the moment."
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
