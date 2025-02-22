/* eslint-disable react-refresh/only-export-components */
import SessionKit, { Chains, Session } from "@wharfkit/session";
import WebRenderer from "@wharfkit/web-renderer";
import { createContext, useEffect, useState } from "react";
import { WalletPluginAnchor } from "@wharfkit/wallet-plugin-anchor";
import { WalletPluginCloudWallet } from "@wharfkit/wallet-plugin-cloudwallet";
import { WalletPluginWombat } from "@wharfkit/wallet-plugin-wombat";

const sessionKit = new SessionKit({
  appName: "SUS UI",
  chains: [Chains.WAX],
  ui: new WebRenderer(),
  walletPlugins: [
    new WalletPluginCloudWallet(),
    new WalletPluginAnchor(),
    new WalletPluginWombat(),
  ],
});

type SessionContextType = {
  session: Session | undefined;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

type SessionProviderProps = {
  children: React.ReactNode;
};

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined
);

export const SessionProvider = (props: SessionProviderProps) => {
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
    <SessionContext.Provider value={{ session, login, logout }}>
      {props.children}
    </SessionContext.Provider>
  );
};
