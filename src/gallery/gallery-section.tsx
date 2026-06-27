import { type ReactNode } from "react";
import { useSectionVisible } from "./use-section-visible";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  title: string;
  description?: string;
  tag?: string;
  children: ReactNode;
};

export function GallerySection({ id, title, description, tag, children }: SectionProps) {
  const { ref, visible } = useSectionVisible();

  return (
    <section id={id} ref={ref} className="scroll-mt-24">
      {/* Section header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 size-6 rounded-md bg-foreground/5 border border-border/60 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              {title.slice(0, 2)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">{title}</h2>
              {tag && (
                <span className="rounded-full bg-muted border border-border/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {tag}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>

      {visible ? (
        <div className="space-y-3">{children}</div>
      ) : (
        <div className="h-28 rounded-xl border border-dashed border-border/50 bg-muted/20 animate-pulse" />
      )}
    </section>
  );
}

type DemoRowProps = {
  label?: string;
  children: ReactNode;
  className?: string;
};

export function DemoRow({ label, children, className }: DemoRowProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card overflow-hidden",
        className
      )}
    >
      {label && (
        <div className="border-b border-border/60 bg-muted/30 px-4 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
        </div>
      )}
      <div className="p-5 flex flex-wrap items-start gap-3">
        {children}
      </div>
    </div>
  );
}

export function DemoCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-start gap-4", className)}>
      {children}
    </div>
  );
}

type SectionGroupProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function SectionGroup({ title, description, children }: SectionGroupProps) {
  return (
    <div>
      <div className="mb-8 pb-5 border-b border-border/60">
        <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-12">{children}</div>
    </div>
  );
}
