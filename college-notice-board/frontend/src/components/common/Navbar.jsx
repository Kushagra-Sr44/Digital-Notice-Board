import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaUniversity, FaBell, FaBars, FaTimes, FaMoon, FaSun, FaUserCircle, FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/notices', label: 'Notices' },
  { to: '/downloads', label: 'Downloads' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white dark:bg-gray-900 shadow-md' : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-md">
              <FaUniversity className="text-white text-lg" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-bold text-primary-700 dark:text-primary-400 text-sm leading-tight">Excel College</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Digital Notice Board</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.to ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {dark ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>
            <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
              <FaBell />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/admin" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-colors">
                  <FaUserCircle /> Dashboard
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">Login</Link>
            )}
            <button className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(!open)}>
              {open ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-1 animate-fadeIn">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.to ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-700' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/admin" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-primary-600">Dashboard</Link>
              <button onClick={() => { handleLogout(); setOpen(false); }} className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-500">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium bg-primary-600 text-white text-center">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
