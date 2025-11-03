import { FhevmInstance } from "fhevmjs/node";

let instance: FhevmInstance;

export const createInstance = async (contractAddress: string, signer: any): Promise<FhevmInstance> => {
  const instance = await FhevmInstance.create({
    chainId: 11155111, // Sepolia chain ID
    publicKey: contractAddress,
  });
  return instance;
};

export const getInstance = (): FhevmInstance => {
  return instance;
};

export const setInstance = (newInstance: FhevmInstance): void => {
  instance = newInstance;
};
