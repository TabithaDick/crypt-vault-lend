"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export interface PoolStatsProps {
  totalValueLocked?: number;
  totalLoansActive?: number;
  averageAPY?: number;
  utilizationRate?: number;
  isLoading?: boolean;
}

export function PoolStats({
  totalValueLocked,
  totalLoansActive,
  averageAPY,
  utilizationRate,
  isLoading,
}: PoolStatsProps) {
  const stats = [
    {
      label: "Total Value Locked",
      value:
        totalValueLocked !== undefined
          ? `$${(totalValueLocked / 1_000_000).toFixed(2)}M`
          : "--",
      icon: DollarSign,
      hint: "Encrypted liquidity committed",
    },
    {
      label: "Active Loans",
      value: totalLoansActive ?? "--",
      icon: Activity,
      hint: "Loans currently in progress",
    },
    {
      label: "Average APY",
      value: averageAPY !== undefined ? `${(averageAPY / 100).toFixed(2)}%` : "--",
      icon: TrendingUp,
      hint: "Encrypted blended yield",
    },
    {
      label: "Utilization",
      value:
        utilizationRate !== undefined
          ? `${(utilizationRate / 100).toFixed(2)}%`
          : "--",
      icon: Users,
      hint: "Share of capital deployed",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-700"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">
                {isLoading ? <span className="animate-pulse">--</span> : stat.value}
              </p>
              <p className="text-xs text-secondary mt-1">{stat.hint}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 glow-border">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
