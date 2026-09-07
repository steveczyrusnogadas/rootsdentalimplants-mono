"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "./theme-provider"

function ThemeToggle({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const label = isDark ? "Switch to light mode" : "Switch to dark mode"
  const Icon = isDark ? Sun : Moon

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn("text-muted-foreground hover:text-foreground", className)}
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      {...props}
    >
      <Icon aria-hidden="true" />
    </Button>
  )
}

export { ThemeToggle }
