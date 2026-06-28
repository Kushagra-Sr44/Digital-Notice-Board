import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaUniversity, FaTachometerAlt, FaBullhorn, FaFileAlt, FaDownload,
  FaUsers, FaSignOutAlt, FaBars, FaTimes,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/admin/announcements', label: 'Announcements', icon: FaBullhorn },
  { to: '/admin/notices', label: 'Notices', icon: FaFileAlt },
  { to: '/admin/downloads', label: 'Downloads', icon: FaDownload },
  { to: '/admin/users', label: 'Users', icon: FaUsers },
];

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <FaUniversity className="text-white text-sm" />
          </div>
          <div>
            <p className="font-display font-bold text-gray-900 dark:text-white text-sm">Admin Panel</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Notice Board</p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center mb-2">
          <span className="text-primary-700 dark:text-primary-300 font-semibold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}`}>
              <Icon className={`text-base flex-shrink-0 ${active ? 'text-primary-600 dark:text-primary-400' : ''}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-700">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white dark:bg-gray-800 shadow-md rounded-lg flex items-center justify-center" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <FaTimes className="text-gray-600 dark:text-gray-300" /> : <FaBars className="text-gray-600 dark:text-gray-300" />}
      </button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-white dark:bg-gray-800 h-full shadow-xl"><SidebarContent /></div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
