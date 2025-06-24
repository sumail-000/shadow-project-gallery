
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, Eye, MousePointer, TrendingUp, Database, TestTube } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

export const AnalyticsDashboard = () => {
  const [useRealData, setUseRealData] = useState(false);
  const { 
    realAnalyticsData, 
    dummyAnalyticsData, 
    realProjectStats, 
    dummyProjectStats, 
    isLoading 
  } = useAnalytics();

  // Choose data source based on toggle
  const analyticsData = useRealData ? realAnalyticsData : dummyAnalyticsData;
  const projectStats = useRealData ? realProjectStats : dummyProjectStats;

  // Calculate totals from current data
  const totalVisitors = analyticsData?.reduce((sum, day) => sum + day.visitors, 0) || 0;
  const totalViews = analyticsData?.reduce((sum, day) => sum + day.views, 0) || 0;
  const totalClicks = projectStats?.reduce((sum, project) => sum + project.clicks, 0) || 0;
  const growthRate = useRealData ? "+15%" : "+23%"; // Real data would calculate actual growth

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading analytics data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toggle Control */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TestTube className={`${!useRealData ? 'text-blue-400' : 'text-gray-500'}`} size={20} />
                <Label htmlFor="data-toggle" className="text-gray-300">Dummy Data</Label>
              </div>
              <Switch
                id="data-toggle"
                checked={useRealData}
                onCheckedChange={setUseRealData}
                className="data-[state=checked]:bg-green-600"
              />
              <div className="flex items-center space-x-2">
                <Database className={`${useRealData ? 'text-green-400' : 'text-gray-500'}`} size={20} />
                <Label htmlFor="data-toggle" className="text-gray-300">Real Data</Label>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Currently showing: {useRealData ? 'Live Analytics' : 'Demo Data'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Visitors</p>
                <p className="text-2xl font-bold text-white">{totalVisitors.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-white">{totalClicks}</p>
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
                <p className="text-2xl font-bold text-white">{growthRate}</p>
              </div>
              <TrendingUp className="text-yellow-400" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Visitor Analytics</CardTitle>
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
                    borderRadius: '6px',
                    color: '#FFFFFF'
                  }} 
                />
                <Bar dataKey="visitors" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Page Views Trend</CardTitle>
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
                    borderRadius: '6px',
                    color: '#FFFFFF'
                  }} 
                />
                <Line type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Project Performance Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Project Performance</CardTitle>
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
              {projectStats?.map((project, index) => (
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
