import { Header } from "@/components/Header";
import { PoolStats } from "@/components/PoolStats";
import { LoanCard } from "@/components/LoanCard";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockLoans = [
  {
    id: "1",
    amount: "$50,000",
    encryptedAmount: "0xA7F3...B2E9",
    interestRate: "7.5% APY",
    duration: "12 months",
    collateral: "ETH",
    status: "available" as const,
  },
  {
    id: "2",
    amount: "$25,000",
    encryptedAmount: "0x3C9D...F1A8",
    interestRate: "8.2% APY",
    duration: "6 months",
    collateral: "BTC",
    status: "available" as const,
  },
  {
    id: "3",
    amount: "$100,000",
    encryptedAmount: "0x9E2B...C4D7",
    interestRate: "6.8% APY",
    duration: "24 months",
    collateral: "Mixed",
    status: "active" as const,
  },
  {
    id: "4",
    amount: "$35,000",
    encryptedAmount: "0x5F7A...E3B1",
    interestRate: "7.9% APY",
    duration: "9 months",
    collateral: "ETH",
    status: "available" as const,
  },
  {
    id: "5",
    amount: "$75,000",
    encryptedAmount: "0x1D8C...A5F2",
    interestRate: "7.2% APY",
    duration: "18 months",
    collateral: "BTC",
    status: "active" as const,
  },
  {
    id: "6",
    amount: "$15,000",
    encryptedAmount: "0x6B4E...D9C3",
    interestRate: "9.1% APY",
    duration: "3 months",
    collateral: "USDC",
    status: "completed" as const,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 glow-text">
            Decentralized Encrypted Lending
          </h2>
          <p className="text-muted-foreground">
            Participate in secure, private loan pools powered by Fully Homomorphic Encryption
          </p>
        </div>

        <PoolStats />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="all">All Loans</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockLoans.map((loan) => (
                <LoanCard key={loan.id} {...loan} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockLoans
                .filter((loan) => loan.status === "available")
                .map((loan) => (
                  <LoanCard key={loan.id} {...loan} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockLoans
                .filter((loan) => loan.status === "active")
                .map((loan) => (
                  <LoanCard key={loan.id} {...loan} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
