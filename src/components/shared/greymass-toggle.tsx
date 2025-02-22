import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGreymass } from "@/hooks/use-greymass";

export const GreymassToggle = () => {
  const greymass = useGreymass();
  return (
    <Select onValueChange={greymass.change} value={greymass.endpoint}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an api endpoint" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Endpoints</SelectLabel>
          <SelectItem value="https://wax.greymass.com/v1">Greymass</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
