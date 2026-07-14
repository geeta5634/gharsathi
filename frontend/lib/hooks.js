import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import toast from 'react-hot-toast';

const FALLBACK = {
  adminStats: { workers: 523, customers: 10245, bookings: 24680, revenue: 1875000 },
  workerStats: { totalJobs: 24, earnings: 12500, trustScore: 82, rating: 4.7 },
};

function extract(res, ...keys) {
  let d = res?.data;
  for (const k of keys) { if (d?.[k] !== undefined) { d = d[k]; break; } }
  return d;
}

function fallbackArray(val) { return Array.isArray(val) ? val : []; }

// ─── QUERIES ──────────────────────────────────────────────

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      try { const r = await api.get('/admin/stats'); return r.data.data || r.data || FALLBACK.adminStats; }
      catch { return FALLBACK.adminStats; }
    },
  });
}

export function useAdminBookings() {
  return useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: async () => {
      try { const r = await api.get('/admin/bookings'); return fallbackArray(extract(r, 'data', 'bookings')); }
      catch {
        return [
          { _id: 'ab1', serviceType: 'Plumber', status: 'completed', totalAmount: 299, customer: { name: 'Ravi Singh' }, worker: { name: 'Rajesh K.' }, createdAt: '2024-01-18' },
          { _id: 'ab2', serviceType: 'Electrician', status: 'pending', totalAmount: 179, customer: { name: 'Neha Gupta' }, worker: { name: 'Amit S.' }, createdAt: '2024-01-18' },
          { _id: 'ab3', serviceType: 'House Cleaning', status: 'active', totalAmount: 149, customer: { name: 'Arun M.' }, worker: null, createdAt: '2024-01-17' },
        ];
      }
    },
  });
}

export function useAdminPendingWorkers() {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ['admin', 'workers', 'pending'],
    queryFn: async () => {
      try { const r = await api.get('/admin/workers/pending'); return fallbackArray(extract(r, 'data', 'workers')); }
      catch {
        return [
          { _id: 'pw1', name: 'Mohit Verma', phone: '+91 9876543211', services: ['Plumber'], experience: 3 },
          { _id: 'pw2', name: 'Deepak Yadav', phone: '+91 9123456781', services: ['Electrician'], experience: 5 },
        ];
      }
    },
  });
}

export function useAdminAllWorkers() {
  return useQuery({
    queryKey: ['admin', 'workers'],
    queryFn: async () => {
      try { const r = await api.get('/admin/workers'); return fallbackArray(extract(r, 'data')); }
      catch {
        return [
          { _id: 'aw1', name: 'Rajesh Kumar', phone: '+91 9876543210', services: ['Plumber'], trustScore: 85, rating: 4.7, experience: 5, status: 'approved' },
          { _id: 'aw2', name: 'Amit Sharma', phone: '+91 9123456780', services: ['Electrician'], trustScore: 72, rating: 4.3, experience: 3, status: 'approved' },
          { _id: 'aw3', name: 'Deepak Yadav', phone: '+91 9988776655', services: ['Carpenter'], trustScore: 60, rating: 4.0, experience: 2, status: 'pending' },
        ];
      }
    },
  });
}

export function useAdminCustomers() {
  return useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: async () => {
      try { const r = await api.get('/admin/customers'); return fallbackArray(extract(r, 'data', 'customers')); }
      catch {
        return [
          { _id: 'c1', name: 'Ravi Singh', phone: '+91 9876543210', email: 'ravi@email.com', totalBookings: 12, totalSpent: 2400, createdAt: '2023-06-15' },
          { _id: 'c2', name: 'Neha Gupta', phone: '+91 9123456780', email: 'neha@email.com', totalBookings: 8, totalSpent: 1600, createdAt: '2023-08-20' },
        ];
      }
    },
  });
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try { const r = await api.get('/services'); return fallbackArray(extract(r, 'data')); }
      catch {
        return [
          { _id: 's1', name: 'Plumber', description: 'Pipe fitting, leak repair', basePrice: 199, active: true },
          { _id: 's2', name: 'Electrician', description: 'Wiring, switch repair', basePrice: 179, active: true },
          { _id: 's3', name: 'Carpenter', description: 'Furniture repair, door fitting', basePrice: 249, active: true },
          { _id: 's4', name: 'House Painter', description: 'Interior & exterior painting', basePrice: 299, active: true },
          { _id: 's5', name: 'House Cleaning', description: 'Deep cleaning services', basePrice: 149, active: true },
          { _id: 's6', name: 'Driver / Maid', description: 'Daily driver, part-time maid', basePrice: 399, active: false },
        ];
      }
    },
  });
}

export function useWorkersByService(serviceName) {
  return useQuery({
    queryKey: ['workers', 'service', serviceName],
    queryFn: async () => {
      try { const r = await api.get(`/workers?service=${serviceName}`); return fallbackArray(extract(r, 'data')); }
      catch {
        return [
          { _id: '1', name: 'Rajesh Kumar', trustScore: 85, rating: 4.7, experience: 5, services: [{ name: serviceName }] },
          { _id: '2', name: 'Amit Sharma', trustScore: 72, rating: 4.3, experience: 3, services: [{ name: serviceName }] },
          { _id: '3', name: 'Suresh Patel', trustScore: 91, rating: 4.9, experience: 8, services: [{ name: serviceName }] },
        ];
      }
    },
    enabled: !!serviceName,
  });
}

export function useBookings(params = {}) {
  const queryKey = ['bookings', params];
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const qs = new URLSearchParams(params).toString();
        const r = await api.get(`/bookings${qs ? '?' + qs : ''}`);
        return fallbackArray(extract(r, 'data'));
      } catch {
        return [
          { _id: 'b1', serviceType: 'Plumber', status: 'completed', scheduledDate: '2024-01-15', totalAmount: 199, worker: { name: 'Rajesh Kumar' }, address: '123 MG Road, Mumbai' },
          { _id: 'b2', serviceType: 'Electrician', status: 'pending', scheduledDate: '2024-01-20', totalAmount: 179, worker: { name: 'Amit Sharma' }, address: '45 Nehru Nagar, Delhi' },
        ];
      }
    },
  });
}

export function useBookingsStats() {
  return useQuery({
    queryKey: ['bookings', 'stats'],
    queryFn: async () => {
      try { const r = await api.get('/bookings/stats'); return r.data.data || r.data || {}; }
      catch { return { totalBookings: 0, totalSpent: 0 }; }
    },
  });
}

export function useMembership() {
  return useQuery({
    queryKey: ['membership', 'current'],
    queryFn: async () => {
      try { const r = await api.get('/membership/current'); return r.data.plan || r.data || null; }
      catch { return null; }
    },
  });
}

export function useWorkerStats() {
  return useQuery({
    queryKey: ['worker', 'stats'],
    queryFn: async () => {
      try { const r = await api.get('/workers/dashboard/stats'); return r.data.data || {}; }
      catch { return FALLBACK.workerStats; }
    },
  });
}

export function useWorkerEarnings() {
  return useQuery({
    queryKey: ['worker', 'earnings'],
    queryFn: async () => {
      try {
        const r = await api.get('/workers/dashboard/stats');
        const s = r.data.data || {};
        return {
          total: s.earnings?.total || 36700,
          thisMonth: s.earnings?.thisMonth || 8100,
          lastPayout: s.earnings?.lastPayout || 6500,
        };
      } catch { return { total: 36700, thisMonth: 8100, lastPayout: 6500 }; }
    },
  });
}

export function useWorkerAvailableBookings() {
  return useQuery({
    queryKey: ['bookings', 'available'],
    queryFn: async () => {
      try { const r = await api.get('/bookings/available'); return fallbackArray(extract(r, 'data')); }
      catch {
        return [
          { _id: 'nb1', serviceType: 'Plumber', totalAmount: 199, address: '123 MG Road, Mumbai', scheduledDate: '2024-01-20', scheduledTime: '10:00 AM', description: 'Leaking pipe in bathroom', customer: { name: 'Ravi Singh', phone: '+91 9876543210' } },
          { _id: 'nb2', serviceType: 'Electrician', totalAmount: 279, address: '45 Nehru Nagar, Delhi', scheduledDate: '2024-01-21', scheduledTime: '2:00 PM', description: 'Fan not working', isEmergency: true, customer: { name: 'Neha Gupta', phone: '+91 9123456780' } },
        ];
      }
    },
  });
}

export function useWorkerProfile() {
  return useQuery({
    queryKey: ['worker', 'profile'],
    queryFn: async () => {
      try { const r = await api.get('/worker/profile'); return r.data.worker || r.data; }
      catch { return null; }
    },
  });
}

// ─── MUTATIONS ────────────────────────────────────────────

export function useApproveRejectWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action }) => {
      const r = await api.put(`/admin/workers/${id}/${action}`);
      return r.data;
    },
    onMutate: async ({ id, action }) => {
      await qc.cancelQueries({ queryKey: ['admin', 'workers', 'pending'] });
      const prev = qc.getQueryData(['admin', 'workers', 'pending']);
      qc.setQueryData(['admin', 'workers', 'pending'], old => (old || []).filter(w => w._id !== id));
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) qc.setQueryData(['admin', 'workers', 'pending'], context.prev);
      toast.error('Action failed. Please try again.');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}

export function useWorkerAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action }) => {
      if (action === 'accept') return (await api.put(`/bookings/${id}/accept`)).data;
      if (action === 'reject') return (await api.put(`/bookings/${id}/reject`)).data;
      if (action === 'start') return (await api.put(`/bookings/${id}/start`)).data;
      if (action === 'complete') return (await api.put(`/bookings/${id}/complete`)).data;
      return (await api.put(`/bookings/${id}/status`, { status: action })).data;
    },
    onMutate: async ({ id, action }) => {
      if (action === 'accept' || action === 'reject') {
        await qc.cancelQueries({ queryKey: ['bookings', 'available'] });
        const prev = qc.getQueryData(['bookings', 'available']);
        qc.setQueryData(['bookings', 'available'], old => (old || []).filter(b => b._id !== id));
        return { prev, type: 'available' };
      }
      await qc.cancelQueries({ queryKey: ['bookings'] });
      const prev = qc.getQueryData(['bookings']);
      qc.setQueryData(['bookings'], old => {
        if (!Array.isArray(old)) return old;
        return old.map(b => b._id === id ? { ...b, status: action === 'start' ? 'in_progress' : action === 'complete' ? 'completed' : action } : b);
      });
      return { prev, type: 'bookings' };
    },
    onError: (_err, _vars, context) => {
      if (context?.type === 'available' && context?.prev) {
        qc.setQueryData(['bookings', 'available'], context.prev);
      } else if (context?.type === 'bookings' && context?.prev) {
        qc.setQueryData(['bookings'], context.prev);
      }
      toast.error('Action failed. Please try again.');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const r = await api.post('/bookings', data);
      return r.data.booking || r.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const r = await api.post('/services', data);
      return r.data.service || { ...data, _id: Date.now().toString() };
    },
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: ['services'] });
      const prev = qc.getQueryData(['services']);
      const newItem = { ...data, _id: 'temp-' + Date.now(), active: true };
      qc.setQueryData(['services'], old => [...(old || []), newItem]);
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) qc.setQueryData(['services'], context.prev);
      toast.error('Failed to add service');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      await api.put(`/services/${id}`, data);
      return { id, ...data };
    },
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ['services'] });
      const prev = qc.getQueryData(['services']);
      qc.setQueryData(['services'], old => (old || []).map(s => s._id === id ? { ...s, ...data } : s));
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) qc.setQueryData(['services'], context.prev);
      toast.error('Failed to update service');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useUpdateProfile(role) {
  const qc = useQueryClient();
  const endpoint = role === 'worker' ? '/worker/profile' : '/customer/profile';
  return useMutation({
    mutationFn: async (data) => {
      await api.put(endpoint, data);
      return data;
    },
    onSuccess: () => {
      if (role === 'worker') qc.invalidateQueries({ queryKey: ['worker', 'profile'] });
      toast.success('Profile updated!');
    },
    onError: () => toast.error('Update failed'),
  });
}
