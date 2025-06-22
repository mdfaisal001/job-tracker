import { useEffect, useState } from 'react';
import axios from '../axios';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ company: '', position: '', status: '', link: '', notes: '' });

  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/jobs', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setJobs(res.data);
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

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">📋 All Jobs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-md border border-white/10 space-y-2"
          >
            {editingId === job._id ? (
              <form onSubmit={handleUpdate} className="space-y-2">
                <input name="company" value={form.company} onChange={handleChange} placeholder="Company" className="w-full p-2 rounded bg-white/20 text-white" />
                <input name="position" value={form.position} onChange={handleChange} placeholder="Position" className="w-full p-2 rounded bg-white/20 text-white" />
                <input name="status" value={form.status} onChange={handleChange} placeholder="Status" className="w-full p-2 rounded bg-white/20 text-white" />
                <input name="link" value={form.link} onChange={handleChange} placeholder="Link" className="w-full p-2 rounded bg-white/20 text-white" />
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="w-full p-2 rounded bg-white/20 text-white" />
                <button className="bg-indigo-600 px-4 py-1 rounded text-white">Update</button>
              </form>
            ) : (
              <>
                <h3 className="text-lg font-bold">{job.position} @ {job.company}</h3>
                <p className="text-sm">Status: {job.status}</p>
                {job.link && <a href={job.link} target="_blank" rel="noreferrer" className="text-blue-300 underline text-sm">Link</a>}
                <p className="text-xs text-gray-300">{job.notes}</p>
                <div className="flex space-x-2 mt-2">
                  <button onClick={() => startEdit(job)} className="text-yellow-300 hover:underline text-sm">✏️ Edit</button>
                  <button onClick={() => handleDelete(job._id)} className="text-red-400 hover:underline text-sm">🗑️ Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
