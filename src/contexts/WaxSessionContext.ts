import SessionKit, { Chains, Session } from "@wharfkit/session";
import { WalletPluginAnchor } from "@wharfkit/wallet-plugin-anchor";
import { WalletPluginCloudWallet } from "@wharfkit/wallet-plugin-cloudwallet";
import { WalletPluginWombat } from "@wharfkit/wallet-plugin-wombat";
import WebRenderer from "@wharfkit/web-renderer";
import { createContext } from "react";

export const sessionKit = new SessionKit({
  appName: "SUS UI",
  chains: [Chains.WAX, Chains.Vaulta],
  ui: new WebRenderer(),
  walletPlugins: [
    new WalletPluginCloudWallet(),
    new WalletPluginAnchor(),
    new WalletPluginWombat(),
  ],
});

type WaxSessionContextType = {
  session: Session | undefined;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

export const WaxSessionContext = createContext<
  WaxSessionContextType | undefined
>(undefined);
