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

export const GreymassToggle = () => {
  const { endpoint, change } = useBlockchainNode();
  
  return (
    <Select onValueChange={change} value={endpoint}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a blockchain endpoint" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Endpoints</SelectLabel>
          <SelectItem value="https://wax.greymass.com/v1">Greymass</SelectItem>
          <SelectItem value="https://wax.eosrio.io/v1">EOS Rio</SelectItem>
          <SelectItem value="https://api.wax.alohaeos.com/v1">Aloha EOS</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};