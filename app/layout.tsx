import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

interface RootLayoutProps {
  children: React.ReactNode;
  class: string;
  title: string;
  meta: React.ReactNode[];
  links: React.ReactNode[];
}

export const metadata: Metadata = {
  title: "Expense Tracker",
  description:
    "Discover the ultimate expense tracking app to manage your finances effectively. Track expenses, set budgets, and analyze spending patterns.",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className="bg-background text-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
