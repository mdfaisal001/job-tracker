import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LogOut, UserPlus, LogIn } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="text-2xl font-extrabold tracking-wide text-indigo-300">Job Pilot 🚀</div>
        <div className="flex gap-4 items-center text-sm">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 px-4 py-2 border border-indigo-400 hover:bg-indigo-600 rounded-lg transition"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 leading-tight">
          Track Your Job Applications with <span className="text-indigo-400">Ease</span>
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto text-lg mb-8">
          Job Pilot helps you manage and monitor your job applications, interviews, and offers—all in one place.
        </p>

        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold px-6 py-3 rounded-full transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            to="/register"
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-bold px-6 py-3 rounded-full transition"
          >
            Get Started for Free
          </Link>
        )}
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-6 py-12 max-w-6xl mx-auto">
        <div className="bg-white/10 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-indigo-300 mb-2">📋 Track Applications</h3>
          <p className="text-white/70 text-sm">
            Monitor your job applications in real time with a sleek dashboard and progress indicators.
          </p>
        </div>
        <div className="bg-white/10 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-indigo-300 mb-2">📆 Schedule Interviews</h3>
          <p className="text-white/70 text-sm">
            Stay organized with calendar integration and timely interview reminders.
          </p>
        </div>
        <div className="bg-white/10 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-indigo-300 mb-2">📊 Insights & Reports</h3>
          <p className="text-white/70 text-sm">
            Visualize your progress and optimize your job-hunting strategy with helpful analytics.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/10 text-white/60 text-sm">
        © {new Date().getFullYear()} Job Pilot. All rights reserved.
      </footer>
    </div>
  );
}
