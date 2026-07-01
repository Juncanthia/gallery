'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface SignUpProps {
  data?: {
    title?: string;
    subtitle?: string;
    submitLabel?: string;
    initialValues?: Partial<SignUpData>;
  };
  actions?: {
    onSubmit?: (data: SignUpData) => void | Promise<void>;
  };
  appearance?: {
    showTitle?: boolean;
    showSignInLink?: boolean;
    signInHref?: string;
  };
  control?: {
    isLoading?: boolean;
  };
}

function isStrongPassword(value: string) {
  return value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
}

export function SignUp({ data, actions, appearance, control }: SignUpProps) {
  const {
    title = 'Create an account',
    subtitle = 'Enter your details to get started.',
    submitLabel = 'Sign Up',
    initialValues,
  } = data ?? {};
  const { showTitle = true, showSignInLink = true, signInHref = '/sign-in' } = appearance ?? {};
  const { isLoading = false } = control ?? {};

  const [name, setName] = useState(initialValues?.name ?? '');
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [password, setPassword] = useState(initialValues?.password ?? '');
  const [confirmPassword, setConfirmPassword] = useState(initialValues?.confirmPassword ?? '');
  const [agreeToTerms, setAgreeToTerms] = useState(initialValues?.agreeToTerms ?? false);

  const passwordValid = isStrongPassword(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = name.trim() && email.trim() && passwordValid && passwordsMatch && agreeToTerms && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const payload: SignUpData = { name, email, password, confirmPassword, agreeToTerms };
    const result = actions?.onSubmit?.(payload);
    if (result instanceof Promise) await result;
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-card p-6" data-slot="sign-up">
      {showTitle ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sign-up-name">Name</Label>
          <Input
            id="sign-up-name"
            data-slot="sign-up-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sign-up-email">Email</Label>
          <Input
            id="sign-up-email"
            data-slot="sign-up-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sign-up-password">Password</Label>
          <Input
            id="sign-up-password"
            data-slot="sign-up-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          {!passwordValid && password.length > 0 ? (
            <p className="text-xs text-muted-foreground">
              At least 8 characters with upper, lower case and a number.
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sign-up-confirm-password">Confirm Password</Label>
          <Input
            id="sign-up-confirm-password"
            data-slot="sign-up-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          {confirmPassword && !passwordsMatch ? (
            <p className="text-xs text-destructive">Passwords do not match.</p>
          ) : null}
        </div>
        <Checkbox
          id="sign-up-agree-terms"
          data-slot="sign-up-agree-terms"
          checked={agreeToTerms}
          onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
          disabled={isLoading}
          label={
            <span>
              I agree to the{' '}
              <a href="/terms" className="text-primary hover:underline">
                Terms
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </span>
          }
        />
        <Button
          htmlType="submit"
          data-slot="sign-up-submit"
          variant="solid"
          color="primary"
          className="w-full"
          disabled={!canSubmit}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>

      {showSignInLink ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href={signInHref} className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      ) : null}
    </div>
  );
}
