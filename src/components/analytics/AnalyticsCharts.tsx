import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, TrendingUp, DollarSign, Users, Music } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { analyticsAPI } from '@/lib/api';

const COLORS = {
  primary: '#FFB400', // gold
  secondary: '#007847', // green
  accent: '#ffffff',
  muted: '#666666',
  platforms: ['#FFB400', '#007847', '#4CAF50', '#FFC107', '#FF9800', '#9C27B0'],
};

interface StreamingData {
  date: string;
  streams: number;
  revenue: number;
  newFollowers: number;
}

const AnalyticsCharts = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('streams');

  // Fetch analytics data
  const { data: streamingData, isLoading: isLoadingStreaming } = useQuery({
    queryKey: ['analytics', 'streaming', timeRange],
    queryFn: () => analyticsAPI.getStreamingData(timeRange),
  });

  const { data: platformData, isLoading: isLoadingPlatforms } = useQuery({
    queryKey: ['analytics', 'platforms'],
    queryFn: () => analyticsAPI.getPlatformBreakdown(),
  });

  const { data: topTracks, isLoading: isLoadingTracks } = useQuery({
    queryKey: ['analytics', 'topTracks'],
    queryFn: () => analyticsAPI.getTopTracks(),
  });

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-green p-3 rounded-lg shadow-lg">
          <p className="text-gold font-medium">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={`tooltip-${index}`} style={{ color: pld.color }} className="text-sm">
              {pld.dataKey === 'revenue'
                ? `${pld.name}: ${formatCurrency(pld.value)}`
                : `${pld.name}: ${formatNumber(pld.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gold">Analytics Dashboard</h2>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-zinc-900 border-green text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-zinc-900 border border-green">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green data-[state=active]:text-black">
            Overview
          </TabsTrigger>
          <TabsTrigger value="platforms" className="data-[state=active]:bg-green data-[state=active]:text-black">
            Platforms
          </TabsTrigger>
          <TabsTrigger value="tracks" className="data-[state=active]:bg-green data-[state=active]:text-black">
            Top Tracks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Streams Over Time */}
            <Card className="bg-black border-green">
              <CardHeader>
                <CardTitle className="text-gold flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Streams Over Time
                </CardTitle>
                <CardDescription className="text-white">
                  Track your streaming performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStreaming ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-white">Loading...</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={(streamingData as any)?.data || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#D4AF37" />
                      <YAxis stroke="#D4AF37" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="streams"
                        stackId="1"
                        stroke="#22C55E"
                        fill="#22C55E"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Revenue Over Time */}
            <Card className="bg-black border-green">
              <CardHeader>
                <CardTitle className="text-gold flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Revenue Over Time
                </CardTitle>
                <CardDescription className="text-white">
                  Monitor your earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStreaming ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-white">Loading...</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={(streamingData as any)?.data || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#D4AF37" />
                      <YAxis stroke="#D4AF37" />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#D4AF37"
                        strokeWidth={2}
                        dot={{ fill: '#D4AF37', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Combined Metrics Chart */}
          <Card className="bg-black border-green">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gold flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Growth Metrics
                  </CardTitle>
                  <CardDescription className="text-white">
                    Streams, revenue, and follower growth
                  </CardDescription>
                </div>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-40 bg-zinc-900 border-green text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="streams">Streams</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="newFollowers">New Followers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingStreaming ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-white">Loading...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={(streamingData as any)?.data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#D4AF37" />
                    <YAxis stroke="#D4AF37" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="streams"
                      stackId="1"
                      stroke="#22C55E"
                      fill="#22C55E"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="2"
                      stroke="#D4AF37"
                      fill="#D4AF37"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Pie Chart */}
            <Card className="bg-black border-green">
              <CardHeader>
                <CardTitle className="text-gold">Platform Distribution</CardTitle>
                <CardDescription className="text-white">
                  Streams by platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPlatforms ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-white">Loading...</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={(platformData as any)?.data || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="streams"
                        labelLine={false}
                      >
                        {((platformData as any)?.data || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS.platforms[index % COLORS.platforms.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value}%`, name]}
                        contentStyle={{
                          backgroundColor: '#000',
                          border: '1px solid #007847',
                          borderRadius: '8px',
                          color: '#FFB400'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Platform Revenue Chart */}
            <Card className="bg-black border-green">
              <CardHeader>
                <CardTitle className="text-gold">Revenue by Platform</CardTitle>
                <CardDescription className="text-white">
                  Earnings breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPlatforms ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-white">Loading...</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={(platformData as any)?.data || []} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis type="number" stroke="#D4AF37" />
                      <YAxis dataKey="name" type="category" stroke="#D4AF37" width={100} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="streams" fill="#22C55E" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tracks" className="space-y-6">
          <Card className="bg-black border-green">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <Music className="h-5 w-5 mr-2" />
                Top Performing Tracks
              </CardTitle>
              <CardDescription className="text-white">
                Your most successful releases
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTracks ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-white">Loading...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={(topTracks as any)?.data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="title" stroke="#D4AF37" />
                    <YAxis stroke="#D4AF37" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="streams" fill="#22C55E" />
                    <Bar dataKey="revenue" fill="#D4AF37" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsCharts;
