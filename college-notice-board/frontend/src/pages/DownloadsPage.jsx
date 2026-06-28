import React, { useEffect, useState, useCallback } from 'react';
import { FaDownload, FaFilePdf, FaClock, FaTag } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SearchBar from '../components/common/SearchBar';
import CategoryBadge from '../components/common/CategoryBadge';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';
import { downloadService } from '../services/api';

const CATEGORIES = ['All', 'Syllabus', 'Timetable', 'Circular', 'Form', 'Result', 'Other'];

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, search, category: category === 'All' ? '' : category };
      const { data } = await downloadService.getAll(params);
      setDownloads(data.downloads || []);
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
        <div className="bg-gradient-to-br from-emerald-700 to-teal-500 py-12 px-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FaDownload className="text-white text-xl" />
            </div>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">Download Center</h1>
          <p className="text-white/70 text-sm">{total} file{total !== 1 ? 's' : ''} available</p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="card p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <SearchBar value={search} onChange={setSearch} placeholder="Search files…" />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${category === c ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading ? <Spinner center /> : downloads.length === 0 ? (
            <div className="text-center py-16">
              <FaDownload className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No files available.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {downloads.map((d) => (
                  <div key={d._id} className="card p-5 hover:shadow-md transition-all animate-fadeIn group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <FaFilePdf className="text-red-500 text-xl" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">{d.title}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <FaTag className="text-xs" /> {d.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        <div className="flex items-center gap-1 mb-0.5"><FaClock className="text-xs" /> {formatDate(d.createdAt)}</div>
                        <div>{formatSize(d.fileSize)}</div>
                      </div>
                      <a href={d.pdfUrl} target="_blank" rel="noreferrer" download={d.fileName}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
                        <FaDownload className="text-xs" /> Download
                      </a>
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
