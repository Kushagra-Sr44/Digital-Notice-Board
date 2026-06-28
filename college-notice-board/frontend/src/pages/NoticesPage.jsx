import React, { useEffect, useState, useCallback } from 'react';
import { FaFileAlt, FaClock, FaBuilding } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SearchBar from '../components/common/SearchBar';
import CategoryBadge from '../components/common/CategoryBadge';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';
import { noticeService } from '../services/api';

const DEPARTMENTS = ['All', 'Computer Science', 'Engineering', 'Arts', 'Commerce', 'Science', 'Management'];
const PRIORITIES = { urgent: 'bg-red-500', high: 'bg-orange-400', normal: 'bg-blue-500', low: 'bg-gray-400' };

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search, department: department === 'All' ? '' : department };
      const { data } = await noticeService.getAll(params);
      setNotices(data.notices || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (_) {}
    setLoading(false);
  }, [page, search, department]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [search, department]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-16">
        <div className="bg-gradient-to-br from-red-600 to-orange-500 py-12 px-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FaFileAlt className="text-white text-xl" />
            </div>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">Notices</h1>
          <p className="text-white/70 text-sm">{total} notice{total !== 1 ? 's' : ''} found</p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="card p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <SearchBar value={search} onChange={setSearch} placeholder="Search notices…" />
            </div>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="input-field w-full sm:w-52">
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          {loading ? <Spinner center /> : notices.length === 0 ? (
            <div className="text-center py-16">
              <FaFileAlt className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notices found.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {notices.map((n, i) => (
                  <div key={n._id} className="card p-5 hover:shadow-md transition-shadow animate-fadeIn flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <span className="font-display font-bold text-primary-600 dark:text-primary-400 text-sm">{String(i + 1 + (page - 1) * 10).padStart(2, '0')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${PRIORITIES[n.priority] || 'bg-gray-400'}`} />
                        <CategoryBadge label={n.priority || 'normal'} />
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FaBuilding className="text-xs" /> {n.department}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FaClock className="text-xs" /> {formatDate(n.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{n.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{n.description}</p>
                      {n.createdBy && <p className="text-xs text-gray-400 mt-2">— {n.createdBy.name}</p>}
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
