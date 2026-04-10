import { Button } from "@repo/shadcn/components/Button";
import React, { useCallback } from "react";
import { setTheme, useTheme } from "@/components/providers/ThemeProvider";

const THEME_CYCLE = ["light", "dark", "system"] as const;

const THEME_ICONS: Record<string, string> = {
  light: "☀️",
  dark: "🌙",
  system: "💻",
};

const ThemeToggle = React.memo(function ThemeToggle() {
  const theme = useTheme();

  const cycleTheme = useCallback(() => {
    const currentIndex = THEME_CYCLE.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEME_CYCLE.length;
    setTheme(THEME_CYCLE[nextIndex]);
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={cycleTheme}
      aria-label={`Theme: ${theme}`}
    >
      {THEME_ICONS[theme]}
    </Button>
  );
});

ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
