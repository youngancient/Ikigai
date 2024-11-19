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
    fundId: bigint;
    depositor: string;
    amount: bigint;
    newBalance: bigint;
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