import { useContext } from "react";
import { AtomicContext } from "@/contexts/AtomicContext";

export const useAtomic = () => {
  const context = useContext(AtomicContext);
  if (context === undefined) {
    throw new Error("useAtomic must be used within an AtomicProvider");
  }
  return context;
};
