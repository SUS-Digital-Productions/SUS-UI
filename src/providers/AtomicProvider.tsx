import { AtomicContext } from "@/contexts/AtomicContext";
import { APP_SESSION_ATOMIC_NODE_KEY } from "@/util/constants";
import { useState } from "react";

export type AtomicProviderProps = {
  children: React.ReactNode;
};

export const AtomicProvider = (props: AtomicProviderProps) => {
  const [endpoint, setEndpoint] = useState<string>(
    localStorage.getItem(APP_SESSION_ATOMIC_NODE_KEY) ||
      "https://atomic-wax.tacocrypto.io"
  );

  const change = (endpoint: string) => {
    localStorage.setItem(APP_SESSION_ATOMIC_NODE_KEY, endpoint);
    setEndpoint(endpoint);
  };

  return (
    <AtomicContext.Provider value={{ endpoint, change }}>
      {props.children}
    </AtomicContext.Provider>
  );
};
