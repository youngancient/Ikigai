import { BaseContract, ContractTransactionResponse } from "ethers";

export interface TrustFundContract extends BaseContract {
  createFund: (
    fundName: string,
    purpose: string,
    beneficiary: string,
    targetAmount: bigint,
    targetDate: bigint,
    category: string
  ) => Promise<ContractTransactionResponse>;

  deposit: (
    fundId: string | number,
    overrides?: { value: bigint }
  ) => Promise<ContractTransactionResponse>;

  withdrawFund: (
    fundId: string | number
  ) => Promise<ContractTransactionResponse>;

  getFundDetails: (fundId: string | number) => Promise<{
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
  }>;

  isTrustee: (
    fundId: string | number,
    address: string
  ) => Promise<boolean>;

  getFundBalance: (
    fundId: string | number
  ) => Promise<bigint>;

  isWithdrawable: (
    fundId: string | number
  ) => Promise<boolean>;

  getTimeRemaining: (
    fundId: string | number
  ) => Promise<bigint>;

  getTrusteeFunds: (
    address: string
  ) => Promise<bigint[]>;
}