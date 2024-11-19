export function formatAddress(walletAddress: string): string {
  const firstPart = walletAddress.slice(0, 4);
  const lastPart = walletAddress.slice(-6);
  return `${firstPart}...${lastPart}`;
}

export function extractChainId(chainString: string): string {
  return chainString.split(":")[1];
}

export const floorToDecimals = (value: number, decimals: number): string => {
  const [integerPart, fractionalPart] = value.toString().split(".");
  if (!fractionalPart) {
    return integerPart + "." + "0".repeat(decimals);
  }
  const truncatedFractionalPart = fractionalPart.slice(0, decimals);
  return `${integerPart}.${truncatedFractionalPart.padEnd(decimals, "0")}`;
};