// CryptVaultLend Contract Configuration
import { Address } from 'viem';
import abi from './CryptVaultLend.abi.json';
import { CryptVaultLendAddresses } from '@/abi/CryptVaultLendAddresses';

export const LENDING_POOL_ABI = abi;

// Helper to get contract address for current chain
// Uses auto-generated addresses from deployment
export function getLendingPoolAddress(chainId: number): Address | undefined {
  const entry = CryptVaultLendAddresses[chainId.toString() as keyof typeof CryptVaultLendAddresses];
  return entry?.address as Address | undefined;
}
