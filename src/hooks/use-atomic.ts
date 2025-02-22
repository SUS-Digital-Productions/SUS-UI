import { AtomicContext } from "@/providers/AtomicProvider";
import { useContext } from "react";

export const useAtomic = () => {
  const context = useContext(AtomicContext);
  if (!context) {
    throw new Error("useAtomic must be used within a AtomicProvider");
  }
  return context;
};
