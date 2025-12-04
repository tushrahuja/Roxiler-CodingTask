// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { adminListUsers } from '../services/usersService';
import { adminListStores } from '../services/storesService';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard(){
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const u = await adminListUsers({ q });
      const s = await adminListStores({ q, limit: 100 });
      setUsers(u.users || []);
      setStores(s.stores || []);
    } catch (err) {
      console.error('admin load err', err);
      alert(err?.data?.error || err?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, []);

  if (!user || user.role !== 'SYSTEM_ADMIN') {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="card max-w-lg text-center">
          <p className="text-gray-300">You must be a system admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-gray-400">Manage users and stores</p>
        </div>
        <div className="flex gap-2">
          <input className="input md:w-64" placeholder="Filter name, email or address" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn-primary md:w-auto px-6" onClick={load}>Search</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Users ({users.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Name</th>
                  <th className="table-head">Email</th>
                  <th className="table-head">Address</th>
                  <th className="table-head">Role</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="4" className="px-4 py-6 text-center text-gray-400">Loading...</td></tr> :
                  users.map(u => (
                    <tr key={u.id} className="border-t border-[#3d3d3d] hover:bg-[#252525] transition">
                      <td className="table-cell">{u.name}</td>
                      <td className="table-cell text-gray-400">{u.email}</td>
                      <td className="table-cell text-gray-500 text-xs">{u.address}</td>
                      <td className="table-cell">
                        <span className="text-xs px-3 py-1 bg-[#3d3d3d] border border-[#4d4d4d] rounded-full">{u.role}</span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Stores ({stores.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Name</th>
                  <th className="table-head">Email</th>
                  <th className="table-head">Address</th>
                  <th className="table-head">Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map(s => (
                  <tr key={s.id} className="border-t border-[#3d3d3d] hover:bg-[#252525] transition">
                    <td className="table-cell">{s.name}</td>
                    <td className="table-cell text-gray-400">{s.email}</td>
                    <td className="table-cell text-gray-500 text-xs">{s.address}</td>
                    <td className="table-cell">
                      <span className="text-[#d4d4a8] font-semibold">{s.avg_rating ?? '-'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
