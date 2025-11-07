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
import { useMemo, useCallback } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  
  const currentThemeColor = useMemo(() => theme.split("-")[0], [theme]);
  const isDark = useMemo(() => theme.includes('dark'), [theme]);

  const changeTheme = useCallback((value: string) => {
    const newTheme = value + (isDark ? '-dark' : '-light');
    setTheme(newTheme);
  }, [isDark, setTheme]);

  return (
    <Select onValueChange={changeTheme} value={currentThemeColor}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a theme" />
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
  );
}