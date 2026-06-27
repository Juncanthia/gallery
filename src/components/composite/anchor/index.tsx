'use client';

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

export type AnchorLinkItem = {
  key: string;
  href: string;
  title: ReactNode;
  children?: AnchorLinkItem[];
};

type AnchorContextType = {
  activeId: string;
  setActiveId: (id: string) => void;
};

const AnchorContext = createContext<AnchorContextType | undefined>(undefined);

export function useAnchor(): AnchorContextType {
  const context = useContext(AnchorContext);
  if (!context) {
    throw new Error('useAnchor must be used within AnchorProvider');
  }
  return context;
}

export type AnchorProviderProps = {
  children: ReactNode;
  initialActiveId?: string;
};

export function AnchorProvider({
  children,
  initialActiveId = '',
}: AnchorProviderProps) {
  const [activeId, setActiveId] = useState(initialActiveId);

  return (
    <AnchorContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </AnchorContext.Provider>
  );
}

export type AnchorLinkProps = {
  href: string;
  title: ReactNode;
  className?: string;
  children?: AnchorLinkItem[];
};

export function AnchorLink({
  href,
  title,
  className,
  children,
}: AnchorLinkProps) {
  const { activeId, setActiveId } = useAnchor();
  const isActive = `#${activeId}` === href || activeId === href;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetId = href.startsWith('#') ? href.slice(1) : href;
    setActiveId(targetId);

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleClick}
        className={cn(
          'text-sm text-muted-foreground hover:text-foreground transition-colors',
          isActive && 'text-primary font-medium',
          className
        )}
      >
        {title}
      </button>
      {children && children.length > 0 && (
        <div className="ml-4 space-y-1">
          {children.map((child) => (
            <AnchorLink
              key={child.key}
              href={child.href}
              title={child.title}
              children={child.children}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export type AnchorProps = {
  items: AnchorLinkItem[];
  affix?: boolean;
  offsetTop?: number;
  className?: string;
  children?: ReactNode;
};

export function Anchor({
  items,
  affix = true,
  offsetTop = 0,
  className,
  children,
}: AnchorProps) {
  const { activeId, setActiveId } = useContext(AnchorContext) || {
    activeId: '',
    setActiveId: () => {},
  };
  useEffect(() => {
    const handleScroll = () => {
      const threshold = offsetTop + 100;
      let closestId = '';
      let closestDistance = Infinity;

      const getAllIds = (itemsList: AnchorLinkItem[]): string[] => {
        return itemsList.flatMap((item) => [
          item.key,
          ...(item.children ? getAllIds(item.children) : []),
        ]);
      };

      getAllIds(items).forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          const elementTop = element.getBoundingClientRect().top;
          const distance = Math.abs(elementTop - threshold);

          if (
            elementTop <= threshold + 50 &&
            elementTop > -50 &&
            distance < closestDistance
          ) {
            closestDistance = distance;
            closestId = id;
          }
        }
      });

      if (closestId && closestId !== activeId) {
        setActiveId(closestId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items, offsetTop, activeId, setActiveId]);

  const navContent = (
    <nav
      data-slot="anchor"
      className={cn('space-y-3', className)}
    >
      {items.map((item) => (
        <AnchorLink
          key={item.key}
          href={item.href}
          title={item.title}
          children={item.children}
        />
      ))}
    </nav>
  );

  if (children) {
    return (
      <div className="grid grid-cols-4 gap-8">
        <div className={cn(affix && 'sticky top-16')}>
          {navContent}
        </div>
        <div className="col-span-3">{children}</div>
      </div>
    );
  }

  return navContent;
}
