import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, UserPlus, RefreshCw, Mail, User, X, Check, AlertCircle } from 'lucide-react';

const API_BASE = '/api/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', email: '', age: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || `Error: ${response.status}`);
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiCall(API_BASE);
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Failed to sync with server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const validateForm = () => {
    const { username, email, age } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (username.trim().length < 3) return "Username must be at least 3 characters.";
    if (!/^[a-zA-Z0-9]+$/.test(username)) return "Username must be alphanumeric (no spaces).";
    if (!emailRegex.test(email)) return "Please enter a valid email address.";

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      return "Age must be a number between 18 and 100.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);
    const payload = {
      ...formData,
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      age: parseInt(formData.age, 10)
    };

    try {
      if (editingId) {
        await apiCall(`${API_BASE}/${editingId}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await apiCall(API_BASE, { method: 'POST', body: JSON.stringify(payload) });
      }

      setFormData({ username: '', email: '', age: '' });
      setEditingId(null);
      setError(null);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiCall(`${API_BASE}/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      setError("Delete failed. Server unreachable.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <User className="text-indigo-600" />
            {editingId ? "Update Profile" : "Team Directory"}
          </h1>
          <p className="text-gray-500 text-sm">Manage your community members and roles.</p>
        </div>
        {loading && <div className="animate-spin text-indigo-600"><RefreshCw size={20} /></div>}
      </header>

      {error && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-in fade-in">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto"><X size={16} /></button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Username</label>
            <input
              type="text" placeholder="johndoe"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email" placeholder="john@example.com"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Age</label>
            <input
              type="number" placeholder="25"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-white transition-all ${editingId ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 shadow-lg'}`}
          >
            {editingId ? <><Check size={18} /> Save Changes</> : <><UserPlus size={18} /> Create User</>}
          </button>

          {editingId && (
            <button
              onClick={() => { setEditingId(null); setFormData({ username: '', email: '', age: '' }); }}
              type="button"
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length === 0 && !loading ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">No users found in the system.</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingId(user._id); setFormData({ ...user }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <RefreshCw size={16} />
                  </button>
                  <button onClick={() => deleteUser(user._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 truncate">@{user.username}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1 truncate">
                <Mail size={14} className="text-gray-400" /> {user.email}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Member Status</span>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                  Age: {user.age}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
