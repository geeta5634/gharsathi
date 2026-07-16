"use client";

import { useState } from 'react';
import { FaSave, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      toast.success('Settings saved!');
      setSaving(false);
    }, 1000);
  };

  return (
    <div>
      <h1 className="page-header">Settings</h1>
      <div className="card max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Site Name</label>
            <input type="text" className="input-field" defaultValue="GharSathi" />
          </div>
          <div>
            <label className="label">Support Email</label>
            <input type="email" className="input-field" defaultValue="support@gharsathi.com" />
          </div>
          <div>
            <label className="label">Support Phone</label>
            <input type="tel" className="input-field" defaultValue="+91 9876543210" />
          </div>
          <div>
            <label className="label">Address</label>
            <textarea className="input-field" defaultValue="123, Business Hub, Andheri East, Mumbai" rows={2} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <><FaSpinner className="animate-spin" /> Saving...</> : <><FaSave /> Save Settings</>}
          </button>
        </form>
      </div>
    </div>
  );
}
