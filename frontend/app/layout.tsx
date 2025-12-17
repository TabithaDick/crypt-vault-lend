import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CryptVault Lend | Private DeFi Lending",
  description: "Decentralized encrypted lending powered by Fully Homomorphic Encryption (FHE)",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {/* Animated Background */}
        <div className="animated-bg" />
        <div className="grid-pattern" />
        <div className="particles">
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
        </div>
        
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
