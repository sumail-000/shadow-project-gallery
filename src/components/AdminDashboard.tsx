
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, Eye, MousePointer, TrendingUp, Upload, Settings } from "lucide-react";

export const AdminDashboard = () => {
  // Mock data - in real implementation, this would come from your backend real data
  const analyticsData = [
    { name: "Mon", visitors: 120, views: 180 },
    { name: "Tue", visitors: 150, views: 220 },
    { name: "Wed", visitors: 180, views: 280 },
    { name: "Thu", visitors: 200, views: 320 },
    { name: "Fri", visitors: 250, views: 400 },
    { name: "Sat", visitors: 300, views: 450 },
    { name: "Sun", visitors: 280, views: 420 },
  ];

  const projectStats = [
    { project: "E-commerce App", views: 1250, clicks: 85, location: "US: 45%, EU: 30%, Asia: 25%" },
    { project: "Portfolio Website", views: 980, clicks: 72, location: "US: 40%, EU: 35%, Others: 25%" },
    { project: "Task Manager", views: 750, clicks: 58, location: "US: 50%, EU: 25%, Asia: 25%" },
    { project: "Weather App", views: 620, clicks: 41, location: "Global: 100%" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your portfolio and track analytics</p>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-800">Analytics</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-gray-800">Project Management</TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-gray-800">Team Management</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gray-800">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Visitors</p>
                      <p className="text-2xl font-bold">1,280</p>
                    </div>
                    <Users className="text-blue-400" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Page Views</p>
                      <p className="text-2xl font-bold">2,270</p>
                    </div>
                    <Eye className="text-green-400" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Project Clicks</p>
                      <p className="text-2xl font-bold">256</p>
                    </div>
                    <MousePointer className="text-purple-400" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Growth Rate</p>
                      <p className="text-2xl font-bold">+23%</p>
                    </div>
                    <TrendingUp className="text-yellow-400" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Visitor Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '6px'
                        }} 
                      />
                      <Bar dataKey="visitors" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Page Views Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '6px'
                        }} 
                      />
                      <Line type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Project Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-300">Project</TableHead>
                      <TableHead className="text-gray-300">Views</TableHead>
                      <TableHead className="text-gray-300">Clicks</TableHead>
                      <TableHead className="text-gray-300">Geographic Distribution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectStats.map((project, index) => (
                      <TableRow key={index} className="border-gray-800">
                        <TableCell className="text-white">{project.project}</TableCell>
                        <TableCell className="text-gray-300">{project.views}</TableCell>
                        <TableCell className="text-gray-300">{project.clicks}</TableCell>
                        <TableCell className="text-gray-300">{project.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload size={20} />
                  Add New Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input id="title" placeholder="Enter project title" className="bg-gray-800 border-gray-700" />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" placeholder="2024" className="bg-gray-800 border-gray-700" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea 
                    id="description" 
                    placeholder="Enter project description"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input id="github" placeholder="https://github.com/..." className="bg-gray-800 border-gray-700" />
                  </div>
                  <div>
                    <Label htmlFor="live">Live URL</Label>
                    <Input id="live" placeholder="https://..." className="bg-gray-800 border-gray-700" />
                  </div>
                </div>
                <Button className="bg-white text-black hover:bg-gray-200">Add Project</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberName">Name</Label>
                    <Input id="memberName" placeholder="Enter team member name" className="bg-gray-800 border-gray-700" />
                  </div>
                  <div>
                    <Label htmlFor="memberRole">Role</Label>
                    <Input id="memberRole" placeholder="Enter role" className="bg-gray-800 border-gray-700" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="memberBio">Bio</Label>
                  <textarea 
                    id="memberBio" 
                    placeholder="Enter bio"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                <Button className="bg-white text-black hover:bg-gray-200">Add Team Member</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings size={20} />
                  Portfolio Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="portfolioTitle">Portfolio Title</Label>
                  <Input id="portfolioTitle" defaultValue="Portfolio" className="bg-gray-800 border-gray-700" />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" defaultValue="your.email@example.com" className="bg-gray-800 border-gray-700" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" className="bg-gray-800 border-gray-700" />
                </div>
                <Button className="bg-white text-black hover:bg-gray-200">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
