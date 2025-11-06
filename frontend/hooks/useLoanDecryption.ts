"use client";

import { useCallback, useRef, useState } from "react";
import { ethers } from "ethers";
import type { Address, Hex } from "viem";
import { FhevmInstance, HandleContractPair } from "@/fhevm/fhevmTypes";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";
import { GenericStringStorage } from "@/fhevm/GenericStringStorage";

export interface DecryptedLoanValues {
  amount?: bigint;
  interestRate?: bigint;
  collateralAmount?: bigint;
}

export interface LoanDecryptionState {
  decryptedValues: Record<string, DecryptedLoanValues>; // keyed by loanId
  isDecrypting: boolean;
  decryptLoan: (
    loanId: bigint,
    amountHandle: Hex,
    interestHandle: Hex,
    collateralHandle?: Hex
  ) => Promise<void>;
  getDecryptedLoan: (loanId: bigint) => DecryptedLoanValues | undefined;
  message: string;
}

interface UseLoanDecryptionParams {
  instance?: FhevmInstance;
  contractAddress?: Address;
  ethersSigner?: ethers.JsonRpcSigner;
  storage: GenericStringStorage;
  chainId?: number;
}

export function useLoanDecryption({
  instance,
  contractAddress,
  ethersSigner,
  storage,
  chainId,
}: UseLoanDecryptionParams): LoanDecryptionState {
  const [decryptedValues, setDecryptedValues] = useState<
    Record<string, DecryptedLoanValues>
  >({});
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [message, setMessage] = useState("");
  const isDecryptingRef = useRef(false);

  const decryptLoan = useCallback(
    async (
      loanId: bigint,
      amountHandle: Hex,
      interestHandle: Hex,
      collateralHandle?: Hex
    ) => {
      if (isDecryptingRef.current) {
        return;
      }

      if (!instance || !contractAddress || !ethersSigner) {
        setMessage("Decryption environment not ready. Connect wallet first.");
        return;
      }

      // Check if already decrypted
      const loanKey = loanId.toString();
      if (decryptedValues[loanKey]?.amount !== undefined) {
        setMessage("Loan already decrypted.");
        return;
      }

      // Skip if handle is zero (not initialized)
      if (amountHandle === ethers.ZeroHash) {
        setDecryptedValues((prev) => ({
          ...prev,
          [loanKey]: { amount: BigInt(0), interestRate: BigInt(0), collateralAmount: BigInt(0) },
        }));
        return;
      }

      isDecryptingRef.current = true;
      setIsDecrypting(true);
      setMessage("Requesting decryption signature...");

      try {
        // Load or sign the decryption signature
        const sig = await FhevmDecryptionSignature.loadOrSign(
          instance,
          [contractAddress],
          ethersSigner,
          storage
        );

        if (!sig) {
          setMessage("Unable to build FHEVM decryption signature. User may have rejected.");
          return;
        }

        setMessage("Decrypting loan values...");

        // Build handle-contract pairs for decryption
        const handlePairs: HandleContractPair[] = [
          { handle: amountHandle, contractAddress },
          { handle: interestHandle, contractAddress },
        ];

        if (collateralHandle && collateralHandle !== ethers.ZeroHash) {
          handlePairs.push({ handle: collateralHandle, contractAddress });
        }

        // Call userDecrypt
        const res = await instance.userDecrypt(
          handlePairs,
          sig.privateKey,
          sig.publicKey,
          sig.signature,
          sig.contractAddresses,
          sig.userAddress,
          sig.startTimestamp,
          sig.durationDays
        );

        // Extract decrypted values
        const decrypted: DecryptedLoanValues = {
          amount: res[amountHandle] as bigint,
          interestRate: res[interestHandle] as bigint,
        };

        if (collateralHandle && res[collateralHandle] !== undefined) {
          decrypted.collateralAmount = res[collateralHandle] as bigint;
        }

        setDecryptedValues((prev) => ({
          ...prev,
          [loanKey]: decrypted,
        }));

        setMessage("Decryption completed successfully!");
      } catch (error) {
        console.error("Decryption failed:", error);
        setMessage(`Decryption failed: ${(error as Error).message}`);
      } finally {
        isDecryptingRef.current = false;
        setIsDecrypting(false);
      }
    },
    [instance, contractAddress, ethersSigner, storage, decryptedValues]
  );

  const getDecryptedLoan = useCallback(
    (loanId: bigint): DecryptedLoanValues | undefined => {
      return decryptedValues[loanId.toString()];
    },
    [decryptedValues]
  );

  return {
    decryptedValues,
    isDecrypting,
    decryptLoan,
    getDecryptedLoan,
    message,
  };
}
