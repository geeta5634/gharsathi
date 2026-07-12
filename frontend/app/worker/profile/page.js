"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../../lib/api';
import TrustScoreBadge from '../../../components/TrustScoreBadge';
import { useAuth } from '../../../lib/auth';
import { FaUser, FaPhone, FaEnvelope, FaSpinner, FaSave, FaBriefcase, FaCalendar } from 'react-icons/fa';

const serviceOptions = ['Plumber', 'Electrician', 'Carpenter', 'House Painter', 'House Cleaning', 'Driver / Maid'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WorkerProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', email: '', bio: '', experience: '',
    services: [], availability: {}, trustScore: 75, rating: 4.5,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/worker/profile')
      .then(res => {
        const d = res.data.worker || res.data;
        setForm({
          name: d.name || user?.name || '',
          phone: d.phone || user?.phone || '',
          email: d.email || user?.email || '',
          bio: d.bio || '',
          experience: d.experience || '',
          services: d.services || [],
          availability: d.availability || {},
          trustScore: d.trustScore || 75,
          rating: d.rating || 4.5,
        });
      })
      .catch(() => {
        setForm(f => ({ ...f, name: user?.name || 'Worker', phone: user?.phone || '', email: user?.email || '' }));
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleService = (s) => {
    setForm(f => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s],
    }));
  };

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      availability: { ...f.availability, [day]: !f.availability[day] },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/worker/profile', form);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500"><FaSpinner className="animate-spin text-2xl mx-auto" /></div>;

  return (
    <div className="max-w-2xl">
      <h1 className="page-header">Edit Profile</h1>

      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <FaUser className="text-3xl text-primary-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{form.name}</h3>
            <TrustScoreBadge score={form.trustScore} />
            <p className="text-sm text-gray-500 mt-1">Rating: {form.rating?.toFixed(1)} ⭐</p>
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="label">Full Name</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input name="name" value={form.name} onChange={handleChange} className="input-field pl-10" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Phone</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input name="phone" value={form.phone} onChange={handleChange} className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input name="email" value={form.email} onChange={handleChange} className="input-field pl-10" />
            </div>
          </div>
        </div>
        <div>
          <label className="label">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} className="input-field" rows={3} placeholder="Tell customers about yourself..." />
        </div>
        <div>
          <label className="label">Experience (years)</label>
          <div className="relative">
            <FaBriefcase className="absolute left-3 top-3 text-gray-400" />
            <input type="number" name="experience" value={form.experience} onChange={handleChange} className="input-field pl-10" min="0" />
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <h3 className="font-bold text-gray-800 mb-3">Services Offered</h3>
        <div className="flex flex-wrap gap-2">
          {serviceOptions.map(s => (
            <button key={s} onClick={() => toggleService(s)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${form.services.includes(s) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card mt-6">
        <h3 className="font-bold text-gray-800 mb-3"><FaCalendar className="inline mr-2" />Availability</h3>
        <div className="flex flex-wrap gap-2">
          {days.map(d => (
            <button key={d} onClick={() => toggleDay(d)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${form.availability[d] ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'}`}>
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="card mt-6">
        <h3 className="font-bold text-gray-800 mb-3">Documents</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
          <p className="text-gray-500">Click to upload ID proof, certificates, etc.</p>
          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary mt-6 flex items-center gap-2">
        {saving ? <><FaSpinner className="animate-spin" /> Saving...</> : <><FaSave /> Save Profile</>}
      </button>
    </div>
  );
}
