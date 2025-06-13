import type React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Users,
  AlertTriangle,
  DollarSign,
  Music,
  Shield,
  Eye,
  UserX,
  UserCheck,
  Search,
  Filter
} from 'lucide-react';

interface User {
  id: number;
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  artist_name?: string;
  is_active: boolean;
  subscription_tier: string;
  total_uploads: number;
  total_revenue: number;
  created_at: string;
  last_login?: string;
  login_count: number;
}

interface DashboardStats {
  users: {
    total_users: number;
    active_users: number;
    new_today: number;
    active_today: number;
  };
  issues: {
    total_issues: number;
    open_issues: number;
    in_progress_issues: number;
    urgent_issues: number;
    new_today: number;
  };
  uploads: {
    total_uploads: number;
    live_uploads: number;
    pending_uploads: number;
    new_today: number;
  };
  revenue: {
    total_revenue: number;
    total_platform_fees: number;
    total_artist_payouts: number;
    total_transactions: number;
  };
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [masterKey, setMasterKey] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const API_BASE = 'http://localhost:3001/api';

  // Check for existing admin session
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      verifyAdminToken(savedToken);
    }
  }, []);

  const verifyAdminToken = async (adminToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid && data.type === 'admin') {
          setToken(adminToken);
          setIsAuthenticated(true);
          loadDashboardData(adminToken);
        } else {
          localStorage.removeItem('admin_token');
        }
      } else {
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('admin_token');
    }
  };

  const handleMasterLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/admin/master-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          masterKey,
          companyCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', data.token);

        toast.success(`Master Access Granted - Welcome ${data.admin.fullName}`);

        // Clear form
        setMasterKey('');
        setCompanyCode('');

        // Load dashboard data
        loadDashboardData(data.token);
      } else {
        toast.error(data.error || 'Invalid master credentials');
      }
    } catch (error) {
      toast.error('Failed to connect to admin server');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async (adminToken: string) => {
    try {
      // Load dashboard statistics
      const statsResponse = await fetch(`${API_BASE}/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load users
      const usersResponse = await fetch(`${API_BASE}/admin/users?limit=50`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setStats(null);
    setUsers([]);
    localStorage.removeItem('admin_token');
    toast.success('Admin session ended');
  };

  const toggleUserStatus = async (user: User) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/admin/users/${user.uuid}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !user.is_active,
          reason: `Admin ${user.is_active ? 'deactivated' : 'activated'} user account`
        })
      });

      if (response.ok) {
        // Update local user state
        setUsers(prev => prev.map(u =>
          u.uuid === user.uuid
            ? { ...u, is_active: !u.is_active }
            : u
        ));

        toast.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully`);
        setShowUserDialog(false);
        setSelectedUser(null);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update user status');
      }
    } catch (error) {
      toast.error('Failed to connect to server');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.artist_name && user.artist_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);

    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gold/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-gold" />
            </div>
            <CardTitle className="text-2xl text-gold">WinningDistro Admin</CardTitle>
            <CardDescription className="text-gray-400">
              Master Administrative Access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMasterLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="masterKey" className="text-gold">Master Key</Label>
                <Input
                  id="masterKey"
                  type="password"
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  placeholder="Enter master key"
                  className="bg-gray-800 border-gold/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyCode" className="text-gold">Company Code</Label>
                <Input
                  id="companyCode"
                  type="password"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  placeholder="Enter company code"
                  className="bg-gray-800 border-gold/20 text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gold text-black hover:bg-gold/90"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Access Admin Panel'}
              </Button>
            </form>
            <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-400">
              <p><strong>Master Key:</strong> WinningDistro-Master-2024!</p>
              <p><strong>Company Code:</strong> WDADMIN2024</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">WinningDistro Administrative Panel</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gold/20 text-gold hover:bg-gold/10"
          >
            Logout
          </Button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900 border-gold/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                <Users className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.users.total_users}</div>
                <p className="text-xs text-gray-400">
                  {stats.users.active_users} active • {stats.users.new_today} new today
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gold/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Support Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.issues.total_issues}</div>
                <p className="text-xs text-gray-400">
                  {stats.issues.open_issues} open • {stats.issues.urgent_issues} urgent
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gold/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Music Uploads</CardTitle>
                <Music className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.uploads.total_uploads}</div>
                <p className="text-xs text-gray-400">
                  {stats.uploads.live_uploads} live • {stats.uploads.pending_uploads} pending
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gold/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ${stats.revenue.total_revenue?.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-gray-400">
                  ${stats.revenue.total_platform_fees?.toFixed(2) || '0.00'} platform fees
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Management */}
        <Card className="bg-gray-900 border-gold/20">
          <CardHeader>
            <CardTitle className="text-gold">User Management</CardTitle>
            <CardDescription className="text-gray-400">
              View and manage all registered users
            </CardDescription>

            {/* Search and Filter */}
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gold/20 text-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-800 border border-gold/20 rounded-md px-3 py-2 text-white"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.uuid} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-medium text-white">
                        {user.first_name} {user.last_name}
                        {user.artist_name && (
                          <span className="text-gold ml-2">({user.artist_name})</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                      <div className="text-xs text-gray-500">
                        {user.total_uploads} uploads • ${user.total_revenue?.toFixed(2) || '0.00'} revenue
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={user.is_active ? "default" : "secondary"}
                      className={user.is_active ? "bg-green-600" : "bg-red-600"}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline" className="border-gold/20 text-gold">
                      {user.subscription_tier}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserDialog(true);
                      }}
                      className="border-gold/20 text-gold hover:bg-gold/10"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Action Dialog */}
        <AlertDialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <AlertDialogContent className="bg-gray-900 border-gold/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gold">
                User: {selectedUser?.first_name} {selectedUser?.last_name}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                {selectedUser?.email} • {selectedUser?.artist_name || 'No artist name'}
                <br />
                Status: {selectedUser?.is_active ? 'Active' : 'Inactive'}
                <br />
                Joined: {selectedUser && new Date(selectedUser.created_at).toLocaleDateString()}
                <br />
                Last Login: {selectedUser?.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : 'Never'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gold/20 text-white hover:bg-gray-800">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedUser && toggleUserStatus(selectedUser)}
                className={`${
                  selectedUser?.is_active
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {selectedUser?.is_active ? (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Deactivate User
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate User
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
