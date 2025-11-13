import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import logo from "@/assets/logo.png";

export const Header = () => {
  const handleConnectWallet = () => {
    // Rainbow Wallet connection logic would go here
    console.log("Connecting to Rainbow Wallet...");
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Encrypted Loan Pool Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Encrypted Loan Pool</h1>
              <p className="text-xs text-muted-foreground">Lend and Borrow, Protected by FHE</p>
            </div>
          </div>
          
          <Button 
            onClick={handleConnectWallet}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-border"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Rainbow Wallet
          </Button>
        </div>
      </div>
    </header>
  );
};
