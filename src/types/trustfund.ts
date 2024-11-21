export interface Fund {
    fundName: string;
    purpose: string;
    beneficiary: string;
    targetAmount: bigint;
    targetDate: bigint;
    currentBalance: bigint;
    trustee: string;
    isActive: boolean;
    category: string;
    isWithdrawn: boolean;
  }
  
  export interface FundCreatedEvent {
    fundId: bigint;
    fundName: string;
    trustee: string;
    beneficiary: string;
    targetAmount: bigint;
    targetDate: bigint;
  }
  
  export interface FundDepositEvent {
    amount: bigint;
    depositor: string;
    fundId: bigint;
    newBalance: bigint;
    timestamp?: bigint;
    transactionHash?: string;
  }

  export interface FundWithdrawalEvent {
    log: any;
    amount: bigint;
    beneficiary: string;
    fundId: bigint;
    withdrawalTime: bigint;
    transactionHash?: string;
  }
  
  export interface FundHistory {
    type: "Deposit" | "Withdrawal";
    title: string;
    amount: string;
    timestamp: number;
    txHash: string;
  }

  export interface FundStatusChangedEvent {
    fundId: bigint;
    isActive: boolean;
  }
  
  export interface FundWithdrawnEvent {
    fundId: bigint;
    beneficiary: string;
    amount: bigint;
    withdrawalTime: bigint;
  }
  
  export type TrustFundError =
    | 'InvalidFundParameters'
    | 'InvalidFundId'
    | 'UnauthorizedAccess'
    | 'InvalidDeposit'
    | 'FundInactive'
    | 'InvalidTargetDate'
    | 'InvalidAmount'
    | 'WithdrawalNotAllowed'
    | 'FundAlreadyWithdrawn'
    | 'WithdrawalBeforeTargetDate';