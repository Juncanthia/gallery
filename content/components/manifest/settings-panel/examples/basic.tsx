import { SettingsPanel } from "@/components/ui/manifest-settings-panel"

export default function Demo() {
  return (
    <div className="w-full max-w-4xl">
      <SettingsPanel
        data={{
          title: "Settings",
          subtitle: "Manage your account settings and preferences.",
          profileDefaults: {
            displayName: "Zhang San",
            email: "zhangsan@example.com",
            bio: "Full-stack developer",
          },
        }}
        actions={{
          onSave: (settings) => console.log("Settings saved:", settings),
          onDeleteAccount: () => console.log("Delete account requested"),
        }}
      />
    </div>
  )
}
