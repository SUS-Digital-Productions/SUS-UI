import {
  BlockchainNodeContext,
  type BlockchainNodeProviderProps,
} from "@/contexts/BlockchainNodeContext";
import { APP_SESSION_BLOCKCHAIN_NODE_KEY } from "@/util/constants";
import { useState } from "react";

export const BlockchainNodeProvider = (props: BlockchainNodeProviderProps) => {
  const [endpoint, setEndpoint] = useState<string>(
    localStorage.getItem(APP_SESSION_BLOCKCHAIN_NODE_KEY) ||
      "https://wax.greymass.com/v1"
  );

  const change = (endpoint: string) => {
    localStorage.setItem(APP_SESSION_BLOCKCHAIN_NODE_KEY, endpoint);
    setEndpoint(endpoint);
  };

  return (
    <BlockchainNodeContext.Provider value={{ endpoint, change }}>
      {props.children}
    </BlockchainNodeContext.Provider>
  );
};
