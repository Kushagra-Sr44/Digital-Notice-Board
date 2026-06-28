import React, { useEffect, useState, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaFileAlt, FaTimes } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import SearchBar from '../../components/common/SearchBar';
import CategoryBadge from '../../components/common/CategoryBadge';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import { noticeService } from '../../services/api';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['All', 'Computer Science', 'Engineering', 'Arts', 'Commerce', 'Science', 'Management'];
const PRIORITIES = ['low', 'normal', 'high', 'urgent'];
const EMPTY = { title: '', description: '', department: 'All', priority: 'normal' };

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminNotices() {
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
      const { data } = await noticeService.getAll({ page, limit: 8, search });
      setItems(data.notices || []);
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
    setForm({ title: item.title, description: item.description, department: item.department, priority: item.priority });
    setModal(true);
  };
  const closeModal = () => { setModal(false); setEditing(null); setForm(EMPTY); };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return toast.error('Fill all required fields');
    setSubmitting(true);
    try {
      if (editing) {
        await noticeService.update(editing._id, form);
        toast.success('Notice updated');
      } else {
        await noticeService.create(form);
        toast.success('Notice created');
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
      await noticeService.delete(id);
      toast.success('Notice deleted');
      setDeleteConfirm(null);
      fetch();
    } catch (_) { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout title="Notices">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search notices…" />
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <FaPlus /> Add Notice
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          {total} notice{total !== 1 ? 's' : ''}
        </div>

        {loading ? <Spinner center /> : items.length === 0 ? (
          <div className="py-16 text-center">
            <FaFileAlt className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">No notices yet.</p>
            <button onClick={openCreate} className="btn-primary mt-4 inline-flex items-center gap-2"><FaPlus /> Add One</button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {['Title', 'Department', 'Priority', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white max-w-xs">
                        <p className="line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{item.department}</td>
                      <td className="px-5 py-3.5"><CategoryBadge label={item.priority || 'normal'} /></td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(item)}
                            className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                            <FaEdit className="text-xs" />
                          </button>
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                {editing ? 'Edit Notice' : 'New Notice'}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Notice title" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Notice details…" className="input-field resize-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Department</label>
                  <select name="department" value={form.department} onChange={handleChange} className="input-field">
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
                  <select name="priority" value={form.priority} onChange={handleChange} className="input-field capitalize">
                    {PRIORITIES.map((p) => <option key={p} className="capitalize">{p}</option>)}
                  </select>
                </div>
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
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Delete Notice?</h3>
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
