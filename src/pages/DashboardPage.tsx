import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWaxSession } from "@/hooks/use-wax-session";
import { 
  Zap, 
  TrendingUp, 
  Package, 
  Compass, 
  LogIn,
  ArrowRight
} from "lucide-react";

export const DashboardPage = () => {
  const { session } = useWaxSession();

  const features = [
    {
      title: "Browse Collections",
      description: "Discover NFT collections on the WAX blockchain",
      icon: Compass,
      link: "/marketplace",
      badge: "Explore",
      color: "bg-blue-500/10",
    },
    {
      title: "View Your NFTs",
      description: "Browse and manage your WAX NFT portfolio",
      icon: Package,
      link: "/view/nfts",
      badge: "Inventory",
      color: "bg-purple-500/10",
      requiresAuth: true,
    },
    {
      title: "Market Trends",
      description: "Track trending collections and prices",
      icon: TrendingUp,
      link: "/marketplace",
      badge: "Coming Soon",
      color: "bg-green-500/10",
    },
    {
      title: "Quick Access",
      description: "Fast links to your favorite collections",
      icon: Zap,
      link: "/marketplace",
      badge: "Premium",
      color: "bg-yellow-500/10",
    },
  ];

  const stats = [
    { label: "WAX Network", value: "Supported" },
    { label: "Collections", value: "Browsable" },
    { label: "NFTs", value: "Trackable" },
  ];

  return (
    <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-8">
      <div className="space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Welcome to SUS NFT Hub
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Discover, browse, and manage your NFT collection on the WAX blockchain.
                Connect your wallet to get started.
              </p>
            </div>

            {session?.actor ? (
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  Connected as: <span className="font-mono ml-2">{session.actor.toString()}</span>
                </Badge>
              </div>
            ) : (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to view your personal NFT collection
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Explore Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isDisabled = feature.requiresAuth && !session?.actor;
                const isComingSoon = feature.badge === "Coming Soon";

                return (
                  <Card
                    key={index}
                    className={`hover:shadow-lg transition-all ${
                      feature.color
                    } ${isDisabled || isComingSoon ? "opacity-50" : ""}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Icon className="h-6 w-6 text-primary mb-2" />
                        <Badge
                          variant={
                            feature.badge === "Premium"
                              ? "default"
                              : feature.badge === "Explore"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {feature.badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        disabled={isDisabled || isComingSoon}
                        asChild={!isDisabled && !isComingSoon}
                        className="w-full"
                        variant={isDisabled || isComingSoon ? "outline" : "default"}
                      >
                        {isComingSoon ? (
                          <span>Coming Soon</span>
                        ) : isDisabled ? (
                          <span>Connect Wallet</span>
                        ) : (
                          <Link to={feature.link} className="flex items-center justify-between w-full">
                            <span>Visit</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-linear-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Start exploring NFT collections or connect your wallet to manage your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <Link to="/marketplace">
                    <Compass className="w-4 h-4 mr-2" />
                    Browse Collections
                  </Link>
                </Button>
                {!session?.actor && (
                  <Button variant="outline" asChild>
                    <Link to="/settings">
                      <LogIn className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="border-t pt-8">
            <p className="text-sm text-muted-foreground text-center">
              SUS NFT Hub is a user-focused template for exploring and managing WAX blockchain NFTs.
              {" "}
              <Link to="/about" className="text-primary hover:underline">
                Learn more about us
              </Link>
            </p>
          </div>
        </div>
    </div>
  );
};
