import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTheme from "@/hooks/use-theme";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const state = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string>(state.theme);

  useEffect(() => {
    console.log(currentTheme);
    console.log(state.theme);
    if (currentTheme.split("-")[0] !== state.theme.split("-")[0]) {
      state.setTheme(currentTheme);
    }
  }, [currentTheme]);

  const changeTheme = (value: string) => {
    setCurrentTheme(value + "-" + state.theme.split("-")[1]);
  };

  return (
    <Select onValueChange={changeTheme} value={state.theme.split("-")[0]}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Themes</SelectLabel>
          <SelectItem value="zinc">Zinc</SelectItem>
          <SelectItem value="green">Green</SelectItem>
          <SelectItem value="red">Red</SelectItem>
          <SelectItem value="rose">Rose</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="blue">Blue</SelectItem>
          <SelectItem value="yellow">Yellow</SelectItem>
          <SelectItem value="violet">Violet</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
