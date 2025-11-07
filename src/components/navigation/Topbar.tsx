import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useWaxSession } from "@/hooks/use-wax-session";
import { Wallet, User, Package, LogOut } from "lucide-react";
import { Banner } from "@/components/shared/Banner";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { SystemSettings } from "@/components/shared/SystemSettings";

export function Topbar() {
  const { session, login, logout } = useWaxSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="w-full flex h-14 items-center justify-between px-2 sm:px-4 lg:px-6 xl:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <Banner />
          
          {/* Compact Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/marketplace">Marketplace</Link>
            </Button>
            {session && (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/inventory">Inventory</Link>
              </Button>
            )}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <SystemSettings />
          <ThemeToggle />
          
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${session.actor}`} />
                    <AvatarFallback>{session.actor.toString().slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{session.actor.toString()}</p>
                    <Badge variant="secondary" className="text-xs">
                      Connected
                    </Badge>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link to={`/profile/${session.actor}`}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/inventory">
                    <Package className="mr-2 h-4 w-4" />
                    My Inventory
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={login} className="gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}