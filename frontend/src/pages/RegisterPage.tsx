import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    registerAsAdmin: false,
    adminCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.registerAsAdmin ? 'admin' : 'user',
        formData.registerAsAdmin ? formData.adminCode : undefined
      );
      // Get user from localStorage to check role
      const storedUser = localStorage.getItem('user');
      let role = 'user';
      if (storedUser) {
        try {
          role = JSON.parse(storedUser).role;
        } catch {}
      }
      if (role === 'admin') {
        navigate('/admin/statistics');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      // Show specific backend error message(s)
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        setError(err.response.data.errors[0].message);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      {/* Simple Navbar */}
      <nav className="w-full max-w-md flex items-center justify-between py-3 px-2 mb-8 border-b border-border bg-background rounded-t-lg">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:underline text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        <ThemeToggle />
      </nav>
      <div className="max-w-md w-full bg-background p-8 rounded-lg shadow-xl border border-border">
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Create your account</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="Email Address"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="Password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="Confirm Password"
            required
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="registerAsAdmin"
              name="registerAsAdmin"
              checked={formData.registerAsAdmin}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="registerAsAdmin" className="text-sm text-foreground">Register as Admin</label>
          </div>

          {formData.registerAsAdmin && (
            <input
              type="password"
              name="adminCode"
              value={formData.adminCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="Admin Code"
              required={formData.registerAsAdmin}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;