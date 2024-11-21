export const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  export const getBlockExplorerUrl = (hash: string, type: 'tx' | 'address') => {
    const baseUrl = 'https://sepolia-blockscout.lisk.com';
    return `${baseUrl}/${type === 'tx' ? 'tx' : 'address'}/${hash}`;
  };
  
  export const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (numAmount > 1) {
      return `${numAmount.toFixed(2)} ETH`;
    }
    return `${numAmount.toFixed(4)} ETH`;
  };