"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderContextValue = {
  theme: Theme
  resolvedTheme: Exclude<Theme, "system">
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const mediaQuery = "(prefers-color-scheme: dark)"

const ThemeProviderContext = React.createContext<ThemeProviderContextValue | null>(null)

function getSystemTheme() {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia(mediaQuery).matches ? "dark" : "light"
}

function getStoredTheme(defaultTheme: Theme, storageKey: string) {
  if (typeof window === "undefined") {
    return defaultTheme
  }

  let storedTheme: string | null
  try {
    storedTheme = window.localStorage.getItem(storageKey)
  } catch {
    return defaultTheme
  }

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
  storageKey = "baseplate-theme",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  // The server and first browser render agree; read browser preferences after hydration.
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<Exclude<Theme, "system">>(
    defaultTheme === "system" ? "light" : defaultTheme
  )
  const [loadedStorageKey, setLoadedStorageKey] = React.useState<string | null>(null)

  React.useEffect(() => {
    setThemeState(getStoredTheme(defaultTheme, storageKey))
    setLoadedStorageKey(storageKey)
  }, [defaultTheme, storageKey])

  React.useEffect(() => {
    if (loadedStorageKey !== storageKey) return

    const resolved = theme === "system" ? getSystemTheme() : theme

    setResolvedTheme(resolved)
    applyTheme(resolved)
    try {
      window.localStorage.setItem(storageKey, theme)
    } catch {
      // Theme switching still works when browser storage is unavailable.
    }
  }, [loadedStorageKey, storageKey, theme])

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
