import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Briefcase,
  Plus,
  Clock,
  TrendingUp,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Rocket
} from 'lucide-react';
import axios from '../axios';

import Dashboard from './Dashboard';
import Jobs from './Jobs';
import AddJob from './AddJob';
import Interviews from './Interviews';
import Analytics from './Analytics';
import Profile from './Profile';
import InterviewCalendar from './InterviewCalendar';

export default function Home() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    axios
      .get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
        navigate('/', { replace: true }); // ✅ Send to landing page
      });
  }, []);

  const logout = () => {
  localStorage.removeItem('token');
  setUser(null);
  window.dispatchEvent(new Event('storage')); // 🔄 to notify App.jsx
  navigate('/', { replace: true }); // ✅ to landing page
};


  const sidebarItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/jobs', label: 'All Jobs', icon: Briefcase },
    { path: '/add-job', label: 'Add Job', icon: Plus },
    { path: '/interviews', label: 'Interviews', icon: Clock },
    { path: '/analytics', label: 'Analytics', icon: TrendingUp },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/profile', label: 'Profile', icon: User }
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside className={`
        fixed lg:relative top-0 left-0 h-full w-72 lg:w-64 
        backdrop-blur-xl bg-white/10 border-r border-white/20 
        flex flex-col shadow-2xl overflow-y-auto z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              JOB PILOT
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`
                  flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white hover:transform hover:scale-105'}
                `}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20 bg-white/5 backdrop-blur-md">
          {user && (
            <div className="mb-3 px-4 py-2 bg-white/10 rounded-lg">
              <p className="text-sm text-gray-300">Welcome back,</p>
              <p className="font-semibold text-white truncate">{user.name || user.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="backdrop-blur-xl bg-white/5 border-b border-white/10 px-4 lg:px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white tracking-wide">
                  {sidebarItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Manage your job applications efficiently
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/add-job"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Job
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 lg:p-6 shadow-2xl border border-white/10 min-h-full">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/add-job" element={<AddJob />} />
                <Route path="/interviews" element={<Interviews />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/calendar" element={<InterviewCalendar />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
