
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { BarChart3, FolderOpen, Users, Settings, Home, LogOut, Key, Shield, Code2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { ProjectManagement } from "./admin/ProjectManagement";
import { TeamManagement } from "./admin/TeamManagement";
import { SettingsManagement } from "./admin/SettingsManagement";
import { AnalyticsDashboard } from "./admin/AnalyticsDashboard";
import { HeroManagement } from "./admin/HeroManagement";
import { AdminSettingsManagement } from "./admin/AdminSettingsManagement";
import { SkillsManagement } from "./admin/SkillsManagement";
import { useState } from "react";

export const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { permissions, loading } = useUserPermissions();
  const [showAdminSettings, setShowAdminSettings] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading admin panel...</div>
      </div>
    );
  }

  if (showAdminSettings) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="border-b border-gray-800 bg-gray-900">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <Button
                  onClick={() => setShowAdminSettings(false)}
                  variant="ghost"
                  className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                >
                  ← Back to Dashboard
                </Button>
                <h1 className="text-2xl font-bold text-white mt-2">Admin Settings</h1>
                <p className="text-gray-300">Manage admin panel configuration and security</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-6">
          <AdminSettingsManagement />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300">Manage your portfolio content and settings</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-500"
                >
                  <Settings size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-gray-800 border-gray-700 text-white"
              >
                <DropdownMenuItem 
                  onClick={() => setShowAdminSettings(true)}
                  className="hover:bg-gray-700 cursor-pointer"
                >
                  <Settings size={16} className="mr-2" />
                  Admin Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                  <Key size={16} className="mr-2" />
                  Change Password
                </DropdownMenuItem>
                {permissions?.is_super_admin && (
                  <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                    <Shield size={16} className="mr-2" />
                    User Management
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="hover:bg-red-700 cursor-pointer text-red-400 hover:text-red-300"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800 grid w-full grid-cols-6">
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
              disabled={!permissions?.analytics_read && !permissions?.is_super_admin}
            >
              <BarChart3 size={16} />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="hero" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
              disabled={!permissions?.hero_read && !permissions?.is_super_admin}
            >
              <Home size={16} />
              Hero
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
              disabled={!permissions?.projects_read && !permissions?.is_super_admin}
            >
              <FolderOpen size={16} />
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
              disabled={!permissions?.team_read && !permissions?.is_super_admin}
            >
              <Users size={16} />
              Team
            </TabsTrigger>
            <TabsTrigger 
              value="skills" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
            >
              <Code2 size={16} />
              Skills
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
            >
              <Settings size={16} />
              Portfolio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {(permissions?.analytics_read || permissions?.is_super_admin) ? (
              <AnalyticsDashboard />
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Shield size={48} className="mx-auto mb-4" />
                <p>You don't have permission to view analytics.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hero" className="space-y-6">
            {(permissions?.hero_read || permissions?.is_super_admin) ? (
              <HeroManagement />
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Shield size={48} className="mx-auto mb-4" />
                <p>You don't have permission to view hero management.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            {(permissions?.projects_read || permissions?.is_super_admin) ? (
              <ProjectManagement />
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Shield size={48} className="mx-auto mb-4" />
                <p>You don't have permission to view project management.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            {(permissions?.team_read || permissions?.is_super_admin) ? (
              <TeamManagement />
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Shield size={48} className="mx-auto mb-4" />
                <p>You don't have permission to view team management.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <SkillsManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
