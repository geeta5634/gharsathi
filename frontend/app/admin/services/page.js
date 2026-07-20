"use client";

import { useState } from 'react';
import { FaWrench, FaBolt, FaHammer, FaBroom, FaCar, FaFire, FaBaby, FaHeartbeat, FaShieldAlt, FaSnowflake, FaTint, FaMagic, FaPlus, FaEdit, FaToggleOn, FaToggleOff, FaTimes, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useServices, useCreateService, useUpdateService } from '@/lib/hooks';

const iconMap = { FaWrench, FaBolt, FaHammer, FaBroom, FaCar, FaFire, FaBaby, FaHeartbeat, FaShieldAlt, FaSnowflake, FaTint, FaMagic };

function getIcon(name) {
  const map = { Maid: FaBroom, Cook: FaFire, Driver: FaCar, 'Baby Sitter': FaBaby, 'Elder Care': FaHeartbeat, 'Security Guard': FaShieldAlt, Plumber: FaWrench, Electrician: FaBolt, Carpenter: FaHammer, 'Home Cleaning': FaMagic, 'AC Repair': FaSnowflake, 'RO Service/Repair': FaTint };
  return map[name] || FaWrench;
}

export default function AdminServices() {
  const { data: services = [], isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', is_active: true });

  const openAdd = () => { setEditService(null); setForm({ name: '', description: '', price: '', is_active: true }); setShowModal(true); };
  const openEdit = (s) => { setEditService(s); setForm({ name: s.name, description: s.description, price: s.price || s.basePrice, is_active: s.is_active ?? s.active ?? true }); setShowModal(true); };

  const handleSave = async () => {
    const payload = { name: form.name, description: form.description, price: parseFloat(form.price), is_active: form.is_active };
    try {
      if (editService) {
        await updateService.mutateAsync({ id: editService._id || editService.id, data: payload });
        toast.success('Service updated!');
      } else {
        await createService.mutateAsync(payload);
        toast.success('Service added!');
      }
      setShowModal(false);
    } catch {
      toast.error('Failed to save service');
    }
  };

  const toggleActive = async (s) => {
    try {
      await updateService.mutateAsync({ id: s._id || s.id, data: { is_active: !(s.is_active ?? s.active ?? true) } });
    } catch {
      toast.error('Failed to toggle service');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-2xl text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-header mb-0">Manage Services</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><FaPlus /> Add Service</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(s => {
          const Icon = iconMap[s.icon] || getIcon(s.name) || FaWrench;
          const isActive = s.is_active ?? s.active ?? true;
          return (
            <div key={s._id || s.id} className={`card ${!isActive ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <Icon className="text-2xl text-primary-600" />
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="text-gray-400 hover:text-primary-600 p-1"><FaEdit /></button>
                  <button onClick={() => toggleActive(s)} className={`p-1 ${isActive ? 'text-green-500 hover:text-red-500' : 'text-red-500 hover:text-green-500'}`}>
                    {isActive ? <FaToggleOn className="text-xl" /> : <FaToggleOff className="text-xl" />}
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-800">{s.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{s.description}</p>
              <p className="text-primary-600 font-bold mt-2">₹{s.price || s.basePrice}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-semibold ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">{editService ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Service Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Plumber" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} placeholder="Service description" />
              </div>
              <div>
                <label className="label">Base Price (₹)</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="199" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <button onClick={handleSave} className="w-full btn-primary" disabled={createService.isPending || updateService.isPending}>
                {(createService.isPending || updateService.isPending) ? <FaSpinner className="animate-spin inline" /> : null}
                {editService ? 'Update' : 'Add'} Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}