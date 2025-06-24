
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart3, FolderOpen, Users, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ProjectManagement } from "./admin/ProjectManagement";
import { TeamManagement } from "./admin/TeamManagement";
import { SettingsManagement } from "./admin/SettingsManagement";
import { AnalyticsDashboard } from "./admin/AnalyticsDashboard";

export const AdminDashboard = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400">Manage your portfolio content and settings</p>
            </div>
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800 grid w-full grid-cols-4">
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-gray-800 flex items-center gap-2"
            >
              <BarChart3 size={16} />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="data-[state=active]:bg-gray-800 flex items-center gap-2"
            >
              <FolderOpen size={16} />
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="data-[state=active]:bg-gray-800 flex items-center gap-2"
            >
              <Users size={16} />
              Team
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-gray-800 flex items-center gap-2"
            >
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <ProjectManagement />
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <TeamManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
