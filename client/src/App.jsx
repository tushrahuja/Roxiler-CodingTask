import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Nav from './components/Nav';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Stores from './pages/Stores';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav onLogout={handleLogout} />
      <main className="container py-8 flex-1">
        <Routes>
          <Route path="/" element={<Stores />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/owner/:ownerId" element={<OwnerDashboard />} />
        </Routes>
      </main>
      <footer className="bg-[#2d2d2d] border-t border-[#3d3d3d]">
        <div className="container py-4 text-center text-sm text-gray-400">© RateGenius {new Date().getFullYear()} </div>
      </footer>
    </div>
  );
}
