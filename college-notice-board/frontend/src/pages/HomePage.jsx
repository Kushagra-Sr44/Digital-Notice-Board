import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBullhorn, FaCalendarAlt, FaFileAlt, FaFileCircle, FaUserGraduate,
  FaArrowRight, FaDownload, FaEye, FaFilePdf, FaClock,
} from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSlider from '../components/common/HeroSlider';
import CategoryBadge from '../components/common/CategoryBadge';
import Spinner from '../components/common/Spinner';
import { announcementService, noticeService, downloadService } from '../services/api';

const quickLinks = [
  { label: 'All Announcements', to: '/announcements', icon: FaBullhorn, color: 'bg-blue-500' },
  { label: 'Academic Calendar', to: '/downloads', icon: FaCalendarAlt, color: 'bg-green-500' },
  { label: 'Exam Notices', to: '/notices', icon: FaFileAlt, color: 'bg-red-500' },
  { label: 'Circulars', to: '/downloads', icon: FaFileAlt, color: 'bg-purple-500' },
  { label: 'Student Portal', to: '/', icon: FaUserGraduate, color: 'bg-orange-500' },
];

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function HomePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [notices, setNotices] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [a, n, d] = await Promise.all([
          announcementService.getAll({ limit: 6 }),
          noticeService.getAll({ limit: 5 }),
          downloadService.getAll({ limit: 4 }),
        ]);
        setAnnouncements(a.data.announcements || []);
        setNotices(n.data.notices || []);
        setDownloads(d.data.downloads || []);
      } catch (_) {}
      setLoading(false);
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <HeroSlider />

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 mb-14">
        <div className="card p-2 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-x divide-gray-100 dark:divide-gray-700">
            {quickLinks.map((ql) => (
              <Link key={ql.label} to={ql.to}
                className="flex flex-col items-center gap-2 py-5 px-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg group">
                <div className={`w-11 h-11 ${ql.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <ql.icon className="text-white text-lg" />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">{ql.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-1">Latest Updates</p>
            <h2 className="section-title">Announcements</h2>
          </div>
          <Link to="/announcements" className="flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-2.5 transition-all">
            View all <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {loading ? <Spinner center /> : (
          announcements.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No announcements yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {announcements.map((a) => (
                <div key={a._id} className="card overflow-hidden hover:shadow-md transition-shadow group animate-fadeIn">
                  {a.image ? (
                    <div className="h-40 overflow-hidden bg-gray-100">
                      <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 flex items-center justify-center">
                      <FaBullhorn className="text-4xl text-primary-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <CategoryBadge label={a.category} />
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <FaClock className="text-xs" /> {formatDate(a.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{a.description}</p>
                    <Link to="/announcements" className="text-sm font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1.5 hover:gap-2.5 transition-all">
                      Read More <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </section>

      {/* Notices + Downloads */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Notices */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-1">Important</p>
                <h2 className="section-title">Notices</h2>
              </div>
              <Link to="/notices" className="flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-2.5 transition-all">
                View all <FaArrowRight className="text-xs" />
              </Link>
            </div>
            <div className="card divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
              {loading ? <Spinner center /> : notices.length === 0 ? (
                <div className="py-10 text-center text-gray-400">No notices yet.</div>
              ) : notices.map((n) => (
                <div key={n._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{n.title}</p>
                      <CategoryBadge label={n.priority || 'normal'} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.department} • {formatDate(n.createdAt)}</p>
                  </div>
                  <Link to="/notices" className="text-primary-500 hover:text-primary-700 text-sm flex-shrink-0">
                    <FaEye />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Downloads */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">Resources</p>
                <h2 className="section-title">Downloads</h2>
              </div>
              <Link to="/downloads" className="flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-2.5 transition-all">
                All <FaArrowRight className="text-xs" />
              </Link>
            </div>
            <div className="card divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
              {loading ? <Spinner center /> : downloads.length === 0 ? (
                <div className="py-10 text-center text-gray-400">No files yet.</div>
              ) : downloads.map((d) => (
                <div key={d._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaFilePdf className="text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{d.title}</p>
                      <p className="text-xs text-gray-400">{formatSize(d.fileSize)} • {formatDate(d.createdAt)}</p>
                    </div>
                    <a href={d.pdfUrl} target="_blank" rel="noreferrer" download
                      className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                      <FaDownload className="text-xs" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-2xl" />
          </div>
          <div className="relative z-10">
            <h2 className="font-display font-bold text-2xl md:text-4xl text-white mb-3">Stay Connected & Informed</h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">Never miss an important notice, exam date, or college event. Check the notice board regularly.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/announcements" className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-3 px-6 rounded-xl transition-colors shadow-md">
                Browse Announcements
              </Link>
              <Link to="/notices" className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl border border-white/30 backdrop-blur-sm transition-colors">
                View All Notices
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
