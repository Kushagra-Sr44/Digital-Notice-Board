import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBullhorn, FaFileAlt, FaDownload, FaUsers,
  FaArrowRight, FaPlus, FaTrendingUp,
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import Spinner from '../../components/common/Spinner';
import { downloadService, announcementService, noticeService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentAnn, setRecentAnn] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, a, n] = await Promise.all([
          downloadService.getStats(),
          announcementService.getAll({ limit: 5 }),
          noticeService.getAll({ limit: 5 }),
        ]);
        setStats(s.data);
        setRecentAnn(a.data.announcements || []);
        setRecentNotices(n.data.notices || []);
      } catch (_) {}
      setLoading(false);
    };
    fetch();
  }, []);

  const cards = [
    { label: 'Announcements', value: stats?.announcements ?? '—', icon: FaBullhorn, color: 'from-blue-500 to-blue-600', link: '/admin/announcements' },
    { label: 'Notices', value: stats?.notices ?? '—', icon: FaFileAlt, color: 'from-red-500 to-orange-500', link: '/admin/notices' },
    { label: 'Downloads', value: stats?.downloads ?? '—', icon: FaDownload, color: 'from-emerald-500 to-teal-500', link: '/admin/downloads' },
    { label: 'Users', value: stats?.users ?? '—', icon: FaUsers, color: 'from-purple-500 to-indigo-500', link: '/admin/users' },
  ];

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  return (
    <AdminLayout>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Here's what's happening on your notice board today.</p>
      </div>

      {/* Stat cards */}
      {loading ? <Spinner center /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map(({ label, value, icon: Icon, color, link }) => (
            <Link key={label} to={link} className="card p-5 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white text-lg" />
                </div>
                <FaTrendingUp className="text-gray-300 dark:text-gray-600 text-sm" />
              </div>
              <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="card p-5 mb-8">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Announcement', to: '/admin/announcements', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Add Notice', to: '/admin/notices', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
            { label: 'Upload PDF', to: '/admin/downloads', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
            { label: 'Manage Users', to: '/admin/users', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
          ].map((a) => (
            <Link key={a.label} to={a.to} className={`flex items-center gap-2 px-4 py-3 rounded-xl ${a.color} font-medium text-sm hover:opacity-80 transition-opacity`}>
              <FaPlus className="text-xs" /> {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Announcements</h2>
            <Link to="/admin/announcements" className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:gap-2 transition-all">
              View all <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentAnn.length === 0 ? <p className="text-sm text-gray-400 p-5">No announcements yet.</p> : recentAnn.map((a) => (
              <div key={a._id} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaBullhorn className="text-blue-500 text-xs" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.category} • {formatDate(a.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Notices</h2>
            <Link to="/admin/notices" className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:gap-2 transition-all">
              View all <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentNotices.length === 0 ? <p className="text-sm text-gray-400 p-5">No notices yet.</p> : recentNotices.map((n) => (
              <div key={n._id} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaFileAlt className="text-red-500 text-xs" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{n.title}</p>
                  <p className="text-xs text-gray-400">{n.department} • {formatDate(n.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
