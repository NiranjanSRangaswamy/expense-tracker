"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemeProvider>;


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeClassCleaner />
      {children}
    </NextThemesProvider>
  );
}

function ThemeClassCleaner() {
  const { theme } = require("next-themes").useTheme();

  React.useEffect(() => {
    if (!theme) return;

    const html = document.documentElement;
    const themeClasses = [
      "light",
      "dark",
      "green",
      "darkgreen",
      "yellow",
      "darkyellow",
      "pink",
      "darkpink",
      "orange",
      "darkorange",
      "violet",
      "darkviolet",
    ];

    html.classList.remove(...themeClasses);

    html.classList.add(theme);
  }, [theme]);

  return null;
}
