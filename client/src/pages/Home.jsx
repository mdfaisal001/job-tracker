import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios';

import Dashboard from './Dashboard';
import Jobs from './Jobs';
import AddJob from './AddJob';
import Interviews from './Interviews';
import Analytics from './Analytics';
import Profile from './Profile';

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    axios
      .get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const sidebarItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/jobs', label: 'All Jobs', icon: '📋' },
    { path: '/add-job', label: 'Add Job', icon: '➕' },
    { path: '/interviews', label: 'Interviews', icon: '🕑' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Sidebar */}
      <aside className="w-64 backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col shadow-lg">
        <div className="p-6 border-b border-white/20 text-2xl font-extrabold text-indigo-300">
          🚀 Job Tracker
        </div>
        <nav className="flex-1 p-4 space-y-3">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/20">
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/5 border-b border-white/10 px-6 py-4 shadow-md">
          <h1 className="text-xl font-semibold text-white tracking-wide">
            {sidebarItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 shadow-inner border border-white/10">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/add-job" element={<AddJob />} />
              <Route path="/interviews" element={<Interviews />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
