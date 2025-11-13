import { Card } from "@/components/ui/card";
import { TrendingUp, Lock, DollarSign, Users } from "lucide-react";

const stats = [
  {
    label: "Total Pool Value",
    value: "$2,450,000",
    icon: DollarSign,
    change: "+12.5%",
  },
  {
    label: "Active Loans",
    value: "47",
    icon: Lock,
    change: "+3",
  },
  {
    label: "Average APY",
    value: "8.4%",
    icon: TrendingUp,
    change: "+0.3%",
  },
  {
    label: "Total Users",
    value: "1,234",
    icon: Users,
    change: "+89",
  },
];

export const PoolStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-secondary font-medium">{stat.change}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </Card>
        );
      })}
    </div>
  );
};
