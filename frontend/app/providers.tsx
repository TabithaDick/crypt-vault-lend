"use client";

import type { ReactNode } from "react";
import { InMemoryStorageProvider } from "@/hooks/useInMemoryStorage";
import '@rainbow-me/rainbowkit/styles.css';
import { Toaster } from 'sonner';
import { WagmiWrapper } from '@/components/WagmiWrapper';

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <WagmiWrapper>
      <InMemoryStorageProvider>
        {children}
      </InMemoryStorageProvider>
      <Toaster position="top-right" />
    </WagmiWrapper>
  );
}
