import { useMemo } from "react";
import useRunners from "./useRunners";
import { Contract } from "ethers";
import TRUSTFUND_ABI from "../ABI/trustfund.json";
import WILL_ABI from "../ABI/will.json";


export const useTrustFundContract = (withSigner = false) => {
    const { readOnlyProvider, signer } = useRunners();

    return useMemo(() => {
        if (withSigner) {
            if (!signer) return null;
            return new Contract(
                import.meta.env.VITE_TRUSTFUND_CONTRACT_ADDRESS,
                TRUSTFUND_ABI,
                signer
            );
        }
        return new Contract(
            import.meta.env.VITE_TRUSTFUND_CONTRACT_ADDRESS,
            TRUSTFUND_ABI,
            readOnlyProvider
        );
    }, [readOnlyProvider, signer, withSigner]);
};

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