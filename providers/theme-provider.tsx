"use client"
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark"

type ThemeContextValue = {theme: Theme; setTheme: (theme: Theme) => void; toggleTheme: () => void}

const ThemeContext = createContext<ThemeContextValue | null >(null)

export function ThemeProvider({children}: {children: React.ReactNode}) {
    const [theme, setThemeState] = useState<Theme>("light")

    useEffect(() => {
        const saved = localStorage.getItem("gearhub-theme")

        const next = saved === "dark" ? "dark" : "light"
        setThemeState(next)
        document.documentElement.classList.toggle("dark", next === "dark")
    }, [])

    const setTheme = (next: Theme) => {
        setThemeState(next)
        localStorage.setItem("gearhub-theme", next)
        document.documentElement.classList.toggle("dark", next === "dark")
    }

    const value = useMemo(() => ({theme, setTheme, toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark")}), [theme])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider")
    }
    return context
}