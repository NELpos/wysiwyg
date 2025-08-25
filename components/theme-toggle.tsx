"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    console.log("[v0] Theme toggle clicked. Current theme:", theme, "-> New theme:", newTheme)
    console.log("[v0] Theme state - theme:", theme, "resolvedTheme:", resolvedTheme)
    setTheme(newTheme)

    requestAnimationFrame(() => {
      console.log("[v0] After setTheme - theme:", theme, "resolvedTheme:", resolvedTheme)
    })
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="transition-all duration-200 hover:scale-105 bg-transparent"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
