import { WaxSessionContext } from "@/contexts/WaxSessionContext";
import { useContext } from "react";

export const useWaxSession = () => {
  const context = useContext(WaxSessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
