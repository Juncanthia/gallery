'use client';

import { useState } from 'react';
import { Loader2, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/core/button';
import { Input } from '@/components/core/input';
import { Label } from '@/components/core/label';
import { Checkbox } from '@/components/core/checkbox';

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignInProps {
  data?: {
    title?: string;
    subtitle?: string;
    emailLabel?: string;
    passwordLabel?: string;
    submitLabel?: string;
    emailPlaceholder?: string;
    passwordPlaceholder?: string;
    rememberMeLabel?: string;
    forgotPasswordLabel?: string;
    signUpLabel?: string;
    forgotPasswordHref?: string;
    signUpHref?: string;
    initialValues?: Partial<SignInFormData>;
  };
  actions?: {
    onSubmit?: (email: string, password: string) => void | Promise<void>;
    onForgotPassword?: () => void;
    onSignUp?: () => void;
  };
  appearance?: {
    showTitle?: boolean;
    showRememberMe?: boolean;
    showLinks?: boolean;
  };
  control?: {
    isLoading?: boolean;
    error?: string;
  };
}

export function SignIn({ data, actions, appearance, control }: SignInProps) {
  const {
    title = 'Sign In',
    subtitle = 'Enter your credentials to access your account',
    emailLabel = 'Email',
    passwordLabel = 'Password',
    submitLabel = 'Sign In',
    emailPlaceholder = 'you@example.com',
    passwordPlaceholder = 'Enter your password',
    rememberMeLabel = 'Remember me',
    forgotPasswordLabel = 'Forgot password?',
    signUpLabel = "Don't have an account? Sign up",
    forgotPasswordHref = '#',
    signUpHref = '#',
    initialValues,
  } = data ?? {};

  const { showTitle = true, showRememberMe = true, showLinks = true } = appearance ?? {};
  const { isLoading = false, error } = control ?? {};

  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [password, setPassword] = useState(initialValues?.password ?? '');
  const [rememberMe, setRememberMe] = useState(initialValues?.rememberMe ?? false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = actions?.onSubmit?.(email, password);
    if (result instanceof Promise) await result;
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-card p-6" data-slot="sign-in">
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      )}

      {error ? (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sign-in-email">{emailLabel}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="sign-in-email"
              type="email"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sign-in-password">{passwordLabel}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="sign-in-password"
              type="password"
              placeholder={passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {showRememberMe ? (
          <Checkbox
            id="sign-in-remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
            label={rememberMeLabel}
            disabled={isLoading}
          />
        ) : null}

        <Button
          htmlType="submit"
          variant="solid"
          color="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>

      {showLinks ? (
        <div className="mt-4 flex flex-col gap-2 text-sm">
          <a
            href={forgotPasswordHref}
            onClick={(e) => {
              if (actions?.onForgotPassword) {
                e.preventDefault();
                actions.onForgotPassword();
              }
            }}
            className="text-primary hover:underline"
          >
            {forgotPasswordLabel}
          </a>
          <a
            href={signUpHref}
            onClick={(e) => {
              if (actions?.onSignUp) {
                e.preventDefault();
                actions.onSignUp();
              }
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            {signUpLabel}
          </a>
        </div>
      ) : null}
    </div>
  );
}
