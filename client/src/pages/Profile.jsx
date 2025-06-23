import { useState, useEffect } from 'react';
import axios from '../axios';

export default function Profile() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({ name: '', password: '' });

  const fetchUser = async () => {
    const res = await axios.get('/users/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setUser(res.data);
    setForm({ name: res.data.name, password: '' });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/users/profile', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('✅ Profile updated!');
      fetchUser();
    } catch (err) {
      alert(err.response?.data?.message || '❌ Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-900 p-4">
      <div className="bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md w-full text-white backdrop-blur-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">👤 My Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-white/80">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 bg-white/20 rounded-lg outline-none placeholder-white/50"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-white/80">Email</label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full p-3 bg-white/20 rounded-lg text-white/70 outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-white/80">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 bg-white/20 rounded-lg outline-none placeholder-white/50"
              placeholder="Leave blank to keep existing"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition py-3 rounded-lg font-semibold"
          >
            Update Profile
          </button>
        </form>

        
      </div>
    </div>
  );
}
