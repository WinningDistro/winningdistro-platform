import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Music,
  TrendingUp,
  DollarSign,
  Users,
  Upload,
  Play,
  BarChart3,
  Settings,
  Plus,
  Calendar,
  Globe,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsAPI, musicAPI } from '@/lib/api';
import MusicUpload from '@/components/upload/MusicUpload';
import AnalyticsCharts from '@/components/analytics/AnalyticsCharts';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Fetch dashboard stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: analyticsAPI.getDashboardStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch releases
  const { data: releases, isLoading: isLoadingReleases } = useQuery({
    queryKey: ['releases'],
    queryFn: musicAPI.getReleases,
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const dashboardStats = [
    {
      title: 'Total Streams',
      value: stats?.data ? formatNumber(stats.data.totalStreams) : '0',
      change: stats?.data ? `+${stats.data.growth.streams}%` : '+0%',
      changeType: 'positive',
      icon: Play,
    },
    {
      title: 'Monthly Revenue',
      value: stats?.data ? formatCurrency(stats.data.monthlyRevenue) : '$0',
      change: stats?.data ? `+${stats.data.growth.revenue}%` : '+0%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Total Followers',
      value: stats?.data ? formatNumber(stats.data.totalFollowers) : '0',
      change: stats?.data ? `+${stats.data.growth.followers}%` : '+0%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Countries Reached',
      value: stats?.data ? stats.data.countriesReached.toString() : '0',
      change: stats?.data ? `+${stats.data.growth.countries}` : '+0',
      changeType: 'positive',
      icon: Globe,
    },
  ];



  const topPlatforms = [
    { name: 'Spotify', streams: '567,234', percentage: 45 },
    { name: 'Apple Music', streams: '312,156', percentage: 25 },
    { name: 'YouTube Music', streams: '187,293', percentage: 15 },
    { name: 'Amazon Music', streams: '124,862', percentage: 10 },
    { name: 'Others', streams: '62,431', percentage: 5 },
  ];

  const upcomingTasks = [
    { task: 'Upload new single artwork', deadline: '2024-03-20', priority: 'high' },
    { task: 'Review marketing campaign analytics', deadline: '2024-03-22', priority: 'medium' },
    { task: 'Submit next release for distribution', deadline: '2024-03-25', priority: 'high' },
    { task: 'Update artist profile information', deadline: '2024-03-30', priority: 'low' },
  ];

  return (
    <div className="min-h-screen p-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gold mb-2">
                Welcome back, {user?.artistName || user?.name}!
              </h1>
              <p className="text-white">Here's what's happening with your music today.</p>
            </div>
            <div className="flex gap-3">
              <Button
                className="btn-primary"
                onClick={() => setActiveTab('upload')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New Release
              </Button>
              <Button variant="outline" className="btn-secondary">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-zinc-900 border border-green">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-green data-[state=active]:text-black">
              Upload Music
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green data-[state=active]:text-black">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="releases" className="data-[state=active]:bg-green data-[state=active]:text-black">
              My Releases
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardStats.map((stat, index) => (
                <Card key={index} className="bg-zinc-900 border-green">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-medium">{stat.title}</p>
                        <p className="text-2xl font-bold text-gold">
                          {isLoadingStats ? '...' : stat.value}
                        </p>
                        <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green' : 'text-red-400'}`}>
                          {isLoadingStats ? '...' : stat.change} from last month
                        </p>
                      </div>
                      <div className="p-3 bg-green rounded-lg">
                        <stat.icon className="h-6 w-6 text-black" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Releases */}
          <Card className="bg-zinc-900 border-green">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gold">Recent Releases</CardTitle>
                <Button variant="outline" size="sm" className="btn-secondary">
                  <Plus className="h-4 w-4 mr-2" />
                  New Release
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingReleases ? (
                  <div className="text-white text-center py-8">Loading releases...</div>
                ) : releases?.data?.length > 0 ? (
                  releases.data.slice(0, 3).map((release: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-black rounded border border-green">
                      <div className="flex items-center space-x-4">
                        {release.artwork ? (
                          <img
                            src={release.artwork}
                            alt={release.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-green rounded flex items-center justify-center">
                            <Music className="h-6 w-6 text-black" />
                          </div>
                        )}
                        <div>
                          <p className="text-gold font-medium">{release.title}</p>
                          <p className="text-white text-sm">{new Date(release.releaseDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{formatNumber(release.totalStreams)} streams</p>
                        <p className="text-green text-sm">{release.platforms} platforms</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white mb-2">No releases yet</p>
                    <p className="text-gray-400 text-sm">Upload your first track to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Platforms */}
          <Card className="bg-zinc-900 border-green">
            <CardHeader>
              <CardTitle className="text-gold">Top Platforms</CardTitle>
              <CardDescription className="text-white">Your music performance by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPlatforms.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green rounded flex items-center justify-center">
                        <Music className="h-4 w-4 text-black" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{platform.name}</p>
                        <p className="text-green text-sm">{platform.streams} streams</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gold font-medium">{platform.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analytics Quick View */}
          <Card className="bg-zinc-900 border-green lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gold">Analytics Overview</CardTitle>
                <Button asChild variant="outline" size="sm" className="btn-secondary">
                  <Link to="/analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Full Analytics
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black p-4 rounded border border-green">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">This Week</span>
                    <TrendingUp className="h-4 w-4 text-green" />
                  </div>
                  <p className="text-2xl font-bold text-gold">89,432</p>
                  <p className="text-green text-sm">+23% vs last week</p>
                </div>
                <div className="bg-black p-4 rounded border border-green">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">This Month</span>
                    <DollarSign className="h-4 w-4 text-green" />
                  </div>
                  <p className="text-2xl font-bold text-gold">$1,234</p>
                  <p className="text-green text-sm">+15% vs last month</p>
                </div>
                <div className="bg-black p-4 rounded border border-green">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">New Fans</span>
                    <Users className="h-4 w-4 text-green" />
                  </div>
                  <p className="text-2xl font-bold text-gold">2,847</p>
                  <p className="text-green text-sm">+31% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="bg-zinc-900 border-green">
            <CardHeader>
              <CardTitle className="text-gold">Upcoming Tasks</CardTitle>
              <CardDescription className="text-white">Things to keep track of</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="p-3 bg-black rounded border border-green">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{task.task}</p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 text-green mr-1" />
                          <span className="text-green text-xs">{task.deadline}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-600 text-white' :
                        task.priority === 'medium' ? 'bg-yellow-600 text-white' :
                        'bg-green text-black'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-green">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-black mb-2">Ready to release new music?</h3>
                  <p className="text-black">Upload your tracks and get them distributed to 150+ platforms worldwide.</p>
                </div>
                <div className="flex gap-3">
                  <Button className="btn-primary">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Music
                  </Button>
                  <Button asChild variant="outline" className="border-black text-black hover:bg-black hover:text-green">
                    <Link to="/distribution">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <MusicUpload />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsCharts />
          </TabsContent>

          <TabsContent value="releases" className="space-y-6">
            <Card className="bg-black border-green">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gold">All Releases</CardTitle>
                  <Button
                    className="btn-primary"
                    onClick={() => setActiveTab('upload')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Release
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingReleases ? (
                  <div className="text-white text-center py-8">Loading releases...</div>
                ) : releases?.data?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {releases.data.map((release: any, index: number) => (
                      <Card key={index} className="bg-zinc-900 border-green">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4 mb-4">
                            {release.artwork ? (
                              <img
                                src={release.artwork}
                                alt={release.title}
                                className="w-16 h-16 rounded object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-green rounded flex items-center justify-center">
                                <Music className="h-8 w-8 text-black" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-gold font-medium">{release.title}</h3>
                              <p className="text-white text-sm">{release.artist}</p>
                              <p className="text-gray-400 text-xs">{release.type} • {new Date(release.releaseDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white">Total Streams:</span>
                              <span className="text-green font-medium">{formatNumber(release.totalStreams)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white">Revenue:</span>
                              <span className="text-green font-medium">{formatCurrency(release.revenue)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white">Platforms:</span>
                              <span className="text-green font-medium">{release.platforms}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white">Status:</span>
                              <span className="text-green font-medium capitalize">{release.status}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-gold text-xl font-semibold mb-2">No releases yet</h3>
                    <p className="text-white mb-6">Start your music journey by uploading your first track</p>
                    <Button
                      className="btn-primary"
                      onClick={() => setActiveTab('upload')}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Your First Track
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
