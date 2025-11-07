import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBlockchainNode } from "@/hooks/use-blockchain-node";
import { useHyperion } from "@/hooks/use-hyperion";

export const GreymassToggle = () => {
  const { endpoint: blockchainEndpoint, change: changeBlockchain } = useBlockchainNode();
  const { endpoint: hyperionEndpoint, change: changeHyperion } = useHyperion();
  
  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-2">
        <label className="text-sm font-medium">Standard EOSIO Endpoint</label>
        <Select onValueChange={changeBlockchain} value={blockchainEndpoint}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a blockchain endpoint" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Standard EOSIO Nodes</SelectLabel>
              <SelectItem value="https://wax.greymass.com">Greymass</SelectItem>
              <SelectItem value="https://wax.eosrio.io">EOS Rio</SelectItem>
              <SelectItem value="https://api.wax.alohaeos.com">Aloha EOS</SelectItem>
              <SelectItem value="https://wax.pink.gg">Pink.gg</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hyperion API Endpoint</label>
        <Select onValueChange={changeHyperion} value={hyperionEndpoint}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a Hyperion endpoint" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Hyperion Nodes</SelectLabel>
              <SelectItem value="https://wax.eosusa.io">EOS USA</SelectItem>
              <SelectItem value="https://wax.eosphere.io">EOSphere</SelectItem>
              <SelectItem value="https://api.waxsweden.org">WAX Sweden</SelectItem>
              <SelectItem value="https://wax.blokcrafters.io">Blokcrafters</SelectItem>
              <SelectItem value="https://wax.eu.eosamsterdam.net">EOS Amsterdam</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};