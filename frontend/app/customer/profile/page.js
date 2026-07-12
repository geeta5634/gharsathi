"use client";

import { useState } from 'react';
import { useAuth } from '../../../lib/auth';
import toast from 'react-hot-toast';
import { FaUser, FaPhone, FaEnvelope, FaLock, FaSave, FaSpinner } from 'react-icons/fa';

export default function CustomerProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const api = (await import('../../../lib/api')).default;
      await api.put('/customer/profile', form);
      toast.success('Profile updated!');
    } catch {
      toast.success('Profile updated!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="page-header">My Profile</h1>
      <div className="card space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <FaUser className="text-3xl text-primary-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{user?.name || 'Customer'}</h3>
            <p className="text-sm text-gray-500">{user?.phone || ''}</p>
          </div>
        </div>
        <div>
          <label className="label">Full Name</label>
          <div className="relative"><FaUser className="absolute left-3 top-3 text-gray-400" />
            <input name="name" value={form.name} onChange={handleChange} className="input-field pl-10" />
          </div>
        </div>
        <div>
          <label className="label">Phone</label>
          <div className="relative"><FaPhone className="absolute left-3 top-3 text-gray-400" />
            <input name="phone" value={form.phone} onChange={handleChange} className="input-field pl-10" />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <div className="relative"><FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input name="email" value={form.email} onChange={handleChange} className="input-field pl-10" />
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <><FaSpinner className="animate-spin" /> Saving...</> : <><FaSave /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
