'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/core/button';
import { Input } from '@/components/core/input';

export interface TwoFactorProps {
  data?: {
    title?: string;
    subtitle?: string;
    verifyLabel?: string;
    resendLabel?: string;
    backLabel?: string;
    codeLength?: 4 | 5 | 6 | 7 | 8;
    resendCooldown?: number;
  };
  actions?: {
    onVerify?: (code: string) => void | Promise<void>;
    onResend?: () => void | Promise<void>;
    onBack?: () => void;
  };
  appearance?: {
    showHeader?: boolean;
    showBack?: boolean;
  };
  control?: {
    isLoading?: boolean;
    error?: string;
  };
}

export function TwoFactor({ data, actions, appearance, control }: TwoFactorProps) {
  const {
    title = 'Two-Factor Authentication',
    subtitle = 'Enter the verification code sent to your device.',
    verifyLabel = 'Verify',
    resendLabel = 'Resend Code',
    backLabel = 'Back',
    codeLength = 6,
    resendCooldown = 60,
  } = data ?? {};
  const { showHeader = true, showBack = true } = appearance ?? {};
  const { isLoading = false, error } = control ?? {};

  const [digits, setDigits] = useState<string[]>(() => Array.from({ length: codeLength }, () => ''));
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    setDigits(Array.from({ length: codeLength }, () => ''));
  }, [codeLength]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const code = digits.join('');
  const isComplete = code.length === codeLength && digits.every(Boolean);

  const focusIndex = (index: number) => {
    inputsRef.current[index]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < codeLength - 1) focusIndex(index + 1);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      focusIndex(index - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, codeLength);
    if (!pasted) return;
    e.preventDefault();
    setDigits(Array.from({ length: codeLength }, (_, i) => pasted[i] ?? ''));
    focusIndex(Math.min(pasted.length, codeLength - 1));
  };

  const handleVerify = async () => {
    if (!isComplete) return;
    const result = actions?.onVerify?.(code);
    if (result instanceof Promise) await result;
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    const result = actions?.onResend?.();
    if (result instanceof Promise) await result;
    setCooldown(resendCooldown);
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-card p-6" data-slot="two-factor">
      {showHeader ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      ) : null}

      <div className="flex justify-center gap-2">
        {digits.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="h-12 w-10 text-center text-lg"
            disabled={isLoading}
          />
        ))}
      </div>

      {error ? <p className="mt-3 text-center text-sm text-destructive">{error}</p> : null}

      <Button
        htmlType="button"
        variant="solid"
        color="primary"
        className="mt-6 w-full"
        disabled={!isComplete || isLoading}
        onClick={handleVerify}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          verifyLabel
        )}
      </Button>

      <div className="mt-4 flex items-center justify-between text-sm">
        <Button
          htmlType="button"
          variant="text"
          disabled={cooldown > 0 || isLoading}
          onClick={handleResend}
        >
          {cooldown > 0 ? `${resendLabel} (${cooldown}s)` : resendLabel}
        </Button>
        {showBack ? (
          <button
            type="button"
            onClick={() => actions?.onBack?.()}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
