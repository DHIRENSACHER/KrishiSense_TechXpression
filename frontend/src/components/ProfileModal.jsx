import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name || '', phone: user.phone || '' });
  }, [user, isOpen]);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.updateProfile(form);
      if (res.data.success) {
        updateUser(res.data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Profile" size="max-w-md">
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Name</span>
          <input name="name" value={form.name} onChange={handleChange} className="mt-1 input" />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Phone</span>
          <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 input" />
        </label>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 border rounded">Cancel</button>
          <button type="submit" disabled={loading} className="px-3 py-2 bg-primary-600 text-white rounded">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
