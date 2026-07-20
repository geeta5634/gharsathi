import api from '@/lib/api';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function apiGet(path, params) {
  try {
    const res = await api.get(path, { params });
    return res.data.data;
  } catch {
    return [];
  }
}

async function apiPost(path, body) {
  try {
    const res = await api.post(path, body);
    return res.data.data;
  } catch {
    return null;
  }
}

export async function getListings() {
  return apiGet('/services');
}

export async function getListing(id) {
  try {
    const res = await api.get(`/services/${id}`);
    return res.data.data;
  } catch {
    return null;
  }
}

export async function createListing(listing) {
  return apiPost('/services', listing);
}

export async function updateListing(id, updates) {
  try {
    const res = await api.put(`/services/${id}`, updates);
    return res.data.data;
  } catch {
    return null;
  }
}

export async function deleteListing(id) {
  try {
    await api.delete(`/services/${id}`);
    return true;
  } catch {
    return false;
  }
}

export async function getUserListings(userId) {
  return [];
}

export async function submitContactMessage(message) {
  try {
    const res = await api.post('/contact', message);
    return res.data.data;
  } catch {
    const errMsg = 'Failed to send message. Please try again.';
    throw new Error(errMsg);
  }
}

export async function getContactMessages() {
  try {
    const res = await api.get('/admin/messages');
    return res.data.data || [];
  } catch {
    return [];
  }
}

export async function markMessageRead(id) {
  try {
    await api.put(`/admin/messages/${id}/read`);
    return true;
  } catch {
    return false;
  }
}

export async function getServices() {
  return apiGet('/services');
}

export async function getTestimonials() {
  return [
    { id: 1, name: 'Ravi Singh', role: 'Homeowner', content: 'GharSathi helped me find a great plumber in minutes!', rating: 5 },
    { id: 2, name: 'Neha Gupta', role: 'Homeowner', content: 'I love how easy it is to book services.', rating: 5 },
    { id: 3, name: 'Arun Mehta', role: 'Homeowner', content: 'Emergency service is a lifesaver!', rating: 4 },
    { id: 4, name: 'Priya Sharma', role: 'Homeowner', content: 'Very reliable platform.', rating: 5 },
    { id: 5, name: 'Amit Patel', role: 'Homeowner', content: 'The trust score system is amazing.', rating: 4 },
    { id: 6, name: 'Sunita Verma', role: 'Homeowner', content: 'My go-to app for all home services.', rating: 5 },
  ];
}

export async function getAllUsers() {
  try {
    const res = await api.get('/admin/users');
    return res.data.data;
  } catch {
    return [];
  }
}

export async function getAllListings() {
  return apiGet('/services');
}
