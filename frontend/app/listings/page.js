"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getListings, deleteListing } from '@/lib/supabase/listings';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaMapMarkerAlt, FaRupeeSign, FaClock, FaUser } from 'react-icons/fa';

export default function ListingsPage() {
  const { user, profile } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const data = await getListings();
      setListings(data || []);
    } catch (e) {
      console.error('Failed to load listings', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    setDeleting(id);
    try {
      await deleteListing(id);
      setListings(listings.filter(l => l.id !== id));
      toast.success('Listing deleted!');
    } catch (e) {
      toast.error('Failed to delete listing');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = listings.filter(l =>
    l.title?.toLowerCase().includes(search.toLowerCase()) ||
    l.description?.toLowerCase().includes(search.toLowerCase()) ||
    l.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Listings</h1>
              <p className="text-blue-200">Browse all available services and products</p>
            </div>
            {user && (
              <Link href="/listings/new" className="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-lg transition-all inline-flex items-center gap-2 shadow-lg">
                <FaPlus /> Add Listing
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-md mb-8">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
              placeholder="Search listings..."
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <FaSpinner className="animate-spin text-4xl text-primary-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">{search ? 'No listings match your search.' : 'No listings yet.'}</p>
              {user && (
                <Link href="/listings/new" className="btn-primary inline-flex items-center gap-2">
                  <FaPlus /> Create First Listing
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => (
                <div key={listing.id} className="card group">
                  <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    {listing.image_url ? (
                      <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl text-primary-300 font-bold">{listing.title?.charAt(0)?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors">{listing.title}</h3>
                    <span className="text-lg font-bold text-primary-600 flex items-center gap-1">
                      <FaRupeeSign className="text-sm" />{listing.price}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><FaUser className="text-primary-400" /> {listing.profiles?.name || 'Anonymous'}</span>
                    <span className="flex items-center gap-1"><FaClock className="text-primary-400" /> {new Date(listing.created_at).toLocaleDateString()}</span>
                    {listing.category && <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-primary-400" /> {listing.category}</span>}
                  </div>
                  {user && profile?.id === listing.user_id && (
                    <div className="flex gap-2 pt-3 border-t">
                      <Link href={`/listings/edit/${listing.id}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                        <FaEdit /> Edit
                      </Link>
                      <button onClick={() => handleDelete(listing.id)} disabled={deleting === listing.id} className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                        {deleting === listing.id ? <FaSpinner className="animate-spin" /> : <FaTrash />} Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
