import React, { useEffect, useState, useCallback } from 'react';
import { FaBullhorn, FaClock, FaArrowRight } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SearchBar from '../components/common/SearchBar';
import CategoryBadge from '../components/common/CategoryBadge';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';
import { announcementService } from '../services/api';

const CATEGORIES = ['All', 'General', 'Academic', 'Exam', 'Event', 'Sports', 'Cultural', 'Other'];

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, search, category: category === 'All' ? '' : category };
      const { data } = await announcementService.getAll(params);
      setAnnouncements(data.announcements || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (_) {}
    setLoading(false);
  }, [page, search, category]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [search, category]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-700 to-primary-500 py-12 px-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FaBullhorn className="text-white text-xl" />
            </div>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">Announcements</h1>
          <p className="text-white/70 text-sm">{total} announcement{total !== 1 ? 's' : ''} found</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Filters */}
          <div className="card p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full sm:w-auto">
              <SearchBar value={search} onChange={setSearch} placeholder="Search announcements…" />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${category === c ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading ? <Spinner center /> : announcements.length === 0 ? (
            <div className="text-center py-16">
              <FaBullhorn className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No announcements found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map((a) => (
                  <div key={a._id} className="card overflow-hidden hover:shadow-lg transition-all duration-200 group animate-fadeIn">
                    {a.image ? (
                      <div className="h-44 overflow-hidden bg-gray-100">
                        <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ) : (
                      <div className="h-44 bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-primary-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                        <FaBullhorn className="text-5xl text-primary-200 dark:text-primary-700" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <CategoryBadge label={a.category} />
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <FaClock className="text-xs" /> {formatDate(a.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {a.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">{a.description}</p>
                      {a.createdBy && (
                        <p className="text-xs text-gray-400 mb-3">Posted by: {a.createdBy.name}</p>
                      )}
                      <div className="flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400">
                        Read More <FaArrowRight className="text-xs" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination page={page} pages={pages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
