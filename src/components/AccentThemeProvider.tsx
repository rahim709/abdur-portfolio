"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { siteMetadata } from "@/data/metadata"
import { THEME_OPTIONS } from "@/lib/og-theme"
import type { Theme } from "@/lib/types"

const ACCENT_THEME_STORAGE_KEY = "accent-theme"

interface AccentThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const AccentThemeContext = createContext<AccentThemeContextValue | null>(null)

function isValidTheme(value: string | null): value is Theme {
  return value !== null && (THEME_OPTIONS as string[]).includes(value)
}

function applyStoredAccentTheme(storageKey: string, validThemes: string[]) {
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored && validThemes.indexOf(stored) !== -1) {
      document.documentElement.setAttribute("data-theme", stored)
    }
  } catch {
    // localStorage may be unavailable (e.g. disabled storage, private browsing).
  }
}

const NO_FLASH_SCRIPT = `(${applyStoredAccentTheme.toString()})(${JSON.stringify(
  ACCENT_THEME_STORAGE_KEY
)}, ${JSON.stringify(THEME_OPTIONS)})`

export function AccentThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(siteMetadata.theme)

  useEffect(() => {
    const stored = localStorage.getItem(ACCENT_THEME_STORAGE_KEY)
    if (isValidTheme(stored)) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem(ACCENT_THEME_STORAGE_KEY, theme)
  }, [theme])

  return (
    <AccentThemeContext.Provider value={{ theme, setTheme }}>
      <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      {children}
    </AccentThemeContext.Provider>
  )
}

export function useAccentTheme() {
  const context = useContext(AccentThemeContext)
  if (!context) {
    throw new Error("useAccentTheme must be used within an AccentThemeProvider")
  }
  return context
}
