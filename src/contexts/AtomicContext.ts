import { createContext } from "react";

export type AtomicContextType = {
  endpoint: string;
  change: (endpoint: string) => void;
};



export const AtomicContext = createContext<AtomicContextType | undefined>(
  undefined
);
