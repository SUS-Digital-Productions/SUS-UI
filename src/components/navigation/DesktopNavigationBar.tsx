import { Link, useNavigate } from "react-router";
import { MenuItem } from "./types/MenuItem";
import { useSession } from "@/hooks/use-session";
import { Banner } from "../shared/banner";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import ThemeToggle from "../shared/theme-toggle";
import { CogIcon } from "lucide-react";

type DesktopNavigationBarProps = {
  navbarMenuItems: MenuItem[];
  loginMenuItems: MenuItem[];
};

export const DesktopNavigationBar = (props: DesktopNavigationBarProps) => {
  const navigate = useNavigate();
  const wax = useSession();

  return (
    <nav className="hidden justify-between lg:flex">
      <div className="flex items-center gap-6">
        <Banner />
        <div className="flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              {props.navbarMenuItems.map((item, index) => {
                if (!item.subMenu) {
                  return (
                    <Link
                      key={"nav-bar_" + index}
                      className={cn(
                        "text-muted-foreground",
                        navigationMenuTriggerStyle,
                        buttonVariants({
                          variant: "ghost",
                        })
                      )}
                      to={item.link}
                    >
                      {item.title}
                    </Link>
                  );
                } else {
                  return (
                    <NavigationMenuItem
                      key={"nav-bar_" + index}
                      className="text-muted-foreground"
                    >
                      <NavigationMenuTrigger>
                        <span>{item.title}</span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="z-1">
                          <ul className="w-[360px] p-3 list-none">
                            {item.subMenu.map((item, idx) => (
                              <li key={idx}>
                                <Link
                                  className={cn(
                                    "flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
                                  )}
                                  to={item.link}
                                >
                                  {item.icon}
                                  <div>
                                    <div className="text-sm font-semibold">
                                      {item.title}
                                    </div>
                                    <p className="text-sm leading-snug text-muted-foreground">
                                      {item.description}
                                    </p>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                }
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle></ThemeToggle>
        {!wax.session && <Button onClick={() => wax.login()}>Login</Button>}
        {wax.session && (
          <NavigationMenu className="list-none">
            <NavigationMenuItem
              key={"nav-bar_"}
              className="text-muted-foreground"
            >
              <NavigationMenuTrigger>
                <span>{"Welcome " + wax.session?.actor.toString()}</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="z-1">
                  <ul className="w-[360px] p-3 list-none">
                    {props.loginMenuItems.map((item, idx) => (
                      <li key={idx}>
                        <Link
                          className={cn(
                            "flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
                          )}
                          to={item.link}
                        >
                          <div>
                            <div className="text-sm font-semibold">
                              {item.title}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenu>
        )}
        <Button onClick={() => navigate("/settings")}>
          <CogIcon></CogIcon>
        </Button>
      </div>
    </nav>
  );
};
