import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, TrendingUp, Calendar, DollarSign } from "lucide-react";

interface LoanCardProps {
  id: string;
  amount: string;
  encryptedAmount: string;
  interestRate: string;
  duration: string;
  collateral: string;
  status: "available" | "active" | "completed";
}

export const LoanCard = ({
  amount,
  encryptedAmount,
  interestRate,
  duration,
  collateral,
  status,
}: LoanCardProps) => {
  const statusColors = {
    available: "bg-secondary/20 text-secondary border-secondary/30",
    active: "bg-primary/20 text-primary border-primary/30",
    completed: "bg-muted/20 text-muted-foreground border-muted/30",
  };

  return (
    <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 relative overflow-hidden group">
      <div className="encrypted-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 glow-border">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Encrypted Loan Request</p>
              <p className="text-xs text-primary glow-text font-mono">{encryptedAmount}</p>
            </div>
          </div>
          <Badge className={statusColors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="font-semibold text-foreground">{amount}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Interest Rate</p>
              <p className="font-semibold text-secondary">{interestRate}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-semibold text-foreground">{duration}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Collateral</p>
              <p className="font-semibold text-foreground">{collateral}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {status === "available" && (
            <>
              <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Lend
              </Button>
              <Button variant="outline" className="flex-1 border-primary/30 hover:bg-primary/10">
                View Details
              </Button>
            </>
          )}
          {status === "active" && (
            <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10">
              View Active Loan
            </Button>
          )}
          {status === "completed" && (
            <Button variant="outline" className="w-full" disabled>
              Completed
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
