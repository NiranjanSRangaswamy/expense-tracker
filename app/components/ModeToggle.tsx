"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Moon, Sun, Monitor } from "lucide-react"; 
import { useTheme } from "next-themes"; 

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const customColorThemes = [
  "default-blue",
  "green",
  "yellow",
  "violet",
  "pink",
  "orange",
];

export function ModeToggle() {
   
  const { theme: nextThemesTheme, resolvedTheme } = useTheme();

  const [displayModePreference, setDisplayModePreference] = useState(() => {
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("display-mode-preference");
      if (storedMode && ["light", "dark", "system"].includes(storedMode)) {
        return storedMode;
      }
    }
    return "system";
  });

  const [selectedColorTheme, setSelectedColorTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const storedColor = localStorage.getItem("selected-color-theme");
      if (storedColor && customColorThemes.includes(storedColor)) {
        return storedColor;
      }
    }
    return "default-blue";
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;

    let effectiveDisplayClass = "";

    if (displayModePreference === "dark") {
      effectiveDisplayClass = "dark";
    } else if (displayModePreference === "light") {
      effectiveDisplayClass = ""; 
    } else {
      if (resolvedTheme === "dark") {
        effectiveDisplayClass = "dark";
      } else {
        effectiveDisplayClass = ""; 
      }
    }

    let effectiveColorClass = "";
    if (selectedColorTheme !== "default-blue") {
      effectiveColorClass = selectedColorTheme;
    }
    const finalThemeClasses = [effectiveDisplayClass, effectiveColorClass]
      .filter(Boolean)
      .join(" ");
    html.className = finalThemeClasses;

    localStorage.setItem("display-mode-preference", displayModePreference);
    localStorage.setItem("selected-color-theme", selectedColorTheme);

  }, [displayModePreference, selectedColorTheme, resolvedTheme, mounted]); 
  const currentTriggerIcon = useMemo(() => {
    if (!mounted) return <Sun className="h-[1.2rem] w-[1.2rem]" />; 

    if (resolvedTheme === "dark") {
      return <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />;
    } else if (resolvedTheme === "light") {
      return <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />;
    } else { 
      return <Monitor className="h-[1.2rem] w-[1.2rem] transition-all" />;
    }
  }, [resolvedTheme, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="flex justify-center bg-card">
          {currentTriggerIcon} 
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56 p-2 space-y-4 bg-card">
        <div className="space-y-1">
          <h4 className="text-sm font-medium mb-1 px-2">Display Mode</h4>
          <div className="grid grid-cols-3 gap-2"> 
            {["light", "dark", "system"].map((mode) => (
              <Button
                key={mode}
                variant="outline"
                size="sm"
                role="radio" 
                aria-checked={displayModePreference === mode}
                className={
                  displayModePreference === mode
                    ? "ring-2 ring-ring ring-offset-1" 
                    : ""
                }
                onClick={() => setDisplayModePreference(mode)} 
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="border-t border-border" />

        <div className="space-y-1">
          <h4 className="text-sm font-medium mb-1 px-2">Color Theme</h4>
          <div className="grid grid-cols-3 gap-2"> 
            {customColorThemes.map((colorName) => {
              const label =
                colorName === "default-blue"
                  ? "Blue"
                  : colorName.charAt(0).toUpperCase() + colorName.slice(1);

              const colorMap: Record<string, string> = {
                "default-blue": "bg-blue-500", 
                green: "bg-green-500",
                yellow: "bg-yellow-400",
                violet: "bg-violet-500",
                pink: "bg-pink-400",
                orange: "bg-orange-500",
              };

              return (
                <Button
                  key={colorName}
                  variant="outline"
                  size="sm" 
                  role="radio" 
                  aria-checked={selectedColorTheme === colorName} 
                  className={
                    selectedColorTheme === colorName
                      ? `ring-2 ring-ring ring-offset-1 ${colorMap[colorName]}` 
                      : `${colorMap[colorName]}` 
                  }
                  onClick={() => setSelectedColorTheme(colorName)}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
