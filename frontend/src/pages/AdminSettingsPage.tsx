import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';
import { LogOut, BarChart2, Shield, User, Mail, Save, Trash2 } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const AdminSettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      const response = await userAPI.updateProfile(data);
      updateUser(response.user);
      toast.success('Profile updated successfully');
      reset(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    setLoading(true);
    try {
      await userAPI.deleteProfile();
      toast.success('Account deleted successfully');
      logout();
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
      setDeleteConfirm(false);
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold">Admin Settings</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Welcome, {user?.name}</span>
            <ThemeToggle />
            <Link to="/admin/statistics" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">Statistics</Link>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              <LogOut className="inline h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-background shadow rounded-lg border border-border">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Personal Information</h2>
            <div className="flex items-center gap-4 mb-6">
              <Shield className="h-10 w-10 text-purple-600" />
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold gap-1 bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200 mt-2">
                <Shield className="h-4 w-4" /> Admin
              </span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !isDirty}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-gray-200 px-6 py-8">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-red-800">Delete Account</h4>
                  <p className="text-sm text-red-600 mt-1">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleteConfirm ? 'Click again to confirm' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettingsPage; 