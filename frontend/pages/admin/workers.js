import { useState } from 'react';
import Link from 'next/link';
import { HiOutlineSearch, HiOutlineStar, HiOutlineCheck, HiOutlineX, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';

const initialWorkers = [
  { id: 1, name: 'Rajesh Kumar', service: 'Plumber', phone: '+91 98765 43210', status: 'Active', rating: 4.8, jobs: 1250, verified: true },
  { id: 2, name: 'Suresh Patel', service: 'Electrician', phone: '+91 98765 43211', status: 'Active', rating: 4.9, jobs: 2100, verified: true },
  { id: 3, name: 'Amit Singh', service: 'Carpenter', phone: '+91 98765 43212', status: 'Inactive', rating: 4.6, jobs: 876, verified: true },
  { id: 4, name: 'Vijay Sharma', service: 'Painter', phone: '+91 98765 43213', status: 'Active', rating: 4.7, jobs: 1567, verified: true },
  { id: 5, name: 'Priya Devi', service: 'Maid', phone: '+91 98765 43214', status: 'Active', rating: 4.5, jobs: 654, verified: true },
  { id: 6, name: 'Manoj Verma', service: 'Driver', phone: '+91 98765 43215', status: 'Active', rating: 4.8, jobs: 3456, verified: true },
  { id: 7, name: 'Sunita Gupta', service: 'Cleaner', phone: '+91 98765 43216', status: 'Suspended', rating: 4.4, jobs: 432, verified: false },
  { id: 8, name: 'Deepak Yadav', service: 'Plumber', phone: '+91 98765 43217', status: 'Active', rating: 4.7, jobs: 987, verified: true },
  { id: 9, name: 'Anita Sharma', service: 'Maid', phone: '+91 98765 43218', status: 'Active', rating: 4.6, jobs: 543, verified: true },
  { id: 10, name: 'Ravi Kumar', service: 'Electrician', phone: '+91 98765 43219', status: 'Inactive', rating: 4.7, jobs: 1432, verified: true },
];

export default function AdminWorkers() {
  const [workers, setWorkers] = useState(initialWorkers);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = workers.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.service.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || w.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-500 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Worker Management</h1>
              <p className="text-primary-200 text-sm">Manage all registered service professionals</p>
            </div>
            <Link href="/admin" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search workers..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
            </div>
            <div className="flex gap-2">
              {['All', 'Active', 'Inactive', 'Suspended'].map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filterStatus === s ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 font-medium text-gray-500">Worker</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Service</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Phone</th>
                <th className="text-center py-3 px-3 font-medium text-gray-500">Rating</th>
                <th className="text-center py-3 px-3 font-medium text-gray-500">Jobs</th>
                <th className="text-center py-3 px-3 font-medium text-gray-500">Verified</th>
                <th className="text-center py-3 px-3 font-medium text-gray-500">Status</th>
                <th className="text-center py-3 px-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">{w.name}</td>
                  <td className="py-3 px-3">{w.service}</td>
                  <td className="py-3 px-3 text-gray-500">{w.phone}</td>
                  <td className="text-center py-3 px-3">
                    <span className="inline-flex items-center gap-1"><HiOutlineStar className="w-4 h-4 text-yellow-400 fill-current" />{w.rating}</span>
                  </td>
                  <td className="text-center py-3 px-3">{w.jobs.toLocaleString()}</td>
                  <td className="text-center py-3 px-3">
                    {w.verified ? <HiOutlineCheck className="w-5 h-5 text-green-500 mx-auto" /> : <HiOutlineX className="w-5 h-5 text-red-500 mx-auto" />}
                  </td>
                  <td className="text-center py-3 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      w.status === 'Active' ? 'bg-green-100 text-green-700' :
                      w.status === 'Inactive' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                    }`}>{w.status}</span>
                  </td>
                  <td className="text-center py-3 px-3">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100"><HiOutlinePencil className="w-4 h-4" /></button>
                      <button className="p-1.5 bg-red-50 rounded-lg text-red-600 hover:bg-red-100"><HiOutlineTrash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
