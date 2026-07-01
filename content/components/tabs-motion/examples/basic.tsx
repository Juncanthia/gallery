import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsContent,
} from "@/components/blocks/tabs-motion"

export default function TabsMotionBasicExample() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContents>
        <TabsContent value="account">
          <div className="space-y-2 text-sm">
            <p className="font-medium">Account settings</p>
            <p className="text-muted-foreground">
              Manage your account preferences and personal information.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="password">
          <div className="space-y-2 text-sm">
            <p className="font-medium">Change password</p>
            <p className="text-muted-foreground">
              Update your password to keep your account secure.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="space-y-2 text-sm">
            <p className="font-medium">Notification settings</p>
            <p className="text-muted-foreground">
              Configure how you receive alerts and updates.
            </p>
          </div>
        </TabsContent>
      </TabsContents>
    </Tabs>
  )
}
