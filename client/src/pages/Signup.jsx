// src/pages/Signup.jsx
import React, { useState } from 'react';
import { signup } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const pwRegex = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/]).*$/;

export default function Signup(){
  const { login } = useAuth();
  const [form, setForm] = useState({ name:'', email:'', address:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  function validate() {
    if (form.name.length < 20 || form.name.length > 60) return 'Name must be 20-60 characters';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Invalid email';
    if (form.address.length > 400) return 'Address too long';
    if (!pwRegex.test(form.password)) return 'Password must be 8-16 chars, include uppercase and special char';
    return null;
  }

  async function handle(e){
    e.preventDefault();
    setError('');
    const v = validate(); if (v) return setError(v);
    setLoading(true);
    try {
      const res = await signup(form);
      if (res.token) {
        login(res.token);
        nav('/');
      } else {
        setError(res.error || JSON.stringify(res));
      }
    } catch (err) {
      setError(err?.data?.error || err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-8">
      <div className="max-w-lg w-full card">
        <h2 className="text-3xl font-bold mb-2 text-center">Create an account</h2>
        <p className="text-center text-gray-400 mb-8">Sign up to submit ratings for stores</p>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Full name</label>
            <input className="input" placeholder="Min 20 characters" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
            <input className="input" placeholder="you@example.com" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Address</label>
            <textarea className="input" rows="3" placeholder="Your address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <input className="input" type="password" placeholder="8-16 chars, uppercase & special char" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          </div>

          {error && <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-md">{error}</div>}

          <button className="btn-primary mt-6" disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? <a href="/login" className="text-[#d4d4a8] hover:underline">Log in here</a>
        </p>
      </div>
    </div>
  );
}
