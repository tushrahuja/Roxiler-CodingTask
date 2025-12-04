import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Nav({ onLogout }) {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-[#2d2d2d] border-b border-[#3d3d3d] sticky top-0 z-50 shadow-lg">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-[#d4d4a8] hover:text-[#c4c498] transition-colors">
            RateGenius
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link 
              to="/" 
              className="text-l font-medium text-gray-300 hover:text-white transition-colors relative group"
            >
              Stores
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4d4a8] group-hover:w-full transition-all duration-300"></span>
            </Link>
            {user?.role === 'SYSTEM_ADMIN' && (
              <Link 
                to="/admin" 
                className="text-l font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4d4a8] group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            {user?.role === 'STORE_OWNER' && (
              <Link 
                to={`/owner/${user.id}`} 
                className="text-l font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4d4a8] group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link 
                to="/signup" 
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2"
              >
                Sign up
              </Link>
              <Link 
                to="/login" 
                className="px-5 py-2.5 rounded-lg bg-[#d4d4a8] text-[#1a1a1a] font-semibold hover:bg-[#c4c498] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Log in
              </Link>
            </>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#3d3d3d] rounded-lg border border-[#4d4d4d]">
                <div className="w-5 h-5 rounded-full bg-[#d4d4a8] flex items-center justify-center text-[#1a1a1a] font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="text-sm">
                  <div className="text-gray-300 font-medium">
                    {user?.name?.split(' ')[0]}
                  </div>
                  {user?.role !== 'NORMAL_USER' && (
                    <div className="text-xs text-gray-500">
                      {user?.role?.replace('_', ' ')}
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => { onLogout(); navigate('/login'); }} 
                className="px-4 py-2 rounded-lg border border-[#4d4d4d] text-sm font-medium text-gray-300 hover:bg-[#3d3d3d] hover:text-white transition-all"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
