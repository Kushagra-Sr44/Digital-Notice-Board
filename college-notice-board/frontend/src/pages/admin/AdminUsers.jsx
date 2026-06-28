import React, { useEffect, useState } from 'react';
import { FaPlus, FaUsers, FaTimes, FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import Spinner from '../../components/common/Spinner';
import api, { authService } from '../../services/api';
import toast from 'react-hot-toast';

const EMPTY = { name: '', email: '', password: '', role: 'teacher' };

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data || []);
    } catch (_) { setUsers([]); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Fill all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setSubmitting(true);
    try {
      await authService.register(form);
      toast.success('User registered');
      setModal(false);
      setForm(EMPTY);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setSubmitting(false);
  };

  return (
    <AdminLayout title="Users">
      <div className="flex justify-end mb-6">
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
          <FaPlus /> Add User
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          {users.length} user{users.length !== 1 ? 's' : ''}
        </div>

        {loading ? <Spinner center /> : users.length === 0 ? (
          <div className="py-16 text-center">
            <FaUsers className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">No users found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {users.map((u) => (
              <div key={u._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-semibold text-primary-700 dark:text-primary-300">{u.name?.[0]?.toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
                </div>
                <div className="text-right">
                  <span className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 capitalize">{u.role}</span>
                  <p className="text-xs text-gray-400 mt-1">Joined {formatDate(u.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add user modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">Add New User</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Dr. Jane Smith" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="teacher@college.edu" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password *</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className="input-field pr-10" required minLength={6} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
                <select name="role" value={form.role} onChange={handleChange} className="input-field">
                  <option value="teacher">Teacher / Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                  {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
