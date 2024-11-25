import { useCallback, useEffect, useState } from "react";
import { useWillContract } from "../useContracts";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
// import { ErrorDecoder } from "ethers-decode-error";
// import useRunners from "../useRunners";

export const useWillStat = () => {
  const [totalTokensWilled, setTotalTokensWilled] = useState<bigint | null>(
    null
  );
  const [totalBeneficiaries, setTotalBeneficiaries] = useState<number | null>(
    null
  );
  const [totalWills, setTotalWills] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);


  const { address } = useAppKitAccount();
  const readOnlyWillRegistry = useWillContract();

  // const { readOnlyProvider } = useRunners();

  // const errorDecoder = ErrorDecoder.create();

  // const fetchBlockTimestamp = async () => {
  //     try {
  //       const latestBlock = await readOnlyProvider.getBlock("latest");
  //       return latestBlock ? latestBlock.timestamp : null;
  //     } catch (error) {
  //       console.log("error fetching block timestamp: ", error);
  //     }
  //   };

  const resetState = () => {
    setTotalTokensWilled(null);
    setTotalBeneficiaries(null);
    setTotalWills(null);
  };
  const fetchWillStat = useCallback(async () => {
    if (!readOnlyWillRegistry) {
      resetState();
      return;
    }
    if (!address) {
      toast.error("Please connect your wallet");
      resetState();
      return;
    }
    try {
      setIsLoading(true);
      const _totalTokenWilled = await readOnlyWillRegistry.getTotalTokensWilled(
        address
      );
      setTotalTokensWilled(_totalTokenWilled);

      const _totalBeneficiaries =
        await readOnlyWillRegistry.getTotalUniqueBeneficiaries(address);
      setTotalBeneficiaries(_totalBeneficiaries);

      const _totalWills = await readOnlyWillRegistry.getTotalWillsCreated(
        address
      );
      setTotalWills(_totalWills);
    } catch (error) {
      resetState();
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [readOnlyWillRegistry, address]);

  useEffect(() => {
    fetchWillStat();
  }, [fetchWillStat]);

  
  return { totalWills, totalTokensWilled, totalBeneficiaries, isLoading };
};
