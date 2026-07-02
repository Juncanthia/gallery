'use client';

import * as React from 'react';
import {HoverCard as RadixHoverCard} from 'radix-ui';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  type MotionValue,
  type HTMLMotionProps,
  type SpringOptions,
} from 'motion/react';
import { getStrictContext } from '@/components/_internal/lib/get-strict-context';
import { useControlledState } from '@/_internals/foundations/hooks/use-controlled-state';

type HoverCardContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  x: MotionValue<number>;
  y: MotionValue<number>;
  followCursor?: boolean | 'x' | 'y';
  followCursorSpringOptions?: SpringOptions;
};

const [HoverCardProvider, useHoverCard] =
  getStrictContext<HoverCardContextType>('HoverCardContext');

type HoverCardPropsPrimitive = React.ComponentProps<typeof RadixHoverCard.Root> & {
  followCursor?: boolean | 'x' | 'y';
  followCursorSpringOptions?: SpringOptions;
};

function HoverCardPrimitive({
  followCursor = false,
  followCursorSpringOptions = { stiffness: 200, damping: 17 },
  ...props
}: HoverCardPropsPrimitive) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props?.open,
    defaultValue: props?.defaultOpen,
    onChange: props?.onOpenChange,
  });
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <HoverCardProvider
      value={{
        isOpen,
        setIsOpen,
        x,
        y,
        followCursor,
        followCursorSpringOptions,
      }}
    >
      <RadixHoverCard.Root
        data-slot="hover-card"
        {...props}
        onOpenChange={setIsOpen}
      />
    </HoverCardProvider>
  );
}

type HoverCardTriggerPropsPrimitive = React.ComponentProps<
  typeof RadixHoverCard.Trigger
>;

function HoverCardTriggerPrimitive({ onMouseMove, ...props }: HoverCardTriggerPropsPrimitive) {
  const { x, y, followCursor } = useHoverCard();

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onMouseMove?.(event);

    const target = event.currentTarget.getBoundingClientRect();

    if (followCursor === 'x' || followCursor === true) {
      const eventOffsetX = event.clientX - target.left;
      const offsetXFromCenter = (eventOffsetX - target.width / 2) / 2;
      x.set(offsetXFromCenter);
    }

    if (followCursor === 'y' || followCursor === true) {
      const eventOffsetY = event.clientY - target.top;
      const offsetYFromCenter = (eventOffsetY - target.height / 2) / 2;
      y.set(offsetYFromCenter);
    }
  };

  return (
    <RadixHoverCard.Trigger
      data-slot="hover-card-trigger"
      onMouseMove={handleMouseMove}
      {...props}
    />
  );
}

type HoverCardPortalPropsPrimitive = Omit<
  React.ComponentProps<typeof RadixHoverCard.Portal>,
  'forceMount'
>;

function HoverCardPortalPrimitive(props: HoverCardPortalPropsPrimitive) {
  const { isOpen } = useHoverCard();

  return (
    <AnimatePresence>
      {isOpen && (
        <RadixHoverCard.Portal
          forceMount
          data-slot="hover-card-portal"
          {...props}
        />
      )}
    </AnimatePresence>
  );
}

type HoverCardContentPropsPrimitive = React.ComponentProps<
  typeof RadixHoverCard.Content
> &
  HTMLMotionProps<'div'>;

function HoverCardContentPrimitive({
  align,
  alignOffset,
  side,
  sideOffset,
  avoidCollisions,
  collisionBoundary,
  collisionPadding,
  arrowPadding,
  sticky,
  hideWhenDetached,
  style,
  transition = { type: 'spring', stiffness: 300, damping: 25 },
  ...props
}: HoverCardContentPropsPrimitive) {
  const { x, y, followCursor, followCursorSpringOptions } = useHoverCard();
  const translateX = useSpring(x, followCursorSpringOptions);
  const translateY = useSpring(y, followCursorSpringOptions);

  return (
    <RadixHoverCard.Content
      asChild
      forceMount
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      avoidCollisions={avoidCollisions}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding}
      arrowPadding={arrowPadding}
      sticky={sticky}
      hideWhenDetached={hideWhenDetached}
    >
      <motion.div
        key="hover-card-content"
        data-slot="hover-card-content"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={transition}
        style={{
          x:
            followCursor === 'x' || followCursor === true
              ? translateX
              : undefined,
          y:
            followCursor === 'y' || followCursor === true
              ? translateY
              : undefined,
          ...style,
        }}
        {...props}
      />
    </RadixHoverCard.Content>
  );
}

type HoverCardArrowPropsPrimitive = React.ComponentProps<
  typeof RadixHoverCard.Arrow
>;

function HoverCardArrowPrimitive(props: HoverCardArrowPropsPrimitive) {
  return <RadixHoverCard.Arrow data-slot="hover-card-arrow" {...props} />;
}

type PreviewLinkCardContextType = {
  href: string;
  src?: string;
  width?: number;
  height?: number;
};

const [PreviewLinkCardProvider, usePreviewLinkCard] =
  getStrictContext<PreviewLinkCardContextType>('PreviewLinkCardContext');

type PreviewLinkCardProps = HoverCardPropsPrimitive & {
  href: string;
  src?: string;
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  colorScheme?: 'light' | 'dark';
};

function PreviewLinkCard({
  href,
  src,
  width = 240,
  height = 135,
  deviceScaleFactor = 1,
  colorScheme = 'light',
  ...props
}: PreviewLinkCardProps) {
  const imageSrc =
    src ??
    `https://api.microlink.io/?${buildQueryString({
      url: href,
      screenshot: true,
      meta: false,
      embed: 'screenshot.url',
      colorScheme,
      'viewport.isMobile': true,
      'viewport.deviceScaleFactor': deviceScaleFactor,
      'viewport.width': width * 3,
      'viewport.height': height * 3,
    })}`;

  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageSrc;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [imageSrc]);

  return (
    <PreviewLinkCardProvider value={{ href, src: imageSrc, width, height }}>
      <HoverCardPrimitive data-slot="preview-link-card" {...props} />
    </PreviewLinkCardProvider>
  );
}

type PreviewLinkCardTriggerProps = HoverCardTriggerPropsPrimitive &
  React.ComponentProps<'a'>;

function PreviewLinkCardTrigger({
  asChild,
  children,
  href: hrefProp,
  ...props
}: PreviewLinkCardTriggerProps) {
  const { href } = usePreviewLinkCard();

  return (
    <HoverCardTriggerPrimitive
      data-slot="preview-link-card-trigger"
      asChild
      {...props}
    >
      {asChild ? children : <a href={hrefProp ?? href}>{children}</a>}
    </HoverCardTriggerPrimitive>
  );
}

type PreviewLinkCardPortalProps = HoverCardPortalPropsPrimitive;

function PreviewLinkCardPortal(props: PreviewLinkCardPortalProps) {
  return (
    <HoverCardPortalPrimitive data-slot="preview-link-card-portal" {...props} />
  );
}

function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>,
) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    sp.append(k, String(v));
  }
  return sp.toString();
}

type PreviewLinkCardContentProps = HoverCardContentPropsPrimitive &
  React.ComponentProps<'a'>;

function PreviewLinkCardContent({
  side = 'top',
  sideOffset = 10,
  align = 'center',
  alignOffset,
  avoidCollisions,
  collisionBoundary,
  collisionPadding,
  arrowPadding,
  sticky,
  hideWhenDetached,
  transition = { type: 'spring', stiffness: 300, damping: 25 },
  asChild,
  children,
  href: hrefProp,
  style,
  ...props
}: PreviewLinkCardContentProps) {
  const { href } = usePreviewLinkCard();

  return (
    <HoverCardContentPrimitive
      data-slot="preview-link-card-content"
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      avoidCollisions={avoidCollisions}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding}
      arrowPadding={arrowPadding}
      sticky={sticky}
      hideWhenDetached={hideWhenDetached}
      transition={transition}
      asChild={asChild}
      {...(asChild ? { style, ...props } : {})}
    >
      {asChild ? (
        children
      ) : (
        <a
          style={{
            display: 'block',
            ...style,
          }}
          href={hrefProp ?? href}
          {...props}
        >
          {children}
        </a>
      )}
    </HoverCardContentPrimitive>
  );
}

type PreviewLinkCardImageProps = Omit<
  React.ComponentProps<'img'>,
  'src' | 'width' | 'height'
>;

function PreviewLinkCardImage({
  alt = 'preview image',
  ...props
}: PreviewLinkCardImageProps) {
  const { src, width, height } = usePreviewLinkCard();

  return <img src={src} width={width} height={height} alt={alt} {...props} />;
}

type PreviewLinkCardArrowProps = HoverCardArrowPropsPrimitive;

function PreviewLinkCardArrow(props: PreviewLinkCardArrowProps) {
  return (
    <HoverCardArrowPrimitive data-slot="preview-link-card-arrow" {...props} />
  );
}

export {
  PreviewLinkCard,
  PreviewLinkCardTrigger,
  PreviewLinkCardPortal,
  PreviewLinkCardContent,
  PreviewLinkCardImage,
  PreviewLinkCardArrow,
  usePreviewLinkCard,
  type PreviewLinkCardProps,
  type PreviewLinkCardTriggerProps,
  type PreviewLinkCardPortalProps,
  type PreviewLinkCardContentProps,
  type PreviewLinkCardImageProps,
  type PreviewLinkCardArrowProps,
  type PreviewLinkCardContextType,
};
