import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import useTheme from "@/hooks/use-theme";

export default function ThemeToggle() {
  const state = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string>(state.theme);

  useEffect(() => {
    if (currentTheme.split("-")[1] !== state.theme.split("-")[1])
      state.setTheme(currentTheme);
  }, [currentTheme]);

  const handleSetTheme = () => {
    if (state.theme.split("-")[1] === "light") {
      setCurrentTheme(state.theme.split("-")[0] + "-dark");
    } else {
      setCurrentTheme(state.theme.split("-")[0] + "-light");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => handleSetTheme()}
            size="sm"
            variant="ghost"
            className="w-9 px-0 transition-all"
            aria-label="Toggle theme"
          >
            {state.theme.includes("dark") ? (
              <SunIcon className="absolute h-[1.2rem] w-[1.2rem]" />
            ) : (
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change Theme (currently {state.theme})</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
