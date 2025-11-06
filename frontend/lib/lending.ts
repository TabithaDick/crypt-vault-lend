import { Address, Hex, PublicClient } from "viem";
import { getLendingPoolAddress, LENDING_POOL_ABI } from "@/contracts/lendingPool";

export type LoanStatus = "available" | "active" | "completed";

export type LoanEntry = {
  id: bigint;
  borrower: Address;
  duration: number;
  collateralType: string;
  status: LoanStatus;
  startTime: bigint;
  endTime: bigint;
  amountHandle: Hex;
  interestHandle: Hex;
  collateralHandle: Hex;
};

const STATUS_MAP: Record<number, LoanStatus> = {
  0: "available",
  1: "active",
  2: "completed",
};

export function resolveLoanStatus(value: number): LoanStatus {
  return STATUS_MAP[value] ?? "available";
}

export function getContractAddress(chainId: number | undefined): Address | undefined {
  if (!chainId) return undefined;
  return getLendingPoolAddress(chainId);
}

export async function fetchPoolStats(publicClient: PublicClient, address: Address) {
  const [totalValueLocked, totalLoansActive, averageAPY, utilizationRate] =
    (await publicClient.readContract({
      address,
      abi: LENDING_POOL_ABI,
      functionName: "getPoolStats",
    })) as [bigint, bigint, bigint, bigint];

  return {
    totalValueLocked: Number(totalValueLocked),
    totalLoansActive: Number(totalLoansActive),
    averageAPY: Number(averageAPY),
    utilizationRate: Number(utilizationRate),
  };
}

export async function fetchLoans(publicClient: PublicClient, address: Address): Promise<LoanEntry[]> {
  const totalLoans = (await publicClient.readContract({
    address,
    abi: LENDING_POOL_ABI,
    functionName: "getTotalLoans",
  })) as bigint;

  if (totalLoans === 0n) {
    return [];
  }

  const ids = Array.from({ length: Number(totalLoans) }, (_, idx) => BigInt(idx));

  const loans = await Promise.all(
    ids.map(async (id) => {
      const loan = (await publicClient.readContract({
        address,
        abi: LENDING_POOL_ABI,
        functionName: "getLoan",
        args: [id],
      })) as [
        Address,  // borrower
        Hex,      // amount handle
        Hex,      // interestRate handle
        number,   // duration
        string,   // collateralType
        Hex,      // collateralAmount handle
        number,   // status
        bigint,   // startTime
        bigint    // endTime
      ];

      return {
        id,
        borrower: loan[0],
        amountHandle: loan[1],
        interestHandle: loan[2],
        duration: loan[3],
        collateralType: loan[4],
        collateralHandle: loan[5],
        status: resolveLoanStatus(loan[6]),
        startTime: loan[7],
        endTime: loan[8],
      } satisfies LoanEntry;
    })
  );

  return loans;
}
