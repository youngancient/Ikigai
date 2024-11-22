import { useCallback, useEffect, useState } from "react";
import { useWillContract } from "../useContracts";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";

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
  const readOnlyWillRegistry = useWillContract();
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

  useEffect(() => {
    fetchWills();
  }, [fetchWills]);

  return { wills, isLoading };
};
