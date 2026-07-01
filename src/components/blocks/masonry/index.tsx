'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export {
  VirtualMasonry,
  VirtualMasonryItem,
  type VirtualMasonryProps,
} from './virtualized';

type ColumnConfig = {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

export type MasonryProps = {
  columns?: number | ColumnConfig;
  gap?: number;
  children?: ReactNode;
  className?: string;
};

export function Masonry({
  columns = 3,
  gap = 4,
  children,
  className,
}: MasonryProps) {
  const getColumnClasses = (): string => {
    if (typeof columns === 'number') {
      const columnClassMap: { [key: number]: string } = {
        1: 'columns-1',
        2: 'columns-2',
        3: 'columns-3',
        4: 'columns-4',
        5: 'columns-5',
        6: 'columns-6',
      };
      return columnClassMap[columns] || `columns-${columns}`;
    }

    const classNames: string[] = [];
    if (columns.sm)
      classNames.push(getColumnClass('sm', columns.sm));
    if (columns.md)
      classNames.push(getColumnClass('md', columns.md));
    if (columns.lg)
      classNames.push(getColumnClass('lg', columns.lg));
    if (columns.xl)
      classNames.push(getColumnClass('xl', columns.xl));

    return classNames.join(' ') || 'columns-3';
  };

  const getColumnClass = (breakpoint: string, value: number): string => {
    const columnClassMap: { [key: number]: string } = {
      1: 'columns-1',
      2: 'columns-2',
      3: 'columns-3',
      4: 'columns-4',
      5: 'columns-5',
      6: 'columns-6',
    };
    const baseClass = columnClassMap[value] || `columns-${value}`;
    return `${breakpoint}:${baseClass}`;
  };

  const gapValue = gap * 4;

  return (
    <div
      data-slot="masonry"
      className={cn(getColumnClasses(), className)}
      style={{ gap: `${gapValue}px` }}
    >
      {(children as unknown[])?.length > 0 ? (
        (children as ReactNode[]).map((child, index) => (
          <div
            key={index}
            className="break-inside-avoid"
            style={{ marginBottom: `${gapValue}px` }}
          >
            {child}
          </div>
        ))
      ) : (
        <div className={`break-inside-avoid`}>{children}</div>
      )}
    </div>
  );
}
