import { useEffect, useState } from 'react';
import axios from '../axios';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ company: '', position: '', status: '', link: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Delete this job?')) {
      await axios.delete(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchJobs();
    }
  };

  const startEdit = (job) => {
    setEditingId(job._id);
    setForm(job);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ company: '', position: '', status: '', link: '', notes: '' });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`/jobs/${editingId}`, form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setEditingId(null);
    setForm({ company: '', position: '', status: '', link: '', notes: '' });
    fetchJobs();
  };

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get unique statuses for filter dropdown
  const uniqueStatuses = ['All', ...new Set(jobs.map(job => job.status))];

  const getStatusColor = (status) => {
    const statusColors = {
      'Applied': 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      'Interview': 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
      'Offer': 'from-green-500/20 to-green-600/20 border-green-500/30',
      'Rejected': 'from-red-500/20 to-red-600/20 border-red-500/30',
      'Pending': 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    };
    return statusColors[status] || 'from-slate-500/20 to-slate-600/20 border-slate-500/30';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'Applied': '📤',
      'Interview': '🎯',
      'Offer': '🎉',
      'Rejected': '❌',
      'Pending': '⏳',
    };
    return statusIcons[status] || '📋';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className="text-slate-300 ml-4 text-lg font-medium">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="text-white relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              All Jobs
            </h2>
            <p className="text-slate-400 mt-1">Manage and track your job applications</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gradient-to-r from-slate-800/40 to-slate-900/60 backdrop-blur-2xl p-6 rounded-2xl border border-slate-700/50 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by company or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              >
                {uniqueStatuses.map(status => (
                  <option key={status} value={status} className="bg-slate-800">
                    {status} {status !== 'All' && `(${jobs.filter(job => job.status === status).length})`}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center px-4 py-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <span className="text-slate-300 text-sm font-medium">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        {filteredJobs.map((job, index) => (
          <div
            key={job._id}
            className={`bg-gradient-to-br ${getStatusColor(job.status)} backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border hover:shadow-indigo-500/10 transition-all duration-300 hover:scale-105 group animate-slideUp`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {editingId === job._id ? (
              /* Edit Form */
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-3">
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company"
                    className="w-full p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                  <input
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    placeholder="Position"
                    className="w-full p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                  <input
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    placeholder="Status"
                    className="w-full p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                  <input
                    name="link"
                    value={form.link}
                    onChange={handleChange}
                    placeholder="Link"
                    className="w-full p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Notes"
                    rows={3}
                    className="w-full p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    ✅ Update
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* Job Display */
              <>
                {/* Job Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                      {job.position}
                    </h3>
                    <p className="text-slate-300 font-medium">@ {job.company}</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full">
                    <span className="text-sm">{getStatusIcon(job.status)}</span>
                    <span className="text-xs font-medium text-slate-300">{job.status}</span>
                  </div>
                </div>

                {/* Job Details */}
                <div className="space-y-3 mb-4">
                  {job.link && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium hover:underline transition-colors"
                      >
                        View Job Link
                      </a>
                    </div>
                  )}
                  
                  {job.notes && (
                    <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/30">
                      <p className="text-xs text-slate-300 leading-relaxed">{job.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => startEdit(job)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 text-yellow-300 hover:text-yellow-200 py-2 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 border border-yellow-500/30"
                  >
                    <span>✏️</span>
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 hover:text-red-200 py-2 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 border border-red-500/30"
                  >
                    <span>🗑️</span>
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-16 relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📋</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No jobs found</h3>
          <p className="text-slate-400">
            {searchTerm || statusFilter !== 'All' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start by adding your first job application'}
          </p>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}