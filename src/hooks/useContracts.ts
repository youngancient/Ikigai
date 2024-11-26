import { useCallback, useMemo } from "react";
import useRunners from "./useRunners";
import { Contract } from "ethers";
import { TRUSTFUND_ABI, TRUSTFUND_CONTRACT_ADDRESS } from '../constants/contracts';
import WILL_ABI from "../ABI/will.json";
import type { TrustFundContract } from '../types/contracts';
import { getContractAddress } from '../env';


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

  export const useWillContract = (withSigner = false) => {
    const { readOnlyProvider, signer } = useRunners();
    
    return useMemo(() => {
        const contractAddress = getContractAddress();
        
        // console.log("Debug - Environment Contract Address:", contractAddress);
        // console.log("Debug - Environment Variables:", import.meta.env);

        if (!contractAddress || contractAddress === "") {
            console.error("Contract address is empty or undefined");
            return null;
        }

        const formattedAddress = contractAddress.toLowerCase();
        if (!formattedAddress.startsWith('0x') || formattedAddress.length !== 42) {
            console.error("Invalid contract address format:", contractAddress);
            return null;
        }

        try {
            if (withSigner) {
                if (!signer) {
                    console.error("Signer not available");
                    return null;
                }
                const contract = new Contract(formattedAddress, WILL_ABI, signer);
                console.log("Debug - Created Contract Instance:", contract);
                return contract;
            }
            
            if (!readOnlyProvider) {
                console.error("Provider not available");
                return null;
            }
            return new Contract(formattedAddress, WILL_ABI, readOnlyProvider);
        } catch (error) {
            console.error("Contract initialization error:", error);
            return null;
        }
    }, [readOnlyProvider, signer, withSigner]);
};