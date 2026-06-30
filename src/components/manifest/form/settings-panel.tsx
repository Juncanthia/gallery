'use client'

import { Button } from '@/components/manifest/components/ui/button'
import { Input } from '@/components/manifest/components/ui/input'
import { Label } from '@/components/manifest/components/ui/label'
import { Separator } from '@/components/manifest/components/ui/separator'
import { cn } from '@/components/manifest/lib/utils'
import {
  Bell,
  Check,
  Globe,
  Key,
  Loader2,
  Monitor,
  Moon,
  Palette,
  Save,
  Shield,
  Sun,
  Trash2,
  User,
  UserCircle,
} from 'lucide-react'
import { useState } from 'react'

/**
 * Defines a settings navigation section.
 */
export interface SettingsSection {
  /** Unique identifier for the section. */
  id: string
  /** Display label for the navigation sidebar. */
  label: string
  /** Lucide icon component to display alongside the label. */
  icon: React.ComponentType<{ className?: string }>
}

/**
 * Profile settings data.
 */
export interface ProfileSettings {
  displayName: string
  email: string
  bio: string
}

/**
 * Account settings data.
 */
export interface AccountSettings {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * Notification preferences.
 */
export interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  weeklyDigest: boolean
}

/**
 * Appearance settings.
 */
export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  compactMode: boolean
}

/**
 * Combined settings form data.
 */
export interface SettingsData {
  profile: ProfileSettings
  account: AccountSettings
  notifications: NotificationSettings
  appearance: AppearanceSettings
}

function defaultSections(): SettingsSection[] {
  return [
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]
}

function defaultProfile(): ProfileSettings {
  return { displayName: '', email: '', bio: '' }
}

function defaultAccount(): AccountSettings {
  return { currentPassword: '', newPassword: '', confirmPassword: '' }
}

function defaultNotifications(): NotificationSettings {
  return {
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
  }
}

function defaultAppearance(): AppearanceSettings {
  return { theme: 'system', language: 'en', compactMode: false }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SettingsPanelProps
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Props for the SettingsPanel component.
 */
export interface SettingsPanelProps {
  data?: {
    /** Page title displayed at the top. */
    title?: string
    /** Descriptive text below the title. */
    subtitle?: string
    /** Navigation sections to display in the sidebar. */
    sections?: SettingsSection[]
    /** Pre-populated profile defaults. */
    profileDefaults?: Partial<ProfileSettings>
    /** Pre-populated notification defaults. */
    notificationDefaults?: Partial<NotificationSettings>
    /** Pre-populated appearance defaults. */
    appearanceDefaults?: Partial<AppearanceSettings>
    /** Language options for appearance section. */
    languages?: { value: string; label: string }[]
    /** Custom label for the save button. */
    saveLabel?: string
    /** Custom label for the danger zone delete button. */
    deleteAccountLabel?: string
    /** Custom label for the danger zone description. */
    dangerZoneDescription?: string
  }
  actions?: {
    /** Called when the save button is clicked with all settings. */
    onSave?: (settings: SettingsData) => void | Promise<void>
    /** Called when the delete account button is clicked. */
    onDeleteAccount?: () => void
  }
  appearance?: {
    /**
     * Whether to display the title area.
     * @default true
     */
    showTitle?: boolean
    /**
     * Whether to display the danger zone section.
     * @default true
     */
    showDangerZone?: boolean
    /**
     * The default selected section id.
     * @default "profile"
     */
    defaultSection?: string
  }
  control?: {
    /**
     * Shows loading state on save button.
     * @default false
     */
    isLoading?: boolean
    /**
     * Whether the settings have been changed (enables save button).
     * @default false
     */
    isDirty?: boolean
  }
}

function ThemeOption({
  value,
  label,
  icon: Icon,
  selected,
  onSelect,
}: {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  selected: boolean
  onSelect: (v: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-colors',
        selected
          ? 'border-primary bg-primary/5 text-primary'
          : 'border-border hover:border-primary/50 text-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      {selected && <Check className="h-4 w-4 ml-auto" />}
    </button>
  )
}

/**
 * A settings panel component with sidebar navigation and section-based forms.
 *
 * Features:
 * - Sidebar navigation with icons
 * - Profile, Account, Notifications, Appearance sections
 * - Danger zone with delete account
 * - Save with all settings data
 * - Customizable sections, labels, and defaults
 *
 * @component
 * @example
 * ```tsx
 * <SettingsPanel
 *   data={{ title: "Settings" }}
 *   actions={{
 *     onSave: (settings) => saveSettings(settings),
 *     onDeleteAccount: () => confirmDelete(),
 *   }}
 *   control={{ isLoading: false }}
 * />
 * ```
 */
export function SettingsPanel({
  data,
  actions,
  appearance,
  control,
}: SettingsPanelProps) {
  const title = data?.title ?? 'Settings'
  const subtitle = data?.subtitle ?? 'Manage your account settings and preferences.'
  const sections = data?.sections ?? defaultSections()
  const saveLabel = data?.saveLabel ?? 'Save Changes'
  const deleteAccountLabel = data?.deleteAccountLabel ?? 'Delete Account'
  const dangerZoneDescription =
    data?.dangerZoneDescription ??
    'Once you delete your account, there is no going back. Please be certain.'
  const languages = data?.languages ?? [
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' },
  ]

  const { onSave } = actions ?? {}
  const { showTitle = true } = appearance ?? {}
  const { showDangerZone = true } = appearance ?? {}
  const { defaultSection = 'profile' } = appearance ?? {}
  const { isLoading = false } = control ?? {}

  const [activeSection, setActiveSection] = useState(defaultSection)
  const [profile, setProfile] = useState<ProfileSettings>({
    ...defaultProfile(),
    ...data?.profileDefaults,
  })
  const [account, setAccount] = useState<AccountSettings>(defaultAccount())
  const [notifications, setNotifications] = useState<NotificationSettings>({
    ...defaultNotifications(),
    ...data?.notificationDefaults,
  })
  const [appearanceSettings, setAppearanceSettings] =
    useState<AppearanceSettings>({
      ...defaultAppearance(),
      ...data?.appearanceDefaults,
    })
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async () => {
    setSaveSuccess(false)
    const result = onSave?.({
      profile,
      account,
      notifications,
      appearance: appearanceSettings,
    })
    if (result instanceof Promise) {
      await result
    }
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const themeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  }

  return (
    <div className="w-full max-w-4xl bg-card rounded-xl border">
      {/* Header */}
      {showTitle && (
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
      )}

      <Separator />

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <nav className="md:w-56 shrink-0 p-3 md:border-r border-border">
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    activeSection === section.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <section.icon className="h-4 w-4 shrink-0" />
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 p-6 min-h-[400px]">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Profile</h3>
              <p className="text-sm text-muted-foreground">
                Update your personal information.
              </p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, displayName: e.target.value }))
                    }
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, bio: e.target.value }))
                    }
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Account Section */}
          {activeSection === 'account' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Account</h3>
              <p className="text-sm text-muted-foreground">
                Update your password and security settings.
              </p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={account.currentPassword}
                    onChange={(e) =>
                      setAccount((a) => ({
                        ...a,
                        currentPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={account.newPassword}
                    onChange={(e) =>
                      setAccount((a) => ({ ...a, newPassword: e.target.value }))
                    }
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={account.confirmPassword}
                    onChange={(e) =>
                      setAccount((a) => ({
                        ...a,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Notifications
              </h3>
              <p className="text-sm text-muted-foreground">
                Configure how and when you receive notifications.
              </p>
              <div className="space-y-3">
                {[
                  {
                    key: 'emailNotifications' as const,
                    label: 'Email Notifications',
                    desc: 'Receive notifications via email.',
                  },
                  {
                    key: 'pushNotifications' as const,
                    label: 'Push Notifications',
                    desc: 'Receive push notifications in your browser.',
                  },
                  {
                    key: 'marketingEmails' as const,
                    label: 'Marketing Emails',
                    desc: 'Receive emails about new features and offers.',
                  },
                  {
                    key: 'weeklyDigest' as const,
                    label: 'Weekly Digest',
                    desc: 'Get a weekly summary of activity.',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications[item.key]}
                      onClick={() =>
                        setNotifications((n) => ({
                          ...n,
                          [item.key]: !n[item.key],
                        }))
                      }
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                        notifications[item.key]
                          ? 'bg-primary'
                          : 'bg-muted-foreground/30'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition-transform',
                          notifications[item.key]
                            ? 'translate-x-4'
                            : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Appearance
              </h3>
              <p className="text-sm text-muted-foreground">
                Customize the look and feel of the application.
              </p>
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Theme
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor },
                    ].map((opt) => (
                      <ThemeOption
                        key={opt.value}
                        value={opt.value}
                        label={opt.label}
                        icon={opt.icon}
                        selected={appearanceSettings.theme === opt.value}
                        onSelect={(v) =>
                          setAppearanceSettings((a) => ({
                            ...a,
                            theme: v as AppearanceSettings['theme'],
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={appearanceSettings.language}
                    onChange={(e) =>
                      setAppearanceSettings((a) => ({
                        ...a,
                        language: e.target.value,
                      }))
                    }
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Footer: Save + Danger Zone */}
      <div className="px-6 py-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {saveLabel}
              </>
            )}
          </Button>
          {saveSuccess && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <Check className="h-4 w-4" />
              Saved successfully
            </span>
          )}
        </div>

        {showDangerZone && (
          <div className="border border-red-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-red-600">
                  Danger Zone
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {dangerZoneDescription}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => actions?.onDeleteAccount?.()}
                className="text-red-600 border-red-200 hover:bg-red-50 shrink-0 gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleteAccountLabel}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
