import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Target, Edit, Trash2, Plus, Building2 } from 'lucide-react';
import axios from '../axios';

const roundOptions = ['HR', 'Technical', 'Managerial', 'Final', 'Other'];

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [form, setForm] = useState({
  jobTitle: '',
  date: '',
  time: '',
  round: 'HR',
  location: '',
  company: '',
  notes: '',
});

  const [editingId, setEditingId] = useState(null);

  const fetchInterviews = async () => {
    const res = await axios.get('/interviews', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setInterviews(res.data);
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/interviews/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.post('/interviews', form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      setForm({ jobTitle: '', date: '', time: '', round: 'HR', location: '', company: '', notes: '' });
      setEditingId(null);
      fetchInterviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting interview');
    }
  };

  const startEdit = (iv) => {
    setForm({
      jobTitle: iv.jobTitle || iv.job?.position || '',
      date: iv.date?.slice(0, 10),
      time: iv.time || '',
      round: iv.round || 'HR',
      location: iv.location || '',
      company: iv.company || '',
      notes: iv.notes || '',
    });
    setEditingId(iv._id);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete interview?')) {
      await axios.delete(`/interviews/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchInterviews();
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const capitalizeRole = (role) => {
    if (!role) return 'N/A';
    return role.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="space-y-10 text-white font-inter">
      <h2 className="text-3xl font-bold text-indigo-300 flex items-center gap-3">
        <Clock className="w-8 h-8" />
        Interviews
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
      >
        <input
          name="jobTitle"
          value={form.jobTitle}
          onChange={handleChange}
          placeholder="Job Title"
          className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 outline-none focus:border-purple-400 focus:bg-white/15 focus:shadow-lg focus:shadow-purple-500/25 hover:border-white/30 transition-all duration-300"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white outline-none focus:border-blue-400 focus:bg-white/15 focus:shadow-lg focus:shadow-blue-500/25 hover:border-white/30 transition-all duration-300"
        />
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white outline-none focus:border-green-400 focus:bg-white/15 focus:shadow-lg focus:shadow-green-500/25 hover:border-white/30 transition-all duration-300"
        />
        <select
          name="round"
          value={form.round}
          onChange={handleChange}
          className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white outline-none focus:border-orange-400 focus:bg-white/15 focus:shadow-lg focus:shadow-orange-500/25 hover:border-white/30 transition-all duration-300"
        >
          {roundOptions.map((r) => (
            <option key={r} value={r} className="bg-slate-800 text-white">
              {r}
            </option>
          ))}
        </select>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location (e.g., Zoom, Office)"
          className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 outline-none focus:border-cyan-400 focus:bg-white/15 focus:shadow-lg focus:shadow-cyan-500/25 hover:border-white/30 transition-all duration-300"
        />
         <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company Name"
          className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 outline-none focus:border-purple-400 focus:bg-white/15 focus:shadow-lg focus:shadow-purple-500/25 hover:border-white/30 transition-all duration-300"
        />

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="p-4 sm:col-span-2 lg:col-span-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 outline-none focus:border-indigo-400 focus:bg-white/15 focus:shadow-lg focus:shadow-indigo-500/25 hover:border-white/30 transition-all duration-300 resize-none min-h-[100px]"
        />
        <button
          type="submit"
          className="col-span-1 sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 px-8 py-4 rounded-xl text-white font-semibold tracking-wide shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transform flex items-center justify-center gap-2"
        >
          {editingId ? (
            <>
              <Edit className="w-5 h-5" />
              Update Interview
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add Interview
            </>
          )}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.length === 0 ? (
          <p className="text-white/60 italic">No interviews yet. Add some!</p>
        ) : (
          interviews.map((iv) => (
            <div
              key={iv._id}
              className="relative overflow-hidden backdrop-blur-xl rounded-3xl p-6 bg-gradient-to-br from-white/15 via-white/10 to-white/5 border border-white/20 shadow-2xl hover:shadow-purple-500/20 hover:border-white/30 transition-all duration-500 group hover:scale-[1.02] hover:-translate-y-1"
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              
              <div className="relative z-10 space-y-4">
                {/* Header Section */}
                <div className="text-center border-b border-white/10 pb-4">
                  <h3 className="text-2xl font-bold tracking-wide text-white mb-2 group-hover:text-indigo-200 transition-colors duration-300">
                    {capitalizeRole(iv.job?.position || iv.jobTitle)}
                  </h3>
                  {(iv.company || iv.job?.company) && (
                    <div className="flex items-center justify-center gap-2 text-indigo-300 font-semibold">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm tracking-wide">
                        {capitalizeRole(iv.company || iv.job?.company)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30">
                      <Calendar className="w-4 h-4 text-blue-300" />
                    </div>
                    <span className="font-medium">
                      {iv.date ? new Date(iv.date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 border border-green-400/30">
                      <Clock className="w-4 h-4 text-green-300" />
                    </div>
                    <span className="font-medium">{formatTime(iv.time)}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/30">
                      <MapPin className="w-4 h-4 text-cyan-300" />
                    </div>
                    <span className="font-medium">{iv.location || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/30">
                      <Target className="w-4 h-4 text-orange-300" />
                    </div>
                    <span className="font-medium">
                      Round: <span className="text-orange-300 font-semibold">{iv.round}</span>
                    </span>
                  </div>
                </div>

                {/* Notes Section */}
                {iv.notes && (
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-start gap-2">
                      <Edit className="w-4 h-4 mt-0.5 text-indigo-300 flex-shrink-0" />
                      <p className="text-white/80 text-sm leading-relaxed">
                        {iv.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => startEdit(iv)}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(iv._id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}