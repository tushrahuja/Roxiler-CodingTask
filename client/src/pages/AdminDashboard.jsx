// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { adminListUsers, adminCreateUser } from '../services/usersService';
import { adminListStores, createStore } from '../services/storesService';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';

export default function AdminDashboard(){
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [storePage, setStorePage] = useState(1);
  const limit = 10;

  async function load() {
    setLoading(true);
    try {
      const u = await adminListUsers({ q, page: userPage, limit });
      const s = await adminListStores({ q, page: storePage, limit });
      setUsers(u.users || []);
      setStores(s.stores || []);
      setTotalUsers(u.total || 0);
      setTotalStores(s.total || 0);
      
      // Calculate total ratings
      const totalRatingsCount = s.stores?.reduce((sum, store) => {
        return sum + (store.rating_count || 0);
      }, 0) || 0;
      setTotalRatings(totalRatingsCount);
    } catch (err) {
      console.error('admin load err', err);
      setToast({ message: err?.data?.error || err?.message || 'Failed to load admin data', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, [q, userPage, storePage]);

  if (!user || user.role !== 'SYSTEM_ADMIN') {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="card max-w-lg text-center">
          <p className="text-gray-300">You must be a system admin to view this page.</p>
        </div>
      </div>
    );
  }

  const totalUserPages = Math.ceil(totalUsers / limit);
  const totalStorePages = Math.ceil(totalStores / limit);

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-gray-400">Manage users and stores</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowUserModal(true)} className="px-4 py-2 bg-[#d4d4a8] text-[#1a1a1a] rounded-lg font-medium hover:bg-[#c4c498] transition">
            Add User
          </button>
          <button onClick={() => setShowStoreModal(true)} className="px-4 py-2 bg-[#d4d4a8] text-[#1a1a1a] rounded-lg font-medium hover:bg-[#c4c498] transition">
            Add Store
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="text-gray-400 text-sm mb-1">Total Users</div>
          <div className="text-3xl font-bold text-[#d4d4a8]">{totalUsers}</div>
        </div>
        <div className="card">
          <div className="text-gray-400 text-sm mb-1">Total Stores</div>
          <div className="text-3xl font-bold text-[#d4d4a8]">{totalStores}</div>
        </div>
        <div className="card">
          <div className="text-gray-400 text-sm mb-1">Total Ratings</div>
          <div className="text-3xl font-bold text-[#d4d4a8]">{totalRatings}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input className="input md:w-96" placeholder="Filter by name, email, address, or role" value={q} onChange={e=>{ setQ(e.target.value); setUserPage(1); setStorePage(1); }} />
          <button className="btn-primary md:w-auto px-6" onClick={load}>Search</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Users ({totalUsers})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Name</th>
                  <th className="table-head">Email</th>
                  <th className="table-head">Address</th>
                  <th className="table-head">Role</th>
                  <th className="table-head">Rating</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="5" className="px-4 py-6 text-center text-gray-400">Loading...</td></tr> :
                  users.length === 0 ? <tr><td colSpan="5" className="px-4 py-6 text-center text-gray-400">No users found</td></tr> :
                  users.map(u => (
                    <tr key={u.id} className="border-t border-[#3d3d3d] hover:bg-[#252525] transition">
                      <td className="table-cell">{u.name}</td>
                      <td className="table-cell text-gray-400">{u.email}</td>
                      <td className="table-cell text-gray-500 text-xs">{u.address}</td>
                      <td className="table-cell">
                        <span className="text-xs px-3 py-1 bg-[#3d3d3d] border border-[#4d4d4d] rounded-full">{u.role}</span>
                      </td>
                      <td className="table-cell">
                        {u.role === 'STORE_OWNER' && u.avg_rating !== null ? (
                          <span className="text-[#d4d4a8] font-semibold">{u.avg_rating}</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          {totalUserPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#3d3d3d]">
              <button
                onClick={() => setUserPage(p => Math.max(1, p - 1))}
                disabled={userPage === 1}
                className="px-4 py-2 rounded-lg border border-[#4d4d4d] text-sm text-gray-300 hover:bg-[#3d3d3d] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-400">
                Page {userPage} of {totalUserPages}
              </span>
              <button
                onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                disabled={userPage === totalUserPages}
                className="px-4 py-2 rounded-lg border border-[#4d4d4d] text-sm text-gray-300 hover:bg-[#3d3d3d] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Stores ({totalStores})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Name</th>
                  <th className="table-head">Email</th>
                  <th className="table-head">Address</th>
                  <th className="table-head">Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.length === 0 ? <tr><td colSpan="4" className="px-4 py-6 text-center text-gray-400">No stores found</td></tr> :
                  stores.map(s => (
                    <tr key={s.id} className="border-t border-[#3d3d3d] hover:bg-[#252525] transition">
                      <td className="table-cell">{s.name}</td>
                      <td className="table-cell text-gray-400">{s.email}</td>
                      <td className="table-cell text-gray-500 text-xs">{s.address}</td>
                      <td className="table-cell">
                        <span className="text-[#d4d4a8] font-semibold">{s.avg_rating ?? '-'}</span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          {totalStorePages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#3d3d3d]">
              <button
                onClick={() => setStorePage(p => Math.max(1, p - 1))}
                disabled={storePage === 1}
                className="px-4 py-2 rounded-lg border border-[#4d4d4d] text-sm text-gray-300 hover:bg-[#3d3d3d] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-400">
                Page {storePage} of {totalStorePages}
              </span>
              <button
                onClick={() => setStorePage(p => Math.min(totalStorePages, p + 1))}
                disabled={storePage === totalStorePages}
                className="px-4 py-2 rounded-lg border border-[#4d4d4d] text-sm text-gray-300 hover:bg-[#3d3d3d] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {showUserModal && <AddUserModal onClose={() => setShowUserModal(false)} onSuccess={() => { setUserPage(1); load(); setToast({ message: 'User created successfully', type: 'success' }); }} />}
      {showStoreModal && <AddStoreModal onClose={() => setShowStoreModal(false)} onSuccess={() => { setStorePage(1); load(); setToast({ message: 'Store created successfully', type: 'success' }); }} users={users} />}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function AddUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminCreateUser(form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err?.data?.error || err?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Add New User</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Name (20-60 chars)</label>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
              <input type="password" className="input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Address</label>
              <textarea className="input" rows="2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Role</label>
              <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="NORMAL_USER">Normal User</option>
                <option value="SYSTEM_ADMIN">System Admin</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </div>
            {error && <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-md">{error}</div>}
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-lg border border-[#4d4d4d] text-gray-300 font-medium hover:bg-[#3d3d3d] transition">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-3 rounded-lg bg-[#d4d4a8] text-[#1a1a1a] font-semibold hover:bg-[#c4c498] transition disabled:opacity-50">
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function AddStoreModal({ onClose, onSuccess, users }) {
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const storeOwners = users.filter(u => u.role === 'STORE_OWNER');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createStore({ ...form, owner_id: form.owner_id || null });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err?.data?.error || err?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Add New Store</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Store Name</label>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Address</label>
              <textarea className="input" rows="2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Store Owner (Optional)</label>
              <select className="input" value={form.owner_id} onChange={e => setForm({ ...form, owner_id: e.target.value })}>
                <option value="">No Owner</option>
                {storeOwners.map(owner => (
                  <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
                ))}
              </select>
            </div>
            {error && <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-md">{error}</div>}
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-lg border border-[#4d4d4d] text-gray-300 font-medium hover:bg-[#3d3d3d] transition">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-3 rounded-lg bg-[#d4d4a8] text-[#1a1a1a] font-semibold hover:bg-[#c4c498] transition disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Store'}
              </button>              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


