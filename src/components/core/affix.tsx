import * as React from "react";
import { cn } from "@/_internals/foundations/utils/cn";

export type AffixRef = {
  updatePosition: () => void;
}

export type AffixProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  offsetTop?: number;
  offsetBottom?: number;
  target?: () => Window | HTMLElement | null;
  onChange?: (affixed: boolean) => void;
  zIndex?: number;
  children?: React.ReactNode;
}

function isWindow(target: Window | HTMLElement): target is Window {
  return typeof window !== "undefined" && target === window;
}

function getTargetRect(target: Window | HTMLElement) {
  if (isWindow(target)) {
    return { top: 0, bottom: window.innerHeight, left: 0 };
  }

  return target.getBoundingClientRect();
}

export const Affix = React.forwardRef<AffixRef, AffixProps>(
  (
    {
      offsetTop = 0,
      offsetBottom,
      target,
      onChange,
      zIndex = 10,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const placeholderRef = React.useRef<HTMLDivElement>(null);
    const fixedRef = React.useRef<HTMLDivElement>(null);
    const lastAffixedRef = React.useRef(false);
    const [affixStyle, setAffixStyle] = React.useState<React.CSSProperties>();
    const [placeholderStyle, setPlaceholderStyle] = React.useState<React.CSSProperties>();

    const measure = React.useCallback(() => {
      const placeholder = placeholderRef.current;
      const fixed = fixedRef.current;
      const targetNode = target?.() ?? window;

      if (!placeholder || !fixed || !targetNode) {
        return;
      }

      const placeholderRect = placeholder.getBoundingClientRect();
      const targetRect = getTargetRect(targetNode);
      const width = placeholderRect.width;
      const height = fixed.offsetHeight || placeholderRect.height;
      let nextAffixStyle: React.CSSProperties | undefined;

      if (offsetBottom !== undefined) {
        const fixedBottom = targetRect.bottom - placeholderRect.bottom + offsetBottom;
        if (fixedBottom > 0) {
          nextAffixStyle = {
            position: "fixed",
            bottom: offsetBottom,
            left: placeholderRect.left,
            width,
            zIndex,
          };
        }
      } else if (placeholderRect.top - targetRect.top <= offsetTop) {
        nextAffixStyle = {
          position: "fixed",
          top: targetRect.top + offsetTop,
          left: placeholderRect.left,
          width,
          zIndex,
        };
      }

      const nextAffixed = !!nextAffixStyle;
      setAffixStyle(nextAffixStyle);
      setPlaceholderStyle(nextAffixed ? { width, height } : undefined);

      if (lastAffixedRef.current !== nextAffixed) {
        lastAffixedRef.current = nextAffixed;
        onChange?.(nextAffixed);
      }
    }, [offsetBottom, offsetTop, onChange, target, zIndex]);

    React.useImperativeHandle(ref, () => ({ updatePosition: measure }), [measure]);

    React.useEffect(() => {
      const targetNode = target?.() ?? window;
      const scrollTarget = isWindow(targetNode) ? window : targetNode;
      const rafMeasure = () => requestAnimationFrame(measure);

      measure();
      scrollTarget.addEventListener("scroll", rafMeasure, true);
      window.addEventListener("resize", rafMeasure);

      return () => {
        scrollTarget.removeEventListener("scroll", rafMeasure, true);
        window.removeEventListener("resize", rafMeasure);
      };
    }, [measure, target]);

    return (
      <div
        ref={placeholderRef}
        data-slot="affix"
        className={cn(className)}
        style={style}
        {...props}
      >
        {affixStyle ? <div aria-hidden="true" style={placeholderStyle} /> : null}
        <div ref={fixedRef} data-slot="affix-content" style={affixStyle}>
          {children}
        </div>
      </div>
    );
  }
);

Affix.displayName = "Affix";
