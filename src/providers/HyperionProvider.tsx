import { useState } from "react";
import type { ReactNode } from "react";
import { HyperionContext } from "@/contexts/HyperionContext";
import { APP_SESSION_HYPERION_NODE_KEY } from "@/util/constants";

const DEFAULT_ENDPOINT = "https://wax.eosusa.io";

interface HyperionProviderProps {
  children: ReactNode;
}

export const HyperionProvider = ({ children }: HyperionProviderProps) => {
  const [endpoint, setEndpoint] = useState<string>(() => {
    const stored = localStorage.getItem(APP_SESSION_HYPERION_NODE_KEY);
    return stored || DEFAULT_ENDPOINT;
  });

  const change = (newEndpoint: string) => {
    setEndpoint(newEndpoint);
    localStorage.setItem(APP_SESSION_HYPERION_NODE_KEY, newEndpoint);
  };

  return (
    <HyperionContext.Provider value={{ endpoint, change }}>
      {children}
    </HyperionContext.Provider>
  );
};
