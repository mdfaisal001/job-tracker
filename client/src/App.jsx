import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/ping')
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error('❌ Backend not responding:', err));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 text-xl font-semibold">
      {message || 'Loading...'}
    </div>
  );
}

export default App;
