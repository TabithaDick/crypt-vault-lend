import { Card } from "@/components/ui/card";
import { Activity, Shield, TrendingUp } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-12">
      <div className="container mx-auto px-4 py-6">
        <Card className="p-6 bg-card border-primary/30 pulse-glow">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/20">
                <Activity className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Loan Pool Health</p>
                <p className="text-xs text-muted-foreground">Real-time monitoring</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 text-center md:text-left">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Security Score</p>
                  <p className="text-sm font-bold text-primary">98.5%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Pool Utilization</p>
                  <p className="text-sm font-bold text-secondary">76.3%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Health Status</p>
                  <p className="text-sm font-bold text-secondary">Excellent</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>© 2024 Encrypted Loan Pool. Protected by Fully Homomorphic Encryption (FHE)</p>
        </div>
      </div>
    </footer>
  );
};
