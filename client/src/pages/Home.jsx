import { useEffect, useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setUser(res.data))
    .catch(() => {
      localStorage.removeItem('token');
      navigate('/login');
    });
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 to-indigo-600 text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Welcome {user?.name || 'User'} 🎉</h1>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded shadow"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
