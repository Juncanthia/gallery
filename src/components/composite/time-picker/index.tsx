'use client';

import { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@/lib/utils';
import { Button } from '@/components/base/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/base/popover';
import { ScrollArea } from '@/components/base/scroll-area';
import { Separator } from '@/components/base/separator';

export type TimePickerProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  format?: 'HH:mm:ss' | 'HH:mm' | 'mm:ss';
  use12Hours?: boolean;
  disabled?: boolean;
  placeholder?: string;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  className?: string;
  triggerClassName?: string;
};

function padZero(num: number): string {
  return String(num).padStart(2, '0');
}

function parseTime(
  timeString: string
): { hours: number; minutes: number; seconds: number } {
  const parts = timeString.split(':');
  return {
    hours: parseInt(parts[0], 10) || 0,
    minutes: parseInt(parts[1], 10) || 0,
    seconds: parseInt(parts[2], 10) || 0,
  };
}

function formatTime(
  hours: number,
  minutes: number,
  seconds: number,
  format: 'HH:mm:ss' | 'HH:mm' | 'mm:ss'
): string {
  const h = padZero(hours);
  const m = padZero(minutes);
  const s = padZero(seconds);

  switch (format) {
    case 'HH:mm:ss':
      return `${h}:${m}:${s}`;
    case 'HH:mm':
      return `${h}:${m}`;
    case 'mm:ss':
      return `${m}:${s}`;
  }
}

export function TimePicker({
  value,
  defaultValue = '00:00:00',
  onChange,
  format = 'HH:mm:ss',
  use12Hours = false,
  disabled = false,
  placeholder = 'Select time',
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  className,
  triggerClassName,
}: TimePickerProps) {
  const [internalValue, setInternalValue] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange,
  });

  const [isOpen, setIsOpen] = useState(false);
  const parsed = parseTime(internalValue);
  const [hours, setHours] = useState(parsed.hours);
  const [minutes, setMinutes] = useState(parsed.minutes);
  const [seconds, setSeconds] = useState(parsed.seconds);

  useEffect(() => {
    const p = parseTime(internalValue);
    setHours(p.hours);
    setMinutes(p.minutes);
    setSeconds(p.seconds);
  }, [internalValue, isOpen]);

  const handleValueChange = (h: number, m: number, s: number) => {
    const newValue = formatTime(h, m, s, format);
    setInternalValue(newValue);
  };

  const hourOptions = use12Hours
    ? Array.from({ length: Math.ceil(12 / hourStep) }, (_, i) => (i * hourStep) + 1)
    : Array.from({ length: Math.ceil(24 / hourStep) }, (_, i) => i * hourStep);
  const minuteOptions = Array.from(
    { length: Math.ceil(60 / minuteStep) },
    (_, i) => i * minuteStep
  );
  const secondOptions = Array.from(
    { length: Math.ceil(60 / secondStep) },
    (_, i) => i * secondStep
  );

  const displayValue =
    internalValue && internalValue !== defaultValue
      ? internalValue
      : placeholder;

  const Column = ({
    options,
    value: selectedValue,
    onChange: onColumnChange,
    label,
  }: {
    options: number[];
    value: number;
    onChange: (val: number) => void;
    label: string;
  }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (scrollRef.current) {
        const selectedItem = scrollRef.current.querySelector(
          '[data-selected="true"]'
        );
        if (selectedItem) {
          selectedItem.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      }
    }, []);

    return (
      <div className="flex-1 flex flex-col items-center">
        <div className="text-xs text-muted-foreground mb-2">{label}</div>
        <ScrollArea className="h-48 w-full">
          <div
            ref={scrollRef}
            className="flex flex-col divide-y"
          >
            {options.map((option) => (
              <button
                key={option}
                data-selected={option === selectedValue}
                onClick={() => onColumnChange(option)}
                className={cn(
                  'py-2 text-center text-sm hover:bg-accent transition-colors',
                  option === selectedValue &&
                    'bg-primary/10 text-primary font-medium'
                )}
              >
                {padZero(option)}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const showSeconds = format === 'HH:mm:ss';

  return (
    <div
      data-slot="time-picker"
      className={cn('', className)}
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn('w-full justify-start gap-2', triggerClassName)}
          >
            <Clock size={16} />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-mono font-semibold">
                {formatTime(hours, minutes, seconds, format)}
              </div>
            </div>
            <Separator />
            <div className="flex gap-2">
              <Column
                label="Hours"
                options={hourOptions}
                value={hours}
                onChange={(h) => {
                  setHours(h);
                  handleValueChange(h, minutes, seconds);
                }}
              />
              <Column
                label="Minutes"
                options={minuteOptions}
                value={minutes}
                onChange={(m) => {
                  setMinutes(m);
                  handleValueChange(hours, m, seconds);
                }}
              />
              {showSeconds && (
                <Column
                  label="Seconds"
                  options={secondOptions}
                  value={seconds}
                  onChange={(s) => {
                    setSeconds(s);
                    handleValueChange(hours, minutes, s);
                  }}
                />
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
