"use client";

import { WalletButton } from './WalletButton';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Lock, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl group-hover:bg-primary/30 transition-all" />
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 group-hover:border-primary/40 transition-all">
                <Image 
                  src="/favicon.svg" 
                  alt="CryptVault Lend Logo" 
                  width={32} 
                  height={32}
                  className="group-hover:scale-110 transition-transform"
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text flex items-center gap-2">
                CryptVault Lend
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Private Lending with FHE
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Dashboard
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>FHE Secured</span>
            </div>
          </nav>
          
          <WalletButton />
        </div>
      </div>
    </header>
  );
};
