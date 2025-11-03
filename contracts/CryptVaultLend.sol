// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title CryptVaultLend - Decentralized Encrypted Lending Pool
/// @notice A lending pool contract with fully homomorphic encryption for private loan management
contract CryptVaultLend is SepoliaConfig {
    // Loan status enum
    enum LoanStatus {
        Available,
        Active,
        Completed
    }

    // Loan structure
    struct Loan {
        address borrower;
        euint32 amount; // Encrypted loan amount
        euint32 interestRate; // Encrypted interest rate (basis points, e.g., 750 = 7.5%)
        uint32 duration; // Duration in months (not encrypted for simplicity)
        euint32 collateralAmount; // Encrypted collateral amount
        string collateralType; // Type of collateral (ETH, BTC, USDC, Mixed)
        LoanStatus status;
        uint256 startTime;
        uint256 endTime;
    }

    // Pool statistics (simplified - not encrypted for MVP)
    struct PoolStats {
        uint32 totalValueLocked;
        uint32 totalLoansActive;
        uint32 averageAPY;
        uint32 utilizationRate; // Basis points (e.g., 6850 = 68.5%)
    }

    // Storage
    mapping(uint256 => Loan) public loans;
    uint256 public nextLoanId;
    PoolStats private poolStats;
    
    // Events
    event LoanCreated(uint256 indexed loanId, address indexed borrower);
    event LoanActivated(uint256 indexed loanId, address indexed lender);
    event LoanRepaid(uint256 indexed loanId);
    event CollateralDeposited(uint256 indexed loanId, string collateralType);

    constructor() {
        // Initialize pool stats with default values
        poolStats.totalValueLocked = 0;
        poolStats.totalLoansActive = 0;
        poolStats.averageAPY = 750; // 7.5% default
        poolStats.utilizationRate = 6850; // 68.5% default
    }

    /// @notice Create a new loan request
    /// @param encryptedAmount The encrypted loan amount
    /// @param amountProof The proof for the encrypted amount
    /// @param encryptedInterestRate The encrypted interest rate
    /// @param interestProof The proof for the encrypted interest rate
    /// @param duration The loan duration in months
    /// @param collateralType The type of collateral
    /// @param encryptedCollateral The encrypted collateral amount
    /// @param collateralProof The proof for the encrypted collateral
    function createLoan(
        externalEuint32 encryptedAmount,
        bytes calldata amountProof,
        externalEuint32 encryptedInterestRate,
        bytes calldata interestProof,
        uint32 duration,
        string calldata collateralType,
        externalEuint32 encryptedCollateral,
        bytes calldata collateralProof
    ) external returns (uint256) {
        uint256 loanId = nextLoanId++;
        
        Loan storage loan = loans[loanId];
        loan.borrower = msg.sender;
        loan.amount = FHE.fromExternal(encryptedAmount, amountProof);
        loan.interestRate = FHE.fromExternal(encryptedInterestRate, interestProof);
        loan.duration = duration;
        loan.collateralAmount = FHE.fromExternal(encryptedCollateral, collateralProof);
        loan.collateralType = collateralType;
        loan.status = LoanStatus.Available;
        
        // Allow access to encrypted values
        FHE.allowThis(loan.amount);
        FHE.allow(loan.amount, msg.sender);
        FHE.allowThis(loan.interestRate);
        FHE.allow(loan.interestRate, msg.sender);
        FHE.allowThis(loan.collateralAmount);
        FHE.allow(loan.collateralAmount, msg.sender);
        
        emit LoanCreated(loanId, msg.sender);
        emit CollateralDeposited(loanId, collateralType);
        
        return loanId;
    }

    /// @notice Fund a loan (lender action)
    /// @param loanId The ID of the loan to fund
    function fundLoan(uint256 loanId) external {
        require(loanId < nextLoanId, "Invalid loan ID");
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Available, "Loan not available");
        
        loan.status = LoanStatus.Active;
        loan.startTime = block.timestamp;
        loan.endTime = block.timestamp + (uint256(loan.duration) * 30 days);
        
        // Update pool stats (simplified for MVP)
        poolStats.totalLoansActive = poolStats.totalLoansActive + 1;
        // Note: totalValueLocked would need decryption to update properly, keeping simple for MVP
        
        // Grant lender access to view encrypted loan details
        FHE.allow(loan.amount, msg.sender);
        FHE.allow(loan.interestRate, msg.sender);
        FHE.allow(loan.collateralAmount, msg.sender);
        
        emit LoanActivated(loanId, msg.sender);
    }

    /// @notice Repay a loan (borrower action)
    /// @param loanId The ID of the loan to repay
    function repayLoan(uint256 loanId) external {
        require(loanId < nextLoanId, "Invalid loan ID");
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(loan.borrower == msg.sender, "Not the borrower");
        
        loan.status = LoanStatus.Completed;
        
        // Update pool stats (simplified for MVP)
        poolStats.totalLoansActive = poolStats.totalLoansActive > 0 ? poolStats.totalLoansActive - 1 : 0;
        // Note: totalValueLocked would need decryption to update properly, keeping simple for MVP
        
        emit LoanRepaid(loanId);
    }

    /// @notice Get encrypted pool statistics
    /// @return totalValueLocked The total value locked
    /// @return totalLoansActive The total active loans
    /// @return averageAPY The average APY
    /// @return utilizationRate The utilization rate
    function getPoolStats() external view returns (
        uint32 totalValueLocked,
        uint32 totalLoansActive,
        uint32 averageAPY,
        uint32 utilizationRate
    ) {
        return (
            poolStats.totalValueLocked,
            poolStats.totalLoansActive,
            poolStats.averageAPY,
            poolStats.utilizationRate
        );
    }

    /// @notice Get loan details
    /// @param loanId The ID of the loan
    function getLoan(uint256 loanId) external view returns (
        address borrower,
        euint32 amount,
        euint32 interestRate,
        uint32 duration,
        string memory collateralType,
        LoanStatus status,
        uint256 startTime,
        uint256 endTime
    ) {
        require(loanId < nextLoanId, "Invalid loan ID");
        Loan memory loan = loans[loanId];
        return (
            loan.borrower,
            loan.amount,
            loan.interestRate,
            loan.duration,
            loan.collateralType,
            loan.status,
            loan.startTime,
            loan.endTime
        );
    }

    /// @notice Get total number of loans
    function getTotalLoans() external view returns (uint256) {
        return nextLoanId;
    }

    /// @notice Grant view access to loan encrypted data for a specific address
    /// @param loanId The loan ID
    /// @param viewer The address to grant access to
    function grantLoanAccess(uint256 loanId, address viewer) external {
        require(loanId < nextLoanId, "Invalid loan ID");
        Loan storage loan = loans[loanId];
        require(msg.sender == loan.borrower, "Only borrower can grant access");
        
        FHE.allow(loan.amount, viewer);
        FHE.allow(loan.interestRate, viewer);
        FHE.allow(loan.collateralAmount, viewer);
    }
}
