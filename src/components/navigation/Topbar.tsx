import { DesktopNavigationBar } from "./DesktopNavigationBar";
import { loggedInMenuItems, menuItems } from "./elements/items";
import { MobileNavigationBar } from "./MobileNavigationBar";

export const Topbar = () => {
  return (
    <section className="py-3 shadow-md z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="container mx-auto">
        <DesktopNavigationBar
          loginMenuItems={loggedInMenuItems}
          navbarMenuItems={menuItems}
        ></DesktopNavigationBar>
      </div>
      <MobileNavigationBar
        navbarMenuItems={menuItems}
        loginMenuItems={loggedInMenuItems}
      ></MobileNavigationBar>
    </section>
  );
};
