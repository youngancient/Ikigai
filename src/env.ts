export const getContractAddress = () => {
    const address = import.meta.env.VITE_WILL_CONTRACT_ADDRESS;
    if (!address) {
        throw new Error('VITE_WILL_CONTRACT_ADDRESS is not defined in environment');
    }
    return address;
};