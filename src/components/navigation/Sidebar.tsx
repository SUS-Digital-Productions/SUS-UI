import { NavLink } from "react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWaxSession } from "@/hooks/use-wax-session";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import {
  Home,
  Store,
  Package,
  User,
  TrendingUp,
  Heart,
  Activity,
} from "lucide-react";

const publicNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    icon: Store,
    badge: "Hot",
  },
  {
    title: "Trending",
    href: "/marketplace?view=trending",
    icon: TrendingUp,
  },
];

const userNavItems = [
  {
    title: "My Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Watchlist",
    href: "/watchlist",
    icon: Heart,
  },
  {
    title: "Activity",
    href: "/activity",
    icon: Activity,
  },
];

export function Sidebar() {
  const { session } = useWaxSession();
  const { setOpen, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-4 py-4">
        {/* Public Navigation */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Browse
          </h2>
          <div className="space-y-1">
            {publicNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* User Navigation - Only show if connected */}
        {session && (
          <>
            <Separator />
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                My Account
              </h2>
              <div className="space-y-1">
                {userNavItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={handleLinkClick}
                    className={({ isActive }: { isActive: boolean }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </NavLink>
                ))}

                <NavLink
                  to={`/profile/${session.actor}`}
                  onClick={handleLinkClick}
                  className={({ isActive }: { isActive: boolean }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  <User className="h-4 w-4" />
                  My Profile
                </NavLink>
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
