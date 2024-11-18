import { useCallback, useState } from "react";
import { useWillContract } from "../useContracts";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../../connection";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const [isLoading, setIsLoading] = useState(false);

  const willContract = useWillContract(true);
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
        const reciept = await tx.wait();
        if (reciept.status === 1) {
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
  return { registerWill, isLoading };
};
