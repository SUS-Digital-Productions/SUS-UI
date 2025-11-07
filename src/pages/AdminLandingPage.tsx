import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Database,
  Users,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router";
import { useWaxSession } from "@/hooks/use-wax-session";

export const AdminLandingPage = () => {
  const { session } = useWaxSession();

  const adminTools = [
    {
      title: "Settings",
      description: "Configure application settings and preferences",
      icon: Settings,
      link: "/admin/settings",
      badge: "Essential",
    },
    {
      title: "Collections",
      description: "Browse and manage WAX NFT collections",
      icon: Database,
      link: "/admin/collections",
      badge: "New",
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      link: "/admin/users",
      badge: "Coming Soon",
    },
    {
      title: "Analytics",
      description: "View application analytics and metrics",
      icon: TrendingUp,
      link: "/admin/analytics",
      badge: "Coming Soon",
    },
  ];

  return (
    <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-8">
      <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Welcome to the admin panel. Manage your application settings and data
              from here.
            </p>

        {session?.actor && (
          <div className="mt-4">
            <Badge variant="secondary" className="text-sm">
              Logged in as: {session.actor.toString()}
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminTools.map((tool, index) => {
          const Icon = tool.icon;
          const isComingSoon = tool.badge === "Coming Soon";

          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {tool.title}
                  </CardTitle>
                  <Badge
                    variant={
                      tool.badge === "New"
                        ? "default"
                        : tool.badge === "Essential"
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {tool.badge}
                  </Badge>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild={!isComingSoon}
                  disabled={isComingSoon}
                  className="w-full"
                  variant={isComingSoon ? "outline" : "default"}
                >
                  {isComingSoon ? (
                    <span>Coming Soon</span>
                  ) : (
                    <Link to={tool.link}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open {tool.title}
                    </Link>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Overview of your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Collections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">NFTs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Transactions</div>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
    </div>
  );
};
