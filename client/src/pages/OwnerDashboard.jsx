// src/pages/OwnerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function OwnerDashboard(){
  const { ownerId } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState({ stores: [], ratings: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/stores/owner/${ownerId}/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('owner dashboard err', err);
        alert('Failed to load owner dashboard');
      } finally {
        setLoading(false);
      }
    }
    if (ownerId && user && user.role === 'STORE_OWNER') load();
  }, [ownerId, user]);

  if (!user || user.role !== 'STORE_OWNER') {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="card max-w-lg text-center">
          <p className="text-gray-300">You must be a store owner to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Owner Dashboard</h2>
        <p className="text-gray-400">Your store performance and raters</p>
      </div>

      <div className="grid gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Your Stores</h3>
          <ul className="space-y-3">
            {data.stores?.map(s => (
              <li key={s.id} className="flex items-center justify-between p-4 bg-[#252525] rounded-lg border border-[#3d3d3d]">
                <div>
                  <div className="font-medium text-lg">{s.name}</div>
                  <div className="text-sm text-gray-400">{s.address}</div>
                </div>
                <div className="text-2xl font-bold text-[#d4d4a8]">{s.avg_rating ?? '0.00'}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Raters</h3>
          {loading ? <div className="text-gray-400">Loading...</div> : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-head">User</th>
                    <th className="table-head">Email</th>
                    <th className="table-head">Store ID</th>
                    <th className="table-head">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ratings?.map((r, i) => (
                    <tr key={i} className="border-t border-[#3d3d3d] hover:bg-[#252525] transition">
                      <td className="table-cell">{r.name}</td>
                      <td className="table-cell text-gray-400">{r.email}</td>
                      <td className="table-cell text-gray-500">{r.store_id}</td>
                      <td className="table-cell">
                        <span className="text-[#d4d4a8] font-semibold text-lg">{r.rating}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
