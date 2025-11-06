'use client';

import { http, createConfig, type Config } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { cookieStorage, createStorage } from 'wagmi';

// Define localhost chain
const localhost = {
  id: 31337,
  name: 'Localhost',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
  testnet: true,
} as const;

let cachedConfig: Config | null = null;

export function createWagmiConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }

  cachedConfig = createConfig({
    chains: [localhost, sepolia],
    connectors: [
      injected({
        target: 'metaMask',
      }),
    ],
    transports: {
      [localhost.id]: http(),
      [sepolia.id]: http(),
    },
    ssr: true,
    storage: createStorage({
      storage: typeof window !== 'undefined' ? window.localStorage : cookieStorage,
    }),
  });

  return cachedConfig;
}
