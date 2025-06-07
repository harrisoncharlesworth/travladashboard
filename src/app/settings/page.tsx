import { SettingsPage } from "@/components/settings-page"

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your dashboard preferences, alerts, and property settings.
        </p>
      </div>
      <SettingsPage />
    </div>
  )
}
