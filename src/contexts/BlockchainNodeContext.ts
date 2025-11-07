import { createContext } from "react";

export type BlockchainNodeContextType = {
  endpoint: string;
  change: (endpoint: string) => void;
};

export type BlockchainNodeProviderProps = {
  children: React.ReactNode;
};

export const BlockchainNodeContext = createContext<BlockchainNodeContextType | undefined>(
  undefined
);