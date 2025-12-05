import React, { useState } from 'react';
import { login as loginApi } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login(){
  const { login } = useAuth();
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handle(e){
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(form);
      if (res.token) {
        login(res.token);
        nav('/');
      } else {
        setError(res.error || JSON.stringify(res));
      }
    } catch (err) {
      setError(err?.data?.error || err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="max-w-md w-full card">
        <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back</h2>
        <p className="text-center text-gray-400 mb-8">Sign in to your account to continue</p>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
            <input 
              className="input" 
              placeholder="Enter your email"
              type="email"
              value={form.email} 
              onChange={e=>setForm({...form,email:e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <input 
              type="password" 
              className="input" 
              placeholder="Enter your password"
              value={form.password} 
              onChange={e=>setForm({...form,password:e.target.value})} 
            />
          </div>
          {error && <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-md">{error}</div>}
          <button className="btn-primary mt-6" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account? <a href="/signup" className="text-[#d4d4a8] hover:underline">Sign up here</a>
        </p>
      </div>
    </div>
  );
}
