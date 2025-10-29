import { BlockchainNodeContext } from "@/contexts/BlockchainNodeContext";
import { useContext } from "react";

export const useBlockchainNode = () => {
  const context = useContext(BlockchainNodeContext);
  if (!context) {
    throw new Error("useGreymass must be used within a GreymassProvider");
  }
  return context;
};
