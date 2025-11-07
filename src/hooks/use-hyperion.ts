import { useContext } from "react";
import { HyperionContext } from "@/contexts/HyperionContext";

export const useHyperion = () => {
  const context = useContext(HyperionContext);
  if (context === undefined) {
    throw new Error("useHyperion must be used within a HyperionProvider");
  }
  return context;
};
