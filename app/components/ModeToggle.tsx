"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Wait until after component mounts to access theme
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkTheme = theme === "dark" || theme?.startsWith("dark");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex justify-center bg-card"
        >
          {/* Avoid hydration mismatch */}
          {mounted && isDarkTheme ? (
            <Moon
              className="h-[1.2rem] w-[1.2rem] transition-all"
              color="white"
            />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="bg-card">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("green")}>
          Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("darkgreen")}>
          Dark Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("yellow")}>
          Yellow
        </DropdownMenuItem>{" "}
        <DropdownMenuItem onClick={() => setTheme("darkyellow")}>
          Dark Yellow
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("violet")}>
          Voilet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("darkviolet")}>
          Dark Violet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("pink")}>
          Pink
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("darkpink")}>
          Dark Pink
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("orange")}>
          Orange
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("darkorange")}>
          Dark Orange
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
