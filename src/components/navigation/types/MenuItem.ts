import { SubMenuItem } from "./SubMenuItem";

export type MenuItem = {
  title: string;
  link: string;
  subMenu?: SubMenuItem[];
};
