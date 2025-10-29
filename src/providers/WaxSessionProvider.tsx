import { Session } from "@wharfkit/session";
import { useEffect, useState } from "react";
import { WaxSessionContext, sessionKit } from "@/contexts/WaxSessionContext";

export type SessionProviderProps = {
  children: React.ReactNode;
};

export const WaxSessionProvider = (props: SessionProviderProps) => {
  const [session, setSession] = useState<Session | undefined>(undefined);
  useEffect(() => {
    sessionKit.restore().then((restored) => setSession(restored));
  }, []);

  const login = async () => {
    const response = await sessionKit.login();
    setSession(response.session);
  };

  const logout = async () => {
    if (session) {
      await sessionKit.logout(session);
      setSession(undefined);
    }
  };

  return (
    <WaxSessionContext.Provider value={{ session, login, logout }}>
      {props.children}
    </WaxSessionContext.Provider>
  );
};
