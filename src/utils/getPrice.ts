
export const multiplyByPrice = (amount: number): number => {
    // get priice from oracle but now we assume each token is $100
    const price = 100;
    return amount * price;
  };