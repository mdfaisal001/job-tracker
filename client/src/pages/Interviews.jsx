import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Target, Edit, Trash2, Plus } from 'lucide-react';
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
      setForm({ jobTitle: '', date: '', time: '', round: 'HR', location: '', notes: '' });
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
              className="flex flex-col justify-between items-center text-center backdrop-blur-xl rounded-2xl p-6 h-[360px] bg-white/10 border border-white/20 shadow-2xl hover:scale-[1.02] hover:shadow-purple-500/20 hover:border-white/30 transition-all duration-500 group"
            >
              <div>
                <h3 className="text-3xl font-bold tracking-wide text-indigo-300 mb-2 group-hover:text-indigo-200 transition-colors duration-300">
                  {iv.job?.position || iv.jobTitle}
                </h3>
                <p className="text-white mb-1 text-left font-bold tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {iv.date ? new Date(iv.date).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-white mb-1 text-left font-bold tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatTime(iv.time)}
                </p>
                <p className="text-white mb-1 text-left font-bold tracking-widest flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {iv.location || 'N/A'}
                </p>
                <p className="text-white mb-1 text-left font-bold tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Round: <span className="text-indigo-200">{iv.round}</span>
                </p>
                {iv.notes && (
                  <p className="text-white/70 tracking-wider leading-normal text-left text-sm mt-2 flex items-start gap-2">
                    <Edit className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {iv.notes}
                  </p>
                )}
              </div>

              <div className="flex flex-row w-full justify-center gap-3 mt-4">
                <button
                  onClick={() => startEdit(iv)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 w-full font-bold tracking-wider text-black px-4 py-3 rounded-xl hover:from-yellow-500 hover:to-orange-500 text-sm shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(iv._id)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 w-full text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 text-sm font-bold tracking-wider shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}