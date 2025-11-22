import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { AUTH } from '@/services/authService';
import USERS from '@/services/userService';

const Settings = () => {

  const [user, setUser] = useState(null)

  useEffect(()=>{
    const fetchUser = async () => {
      const u = await AUTH.getUser();
      setUser(u);
    }
    fetchUser();
  }, []);

  const handleSaveUser = async () => {
    const response = await USERS.UPDATE(user?.id, user);
    if (response.status !== 200) {
      // error
      console.log('Error saving user', response);
      return;
    }
    localStorage.setItem('user', JSON.stringify(user))
  }

  const handleLogout = () => {
    console.log("User logged out");
    localStorage.removeItem("user");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your personal information and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Name</Label>
                <Input id="firstName" placeholder="John" 
                  value={user?.name} onChange={(e)=>setUser({...user, name: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com"
                    value={user?.email} onChange={(e)=>setUser({...user, email: e.target.value})} />
                </div>
              </div>
            </div>
            <Button onClick={handleSaveUser}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications on your devices
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Get weekly performance summaries
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logout</CardTitle>
            <CardDescription>
              Sign out of your account and return to the login page.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button 
              className="w-full" 
              variant="destructive"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Settings;
