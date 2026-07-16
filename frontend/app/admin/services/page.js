"use client";

import { useState } from 'react';
import { FaWrench, FaBolt, FaHammer, FaPaintRoller, FaBroom, FaCar, FaPlus, FaEdit, FaToggleOn, FaToggleOff, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const initialServices = [
  { _id: 's1', name: 'Plumber', description: 'Pipe fitting, leak repair, bathroom fitting', basePrice: 199, active: true, icon: FaWrench },
  { _id: 's2', name: 'Electrician', description: 'Wiring, switch repair, fan installation', basePrice: 179, active: true, icon: FaBolt },
  { _id: 's3', name: 'Carpenter', description: 'Furniture repair, door fitting, shelf work', basePrice: 249, active: true, icon: FaHammer },
  { _id: 's4', name: 'House Painter', description: 'Interior & exterior painting, texture work', basePrice: 299, active: true, icon: FaPaintRoller },
  { _id: 's5', name: 'House Cleaning', description: 'Deep cleaning, kitchen, bathroom, full home', basePrice: 149, active: true, icon: FaBroom },
  { _id: 's6', name: 'Driver / Maid', description: 'Daily driver, part-time maid, cooking help', basePrice: 399, active: false, icon: FaCar },
];

export default function AdminServices() {
  const [services, setServices] = useState(initialServices);
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', basePrice: '', active: true });

  const openAdd = () => { setEditService(null); setForm({ name: '', description: '', basePrice: '', active: true }); setShowModal(true); };
  const openEdit = (s) => { setEditService(s); setForm({ name: s.name, description: s.description, basePrice: s.basePrice, active: s.active }); setShowModal(true); };

  const handleSave = () => {
    if (editService) {
      setServices(services.map(s => s._id === editService._id ? { ...s, ...form } : s));
      toast.success('Service updated!');
    } else {
      const newService = { ...form, _id: 's' + Date.now(), icon: FaWrench };
      setServices([...services, newService]);
      toast.success('Service added!');
    }
    setShowModal(false);
  };

  const toggleActive = (id) => {
    setServices(services.map(s => s._id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-header mb-0">Manage Services</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><FaPlus /> Add Service</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(s => {
          const Icon = s.icon;
          return (
            <div key={s._id} className={`card ${!s.active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <Icon className="text-2xl text-primary-600" />
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="text-gray-400 hover:text-primary-600 p-1"><FaEdit /></button>
                  <button onClick={() => toggleActive(s._id)} className={`p-1 ${s.active ? 'text-green-500 hover:text-red-500' : 'text-red-500 hover:text-green-500'}`}>
                    {s.active ? <FaToggleOn className="text-xl" /> : <FaToggleOff className="text-xl" />}
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-800">{s.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{s.description}</p>
              <p className="text-primary-600 font-bold mt-2">₹{s.basePrice}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-semibold ${s.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {s.active ? 'Active' : 'Inactive'}
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
                <input type="number" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} className="input-field" placeholder="199" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <button onClick={handleSave} className="w-full btn-primary">{editService ? 'Update' : 'Add'} Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
