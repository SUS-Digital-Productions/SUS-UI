import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Users, Zap } from "lucide-react";
import { Link } from "react-router";

export const AboutPage = () => {
  return (
    <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About SUS-UI</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A powerful React-based UI template designed specifically for developers building applications on the WAX blockchain.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">WharfKit Integration</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Dynamic RPC Switching</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">AtomicAssets API</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">TypeScript Support</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Use Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">🖼️ NFT Marketplaces</p>
            <p className="text-sm">📊 Staking Dashboards</p>
            <p className="text-sm">🎮 Game Frontends</p>
            <p className="text-sm">💰 Token Tracking Tools</p>
            <p className="text-sm">🔐 Login-Protected dApps</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tech Stack</CardTitle>
          <CardDescription>Built with modern technologies for optimal performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">WharfKit</Badge>
            <Badge variant="outline">AtomicAssets</Badge>
            <Badge variant="outline">Tailwind CSS</Badge>
            <Badge variant="outline">Shadcn/ui</Badge>
            <Badge variant="outline">React Router</Badge>
            <Badge variant="outline">Vite</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Get Started</h2>
        <p className="text-muted-foreground mb-6">
          Ready to build your next WAX blockchain application?
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="https://github.com/SUS-Digital-Productions/SUS-UI" target="_blank">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/view/nfts">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Demo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};