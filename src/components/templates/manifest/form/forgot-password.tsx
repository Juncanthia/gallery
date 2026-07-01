'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/components/document/lib/utils';
import { ArrowLeft, CheckCircle, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';

/**
 * Data structure for the forgot password form submission.
 * @interface ForgotPasswordData
 * @property {string} email - The user's email address to send the reset link to
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ForgotPasswordProps
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Props for the ForgotPassword component.
 */
export interface ForgotPasswordProps {
  data?: {
    /** The form title displayed at the top. */
    title?: string;
    /** Descriptive text below the title. */
    subtitle?: string;
    /** Custom label for the submit button. */
    submitLabel?: string;
    /** Success message shown after submission. */
    successMessage?: string;
    /** Text for the back-to-login link. */
    backToLoginLabel?: string;
  };
  actions?: {
    /** Called when the form is submitted with the email. */
    onSubmit?: (data: ForgotPasswordData) => void | Promise<void>;
    /** Called when the back-to-login link is clicked. */
    onBackToLogin?: () => void;
  };
  appearance?: {
    /**
     * Whether to display the title section.
     * @default true
     */
    showTitle?: boolean;
    /**
     * Whether to show the back-to-login link.
     * @default true
     */
    showBackToLogin?: boolean;
  };
  control?: {
    /**
     * Shows loading state on submit button.
     * @default false
     */
    isLoading?: boolean;
  };
}

/**
 * A forgot password form component that collects the user's email address
 * and triggers a password reset flow.
 *
 * Features:
 * - Email input with validation
 * - Loading state support
 * - Success state after submission
 * - Back to login navigation
 * - Customizable title, subtitle, and labels
 *
 * @component
 * @example
 * ```tsx
 * <ForgotPassword
 *   data={{
 *     title: "Forgot Password",
 *     subtitle: "Enter your email to receive a reset link",
 *     submitLabel: "Send Reset Link"
 *   }}
 *   actions={{
 *     onSubmit: async (data) => {
 *       await sendResetEmail(data.email)
 *     },
 *     onBackToLogin: () => router.push("/login")
 *   }}
 *   control={{ isLoading: false }}
 * />
 * ```
 */
export function ForgotPassword({
  data,
  actions,
  appearance,
  control,
}: ForgotPasswordProps) {
  const title = data?.title ?? 'Forgot Password';
  const subtitle =
    data?.subtitle ??
    'Enter your email address and we\'ll send you a link to reset your password.';
  const submitLabel = data?.submitLabel ?? 'Send Reset Link';
  const successMessage =
    data?.successMessage ??
    'If an account exists for that email, you will receive a password reset link shortly.';
  const backToLoginLabel = data?.backToLoginLabel ?? 'Back to Sign In';

  const { onSubmit } = actions ?? {};
  const { showTitle = true } = appearance ?? {};
  const { showBackToLogin = true } = appearance ?? {};
  const { isLoading = false } = control ?? {};

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const result = onSubmit?.({ email });
    if (result instanceof Promise) {
      await result;
    }
    setSubmitted(true);
  };

  const handleBackToLogin = () => {
    if (actions?.onBackToLogin) {
      actions.onBackToLogin();
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md bg-card rounded-xl p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Check Your Email
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {successMessage}
            </p>
          </div>
          {showBackToLogin && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleBackToLogin();
              }}
              className="text-sm text-primary hover:underline"
            >
              {backToLoginLabel}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-card rounded-xl p-6">
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className={cn('pl-10', error && 'border-red-500')}
              disabled={isLoading}
              required
            />
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
        </div>

        <Button variant="solid" color="primary"
          htmlType="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>

      {showBackToLogin && (
        <div className="mt-4 text-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleBackToLogin();
            }}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backToLoginLabel}
          </a>
        </div>
      )}
    </div>
  );
}
