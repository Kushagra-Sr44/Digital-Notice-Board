import React, { useEffect, useState, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBullhorn, FaTimes } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import SearchBar from '../../components/common/SearchBar';
import CategoryBadge from '../../components/common/CategoryBadge';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import { announcementService } from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['General', 'Academic', 'Exam', 'Event', 'Sports', 'Cultural', 'Other'];
const EMPTY = { title: '', description: '', category: 'General', image: null };

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await announcementService.getAll({ page, limit: 8, search });
      setItems(data.announcements || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (_) {}
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [search]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description, category: item.category, image: null });
    setModal(true);
  };
  const closeModal = () => { setModal(false); setEditing(null); setForm(EMPTY); };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm((f) => ({ ...f, image: files[0] }));
    else setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return toast.error('Fill all required fields');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('category', form.category);
      if (form.image) fd.append('image', form.image);

      if (editing) {
        await announcementService.update(editing._id, fd);
        toast.success('Announcement updated');
      } else {
        await announcementService.create(fd);
        toast.success('Announcement created');
      }
      closeModal();
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await announcementService.delete(id);
      toast.success('Announcement deleted');
      setDeleteConfirm(null);
      fetch();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <AdminLayout title="Announcements">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search announcements…" />
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <FaPlus /> Add Announcement
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          {total} announcement{total !== 1 ? 's' : ''}
        </div>

        {loading ? <Spinner center /> : items.length === 0 ? (
          <div className="py-16 text-center">
            <FaBullhorn className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">No announcements yet.</p>
            <button onClick={openCreate} className="btn-primary mt-4 inline-flex items-center gap-2"><FaPlus /> Add One</button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {['Title', 'Category', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FaBullhorn className="text-primary-500 text-xs" />
                            </div>
                          )}
                          <span className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><CategoryBadge label={item.category} /></td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(item)}
                            className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg flex items-center justify-center transition-colors">
                            <FaEdit className="text-xs" />
                          </button>
                          <button onClick={() => setDeleteConfirm(item._id)}
                            className="w-8 h-8 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg flex items-center justify-center transition-colors">
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                {editing ? 'Edit Announcement' : 'New Announcement'}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Announcement title" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Announcement details…" className="input-field resize-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Image {editing && '(leave blank to keep existing)'}
                </label>
                <input type="file" accept="image/*" name="image" onChange={handleChange}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 dark:file:bg-primary-900/20 file:text-primary-700 dark:file:text-primary-400 hover:file:bg-primary-100 transition-colors" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                  {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {editing ? 'Update' : 'Create'}
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
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-red-500 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Delete Announcement?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This action cannot be undone.</p>
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
