import { useState } from 'react';
import Link from 'next/link';
import {
  HiOutlineUsers, HiOutlineBriefcase, HiOutlineCalendar,
  HiOutlineCurrencyRupee, HiOutlineChartBar, HiOutlineStar,
  HiOutlineTrendingUp, HiOutlineChevronDown,
} from 'react-icons/hi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue 2026',
      data: [45000, 52000, 48000, 58000, 62000, 75000, 82000, 78000, 69000, 85000, 92000, 98000],
      borderColor: '#f97316',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const barData = {
  labels: ['Plumber', 'Electrician', 'Cleaner', 'Maid', 'Driver', 'Carpenter', 'Painter'],
  datasets: [
    {
      label: 'Bookings',
      data: [245, 210, 180, 165, 120, 95, 80],
      backgroundColor: ['#1e40af', '#f97316', '#10b981', '#8b5cf6', '#ef4444', '#14b8a6', '#f59e0b'],
    },
  ],
};

const doughnutData = {
  labels: ['Completed', 'In Progress', 'Pending', 'Cancelled'],
  datasets: [
    {
      data: [65, 20, 10, 5],
      backgroundColor: ['#10b981', '#f97316', '#f59e0b', '#ef4444'],
    },
  ],
};

const stats = [
  { label: 'Total Workers', value: '5,234', change: '+12%', icon: HiOutlineUsers, color: 'bg-blue-100 text-blue-600' },
  { label: 'Total Customers', value: '52,890', change: '+18%', icon: HiOutlineStar, color: 'bg-green-100 text-green-600' },
  { label: 'Total Bookings', value: '1,45,678', change: '+24%', icon: HiOutlineCalendar, color: 'bg-accent-100 text-accent-600' },
  { label: 'Revenue (This Month)', value: '₹98,45,000', change: '+32%', icon: HiOutlineCurrencyRupee, color: 'bg-purple-100 text-purple-600' },
];

const recentBookings = [
  { id: '#GS12345', customer: 'Rahul Verma', worker: 'Rajesh Kumar', service: 'Plumber', amount: '₹199', status: 'Completed', date: '2026-07-02' },
  { id: '#GS12346', customer: 'Anjali Gupta', worker: 'Suresh Patel', service: 'Electrician', amount: '₹199', status: 'In Progress', date: '2026-07-02' },
  { id: '#GS12347', customer: 'Priya Sharma', worker: 'Manoj Verma', service: 'Driver', amount: '₹299', status: 'Pending', date: '2026-07-01' },
  { id: '#GS12348', customer: 'Deepak Yadav', worker: 'Amit Singh', service: 'Carpenter', amount: '₹349', status: 'Completed', date: '2026-07-01' },
  { id: '#GS12349', customer: 'Sunita Gupta', worker: 'Vijay Sharma', service: 'Painter', amount: '₹499', status: 'Cancelled', date: '2026-06-30' },
  { id: '#GS12350', customer: 'Manoj Tiwari', worker: 'Priya Devi', service: 'Maid', amount: '₹399', status: 'Completed', date: '2026-06-30' },
];

const topWorkers = [
  { name: 'Suresh Patel', service: 'Electrician', rating: 4.9, jobs: 2100, revenue: '₹4,82,000' },
  { name: 'Rajesh Kumar', service: 'Plumber', rating: 4.8, jobs: 1250, revenue: '₹2,87,500' },
  { name: 'Manoj Verma', service: 'Driver', rating: 4.8, jobs: 3456, revenue: '₹5,18,400' },
  { name: 'Mohammad Ali', service: 'Carpenter', rating: 4.9, jobs: 2134, revenue: '₹3,20,100' },
  { name: 'Vijay Sharma', service: 'Painter', rating: 4.7, jobs: 1567, revenue: '₹3,91,750' },
];

const lineOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { callback: (v) => '₹' + v.toLocaleString() } } },
};

const barOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } },
};

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('This Year');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-500 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-primary-200 text-sm">Manage workers, customers, bookings & analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white">
                <option value="Today" className="text-gray-800">Today</option>
                <option value="This Week" className="text-gray-800">This Week</option>
                <option value="This Month" className="text-gray-800">This Month</option>
                <option value="This Year" className="text-gray-800">This Year</option>
              </select>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                  <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-xs text-green-600 font-medium">{stat.change}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="card lg:col-span-2">
            <h3 className="font-semibold mb-4">Revenue Overview</h3>
            <Line data={lineData} options={lineOptions} />
          </div>
          <div className="card">
            <h3 className="font-semibold mb-4">Booking Status</h3>
            <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="font-semibold mb-4">Services by Bookings</h3>
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="card">
            <h3 className="font-semibold mb-4">Top Performing Workers</h3>
            <div className="space-y-3">
              {topWorkers.map((w, i) => (
                <div key={w.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{w.name}</div>
                      <div className="text-xs text-gray-400">{w.service} · ★ {w.rating}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{w.jobs.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">{w.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Bookings</h3>
            <div className="flex gap-2">
              <Link href="/admin/bookings" className="text-sm text-primary-500 hover:underline">View All</Link>
              <HiOutlineChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-medium text-gray-500">ID</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Worker</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Service</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium">{b.id}</td>
                    <td className="py-3 px-3">{b.customer}</td>
                    <td className="py-3 px-3">{b.worker}</td>
                    <td className="py-3 px-3">{b.service}</td>
                    <td className="py-3 px-3">{b.amount}</td>
                    <td className="py-3 px-3 text-gray-500">{b.date}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        b.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        b.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        b.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
