"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="bg-white/10 hover:bg-white/20 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
        disabled
      >
        <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </Button>
    );
  }

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

