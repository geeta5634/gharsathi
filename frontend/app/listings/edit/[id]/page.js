"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getListing, updateListing } from '@/lib/supabase/listings';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';

export default function EditListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({ title: '', description: '', price: '', image_url: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params.id) loadListing();
  }, [params.id]);

  const loadListing = async () => {
    try {
      const data = await getListing(params.id);
      if (!data) throw new Error('Not found');
      if (data.user_id !== user?.id) {
        toast.error('You can only edit your own listings');
        router.push('/listings');
        return;
      }
      setForm({
        title: data.title || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        image_url: data.image_url || '',
        category: data.category || '',
      });
    } catch (e) {
      toast.error('Failed to load listing');
      router.push('/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateListing(params.id, {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        image_url: form.image_url || null,
        category: form.category || null,
      });
      toast.success('Listing updated!');
      router.push('/listings');
    } catch (err) {
      toast.error('Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Please log in to edit listings.</p>
            <Link href="/login" className="btn-primary">Login</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-primary-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-12 bg-gray-50 flex-1">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/listings" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 mb-6">
            <FaArrowLeft /> Back to Listings
          </Link>
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Listing</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Title *</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="input-field min-h-[100px]" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Price (₹) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field" min="0" step="0.01" required />
                </div>
                <div>
                  <label className="label">Category</label>
                  <input type="text" name="category" value={form.category} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Image URL</label>
                <input type="url" name="image_url" value={form.image_url} onChange={handleChange} className="input-field" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {saving ? <><FaSpinner className="animate-spin" /> Saving...</> : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
