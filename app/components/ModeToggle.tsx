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
  const { setTheme } = useTheme();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button variant="outline" size="icon" className="flex justify-center">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("green")}>
          green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("yellow")}>
          yellow
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("red")}>
          red
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("pink")}>
          pink
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("darkgreen")}>
          dgreen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("darkyellow")}>
          dayellow
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("darkred")}>
          dred
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("darkpink")}>
          dapink
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
