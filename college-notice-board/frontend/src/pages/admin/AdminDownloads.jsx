import React, { useEffect, useState, useCallback } from 'react';
import { FaPlus, FaTrash, FaDownload, FaFilePdf, FaTimes, FaUpload } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import SearchBar from '../../components/common/SearchBar';
import CategoryBadge from '../../components/common/CategoryBadge';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import { downloadService } from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Syllabus', 'Timetable', 'Circular', 'Form', 'Result', 'Other'];
const EMPTY = { title: '', category: 'Other', pdf: null };

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminDownloads() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await downloadService.getAll({ page, limit: 8, search });
      setItems(data.downloads || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (_) {}
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [search]);

  const closeModal = () => { setModal(false); setForm(EMPTY); };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm((f) => ({ ...f, pdf: files[0] }));
    else setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Enter a title');
    if (!form.pdf) return toast.error('Select a PDF file');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('category', form.category);
      fd.append('pdf', form.pdf);
      await downloadService.upload(fd);
      toast.success('File uploaded');
      closeModal();
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await downloadService.delete(id);
      toast.success('File deleted');
      setDeleteConfirm(null);
      fetch();
    } catch (_) { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout title="Downloads">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search files…" />
        </div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <FaUpload /> Upload PDF
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          {total} file{total !== 1 ? 's' : ''}
        </div>

        {loading ? <Spinner center /> : items.length === 0 ? (
          <div className="py-16 text-center">
            <FaFilePdf className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">No files uploaded yet.</p>
            <button onClick={() => setModal(true)} className="btn-primary mt-4 inline-flex items-center gap-2"><FaUpload /> Upload</button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {['File', 'Category', 'Size', 'Uploaded', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FaFilePdf className="text-red-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[180px]">{item.fileName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><CategoryBadge label={item.category} /></td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatSize(item.fileSize)}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <a href={item.pdfUrl} target="_blank" rel="noreferrer" download={item.fileName}
                            className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 rounded-lg flex items-center justify-center transition-colors">
                            <FaDownload className="text-xs" />
                          </a>
                          <button onClick={() => setDeleteConfirm(item._id)}
                            className="w-8 h-8 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700">
              <Pagination page={page} pages={pages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* Upload Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">Upload PDF</h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Document title" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">PDF File * (max 10MB)</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
                  <FaFilePdf className="text-3xl text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {form.pdf ? form.pdf.name : 'Click to select or drag & drop'}
                  </p>
                  <input type="file" accept=".pdf" name="pdf" onChange={handleChange}
                    className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary-50 dark:file:bg-primary-900/20 file:text-primary-700 dark:file:text-primary-400 hover:file:bg-primary-100" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                  {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <FaUpload /> Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fadeIn text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-red-500 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Delete File?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">The file will be permanently removed from the server.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
