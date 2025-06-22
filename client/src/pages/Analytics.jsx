import { useEffect, useState } from 'react';
import axios from '../axios';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';

const COLORS = ['#38bdf8', '#a78bfa', '#f472b6', '#facc15', '#4ade80'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/analytics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setData(res.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className="text-slate-300 ml-4 text-lg font-medium">Loading analytics...</p>
      </div>
    );
  }

  if (!data) return <p className="text-white">Loading...</p>;

  const statusChart = Object.entries(data.statusCounts).map(([key, value]) => ({
    name: key,
    value,
  }));

  const roundChart = Object.entries(data.roundCounts).map(([key, value]) => ({
    name: key,
    value,
  }));

  const jobAppsByMonthChart = Object.entries(data.jobAppsByMonth || {}).map(
    ([month, count]) => ({ month, count })
  );

  return (
    <div className="text-white space-y-8 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Analytics Overview
            </h2>
            <p className="text-slate-400 mt-1">Insights into your job search journey</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Jobs</p>
                <p className="text-3xl font-bold text-white mt-1">{data.totalJobs}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💼</span>
              </div>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Interviews</p>
                <p className="text-3xl font-bold text-white mt-1">{data.totalInterviews}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {/* Jobs by Status Chart */}
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:scale-105 group">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg">📈</span>
            </div>
            <h3 className="text-xl font-bold text-white">Jobs by Status</h3>
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusChart}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid #475569',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interview Rounds Chart */}
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105 group">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg">🎨</span>
            </div>
            <h3 className="text-xl font-bold text-white">Interview Rounds</h3>
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roundChart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {roundChart.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid #475569',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Upcoming Interviews Section */}
      {data.upcomingInterviews?.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
              <span className="text-lg">⏰</span>
            </div>
            <h3 className="text-xl font-bold text-white">Upcoming Interviews</h3>
          </div>
          
          <div className="space-y-4">
            {data.upcomingInterviews.map((iv, i) => (
              <div key={i} className="group p-4 rounded-2xl bg-gradient-to-r from-slate-800/30 to-slate-700/30 border border-slate-600/30 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📅</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {iv.jobTitle}
                      </p>
                      <p className="text-sm text-slate-400">
                        {iv.round} round • {new Date(iv.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="relative z-10">
        <div className="bg-gradient-to-r from-slate-800/20 to-slate-900/20 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/30">
          <div className="flex items-center justify-center space-x-8 text-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-slate-300 text-sm font-medium">
                Total Jobs: <span className="text-white font-bold">{data.totalJobs}</span>
              </span>
            </div>
            <div className="w-px h-6 bg-slate-600"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-300 text-sm font-medium">
                Total Interviews: <span className="text-white font-bold">{data.totalInterviews}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}