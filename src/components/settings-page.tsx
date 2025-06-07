"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Settings as SettingsIcon,
  Bell,
  Users,
  DollarSign,
  Mail,
  Smartphone,
  Save,
  Plus,
  Trash2,
  Edit
} from "lucide-react"

interface NotificationSetting {
  id: string
  type: string
  label: string
  email: boolean
  sms: boolean
  push: boolean
}

interface ThresholdSetting {
  id: string
  metric: string
  property: string
  condition: string
  value: number
  unit: string
}

const mockNotifications: NotificationSetting[] = [
  {
    id: "1",
    type: "occupancy",
    label: "Low occupancy alerts",
    email: true,
    sms: false,
    push: true
  },
  {
    id: "2", 
    type: "revenue",
    label: "Revenue threshold alerts",
    email: true,
    sms: true,
    push: true
  },
  {
    id: "3",
    type: "satisfaction",
    label: "Guest satisfaction drops",
    email: false,
    sms: false,
    push: true
  },
  {
    id: "4",
    type: "staffing",
    label: "Staffing level alerts",
    email: true,
    sms: false,
    push: false
  }
]

const mockThresholds: ThresholdSetting[] = [
  {
    id: "1",
    metric: "Occupancy Rate",
    property: "All Properties",
    condition: "below",
    value: 65,
    unit: "%"
  },
  {
    id: "2",
    metric: "RevPAR Delta",
    property: "All Properties", 
    condition: "below",
    value: -5,
    unit: "%"
  },
  {
    id: "3",
    metric: "Staff Utilization",
    property: "Surfers Paradise Resort",
    condition: "below",
    value: 70,
    unit: "%"
  }
]

export function SettingsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [thresholds, setThresholds] = useState(mockThresholds)
  const [emailAddress, setEmailAddress] = useState("manager@travla.com")
  const [smsNumber, setSmsNumber] = useState("+61412345678")

  const updateNotification = (id: string, field: keyof NotificationSetting, value: boolean) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, [field]: value } : notif
    ))
  }

  return (
    <Tabs defaultValue="notifications" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
        <TabsTrigger value="properties">Properties</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>

      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Configure how and when you receive alerts about your properties.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input 
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SMS Number</label>
                <Input 
                  type="tel"
                  value={smsNumber}
                  onChange={(e) => setSmsNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Alert Types</h4>
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{notification.label}</div>
                      <div className="text-sm text-muted-foreground">{notification.type}</div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Switch 
                          checked={notification.email}
                          onCheckedChange={(checked) => updateNotification(notification.id, 'email', checked)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <Switch 
                          checked={notification.sms}
                          onCheckedChange={(checked) => updateNotification(notification.id, 'sms', checked)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Switch 
                          checked={notification.push}
                          onCheckedChange={(checked) => updateNotification(notification.id, 'push', checked)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="thresholds" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Alert Thresholds
            </CardTitle>
            <CardDescription>
              Set custom thresholds for automated alerts and recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-end">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Threshold
              </Button>
            </div>

            <div className="space-y-3">
              {thresholds.map(threshold => (
                <div key={threshold.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{threshold.metric}</div>
                    <div className="text-sm text-muted-foreground">
                      {threshold.property} • {threshold.condition} {threshold.value}{threshold.unit}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="properties" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Property Management
            </CardTitle>
            <CardDescription>
              Add, edit, or remove properties from your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-end">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { name: "Surfers Paradise Resort", location: "Gold Coast, QLD", emoji: "🌊", status: "Active" },
                { name: "Byron Bay Beachfront", location: "Byron Bay, NSW", emoji: "🏖️", status: "Active" },
                { name: "Melbourne CBD Tower", location: "Melbourne, VIC", emoji: "🌳", status: "Active" }
              ].map((property, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{property.emoji}</span>
                    <div>
                      <div className="font-medium">{property.name}</div>
                      <div className="text-sm text-muted-foreground">{property.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">{property.status}</Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="account" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account preferences and access controls.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name</label>
                <Input defaultValue="General Manager" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select defaultValue="gm">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gm">General Manager</SelectItem>
                    <SelectItem value="revenue">Revenue Manager</SelectItem>
                    <SelectItem value="ops">Operations Manager</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Zone</label>
                <Select defaultValue="aest">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aest">AEST (UTC+10)</SelectItem>
                    <SelectItem value="aedt">AEDT (UTC+11)</SelectItem>
                    <SelectItem value="awst">AWST (UTC+8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Dashboard Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Real-time Updates</div>
                    <div className="text-sm text-muted-foreground">Refresh data every 3 seconds</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Sound Notifications</div>
                    <div className="text-sm text-muted-foreground">Play sound for high-priority alerts</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Compact Mode</div>
                    <div className="text-sm text-muted-foreground">Show more data in less space</div>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
