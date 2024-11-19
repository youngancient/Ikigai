import { useCallback, useEffect, useState } from "react";
import { useWillContract } from "../useContracts";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../../connection";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTokenApproval } from "./useERC20";
import { ethers } from "ethers";

export const useRegisterWill = (tokenAddress: string) => {
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const [isRegisterLoading, setIsLoading] = useState(false);

  const willContract = useWillContract(true);

  const { approve } = useTokenApproval(tokenAddress);

  const navigate = useNavigate();
  // const errorDecoder = ErrorDecoder.create()
  const registerWill = useCallback(
    async (
      name: string,
      gracePeriod: number,
      activityThreshold: number,
      tokenAllocations: any
    ) => {
      if (!willContract) {
        toast.error("Contract not found");
        return;
      }
      if (!address) {
        toast.error("Connect your wallet!");
        return;
      }
      if (Number(chainId) !== liskSepoliaNetwork.chainId) {
        toast.error("You are not connected to the right network");
        return;
      }
      try {
        const totalAmount = tokenAllocations[0].amounts
          .reduce(
            (acc: bigint, amount: string) => acc + BigInt(amount),
            BigInt(0)
          )
          .toString();
  
        await approve(totalAmount); // Wait for the approval to complete
  
        setIsLoading(true);
  
        const estimatedGas = await willContract.createWill.estimateGas(
          name,
          tokenAllocations,
          gracePeriod,
          activityThreshold
        );
        console.log({ estimatedGas });
        // construct transaction
        const tx = await willContract.createWill(
          name,
          tokenAllocations,
          gracePeriod,
          activityThreshold,
          {
            gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
          }
        );
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          toast.success("User Registration successful");
          return;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [willContract, address, chainId, navigate]
  );
  return { registerWill, isRegisterLoading };
};

interface IWill {
  id: BigInt;
  owner: string;
  name: string;
  lastActivity: BigInt;
  isActive: boolean;
  etherAllocation: BigInt;
  gracePeriod: BigInt;
  activityThreshold: BigInt;
  deadManSwitchTriggered: boolean;
  deadManSwitchTimestamp: BigInt;
}
export const useWill = () => {
  const [will, setWill] = useState<IWill | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { address } = useAppKitAccount();
  const readOnlyWillRegistry = useWillContract();
  const fetchWill = useCallback(async () => {
    if (!readOnlyWillRegistry) {
      setWill(null);
      return;
    }
    if (!address) {
      setWill(null);
      return;
    }
    try {
      setIsLoading(true);
      const _will = await readOnlyWillRegistry.wills(address);
      console.log(_will);
      setWill(_will);
    } catch (error) {
      setWill(null);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [readOnlyWillRegistry, address]);

  useEffect(() => {
    fetchWill();
  }, [fetchWill]);

  return { will, isLoading };
};
