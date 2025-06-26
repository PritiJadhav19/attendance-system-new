
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { BellRing, BookOpen, Mail, Save, UserRound } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure your attendance system preferences
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage basic system configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Institution Name</label>
                <Input defaultValue="Engineering College" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Academic Year</label>
                <Select defaultValue="2023-2024">
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2022-2023">2022-2023</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Current Semester</label>
                <Select defaultValue="fall-2023">
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring-2023">Spring 2023</SelectItem>
                    <SelectItem value="fall-2023">Fall 2023</SelectItem>
                    <SelectItem value="spring-2024">Spring 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                    (day) => (
                      <div key={day} className="flex items-center gap-2">
                        <Switch defaultChecked={day !== "Saturday"} id={day} />
                        <label htmlFor={day} className="text-sm">
                          {day}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Format</label>
                <Select defaultValue="mdy">
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto gap-2" onClick={handleSaveSettings}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Rules</CardTitle>
              <CardDescription>
                Configure attendance tracking settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Attendance Required</label>
                <div className="flex gap-4 items-center">
                  <Input
                    type="number"
                    defaultValue="75"
                    className="w-24"
                    min="0"
                    max="100"
                  />
                  <span>%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Students below this percentage will be flagged in reports
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium">Attendance Marking Method</label>
                <Select defaultValue="manual">
                  <SelectTrigger>
                    <SelectValue placeholder="Select marking method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                    <SelectItem value="biometric">Biometric</SelectItem>
                    <SelectItem value="qr">QR Code</SelectItem>
                    <SelectItem value="rfid">RFID</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Auto-Calculate Attendance</h4>
                    <p className="text-sm text-muted-foreground">
                      System will automatically calculate attendance percentages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Allow Leave Applications</h4>
                    <p className="text-sm text-muted-foreground">
                      Students can submit leave applications
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Allow Late Marking</h4>
                    <p className="text-sm text-muted-foreground">
                      Faculty can mark attendance after class hours
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto gap-2" onClick={handleSaveSettings}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure alerts and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <BellRing className="h-4 w-4" />
                  Alert Triggers
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">Low Attendance Warning</h5>
                      <p className="text-sm text-muted-foreground">
                        Send notification when student attendance falls below 80%
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">Critical Attendance Alert</h5>
                      <p className="text-sm text-muted-foreground">
                        Send notification when student attendance falls below 75%
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">Daily Attendance Summary</h5>
                      <p className="text-sm text-muted-foreground">
                        Send daily attendance summary to faculty
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">Weekly Reports</h5>
                      <p className="text-sm text-muted-foreground">
                        Send weekly attendance reports to department heads
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Notification Methods
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">Email Notifications</h5>
                      <p className="text-sm text-muted-foreground">
                        Send notifications via email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">SMS Notifications</h5>
                      <p className="text-sm text-muted-foreground">
                        Send notifications via SMS
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">In-App Notifications</h5>
                      <p className="text-sm text-muted-foreground">
                        Show notifications in the application
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto gap-2" onClick={handleSaveSettings}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  Personal Information
                </h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input defaultValue="Admin User" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input defaultValue="admin@engineering.edu" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input defaultValue="+1 (555) 123-4567" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Change Password
                </h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <Input type="password" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input type="password" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <Input type="password" />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Additional security for your account
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto gap-2" onClick={handleSaveSettings}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
