import { useMemo } from "react";
import useRunners from "./useRunners";
import { Contract } from "ethers";
import ERC20_ABI from "../ABI/erc20.json";

export const useERC20Contract = (withSigner = false, tokenContractAddress : string) => {
    const { readOnlyProvider, signer } = useRunners();

    return useMemo(() => {
        if (withSigner) {
            if (!signer) return null;
            return new Contract(
                tokenContractAddress,
                ERC20_ABI,
                signer
            );
        }
        return new Contract(
            tokenContractAddress,
            ERC20_ABI,
            readOnlyProvider
        );
    }, [readOnlyProvider, signer, withSigner]);
};