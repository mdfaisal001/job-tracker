import { useEffect, useState } from 'react';
import axios from '../axios';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    };
    fetchProfile();
  }, []);

  return (
    <div className="text-white">
      <h2 className="text-xl font-bold mb-4">👤 Your Profile</h2>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
