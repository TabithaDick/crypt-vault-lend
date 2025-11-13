// Loan Pool Contract Configuration
export const LOAN_POOL_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export const LOAN_POOL_ABI = [
  {
    inputs: [
      { name: "loanId", type: "string" },
      { name: "amount", type: "uint256" }
    ],
    name: "lend",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ name: "loanId", type: "string" }],
    name: "getLoanDetails",
    outputs: [
      { name: "amount", type: "uint256" },
      { name: "interestRate", type: "uint256" },
      { name: "duration", type: "uint256" },
      { name: "borrower", type: "address" },
      { name: "isActive", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;
