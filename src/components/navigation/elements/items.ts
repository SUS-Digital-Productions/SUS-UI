import { MenuItem } from "../types/MenuItem";
import { SubMenuItem } from "../types/SubMenuItem";

const subMenuItems: SubMenuItem[] = [
  {
    description: "View nfts from the account",
    link: "/view/nfts",
    title: "NFTs",
  },
];

export const menuItems: MenuItem[] = [
  {
    link: "/admin",
    title: "Admin",
  },
  {
    link: "/view",
    subMenu: subMenuItems,
    title: "View",
  },
];

export const loggedInMenuItems: MenuItem[] = [
  {
    link: "/logout",
    title: "Logout",
  },
];
