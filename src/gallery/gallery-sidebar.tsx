import { useEffect, useMemo, useState } from "react";
import { NAV, type NavGroup } from "./nav";
import { cn } from "@/lib/utils";

type GallerySidebarProps = {
  search?: string;
};

export function GallerySidebar({ search = "" }: GallerySidebarProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const allIds = NAV.flatMap((g) => g.items.map((i) => i.id));
    const observers: IntersectionObserver[] = [];

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filtered: NavGroup[] = useMemo(() => {
    if (!search.trim()) return NAV;
    const q = search.toLowerCase();
    return NAV.flatMap((group) => {
      const items = group.items.filter((i) => i.label.toLowerCase().includes(q));
      return items.length ? [{ ...group, items }] : [];
    });
  }, [search]);

  return (
    <nav className="space-y-6">
      {filtered.map((group: NavGroup) => (
        <div key={group.group}>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 px-2">
            {group.group}
          </p>
          <ul className="space-y-px">
            {group.items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleClick(item.id)}
                    className={cn(
                      "group w-full text-left rounded-md px-2 py-1.5 text-xs flex items-center gap-2 transition-colors",
                      isActive
                        ? "bg-foreground text-background font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                    )}
                  >
                    <span
                      className={cn(
                        "size-1 rounded-full shrink-0 transition-colors",
                        isActive ? "bg-background/60" : "bg-transparent group-hover:bg-muted-foreground/30"
                      )}
                    />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {filtered.length === 0 && (
        <p className="px-2 text-xs text-muted-foreground">No results for "{search}"</p>
      )}
    </nav>
  );
}
