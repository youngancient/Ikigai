import { useCallback, useMemo } from "react";
import useRunners from "./useRunners";
import { Contract } from "ethers";
import { TRUSTFUND_ABI, TRUSTFUND_CONTRACT_ADDRESS } from '../constants/contracts';
import FACTORY_ABI from "../ABI/factory.json";
import AIRDROP_ABI from "../ABI/airdrop.json";
import type { TrustFundContract } from '../types/contracts';


export function useTrustFundContract(withSigner = false) {
    const { readOnlyProvider, signer } = useRunners();
  
    return useMemo(() => {
      if (!readOnlyProvider) return null;
      
      const contractWithProvider = new Contract(
        TRUSTFUND_CONTRACT_ADDRESS,
        TRUSTFUND_ABI,
        readOnlyProvider
      ) as unknown as TrustFundContract;
  
      if (withSigner && signer) {
        return contractWithProvider.connect(signer) as TrustFundContract;
      }
  
      return contractWithProvider;
    }, [readOnlyProvider, signer, withSigner]);
  }
  
  export function useContractErrors() {
    return useCallback((error: any) => {
      if (error?.code === 'ACTION_REJECTED') {
        return 'Transaction was rejected by user';
      }
  
      const errorMessage = error?.message || '';

      if (errorMessage.includes('InvalidFundParameters')) {
        return 'Invalid fund parameters provided. Please check all fields.';
      }
      if (errorMessage.includes('InvalidFundId')) {
        return 'The specified fund does not exist';
      }
      if (errorMessage.includes('UnauthorizedAccess')) {
        return 'You do not have permission to perform this action';
      }
      if (errorMessage.includes('InvalidDeposit')) {
        return 'Invalid deposit amount or transaction failed';
      }
      if (errorMessage.includes('FundInactive')) {
        return 'This fund is currently inactive';
      }
      if (errorMessage.includes('InvalidTargetDate')) {
        return 'The target date must be in the future';
      }
      if (errorMessage.includes('InvalidAmount')) {
        return 'Invalid amount specified';
      }
      if (errorMessage.includes('WithdrawalNotAllowed')) {
        return 'Withdrawal is not allowed at this time';
      }
      if (errorMessage.includes('FundAlreadyWithdrawn')) {
        return 'This fund has already been withdrawn';
      }
      if (errorMessage.includes('WithdrawalBeforeTargetDate')) {
        return 'Cannot withdraw before the target date';
      }

      if (errorMessage.includes('network changed')) {
        return 'Network changed. Please ensure you are on the correct network';
      }
      if (errorMessage.includes('insufficient funds')) {
        return 'Insufficient funds for this transaction';
      }
      if (errorMessage.includes('nonce too high')) {
        return 'Transaction error: Please refresh your page and try again';
      }

      return 'An unexpected error occurred. Please try again';
    }, []);
  }

export const useFactoryContract = (withSigner = false) => {
    const { readOnlyProvider, signer } = useRunners();

    return useMemo(() => {
        if (withSigner) {
            if (!signer) return null;
            return new Contract(
                import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS,
                FACTORY_ABI,
                signer
            );
        }
        return new Contract(
            import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS,
            FACTORY_ABI,
            readOnlyProvider
        );
    }, [readOnlyProvider, signer, withSigner]);
};

export const useAidropContract = (withSigner = false, airdropContractAddress : string) => {
    const { readOnlyProvider, signer } = useRunners();

    return useMemo(() => {
        if (withSigner) {
            if (!signer) return null;
            return new Contract(
                airdropContractAddress,
                AIRDROP_ABI,
                signer
            );
        }
        return new Contract(
            airdropContractAddress,
            AIRDROP_ABI,
            readOnlyProvider
        );
    }, [readOnlyProvider, signer, withSigner]);
};