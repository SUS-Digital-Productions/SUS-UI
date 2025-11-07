import { AtomicToggle } from "@/components/shared/AtomicToggle";
import { GreymassToggle } from "@/components/shared/GreymassToggle";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const SettingsPage = () => {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground text-lg">
              Configure your application preferences and blockchain endpoints.
            </p>
          </div>

          <Separator />

          <div className="grid gap-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-color">Color Scheme</Label>
                <ModeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Configuration</CardTitle>
              <CardDescription>
                Configure your blockchain RPC and API endpoints for optimal performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="blockchain-endpoint">WAX RPC Endpoint</Label>
                <GreymassToggle />
                <p className="text-sm text-muted-foreground">
                  Select the blockchain RPC endpoint for WAX network interactions.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="atomic-endpoint">AtomicAssets API Endpoint</Label>
                <AtomicToggle />
                <p className="text-sm text-muted-foreground">
                  Choose the AtomicAssets API endpoint for NFT data retrieval.
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
};