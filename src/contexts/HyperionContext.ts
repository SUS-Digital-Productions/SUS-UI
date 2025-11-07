import { createContext } from "react";

export interface HyperionContextType {
  endpoint: string;
  change: (endpoint: string) => void;
}

export const HyperionContext = createContext<HyperionContextType | undefined>(
  undefined
);
