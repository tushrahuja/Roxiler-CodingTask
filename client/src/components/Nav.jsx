import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PasswordChangeModal from './PasswordChangeModal';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';

export default function Nav({ onLogout }) {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Click outside to close menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
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
                <div ref={menuRef} className="relative">
                  <div 
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 px-2 py-2 bg-[#3d3d3d] rounded-lg border border-[#4d4d4d] cursor-pointer hover:bg-[#454545] transition-colors"
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: '#d4d4a8', 
                        color: '#1a1a1a',
                        width: 24, 
                        height: 24 
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                    <div className="hidden sm:block text-sm">
                      <div className="text-gray-300 font-medium">
                        {user?.name?.split(' ')[0]}
                      </div>
                      {user?.role !== 'NORMAL_USER' && (
                        <div className="text-xs text-gray-500">
                          {user?.role?.replace('_', ' ')}
                        </div>
                      )}
                    </div>
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform ${showMenu ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {showMenu && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg shadow-2xl py-1 z-50">
                      <button
                        onClick={() => { 
                          setShowPasswordModal(true); 
                          setShowMenu(false); 
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#3d3d3d] transition-colors flex items-center gap-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Change Password
                      </button>
                    </div>
                  )}
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
      <PasswordChangeModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </>
  );
}
