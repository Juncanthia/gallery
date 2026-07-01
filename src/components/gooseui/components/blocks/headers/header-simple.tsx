"use client"

import { Menu, X } from "lucide-react"

import * as React from "react"
import { cn } from "@/components/gooseui/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

export function HeaderSimple() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 sm:px-6 lg:px-8 flex h-14 items-center">
        {/* Logo */}
        <a href="/" className="mr-6 flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
            G
          </div>
          <span className="font-bold">Brand</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="text"
          shape="square"
          className="md:hidden ml-auto cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden border-t overflow-hidden transition-all",
          isOpen ? "max-h-64" : "max-h-0",
        )}
      >
        <nav className="container px-4 sm:px-6 lg:px-8 flex flex-col space-y-3 py-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
