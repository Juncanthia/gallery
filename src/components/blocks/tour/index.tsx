import { useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

export type TourStepConfig = {
  title?: ReactNode;
  description?: ReactNode;
  target?: () => HTMLElement | null;
  placement?: "top" | "bottom" | "left" | "right" | "center";
  cover?: ReactNode;
  nextButtonProps?: { children?: ReactNode; className?: string };
  prevButtonProps?: { children?: ReactNode; className?: string };
  onClose?: () => void;
};

export type TourProps = {
  open?: boolean;
  onClose?: () => void;
  current?: number;
  onChange?: (current: number) => void;
  defaultCurrent?: number;
  steps: TourStepConfig[];
  mask?: boolean;
  zIndex?: number;
  gap?: { offset?: number; radius?: number };
  arrow?: boolean;
  scrollIntoViewOptions?: ScrollIntoViewOptions;
  className?: string;
};

export function Tour({
  open = false,
  onClose,
  current: controlledCurrent,
  onChange,
  defaultCurrent = 0,
  steps,
  mask = true,
  zIndex = 1001,
  gap = { offset: 10, radius: 0 },
  scrollIntoViewOptions,
  className,
}: TourProps) {
  const isControlled = controlledCurrent !== undefined;
  const [uncontrolledCurrent, setUncontrolledCurrent] = useState(defaultCurrent);
  const current = isControlled ? controlledCurrent : uncontrolledCurrent;

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !steps[current]) {
      setTargetRect(null);
      return;
    }

    const step = steps[current];
    if (step.target) {
      const element = step.target();
      if (element) {
        element.scrollIntoView(scrollIntoViewOptions || { behavior: "smooth", block: "center" });
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);

        const offset = gap?.offset || 10;
        const placement = step.placement || "bottom";
        let top = 0;
        let left = 0;

        if (placement === "top") {
          top = window.scrollY + rect.top - 300 - offset;
          left = window.scrollX + rect.left + rect.width / 2 - 144;
        } else if (placement === "bottom") {
          top = window.scrollY + rect.bottom + offset;
          left = window.scrollX + rect.left + rect.width / 2 - 144;
        } else if (placement === "left") {
          top = window.scrollY + rect.top + rect.height / 2 - 100;
          left = window.scrollX + rect.left - 288 - offset;
        } else if (placement === "right") {
          top = window.scrollY + rect.top + rect.height / 2 - 100;
          left = window.scrollX + rect.right + offset;
        } else if (placement === "center") {
          top = window.innerHeight / 2 - 100;
          left = window.innerWidth / 2 - 144;
        }

        setCardPosition({ top: Math.max(0, top), left: Math.max(0, left) });
      }
    } else {
      setTargetRect(null);
      setCardPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 144,
      });
    }
  }, [open, current, steps, gap, scrollIntoViewOptions]);

  const handleNext = () => {
    if (current < steps.length - 1) {
      if (!isControlled) {
        setUncontrolledCurrent(current + 1);
      }
      onChange?.(current + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      if (!isControlled) {
        setUncontrolledCurrent(current - 1);
      }
      onChange?.(current - 1);
    }
  };

  const handleClose = () => {
    steps[current]?.onClose?.();
    onClose?.();
  };

  if (!open || !steps[current]) {
    return null;
  }

  const step = steps[current];

  return createPortal(
    <AnimatePresence mode="wait">
      {open && (
        <div key="tour-wrapper" data-slot="tour">
          {mask && targetRect && (
            <motion.div
              className="fixed inset-0 bg-black/40 pointer-events-none"
              style={{ zIndex: zIndex - 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              data-slot="tour-mask"
            />
          )}

          {mask && targetRect && (
            <div
              className="fixed pointer-events-none"
              style={{
                zIndex: zIndex - 1,
                boxShadow: `0 0 0 ${Math.max(targetRect.width, targetRect.height) * 2}px rgba(0, 0, 0, 0.4)`,
                left: targetRect.left,
                top: targetRect.top,
                width: targetRect.width,
                height: targetRect.height,
                borderRadius: gap?.radius ? `${gap.radius}px` : "0px",
              }}
            />
          )}

          <motion.div
            className={cn(
              "fixed bg-popover border border-border rounded-lg shadow-xl p-5 w-72",
              className
            )}
            style={{ zIndex, top: cardPosition.top, left: cardPosition.left }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            data-slot="tour-card"
          >
            {step.cover && <div className="mb-3">{step.cover}</div>}

            {step.title && (
              <div className="font-semibold text-sm text-foreground">{step.title}</div>
            )}

            {step.description && (
              <div className="text-sm text-muted-foreground mt-1">{step.description}</div>
            )}

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-1">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-all",
                      idx === current
                        ? "bg-primary w-3"
                        : "bg-muted-foreground/30"
                    )}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {current > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handlePrev}
                    className={step.prevButtonProps?.className}
                  >
                    {step.prevButtonProps?.children || "Back"}
                  </Button>
                )}
                <Button
                  size="small"
                  onClick={handleNext}
                  className={step.nextButtonProps?.className}
                >
                  {step.nextButtonProps?.children ||
                    (current === steps.length - 1 ? "Done" : "Next")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
