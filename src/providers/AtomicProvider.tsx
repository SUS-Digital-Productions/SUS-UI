import { AtomicContext } from "@/contexts/AtomicContext";
import {
  APP_SESSION_ATOMIC_ASSETS_NODE_KEY,
  APP_SESSION_ATOMIC_MARKET_NODE_KEY,
} from "@/util/constants";
import { useState } from "react";

export type AtomicProviderProps = {
  children: React.ReactNode;
};

export const AtomicProvider = (props: AtomicProviderProps) => {
  const [assetsEndpoint, setAssetsEndpoint] = useState<string>(
    localStorage.getItem(APP_SESSION_ATOMIC_ASSETS_NODE_KEY) ||
      "https://atomic-wax.tacocrypto.io"
  );

  const [marketEndpoint, setMarketEndpoint] = useState<string>(
    localStorage.getItem(APP_SESSION_ATOMIC_MARKET_NODE_KEY) ||
      "https://wax-atomic.alcor.exchange"
  );

  const changeAssets = (endpoint: string) => {
    localStorage.setItem(APP_SESSION_ATOMIC_ASSETS_NODE_KEY, endpoint);
    setAssetsEndpoint(endpoint);
  };

  const changeMarket = (endpoint: string) => {
    localStorage.setItem(APP_SESSION_ATOMIC_MARKET_NODE_KEY, endpoint);
    setMarketEndpoint(endpoint);
  };

  return (
    <AtomicContext.Provider value={{ assetsEndpoint, marketEndpoint, changeAssets, changeMarket }}>
      {props.children}
    </AtomicContext.Provider>
  );
};
