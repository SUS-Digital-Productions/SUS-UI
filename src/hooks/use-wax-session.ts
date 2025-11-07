import { useContext } from "react";
import {
  WaxSessionContext,
  type WaxSessionContextType,
} from "@/contexts/WaxSessionContext";

export const useWaxSession = (): WaxSessionContextType => {
  const context = useContext(WaxSessionContext);
  if (context === undefined) {
    throw new Error("useWaxSession must be used within a WaxSessionProvider");
  }
  return context;
};
