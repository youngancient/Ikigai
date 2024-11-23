import { useCallback, useEffect, useState } from "react";
import { useWillContract } from "../useContracts";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { liskSepoliaNetwork } from "../../connection";
import { ErrorDecoder } from "ethers-decode-error";
import WILL_ABI from "../../ABI/will.json";

export interface IBeneficiaryWill {
  willId: BigInt;
  willOwner: string;
  willName: string;
  tokenAddress: string;
  tokenType: number;
  amount: BigInt;
  claimed: boolean;
}

export const useBeneficiaryWills = () => {
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const readOnlyWillRegistry = useWillContract();
  const willContract = useWillContract(true);

  const [wills, setWills] = useState<IBeneficiaryWill[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchWills = useCallback(async () => {
    if (!readOnlyWillRegistry) {
      setWills(null);
      return;
    }
    if (!address) {
      toast.error("Please connect your wallet");
      setWills(null);
      return;
    }
    try {
      setIsLoading(true);
      const _getAllEligibleWills =
        await readOnlyWillRegistry.getWillsWilledToBeneficiary(address);
      console.log(_getAllEligibleWills);

      setWills(_getAllEligibleWills);
    } catch (error) {
      setWills(null);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [readOnlyWillRegistry, address]);

  const [isClaiming, setIsClaiming] = useState(false);
  const [claimCompleted, setClaimCompleted] = useState(false);

  const errorDecoder = ErrorDecoder.create([WILL_ABI]);

  const claimWill = useCallback(async (willId : number) => {

    if (!willContract) {
      setWills(null);
      return;
    }
    if (!address) {
      toast.error("Please connect your wallet");
      setWills(null);
      return;
    }
    if (Number(chainId) !== liskSepoliaNetwork.chainId) {
      toast.error("You are not connected to the right network");
      return;
    }
    try {
      setIsClaiming(true);
      const tx = await willContract.claimInheritance(
        willId,
        {
          gasLimit: 1000000,
        }
      );
      const receipt = await tx.wait();

        if (receipt.status === 1) {
          console.log(receipt);
          toast.success("Will creation successful");
          setClaimCompleted(true);
          return;
        }
      
    } catch (error) {
      const {name} = await errorDecoder.decode(error);
      console.error(name);
      toast.error("Claiming failed!");
    } finally {
      setIsClaiming(false);
    }
  }, [readOnlyWillRegistry, address]);

  useEffect(() => {
    fetchWills();
    setClaimCompleted(false);
  }, [fetchWills,claimCompleted]);

  return { wills, isLoading, claimWill, isClaiming, claimCompleted };
};
