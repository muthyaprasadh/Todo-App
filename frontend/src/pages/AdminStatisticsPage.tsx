import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userAPI } from '@/utils/api';
import { LogOut, BarChart2, User as UserIcon, Shield } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface UserStat {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  taskCount: number;
}

const AdminStatisticsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalAdmins: number;
    userStats: UserStat[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    setFetching(true);
    userAPI.getStatistics()
      .then(setStats)
      .catch((err) => {
        setError(err?.response?.data?.message || 'Failed to fetch statistics');
      })
      .finally(() => setFetching(false));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user '${userName}'? This cannot be undone.`)) return;
    try {
      await userAPI.deleteUserByAdmin(userId);
      toast.success(`User '${userName}' deleted successfully.`);
      // Refresh stats
      const updatedStats = await userAPI.getStatistics();
      setStats(updatedStats);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete user');
    }
  };

  if (!user || user.role !== 'admin') return <div>Access denied. Admins only.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar/Header */}
      <header className="shadow bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BarChart2 className="h-7 w-7 text-blue-600" />
            <h1 className="text-2xl font-bold">Admin Statistics</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Welcome, {user?.name}</span>
            <ThemeToggle />
            <Link to="/admin/settings" className="text-blue-600 hover:underline flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              <LogOut className="inline h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold mb-6">User & Task Report</h2>
        {fetching && <div>Loading statistics...</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {stats && (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-6 flex items-center gap-4 shadow">
                <UserIcon className="h-10 w-10 text-blue-600" />
                <div>
                  <div className="text-3xl font-bold">{stats.totalUsers}</div>
                  <div className="text-blue-800 dark:text-blue-200 font-semibold">Total Users</div>
                </div>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-6 flex items-center gap-4 shadow">
                <Shield className="h-10 w-10 text-purple-600" />
                <div>
                  <div className="text-3xl font-bold">{stats.totalAdmins}</div>
                  <div className="text-purple-800 dark:text-purple-200 font-semibold">Total Admins</div>
                </div>
              </div>
            </div>

            {/* Admins Table */}
            <h3 className="text-lg font-semibold mb-2 mt-8">Admins</h3>
            <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow mb-8">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-3 border-b text-left">Name</th>
                    <th className="px-4 py-3 border-b text-left">Email</th>
                    <th className="px-4 py-3 border-b text-left">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.userStats.filter(u => u.role === 'admin').map((u, idx) => (
                    <tr key={u._id} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}>
                      <td className="px-4 py-3 border-b font-medium">{u.name}</td>
                      <td className="px-4 py-3 border-b">{u.email}</td>
                      <td className="px-4 py-3 border-b">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold gap-1 bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200">
                          <Shield className="h-4 w-4" /> Admin
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Users Table */}
            <h3 className="text-lg font-semibold mb-2 mt-8">Users</h3>
            <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-3 border-b text-left">Name</th>
                    <th className="px-4 py-3 border-b text-left">Email</th>
                    <th className="px-4 py-3 border-b text-left">Role</th>
                    <th className="px-4 py-3 border-b text-left">Task Count</th>
                    <th className="px-4 py-3 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.userStats.filter(u => u.role !== 'admin').map((u, idx) => (
                    <tr key={u._id} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}>
                      <td className="px-4 py-3 border-b font-medium">{u.name}</td>
                      <td className="px-4 py-3 border-b">{u.email}</td>
                      <td className="px-4 py-3 border-b">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold gap-1 bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                          <UserIcon className="h-4 w-4" /> User
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b">{u.taskCount}</td>
                      <td className="px-4 py-3 border-b text-center">
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          disabled={u._id === user._id}
                          title={u._id === user._id ? 'You cannot delete yourself' : 'Delete user'}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminStatisticsPage; 