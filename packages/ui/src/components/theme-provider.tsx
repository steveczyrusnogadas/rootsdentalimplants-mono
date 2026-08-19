"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderContextValue = {
  theme: Theme
  resolvedTheme: Exclude<Theme, "system">
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const storageKey = "baseplate-theme"
const mediaQuery = "(prefers-color-scheme: dark)"

const ThemeProviderContext = React.createContext<ThemeProviderContextValue | null>(null)

function getSystemTheme() {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia(mediaQuery).matches ? "dark" : "light"
}

function getStoredTheme(defaultTheme: Theme) {
  if (typeof window === "undefined") {
    return defaultTheme
  }

  const storedTheme = window.localStorage.getItem(storageKey)

  return storedTheme === "dark" || storedTheme === "light" || storedTheme === "system"
    ? storedTheme
    : defaultTheme
}

function applyTheme(theme: Exclude<Theme, "system">) {
  const root = window.document.documentElement

  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme
}

function ThemeProvider({
  children,
  defaultTheme = "light",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  const [theme, setThemeState] = React.useState<Theme>(() => getStoredTheme(defaultTheme))
  const [resolvedTheme, setResolvedTheme] = React.useState<Exclude<Theme, "system">>(() =>
    theme === "system" ? getSystemTheme() : theme
  )

  React.useEffect(() => {
    const resolved = theme === "system" ? getSystemTheme() : theme

    setResolvedTheme(resolved)
    applyTheme(resolved)
    window.localStorage.setItem(storageKey, theme)
  }, [theme])

  React.useEffect(() => {
    if (theme !== "system") {
      return
    }

    const media = window.matchMedia(mediaQuery)
    const handleChange = () => {
      const resolved = getSystemTheme()

      setResolvedTheme(resolved)
      applyTheme(resolved)
    }

    media.addEventListener("change", handleChange)

    return () => media.removeEventListener("change", handleChange)
  }, [theme])

  const value = React.useMemo<ThemeProviderContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: setThemeState,
      toggleTheme: () => setThemeState(resolvedTheme === "dark" ? "light" : "dark"),
    }),
    [resolvedTheme, theme]
  )

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

function useTheme() {
  const context = React.useContext(ThemeProviderContext)

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

export { ThemeProvider, useTheme, type Theme }
