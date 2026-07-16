"use client";

import { useState, useEffect } from 'react';
import { FaThList, FaSpinner, FaSearch, FaTrash, FaRupeeSign } from 'react-icons/fa';
import { getAllListings, deleteListing } from '@/lib/supabase/listings';
import toast from 'react-hot-toast';

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const data = await getAllListings();
      setListings(data || []);
    } catch (e) {
      console.error('Failed to load listings', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await deleteListing(id);
      setListings(listings.filter(l => l.id !== id));
      toast.success('Listing deleted');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const filtered = listings.filter(l =>
    l.title?.toLowerCase().includes(search.toLowerCase()) ||
    l.profiles?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="page-header">All Listings</h1>

      <div className="relative max-w-md mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search listings..." />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><FaSpinner className="animate-spin text-4xl text-primary-600" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No listings found.</p>
      ) : (
        <div className="card overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Owner</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Price</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{l.title}</td>
                    <td className="px-4 py-3 text-gray-600">{l.profiles?.name || 'N/A'}</td>
                    <td className="px-4 py-3 font-semibold flex items-center gap-1"><FaRupeeSign className="text-xs" />{l.price}</td>
                    <td className="px-4 py-3 text-gray-600">{l.category || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(l.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(l.id)} className="text-red-600 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
