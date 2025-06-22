import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Update isAuthenticated based on token every time App renders
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));

    const syncAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  return (
    <Router>
      <Routes>
        {/* ✅ Landing Page */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
          }
        />

        {/* ✅ Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
          }
        />

        {/* ✅ Protected Route */}
        <Route
          path="/*"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/" replace /> // Go to Landing
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
