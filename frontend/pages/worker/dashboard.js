import { useState } from 'react';
import Link from 'next/link';
import {
  HiOutlineBriefcase, HiOutlineCurrencyRupee, HiOutlineStar,
  HiOutlineCalendar, HiOutlineBell, HiOutlineCheckCircle,
  HiOutlineClock, HiOutlineUser, HiOutlineLogout,
} from 'react-icons/hi';

const stats = [
  { label: 'Active Bookings', value: '6', icon: HiOutlineBriefcase, color: 'bg-blue-100 text-blue-600' },
  { label: 'Today\'s Earnings', value: '₹2,450', icon: HiOutlineCurrencyRupee, color: 'bg-green-100 text-green-600' },
  { label: 'This Week', value: '₹12,800', icon: HiOutlineCurrencyRupee, color: 'bg-accent-100 text-accent-600' },
  { label: 'Rating', value: '4.8 ★', icon: HiOutlineStar, color: 'bg-yellow-100 text-yellow-600' },
];

const upcomingJobs = [
  { id: '#GS67890', customer: 'Rahul Verma', service: 'Plumber', address: 'Sector 62, Noida', time: '10:00 AM', status: 'Confirmed', amount: '₹199' },
  { id: '#GS67891', customer: 'Anjali Gupta', service: 'Plumber', address: 'Sector 44, Noida', time: '02:00 PM', status: 'Confirmed', amount: '₹199' },
  { id: '#GS67892', customer: 'Deepak Yadav', service: 'Plumber', address: 'MG Road, Gurgaon', time: '05:00 PM', status: 'Pending', amount: '₹199' },
];

const earningsHistory = [
  { date: '2026-07-02', jobs: 3, earnings: '₹597', rating: 5.0 },
  { date: '2026-07-01', jobs: 2, earnings: '₹398', rating: 4.5 },
  { date: '2026-06-30', jobs: 4, earnings: '₹796', rating: 4.8 },
  { date: '2026-06-29', jobs: 1, earnings: '₹199', rating: 5.0 },
  { date: '2026-06-28', jobs: 3, earnings: '₹597', rating: 4.7 },
];

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-500 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                RK
              </div>
              <div>
                <h1 className="text-xl font-bold">Rajesh Kumar</h1>
                <p className="text-primary-200 text-sm">Plumber · ID: WK-4521</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                <HiOutlineBell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-xs flex items-center justify-center">3</span>
              </button>
              <Link href="/worker/profile" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                <HiOutlineUser className="w-5 h-5" />
              </Link>
              <Link href="/worker/login" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                <HiOutlineLogout className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {['dashboard', 'bookings', 'earnings', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 font-medium text-sm border-b-2 transition capitalize ${
                  activeTab === tab ? 'text-accent-500 border-accent-500' : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="card flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{s.label}</div>
                      <div className="text-xl font-bold">{s.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-semibold mb-4">Today&apos;s Schedule</h3>
                <div className="space-y-3">
                  {upcomingJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{job.customer}</div>
                        <div className="text-xs text-gray-400">{job.address}</div>
                        <div className="text-xs text-primary-500 mt-1">{job.service} · {job.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-accent-500">{job.amount}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          job.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>{job.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-4">Recent Earnings</h3>
                <div className="space-y-3">
                  {earningsHistory.slice(0, 4).map((e) => (
                    <div key={e.date} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{e.date}</span>
                      <span className="font-medium">{e.jobs} jobs</span>
                      <span className="text-green-600 font-semibold">{e.earnings}</span>
                      <span className="text-yellow-500">★ {e.rating}</span>
                    </div>
                  ))}
                </div>
                <Link href="/worker/earnings" className="block text-center text-sm text-primary-500 mt-4 hover:underline">
                  View Full History →
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="card">
            <h3 className="font-semibold mb-4">All Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Service</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Address</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Time</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Status</th>
                    <th className="text-center py-3 px-3 font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingJobs.map((job) => (
                    <tr key={job.id} className="border-b border-gray-50">
                      <td className="py-3 px-3 font-medium">{job.id}</td>
                      <td className="py-3 px-3">{job.customer}</td>
                      <td className="py-3 px-3">{job.service}</td>
                      <td className="py-3 px-3 text-gray-500">{job.address}</td>
                      <td className="py-3 px-3">{job.time}</td>
                      <td className="py-3 px-3 font-semibold">{job.amount}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{job.status}</span>
                      </td>
                      <td className="text-center py-3 px-3">
                        <button className="text-sm text-primary-500 hover:underline">Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Earnings History</h3>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total This Month</div>
                <div className="text-2xl font-bold text-accent-500">₹12,800</div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Date</th>
                    <th className="text-center py-3 px-3 font-medium text-gray-500">Jobs Completed</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-500">Earnings</th>
                    <th className="text-center py-3 px-3 font-medium text-gray-500">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsHistory.map((e) => (
                    <tr key={e.date} className="border-b border-gray-50">
                      <td className="py-3 px-3">{e.date}</td>
                      <td className="text-center py-3 px-3">{e.jobs}</td>
                      <td className="text-right py-3 px-3 font-semibold text-green-600">{e.earnings}</td>
                      <td className="text-center py-3 px-3 text-yellow-500">★ {e.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-500 mx-auto mb-3">RK</div>
                <h3 className="text-xl font-bold">Rajesh Kumar</h3>
                <p className="text-gray-500">Plumber · ID: WK-4521</p>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="trust-badge-verified">Verified</span>
                  <span className="trust-badge-ontime">On Time</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" defaultValue="Rajesh Kumar" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" defaultValue="+91 98765 43210" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
                  <input type="text" defaultValue="Delhi, Noida, Gurgaon" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input type="text" defaultValue="8 Years" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                  <textarea rows={3} defaultValue="Expert plumber with 8+ years of experience. Specialized in pipe fitting, water heater installation, and drainage systems." className="input-field"></textarea>
                </div>
                <button className="btn-primary w-full">Update Profile</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
