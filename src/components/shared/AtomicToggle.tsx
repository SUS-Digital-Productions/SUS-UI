import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAtomic } from "@/hooks/use-atomic";

export const AtomicToggle = () => {
  const { assetsEndpoint, marketEndpoint, changeAssets, changeMarket } = useAtomic();

  return (
    <div className="flex flex-col gap-2">
      <div>
        <div className="text-sm mb-1">Atomic Assets Endpoint</div>
        <Select onValueChange={changeAssets} value={assetsEndpoint}>
          <SelectTrigger className="w-[320px]">
            <SelectValue placeholder="Select assets endpoint" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Assets Endpoints</SelectLabel>
              <SelectItem value="https://atomic-wax.tacocrypto.io">Taco Crypto (assets)</SelectItem>
              <SelectItem value="https://wax.api.atomicassets.io">AtomicAssets Official</SelectItem>
              <SelectItem value="https://wax.eosn.io/atomicassets">EOS Nation (assets)</SelectItem>
              <SelectItem value="https://wax-atomic.alcor.exchange">Alcor (assets)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="text-sm mb-1">Atomic Market Endpoint</div>
        <Select onValueChange={changeMarket} value={marketEndpoint}>
          <SelectTrigger className="w-[320px]">
            <SelectValue placeholder="Select market endpoint" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Market Endpoints</SelectLabel>
              <SelectItem value="https://wax-atomic.alcor.exchange">Alcor Exchange (market)</SelectItem>
              <SelectItem value="https://wax.atomichub.io">AtomicHub (market)</SelectItem>
              <SelectItem value="https://market.atomicassets.io">Atomic Market (community)</SelectItem>
              <SelectItem value="https://market.example.com">Custom Market (example)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};