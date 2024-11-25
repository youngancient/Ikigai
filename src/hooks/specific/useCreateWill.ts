import { useCallback, useState } from "react";
import { useWillContract } from "../useContracts";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../../connection";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import { useTokenApproval } from "./useERC20";
import { useERC20Contract } from "../useERC20";
// import { ethers } from "ethers";

export const useRegisterWill = (tokenAddress: string) => {
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const [isRegisterLoading, setIsLoading] = useState(false);
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>("");

  const willContract = useWillContract(true);
  console.log(tokenAddress);
  console.log(
    "Will Contract Address1:",
    import.meta.env.VITE_WILL_CONTRACT_ADDRESS
  );

  // const { approve } = useTokenApproval(tokenAddress);
  // const [isApprovalLoading, setisLoadingBalance] = useState(false);

  const erc20Contract = useERC20Contract(true, tokenAddress);

  const navigate = useNavigate();
  // const errorDecoder = ErrorDecoder.create()
  const registerWill = useCallback(
    async (
      name: string,
      totalAmount: string,
      gracePeriod: number,
      activityThreshold: number,
      tokenAllocations: any
    ) => {
      console.log(
        "Debug - Contract Address:",
        import.meta.env.VITE_WILL_CONTRACT_ADDRESS
      );
      console.log("Debug - Will Contract Instance:", willContract);
      console.log("Debug - Token Address:", tokenAddress);
      console.log("Debug - ERC20 Contract:", erc20Contract);

      if (!erc20Contract?.target) {
        console.log("Waiting for ERC20 contract initialization...");
        toast.error("Please try again in a moment");
        return;
      }

      if (!willContract) {
        toast.error("Will Contract not found");
        return;
      }
      if (!erc20Contract) {
        toast.error("Token Contract not found");
        return;
      }
      if (!tokenAddress) {
        toast.error("Token Address not found");
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
        const _amount = BigInt(totalAmount);

        console.log("approve: ", _amount);

        const contractAddress = import.meta.env.VITE_WILL_CONTRACT_ADDRESS;
        console.log("Contract Address:", contractAddress);

        if (!contractAddress) {
          throw new Error("Contract address is not set or is empty");
        }

        // Validate the contract address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
          throw new Error("Invalid contract address format");
        }

        const allowance = await erc20Contract.allowance(
          address,
          import.meta.env.VITE_WILL_CONTRACT_ADDRESS
        );
        console.log("allowance: ", allowance);

        if (BigInt(allowance) < _amount) {
          console.log("approvin in process...");
          setIsLoadingApproval(true);

          const approveTx = await erc20Contract.approve(
            import.meta.env.VITE_WILL_CONTRACT_ADDRESS,
            _amount,
            {
              gasLimit: 1000000,
            }
          );
          const approveReciept = await approveTx.wait();
          if (approveReciept.status === 1) {
            toast.success("Token Approved");
            setIsLoadingApproval(false);
          }
        }

        // await approve(totalAmount); // Wait for the approval to complete

        setIsLoading(true);

        // console.log("Estimating gas for createWill...");
        console.log("Parameters:", {
          name,
          tokenAllocations,
          gracePeriodInSeconds: gracePeriod * 86400,
          activityThresholdInSeconds: activityThreshold * 30 * 24 * 60 * 60,
        });

        const tx = await willContract.createWill(
          name,
          tokenAllocations,
          gracePeriod * 86400,
          activityThreshold * 24 * 60 * 60, // convert to seconds
          {
            gasLimit: 1000000,
          }
        );

        setTransactionHash(tx.hash);

        const receipt = await tx.wait();
        if (receipt.status === 1) {
          console.log(receipt, "receipt");
          toast.success("Will creation successful");
          setIsDone(true);
          return;
        }
      } catch (error) {
        console.log(error);
        setTransactionHash("");
        toast.error("Will creation unsuccessful");
      } finally {
        setIsLoadingApproval(false);
        setIsLoading(false);
      }
    },
    [willContract, address, chainId, navigate, tokenAddress, erc20Contract]
  );
  const reset = () => {
    setIsDone(false);
    setTransactionHash("");
  };
  return {
    registerWill,
    isRegisterLoading,
    isDone,
    reset,
    isLoadingApproval,
    transactionHash,
  };
};
