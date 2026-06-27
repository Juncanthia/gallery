import React, { useRef, useState, useEffect, useCallback } from "react";

export type AffixProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  offsetTop?: number;
  offsetBottom?: number;
  target?: () => HTMLElement;
  onChange?: (affixed: boolean) => void;
  children?: React.ReactNode;
}

export const Affix = React.forwardRef<HTMLDivElement, AffixProps>(
  (
    {
      offsetTop = 0,
      offsetBottom,
      target,
      onChange,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const [affixed, setAffixed] = useState(false);
    const [childHeight, setChildHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const updateContainerWidth = useCallback(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }, []);

    const handleScroll = useCallback(() => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollContainer = target?.() || window;

      let shouldAffix = false;

      if (offsetBottom !== undefined) {
        const viewportHeight =
          scrollContainer === window
            ? window.innerHeight
            : (scrollContainer as HTMLElement).clientHeight;
        shouldAffix = rect.bottom > viewportHeight;
      } else {
        shouldAffix = rect.top <= offsetTop;
      }

      if (shouldAffix !== affixed) {
        setAffixed(shouldAffix);
        onChange?.(shouldAffix);

        if (!shouldAffix && placeholderRef.current) {
          setChildHeight(0);
        } else if (shouldAffix) {
          if (containerRef.current) {
            setChildHeight(containerRef.current.offsetHeight);
          }
        }
      }

      updateContainerWidth();
    }, [affixed, offsetTop, offsetBottom, target, onChange, updateContainerWidth]);

    useEffect(() => {
      updateContainerWidth();
      const scrollContainer = target?.() || window;
      const scrollElement =
        scrollContainer === window ? window : (scrollContainer as HTMLElement);

      scrollElement.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", updateContainerWidth);

      handleScroll();

      return () => {
        scrollElement.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", updateContainerWidth);
      };
    }, [handleScroll, updateContainerWidth, target]);

    return (
      <div
        ref={containerRef}
        data-slot="affix"
        className={className}
        {...props}
      >
        {affixed && <div ref={placeholderRef} style={{ height: childHeight }} />}
        <div
          style={
            affixed
              ? {
                  position: "fixed",
                  top: offsetBottom !== undefined ? undefined : offsetTop,
                  bottom: offsetBottom,
                  zIndex: 10,
                  width: containerWidth,
                  left: (ref as any)?.current?.getBoundingClientRect?.().left ?? 0,
                }
              : {}
          }
        >
          {children}
        </div>
      </div>
    );
  }
);

Affix.displayName = "Affix";
