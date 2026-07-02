"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { type LucideIcon, XIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/core/button";
import { cn } from "@/lib/utils";

const BANNER_ANIMATION_DURATION = 400;
const DEFAULT_BANNER_PRIORITY = 0;

type BannerVariant = "default" | "info" | "success" | "warning" | "destructive";
type BannerSide = "top" | "bottom";
type BannerStrategy = "fixed" | "static" | "sticky" | "absolute";

const bannerVariantClasses: Record<BannerVariant, string> = {
  default: "border-border bg-card text-card-foreground",
  info: "border-blue-500/20 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-50",
  success:
    "border-green-500/20 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50",
  warning:
    "border-yellow-500/20 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-50",
  destructive:
    "border-red-500/20 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-50",
};

type QueuedBannerData = {
  id: string;
  content: ReactNode;
  variant: BannerVariant;
  priority: number;
  duration?: number;
  dismissible: boolean;
  onDismiss?: () => void;
};

type BannerStoreState = {
  banners: QueuedBannerData[];
  removing: Set<string>;
  heights: Map<string, number>;
};

type BannerStore = {
  subscribe: (callback: () => void) => () => void;
  getState: () => BannerStoreState;
  add: (banner: Omit<QueuedBannerData, "id">) => string;
  remove: (id: string) => void;
  clear: () => void;
  setRemoving: (id: string, removing: boolean) => void;
  setHeight: (id: string, height: number) => void;
  deleteHeight: (id: string) => void;
};

type BannerContextProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  dismissible: boolean;
  variant: BannerVariant;
};

const BannerContext = createContext<BannerContextProps>({
  show: true,
  setShow: () => {},
  dismissible: true,
  variant: "default",
});

const BannerStoreContext = createContext<BannerStore | null>(null);

function useBannerStoreSnapshot<T>(
  store: BannerStore,
  selector: (state: BannerStoreState) => T
) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState())
  );
}

export type BannersProps = {
  children?: ReactNode;
  maxVisible?: number;
  side?: BannerSide;
  strategy?: BannerStrategy;
  container?: Element | DocumentFragment | null;
};

export const Banners = ({
  children,
  container: containerProp,
  maxVisible = 1,
  side = "top",
  strategy = "fixed",
}: BannersProps) => {
  const listenersRef = useRef(new Set<() => void>());
  const timeoutsRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const stateRef = useRef<BannerStoreState>({
    banners: [],
    removing: new Set(),
    heights: new Map(),
  });

  const store = useMemo<BannerStore>(() => {
    const notify = () => {
      for (const listener of listenersRef.current) {
        listener();
      }
    };

    return {
      subscribe: (callback) => {
        listenersRef.current.add(callback);
        return () => listenersRef.current.delete(callback);
      },
      getState: () => stateRef.current,
      add: (banner) => {
        const id = crypto.randomUUID();
        const nextBanner = { ...banner, id };
        const banners = [...stateRef.current.banners];
        const insertIndex = banners.findIndex((item) => item.priority < banner.priority);

        if (insertIndex === -1) {
          banners.push(nextBanner);
        } else {
          banners.splice(insertIndex, 0, nextBanner);
        }

        stateRef.current.banners = banners;
        notify();

        if (banner.duration && banner.duration > 0) {
          const timeoutId = setTimeout(() => {
            store.setRemoving(id, true);
            timeoutsRef.current.delete(id);
          }, banner.duration);
          timeoutsRef.current.set(id, timeoutId);
        }

        return id;
      },
      remove: (id) => {
        const banner = stateRef.current.banners.find((item) => item.id === id);
        if (!banner) {
          return;
        }

        const timeoutId = timeoutsRef.current.get(id);
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutsRef.current.delete(id);
        }

        const removing = new Set(stateRef.current.removing);
        removing.delete(id);
        stateRef.current.removing = removing;
        stateRef.current.heights.delete(id);
        stateRef.current.banners = stateRef.current.banners.filter((item) => item.id !== id);
        banner.onDismiss?.();
        notify();
      },
      clear: () => {
        for (const timeoutId of timeoutsRef.current.values()) {
          clearTimeout(timeoutId);
        }
        timeoutsRef.current.clear();
        stateRef.current = {
          banners: [],
          removing: new Set(),
          heights: new Map(),
        };
        notify();
      },
      setRemoving: (id, removingValue) => {
        const removing = new Set(stateRef.current.removing);
        if (removingValue) {
          removing.add(id);
        } else {
          removing.delete(id);
        }
        stateRef.current.removing = removing;
        notify();
      },
      setHeight: (id, height) => {
        if (stateRef.current.heights.get(id) === height) {
          return;
        }
        const heights = new Map(stateRef.current.heights);
        heights.set(id, height);
        stateRef.current.heights = heights;
        notify();
      },
      deleteHeight: (id) => {
        if (!stateRef.current.heights.has(id)) {
          return;
        }
        const heights = new Map(stateRef.current.heights);
        heights.delete(id);
        stateRef.current.heights = heights;
        notify();
      },
    };
  }, []);

  const banners = useBannerStoreSnapshot(store, (state) => state.banners);
  const heights = useBannerStoreSnapshot(store, (state) => state.heights);
  const visibleBanners = banners.slice(0, maxVisible);
  const totalHeight = visibleBanners.reduce(
    (total, banner) => total + (heights.get(banner.id) ?? 0),
    0
  );
  const withPortal = strategy === "fixed" || strategy === "absolute";
  const container =
    withPortal ? (containerProp ?? globalThis.document?.body ?? null) : null;

  const bannerContainer =
    visibleBanners.length > 0 ? (
      <div
        className={cn(
          "pointer-events-none right-0 left-0 isolate z-50",
          strategy === "fixed" && "fixed",
          strategy === "static" && "relative",
          strategy === "sticky" && "sticky",
          strategy === "absolute" && "absolute",
          side === "top" ? "top-0" : "bottom-0"
        )}
        data-side={side}
        data-slot="banner-container"
        data-strategy={strategy}
        style={{
          height: totalHeight > 0 ? totalHeight : "auto",
          transition: `height ${BANNER_ANIMATION_DURATION}ms cubic-bezier(0.32, 0.72, 0, 1)`,
        }}
      >
        {visibleBanners.map((banner, index) => (
          <QueuedBanner key={banner.id} banner={banner} index={index} side={side} store={store} />
        ))}
      </div>
    ) : null;

  return (
    <BannerStoreContext.Provider value={store}>
      {strategy === "static" || strategy === "sticky" ? (
        <>
          {side === "top" ? bannerContainer : null}
          {children}
          {side === "bottom" ? bannerContainer : null}
        </>
      ) : (
        <>
          {children}
          {container && bannerContainer ? createPortal(bannerContainer, container) : null}
        </>
      )}
    </BannerStoreContext.Provider>
  );
};

type QueuedBannerProps = {
  banner: QueuedBannerData;
  index: number;
  side: BannerSide;
  store: BannerStore;
};

function QueuedBanner({ banner, index, side, store }: QueuedBannerProps) {
  const removing = useBannerStoreSnapshot(store, (state) =>
    state.removing.has(banner.id)
  );
  const banners = useBannerStoreSnapshot(store, (state) => state.banners);
  const heights = useBannerStoreSnapshot(store, (state) => state.heights);
  const bannerRef = useRef<HTMLDivElement>(null);
  const offsetBeforeRemoveRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const offset = useMemo(() => {
    let total = 0;
    for (const item of banners) {
      if (item.id === banner.id) {
        break;
      }
      total += heights.get(item.id) ?? 0;
    }
    return total;
  }, [banner.id, banners, heights]);

  if (!removing) {
    offsetBeforeRemoveRef.current = offset;
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!bannerRef.current || removing) {
      return;
    }
    store.setHeight(banner.id, bannerRef.current.getBoundingClientRect().height);
  }, [banner.id, removing, store]);

  useEffect(() => {
    if (!removing) {
      return;
    }
    store.deleteHeight(banner.id);
    const timeoutId = setTimeout(
      () => store.remove(banner.id),
      BANNER_ANIMATION_DURATION
    );
    return () => clearTimeout(timeoutId);
  }, [banner.id, removing, store]);

  const isTop = side === "top";
  const currentOffset = removing ? offsetBeforeRemoveRef.current : offset;
  const transform = !mounted
    ? isTop
      ? "translateY(-100%)"
      : "translateY(100%)"
    : removing
      ? isTop
        ? `translateY(calc(${currentOffset}px - 100%))`
        : `translateY(calc(-${currentOffset}px + 100%))`
      : isTop
        ? `translateY(${currentOffset}px)`
        : `translateY(-${currentOffset}px)`;

  return (
    <BannerContext.Provider
      value={{
        show: !removing,
        setShow: (show) => {
          if (!show) {
            store.setRemoving(banner.id, true);
          }
        },
        dismissible: banner.dismissible,
        variant: banner.variant,
      }}
    >
      <div
        aria-live="polite"
        className={cn(
          "pointer-events-auto absolute right-0 left-0 flex w-full items-center justify-between gap-3 border-b px-4 py-3 text-sm motion-reduce:transition-none",
          bannerVariantClasses[banner.variant]
        )}
        data-index={index}
        data-side={side}
        data-slot="queued-banner"
        data-state={removing ? "closed" : "open"}
        ref={bannerRef}
        role="status"
        style={{
          [isTop ? "top" : "bottom"]: 0,
          opacity: mounted && !removing ? 1 : 0,
          position: "absolute",
          transform,
          transition: `transform ${BANNER_ANIMATION_DURATION}ms cubic-bezier(0.32, 0.72, 0, 1), opacity ${removing ? BANNER_ANIMATION_DURATION / 2 : BANNER_ANIMATION_DURATION}ms ease`,
          zIndex: removing ? 0 : 50 - index,
        }}
      >
        {banner.content}
      </div>
    </BannerContext.Provider>
  );
}

export function useBanners() {
  const store = useContext(BannerStoreContext);
  if (!store) {
    throw new Error("useBanners must be used within Banners.");
  }
  const banners = useBannerStoreSnapshot(store, (state) => state.banners);

  return useMemo(
    () => ({
      add: store.add,
      remove: store.remove,
      clear: store.clear,
      banners,
    }),
    [banners, store]
  );
}

export function useBanner() {
  const context = useContext(BannerContext);
  return context;
}

export type BannerProps = HTMLAttributes<HTMLDivElement> & {
  visible?: boolean;
  defaultVisible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  onDismiss?: () => void;
  inset?: boolean;
  variant?: BannerVariant;
  priority?: number;
  duration?: number;
  dismissible?: boolean;
};

export const Banner = ({
  children,
  visible,
  defaultVisible,
  open: openProp,
  defaultOpen,
  onClose,
  onOpenChange,
  onDismiss,
  className,
  inset = false,
  variant = "default",
  priority = DEFAULT_BANNER_PRIORITY,
  duration,
  dismissible = true,
  ...props
}: BannerProps) => {
  const store = useContext(BannerStoreContext);
  const isQueued = store !== null;
  const [show, setShow] = useControllableState({
    defaultProp: defaultOpen ?? defaultVisible ?? true,
    prop: openProp ?? visible,
    onChange: (nextOpen) => {
      onOpenChange?.(nextOpen);
      if (!nextOpen) {
        onClose?.();
        onDismiss?.();
      }
    },
  });

  const bannerIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!store || !show) {
      return;
    }

    const id = store.add({
      content: children,
      variant,
      priority,
      duration,
      dismissible,
      onDismiss: () => {
        onClose?.();
        onDismiss?.();
        onOpenChange?.(false);
      },
    });
    bannerIdRef.current = id;

    return () => {
      if (bannerIdRef.current) {
        store.remove(bannerIdRef.current);
        bannerIdRef.current = null;
      }
    };
  }, [
    children,
    dismissible,
    duration,
    onClose,
    onDismiss,
    onOpenChange,
    priority,
    show,
    store,
    variant,
  ]);

  const handleShowChange = useCallback(
    (nextShow: boolean) => {
      setShow(nextShow);
    },
    [setShow]
  );

  if (!show || isQueued) {
    return null;
  }

  return (
    <BannerContext.Provider
      value={{ show, setShow: handleShowChange, dismissible, variant }}
    >
      <div
        aria-live="polite"
        className={cn(
          "flex w-full items-center justify-between gap-3 border px-4 py-2 text-sm",
          bannerVariantClasses[variant],
          inset && "rounded",
          className
        )}
        data-slot="banner"
        data-state="open"
        role="status"
        {...props}
      >
        {children}
      </div>
    </BannerContext.Provider>
  );
};

export type BannerIconProps = HTMLAttributes<HTMLDivElement> & {
  icon?: LucideIcon;
};

export const BannerIcon = ({
  icon: Icon,
  className,
  children,
  ...props
}: BannerIconProps) => (
  <div
    className={cn(
      "flex shrink-0 items-center rounded-full border border-current/20 bg-background/10 p-1 shadow-sm [&>svg]:size-4",
      className
    )}
    data-slot="banner-icon"
    {...props}
  >
    {Icon ? <Icon size={16} /> : children}
  </div>
);

export type BannerContentProps = HTMLAttributes<HTMLDivElement>;

export const BannerContent = ({ className, ...props }: BannerContentProps) => (
  <div
    className={cn("flex min-w-0 flex-1 flex-col gap-1", className)}
    data-slot="banner-content"
    {...props}
  />
);

export type BannerTitleProps = HTMLAttributes<HTMLParagraphElement>;

export const BannerTitle = ({ className, ...props }: BannerTitleProps) => (
  <p
    className={cn("flex-1 text-sm font-medium leading-none", className)}
    data-slot="banner-title"
    {...props}
  />
);

export type BannerDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const BannerDescription = ({
  className,
  ...props
}: BannerDescriptionProps) => (
  <p
    className={cn("text-xs opacity-90", className)}
    data-slot="banner-description"
    {...props}
  />
);

export type BannerActionsProps = HTMLAttributes<HTMLDivElement>;

export const BannerActions = ({ className, ...props }: BannerActionsProps) => (
  <div
    className={cn("flex shrink-0 items-center gap-2", className)}
    data-slot="banner-actions"
    {...props}
  />
);

export type BannerActionProps = ComponentProps<typeof Button>;

export const BannerAction = ({
  variant = "outlined",
  size = "small",
  className,
  ...props
}: BannerActionProps) => (
  <Button
    className={cn(
      "shrink-0 bg-transparent hover:bg-background/10 hover:text-current",
      className
    )}
    size={size}
    variant={variant}
    {...props}
  />
);

export type BannerCloseProps = ComponentProps<typeof Button>;

export const BannerClose = ({
  variant = "text",
  size = "small",
  shape = "square",
  onClick,
  className,
  children,
  disabled,
  ...props
}: BannerCloseProps) => {
  const { setShow, dismissible } = useContext(BannerContext);
  const isDisabled = disabled ?? !dismissible;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || isDisabled) {
      return;
    }
    setShow(false);
  };

  return (
    <Button
      className={cn(
        "shrink-0 bg-transparent hover:bg-background/10 hover:text-current",
        className
      )}
      disabled={isDisabled}
      onClick={handleClick}
      size={size}
      shape={shape}
      variant={variant}
      {...props}
    >
      {children ?? <XIcon size={18} />}
    </Button>
  );
};

export type { BannerSide, BannerStrategy, BannerVariant, QueuedBannerData };
