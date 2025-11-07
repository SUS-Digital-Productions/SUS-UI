import { createContext } from "react";

export type AtomicContextType = {
  assetsEndpoint: string;
  marketEndpoint: string;
  changeAssets: (endpoint: string) => void;
  changeMarket: (endpoint: string) => void;
};

export const AtomicContext = createContext<AtomicContextType | undefined>(undefined);
