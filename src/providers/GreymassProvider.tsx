/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";

// Define the context type
type GreymassContextType = {
  endpoint: string;
  change: (endpoint: string) => void;
};

type GreymassProviderProps = {
  children: React.ReactNode;
};

export const GreymassContext = createContext<GreymassContextType | undefined>(
  undefined
);

export const GreymassProvider = (props: GreymassProviderProps) => {
  const [endpoint, setEndpoint] = useState<string>("");

  useEffect(() => {
    if (localStorage.getItem("greymass_endpoint"))
      setEndpoint(localStorage.getItem("greymass_endpoint")!);
    else {
      const endpoint = "https://wax.greymass.com/v1";
      localStorage.setItem("greymass_endpoint", endpoint);
      setEndpoint(endpoint);
    }
  }, []);

  const change = (endpoint: string) => {
    localStorage.setItem("greymass_endpoint", endpoint);
    setEndpoint(endpoint);
  };

  return (
    <GreymassContext.Provider value={{ endpoint, change }}>
      {props.children}
    </GreymassContext.Provider>
  );
};
