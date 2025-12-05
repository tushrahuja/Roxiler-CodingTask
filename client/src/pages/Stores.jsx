import React, { useEffect, useState } from 'react';
import { listStores } from '../services/storesService';
import { submitRating } from '../services/ratingsService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import RatingModal from '../components/RatingModal';

export default function Stores() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [stores, setStores] = useState([]);
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState(null);
  const [ratingModal, setRatingModal] = useState({ isOpen: false, storeId: null, storeName: '', currentRating: null });
  const [page, setPage] = useState(1);
  const [totalStores, setTotalStores] = useState(0);
  const limit = 10;

  async function load() {
    setLoading(true);
    setMessage('');
    try {
      if (!token) {
        setStores([]);
        setMessage('Please log in to view stores.');
        return;
      }
      const res = await listStores({ q, sort, order, page, limit });
      setStores(res.stores || []);
      setTotalStores(res.total || 0);
    } catch (err) {
      if (err?.status === 401) {
        setMessage('Session expired or not authorized. Please log in.');
      } else {
        setMessage('Failed to load stores. Try again later.');
      }
      console.error('listStores err', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [token, q, page]);

  async function doRate(storeId, storeName, currentRating) {
    if (!token) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    
    setRatingModal({
      isOpen: true,
      storeId,
      storeName,
      currentRating
    });
  }

  async function handleRatingSubmit(rating) {
    try {
      const response = await submitRating(ratingModal.storeId, rating);
      setToast({ 
        message: response.message === 'Rating updated' 
          ? `Rating updated successfully to ${rating} stars!` 
          : `Rating submitted successfully! You gave ${rating} stars.`,
        type: 'success' 
      });
      await load();
    } catch (err) {
      setToast({ 
        message: err?.data?.error || err?.message || 'Failed to submit rating. Please try again.',
        type: 'error' 
      });
    }
  }

  function handleSearchKeyPress(e) {
    if (e.key === 'Enter') {
      setPage(1);
      load();
    }
  }

  const totalPages = Math.ceil(totalStores / limit);

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Stores</h1>
          <p className="text-gray-400">Browse stores and submit ratings (1–5)</p>
        </div>
        <div className="flex gap-2">
          <input 
            className="input md:w-64" 
            placeholder="Search name or address" 
            value={q} 
            onChange={e=>{ setQ(e.target.value); setPage(1); }}
            onKeyPress={handleSearchKeyPress}
          />
          <button className="btn-primary md:w-auto px-6" onClick={() => { setPage(1); load(); }}>Search</button>
        </div>
      </div>

      {message && (
        <div className="card mb-6">
          <div className="text-sm text-gray-300">
            {message}
            {!token && (
              <button onClick={()=>navigate('/login')} className="ml-3 px-4 py-2 text-sm bg-[#d4d4a8] text-[#1a1a1a] rounded-md hover:bg-[#c4c498] transition">Log in</button>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-head rounded-tl-md">Name</th>
                <th className="table-head">Address</th>
                <th className="table-head">Overall Rating</th>
                <th className="table-head">Your Rating</th>
                <th className="table-head rounded-tr-md">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : stores.length === 0 ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-400">No stores found</td></tr>
              ) : stores.map(s => (
                <tr key={s.id} className="border-t border-[#3d3d3d] hover:bg-[#252525] transition">
                  <td className="table-cell font-medium">{s.name}</td>
                  <td className="table-cell text-gray-400">{s.address}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className="text-[#d4d4a8] font-semibold text-lg">{s.avg_rating ?? '0.00'}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(star => (
                          <svg key={star} className={`w-4 h-4 ${parseFloat(s.avg_rating || 0) >= star ? 'text-[#d4d4a8]' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    {s.user_rating ? (
                      <div className="flex items-center gap-1">
                        <span className="text-[#d4d4a8] font-medium text-lg">{s.user_rating}</span>
                        <svg className="w-5 h-5 text-[#d4d4a8]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    ) : (
                      <span className="text-gray-500">Not rated</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <button onClick={()=>doRate(s.id, s.name, s.user_rating)} className="btn-secondary">
                      {s.user_rating ? 'Modify Rating' : 'Submit Rating'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#3d3d3d]">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-[#4d4d4d] text-sm text-gray-300 hover:bg-[#3d3d3d] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {page} of {totalPages} ({totalStores} stores)
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-[#4d4d4d] text-sm text-gray-300 hover:bg-[#3d3d3d] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, storeId: null, storeName: '', currentRating: null })}
        onSubmit={handleRatingSubmit}
        storeName={ratingModal.storeName}
        currentRating={ratingModal.currentRating}
      />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
