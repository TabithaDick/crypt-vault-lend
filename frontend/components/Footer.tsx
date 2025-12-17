"use client";

import { Shield, Lock, Zap, Github, Twitter, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/20 backdrop-blur-xl mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card/30 border border-border/50">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">End-to-End Encrypted</p>
              <p className="text-xs text-muted-foreground">Your data stays private</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card/30 border border-border/50">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Shield className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">FHE Protected</p>
              <p className="text-xs text-muted-foreground">Powered by Zama</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card/30 border border-border/50">
            <div className="p-2 rounded-lg bg-accent/10">
              <Zap className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Instant Processing</p>
              <p className="text-xs text-muted-foreground">Fast & efficient</p>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-border/30">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CryptVault Lend
            </span>
            <span className="text-muted-foreground/50">•</span>
            <a 
              href="https://www.zama.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              Powered by Zama FHE
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="p-2 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-primary/10 transition-all"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-primary/10 transition-all"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
