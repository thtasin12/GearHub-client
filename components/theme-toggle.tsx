"use client"

import { Moon, Sun } from "lucide-react"

import { useTheme } from "@/providers/theme-provider"

export function ThemeToggle() {
    const {theme, toggleTheme} = useTheme()
    return <button
    onClick={toggleTheme}
    aria-label="Toggle color theme"
    className="grid size-10 place-items-center rounded-xl border border-border text-muted transition hover:bg-(--surface-muted) hover:text-foreground"
    >
        {
            theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>
        }
        
    </button>
}