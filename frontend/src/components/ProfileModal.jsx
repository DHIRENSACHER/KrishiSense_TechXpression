import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      phone: user.phone || '',
      address: user.locationName || '' // Pre-fill if exists
    });
  }, [user, isOpen]);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Send coordinates directly to backend, let backend reverse geocode
          // But we need to update the form state too.
          // For now, let's just send the coordinates in the updateProfile call if address is empty?
          // Better: We update the profile immediately with coordinates.

          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          // We'll call a special update or just set it in a hidden way? 
          // The updateProfile API accepts `location: { coordinates: [lon, lat] }`

          /* 
             NOTE: API expects: 
             location: { coordinates: [lon, lat] } 
          */

          const res = await authAPI.updateProfile({
            ...form,
            location: {
              coordinates: [coords.longitude, coords.latitude]
            }
          });

          if (res.data.success) {
            updateUser(res.data.user);
            // Update form address with what backend returned (if it did reverse geocode)
            setForm(s => ({ ...s, address: res.data.user.locationName || 'Current Location Fetched' }));
            setError('Location updated successfully!');
            setTimeout(() => setError(null), 3000);
          }

        } catch (err) {
          setError('Failed to update location from coordinates');
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError('Unable to retrieve your location');
        setGeoLoading(false);
      }
    );
  };

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

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Location (City/Village)</span>
          <div className="flex gap-2">
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. Pune, Maharashtra"
              className="mt-1 input flex-1"
            />
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
              className="mt-1 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 flex items-center justify-center whitespace-nowrap"
              title="Use Current Location"
            >
              {geoLoading ? '...' : '📍 Detect'}
            </button>
          </div>
        </label>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 border rounded">Cancel</button>
          <button type="submit" disabled={loading} className="px-3 py-2 bg-primary-600 text-white rounded">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
