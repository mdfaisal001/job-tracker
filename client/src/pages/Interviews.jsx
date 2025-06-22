import { useState, useEffect } from 'react';
import axios from '../axios';

const roundOptions = ['HR', 'Technical', 'Managerial', 'Final', 'Other'];

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [form, setForm] = useState({ jobTitle: '', date: '', round: 'HR', notes: '' });
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/interviews/${editingId}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } else {
      await axios.post('/interviews', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    }
    setForm({ jobTitle: '', date: '', round: 'HR', notes: '' });
    setEditingId(null);
    fetchInterviews();
  };

  const startEdit = (iv) => {
    setForm({
      jobTitle: iv.jobTitle || iv.job?.position || '',
      date: iv.date.slice(0, 10),
      round: iv.round,
      notes: iv.notes,
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

  return (
    <div className="space-y-6 text-white">
      <h2 className="text-2xl font-bold">🕑 Interviews</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
        <input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Job Title" className="p-3 rounded bg-white/10 text-white placeholder-white/60" />
        <input type="date" name="date" value={form.date} onChange={handleChange} className="p-3 rounded bg-white/10 text-white" />
        <select name="round" value={form.round} onChange={handleChange} className="p-3 rounded bg-white/10 text-white">
          {roundOptions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="p-3 rounded bg-white/10 text-white placeholder-white/50 sm:col-span-2" />
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded col-span-1 sm:col-span-2">
          {editingId ? '✏️ Update Interview' : '➕ Add Interview'}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {interviews.map((iv) => (
          <div
            key={iv._id}
            className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-md"
          >
            <h3 className="text-lg font-semibold">{iv.job?.position || iv.jobTitle}</h3>
            <p className="text-sm">🗓 {new Date(iv.date).toLocaleDateString()}</p>
            <p className="text-sm">🎯 Round: {iv.round}</p>
            {iv.notes && <p className="text-xs text-white/80">📝 {iv.notes}</p>}
            <div className="flex gap-4 mt-2">
              <button onClick={() => startEdit(iv)} className="text-yellow-300 hover:underline text-sm">✏️ Edit</button>
              <button onClick={() => handleDelete(iv._id)} className="text-red-400 hover:underline text-sm">🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
