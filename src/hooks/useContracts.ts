import { useMemo } from "react";
import useRunners from "./useRunners";
import { Contract } from "ethers";
import WILL_ABI from "../ABI/will.json";



export const useWillContract = (withSigner = false) => {
    const { readOnlyProvider, signer } = useRunners();

    return useMemo(() => {
        if (withSigner) {
            if (!signer) return null;
            return new Contract(
                import.meta.env.VITE_WILL_CONTRACT_ADDRESS,
                WILL_ABI,
                signer
            );
        }
        return new Contract(
            import.meta.env.VITE_WILL_CONTRACT_ADDRESS,
            WILL_ABI,
            readOnlyProvider
        );
    }, [readOnlyProvider, signer, withSigner]);
};