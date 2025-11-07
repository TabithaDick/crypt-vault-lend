"use client";

import { useCallback, useMemo, useState } from "react";
import type { Address, Hash, PublicClient } from "viem";
import { bytesToHex } from "viem";
import { useWriteContract, useAccount } from "wagmi";
import { FhevmInstance } from "@/fhevm/fhevmTypes";
import { LENDING_POOL_ABI } from "@/contracts/lendingPool";

export interface CreateLoanValues {
  amount: number;
  interestRate: number; // percentage, e.g. 7.5
  duration: number; // months
  collateralType: string;
  collateralAmount: number;
}

interface UseLoanOperationsParams {
  contractAddress?: Address;
  instance?: FhevmInstance;
  account?: Address;
  publicClient?: PublicClient;
  onSettled?: () => void;
}

interface LoanOperationsState {
  createLoan: (values: CreateLoanValues) => Promise<Hash>;
  fundLoan: (loanId: bigint) => Promise<Hash>;
  repayLoan: (loanId: bigint) => Promise<Hash>;
  isCreating: boolean;
  isFunding: boolean;
  isRepaying: boolean;
}

export function useLoanOperations({
  contractAddress,
  instance,
  account,
  publicClient,
  onSettled,
}: UseLoanOperationsParams): LoanOperationsState {
  const { writeContractAsync } = useWriteContract();
  const { isConnected, connector } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [isRepaying, setIsRepaying] = useState(false);
  
  console.log("[useLoanOperations] Hook state:", {
    contractAddress,
    hasInstance: !!instance,
    account,
    isConnected,
    connectorName: connector?.name,
  });

  const supportsFhe = useMemo(
    () => Boolean(contractAddress && instance && account),
    [contractAddress, instance, account]
  );

  const waitReceipt = useCallback(
    async (hash: Hash) => {
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      onSettled?.();
      return hash;
    },
    [publicClient, onSettled]
  );

  const normalizeProof = useCallback((proof: Uint8Array | string | any) => {
    // Debug logging
    console.log("normalizeProof input type:", typeof proof, "value:", proof);
    
    if (typeof proof === "string") {
      // Ensure it has 0x prefix
      return proof.startsWith("0x") ? proof : `0x${proof}`;
    }
    
    if (proof instanceof Uint8Array || Array.isArray(proof)) {
      // Convert to hex with 0x prefix
      const hex = bytesToHex(new Uint8Array(proof));
      console.log("normalizeProof converted to hex:", hex);
      return hex;
    }
    
    // Fallback: try to handle as object with bytes property
    if (proof && typeof proof === "object" && "bytes" in proof) {
      const hex = bytesToHex(new Uint8Array(proof.bytes));
      console.log("normalizeProof converted from object.bytes:", hex);
      return hex;
    }
    
    throw new Error(`Unsupported proof type: ${typeof proof}`);
  }, []);

  const encryptValue = useCallback(
    async (value: number) => {
      if (!supportsFhe || !contractAddress || !instance || !account) {
        throw new Error("Encryption environment not ready");
      }

      const sanitized = Math.max(0, Math.floor(value));
      const input = instance.createEncryptedInput(contractAddress, account);
      input.add32(sanitized);
      const encrypted = await input.encrypt();
      return encrypted;
    },
    [supportsFhe, instance, contractAddress, account]
  );

  const createLoan = useCallback(
    async (values: CreateLoanValues) => {
      if (!contractAddress) {
        throw new Error("Unsupported network. Please switch to Hardhat or Sepolia.");
      }
      if (!supportsFhe) {
        throw new Error("Encryption system not ready. Connect wallet and wait for FHE init.");
      }

      if (
        values.amount <= 0 ||
        values.interestRate <= 0 ||
        values.duration <= 0 ||
        values.collateralAmount < 0 ||
        !values.collateralType.trim()
      ) {
        throw new Error("Invalid loan parameters. Please review the form.");
      }

      setIsCreating(true);
      try {
        const amountEnc = await encryptValue(values.amount);
        const rateEnc = await encryptValue(Math.round(values.interestRate * 100));
        const collateralEnc = await encryptValue(values.collateralAmount);
        
        // Debug logging
        console.log("Encrypted values structure:", {
          amountEnc,
          rateEnc,
          collateralEnc,
          amountEncProofType: typeof amountEnc.inputProof,
          amountEncProofValue: amountEnc.inputProof,
          amountHandle: amountEnc.handles[0],
          amountHandleType: typeof amountEnc.handles[0],
        });

        // Ensure handles are properly formatted as hex strings with 0x prefix
        const formatHandle = (handle: any): `0x${string}` => {
          console.log("formatHandle input:", handle, "type:", typeof handle);
          if (typeof handle === "string") {
            return handle.startsWith("0x") ? handle as `0x${string}` : `0x${handle}` as `0x${string}`;
          }
          if (handle instanceof Uint8Array) {
            return bytesToHex(handle) as `0x${string}`;
          }
          // Fallback - try to convert to string
          return `0x${handle.toString()}` as `0x${string}`;
        };

        const args = [
          formatHandle(amountEnc.handles[0]),
          normalizeProof(amountEnc.inputProof),
          formatHandle(rateEnc.handles[0]),
          normalizeProof(rateEnc.inputProof),
          values.duration,
          values.collateralType,
          formatHandle(collateralEnc.handles[0]),
          normalizeProof(collateralEnc.inputProof),
        ];
        
        console.log("[createLoan] Calling writeContractAsync with:", {
          address: contractAddress,
          functionName: "createLoan",
          args,
          isConnected,
          connectorName: connector?.name,
        });

        if (!isConnected) {
          throw new Error("Wallet not connected. Please connect your wallet first.");
        }

        let hash: Hash;
        try {
          hash = await writeContractAsync({
            address: contractAddress,
            abi: LENDING_POOL_ABI,
            functionName: "createLoan",
            args,
          });
        } catch (writeError) {
          console.error("[createLoan] writeContractAsync error:", writeError);
          throw writeError;
        }

        console.log("[createLoan] Transaction hash received:", hash);
        return await waitReceipt(hash);
      } finally {
        setIsCreating(false);
      }
    },
    [contractAddress, supportsFhe, encryptValue, normalizeProof, writeContractAsync, waitReceipt, isConnected, connector]
  );

  const fundLoan = useCallback(
    async (loanId: bigint) => {
      if (!contractAddress) {
        throw new Error("Unsupported network. Please switch to Hardhat or Sepolia.");
      }
      setIsFunding(true);
      try {
        const hash = await writeContractAsync({
          address: contractAddress,
          abi: LENDING_POOL_ABI,
          functionName: "fundLoan",
          args: [loanId],
        });
        return await waitReceipt(hash);
      } finally {
        setIsFunding(false);
      }
    },
    [contractAddress, writeContractAsync, waitReceipt]
  );

  const repayLoan = useCallback(
    async (loanId: bigint) => {
      if (!contractAddress) {
        throw new Error("Unsupported network. Please switch to Hardhat or Sepolia.");
      }
      setIsRepaying(true);
      try {
        const hash = await writeContractAsync({
          address: contractAddress,
          abi: LENDING_POOL_ABI,
          functionName: "repayLoan",
          args: [loanId],
        });
        return await waitReceipt(hash);
      } finally {
        setIsRepaying(false);
      }
    },
    [contractAddress, writeContractAsync, waitReceipt]
  );

  return {
    createLoan,
    fundLoan,
    repayLoan,
    isCreating,
    isFunding,
    isRepaying,
  };
}
