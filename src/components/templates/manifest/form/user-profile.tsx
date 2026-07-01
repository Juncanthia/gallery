'use client';

import { useState } from 'react';
import { Loader2, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface UserData {
  name?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  website?: string;
}

const defaultUser: UserData = {
  name: 'Alex Chen',
  email: 'alex@example.com',
  bio: 'Product designer building thoughtful interfaces.',
  avatar: '',
  phone: '+1 555 0100',
  location: 'San Francisco, CA',
  website: 'https://example.com',
};

export interface UserProfileProps {
  data?: {
    title?: string;
    user?: UserData;
    editLabel?: string;
    saveLabel?: string;
    cancelLabel?: string;
  };
  actions?: {
    onSave?: (data: UserData) => void | Promise<void>;
    onCancel?: () => void;
    onAvatarChange?: (file: File) => void;
  };
  appearance?: {
    showTitle?: boolean;
    showAvatar?: boolean;
    editable?: boolean;
  };
  control?: {
    isLoading?: boolean;
  };
}

export function UserProfile({ data, actions, appearance, control }: UserProfileProps) {
  const {
    title = 'Profile',
    user = defaultUser,
    editLabel = 'Edit',
    saveLabel = 'Save Changes',
    cancelLabel = 'Cancel',
  } = data ?? {};
  const { showTitle = true, showAvatar = true, editable = true } = appearance ?? {};
  const { isLoading = false } = control ?? {};

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserData>(user);

  const update = (key: keyof UserData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const result = actions?.onSave?.(form);
    if (result instanceof Promise) await result;
    setEditing(false);
  };

  const handleCancel = () => {
    setForm(user);
    setEditing(false);
    actions?.onCancel?.();
  };

  return (
    <div className="w-full max-w-2xl rounded-xl bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        {showTitle ? <h2 className="text-xl font-semibold">{title}</h2> : <span />}
        {editable && !editing ? (
          <Button htmlType="button" variant="outlined" size="small" onClick={() => setEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            {editLabel}
          </Button>
        ) : null}
      </div>

      {showAvatar ? (
        <div className="mb-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {form.avatar ? <AvatarImage src={form.avatar} alt={form.name} /> : null}
            <AvatarFallback>{form.name?.slice(0, 2).toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          {editing ? (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) actions?.onAvatarChange?.(file);
              }}
            />
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {(['name', 'email', 'phone', 'location', 'website'] as const).map((field) => (
          <div key={field} className="space-y-2">
            <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
            {editing ? (
              <Input
                value={form[field] ?? ''}
                onChange={(e) => update(field, e.target.value)}
                disabled={isLoading}
              />
            ) : (
              <p className="text-sm text-foreground">{form[field] ?? '—'}</p>
            )}
          </div>
        ))}
        <div className="space-y-2 sm:col-span-2">
          <Label>Bio</Label>
          {editing ? (
            <Textarea
              value={form.bio ?? ''}
              onChange={(e) => update('bio', e.target.value)}
              disabled={isLoading}
            />
          ) : (
            <p className="text-sm text-muted-foreground">{form.bio ?? '—'}</p>
          )}
        </div>
      </div>

      {editing ? (
        <div className="mt-6 flex gap-2">
          <Button htmlType="button" variant="solid" color="primary" disabled={isLoading} onClick={handleSave}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {saveLabel}
          </Button>
          <Button htmlType="button" variant="outlined" disabled={isLoading} onClick={handleCancel}>
            {cancelLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
