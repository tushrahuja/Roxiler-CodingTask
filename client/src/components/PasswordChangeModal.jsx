import React, { useState } from 'react';
import { updatePassword } from '../services/usersService';

export default function PasswordChangeModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const pwRegex = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/]).*$/;
    if (!pwRegex.test(form.newPassword)) {
      setError('Password must be 8-16 chars, include uppercase and special char');
      return;
    }

    setLoading(true);
    try {
      await updatePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword });
      alert('Password updated successfully!');
      onClose();
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err?.data?.error || err?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] shadow-2xl max-w-md w-full mx-4 animate-scale-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Change Password</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Current Password</label>
              <input
                type="password"
                className="input"
                placeholder="Enter current password"
                value={form.oldPassword}
                onChange={e => setForm({ ...form, oldPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">New Password</label>
              <input
                type="password"
                className="input"
                placeholder="8-16 chars, uppercase & special char"
                value={form.newPassword}
                onChange={e => setForm({ ...form, newPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Confirm New Password</label>
              <input
                type="password"
                className="input"
                placeholder="Re-enter new password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>

            {error && <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-md">{error}</div>}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg border border-[#4d4d4d] text-gray-300 font-medium hover:bg-[#3d3d3d] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-lg bg-[#d4d4a8] text-[#1a1a1a] font-semibold hover:bg-[#c4c498] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
