import { useSession } from "@/hooks/use-session";
import { Banner } from "../shared/banner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { CogIcon, MenuIcon } from "lucide-react";
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "../ui/accordion";
import { MenuItem } from "./types/MenuItem";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { SubMenuItem } from "./types/SubMenuItem";
import ThemeToggle from "../shared/theme-toggle";

type MobileNavigationBarProps = {
  navbarMenuItems: MenuItem[];
};

export const MobileNavigationBar = (props: MobileNavigationBarProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wax = useSession();
  return (
    <div className="block lg:hidden px-4">
      <div className="flex items-center justify-between">
        <Banner />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MenuIcon className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto w-full">
            <SheetHeader>
              <SheetTitle className="-ml-2">
                <Banner />
              </SheetTitle>
            </SheetHeader>
            <div className="my-8 mb-3 flex flex-col gap-4">
              {props.navbarMenuItems.map((item, index) => {
                if (!item.subMenu) {
                  return (
                    <Link
                      key={"mobile-nav-bar_" + index}
                      className={cn("font-medium")}
                      to={item.link}
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                    </Link>
                  );
                } else {
                  return (
                    <Accordion
                      key={"mobile-nav-bar_" + index}
                      type="single"
                      collapsible
                      className="w-full flex flex-col gap-4"
                    >
                      <AccordionItem value="products" className="border-b-0">
                        <AccordionTrigger className="py-0 font-medium hover:no-underline">
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="mt-2 space-y-1">
                          {item.subMenu.map(
                            (item: SubMenuItem, idx: number) => (
                              <Link
                                onClick={() => setOpen(false)}
                                key={"mobile-nav-bar_" + index + "_" + idx}
                                className={cn(
                                  "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                )}
                                to={item.link}
                              >
                                {item.icon}
                                <div>
                                  <div className="text-sm font-medium">
                                    {item.title}
                                  </div>
                                  <p className="text-sm leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            )
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                }
              })}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle></ThemeToggle>
              <Button onClick={() => wax.login()}>Login</Button>
              <Button onClick={() => navigate("/settings")}>
                <CogIcon></CogIcon>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
