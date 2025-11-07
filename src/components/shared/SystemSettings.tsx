import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useTheme from "@/hooks/use-theme";
import { useBlockchainNode } from "@/hooks/use-blockchain-node";
import { useAtomic } from "@/hooks/use-atomic";

const blockchainEndpoints = [
  { name: "Greymass", url: "https://wax.greymass.com/v1" },
  { name: "EOS Rio", url: "https://wax.eosrio.io/v1" },
  { name: "Aloha EOS", url: "https://api.wax.alohaeos.com/v1" },
];

const assetsEndpoints = [
  { name: "Taco Crypto", url: "https://atomic-wax.tacocrypto.io" },
  { name: "AtomicAssets Official", url: "https://wax.api.atomicassets.io" },
  { name: "EOS Nation", url: "https://wax.eosn.io/atomicassets" },
  { name: "Alcor", url: "https://wax-atomic.alcor.exchange" },
];

const marketEndpoints = [
  { name: "Alcor Exchange", url: "https://wax-atomic.alcor.exchange" },
  { name: "AtomicHub", url: "https://wax.atomichub.io" },
  { name: "Atomic Market", url: "https://market.atomicassets.io" },
];

export function SystemSettings() {
  const { theme, setTheme } = useTheme();
  const { endpoint, change } = useBlockchainNode();
  const { 
    assetsEndpoint, 
    marketEndpoint,
    changeAssets,
    changeMarket
  } = useAtomic();

  const currentThemeColor = theme.split("-")[0];

  const changeTheme = (value: string) => {
    const isDark = theme.includes('dark');
    setTheme(value + (isDark ? '-dark' : '-light'));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="System Settings">
          <Settings className="h-4 w-4" />
          <span className="sr-only">System Settings</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="text-base font-semibold">System Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          {/* Color Scheme */}
          <div className="px-2 py-3 space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Color Scheme</Label>
            <Select onValueChange={changeTheme} value={currentThemeColor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Themes</SelectLabel>
                  <SelectItem value="zinc">Zinc</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="rose">Rose</SelectItem>
                  <SelectItem value="violet">Violet</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DropdownMenuSeparator />

          {/* Blockchain RPC */}
          <div className="px-2 py-3 space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">WAX RPC Endpoint</Label>
            <Select onValueChange={change} value={endpoint}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select RPC" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Blockchain RPC</SelectLabel>
                  {blockchainEndpoints.map((ep) => (
                    <SelectItem key={ep.url} value={ep.url}>
                      {ep.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DropdownMenuSeparator />

          {/* Atomic Assets API */}
          <div className="px-2 py-3 space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Atomic Assets Endpoint</Label>
            <Select onValueChange={changeAssets} value={assetsEndpoint}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select API" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Assets API</SelectLabel>
                  {assetsEndpoints.map((ep) => (
                    <SelectItem key={ep.url} value={ep.url}>
                      {ep.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DropdownMenuSeparator />

          {/* Atomic Market API */}
          <div className="px-2 py-3 space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Atomic Market Endpoint</Label>
            <Select onValueChange={changeMarket} value={marketEndpoint}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select API" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Market API</SelectLabel>
                  {marketEndpoints.map((ep) => (
                    <SelectItem key={ep.url} value={ep.url}>
                      {ep.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
