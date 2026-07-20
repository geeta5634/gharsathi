import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  requestOTP: (phone) => API.post("/auth/request-otp", { phone }),
  verifyOTP: (phone, code) => API.post("/auth/verify-otp", { phone, code }),
  updateProfile: (data) => API.put("/auth/profile", data),
};

export const servicesAPI = {
  getAll: () => API.get("/services"),
  getOne: (id) => API.get(`/services/${id}`),
  getSlots: (id) => API.get(`/services/${id}/slots`),
};

export const bookingsAPI = {
  create: (data) => API.post("/bookings", data),
  getAll: () => API.get("/bookings"),
  getOne: (id) => API.get(`/bookings/${id}`),
};

export const paymentsAPI = {
  createOrder: (bookingId) => API.post("/payments/create-order", { bookingId }),
  verify: (data) => API.post("/payments/verify", data),
};

export default API;
