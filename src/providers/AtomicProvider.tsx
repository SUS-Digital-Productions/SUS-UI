/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";

// Define the context type
type AtomicContextType = {
  endpoint: string;
  change: (endpoint: string) => void;
};

type AtomicProviderProps = {
  children: React.ReactNode;
};

export const AtomicContext = createContext<AtomicContextType | undefined>(
  undefined
);

export const AtomicProvider = (props: AtomicProviderProps) => {
  const [endpoint, setEndpoint] = useState<string>("");

  useEffect(() => {
    if (localStorage.getItem("atomic_endpoint"))
      setEndpoint(localStorage.getItem("atomic_endpoint")!);
    else {
      const endpoint = "https://atomic-wax.tacocrypto.io";
      localStorage.setItem("atomic_endpoint", endpoint);
      setEndpoint(endpoint);
    }
  }, []);

  const change = (endpoint: string) => {
    localStorage.setItem("atomic_endpoint", endpoint);
    setEndpoint(endpoint);
  };

  return (
    <AtomicContext.Provider value={{ endpoint, change }}>
      {props.children}
    </AtomicContext.Provider>
  );
};
