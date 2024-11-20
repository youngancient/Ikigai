import { useCallback, useState } from "react";
import { useWillContract } from "../useContracts";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../../connection";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTokenApproval } from "./useERC20";
// import { ethers } from "ethers";

export const useRegisterWill = (tokenAddress: string) => {
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const [isRegisterLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

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
          .reduce((acc: bigint, amount: bigint) => acc + amount, BigInt(0));
        
        await approve(totalAmount); // Wait for the approval to complete

        setIsLoading(true);

        // console.log("Estimating gas for createWill...");
        console.log("Parameters:", {
          name,
          tokenAllocations,
          gracePeriodInSeconds: gracePeriod * 86400,
          activityThresholdInSeconds: activityThreshold * 30 * 24 * 60 * 60,
        });

        // const estimatedGas = await willContract.createWill.estimateGas(
        //   name,
        //   tokenAllocations,
        //   gracePeriod * 86400,
        //   activityThreshold * 24 * 60 * 60 // convert to seconds
        // );

        // console.log({ estimatedGas });
        // construct transaction
        const tx = await willContract.createWill(
          name,
          tokenAllocations,
          gracePeriod * 86400,
          activityThreshold * 24 * 60 * 60, // convert to seconds
          {
            gasLimit: 1000000,
          }
        );
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          console.log(receipt);
          toast.success("Will creation successful");
          setIsDone(true);  
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
  const reset = () => {
    setIsDone(false);
  }
  return { registerWill, isRegisterLoading, isDone, reset };
};


