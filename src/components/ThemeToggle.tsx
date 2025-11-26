"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="bg-white/10 hover:bg-white/20 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      ) : (
        <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      )}
    </Button>
  );
}

