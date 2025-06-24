
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, Eye, MousePointer, TrendingUp } from "lucide-react";

export const AnalyticsDashboard = () => {
  // Mock data for analytics
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
    <div className="space-y-6">
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
    </div>
  );
};
