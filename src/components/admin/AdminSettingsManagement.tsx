
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useToast } from "@/hooks/use-toast";
import { Settings, Key, LogOut, Shield, Eye, Edit, UserCog } from "lucide-react";
import { UserManagement } from "./UserManagement";

export const AdminSettingsManagement = () => {
  const { signOut } = useAuth();
  const { permissions } = useUserPermissions();
  const { settings, changePassword } = useAdminSettings();
  const { toast } = useToast();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error", 
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
    if (result.success) {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!permissions?.settings_read && !permissions?.is_super_admin) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            <Shield size={48} className="mx-auto mb-4" />
            <p>You don't have permission to access admin settings.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tabCount = permissions?.is_super_admin ? 3 : 2;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className={`bg-gray-900 border-gray-800 grid w-full grid-cols-${tabCount}`}>
          <TabsTrigger 
            value="security" 
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
          >
            <Key size={16} />
            Security
          </TabsTrigger>
          <TabsTrigger 
            value="general" 
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
          >
            <Settings size={16} />
            General
          </TabsTrigger>
          {permissions?.is_super_admin && (
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
            >
              <UserCog size={16} />
              User Management
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Key size={20} />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="text-gray-200">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type={showPasswords ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword" className="text-gray-200">New Password</Label>
                  <Input
                    id="newPassword"
                    type={showPasswords ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-200">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPasswords ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-passwords"
                    checked={showPasswords}
                    onCheckedChange={setShowPasswords}
                  />
                  <Label htmlFor="show-passwords" className="text-gray-300">Show passwords</Label>
                </div>
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings size={20} />
                Current Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Analytics</Label>
                    <div className="flex gap-2">
                      <Badge variant={permissions?.analytics_read ? "default" : "secondary"}>
                        <Eye size={12} className="mr-1" />
                        Read: {permissions?.analytics_read ? 'Yes' : 'No'}
                      </Badge>
                      <Badge variant={permissions?.analytics_write ? "default" : "secondary"}>
                        <Edit size={12} className="mr-1" />
                        Write: {permissions?.analytics_write ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Hero Section</Label>
                    <div className="flex gap-2">
                      <Badge variant={permissions?.hero_read ? "default" : "secondary"}>
                        <Eye size={12} className="mr-1" />
                        Read: {permissions?.hero_read ? 'Yes' : 'No'}
                      </Badge>
                      <Badge variant={permissions?.hero_write ? "default" : "secondary"}>
                        <Edit size={12} className="mr-1" />
                        Write: {permissions?.hero_write ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Projects</Label>
                    <div className="flex gap-2">
                      <Badge variant={permissions?.projects_read ? "default" : "secondary"}>
                        <Eye size={12} className="mr-1" />
                        Read: {permissions?.projects_read ? 'Yes' : 'No'}
                      </Badge>
                      <Badge variant={permissions?.projects_write ? "default" : "secondary"}>
                        <Edit size={12} className="mr-1" />
                        Write: {permissions?.projects_write ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Team</Label>
                    <div className="flex gap-2">
                      <Badge variant={permissions?.team_read ? "default" : "secondary"}>
                        <Eye size={12} className="mr-1" />
                        Read: {permissions?.team_read ? 'Yes' : 'No'}
                      </Badge>
                      <Badge variant={permissions?.team_write ? "default" : "secondary"}>
                        <Edit size={12} className="mr-1" />
                        Write: {permissions?.team_write ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
                {permissions?.is_super_admin && (
                  <div className="pt-4 border-t border-gray-700">
                    <Badge variant="default" className="bg-red-600">
                      <Shield size={12} className="mr-1" />
                      Super Administrator
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <LogOut size={20} />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-400">Sign out of the admin panel and return to the login page.</p>
                <Button 
                  onClick={handleSignOut}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {permissions?.is_super_admin && (
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
