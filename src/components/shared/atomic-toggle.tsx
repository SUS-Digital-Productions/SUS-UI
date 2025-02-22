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
  const atomic = useAtomic();
  return (
    <Select onValueChange={atomic.change} value={atomic.endpoint}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a atomic endpoint" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Endpoints</SelectLabel>
          <SelectItem value="https://atomic-wax.tacocrypto.io">Taco</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
