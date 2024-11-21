import { useCallback, useState } from "react";
import { ethers } from "ethers";
import { useTrustFundContract } from "./useContracts";
import useRunners from "./useRunners";
import type { Fund } from "../types/trustfund";
import { useTransactionToast } from "./useTransactionToast";
import type { TrustFundContract } from "../types/contracts";

interface CreateFundParams {
  fundName: string;
  purpose: string;
  beneficiary: string;
  targetAmount: string;
  targetDate: number;
  category: string;
}

interface TransactionState {
  loading: boolean;
  error: string | null;
  success: boolean;
  hash?: string;
}

export function useTrustFund() {
  const { signer } = useRunners();
  const contract = useTrustFundContract(true) as TrustFundContract | null;
  const readOnlyContract = useTrustFundContract(
    false
  ) as TrustFundContract | null;
  const { showTxToast } = useTransactionToast();
  const [txState, setTxState] = useState<TransactionState>({
    loading: false,
    error: null,
    success: false,
  });

  // Create new fund
  const createFund = useCallback(
    async (params: CreateFundParams): Promise<string | null> => {
      if (!contract || !signer) {
        showTxToast('error', 'Wallet not connected');
        setTxState({ loading: false, error: 'Wallet not connected', success: false });
        return null;
      }
  
      setTxState({ loading: true, error: null, success: false });
  
      try {
        const targetAmountWei = ethers.parseEther(params.targetAmount);
  
        const tx = await contract.createFund(
          params.fundName,
          params.purpose,
          params.beneficiary,
          targetAmountWei,
          BigInt(params.targetDate),
          params.category
        );
  
        showTxToast('pending', 'Creating trust fund...', tx.hash);
        setTxState({ loading: true, error: null, success: false, hash: tx.hash });
        
        const receipt = await tx.wait();
        
        if (!receipt || !contract.interface) {
          throw new Error('Transaction failed or contract interface is missing');
        }

        const fundCreatedEvent = receipt.logs
          .map(log => {
            try {
              return contract.interface.parseLog({
                topics: [...log.topics],
                data: log.data
              });
            } catch {
              return null;
            }
          })
          .find(event => event?.name === 'FundCreated');
  
        const fundId = fundCreatedEvent?.args?.[0]?.toString() || null;
  
        showTxToast('success', 'Trust fund created successfully!', tx.hash);
        setTxState({ loading: false, error: null, success: true, hash: tx.hash });
        return fundId;
      } catch (error: any) {
        showTxToast('error', error?.message || 'Failed to create fund');
        setTxState({ 
          loading: false, 
          error: error?.message || 'Failed to create fund', 
          success: false 
        });
        return null;
      }
    },
    [contract, signer, showTxToast]
  );

  // Deposit to fund
  const depositToFund = useCallback(
    async (fundId: string, amount: string): Promise<boolean> => {
      if (!contract || !signer) {
        showTxToast("error", "Wallet not connected");
        setTxState({
          loading: false,
          error: "Wallet not connected",
          success: false,
        });
        return false;
      }

      setTxState({ loading: true, error: null, success: false });

      try {
        const valueWei = ethers.parseEther(amount);
        const tx = await contract.deposit(fundId, { value: valueWei });

        showTxToast("pending", `Depositing ${amount} ETH to fund...`, tx.hash);
        setTxState({
          loading: true,
          error: null,
          success: false,
          hash: tx.hash,
        });

        await tx.wait();

        showTxToast(
          "success",
          `Successfully deposited ${amount} ETH!`,
          tx.hash
        );
        setTxState({
          loading: false,
          error: null,
          success: true,
          hash: tx.hash,
        });
        return true;
      } catch (error: any) {
        showTxToast("error", error?.message || "Failed to deposit");
        setTxState({
          loading: false,
          error: error?.message || "Failed to deposit",
          success: false,
        });
        return false;
      }
    },
    [contract, signer, showTxToast]
  );

  // Withdraw from fund
  const withdrawFund = useCallback(
    async (fundId: string): Promise<boolean> => {
      if (!contract || !signer) {
        showTxToast("error", "Wallet not connected");
        setTxState({
          loading: false,
          error: "Wallet not connected",
          success: false,
        });
        return false;
      }

      setTxState({ loading: true, error: null, success: false });

      try {
      const address = await signer.getAddress();
      const fund = await contract.getFundDetails(fundId);
      
      if (address.toLowerCase() !== fund.beneficiary.toLowerCase()) {
        throw new Error('Only the beneficiary can withdraw funds');
      }

      if (!fund.isActive) {
        throw new Error('Fund is not active');
      }

      if (fund.isWithdrawn) {
        throw new Error('Fund has already been withdrawn');
      }

      if (Number(fund.targetDate) > Math.floor(Date.now() / 1000)) {
        throw new Error('Cannot withdraw before target date');
      }

      if (Number(fund.currentBalance) === 0) {
        throw new Error('No balance to withdraw');
      }
        const tx = await contract.withdrawFund(fundId);

        showTxToast("pending", "Withdrawing from fund...", tx.hash);
        setTxState({
          loading: true,
          error: null,
          success: false,
          hash: tx.hash,
        });

        await tx.wait();

        showTxToast("success", "Successfully withdrawn from fund!", tx.hash);
        setTxState({
          loading: false,
          error: null,
          success: true,
          hash: tx.hash,
        });
        return true;
      } catch (error: any) {
        showTxToast("error", error?.message || "Failed to withdraw");
        setTxState({
          loading: false,
          error: error?.message || "Failed to withdraw",
          success: false,
        });
        return false;
      }
    },
    [contract, signer, showTxToast]
  );

  // Get fund details
  const getFundDetails = useCallback(
    async (fundId: string): Promise<Fund | null> => {
      if (!readOnlyContract) return null;

      try {
        const fund = await readOnlyContract.getFundDetails(fundId);
        return {
          fundName: fund.fundName,
          purpose: fund.purpose,
          beneficiary: fund.beneficiary,
          targetAmount: fund.targetAmount,
          targetDate: fund.targetDate,
          currentBalance: fund.currentBalance,
          trustee: fund.trustee,
          isActive: fund.isActive,
          category: fund.category,
          isWithdrawn: fund.isWithdrawn,
        };
      } catch (error) {
        console.error("Error fetching fund details:", error);
        return null;
      }
    },
    [readOnlyContract]
  );

  // Check if user is trustee
  const isTrustee = useCallback(
    async (fundId: string, address: string): Promise<boolean> => {
      if (!readOnlyContract) return false;
      try {
        return await readOnlyContract.isTrustee(fundId, address);
      } catch {
        return false;
      }
    },
    [readOnlyContract]
  );

  // Get fund balance
  const getFundBalance = useCallback(
    async (fundId: string): Promise<string> => {
      if (!readOnlyContract) return "0";
      try {
        const balance = await readOnlyContract.getFundBalance(fundId);
        return ethers.formatEther(balance);
      } catch {
        return "0";
      }
    },
    [readOnlyContract]
  );

  // Check if fund is withdrawable
  const isWithdrawable = useCallback(
    async (fundId: string): Promise<boolean> => {
      if (!readOnlyContract) return false;
      try {
        return await readOnlyContract.isWithdrawable(fundId);
      } catch {
        return false;
      }
    },
    [readOnlyContract]
  );

  // Get time remaining
  const getTimeRemaining = useCallback(
    async (fundId: string): Promise<number> => {
      if (!readOnlyContract) return 0;
      try {
        const remaining = await readOnlyContract.getTimeRemaining(fundId);
        return Number(remaining);
      } catch {
        return 0;
      }
    },
    [readOnlyContract]
  );

  // Get user's trustee funds
  const getTrusteeFunds = useCallback(
    async (address: string): Promise<string[]> => {
      if (!readOnlyContract) return [];
      try {
        const funds = await readOnlyContract.getTrusteeFunds(address);
        return funds.map(fund => fund.toString());
      } catch (error) {
        console.error("Error getting trustee funds:", error);
        return [];
      }
    },
    [readOnlyContract]
  );

  const getTotalFunds = useCallback(async (): Promise<number> => {
    if (!readOnlyContract) return 0;
    try {
      const total = await readOnlyContract.getTotalFunds();
      return Number(total);
    } catch (error) {
      console.error("Error getting total funds:", error);
      return 0;
    }
  }, [readOnlyContract]);

  return {
    createFund,
    depositToFund,
    withdrawFund,
    getFundDetails,
    isTrustee,
    getFundBalance,
    isWithdrawable,
    getTimeRemaining,
    getTrusteeFunds,
    getTotalFunds,
    txState,
  };
}
