import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from './api';

export function useAdminStats() {
  return useQuery({ queryKey: ['admin', 'stats'], queryFn: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data.data;
  }});
}

export function useAdminBookings(params = {}) {
  return useQuery({ queryKey: ['admin', 'bookings', params], queryFn: async () => {
    const res = await api.get('/admin/bookings', { params });
    return res.data.data;
  }});
}

export function useAdminPendingWorkers() {
  return useQuery({ queryKey: ['admin', 'workers', 'pending'], queryFn: async () => {
    const res = await api.get('/admin/workers', { params: { approved: 'false' } });
    return res.data.data;
  }});
}

export function useAdminAllWorkers() {
  return useQuery({ queryKey: ['admin', 'workers'], queryFn: async () => {
    const res = await api.get('/admin/workers');
    return res.data.data;
  }});
}

export function useAdminCustomers() {
  return useQuery({ queryKey: ['admin', 'customers'], queryFn: async () => {
    const res = await api.get('/admin/users', { params: { role: 'customer' } });
    return res.data.data;
  }});
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await api.get('/services');
      return res.data.data;
    },
  });
}

export function useWorkersByService(serviceName) {
  return useQuery({
    queryKey: ['workers', 'service', serviceName],
    queryFn: async () => {
      const params = serviceName ? { service: serviceName } : {};
      const res = await api.get('/workers', { params });
      return res.data.data;
    },
    enabled: !!serviceName,
  });
}

export function useBookings(params = {}) {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: async () => {
      const res = await api.get('/bookings', { params });
      return res.data.data;
    },
  });
}

export function useBookingsStats() {
  return useQuery({
    queryKey: ['bookings', 'stats'],
    queryFn: async () => {
      const res = await api.get('/bookings', { params: { limit: 1 } });
      return { totalBookings: res.data.total || 0, totalSpent: 0 };
    },
  });
}

export function useMembership() {
  return useQuery({
    queryKey: ['membership', 'current'],
    queryFn: async () => {
      const res = await api.get('/memberships/current');
      return res.data.data;
    },
  });
}

export function useWorkerStats() {
  return useQuery({
    queryKey: ['worker', 'stats'],
    queryFn: async () => {
      const res = await api.get('/workers/dashboard/stats');
      return res.data.data;
    },
  });
}

export function useWorkerEarnings() {
  return useQuery({
    queryKey: ['worker', 'earnings'],
    queryFn: async () => {
      const res = await api.get('/workers/dashboard/stats');
      const s = res.data.data;
      return { total: s.earnings?.total || 0, thisMonth: s.earnings?.thisMonth || 0, lastPayout: s.earnings?.lastPayout || 0 };
    },
  });
}

export function useWorkerAvailableBookings() {
  return useQuery({
    queryKey: ['bookings', 'available'],
    queryFn: async () => {
      const res = await api.get('/bookings/available');
      return res.data.data;
    },
  });
}

export function useWorkerProfile() {
  return useQuery({
    queryKey: ['worker', 'profile'],
    queryFn: async () => {
      try {
        const res = await api.get('/workers/dashboard/stats');
        return res.data.data;
      } catch {
        return null;
      }
    },
  });
}

export function useApproveRejectWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action }) => {
      if (action === 'approve') {
        const res = await api.put(`/workers/approve/${id}`);
        return res.data;
      }
      return { id, action };
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['admin'] }),
  });
}

export function useWorkerAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action }) => {
      let endpoint;
      switch (action) {
        case 'accept': endpoint = `/bookings/${id}/accept`; break;
        case 'start': case 'active': endpoint = `/bookings/${id}/start`; break;
        case 'complete': endpoint = `/bookings/${id}/complete`; break;
        case 'cancel': endpoint = `/bookings/${id}/cancel`; break;
        default: throw new Error(`Unknown action: ${action}`);
      }
      const res = await api.put(endpoint);
      return res.data;
    },
    onSuccess: () => toast.success('Booking updated!'),
    onSettled: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const payload = {
        service: data.serviceId,
        address: {
          street: data.address,
          city: data.city || 'City',
          state: data.state || '',
          pincode: data.pincode || '000000',
        },
        description: data.description || '',
        scheduledDate: data.scheduledDate || undefined,
        scheduledTime: data.scheduledTime || undefined,
        isEmergency: data.isEmergency || false,
      };
      const res = await api.post('/bookings', payload);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/services', data);
      return res.data.data;
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/services/${id}`, data);
      return res.data.data;
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useUpdateProfile(role) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (role === 'worker') {
        const res = await api.put('/workers/profile', data);
        return res.data.data;
      }
      return data;
    },
    onSuccess: () => {
      toast.success('Profile updated!');
      qc.invalidateQueries({ queryKey: ['worker', 'profile'] });
    },
    onError: () => toast.error('Update failed'),
  });
}
