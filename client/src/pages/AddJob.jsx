import { useState } from 'react';
import axios from '../axios';

export default function AddJob() {
  const [form, setForm] = useState({
    company: '',
    position: '',
    status: 'Pending',
    link: '',
    notes: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/jobs', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Job Added!');
      setForm({ company: '', position: '', status: 'Pending', link: '', notes: '' });
    } catch (err) {
      alert('❌ Error adding job');
    }
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">➕ Add Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="company" value={form.company} onChange={handleChange} placeholder="Company" className="w-full p-2 rounded bg-white/10 text-white" />
        <input name="position" value={form.position} onChange={handleChange} placeholder="Position" className="w-full p-2 rounded bg-white/10 text-white" />
        <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 rounded bg-white/10 text-white">
          <option>Pending</option>
          <option>Interview</option>
          <option>Declined</option>
        </select>
        <input name="link" value={form.link} onChange={handleChange} placeholder="Link" className="w-full p-2 rounded bg-white/10 text-white" />
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="w-full p-2 rounded bg-white/10 text-white" />
        <button type="submit" className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700">Add Job</button>
      </form>
    </div>
  );
}
