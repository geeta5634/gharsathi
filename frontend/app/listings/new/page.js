"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createListing } from '@/lib/supabase/listings';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';

export default function NewListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: '', description: '', price: '', image_url: '', category: '' });
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Please log in to create a listing.</p>
            <Link href="/login" className="btn-primary">Login</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createListing({
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        image_url: form.image_url || null,
        category: form.category || null,
        user_id: user.id,
      });
      toast.success('Listing created!');
      router.push('/listings');
    } catch (err) {
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-12 bg-gray-50 flex-1">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/listings" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 mb-6">
            <FaArrowLeft /> Back to Listings
          </Link>
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Listing</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Title *</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="e.g. Plumbing Service" required />
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="input-field min-h-[100px]" placeholder="Describe your service or product..." required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Price (₹) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field" placeholder="199" min="0" step="0.01" required />
                </div>
                <div>
                  <label className="label">Category</label>
                  <input type="text" name="category" value={form.category} onChange={handleChange} className="input-field" placeholder="e.g. Plumbing, Electrical" />
                </div>
              </div>
              <div>
                <label className="label">Image URL</label>
                <input type="url" name="image_url" value={form.image_url} onChange={handleChange} className="input-field" placeholder="https://example.com/image.jpg" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loading ? <><FaSpinner className="animate-spin" /> Creating...</> : 'Create Listing'}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
