import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const FALLBACK = {
  adminStats: { workers: 523, customers: 10245, bookings: 24680, revenue: 1875000 },
  workerStats: { totalJobs: 24, earnings: { total: 36700, thisMonth: 8100, lastPayout: 6500 }, trustScore: 82, rating: 4.7 },
};

export function useAdminStats() {
  return useQuery({ queryKey: ['admin', 'stats'], queryFn: async () => FALLBACK.adminStats });
}

export function useAdminBookings() {
  return useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: async () => [
      { _id: 'ab1', serviceType: 'Plumber', status: 'completed', totalAmount: 299, customer: { name: 'Ravi Singh' }, worker: { name: 'Rajesh K.' }, createdAt: '2024-01-18' },
      { _id: 'ab2', serviceType: 'Electrician', status: 'pending', totalAmount: 179, customer: { name: 'Neha Gupta' }, worker: { name: 'Amit S.' }, createdAt: '2024-01-18' },
      { _id: 'ab3', serviceType: 'House Cleaning', status: 'active', totalAmount: 149, customer: { name: 'Arun M.' }, worker: null, createdAt: '2024-01-17' },
    ],
  });
}

export function useAdminPendingWorkers() {
  return useQuery({
    queryKey: ['admin', 'workers', 'pending'],
    queryFn: async () => [
      { _id: 'pw1', name: 'Mohit Verma', phone: '+91 9876543211', services: ['Plumber'], experience: 3 },
      { _id: 'pw2', name: 'Deepak Yadav', phone: '+91 9123456781', services: ['Electrician'], experience: 5 },
    ],
  });
}

export function useAdminAllWorkers() {
  return useQuery({
    queryKey: ['admin', 'workers'],
    queryFn: async () => [
      { _id: 'aw1', name: 'Rajesh Kumar', phone: '+91 9876543210', services: ['Plumber'], trustScore: 85, rating: 4.7, experience: 5, status: 'approved' },
      { _id: 'aw2', name: 'Amit Sharma', phone: '+91 9123456780', services: ['Electrician'], trustScore: 72, rating: 4.3, experience: 3, status: 'approved' },
    ],
  });
}

export function useAdminCustomers() {
  return useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: async () => [
      { _id: 'c1', name: 'Ravi Singh', phone: '+91 9876543210', email: 'ravi@email.com', totalBookings: 12, totalSpent: 2400, createdAt: '2023-06-15' },
      { _id: 'c2', name: 'Neha Gupta', phone: '+91 9123456780', email: 'neha@email.com', totalBookings: 8, totalSpent: 1600, createdAt: '2023-08-20' },
    ],
  });
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => [
      { _id: 's1', name: 'Plumber', description: 'Pipe fitting, leak repair', basePrice: 199, active: true },
      { _id: 's2', name: 'Electrician', description: 'Wiring, switch repair', basePrice: 179, active: true },
      { _id: 's3', name: 'Carpenter', description: 'Furniture repair, door fitting', basePrice: 249, active: true },
      { _id: 's4', name: 'House Painter', description: 'Interior & exterior painting', basePrice: 299, active: true },
      { _id: 's5', name: 'House Cleaning', description: 'Deep cleaning services', basePrice: 149, active: true },
      { _id: 's6', name: 'Driver / Maid', description: 'Daily driver, part-time maid', basePrice: 399, active: false },
    ],
  });
}

export function useWorkersByService(serviceName) {
  return useQuery({
    queryKey: ['workers', 'service', serviceName],
    queryFn: async () => [
      { _id: '1', name: 'Rajesh Kumar', trustScore: 85, rating: 4.7, experience: 5, services: [{ name: serviceName }] },
      { _id: '2', name: 'Amit Sharma', trustScore: 72, rating: 4.3, experience: 3, services: [{ name: serviceName }] },
      { _id: '3', name: 'Suresh Patel', trustScore: 91, rating: 4.9, experience: 8, services: [{ name: serviceName }] },
    ],
    enabled: !!serviceName,
  });
}

export function useBookings(params = {}) {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: async () => [
      { _id: 'b1', serviceType: 'Plumber', status: 'completed', scheduledDate: '2024-01-15', totalAmount: 199, worker: { name: 'Rajesh Kumar' }, address: '123 MG Road, Mumbai', customer: { name: 'Ravi Singh', phone: '+91 9876543210' } },
      { _id: 'b2', serviceType: 'Electrician', status: 'pending', scheduledDate: '2024-01-20', totalAmount: 179, worker: { name: 'Amit Sharma' }, address: '45 Nehru Nagar, Delhi', customer: { name: 'Neha Gupta' } },
    ],
  });
}

export function useBookingsStats() {
  return useQuery({ queryKey: ['bookings', 'stats'], queryFn: async () => ({ totalBookings: 0, totalSpent: 0 }) });
}

export function useMembership() {
  return useQuery({ queryKey: ['membership', 'current'], queryFn: async () => null });
}

export function useWorkerStats() {
  return useQuery({ queryKey: ['worker', 'stats'], queryFn: async () => FALLBACK.workerStats });
}

export function useWorkerEarnings() {
  return useQuery({ queryKey: ['worker', 'earnings'], queryFn: async () => ({ total: 36700, thisMonth: 8100, lastPayout: 6500 }) });
}

export function useWorkerAvailableBookings() {
  return useQuery({
    queryKey: ['bookings', 'available'],
    queryFn: async () => [
      { _id: 'nb1', serviceType: 'Plumber', totalAmount: 199, address: '123 MG Road, Mumbai', scheduledDate: '2024-01-20', scheduledTime: '10:00 AM', description: 'Leaking pipe in bathroom', customer: { name: 'Ravi Singh', phone: '+91 9876543210' } },
      { _id: 'nb2', serviceType: 'Electrician', totalAmount: 279, address: '45 Nehru Nagar, Delhi', scheduledDate: '2024-01-21', scheduledTime: '2:00 PM', description: 'Fan not working', isEmergency: true, customer: { name: 'Neha Gupta', phone: '+91 9123456780' } },
    ],
  });
}

export function useWorkerProfile() {
  return useQuery({ queryKey: ['worker', 'profile'], queryFn: async () => null });
}

export function useApproveRejectWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action }) => ({ id, action }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['admin'] }),
  });
}

export function useWorkerAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action }) => ({ id, action }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => ({ ...data, _id: 'b' + Date.now() }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => ({ ...data, _id: Date.now().toString() }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => ({ id, ...data }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useUpdateProfile(role) {
  return useMutation({
    mutationFn: async (data) => data,
    onSuccess: () => toast.success('Profile updated!'),
    onError: () => toast.error('Update failed'),
  });
}
