import { GreymassContext } from "@/providers/GreymassProvider";
import { useContext } from "react";

export const useGreymass = () => {
  const context = useContext(GreymassContext);
  if (!context) {
    throw new Error("useGreymass must be used within a GreymassProvider");
  }
  return context;
};
