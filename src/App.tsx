import { useState } from "react";
import { Moon, Sun, Box, Search } from "lucide-react";
import { GallerySidebar } from "./gallery/gallery-sidebar";
import { DisplaySection } from "./gallery/sections/display-section";
import { FormsSection } from "./gallery/sections/forms-section";
import { InteractiveSection } from "./gallery/sections/interactive-section";
import { LayoutSection } from "./gallery/sections/layout-section";
import { NAV } from "./gallery/nav";

const totalComponents = NAV.flatMap((g) => g.items).length;

export function App() {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [search, setSearch] = useState("");

  function toggleDark() {
    document.documentElement.classList.toggle("dark");
    setDarkMode((v) => !v);
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-7 rounded-lg bg-foreground">
              <Box className="size-3.5 text-background" />
            </div>
            <span className="font-semibold text-sm tracking-tight">UI Gallery</span>
            <div className="hidden sm:flex items-center gap-1.5 ml-1">
              <span className="text-border">·</span>
              <span className="text-xs text-muted-foreground">{totalComponents} components</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground w-48">
              <Search className="size-3.5 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none w-full text-xs placeholder:text-muted-foreground/70"
              />
            </div>
            <button
              onClick={toggleDark}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-border/60 bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground mb-4">
              <span className="size-1.5 rounded-full bg-green-500" />
              All components animated
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
              Base Component Library
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A curated set of {totalComponents} accessible, animated UI primitives built on Radix UI and Tailwind CSS. Click, interact, and explore every component.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto flex max-w-7xl gap-10 px-6 py-10">
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 max-h-[calc(100vh-5.5rem)] overflow-y-auto pb-8">
            <GallerySidebar search={search} />
          </div>
        </aside>

        <main className="flex-1 min-w-0 space-y-20">
          <DisplaySection />
          <FormsSection />
          <InteractiveSection />
          <LayoutSection />
          <div className="border-t border-border/60 pt-8 pb-4">
            <p className="text-xs text-muted-foreground">
              {totalComponents} components · Built with Radix UI, Tailwind CSS, and Motion
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
