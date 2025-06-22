import { useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      window.location.href = '/'; // Force reload
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center px-4 py-8">
      <div className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-white text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white transition-all duration-200 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white transition-all duration-200 text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 px-4 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 hover:scale-105 transition-all duration-200 text-sm sm:text-base mt-6 cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="text-center text-white/80 text-xs sm:text-sm mt-6">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-white font-semibold cursor-pointer hover:underline ml-1"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
